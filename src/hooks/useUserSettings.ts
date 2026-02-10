import { useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import UserService from '../services/firebase/UserService'
import AstrologyCacheService from '../services/astrology/AstrologyCacheService'
import { normalizeHouseSystem } from '../astro/houseSystem'
import type { HouseSystem } from '../astro/houseSystem'
import { useAuth } from './useAuth'

export interface UserSettings {
  dataSync: boolean
  analytics: boolean
  locationSharing: boolean
  theme: 'light' | 'dark'
  language: string
  timezone: string
  currency: string
  houseSystem?: HouseSystem
  ascOverrideDeg?: number
  natalAscOverrideDeg?: number
}

const STORAGE_KEY = '@tabula_estelar:user_settings'

export function useUserSettings() {
  const { user } = useAuth() as any
  const [settings, setSettings] = useState<UserSettings | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        const normalized = normalizeHouseSystem(parsed.houseSystem || 'whole-sign')
        const merged = { ...parsed, houseSystem: normalized }
        setSettings(merged)
        try { (globalThis as any).__userHouseSystem = normalized } catch {}
      } else {
        const defaultSettings: UserSettings = {
          dataSync: true,
          analytics: true,
          locationSharing: true,
          theme: 'dark',
          language: 'pt-BR',
          timezone: 'America/Sao_Paulo',
          currency: 'BRL',
          houseSystem: 'whole-sign'
        }
        setSettings(defaultSettings)
        try { (globalThis as any).__userHouseSystem = defaultSettings.houseSystem } catch {}
        await saveSettings(defaultSettings)
      }

      try {
        if (user?.uid) {
          const hs = await UserService.getHouseSystem(user.uid)
          if (hs) {
            const normalized = normalizeHouseSystem(hs)
            const merged = { ...(settings || JSON.parse(stored || '{}')), houseSystem: normalized }
            try { (globalThis as any).__userHouseSystem = normalized } catch {}
            await saveSettings(merged)
          }
        }
      } catch {}
    } catch (error) {
      console.error('Erro ao carregar configuracoes:', error)
      const defaultSettings: UserSettings = {
        dataSync: true,
        analytics: true,
        locationSharing: true,
        theme: 'dark',
        language: 'pt-BR',
        timezone: 'America/Sao_Paulo',
        currency: 'BRL',
        houseSystem: 'whole-sign'
      }
      setSettings(defaultSettings)
    } finally {
      setLoading(false)
    }
  }

  const saveSettings = async (newSettings: UserSettings) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings))
      setSettings(newSettings)
      return true
    } catch (error) {
      console.error('Erro ao salvar configuracoes:', error)
      return false
    }
  }

  const updateSettings = async (updates: Partial<UserSettings>) => {
    if (!settings) return false

    const newSettings = { ...settings, ...updates }
    if (updates.houseSystem) {
      const normalized = normalizeHouseSystem(updates.houseSystem)
      newSettings.houseSystem = normalized
      try { (globalThis as any).__userHouseSystem = normalized } catch {}
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('house-system-changed'))
      }
      if (user?.uid) {
        try { await AstrologyCacheService.clearCache(user.uid) } catch {}
      }
    }

    return await saveSettings(newSettings)
  }

  const resetSettings = async () => {
    const defaultSettings: UserSettings = {
      dataSync: true,
      analytics: true,
      locationSharing: true,
      theme: 'dark',
      language: 'pt-BR',
      timezone: 'America/Sao_Paulo',
      currency: 'BRL',
      houseSystem: 'whole-sign'
    }
    return await saveSettings(defaultSettings)
  }

  const toggleTheme = async () => {
    if (!settings) return false

    const newTheme = settings.theme === 'dark' ? 'light' : 'dark'
    return await updateSettings({ theme: newTheme })
  }

  const updateLanguage = async (language: string) => {
    return await updateSettings({ language })
  }

  const updateTimezone = async (timezone: string) => {
    return await updateSettings({ timezone })
  }

  const updateCurrency = async (currency: string) => {
    return await updateSettings({ currency })
  }

  return {
    settings,
    loading,
    updateSettings,
    resetSettings,
    toggleTheme,
    updateLanguage,
    updateTimezone,
    updateCurrency
  }
}
