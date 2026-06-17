export const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateTime = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatTime = (time) => {
  if (!time) return '';
  return time;
};

export const getStatusColor = (status) => {
  const colors = {
    draft: 'bg-stone-100 text-stone-700',
    published: 'bg-primary-50 text-primary-800',
    archived: 'bg-stone-200 text-stone-600',
    Invited: 'bg-stone-100 text-stone-700',
    Registered: 'bg-primary-50 text-primary-800',
    Cancelled: 'bg-red-50 text-red-700',
    pending: 'bg-amber-50 text-amber-800',
    confirmed: 'bg-primary-50 text-primary-800',
    cancelled: 'bg-red-50 text-red-700',
    not_checked_in: 'bg-stone-100 text-stone-600',
    checked_in: 'bg-primary-50 text-primary-800',
  };
  return colors[status] || 'bg-stone-100 text-stone-700';
};

export const getErrorMessage = (error) => {
  return (
    error.response?.data?.message ||
    error.message ||
    'An unexpected error occurred'
  );
};

export const downloadBlob = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).replace(/_/g, ' ');
};
