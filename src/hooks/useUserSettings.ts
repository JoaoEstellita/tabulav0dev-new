import { useState, useEffect } from 'react'
import { Platform } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import UserService from '../services/firebase/UserService'
import AstrologyCacheService from '../services/astrology/AstrologyCacheService'
import { normalizeHouseSystem, DEFAULT_HOUSE_SYSTEM } from '../astro/houseSystem'
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

let sharedSettings: UserSettings | null = null
const sharedListeners = new Set<(next: UserSettings) => void>()

const publishSharedSettings = (next: UserSettings) => {
  sharedSettings = next
  sharedListeners.forEach((listener) => listener(next))
}

const getDefaultSettings = (): UserSettings => ({
  dataSync: true,
  analytics: true,
  locationSharing: true,
  theme: 'dark',
  language: 'pt-BR',
  timezone: 'America/Sao_Paulo',
  currency: 'BRL',
  houseSystem: DEFAULT_HOUSE_SYSTEM,
})

export function useUserSettings() {
  const { user } = useAuth() as any
  const [settings, setSettings] = useState<UserSettings | null>(sharedSettings)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const listener = (next: UserSettings) => setSettings(next)
    sharedListeners.add(listener)
    return () => {
      sharedListeners.delete(listener)
    }
  }, [])

  useEffect(() => {
    loadSettings()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (Platform.OS !== 'web') return
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY || !event.newValue) return
      try {
        const parsed = JSON.parse(event.newValue)
        const normalized = normalizeHouseSystem(parsed.houseSystem)
        publishSharedSettings({ ...parsed, houseSystem: normalized })
      } catch { }
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  const saveSettings = async (newSettings: UserSettings) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings))
      publishSharedSettings(newSettings)
      return true
    } catch (error) {
      console.error('Erro ao salvar configuracoes:', error)
      return false
    }
  }

  const loadSettings = async () => {
    try {
      if (sharedSettings) {
        setSettings(sharedSettings)
        setLoading(false)
        return
      }

      const stored = await AsyncStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        const normalized = normalizeHouseSystem(parsed.houseSystem)
        publishSharedSettings({ ...parsed, houseSystem: normalized })
        try {
          ; (globalThis as any).__userHouseSystem = normalized
        } catch { }
      } else {
        const defaults = getDefaultSettings()
        publishSharedSettings(defaults)
        try {
          ; (globalThis as any).__userHouseSystem = defaults.houseSystem
        } catch { }
        await saveSettings(defaults)
      }

      try {
        if (user?.uid) {
          const hs = await UserService.getHouseSystem(user.uid)
          if (hs) {
            const normalized = normalizeHouseSystem(hs)
            const merged = { ...(sharedSettings || getDefaultSettings()), houseSystem: normalized }
            try {
              ; (globalThis as any).__userHouseSystem = normalized
            } catch { }
            await saveSettings(merged)
          }
        }
      } catch { }
    } catch (error) {
      console.error('Erro ao carregar configuracoes:', error)
      const defaults = getDefaultSettings()
      publishSharedSettings(defaults)
    } finally {
      setLoading(false)
    }
  }

  const updateSettings = async (updates: Partial<UserSettings>) => {
    const current = settings || sharedSettings
    if (!current) return false

    const newSettings = { ...current, ...updates }
    if (updates.houseSystem) {
      const normalized = normalizeHouseSystem(updates.houseSystem)
      newSettings.houseSystem = normalized
      try {
        ; (globalThis as any).__userHouseSystem = normalized
      } catch { }
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('house-system-changed'))
      }
      if (user?.uid) {
        try {
          await AstrologyCacheService.clearCache(user.uid)
        } catch { }
      }
    }

    return await saveSettings(newSettings)
  }

  const resetSettings = async () => {
    return await saveSettings(getDefaultSettings())
  }

  const toggleTheme = async () => {
    const current = settings || sharedSettings
    if (!current) return false

    const newTheme = current.theme === 'dark' ? 'light' : 'dark'
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
    updateCurrency,
  }
}

