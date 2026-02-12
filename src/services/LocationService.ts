export interface LocationSuggestion {
  city: string
  country: string
  state?: string
  latitude: number
  longitude: number
  displayName: string
}

type SupportedCountryCode = 'BR' | 'US' | 'ES' | 'IT'

const COUNTRY_NAMES: Record<SupportedCountryCode, string> = {
  BR: 'Brasil',
  US: 'United States',
  ES: 'Espana',
  IT: 'Italia',
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

const DEFAULT_BY_COUNTRY: Record<SupportedCountryCode, LocationSuggestion[]> = {
  BR: BRAZILIAN_CITIES.slice(0, 10),
  US: [{ city: 'New York', country: 'United States', state: 'NY', latitude: 40.7128, longitude: -74.006, displayName: 'New York, NY' }],
  ES: [{ city: 'Madrid', country: 'Espana', state: 'MD', latitude: 40.4168, longitude: -3.7038, displayName: 'Madrid, MD' }],
  IT: [{ city: 'Rome', country: 'Italia', state: 'RM', latitude: 41.9028, longitude: 12.4964, displayName: 'Rome, RM' }],
}

class LocationService {
  async searchLocations(query: string, countryCode: SupportedCountryCode = 'BR'): Promise<LocationSuggestion[]> {
    if (!query || query.length < 2) {
      return DEFAULT_BY_COUNTRY[countryCode] || DEFAULT_BY_COUNTRY.BR
    }

    try {
      if (countryCode === 'BR') {
        const local = this.searchLocalBrazil(query)
        if (local.length > 0) return local
      }
      const online = await this.searchOnlineLocations(query, countryCode)
      if (online.length > 0) return online
      return DEFAULT_BY_COUNTRY[countryCode] || DEFAULT_BY_COUNTRY.BR
    } catch (error) {
      console.error('Location search failed', error)
      return DEFAULT_BY_COUNTRY[countryCode] || DEFAULT_BY_COUNTRY.BR
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

  private async searchOnlineLocations(query: string, countryCode: SupportedCountryCode): Promise<LocationSuggestion[]> {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=8&countrycodes=${countryCode.toLowerCase()}`
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
          country: COUNTRY_NAMES[countryCode],
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
