import { useMemo } from 'react'
import { useUserSettings } from './useUserSettings'
import { normalizeLanguage, SUPPORTED_LANGUAGES, translate, type AppLanguage } from '../i18n/appI18n'

export function useAppLanguage() {
  const { settings, updateLanguage } = useUserSettings()
  const language = normalizeLanguage(settings?.language)

  const t = useMemo(() => {
    return (key: string, vars?: Record<string, string | number>) =>
      translate(language as AppLanguage, key, vars)
  }, [language])

  return {
    language,
    t,
    languages: SUPPORTED_LANGUAGES,
    setLanguage: updateLanguage,
  }
}

