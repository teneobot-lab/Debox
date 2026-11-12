export default function Skeleton({ rows = 3 }) {
  return (
    <div className="list" aria-busy="true">
      {Array.from({ length: rows }, (_, i) => (
        <div className="skel" key={i} />
      ))}
    </div>
  );
}
