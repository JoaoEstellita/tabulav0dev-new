import React from 'react'
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import UserService from '../services/firebase/UserService'
import { useAuth } from '../hooks/useAuth'
import useTransits from '../hooks/useTransits'
import { useUserSettings } from '../hooks/useUserSettings'

export default function TransitsComparativePanel() {
  const { personal, general, statusPersonal } = useTransits(null)
  const { settings, updateSettings } = useUserSettings()
  const { user } = useAuth()
  const [houseSystem, setHouseSystem] = React.useState<'equal'|'placidus'>(
    (settings?.houseSystem === 'placidus' ? 'placidus' : 'equal')
  )
  React.useEffect(() => {
    if (settings?.houseSystem === 'placidus' || settings?.houseSystem === 'equal') {
      setHouseSystem(settings.houseSystem)
    }
  }, [settings?.houseSystem])

  const applyHouseSystem = React.useCallback(async (sys: 'equal'|'placidus') => {
    try {
      setHouseSystem(sys)
      await updateSettings({ houseSystem: sys })
      ;(globalThis as any).__userHouseSystem = sys
      if (user?.uid) { try { await UserService.setHouseSystem(user.uid, sys) } catch {} }
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('house-system-changed'))
      }
    } catch {}
  }, [])

  const topPersonal = [...personal].sort((a,b)=>b.strength-a.strength).slice(0,8)

  return (
    <LinearGradient colors={['#1E1E2E', '#2A2A3E']} style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Trânsitos Comparativos</Text>
        <View style={styles.toggleGroup}>
          <TouchableOpacity
            onPress={() => applyHouseSystem(houseSystem === 'placidus' ? 'equal' : 'placidus')}
            style={[styles.toggleBtn, styles.toggleBtnActive]}
            accessibilityRole="button"
            accessibilityLabel="Alternar sistema de casas"
          >
            <Text style={[styles.toggleText, styles.toggleTextActive]}>
              {houseSystem === 'equal' ? 'Casas Inteiras' : 'Placidus'}
            </Text>
          </TouchableOpacity>
        </View>
        {statusPersonal && (
          <Text style={styles.status}>Status: {statusPersonal.level} ({statusPersonal.score}%)</Text>
        )}
      </View>

      <Text style={styles.sectionTitle}>Pessoais</Text>
      {topPersonal.length === 0 ? (
        <Text style={styles.emptyText}>Sem trânsitos pessoais relevantes.</Text>
      ) : (
        <FlatList
          data={topPersonal}
          keyExtractor={(item, idx) => `${item.transitPlanet}-${item.natalPlanet}-${idx}`}
          renderItem={({ item }) => (
            <View style={styles.itemRow}>
              <Text style={styles.itemText}>
                {translate(item.transitPlanet)} {item.type} {translate(item.natalPlanet)} • orbe {item.orb.toFixed(1)}° • {item.isApplying ? 'aplicante' : 'separante'}
              </Text>
              <Text style={styles.metaText}>Casa natal {item.natalHouseImpacted} • {item.durationClass}</Text>
            </View>
          )}
        />
      )}

      <Text style={[styles.sectionTitle, { marginTop: 16 }]}>Coletivos (do Momento)</Text>
      <Text style={styles.metaText}>{general.length} aspectos ativos</Text>
    </LinearGradient>
  )
}

function translate(p: string): string {
  const m: Record<string,string> = {
    Sun: 'Sol', Moon: 'Lua', Mercury: 'Mercúrio', Venus: 'Vênus', Mars: 'Marte',
    Jupiter: 'Júpiter', Saturn: 'Saturno', Uranus: 'Urano', Neptune: 'Netuno', Pluto: 'Plutão'
  }
  return m[p] ?? p
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    margin: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: { color: '#FFD700', fontWeight: 'bold', fontSize: 16 },
  status: { color: '#FFFFFF', opacity: 0.85, fontSize: 12 },
  sectionTitle: { color: '#FFFFFF', fontWeight: '600', marginTop: 8, marginBottom: 6 },
  emptyText: { color: '#A0A0A0', fontSize: 12 },
  itemRow: { marginBottom: 8 },
  itemText: { color: '#FFFFFF', fontSize: 13 },
  metaText: { color: '#A0A0A0', fontSize: 12 },
  toggleGroup: {
    flexDirection: 'row',
    gap: 6,
    marginLeft: 'auto',
  },
  toggleBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.08)'
  },
  toggleBtnActive: {
    backgroundColor: 'rgba(255,215,0,0.2)'
  },
  toggleText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500'
  },
  toggleTextActive: {
    fontWeight: '700'
  },
})


