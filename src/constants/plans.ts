export type PlanTier = 'essential' | 'pro' | 'premium'
export type PlanId = 'essential_monthly' | 'pro_monthly' | 'premium_monthly'

export type PlanDefinition = {
  id: PlanId
  tier: PlanTier
  name: string
  price: number
  forecastMaxDays: 7 | 30 | 90 | 360
  creditsPerMonth: number
  includesGroups: boolean
  includesChatbot: boolean
  requiresWhatsapp: boolean
  features: string[]
}

export const PLAN_DEFINITIONS: PlanDefinition[] = [
  {
    id: 'essential_monthly',
    tier: 'essential',
    name: 'Essential',
    price: 19.90,
    forecastMaxDays: 7,
    creditsPerMonth: 0,
    includesGroups: true,
    includesChatbot: false,
    requiresWhatsapp: true,
    features: [
      'Acesso a grupos',
      'Forecast: 7 dias',
      'Alertas essenciais',
      'Notificações WhatsApp',
    ],
  },
  {
    id: 'pro_monthly',
    tier: 'pro',
    name: 'Pro',
    price: 47.90,
    forecastMaxDays: 90,
    creditsPerMonth: 1,
    includesGroups: true,
    includesChatbot: false,
    requiresWhatsapp: true,
    features: [
      'Tudo do Essential +',
      'Forecast: 7/30/90 dias',
      '1 credito Astrologer / mes',
      'Hub premium (limitado)',
    ],
  },
  {
    id: 'premium_monthly',
    tier: 'premium',
    name: 'Premium',
    price: 79.90,
    forecastMaxDays: 360,
    creditsPerMonth: 10,
    includesGroups: true,
    includesChatbot: true,
    requiresWhatsapp: true,
    features: [
      'Tudo do Pro +',
      'Forecast: 7/30/90/360 dias',
      '10 creditos Astrologer / mes',
      'Chatbot WhatsApp IA',
    ],
  },
]

export const CREDIT_PACKS = [
  { id: 'credits_1', label: '1 credito', price: 14.90 },
  { id: 'credits_5', label: '5 creditos', price: 49.90 },
  { id: 'credits_10', label: '10 creditos', price: 89.90 },
]

export const getPlanById = (planId?: string | null) => {
  if (!planId) return null
  const normalized = planId.toLowerCase() as PlanId
  return PLAN_DEFINITIONS.find((plan) => plan.id === normalized) || null
}

export const getForecastMaxDays = ({
  planId,
  isAdmin,
  isActive,
}: {
  planId?: string | null
  isAdmin?: boolean
  isActive?: boolean
}) => {
  if (isAdmin) return 360
  if (!isActive) return 7
  const plan = getPlanById(planId)
  return plan?.forecastMaxDays || 7
}
