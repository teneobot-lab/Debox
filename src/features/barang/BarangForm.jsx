import { useState } from 'react';
import Sheet from '../../components/ui/Sheet';
import Button from '../../components/ui/Button';
import Field from '../../components/ui/Field';
import { useInventory } from '../../context/InventoryContext';
import { useToast } from '../../context/ToastContext';
import { useSubmit } from '../../hooks/useSubmit';
import { num } from '../../lib/format';
import * as barangService from '../../services/barangService';

/** `item` kosong = tambah baru, berisi = edit. */
export default function BarangForm({ item, onClose }) {
  const { reload } = useInventory();
  const toast = useToast();
  const { busy, run } = useSubmit();
  const editing = Boolean(item);

  const [f, setF] = useState({
    kode: item?.kode ?? '',
    nama: item?.nama ?? '',
    kategori: item?.kategori ?? '',
    satuan: item?.satuan ?? 'pcs',
    stok_awal: String(item?.stok_awal ?? 0),
    stok_min: String(item?.stok_min ?? 0),
  });
  const set = (k) => (e) => setF((p) => ({ ...p, [k]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    const row = {
      kode: f.kode.trim(),
      nama: f.nama.trim(),
      kategori: f.kategori.trim(),
      satuan: f.satuan.trim() || 'pcs',
      stok_awal: num(f.stok_awal) || 0,
      stok_min: num(f.stok_min) || 0,
    };
    const ok = await run(() => (editing ? barangService.update(item.kode, row) : barangService.create(row)));
    if (ok) {
      toast('Tersimpan ✔');
      onClose();
      reload(true);
    }
  };

  return (
    <Sheet title={editing ? 'Edit Barang' : 'Tambah Barang'} onClose={onClose}>
      <form onSubmit={onSubmit}>
        <label>Kode *</label>
        <input value={f.kode} onChange={set('kode')} readOnly={editing} required autoComplete="off" />
        <label>Nama *</label>
        <input value={f.nama} onChange={set('nama')} required autoComplete="off" />
        <div className="g2">
          <Field label="Kategori"><input value={f.kategori} onChange={set('kategori')} /></Field>
          <Field label="Satuan"><input value={f.satuan} onChange={set('satuan')} /></Field>
        </div>
        <div className="g2">
          <Field label="Stok awal"><input inputMode="decimal" value={f.stok_awal} onChange={set('stok_awal')} /></Field>
          <Field label="Batas menipis"><input inputMode="decimal" value={f.stok_min} onChange={set('stok_min')} /></Field>
        </div>
        <Button className="mt" type="submit" loading={busy}>Simpan</Button>
      </form>
    </Sheet>
  );
}
