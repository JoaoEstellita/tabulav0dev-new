/**
 * 🔔 useNotificationPreferences Hook 🔔
 * 
 * Hook para gerenciar preferências de notificações do usuário
 * Sincroniza com backend e localStorage
 */

import { useState, useEffect } from 'react'
import { useAuth } from './useAuth'

export interface NotificationPreferences {
  enabled: boolean
  dailyTime: string // HH:MM formato
  types: {
    dailyOverview: boolean
    criticalAlerts: boolean
    favorableAspects: boolean
    challenges: boolean
    groupMessages: boolean
  }
  personalMessage: string
  groupSettings: {
    allowPersonalMessages: boolean
    notifyOnCriticalEvents: boolean
  }
}

const defaultPreferences: NotificationPreferences = {
  enabled: true,
  dailyTime: '08:00',
  types: {
    dailyOverview: true,
    criticalAlerts: true,
    favorableAspects: true,
    challenges: false,
    groupMessages: true
  },
  personalMessage: '',
  groupSettings: {
    allowPersonalMessages: true,
    notifyOnCriticalEvents: true
  }
}

export function useNotificationPreferences() {
  const { user } = useAuth()
  const [preferences, setPreferences] = useState<NotificationPreferences>(defaultPreferences)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Carregar preferências ao montar o hook
  useEffect(() => {
    if (user) {
      loadPreferences()
    } else {
      setLoading(false)
    }
  }, [user])

  /**
   * Carrega preferências do backend
   */
  const loadPreferences = async () => {
    if (!user) return

    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`https://tabula-estelar-backend.vercel.app/api/notification-preferences?userId=${user.uid}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      
      if (data.success) {
        setPreferences(data.preferences)
        console.log('✅ Preferências carregadas:', data.preferences)
      } else {
        throw new Error(data.error || 'Erro ao carregar preferências')
      }

    } catch (error) {
      console.error('❌ Erro ao carregar preferências:', error)
      setError(error instanceof Error ? error.message : 'Erro desconhecido')
      
      // Usar preferências padrão em caso de erro
      setPreferences(defaultPreferences)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Salva preferências no backend
   */
  const savePreferences = async (newPreferences: NotificationPreferences) => {
    if (!user) {
      throw new Error('Usuário não autenticado')
    }

    try {
      setError(null)

      const response = await fetch(`https://tabula-estelar-backend.vercel.app/api/notification-preferences?userId=${user.uid}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          preferences: newPreferences
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      
      if (data.success) {
        setPreferences(data.preferences)
        console.log('✅ Preferências salvas:', data.preferences)
        return data.preferences
      } else {
        throw new Error(data.error || 'Erro ao salvar preferências')
      }

    } catch (error) {
      console.error('❌ Erro ao salvar preferências:', error)
      setError(error instanceof Error ? error.message : 'Erro desconhecido')
      throw error
    }
  }

  /**
   * Atualiza uma preferência específica
   */
  const updatePreference = async (key: keyof NotificationPreferences, value: any) => {
    const newPreferences = {
      ...preferences,
      [key]: value
    }
    
    await savePreferences(newPreferences)
  }

  /**
   * Atualiza um tipo específico de notificação
   */
  const updateNotificationType = async (type: keyof NotificationPreferences['types'], enabled: boolean) => {
    const newPreferences = {
      ...preferences,
      types: {
        ...preferences.types,
        [type]: enabled
      }
    }
    
    await savePreferences(newPreferences)
  }

  /**
   * Atualiza configurações de grupo
   */
  const updateGroupSetting = async (setting: keyof NotificationPreferences['groupSettings'], value: boolean) => {
    const newPreferences = {
      ...preferences,
      groupSettings: {
        ...preferences.groupSettings,
        [setting]: value
      }
    }
    
    await savePreferences(newPreferences)
  }

  /**
   * Ativa/desativa todas as notificações
   */
  const toggleAllNotifications = async (enabled: boolean) => {
    await updatePreference('enabled', enabled)
  }

  /**
   * Atualiza horário das notificações diárias
   */
  const updateDailyTime = async (time: string) => {
    // Validar formato HH:MM
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
    if (!timeRegex.test(time)) {
      throw new Error('Formato de horário inválido. Use HH:MM')
    }

    await updatePreference('dailyTime', time)
  }

  /**
   * Atualiza mensagem pessoal para grupos
   */
  const updatePersonalMessage = async (message: string) => {
    // Limitar a 100 caracteres
    const truncatedMessage = message.slice(0, 100)
    await updatePreference('personalMessage', truncatedMessage)
  }

  /**
   * Redefine para preferências padrão
   */
  const resetToDefault = async () => {
    await savePreferences(defaultPreferences)
  }

  return {
    preferences,
    loading,
    error,
    loadPreferences,
    savePreferences,
    updatePreference,
    updateNotificationType,
    updateGroupSetting,
    toggleAllNotifications,
    updateDailyTime,
    updatePersonalMessage,
    resetToDefault
  }
}