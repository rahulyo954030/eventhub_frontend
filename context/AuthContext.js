'use client';

import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { authService } from '@/services';
import { getErrorMessage } from '@/utils/helpers';
import { redirectToLogin } from '@/utils/authRedirect';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const initializedRef = useRef(false);

  const isPublicPath = useCallback((currentPath) => {
    if (!currentPath) return false;
    return (
      currentPath === '/login' ||
      currentPath === '/signup' ||
      currentPath === '/forgot-password' ||
      currentPath === '/reset-password' ||
      currentPath === '/verify-email' ||
      currentPath.startsWith('/register/')
    );
  }, []);

  const checkAuth = useCallback(async ({ withLoading = false } = {}) => {
    if (withLoading) {
      setLoading(true);
    }

    let authenticated = false;

    try {
      const response = await authService.validateSession();
      if (response.data.data?.valid) {
        setUser(response.data.data.user);
        authenticated = true;
      } else {
        setUser(null);
      }
    } catch (error) {
      const isUnauthorized = error?.response?.status === 401;
      if (isUnauthorized) {
        try {
          await authService.refresh();
          const retryResponse = await authService.validateSession();
          if (retryResponse.data.data?.valid) {
            setUser(retryResponse.data.data.user);
            authenticated = true;
            return;
          }
        } catch {
          // Refresh failed; fall through to clear user
        }
      }
      setUser(null);
    } finally {
      if (withLoading) {
        setLoading(false);
      }
    }

    if (!authenticated && !isPublicPath(pathname)) {
      try {
        await authService.clearSession();
      } catch {
        // Ignore — cookies may already be invalid
      }
      redirectToLogin(pathname);
    }
  }, [isPublicPath, pathname]);

  useEffect(() => {
    const init = async () => {
      if (isPublicPath(pathname)) {
        setLoading(false);
        initializedRef.current = true;
        return;
      }
      await checkAuth({ withLoading: true });
      initializedRef.current = true;
      setLoading(false);
    };
    init();
  }, []);

  useEffect(() => {
    // Avoid session validation call on every route transition.
    if (!initializedRef.current) return;
    if (isPublicPath(pathname)) return;
    if (user) return;
    checkAuth({ withLoading: false });
  }, [pathname, user, isPublicPath, checkAuth]);

  const login = async (credentials) => {
    const response = await authService.login(credentials);
    setUser(response.data.data.user);
    return response.data;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
    }
  };

  const updateUser = (userData) => {
    setUser(userData);
  };

  const isAdmin = user?.role === 'Admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        updateUser,
        checkAuth,
        isAdmin,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

export function useAuthError() {
  return getErrorMessage;
}
