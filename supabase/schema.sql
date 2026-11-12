-- =====================================================
-- INVENTORY - SUPABASE SCHEMA
-- Jalankan di Supabase: SQL Editor > New query > Run
-- =====================================================

-- 1. TABEL ------------------------------------------------
create table if not exists barang (
  kode       text primary key,
  nama       text not null,
  kategori   text default '',
  satuan     text default 'pcs',
  stok_awal  numeric not null default 0,
  stok_min   numeric not null default 0,   -- batas "menipis"
  created_at timestamptz default now()
);

create table if not exists transaksi (
  id         bigint generated always as identity primary key,
  tanggal    date not null default current_date,
  kode       text not null references barang(kode) on update cascade on delete restrict,
  jenis      text not null check (jenis in ('MASUK','JUAL','REJECT','ADJ')),
  qty        numeric not null,
  keterangan text default '',
  created_at timestamptz default now(),
  check ( (jenis = 'ADJ' and qty <> 0) or (jenis <> 'ADJ' and qty > 0) )
);

create table if not exists opname (
  id          bigint generated always as identity primary key,
  tanggal     date not null default current_date,
  kode        text not null references barang(kode) on update cascade on delete restrict,
  stok_sistem numeric not null,
  stok_fisik  numeric not null,
  selisih     numeric generated always as (stok_fisik - stok_sistem) stored,
  keterangan  text default '',
  created_at  timestamptz default now()
);

create index if not exists idx_transaksi_kode    on transaksi(kode);
create index if not exists idx_transaksi_tanggal on transaksi(tanggal);
create index if not exists idx_opname_kode       on opname(kode);

-- 2. VIEW STOK --------------------------------------------
-- Stok Sistem = Stok Awal + Masuk - Jual - Reject + Adj
create or replace view v_stok with (security_invoker = true) as
select x.*,
       x.stok_awal + x.masuk - x.jual - x.reject + x.adj as stok_sistem
from (
  select b.kode, b.nama, b.kategori, b.satuan, b.stok_awal, b.stok_min,
         coalesce(sum(t.qty) filter (where t.jenis = 'MASUK'),  0) as masuk,
         coalesce(sum(t.qty) filter (where t.jenis = 'JUAL'),   0) as jual,
         coalesce(sum(t.qty) filter (where t.jenis = 'REJECT'), 0) as reject,
         coalesce(sum(t.qty) filter (where t.jenis = 'ADJ'),    0) as adj
  from barang b
  left join transaksi t on t.kode = b.kode
  group by b.kode
) x;

-- 3. REKAP PENJUALAN (jumlah item terjual per rentang tanggal) ---
create or replace function rekap_penjualan(p_dari date, p_sampai date)
returns table (kode text, nama text, kategori text, satuan text, total_jual numeric)
language sql stable security invoker as $$
  select b.kode, b.nama, b.kategori, b.satuan, coalesce(sum(t.qty), 0) as total_jual
  from barang b
  left join transaksi t
         on t.kode = b.kode and t.jenis = 'JUAL'
        and t.tanggal between p_dari and p_sampai
  group by b.kode
  order by total_jual desc, b.nama;
$$;

-- 4. SIMPAN OPNAME (atomik: catat opname + opsional penyesuaian stok) ---
create or replace function simpan_opname(
  p_tanggal date, p_kode text, p_fisik numeric, p_ket text, p_sesuaikan boolean
) returns void
language plpgsql security invoker as $$
declare
  v_sistem numeric;
  v_sel    numeric;
begin
  select stok_sistem into v_sistem from v_stok where kode = p_kode;
  if v_sistem is null then raise exception 'Barang tidak ditemukan'; end if;
  v_sel := p_fisik - v_sistem;

  insert into opname (tanggal, kode, stok_sistem, stok_fisik, keterangan)
  values (p_tanggal, p_kode, v_sistem, p_fisik, coalesce(p_ket, ''));

  if p_sesuaikan and v_sel <> 0 then
    insert into transaksi (tanggal, kode, jenis, qty, keterangan)
    values (p_tanggal, p_kode, 'ADJ', v_sel, 'Penyesuaian stok opname');
  end if;
end;
$$;

-- 5. KEAMANAN (RLS): hanya user yang login yang boleh akses -------
alter table barang    enable row level security;
alter table transaksi enable row level security;
alter table opname    enable row level security;

drop policy if exists "auth_all" on barang;
drop policy if exists "auth_all" on transaksi;
drop policy if exists "auth_all" on opname;

create policy "auth_all" on barang    for all to authenticated using (true) with check (true);
create policy "auth_all" on transaksi for all to authenticated using (true) with check (true);
create policy "auth_all" on opname    for all to authenticated using (true) with check (true);

revoke execute on function rekap_penjualan(date, date)                      from public, anon;
revoke execute on function simpan_opname(date, text, numeric, text, boolean) from public, anon;
grant  execute on function rekap_penjualan(date, date)                      to authenticated;
grant  execute on function simpan_opname(date, text, numeric, text, boolean) to authenticated;
