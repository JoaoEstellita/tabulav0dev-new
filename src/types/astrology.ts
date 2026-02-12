import type { AppLanguage } from '../i18n/appI18n'

export interface BirthData {
  fullName?: string
  profilePhoto?: string
  birthDate: string
  birthTime: string
  birthLocation: {
    city: string
    country: string
    latitude: number
    longitude: number
  }
  language?: AppLanguage
  birthCountryCode?: 'BR' | 'US' | 'ES' | 'IT'
}
