export default function Fab({ onClick, label = 'Tambah' }) {
  return (
    <button className="fab" onClick={onClick} aria-label={label}>
      +
    </button>
  );
}
