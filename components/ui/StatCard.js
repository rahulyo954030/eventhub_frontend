export default function StatCard({ label, value, accent = 'stone', hint }) {
  const accents = {
    stone: 'border-l-stone-300',
    teal: 'border-l-primary-600',
    muted: 'border-l-stone-200',
  };

  const showBar = typeof value === 'string' && value.endsWith('%');
  const pct = showBar ? parseInt(value, 10) || 0 : 0;

  return (
    <div className={`stat-card border-l-[3px] ${accents[accent] || accents.stone}`}>
      <p className="stat-card-label">{label}</p>
      <p className="stat-card-value">{value ?? 0}</p>
      {showBar && (
        <div className="stat-card-bar">
          <div className="stat-card-bar-fill" style={{ width: `${Math.min(pct, 100)}%` }} />
        </div>
      )}
      {hint && <p className="stat-card-hint">{hint}</p>}
    </div>
  );
}
