import { useEffect, useState } from 'react'
import { MercadoPagoService } from '../services/payment/MercadoPagoService'
import { useAuth } from './useAuth'
import { db } from '../config/firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { lerComCache, guardarNoCache, chaveUsuario, TTL_PERFIL_MS } from '../services/firebase/docCache'

const TRIAL_DAYS = 3

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
      // Cache + dedupe: AccessGuard, TrialBanner, PremiumScreen etc. montam juntos
      // e cada um lia users/{uid} do zero. Uma leitura serve todos (TTL 60s).
      const userData: any = await lerComCache(chaveUsuario(user.uid), TTL_PERFIL_MS, async () => {
        const snap = await getDoc(userRef)
        return snap.exists() ? snap.data() : {}
      })

      const adminFlag = userData?.isAdmin === true || userData?.role === 'admin' || userData?.roles?.admin === true
      setIsAdmin(!!adminFlag)

      let trialStart = userData?.trialStart || null
      if (!trialStart) {
        trialStart = new Date().toISOString()
        await setDoc(userRef, { trialStart }, { merge: true })
        // Atualiza o cache p/ os próximos mounts no TTL não reescreverem trialStart.
        guardarNoCache(chaveUsuario(user.uid), { ...userData, trialStart }, TTL_PERFIL_MS)
      }

      const diff = (Date.now() - new Date(trialStart).getTime()) / (1000 * 60 * 60 * 24)
      const trialEndDate = new Date(new Date(trialStart).getTime() + TRIAL_DAYS * 24 * 60 * 60 * 1000)
      setTrialEndsAt(trialEndDate)
      const dentroDoTrial = diff < TRIAL_DAYS
      setTrialActive(dentroDoTrial)

      // A assinatura é consultada SEMPRE, inclusive durante o trial. Antes havia um
      // `return` antes desta linha quando o trial estava correndo: quem assinava (ou
      // ganhava cortesia pelo painel) nos 3 primeiros dias ficava com `subscription`
      // nulo, e o app tratava a pessoa como se não tivesse plano nenhum. Aconteceu de
      // verdade: conta liberada como Pro no mesmo dia do cadastro seguia vendo o app
      // como plano nenhum até o trial acabar.
      //
      // O trial decide só se o paywall aparece — nunca se o plano é conhecido.
      const status = await MercadoPagoService.getSubscriptionStatus(user.uid)
      setSubscription({
        active: status.isActive,
        status: status.status,
        planId: status.planId,
        expiresAt: status.expiresAt,
        nextBillingDate: status.nextBillingDate,
        trialEndsAt: status.trialEndsAt,
      })
      setShowModal(!dentroDoTrial && !status.isActive && !adminFlag)
      setLoading(false)
    }

    check()
  }, [user])

  return { loading, showModal, setShowModal, subscription, trialActive, trialEndsAt, isAdmin }
}
