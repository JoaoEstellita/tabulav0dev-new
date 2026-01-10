/**
 * SUBSCRIPTION SCREEN
 *
 * Screen for premium plans and Mercado Pago checkout.
 */

import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, Linking, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SubscriptionPlanCard } from '../../components/SubscriptionPlanCard';
import { MercadoPagoService } from '../../services/payment/MercadoPagoService';
import { useAuth } from '../../hooks/useAuth';

const { width, height } = Dimensions.get('window');

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  period: string;
  features: string[];
  isPopular?: boolean;
  isPremium?: boolean;
  originalPrice?: number;
  discount?: number;
}

const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'premium_monthly',
    name: 'Plano Mensal',
    price: 19.90,
    period: 'mes',
    features: [
      'IA conversacional astrologica',
      'Analises detalhadas',
      'Previsoes personalizadas',
      'Transitos em tempo real',
      'Grupos astrologicos ilimitados'
    ],
    originalPrice: 29.90,
    discount: 33,
  },
  {
    id: 'premium_yearly',
    name: 'Plano Anual',
    price: 119.90,
    period: 'ano',
    features: [
      'IA conversacional astrologica',
      'Analises detalhadas',
      'Previsoes personalizadas',
      'Transitos em tempo real',
      'Grupos astrologicos ilimitados',
      '2 meses gratis'
    ],
    isPopular: true,
    isPremium: true,
    originalPrice: 238.80,
    discount: 50,
  }
];

export default function SubscriptionScreen() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const handleSubscribe = async (planId: string) => {
    try {
      setIsLoading(true);
      setSelectedPlan(planId);

      const plan = subscriptionPlans.find(p => p.id === planId);
      if (!plan) {
        Alert.alert('Erro', 'Plano nao encontrado.');
        return;
      }

      if (!user?.uid) {
        Alert.alert('Erro', 'Usuario nao identificado.');
        return;
      }

      const paymentData = {
        userId: user.uid,
        planId: planId,
        email: user.email || '',
        name: user.displayName || 'Usuario',
        amount: plan.price,
        description: `Assinatura ${plan.name} do Tabula Estelar`,
        externalReference: MercadoPagoService.generateExternalReference(user.uid, planId),
      };

      const result = await MercadoPagoService.createPaymentPreference(paymentData);

      if (result.init_point) {
        const supported = await Linking.canOpenURL(result.init_point);
        if (supported) {
          await Linking.openURL(result.init_point);
        } else {
          Alert.alert('Erro', 'Nao foi possivel abrir o link de pagamento.');
        }
      } else {
        Alert.alert('Erro', 'Nao foi possivel processar o pagamento. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao assinar:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao processar a assinatura.');
    } finally {
      setIsLoading(false);
      setSelectedPlan(null);
    }
  };

  const manageSubscription = async () => {
    try {
      Alert.alert(
        'Gerenciar Assinatura',
        'Funcionalidade em desenvolvimento. Em breve voce podera gerenciar sua assinatura aqui.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Erro ao gerenciar assinatura:', error);
      Alert.alert('Erro', 'Nao foi possivel acessar os detalhes da assinatura.');
    }
  };

  const cancelSubscription = async () => {
    Alert.alert(
      'Cancelar Assinatura',
      'Funcionalidade em desenvolvimento. Para cancelar sua assinatura, acesse sua conta no Mercado Pago.',
      [
        { text: 'OK' },
        { text: 'Abrir Mercado Pago', onPress: () => Linking.openURL('https://www.mercadopago.com.br') }
      ]
    );
  };

  const viewSubscriptionDetails = () => {
    Alert.alert(
      'Detalhes da Assinatura',
      'Para ver detalhes completos da sua assinatura, acesse sua conta no Mercado Pago.',
      [
        { text: 'OK' },
        { text: 'Abrir Mercado Pago', onPress: () => Linking.openURL('https://www.mercadopago.com.br') }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#0a0e27', '#1a1f3a', '#2d1b69']}
        style={styles.gradient}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Planos Premium</Text>
            <Text style={styles.subtitle}>
              Desbloqueie todo o potencial astrologico do Tabula Estelar
            </Text>
          </View>

          <View style={styles.plansContainer}>
            <Text style={styles.plansTitle}>Escolha seu plano:</Text>
            {subscriptionPlans.map((plan) => (
              <SubscriptionPlanCard
                key={plan.id}
                plan={plan}
                onSubscribe={handleSubscribe}
                isLoading={isLoading && selectedPlan === plan.id}
              />
            ))}
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.infoTitle}>Informacoes importantes:</Text>
            <View style={styles.infoList}>
              <Text style={styles.infoText}>Pagamento seguro via Mercado Pago</Text>
              <Text style={styles.infoText}>Cancelamento a qualquer momento</Text>
              <Text style={styles.infoText}>Acesso imediato apos confirmacao</Text>
              <Text style={styles.infoText}>Suporte para assinantes</Text>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFD700',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#E0E0E0',
    textAlign: 'center',
  },
  plansContainer: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  plansTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  infoContainer: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  infoList: {
    gap: 6,
  },
  infoText: {
    color: '#D1D5DB',
  },
  // Styles used by SubscriptionPlanCard
  cardWidth: {
    width: width - 40,
  },
  cardHeight: {
    minHeight: height * 0.25,
  },
});
