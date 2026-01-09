import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
  Linking,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { MercadoPagoService } from '../services/payment/MercadoPagoService'
import { createPixRequest } from '../services/payment/PixService'
import { useAuth } from '../hooks/useAuth'

const { width } = Dimensions.get('window')

interface SubscriptionPlansModalProps {
  visible: boolean
  onClose: () => void
}

interface PaymentPlan {
  id: string
  name: string
  price: number
  months: number
  discountLabel?: string
  badge?: 'popular' | 'best'
  type: 'card' | 'pix'
}

const CARD_PLAN: PaymentPlan = {
  id: 'premium_monthly',
  name: 'Mensal (cartao)',
  price: 19.90,
  months: 1,
  type: 'card'
}

const PIX_PLANS: PaymentPlan[] = [
  {
    id: 'premium_pix_3m',
    name: 'PIX 3 meses',
    price: 53.70,
    months: 3,
    discountLabel: '10% off',
    type: 'pix'
  },
  {
    id: 'premium_pix_6m',
    name: 'PIX 6 meses',
    price: 95.90,
    months: 6,
    discountLabel: '20% off',
    badge: 'popular',
    type: 'pix'
  },
  {
    id: 'premium_pix_12m',
    name: 'PIX 12 meses',
    price: 168.90,
    months: 12,
    discountLabel: '30% off',
    badge: 'best',
    type: 'pix'
  }
]

const PIX_KEY = 'contato@tabulaestelar.com.br'
const PIX_HOLDER = 'Joao Estellita - Mercado Pago'

