const nf = new Intl.NumberFormat('id-ID', { maximumFractionDigits: 2 });

export const fmt = (n) => nf.format(Number(n) || 0);

/** Ubah input teks (boleh koma desimal) menjadi angka. */
export const num = (v) => Number(String(v ?? '').replace(',', '.'));

/** Tanggal lokal format YYYY-MM-DD, dengan offset hari. */
export function ymd(offset = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
}

export const today = () => ymd(0);

export function dateLabel(d) {
  if (d === today()) return 'Hari ini';
  if (d === ymd(-1)) return 'Kemarin';
  return new Date(d + 'T00:00:00').toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export const signed = (n) => (Number(n) > 0 ? '+' : '') + fmt(n);
