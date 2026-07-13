import './EmptyState.css';

export default function EmptyState({ onRetry, errorMsg }) {
  return (
    <div className="es-wrap">
      <div className="es-icon">⚠️</div>
      <h2 className="es-title">Something went wrong</h2>
      <p className="es-sub">{errorMsg ?? 'Failed to load LeetCode data.'}</p>
      <button className="es-btn" onClick={onRetry}>↻ Try Again</button>
    </div>
  );
}