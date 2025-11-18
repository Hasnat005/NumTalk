import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { fetchProfile, useLogin, useRegister } from '../api/hooks';
import type { AuthUser } from '../types/auth';
import { setAuthToken } from '../api/client';

const TOKEN_KEY = 'numtalk_token';
const USER_KEY = 'numtalk_user';

const isBrowser = typeof window !== 'undefined';
const safeGetItem = (key: string) => (isBrowser ? window.localStorage.getItem(key) : null);
const safeSetItem = (key: string, value: string) => {
  if (isBrowser) {
    window.localStorage.setItem(key, value);
  }
};
const safeRemoveItem = (key: string) => {
  if (isBrowser) {
    window.localStorage.removeItem(key);
  }
};

type AuthContextShape = {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextShape | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const stored = safeGetItem(USER_KEY);
    return stored ? (JSON.parse(stored) as AuthUser) : null;
  });
  const [token, setToken] = useState<string | null>(() => safeGetItem(TOKEN_KEY));
  const [loading, setLoading] = useState(Boolean(token));

  const loginMutation = useLogin();
  const registerMutation = useRegister();

  const persistSession = useCallback((nextToken: string, nextUser: AuthUser) => {
    safeSetItem(TOKEN_KEY, nextToken);
    safeSetItem(USER_KEY, JSON.stringify(nextUser));
    setAuthToken(nextToken);
    setToken(nextToken);
    setUser(nextUser);
  }, []);

  const login = useCallback(
    async (username: string, password: string) => {
      const payload = await loginMutation.mutateAsync({ username, password });
      persistSession(payload.token, payload.user);
    },
    [loginMutation, persistSession],
  );

  const register = useCallback(
    async (username: string, password: string) => {
      const payload = await registerMutation.mutateAsync({ username, password });
      persistSession(payload.token, payload.user);
    },
    [registerMutation, persistSession],
  );

  const logout = useCallback(() => {
    safeRemoveItem(TOKEN_KEY);
    safeRemoveItem(USER_KEY);
    setAuthToken(null);
    setToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    setAuthToken(token);
  }, [token]);

  useEffect(() => {
    const bootstrap = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const profile = await fetchProfile();
        safeSetItem(USER_KEY, JSON.stringify(profile));
        setUser(profile);
      } catch (err) {
        // Surfacing the failure once helps debug SSR/localStorage issues.
        console.error('Failed to fetch profile', err);
        logout();
      } finally {
        setLoading(false);
      }
    };

    bootstrap();
  }, [token, logout]);

  const value = useMemo(
    () => ({ user, token, loading, login, register, logout }),
    [user, token, loading, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return ctx;
};
