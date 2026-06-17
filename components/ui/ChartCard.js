'use client';

export default function ChartCard({
  title,
  subtitle,
  children,
  empty = false,
  emptyMessage = 'No data for this period yet.',
  height,
  className = '',
}) {
  return (
    <div className={`chart-card ${className}`}>
      <div className="chart-card-header px-4 sm:px-5">
        <div>
          <h3 className="chart-card-title">{title}</h3>
          {subtitle && <p className="chart-card-subtitle">{subtitle}</p>}
        </div>
      </div>
      {empty ? (
        <div className="chart-empty h-48 sm:h-56">
          <p>{emptyMessage}</p>
        </div>
      ) : (
        <div
          className="chart-canvas"
          style={height ? { minHeight: height } : undefined}
        >
          {children}
        </div>
      )}
    </div>
  );
}
