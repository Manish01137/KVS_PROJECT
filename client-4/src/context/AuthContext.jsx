import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import API from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('kvs_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  // Verify token on mount
  useEffect(() => {
    const token = localStorage.getItem('kvs_token');
    if (token) {
      API.get('/auth/me')
        .then(res => {
          setUser(res.data);
          localStorage.setItem('kvs_user', JSON.stringify(res.data));
        })
        .catch(() => {
          localStorage.removeItem('kvs_token');
          localStorage.removeItem('kvs_user');
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    const { data } = await API.post('/auth/login', { email, password });
    localStorage.setItem('kvs_token', data.token);
    localStorage.setItem('kvs_user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  }, []);

  const register = useCallback(async (formData) => {
    const { data } = await API.post('/auth/register', formData);
    localStorage.setItem('kvs_token', data.token);
    localStorage.setItem('kvs_user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('kvs_token');
    localStorage.removeItem('kvs_user');
    setUser(null);
  }, []);

  const updateUser = useCallback((userData) => {
    setUser(userData);
    localStorage.setItem('kvs_user', JSON.stringify(userData));
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
