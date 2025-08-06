/**
 * 🔔 useNotificationPreferences Hook 🔔
 * 
 * Hook para gerenciar preferências de notificações do usuário
 * Sincroniza com backend e localStorage
 */

import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface NotificationPreferences {
  dailyNotifications: boolean;
  criticalAlerts: boolean;
  groupNotifications: boolean;
  quietHours: boolean;
  quietHoursStart: string; // "22:00"
  quietHoursEnd: string; // "08:00"
}

const STORAGE_KEY = '@tabula_estelar:notification_preferences';

export function useNotificationPreferences() {
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setPreferences(parsed);
      } else {
        // Preferências padrão
        const defaultPreferences: NotificationPreferences = {
          dailyNotifications: true,
          criticalAlerts: true,
          groupNotifications: true,
          quietHours: false,
          quietHoursStart: "22:00",
          quietHoursEnd: "08:00",
        };
        setPreferences(defaultPreferences);
        await savePreferences(defaultPreferences);
      }
    } catch (error) {
      console.error('Erro ao carregar preferências:', error);
      // Fallback para preferências padrão
      const defaultPreferences: NotificationPreferences = {
        dailyNotifications: true,
        criticalAlerts: true,
        groupNotifications: true,
        quietHours: false,
        quietHoursStart: "22:00",
        quietHoursEnd: "08:00",
      };
      setPreferences(defaultPreferences);
    } finally {
      setLoading(false);
    }
  };

  const savePreferences = async (newPreferences: NotificationPreferences) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newPreferences));
      setPreferences(newPreferences);
      
      // TODO: Sincronizar com backend
      // await syncPreferencesWithBackend(newPreferences);
      
      return true;
    } catch (error) {
      console.error('Erro ao salvar preferências:', error);
      return false;
    }
  };

  const updatePreferences = async (updates: Partial<NotificationPreferences>) => {
    if (!preferences) return false;

    const newPreferences = { ...preferences, ...updates };
    return await savePreferences(newPreferences);
  };

  const resetPreferences = async () => {
    const defaultPreferences: NotificationPreferences = {
      dailyNotifications: true,
      criticalAlerts: true,
      groupNotifications: true,
      quietHours: false,
      quietHoursStart: "22:00",
      quietHoursEnd: "08:00",
    };
    return await savePreferences(defaultPreferences);
  };

  const isInQuietHours = (): boolean => {
    if (!preferences?.quietHours) return false;

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    const [startHour, startMinute] = preferences.quietHoursStart.split(':').map(Number);
    const [endHour, endMinute] = preferences.quietHoursEnd.split(':').map(Number);
    
    const startTime = startHour * 60 + startMinute;
    const endTime = endHour * 60 + endMinute;
    
    // Se o horário silencioso cruza a meia-noite
    if (startTime > endTime) {
      return currentTime >= startTime || currentTime <= endTime;
    } else {
      return currentTime >= startTime && currentTime <= endTime;
    }
  };

  const shouldSendNotification = (type: keyof NotificationPreferences): boolean => {
    if (!preferences) return false;

    // Verificar se está em horário silencioso
    if (preferences.quietHours && isInQuietHours()) {
      return false;
    }

    // Verificar se o tipo de notificação está habilitado
    switch (type) {
      case 'dailyNotifications':
        return preferences.dailyNotifications;
      case 'criticalAlerts':
        return preferences.criticalAlerts;
      case 'groupNotifications':
        return preferences.groupNotifications;
      default:
        return true;
    }
  };

  return {
    preferences,
    loading,
    updatePreferences,
    resetPreferences,
    isInQuietHours,
    shouldSendNotification,
  };
}