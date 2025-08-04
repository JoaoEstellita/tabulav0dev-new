import { useState, useEffect } from 'react'
import { useAuth } from './useAuth'
import MercadoPagoService, { type UserSubscription, type SubscriptionPlan } from '../services/mercadopago/MercadoPagoService'

export interface UseSubscriptionReturn {
  subscription: UserSubscription | null
  plans: SubscriptionPlan[]
  loading: boolean
  error: string | null
  isInTrial: boolean
  trialDaysRemaining: number
  createSubscription: (planId: string) => Promise<{ paymentUrl: string }>
  cancelSubscription: () => Promise<void>
  refreshSubscription: () => Promise<void>
}

export function useSubscription(): UseSubscriptionReturn {
  const { user } = useAuth()
  const [subscription, setSubscription] = useState<UserSubscription | null>(null)
  const [plans, setPlans] = useState<SubscriptionPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isInTrial, setIsInTrial] = useState(false)
  const [trialDaysRemaining, setTrialDaysRemaining] = useState(0)

  useEffect(() => {
    if (user) {
      loadSubscriptionData()
    }
  }, [user])

  const loadSubscriptionData = async () => {
    if (!user) return

    try {
      setLoading(true)
      setError(null)

      // Carregar planos disponíveis
      const availablePlans = await MercadoPagoService.getAvailablePlans()
      setPlans(availablePlans)

      // Verificar assinatura atual
      const currentSubscription = await MercadoPagoService.checkUserSubscription(user.uid)
      setSubscription(currentSubscription)

      // Verificar período de teste
      const inTrial = await MercadoPagoService.isInTrialPeriod(user.uid)
      setIsInTrial(inTrial)

      if (inTrial) {
        const daysRemaining = await MercadoPagoService.getTrialDaysRemaining(user.uid)
        setTrialDaysRemaining(daysRemaining)
      }

    } catch (error) {
      console.error('Erro ao carregar dados de assinatura:', error)
      setError('Erro ao carregar dados de assinatura')
    } finally {
      setLoading(false)
    }
  }

  const createSubscription = async (planId: string): Promise<{ paymentUrl: string }> => {
    if (!user) throw new Error('Usuário não autenticado')

    try {
      setLoading(true)
      setError(null)

      const result = await MercadoPagoService.createSubscription(user.uid, planId)
      
      // Atualizar estado local
      setSubscription(result.subscription)
      setIsInTrial(true)
      setTrialDaysRemaining(7) // 7 dias de teste

      return { paymentUrl: result.paymentUrl }
    } catch (error) {
      console.error('Erro ao criar assinatura:', error)
      setError('Erro ao criar assinatura')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const cancelSubscription = async (): Promise<void> => {
    if (!subscription) throw new Error('Nenhuma assinatura encontrada')

    try {
      setLoading(true)
      setError(null)

      await MercadoPagoService.cancelSubscription(subscription.id)
      
      // Atualizar estado local
      setSubscription({ ...subscription, status: 'cancelled' })
      setIsInTrial(false)
      setTrialDaysRemaining(0)

    } catch (error) {
      console.error('Erro ao cancelar assinatura:', error)
      setError('Erro ao cancelar assinatura')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const refreshSubscription = async (): Promise<void> => {
    await loadSubscriptionData()
  }

  return {
    subscription,
    plans,
    loading,
    error,
    isInTrial,
    trialDaysRemaining,
    createSubscription,
    cancelSubscription,
    refreshSubscription
  }
} 