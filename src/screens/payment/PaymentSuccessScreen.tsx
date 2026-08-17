import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Platform } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { useNavigation } from '@react-navigation/native'
import { useAuth } from '../../hooks/useAuth'
import { MercadoPagoService } from '../../services/payment/MercadoPagoService'
import StripeService from '../../services/payment/StripeService'
import { useAppLanguage } from '../../hooks/useAppLanguage'

export default function PaymentSuccessScreen() {
  const { t } = useAppLanguage()
  const navigation = useNavigation()
  const { user } = useAuth()
  const [statusMessage, setStatusMessage] = useState(t('payment.success.validating'))
  const [loading, setLoading] = useState(true)

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
