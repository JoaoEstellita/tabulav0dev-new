interface LocationSuggestion {
  city: string
  country: string
  state?: string
  latitude: number
  longitude: number
  displayName: string
}

// Dados de cidades brasileiras mais populares
const BRAZILIAN_CITIES: LocationSuggestion[] = [
  { city: 'São Paulo', country: 'Brasil', state: 'SP', latitude: -23.5505, longitude: -46.6333, displayName: 'São Paulo, SP' },
  { city: 'Rio de Janeiro', country: 'Brasil', state: 'RJ', latitude: -22.9068, longitude: -43.1729, displayName: 'Rio de Janeiro, RJ' },
  { city: 'Belo Horizonte', country: 'Brasil', state: 'MG', latitude: -19.9167, longitude: -43.9345, displayName: 'Belo Horizonte, MG' },
  { city: 'Salvador', country: 'Brasil', state: 'BA', latitude: -12.9714, longitude: -38.5014, displayName: 'Salvador, BA' },
  { city: 'Brasília', country: 'Brasil', state: 'DF', latitude: -15.7942, longitude: -47.8825, displayName: 'Brasília, DF' },
  { city: 'Fortaleza', country: 'Brasil', state: 'CE', latitude: -3.7319, longitude: -38.5267, displayName: 'Fortaleza, CE' },
  { city: 'Manaus', country: 'Brasil', state: 'AM', latitude: -3.1190, longitude: -60.0217, displayName: 'Manaus, AM' },
  { city: 'Rio Branco', country: 'Brasil', state: 'AC', latitude: -9.9754, longitude: -67.8249, displayName: 'Rio Branco, AC' },
  { city: 'Curitiba', country: 'Brasil', state: 'PR', latitude: -25.4244, longitude: -49.2654, displayName: 'Curitiba, PR' },
  { city: 'Recife', country: 'Brasil', state: 'PE', latitude: -8.0476, longitude: -34.8770, displayName: 'Recife, PE' },
  { city: 'Porto Alegre', country: 'Brasil', state: 'RS', latitude: -30.0346, longitude: -51.2177, displayName: 'Porto Alegre, RS' },
  { city: 'Goiânia', country: 'Brasil', state: 'GO', latitude: -16.6864, longitude: -49.2643, displayName: 'Goiânia, GO' },
  { city: 'Belém', country: 'Brasil', state: 'PA', latitude: -1.4558, longitude: -48.5044, displayName: 'Belém, PA' },
  { city: 'Guarulhos', country: 'Brasil', state: 'SP', latitude: -23.4538, longitude: -46.5333, displayName: 'Guarulhos, SP' },
  { city: 'Campinas', country: 'Brasil', state: 'SP', latitude: -22.9099, longitude: -47.0626, displayName: 'Campinas, SP' },
  { city: 'São Luís', country: 'Brasil', state: 'MA', latitude: -2.5307, longitude: -44.3068, displayName: 'São Luís, MA' },
  { city: 'São Gonçalo', country: 'Brasil', state: 'RJ', latitude: -22.8270, longitude: -43.0530, displayName: 'São Gonçalo, RJ' },
  { city: 'Maceió', country: 'Brasil', state: 'AL', latitude: -9.6658, longitude: -35.7353, displayName: 'Maceió, AL' },
  { city: 'Duque de Caxias', country: 'Brasil', state: 'RJ', latitude: -22.7856, longitude: -43.3117, displayName: 'Duque de Caxias, RJ' },
  { city: 'Teresina', country: 'Brasil', state: 'PI', latitude: -5.0892, longitude: -42.8019, displayName: 'Teresina, PI' },
  { city: 'Natal', country: 'Brasil', state: 'RN', latitude: -5.7945, longitude: -35.2110, displayName: 'Natal, RN' },
  { city: 'Nova Iguaçu', country: 'Brasil', state: 'RJ', latitude: -22.7592, longitude: -43.4509, displayName: 'Nova Iguaçu, RJ' },
  { city: 'Campo Grande', country: 'Brasil', state: 'MS', latitude: -20.4697, longitude: -54.6201, displayName: 'Campo Grande, MS' },
  { city: 'São Bernardo do Campo', country: 'Brasil', state: 'SP', latitude: -23.6914, longitude: -46.5646, displayName: 'São Bernardo do Campo, SP' },
  { city: 'João Pessoa', country: 'Brasil', state: 'PB', latitude: -7.1195, longitude: -34.8450, displayName: 'João Pessoa, PB' },
  { city: 'Santo André', country: 'Brasil', state: 'SP', latitude: -23.6543, longitude: -46.5311, displayName: 'Santo André, SP' },
  { city: 'Osasco', country: 'Brasil', state: 'SP', latitude: -23.5329, longitude: -46.7918, displayName: 'Osasco, SP' },
  { city: 'Jaboatão dos Guararapes', country: 'Brasil', state: 'PE', latitude: -8.1130, longitude: -35.0149, displayName: 'Jaboatão dos Guararapes, PE' },
  { city: 'São José dos Campos', country: 'Brasil', state: 'SP', latitude: -23.2237, longitude: -45.9009, displayName: 'São José dos Campos, SP' },
  { city: 'Ribeirão Preto', country: 'Brasil', state: 'SP', latitude: -21.1775, longitude: -47.8100, displayName: 'Ribeirão Preto, SP' },
  { city: 'Uberlândia', country: 'Brasil', state: 'MG', latitude: -18.9113, longitude: -48.2622, displayName: 'Uberlândia, MG' },
  { city: 'Contagem', country: 'Brasil', state: 'MG', latitude: -19.9317, longitude: -44.0540, displayName: 'Contagem, MG' },
  { city: 'Aracaju', country: 'Brasil', state: 'SE', latitude: -10.9472, longitude: -37.0731, displayName: 'Aracaju, SE' },
  { city: 'Feira de Santana', country: 'Brasil', state: 'BA', latitude: -12.2577, longitude: -38.9668, displayName: 'Feira de Santana, BA' },
  { city: 'Cuiabá', country: 'Brasil', state: 'MT', latitude: -15.6014, longitude: -56.0979, displayName: 'Cuiabá, MT' },
  { city: 'Joinville', country: 'Brasil', state: 'SC', latitude: -26.3044, longitude: -48.8487, displayName: 'Joinville, SC' },
  { city: 'Aparecida de Goiânia', country: 'Brasil', state: 'GO', latitude: -16.8173, longitude: -49.2437, displayName: 'Aparecida de Goiânia, GO' },
  { city: 'Londrina', country: 'Brasil', state: 'PR', latitude: -23.3045, longitude: -51.1696, displayName: 'Londrina, PR' },
  { city: 'Ananindeua', country: 'Brasil', state: 'PA', latitude: -1.3656, longitude: -48.3725, displayName: 'Ananindeua, PA' },
  { city: 'Niterói', country: 'Brasil', state: 'RJ', latitude: -22.8833, longitude: -43.1036, displayName: 'Niterói, RJ' },
  { city: 'Porto Velho', country: 'Brasil', state: 'RO', latitude: -8.7612, longitude: -63.9023, displayName: 'Porto Velho, RO' },
  { city: 'Serra', country: 'Brasil', state: 'ES', latitude: -20.1287, longitude: -40.3081, displayName: 'Serra, ES' },
  { city: 'Caxias do Sul', country: 'Brasil', state: 'RS', latitude: -29.1678, longitude: -51.1794, displayName: 'Caxias do Sul, RS' },
  { city: 'Macapá', country: 'Brasil', state: 'AP', latitude: 0.0389, longitude: -51.0664, displayName: 'Macapá, AP' },
  { city: 'Vila Velha', country: 'Brasil', state: 'ES', latitude: -20.3297, longitude: -40.2925, displayName: 'Vila Velha, ES' },
  { city: 'Florianópolis', country: 'Brasil', state: 'SC', latitude: -27.5954, longitude: -48.5480, displayName: 'Florianópolis, SC' },
  { city: 'Vitória', country: 'Brasil', state: 'ES', latitude: -20.3155, longitude: -40.3128, displayName: 'Vitória, ES' },
  { city: 'Sorocaba', country: 'Brasil', state: 'SP', latitude: -23.5018, longitude: -47.4581, displayName: 'Sorocaba, SP' },
  { city: 'Campos dos Goytacazes', country: 'Brasil', state: 'RJ', latitude: -21.7642, longitude: -41.3300, displayName: 'Campos dos Goytacazes, RJ' },
  { city: 'Boa Vista', country: 'Brasil', state: 'RR', latitude: 2.8235, longitude: -60.6758, displayName: 'Boa Vista, RR' },
  { city: 'São José do Rio Preto', country: 'Brasil', state: 'SP', latitude: -20.8197, longitude: -49.3794, displayName: 'São José do Rio Preto, SP' },
  { city: 'Pelotas', country: 'Brasil', state: 'RS', latitude: -31.7654, longitude: -52.3376, displayName: 'Pelotas, RS' },
  { city: 'Canoas', country: 'Brasil', state: 'RS', latitude: -29.9177, longitude: -51.1830, displayName: 'Canoas, RS' },
]

