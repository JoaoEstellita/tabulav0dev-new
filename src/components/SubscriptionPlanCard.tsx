/**
 * 💎 SUBSCRIPTION PLAN CARD 💎
 * 
 * Componente para exibir planos de assinatura
 * - Design atrativo e informativo
 * - Destaque para plano popular
 * - Cálculo de economia
 * - Botões de ação
 */

import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import MercadoPagoService, { type SubscriptionPlan } from '../services/payment/MercadoPagoService'

export interface SubscriptionPlanCardProps {
  plan: SubscriptionPlan
  isSelected?: boolean
  onSelect: (plan: SubscriptionPlan) => void
  showTrial?: boolean
  disabled?: boolean
}

export default function SubscriptionPlanCard({
  plan,
  isSelected = false,
  onSelect,
  showTrial = true,
  disabled = false
}: SubscriptionPlanCardProps) {
  
  const monthlyPrice = plan.frequency === 'yearly' ? plan.price / 12 : plan.price
  const savings = plan.frequency === 'yearly' ? MercadoPagoService.getYearlySavings() : 0
  const savingsPercentage = plan.frequency === 'yearly' ? Math.round((savings / (plan.price + savings)) * 100) : 0

  const cardGradient = plan.popular 
    ? ['#FFD700', '#FFA500', '#FF6B6B']
    : isSelected 
      ? ['#4A90E2', '#357ABD', '#2E6DA4']
      : ['#2C2C2E', '#1C1C1E', '#0F0F23']

  const borderColor = plan.popular 
    ? '#FFD700'
    : isSelected 
      ? '#4A90E2'
      : '#3C3C3E'

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { borderColor },
        disabled && styles.disabled
      ]}
      onPress={() => !disabled && onSelect(plan)}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={cardGradient}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Badge Popular */}
        {plan.popular && (
          <View style={styles.popularBadge}>
            <Ionicons name="star" size={16} color="#000" />
            <Text style={styles.popularText}>MAIS POPULAR</Text>
          </View>
        )}

        {/* Header do Plano */}
        <View style={styles.header}>
          <Text style={[styles.planName, plan.popular && styles.popularPlanName]}>
            {plan.name}
          </Text>
          <Text style={[styles.planDescription, plan.popular && styles.popularPlanDescription]}>
            {plan.description}
          </Text>
        </View>

        {/* Preço */}
        <View style={styles.priceSection}>
          <View style={styles.priceRow}>
            <Text style={[styles.currency, plan.popular && styles.popularCurrency]}>R$</Text>
            <Text style={[styles.price, plan.popular && styles.popularPrice]}>
              {plan.price.toFixed(2).replace('.', ',')}
            </Text>
            <Text style={[styles.period, plan.popular && styles.popularPeriod]}>
              /{plan.frequency === 'monthly' ? 'mês' : 'ano'}
            </Text>
          </View>

          {plan.frequency === 'yearly' && (
            <View style={styles.monthlyEquivalent}>
              <Text style={[styles.monthlyText, plan.popular && styles.popularMonthlyText]}>
                Equivale a R$ {monthlyPrice.toFixed(2).replace('.', ',')}/mês
              </Text>
              {savings > 0 && (
                <View style={styles.savingsContainer}>
                  <Text style={[styles.savingsText, plan.popular && styles.popularSavingsText]}>
                    💰 Economize R$ {savings.toFixed(2).replace('.', ',')} ({savingsPercentage}%)
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>

        {/* Trial */}
        {showTrial && plan.trialDays && (
          <View style={styles.trialSection}>
            <Ionicons 
              name="gift" 
              size={20} 
              color={plan.popular ? "#000" : "#FFD700"} 
            />
            <Text style={[styles.trialText, plan.popular && styles.popularTrialText]}>
              {plan.trialDays} dias grátis para testar
            </Text>
          </View>
        )}

        {/* Features */}
        <View style={styles.featuresSection}>
          <Text style={[styles.featuresTitle, plan.popular && styles.popularFeaturesTitle]}>
            ✨ Recursos inclusos:
          </Text>
          {plan.features.slice(0, 4).map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <Ionicons 
                name="checkmark-circle" 
                size={16} 
                color={plan.popular ? "#000" : "#4CAF50"} 
              />
              <Text style={[styles.featureText, plan.popular && styles.popularFeatureText]}>
                {feature}
              </Text>
            </View>
          ))}
          
          {plan.features.length > 4 && (
            <Text style={[styles.moreFeatures, plan.popular && styles.popularMoreFeatures]}>
              + {plan.features.length - 4} recursos adicionais
            </Text>
          )}
        </View>

        {/* Selection Indicator */}
        {isSelected && (
          <View style={styles.selectedIndicator}>
            <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
            <Text style={styles.selectedText}>Selecionado</Text>
          </View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    borderWidth: 2,
    marginBottom: 16,
    overflow: 'hidden',
  },
  disabled: {
    opacity: 0.6,
  },
  gradient: {
    padding: 20,
    paddingTop: 24,
  },
  popularBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  popularText: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: 'bold',
  },
  header: {
    marginBottom: 16,
  },
  planName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  popularPlanName: {
    color: '#000',
  },
  planDescription: {
    fontSize: 16,
    color: '#CCCCCC',
    lineHeight: 22,
  },
  popularPlanDescription: {
    color: '#333',
  },
  priceSection: {
    marginBottom: 16,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  currency: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginRight: 4,
  },
  popularCurrency: {
    color: '#000',
  },
  price: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  popularPrice: {
    color: '#000',
  },
  period: {
    fontSize: 18,
    color: '#CCCCCC',
    marginLeft: 4,
  },
  popularPeriod: {
    color: '#333',
  },
  monthlyEquivalent: {
    alignItems: 'flex-start',
  },
  monthlyText: {
    fontSize: 14,
    color: '#CCCCCC',
    marginBottom: 4,
  },
  popularMonthlyText: {
    color: '#333',
  },
  savingsContainer: {
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  savingsText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
  },
  popularSavingsText: {
    color: '#2E7D32',
  },
  trialSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 16,
    gap: 8,
  },
  trialText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFD700',
  },
  popularTrialText: {
    color: '#000',
  },
  featuresSection: {
    marginBottom: 16,
  },
  featuresTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  popularFeaturesTitle: {
    color: '#000',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  featureText: {
    fontSize: 14,
    color: '#FFFFFF',
    flex: 1,
    lineHeight: 20,
  },
  popularFeatureText: {
    color: '#000',
  },
  moreFeatures: {
    fontSize: 14,
    color: '#CCCCCC',
    fontStyle: 'italic',
    marginTop: 4,
  },
  popularMoreFeatures: {
    color: '#333',
  },
  selectedIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  selectedText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50',
  },
})