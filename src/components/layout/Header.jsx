import Icon from '../ui/Icon';

export default function Header({ title, onRefresh, onLogout }) {
  return (
    <header className="header">
      <h1>{title}</h1>
      <div>
        <button className="ib" onClick={onRefresh} aria-label="Muat ulang">
          <Icon name="refresh" size={20} strokeWidth={2} />
        </button>
        <button className="ib" onClick={onLogout} aria-label="Keluar">
          <Icon name="logout" size={20} strokeWidth={2} />
        </button>
      </div>
    </header>
  );
}
