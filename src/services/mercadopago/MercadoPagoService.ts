import axios from 'axios'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { db } from '../../config/firebase'

export interface SubscriptionPlan {
  id: string
  name: string
  price: number
  currency: string
  interval: 'month' | 'year'
  trialDays: number
  features: string[]
}

export interface UserSubscription {
  id: string
  userId: string
  planId: string
  status: 'active' | 'cancelled' | 'expired' | 'trial'
  startDate: Date
  endDate: Date
  trialEndDate?: Date
  mercadopagoId?: string
  autoRenew: boolean
}

export interface PaymentMethod {
  id: string
  type: 'credit_card' | 'debit_card' | 'pix' | 'boleto'
  lastFourDigits?: string
  brand?: string
  isDefault: boolean
}

class MercadoPagoService {
  private readonly apiUrl = 'https://api.mercadopago.com'
  private readonly accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN || 'TEST-123456789'
  private readonly webhookUrl = process.env.MERCADOPAGO_WEBHOOK_URL || 'https://tabula-estelar-backend.vercel.app/api/mercadopago-webhook'

  // Planos disponíveis
  private readonly plans: SubscriptionPlan[] = [
    {
      id: 'basic-monthly',
      name: 'Plano Básico Mensal',
      price: 19.90,
      currency: 'BRL',
      interval: 'month',
      trialDays: 7,
      features: [
        'Trânsitos diários',
        'Mapa natal permanente',
        'Alertas críticos',
        'Suporte básico'
      ]
    },
    {
      id: 'premium-monthly',
      name: 'Plano Premium Mensal',
      price: 39.90,
      currency: 'BRL',
      interval: 'month',
      trialDays: 7,
      features: [
        'Tudo do plano básico',
        'Compatibilidade de casais',
        'Relatórios detalhados',
        'Suporte prioritário',
        'Notificações avançadas'
      ]
    }
  ]

  /**
   * Obter planos disponíveis
   */
  async getAvailablePlans(): Promise<SubscriptionPlan[]> {
    return this.plans
  }

