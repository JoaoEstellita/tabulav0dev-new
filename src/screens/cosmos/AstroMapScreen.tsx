import React, { useEffect, useMemo, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Dimensions, Modal, Image } from 'react-native'
import Svg, { Rect, Line as SvgLine, Circle, Text as SvgText, G, Polyline, Image as SvgImage } from 'react-native-svg'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { useAuth } from '../../hooks/useAuth'
import { useAppLanguage } from '../../hooks/useAppLanguage'
import { useSubscriptionCheck } from '../../hooks/useSubscriptionCheck'
import UserService from '../../services/firebase/UserService'
import { resolveBirthInstant } from '../../astro/birthInstant'
import { planetaryLines, horizonCurves, type AstroLine, type HorizonCurve, type Pt } from '../../astro/astrocartography'
import { WORLD_CITIES } from '../../data/worldCities'
import { astroMeaning } from '../../data/astrocartographyMeaning'
import { translatePlanet } from '../../utils/astro/pt'
import { useTourAnchor } from '../../tour/TourProvider'
import type { Planet } from '../../astro/planets'

const PL: Record<string, { g: string; c: string }> = {
  Sun: { g: '☉', c: '#FFD166' }, Moon: { g: '☽', c: '#C9D1FF' }, Mercury: { g: '☿', c: '#8ED0C0' },
  Venus: { g: '♀', c: '#FF9FC7' }, Mars: { g: '♂', c: '#FF6B6B' }, Jupiter: { g: '♃', c: '#F2B84B' },
  Saturn: { g: '♄', c: '#B0A08A' }, Uranus: { g: '♅', c: '#6FE3E1' }, Neptune: { g: '♆', c: '#7F9CF2' }, Pluto: { g: '♇', c: '#C08BE0' },
}
const WORLD_MAP = require('../../../assets/astromap-world.png')
const angDiff = (a: number, b: number) => { let d = Math.abs(a - b) % 360; if (d > 180) d = 360 - d; return d }
// Cidades-âncora rotuladas no mapa (bem espalhadas) — dão orientação sem continentes.
const ANCHORS = new Set(['São Paulo', 'Nova York', 'Los Angeles', 'Cidade do México', 'Londres', 'Lisboa', 'Roma', 'Cairo', 'Dubai', 'Mumbai', 'Tóquio', 'Sydney', 'Joanesburgo', 'Bangkok'])

// Quebra a polilinha da curva quando a longitude "salta" o meridiano ±180 (senão
// desenha um traço horizontal atravessando o mapa inteiro). Retorna strings de pontos.
function polySegments(pts: Pt[], xOf: (lon: number) => number, yOf: (lat: number) => number): string[] {
  const out: string[] = []
  let cur: string[] = []
  let prevLon: number | null = null
  for (const p of pts) {
    if (prevLon != null && Math.abs(p.lon - prevLon) > 180) { if (cur.length > 1) out.push(cur.join(' ')); cur = [] }
    cur.push(`${xOf(p.lon).toFixed(1)},${yOf(p.lat).toFixed(1)}`)
    prevLon = p.lon
  }
  if (cur.length > 1) out.push(cur.join(' '))
  return out
}

