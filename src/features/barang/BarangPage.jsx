import { useState } from 'react';
import Empty from '../../components/ui/Empty';
import Skeleton from '../../components/ui/Skeleton';
import Fab from '../../components/layout/Fab';
import { useInventory } from '../../context/InventoryContext';
import { useConfirm } from '../../context/ConfirmContext';
import { useToast } from '../../context/ToastContext';
import { friendly } from '../../lib/errors';
import * as barangService from '../../services/barangService';
import BarangItem from './BarangItem';
import BarangForm from './BarangForm';

export default function BarangPage() {
  const { stok, loading, reload } = useInventory();
  const confirm = useConfirm();
  const toast = useToast();
  const [form, setForm] = useState(null); // null = tertutup, {} = tambah, {item} = edit

  const hapus = async (item) => {
    if (!(await confirm(`Hapus barang ${item.kode}?`, 'Hapus'))) return;
    try {
      await barangService.remove(item.kode);
      toast('Terhapus');
      reload(true);
    } catch (e) {
      toast(friendly(e), true);
    }
  };

  if (loading) return <Skeleton />;

  return (
    <>
      <div className="list">
        {stok.map((b) => (
          <BarangItem key={b.kode} item={b} onEdit={() => setForm({ item: b })} onDelete={() => hapus(b)} />
        ))}
        {!stok.length && (
          <Empty>
            Belum ada barang.
            <br />
            Ketuk + untuk menambah.
          </Empty>
        )}
      </div>
      <Fab onClick={() => setForm({})} />
      {form && <BarangForm item={form.item} onClose={() => setForm(null)} />}
    </>
  );
}
