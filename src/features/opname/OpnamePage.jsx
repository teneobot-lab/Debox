import { useState } from 'react';
import Skeleton from '../../components/ui/Skeleton';
import ListRow from '../../components/ui/ListRow';
import DateGroups from '../../components/ui/DateGroups';
import Fab from '../../components/layout/Fab';
import { useInventory } from '../../context/InventoryContext';
import { useConfirm } from '../../context/ConfirmContext';
import { useToast } from '../../context/ToastContext';
import { friendly } from '../../lib/errors';
import { fmt, signed } from '../../lib/format';
import * as opnameService from '../../services/opnameService';
import OpnameForm from './OpnameForm';

export default function OpnamePage() {
  const { opname, loading, reload, namaBarang } = useInventory();
  const confirm = useConfirm();
  const toast = useToast();
  const [formOpen, setFormOpen] = useState(false);

  const hapus = async (o) => {
    if (!(await confirm('Hapus data opname ini? (Penyesuaian stok yang sudah terbuat tidak ikut terhapus)', 'Hapus'))) return;
    try {
      await opnameService.remove(o.id);
      toast('Terhapus');
      reload(true);
    } catch (e) {
      toast(friendly(e), true);
    }
  };

  if (loading) return <Skeleton />;

  return (
    <>
      <DateGroups
        rows={opname}
        empty={<>Belum ada data.<br />Ketuk + untuk menambah.</>}
        renderRow={(o) => {
          const s = Number(o.selisih);
          return (
            <ListRow
              key={o.id}
              title={namaBarang(o.kode)}
              subtitle={`Sistem ${fmt(o.stok_sistem)} → Fisik ${fmt(o.stok_fisik)}` + (o.keterangan ? ' · ' + o.keterangan : '')}
              value={signed(s)}
              tone={s > 0 ? 'pos' : s < 0 ? 'neg' : 'zero'}
              onDelete={() => hapus(o)}
            />
          );
        }}
      />
      <Fab onClick={() => setFormOpen(true)} />
      {formOpen && <OpnameForm onClose={() => setFormOpen(false)} />}
    </>
  );
}
