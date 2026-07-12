import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('ss-admin-token');
    const savedAdmin = localStorage.getItem('ss-admin');
    if (token && savedAdmin) {
      setAdmin(JSON.parse(savedAdmin));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await axios.post('/api/auth/login', { email, password });
    if (data.success) {
      localStorage.setItem('ss-admin-token', data.token);
      localStorage.setItem('ss-admin', JSON.stringify(data.admin));
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      setAdmin(data.admin);
      return data;
    }
    throw new Error(data.message);
  };

  const logout = () => {
    localStorage.removeItem('ss-admin-token');
    localStorage.removeItem('ss-admin');
    delete axios.defaults.headers.common['Authorization'];
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, login, logout, loading, isAuthenticated: !!admin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
