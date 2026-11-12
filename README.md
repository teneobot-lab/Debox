# Inventory (React + Vite + Supabase)

Aplikasi inventory mobile-first. Frontend React (Vite) di-deploy ke Vercel, database dan login memakai Supabase.

## Fitur
- CRUD barang (kode, nama, kategori, satuan, stok awal, batas menipis)
- Barang masuk, penjualan, reject
- Stok fisik (opname) dengan selisih otomatis dan opsi penyesuaian stok sistem
- Rekap penjualan: jumlah item terjual per barang (hari ini, 7 hari, 30 hari, bulan ini, rentang bebas)
- Login admin, data dikunci dengan Row Level Security
- Rumus: `Stok Sistem = Stok Awal + Masuk − Jual − Reject + Penyesuaian`

## Struktur
```
src/
├─ main.jsx, App.jsx            # entry dan susunan provider + halaman
├─ config/pages.js              # daftar menu dan label jenis transaksi
├─ lib/                         # fungsi murni: format angka/tanggal, status stok, error, klien Supabase
├─ services/                    # semua akses Supabase (auth, barang, transaksi, opname, penjualan)
├─ context/                     # Auth, Inventory (data utama), Toast, Confirm
├─ hooks/useSubmit.js           # status loading + error handling untuk form
├─ components/
│  ├─ layout/                   # Header, BottomNav, Fab
│  └─ ui/                       # Button, Sheet, Badge, Chips, Segmented, Stepper, ItemPicker, ListRow, DateGroups, ...
├─ features/                    # satu folder per fitur: halaman + form + komponen khusus
│  ├─ auth/  stok/  barang/  transaksi/  penjualan/  opname/
└─ styles/                      # base.css (token, layout) dan components.css
supabase/schema.sql             # tabel, view, fungsi, dan RLS
```
Aturan sederhana: halaman hanya memanggil `services/` lewat context atau hook, komponen `ui/` tidak tahu soal Supabase.

## 1. Setup Supabase
1. Buat project di https://supabase.com.
2. **SQL Editor → New query**, paste isi `supabase/schema.sql`, klik **Run**.
3. **Authentication → Users → Add user**: isi email dan kata sandi, centang **Auto Confirm User**.
4. (Disarankan) matikan **Allow new users to sign up** di pengaturan provider.
5. Salin **Project URL** dan **anon / publishable key** dari **Project Settings → API**.

## 2. Jalankan lokal
```bash
cp .env.example .env     # isi VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY
npm install
npm run dev
```

## 3. Deploy ke Vercel
1. Push folder ini ke GitHub.
2. Di https://vercel.com/new, import repo. Vercel mendeteksi Vite otomatis (build: `npm run build`, output: `dist`).
3. Tambahkan **Environment Variables**: `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY`, lalu **Deploy**.

Anon key aman berada di frontend karena data dilindungi RLS (hanya user login). Jangan pernah memakai `service_role` key di frontend.
