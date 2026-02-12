export interface LocationSuggestion {
  city: string
  country: string
  state?: string
  latitude: number
  longitude: number
  displayName: string
}

export interface CountryOption {
  code: string
  name: string
  flag: string
}

const COMMON_COUNTRY_CODES = [
  'BR', 'US', 'ES', 'IT', 'AR', 'MX', 'CL', 'CO', 'PE', 'UY',
  'PT', 'FR', 'DE', 'NL', 'BE', 'CH', 'AT', 'SE', 'NO', 'DK',
  'GB', 'IE', 'PL', 'CZ', 'RO', 'HU', 'GR', 'TR', 'RU', 'UA',
  'CA', 'AU', 'NZ', 'JP', 'KR', 'CN', 'IN', 'ID', 'TH', 'VN',
  'PH', 'MY', 'SG', 'AE', 'SA', 'ZA', 'EG', 'NG', 'MA', 'IL',
] as const

const CAPITAL_HINT_BY_COUNTRY: Record<string, string> = {
  BR: 'Sao Paulo',
  US: 'New York',
  ES: 'Madrid',
  IT: 'Rome',
  AR: 'Buenos Aires',
  MX: 'Ciudad de Mexico',
  CL: 'Santiago',
  CO: 'Bogota',
  PE: 'Lima',
  UY: 'Montevideo',
  PT: 'Lisbon',
  FR: 'Paris',
  DE: 'Berlin',
  NL: 'Amsterdam',
  BE: 'Brussels',
  CH: 'Zurich',
  AT: 'Vienna',
  SE: 'Stockholm',
  NO: 'Oslo',
  DK: 'Copenhagen',
  GB: 'London',
  IE: 'Dublin',
  PL: 'Warsaw',
  CZ: 'Prague',
  RO: 'Bucharest',
  HU: 'Budapest',
  GR: 'Athens',
  TR: 'Istanbul',
  RU: 'Moscow',
  UA: 'Kyiv',
  CA: 'Toronto',
  AU: 'Sydney',
  NZ: 'Auckland',
  JP: 'Tokyo',
  KR: 'Seoul',
  CN: 'Beijing',
  IN: 'New Delhi',
  ID: 'Jakarta',
  TH: 'Bangkok',
  VN: 'Ho Chi Minh City',
  PH: 'Manila',
  MY: 'Kuala Lumpur',
  SG: 'Singapore',
  AE: 'Dubai',
  SA: 'Riyadh',
  ZA: 'Johannesburg',
  EG: 'Cairo',
  NG: 'Lagos',
  MA: 'Casablanca',
  IL: 'Tel Aviv',
}

const BRAZILIAN_CITIES: LocationSuggestion[] = [
  { city: 'Sao Paulo', country: 'Brasil', state: 'SP', latitude: -23.5505, longitude: -46.6333, displayName: 'Sao Paulo, SP' },
  { city: 'Rio de Janeiro', country: 'Brasil', state: 'RJ', latitude: -22.9068, longitude: -43.1729, displayName: 'Rio de Janeiro, RJ' },
  { city: 'Belo Horizonte', country: 'Brasil', state: 'MG', latitude: -19.9167, longitude: -43.9345, displayName: 'Belo Horizonte, MG' },
  { city: 'Brasilia', country: 'Brasil', state: 'DF', latitude: -15.7942, longitude: -47.8825, displayName: 'Brasilia, DF' },
  { city: 'Salvador', country: 'Brasil', state: 'BA', latitude: -12.9714, longitude: -38.5014, displayName: 'Salvador, BA' },
  { city: 'Fortaleza', country: 'Brasil', state: 'CE', latitude: -3.7319, longitude: -38.5267, displayName: 'Fortaleza, CE' },
  { city: 'Curitiba', country: 'Brasil', state: 'PR', latitude: -25.4244, longitude: -49.2654, displayName: 'Curitiba, PR' },
  { city: 'Recife', country: 'Brasil', state: 'PE', latitude: -8.0476, longitude: -34.877, displayName: 'Recife, PE' },
  { city: 'Porto Alegre', country: 'Brasil', state: 'RS', latitude: -30.0346, longitude: -51.2177, displayName: 'Porto Alegre, RS' },
  { city: 'Goiania', country: 'Brasil', state: 'GO', latitude: -16.6864, longitude: -49.2643, displayName: 'Goiania, GO' },
]

const DEFAULT_BY_COUNTRY: Record<string, LocationSuggestion[]> = {
  BR: BRAZILIAN_CITIES.slice(0, 10),
}

class LocationService {
  private countriesCache: CountryOption[] | null = null

