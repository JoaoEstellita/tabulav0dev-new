/**
 * ðŸ’Ž PREMIUM SCREEN ðŸ’Ž
 * 
 * Tela com recursos PREMIUM pagos
 * APIs Prokerala, matching de casais, anÃ¡lises profissionais
 */

import React, { useEffect, useMemo, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput, ActivityIndicator, Platform, Linking } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useAuth } from '../../hooks/useAuth'
import { useSubscriptionCheck } from '../../hooks/useSubscriptionCheck'
import { useRoute } from '@react-navigation/native'
import AstrologerPremiumService from '../../services/premium/AstrologerPremiumService'
import MercadoPagoService from '../../services/payment/MercadoPagoService'
import { CREDIT_PACKS, PLAN_DEFINITIONS } from '../../constants/plans'
import ExpiryBanner from '../../components/ExpiryBanner'
import { getExpiryBannerInfo } from '../../utils/expiry'

const HUB_HISTORY_KEY = 'premium_hub_history'

const HUB_ACTIONS: Record<string, { label: string; icon: string; description: string; cost: number }> = {
  birth: { label: 'Mapa natal', icon: 'star', description: 'Leitura completa do seu mapa natal.', cost: 1 },
  transit: { label: 'Transitos', icon: 'pulse', description: 'Analise do dia/periodo escolhido.', cost: 1 },
  synastry: { label: 'Sinastria', icon: 'heart', description: 'Compatibilidade entre duas pessoas.', cost: 2 },
  composite: { label: 'Mapa composto', icon: 'git-compare', description: 'Mapa da relacao.', cost: 1 },
  solar: { label: 'Retorno solar', icon: 'sunny', description: 'Analise do novo ciclo solar.', cost: 1 },
  lunar: { label: 'Retorno lunar', icon: 'moon', description: 'Analise do ciclo lunar.', cost: 1 },
}

type HubHistoryItem = {
  id: string
  action: string
  ts: string
  summary: string
}

