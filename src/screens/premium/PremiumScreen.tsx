/**
 * 💎 PREMIUM SCREEN 💎
 * 
 * Tela com recursos PREMIUM pagos
 * APIs Prokerala, matching de casais, análises profissionais
 */

import React, { useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { useAuth } from '../../hooks/useAuth'

export default function PremiumScreen() {
  const { user } = useAuth()
  const [selectedTab, setSelectedTab] = useState<'features' | 'analysis' | 'matching' | 'reports'>('features')

  const subscriptionPlans = [
    {
      id: 'basic',
      name: '🆓 Gratuito',
      price: 0,
      features: [
        'Cálculos ephemeris locais',
        'Status das áreas da vida',
        'Notificações diárias',
        'Análise básica'
      ],
      color: '#44AA44',
      current: true
    },
    {
      id: 'premium',
      name: '💎 Premium',
      price: 19.90,
      features: [
        'Tudo do Gratuito +',
        'APIs ultra-precisas',
        'Matching de casais',
        'Análises avançadas',
        'Suporte prioritário'
      ],
      color: '#FFD700',
      current: false
    },
    {
      id: 'ultimate',
      name: '🌟 Ultimate',
      price: 39.90,
      features: [
        'Tudo do Premium +',
        'Relatórios profissionais',
        'Trânsitos avançados',
        'Análise de progressões',
        'Acesso antecipado'
      ],
      color: '#FF6B6B',
      current: false
    }
  ]

  const handleSubscribe = (planId: string) => {
    Alert.alert('🚀 Em Breve', 'Sistema de assinaturas será implementado em breve!')
  }

  const renderFeatures = () => (
    <ScrollView style={styles.tabContent}>
      <View style={styles.plansContainer}>
        <Text style={styles.sectionTitle}>📋 Planos de Assinatura</Text>
        {subscriptionPlans.map(plan => (
          <TouchableOpacity
            key={plan.id}
            style={[
              styles.planCard,
              { borderColor: plan.color },
              plan.current && styles.currentPlan
            ]}
            onPress={() => !plan.current && handleSubscribe(plan.id)}
          >
            <View style={styles.planHeader}>
              <Text style={styles.planName}>{plan.name}</Text>
              <Text style={styles.planPrice}>
                {plan.price === 0 ? 'Grátis' : `R$ ${plan.price.toFixed(2)}/mês`}
              </Text>
            </View>
            <View style={styles.planFeatures}>
              {plan.features.map((feature, index) => (
                <Text key={index} style={styles.planFeature}>✓ {feature}</Text>
              ))}
            </View>
            {plan.current && (
              <View style={styles.currentBadge}>
                <Text style={styles.currentBadgeText}>Plano Atual</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  )

  const renderComingSoon = (icon: string, title: string, description: string) => (
    <ScrollView style={styles.tabContent}>
      <View style={styles.comingSoonContainer}>
        <Text style={styles.comingSoonIcon}>{icon}</Text>
        <Text style={styles.comingSoonTitle}>{title}</Text>
        <Text style={styles.comingSoonDescription}>{description}</Text>
        <TouchableOpacity style={styles.comingSoonButton}>
          <Text style={styles.comingSoonButtonText}>Em Breve</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )

  return (
    <LinearGradient colors={['#0F0F23', '#1A1A3A']} style={styles.container}>
      {/* Header Premium */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>💎 Premium</Text>
        <Text style={styles.headerSubtitle}>Recursos avançados e análises profissionais</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'features' && styles.activeTab]}
          onPress={() => setSelectedTab('features')}
        >
          <Text style={[styles.tabText, selectedTab === 'features' && styles.activeTabText]}>
            Recursos
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'analysis' && styles.activeTab]}
          onPress={() => setSelectedTab('analysis')}
        >
          <Text style={[styles.tabText, selectedTab === 'analysis' && styles.activeTabText]}>
            Análises
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'matching' && styles.activeTab]}
          onPress={() => setSelectedTab('matching')}
        >
          <Text style={[styles.tabText, selectedTab === 'matching' && styles.activeTabText]}>
            Matching
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'reports' && styles.activeTab]}
          onPress={() => setSelectedTab('reports')}
        >
          <Text style={[styles.tabText, selectedTab === 'reports' && styles.activeTabText]}>
            Relatórios
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {selectedTab === 'features' && renderFeatures()}
      {selectedTab === 'analysis' && renderComingSoon(
        '🔬', 
        'Análises Ultra-Precisas', 
        'APIs profissionais da Prokerala para cálculos com precisão máxima'
      )}
      {selectedTab === 'matching' && renderComingSoon(
        '💕', 
        'Matching de Casais', 
        'Compatibilidade amorosa avançada com análise de sinastria completa'
      )}
      {selectedTab === 'reports' && renderComingSoon(
        '📊', 
        'Relatórios Profissionais', 
        'PDFs completos com análises astrológicas detalhadas e personalizadas'
      )}
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#AAAAAA',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#1C1C1E',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#FFD700',
  },
  tabText: {
    fontSize: 14,
    color: '#AAAAAA',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#000000',
    fontWeight: 'bold',
  },
  tabContent: {
    flex: 1,
  },
  plansContainer: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  planCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
  },
  currentPlan: {
    backgroundColor: '#2A2A2E',
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  planName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  planPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  planFeatures: {
    marginBottom: 8,
  },
  planFeature: {
    fontSize: 14,
    color: '#CCCCCC',
    marginBottom: 4,
  },
  currentBadge: {
    backgroundColor: '#44AA44',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  currentBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  comingSoonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  comingSoonIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  comingSoonTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  comingSoonDescription: {
    fontSize: 16,
    color: '#AAAAAA',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  comingSoonButton: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  comingSoonButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  },
})