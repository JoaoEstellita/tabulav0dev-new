import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { useLifeAreas } from '../../hooks/useLifeAreas'
import { useAppLanguage } from '../../hooks/useAppLanguage'
import { formatTransitCompact, aspectNature, signInfoFromLongitude, translatePlanet } from '../../utils/astro/pt'
import { nextNewMoon, nextFullMoon, soonestIngress } from '../../astro/skyEvents'
import { currentlyRetrograde, nextRetrograde } from '../../astro/retrogrades'
import type { Planet } from '../../astro/planets'
import { upcomingEclipses } from '../../astro/eclipses'

// Grade de "Trânsitos coletivos" no fim da Home: o céu de agora (aspectos entre
// planetas, iguais pra todo mundo). Botão-livro → lista completa (CollectiveTransits).
const NATURE_COLOR: Record<string, string> = { harmonico: '#9AE6B4', desafiador: '#FCA5A5', conjuncao: '#FDE68A', outro: '#C7C9E0' }

export default function HomeCollectiveGrid() {
  const navigation = useNavigation<any>()
  const { transitData } = useLifeAreas()
  const { language, t } = useAppLanguage()
  const tl = (pt: string, en: string, es: string, it: string) =>
    ({ 'pt-BR': pt, 'en-US': en, 'es-ES': es, 'it-IT': it } as any)[language] || pt

  const rawAll = (transitData?.dailyOverview?.collectiveKeyAspectsRich || []).filter((a: any) => a.planet1 !== a.planet2)
  const seen = new Set<string>()
  const list = rawAll
    .filter((a: any) => { const k = `${a.planet1}|${a.type}|${a.planet2}`; if (seen.has(k)) return false; seen.add(k); return true })
    .sort((a: any, b: any) => {
      const ax = new Date(a?.window?.exact || a?.window?.start || Date.now()).getTime()
      const bx = new Date(b?.window?.exact || b?.window?.start || Date.now()).getTime()
      return ax - bx
    })
    .slice(0, 6)

  // Ingressos coletivos = cada planeta no seu signo agora (mudança de signo é do céu).
  const ingresses = (transitData?.currentTransits?.planetComparisons || [])
    .map((p: any) => ({ planet: p?.name, retro: !!p?.current?.isRetrograde, ...signInfoFromLongitude(p?.current?.longitude, language) }))
    .filter((x: any) => x.planet && x.planet !== 'Ascendant' && x.planet !== 'Midheaven')

  // Próximos eventos do céu — calculados 1x (client-side, sem backend).
  const events = React.useMemo(() => {
    const now = new Date()
    const nm = nextNewMoon(now); const fm = nextFullMoon(now); const ing = soonestIngress(now)
    const TRACK: Planet[] = ['Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto']
    const retroNow = currentlyRetrograde(TRACK, now)
    const merc = retroNow.includes('Mercury') ? null : nextRetrograde('Mercury', now)
    const ecl = upcomingEclipses(now, 1)[0] || null
    return { newMoon: nm, fullMoon: fm, ingress: ing, retroNow, mercRetro: merc, eclipse: ecl }
  }, [])

  if (!list.length && !ingresses.length) return null

  const shortDate = (d?: Date | null) => {
    if (!d) return ''
    try { return d.toLocaleDateString(language, { day: '2-digit', month: 'short' }) } catch { return '' }
  }
  const fmtDate = (a: any) => {
    const iso = a?.window?.exact || a?.window?.start
    if (!iso) return ''
    try { return new Date(iso).toLocaleDateString(language, { day: '2-digit', month: 'short' }) } catch { return '' }
  }
  const ingSign = events.ingress ? signInfoFromLongitude(events.ingress.signIdx * 30 + 1, language) : null

  return (
    <View style={s.wrap}>
      <View style={s.header}>
        <Text style={s.title}>✨ {t('transits.collective.title') || tl('Trânsitos coletivos', 'Collective transits', 'Tránsitos colectivos', 'Transiti collettivi')}</Text>
        <TouchableOpacity style={s.bookBtn} onPress={() => navigation.navigate('CollectiveTransits')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons name="book-outline" size={16} color="#0F0F23" />
        </TouchableOpacity>
      </View>
      <Text style={s.sub}>{tl('O céu de agora — o mesmo pra todo mundo.', 'The sky right now — the same for everyone.', 'El cielo de ahora — el mismo para todos.', 'Il cielo di adesso — lo stesso per tutti.')}</Text>

      {events.newMoon || events.fullMoon || events.ingress ? (
        <View style={s.events}>
          {events.newMoon ? <Text style={s.event}>🌑 {tl('Nova', 'New', 'Nueva', 'Nuova')} {shortDate(events.newMoon)}</Text> : null}
          {events.fullMoon ? <Text style={s.event}>🌕 {tl('Cheia', 'Full', 'Llena', 'Piena')} {shortDate(events.fullMoon)}</Text> : null}
          {events.ingress && ingSign ? <Text style={s.event}>⏭ {translatePlanet(events.ingress.planet)} {ingSign.glyph} {shortDate(events.ingress.date)}</Text> : null}
          {events.retroNow.length ? <Text style={[s.event, s.eventRetro]}>℞ {events.retroNow.map((p) => translatePlanet(p)).join(', ')}</Text> : null}
          {events.mercRetro?.start ? <Text style={s.event}>℞ {tl('próx. Mercúrio R', 'next Mercury Rx', 'próx. Mercurio R', 'pross. Mercurio R')} {shortDate(events.mercRetro.start)}</Text> : null}
          {events.eclipse ? <Text style={s.event}>{events.eclipse.type === 'solar' ? '🌑' : '🌕'} {tl('Eclipse', 'Eclipse', 'Eclipse', 'Eclissi')} {signInfoFromLongitude(events.eclipse.longitude, language).glyph} {shortDate(events.eclipse.date)}</Text> : null}
        </View>
      ) : null}

      {list.length ? (
        <View style={s.grid}>
          {list.map((a: any, i: number) => {
            const nat = aspectNature(a.type)
            const color = NATURE_COLOR[nat] || NATURE_COLOR.outro
            return (
              <TouchableOpacity key={i} style={s.cell} activeOpacity={0.85} onPress={() => navigation.navigate('CollectiveTransits')}>
                <View style={[s.dot, { backgroundColor: color }]} />
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text style={s.cellTitle} numberOfLines={2}>{formatTransitCompact(a.planet1, a.type, a.planet2)}</Text>
                  {fmtDate(a) ? <Text style={s.cellDate}>{fmtDate(a)}</Text> : null}
                </View>
              </TouchableOpacity>
            )
          })}
        </View>
      ) : null}

      {ingresses.length ? (
        <>
          <Text style={s.stripLabel}>{tl('Planetas nos signos', 'Planets in signs', 'Planetas en signos', 'Pianeti nei segni')}</Text>
          <View style={s.chips}>
            {ingresses.map((p: any, i: number) => (
              <View key={i} style={[s.chip, p.deg < 2 && s.chipNew]}>
                <Text style={s.chipTx}>{translatePlanet(p.planet)} {p.glyph}{Math.floor(p.deg)}°{p.retro ? ' ℞' : ''}</Text>
              </View>
            ))}
          </View>
        </>
      ) : null}
    </View>
  )
}

const s = StyleSheet.create({
  wrap: { marginHorizontal: 16, marginTop: 8, marginBottom: 20, backgroundColor: '#171733', borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', padding: 14 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { color: '#EDEBF7', fontSize: 15, fontWeight: '800' },
  bookBtn: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#FFD700', alignItems: 'center', justifyContent: 'center' },
  sub: { color: '#9aa2b8', fontSize: 12, marginTop: 3, marginBottom: 10 },
  events: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  event: { color: '#EDEBF7', fontSize: 12, fontWeight: '700', backgroundColor: '#1F1F3D', borderRadius: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', paddingHorizontal: 8, paddingVertical: 4, textTransform: 'capitalize' },
  eventRetro: { color: '#FCA5A5', borderColor: 'rgba(252,165,165,0.4)' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  cell: { width: '47%', flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#1F1F3D', borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', paddingVertical: 10, paddingHorizontal: 10 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  cellTitle: { color: '#EDEBF7', fontSize: 12.5, fontWeight: '700', lineHeight: 16 },
  cellDate: { color: '#9aa2b8', fontSize: 11, marginTop: 2, textTransform: 'capitalize' },
  stripLabel: { color: '#9aa2b8', fontSize: 12, fontWeight: '700', marginTop: 12, marginBottom: 6 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: { backgroundColor: '#1F1F3D', borderRadius: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', paddingHorizontal: 8, paddingVertical: 4 },
  chipNew: { borderColor: '#FFD700' },
  chipTx: { color: '#C7C9E0', fontSize: 12, fontWeight: '600' },
})
