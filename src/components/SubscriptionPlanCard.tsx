/**
 * 💎 SUBSCRIPTION PLAN CARD 💎
 * 
 * Componente para exibir planos de assinatura
 * - Design atrativo e informativo
 * - Destaque para plano popular
 * - Cálculo de economia
 * - Botões de ação
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MercadoPagoService } from '../services/payment/MercadoPagoService';

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

interface SubscriptionPlanCardProps {
  plan: SubscriptionPlan;
  onSubscribe: (planId: string) => void;
  isLoading?: boolean;
}

const { width } = Dimensions.get('window');

export const SubscriptionPlanCard: React.FC<SubscriptionPlanCardProps> = ({
  plan,
  onSubscribe,
  isLoading = false,
}) => {
  const handleSubscribe = async () => {
    try {
      if (isLoading) return;
      
      const result = await MercadoPagoService.createPreference({
        title: `Tábula Estelar - ${plan.name}`,
        price: plan.price,
        quantity: 1,
        currency_id: 'BRL',
        description: `Assinatura ${plan.name} do Tábula Estelar`,
        external_reference: `subscription_${plan.id}`,
      });

      if (result.success && result.init_point) {
        onSubscribe(plan.id);
      } else {
        Alert.alert('Erro', 'Não foi possível processar o pagamento. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao criar preferência:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao processar o pagamento.');
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  return (
    <View style={[styles.container, plan.isPopular && styles.popularContainer]}>
      {plan.isPopular && (
        <View style={styles.popularBadge}>
          <Text style={styles.popularText}>🌟 MAIS POPULAR</Text>
        </View>
      )}
      
      <LinearGradient
        colors={plan.isPremium 
          ? ['#FFD700', '#FFED4E', '#FFD700'] 
          : ['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']
        }
        style={[styles.gradient, plan.isPremium && styles.premiumGradient]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.header}>
          <Text style={[styles.planName, plan.isPremium && styles.premiumText]}>
            {plan.name}
          </Text>
          
          <View style={styles.priceContainer}>
            {plan.originalPrice && plan.discount && (
              <Text style={styles.originalPrice}>
                {formatPrice(plan.originalPrice)}
              </Text>
            )}
            <Text style={[styles.price, plan.isPremium && styles.premiumPrice]}>
              {formatPrice(plan.price)}
            </Text>
            <Text style={[styles.period, plan.isPremium && styles.premiumText]}>
              /{plan.period}
            </Text>
          </View>
          
          {plan.discount && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>-{plan.discount}%</Text>
            </View>
          )}
        </View>

        <View style={styles.featuresContainer}>
          {plan.features.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <Text style={styles.checkIcon}>✓</Text>
              <Text style={[styles.featureText, plan.isPremium && styles.premiumFeatureText]}>
                {feature}
              </Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={[
            styles.subscribeButton,
            plan.isPremium && styles.premiumButton,
            isLoading && styles.disabledButton
          ]}
          onPress={handleSubscribe}
          disabled={isLoading}
        >
          <LinearGradient
            colors={plan.isPremium 
              ? ['#0a0e27', '#1a1f3a'] 
              : ['#FFD700', '#FFED4E']
            }
            style={styles.buttonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={[
              styles.buttonText,
              plan.isPremium && styles.premiumButtonText
            ]}>
              {isLoading ? 'Processando...' : 'Assinar Agora'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width * 0.85,
    marginVertical: 10,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  popularContainer: {
    transform: [{ scale: 1.05 }],
    elevation: 8,
    shadowOpacity: 0.4,
  },
  popularBadge: {
    position: 'absolute',
    top: -10,
    right: 20,
    backgroundColor: '#FFD700',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 15,
    zIndex: 1,
  },
  popularText: {
    color: '#0a0e27',
    fontSize: 12,
    fontWeight: 'bold',
  },
  gradient: {
    padding: 25,
    borderRadius: 20,
  },
  premiumGradient: {
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  header: {
    alignItems: 'center',
    marginBottom: 25,
  },
  planName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 10,
    textAlign: 'center',
  },
  premiumText: {
    color: '#0a0e27',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
  },
  originalPrice: {
    fontSize: 16,
    color: '#b0b0b0',
    textDecorationLine: 'line-through',
    marginRight: 8,
  },
  price: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  premiumPrice: {
    color: '#0a0e27',
  },
  period: {
    fontSize: 16,
    color: '#b0b0b0',
    marginLeft: 5,
  },
  discountBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
  },
  discountText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  featuresContainer: {
    marginBottom: 25,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkIcon: {
    color: '#4CAF50',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 12,
  },
  featureText: {
    fontSize: 16,
    color: '#e0e0e0',
    flex: 1,
  },
  premiumFeatureText: {
    color: '#0a0e27',
  },
  subscribeButton: {
    borderRadius: 50,
    overflow: 'hidden',
  },
  premiumButton: {
    borderWidth: 2,
    borderColor: '#0a0e27',
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonGradient: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0a0e27',
  },
  premiumButtonText: {
    color: '#FFD700',
  },
});