import React, { useMemo, useState } from 'react'
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuth } from '../../hooks/useAuth'
import { backendFetch } from '../../services/backend/client'

type AnyObj = Record<string, any>

const JsonBlock = ({ title, value }: { title: string; value: unknown }) => {
  const content = useMemo(() => {
    try {
      return JSON.stringify(value ?? {}, null, 2)
    } catch {
      return String(value ?? '')
    }
  }, [value])
  return (
    <View style={styles.block}>
      <Text style={styles.blockTitle}>{title}</Text>
      <Text style={styles.blockBody}>{content}</Text>
    </View>
  )
}

export default function AdminDiagnosticsScreen() {
  const { user } = useAuth()
  const [targetUid, setTargetUid] = useState(user?.uid || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [adminOverview, setAdminOverview] = useState<AnyObj | null>(null)
  const [userDiag, setUserDiag] = useState<AnyObj | null>(null)

  const runLoad = async () => {
    setLoading(true)
    setError(null)
    try {
      const [adminResp, userResp] = await Promise.all([
        backendFetch('/api/diag/admin', { auth: true, method: 'GET' }),
        backendFetch(`/api/diag/user/${encodeURIComponent(targetUid || user?.uid || '')}`, { auth: true, method: 'GET' }),
      ])
      const adminJson = await adminResp.json().catch(() => ({}))
      const userJson = await userResp.json().catch(() => ({}))
      if (!adminResp.ok) throw new Error(adminJson?.error || `diag_admin_${adminResp.status}`)
      if (!userResp.ok) throw new Error(userJson?.error || `diag_user_${userResp.status}`)
      setAdminOverview(adminJson)
      setUserDiag(userJson)
    } catch (e: any) {
      setError(e?.message || 'Falha ao carregar diagnóstico admin')
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Diagnóstico Admin</Text>
        <Text style={styles.subtitle}>Painel técnico de status e notificações</Text>

        <View style={styles.inputWrap}>
          <Text style={styles.label}>UID para inspeção</Text>
          <TextInput
            style={styles.input}
            value={targetUid}
            onChangeText={setTargetUid}
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="UID do usuário"
            placeholderTextColor="#7B809A"
          />
          <TouchableOpacity style={styles.button} onPress={runLoad} disabled={loading}>
            {loading ? <ActivityIndicator color="#0F0F23" /> : <Text style={styles.buttonText}>Atualizar diagnóstico</Text>}
          </TouchableOpacity>
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}
        {adminOverview ? <JsonBlock title="Visão geral (admin)" value={adminOverview} /> : null}
        {userDiag ? <JsonBlock title="Diagnóstico do usuário" value={userDiag} /> : null}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0F23' },
  content: { padding: 16, paddingBottom: 40 },
  title: { color: '#FFFFFF', fontSize: 22, fontWeight: '800' },
  subtitle: { color: '#A9AEC4', marginTop: 4, marginBottom: 14 },
  inputWrap: {
    backgroundColor: '#171C33',
    borderWidth: 1,
    borderColor: '#2B3050',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  label: { color: '#D7DCF5', fontWeight: '700', marginBottom: 8 },
  input: {
    backgroundColor: '#101528',
    borderWidth: 1,
    borderColor: '#2B3050',
    borderRadius: 10,
    color: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#FFD700',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  buttonText: { color: '#0F0F23', fontWeight: '800' },
  error: {
    color: '#FF8D8D',
    marginBottom: 10,
    backgroundColor: '#2A1020',
    borderWidth: 1,
    borderColor: '#7F243B',
    borderRadius: 10,
    padding: 10,
  },
  block: {
    backgroundColor: '#171C33',
    borderWidth: 1,
    borderColor: '#2B3050',
    borderRadius: 12,
    padding: 12,
    marginTop: 10,
  },
  blockTitle: { color: '#FFFFFF', fontWeight: '800', marginBottom: 8 },
  blockBody: { color: '#C9CEE6', fontFamily: 'monospace', fontSize: 12, lineHeight: 17 },
})