  private codeToFlag(code: string): string {
    return String(code || '')
      .toUpperCase()
      .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)))
  }

  private getCountryDisplayName(code: string, language = 'pt-BR'): string {
    const upper = String(code || '').toUpperCase()
    try {
      if (typeof Intl !== 'undefined' && typeof (Intl as any).DisplayNames === 'function') {
        const displayNames = new (Intl as any).DisplayNames([language], { type: 'region' })
        const translated = displayNames.of(upper)
        if (translated) return translated
      }
    } catch {}

    if (upper === 'BR') return 'Brasil'
    if (upper === 'US') return 'United States'
    if (upper === 'ES') return 'Espana'
    if (upper === 'IT') return 'Italia'
    return upper
  }

  async getCountries(query = '', language = 'pt-BR'): Promise<CountryOption[]> {
    if (!this.countriesCache) {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all?fields=cca2')
        if (response.ok) {
          const data = (await response.json()) as Array<{ cca2?: string }>
          const options = (data || [])
            .map((item) => String(item?.cca2 || '').toUpperCase())
            .filter((code) => code.length === 2)
            .map((code) => ({
              code,
              name: this.getCountryDisplayName(code, language),
              flag: this.codeToFlag(code),
            }))
            .sort((a, b) => a.name.localeCompare(b.name, language))
          this.countriesCache = options
        }
      } catch {}
    }

    if (!this.countriesCache || this.countriesCache.length === 0) {
      this.countriesCache = COMMON_COUNTRY_CODES.map((code) => ({
        code,
        name: this.getCountryDisplayName(code, language),
        flag: this.codeToFlag(code),
      }))
    }

    const normalizedQuery = this.normalizeText(query || '')
    const base = this.countriesCache.map((option) => ({
      ...option,
      name: this.getCountryDisplayName(option.code, language),
    }))

    if (!normalizedQuery) return base.slice(0, 80)

    return base
      .filter((option) => {
        const name = this.normalizeText(option.name)
        return name.includes(normalizedQuery) || option.code.toLowerCase().includes(normalizedQuery)
      })
      .slice(0, 80)
  }

  async searchLocations(query: string, countryCode = 'BR', language = 'pt-BR'): Promise<LocationSuggestion[]> {
    const normalizedCountryCode = String(countryCode || 'BR').toUpperCase()

    if (!query || query.length < 2) {
      if (normalizedCountryCode === 'BR') return DEFAULT_BY_COUNTRY.BR
      const hint = CAPITAL_HINT_BY_COUNTRY[normalizedCountryCode]
      if (!hint) return []
      try {
        const hintResults = await this.searchOnlineLocations(hint, normalizedCountryCode, language, true)
        return hintResults.slice(0, 6)
      } catch {
        return []
      }
    }

    try {
      if (normalizedCountryCode === 'BR') {
        const local = this.searchLocalBrazil(query)
        if (local.length > 0) return local
      }
      const online = await this.searchOnlineLocations(query, normalizedCountryCode, language, true)
      if (online.length > 0) return online
      const fallbackGlobal = await this.searchOnlineLocations(query, normalizedCountryCode, language, false)
      if (fallbackGlobal.length > 0) return fallbackGlobal
      return DEFAULT_BY_COUNTRY[normalizedCountryCode] || []
    } catch (error) {
      console.error('Location search failed', error)
      return DEFAULT_BY_COUNTRY[normalizedCountryCode] || []
    }
  }

  private searchLocalBrazil(query: string): LocationSuggestion[] {
    const normalizedQuery = this.normalizeText(query)
    return BRAZILIAN_CITIES.filter((location) => {
      const city = this.normalizeText(location.city)
      const state = this.normalizeText(location.state || '')
      const displayName = this.normalizeText(location.displayName)
      return city.includes(normalizedQuery) || state.includes(normalizedQuery) || displayName.includes(normalizedQuery)
    }).slice(0, 8)
  }

  private async searchOnlineLocations(
    query: string,
    countryCode: string,
    language = 'pt-BR',
    forceCountryFilter = true
  ): Promise<LocationSuggestion[]> {
    const countryFilter =
      forceCountryFilter && countryCode && countryCode.length === 2 ? `&countrycodes=${countryCode.toLowerCase()}` : ''
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=8${countryFilter}`
    )
    if (!response.ok) return []
    const data = await response.json()
    return (data || [])
      .map((item: any) => {
        const displayName = String(item.display_name || '')
        const city = this.extractCityName(displayName)
        if (!city) return null
        return {
          city,
          country: this.getCountryDisplayName(countryCode, language),
          state: this.extractStateName(displayName),
          latitude: parseFloat(item.lat),
          longitude: parseFloat(item.lon),
          displayName: this.formatDisplayName(displayName),
        } as LocationSuggestion
      })
      .filter(Boolean)
  }

  private extractCityName(displayName: string): string {
    return displayName.split(',')[0]?.trim() || ''
  }

  private extractStateName(displayName: string): string {
    const parts = displayName.split(',')
    if (parts.length < 3) return ''
    return parts[parts.length - 2]?.trim() || ''
  }

  private formatDisplayName(displayName: string): string {
    const parts = displayName.split(',')
    if (parts.length >= 2) {
      const city = parts[0]?.trim() || ''
      const state = parts[parts.length - 2]?.trim() || ''
      if (city && state) return `${city}, ${state}`
    }
    return displayName
  }

  private normalizeText(value: string) {
    return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  }
}

export default new LocationService()
