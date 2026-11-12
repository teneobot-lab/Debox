/** Baris riwayat: judul + subjudul di kiri, nilai berwarna + tombol hapus di kanan. tone: pos | neg | zero */
export default function ListRow({ title, subtitle, value, tone = '', onDelete }) {
  return (
    <div className="row">
      <div className="l">
        <b>{title}</b>
        <small>{subtitle}</small>
      </div>
      <div className="r">
        <span className={tone}>{value}</span>
        {onDelete && (
          <button className="x" type="button" onClick={onDelete} aria-label="Hapus">×</button>
        )}
      </div>
    </div>
  );
}
