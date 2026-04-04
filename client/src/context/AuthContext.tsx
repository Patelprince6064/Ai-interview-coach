import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import api from '@/lib/api';

interface User { _id: string; name: string; email: string; totalSessions: number; averageScore: number; }
interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  googleLogin: (credential: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try { return JSON.parse(localStorage.getItem('user') || 'null'); } catch { return null; }
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);

  const saveAuth = (token: string, user: User) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setToken(token);
    setUser(user);
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      saveAuth(data.token, data.user);
    } finally { setLoading(false); }
  };

  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', { name, email, password });
      saveAuth(data.token, data.user);
    } finally { setLoading(false); }
  };

  const googleLogin = async (credential: string) => {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/google', { credential });
      saveAuth(data.token, data.user);
    } finally { setLoading(false); }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, googleLogin, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};
