const COLORS = {
  teal: '#2f7062',
  tealLight: 'rgba(47, 112, 98, 0.12)',
  tealMid: '#3d8b7a',
  stone: '#5c5650',
  stoneLight: 'rgba(92, 86, 80, 0.1)',
  stoneMid: '#8a837b',
  grid: 'rgba(26, 24, 22, 0.06)',
  text: '#5c5650',
  textMuted: '#8a837b',
};

export const formatChartDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const baseFont = {
  family: "'DM Sans', system-ui, sans-serif",
  size: 12,
};

export const chartTooltip = {
  backgroundColor: '#1c1917',
  titleColor: '#fafaf9',
  bodyColor: '#d6d3d1',
  titleFont: { ...baseFont, size: 13, weight: '500' },
  bodyFont: baseFont,
  padding: 12,
  cornerRadius: 6,
  displayColors: true,
  boxPadding: 4,
};

export const lineChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: { mode: 'index', intersect: false },
  plugins: {
    legend: { display: false },
    tooltip: chartTooltip,
  },
  scales: {
    x: {
      grid: { display: false },
      border: { display: false },
      ticks: {
        color: COLORS.textMuted,
        font: baseFont,
        maxTicksLimit: 8,
        callback(value, index, ticks) {
          const label = ticks[index]?.label;
          return formatChartDate(label) || label;
        },
      },
    },
    y: {
      beginAtZero: true,
      grid: { color: COLORS.grid, drawBorder: false },
      border: { display: false, dash: [4, 4] },
      ticks: {
        color: COLORS.textMuted,
        font: baseFont,
        precision: 0,
        padding: 8,
      },
    },
  },
};

export const barChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
      align: 'end',
      labels: {
        color: COLORS.text,
        font: baseFont,
        usePointStyle: true,
        pointStyle: 'circle',
        boxWidth: 8,
        boxHeight: 8,
        padding: 16,
      },
    },
    tooltip: chartTooltip,
  },
  scales: {
    x: {
      grid: { display: false },
      border: { display: false },
      ticks: {
        color: COLORS.textMuted,
        font: baseFont,
        maxRotation: 45,
        minRotation: 0,
      },
    },
    y: {
      beginAtZero: true,
      grid: { color: COLORS.grid, drawBorder: false },
      border: { display: false },
      ticks: {
        color: COLORS.textMuted,
        font: baseFont,
        precision: 0,
        padding: 8,
      },
    },
  },
};

export function buildLineDataset({ label, data, color = COLORS.teal, fillColor }) {
  const bg = fillColor ?? (color === COLORS.teal ? COLORS.tealLight : COLORS.stoneLight);
  return {
    label,
    data,
    borderColor: color,
    backgroundColor: bg,
    fill: true,
    tension: 0.35,
    borderWidth: 2,
    pointRadius: data?.length <= 1 ? 4 : 0,
    pointHoverRadius: 5,
    pointBackgroundColor: color,
    pointBorderColor: '#fff',
    pointBorderWidth: 2,
    pointHitRadius: 12,
  };
}

export function buildBarDatasets(items) {
  return items.map(({ label, data, color }) => ({
    label,
    data,
    backgroundColor: color,
    borderRadius: 4,
    borderSkipped: false,
    barThickness: 'flex',
    maxBarThickness: 36,
  }));
}

export { COLORS };
