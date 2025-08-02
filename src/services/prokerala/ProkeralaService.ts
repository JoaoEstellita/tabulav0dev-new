import axios from "axios"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { PROKERALA_CREDENTIALS, FALLBACK_APIS, type ProkeralaCredentials } from "../../config/prokerala"

const BASE_URL = "https://api.prokerala.com/v2"
const STORAGE_KEY = "prokerala_credentials"

export interface BirthData {
  datetime: string
  coordinates: {
    latitude: number
    longitude: number
  }
}

export interface AstrologicalStatus {
  overall: "critical" | "challenging" | "neutral" | "positive" | "excellent"
  mood: string
  energy: number
  challenges: string[]
  opportunities: string[]
  criticalTransits: Array<{
    planet: string
    aspect: string
    description: string
    intensity: number
  }>
}

class ProkeralaService {
  private credentials: ProkeralaCredentials[] = []
  private currentCredentialIndex = 0

  constructor() {
    this.loadCredentials()
  }

  private async loadCredentials() {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY)
      if (stored) {
        this.credentials = JSON.parse(stored)
      } else {
        this.credentials = [...PROKERALA_CREDENTIALS]
        await this.saveCredentials()
      }
    } catch (error) {
      console.error("Erro ao carregar credenciais:", error)
      this.credentials = [...PROKERALA_CREDENTIALS]
    }
  }

  private async saveCredentials() {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(this.credentials))
    } catch (error) {
      console.error("Erro ao salvar credenciais:", error)
    }
  }

  private getNextCredential(): ProkeralaCredentials | null {
    // Encontra a próxima credencial ativa
    for (let i = 0; i < this.credentials.length; i++) {
      const index = (this.currentCredentialIndex + i) % this.credentials.length
      const credential = this.credentials[index]

      if (credential.isActive) {
        this.currentCredentialIndex = index
        return credential
      }
    }
    return null
  }

  private async makeProkeralaRequest(endpoint: string, params: any, retryCount = 0): Promise<any> {
    const credential = this.getNextCredential()

    if (!credential) {
      throw new Error("Nenhuma credencial Prokerala disponível")
    }

    try {
      // Primeiro, obter token OAuth2
      const tokenData = new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: credential.clientId,
        client_secret: credential.clientSecret
      })

      const tokenResponse = await axios.post('https://api.prokerala.com/token', tokenData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        timeout: 10000
      })

      const accessToken = tokenResponse.data.access_token

      // Agora fazer a requisição real com o token
      const response = await axios.get(`${BASE_URL}${endpoint}`, {
        params: {
          ayanamsa: 1,
          ...params,
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        timeout: 15000,
      })

      // Atualiza estatísticas da credencial
      credential.requestCount++
      credential.lastUsed = new Date()
      await this.saveCredentials()

      return response.data
    } catch (error: any) {
      console.error(`Erro na API Prokerala (credencial ${this.currentCredentialIndex}):`, error.message)

      // Se erro de limite ou auth, desativa a credencial
      if (error.response?.status === 429 || error.response?.status === 401) {
        credential.isActive = false
        await this.saveCredentials()
      }

      // Tenta próxima credencial se disponível
      if (retryCount < this.credentials.length - 1) {
        this.currentCredentialIndex = (this.currentCredentialIndex + 1) % this.credentials.length
        return this.makeProkeralaRequest(endpoint, params, retryCount + 1)
      }

      // Se todas falharam, usa fallback
      throw error
    }
  }

  private async fallbackToFreeAstrology(endpoint: string): Promise<any> {
    try {
      console.log("Usando FreeAstrologyAPI como fallback")
      const response = await axios.get(`${FALLBACK_APIS.freeAstrology}${endpoint}`, {
        timeout: 8000,
      })
      return response.data
    } catch (error) {
      console.error("Fallback FreeAstrology falhou:", error)
      throw error
    }
  }

  private async fallbackToAztro(sign: string): Promise<any> {
    try {
      console.log("Usando Aztro API como fallback")
      const response = await axios.post(`${FALLBACK_APIS.aztro}?sign=${sign}&day=today`)
      return response.data
    } catch (error) {
      console.error("Fallback Aztro falhou:", error)
      throw error
    }
  }

  async getAstrologicalStatus(birthData: BirthData): Promise<AstrologicalStatus> {
    try {
      // Tenta Prokerala primeiro
      const data = await this.makeProkeralaRequest("/horoscope/daily-prediction", {
        datetime: birthData.datetime,
        coordinates: `${birthData.coordinates.latitude},${birthData.coordinates.longitude}`,
      })

      return this.parseAstrologicalStatus(data)
    } catch (error) {
      console.log("Prokerala falhou, tentando fallbacks...")

      try {
        // Fallback 1: FreeAstrologyAPI
        const fallbackData = await this.fallbackToFreeAstrology("/daily-horoscope")
        return this.parseAstrologicalStatus(fallbackData)
      } catch (fallbackError) {
        // Fallback 2: Dados simulados baseados na data
        console.log("Todos os fallbacks falharam, usando dados simulados")
        return this.generateSimulatedStatus(birthData)
      }
    }
  }

  private parseAstrologicalStatus(data: any): AstrologicalStatus {
    // Analisa os trânsitos para determinar o status geral
    const criticalTransits = data.transits?.filter((t: any) => t.intensity > 7) || []
    const challengingTransits = data.transits?.filter((t: any) => t.intensity > 5 && t.intensity <= 7) || []

    let overall: AstrologicalStatus["overall"] = "neutral"

    if (criticalTransits.length > 2) {
      overall = "critical"
    } else if (criticalTransits.length > 0 || challengingTransits.length > 3) {
      overall = "challenging"
    } else if (data.positive_aspects > data.negative_aspects) {
      overall = "positive"
    }

    return {
      overall,
      mood: data.mood || "Neutro",
      energy: data.energy_level || 50,
      challenges: data.challenges || [],
      opportunities: data.opportunities || [],
      criticalTransits: criticalTransits.map((t: any) => ({
        planet: t.planet,
        aspect: t.aspect,
        description: t.description,
        intensity: t.intensity,
      })),
    }
  }

  private generateSimulatedStatus(birthData: BirthData): AstrologicalStatus {
    // Gera status baseado na data atual e dados de nascimento
    const today = new Date()
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000)
    const seed = dayOfYear + birthData.coordinates.latitude + birthData.coordinates.longitude

    const statuses: AstrologicalStatus["overall"][] = ["neutral", "positive", "challenging", "critical", "excellent"]
    const overall = statuses[Math.floor(seed) % statuses.length]

    return {
      overall,
      mood: overall === "critical" ? "Tenso" : overall === "positive" ? "Otimista" : "Equilibrado",
      energy: Math.floor((seed % 100) + 1),
      challenges: overall === "critical" ? ["Tensões emocionais", "Conflitos interpessoais"] : [],
      opportunities: overall === "positive" ? ["Novos começos", "Crescimento pessoal"] : [],
      criticalTransits:
        overall === "critical"
          ? [
              {
                planet: "Marte",
                aspect: "Quadratura",
                description: "Tensão e impulsividade aumentadas",
                intensity: 8,
              },
            ]
          : [],
    }
  }

  async getDailyHoroscope(sign: string): Promise<any> {
    try {
      const data = await this.makeProkeralaRequest("/horoscope/daily", { sign: sign.toLowerCase() })
      return data
    } catch (error) {
      // Fallback para Aztro
      try {
        return await this.fallbackToAztro(sign)
      } catch (fallbackError) {
        return {
          sign,
          prediction: "Hoje é um dia para reflexões e autoconhecimento.",
          mood: "Contemplativo",
          lucky_number: Math.floor(Math.random() * 100),
        }
      }
    }
  }

  async getBirthChart(birthData: BirthData): Promise<any> {
    try {
      return await this.makeProkeralaRequest("/horoscope/birth-chart", {
        datetime: birthData.datetime,
        coordinates: `${birthData.coordinates.latitude},${birthData.coordinates.longitude}`,
      })
    } catch (error) {
      console.error("Erro ao buscar mapa natal:", error)
      return { planets: [], houses: [], aspects: [] }
    }
  }

  async getTransits(birthData: BirthData): Promise<any> {
    try {
      return await this.makeProkeralaRequest("/horoscope/transits", {
        datetime: birthData.datetime,
        coordinates: `${birthData.coordinates.latitude},${birthData.coordinates.longitude}`,
      })
    } catch (error) {
      console.error("Erro ao buscar trânsitos:", error)
      return { transits: [] }
    }
  }

  // Método para reativar credenciais (para admin)
  async resetCredentials() {
    this.credentials = this.credentials.map((cred) => ({
      ...cred,
      isActive: true,
      requestCount: 0,
      lastUsed: null,
    }))
    await this.saveCredentials()
  }

  // Método para verificar status das credenciais
  getCredentialsStatus() {
    return this.credentials.map((cred, index) => ({
      index,
      clientId: cred.clientId.substring(0, 8) + "...",
      isActive: cred.isActive,
      requestCount: cred.requestCount,
      lastUsed: cred.lastUsed,
    }))
  }
}

export default new ProkeralaService()
