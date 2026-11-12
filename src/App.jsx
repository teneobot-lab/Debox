import { useState } from 'react';
import { ToastProvider } from './context/ToastContext';
import { ConfirmProvider } from './context/ConfirmContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { InventoryProvider, useInventory } from './context/InventoryContext';
import { PAGES } from './config/pages';
import Header from './components/layout/Header';
import BottomNav from './components/layout/BottomNav';
import Skeleton from './components/ui/Skeleton';
import LoginPage from './features/auth/LoginPage';
import StokPage from './features/stok/StokPage';
import TransaksiPage from './features/transaksi/TransaksiPage';
import PenjualanPage from './features/penjualan/PenjualanPage';
import OpnamePage from './features/opname/OpnamePage';
import BarangPage from './features/barang/BarangPage';

const COMPONENTS = {
  stok: StokPage,
  transaksi: TransaksiPage,
  penjualan: PenjualanPage,
  opname: OpnamePage,
  barang: BarangPage,
};

function Shell() {
  const [page, setPage] = useState('stok');
  const { reload } = useInventory();
  const { signOut } = useAuth();
  const Page = COMPONENTS[page];
  const title = PAGES.find((p) => p.key === page).title;

  const go = (key) => {
    setPage(key);
    window.scrollTo(0, 0);
  };

  return (
    <>
      <Header title={title} onRefresh={() => reload()} onLogout={signOut} />
      <main className="main">
        <Page />
      </main>
      <BottomNav page={page} onChange={go} />
    </>
  );
}

function Gate() {
  const { session, loading } = useAuth();
  if (loading) return <main className="main"><Skeleton /></main>;
  if (!session) return <LoginPage />;
  return (
    <InventoryProvider>
      <Shell />
    </InventoryProvider>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <ConfirmProvider>
        <AuthProvider>
          <Gate />
        </AuthProvider>
      </ConfirmProvider>
    </ToastProvider>
  );
}
