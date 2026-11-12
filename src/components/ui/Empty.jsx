export default function Empty({ small = false, children }) {
  return <div className={'empty' + (small ? ' sm' : '')}>{children}</div>;
}
