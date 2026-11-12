import Empty from './Empty';
import { dateLabel } from '../../lib/format';

/** Kelompokkan baris berurutan per tanggal (Hari ini, Kemarin, ...). renderRow harus memberi `key`. */
export default function DateGroups({ rows, renderRow, empty }) {
  if (!rows.length) return <Empty>{empty}</Empty>;

  const groups = [];
  rows.forEach((r) => {
    const last = groups[groups.length - 1];
    if (last && last.tanggal === r.tanggal) last.rows.push(r);
    else groups.push({ tanggal: r.tanggal, rows: [r] });
  });

  return groups.map((g) => (
    <section key={g.tanggal}>
      <div className="group">{dateLabel(g.tanggal)}</div>
      <div className="card">{g.rows.map(renderRow)}</div>
    </section>
  ));
}
