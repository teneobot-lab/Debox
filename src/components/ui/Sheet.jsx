import { useEffect } from 'react';

/** Bottom sheet (di desktop tampil sebagai modal di tengah). */
export default function Sheet({ title, onClose, children }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="ov" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="panel" role="dialog" aria-modal="true" aria-label={title}>
        <h3>{title}</h3>
        {children}
      </div>
    </div>
  );
}
