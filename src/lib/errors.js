export function friendly(e) {
  if (e?.code === '23505') return 'Kode sudah dipakai';
  if (e?.code === '23503') return 'Barang sudah punya transaksi/opname, tidak bisa dihapus';
  return e?.message || String(e);
}

/** Lempar error Supabase, atau kembalikan datanya. */
export function unwrap({ data, error }) {
  if (error) throw error;
  return data;
}
