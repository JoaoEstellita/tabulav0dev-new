import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { useAppLanguage } from '../../hooks/useAppLanguage'

export default function HomeScreenMinimal() {
  useAppLanguage()
  console.log('🟢 HomeScreenMinimal renderizando...')
  
  return (
    <LinearGradient colors={['#0F0F23', '#1A1A3A']} style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>🎯 HOME MÍNIMO</Text>
        <Text style={styles.subtitle}>Se você vê isto, o erro não é no Home!</Text>
        <Text style={styles.info}>✅ HomeScreen renderizou com sucesso</Text>
        <Text style={styles.info}>🔍 Erro deve estar em outro lugar</Text>
      </View>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    color: '#FFD700',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 12,
    textAlign: 'center',
  },
  info: {
    color: '#A0A0A0',
    fontSize: 14,
    marginBottom: 8,
    textAlign: 'center',
  },
})
