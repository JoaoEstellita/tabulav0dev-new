import React, { useMemo } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { decodeUnicodeEscapes, translatePlanet } from '../../../utils/astro/pt'
import { normalizeKey } from '../../../utils/astro/normalizeKey'
import { buildTransitTitle as buildSharedTransitTitle } from '../../../utils/transitPresentation'
import type { ImpactAreaNode } from './buildImpactNodes'
import { useAppLanguage } from '../../../hooks/useAppLanguage'
import type { AppLanguage } from '../../../i18n/appI18n'

interface HomeImpactSummaryProps {
  impactNodes: ImpactAreaNode[]
  lifeAreas?: Record<string, any> | null
  lunarPhaseLabel?: string | null
  recentTransits?: Array<{
    transitPlanet: string
    natalPlanet: string
    type: string
    orb: number
    isApplying?: boolean
    strength?: number
  }>
}

const translateAspectLabel = (type: string, language: AppLanguage = 'pt-BR'): string => {
  const key = normalizeKey(type)
  const map: Record<AppLanguage, Record<string, string>> = {
    'pt-BR': {
      conjuncao: 'conjuncao', conjunction: 'conjuncao', sextil: 'sextil', sextile: 'sextil', quadratura: 'quadratura', square: 'quadratura', trigono: 'trigono', trine: 'trigono', oposicao: 'oposicao', opposition: 'oposicao', quincuncio: 'quincuncio', quincunx: 'quincuncio',
    },
    'en-US': {
      conjuncao: 'conjunction', conjunction: 'conjunction', sextil: 'sextile', sextile: 'sextile', quadratura: 'square', square: 'square', trigono: 'trine', trine: 'trine', oposicao: 'opposition', opposition: 'opposition', quincuncio: 'quincunx', quincunx: 'quincunx',
    },
    'es-ES': {
      conjuncao: 'conjuncion', conjunction: 'conjuncion', sextil: 'sextil', sextile: 'sextil', quadratura: 'cuadratura', square: 'cuadratura', trigono: 'trigono', trine: 'trigono', oposicao: 'oposicion', opposition: 'oposicion', quincuncio: 'quincuncio', quincunx: 'quincuncio',
    },
    'it-IT': {
      conjuncao: 'congiunzione', conjunction: 'congiunzione', sextil: 'sestile', sextile: 'sestile', quadratura: 'quadratura', square: 'quadratura', trigono: 'trigono', trine: 'trigono', oposicao: 'opposizione', opposition: 'opposizione', quincuncio: 'quinconce', quincunx: 'quinconce',
    },
  }
  return map[language][key] || decodeUnicodeEscapes(type)
}

const formatOrb = (orb?: number) => {
  if (typeof orb !== 'number') return ''
  return `${orb.toFixed(1)}\u00B0`
}

export default function HomeImpactSummary({
  impactNodes,
  lifeAreas,
  lunarPhaseLabel,
  recentTransits,
}: HomeImpactSummaryProps) {
  const { language } = useAppLanguage()
  const tl = React.useCallback((pt: string, en: string, es: string, it: string) => {
    if (language === 'en-US') return en
    if (language === 'es-ES') return es
    if (language === 'it-IT') return it
    return pt
  }, [language])

  const recentItems = useMemo(() => {
    if (!recentTransits?.length) return []
    return [...recentTransits]
      .sort((a, b) => {
        if (a.isApplying !== b.isApplying) return a.isApplying ? -1 : 1
        if (typeof a.orb === 'number' && typeof b.orb === 'number' && a.orb !== b.orb) return a.orb - b.orb
        return (b.strength || 0) - (a.strength || 0)
      })
      .slice(0, 5)
  }, [recentTransits])

  if (!recentItems.length && !impactNodes.length) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{tl('Pulso do momento', 'Current pulse', 'Pulso del momento', 'Polso del momento')}</Text>
        <Text style={styles.subtitle}>
          {tl(
            'Sem dados suficientes para resumir agora.',
            'Not enough data to summarize right now.',
            'No hay datos suficientes para resumir ahora.',
            'Dati insufficienti per riassumere ora.'
          )}
        </Text>
      </View>
    )
  }

  const lunarLabel = lunarPhaseLabel ? decodeUnicodeEscapes(lunarPhaseLabel) : null

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{tl('Pulso do momento', 'Current pulse', 'Pulso del momento', 'Polso del momento')}</Text>
      <View style={styles.metaRow}>
        {lunarLabel ? (
          <Text style={styles.lunarLine}>{tl('Fase lunar', 'Moon phase', 'Fase lunar', 'Fase lunare')}: {lunarLabel}</Text>
        ) : null}
      </View>
      {recentItems.length > 0 ? (
        <View style={styles.rows}>
          <Text style={styles.sectionLabel}>{tl('Transitos recentes', 'Recent transits', 'Transitos recientes', 'Transiti recenti')}</Text>
          {recentItems.map((item, index) => {
            const label = buildSharedTransitTitle({
              transitPlanet: translatePlanet(item.transitPlanet, language),
              aspectLabel: translateAspectLabel(item.type, language),
              targetLabel: translatePlanet(item.natalPlanet, language),
            }, language)
            const orbLabel = formatOrb(item.orb)
            return (
              <View key={`${item.transitPlanet}-${item.natalPlanet}-${index}`} style={styles.transitItem}>
                <Text style={styles.transitTitle}>{label}</Text>
                {orbLabel ? (
                  <Text style={styles.transitMeta}>
                    {tl('Orbe', 'Orb', 'Orbe', 'Orbe')} {orbLabel}
                    {item.isApplying
                      ? tl(' - aplicante', ' - applying', ' - aplicando', ' - applicante')
                      : tl(' - separante', ' - separating', ' - separando', ' - separante')}
                  </Text>
                ) : null}
              </View>
            )
          })}
        </View>
      ) : (
        <Text style={styles.subtitle}>
          {tl(
            'Sem transitos recentes para exibir.',
            'No recent transits to display.',
            'Sin transitos recientes para mostrar.',
            'Nessun transito recente da mostrare.'
          )}
        </Text>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  title: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '700',
  },
  subtitle: {
    color: '#94A3B8',
    fontSize: 13,
    marginTop: 6,
  },
  metaRow: {
    marginTop: 6,
  },
  metaLine: {
    color: '#94A3B8',
    fontSize: 12,
  },
  lunarLine: {
    color: '#E2E8F0',
    fontSize: 12,
    marginTop: 4,
  },
  rows: {
    gap: 10,
    marginTop: 12,
  },
  sectionLabel: {
    color: '#A78BFA',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 6,
  },
  transitItem: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  transitTitle: {
    color: '#E2E8F0',
    fontSize: 13,
    fontWeight: '600',
  },
  transitMeta: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 4,
  },
  ctaRow: {
    marginTop: 12,
    alignItems: 'flex-start',
  },
  ctaText: {
    color: '#E2E8F0',
    fontSize: 12,
    fontWeight: '600',
  },
})
