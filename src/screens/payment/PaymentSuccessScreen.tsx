import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Platform } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { useNavigation } from '@react-navigation/native'
import { useAuth } from '../../hooks/useAuth'
import { MercadoPagoService } from '../../services/payment/MercadoPagoService'
import { useAppLanguage } from '../../hooks/useAppLanguage'

export default function PaymentSuccessScreen() {
  useAppLanguage()
  const navigation = useNavigation()
  const { user } = useAuth()
  const [statusMessage, setStatusMessage] = useState('Validando sua assinatura...')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    async function refreshStatus() {
      if (!user?.uid) {
        setStatusMessage('Faça login para validar sua assinatura.')
        setLoading(false)
        return
      }
      try {
        const status = await MercadoPagoService.getSubscriptionStatus(user.uid)
        if (!active) return
        if (status?.isActive) {
          setStatusMessage('Assinatura ativa! Recursos liberados.')
        } else if (status?.status === 'pending') {
          setStatusMessage('Pagamento pendente. Aguarde confirmação do Mercado Pago.')
        } else {
          setStatusMessage('Não foi possível confirmar a assinatura ainda.')
        }
      } catch {
        if (!active) return
        setStatusMessage('Falha ao validar assinatura. Tente novamente.')
      } finally {
        if (!active) return
        setLoading(false)
      }
    }
    refreshStatus()
    return () => {
      active = false
    }
  }, [user?.uid])

  return (
    <LinearGradient colors={['#0F0F23', '#1A1A3A']} style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Pagamento aprovado</Text>
        {loading ? <ActivityIndicator color="#FFD700" /> : <Text style={styles.message}>{statusMessage}</Text>}
        <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('Premium' as never)}>
          <Text style={styles.primaryButtonText}>Ir para Premium</Text>
        </TouchableOpacity>
        {Platform.OS === 'web' && (
          <TouchableOpacity style={styles.secondaryButton} onPress={() => window.location.reload()}>
            <Text style={styles.secondaryButtonText}>Atualizar página</Text>
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
