import { useState } from 'react';
import { useToast } from '../context/ToastContext';
import { friendly } from '../lib/errors';

/** Bungkus aksi async: status loading, cegah klik ganda, dan tampilkan error sebagai toast. */
export function useSubmit() {
  const toast = useToast();
  const [busy, setBusy] = useState(false);

  const run = async (fn) => {
    if (busy) return false;
    setBusy(true);
    try {
      await fn();
      return true;
    } catch (e) {
      toast(friendly(e), true);
      return false;
    } finally {
      setBusy(false);
    }
  };

  return { busy, run };
}