  /**
   * Verificar se usuário tem assinatura ativa
   */
  async checkUserSubscription(userId: string): Promise<UserSubscription | null> {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId))
      if (!userDoc.exists()) return null

      const userData = userDoc.data()
      const subscription = userData.subscription

      if (!subscription) return null

      // Verificar se assinatura ainda está ativa
      const now = new Date()
      const endDate = new Date(subscription.endDate)
      
      if (endDate < now && subscription.status === 'active') {
        // Atualizar status para expirado
        await this.updateSubscriptionStatus(userId, 'expired')
        return { ...subscription, status: 'expired' }
      }

      return subscription
    } catch (error) {
      console.error('Erro ao verificar assinatura:', error)
      return null
    }
  }

  /**
   * Criar assinatura com período de teste
   */
  async createSubscription(userId: string, planId: string): Promise<{ subscription: UserSubscription; paymentUrl: string }> {
    try {
      const plan = this.plans.find(p => p.id === planId)
      if (!plan) throw new Error('Plano não encontrado')

      const now = new Date()
      const trialEndDate = new Date(now.getTime() + (plan.trialDays * 24 * 60 * 60 * 1000))
      const endDate = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000)) // 30 dias

      const subscription: UserSubscription = {
        id: `sub_${userId}_${Date.now()}`,
        userId,
        planId,
        status: 'trial',
        startDate: now,
        endDate,
        trialEndDate,
        autoRenew: true
      }

      // Salvar no Firestore
      await setDoc(doc(db, 'subscriptions', subscription.id), subscription)
      
      // Atualizar usuário
      await updateDoc(doc(db, 'users', userId), {
        subscription: subscription
      })

      // Criar preferência de pagamento no Mercado Pago
      const paymentUrl = await this.createMercadoPagoPreference(subscription, plan)

      return { subscription, paymentUrl }
    } catch (error) {
      console.error('Erro ao criar assinatura:', error)
      throw error
    }
  }

  /**
   * Criar preferência de pagamento no Mercado Pago
   */
  private async createMercadoPagoPreference(subscription: UserSubscription, plan: SubscriptionPlan): Promise<string> {
    try {
      const preference = {
        items: [
          {
            title: plan.name,
            unit_price: plan.price,
            quantity: 1,
            currency_id: plan.currency
          }
        ],
        back_urls: {
          success: `${process.env.APP_URL}/subscription/success`,
          failure: `${process.env.APP_URL}/subscription/failure`,
          pending: `${process.env.APP_URL}/subscription/pending`
        },
        auto_return: 'approved',
        external_reference: subscription.id,
        notification_url: this.webhookUrl,
        expires: true,
        expiration_date_from: new Date().toISOString(),
        expiration_date_to: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24h
      }

      const response = await axios.post(
        `${this.apiUrl}/checkout/preferences`,
        preference,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      )

      return response.data.init_point
    } catch (error) {
      console.error('Erro ao criar preferência Mercado Pago:', error)
      throw error
    }
  }

  /**
   * Processar webhook do Mercado Pago
   */
  async processWebhook(data: any): Promise<void> {
    try {
      const { type, data: paymentData } = data

      if (type === 'payment') {
        const payment = paymentData
        const subscriptionId = payment.external_reference

        if (payment.status === 'approved') {
          await this.activateSubscription(subscriptionId, payment.id)
        } else if (payment.status === 'rejected' || payment.status === 'cancelled') {
          await this.cancelSubscription(subscriptionId)
        }
      }
    } catch (error) {
      console.error('Erro ao processar webhook:', error)
      throw error
    }
  }

  /**
   * Ativar assinatura após pagamento aprovado
   */
  private async activateSubscription(subscriptionId: string, mercadopagoId: string): Promise<void> {
    try {
      const subscriptionDoc = await getDoc(doc(db, 'subscriptions', subscriptionId))
      if (!subscriptionDoc.exists()) return

      const subscription = subscriptionDoc.data() as UserSubscription
      
      // Atualizar assinatura
      await updateDoc(doc(db, 'subscriptions', subscriptionId), {
        status: 'active',
        mercadopagoId,
        startDate: new Date()
      })

      // Atualizar usuário
      await updateDoc(doc(db, 'users', subscription.userId), {
        'subscription.status': 'active',
        'subscription.mercadopagoId': mercadopagoId,
        'subscription.startDate': new Date()
      })

      console.log(`✅ Assinatura ${subscriptionId} ativada`)
    } catch (error) {
      console.error('Erro ao ativar assinatura:', error)
      throw error
    }
  }

  /**
   * Cancelar assinatura
   */
  async cancelSubscription(subscriptionId: string): Promise<void> {
    try {
      await updateDoc(doc(db, 'subscriptions', subscriptionId), {
        status: 'cancelled',
        autoRenew: false
      })

      const subscriptionDoc = await getDoc(doc(db, 'subscriptions', subscriptionId))
      if (subscriptionDoc.exists()) {
        const subscription = subscriptionDoc.data() as UserSubscription
        await updateDoc(doc(db, 'users', subscription.userId), {
          'subscription.status': 'cancelled',
          'subscription.autoRenew': false
        })
      }

      console.log(`❌ Assinatura ${subscriptionId} cancelada`)
    } catch (error) {
      console.error('Erro ao cancelar assinatura:', error)
      throw error
    }
  }

  /**
   * Atualizar status da assinatura
   */
  private async updateSubscriptionStatus(userId: string, status: UserSubscription['status']): Promise<void> {
    try {
      await updateDoc(doc(db, 'users', userId), {
        'subscription.status': status
      })
    } catch (error) {
      console.error('Erro ao atualizar status da assinatura:', error)
    }
  }

  /**
   * Verificar se usuário está em período de teste
   */
  async isInTrialPeriod(userId: string): Promise<boolean> {
    const subscription = await this.checkUserSubscription(userId)
    if (!subscription) return false

    const now = new Date()
    const trialEndDate = subscription.trialEndDate ? new Date(subscription.trialEndDate) : null

    return subscription.status === 'trial' && trialEndDate && trialEndDate > now
  }

  /**
   * Obter dias restantes do teste
   */
  async getTrialDaysRemaining(userId: string): Promise<number> {
    const subscription = await this.checkUserSubscription(userId)
    if (!subscription || !subscription.trialEndDate) return 0

    const now = new Date()
    const trialEndDate = new Date(subscription.trialEndDate)
    const diffTime = trialEndDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    return Math.max(0, diffDays)
  }
}

export default new MercadoPagoService() 