export default function StatusBadge({
  status = "healthy",
  text,
}) {
  return (
    <span className={`status-badge ${status}`}>
      <span className="status-dot"></span>
      {text}
    </span>
  );
}