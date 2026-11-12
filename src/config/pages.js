/** Daftar menu bawah. `key` dipetakan ke komponen halaman di App.jsx. */
export const PAGES = [
  { key: 'stok', label: 'Stok', title: 'Stok', icon: 'stok' },
  { key: 'transaksi', label: 'Transaksi', title: 'Transaksi', icon: 'transaksi' },
  { key: 'penjualan', label: 'Penjualan', title: 'Penjualan', icon: 'penjualan' },
  { key: 'opname', label: 'Stok Fisik', title: 'Stok Fisik', icon: 'opname' },
  { key: 'barang', label: 'Barang', title: 'Barang', icon: 'barang' },
];

export const JENIS_TRANSAKSI = {
  JUAL: 'Penjualan',
  MASUK: 'Barang Masuk',
  REJECT: 'Reject',
};
