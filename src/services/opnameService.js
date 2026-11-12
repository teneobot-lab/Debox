import { supabase } from '../lib/supabase';
import { unwrap } from '../lib/errors';

export const list = async () =>
  unwrap(
    await supabase
      .from('opname')
      .select('*')
      .order('tanggal', { ascending: false })
      .order('id', { ascending: false })
      .limit(300)
  );

/** Simpan opname sekaligus (opsional) membuat transaksi penyesuaian, atomik di database. */
export const simpan = async ({ tanggal, kode, fisik, keterangan, sesuaikan }) =>
  unwrap(
    await supabase.rpc('simpan_opname', {
      p_tanggal: tanggal,
      p_kode: kode,
      p_fisik: fisik,
      p_ket: keterangan,
      p_sesuaikan: sesuaikan,
    })
  );

export const remove = async (id) => unwrap(await supabase.from('opname').delete().eq('id', id));
