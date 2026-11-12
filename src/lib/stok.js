/** Status stok untuk badge dan filter. key: ok | low | out */
export function statusStok(r) {
  const s = Number(r.stok_sistem);
  if (s < 0) return { label: 'Minus', tone: 'bad', key: 'out' };
  if (s === 0) return { label: 'Habis', tone: 'bad', key: 'out' };
  if (Number(r.stok_min) > 0 && s <= Number(r.stok_min)) return { label: 'Menipis', tone: 'warn', key: 'low' };
  return { label: 'Aman', tone: 'ok', key: 'ok' };
}
