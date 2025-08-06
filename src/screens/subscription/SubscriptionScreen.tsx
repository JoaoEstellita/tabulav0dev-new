/**
 * 💎 SUBSCRIPTION SCREEN 💎
 * 
 * Tela completa de assinaturas com:
 * - Planos visuais e atrativos
 * - Trial gratuito
 * - Fluxo de pagamento integrado
 * - Gestão de assinaturas ativas
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  Linking,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SubscriptionPlanCard } from '../../components/SubscriptionPlanCard';
import { MercadoPagoService } from '../../services/payment/MercadoPagoService';

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
    id: 'monthly',
    name: 'Plano Mensal',
    price: 19.90,
    period: 'mês',
    features: [
      '🤖 IA Conversacional Astrológica',
      '📊 Análises Detalhadas Avançadas',
      '🔮 Previsões Personalizadas',
      '💫 Trânsitos em Tempo Real',
      '👥 Grupos Astrológicos Ilimitados',
      '📱 Notificações Personalizadas',
      '🔄 Sincronização em Nuvem',
      '🎯 Relatórios Mensais'
    ],
    originalPrice: 29.90,
    discount: 33,
  },
  {
    id: 'yearly',
    name: 'Plano Anual',
    price: 119.90,
    period: 'ano',
    features: [
      '🤖 IA Conversacional Astrológica',
      '📊 Análises Detalhadas Avançadas',
      '🔮 Previsões Personalizadas',
      '💫 Trânsitos em Tempo Real',
      '👥 Grupos Astrológicos Ilimitados',
      '📱 Notificações Personalizadas',
      '🔄 Sincronização em Nuvem',
      '🎯 Relatórios Mensais',
      '🌟 2 meses grátis',
      '💰 Economia de R$ 118,90'
    ],
    isPopular: true,
    isPremium: true,
    originalPrice: 238.80,
    discount: 50,
  },
  {
    id: 'lifetime',
    name: 'Acesso Vitalício',
    price: 299.90,
    period: 'único',
    features: [
      '🤖 IA Conversacional Astrológica',
      '📊 Análises Detalhadas Avançadas',
      '🔮 Previsões Personalizadas',
      '💫 Trânsitos em Tempo Real',
      '👥 Grupos Astrológicos Ilimitados',
      '📱 Notificações Personalizadas',
      '🔄 Sincronização em Nuvem',
      '🎯 Relatórios Mensais',
      '🌟 Acesso para sempre',
      '🆕 Atualizações futuras inclusas',
      '💎 Suporte prioritário'
    ],
    isPremium: true,
    originalPrice: 599.90,
    discount: 50,
  }
];

export default function SubscriptionScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    checkCurrentSubscription();
  }, []);

  const checkCurrentSubscription = async () => {
    try {
      // Verificar se usuário tem assinatura ativa
      // Por enquanto, vamos simular que não tem
      // TODO: Implementar verificação real quando backend estiver pronto
    } catch (error) {
      console.error('Erro ao verificar assinatura:', error);
    }
  };

  const handleSubscribe = async (planId: string) => {
    try {
      setIsLoading(true);
      setSelectedPlan(planId);

      const plan = subscriptionPlans.find(p => p.id === planId);
      if (!plan) {
        Alert.alert('Erro', 'Plano não encontrado.');
        return;
      }

      const paymentData = {
        userId: 'current_user', // TODO: Pegar do contexto de auth
        planId: planId,
        email: 'user@example.com', // TODO: Pegar do contexto de auth
        name: 'Usuário', // TODO: Pegar do contexto de auth
        amount: plan.price,
        description: `Assinatura ${plan.name} do Tábula Estelar`,
        externalReference: `subscription_${planId}`,
      };

      const result = await MercadoPagoService.createPaymentPreference(paymentData);

      if (result.init_point) {
        // Abrir link de pagamento
        const supported = await Linking.canOpenURL(result.init_point);
        if (supported) {
          await Linking.openURL(result.init_point);
        } else {
          Alert.alert('Erro', 'Não foi possível abrir o link de pagamento.');
        }
      } else {
        Alert.alert('Erro', 'Não foi possível processar o pagamento. Tente novamente.');
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
      // TODO: Implementar quando backend estiver pronto
      Alert.alert(
        'Gerenciar Assinatura',
        'Funcionalidade em desenvolvimento. Em breve você poderá gerenciar sua assinatura aqui.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Erro ao gerenciar assinatura:', error);
      Alert.alert('Erro', 'Não foi possível acessar os detalhes da assinatura.');
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

  const onRefresh = async () => {
    setRefreshing(true);
    await checkCurrentSubscription();
    setRefreshing(false);
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
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>🌟 Planos Premium</Text>
            <Text style={styles.subtitle}>
              Desbloqueie todo o potencial astrológico do Tábula Estelar
            </Text>
          </View>

          {/* Benefícios Premium */}
          <View style={styles.benefitsContainer}>
            <Text style={styles.benefitsTitle}>✨ O que você ganha:</Text>
            <View style={styles.benefitsList}>
              <View style={styles.benefitItem}>
                <Text style={styles.benefitIcon}>🤖</Text>
                <Text style={styles.benefitText}>IA Conversacional Astrológica</Text>
              </View>
              <View style={styles.benefitItem}>
                <Text style={styles.benefitIcon}>📊</Text>
                <Text style={styles.benefitText}>Análises Detalhadas Avançadas</Text>
              </View>
              <View style={styles.benefitItem}>
                <Text style={styles.benefitIcon}>🔮</Text>
                <Text style={styles.benefitText}>Previsões Personalizadas</Text>
              </View>
              <View style={styles.benefitItem}>
                <Text style={styles.benefitIcon}>💫</Text>
                <Text style={styles.benefitText}>Trânsitos em Tempo Real</Text>
              </View>
              <View style={styles.benefitItem}>
                <Text style={styles.benefitIcon}>👥</Text>
                <Text style={styles.benefitText}>Grupos Astrológicos Ilimitados</Text>
              </View>
            </View>
          </View>

          {/* Planos de Assinatura */}
          <View style={styles.plansContainer}>
            <Text style={styles.plansTitle}>📋 Escolha seu plano:</Text>
            
            {subscriptionPlans.map((plan) => (
              <SubscriptionPlanCard
                key={plan.id}
                plan={plan}
                onSubscribe={handleSubscribe}
                isLoading={isLoading && selectedPlan === plan.id}
              />
            ))}
          </View>

          {/* Informações Adicionais */}
          <View style={styles.infoContainer}>
            <Text style={styles.infoTitle}>ℹ️ Informações Importantes:</Text>
            <View style={styles.infoList}>
              <Text style={styles.infoText}>• Pagamento seguro via Mercado Pago</Text>
              <Text style={styles.infoText}>• Cancelamento a qualquer momento</Text>
              <Text style={styles.infoText}>• Acesso imediato após confirmação</Text>
              <Text style={styles.infoText}>• Suporte 24/7 para assinantes</Text>
              <Text style={styles.infoText}>• Atualizações automáticas inclusas</Text>
            </View>
          </View>

          {/* FAQ */}
          <View style={styles.faqContainer}>
            <Text style={styles.faqTitle}>❓ Perguntas Frequentes:</Text>
            
            <View style={styles.faqItem}>
              <Text style={styles.faqQuestion}>Como funciona o período de teste?</Text>
              <Text style={styles.faqAnswer}>
                O plano anual inclui 2 meses grátis, totalizando 14 meses de acesso pelo preço de 12.
              </Text>
            </View>
            
            <View style={styles.faqItem}>
              <Text style={styles.faqQuestion}>Posso cancelar a qualquer momento?</Text>
              <Text style={styles.faqAnswer}>
                Sim! Você pode cancelar sua assinatura a qualquer momento através das configurações do app.
              </Text>
            </View>
            
            <View style={styles.faqItem}>
              <Text style={styles.faqQuestion}>O que acontece se eu cancelar?</Text>
              <Text style={styles.faqAnswer}>
                Você manterá acesso até o final do período pago, depois voltará ao plano gratuito.
              </Text>
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
    color: '#e0e0e0',
    textAlign: 'center',
    lineHeight: 24,
  },
  benefitsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginHorizontal: 20,
    marginBottom: 30,
    padding: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.2)',
  },
  benefitsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 15,
    textAlign: 'center',
  },
  benefitsList: {
    gap: 12,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  benefitIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  benefitText: {
    fontSize: 16,
    color: '#e0e0e0',
    flex: 1,
  },
  plansContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  plansTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 20,
    textAlign: 'center',
  },
  infoContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginHorizontal: 20,
    marginBottom: 30,
    padding: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.2)',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 15,
    textAlign: 'center',
  },
  infoList: {
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#e0e0e0',
    lineHeight: 20,
  },
  faqContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.2)',
  },
  faqTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 20,
    textAlign: 'center',
  },
  faqItem: {
    marginBottom: 20,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 8,
  },
  faqAnswer: {
    fontSize: 14,
    color: '#e0e0e0',
    lineHeight: 20,
  },
});