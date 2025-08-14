import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserService from '../services/firebase/UserService';
import { useAuth } from './useAuth';

export interface UserSettings {
  dataSync: boolean;
  analytics: boolean;
  locationSharing: boolean;
  theme: 'light' | 'dark';
  language: string;
  timezone: string;
  currency: string;
  houseSystem?: 'whole' | 'equal' | 'placidus';
  ascOverrideDeg?: number;
  natalAscOverrideDeg?: number;
}

const STORAGE_KEY = '@tabula_estelar:user_settings';

export function useUserSettings() {
  const { user } = useAuth() as any;
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      // TODO: Implementar quando tivermos contexto de usuário
      // const response = await fetch(`${BACKEND_URL}/user-settings?userId=${userId}`);
      // if (response.ok) {
      //   const data = await response.json();
      //   if (data.success) {
      //     setSettings(data.settings);
      //     await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data.settings));
      //   }
      // }
      
      // Por enquanto, usar localStorage
      // Preferir preferência do usuário no Firestore quando logado
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setSettings(parsed);
      } else {
        // Configurações padrão
        const defaultSettings: UserSettings = {
          dataSync: true,
          analytics: true,
          locationSharing: true,
          theme: 'dark',
          language: 'pt-BR',
          timezone: 'America/Sao_Paulo',
          currency: 'BRL',
          houseSystem: 'placidus',
        };
        setSettings(defaultSettings);
        await saveSettings(defaultSettings);
      }
      // Se logado, tentar puxar preferência persistida
      try {
        if (user?.uid) {
          const hs = await UserService.getHouseSystem(user.uid)
          if (hs === 'placidus' || hs === 'equal' || hs === 'whole') {
            const merged = { ...(settings || JSON.parse(stored || '{}')), houseSystem: hs === 'whole' ? 'placidus' : hs }
            await saveSettings(merged)
          }
        }
      } catch {}
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
      // Fallback para configurações padrão
      const defaultSettings: UserSettings = {
        dataSync: true,
        analytics: true,
        locationSharing: true,
        theme: 'dark',
        language: 'pt-BR',
        timezone: 'America/Sao_Paulo',
        currency: 'BRL',
        houseSystem: 'placidus',
      };
      setSettings(defaultSettings);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (newSettings: UserSettings) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
      setSettings(newSettings);
      
      // TODO: Sincronizar com backend quando tivermos contexto de usuário
      // const response = await fetch(`${BACKEND_URL}/user-settings?userId=${userId}`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ settings: newSettings })
      // });
      // if (!response.ok) {
      //   console.error('Erro ao sincronizar com backend');
      // }
      
      return true;
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      return false;
    }
  };

  const updateSettings = async (updates: Partial<UserSettings>) => {
    if (!settings) return false;

    const newSettings = { ...settings, ...updates };
    return await saveSettings(newSettings);
  };

  const resetSettings = async () => {
    const defaultSettings: UserSettings = {
      dataSync: true,
      analytics: true,
      locationSharing: true,
      theme: 'dark',
      language: 'pt-BR',
      timezone: 'America/Sao_Paulo',
      currency: 'BRL',
    };
    return await saveSettings(defaultSettings);
  };

  const toggleTheme = async () => {
    if (!settings) return false;
    
    const newTheme = settings.theme === 'dark' ? 'light' : 'dark';
    return await updateSettings({ theme: newTheme });
  };

  const updateLanguage = async (language: string) => {
    return await updateSettings({ language });
  };

  const updateTimezone = async (timezone: string) => {
    return await updateSettings({ timezone });
  };

  const updateCurrency = async (currency: string) => {
    return await updateSettings({ currency });
  };

  return {
    settings,
    loading,
    updateSettings,
    resetSettings,
    toggleTheme,
    updateLanguage,
    updateTimezone,
    updateCurrency,
  };
}
