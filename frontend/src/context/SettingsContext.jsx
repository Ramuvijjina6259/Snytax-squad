import { createContext, useContext, useState, useEffect } from 'react';
import { getSettings } from '../services/api';

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async (retryCount = 0) => {
    try {
      const { data } = await getSettings();
      if (data.success && data.data) {
        setSettings(data.data);
      }
    } catch (err) {
      console.error('Error fetching global settings:', err);
      if (retryCount < 3) {
        setTimeout(() => fetchSettings(retryCount + 1), 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading, refreshSettings: fetchSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
