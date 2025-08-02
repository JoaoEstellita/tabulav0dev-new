export interface ProkeralaCredentials {
  clientId: string
  clientSecret: string
  isActive: boolean
  requestCount: number
  lastUsed: Date | null
}

// Baseado na imagem fornecida - apenas 1 cliente ativo
export const PROKERALA_CREDENTIALS: ProkeralaCredentials[] = [
  {
    clientId: "0f1911d5-42f1-4c3f-82df-cc7c1995a621",
    clientSecret: "8ICawBeH6Mob1Hkxb9AqdnHmdQQF9yMcjhtZMMCl",
    isActive: true,
    requestCount: 0,
    lastUsed: null,
  },
]

// Configuração da API Prokerala
export const PROKERALA_CONFIG = {
  baseUrl: "https://api.prokerala.com/v2",
  credentials: PROKERALA_CREDENTIALS,
  defaultLocation: {
    place: "New Delhi, India",
    coordinates: "28.7041,77.1025"
  }
}

export const FALLBACK_APIS = {
  freeAstrology: "https://api.freeastrologyapi.com",
  aztro: "https://aztro.sameerkumar.website",
  jyotish: "https://api.jyotish.com", // quando implementar
}
