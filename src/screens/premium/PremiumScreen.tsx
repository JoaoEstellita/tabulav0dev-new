/**
 * ðŸ’Ž PREMIUM SCREEN ðŸ’Ž
 * 
 * Tela com recursos PREMIUM pagos
 * APIs Prokerala, matching de casais, anÃ¡lises profissionais
 */

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput, ActivityIndicator, Platform, Linking } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useAuth } from '../../hooks/useAuth'
import { useSubscriptionCheck } from '../../hooks/useSubscriptionCheck'
import { useAppLanguage } from '../../hooks/useAppLanguage'
import { useRoute } from '@react-navigation/native'
import AstrologerPremiumService from '../../services/premium/AstrologerPremiumService'
import MercadoPagoService from '../../services/payment/MercadoPagoService'
import StripeService from '../../services/payment/StripeService'
import { CREDIT_PACKS, PLAN_DEFINITIONS } from '../../constants/plans'
import ExpiryBanner from '../../components/ExpiryBanner'
import { getExpiryBannerInfo } from '../../utils/expiry'

const HUB_HISTORY_KEY = 'premium_hub_history'
const STRIPE_USD_PRICE_BY_PLAN: Record<string, number> = {
  essential_monthly: 9.9,
  pro_monthly: 19.9,
  premium_monthly: 39.9,
}

const HUB_ACTIONS: Record<string, { labelKey: string; descriptionKey: string; icon: string; cost: number }> = {
  birth: { labelKey: 'premium.actions.birth.label', icon: 'star', descriptionKey: 'premium.actions.birth.desc', cost: 1 },
  transit: { labelKey: 'premium.actions.transit.label', icon: 'pulse', descriptionKey: 'premium.actions.transit.desc', cost: 1 },
  synastry: { labelKey: 'premium.actions.synastry.label', icon: 'heart', descriptionKey: 'premium.actions.synastry.desc', cost: 2 },
  composite: { labelKey: 'premium.actions.composite.label', icon: 'git-compare', descriptionKey: 'premium.actions.composite.desc', cost: 1 },
  solar: { labelKey: 'premium.actions.solar.label', icon: 'sunny', descriptionKey: 'premium.actions.solar.desc', cost: 1 },
  lunar: { labelKey: 'premium.actions.lunar.label', icon: 'moon', descriptionKey: 'premium.actions.lunar.desc', cost: 1 },
}

type HubHistoryItem = {
  id: string
  action: string
  ts: string
  summary: string
}