export default function SubscriptionPlansModal({ visible, onClose }: SubscriptionPlansModalProps) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [pixDetails, setPixDetails] = useState<{ requestId: string; plan: PaymentPlan } | null>(null)

  const openPaymentLink = async (url: string) => {
    const opener = (globalThis as any)?.open
    if (typeof opener === 'function') {
      opener(url, '_blank', 'noopener,noreferrer')
      return
    }
    await Linking.openURL(url)
  }

  const handleCardSubscribe = async (plan: PaymentPlan) => {
    if (!user?.uid) {
      Alert.alert('Erro', 'Usuario nao identificado.')
      return
    }

    try {
      setLoading(true)

      const paymentData = {
        userId: user.uid,
        planId: plan.id,
        email: user.email || '',
        name: user.displayName || 'Usuario',
        amount: plan.price,
        description: `${plan.name} - Tabula Estelar`,
        externalReference: MercadoPagoService.generateExternalReference(user.uid, plan.id),
        paymentMethod: 'card' as const,
      }

      const preference = await MercadoPagoService.createPaymentPreference(paymentData)

      if (!preference?.init_point) {
        Alert.alert('Erro', 'Nao foi possivel iniciar o pagamento.')
        return
      }

      Alert.alert(
        'Pagamento',
        'Voce sera redirecionado para o Mercado Pago para finalizar a assinatura.',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Continuar',
            onPress: () => {
              openPaymentLink(preference.init_point).catch(() => {
                Alert.alert('Erro', 'Nao foi possivel abrir o link de pagamento.')
              })
            }
          }
        ]
      )
    } catch (error) {
      console.error('Erro ao criar pagamento:', error)
      Alert.alert('Erro', 'Nao foi possivel processar o pagamento. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handlePixSubscribe = async (plan: PaymentPlan) => {
    if (!user?.uid) {
      Alert.alert('Erro', 'Usuario nao identificado.')
      return
    }

    try {
      setLoading(true)
      const response = await createPixRequest({
        userId: user.uid,
        planId: plan.id,
        months: plan.months,
        amount: plan.price,
        payerEmail: user.email || undefined,
        payerName: user.displayName || undefined
      })

      setPixDetails({ requestId: response.requestId, plan })
    } catch (error) {
      console.error('Erro ao criar solicitacao PIX:', error)
      Alert.alert('Erro', 'Nao foi possivel gerar o pagamento via PIX.')
    } finally {
      setLoading(false)
    }
  }

  const renderBadge = (plan: PaymentPlan) => {
    if (plan.badge === 'popular') {
      return (
        <View style={[styles.badge, styles.badgePopular]}>
          <Text style={styles.badgeText}>MAIS POPULAR</Text>
        </View>
      )
    }

    if (plan.badge === 'best') {
      return (
        <View style={[styles.badge, styles.badgeBest]}>
          <Text style={styles.badgeText}>MELHOR CUSTO-BENEFICIO</Text>
        </View>
      )
    }

    return null
  }

  const renderPlanCard = (plan: PaymentPlan) => {
    const monthsLabel = plan.months === 1 ? 'mes' : 'meses'

    return (
    <View key={plan.id} style={[styles.planCard, plan.badge && styles.highlightPlan]}>
      {renderBadge(plan)}
      <View style={styles.planHeader}>
        <Text style={styles.planName}>{plan.name}</Text>
        <View style={styles.priceContainer}>
          <Text style={styles.planPrice}>
            {MercadoPagoService.formatPrice(plan.price)}
          </Text>
          <Text style={styles.planPeriod}>/ {plan.months} {monthsLabel}</Text>
        </View>
        {plan.discountLabel && (
          <Text style={styles.discountText}>{plan.discountLabel}</Text>
        )}
      </View>

      <TouchableOpacity
        style={[styles.subscribeButton, loading && styles.disabledButton]}
        onPress={() => (plan.type === 'pix' ? handlePixSubscribe(plan) : handleCardSubscribe(plan))}
        disabled={loading}
      >
        <Text style={styles.subscribeButtonText}>
          {loading ? 'Processando...' : plan.type === 'pix' ? 'Pagar com PIX' : 'Pagar com cartao'}
        </Text>
      </TouchableOpacity>
    </View>
    )
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Planos Premium</Text>
          <Text style={styles.subtitle}>
            Escolha o plano ideal para sua jornada astrologica
          </Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionTitle}>Cartao</Text>
          {renderPlanCard(CARD_PLAN)}

          <Text style={styles.sectionTitle}>PIX com desconto</Text>
          {PIX_PLANS.map(renderPlanCard)}

          <View style={styles.pixInfoBox}>
            <Text style={styles.pixInfoTitle}>Dados do PIX</Text>
            <Text style={styles.pixInfoText}>Chave: {PIX_KEY}</Text>
            <Text style={styles.pixInfoText}>Titular: {PIX_HOLDER}</Text>
            <Text style={styles.pixInfoHint}>
              Depois do pagamento, envie o comprovante com o ID do pedido.
            </Text>
          </View>
        </ScrollView>
      </View>

      <Modal visible={!!pixDetails} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.pixModal}>
            <Text style={styles.pixModalTitle}>Pagamento PIX gerado</Text>
            {pixDetails && (
              <>
                <Text style={styles.pixModalText}>Plano: {pixDetails.plan.name}</Text>
                <Text style={styles.pixModalText}>Valor: {MercadoPagoService.formatPrice(pixDetails.plan.price)}</Text>
                <Text style={styles.pixModalText}>Chave: {PIX_KEY}</Text>
                <Text style={styles.pixModalText}>Titular: {PIX_HOLDER}</Text>
                <Text style={styles.pixModalText}>ID do pedido: {pixDetails.requestId}</Text>
                <Text style={styles.pixModalHint}>
                  Envie o comprovante e o ID do pedido para liberar o acesso.
                </Text>
              </>
            )}
            <TouchableOpacity style={styles.modalButton} onPress={() => setPixDetails(null)}>
              <Text style={styles.modalButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0e27',
  },
  header: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: '#1a1f3a',
    borderBottomWidth: 1,
    borderBottomColor: '#2d1b69',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#e0e0e0',
    textAlign: 'center',
    lineHeight: 22,
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 12,
  },
  planCard: {
    backgroundColor: '#1a1f3a',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#2d1b69',
    position: 'relative',
  },
  highlightPlan: {
    borderColor: '#FFD700',
  },
  badge: {
    position: 'absolute',
    top: -12,
    left: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgePopular: {
    backgroundColor: '#FFD700',
  },
  badgeBest: {
    backgroundColor: '#10B981',
  },
  badgeText: {
    color: '#000',
    fontSize: 11,
    fontWeight: 'bold',
  },
  planHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  planName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  planPrice: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  planPeriod: {
    fontSize: 14,
    color: '#b0b0b0',
    marginLeft: 6,
  },
  discountText: {
    fontSize: 13,
    color: '#10B981',
    marginTop: 6,
    fontWeight: '600',
  },
  subscribeButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  subscribeButtonText: {
    color: '#000',
    fontSize: 15,
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.6,
  },
  pixInfoBox: {
    marginTop: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.2)',
  },
  pixInfoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 6,
  },
  pixInfoText: {
    fontSize: 13,
    color: '#e0e0e0',
  },
  pixInfoHint: {
    fontSize: 12,
    color: '#b0b0b0',
    marginTop: 8,
    lineHeight: 18,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pixModal: {
    backgroundColor: '#1a1f3a',
    borderRadius: 14,
    padding: 20,
    width: width - 48,
  },
  pixModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 12,
    textAlign: 'center',
  },
  pixModalText: {
    fontSize: 14,
    color: '#e0e0e0',
    marginBottom: 6,
  },
  pixModalHint: {
    fontSize: 12,
    color: '#b0b0b0',
    marginTop: 8,
  },
  modalButton: {
    marginTop: 16,
    backgroundColor: '#FFD700',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#000',
    fontWeight: 'bold',
  },
})
