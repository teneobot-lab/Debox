import { num } from '../../lib/format';

/** Input angka dengan tombol − dan + besar. `value` berupa string. */
export default function Stepper({ value, onChange, step = 1, ...rest }) {
  const bump = (d) => onChange(String(Math.max(0, Number(((num(value) || 0) + d).toFixed(4)))));
  return (
    <div className="step">
      <button type="button" onClick={() => bump(-step)} aria-label="Kurangi">−</button>
      <input inputMode="decimal" value={value} onChange={(e) => onChange(e.target.value)} {...rest} />
      <button type="button" onClick={() => bump(step)} aria-label="Tambah">+</button>
    </div>
  );
}
