// src/hooks/useSettings.js
import { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthContext';
import { getUserSettings } from '../services/settingsService';

/**
 * Custom hook for managing user settings
 * Provides settings data and loading states
 */
export const useSettings = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadSettings = async () => {
      if (!user?.uid) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const userData = await getUserSettings(user.uid);
        setSettings(userData);
      } catch (err) {
        console.error('Error loading settings:', err);
        setError(err.message || 'Failed to load settings');
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, [user?.uid]);

  const refreshSettings = async () => {
    if (!user?.uid) return;
    
    try {
      setLoading(true);
      const userData = await getUserSettings(user.uid);
      setSettings(userData);
      setError(null);
    } catch (err) {
      console.error('Error refreshing settings:', err);
      setError(err.message || 'Failed to refresh settings');
    } finally {
      setLoading(false);
    }
  };

  return {
    settings,
    loading,
    error,
    refreshSettings
  };
};