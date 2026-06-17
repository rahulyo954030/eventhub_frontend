const normalizeBackendBase = (value) => {
  if (!value) return null;
  return value.trim().replace(/\/api\/?$/, '').replace(/\/$/, '');
};

export const getBackendBaseUrl = () => {
  const fromEnv = normalizeBackendBase(process.env.BACKEND_URL)
    || normalizeBackendBase(process.env.NEXT_PUBLIC_API_URL);

  return fromEnv || 'http://localhost:5000';
};

export const getApiBaseUrl = () => '/api';
