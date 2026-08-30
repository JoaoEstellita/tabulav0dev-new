import React from 'react'
import { View, Text, ScrollView, StyleSheet } from 'react-native'
import { useLifeAreas } from '../../hooks/useLifeAreas'
import { formatTransitCompact, aspectNature, signInfoFromLongitude, translatePlanet } from '../../utils/astro/pt'
import { nextSignIngress } from '../../astro/nextIngress'
import { retrogradeStatus } from '../../astro/retrogrades'
import type { Planet } from '../../astro/planets'
import { upcomingEclipses, houseFromCusps } from '../../astro/eclipses'
import { useAppLanguage } from '../../hooks/useAppLanguage'

const NATURE = {
  harmonico: { color: '#9AE6B4', pt: 'Harmônico', en: 'Harmonic', es: 'Armonico', it: 'Armonico' },
  desafiador: { color: '#FCA5A5', pt: 'Desafiador', en: 'Challenging', es: 'Desafiante', it: 'Impegnativo' },
  conjuncao: { color: '#FDE68A', pt: 'Conjunção', en: 'Conjunction', es: 'Conjuncion', it: 'Congiunzione' },
  outro: { color: '#C7C9E0', pt: 'Neutro', en: 'Neutral', es: 'Neutro', it: 'Neutro' },
} as const

