import { supabase } from '../lib/supabase';
import { unwrap } from '../lib/errors';

export const list = async () =>
  unwrap(
    await supabase
      .from('transaksi')
      .select('*')
      .order('tanggal', { ascending: false })
      .order('id', { ascending: false })
      .limit(500)
  );

/** jenis: MASUK | JUAL | REJECT */
export const create = async ({ tanggal, kode, jenis, qty, keterangan }) =>
  unwrap(await supabase.from('transaksi').insert({ tanggal, kode, jenis, qty, keterangan }));

export const remove = async (id) => unwrap(await supabase.from('transaksi').delete().eq('id', id));
