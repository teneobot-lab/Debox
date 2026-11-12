import { useState } from 'react';
import Button from '../../components/ui/Button';
import { fmt } from '../../lib/format';

export default function BarangItem({ item, onEdit, onDelete }) {
  const [open, setOpen] = useState(false);

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
          <small>Stok awal</small>
          <b className="b-md">
            {fmt(item.stok_awal)} {item.satuan}
          </b>
        </div>
      </div>
      {open && (
        <div className="detail cols-2" onClick={(e) => e.stopPropagation()}>
          <div>
            Batas menipis<b>{fmt(item.stok_min)}</b>
          </div>
          <div>
            Satuan<b>{item.satuan}</b>
          </div>
          <Button variant="sec" size="sm" onClick={onEdit}>Edit</Button>
          <Button variant="del" size="sm" onClick={onDelete}>Hapus</Button>
        </div>
      )}
    </div>
  );
}