export default function CollectiveTransitsScreen() {
  const { t, language } = useAppLanguage()
  const tl = (pt: string, en: string, es: string, it: string) =>
    ({ 'pt-BR': pt, 'en-US': en, 'es-ES': es, 'it-IT': it } as any)[language] || pt
  const { transitData } = useLifeAreas()
  const rawAll = (transitData?.dailyOverview?.collectiveKeyAspectsRich || []).filter((a: any) => a.planet1 !== a.planet2)

  const seen = new Set<string>()
  const list = rawAll
    .filter((a: any) => { const k = `${a.planet1}|${a.type}|${a.planet2}`; if (seen.has(k)) return false; seen.add(k); return true })
    .sort((a: any, b: any) => {
      const ax = new Date(a?.window?.exact || a?.window?.start || Date.now()).getTime()
      const bx = new Date(b?.window?.exact || b?.window?.start || Date.now()).getTime()
      return ax - bx
    })

  // Ingressos coletivos = cada planeta no signo agora.
  const ingresses = (transitData?.currentTransits?.planetComparisons || [])
    .map((p: any) => ({ planet: p?.name, retro: !!p?.current?.isRetrograde, ...signInfoFromLongitude(p?.current?.longitude, language) }))
    .filter((x: any) => x.planet && x.planet !== 'Ascendant' && x.planet !== 'Midheaven')

  // Próximo ingresso EXATO de cada planeta (cálculo real; memo por mount/posições).
  const ingressSig = ingresses.map((p: any) => `${p.planet}${Math.floor(p.deg)}`).join('|')
  const nextIng = React.useMemo(() => {
    const now = new Date()
    const out: Record<string, { date: Date; signIdx: number } | null> = {}
    for (const p of ingresses) { try { out[p.planet] = nextSignIngress(p.planet, now) } catch { out[p.planet] = null } }
    return out
  }, [ingressSig]) // eslint-disable-line react-hooks/exhaustive-deps

  const fmtIngressDate = (d: Date) => {
    try { return d.toLocaleDateString(language, { day: '2-digit', month: 'short', year: 'numeric' }) } catch { return '' }
  }

  // Retrógrados dos planetas que o público acompanha (memo por mount).
  const retros = React.useMemo(() => {
    const track: Planet[] = ['Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn']
    return retrogradeStatus(track, new Date())
  }, [])

  const eclipses = React.useMemo(() => upcomingEclipses(new Date(), 4), [])
  const natalCusps: number[] | null = (() => {
    const nh: any = (transitData as any)?.currentTransits?.natalHouses
    if (Array.isArray(nh) && nh.length >= 12) return nh
    if (Array.isArray(nh?.cusps) && nh.cusps.length >= 12) return nh.cusps
    return null
  })()

  const fmtDate = (a: any) => {
    const iso = a?.window?.exact || a?.window?.start
    if (!iso) return ''
    try { return new Date(iso).toLocaleDateString(language, { weekday: 'short', day: '2-digit', month: 'short' }) } catch { return '' }
  }

  return (
    <ScrollView contentContainerStyle={s.container}>
      <Text style={s.title}>{t('transits.collective.title') || tl('Trânsitos coletivos', 'Collective transits', 'Tránsitos colectivos', 'Transiti collettivi')}</Text>
      <Text style={s.sub}>{tl('Os aspectos do céu de agora — os mesmos para todo mundo. Não dependem do seu mapa.', 'The sky\'s aspects right now — the same for everyone. They don\'t depend on your chart.', 'Los aspectos del cielo de ahora — los mismos para todos. No dependen de tu carta.', 'Gli aspetti del cielo di adesso — gli stessi per tutti. Non dipendono dalla tua carta.')}</Text>

      {list.length === 0 ? (
        <Text style={s.empty}>{tl('Nenhum aspecto coletivo forte no momento.', 'No strong collective aspect right now.', 'Ningun aspecto colectivo fuerte ahora.', 'Nessun aspetto collettivo forte al momento.')}</Text>
      ) : list.map((a: any, i: number) => {
        const nat = (NATURE as any)[aspectNature(a.type)] || NATURE.outro
        const natLabel = tl(nat.pt, nat.en, nat.es, nat.it)
        const date = fmtDate(a)
        return (
          <View key={i} style={s.card}>
            <View style={[s.bar, { backgroundColor: nat.color }]} />
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text style={s.cardTitle}>{formatTransitCompact(a.planet1, a.type, a.planet2)}</Text>
              <View style={s.metaRow}>
                <Text style={[s.natTag, { color: nat.color, borderColor: nat.color }]}>{natLabel}</Text>
                {date ? <Text style={s.date}>{date}</Text> : null}
              </View>
            </View>
          </View>
        )
      })}

      {ingresses.length ? (
        <>
          <Text style={[s.title, { fontSize: 17, marginTop: 22 }]}>{tl('Planetas nos signos', 'Planets in signs', 'Planetas en signos', 'Pianeti nei segni')}</Text>
          <Text style={s.sub}>{tl('Onde cada planeta está no céu agora. Grau baixo = entrou há pouco no signo (ingresso recente).', 'Where each planet is in the sky now. Low degree = recently entered the sign (recent ingress).', 'Donde esta cada planeta en el cielo ahora. Grado bajo = entro hace poco en el signo (ingreso reciente).', 'Dove si trova ogni pianeta ora. Grado basso = entrato da poco nel segno (ingresso recente).')}</Text>
          {ingresses.map((p: any, i: number) => (
            <View key={'ing' + i} style={s.card}>
              <View style={[s.bar, { backgroundColor: p.deg < 2 ? '#FFD700' : '#6B7280' }]} />
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={s.cardTitle}>{translatePlanet(p.planet)} {p.glyph} {p.name} {Math.floor(p.deg)}°</Text>
                <View style={s.metaRow}>
                  {p.retro ? <Text style={[s.natTag, { color: '#FCA5A5', borderColor: '#FCA5A5' }]}>{tl('retrógrado', 'retrograde', 'retrogrado', 'retrogrado')}</Text> : null}
                  {p.deg < 2 ? <Text style={[s.natTag, { color: '#FFD700', borderColor: '#FFD700' }]}>{tl('ingresso recente', 'recent ingress', 'ingreso reciente', 'ingresso recente')}</Text> : null}
                </View>
                {nextIng[p.planet] ? (
                  <Text style={s.nextIng}>
                    → {tl('entra em', 'enters', 'entra en', 'entra in')} {signInfoFromLongitude(nextIng[p.planet]!.signIdx * 30 + 1, language).glyph} {signInfoFromLongitude(nextIng[p.planet]!.signIdx * 30 + 1, language).name} · {fmtIngressDate(nextIng[p.planet]!.date)}
                  </Text>
                ) : null}
              </View>
            </View>
          ))}
        </>
      ) : null}

      {retros.length ? (
        <>
          <Text style={[s.title, { fontSize: 17, marginTop: 22 }]}>℞ {tl('Retrógrados', 'Retrogrades', 'Retrógrados', 'Retrogradi')}</Text>
          <Text style={s.sub}>{tl('Quando um planeta parece andar pra trás — momento de rever, não de estrear.', 'When a planet appears to move backward — time to review, not to launch.', 'Cuando un planeta parece ir hacia atras — momento de revisar, no de estrenar.', 'Quando un pianeta sembra andare indietro — momento di rivedere, non di lanciare.')}</Text>
          {retros.map((r, i) => (
            <View key={'retro' + i} style={s.card}>
              <View style={[s.bar, { backgroundColor: r.currentlyRetro ? '#FCA5A5' : '#6B7280' }]} />
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={s.cardTitle}>{translatePlanet(r.planet)}</Text>
                <View style={s.metaRow}>
                  {r.currentlyRetro ? (
                    <Text style={[s.natTag, { color: '#FCA5A5', borderColor: '#FCA5A5' }]}>{tl('retrógrado agora', 'retrograde now', 'retrógrado ahora', 'retrogrado ora')}</Text>
                  ) : (
                    <Text style={s.date}>{tl('direto', 'direct', 'directo', 'diretto')}</Text>
                  )}
                  {r.currentlyRetro && r.end ? <Text style={s.date}>{tl('até', 'until', 'hasta', 'fino a')} {fmtIngressDate(r.end)}</Text> : null}
                  {!r.currentlyRetro && r.start ? <Text style={s.date}>{tl('próximo', 'next', 'próximo', 'prossimo')} {fmtIngressDate(r.start)}{r.end ? ` → ${fmtIngressDate(r.end)}` : ''}</Text> : null}
                </View>
              </View>
            </View>
          ))}
        </>
      ) : null}

      {eclipses.length ? (
        <>
          <Text style={[s.title, { fontSize: 17, marginTop: 22 }]}>🌘 {tl('Eclipses à frente', 'Upcoming eclipses', 'Eclipses próximos', 'Eclissi in arrivo')}</Text>
          <Text style={s.sub}>{tl('Portais de virada. O signo é do céu; a casa é sua — onde o eclipse mexe na sua vida.', 'Turning-point portals. The sign is the sky\'s; the house is yours — where the eclipse stirs your life.', 'Portales de cambio. El signo es del cielo; la casa es tuya — donde el eclipse mueve tu vida.', 'Portali di svolta. Il segno e del cielo; la casa e tua — dove l\'eclissi muove la tua vita.')}</Text>
          {eclipses.map((e, i) => {
            const sign = signInfoFromLongitude(e.longitude, language)
            const house = natalCusps ? houseFromCusps(e.longitude, natalCusps) : null
            const isSolar = e.type === 'solar'
            const typeLabel = isSolar ? tl('Eclipse solar', 'Solar eclipse', 'Eclipse solar', 'Eclissi solare') : tl('Eclipse lunar', 'Lunar eclipse', 'Eclipse lunar', 'Eclissi lunare')
            return (
              <View key={'ecl' + i} style={s.card}>
                <View style={[s.bar, { backgroundColor: isSolar ? '#FDE68A' : '#C7C9E0' }]} />
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text style={s.cardTitle}>{isSolar ? '🌑' : '🌕'} {typeLabel} · {sign.glyph} {sign.name} {Math.floor(e.longitude % 30)}°</Text>
                  <View style={s.metaRow}>
                    <Text style={s.date}>{fmtIngressDate(e.date)}</Text>
                    <Text style={[s.natTag, { color: '#9aa2b8', borderColor: '#4a4a55' }]}>{e.kind}</Text>
                    {house ? <Text style={[s.natTag, { color: '#FFD700', borderColor: '#FFD700' }]}>{tl('sua Casa', 'your House', 'tu Casa', 'tua Casa')} {house}</Text> : null}
                  </View>
                </View>
              </View>
            )
          })}
        </>
      ) : null}
    </ScrollView>
  )
}

const s = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#0F0F23', minHeight: '100%' },
  title: { color: '#FFFFFF', fontSize: 20, fontWeight: '800', marginBottom: 4 },
  sub: { color: '#9aa2b8', fontSize: 13, lineHeight: 18, marginBottom: 16 },
  empty: { color: '#9aa2b8', fontSize: 14, marginTop: 20, textAlign: 'center' },
  card: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#1C1C33', borderRadius: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', padding: 14, marginBottom: 10 },
  bar: { width: 4, alignSelf: 'stretch', borderRadius: 2 },
  cardTitle: { color: '#EDEBF7', fontSize: 15, fontWeight: '700' },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 6 },
  natTag: { fontSize: 11, fontWeight: '800', borderWidth: 1, borderRadius: 8, paddingHorizontal: 7, paddingVertical: 2 },
  date: { color: '#9aa2b8', fontSize: 12, textTransform: 'capitalize' },
  nextIng: { color: '#C7C9E0', fontSize: 12.5, marginTop: 6, lineHeight: 17 },
})
