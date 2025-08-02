export interface ProkeralaCredentials {
  clientId: string
  clientSecret: string
  isActive: boolean
  requestCount: number
  lastUsed: Date | null
}

// CREDENCIAIS REMOVIDAS POR SEGURANÇA
// Conforme diretriz da Prokerala (linhas 14-17):
// "You should not embed your credentials in such apps"
// As credenciais agora ficam APENAS no backend seguro

// Configuração da API Prokerala (apenas configurações públicas)
export const PROKERALA_CONFIG = {
  baseUrl: "https://api.prokerala.com/v2",
  // Backend seguro que gerencia as credenciais
  backendUrl: "https://tabulav0dev-backend.vercel.app",
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
