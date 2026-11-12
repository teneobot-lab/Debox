/** Pilihan segmen (tab kecil). options: [{ value, label }] */
export default function Segmented({ options, value, onChange }) {
  return (
    <div className="seg">
      {options.map((o) => (
        <button key={o.value} type="button" className={value === o.value ? 'on' : ''} onClick={() => onChange(o.value)}>
          {o.label}
        </button>
      ))}
    </div>
  );
}
