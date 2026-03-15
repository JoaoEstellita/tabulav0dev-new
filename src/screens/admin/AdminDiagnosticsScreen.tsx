import React, { useMemo, useState } from 'react'
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuth } from '../../hooks/useAuth'
import { useAppLanguage } from '../../hooks/useAppLanguage'
import { backendFetch } from '../../services/backend/client'

type AnyObj = Record<string, any>
type AdminUserItem = {
  uid: string
  displayName: string
  email: string | null
  isAdmin: boolean
  subscriptionActive: boolean
  plan: string | null
  lastStatusAt: string | null
  statusScore: number | null
  statusLevel: string | null
  criticalAreas: number
  positiveAreas: number
}

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
  const { t } = useAppLanguage()
  const [query, setQuery] = useState('')
  const [targetUid, setTargetUid] = useState(user?.uid || '')
  const [users, setUsers] = useState<AdminUserItem[]>([])
  const [nextCursor, setNextCursor] = useState<string | null>(null)
  const [loadingUsers, setLoadingUsers] = useState(false)
  const [loadingDiag, setLoadingDiag] = useState(false)
  const [busyUid, setBusyUid] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [adminOverview, setAdminOverview] = useState<AnyObj | null>(null)
  const [userDiag, setUserDiag] = useState<AnyObj | null>(null)

  const loadUsers = async (opts: { reset?: boolean } = {}) => {
    const reset = opts.reset === true
    if (loadingUsers) return
    setLoadingUsers(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      params.set('limit', '30')
      if (query.trim()) params.set('q', query.trim())
      if (!reset && nextCursor) params.set('cursor', nextCursor)
      const resp = await backendFetch(`/api/admin-users-status?${params.toString()}`, { auth: true, method: 'GET' })
      const json = await resp.json().catch(() => ({}))
      if (!resp.ok) throw new Error(json?.error || `admin_users_${resp.status}`)
      const incoming = Array.isArray(json?.users) ? json.users : []
      setUsers((prev) => (reset ? incoming : [...prev, ...incoming]))
      setNextCursor(json?.nextCursor || null)
      if (reset && incoming.length > 0 && !targetUid) {
        setTargetUid(incoming[0]?.uid || '')
      }
    } catch (e: any) {
      setError(e?.message || t('admin.error.loadUsers'))
    } finally {
      setLoadingUsers(false)
    }
  }

  const runDiag = async () => {
    setLoadingDiag(true)
    setError(null)
    try {
      const uid = String(targetUid || '').trim()
      if (!uid) throw new Error(t('admin.error.uidRequired'))
      const [adminResp, userResp] = await Promise.all([
        backendFetch('/api/diag/admin', { auth: true, method: 'GET' }),
        backendFetch(`/api/diag/user/${encodeURIComponent(uid)}`, { auth: true, method: 'GET' }),
      ])
      const adminJson = await adminResp.json().catch(() => ({}))
      const userJson = await userResp.json().catch(() => ({}))
      if (!adminResp.ok) throw new Error(adminJson?.error || `diag_admin_${adminResp.status}`)
      if (!userResp.ok) throw new Error(userJson?.error || `diag_user_${userResp.status}`)
      setAdminOverview(adminJson)
      setUserDiag(userJson)
    } catch (e: any) {
      setError(e?.message || t('admin.error.loadDiag'))
    } finally {
      setLoadingDiag(false)
    }
  }

  const recalcUser = async (uid: string) => {
    setBusyUid(uid)
    setError(null)
    try {
      const resp = await backendFetch('/api/admin-recalculate-status', {
        auth: true,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: uid }),
      })
      const json = await resp.json().catch(() => ({}))
      if (!resp.ok) throw new Error(json?.error || `recalc_${resp.status}`)

      setUsers((prev) =>
        prev.map((entry) =>
          entry.uid === uid
            ? {
                ...entry,
                statusScore: Number.isFinite(Number(json?.statusPersonal?.score)) ? Number(json.statusPersonal.score) : entry.statusScore,
                statusLevel: json?.statusPersonal?.level || entry.statusLevel,
                lastStatusAt: json?.computedAt || entry.lastStatusAt,
                criticalAreas: Number.isFinite(Number(json?.counts?.criticalAreas)) ? Number(json.counts.criticalAreas) : entry.criticalAreas,
                positiveAreas: Number.isFinite(Number(json?.counts?.positiveAreas)) ? Number(json.counts.positiveAreas) : entry.positiveAreas,
              }
            : entry
        )
      )

      if (targetUid === uid) {
        await runDiag()
      }
    } catch (e: any) {
      setError(e?.message || t('admin.error.recalc', { uid }))
    } finally {
      setBusyUid(null)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{t('admin.panel.title')}</Text>
        <Text style={styles.subtitle}>{t('admin.panel.subtitle')}</Text>

        <View style={styles.inputWrap}>
          <Text style={styles.label}>{t('admin.search.label')}</Text>
          <View style={styles.inline}>
            <TextInput
              style={[styles.input, { flex: 1, marginBottom: 0 }]}
              value={query}
              onChangeText={setQuery}
              autoCapitalize="none"
              autoCorrect={false}
              placeholder={t('admin.search.placeholder')}
              placeholderTextColor="#7B809A"
            />
            <TouchableOpacity style={styles.smallButton} onPress={() => loadUsers({ reset: true })} disabled={loadingUsers}>
              {loadingUsers ? <ActivityIndicator size="small" color="#0F0F23" /> : <Text style={styles.smallButtonText}>{t('admin.search.button')}</Text>}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.block}>
          <Text style={styles.blockTitle}>{t('admin.users.title')}</Text>
          {users.map((entry) => (
            <TouchableOpacity
              key={entry.uid}
              style={[styles.userRow, targetUid === entry.uid ? styles.userRowActive : null]}
              onPress={() => setTargetUid(entry.uid)}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.userName}>
                  {entry.displayName}
                  {entry.isAdmin ? t('admin.users.adminBadge') : ''}
                </Text>
                <Text style={styles.userMeta}>{entry.email || entry.uid}</Text>
                <Text style={styles.userMeta}>
                  {t('admin.users.meta', {
                    score: String(entry.statusScore ?? '—'),
                    level: entry.statusLevel || '—',
                    critical: String(entry.criticalAreas),
                    positive: String(entry.positiveAreas),
                  })}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.recalcButton}
                onPress={() => recalcUser(entry.uid)}
                disabled={busyUid === entry.uid}
              >
                {busyUid === entry.uid ? (
                  <ActivityIndicator size="small" color="#0F0F23" />
                ) : (
                  <Text style={styles.recalcText}>{t('admin.users.recalc')}</Text>
                )}
              </TouchableOpacity>
            </TouchableOpacity>
          ))}

          <View style={styles.inline}>
            <TouchableOpacity
              style={[styles.smallButton, { marginTop: 8 }]}
              onPress={() => loadUsers({ reset: users.length === 0 })}
              disabled={loadingUsers}
            >
              {loadingUsers ? <ActivityIndicator size="small" color="#0F0F23" /> : <Text style={styles.smallButtonText}>{t('admin.users.loadMore')}</Text>}
            </TouchableOpacity>
            <Text style={styles.userMeta}>{nextCursor ? t('admin.users.hasMore') : t('admin.users.endList')}</Text>
          </View>
        </View>

        <View style={styles.inputWrap}>
          <Text style={styles.label}>{t('admin.diag.label')}</Text>
          <View style={styles.inline}>
            <TextInput
              style={[styles.input, { flex: 1, marginBottom: 0 }]}
              value={targetUid}
              onChangeText={setTargetUid}
              autoCapitalize="none"
              autoCorrect={false}
              placeholder={t('admin.diag.placeholder')}
              placeholderTextColor="#7B809A"
            />
            <TouchableOpacity style={styles.smallButton} onPress={runDiag} disabled={loadingDiag}>
              {loadingDiag ? <ActivityIndicator size="small" color="#0F0F23" /> : <Text style={styles.smallButtonText}>{t('admin.diag.button')}</Text>}
            </TouchableOpacity>
          </View>
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}
        {adminOverview ? <JsonBlock title={t('admin.diag.overviewTitle')} value={adminOverview} /> : null}
        {userDiag ? <JsonBlock title={t('admin.diag.userTitle')} value={userDiag} /> : null}
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
  inline: { flexDirection: 'row', alignItems: 'center', gap: 8 },
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
  smallButton: {
    backgroundColor: '#FFD700',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallButtonText: { color: '#0F0F23', fontWeight: '800' },
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
  userRow: {
    borderWidth: 1,
    borderColor: '#2B3050',
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  userRowActive: { borderColor: '#FFD700' },
  userName: { color: '#FFFFFF', fontWeight: '800' },
  userMeta: { color: '#A9AEC4', fontSize: 12, marginTop: 2 },
  recalcButton: {
    backgroundColor: '#FFD700',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  recalcText: { color: '#0F0F23', fontWeight: '800', fontSize: 12 },
})
