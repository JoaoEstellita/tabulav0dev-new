import axios from "axios"
import { PROKERALA_CONFIG, FALLBACK_APIS } from "../../config/prokerala"
import type { BirthData } from "../../screens/onboarding/BirthDataForm"

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
  private readonly backendUrl = PROKERALA_CONFIG.backendUrl

  constructor() {
    // ✅ Não precisa mais carregar credenciais - usa backend seguro
  }

  // ✅ Métodos removidos - não precisamos mais gerenciar credenciais localmente

  private async makeProkeralaRequest(endpoint: string, params: any): Promise<any> {
    try {
      console.log(`🔮 Chamando backend seguro para: ${endpoint}`)
      
      const response = await axios.post(`${this.backendUrl}/api/prokerala-proxy`, {
        endpoint,
        params
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000
      })

      console.log(`✅ Dados obtidos via backend seguro: ${endpoint}`)
      return response.data.data
    } catch (error: any) {
      console.error(`❌ Erro no backend seguro (${endpoint}):`, error.message)
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

  // DESABILITADO: Endpoint daily-prediction retorna erro 500
  async getAstrologicalStatus(birthData: BirthData): Promise<AstrologicalStatus> {
    console.warn('getAstrologicalStatus desabilitado - endpoint /v2/horoscope/daily-prediction com erro 500')
    // Retorna status neutro baseado apenas na data
    return this.generateSimulatedStatus(birthData)
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
    const seed = dayOfYear + birthData.birthLocation.latitude + birthData.birthLocation.longitude

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

  // DESABILITADO: Endpoint kundli retorna erro 500
  async getBirthChart(birthData: BirthData): Promise<any> {
    console.warn('getBirthChart desabilitado - endpoint /v2/astrology/kundli com erro 500')
    // Retorna estrutura vazia até implementarmos natal-chart
    return { planets: [], houses: [], aspects: [], disabled: true }
  }

  async getTransits(birthData: BirthData): Promise<any> {
    try {
      const now = new Date()
      const datetime = now.toISOString().split('.')[0] // Remove milissegundos
      
      return await this.makeProkeralaRequest("/v2/astrology/transit-planet-position", {
        'profile[datetime]': `${birthData.birthDate}T${birthData.birthTime}:00+00:00`,
        'profile[coordinates]': `${birthData.birthLocation.latitude},${birthData.birthLocation.longitude}`,
        ayanamsa: '1',
        transit_datetime: `${datetime}+00:00`,
        current_coordinates: `${birthData.birthLocation.latitude},${birthData.birthLocation.longitude}`
      })
    } catch (error) {
      console.error("Erro ao buscar trânsitos:", error)
      return { transits: [] }
    }
  }

  // ✅ Métodos de credenciais removidos - agora usa backend seguro
}

export default new ProkeralaService()
