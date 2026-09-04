import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Platform } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { useNavigation } from '@react-navigation/native'
import { useAuth } from '../../hooks/useAuth'
import { MercadoPagoService } from '../../services/payment/MercadoPagoService'
import StripeService from '../../services/payment/StripeService'
import { useAppLanguage } from '../../hooks/useAppLanguage'
import { getPlanById } from '../../constants/plans'

// Benefícios por plano (localizado) — mostrados na tela de sucesso da assinatura.
function planBenefits(planId: string | null, lang: string): { name: string; lines: string[] } | null {
  if (!planId) return null
  const tl = (pt: string, en: string, es: string, it: string) => (lang === 'en-US' ? en : lang === 'es-ES' ? es : lang === 'it-IT' ? it : pt)
  const id = planId.toLowerCase()
  const tier = id.startsWith('premium') ? 'premium' : id.startsWith('pro') ? 'pro' : 'essential'
  const p = getPlanById(planId)
  const name = p?.name || (tier === 'premium' ? 'Premium' : tier === 'pro' ? 'Pro' : 'Essential')
  const perfis = tier === 'premium' ? 5 : tier === 'pro' ? 2 : 1
  const grupos = tier === 'premium' ? 3 : tier === 'pro' ? 2 : 1
  const forecast = tier === 'premium' ? 360 : tier === 'pro' ? 90 : 30
  const waDay = tier === 'premium' ? 10 : tier === 'pro' ? 6 : 3
  const lines = [
    tl('Sinastria — a leitura da dupla com quem você ama', 'Synastry — the pair reading with those you love', 'Sinastria — la lectura de la pareja con quien amas', 'Sinastria — la lettura della coppia con chi ami'),
    tl(`${perfis} perfil(is) de monitoramento — acompanhe quem importa`, `${perfis} monitoring profile(s) — follow who matters`, `${perfis} perfil(es) de monitoreo — sigue a quien importa`, `${perfis} profilo/i di monitoraggio — segui chi conta`),
    tl(`Criar ${grupos} grupo(s)`, `Create ${grupos} group(s)`, `Crear ${grupos} grupo(s)`, `Creare ${grupos} gruppo/i`),
    tl(`Previsões de ${forecast} dias à frente`, `Forecasts ${forecast} days ahead`, `Previsiones de ${forecast} dias`, `Previsioni di ${forecast} giorni`),
    tier === 'essential'
      ? tl('Retorno Solar e Lunar', 'Solar and Lunar Return', 'Retorno Solar y Lunar', 'Ritorno Solare e Lunare')
      : tl('Momento Certo + Astrocartografia + Retorno Solar/Lunar', 'Right Moment + Astrocartography + Solar/Lunar Return', 'Momento Justo + Astrocartografia + Retorno Solar/Lunar', 'Momento Giusto + Astrocartografia + Ritorno Solare/Lunare'),
    tl(`Astrólogo no WhatsApp — ${waDay} conversas por dia`, `Astrologer on WhatsApp — ${waDay} chats a day`, `Astrologo en WhatsApp — ${waDay} charlas al dia`, `Astrologo su WhatsApp — ${waDay} chat al giorno`),
  ]
  return { name, lines }
}

export default function PaymentSuccessScreen() {
  const { t, language } = useAppLanguage()
  const navigation = useNavigation()
  const { user } = useAuth()
  const [statusMessage, setStatusMessage] = useState(t('payment.success.validating'))
  const [loading, setLoading] = useState(true)
  const [activePlanId, setActivePlanId] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    async function refreshStatus() {
      if (!user?.uid) {
        setStatusMessage(t('payment.success.loginNeeded'))
        setLoading(false)
        return
      }
      try {
        let provider: string | null = null
        if (Platform.OS === 'web') {
          const params = new URLSearchParams(window.location.search || '')
          provider = params.get('provider')
          const sessionId = params.get('session_id')
          if (provider === 'stripe' && sessionId) {
            try {
              await StripeService.syncCheckoutSession(sessionId, user.uid)
            } catch (syncError) {
              console.warn('Stripe sync checkout failed:', syncError)
            }
          }
        }

        // MercadoPago não tem webhook garantido na hora → sincroniza na volta.
        // Ativa a assinatura buscando o pagamento aprovado deste usuário no MP.
        // Retry curto: o MP pode levar alguns segundos para registrar o aprovado.
        if (provider !== 'stripe') {
          for (let tentativa = 0; tentativa < 3; tentativa++) {
            const r = await MercadoPagoService.syncMercadoPago(user.uid)
            if (r.activated || r.status === 'active') break
            if (tentativa < 2) await new Promise((resolve) => setTimeout(resolve, 2500))
          }
        }

        const status = await MercadoPagoService.getSubscriptionStatus(user.uid)
        if (!active) return
        if (status?.isActive) {
          setStatusMessage(t('payment.success.active'))
          setActivePlanId((status as any)?.planId || (status as any)?.plan || null)
          try { require('../../services/eventos').registrar('assinou') } catch { /* telemetria */ }
        } else if (status?.status === 'pending') {
          setStatusMessage(t('payment.success.pending'))
        } else {
          setStatusMessage(t('payment.success.unconfirmed'))
        }
      } catch {
        if (!active) return
        setStatusMessage(t('payment.success.validateFailed'))
      } finally {
        if (!active) return
        setLoading(false)
      }
    }
    refreshStatus()
    return () => {
      active = false
    }
  }, [user?.uid, t])

  return (
    <LinearGradient colors={['#0F0F23', '#1A1A3A']} style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>{t('payment.success.title')}</Text>
        {loading ? <ActivityIndicator color="#FFD700" /> : <Text style={styles.message}>{statusMessage}</Text>}
        {!loading && activePlanId ? (() => {
          const b = planBenefits(activePlanId, language)
          if (!b) return null
          return (
            <View style={styles.benefits}>
              <Text style={styles.benefitsTitle}>✨ {b.name} — {language === 'en-US' ? 'what you unlocked' : language === 'es-ES' ? 'lo que desbloqueaste' : language === 'it-IT' ? 'cosa hai sbloccato' : 'o que você destravou'}</Text>
              {b.lines.map((l, i) => <Text key={i} style={styles.benefitLine}>• {l}</Text>)}
            </View>
          )
        })() : null}
        <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('Premium' as never)}>
          <Text style={styles.primaryButtonText}>{t('payment.success.cta')}</Text>
        </TouchableOpacity>
        {Platform.OS === 'web' && (
          <TouchableOpacity style={styles.secondaryButton} onPress={() => window.location.reload()}>
            <Text style={styles.secondaryButtonText}>{t('payment.success.refresh')}</Text>
          </TouchableOpacity>
        )}
      </View>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    gap: 12,
  },
  title: {
    color: '#FFD700',
    fontSize: 20,
    fontWeight: '700',
  },
  message: {
    color: '#E0E0E0',
    fontSize: 14,
    textAlign: 'center',
  },
  benefits: {
    width: '100%',
    backgroundColor: 'rgba(255,215,0,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.28)',
    borderRadius: 12,
    padding: 14,
    gap: 6,
    marginTop: 4,
  },
  benefitsTitle: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 2,
  },
  benefitLine: {
    color: '#E8E6F3',
    fontSize: 13,
    lineHeight: 18,
  },
  primaryButton: {
    marginTop: 8,
    backgroundColor: '#FFD700',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
  },
  primaryButtonText: {
    color: '#0F0F23',
    fontWeight: '700',
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: '#FFD700',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  secondaryButtonText: {
    color: '#FFD700',
    fontWeight: '600',
  },
})
