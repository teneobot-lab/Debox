/** variant: (kosong) | sec | del ; size: (kosong) | sm */
export default function Button({ variant = '', size = '', loading = false, disabled, className = '', children, ...rest }) {
  const cls = ['btn', variant, size, className].filter(Boolean).join(' ');
  return (
    <button className={cls} disabled={loading || disabled} {...rest}>
      {loading ? 'Menyimpan…' : children}
    </button>
  );
}
