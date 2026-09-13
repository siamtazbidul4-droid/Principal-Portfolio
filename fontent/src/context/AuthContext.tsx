import React, { createContext, useContext, useState, useEffect } from 'react';
import { IAdminUser } from '../types';
import { AdminService } from '../services/admin.service';

interface AuthContextValue {
  user: IAdminUser | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function readStoredUser(): IAdminUser | null {
  const saved = localStorage.getItem('aurelius_auth_user');
  if (!saved) return null;
  try {
    return JSON.parse(saved) as IAdminUser;
  } catch {
    // Corrupt/legacy value in localStorage must never crash the app on boot.
    localStorage.removeItem('aurelius_auth_user');
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<IAdminUser | null>(() => readStoredUser());
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('aurelius_auth_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function verifySession() {
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const res = await AdminService.getMe();
        if (res.success && res.data) {
          setUser(res.data);
          localStorage.setItem('aurelius_auth_user', JSON.stringify(res.data));
        } else {
          // Token expired or invalid
          setUser(null);
          setToken(null);
          localStorage.removeItem('aurelius_auth_token');
          localStorage.removeItem('aurelius_auth_user');
        }
      } catch (err) {
        setUser(null);
        setToken(null);
        localStorage.removeItem('aurelius_auth_token');
        localStorage.removeItem('aurelius_auth_user');
      } finally {
        setIsLoading(false);
      }
    }

    verifySession();
  }, [token]);

  const login = async (email: string, pass: string) => {
    const res = await AdminService.login({ email, password: pass });
    if (res.success && res.data) {
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('aurelius_auth_token', res.data.token);
      localStorage.setItem('aurelius_auth_user', JSON.stringify(res.data.user));
      return { success: true };
    }
    return { success: false, message: res.message || 'Authentication failed' };
  };

  const logout = async () => {
    try {
      await AdminService.logout();
    } catch {
      // ignore
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('aurelius_auth_token');
      localStorage.removeItem('aurelius_auth_user');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!user && !!token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
