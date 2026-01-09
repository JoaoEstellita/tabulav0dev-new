/**
 * MERCADO PAGO SERVICE
 *
 * - Criacao de preferencias de pagamento
 * - Gerenciamento de assinaturas
 */

export interface SubscriptionPlan {
  id: string
  name: string
  description: string
  price: number
  currency: string
  frequency: 'monthly' | 'yearly'
  duration: number
  features: string[]
  popular?: boolean
  trialDays?: number
}

export interface PaymentPreference {
  id: string
  init_point: string
  sandbox_init_point: string
  checkout_url: string
}

export interface PaymentData {
  userId: string
  planId: string
  email: string
  name: string
  amount: number
  description: string
  externalReference: string
  paymentMethod?: 'card'
}

export interface SubscriptionStatus {
  isActive: boolean
  planId: string | null
  expiresAt: Date | null
  nextBillingDate: Date | null
  status: 'active' | 'expired' | 'cancelled' | 'pending' | 'trial'
  trialEndsAt: Date | null
}

export class MercadoPagoService {
  private static readonly BACKEND_URL = (process.env.EXPO_PUBLIC_BACKEND_URL || '').replace(/\/$/, '') + '/api'

  static readonly PLANS: SubscriptionPlan[] = [
    {
      id: 'premium_monthly',
      name: 'Premium Mensal',
      description: 'Acesso completo aos recursos premium',
      price: 19.90,
      currency: 'BRL',
      frequency: 'monthly',
      duration: 1,
      trialDays: 7,
      features: [
        'IA Astrologica Conversacional',
        'Matching Astrologico de Casais',
        'Relatorios Detalhados',
        'Previsoes Avancadas',
        'Analises Personalizadas',
        'Grupos Astrologicos Ilimitados'
      ]
    }
  ]

  static async createPaymentPreference(paymentData: PaymentData): Promise<PaymentPreference> {
    try {
      const response = await fetch(`${this.BACKEND_URL}/mercado-pago/create-preference`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: paymentData.userId,
          planId: paymentData.planId,
          payer: {
            email: paymentData.email,
            name: paymentData.name
          },
          items: [{
            title: paymentData.description,
            quantity: 1,
            unit_price: paymentData.amount,
            currency_id: 'BRL'
          }],
          external_reference: paymentData.externalReference,
          notification_url: `${this.BACKEND_URL}/mercado-pago/webhook`,
          success_url: 'tabulaestelar://payment/success',
          failure_url: 'tabulaestelar://payment/failure',
          pending_url: 'tabulaestelar://payment/pending',
          payment_method: paymentData.paymentMethod || null
        })
      })

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`)
      }

      const preference = await response.json()
      return preference
    } catch (error) {
      console.error('Erro ao criar preferencia de pagamento:', error)
      throw new Error('Falha ao processar pagamento. Tente novamente.')
    }
  }

  static async getSubscriptionStatus(userId: string): Promise<SubscriptionStatus> {
    try {
      const response = await fetch(`${this.BACKEND_URL}/subscription`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'status', userId })
      })

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`)
      }

      const data = await response.json()
      const status = data?.data?.subscription || data?.subscription || {}

      return {
        isActive: !!status.isActive,
        planId: status.planId || null,
        expiresAt: status.expiresAt ? new Date(status.expiresAt) : null,
        nextBillingDate: status.nextBillingDate ? new Date(status.nextBillingDate) : null,
        status: status.status || 'expired',
        trialEndsAt: status.trialEndsAt ? new Date(status.trialEndsAt) : null
      }
    } catch (error) {
      console.error('Erro ao verificar status da assinatura:', error)
      return {
        isActive: false,
        planId: null,
        expiresAt: null,
        nextBillingDate: null,
        status: 'expired',
        trialEndsAt: null
      }
    }
  }

  static async startFreeTrial(userId: string, planId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.BACKEND_URL}/subscription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action: 'start-trial', userId, planId })
      })

      return response.ok
    } catch (error) {
      console.error('Erro ao iniciar trial:', error)
      return false
    }
  }

  static async cancelSubscription(userId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.BACKEND_URL}/subscription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action: 'cancel', userId })
      })

      return response.ok
    } catch (error) {
      console.error('Erro ao cancelar assinatura:', error)
      return false
    }
  }

  static async reactivateSubscription(userId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.BACKEND_URL}/subscription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action: 'reactivate', userId })
      })

      return response.ok
    } catch (error) {
      console.error('Erro ao reativar assinatura:', error)
      return false
    }
  }

  static getPlanById(planId: string): SubscriptionPlan | null {
    return this.PLANS.find(plan => plan.id === planId) || null
  }

  static getYearlySavings(): number {
    return 0
  }

  static isInTrial(subscriptionStatus: SubscriptionStatus): boolean {
    return subscriptionStatus.status === 'trial' &&
      subscriptionStatus.trialEndsAt &&
      subscriptionStatus.trialEndsAt > new Date()
  }

  static getTrialDaysRemaining(subscriptionStatus: SubscriptionStatus): number {
    if (!this.isInTrial(subscriptionStatus) || !subscriptionStatus.trialEndsAt) {
      return 0
    }

    const now = new Date()
    const diffTime = subscriptionStatus.trialEndsAt.getTime() - now.getTime()
    return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)))
  }

  static generateExternalReference(userId: string, planId: string): string {
    const timestamp = Date.now()
    return `sub_${userId}_${planId}_${timestamp}`
  }

  static formatPrice(price: number, currency: string = 'BRL'): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: currency
    }).format(price)
  }

  static hasPremiumAccess(subscriptionStatus: SubscriptionStatus): boolean {
    return subscriptionStatus.isActive ||
      subscriptionStatus.status === 'trial' ||
      (subscriptionStatus.status === 'pending' && subscriptionStatus.trialEndsAt && subscriptionStatus.trialEndsAt > new Date())
  }
}

export default MercadoPagoService
