export interface PremiumResponse<T = any> {
  ok?: boolean
  data?: T
  meta?: {
    cacheHit?: boolean
    ttlSeconds?: number | null
    creditsRemaining?: number | null
    cycleEnd?: string | null
    cycleStart?: string | null
    source?: string
    durationMs?: number
  }
  creditsRemaining?: number | null
  cycleEnd?: string | null
  cycleStart?: string | null
  unlimited?: boolean
  error?: string
  message?: string
}

export class AstrologerPremiumService {
  private static readonly BACKEND_URL = (process.env.EXPO_PUBLIC_BACKEND_URL || '').replace(/\/$/, '') + '/api'

  private static async request<T>(path: string, token: string, body: Record<string, any>) {
    const isCreditsEndpoint = path.startsWith('/premium/credits/')
    let response: Response
    try {
      response = await fetch(`${this.BACKEND_URL}${path}`, {
        method: 'POST',
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body || {}),
      })
    } catch (networkError) {
      if (isCreditsEndpoint) {
        return { ok: false, data: { items: [] } } as PremiumResponse<T>
      }
      throw networkError
    }

    const payload = await response.json().catch(() => ({}))
    if (response.status === 404 && isCreditsEndpoint) {
      // Em alguns deploys o backend premium/credits pode nao estar publicado.
      // Nao quebra UI; retorna payload vazio para telas de creditos/historico.
      return { ok: false, data: { items: [] } } as PremiumResponse<T>
    }
    if (!response.ok) {
      const error = payload?.error || `HTTP_${response.status}`
      const message = payload?.message || payload?.error || 'Erro ao consultar premium'
      const err = new Error(message)
      ;(err as any).code = error
      throw err
    }
    return payload as PremiumResponse<T>
  }

  private static async requestGet<T>(path: string, token: string) {
    const isCreditsEndpoint = path.startsWith('/premium/credits/')
    let response: Response
    try {
      response = await fetch(`${this.BACKEND_URL}${path}`, {
        method: 'GET',
        cache: 'no-store',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    } catch (networkError) {
      if (isCreditsEndpoint) {
        return { ok: false, data: { items: [] } } as PremiumResponse<T>
      }
      throw networkError
    }
    const payload = await response.json().catch(() => ({}))
    if (response.status === 404 && isCreditsEndpoint) {
      return { ok: false, data: { items: [] } } as PremiumResponse<T>
    }
    if (!response.ok) {
      const error = payload?.error || `HTTP_${response.status}`
      const message = payload?.message || payload?.error || 'Erro ao consultar premium'
      const err = new Error(message)
      ;(err as any).code = error
      throw err
    }
    return payload as PremiumResponse<T>
  }

  static getBirthChartData(token: string) {
    return this.request('/premium/astrologer/birth-chart-data', token, {})
  }

  static getBirthChartContext(token: string) {
    return this.request('/premium/astrologer/birth-chart-context', token, {})
  }

  static getTransitData(token: string, targetDate?: string) {
    return this.request('/premium/astrologer/transit-data', token, { targetDate })
  }

  static getTransitContext(token: string, targetDate?: string) {
    return this.request('/premium/astrologer/transit-context', token, { targetDate })
  }

  static getSynastryData(token: string, partner: Record<string, any>) {
    return this.request('/premium/astrologer/synastry-data', token, { partner })
  }

  static getSynastryContext(token: string, partner: Record<string, any>) {
    return this.request('/premium/astrologer/synastry-context', token, { partner })
  }

  static getCompositeData(token: string, partner: Record<string, any>) {
    return this.request('/premium/astrologer/composite-data', token, { partner })
  }

  static getSolarReturnData(token: string, targetDate?: string) {
    return this.request('/premium/astrologer/solar-return-data', token, { targetDate })
  }

  static getLunarReturnData(token: string, targetDate?: string) {
    return this.request('/premium/astrologer/lunar-return-data', token, { targetDate })
  }

  static getCreditsStatus(token: string) {
    return this.request('/premium/credits/status', token, {})
  }

  static purchaseCredits(token: string, packId: string) {
    return this.request('/premium/credits/purchase', token, { packId })
  }

  static getCreditsHistory(token: string, limit = 50) {
    const qs = `?limit=${encodeURIComponent(String(limit))}`
    return this.requestGet(`/premium/credits/history${qs}`, token)
  }

  static registerWhatsApp(token: string, phone: string) {
    return this.request('/premium/whatsapp/register', token, { phone })
  }

  static async exportPdf(token: string, payload: Record<string, any>) {
    const response = await fetch(`${this.BACKEND_URL}/premium/export-pdf`, {
      method: 'POST',
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload || {}),
    })
    if (!response.ok) {
      const payloadError = await response.json().catch(() => ({}))
      const error = payloadError?.error || `HTTP_${response.status}`
      const message = payloadError?.message || payloadError?.error || 'Erro ao exportar PDF'
      const err = new Error(message)
      ;(err as any).code = error
      throw err
    }
    if (typeof (response as any).blob === 'function') {
      return (response as any).blob()
    }
    return response.arrayBuffer()
  }
}

export default AstrologerPremiumService
