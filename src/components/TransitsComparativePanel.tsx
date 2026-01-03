import React from 'react'
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import UserService from '../services/firebase/UserService'
import { HOUSE_SYSTEMS, normalizeHouseSystem, formatHouseSystemLabel } from '../astro/houseSystem'
import type { HouseSystem } from '../astro/houseSystem'
import { useAuth } from '../hooks/useAuth'
import useTransits from '../hooks/useTransits'
import { useUserSettings } from '../hooks/useUserSettings'
import { translatePlanetPT } from '../utils/astro/pt'

export default function TransitsComparativePanel() {
  const { personal, general, statusPersonal } = useTransits(null)
  const { settings, updateSettings } = useUserSettings()
  const { user } = useAuth()
  const [houseSystem, setHouseSystem] = React.useState<HouseSystem>(
    normalizeHouseSystem(settings?.houseSystem || 'placidus')
  )
  React.useEffect(() => {
    if (settings?.houseSystem) {
      setHouseSystem(normalizeHouseSystem(settings.houseSystem))
    }
  }, [settings?.houseSystem])

  const applyHouseSystem = React.useCallback(async (sys: HouseSystem) => {
    try {
      const normalized = normalizeHouseSystem(sys)
      setHouseSystem(normalized)
      await updateSettings({ houseSystem: sys })
      ;(globalThis as any).__userHouseSystem = normalized
      if (user?.uid) { try { await UserService.setHouseSystem(user.uid, normalized) } catch {} }
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('house-system-changed'))
      }
    } catch {}
  }, [])

  const topPersonal = [...personal].sort((a,b)=>b.strength-a.strength).slice(0,8)
  const formatStatusLabel = (status: string | null) => {
    if (!status) return ''
    const map: Record<string, string> = {
      excelente: 'Excelente',
      bom: 'Bom',
      neutro: 'Neutro',
      desafiador: 'Desafiador',
      critico: 'Crítico'
    }
    return map[String(status).toLowerCase()] || status
  }

  const normalizeKey = (value: string): string =>
    String(value || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')

  const translateAspectLabel = (type: string): string => {
    const key = normalizeKey(type)
    const map: Record<string, string> = {
      conjuncao: 'conjunção',
      conjunction: 'conjunção',
      sextil: 'sextil',
      sextile: 'sextil',
      quadratura: 'quadratura',
      square: 'quadratura',
      trigono: 'trígono',
      trine: 'trígono',
      oposicao: 'oposição',
      opposition: 'oposição',
      quincuncio: 'quincúncio',
      quincunx: 'quincúncio'
    }
    return map[key] || type
  }

  return (
    <LinearGradient colors={['#1E1E2E', '#2A2A3E']} style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Trânsitos comparativos</Text>
        <View style={styles.toggleGroup}>
          <TouchableOpacity
            onPress={() => {
              const idx = HOUSE_SYSTEMS.indexOf(houseSystem)
              const next = HOUSE_SYSTEMS[(idx + 1) % HOUSE_SYSTEMS.length]
              applyHouseSystem(next)
            }}
            style={[styles.toggleBtn, styles.toggleBtnActive]}
            accessibilityRole="button"
            accessibilityLabel="Alternar sistema de casas"
          >
            <Text style={[styles.toggleText, styles.toggleTextActive]}>
              {formatHouseSystemLabel(houseSystem)}
            </Text>
          </TouchableOpacity>
        </View>
        {statusPersonal && (
          <Text style={styles.status}>Status: {formatStatusLabel(statusPersonal.level)} ({statusPersonal.score}%)</Text>
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
                {translatePlanetPT(item.transitPlanet)} {translateAspectLabel(item.type)} {translatePlanetPT(item.natalPlanet)} - orbe {item.orb.toFixed(1)} graus - {item.isApplying ? 'aplicante' : 'separante'}
              </Text>
              <Text style={styles.metaText}>Casa natal {item.natalHouseImpacted} - {item.durationClass}</Text>
            </View>
          )}
        />
      )}

      <Text style={[styles.sectionTitle, { marginTop: 16 }]}>Coletivos (do momento)</Text>
      <Text style={styles.metaText}>{general.length} aspectos ativos</Text>
    </LinearGradient>
  )
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







