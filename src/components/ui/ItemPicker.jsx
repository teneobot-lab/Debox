import { useMemo, useState } from 'react';
import Empty from './Empty';
import Button from './Button';
import { fmt } from '../../lib/format';

/** Pilih barang dengan pencarian. `value` adalah objek barang (baris v_stok) atau null. */
export default function ItemPicker({ items, value, onChange }) {
  const [q, setQ] = useState('');

  const matches = useMemo(() => {
    const s = q.trim().toLowerCase();
    return items.filter((b) => !s || `${b.kode} ${b.nama}`.toLowerCase().includes(s)).slice(0, 6);
  }, [items, q]);

  if (value) {
    return (
      <>
        <label>Barang</label>
        <div className="picked">
          <div>
            <b>{value.nama}</b>
            <small>{value.kode}</small>
          </div>
          <div className="r">
            Stok sistem
            <b>
              {fmt(value.stok_sistem)} {value.satuan}
            </b>
          </div>
          <Button type="button" variant="sec" size="sm" onClick={() => onChange(null)}>Ganti</Button>
        </div>
      </>
    );
  }

  return (
    <>
      <label>Barang</label>
      <input placeholder="Cari kode / nama…" value={q} onChange={(e) => setQ(e.target.value)} autoComplete="off" />
      <div className="pklist">
        {matches.map((b) => (
          <button key={b.kode} type="button" className="pkitem" onClick={() => onChange(b)}>
            <b>{b.nama}</b>
            <small>
              {b.kode} · stok {fmt(b.stok_sistem)} {b.satuan}
            </small>
          </button>
        ))}
        {!matches.length && <Empty small>Tidak ditemukan</Empty>}
      </div>
    </>
  );
}
