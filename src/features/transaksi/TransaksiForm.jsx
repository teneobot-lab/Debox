import { useState } from 'react';
import Sheet from '../../components/ui/Sheet';
import Button from '../../components/ui/Button';
import Field from '../../components/ui/Field';
import Stepper from '../../components/ui/Stepper';
import ItemPicker from '../../components/ui/ItemPicker';
import { JENIS_TRANSAKSI } from '../../config/pages';
import { useInventory } from '../../context/InventoryContext';
import { useConfirm } from '../../context/ConfirmContext';
import { useToast } from '../../context/ToastContext';
import { useSubmit } from '../../hooks/useSubmit';
import { fmt, num, today } from '../../lib/format';
import * as transaksiService from '../../services/transaksiService';

/** jenis: MASUK | JUAL | REJECT */
export default function TransaksiForm({ jenis, onClose }) {
  const { stok, reload } = useInventory();
  const confirm = useConfirm();
  const toast = useToast();
  const { busy, run } = useSubmit();

  const [barang, setBarang] = useState(null);
  const [tanggal, setTanggal] = useState(today());
  const [qty, setQty] = useState('');
  const [ket, setKet] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!barang) return toast('Pilih barang dulu', true);
    const jumlah = num(qty);
    if (!(jumlah > 0)) return toast('Jumlah harus lebih dari 0', true);

    if (jenis !== 'MASUK' && jumlah > Number(barang.stok_sistem)) {
      const lanjut = await confirm(`Jumlah (${fmt(jumlah)}) melebihi stok sistem (${fmt(barang.stok_sistem)}). Lanjutkan?`);
      if (!lanjut) return;
    }

    const ok = await run(() => transaksiService.create({ tanggal, kode: barang.kode, jenis, qty: jumlah, keterangan: ket }));
    if (ok) {
      toast('Tersimpan ✔');
      onClose();
      reload(true);
    }
  };

  return (
    <Sheet title={JENIS_TRANSAKSI[jenis]} onClose={onClose}>
      <form onSubmit={onSubmit}>
        <ItemPicker items={stok} value={barang} onChange={setBarang} />
        <div className="g2">
          <Field label="Tanggal">
            <input type="date" value={tanggal} onChange={(e) => setTanggal(e.target.value)} required />
          </Field>
          <Field label="Jumlah">
            <Stepper value={qty} onChange={setQty} required />
          </Field>
        </div>
        <label>Keterangan (opsional)</label>
        <input value={ket} onChange={(e) => setKet(e.target.value)} autoComplete="off" />
        <Button className="mt" type="submit" loading={busy}>Simpan</Button>
      </form>
    </Sheet>
  );
}
