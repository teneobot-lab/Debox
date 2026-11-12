import { fmt } from '../../lib/format';
import { statusStok } from '../../lib/stok';

export default function StatsRow({ stok }) {
  const total = stok.reduce((a, r) => a + Number(r.stok_sistem), 0);
  const menipis = stok.filter((r) => statusStok(r).key === 'low').length;
  const habis = stok.filter((r) => statusStok(r).key === 'out').length;

  const stats = [
    ['Item', stok.length],
    ['Total stok', total],
    ['Menipis', menipis],
    ['Habis', habis],
  ];

  return (
    <div className="stats">
      {stats.map(([label, value]) => (
        <div className="card stat" key={label}>
          <span>{label}</span>
          <b>{fmt(value)}</b>
        </div>
      ))}
    </div>
  );
}