export function AstroMapView() {
  const navigation = useNavigation<any>()
  const { user } = useAuth()
  const { language } = useAppLanguage()
  const { subscription, isAdmin } = useSubscriptionCheck()
  const tl = (pt: string, en: string, es: string, it: string) => ({ 'pt-BR': pt, 'en-US': en, 'es-ES': es, 'it-IT': it }[language as 'pt-BR'] || pt)
  const isPremium = isAdmin || (subscription as any)?.status === 'active'

  const [loading, setLoading] = useState(true)
  const [natalInst, setNatalInst] = useState<Date | null>(null)
  const [mode, setMode] = useState<'natal' | 'today'>('natal') // natal (você) x céu de hoje (coletivo)
  const [birth, setBirth] = useState<{ lat: number; lon: number } | null>(null)
  const [focus, setFocus] = useState<string | null>(null) // planeta isolado (mostra ASC/DSC)
  const [sel, setSel] = useState<{ planet: string; angle: 'MC' | 'IC' | 'ASC' | 'DSC' } | null>(null)
  const aIntents = useTourAnchor('astromap.intents')
  const aMap = useTourAnchor('astromap.map')
  const aLegend = useTourAnchor('astromap.legend')

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
        if (alive) { setNatalInst(inst || null); setBirth({ lat, lon }) }
      } catch { /* ignora */ }
      finally { if (alive) setLoading(false) }
    })()
    return () => { alive = false }
  }, [user?.uid, isPremium])

  // Linhas do modo escolhido: natal (instante do nascimento) ou céu de HOJE (coletivo).
  const lines = useMemo<AstroLine[] | null>(() => {
    if (mode === 'today') return planetaryLines(new Date())
    return natalInst ? planetaryLines(natalInst) : null
  }, [mode, natalInst])
  const curves = useMemo<HorizonCurve[] | null>(() => {
    if (mode === 'today') return horizonCurves(new Date())
    return natalInst ? horizonCurves(natalInst) : null
  }, [mode, natalInst])

  const W = Math.round(Dimensions.get('window').width) - 24
  const H = Math.round(W / 2)
  const xOf = (lon: number) => ((lon + 180) / 360) * W
  const yOf = (lat: number) => ((90 - lat) / 180) * H

  const byLine = useMemo(() => Object.fromEntries((lines || []).map((l) => [l.planet, l])), [lines])
  const byCurve = useMemo(() => Object.fromEntries((curves || []).map((c) => [c.planet, c])), [curves])

  // Longitude da curva (ASC/DSC) na latitude mais próxima de `lat`. null se fora.
  const curveLonAtLat = (pts: Pt[], lat: number): number | null => {
    if (!pts.length) return null
    let best: Pt | null = null; let bd = 999
    for (const p of pts) { const d = Math.abs(p.lat - lat); if (d < bd) { bd = d; best = p } }
    return best && bd <= 4 ? best.lon : null
  }

  const nearbyCities = useMemo(() => {
    if (!sel) return []
    if (sel.angle === 'MC' || sel.angle === 'IC') {
      const ln = byLine[sel.planet]; if (!ln) return []
      const lonLine = sel.angle === 'MC' ? ln.lonMC : ln.lonIC
      return WORLD_CITIES.map((c) => ({ ...c, d: angDiff(c.lon, lonLine) })).filter((c) => c.d < 5).sort((a, b) => a.d - b.d)
    }
    const cv = byCurve[sel.planet]; if (!cv) return []
    const pts = sel.angle === 'ASC' ? cv.asc : cv.dsc
    return WORLD_CITIES.map((c) => {
      const lonAt = curveLonAtLat(pts, c.lat)
      return lonAt == null ? null : { ...c, d: angDiff(c.lon, lonAt) }
    }).filter((c): c is any => !!c && c.d < 5).sort((a, b) => a.d - b.d)
  }, [sel, byLine, byCurve])

  if (!isPremium) {
    return (
      <View style={s.screen}>
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
      <ScrollView contentContainerStyle={{ padding: 12, paddingBottom: 40 }}>
        {/* Toggle: Meu mapa (natal) x Céu de hoje (trânsitos, coletivo) */}
        <View style={s.modeToggle}>
          <TouchableOpacity style={[s.modeBtn, mode === 'natal' && s.modeBtnOn]} onPress={() => setMode('natal')}>
            <Text style={[s.modeTx, mode === 'natal' && s.modeTxOn]}>{tl('Meu mapa', 'My chart', 'Mi carta', 'La mia carta')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[s.modeBtn, mode === 'today' && s.modeBtnOn]} onPress={() => setMode('today')}>
            <Text style={[s.modeTx, mode === 'today' && s.modeTxOn]}>{tl('Céu de hoje', 'Today\'s sky', 'Cielo de hoy', 'Cielo di oggi')}</Text>
          </TouchableOpacity>
        </View>
        <Text style={s.sub}>
          {mode === 'today'
            ? tl('Onde o CÉU DE HOJE está forte no mundo (coletivo, muda a cada dia). Toque numa linha para a leitura.', 'Where TODAY\'S SKY is strong worldwide (collective, changes daily). Tap a line for its meaning.', 'Donde el CIELO DE HOY esta fuerte (colectivo, cambia cada dia). Toca una linea.', 'Dove il CIELO DI OGGI e forte (collettivo, cambia ogni giorno). Tocca una linea.')
            : tl('Onde cada planeta do SEU mapa fica angular no globo. Toque numa linha para a leitura + cidades por perto. (MC = carreira/imagem · IC = raízes/lar)', 'Where each planet of YOUR chart turns angular. Tap a line for its meaning + nearby cities. (MC = career · IC = home)', 'Donde cada planeta de TU carta se vuelve angular. Toca una linea + ciudades cercanas.', 'Dove ogni pianeta della TUA carta diventa angolare. Tocca una linea + citta vicine.')}
        </Text>

        {/* Atalhos por área da vida → foca o planeta e abre a leitura mais relevante */}
        {lines && !loading ? (
          <View style={s.intentRow} {...aIntents}>
            {([
              ['❤️', tl('Amor', 'Love', 'Amor', 'Amore'), 'Venus', 'DSC'],
              ['💼', tl('Carreira', 'Career', 'Carrera', 'Carriera'), 'Sun', 'MC'],
              ['🍀', tl('Prosperar', 'Thrive', 'Prosperar', 'Prosperare'), 'Jupiter', 'MC'],
              ['🏡', tl('Lar', 'Home', 'Hogar', 'Casa'), 'Moon', 'IC'],
              ['🗣️', tl('Comunicação', 'Communication', 'Comunicacion', 'Comunicazione'), 'Mercury', 'MC'],
              ['🔥', tl('Vitalidade', 'Vitality', 'Vitalidad', 'Vitalita'), 'Mars', 'ASC'],
              ['🔮', tl('Espírito', 'Spirit', 'Espiritu', 'Spirito'), 'Neptune', 'ASC'],
              ['🦋', tl('Transformação', 'Transformation', 'Transformacion', 'Trasformazione'), 'Pluto', 'MC'],
            ] as const).map(([emo, lbl, pl, ang]) => (
              <TouchableOpacity key={lbl} style={s.intentChip} onPress={() => { setFocus(pl); setSel({ planet: pl, angle: ang as any }) }}>
                <Text style={s.intentTx}>{emo} {lbl}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : null}

        {loading ? (
          <ActivityIndicator color="#FFD700" style={{ marginTop: 40 }} />
        ) : !lines ? (
          <Text style={s.empty}>{tl('Faltam seus dados de nascimento completos (data, hora e local).', 'Your full birth data is missing (date, time and place).', 'Faltan tus datos de nacimiento (fecha, hora y lugar).', 'Mancano i tuoi dati di nascita (data, ora e luogo).')}</Text>
        ) : (
          <>
            <View style={[s.mapWrap, { width: W, height: H }]} {...aMap}>
              <Svg width={W} height={H}>
                {/* mapa-múndi DENTRO do SVG (1º elemento = atrás de tudo); linhas por cima */}
                <SvgImage href={WORLD_MAP} x={0} y={0} width={W} height={H} preserveAspectRatio="none" />
                {/* Graticule 30° */}
                {[-150, -120, -90, -60, -30, 30, 60, 90, 120, 150].map((lo) => (
                  <SvgLine key={`v${lo}`} x1={xOf(lo)} y1={0} x2={xOf(lo)} y2={H} stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
                ))}
                {[-60, -30, 30, 60].map((la) => (
                  <SvgLine key={`h${la}`} x1={0} y1={yOf(la)} x2={W} y2={yOf(la)} stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
                ))}
                <SvgLine x1={0} y1={yOf(0)} x2={W} y2={yOf(0)} stroke="rgba(255,255,255,0.16)" strokeWidth={1} />
                <SvgLine x1={xOf(0)} y1={0} x2={xOf(0)} y2={H} stroke="rgba(255,255,255,0.16)" strokeWidth={1} />

                {/* Labels de longitude (orientação) */}
                {[-120, -60, 0, 60, 120].map((lo) => (
                  <SvgText key={`xl${lo}`} x={xOf(lo)} y={H - 2} fill="rgba(255,255,255,0.3)" fontSize={7} textAnchor="middle">{lo === 0 ? '0°' : `${lo > 0 ? '+' : ''}${lo}`}</SvgText>
                ))}
                {/* Cidades — âncoras rotuladas p/ dar orientação (sem continentes) */}
                {WORLD_CITIES.map((c, i) => {
                  const anchor = ANCHORS.has(c.name)
                  return (
                    <G key={`c${i}`}>
                      <Circle cx={xOf(c.lon)} cy={yOf(c.lat)} r={anchor ? 2 : 1.4} fill={anchor ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.4)'} />
                      {anchor ? <SvgText x={xOf(c.lon) + 3} y={yOf(c.lat) + 2.5} fill="rgba(255,255,255,0.65)" fontSize={6.5}>{c.name}</SvgText> : null}
                    </G>
                  )
                })}

                {/* Faixas de influência (power zones) do planeta FOCADO: ±~4° em volta da MC/IC */}
                {focus && byLine[focus] ? (() => {
                  const ln = byLine[focus]; const col = PL[focus]?.c || '#FFD700'; const bw = (8 / 360) * W
                  return (
                    <G>
                      <Rect x={xOf(ln.lonMC) - bw / 2} y={0} width={bw} height={H} fill={col} fillOpacity={0.1} />
                      <Rect x={xOf(ln.lonIC) - bw / 2} y={0} width={bw} height={H} fill={col} fillOpacity={0.06} />
                    </G>
                  )
                })() : null}

                {/* ASC/DSC do planeta FOCADO (curvas) — só uma por vez p/ não poluir */}
                {focus && byCurve[focus] ? (['asc', 'dsc'] as const).map((k) => {
                  const col = PL[focus]?.c || '#FFD700'
                  const segs = polySegments((byCurve[focus] as HorizonCurve)[k], xOf, yOf)
                  return segs.map((pointsStr, si) => (
                    <Polyline key={`${k}${si}`} points={pointsStr} fill="none" stroke={col} strokeWidth={k === 'asc' ? 1.6 : 1.4} strokeOpacity={k === 'asc' ? 0.9 : 0.55} strokeDasharray={k === 'dsc' ? '2,3' : undefined} />
                  ))
                }) : null}

                {/* Linhas MC/IC (todas). Escurece as não-focadas quando há foco. */}
                {lines.map((ln) => {
                  const col = PL[ln.planet]?.c || '#FFD700'
                  const dim = focus && ln.planet !== focus
                  const op = dim ? 0.18 : 1
                  return (
                    <G key={`l${ln.planet}`}>
                      <SvgLine x1={xOf(ln.lonIC)} y1={0} x2={xOf(ln.lonIC)} y2={H} stroke={col} strokeOpacity={0.35 * op} strokeWidth={1.2} strokeDasharray="3,4" />
                      <SvgLine x1={xOf(ln.lonMC)} y1={0} x2={xOf(ln.lonMC)} y2={H} stroke={col} strokeOpacity={op} strokeWidth={1.8} />
                      <SvgText x={xOf(ln.lonMC)} y={12} fill={col} fillOpacity={op} fontSize={11} fontWeight="bold" textAnchor="middle">{PL[ln.planet]?.g}</SvgText>
                      <SvgText x={xOf(ln.lonIC)} y={H - 4} fill={col} fillOpacity={0.55 * op} fontSize={10} textAnchor="middle">{PL[ln.planet]?.g}</SvgText>
                    </G>
                  )
                })}

                {/* Marcador do nascimento — só no modo natal (no "céu de hoje" não faz sentido) */}
                {birth && mode === 'natal' ? <SvgText x={xOf(birth.lon)} y={yOf(birth.lat) + 4} fill="#FFD700" fontSize={13} textAnchor="middle">★</SvgText> : null}

                {/* Áreas de toque sobre cada linha MC e IC */}
                {lines.map((ln) => (
                  <G key={`t${ln.planet}`}>
                    <Rect x={xOf(ln.lonMC) - 9} y={0} width={18} height={H} fill="transparent" onPress={() => setSel({ planet: ln.planet, angle: 'MC' })} />
                    <Rect x={xOf(ln.lonIC) - 9} y={0} width={18} height={H} fill="transparent" onPress={() => setSel({ planet: ln.planet, angle: 'IC' })} />
                  </G>
                ))}
              </Svg>
            </View>

            {/* Legenda — toque num planeta para ISOLAR e ver as 4 linhas (MC/IC/ASC/DSC). */}
            <Text style={s.hint}>{tl('Toque num planeta para ver as 4 linhas dele:', 'Tap a planet to see its 4 lines:', 'Toca un planeta para ver sus 4 lineas:', 'Tocca un pianeta per vedere le sue 4 linee:')}</Text>
            <View style={s.legend} {...aLegend}>
              {lines.map((ln) => (
                <TouchableOpacity key={`lg${ln.planet}`} style={[s.legendItem, focus === ln.planet && s.legendItemOn]} onPress={() => setFocus(focus === ln.planet ? null : ln.planet)}>
                  <Text style={[s.legendGlyph, { color: PL[ln.planet]?.c }]}>{PL[ln.planet]?.g}</Text>
                  <Text style={s.legendTx}>{translatePlanet(ln.planet, language)}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Ângulos do planeta focado → leitura */}
            {focus ? (
              <View style={s.angles}>
                <Text style={s.anglesTitle}>{translatePlanet(focus, language)}:</Text>
                {(['MC', 'IC', 'ASC', 'DSC'] as const).map((ang) => (
                  <TouchableOpacity key={ang} style={s.angleChip} onPress={() => setSel({ planet: focus, angle: ang })}>
                    <Text style={s.angleChipTx}>{ang}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : null}

            <Text style={s.foot}>{tl('★ nascimento · MC (carreira) cheia · IC (lar) tracejada · ASC (você)/DSC (relações) só no planeta focado', '★ birth · MC (career) solid · IC (home) dashed · ASC (self)/DSC (relationships) show for the focused planet', '★ nacimiento · MC solida · IC discontinua · ASC/DSC solo en el planeta enfocado', '★ nascita · MC piena · IC tratteggiata · ASC/DSC solo sul pianeta focalizzato')}</Text>
          </>
        )}
      </ScrollView>

      {/* Detalhe da linha */}
      <Modal visible={!!sel} transparent animationType="slide" onRequestClose={() => setSel(null)}>
        <View style={s.sheetBack}>
          <View style={s.sheet}>
            {sel ? (() => {
              const col = PL[sel.planet]?.c || '#FFD700'
              const m = astroMeaning(sel.planet, sel.angle, language)
              return (
                <>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={[s.sheetTitle, { color: col }]}>{PL[sel.planet]?.g} {tl('Linha de', 'Line of', 'Linea de', 'Linea di')} {translatePlanet(sel.planet, language)} · {sel.angle}</Text>
                    <TouchableOpacity onPress={() => setSel(null)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}><Ionicons name="close" size={24} color="#9aa2b8" /></TouchableOpacity>
                  </View>
                  {m ? <Text style={s.sheetEssence}>{m.essence}</Text> : null}
                  {mode === 'today' ? (
                    <Text style={s.sheetCollective}>{tl('☁️ Linha do céu de HOJE — vale para todo mundo hoje (coletivo), não é do seu mapa. Ali o tema deste planeta está acentuado no mundo.', '☁️ TODAY\'S sky line — it applies to everyone today (collective), not your chart. There this planet\'s theme is heightened worldwide.', '☁️ Linea del cielo de HOY — vale para todos hoy (colectivo), no es de tu carta.', '☁️ Linea del cielo di OGGI — vale per tutti oggi (collettivo), non della tua carta.')}</Text>
                  ) : null}
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
  screen: { flex: 1, backgroundColor: '#0F0F23' },
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 14, paddingBottom: 6 },
  headTitle: { color: '#EDEBF7', fontSize: 18, fontWeight: '900' },
  sub: { color: '#9aa2b8', fontSize: 12.5, lineHeight: 18, marginBottom: 12 },
  empty: { color: '#9aa2b8', fontSize: 14, textAlign: 'center', marginTop: 40, paddingHorizontal: 20, lineHeight: 20 },
  mapWrap: { borderRadius: 10, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  modeToggle: { flexDirection: 'row', gap: 6, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 12, padding: 4, marginBottom: 10 },
  modeBtn: { flex: 1, paddingVertical: 8, borderRadius: 9, alignItems: 'center' },
  modeBtnOn: { backgroundColor: '#FFD700' },
  modeTx: { color: '#C7C9E0', fontSize: 13, fontWeight: '800' },
  modeTxOn: { color: '#0F0F23' },
  intentRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  intentChip: { backgroundColor: '#1F1F3D', borderRadius: 10, borderWidth: 1, borderColor: 'rgba(255,215,0,0.3)', paddingHorizontal: 12, paddingVertical: 7 },
  intentTx: { color: '#EDEBF7', fontSize: 13, fontWeight: '700' },
  hint: { color: '#9aa2b8', fontSize: 12, marginTop: 12, marginBottom: 6, fontStyle: 'italic' },
  legend: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#1C1C33', borderRadius: 8, borderWidth: 1, borderColor: 'transparent', paddingHorizontal: 8, paddingVertical: 4 },
  legendItemOn: { borderColor: '#FFD700', backgroundColor: '#26264a' },
  angles: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  anglesTitle: { color: '#EDEBF7', fontSize: 13, fontWeight: '800' },
  angleChip: { backgroundColor: '#1F1F3D', borderRadius: 8, borderWidth: 1, borderColor: 'rgba(255,215,0,0.35)', paddingHorizontal: 12, paddingVertical: 6 },
  angleChipTx: { color: '#FFD700', fontSize: 13, fontWeight: '800' },
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
  sheetCollective: { color: '#7F9CF2', fontSize: 12.5, lineHeight: 18, marginTop: 10, fontStyle: 'italic' },
  sheetBody: { color: '#EDEBF7', fontSize: 14.5, lineHeight: 21, marginTop: 12 },
  sheetCities: { color: '#FFD700', fontSize: 12.5, fontWeight: '800', marginTop: 16, textTransform: 'uppercase', letterSpacing: 0.4 },
  sheetCityList: { color: '#C7C9E0', fontSize: 13.5, lineHeight: 20, marginTop: 4 },
  sheetCityNone: { color: '#9aa2b8', fontSize: 12.5, lineHeight: 18, marginTop: 4, fontStyle: 'italic' },
  disclaimer: { color: '#9aa2b8', fontSize: 11.5, fontStyle: 'italic', marginTop: 16, lineHeight: 16 },
})
