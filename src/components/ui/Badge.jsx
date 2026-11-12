/** tone: ok | warn | bad */
export default function Badge({ tone = 'ok', children }) {
  return <span className={'badge ' + tone}>{children}</span>;
}
