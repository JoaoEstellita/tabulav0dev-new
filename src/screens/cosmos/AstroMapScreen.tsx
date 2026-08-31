import React, { useEffect, useMemo, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Dimensions, Modal } from 'react-native'
import Svg, { Rect, Line as SvgLine, Circle, Text as SvgText, G } from 'react-native-svg'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { useAuth } from '../../hooks/useAuth'
import { useAppLanguage } from '../../hooks/useAppLanguage'
import { useSubscriptionCheck } from '../../hooks/useSubscriptionCheck'
import UserService from '../../services/firebase/UserService'
import { resolveBirthInstant } from '../../astro/birthInstant'
import { planetaryLines, type AstroLine } from '../../astro/astrocartography'
import { WORLD_CITIES } from '../../data/worldCities'
import { astroMeaning } from '../../data/astrocartographyMeaning'
import { translatePlanet } from '../../utils/astro/pt'
import type { Planet } from '../../astro/planets'

const PL: Record<string, { g: string; c: string }> = {
  Sun: { g: '☉', c: '#FFD166' }, Moon: { g: '☽', c: '#C9D1FF' }, Mercury: { g: '☿', c: '#8ED0C0' },
  Venus: { g: '♀', c: '#FF9FC7' }, Mars: { g: '♂', c: '#FF6B6B' }, Jupiter: { g: '♃', c: '#F2B84B' },
  Saturn: { g: '♄', c: '#B0A08A' }, Uranus: { g: '♅', c: '#6FE3E1' }, Neptune: { g: '♆', c: '#7F9CF2' }, Pluto: { g: '♇', c: '#C08BE0' },
}
const angDiff = (a: number, b: number) => { let d = Math.abs(a - b) % 360; if (d > 180) d = 360 - d; return d }

