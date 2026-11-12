import { supabase } from '../lib/supabase';
import { unwrap } from '../lib/errors';

/** Daftar barang beserta stok sistem (view v_stok). */
export const list = async () => unwrap(await supabase.from('v_stok').select('*').order('nama'));

export const create = async (row) => unwrap(await supabase.from('barang').insert(row));

export const update = async (kode, row) => unwrap(await supabase.from('barang').update(row).eq('kode', kode));

export const remove = async (kode) => unwrap(await supabase.from('barang').delete().eq('kode', kode));