export default function PremiumScreen() {
  const { user } = useAuth()
  const { subscription, trialActive, isAdmin } = useSubscriptionCheck()
  const route = useRoute<any>()
  const planId = (subscription?.planId || '').toLowerCase()
  const isPremium = isAdmin || subscription?.active === true
  const hasHubAccess = isAdmin || (subscription?.active && (planId.startsWith('premium_') || planId === 'premium_monthly' || planId.startsWith('pro_') || planId === 'pro_monthly'))
  const [selectedTab, setSelectedTab] = useState<'features' | 'hub' | 'credits' | 'history'>(hasHubAccess ? 'hub' : 'features')
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
  const [creditHistory, setCreditHistory] = useState<Array<{ id: string; type: string; qty: number; ts: string; detail?: string }>>([])
  const [exportingPdf, setExportingPdf] = useState(false)
  const [premiumPhone, setPremiumPhone] = useState('')
  const [creditsRemaining, setCreditsRemaining] = useState<number | null>(null)
  const [creditsLoading, setCreditsLoading] = useState(false)
  const [creditsCycleEnd, setCreditsCycleEnd] = useState<string | null>(null)
  const [purchaseLoading, setPurchaseLoading] = useState<string | null>(null)
  const expiryInfo = useMemo(() => {
    return getExpiryBannerInfo({
      featureLabel: 'Premium',
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
    return `${expiryInfo.message} (${daysLeft} dias)`
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
    if (requestedTab && typeof requestedTab === 'string') {
      setSelectedTab(requestedTab)
    }
  }, [route?.params?.openTab])

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
    const formatted = date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
    const plural = daysLeft === 1 ? 'dia' : 'dias'
    return { label: formatted, daysLeft, message: `Renova em ${daysLeft} ${plural} (${formatted}).` }
  }

  const handlePurchaseCredits = (pack: { id: string; label: string; price: number }) => {
    if (!user) {
      Alert.alert('Login', 'Faça login para comprar créditos.')
      return
    }
    if (purchaseLoading) return
    Alert.alert(
      'Confirmar compra',
      `Comprar ${pack.label} por R$ ${pack.price.toFixed(2)}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Comprar',
          onPress: async () => {
            try {
              setPurchaseLoading(pack.id)
              const preference = await MercadoPagoService.createPaymentPreference({
                userId: user.uid,
                planId: pack.id,
                email: user.email || '',
                name: user.displayName || user.email || 'Usuario',
                amount: pack.price,
                description: pack.label,
                externalReference: MercadoPagoService.generateExternalReference(user.uid, pack.id),
              })
              const checkoutUrl = preference?.checkout_url || preference?.init_point || preference?.sandbox_init_point
              if (!checkoutUrl) {
                Alert.alert('Erro', 'Nao foi possivel gerar o link de pagamento.')
                return
              }
              await Linking.openURL(checkoutUrl)
            } catch (error: any) {
              Alert.alert('Erro', 'Não foi possível iniciar a compra agora.')
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
      Alert.alert('Numero necessario', 'Informe o numero do WhatsApp para assinar o Premium.')
      return
    }
    if (plan.requiresPhone && user) {
      user.getIdToken(true)
        .then((token) => AstrologerPremiumService.registerWhatsApp(token, premiumPhone.trim()))
        .catch(() => null)
    }
    if (!user) {
      Alert.alert('Login', 'Faça login para assinar.')
      return
    }
    try {
      const planConfig = MercadoPagoService.getPlanById(plan.id)
      if (!planConfig) {
        Alert.alert('Plano invalido', 'Nao foi possivel localizar o plano selecionado.')
        return
      }
      const preference = await MercadoPagoService.createPaymentPreference({
        userId: user.uid,
        planId: planConfig.id,
        email: user.email || '',
        name: user.displayName || user.email || 'Usuario',
        amount: planConfig.price,
        description: planConfig.name,
        externalReference: MercadoPagoService.generateExternalReference(user.uid, planConfig.id),
      })
      const checkoutUrl = preference?.checkout_url || preference?.init_point || preference?.sandbox_init_point
      if (!checkoutUrl) {
        Alert.alert('Erro', 'Nao foi possivel gerar o link de pagamento.')
        return
      }
      await Linking.openURL(checkoutUrl)
    } catch (error) {
      Alert.alert('Erro', 'Falha ao iniciar pagamento. Tente novamente.')
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
    if (!data) return { title: 'Resumo', lines: ['Sem dados disponíveis.'] }
    if (typeof data === 'string') {
      const lines = extractSummaryLines(data)
      return { title: 'Resumo', lines: lines.length ? lines : ['Leitura sem resumo disponível.'] }
    }
    if (typeof data === 'object') {
      const rawText = data.summary || data.context || data.text || data.interpretation || data.description || null
      const lines = extractSummaryLines(rawText)
      if (lines.length) return { title: 'Resumo', lines }
      const keys = Object.keys(data || {}).slice(0, 6)
      if (keys.length) return { title: 'Campos principais', lines: keys.map((key) => key) }
      return { title: 'Resumo', lines: ['Leitura sem resumo disponível.'] }
    }
    return { title: 'Resumo', lines: ['Leitura sem resumo disponível.'] }
  }

  const buildKeyHighlights = (data: any) => {
    if (!data || typeof data !== 'object') return []
    const candidates: Array<{ key: string; label: string }> = [
      { key: 'highlights', label: 'Destaques' },
      { key: 'recommendations', label: 'Recomendacoes' },
      { key: 'key_points', label: 'Pontos chave' },
      { key: 'themes', label: 'Temas' },
      { key: 'warnings', label: 'Atencoes' },
      { key: 'strengths', label: 'Forcas' },
      { key: 'challenges', label: 'Desafios' },
    ]
    return candidates
      .filter((item) => data[item.key])
      .slice(0, 4)
      .map((item) => ({
        label: item.label,
        value: Array.isArray(data[item.key]) ? `${data[item.key].length} itens` : 'ok',
      }))
  }

  const getActionMeta = (action: string | null) => {
    if (!action) return { label: 'Leitura premium', icon: 'sparkles' }
    return HUB_ACTIONS[action] || { label: 'Leitura premium', icon: 'sparkles' }
  }

  const copySummary = async () => {
    if (!hubResult) return
    const summary = buildSummary(hubResult)
    const text = `${summary.title}\n- ${summary.lines.join('\n- ')}`
    try {
      if (Platform.OS === 'web' && navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text)
        Alert.alert('Copiado', 'Resumo copiado para a área de transferência.')
      } else {
        Alert.alert('Copiar', 'Copie manualmente o resumo na tela.')
      }
    } catch {
      Alert.alert('Copiar', 'Não foi possível copiar automaticamente.')
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
          ? [{ title: 'Destaques', content: highlights.map((h) => `${h.label}: ${h.value}`).join('\n') }]
          : []),
      ]
      const payload = {
        title: `Tabula Estelar - ${actionMeta.label}`,
        summary: summary.lines.join('\n'),
        sections,
        footer: 'Tabula Estelar',
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
        Alert.alert('Exportar PDF', 'Exportacao disponivel no web por enquanto.')
      }
    } catch (error) {
      Alert.alert('Erro', 'Nao foi possivel exportar o PDF.')
    } finally {
      setExportingPdf(false)
    }
  }

  const runAction = async (action: string) => {
    if (!user) {
      Alert.alert('Login', 'Faça login para acessar recursos premium.')
      return
    }
    const actionMeta = HUB_ACTIONS[action]
    if (creditsRemaining !== null && actionMeta && creditsRemaining < actionMeta.cost) {
      Alert.alert('Sem creditos', 'Creditos insuficientes para esta leitura.')
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
          type: 'consumo',
          qty: actionMeta.cost,
          ts: new Date().toISOString(),
          detail: actionMeta.label,
        }
        setCreditHistory((prev) => [creditEntry, ...prev].slice(0, 20))
      }
    } catch (error) {
      const code = error?.code || 'error'
      if (code === 'credits_insufficient' || code === 'credits_unavailable') {
        setHubError('Sem creditos suficientes. Compre mais creditos para continuar.')
      } else {
        setHubError(`${code}: ${error?.message || 'Falha ao consultar premium'}`)
      }
    } finally {
      setHubLoading(false)
    }
  }

  const renderHub = () => (
    <ScrollView style={styles.tabContent} contentContainerStyle={styles.hubContent}>
      {!hasHubAccess && (
        <View style={styles.lockedBox}>
          <Text style={styles.lockedTitle}>Premium bloqueado</Text>
          <Text style={styles.lockedText}>Assine o plano Pro ou Premium para desbloquear o Hub.</Text>
          <TouchableOpacity style={styles.lockedButton} onPress={() => setSelectedTab('features')}>
            <Text style={styles.lockedButtonText}>Ver planos</Text>
          </TouchableOpacity>
        </View>
      )}

      {hasHubAccess && (
        <>
          <View style={styles.hubCard}>
            <Text style={styles.hubTitle}>Creditos disponiveis</Text>
            {creditsLoading ? (
              <ActivityIndicator color="#FFD700" />
            ) : (
              <Text style={styles.creditsValue}>
                {creditsRemaining === null ? 'Ilimitado' : creditsRemaining}
              </Text>
            )}
            {(() => {
              const cycle = formatCycleEnd(creditsCycleEnd)
              if (!cycle) return null
              return <Text style={styles.creditsCycle}>{cycle.message}</Text>
            })()}
            <Text style={styles.hubSubtitle}>
              Sinastria custa 2 creditos. Demais leituras custam 1 credito.
            </Text>
          </View>
          <View style={styles.hubCard}>
            <Text style={styles.hubTitle}>Servicos Premium (API Astrologer)</Text>
            <Text style={styles.hubSubtitle}>Selecione uma leitura para gerar agora.</Text>
            <View style={styles.serviceGrid}>
              {Object.entries(HUB_ACTIONS).map(([key, meta]) => (
                <TouchableOpacity key={key} style={styles.serviceCard} onPress={() => runAction(key)}>
                  <Ionicons name={meta.icon as any} size={20} color="#FFD700" />
                  <Text style={styles.serviceTitle}>{meta.label}</Text>
                  <Text style={styles.serviceDesc}>{meta.description}</Text>
                  <Text style={styles.serviceCost}>Custo: {meta.cost} credito</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.hubCard}>
            <Text style={styles.hubTitle}>Data alvo</Text>
            <TextInput
              style={styles.input}
              value={targetDate}
              onChangeText={setTargetDate}
              placeholder="YYYY-MM-DD"
              placeholderTextColor="#888"
            />
          </View>

          <View style={styles.hubCard}>
            <Text style={styles.hubTitle}>Dados do parceiro (sinastria/composite)</Text>
            <TextInput style={styles.input} value={partnerBirthDate} onChangeText={setPartnerBirthDate} placeholder="Data (YYYY-MM-DD)" placeholderTextColor="#888" />
            <TextInput style={styles.input} value={partnerBirthTime} onChangeText={setPartnerBirthTime} placeholder="Hora (HH:MM)" placeholderTextColor="#888" />
            <TextInput style={styles.input} value={partnerLat} onChangeText={setPartnerLat} placeholder="Latitude" placeholderTextColor="#888" />
            <TextInput style={styles.input} value={partnerLon} onChangeText={setPartnerLon} placeholder="Longitude" placeholderTextColor="#888" />
            <TextInput style={styles.input} value={partnerTz} onChangeText={setPartnerTz} placeholder="Timezone" placeholderTextColor="#888" />
            <TextInput style={styles.input} value={partnerCity} onChangeText={setPartnerCity} placeholder="Cidade" placeholderTextColor="#888" />
            <TextInput style={styles.input} value={partnerCountry} onChangeText={setPartnerCountry} placeholder="País" placeholderTextColor="#888" />
          </View>

          <View style={styles.hubCard}>
            <Text style={styles.hubTitle}>Resultado</Text>
            {hubLoading && <ActivityIndicator color="#FFD700" />}
            {hubError && <Text style={styles.errorText}>{hubError}</Text>}
            {!hubLoading && !hubError && hubResult && (
              <>
                <Text style={styles.resultLabel}>Última ação: {lastAction}</Text>
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
                        cache: {hubMeta?.cacheHit ? 'hit' : 'miss'}
                      </Text>
                    </View>
                    <View style={styles.hubPill}>
                      <Ionicons name="time" size={18} color="#4ECDC4" />
                      <Text style={styles.hubCardLabel}>
                        {hubMeta?.durationMs ? `${hubMeta.durationMs}ms` : 'tempo n/d'}
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
                    <Text style={styles.summaryButtonText}>Copiar resumo</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.summaryButton} onPress={handleExportPdf} disabled={exportingPdf}>
                    <Text style={styles.summaryButtonText}>
                      {exportingPdf ? 'Gerando PDF...' : 'Exportar PDF'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.summaryButton} onPress={() => setShowJson((prev) => !prev)}>
                    <Text style={styles.summaryButtonText}>{showJson ? 'Ocultar JSON' : 'Ver JSON'}</Text>
                  </TouchableOpacity>
                </View>
                {showJson && <Text style={styles.resultText}>{formatResult(hubResult)}</Text>}
                {hubMeta && (
                  <Text style={styles.metaText}>
                    cacheHit: {String(hubMeta.cacheHit)} · creditsRemaining: {hubMeta.creditsRemaining ?? 'n/a'}
                  </Text>
                )}
              </>
            )}
            {!hubLoading && hubHistory.length > 0 && (
              <View style={styles.historySection}>
                <Text style={styles.sectionTitle}>Historico recente</Text>
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
              <Text style={styles.emptyText}>Nenhuma leitura executada ainda.</Text>
            )}
          </View>
        </>
      )}
    </ScrollView>
  )

  const renderFeatures = () => (
    <ScrollView style={styles.tabContent}>
      <View style={styles.plansContainer}>
          <Text style={styles.sectionTitle}>Planos de Assinatura</Text>
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
                {plan.price === 0 ? 'Gratis' : `R$ ${(plan.price || 0).toFixed(2)}/mes`}
              </Text>
            </View>
            <View style={styles.planFeatures}>
              {plan.features.map((feature, index) => (
                <Text key={index} style={styles.planFeature}>✓ {feature}</Text>
              ))}
            </View>
            {plan.requiresPhone && (
              <View style={styles.planPhoneRow}>
                <Text style={styles.planPhoneLabel}>WhatsApp (Premium)</Text>
                <TextInput
                  style={styles.planPhoneInput}
                  placeholder="(DD) 9xxxx-xxxx"
                  placeholderTextColor="#888"
                  value={premiumPhone}
                  onChangeText={setPremiumPhone}
                  keyboardType="phone-pad"
                />
              </View>
            )}
            {plan.current && (
              <View style={styles.currentBadge}>
                <Text style={styles.currentBadgeText}>Plano Atual</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.plansContainer}>
        <Text style={styles.sectionTitle}>Comparar planos</Text>
        <View style={styles.compareTable}>
          <View style={styles.compareRow}>
            <Text style={styles.compareLabel}>Recurso</Text>
            <Text style={styles.compareValue}>Essential</Text>
            <Text style={styles.compareValue}>Pro</Text>
            <Text style={styles.compareValue}>Premium</Text>
          </View>
          <View style={styles.compareRow}>
            <Text style={styles.compareLabel}>Previsoes de Status</Text>
            <Text style={styles.compareValue}>7d</Text>
            <Text style={styles.compareValue}>7/30/90</Text>
            <Text style={styles.compareValue}>7/30/90/360</Text>
          </View>
          <View style={styles.compareRow}>
            <Text style={styles.compareLabel}>Grupos</Text>
            <Text style={styles.compareValue}>Sim</Text>
            <Text style={styles.compareValue}>Sim</Text>
            <Text style={styles.compareValue}>Sim</Text>
          </View>
          <View style={styles.compareRow}>
            <Text style={styles.compareLabel}>Creditos/mês</Text>
            <Text style={styles.compareValue}>0</Text>
            <Text style={styles.compareValue}>1</Text>
            <Text style={styles.compareValue}>10</Text>
          </View>
          <View style={styles.compareRow}>
            <Text style={styles.compareLabel}>Chatbot WhatsApp</Text>
            <Text style={styles.compareValue}>—</Text>
            <Text style={styles.compareValue}>—</Text>
            <Text style={styles.compareValue}>Sim</Text>
          </View>
        </View>
      </View>
      <View style={styles.plansContainer}>
          <Text style={styles.sectionTitle}>Creditos Avulsos (Servicos Premium)</Text>
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
        <Text style={styles.hubTitle}>Seus creditos</Text>
        <Text style={styles.hubSubtitle}>Saldo e compras recentes.</Text>
        {creditsLoading ? (
          <ActivityIndicator color="#FFD700" />
        ) : (
          <Text style={styles.creditsValue}>
            {creditsRemaining === null ? 'Ilimitado' : creditsRemaining}
          </Text>
        )}
        {(() => {
          const cycle = formatCycleEnd(creditsCycleEnd)
          if (!cycle) return null
          return <Text style={styles.creditsCycle}>{cycle.message}</Text>
        })()}
      </View>
      <View style={styles.plansContainer}>
        <Text style={styles.sectionTitle}>Comprar creditos</Text>
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
        <Text style={styles.hubTitle}>Historico de creditos</Text>
        {creditHistory.length === 0 && (
          <Text style={styles.emptyText}>Sem movimentacoes ainda.</Text>
        )}
        {creditHistory.map((item) => (
          <View key={item.id} style={styles.historyItem}>
            <Ionicons name="time" size={16} color="#FFD700" />
            <View style={styles.historyText}>
              <Text style={styles.historyLabel}>{item.detail || item.type}</Text>
              <Text style={styles.historySummary}>
                {item.type} • {item.qty} credito(s)
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
        <Text style={styles.headerTitle}>Premium</Text>
        <Text style={styles.headerSubtitle}>Planos e servicos premium</Text>
      </View>
      {expiryInfo.show && (
        <ExpiryBanner
          message={expiryMessage}
          variant={expiryInfo.variant}
          onPress={() => setSelectedTab('features')}
        />
      )}

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'features' && styles.activeTab]}
          onPress={() => setSelectedTab('features')}
        >
          <Text style={[styles.tabText, selectedTab === 'features' && styles.activeTabText]}>
            Planos
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'hub' && styles.activeTab]}
          onPress={() => setSelectedTab('hub')}
        >
          <Text style={[styles.tabText, selectedTab === 'hub' && styles.activeTabText]}>
            Servicos Premium
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'credits' && styles.activeTab]}
          onPress={() => setSelectedTab('credits')}
        >
          <Text style={[styles.tabText, selectedTab === 'credits' && styles.activeTabText]}>
            Creditos
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'history' && styles.activeTab]}
          onPress={() => setSelectedTab('history')}
        >
          <Text style={[styles.tabText, selectedTab === 'history' && styles.activeTabText]}>
            Historico
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