export default function AstroMapScreen() {
  const navigation = useNavigation<any>()
  const { user } = useAuth()
  const { language } = useAppLanguage()
  const { subscription, isAdmin } = useSubscriptionCheck()
  const tl = (pt: string, en: string, es: string, it: string) => ({ 'pt-BR': pt, 'en-US': en, 'es-ES': es, 'it-IT': it }[language as 'pt-BR'] || pt)
  const isPremium = isAdmin || (subscription as any)?.status === 'active'

  const [loading, setLoading] = useState(true)
  const [lines, setLines] = useState<AstroLine[] | null>(null)
  const [birth, setBirth] = useState<{ lat: number; lon: number } | null>(null)
  const [sel, setSel] = useState<{ line: AstroLine; angle: 'MC' | 'IC' } | null>(null)

  useEffect(() => {
    if (!user?.uid || !isPremium) { setLoading(false); return }
    let alive = true
    ;(async () => {
      try {
        const p: any = await UserService.getUserProfile(user.uid)
        const loc = p?.birthLocation || {}
        const lat = Number(loc.latitude ?? loc.lat); const lon = Number(loc.longitude ?? loc.lng)
        if (!p?.birthDate || !p?.birthTime || !Number.isFinite(lat) || !Number.isFinite(lon)) { if (alive) setLoading(false); return }
        const inst = await resolveBirthInstant(p.birthDate, p.birthTime, lat, lon)
        if (!inst) { if (alive) setLoading(false); return }
        if (alive) { setLines(planetaryLines(inst)); setBirth({ lat, lon }) }
      } catch { /* ignora */ }
      finally { if (alive) setLoading(false) }
    })()
    return () => { alive = false }
  }, [user?.uid, isPremium])

  const W = Math.round(Dimensions.get('window').width) - 24
  const H = Math.round(W / 2)
  const xOf = (lon: number) => ((lon + 180) / 360) * W
  const yOf = (lat: number) => ((90 - lat) / 180) * H

  const nearbyCities = useMemo(() => {
    if (!sel) return []
    const lonLine = sel.angle === 'MC' ? sel.line.lonMC : sel.line.lonIC
    return WORLD_CITIES.map((c) => ({ ...c, d: angDiff(c.lon, lonLine) })).filter((c) => c.d < 5).sort((a, b) => a.d - b.d)
  }, [sel])

  if (!isPremium) {
    return (
      <View style={s.screen}>
        <Header onBack={() => navigation.goBack()} title={tl('Astro Map', 'Astro Map', 'Astro Map', 'Astro Map')} />
        <View style={s.paywall}>
          <Text style={s.paywallTitle}>{tl('Recurso Premium', 'Premium feature', 'Función Premium', 'Funzione Premium')}</Text>
          <Text style={s.paywallSub}>{tl('Veja onde no mundo o céu te favorece — suas linhas planetárias no mapa. Assine para desbloquear.', 'See where in the world the sky favors you — your planetary lines on the map. Subscribe to unlock.', 'Ve donde en el mundo el cielo te favorece — tus lineas planetarias. Suscribete.', 'Vedi dove nel mondo il cielo ti favorisce — le tue linee planetarie. Abbonati.')}</Text>
          <TouchableOpacity style={s.cta} onPress={() => navigation.navigate('Premium', { openTab: 'features' })}><Text style={s.ctaTx}>{tl('Ver planos', 'See plans', 'Ver planes', 'Vedi i piani')}</Text></TouchableOpacity>
        </View>
      </View>
    )
  }

  return (
    <View style={s.screen}>
      <Header onBack={() => navigation.goBack()} title={tl('Astro Map', 'Astro Map', 'Astro Map', 'Astro Map')} />
      <ScrollView contentContainerStyle={{ padding: 12, paddingBottom: 40 }}>
        <Text style={s.sub}>{tl('Onde cada planeta fica angular no globo. Toque numa linha para a leitura + cidades por perto. (MC = carreira/imagem · IC = raízes/lar)', 'Where each planet turns angular on the globe. Tap a line for its meaning + nearby cities. (MC = career/image · IC = roots/home)', 'Donde cada planeta se vuelve angular. Toca una linea para su significado + ciudades cercanas.', 'Dove ogni pianeta diventa angolare. Tocca una linea per il significato + citta vicine.')}</Text>

        {loading ? (
          <ActivityIndicator color="#FFD700" style={{ marginTop: 40 }} />
        ) : !lines ? (
          <Text style={s.empty}>{tl('Faltam seus dados de nascimento completos (data, hora e local).', 'Your full birth data is missing (date, time and place).', 'Faltan tus datos de nacimiento (fecha, hora y lugar).', 'Mancano i tuoi dati di nascita (data, ora e luogo).')}</Text>
        ) : (
          <>
            <View style={s.mapWrap}>
              <Svg width={W} height={H}>
                <Rect x={0} y={0} width={W} height={H} fill="#0B1020" rx={10} />
                {/* Graticule 30° */}
                {[-150, -120, -90, -60, -30, 30, 60, 90, 120, 150].map((lo) => (
                  <SvgLine key={`v${lo}`} x1={xOf(lo)} y1={0} x2={xOf(lo)} y2={H} stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
                ))}
                {[-60, -30, 30, 60].map((la) => (
                  <SvgLine key={`h${la}`} x1={0} y1={yOf(la)} x2={W} y2={yOf(la)} stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
                ))}
                <SvgLine x1={0} y1={yOf(0)} x2={W} y2={yOf(0)} stroke="rgba(255,255,255,0.16)" strokeWidth={1} />
                <SvgLine x1={xOf(0)} y1={0} x2={xOf(0)} y2={H} stroke="rgba(255,255,255,0.16)" strokeWidth={1} />

                {/* Cidades */}
                {WORLD_CITIES.map((c, i) => (
                  <Circle key={`c${i}`} cx={xOf(c.lon)} cy={yOf(c.lat)} r={1.6} fill="rgba(255,255,255,0.45)" />
                ))}

                {/* Linhas planetárias: IC tracejada (dim), MC sólida */}
                {lines.map((ln) => {
                  const col = PL[ln.planet]?.c || '#FFD700'
                  return (
                    <G key={`ic${ln.planet}`}>
                      <SvgLine x1={xOf(ln.lonIC)} y1={0} x2={xOf(ln.lonIC)} y2={H} stroke={col} strokeOpacity={0.35} strokeWidth={1.2} strokeDasharray="3,4" />
                    </G>
                  )
                })}
                {lines.map((ln) => {
                  const col = PL[ln.planet]?.c || '#FFD700'
                  return <SvgLine key={`mc${ln.planet}`} x1={xOf(ln.lonMC)} y1={0} x2={xOf(ln.lonMC)} y2={H} stroke={col} strokeWidth={1.8} />
                })}
                {/* Glifos no topo (MC) e base (IC) */}
                {lines.map((ln) => {
                  const col = PL[ln.planet]?.c || '#FFD700'
                  return (
                    <G key={`g${ln.planet}`}>
                      <SvgText x={xOf(ln.lonMC)} y={12} fill={col} fontSize={11} fontWeight="bold" textAnchor="middle">{PL[ln.planet]?.g}</SvgText>
                      <SvgText x={xOf(ln.lonIC)} y={H - 4} fill={col} fillOpacity={0.55} fontSize={10} textAnchor="middle">{PL[ln.planet]?.g}</SvgText>
                    </G>
                  )
                })}

                {/* Marcador do nascimento */}
                {birth ? <SvgText x={xOf(birth.lon)} y={yOf(birth.lat) + 4} fill="#FFD700" fontSize={13} textAnchor="middle">★</SvgText> : null}

                {/* Áreas de toque (largas) sobre cada linha MC e IC */}
                {lines.map((ln) => (
                  <G key={`t${ln.planet}`}>
                    <Rect x={xOf(ln.lonMC) - 9} y={0} width={18} height={H} fill="transparent" onPress={() => setSel({ line: ln, angle: 'MC' })} />
                    <Rect x={xOf(ln.lonIC) - 9} y={0} width={18} height={H} fill="transparent" onPress={() => setSel({ line: ln, angle: 'IC' })} />
                  </G>
                ))}
              </Svg>
            </View>

            {/* Legenda */}
            <View style={s.legend}>
              {lines.map((ln) => (
                <TouchableOpacity key={`lg${ln.planet}`} style={s.legendItem} onPress={() => setSel({ line: ln, angle: 'MC' })}>
                  <Text style={[s.legendGlyph, { color: PL[ln.planet]?.c }]}>{PL[ln.planet]?.g}</Text>
                  <Text style={s.legendTx}>{translatePlanet(ln.planet, language)}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={s.foot}>{tl('★ seu local de nascimento · linha cheia = MC · tracejada = IC', '★ your birth place · solid = MC · dashed = IC', '★ tu lugar de nacimiento · solida = MC · discontinua = IC', '★ il tuo luogo di nascita · piena = MC · tratteggiata = IC')}</Text>
          </>
        )}
      </ScrollView>

      {/* Detalhe da linha */}
      <Modal visible={!!sel} transparent animationType="slide" onRequestClose={() => setSel(null)}>
        <View style={s.sheetBack}>
          <View style={s.sheet}>
            {sel ? (() => {
              const col = PL[sel.line.planet]?.c || '#FFD700'
              const m = astroMeaning(sel.line.planet, sel.angle, language)
              return (
                <>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={[s.sheetTitle, { color: col }]}>{PL[sel.line.planet]?.g} {tl('Linha de', 'Line of', 'Linea de', 'Linea di')} {translatePlanet(sel.line.planet, language)} · {sel.angle}</Text>
                    <TouchableOpacity onPress={() => setSel(null)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}><Ionicons name="close" size={24} color="#9aa2b8" /></TouchableOpacity>
                  </View>
                  {m ? <Text style={s.sheetEssence}>{m.essence}</Text> : null}
                  {m ? <Text style={s.sheetBody}>{m.text}</Text> : null}
                  <Text style={s.sheetCities}>{tl('Cidades nesta linha', 'Cities on this line', 'Ciudades en esta linea', 'Citta su questa linea')}:</Text>
                  {nearbyCities.length ? (
                    <Text style={s.sheetCityList}>{nearbyCities.map((c) => c.name).join(' · ')}</Text>
                  ) : (
                    <Text style={s.sheetCityNone}>{tl('Nenhuma cidade da lista bem em cima — a linha passa por regiões vizinhas.', 'No listed city right on it — the line runs through nearby regions.', 'Ninguna ciudad de la lista justo encima — la linea pasa por regiones vecinas.', 'Nessuna citta della lista proprio sopra — la linea attraversa regioni vicine.')}</Text>
                  )}
                  <Text style={s.disclaimer}>{tl('Orientativo, não determinista. O céu inclina, não obriga.', 'Guidance, not fate. The sky inclines, it does not compel.', 'Orientativo, no determinista. El cielo inclina, no obliga.', 'Indicativo, non deterministico. Il cielo inclina, non obbliga.')}</Text>
                </>
              )
            })() : null}
          </View>
        </View>
      </Modal>
    </View>
  )
}

function Header({ onBack, title }: { onBack: () => void; title: string }) {
  return (
    <View style={s.head}>
      <TouchableOpacity onPress={onBack} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}><Ionicons name="chevron-back" size={26} color="#FFD700" /></TouchableOpacity>
      <Text style={s.headTitle}>🌍 {title}</Text>
      <View style={{ width: 26 }} />
    </View>
  )
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0F0F23', paddingTop: 44 },
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 14, paddingBottom: 6 },
  headTitle: { color: '#EDEBF7', fontSize: 18, fontWeight: '900' },
  sub: { color: '#9aa2b8', fontSize: 12.5, lineHeight: 18, marginBottom: 12 },
  empty: { color: '#9aa2b8', fontSize: 14, textAlign: 'center', marginTop: 40, paddingHorizontal: 20, lineHeight: 20 },
  mapWrap: { borderRadius: 10, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  legend: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 12 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#1C1C33', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  legendGlyph: { fontSize: 14, fontWeight: '900' },
  legendTx: { color: '#C7C9E0', fontSize: 12, fontWeight: '600' },
  foot: { color: '#9aa2b8', fontSize: 11.5, marginTop: 10, lineHeight: 16 },
  paywall: { margin: 20, backgroundColor: '#1C1C33', borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,215,0,0.4)', padding: 22, alignItems: 'center' },
  paywallTitle: { color: '#FFD700', fontSize: 17, fontWeight: '900' },
  paywallSub: { color: '#C7C9E0', fontSize: 13.5, lineHeight: 19, textAlign: 'center', marginTop: 10 },
  cta: { marginTop: 18, backgroundColor: '#FFD700', borderRadius: 12, paddingVertical: 12, paddingHorizontal: 28 },
  ctaTx: { color: '#0F0F23', fontWeight: '800', fontSize: 14 },
  sheetBack: { flex: 1, backgroundColor: 'rgba(8,6,18,0.7)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: '#0F0F23', borderTopLeftRadius: 22, borderTopRightRadius: 22, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', padding: 20, paddingBottom: 34 },
  sheetTitle: { fontSize: 18, fontWeight: '900', flex: 1, marginRight: 12 },
  sheetEssence: { color: '#9aa2b8', fontSize: 12.5, marginTop: 4, textTransform: 'capitalize' },
  sheetBody: { color: '#EDEBF7', fontSize: 14.5, lineHeight: 21, marginTop: 12 },
  sheetCities: { color: '#FFD700', fontSize: 12.5, fontWeight: '800', marginTop: 16, textTransform: 'uppercase', letterSpacing: 0.4 },
  sheetCityList: { color: '#C7C9E0', fontSize: 13.5, lineHeight: 20, marginTop: 4 },
  sheetCityNone: { color: '#9aa2b8', fontSize: 12.5, lineHeight: 18, marginTop: 4, fontStyle: 'italic' },
  disclaimer: { color: '#9aa2b8', fontSize: 11.5, fontStyle: 'italic', marginTop: 16, lineHeight: 16 },
})
