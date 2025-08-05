/**
 * 💎 SUBSCRIPTION SCREEN 💎
 * 
 * Tela completa de assinaturas com:
 * - Planos visuais e atrativos
 * - Trial gratuito
 * - Fluxo de pagamento integrado
 * - Gestão de assinaturas ativas
 */

import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Linking,
  SafeAreaView
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { useAuth } from '../../hooks/useAuth'
import MercadoPagoService, { type SubscriptionPlan, type SubscriptionStatus } from '../../services/payment/MercadoPagoService'
import SubscriptionPlanCard from '../../components/SubscriptionPlanCard'

export default function SubscriptionScreen() {
  const { user } = useAuth()
  
  // Estados
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null)
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [processingPayment, setProcessingPayment] = useState(false)
  const [startingTrial, setStartingTrial] = useState(false)

  // Carregar status da assinatura
  useEffect(() => {
    loadSubscriptionStatus()
  }, [user])

  const loadSubscriptionStatus = async () => {
    if (!user?.uid) return

    try {
      setLoading(true)
      const status = await MercadoPagoService.getSubscriptionStatus(user.uid)
      setSubscriptionStatus(status)
      
      // Selecionar plano atual se existir
      if (status.planId) {
        const currentPlan = MercadoPagoService.getPlanById(status.planId)
        if (currentPlan) {
          setSelectedPlan(currentPlan)
        }
      } else {
        // Selecionar plano anual como padrão (mais popular)
        setSelectedPlan(MercadoPagoService.PLANS[1])
      }
      
    } catch (error) {
      console.error('Erro ao carregar status da assinatura:', error)
      Alert.alert('Erro', 'Não foi possível carregar informações da assinatura')
    } finally {
      setLoading(false)
    }
  }

  const handleStartTrial = async (plan: SubscriptionPlan) => {
    if (!user?.uid) {
      Alert.alert('Erro', 'Usuário não autenticado')
      return
    }

    try {
      setStartingTrial(true)
      
      const success = await MercadoPagoService.startFreeTrial(user.uid, plan.id)
      
      if (success) {
        Alert.alert(
          '🎉 Trial Ativado!',
          `Você agora tem ${plan.trialDays} dias grátis para testar todos os recursos premium!\n\nAproveite sua experiência completa no Tabula Estelar.`,
          [
            {
              text: 'Começar a usar',
              onPress: () => {
                // Recarregar status
                loadSubscriptionStatus()
              }
            }
          ]
        )
      } else {
        Alert.alert('Erro', 'Não foi possível ativar o trial. Você pode já ter usado seu período gratuito.')
      }
      
    } catch (error) {
      console.error('Erro ao iniciar trial:', error)
      Alert.alert('Erro', 'Falha ao ativar trial. Tente novamente.')
    } finally {
      setStartingTrial(false)
    }
  }

  const handleSubscribe = async () => {
    if (!selectedPlan || !user?.uid) {
      Alert.alert('Erro', 'Selecione um plano primeiro')
      return
    }

    try {
      setProcessingPayment(true)
      
      const externalReference = MercadoPagoService.generateExternalReference(user.uid, selectedPlan.id)
      
      const paymentData = {
        userId: user.uid,
        planId: selectedPlan.id,
        email: user.email || '',
        name: user.displayName || 'Usuário',
        amount: selectedPlan.price,
        description: selectedPlan.name,
        externalReference,
      }
      
      const preference = await MercadoPagoService.createPaymentPreference(paymentData)
      
      // Mostrar confirmação antes de redirecionar
      Alert.alert(
        '💳 Redirecionando para Pagamento',
        `Você será redirecionado para finalizar o pagamento de ${MercadoPagoService.formatPrice(selectedPlan.price)}.\n\nApós a confirmação, sua assinatura será ativada automaticamente.`,
        [
          {
            text: 'Cancelar',
            style: 'cancel'
          },
          {
            text: 'Continuar',
            onPress: () => {
              Linking.openURL(preference.init_point)
            }
          }
        ]
      )
      
    } catch (error) {
      console.error('Erro ao processar pagamento:', error)
      Alert.alert('Erro', 'Falha ao processar pagamento. Tente novamente.')
    } finally {
      setProcessingPayment(false)
    }
  }

  const handleCancelSubscription = async () => {
    if (!user?.uid || !subscriptionStatus?.isActive) return

    Alert.alert(
      '⚠️ Cancelar Assinatura',
      'Tem certeza que deseja cancelar sua assinatura?\n\nVocê continuará com acesso premium até o final do período pago.',
      [
        {
          text: 'Não cancelar',
          style: 'cancel'
        },
        {
          text: 'Confirmar Cancelamento',
          style: 'destructive',
          onPress: async () => {
            try {
              const success = await MercadoPagoService.cancelSubscription(user.uid)
              
              if (success) {
                Alert.alert('✅ Assinatura Cancelada', 'Sua assinatura foi cancelada com sucesso.')
                loadSubscriptionStatus()
              } else {
                Alert.alert('Erro', 'Não foi possível cancelar a assinatura.')
              }
            } catch (error) {
              console.error('Erro ao cancelar assinatura:', error)
              Alert.alert('Erro', 'Falha ao cancelar assinatura.')
            }
          }
        }
      ]
    )
  }

  if (loading) {
    return (
      <LinearGradient colors={["#0F0F23", "#1A1A3A"]} style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFD700" />
          <Text style={styles.loadingText}>Carregando assinatura...</Text>
        </View>
      </LinearGradient>
    )
  }

  // Se usuário tem assinatura ativa ou trial
  if (subscriptionStatus?.isActive) {
    return (
      <LinearGradient colors={["#0F0F23", "#1A1A3A"]} style={styles.container}>
        <SafeAreaView style={styles.container}>
          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>💎 Assinatura Premium</Text>
              <Text style={styles.subtitle}>
                {MercadoPagoService.isInTrial(subscriptionStatus) ? 'Trial Ativo' : 'Assinatura Ativa'}
              </Text>
            </View>

            {/* Status Card */}
            <View style={styles.statusCard}>
              <LinearGradient
                colors={MercadoPagoService.isInTrial(subscriptionStatus) ? ['#FFD700', '#FFA500'] : ['#4CAF50', '#45A049']}
                style={styles.statusGradient}
              >
                <View style={styles.statusHeader}>
                  <Ionicons 
                    name={MercadoPagoService.isInTrial(subscriptionStatus) ? "gift" : "checkmark-circle"} 
                    size={32} 
                    color="#000" 
                  />
                  <Text style={styles.statusTitle}>
                    {MercadoPagoService.isInTrial(subscriptionStatus) ? 'Trial Gratuito' : 'Premium Ativo'}
                  </Text>
                </View>

                <Text style={styles.statusSubtitle}>
                  {subscriptionStatus.planId ? MercadoPagoService.getPlanById(subscriptionStatus.planId)?.name : 'Plano Premium'}
                </Text>

                {MercadoPagoService.isInTrial(subscriptionStatus) ? (
                  <Text style={styles.statusDetails}>
                    🎁 {MercadoPagoService.getTrialDaysRemaining(subscriptionStatus)} dias restantes do trial
                  </Text>
                ) : (
                  <Text style={styles.statusDetails}>
                    ✨ Renovação em {subscriptionStatus.nextBillingDate ? new Date(subscriptionStatus.nextBillingDate).toLocaleDateString('pt-BR') : 'N/A'}
                  </Text>
                )}
              </LinearGradient>
            </View>

            {/* Recursos Ativos */}
            <View style={styles.featuresSection}>
              <Text style={styles.sectionTitle}>🚀 Recursos Disponíveis</Text>
              {MercadoPagoService.PLANS[0].features.map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>

            {/* Ações */}
            <View style={styles.actionsSection}>
              {MercadoPagoService.isInTrial(subscriptionStatus) && (
                <TouchableOpacity
                  style={styles.upgradeButton}
                  onPress={() => {
                    // Scroll para os planos
                    setSubscriptionStatus(null) // Temporário para mostrar planos
                  }}
                >
                  <LinearGradient colors={['#FFD700', '#FFA500']} style={styles.upgradeGradient}>
                    <Ionicons name="arrow-up-circle" size={24} color="#000" />
                    <Text style={styles.upgradeButtonText}>Assinar Agora</Text>
                  </LinearGradient>
                </TouchableOpacity>
              )}

              <TouchableOpacity style={styles.cancelButton} onPress={handleCancelSubscription}>
                <Text style={styles.cancelButtonText}>Cancelar Assinatura</Text>
              </TouchableOpacity>
            </View>

          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    )
  }

  // Tela de seleção de planos
  return (
    <LinearGradient colors={["#0F0F23", "#1A1A3A"]} style={styles.container}>
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>✨ Desbloqueie o Poder dos Astros</Text>
            <Text style={styles.subtitle}>
              Acesse recursos premium e descubra insights astrológicos únicos
            </Text>
          </View>

          {/* Planos */}
          <View style={styles.plansSection}>
            {MercadoPagoService.PLANS.map((plan) => (
              <SubscriptionPlanCard
                key={plan.id}
                plan={plan}
                isSelected={selectedPlan?.id === plan.id}
                onSelect={setSelectedPlan}
                disabled={processingPayment || startingTrial}
              />
            ))}
          </View>

          {/* Botões de Ação */}
          <View style={styles.actionButtons}>
            {/* Botão Trial */}
            {selectedPlan?.trialDays && (
              <TouchableOpacity
                style={[styles.trialButton, startingTrial && styles.disabledButton]}
                onPress={() => selectedPlan && handleStartTrial(selectedPlan)}
                disabled={startingTrial || processingPayment}
              >
                <LinearGradient colors={['#4CAF50', '#45A049']} style={styles.buttonGradient}>
                  {startingTrial ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Ionicons name="gift" size={24} color="#FFFFFF" />
                  )}
                  <Text style={styles.trialButtonText}>
                    {startingTrial ? 'Ativando...' : `Teste ${selectedPlan?.trialDays} dias grátis`}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            )}

            {/* Botão Assinar */}
            <TouchableOpacity
              style={[styles.subscribeButton, processingPayment && styles.disabledButton]}
              onPress={handleSubscribe}
              disabled={!selectedPlan || processingPayment || startingTrial}
            >
              <LinearGradient colors={['#FFD700', '#FFA500']} style={styles.buttonGradient}>
                {processingPayment ? (
                  <ActivityIndicator size="small" color="#000" />
                ) : (
                  <Ionicons name="card" size={24} color="#000" />
                )}
                <Text style={styles.subscribeButtonText}>
                  {processingPayment 
                    ? 'Processando...' 
                    : `Assinar por ${selectedPlan ? MercadoPagoService.formatPrice(selectedPlan.price) : 'R$ 0,00'}`
                  }
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Garantia */}
          <View style={styles.guaranteeSection}>
            <Ionicons name="shield-checkmark" size={24} color="#4CAF50" />
            <Text style={styles.guaranteeText}>
              🔒 Pagamento 100% seguro via Mercado Pago{'\n'}
              ⚡ Ativação instantânea após confirmação{'\n'}
              🔄 Cancele quando quiser
            </Text>
          </View>

        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 16,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#CCCCCC',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  plansSection: {
    marginBottom: 24,
  },
  actionButtons: {
    gap: 16,
    marginBottom: 24,
  },
  trialButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  subscribeButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
    gap: 12,
  },
  trialButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  subscribeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  guaranteeSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 32,
    gap: 12,
  },
  guaranteeText: {
    flex: 1,
    fontSize: 14,
    color: '#CCCCCC',
    lineHeight: 20,
  },
  // Estilos para assinatura ativa
  statusCard: {
    borderRadius: 20,
    marginBottom: 24,
    overflow: 'hidden',
  },
  statusGradient: {
    padding: 24,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  statusTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  statusSubtitle: {
    fontSize: 18,
    color: '#333',
    marginBottom: 8,
  },
  statusDetails: {
    fontSize: 16,
    color: '#333',
  },
  featuresSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    gap: 12,
  },
  featureText: {
    fontSize: 16,
    color: '#FFFFFF',
    flex: 1,
  },
  actionsSection: {
    gap: 16,
    marginBottom: 32,
  },
  upgradeButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  upgradeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
    gap: 12,
  },
  upgradeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  cancelButton: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#FF4444',
    textDecorationLine: 'underline',
  },
})