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
    Admin: 'bg-primary-50 text-primary-800',
    'Event Staff': 'bg-stone-100 text-stone-700',
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

export const getAuthFeedback = (error) => {
  const status = error?.response?.status;
  const message = getErrorMessage(error).toLowerCase();

  if (status === 409 || message.includes('already registered')) {
    return {
      variant: 'error',
      title: 'Email already registered',
      message: 'This email is already in use. Sign in instead, or use a different email.',
    };
  }

  if (message.includes('verify your email')) {
    return {
      variant: 'error',
      title: 'Email not verified',
      message: 'Please check your inbox and verify your email before signing in.',
    };
  }

  if (status === 401 || message.includes('invalid email or password')) {
    return {
      variant: 'error',
      title: 'Sign in failed',
      message: 'Email or password is incorrect. Please try again.',
    };
  }

  if (message.includes('deactivated') || message.includes('inactive')) {
    return {
      variant: 'error',
      title: 'Account inactive',
      message: 'This account is deactivated. Contact your admin for help.',
    };
  }

  if (message.includes('invite')) {
    return {
      variant: 'error',
      title: 'Invalid invite',
      message: 'This staff invite link is invalid or expired. Ask your admin to send a new invite.',
    };
  }

  if (status === 404 || message.includes('not found')) {
    return {
      variant: 'error',
      title: 'Feature unavailable',
      message: 'Staff invites are not available on this server yet. Restart or redeploy the backend with the latest code.',
    };
  }

  if (status === 409 || message.includes('already exists')) {
    return {
      variant: 'error',
      title: 'Cannot send invite',
      message: 'A user with this email already exists. They can sign in directly.',
    };
  }

  if (status === 400 && message.includes('only admin')) {
    return {
      variant: 'error',
      title: 'Cannot demote',
      message: 'At least one Admin must remain. Promote someone else to Admin first.',
    };
  }

  if (status === 400 && message.includes('already an admin')) {
    return {
      variant: 'error',
      title: 'Already Admin',
      message: 'This user already has Admin access.',
    };
  }

  if (status === 400 && message.includes('already event staff')) {
    return {
      variant: 'error',
      title: 'Already staff',
      message: 'This user is already Event Staff.',
    };
  }

  return {
    variant: 'error',
    title: 'Something went wrong',
    message: getErrorMessage(error),
  };
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
