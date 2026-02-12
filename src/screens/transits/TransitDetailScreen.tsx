import React from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { useAppLanguage } from '../../hooks/useAppLanguage'

interface RouteParams {
  title: string
  description?: string
  type?: 'personal' | 'collective'
  window?: { start?: string; exact?: string; end?: string; days?: number }
}

export default function TransitDetailScreen({ route }: any) {
  useAppLanguage()
  const params: RouteParams = route?.params || {}
  const fmt = (iso?: string) => {
    try { if (!iso) return undefined; const d = new Date(iso); return d.toLocaleDateString('pt-BR', { day:'2-digit', month:'2-digit' }) } catch { return undefined }
  }
  const ws = fmt(params.window?.start)
  const we = fmt(params.window?.end)
  const ex = fmt(params.window?.exact)

  return (
    <LinearGradient colors={['#0F0F23', '#1A1A3A']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{params.title || 'Trânsito'}</Text>
        {!!params.description && <Text style={styles.desc}>{params.description}</Text>}
        {(ws || ex || we) && (
          <View style={styles.windowBox}>
            <Text style={styles.windowTitle}>Janela de Vigência</Text>
            {ws && <Text style={styles.windowText}>Início: {ws}</Text>}
            {ex && <Text style={styles.windowText}>Pico: {ex}</Text>}
            {we && <Text style={styles.windowText}>Fim: {we}</Text>}
            {!!params.window?.days && <Text style={styles.windowHint}>Duração ~{params.window.days} dias</Text>}
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16 },
  title: { color: '#FFD700', fontSize: 20, fontWeight: '700', marginBottom: 8 },
  desc: { color: '#FFFFFF', fontSize: 14, lineHeight: 20 },
  windowBox: { marginTop: 16, backgroundColor:'#1E1E2E', borderRadius: 12, padding: 12 },
  windowTitle: { color:'#A0E7A0', fontSize: 14, marginBottom: 6, fontWeight: '600' },
  windowText: { color:'#FFFFFF', fontSize: 13, marginBottom: 2 },
  windowHint: { color:'#9CA3AF', fontSize: 12, marginTop: 6 },
})


