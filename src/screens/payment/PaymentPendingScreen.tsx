import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { useNavigation } from '@react-navigation/native'
import { useAppLanguage } from '../../hooks/useAppLanguage'

export default function PaymentPendingScreen() {
  const { t } = useAppLanguage()
  const navigation = useNavigation()

  return (
    <LinearGradient colors={['#0F0F23', '#1A1A3A']} style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>{t('payment.pending.title')}</Text>
        <Text style={styles.message}>{t('payment.pending.body')}</Text>
        <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('Premium' as never)}>
          <Text style={styles.primaryButtonText}>{t('payment.pending.cta')}</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    gap: 12,
  },
  title: {
    color: '#FFD700',
    fontSize: 20,
    fontWeight: '700',
  },
  message: {
    color: '#E0E0E0',
    fontSize: 14,
    textAlign: 'center',
  },
  primaryButton: {
    marginTop: 8,
    backgroundColor: '#FFD700',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
  },
  primaryButtonText: {
    color: '#0F0F23',
    fontWeight: '700',
  },
})
