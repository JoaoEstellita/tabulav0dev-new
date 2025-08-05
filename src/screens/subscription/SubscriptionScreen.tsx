import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Linking
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useSubscription } from '../../hooks/useSubscription'
import { useAuth } from '../../hooks/useAuth'
import type { SubscriptionPlan } from '../../services/mercadopago/MercadoPagoService'

export default function SubscriptionScreen() {
  const { user } = useAuth()
  const {
    subscription,
    plans,
    loading,
    error,
    isInTrial,
    trialDaysRemaining,
    createSubscription,
    cancelSubscription
  } = useSubscription()

  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null)
  const [processingPayment, setProcessingPayment] = useState(false)

  const handleSelectPlan = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan)
  }

  const handleSubscribe = async () => {
    if (!selectedPlan) {
      Alert.alert('Erro', 'Selecione um plano primeiro')
      return
    }

    try {
      setProcessingPayment(true)
      
      const result = await createSubscription(selectedPlan.id)
      
      Alert.alert(
        'Redirecionando para Pagamento',
        'Você será redirecionado para a página de pagamento do Mercado Pago.',
        [
          {
            text: 'Cancelar',
            style: 'cancel'
          },
          {
            text: 'Continuar',
            onPress: () => {
              Linking.openURL(result.paymentUrl)
            }
          }
        ]
      )
    } catch (error) {
      console.error('Erro ao criar assinatura:', error)
      Alert.alert('Erro', 'Não foi possível criar a assinatura. Tente novamente.')
    } finally {
      setProcessingPayment(false)
    }
  }

  const handleCancelSubscription = async () => {
    if (!subscription) return

    Alert.alert(
      'Cancelar Assinatura',
      'Tem certeza que deseja cancelar sua assinatura?',
      [
        {
          text: 'Não',
          style: 'cancel'
        },
        {
          text: 'Sim, Cancelar',
          style: 'destructive',
          onPress: async () => {
            try {
              await cancelSubscription()
              Alert.alert('Sucesso', 'Assinatura cancelada com sucesso.')
            } catch (error) {
              console.error('Erro ao cancelar assinatura:', error)
              Alert.alert('Erro', 'Não foi possível cancelar a assinatura.')
            }
          }
        }
      ]
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return '#4CAF50'
      case 'trial':
        return '#FF9800'
      case 'cancelled':
        return '#F44336'
      case 'expired':
        return '#9E9E9E'
      default:
        return '#757575'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Ativa'
      case 'trial':
        return 'Período de Teste'
      case 'cancelled':
        return 'Cancelada'
      case 'expired':
        return 'Expirada'
      default:
        return 'Desconhecido'
    }
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200EE" />
        <Text style={styles.loadingText}>Carregando planos...</Text>
      </View>
    )
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Planos de Assinatura</Text>
        <Text style={styles.subtitle}>
          Escolha o plano ideal para você
        </Text>
      </View>

      {/* Status da Assinatura Atual */}
      {subscription && (
        <View style={styles.currentSubscription}>
          <Text style={styles.sectionTitle}>Sua Assinatura Atual</Text>
          <View style={styles.subscriptionCard}>
            <View style={styles.subscriptionHeader}>
              <View style={styles.statusContainer}>
                <View
                  style={[
                    styles.statusDot,
                    { backgroundColor: getStatusColor(subscription.status) }
                  ]}
                />
                <Text style={styles.statusText}>
                  {getStatusText(subscription.status)}
                </Text>
              </View>
              {isInTrial && (
                <Text style={styles.trialText}>
                  {trialDaysRemaining} dias restantes
                </Text>
              )}
            </View>
            
            <Text style={styles.planName}>
              {plans.find(p => p.id === subscription.planId)?.name || 'Plano'}
            </Text>
            
            <Text style={styles.subscriptionDate}>
              Iniciada em: {new Date(subscription.startDate).toLocaleDateString('pt-BR')}
            </Text>
            
            {subscription.status === 'active' && (
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancelSubscription}
              >
                <Text style={styles.cancelButtonText}>Cancelar Assinatura</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      {/* Planos Disponíveis */}
      <View style={styles.plansSection}>
        <Text style={styles.sectionTitle}>Planos Disponíveis</Text>
        
        {plans.map((plan) => (
          <TouchableOpacity
            key={plan.id}
            style={[
              styles.planCard,
              selectedPlan?.id === plan.id && styles.selectedPlanCard
            ]}
            onPress={() => handleSelectPlan(plan)}
          >
            <View style={styles.planHeader}>
              <Text style={styles.planName}>{plan.name}</Text>
              <Text style={styles.planPrice}>
                R$ {(plan.price || 0).toFixed(2).replace('.', ',')}
                <Text style={styles.planPeriod}>/mês</Text>
              </Text>
            </View>
            
            <View style={styles.trialInfo}>
              <Ionicons name="time-outline" size={16} color="#FF9800" />
              <Text style={styles.trialText}>
                {plan.trialDays} dias de teste grátis
              </Text>
            </View>
            
            <View style={styles.featuresList}>
              {plan.features.map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>
            
            {selectedPlan?.id === plan.id && (
              <View style={styles.selectedIndicator}>
                <Ionicons name="checkmark-circle" size={20} color="#6200EE" />
                <Text style={styles.selectedText}>Selecionado</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Botão de Assinatura */}
      {selectedPlan && !subscription?.status === 'active' && (
        <View style={styles.subscriptionButtonContainer}>
          <TouchableOpacity
            style={[
              styles.subscriptionButton,
              processingPayment && styles.subscriptionButtonDisabled
            ]}
            onPress={handleSubscribe}
            disabled={processingPayment}
          >
            {processingPayment ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <Ionicons name="card-outline" size={20} color="#FFFFFF" />
                <Text style={styles.subscriptionButtonText}>
                  Assinar por R$ {(selectedPlan.price || 0).toFixed(2).replace('.', ',')}/mês
                </Text>
              </>
            )}
          </TouchableOpacity>
          
          <Text style={styles.termsText}>
            Ao assinar, você concorda com nossos{' '}
            <Text style={styles.termsLink}>Termos de Uso</Text>
            {' '}e{' '}
            <Text style={styles.termsLink}>Política de Privacidade</Text>
          </Text>
        </View>
      )}

      {/* Informações Adicionais */}
      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>Informações Importantes</Text>
        
        <View style={styles.infoItem}>
          <Ionicons name="shield-checkmark" size={16} color="#4CAF50" />
          <Text style={styles.infoText}>
            Pagamento seguro via Mercado Pago
          </Text>
        </View>
        
        <View style={styles.infoItem}>
          <Ionicons name="refresh" size={16} color="#2196F3" />
          <Text style={styles.infoText}>
            Renovação automática mensal
          </Text>
        </View>
        
        <View style={styles.infoItem}>
          <Ionicons name="close-circle" size={16} color="#FF5722" />
          <Text style={styles.infoText}>
            Cancele a qualquer momento
          </Text>
        </View>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5'
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666'
  },
  header: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8
  },
  subtitle: {
    fontSize: 16,
    color: '#666'
  },
  currentSubscription: {
    padding: 20
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16
  },
  subscriptionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  subscriptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333'
  },
  trialText: {
    fontSize: 12,
    color: '#FF9800',
    fontWeight: '600'
  },
  planName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8
  },
  subscriptionDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12
  },
  cancelButton: {
    backgroundColor: '#F44336',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignSelf: 'flex-start'
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600'
  },
  plansSection: {
    padding: 20
  },
  planCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
    borderColor: 'transparent'
  },
  selectedPlanCard: {
    borderColor: '#6200EE',
    backgroundColor: '#F3E5F5'
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  planPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6200EE'
  },
  planPeriod: {
    fontSize: 14,
    color: '#666',
    fontWeight: 'normal'
  },
  trialInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16
  },
  featuresList: {
    marginBottom: 16
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  featureText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 8
  },
  selectedIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0'
  },
  selectedText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6200EE',
    marginLeft: 8
  },
  subscriptionButtonContainer: {
    padding: 20
  },
  subscriptionButton: {
    backgroundColor: '#6200EE',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 12
  },
  subscriptionButtonDisabled: {
    backgroundColor: '#B39DDB'
  },
  subscriptionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8
  },
  termsText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 16
  },
  termsLink: {
    color: '#6200EE',
    textDecorationLine: 'underline'
  },
  infoSection: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    marginTop: 20
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8
  },
  errorContainer: {
    padding: 20,
    backgroundColor: '#FFEBEE',
    margin: 20,
    borderRadius: 8
  },
  errorText: {
    color: '#C62828',
    fontSize: 14,
    textAlign: 'center'
  }
}) 