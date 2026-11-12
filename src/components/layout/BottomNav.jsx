import Icon from '../ui/Icon';
import { PAGES } from '../../config/pages';

export default function BottomNav({ page, onChange }) {
  return (
    <nav className="bottom-nav">
      {PAGES.map((p) => (
        <button key={p.key} className={page === p.key ? 'on' : ''} onClick={() => onChange(p.key)}>
          <Icon name={p.icon} />
          {p.label}
        </button>
      ))}
    </nav>
  );
}
