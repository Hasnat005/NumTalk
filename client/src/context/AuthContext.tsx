import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { fetchProfile, useLogin, useRegister } from '../api/hooks';
import type { AuthUser } from '../types/auth';
import { setAuthToken } from '../api/client';

const TOKEN_KEY = 'numtalk_token';
const USER_KEY = 'numtalk_user';

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
    const stored = localStorage.getItem(USER_KEY);
    return stored ? (JSON.parse(stored) as AuthUser) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [loading, setLoading] = useState(Boolean(token));

  const loginMutation = useLogin();
  const registerMutation = useRegister();

  const persistSession = useCallback((nextToken: string, nextUser: AuthUser) => {
    localStorage.setItem(TOKEN_KEY, nextToken);
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
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
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
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
        localStorage.setItem(USER_KEY, JSON.stringify(profile));
        setUser(profile);
      } catch (err) {
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

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return ctx;
};
