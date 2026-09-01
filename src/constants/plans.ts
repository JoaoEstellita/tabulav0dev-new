export type PlanTier = 'essential' | 'pro' | 'premium'
export type PlanBillingPeriod = 'monthly' | 'yearly'
export type PlanId =
  | 'essential_monthly'
  | 'pro_monthly'
  | 'premium_monthly'
  | 'essential_yearly'
  | 'pro_yearly'
  | 'premium_yearly'

// Feature flag dos planos anuais. Quando TRUE, o toggle Mensal/Anual e os planos
// anuais aparecem na tela de assinatura. Ligado após validar o meio de pagamento
// anual no Mercado Pago (ver docs/planos-anuais-guia-pagamento.md).
export const ANNUAL_ENABLED = true

// Assinatura anual RECORRENTE (cartão, renova sozinha). Provado em 08-27: o
// preapproval anual do MP fecha e devolve init_point com um comprador de conta
// MP real (o autoteste com email sintético falhava por exigência do MP, não por
// bug). Ligado → o período anual mostra o botão "Assinar anual" (cartão) + PIX.
export const ANNUAL_RECURRING_ENABLED = true

export type PlanDefinition = {
  id: PlanId
  tier: PlanTier
  billingPeriod: PlanBillingPeriod
  /** Meses de acesso concedidos por 1 pagamento (1 no mensal, 12 no anual). */
  months: number
  name: string
  /** Preço do ciclo inteiro em BRL (mensal = 1 mês; anual = 12 meses à vista). */
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
    billingPeriod: 'monthly',
    months: 1,
    name: 'Essential',
    price: 19.90,
    forecastMaxDays: 7,
    creditsPerMonth: 0,
    includesGroups: true,
    includesChatbot: true,
    requiresWhatsapp: true,
    features: [
      'Status diário das 8 áreas da vida',
      'Mapa natal Ocidental e Védico (Jyotish)',
      'Acesso a grupos',
      'Rede: match "quem mais combina com você"',
      'Sinastria detalhada com qualquer pessoa',
      'Forecast: 7 dias',
      'Astrólogo IA no WhatsApp — 3/dia',
    ],
  },
  {
    id: 'pro_monthly',
    tier: 'pro',
    billingPeriod: 'monthly',
    months: 1,
    name: 'Pro',
    price: 47.90,
    forecastMaxDays: 90,
    creditsPerMonth: 1,
    includesGroups: true,
    includesChatbot: true,
    requiresWhatsapp: true,
    features: [
      'Tudo do Essential +',
      '1 leitura premium/mês com IA (mapa, trânsitos, sinastria…)',
      'Forecast: 7/30/90 dias',
      'Astrólogo IA no WhatsApp — 6/dia',
    ],
  },
  {
    id: 'premium_monthly',
    tier: 'premium',
    billingPeriod: 'monthly',
    months: 1,
    name: 'Premium',
    price: 79.90,
    forecastMaxDays: 360,
    creditsPerMonth: 10,
    includesGroups: true,
    includesChatbot: true,
    requiresWhatsapp: true,
    features: [
      'Tudo do Pro +',
      '10 leituras premium/mês com IA (e compre mais quando quiser)',
      'Forecast: 7/30/90/360 dias',
      'Astrólogo IA no WhatsApp — 10/dia',
    ],
  },
  // ─── Anuais (2 meses grátis: paga 10 meses, leva 12) ────────────────────────
  {
    id: 'essential_yearly',
    tier: 'essential',
    billingPeriod: 'yearly',
    months: 12,
    name: 'Essential',
    price: 199.00, // 10 × 19,90
    forecastMaxDays: 7,
    creditsPerMonth: 0,
    includesGroups: true,
    includesChatbot: true,
    requiresWhatsapp: true,
    features: [
      'Status diário das 8 áreas da vida',
      'Mapa natal Ocidental e Védico (Jyotish)',
      'Acesso a grupos e Rede (match + sinastria)',
      'Forecast: 7 dias',
      'Astrólogo IA no WhatsApp — 3/dia',
      '2 meses grátis no plano anual',
    ],
  },
  {
    id: 'pro_yearly',
    tier: 'pro',
    billingPeriod: 'yearly',
    months: 12,
    name: 'Pro',
    price: 479.00, // 10 × 47,90
    forecastMaxDays: 90,
    creditsPerMonth: 1,
    includesGroups: true,
    includesChatbot: true,
    requiresWhatsapp: true,
    features: [
      'Tudo do Essential +',
      '1 leitura premium/mês com IA (mapa, trânsitos, sinastria…)',
      'Forecast: 7/30/90 dias',
      'Astrólogo IA no WhatsApp — 6/dia',
      '2 meses grátis no plano anual',
    ],
  },
  {
    id: 'premium_yearly',
    tier: 'premium',
    billingPeriod: 'yearly',
    months: 12,
    name: 'Premium',
    price: 799.00, // 10 × 79,90
    forecastMaxDays: 360,
    creditsPerMonth: 10,
    includesGroups: true,
    includesChatbot: true,
    requiresWhatsapp: true,
    features: [
      'Tudo do Pro +',
      '10 leituras premium/mês com IA (e compre mais quando quiser)',
      'Forecast: 7/30/90/360 dias',
      'Astrólogo IA no WhatsApp — 10/dia',
      '2 meses grátis no plano anual',
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

/** Planos de um período (monthly/yearly), na ordem de definição. */
export const getPlansByPeriod = (period: PlanBillingPeriod) =>
  PLAN_DEFINITIONS.filter((plan) => plan.billingPeriod === period)

/** Equivalente mensal de um plano anual (preço do ano ÷ 12), para exibição. */
export const getMonthlyEquivalent = (plan: PlanDefinition) =>
  plan.billingPeriod === 'yearly' ? plan.price / 12 : plan.price

/** Contrapartida anual de um plano mensal (mesmo tier), se existir. */
export const getYearlyCounterpart = (planId?: string | null) => {
  const plan = getPlanById(planId)
  if (!plan) return null
  return PLAN_DEFINITIONS.find((p) => p.tier === plan.tier && p.billingPeriod === 'yearly') || null
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
