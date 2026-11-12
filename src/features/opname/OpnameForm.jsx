import { useState } from 'react';
import Sheet from '../../components/ui/Sheet';
import Button from '../../components/ui/Button';
import Field from '../../components/ui/Field';
import Stepper from '../../components/ui/Stepper';
import ItemPicker from '../../components/ui/ItemPicker';
import { useInventory } from '../../context/InventoryContext';
import { useToast } from '../../context/ToastContext';
import { useSubmit } from '../../hooks/useSubmit';
import { num, signed, today } from '../../lib/format';
import * as opnameService from '../../services/opnameService';

export default function OpnameForm({ onClose }) {
  const { stok, reload } = useInventory();
  const toast = useToast();
  const { busy, run } = useSubmit();

  const [barang, setBarang] = useState(null);
  const [tanggal, setTanggal] = useState(today());
  const [fisik, setFisik] = useState('');
  const [ket, setKet] = useState('');
  const [sesuaikan, setSesuaikan] = useState(true);

  const selisih = barang && fisik !== '' ? num(fisik) - Number(barang.stok_sistem) : null;
  const tone = selisih > 0 ? ' pos' : selisih < 0 ? ' neg' : '';

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!barang) return toast('Pilih barang dulu', true);
    const nilai = num(fisik);
    if (isNaN(nilai) || nilai < 0) return toast('Stok fisik tidak valid', true);

    const ok = await run(() => opnameService.simpan({ tanggal, kode: barang.kode, fisik: nilai, keterangan: ket, sesuaikan }));
    if (ok) {
      toast('Tersimpan ✔');
      onClose();
      reload(true);
    }
  };

  return (
    <Sheet title="Input Stok Fisik" onClose={onClose}>
      <form onSubmit={onSubmit}>
        <ItemPicker items={stok} value={barang} onChange={setBarang} />
        <div className="g2">
          <Field label="Tanggal">
            <input type="date" value={tanggal} onChange={(e) => setTanggal(e.target.value)} required />
          </Field>
          <Field label="Stok fisik">
            <Stepper value={fisik} onChange={setFisik} required />
          </Field>
        </div>
        <div className={'selisih' + tone}>{selisih === null ? 'Selisih: —' : 'Selisih: ' + signed(selisih)}</div>
        <label>Keterangan (opsional)</label>
        <input value={ket} onChange={(e) => setKet(e.target.value)} autoComplete="off" />
        <label className="chk">
          <input type="checkbox" checked={sesuaikan} onChange={(e) => setSesuaikan(e.target.checked)} />
          <span>Sesuaikan stok sistem agar sama dengan stok fisik</span>
        </label>
        <Button className="mt" type="submit" loading={busy}>Simpan</Button>
      </form>
    </Sheet>
  );
}
