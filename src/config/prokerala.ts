export interface ProkeralaCredentials {
  clientId: string
  clientSecret: string
  isActive: boolean
  requestCount: number
  lastUsed: Date | null
}

// 4 chaves da Prokerala para rotação e fallback
export const PROKERALA_CREDENTIALS: ProkeralaCredentials[] = [
  {
    clientId: "0f1911d5-42f1-4c3f-82df-cc7c1995a621",
    clientSecret: "8ICawBeH6Mob1Hkxb9AqdnHmdQQF9yMcjhtZMMCl",
    isActive: true,
    requestCount: 0,
    lastUsed: null,
  },
  {
    clientId: "ef682113-fd34-426e-bbe0-cfa241b036cb", 
    clientSecret: "ACLvxPv337zaYn9GiVcRsU0XQjMms6JMiZhF6wXb",
    isActive: true,
    requestCount: 0,
    lastUsed: null,
  },
  {
    clientId: "ade5a2ed-9941-4861-97db-ffef1878a032",
    clientSecret: "b4kjNOByUJbQegpsdpd60u8qXVlwfaezG7edkaRi", 
    isActive: true,
    requestCount: 0,
    lastUsed: null,
  },
  {
    clientId: "b7336b51-32b9-4a65-87a8-cfb9d5be6bea",
    clientSecret: "uxiz04zam0BZeiblQtudvIsi1NRHjyRlB0dHUVjP",
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
