import { useMemo, useState } from 'react';
import Chips from '../../components/ui/Chips';
import Empty from '../../components/ui/Empty';
import Skeleton from '../../components/ui/Skeleton';
import { useInventory } from '../../context/InventoryContext';
import { statusStok } from '../../lib/stok';
import StatsRow from './StatsRow';
import StokItem from './StokItem';

const FILTERS = [
  { value: 'all', label: 'Semua' },
  { value: 'low', label: 'Menipis' },
  { value: 'out', label: 'Habis' },
];

export default function StokPage() {
  const { stok, loading } = useInventory();
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState('all');

  const rows = useMemo(() => {
    const s = q.trim().toLowerCase();
    return stok.filter((r) => {
      if (filter !== 'all' && statusStok(r).key !== filter) return false;
      return !s || `${r.kode} ${r.nama} ${r.kategori}`.toLowerCase().includes(s);
    });
  }, [stok, q, filter]);

  if (loading) return <Skeleton />;

  return (
    <>
      <StatsRow stok={stok} />
      <input className="search" placeholder="Cari kode / nama / kategori…" value={q} onChange={(e) => setQ(e.target.value)} autoComplete="off" />
      <Chips options={FILTERS} value={filter} onChange={setFilter} />
      <div className="list">
        {rows.map((r) => (
          <StokItem key={r.kode} item={r} />
        ))}
        {!rows.length && (
          <Empty>
            {stok.length ? (
              'Tidak ada hasil'
            ) : (
              <>
                Belum ada barang.
                <br />
                Buka menu Barang lalu ketuk +
              </>
            )}
          </Empty>
        )}
      </div>
    </>
  );
}
