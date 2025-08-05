/**
 * 💳 MERCADO PAGO SERVICE 💳
 * 
 * Serviço completo para integração com Mercado Pago
 * - Criação de preferências de pagamento
 * - Gerenciamento de assinaturas
 * - Validação de webhooks
 * - Controle de planos premium
 */

export interface SubscriptionPlan {
  id: string
  name: string
  description: string
  price: number
  currency: string
  frequency: 'monthly' | 'yearly'
  duration: number // em meses
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
  private static readonly BACKEND_URL = 'https://tabula-estelar-new.vercel.app/api'
  
  // Planos disponíveis
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
        '🤖 IA Astrológica Conversacional',
        '💑 Matching Astrológico de Casais',
        '📊 Relatórios Detalhados',
        '📈 Previsões Avançadas',
        '🎯 Análises Personalizadas',
        '📱 Suporte Prioritário'
      ]
    },
    {
      id: 'premium_yearly',
      name: 'Premium Anual',
      description: 'Plano anual com desconto especial',
      price: 199.90,
      currency: 'BRL',
      frequency: 'yearly',
      duration: 12,
      trialDays: 14,
      popular: true,
      features: [
        '🤖 IA Astrológica Conversacional',
        '💑 Matching Astrológico de Casais',
        '📊 Relatórios Detalhados',
        '📈 Previsões Avançadas',
        '🎯 Análises Personalizadas',
        '📱 Suporte Prioritário',
        '💰 50% de Desconto',
        '🎁 Recursos Exclusivos'
      ]
    }
  ]
  
  /**
   * Cria preferência de pagamento no Mercado Pago
   */
  static async createPaymentPreference(paymentData: PaymentData): Promise<PaymentPreference> {
    try {
      const response = await fetch(`${this.BACKEND_URL}/mercado-pago/create-preference`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: paymentData.userId,
          planId: paymentData.planId,
          payer: {
            email: paymentData.email,
            name: paymentData.name,
          },
          items: [{
            title: paymentData.description,
            quantity: 1,
            unit_price: paymentData.amount,
            currency_id: 'BRL',
          }],
          external_reference: paymentData.externalReference,
          notification_url: `${this.BACKEND_URL}/mercado-pago/webhook`,
          success_url: 'tabulaestelar://payment/success',
          failure_url: 'tabulaestelar://payment/failure',
          pending_url: 'tabulaestelar://payment/pending',
        })
      })
      
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`)
      }
      
      const preference = await response.json()
      return preference
      
    } catch (error) {
      console.error('Erro ao criar preferência de pagamento:', error)
      throw new Error('Falha ao processar pagamento. Tente novamente.')
    }
  }
  
  /**
   * Verifica status da assinatura do usuário
   */
  static async getSubscriptionStatus(userId: string): Promise<SubscriptionStatus> {
    try {
      const response = await fetch(`${this.BACKEND_URL}/subscription/status/${userId}`)
      
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`)
      }
      
      const data = await response.json()
      
      return {
        isActive: data.isActive || false,
        planId: data.planId || null,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
        nextBillingDate: data.nextBillingDate ? new Date(data.nextBillingDate) : null,
        status: data.status || 'expired',
        trialEndsAt: data.trialEndsAt ? new Date(data.trialEndsAt) : null,
      }
      
    } catch (error) {
      console.error('Erro ao verificar status da assinatura:', error)
      // Retorna status padrão em caso de erro
      return {
        isActive: false,
        planId: null,
        expiresAt: null,
        nextBillingDate: null,
        status: 'expired',
        trialEndsAt: null,
      }
    }
  }
  
  /**
   * Inicia trial gratuito
   */
  static async startFreeTrial(userId: string, planId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.BACKEND_URL}/subscription/start-trial`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          planId,
        })
      })
      
      return response.ok
      
    } catch (error) {
      console.error('Erro ao iniciar trial:', error)
      return false
    }
  }
  
  /**
   * Cancela assinatura
   */
  static async cancelSubscription(userId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.BACKEND_URL}/subscription/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId })
      })
      
      return response.ok
      
    } catch (error) {
      console.error('Erro ao cancelar assinatura:', error)
      return false
    }
  }
  
  /**
   * Reativa assinatura cancelada
   */
  static async reactivateSubscription(userId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.BACKEND_URL}/subscription/reactivate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId })
      })
      
      return response.ok
      
    } catch (error) {
      console.error('Erro ao reativar assinatura:', error)
      return false
    }
  }
  
  /**
   * Obtém plano por ID
   */
  static getPlanById(planId: string): SubscriptionPlan | null {
    return this.PLANS.find(plan => plan.id === planId) || null
  }
  
  /**
   * Calcula economia do plano anual
   */
  static getYearlySavings(): number {
    const monthlyPlan = this.getPlanById('premium_monthly')
    const yearlyPlan = this.getPlanById('premium_yearly')
    
    if (!monthlyPlan || !yearlyPlan) return 0
    
    const monthlyYearCost = monthlyPlan.price * 12
    return monthlyYearCost - yearlyPlan.price
  }
  
  /**
   * Verifica se usuário está em trial
   */
  static isInTrial(subscriptionStatus: SubscriptionStatus): boolean {
    return subscriptionStatus.status === 'trial' && 
           subscriptionStatus.trialEndsAt && 
           subscriptionStatus.trialEndsAt > new Date()
  }
  
  /**
   * Calcula dias restantes do trial
   */
  static getTrialDaysRemaining(subscriptionStatus: SubscriptionStatus): number {
    if (!this.isInTrial(subscriptionStatus) || !subscriptionStatus.trialEndsAt) {
      return 0
    }
    
    const now = new Date()
    const diffTime = subscriptionStatus.trialEndsAt.getTime() - now.getTime()
    return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)))
  }
  
  /**
   * Gera ID de referência externa único
   */
  static generateExternalReference(userId: string, planId: string): string {
    const timestamp = Date.now()
    return `sub_${userId}_${planId}_${timestamp}`
  }
  
  /**
   * Formata preço para exibição
   */
  static formatPrice(price: number, currency: string = 'BRL'): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: currency,
    }).format(price)
  }
  
  /**
   * Verifica se tem acesso a recursos premium
   */
  static hasPremiumAccess(subscriptionStatus: SubscriptionStatus): boolean {
    return subscriptionStatus.isActive || 
           subscriptionStatus.status === 'trial' ||
           (subscriptionStatus.status === 'pending' && subscriptionStatus.trialEndsAt && subscriptionStatus.trialEndsAt > new Date())
  }
}

export default MercadoPagoService