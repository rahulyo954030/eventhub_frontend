export function getLoginRedirectUrl(pathname, search = '') {
  const next = `${pathname || '/dashboard'}${search || ''}`;
  return `/login?next=${encodeURIComponent(next)}`;
}

export function redirectToLogin(pathname, search = '') {
  if (typeof window === 'undefined') return;
  if (window.location.pathname.startsWith('/login')) return;
  window.location.href = getLoginRedirectUrl(pathname || window.location.pathname, search || window.location.search);
}

export function getPostLoginPath(searchParams) {
  const next = searchParams?.get('next');
  if (!next || !next.startsWith('/') || next.startsWith('//')) {
    return '/dashboard';
  }
  return next;
}
