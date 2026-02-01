import { useEffect, useState } from 'react'
import { MercadoPagoService } from '../services/payment/MercadoPagoService'
import { useAuth } from './useAuth'
import { db } from '../config/firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'

const TRIAL_DAYS = 7

interface SubscriptionResult {
  active: boolean
  status: string
  planId?: string | null
  expiresAt?: Date | null
  nextBillingDate?: Date | null
  trialEndsAt?: Date | null
}

export function useSubscriptionCheck() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [subscription, setSubscription] = useState<SubscriptionResult | null>(null)
  const [trialActive, setTrialActive] = useState(true)
  const [trialEndsAt, setTrialEndsAt] = useState<Date | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    async function check() {
      setLoading(true)
      if (!user?.uid) {
        setLoading(false)
        setShowModal(false)
        return
      }

      const userRef = doc(db, 'users', user.uid)
      const userDoc = await getDoc(userRef)
      const userData = userDoc.exists() ? userDoc.data() : {}

      const adminFlag = userData?.isAdmin === true || userData?.role === 'admin' || userData?.roles?.admin === true
      setIsAdmin(!!adminFlag)

      let trialStart = userData?.trialStart || null
      if (!trialStart) {
        trialStart = new Date().toISOString()
        await setDoc(userRef, { trialStart }, { merge: true })
      }

      const diff = (Date.now() - new Date(trialStart).getTime()) / (1000 * 60 * 60 * 24)
      const trialEndDate = new Date(new Date(trialStart).getTime() + TRIAL_DAYS * 24 * 60 * 60 * 1000)
      setTrialEndsAt(trialEndDate)
      if (diff < TRIAL_DAYS) {
        setTrialActive(true)
        setShowModal(false)
        setLoading(false)
        return
      }

      setTrialActive(false)

      const status = await MercadoPagoService.getSubscriptionStatus(user.uid)
      const result = {
        active: status.isActive,
        status: status.status,
        planId: status.planId,
        expiresAt: status.expiresAt,
        nextBillingDate: status.nextBillingDate,
        trialEndsAt: status.trialEndsAt,
      }
      setSubscription(result)
      setShowModal(!status.isActive && !adminFlag)
      setLoading(false)
    }

    check()
  }, [user])

  return { loading, showModal, setShowModal, subscription, trialActive, trialEndsAt, isAdmin }
}
