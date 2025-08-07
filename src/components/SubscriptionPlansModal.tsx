import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MercadoPagoService, SubscriptionPlan } from '../services/payment/MercadoPagoService';
import { useAuth } from '../hooks/useAuth';

const { width } = Dimensions.get('window');

interface SubscriptionPlansModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function SubscriptionPlansModal({ visible, onClose }: SubscriptionPlansModalProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (plan: SubscriptionPlan) => {
    if (!user?.uid) {
      Alert.alert('Erro', 'Usuário não identificado.');
      return;
    }

    try {
      setLoading(true);

      const paymentData = {
        userId: user.uid,
        planId: plan.id,
        email: user.email || '',
        name: user.displayName || 'Usuário',
        amount: plan.price,
        description: `${plan.name} - Tábula Estelar`,
        externalReference: MercadoPagoService.generateExternalReference(user.uid, plan.id),
      };

      const preference = await MercadoPagoService.createPaymentPreference(paymentData);
      
      // Abrir URL de pagamento
      if (preference.checkout_url) {
        // TODO: Implementar deep linking para voltar ao app após pagamento
        Alert.alert(
          '💳 Pagamento',
          'Você será redirecionado para o Mercado Pago para finalizar sua assinatura.',
          [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Continuar', onPress: () => {
              // TODO: Abrir URL de pagamento
              Alert.alert('Em desenvolvimento', 'Integração com Mercado Pago será implementada em breve.');
            }}
          ]
        );
      }
    } catch (error) {
      console.error('Erro ao criar pagamento:', error);
      Alert.alert('Erro', 'Não foi possível processar o pagamento. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const renderPlanCard = (plan: SubscriptionPlan) => (
    <View key={plan.id} style={[styles.planCard, plan.popular && styles.popularPlan]}>
      {plan.popular && (
        <View style={styles.popularBadge}>
          <Text style={styles.popularText}>MAIS POPULAR</Text>
        </View>
      )}
      
      <View style={styles.planHeader}>
        <Text style={styles.planName}>{plan.name}</Text>
        <View style={styles.priceContainer}>
          <Text style={styles.planPrice}>
            {MercadoPagoService.formatPrice(plan.price)}
          </Text>
          <Text style={styles.planPeriod}>
            /{plan.frequency === 'monthly' ? 'mês' : 'ano'}
          </Text>
        </View>
        {plan.trialDays && (
          <Text style={styles.trialText}>
            {plan.trialDays} dias grátis
          </Text>
        )}
      </View>

      <View style={styles.featuresContainer}>
        {plan.features.map((feature, index) => (
          <View key={index} style={styles.featureItem}>
            <Ionicons name="checkmark-circle" size={16} color="#10B981" />
            <Text style={styles.featureText}>{feature}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.subscribeButton, loading && styles.disabledButton]}
        onPress={() => handleSubscribe(plan)}
        disabled={loading}
      >
        <Text style={styles.subscribeButtonText}>
          {loading ? 'Processando...' : 'Assinar Agora'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>💎 Planos Premium</Text>
          <Text style={styles.subtitle}>
            Escolha o plano ideal para sua jornada astrológica
          </Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.savingsContainer}>
            <Text style={styles.savingsText}>
              💰 Economia de {MercadoPagoService.formatPrice(MercadoPagoService.getYearlySavings())} no plano anual!
            </Text>
          </View>

          {MercadoPagoService.PLANS.map(renderPlanCard)}

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              🔒 Pagamento seguro via Mercado Pago
            </Text>
            <Text style={styles.footerSubtext}>
              Cancele a qualquer momento • Suporte 24/7
            </Text>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
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
  savingsContainer: {
    backgroundColor: '#10B981',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center',
  },
  savingsText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
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
  popularPlan: {
    borderColor: '#FFD700',
    backgroundColor: '#1a1f3a',
  },
  popularBadge: {
    position: 'absolute',
    top: -12,
    left: 20,
    backgroundColor: '#FFD700',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularText: {
    color: '#000',
    fontSize: 12,
    fontWeight: 'bold',
  },
  planHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  planName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  planPrice: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  planPeriod: {
    fontSize: 16,
    color: '#b0b0b0',
    marginLeft: 4,
  },
  trialText: {
    fontSize: 14,
    color: '#10B981',
    marginTop: 4,
    fontWeight: '600',
  },
  featuresContainer: {
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    color: '#e0e0e0',
    marginLeft: 8,
    flex: 1,
  },
  subscribeButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  subscribeButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.6,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#b0b0b0',
    textAlign: 'center',
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
  },
});
