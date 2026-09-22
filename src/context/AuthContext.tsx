import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, AppNotification } from '../types';
import { api, getStoredToken, setStoredToken } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  currentPath: string;
  navigate: (path: string) => void;
  login: (credentials: { email: string; role?: string; password?: string }) => Promise<void>;
  register: (payload: any) => Promise<void>;
  logout: () => void;
  switchDemoUser: (email: string) => Promise<void>;
  notifications: AppNotification[];
  unreadCount: number;
  markNotificationAsRead: (id: string) => Promise<void>;
  markAllNotificationsAsRead: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(getStoredToken());
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  // Listen to browser popstate for path routing
  useEffect(() => {
    const handlePop = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePop);
    return () => window.removeEventListener('popstate', handlePop);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const loadNotifications = async () => {
    try {
      if (getStoredToken()) {
        const notifs = await api.getNotifications();
        setNotifications(notifs);
      } else {
        setNotifications([]);
      }
    } catch {
      // ignore
    }
  };

  const refreshUser = async () => {
    const stored = getStoredToken();
    if (!stored) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const res = await api.getMe();
      setUser(res.user);
      await loadNotifications();
    } catch (err) {
      console.warn('Session expired or invalid token:', err);
      setStoredToken(null);
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  // Poll notifications every 30s when logged in
  useEffect(() => {
    if (!user) return;
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, [user]);

  const login = async (credentials: { email: string; role?: string; password?: string }) => {
    const res = await api.login(credentials);
    setStoredToken(res.token);
    setToken(res.token);
    setUser(res.user);
    await loadNotifications();

    // Route to appropriate portal
    if (res.user.role === 'admin') {
      navigate('/admin');
    } else if (res.user.role === 'priest') {
      navigate('/priest');
    } else {
      navigate('/user');
    }
  };

  const register = async (payload: any) => {
    const res = await api.register(payload);
    setStoredToken(res.token);
    setToken(res.token);
    setUser(res.user);
    await loadNotifications();

    if (res.user.role === 'admin') {
      navigate('/admin');
    } else if (res.user.role === 'priest') {
      navigate('/priest');
    } else {
      navigate('/user');
    }
  };

  const logout = () => {
    setStoredToken(null);
    setToken(null);
    setUser(null);
    setNotifications([]);
    navigate('/');
  };

  const switchDemoUser = async (email: string) => {
    await login({ email });
  };

  const markNotificationAsRead = async (id: string) => {
    try {
      await api.markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch {
      // ignore
    }
  };

  const markAllNotificationsAsRead = async () => {
    try {
      await api.markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch {
      // ignore
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        currentPath,
        navigate,
        login,
        register,
        logout,
        switchDemoUser,
        notifications,
        unreadCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
