/**
 * MERCADO PAGO SERVICE
 *
 * - Criacao de preferencias de pagamento
 * - Gerenciamento de assinaturas
 */

import { Platform } from 'react-native'
import { PLAN_DEFINITIONS } from '../../constants/plans'
import { backendFetch } from '../backend/client'

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
  provider?: 'mercadopago' | 'stripe' | null
  expiresAt: Date | null
  nextBillingDate: Date | null
  status: 'active' | 'expired' | 'cancelled' | 'pending' | 'trial'
  trialEndsAt: Date | null
}

export interface GiftSubscriptionOption {
  id: string
  targetPlanId: string
  label: string
  durationDays: number
  priceBRL: number
  priceUSD: number
}

export interface GiftSubscriptionCode {
  id: string
  code: string
  status: 'available' | 'redeemed' | 'disabled_owner_inactive' | string
  giftPlanId: string | null
  targetPlanId: string | null
  targetPlanLabel: string | null
  durationDays: number
  validUntil: string | null
  createdAt: string | null
  redeemedByUid: string | null
  redeemedAt: string | null
}

export class MercadoPagoService {
  private static readonly FRONTEND_URL = (() => {
    const raw = String(
      process.env.EXPO_PUBLIC_FRONTEND_URL || process.env.EXPO_PUBLIC_SITE_URL || 'https://tabulaestelar.com.br',
    ).trim()
    const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`
    return withProtocol.replace(/\/$/, '')
  })()

  private static buildBackUrls() {
    if (Platform.OS === 'web') {
      return {
        success: `${this.FRONTEND_URL}/Tabs/Premium?provider=mercadopago&checkout=success`,
        failure: `${this.FRONTEND_URL}/Tabs/Premium?provider=mercadopago&checkout=failure`,
        pending: `${this.FRONTEND_URL}/Tabs/Premium?provider=mercadopago&checkout=pending`,
      }
    }
    return {
      success: 'tabulaestelar://payment/success',
      failure: 'tabulaestelar://payment/failure',
      pending: 'tabulaestelar://payment/pending',
    }
  }

  static readonly PLANS: SubscriptionPlan[] = PLAN_DEFINITIONS.map((plan) => ({
    id: plan.id,
    name: `${plan.name} Mensal`,
    description: plan.features[0] || 'Plano premium',
    price: plan.price,
    currency: 'BRL',
    frequency: 'monthly',
    duration: 1,
    trialDays: 7,
    features: plan.features,
  }))

  static async createPaymentPreference(paymentData: PaymentData): Promise<PaymentPreference> {
    try {
      const response = await backendFetch('/api/mercado-pago/create-preference', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        auth: true,
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
          notification_url: `${(process.env.EXPO_PUBLIC_BACKEND_URL || 'https://tabulav0dev-backend.vercel.app').replace(/\/$/, '')}/api/mercado-pago/webhook`,
          back_urls: this.buildBackUrls(),
          auto_return: 'approved',
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

  /**
   * Na VOLTA do checkout MP: pede ao backend pra buscar o pagamento aprovado
   * deste usuário e ativar na hora, sem depender do webhook. Idempotente.
   * Nunca lança — a tela segue lendo o status normalmente se falhar.
   */
  static async syncMercadoPago(userId: string): Promise<{ activated: boolean; status?: string }> {
    try {
      const response = await backendFetch('/api/mercado-pago/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        auth: true,
        body: JSON.stringify({ userId })
      })
      if (!response.ok) return { activated: false }
      const data = await response.json().catch(() => ({}))
      return { activated: !!data?.activated, status: data?.status }
    } catch {
      return { activated: false }
    }
  }

  static async getSubscriptionStatus(userId: string): Promise<SubscriptionStatus> {
    try {
      const response = await backendFetch('/api/subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        auth: true,
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
        provider: status.provider || null,
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
        provider: null,
        expiresAt: null,
        nextBillingDate: null,
        status: 'expired',
        trialEndsAt: null
      }
    }
  }

  static async startFreeTrial(userId: string, planId: string): Promise<boolean> {
    try {
      const response = await backendFetch('/api/subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        auth: true,
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
      const response = await backendFetch('/api/subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        auth: true,
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
      const response = await backendFetch('/api/subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        auth: true,
        body: JSON.stringify({ action: 'reactivate', userId })
      })

      return response.ok
    } catch (error) {
      console.error('Erro ao reativar assinatura:', error)
      return false
    }
  }

  static async getGiftSubscriptionOptions(userId: string): Promise<GiftSubscriptionOption[]> {
    try {
      const response = await backendFetch('/api/subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        auth: true,
        body: JSON.stringify({ action: 'gift-options', userId }),
      })
      if (!response.ok) return []
      const data = await response.json()
      return Array.isArray(data?.data?.giftOptions) ? data.data.giftOptions : []
    } catch (error) {
      console.error('Erro ao buscar opcoes de assinatura extra:', error)
      return []
    }
  }

  static async getGiftSubscriptionCodes(userId: string): Promise<GiftSubscriptionCode[]> {
    try {
      const response = await backendFetch('/api/subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        auth: true,
        body: JSON.stringify({ action: 'gift-list', userId }),
      })
      if (!response.ok) return []
      const data = await response.json()
      return Array.isArray(data?.data?.codes) ? data.data.codes : []
    } catch (error) {
      console.error('Erro ao buscar codigos de assinatura extra:', error)
      return []
    }
  }

  static async redeemGiftSubscriptionCode(userId: string, giftCode: string): Promise<{ ok: boolean; message?: string }> {
    try {
      const response = await backendFetch('/api/subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        auth: true,
        body: JSON.stringify({ action: 'gift-redeem', userId, giftCode }),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok || data?.ok === false) {
        return { ok: false, message: data?.error?.message || 'Nao foi possivel ativar o codigo.' }
      }
      return { ok: true }
    } catch (error) {
      console.error('Erro ao resgatar codigo de assinatura extra:', error)
      return { ok: false, message: 'Nao foi possivel ativar o codigo.' }
    }
  }

  static getPlanById(planId: string): SubscriptionPlan | null {
    return this.PLANS.find(plan => plan.id === planId) || null
  }

  static getYearlySavings(): number {
    return 0
  }

  static isInTrial(subscriptionStatus: SubscriptionStatus): boolean {
    return (
      subscriptionStatus.status === 'trial' &&
      !!subscriptionStatus.trialEndsAt &&
      subscriptionStatus.trialEndsAt > new Date()
    )
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
    return !!subscriptionStatus.isActive ||
      subscriptionStatus.status === 'trial' ||
      (subscriptionStatus.status === 'pending' &&
        !!subscriptionStatus.trialEndsAt &&
        subscriptionStatus.trialEndsAt > new Date())
  }
}

export default MercadoPagoService