class LocationService {
  async searchLocations(query: string): Promise<LocationSuggestion[]> {
    if (!query || query.length < 2) {
      // Retorna as 10 cidades mais populares se a busca for muito pequena
      console.log('Retornando cidades padrão:', BRAZILIAN_CITIES.slice(0, 10).length)
      return BRAZILIAN_CITIES.slice(0, 10)
    }

    try {
      // Busca local nas cidades brasileiras
      const localResults = BRAZILIAN_CITIES.filter(location => {
        const searchText = query.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        const cityName = location.city.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        const stateName = location.state?.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') || ''
        
        return cityName.includes(searchText) || 
               stateName.includes(searchText) ||
               location.displayName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(searchText)
      })

      // Se tiver resultados locais, retorna eles primeiro
      if (localResults.length > 0) {
        return localResults.slice(0, 8)
      }

      // Se não encontrar resultados locais, tenta buscar online
      return await this.searchOnlineLocations(query)
    } catch (error) {
      console.error('Erro ao buscar localizações:', error)
      // Em caso de erro, retorna pelo menos algumas opções padrão
      return BRAZILIAN_CITIES.slice(0, 5)
    }
  }

  private async searchOnlineLocations(query: string): Promise<LocationSuggestion[]> {
    try {
      // Usando OpenStreetMap Nominatim (gratuito)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&countrycodes=br`
      )
      
      if (!response.ok) {
        console.warn(`API de localização indisponível (${response.status}). Usando apenas cidades locais.`)
        return []
      }

      const data = await response.json()
      
      return data.map((item: any) => ({
        city: this.extractCityName(item.display_name),
        country: 'Brasil',
        state: this.extractStateName(item.display_name),
        latitude: parseFloat(item.lat),
        longitude: parseFloat(item.lon),
        displayName: this.formatDisplayName(item.display_name),
      })).filter((location: LocationSuggestion) => location.city)
    } catch (error) {
      console.error('Erro na busca online:', error)
      return []
    }
  }

  private extractCityName(displayName: string): string {
    // Extrai o nome da cidade do display_name do Nominatim
    const parts = displayName.split(',')
    return parts[0]?.trim() || ''
  }

  private extractStateName(displayName: string): string {
    // Extrai o estado do display_name do Nominatim
    const parts = displayName.split(',')
    // Geralmente o estado está na penúltima posição antes de "Brasil"
    if (parts.length >= 3) {
      return parts[parts.length - 2]?.trim() || ''
    }
    return ''
  }

  private formatDisplayName(displayName: string): string {
    // Formata o nome para exibição
    const parts = displayName.split(',')
    if (parts.length >= 2) {
      const city = parts[0]?.trim()
      const state = parts[parts.length - 2]?.trim()
      return `${city}, ${state}`
    }
    return parts[0]?.trim() || displayName
  }

  async getLocationDetails(city: string, state?: string): Promise<LocationSuggestion | null> {
    // Busca detalhes específicos de uma localização
    const searchQuery = state ? `${city}, ${state}` : city
    const results = await this.searchLocations(searchQuery)
    
    return results.find(location => 
      location.city.toLowerCase() === city.toLowerCase() ||
      location.displayName.toLowerCase().includes(city.toLowerCase())
    ) || null
  }
}

export default new LocationService()
export type { LocationSuggestion }