export default function PremiumScreen() {
  const { t, language } = useAppLanguage()
  const tr = (key: string, fallback: string, vars?: Record<string, string | number>) => {
    const value = t(key, vars)
    return value === key ? fallback : value
  }
  const { user } = useAuth()
  const { subscription, trialActive, isAdmin } = useSubscriptionCheck()
  const route = useRoute<any>()
  const planId = (subscription?.planId || '').toLowerCase()
  const isPremium = isAdmin || subscription?.active === true
  const hasActivePlan = !!subscription?.active
  const hasHubAccess = isAdmin || (subscription?.active && (planId.startsWith('premium_') || planId === 'premium_monthly' || planId.startsWith('pro_') || planId === 'pro_monthly'))
  const [selectedTab, setSelectedTab] = useState<'features' | 'hub' | 'credits' | 'history'>(hasActivePlan ? 'hub' : 'features')
  const [targetDate, setTargetDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [partnerBirthDate, setPartnerBirthDate] = useState('')
  const [partnerBirthTime, setPartnerBirthTime] = useState('')
  const [partnerLat, setPartnerLat] = useState('')
  const [partnerLon, setPartnerLon] = useState('')
  const [partnerTz, setPartnerTz] = useState('America/Sao_Paulo')
  const [partnerCity, setPartnerCity] = useState('')
  const [partnerCountry, setPartnerCountry] = useState('')
  const [hubLoading, setHubLoading] = useState(false)
  const [hubError, setHubError] = useState<string | null>(null)
  const [hubResult, setHubResult] = useState<any>(null)
  const [hubMeta, setHubMeta] = useState<any>(null)
  const [lastAction, setLastAction] = useState<string | null>(null)
  const [showJson, setShowJson] = useState(false)
  const [hubHistory, setHubHistory] = useState<HubHistoryItem[]>([])
  const [creditHistory, setCreditHistory] = useState<Array<{ id: string; type: string; qty: number; ts: string; detail?: string; balanceAfter?: number | null; delta?: number | null }>>([])
  const [creditsHistoryLoading, setCreditsHistoryLoading] = useState(false)
  const [creditsHistoryError, setCreditsHistoryError] = useState<string | null>(null)
  const [exportingPdf, setExportingPdf] = useState(false)
  const [premiumPhone, setPremiumPhone] = useState('')
  const [creditsRemaining, setCreditsRemaining] = useState<number | null>(null)
  const [creditsLoading, setCreditsLoading] = useState(false)
  const [creditsCycleEnd, setCreditsCycleEnd] = useState<string | null>(null)
  const [purchaseLoading, setPurchaseLoading] = useState<string | null>(null)
  const stripeReturnHandledRef = useRef(false)
  const checkoutNoticeHandledRef = useRef(false)
  const [checkoutNotice, setCheckoutNotice] = useState<{ type: 'success' | 'cancel' | 'pending' | 'failure'; message: string } | null>(null)
  const isPortuguese = language === 'pt-BR'
  const [subscriptionProvider, setSubscriptionProvider] = useState<'mercadopago' | 'stripe'>(isPortuguese ? 'mercadopago' : 'stripe')
  const usesStripePricing = !isPortuguese || subscriptionProvider === 'stripe'
  const expiryInfo = useMemo(() => {
    return getExpiryBannerInfo({
      featureLabel: tr('premium.header.title', 'Premium'),
      trialActive,
      trialEndsAt: subscription?.trialEndsAt || null,
      subscriptionNextBillingDate: subscription?.nextBillingDate || null,
      subscriptionExpiresAt: subscription?.expiresAt || null,
      isPremium,
    })
  }, [isPremium, subscription?.expiresAt, subscription?.nextBillingDate, subscription?.trialEndsAt, trialActive])
  const expiryMessage = useMemo(() => {
    if (!expiryInfo.show) return ''
    const daysLeft = expiryInfo.daysLeft
    if (typeof daysLeft !== 'number') return expiryInfo.message
    if (daysLeft <= 0) return expiryInfo.message
    return `${expiryInfo.message} (${daysLeft} ${tr('premium.common.days', 'dias')})`
  }, [expiryInfo])

  useEffect(() => {
    AsyncStorage.getItem(HUB_HISTORY_KEY)
      .then((raw) => {
        if (!raw) return
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed)) {
          setHubHistory(parsed)
        }
      })
      .catch(() => null)
  }, [])

  useEffect(() => {
    const requestedTab = route?.params?.openTab
    if (
      requestedTab === 'features' ||
      requestedTab === 'hub' ||
      requestedTab === 'credits' ||
      requestedTab === 'history'
    ) {
      setSelectedTab(requestedTab)
    }
  }, [route?.params?.openTab])

  useEffect(() => {
    if (!isPortuguese && subscriptionProvider !== 'stripe') {
      setSubscriptionProvider('stripe')
    }
  }, [isPortuguese, subscriptionProvider])

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return
    if (checkoutNoticeHandledRef.current) return
    checkoutNoticeHandledRef.current = true

    const params = new URLSearchParams(window.location.search || '')
    const checkoutState = (params.get('checkout') || '').toLowerCase()
    if (!checkoutState) return

    const map: Record<string, { type: 'success' | 'cancel' | 'pending' | 'failure'; message: string }> = {
      success: { type: 'success', message: tr('premium.checkout.success', 'Pagamento confirmado. Seu plano foi atualizado.') },
      cancel: { type: 'cancel', message: tr('premium.checkout.cancel', 'Checkout cancelado. Você pode tentar novamente quando quiser.') },
      failure: { type: 'failure', message: tr('premium.checkout.failure', 'Pagamento não aprovado. Revise os dados e tente novamente.') },
      pending: { type: 'pending', message: tr('premium.checkout.pending', 'Pagamento pendente. Aguarde a confirmação do provedor.') },
    }
    if (map[checkoutState]) {
      setCheckoutNotice(map[checkoutState])
      setSelectedTab('features')
    }
  }, [])

  const cleanupCheckoutUrlParams = () => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return
    try {
      const url = new URL(window.location.href)
      url.searchParams.delete('provider')
      url.searchParams.delete('checkout')
      url.searchParams.delete('session_id')
      window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`)
    } catch {}
  }

  useEffect(() => {
    if (!checkoutNotice) return
    if (Platform.OS !== 'web' || typeof window === 'undefined') return
    const timer = setTimeout(() => {
      cleanupCheckoutUrlParams()
    }, 4500)
    return () => clearTimeout(timer)
  }, [checkoutNotice])

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined' || !user?.uid) return
    if (stripeReturnHandledRef.current) return
    const params = new URLSearchParams(window.location.search || '')
    const provider = params.get('provider')
    const checkoutState = params.get('checkout')
    const sessionId = params.get('session_id')
    if (provider !== 'stripe') return
    stripeReturnHandledRef.current = true

    const syncAndRefresh = async () => {
      try {
        if (sessionId) {
          await StripeService.syncCheckoutSession(sessionId, user.uid)
        }
      } catch (syncError) {
        console.warn('Stripe return sync failed:', syncError)
      } finally {
        // Recarrega status de assinatura apos retorno do checkout.
        try {
          const cleanedUrl = `${window.location.origin}/Tabs/Premium${checkoutState ? `?checkout=${encodeURIComponent(checkoutState)}` : ''}`
          window.history.replaceState({}, '', cleanedUrl)
        } catch {}
      }
    }
    syncAndRefresh()
  }, [user?.uid])

  const openExternalCheckout = async (url: string) => {
    const targetUrl = String(url || '').trim()
    if (!targetUrl) throw new Error(tr('subscription.error.openPaymentLink', 'Nao foi possivel abrir o link de pagamento.'))
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.location.assign(targetUrl)
      return
    }
    await Linking.openURL(targetUrl)
  }

  useEffect(() => {
    if (!user) return
    let active = true
    setCreditsLoading(true)
    user.getIdToken(true)
      .then((token) => AstrologerPremiumService.getCreditsStatus(token))
      .then((response) => {
        if (!active) return
        const remaining = typeof response?.creditsRemaining === 'number'
          ? response.creditsRemaining
          : typeof response?.meta?.creditsRemaining === 'number'
          ? response.meta.creditsRemaining
          : null
        setCreditsRemaining(remaining)
        const cycleEnd = response?.cycleEnd || response?.meta?.cycleEnd || null
        if (cycleEnd) setCreditsCycleEnd(cycleEnd)
      })
      .catch(() => {
        if (!active) return
        setCreditsRemaining(null)
      })
      .finally(() => {
        if (!active) return
        setCreditsLoading(false)
      })
    return () => {
      active = false
    }
  }, [user?.uid])

  const fetchCreditsHistory = async () => {
    if (!user) return
    setCreditsHistoryLoading(true)
    setCreditsHistoryError(null)
    try {
      const token = await user.getIdToken(true)
      const response: any = await AstrologerPremiumService.getCreditsHistory(token, 30)
      const items = response?.items || response?.data?.items || []
      const mapped = Array.isArray(items)
        ? items.map((item: any) => ({
          id: item.id || `${item.type || 'credit'}-${item.createdAt || Date.now()}`,
          type: item.type || tr('premium.credits.type.movement', 'movimentacao'),
          qty: Math.abs(Number(item.delta ?? 0)) || 0,
          ts: item.createdAt || item.ts || new Date().toISOString(),
          detail: item.source || item.meta?.packId || item.meta?.action || item.meta?.planId || undefined,
          balanceAfter: typeof item.balanceAfter === 'number' ? item.balanceAfter : null,
          delta: typeof item.delta === 'number' ? item.delta : null,
        }))
        : []
      setCreditHistory(mapped)
    } catch (error: any) {
      setCreditsHistoryError(error?.message || tr('premium.creditsHistory.loadFailed', 'Falha ao carregar historico'))
    } finally {
      setCreditsHistoryLoading(false)
    }
  }

  useEffect(() => {
    if (!user) return
    fetchCreditsHistory()
  }, [user?.uid])

  const subscriptionPlans = PLAN_DEFINITIONS.map((plan) => ({
    id: plan.id,
    name: plan.name,
    price: plan.price,
    features: plan.features,
    color: plan.tier === 'premium' ? '#FF6B6B' : plan.tier === 'pro' ? '#4ECDC4' : '#FFD700',
    requiresPhone: plan.requiresWhatsapp,
    current: subscription?.active && planId === plan.id,
  }))
  const creditPacks = CREDIT_PACKS

  const formatCycleEnd = (value: string | null) => {
    if (!value) return null
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return null
    const daysLeft = Math.max(0, Math.ceil((date.getTime() - Date.now()) / (24 * 60 * 60 * 1000)))
    const formatted = date.toLocaleDateString(language, { day: '2-digit', month: 'short' })
    return { label: formatted, daysLeft, message: tr('premium.billing.renewsAt', 'Renova em {days} dias ({date}).', { days: daysLeft, date: formatted }) }
  }

  const handlePurchaseCredits = (pack: { id: string; label: string; price: number }) => {
    if (!user) {
      Alert.alert(tr('premium.alert.login.title', 'Login'), tr('premium.alert.login.buyCredits', 'Faça login para comprar créditos.'))
      return
    }
    if (purchaseLoading) return
    Alert.alert(
      tr('premium.alert.confirmPurchase.title', 'Confirmar compra'),
      tr('premium.alert.confirmPurchase.body', 'Comprar {label} por R$ {price}?', { label: pack.label, price: pack.price.toFixed(2) }),
      [
        { text: tr('common.cancel', 'Cancelar'), style: 'cancel' },
        {
          text: tr('premium.alert.confirmPurchase.cta', 'Comprar'),
          onPress: async () => {
            try {
              setPurchaseLoading(pack.id)
              const preference = await MercadoPagoService.createPaymentPreference({
                userId: user.uid,
                planId: pack.id,
                email: user.email || '',
                name: user.displayName || user.email || tr('common.user', 'Usuario'),
                amount: pack.price,
                description: pack.label,
                externalReference: MercadoPagoService.generateExternalReference(user.uid, pack.id),
              })
              const checkoutUrl = preference?.checkout_url || preference?.init_point || preference?.sandbox_init_point
              if (!checkoutUrl) {
                Alert.alert(tr('common.error', 'Erro'), tr('premium.alert.paymentLinkFailed', 'Não foi possível gerar o link de pagamento.'))
                return
              }
              await openExternalCheckout(checkoutUrl)
            } catch (error: any) {
              Alert.alert(tr('common.error', 'Erro'), tr('premium.alert.purchaseStartFailed', 'Não foi possível iniciar a compra agora.'))
            } finally {
              setPurchaseLoading(null)
            }
          },
        },
      ]
    )
  }

  const handleSubscribe = async (plan: { id: string; requiresPhone?: boolean; name?: string; price?: number }) => {
    if (plan.requiresPhone && !premiumPhone.trim()) {
      Alert.alert(tr('premium.alert.phoneRequired.title', 'Número necessário'), tr('premium.alert.phoneRequired.body', 'Informe o número do WhatsApp para assinar o Premium.'))
      return
    }
    if (plan.requiresPhone && user) {
      user.getIdToken(true)
        .then((token) => AstrologerPremiumService.registerWhatsApp(token, premiumPhone.trim()))
        .catch(() => null)
    }
    if (!user) {
      Alert.alert(tr('premium.alert.login.title', 'Login'), tr('premium.alert.login.subscribe', 'Faça login para assinar.'))
      return
    }
    try {
      const effectiveProvider: 'mercadopago' | 'stripe' = isPortuguese ? subscriptionProvider : 'stripe'
      const planConfig = MercadoPagoService.getPlanById(plan.id)
      if (!planConfig) {
        Alert.alert(tr('premium.alert.invalidPlan.title', 'Plano inválido'), tr('premium.alert.invalidPlan.body', 'Não foi possível localizar o plano selecionado.'))
        return
      }
      if (effectiveProvider === 'stripe') {
        const stripeAmount = STRIPE_USD_PRICE_BY_PLAN[planConfig.id] ?? planConfig.price
        const stripeSession = await StripeService.createCheckoutSession({
          userId: user.uid,
          planId: planConfig.id,
          email: user.email || '',
          name: user.displayName || user.email || tr('common.user', 'Usuario'),
          amount: stripeAmount,
          currency: 'usd',
        })
        const stripeUrl = stripeSession?.url
        if (!stripeUrl) {
          Alert.alert(tr('common.error', 'Erro'), tr('premium.alert.stripeLinkFailed', 'Não foi possível gerar o link Stripe.'))
          return
        }
        await openExternalCheckout(stripeUrl)
        return
      }
      const preference = await MercadoPagoService.createPaymentPreference({
        userId: user.uid,
        planId: planConfig.id,
        email: user.email || '',
        name: user.displayName || user.email || tr('common.user', 'Usuario'),
        amount: planConfig.price,
        description: planConfig.name,
        externalReference: MercadoPagoService.generateExternalReference(user.uid, planConfig.id),
      })
      const checkoutUrl = preference?.checkout_url || preference?.init_point || preference?.sandbox_init_point
      if (!checkoutUrl) {
        Alert.alert(tr('common.error', 'Erro'), tr('premium.alert.paymentLinkFailed', 'Não foi possível gerar o link de pagamento.'))
        return
      }
      await openExternalCheckout(checkoutUrl)
    } catch (error: any) {
      const raw = String(error?.message || '').trim()
      const safeMessage = raw.length > 3 ? raw : tr('premium.alert.paymentStartFailed', 'Falha ao iniciar pagamento. Tente novamente.')
      Alert.alert(tr('common.error', 'Erro'), safeMessage)
    }
  }
  const partnerPayload = useMemo(() => ({
    birthDate: partnerBirthDate,
    birthTime: partnerBirthTime,
    latitude: partnerLat ? Number(partnerLat) : null,
    longitude: partnerLon ? Number(partnerLon) : null,
    timezone: partnerTz,
    city: partnerCity,
    country: partnerCountry,
  }), [partnerBirthDate, partnerBirthTime, partnerLat, partnerLon, partnerTz, partnerCity, partnerCountry])

  const formatResult = (data: any) => {
    if (typeof data === 'string') return data
    try {
      return JSON.stringify(data, null, 2)
    } catch {
      return String(data)
    }
  }

  const extractSummaryLines = (raw: any) => {
    if (!raw) return []
    if (typeof raw === 'string') {
      return raw.split(/\n+/).map((line) => line.trim()).filter(Boolean).slice(0, 6)
    }
    if (Array.isArray(raw)) {
      return raw.map((item) => (typeof item === 'string' ? item : null)).filter(Boolean).slice(0, 6) as string[]
    }
    if (typeof raw === 'object') {
      const keys = Object.keys(raw).slice(0, 6)
      return keys.map((key) => `${key}`)
    }
    return []
  }

  const buildSummary = (data: any) => {
    if (!data) return { title: tr('premium.summary.title', 'Resumo'), lines: [tr('premium.summary.noData', 'Sem dados disponíveis.')] }
    if (typeof data === 'string') {
      const lines = extractSummaryLines(data)
      return { title: tr('premium.summary.title', 'Resumo'), lines: lines.length ? lines : [tr('premium.summary.noReadingSummary', 'Leitura sem resumo disponível.')] }
    }
    if (typeof data === 'object') {
      const rawText = data.summary || data.context || data.text || data.interpretation || data.description || null
      const lines = extractSummaryLines(rawText)
      if (lines.length) return { title: tr('premium.summary.title', 'Resumo'), lines }
      const keys = Object.keys(data || {}).slice(0, 6)
      if (keys.length) return { title: tr('premium.summary.mainFields', 'Campos principais'), lines: keys.map((key) => key) }
      return { title: tr('premium.summary.title', 'Resumo'), lines: [tr('premium.summary.noReadingSummary', 'Leitura sem resumo disponível.')] }
    }
    return { title: tr('premium.summary.title', 'Resumo'), lines: [tr('premium.summary.noReadingSummary', 'Leitura sem resumo disponível.')] }
  }

  const buildKeyHighlights = (data: any) => {
    if (!data || typeof data !== 'object') return []
    const candidates: Array<{ key: string; label: string }> = [
      { key: 'highlights', label: tr('premium.highlights.highlights', 'Destaques') },
      { key: 'recommendations', label: tr('premium.highlights.recommendations', 'Recomendacoes') },
      { key: 'key_points', label: tr('premium.highlights.keyPoints', 'Pontos chave') },
      { key: 'themes', label: tr('premium.highlights.themes', 'Temas') },
      { key: 'warnings', label: tr('premium.highlights.warnings', 'Atencoes') },
      { key: 'strengths', label: tr('premium.highlights.strengths', 'Forcas') },
      { key: 'challenges', label: tr('premium.highlights.challenges', 'Desafios') },
    ]
    return candidates
      .filter((item) => data[item.key])
      .slice(0, 4)
      .map((item) => ({
        label: item.label,
        value: Array.isArray(data[item.key]) ? tr('premium.highlights.itemsCount', '{count} itens', { count: data[item.key].length }) : tr('premium.highlights.ok', 'ok'),
      }))
  }

  const getActionMeta = (action: string | null) => {
    if (!action) return { label: tr('premium.actions.defaultLabel', 'Leitura premium'), icon: 'sparkles' }
    const actionMeta = HUB_ACTIONS[action]
    if (!actionMeta) return { label: tr('premium.actions.defaultLabel', 'Leitura premium'), icon: 'sparkles' }
    return { label: tr(actionMeta.labelKey, action), icon: actionMeta.icon }
  }

  const copySummary = async () => {
    if (!hubResult) return
    const summary = buildSummary(hubResult)
    const text = `${summary.title}\n- ${summary.lines.join('\n- ')}`
    try {
      if (Platform.OS === 'web' && navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text)
        Alert.alert(tr('premium.alert.copy.title', 'Copiado'), tr('premium.alert.copy.success', 'Resumo copiado para a área de transferência.'))
      } else {
        Alert.alert(tr('premium.alert.copy.title2', 'Copiar'), tr('premium.alert.copy.manual', 'Copie manualmente o resumo na tela.'))
      }
    } catch {
      Alert.alert(tr('premium.alert.copy.title2', 'Copiar'), tr('premium.alert.copy.failed', 'Não foi possível copiar automaticamente.'))
    }
  }

  const handleExportPdf = async () => {
    if (!hubResult || !user) return
    try {
      setExportingPdf(true)
      const token = await user.getIdToken()
      const actionMeta = getActionMeta(lastAction)
      const summary = buildSummary(hubResult)
      const highlights = buildKeyHighlights(hubResult)
      const sections = [
        { title: summary.title, content: summary.lines.join('\n') },
        ...(highlights.length
          ? [{ title: tr('premium.highlights.sectionTitle', 'Destaques'), content: highlights.map((h) => `${h.label}: ${h.value}`).join('\n') }]
          : []),
      ]
      const payload = {
        title: `${tr('premium.pdf.titlePrefix', 'Tabula Estelar')} - ${actionMeta.label}`,
        summary: summary.lines.join('\n'),
        sections,
        footer: tr('premium.pdf.footer', 'Tabula Estelar'),
      }
      const blobOrBuffer = await AstrologerPremiumService.exportPdf(token, payload as any)
      if (Platform.OS === 'web') {
        const blob = blobOrBuffer instanceof Blob ? blobOrBuffer : new Blob([blobOrBuffer], { type: 'application/pdf' })
        const url = URL.createObjectURL(blob)
        const anchor = document.createElement('a')
        anchor.href = url
        anchor.download = 'tabula-premium.pdf'
        anchor.click()
        URL.revokeObjectURL(url)
      } else {
        Alert.alert(tr('premium.alert.exportPdf.title', 'Exportar PDF'), tr('premium.alert.exportPdf.webOnly', 'Exportação disponível no web por enquanto.'))
      }
    } catch (error) {
      Alert.alert(tr('common.error', 'Erro'), tr('premium.alert.exportPdf.failed', 'Não foi possível exportar o PDF.'))
    } finally {
      setExportingPdf(false)
    }
  }

  const runAction = async (action: string) => {
    if (!user) {
      Alert.alert(tr('premium.alert.login.title', 'Login'), tr('premium.alert.login.accessPremium', 'Faça login para acessar recursos premium.'))
      return
    }
    const actionMeta = HUB_ACTIONS[action]
    if (creditsRemaining !== null && actionMeta && creditsRemaining < actionMeta.cost) {
      Alert.alert(tr('premium.alert.noCredits.title', 'Sem créditos'), tr('premium.alert.noCredits.body', 'Créditos insuficientes para esta leitura.'))
      return
    }
    setHubLoading(true)
    setHubError(null)
    setLastAction(action)
    try {
      const token = await user.getIdToken(true)
      let response = null
      if (action === 'birth-chart') response = await AstrologerPremiumService.getBirthChartContext(token)
      if (action === 'transit') response = await AstrologerPremiumService.getTransitContext(token, targetDate)
      if (action === 'synastry') response = await AstrologerPremiumService.getSynastryContext(token, partnerPayload)
      if (action === 'composite') response = await AstrologerPremiumService.getCompositeData(token, partnerPayload)
      if (action === 'solar') response = await AstrologerPremiumService.getSolarReturnData(token, targetDate)
      if (action === 'lunar') response = await AstrologerPremiumService.getLunarReturnData(token, targetDate)
      const payload = response?.data ?? response
      setHubResult(payload)
      setHubMeta(response?.meta || null)
      setShowJson(false)
      if (typeof response?.meta?.creditsRemaining === 'number') {
        setCreditsRemaining(response.meta.creditsRemaining)
      }
      const summary = buildSummary(payload)
      const entry: HubHistoryItem = {
        id: `${action}-${Date.now()}`,
        action,
        ts: new Date().toISOString(),
        summary: summary.lines[0] || summary.title,
      }
      setHubHistory((prev) => {
        const next = [entry, ...prev].slice(0, 10)
        AsyncStorage.setItem(HUB_HISTORY_KEY, JSON.stringify(next)).catch(() => null)
        return next
      })
      if (actionMeta?.cost) {
        const creditEntry = {
          id: `${action}-credit-${Date.now()}`,
          type: tr('premium.credits.consumeType', 'consumo'),
          qty: actionMeta.cost,
          ts: new Date().toISOString(),
          detail: tr(actionMeta.labelKey, action),
          delta: -Math.abs(actionMeta.cost),
        }
        setCreditHistory((prev) => [creditEntry, ...prev].slice(0, 20))
        fetchCreditsHistory()
      }
    } catch (error: any) {
      const code = error?.code || 'error'
      if (code === 'credits_insufficient' || code === 'credits_unavailable') {
        setHubError(tr('premium.error.noCredits', 'Sem creditos suficientes. Compre mais creditos para continuar.'))
      } else {
        setHubError(`${code}: ${error?.message || tr('premium.error.queryFailed', 'Falha ao consultar premium')}`)
      }
    } finally {
      setHubLoading(false)
    }
  }

  const renderHub = () => (
    <ScrollView style={styles.tabContent} contentContainerStyle={styles.hubContent}>
      {!hasHubAccess && (
        <View style={styles.lockedBox}>
          <Text style={styles.lockedTitle}>{tr('premium.locked.title', 'Premium bloqueado')}</Text>
          <Text style={styles.lockedText}>{tr('premium.locked.body', 'Assine o plano Pro ou Premium para desbloquear o Hub.')}</Text>
          <TouchableOpacity style={styles.lockedButton} onPress={() => setSelectedTab('features')}>
            <Text style={styles.lockedButtonText}>{tr('premium.locked.cta', 'Ver planos')}</Text>
          </TouchableOpacity>
        </View>
      )}

      {hasHubAccess && (
        <>
          <View style={styles.hubCard}>
            <Text style={styles.hubTitle}>{tr('premium.credits.available', 'Créditos disponíveis')}</Text>
            {creditsLoading ? (
              <ActivityIndicator color="#FFD700" />
            ) : (
              <Text style={styles.creditsValue}>
                {creditsRemaining === null ? tr('premium.credits.unlimited', 'Ilimitado') : creditsRemaining}
              </Text>
            )}
            {(() => {
              const cycle = formatCycleEnd(creditsCycleEnd)
              if (!cycle) return null
              return <Text style={styles.creditsCycle}>{cycle.message}</Text>
            })()}
            <Text style={styles.hubSubtitle}>
              {tr('premium.credits.costHint', 'Sinastria custa 2 créditos. Demais leituras custam 1 crédito.')}
            </Text>
          </View>
          <View style={styles.hubCard}>
            <Text style={styles.hubTitle}>{tr('premium.services.title', 'Serviços Premium (API Astrologer)')}</Text>
            <Text style={styles.hubSubtitle}>{tr('premium.services.subtitle', 'Selecione uma leitura para gerar agora.')}</Text>
            <View style={styles.serviceGrid}>
              {Object.entries(HUB_ACTIONS).map(([key, meta]) => (
                <TouchableOpacity key={key} style={styles.serviceCard} onPress={() => runAction(key)}>
                  <Ionicons name={meta.icon as any} size={20} color="#FFD700" />
                  <Text style={styles.serviceTitle}>{tr(meta.labelKey, key)}</Text>
                  <Text style={styles.serviceDesc}>{tr(meta.descriptionKey, '')}</Text>
                  <Text style={styles.serviceCost}>{tr('premium.services.cost', 'Custo: {cost} crédito', { cost: meta.cost })}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.hubCard}>
            <Text style={styles.hubTitle}>{tr('premium.targetDate.title', 'Data-alvo')}</Text>
            <TextInput
              style={styles.input}
              value={targetDate}
              onChangeText={setTargetDate}
              placeholder={tr('premium.input.dateIsoPlaceholder', 'YYYY-MM-DD')}
              placeholderTextColor="#888"
            />
          </View>

          <View style={styles.hubCard}>
            <Text style={styles.hubTitle}>{tr('premium.partnerData.title', 'Dados do parceiro (sinastria/composite)')}</Text>
            <TextInput style={styles.input} value={partnerBirthDate} onChangeText={setPartnerBirthDate} placeholder={tr('premium.input.partnerDatePlaceholder', 'Data (YYYY-MM-DD)')} placeholderTextColor="#888" />
            <TextInput style={styles.input} value={partnerBirthTime} onChangeText={setPartnerBirthTime} placeholder={tr('premium.input.partnerTimePlaceholder', 'Hora (HH:MM)')} placeholderTextColor="#888" />
            <TextInput style={styles.input} value={partnerLat} onChangeText={setPartnerLat} placeholder={tr('premium.input.partnerLatitudePlaceholder', 'Latitude')} placeholderTextColor="#888" />
            <TextInput style={styles.input} value={partnerLon} onChangeText={setPartnerLon} placeholder={tr('premium.input.partnerLongitudePlaceholder', 'Longitude')} placeholderTextColor="#888" />
            <TextInput style={styles.input} value={partnerTz} onChangeText={setPartnerTz} placeholder={tr('premium.input.partnerTimezonePlaceholder', 'Timezone')} placeholderTextColor="#888" />
            <TextInput style={styles.input} value={partnerCity} onChangeText={setPartnerCity} placeholder={tr('premium.input.partnerCityPlaceholder', 'Cidade')} placeholderTextColor="#888" />
            <TextInput style={styles.input} value={partnerCountry} onChangeText={setPartnerCountry} placeholder={tr('premium.input.partnerCountryPlaceholder', 'País')} placeholderTextColor="#888" />
          </View>

          <View style={styles.hubCard}>
            <Text style={styles.hubTitle}>{tr('premium.result.title', 'Resultado')}</Text>
            {hubLoading && <ActivityIndicator color="#FFD700" />}
            {hubError && <Text style={styles.errorText}>{hubError}</Text>}
            {!hubLoading && !hubError && hubResult && (
              <>
                <Text style={styles.resultLabel}>{tr('premium.result.lastAction', 'Última ação: {action}', { action: lastAction || '--' })}</Text>
                {(() => {
                  const actionMeta = getActionMeta(lastAction)
                  return (
                    <View style={styles.hubCardsRow}>
                    <View style={styles.hubPill}>
                      <Ionicons name={actionMeta.icon as any} size={18} color="#FFD700" />
                      <Text style={styles.hubCardLabel}>{actionMeta.label}</Text>
                    </View>
                    <View style={styles.hubPill}>
                      <Ionicons name="speedometer" size={18} color="#8B5FBF" />
                      <Text style={styles.hubCardLabel}>
                        {tr('premium.meta.cache', 'cache')}: {hubMeta?.cacheHit ? tr('premium.meta.hit', 'hit') : tr('premium.meta.miss', 'miss')}
                      </Text>
                    </View>
                    <View style={styles.hubPill}>
                      <Ionicons name="time" size={18} color="#4ECDC4" />
                      <Text style={styles.hubCardLabel}>
                        {hubMeta?.durationMs ? `${hubMeta.durationMs}ms` : tr('premium.meta.timeNa', 'tempo n/d')}
                      </Text>
                    </View>
                    </View>
                  )
                })()}
                {(() => {
                  const summary = buildSummary(hubResult)
                  return (
                    <View style={styles.summaryBox}>
                      <Text style={styles.summaryTitle}>{summary.title}</Text>
                      {summary.lines.map((line, idx) => (
                        <Text key={idx} style={styles.summaryLine}>• {line}</Text>
                      ))}
                    </View>
                  )
                })()}
                {(() => {
                  const highlights = buildKeyHighlights(hubResult)
                  if (!highlights.length) return null
                  return (
                    <View style={styles.keyHighlights}>
                      {highlights.map((item) => (
                        <View key={item.label} style={styles.keyHighlightCard}>
                          <Text style={styles.keyHighlightLabel}>{item.label}</Text>
                          <Text style={styles.keyHighlightValue}>{item.value}</Text>
                        </View>
                      ))}
                    </View>
                  )
                })()}
                <View style={styles.summaryActions}>
                  <TouchableOpacity style={styles.summaryButton} onPress={copySummary}>
                    <Text style={styles.summaryButtonText}>{tr('premium.result.copySummary', 'Copiar resumo')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.summaryButton} onPress={handleExportPdf} disabled={exportingPdf}>
                    <Text style={styles.summaryButtonText}>
                      {exportingPdf ? tr('premium.result.generatingPdf', 'Gerando PDF...') : tr('premium.result.exportPdf', 'Exportar PDF')}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.summaryButton} onPress={() => setShowJson((prev) => !prev)}>
                    <Text style={styles.summaryButtonText}>{showJson ? tr('premium.result.hideJson', 'Ocultar JSON') : tr('premium.result.viewJson', 'Ver JSON')}</Text>
                  </TouchableOpacity>
                </View>
                {showJson && <Text style={styles.resultText}>{formatResult(hubResult)}</Text>}
                {hubMeta && (
                  <Text style={styles.metaText}>
                    {tr('premium.meta.cacheHit', 'cacheHit')}: {String(hubMeta.cacheHit)} · {tr('premium.meta.creditsRemaining', 'creditsRemaining')}: {hubMeta.creditsRemaining ?? tr('premium.meta.na', 'n/a')}
                  </Text>
                )}
              </>
            )}
            {!hubLoading && hubHistory.length > 0 && (
              <View style={styles.historySection}>
                <Text style={styles.sectionTitle}>{tr('premium.history.recent', 'Histórico recente')}</Text>
                {hubHistory.map((item) => {
                  const actionMeta = getActionMeta(item.action)
                  return (
                    <View key={item.id} style={styles.historyItem}>
                      <Ionicons name={actionMeta.icon as any} size={16} color="#FFD700" />
                      <View style={styles.historyText}>
                        <Text style={styles.historyLabel}>{actionMeta.label}</Text>
                        <Text style={styles.historySummary}>{item.summary}</Text>
                      </View>
                    </View>
                  )
                })}
              </View>
            )}
            {!hubLoading && !hubError && !hubResult && (
              <Text style={styles.emptyText}>{tr('premium.result.empty', 'Nenhuma leitura executada ainda.')}</Text>
            )}
          </View>
        </>
      )}
    </ScrollView>
  )

  const renderFeatures = () => (
    <ScrollView style={styles.tabContent}>
      <View style={styles.plansContainer}>
          <Text style={styles.sectionTitle}>{tr('premium.subscriptionPlans.title', 'Planos de assinatura')}</Text>
        <View style={styles.providerChoiceRow}>
          <Text style={styles.providerChoiceLabel}>{t('subscription.provider.label')}</Text>
          <TouchableOpacity
            style={[
              styles.providerChoiceButton,
              subscriptionProvider === 'mercadopago' && styles.providerChoiceButtonActive,
              !isPortuguese && styles.providerChoiceButtonDisabled,
            ]}
            onPress={() => {
              if (!isPortuguese) return
              setSubscriptionProvider('mercadopago')
            }}
            disabled={!isPortuguese}
          >
            <Text style={[styles.providerChoiceText, subscriptionProvider === 'mercadopago' && styles.providerChoiceTextActive]}>
              {t('subscription.provider.mercado')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.providerChoiceButton, subscriptionProvider === 'stripe' && styles.providerChoiceButtonActive]}
            onPress={() => setSubscriptionProvider('stripe')}
          >
            <Text style={[styles.providerChoiceText, subscriptionProvider === 'stripe' && styles.providerChoiceTextActive]}>
              {t('subscription.provider.stripe')}
            </Text>
          </TouchableOpacity>
        </View>
        {!isPortuguese ? (
          <Text style={styles.providerHintText}>
            {tr('subscription.provider.autoStripeHint', 'Para idiomas internacionais, os pagamentos usam Stripe automaticamente.')}
          </Text>
        ) : null}
        {subscriptionPlans.map(plan => (
          <TouchableOpacity
            key={plan.id}
            style={[
              styles.planCard,
              { borderColor: plan.color },
              plan.current && styles.currentPlan
            ]}
            onPress={() => !plan.current && handleSubscribe(plan)}
          >
            <View style={styles.planHeader}>
              <Text style={styles.planName}>{plan.name}</Text>
              <Text style={styles.planPrice}>
                {plan.price === 0
                  ? tr('premium.plans.free', 'Gratis')
                  : usesStripePricing
                    ? `US$ ${(STRIPE_USD_PRICE_BY_PLAN[plan.id] ?? plan.price).toFixed(2)}/${tr('premium.plans.monthShort', 'mes')}`
                    : `R$ ${(plan.price || 0).toFixed(2)}/${tr('premium.plans.monthShort', 'mes')}`}
              </Text>
            </View>
            <View style={styles.planFeatures}>
              {plan.features.map((feature, index) => (
                <Text key={index} style={styles.planFeature}>✓ {feature}</Text>
              ))}
            </View>
            {plan.requiresPhone && (
              <View style={styles.planPhoneRow}>
                <Text style={styles.planPhoneLabel}>{tr('premium.plans.whatsappLabel', 'WhatsApp (Premium)')}</Text>
                <TextInput
                  style={styles.planPhoneInput}
                  placeholder={tr('premium.plans.whatsappPlaceholder', '(DD) 9xxxx-xxxx')}
                  placeholderTextColor="#888"
                  value={premiumPhone}
                  onChangeText={setPremiumPhone}
                  keyboardType="phone-pad"
                />
              </View>
            )}
            {plan.current && (
              <View style={styles.currentBadge}>
                <Text style={styles.currentBadgeText}>{tr('premium.plans.current', 'Plano Atual')}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.plansContainer}>
        <Text style={styles.sectionTitle}>{tr('premium.comparePlans.title', 'Comparar planos')}</Text>
        <View style={styles.compareTable}>
          <View style={styles.compareRow}>
            <Text style={styles.compareLabel}>{tr('premium.compare.feature', 'Recurso')}</Text>
            <Text style={styles.compareValue}>{tr('premium.plan.essential', 'Essential')}</Text>
            <Text style={styles.compareValue}>{tr('premium.plan.pro', 'Pro')}</Text>
            <Text style={styles.compareValue}>{tr('premium.plan.premium', 'Premium')}</Text>
          </View>
          <View style={styles.compareRow}>
            <Text style={styles.compareLabel}>{tr('premium.compare.statusForecast', 'Previsoes de Status')}</Text>
            <Text style={styles.compareValue}>7d</Text>
            <Text style={styles.compareValue}>7/30/90</Text>
            <Text style={styles.compareValue}>7/30/90/360</Text>
          </View>
          <View style={styles.compareRow}>
            <Text style={styles.compareLabel}>{tr('premium.compare.groups', 'Grupos')}</Text>
            <Text style={styles.compareValue}>{tr('common.yes', 'Sim')}</Text>
            <Text style={styles.compareValue}>{tr('common.yes', 'Sim')}</Text>
            <Text style={styles.compareValue}>{tr('common.yes', 'Sim')}</Text>
          </View>
          <View style={styles.compareRow}>
            <Text style={styles.compareLabel}>{tr('premium.compare.creditsPerMonth', 'Creditos/mês')}</Text>
            <Text style={styles.compareValue}>0</Text>
            <Text style={styles.compareValue}>1</Text>
            <Text style={styles.compareValue}>10</Text>
          </View>
          <View style={styles.compareRow}>
            <Text style={styles.compareLabel}>{tr('premium.compare.whatsappBot', 'Chatbot WhatsApp')}</Text>
            <Text style={styles.compareValue}>—</Text>
            <Text style={styles.compareValue}>—</Text>
            <Text style={styles.compareValue}>{tr('common.yes', 'Sim')}</Text>
          </View>
        </View>
      </View>
      <View style={styles.plansContainer}>
          <Text style={styles.sectionTitle}>{tr('premium.oneTimeCredits.title', 'Créditos avulsos (Serviços Premium)')}</Text>
          {creditPacks.map((pack) => (
            <TouchableOpacity
              key={pack.id}
              style={styles.creditCard}
              onPress={() => handlePurchaseCredits(pack)}
              disabled={purchaseLoading === pack.id}
            >
              <Text style={styles.creditTitle}>{pack.label}</Text>
              {purchaseLoading === pack.id ? (
                <ActivityIndicator color="#FFD700" />
              ) : (
                <Text style={styles.creditPrice}>R$ {pack.price.toFixed(2)}</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
    </ScrollView>
  )

  const renderCredits = () => (
    <ScrollView style={styles.tabContent}>
      <View style={styles.hubCard}>
        <Text style={styles.hubTitle}>{tr('premium.yourCredits.title', 'Seus créditos')}</Text>
        <Text style={styles.hubSubtitle}>{tr('premium.yourCredits.subtitle', 'Saldo e compras recentes.')}</Text>
        {creditsLoading ? (
          <ActivityIndicator color="#FFD700" />
        ) : (
          <Text style={styles.creditsValue}>
            {creditsRemaining === null ? tr('premium.credits.unlimited', 'Ilimitado') : creditsRemaining}
          </Text>
        )}
        {(() => {
          const cycle = formatCycleEnd(creditsCycleEnd)
          if (!cycle) return null
          return <Text style={styles.creditsCycle}>{cycle.message}</Text>
        })()}
      </View>
      <View style={styles.plansContainer}>
        <Text style={styles.sectionTitle}>{tr('premium.buyCredits.title', 'Comprar créditos')}</Text>
        {creditPacks.map((pack) => (
          <TouchableOpacity
            key={pack.id}
            style={styles.creditCard}
            onPress={() => handlePurchaseCredits(pack)}
            disabled={purchaseLoading === pack.id}
          >
            <Text style={styles.creditTitle}>{pack.label}</Text>
            {purchaseLoading === pack.id ? (
              <ActivityIndicator color="#FFD700" />
            ) : (
              <Text style={styles.creditPrice}>R$ {pack.price.toFixed(2)}</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  )

  const renderHistory = () => (
    <ScrollView style={styles.tabContent}>
      <View style={styles.hubCard}>
        <Text style={styles.hubTitle}>{tr('premium.creditsHistory.title', 'Histórico de créditos')}</Text>
        {creditsHistoryLoading && (
          <ActivityIndicator color="#FFD700" />
        )}
        {creditsHistoryError && !creditsHistoryLoading && (
          <Text style={styles.errorText}>{creditsHistoryError}</Text>
        )}
        {creditHistory.length === 0 && (
          <Text style={styles.emptyText}>{tr('premium.creditsHistory.empty', 'Sem movimentações ainda.')}</Text>
        )}
        {creditHistory.map((item) => (
          <View key={item.id} style={styles.historyItem}>
            <Ionicons name="time" size={16} color="#FFD700" />
            <View style={styles.historyText}>
              <Text style={styles.historyLabel}>{item.detail || item.type}</Text>
              <Text style={styles.historySummary}>
                {tr('premium.creditsHistory.line', '{type} • {qty} credito(s){delta}{balance}', {
                  type: item.type,
                  qty: item.qty,
                  delta: typeof item.delta === 'number' ? ` (${item.delta > 0 ? '+' : ''}${item.delta})` : '',
                  balance: typeof item.balanceAfter === 'number' ? ` • ${tr('premium.creditsHistory.balance', 'saldo')}: ${item.balanceAfter}` : '',
                })}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  )

  return (
    <LinearGradient colors={['#0F0F23', '#1A1A3A']} style={styles.container}>
      {/* Header Premium */}
      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          <View style={styles.headerTopSpacer} />
          <TouchableOpacity
            style={styles.openPlansButton}
            onPress={() => setSelectedTab('features')}
          >
            <Ionicons name="wallet-outline" size={14} color="#0F0F23" />
            <Text style={styles.openPlansButtonText}>{tr('premium.cta.openPlans', 'Abrir planos')}</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.headerTitle}>{tr('premium.header.title', 'Premium')}</Text>
        <Text style={styles.headerSubtitle}>{tr('premium.header.subtitle', 'Planos e serviços premium')}</Text>
      </View>
      {expiryInfo.show && (
        <ExpiryBanner
          message={expiryMessage}
          variant={expiryInfo.variant}
          onPress={() => setSelectedTab('features')}
        />
      )}
      {checkoutNotice && (
        <View
          style={[
            styles.checkoutNotice,
            checkoutNotice.type === 'success' && styles.checkoutNoticeSuccess,
            checkoutNotice.type === 'cancel' && styles.checkoutNoticeCancel,
            checkoutNotice.type === 'pending' && styles.checkoutNoticePending,
            checkoutNotice.type === 'failure' && styles.checkoutNoticeFailure,
          ]}
        >
          <Text style={styles.checkoutNoticeText}>{checkoutNotice.message}</Text>
          <TouchableOpacity
            onPress={() => {
              setCheckoutNotice(null)
              cleanupCheckoutUrlParams()
            }}
            style={styles.checkoutNoticeClose}
          >
            <Ionicons name="close" size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      )}

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'hub' && styles.activeTab]}
          onPress={() => setSelectedTab('hub')}
        >
          <Text style={[styles.tabText, selectedTab === 'hub' && styles.activeTabText]}>
            {tr('premium.tab.services', 'Serviços Premium')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'credits' && styles.activeTab]}
          onPress={() => setSelectedTab('credits')}
        >
          <Text style={[styles.tabText, selectedTab === 'credits' && styles.activeTabText]}>
            {tr('premium.tab.credits', 'Créditos')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'history' && styles.activeTab]}
          onPress={() => setSelectedTab('history')}
        >
          <Text style={[styles.tabText, selectedTab === 'history' && styles.activeTabText]}>
            {tr('premium.tab.history', 'Histórico')}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {selectedTab === 'features' && renderFeatures()}
      {selectedTab === 'hub' && renderHub()}
      {selectedTab === 'credits' && renderCredits()}
      {selectedTab === 'history' && renderHistory()}
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  headerTopRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  headerTopSpacer: {
    width: 8,
  },
  openPlansButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFD700',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
  },
  openPlansButtonText: {
    color: '#0F0F23',
    fontSize: 12,
    fontWeight: '700',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#AAAAAA',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#1C1C1E',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  checkoutNotice: {
    marginHorizontal: 16,
    marginBottom: 10,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
  },
  checkoutNoticeSuccess: {
    backgroundColor: 'rgba(34,197,94,0.18)',
    borderColor: 'rgba(34,197,94,0.6)',
  },
  checkoutNoticeCancel: {
    backgroundColor: 'rgba(245,158,11,0.18)',
    borderColor: 'rgba(245,158,11,0.6)',
  },
  checkoutNoticePending: {
    backgroundColor: 'rgba(59,130,246,0.18)',
    borderColor: 'rgba(59,130,246,0.6)',
  },
  checkoutNoticeFailure: {
    backgroundColor: 'rgba(239,68,68,0.18)',
    borderColor: 'rgba(239,68,68,0.6)',
  },
  checkoutNoticeText: {
    color: '#FFFFFF',
    fontSize: 13,
    flex: 1,
    paddingRight: 8,
  },
  checkoutNoticeClose: {
    padding: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.14)',
  },
  activeTab: {
    backgroundColor: '#FFD700',
  },
  tabText: {
    fontSize: 14,
    color: '#AAAAAA',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#000000',
    fontWeight: 'bold',
  },
  tabContent: {
    flex: 1,
  },
  hubContent: {
    paddingBottom: 32,
  },
  hubCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  hubTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  hubSubtitle: {
    color: '#AAAAAA',
    fontSize: 13,
    marginBottom: 12,
  },
  creditsValue: {
    color: '#FFD700',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 6,
  },
  creditsCycle: {
    color: '#B8C1FF',
    fontSize: 12,
    marginBottom: 6,
  },
  hubButtonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  serviceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  serviceCard: {
    flexBasis: '48%',
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    padding: 12,
    gap: 6,
  },
  serviceTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  serviceDesc: {
    color: '#B0B0B0',
    fontSize: 11,
  },
  serviceCost: {
    color: '#FFD700',
    fontSize: 11,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#2C2C2E',
    borderColor: '#3A3A3C',
    borderWidth: 1,
    borderRadius: 8,
    color: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
  },
  hubButton: {
    backgroundColor: '#2C2C2E',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  hubButtonText: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: '600',
  },
  lockedBox: {
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  lockedTitle: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  lockedText: {
    color: '#AAAAAA',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 12,
  },
  lockedButton: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  lockedButtonText: {
    color: '#000',
    fontWeight: '700',
  },
  resultLabel: {
    color: '#AAAAAA',
    fontSize: 12,
    marginBottom: 6,
  },
  hubCardsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  hubPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: '#2C2C2E',
  },
  hubCardLabel: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  resultText: {
    color: '#FFFFFF',
    fontSize: 12,
    lineHeight: 18,
  },
  summaryBox: {
    backgroundColor: '#2C2C2E',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  summaryTitle: {
    color: '#FFD700',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 6,
  },
  summaryLine: {
    color: '#FFFFFF',
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 2,
  },
  summaryActions: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  summaryButton: {
    backgroundColor: '#2C2C2E',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  summaryButtonText: {
    color: '#FFD700',
    fontSize: 11,
    fontWeight: '600',
  },
  keyHighlights: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  keyHighlightCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    minWidth: 120,
  },
  keyHighlightLabel: {
    color: '#FFD700',
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 2,
  },
  keyHighlightValue: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  metaText: {
    color: '#AAAAAA',
    fontSize: 11,
    marginTop: 8,
  },
  historySection: {
    marginTop: 16,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2E',
  },
  historyText: {
    flex: 1,
  },
  historyLabel: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  historySummary: {
    color: '#AAAAAA',
    fontSize: 11,
  },
  emptyText: {
    color: '#888',
    fontSize: 12,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 12,
    marginBottom: 8,
  },
  plansContainer: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  planCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
  },
  currentPlan: {
    backgroundColor: '#2A2A2E',
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  planName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  planPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  planFeatures: {
    marginBottom: 8,
  },
  providerChoiceRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  providerChoiceLabel: {
    color: '#B8B8C3',
    fontSize: 12,
    fontWeight: '600',
  },
  providerChoiceButton: {
    borderWidth: 1,
    borderColor: '#4B5563',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#1C1C1E',
  },
  providerChoiceButtonActive: {
    borderColor: '#FFD700',
  },
  providerChoiceButtonDisabled: {
    opacity: 0.45,
  },
  providerChoiceText: {
    color: '#B8B8C3',
    fontSize: 12,
    fontWeight: '600',
  },
  providerChoiceTextActive: {
    color: '#FFD700',
  },
  providerHintText: {
    color: '#9CA3AF',
    fontSize: 12,
    marginBottom: 10,
  },
  compareTable: {
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    padding: 12,
    gap: 6,
  },
  compareRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  compareLabel: {
    flex: 1.2,
    color: '#B8B8C3',
    fontSize: 12,
    fontWeight: '600',
  },
  compareValue: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 12,
    textAlign: 'center',
  },
  planPhoneRow: {
    marginTop: 6,
    gap: 6,
  },
  planPhoneLabel: {
    color: '#AAAAAA',
    fontSize: 12,
  },
  planPhoneInput: {
    backgroundColor: '#2C2C2E',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: '#FFFFFF',
    fontSize: 13,
  },
  planFeature: {
    fontSize: 14,
    color: '#CCCCCC',
    marginBottom: 4,
  },
  creditCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  creditTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  creditPrice: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '700',
  },
  currentBadge: {
    backgroundColor: '#44AA44',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  currentBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  comingSoonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  comingSoonIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  comingSoonTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  comingSoonDescription: {
    fontSize: 16,
    color: '#AAAAAA',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  comingSoonButton: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  comingSoonButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  },
})

