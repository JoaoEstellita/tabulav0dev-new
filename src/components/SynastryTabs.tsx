/**
 * Abas de sinastria: Astral · Tzolkin · Chinês · Védico. Cada leitura numa aba própria
 * (não empilhadas). Reutilizado no Mapa Completo, no modal Sinastria e na aba Grupos.
 * O conteúdo Astral varia por tela → entra como `astral` (ReactNode); as 3 lentes
 * simbólicas se auto-computam pelos dados de nascimento passados.
 */
import React, { useMemo, useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import { useAppLanguage } from '../hooks/useAppLanguage'
import TzolkinMatchView from '../screens/cosmos/TzolkinMatchView'
import ChineseMatchView from '../screens/cosmos/ChineseMatchView'
import VedicMatchView from '../screens/cosmos/VedicMatchView'
import { lensColor, lensLabel } from '../theme/lenses'

const TZOLKIN_ENABLED = process.env.EXPO_PUBLIC_TZOLKIN_ENABLED !== '0'
const CHINESE_ENABLED = process.env.EXPO_PUBLIC_CHINESE_ENABLED !== '0'
const VEDIC_ENABLED = process.env.EXPO_PUBLIC_VEDIC_ENABLED !== '0'

type Birth = { birthDate?: string; birthTime?: string; longitude?: number }
type TzolkinP = { aDateISO: string; bDateISO: string }
type ChineseP = { aBirth?: Birth; bBirth?: Birth }
type VedicP = { aMoonLon?: number | null; aBirthDate?: string; bMoonLon?: number | null; bBirthDate?: string }

export default function SynastryTabs({ aName, bName, astral, tzolkin, chinese, vedic, scroll }: {
  aName?: string; bName?: string
  astral?: React.ReactNode
  tzolkin?: TzolkinP | null
  chinese?: ChineseP | null
  vedic?: VedicP | null
  scroll?: boolean
}) {
  const { language } = useAppLanguage()
  const lang = language || 'pt-BR'
  const tl = (pt: string, en: string, es: string, it: string) => (lang === 'en-US' ? en : lang === 'es-ES' ? es : lang === 'it-IT' ? it : pt)

  const tabs = useMemo(() => {
    const t: { key: string; label: string; color: string }[] = []
    if (astral) t.push({ key: 'astral', label: tl('Astral', 'Astro', 'Astral', 'Astrale'), color: lensColor('astro') })
    if (TZOLKIN_ENABLED && tzolkin) t.push({ key: 'tzolkin', label: lensLabel('tzolkin', lang), color: lensColor('tzolkin') })
    if (CHINESE_ENABLED && chinese) t.push({ key: 'chinese', label: lensLabel('chinese', lang), color: lensColor('chinese') })
    if (VEDIC_ENABLED && vedic) t.push({ key: 'vedic', label: lensLabel('vedic', lang), color: lensColor('vedic') })
    return t
  }, [astral, tzolkin, chinese, vedic, lang])

  const [active, setActive] = useState<string>(tabs[0]?.key || 'astral')
  const cur = tabs.find((t) => t.key === active) || tabs[0]
  if (!tabs.length) return null

  const Body = (
    <View style={{ paddingTop: 12 }}>
      {cur?.key === 'astral' ? astral : null}
      {cur?.key === 'tzolkin' && tzolkin ? <TzolkinMatchView embedded aDateISO={tzolkin.aDateISO} bDateISO={tzolkin.bDateISO} aName={aName} bName={bName} /> : null}
      {cur?.key === 'chinese' && chinese ? <ChineseMatchView embedded aBirth={chinese.aBirth} bBirth={chinese.bBirth} aName={aName} bName={bName} /> : null}
      {cur?.key === 'vedic' && vedic ? <VedicMatchView embedded aMoonLon={vedic.aMoonLon} aBirthDate={vedic.aBirthDate} bMoonLon={vedic.bMoonLon} bBirthDate={vedic.bBirthDate} aName={aName} bName={bName} /> : null}
    </View>
  )

  return (
    <View>
      <View style={s.bar}>
        {tabs.map((t) => {
          const on = t.key === active
          return (
            <TouchableOpacity key={t.key} activeOpacity={0.8} onPress={() => setActive(t.key)} style={[s.tab, on && { backgroundColor: t.color + '22', borderColor: t.color }]}>
              <Text style={[s.tabTx, on && { color: t.color }]} numberOfLines={1}>{t.label}</Text>
            </TouchableOpacity>
          )
        })}
      </View>
      {scroll ? <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>{Body}</ScrollView> : Body}
    </View>
  )
}

const s = StyleSheet.create({
  bar: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  tab: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,.10)', backgroundColor: 'rgba(255,255,255,.04)' },
  tabTx: { color: '#b8b3d6', fontSize: 13, fontWeight: '800' },
})
