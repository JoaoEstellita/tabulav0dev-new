import { useState, useEffect } from 'react'
import { useAuth } from './useAuth'
import { MercadoPagoService, type SubscriptionPlan, type SubscriptionStatus } from '../services/payment/MercadoPagoService'

export interface UseSubscriptionReturn {
  subscription: SubscriptionStatus | null
  plans: SubscriptionPlan[]
  loading: boolean
  error: string | null
  isInTrial: boolean
  trialDaysRemaining: number
  refreshSubscription: () => Promise<void>
}

export function useSubscription(): UseSubscriptionReturn {
  const { user } = useAuth()
  const [subscription, setSubscription] = useState<SubscriptionStatus | null>(null)
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

      setPlans(MercadoPagoService.PLANS)

      const currentSubscription = await MercadoPagoService.getSubscriptionStatus(user.uid)
      setSubscription(currentSubscription)

      const inTrial = MercadoPagoService.isInTrial(currentSubscription)
      setIsInTrial(inTrial)
      setTrialDaysRemaining(inTrial ? MercadoPagoService.getTrialDaysRemaining(currentSubscription) : 0)
    } catch (error) {
      console.error('Erro ao carregar dados de assinatura:', error)
      setError('Erro ao carregar dados de assinatura')
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
    refreshSubscription
  }
}
