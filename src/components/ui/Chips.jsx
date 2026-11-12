/** Deretan chip filter. options: [{ value, label }] */
export default function Chips({ options, value, onChange }) {
  return (
    <div className="chips">
      {options.map((o) => (
        <button key={o.value} type="button" className={'chip' + (value === o.value ? ' on' : '')} onClick={() => onChange(o.value)}>
          {o.label}
        </button>
      ))}
    </div>
  );
}
