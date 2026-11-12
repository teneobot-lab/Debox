import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as barangService from '../services/barangService';
import * as transaksiService from '../services/transaksiService';
import * as opnameService from '../services/opnameService';
import { friendly } from '../lib/errors';
import { useToast } from './ToastContext';

const InventoryContext = createContext(null);

/** Menyimpan data utama (stok per barang, transaksi, opname) yang dipakai banyak halaman. */
export function InventoryProvider({ children }) {
  const toast = useToast();
  const [stok, setStok] = useState([]);
  const [trx, setTrx] = useState([]);
  const [opname, setOpname] = useState([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(
    async (silent = false) => {
      if (!silent) setLoading(true);
      try {
        const [a, b, c] = await Promise.all([barangService.list(), transaksiService.list(), opnameService.list()]);
        setStok(a || []);
        setTrx(b || []);
        setOpname(c || []);
      } catch (e) {
        toast('Gagal memuat: ' + friendly(e), true);
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  useEffect(() => {
    reload();
  }, [reload]);

  const value = useMemo(() => {
    const byKode = new Map(stok.map((b) => [b.kode, b]));
    return { stok, trx, opname, loading, reload, namaBarang: (k) => byKode.get(k)?.nama || k };
  }, [stok, trx, opname, loading, reload]);

  return <InventoryContext.Provider value={value}>{children}</InventoryContext.Provider>;
}

export const useInventory = () => useContext(InventoryContext);
