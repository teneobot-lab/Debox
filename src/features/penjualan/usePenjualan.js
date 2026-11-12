import { useEffect, useState } from 'react';
import { useInventory } from '../../context/InventoryContext';
import { useToast } from '../../context/ToastContext';
import { friendly } from '../../lib/errors';
import { today, ymd } from '../../lib/format';
import * as penjualanService from '../../services/penjualanService';

export const PRESETS = [
  { value: 'today', label: 'Hari ini' },
  { value: '7', label: '7 hari' },
  { value: '30', label: '30 hari' },
  { value: 'month', label: 'Bulan ini' },
];

function rangeOf(preset) {
  const sampai = today();
  if (preset === 'today') return { dari: sampai, sampai };
  if (preset === '30') return { dari: ymd(-29), sampai };
  if (preset === 'month') return { dari: sampai.slice(0, 8) + '01', sampai };
  return { dari: ymd(-6), sampai }; // '7'
}

/** Rekap jumlah item terjual untuk rentang tanggal, otomatis dimuat ulang saat transaksi berubah. */
export function usePenjualan() {
  const { trx } = useInventory();
  const toast = useToast();
  const [preset, setPreset] = useState('7');
  const [range, setRange] = useState(rangeOf('7'));
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!range.dari || !range.sampai) return;
    let alive = true;
    setLoading(true);
    penjualanService
      .rekap(range.dari, range.sampai)
      .then((d) => alive && setRows(d || []))
      .catch((e) => alive && toast(friendly(e), true))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [range.dari, range.sampai, trx, toast]);

  const choosePreset = (p) => {
    setPreset(p);
    setRange(rangeOf(p));
  };

  const setDates = (dari, sampai) => {
    setPreset('');
    setRange({ dari, sampai });
  };

  return { preset, range, rows, loading, choosePreset, setDates };
}
