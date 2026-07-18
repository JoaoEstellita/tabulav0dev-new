import React, { useMemo, useState } from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { useLifeAreas } from '../../hooks/useLifeAreas'
import { getTransitState, formatPeakETA, aspectNature, windowsIntersect } from '../../utils/astro/pt'
import { useAppLanguage } from '../../hooks/useAppLanguage'
import { buildTransitTitle } from '../../utils/transitPresentation'
import { buildUnifiedTransitNarrative } from '../../utils/astroInterpretation'
import TransitInsightCard from '../../components/TransitInsightCard'

export default function PersonalTransitsScreen() {
  const { t, language } = useAppLanguage()
  const { transitData } = useLifeAreas()
  // Cada tarja controla o próprio toggle — numa lista de leitura, limitar a um
  // card aberto por vez atrapalharia comparar trânsitos.
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  const tl = (pt: string, en: string, es: string, it: string) => {
    if (language === 'en-US') return en
    if (language === 'es-ES') return es
    if (language === 'it-IT') return it
    return pt
  }

  const personalRaw = transitData?.dailyOverview?.personalTodayRich || []
  const collective = useMemo(
    () => (transitData?.dailyOverview?.collectiveKeyAspectsRich || []).filter((a: any) => a.planet1 !== a.planet2),
    [transitData?.dailyOverview?.collectiveKeyAspectsRich],
  )

  const list = useMemo(() => {
    const seen = new Set<string>()
    const deduped = personalRaw.filter((item: any) => {
      const key = `${item.natalPlanet}|${item.type}|${item.transitPlanet}`
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
    // Ordena por importância (força do trânsito) desc; desempate pela data do pico.
    return deduped.slice().sort((a: any, b: any) => {
      const as = typeof a?.strength === 'number' ? a.strength : 0
      const bs = typeof b?.strength === 'number' ? b.strength : 0
      if (bs !== as) return bs - as
      const ax = new Date(a?.window?.exact || a?.window?.start || Date.now()).getTime()
      const bx = new Date(b?.window?.exact || b?.window?.start || Date.now()).getTime()
      return ax - bx
    })
  }, [personalRaw])

  const natureVisual = (nature: string) =>
    nature === 'harmonico'
      ? { color: '#16A34A', label: tl('Harmônico', 'Harmonic', 'Armónico', 'Armonico') }
      : nature === 'desafiador'
        ? { color: '#DC2626', label: tl('Desafiador', 'Challenging', 'Desafiante', 'Impegnativo') }
        : { color: '#D97706', label: tl('Neutro', 'Neutral', 'Neutro', 'Neutro') }

  return (
    <LinearGradient colors={['#0F0F23', '#1A1A3A']} style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <Text style={styles.title}>{t('transits.personal.title')}</Text>

        {list.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>{t('transits.personal.empty')}</Text>
          </View>
        ) : (
          list.map((item: any, i: number) => {
            const key = `${item.transitPlanet}|${item.type}|${item.natalPlanet}|${i}`

            // transitPlanet PRIMEIRO: convenção do resto do app e da astrologia
            // ("Saturno quadratura Sol natal"). Esta tela vinha invertida.
            const title = buildTransitTitle(
              { transitPlanet: item.transitPlanet, aspectLabel: item.type, targetLabel: item.natalPlanet },
              language as any,
            )

            const narrative = buildUnifiedTransitNarrative(item, undefined, language)
            const nature = natureVisual(aspectNature(item.type))
            const timing = [getTransitState(item.window), formatPeakETA(item.window)].filter(Boolean).join(' · ')

            const hasSynergy = collective.some(
              (c: any) =>
                (c.planet1 === item.natalPlanet ||
                  c.planet2 === item.natalPlanet ||
                  c.planet1 === item.transitPlanet ||
                  c.planet2 === item.transitPlanet) &&
                windowsIntersect(item.window as any, c.window as any),
            )

            const impact = typeof item.strength === 'number' ? Math.max(0, Math.min(1, item.strength / 100)) : null

            return (
              <View key={key} style={styles.cardWrap}>
                <TransitInsightCard
                  statusLabel={nature.label}
                  statusColor={nature.color}
                  title={hasSynergy ? `${title}  ✦` : title}
                  houseLabel={item.house ? String(item.house) : null}
                  houseLabelPrefix={tl('Casa impactada', 'Impacted house', 'Casa impactada', 'Casa impattata')}
                  timingLabel={timing || null}
                  impactValue01={impact}
                  directText={narrative.shortText}
                  fullText={narrative.modalBody}
                  fullTitle={tl('Leitura completa', 'Full reading', 'Lectura completa', 'Lettura completa')}
                  actionText={narrative.actionText || null}
                  metaText={narrative.metaText || null}
                  fullExpanded={!!expanded[key]}
                  onToggleFull={() => setExpanded((prev) => ({ ...prev, [key]: !prev[key] }))}
                  detailMode="inline"
                />
              </View>
            )
          })
        )}
      </ScrollView>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, minHeight: 0 },
  scroll: { flex: 1, minHeight: 0 },
  content: { padding: 16, paddingBottom: 40 },
  title: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 14,
  },
  cardWrap: { marginBottom: 12 },
  emptyCard: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 12,
    padding: 20,
    marginTop: 8,
  },
  emptyText: {
    color: '#94A3B8',
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
  },
})
