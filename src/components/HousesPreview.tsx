import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { computeHousesUTC, degToSign } from '../astro'
import type { HouseSystem } from '../astro'

type Props = { dateUTC: Date; lat: number; lon: number; system: HouseSystem }

export default function HousesPreview({ dateUTC, lat, lon, system }: Props) {
  const [state, setState] = useState<any>(null)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    // Guardas de segurança: evitar cálculo sem parâmetros válidos
    const invalidDate = !(dateUTC instanceof Date) || isNaN(dateUTC.getTime())
    const invalidLatLon = !Number.isFinite(lat) || !Number.isFinite(lon)
    if (invalidDate || invalidLatLon) {
      if (mounted) {
        setState(null)
        setErr('Faltam parâmetros para calcular as casas (data/latitude/longitude).')
      }
      return () => { mounted = false }
    }

    computeHousesUTC(dateUTC, lat, lon, system)
      .then(res => { if (mounted) setState(res) })
      .catch(e => { if (mounted) setErr(String(e?.message || e)) })
    return () => { mounted = false }
  }, [dateUTC.getTime(), lat, lon, system])

  if (err) return <Text style={styles.err}>Prévia indisponível para este dispositivo/ambiente.</Text>
  if (!state) return <Text style={styles.loading}>Calculando casas…</Text>

  const { asc, mc, cusps, planetLongitudes, planetHouses, approximate } = state
  const format = (deg: number) => {
    const { sign, degInSign } = degToSign(deg)
    return `${degInSign.toFixed(1)}° ${sign}`
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Sistema: {system === 'equal' ? 'casas inteiras' : system}</Text>
      <Text style={styles.item}>ASC: {format(asc)} | MC: {format(mc)}</Text>
      {state.system === 'placidus' && approximate && (
        <Text style={{ color:'#FFD700', marginBottom: 8 }}>Placidus (aprox)</Text>
      )}
      <Text style={styles.subtitle}>Cúspides</Text>
      {cusps.map((c: number, i: number) => (
        <Text style={styles.item} key={i}>Casa {i+1}: {format(c)}</Text>
      ))}
      <Text style={styles.subtitle}>Planetas</Text>
      {Object.entries(planetLongitudes).map(([p, L]: any) => (
        <Text style={styles.item} key={p}>{p}: {format(L)} → Casa {planetHouses[p]}</Text>
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { padding: 12 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  subtitle: { fontSize: 16, fontWeight: '600', marginTop: 12, marginBottom: 6 },
  item: { fontSize: 14, marginBottom: 4 },
  loading: { padding: 12 },
  err: { padding: 12, color: 'red' },
})


