import { useMemo, useState } from 'react';
import Segmented from '../../components/ui/Segmented';
import Skeleton from '../../components/ui/Skeleton';
import ListRow from '../../components/ui/ListRow';
import DateGroups from '../../components/ui/DateGroups';
import Fab from '../../components/layout/Fab';
import { JENIS_TRANSAKSI } from '../../config/pages';
import { useInventory } from '../../context/InventoryContext';
import { useConfirm } from '../../context/ConfirmContext';
import { useToast } from '../../context/ToastContext';
import { friendly } from '../../lib/errors';
import { fmt } from '../../lib/format';
import * as transaksiService from '../../services/transaksiService';
import TransaksiForm from './TransaksiForm';

const OPTIONS = Object.entries(JENIS_TRANSAKSI).map(([value, label]) => ({ value, label }));

export default function TransaksiPage() {
  const { trx, loading, reload, namaBarang } = useInventory();
  const confirm = useConfirm();
  const toast = useToast();
  const [jenis, setJenis] = useState('JUAL');
  const [formOpen, setFormOpen] = useState(false);

  const rows = useMemo(() => trx.filter((t) => t.jenis === jenis), [trx, jenis]);

  const hapus = async (t) => {
    if (!(await confirm('Hapus transaksi ini? Stok akan dihitung ulang.', 'Hapus'))) return;
    try {
      await transaksiService.remove(t.id);
      toast('Terhapus');
      reload(true);
    } catch (e) {
      toast(friendly(e), true);
    }
  };

  return (
    <>
      <Segmented options={OPTIONS} value={jenis} onChange={setJenis} />
      {loading ? (
        <Skeleton />
      ) : (
        <DateGroups
          rows={rows}
          empty={<>Belum ada data.<br />Ketuk + untuk menambah.</>}
          renderRow={(t) => (
            <ListRow
              key={t.id}
              title={namaBarang(t.kode)}
              subtitle={t.kode + (t.keterangan ? ' · ' + t.keterangan : '')}
              value={(t.jenis === 'MASUK' ? '+' : '−') + fmt(t.qty)}
              tone={t.jenis === 'MASUK' ? 'pos' : 'neg'}
              onDelete={() => hapus(t)}
            />
          )}
        />
      )}
      <Fab onClick={() => setFormOpen(true)} />
      {formOpen && <TransaksiForm jenis={jenis} onClose={() => setFormOpen(false)} />}
    </>
  );
}
