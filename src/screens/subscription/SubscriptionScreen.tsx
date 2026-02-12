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
import { StripeService } from '../../services/payment/StripeService';
import { useAuth } from '../../hooks/useAuth';
import { useAppLanguage } from '../../hooks/useAppLanguage';

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

const subscriptionPlans: SubscriptionPlan[] = MercadoPagoService.PLANS.map((plan) => ({
  id: plan.id,
  name: plan.name,
  price: plan.price,
  period: plan.frequency === 'yearly' ? 'ano' : 'mes',
  features: plan.features,
  isPopular: plan.id === 'pro_monthly',
  isPremium: plan.id === 'premium_monthly',
}));

export default function SubscriptionScreen() {
  const { t } = useAppLanguage();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [provider, setProvider] = useState<'mercadopago' | 'stripe'>('mercadopago');

  const getCurrentSubscriptionProvider = async (): Promise<'mercadopago' | 'stripe'> => {
    if (!user?.uid) return provider;
    try {
      const status = await MercadoPagoService.getSubscriptionStatus(user.uid);
      if (status?.provider === 'stripe') return 'stripe';
      if (status?.provider === 'mercadopago') return 'mercadopago';
    } catch (error) {
      console.warn('Falha ao consultar provider atual da assinatura:', error);
    }
    return provider;
  };

  const handleSubscribe = async (planId: string) => {
    try {
      setIsLoading(true);
      setSelectedPlan(planId);

      const plan = subscriptionPlans.find(p => p.id === planId);
      if (!plan) {
        Alert.alert(t('common.error'), t('subscription.error.planNotFound'));
        return;
      }

      if (!user?.uid) {
        Alert.alert(t('common.error'), t('subscription.error.userNotFound'));
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

      if (provider === 'stripe') {
        const result = await StripeService.createCheckoutSession({
          userId: user.uid,
          planId,
          email: user.email || '',
          name: user.displayName || 'Usuario',
          amount: plan.price,
          currency: 'usd',
        });
        if (result.url) {
          const supported = await Linking.canOpenURL(result.url);
          if (supported) {
            await Linking.openURL(result.url);
          } else {
            Alert.alert(t('common.error'), t('subscription.error.openPaymentLink'));
          }
        } else {
          Alert.alert(t('common.error'), t('subscription.error.processPayment'));
        }
        return;
      }

      const result = await MercadoPagoService.createPaymentPreference(paymentData);

      if (result.init_point) {
        const supported = await Linking.canOpenURL(result.init_point);
        if (supported) {
          await Linking.openURL(result.init_point);
        } else {
          Alert.alert(t('common.error'), t('subscription.error.openPaymentLink'));
        }
      } else {
        Alert.alert(t('common.error'), t('subscription.error.processPayment'));
      }
    } catch (error) {
      console.error('Erro ao assinar:', error);
      Alert.alert(t('common.error'), t('subscription.error.generic'));
    } finally {
      setIsLoading(false);
      setSelectedPlan(null);
    }
  };

  const manageSubscription = async () => {
    try {
      const currentProvider = await getCurrentSubscriptionProvider();
      if (!user?.uid) {
        Alert.alert(t('common.error'), t('subscription.error.userNotFound'));
        return;
      }
      if (currentProvider === 'stripe') {
        const portal = await StripeService.createPortalSession(user.uid);
        if (portal.url) {
          await Linking.openURL(portal.url);
          return;
        }
      }
      Alert.alert(
        t('subscription.manage.title'),
        t('subscription.manage.body'),
        [{ text: t('common.close') }]
      );
    } catch (error) {
      console.error('Erro ao gerenciar assinatura:', error);
      Alert.alert(t('common.error'), t('subscription.error.manageDetails'));
    }
  };

  const cancelSubscription = async () => {
    const currentProvider = await getCurrentSubscriptionProvider();
    if (currentProvider === 'stripe' && user?.uid) {
      try {
        const portal = await StripeService.createPortalSession(user.uid);
        if (portal.url) {
          await Linking.openURL(portal.url);
          return;
        }
      } catch (error) {
        console.error('Erro ao abrir portal Stripe (cancelamento):', error);
      }
    }
    Alert.alert(
      t('subscription.cancel.title'),
      t('subscription.cancel.body'),
      [
        { text: t('common.close') },
        { text: t('subscription.openMercadoPago'), onPress: () => Linking.openURL('https://www.mercadopago.com.br') }
      ]
    );
  };

  const viewSubscriptionDetails = async () => {
    try {
      const currentProvider = await getCurrentSubscriptionProvider();
      if (currentProvider === 'stripe' && user?.uid) {
        const portal = await StripeService.createPortalSession(user.uid);
        if (portal.url) {
          await Linking.openURL(portal.url);
          return;
        }
      }
      Alert.alert(
        t('subscription.details.title'),
        t('subscription.details.body'),
        [
          { text: t('common.close') },
          { text: t('subscription.openMercadoPago'), onPress: () => Linking.openURL('https://www.mercadopago.com.br') }
        ]
      );
    } catch (error) {
      console.error('Erro ao abrir detalhes da assinatura:', error);
      Alert.alert(t('common.error'), t('subscription.error.manageDetails'));
    }
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
            <Text style={styles.title}>{t('subscription.title')}</Text>
            <Text style={styles.subtitle}>
              {t('subscription.subtitle')}
            </Text>
            <View style={styles.providerRow}>
              <Text style={styles.providerLabel}>{t('subscription.provider.label')}</Text>
              <View style={styles.providerButtons}>
                <Text
                  onPress={() => setProvider('mercadopago')}
                  style={[styles.providerButton, provider === 'mercadopago' && styles.providerButtonActive]}
                >
                  {t('subscription.provider.mercado')}
                </Text>
                <Text
                  onPress={() => setProvider('stripe')}
                  style={[styles.providerButton, provider === 'stripe' && styles.providerButtonActive]}
                >
                  {t('subscription.provider.stripe')}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.plansContainer}>
            <Text style={styles.plansTitle}>{t('subscription.choosePlan')}</Text>
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
            <Text style={styles.infoTitle}>{t('subscription.infoTitle')}</Text>
            <View style={styles.infoList}>
              <Text style={styles.infoText}>{t('subscription.info.secure')}</Text>
              <Text style={styles.infoText}>{t('subscription.info.cancelAnytime')}</Text>
              <Text style={styles.infoText}>{t('subscription.info.instantAccess')}</Text>
              <Text style={styles.infoText}>{t('subscription.info.support')}</Text>
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
  providerRow: {
    marginTop: 12,
    alignItems: 'center',
  },
  providerLabel: {
    color: '#E0E0E0',
    fontSize: 13,
    marginBottom: 6,
  },
  providerButtons: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  providerButton: {
    color: '#D1D5DB',
    borderWidth: 1,
    borderColor: '#6B7280',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 12,
    overflow: 'hidden',
  },
  providerButtonActive: {
    color: '#FFD700',
    borderColor: '#FFD700',
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
