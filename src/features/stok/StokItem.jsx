import { useState } from 'react';
import Badge from '../../components/ui/Badge';
import { fmt } from '../../lib/format';
import { statusStok } from '../../lib/stok';

export default function StokItem({ item }) {
  const [open, setOpen] = useState(false);
  const st = statusStok(item);

  const detail = [
    ['Stok awal', item.stok_awal],
    ['Masuk', item.masuk],
    ['Terjual', item.jual],
    ['Reject', item.reject],
    ['Penyesuaian', item.adj],
    ['Batas menipis', item.stok_min],
  ];

  return (
    <div className={'card item' + (open ? ' open' : '')} onClick={() => setOpen((o) => !o)}>
      <div className="top">
        <div>
          <div className="nm">{item.nama}</div>
          <small>
            {item.kode}
            {item.kategori ? ' · ' + item.kategori : ''}
          </small>
        </div>
        <div className="qty">
          <b>{fmt(item.stok_sistem)}</b>
          <small>{item.satuan}</small>
          <Badge tone={st.tone}>{st.label}</Badge>
        </div>
      </div>
      {open && (
        <div className="detail">
          {detail.map(([label, value]) => (
            <div key={label}>
              {label}
              <b>{fmt(value)}</b>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
