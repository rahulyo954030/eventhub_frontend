import { getStatusColor, capitalize } from '@/utils/helpers';

export default function StatusBadge({ status }) {
  return (
    <span className={`status-chip ${getStatusColor(status)}`}>
      {capitalize(status)}
    </span>
  );
}
