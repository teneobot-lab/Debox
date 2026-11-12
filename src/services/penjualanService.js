import { supabase } from '../lib/supabase';
import { unwrap } from '../lib/errors';

/** Jumlah item terjual per barang pada rentang tanggal. */
export const rekap = async (dari, sampai) =>
  unwrap(await supabase.rpc('rekap_penjualan', { p_dari: dari, p_sampai: sampai }));
