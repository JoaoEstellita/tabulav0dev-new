import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Modal, Share, Linking } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { useAuth } from '../../hooks/useAuth'
import { useAppLanguage } from '../../hooks/useAppLanguage'
import { getMomento, type MomentoIntention, type MomentoWindow, type MomentoReason } from '../../services/MomentoService'

/**
 * Momento Certo — astrologia eletiva pessoal ("quando agir"). Escolhe a intenção
 * e mostra as melhores janelas (dias) ranqueadas pelo motor. Premium.
 */
const C = { bg: '#0F0F23', card: '#1C1C1E', card2: '#24242e', line: 'rgba(255,255,255,0.10)', gold: '#FFD700', good: '#3ecf8e', tx: '#EDEBF7', dim: '#9aa2b8' }
const PLANET: Record<string, { g: string; pt: string; en: string; es: string; it: string }> = {
  sun: { g: '☉', pt: 'Sol', en: 'Sun', es: 'Sol', it: 'Sole' }, moon: { g: '☽', pt: 'Lua', en: 'Moon', es: 'Luna', it: 'Luna' },
  mercury: { g: '☿', pt: 'Mercúrio', en: 'Mercury', es: 'Mercurio', it: 'Mercurio' }, venus: { g: '♀', pt: 'Vênus', en: 'Venus', es: 'Venus', it: 'Venere' },
  mars: { g: '♂', pt: 'Marte', en: 'Mars', es: 'Marte', it: 'Marte' }, jupiter: { g: '♃', pt: 'Júpiter', en: 'Jupiter', es: 'Jupiter', it: 'Giove' },
  saturn: { g: '♄', pt: 'Saturno', en: 'Saturn', es: 'Saturno', it: 'Saturno' }, uranus: { g: '♅', pt: 'Urano', en: 'Uranus', es: 'Urano', it: 'Urano' },
  neptune: { g: '♆', pt: 'Netuno', en: 'Neptune', es: 'Neptuno', it: 'Nettuno' }, pluto: { g: '♇', pt: 'Plutão', en: 'Pluto', es: 'Pluton', it: 'Plutone' },
}

export default function MomentoCertoView({ premium }: { premium: boolean }) {
  const navigation = useNavigation<any>()
  const { user } = useAuth()
  const { language } = useAppLanguage()
  const lang = language as 'pt-BR' | 'en-US' | 'es-ES' | 'it-IT'
  const tl = (pt: string, en: string, es: string, it: string) => ({ 'pt-BR': pt, 'en-US': en, 'es-ES': es, 'it-IT': it }[lang] || pt)
  const [intention, setIntention] = useState<MomentoIntention>('amor')
  const [loading, setLoading] = useState(false)
  const [windows, setWindows] = useState<MomentoWindow[] | null>(null)
  const [detail, setDetail] = useState<MomentoWindow | null>(null)

  const INTENTIONS: { k: MomentoIntention; icon: string; label: string }[] = [
    { k: 'amor', icon: 'heart', label: tl('Amor', 'Love', 'Amor', 'Amore') },
    { k: 'carreira', icon: 'briefcase', label: tl('Carreira', 'Career', 'Carrera', 'Carriera') },
    { k: 'decisao', icon: 'compass', label: tl('Decisão', 'Decision', 'Decision', 'Decisione') },
    { k: 'conversa', icon: 'chatbubbles', label: tl('Conversa', 'Talk', 'Conversacion', 'Conversazione') },
  ]

  useEffect(() => {
    if (!premium || !user?.uid) return
    setLoading(true); setWindows(null)
    getMomento(user.uid, intention).then((r) => setWindows(r.windows)).finally(() => setLoading(false))
  }, [premium, user?.uid, intention])

  const planetName = (k: string) => (PLANET[k] ? PLANET[k][lang === 'pt-BR' ? 'pt' : lang === 'es-ES' ? 'es' : lang === 'it-IT' ? 'it' : 'en'] : k)
  const targetLabel = (t: string | null) => {
    if (!t) return ''
    const m = /^casa(\d+)$/.exec(t)
    if (m) return tl(`casa ${m[1]}`, `house ${m[1]}`, `casa ${m[1]}`, `casa ${m[1]}`)
    return planetName(t)
  }
  const reasonLine = (r: MomentoReason) => `${PLANET[r.planet]?.g || ''} ${planetName(r.planet)} ${r.aspect || ''} ${targetLabel(r.target)}`.replace(/\s+/g, ' ').trim()
  // Bandeira de regra clássica → texto próprio (Lua vazia / retrógrado).
  const cautionLine = (c: any): string => {
    if (c && c.code === 'moonVoid') return tl('Lua fora de curso (evite começar algo novo)', 'Void-of-course Moon (avoid starting anything new)', 'Luna fuera de curso (evita empezar algo nuevo)', 'Luna fuori corso (evita di iniziare qualcosa)')
    if (c && c.code === 'retro') return `${planetName(c.planet)} ${tl('retrógrado', 'retrograde', 'retrogrado', 'retrogrado')}`
    return reasonLine(c)
  }

  const fmtDate = (iso: string) => {
    const d = new Date(iso + 'T12:00:00')
    return d.toLocaleDateString(lang, { weekday: 'short', day: '2-digit', month: 'short' })
  }
  // Faixa de hora (instante UTC) formatada no fuso do aparelho.
  const fmtHour = (iso: string) => new Date(iso).toLocaleTimeString(lang, { hour: '2-digit', minute: '2-digit' })

  const intentionLabel = INTENTIONS.find((x) => x.k === intention)?.label || ''
  const winTitle = tl('Momento Certo', 'Right Moment', 'Momento Justo', 'Momento Giusto') + ' · ' + intentionLabel
  const shareWindow = (w: MomentoWindow) => {
    const hour = w.hourFromISO && w.hourToISO ? ` ${fmtHour(w.hourFromISO)}–${fmtHour(w.hourToISO)}` : ''
    const why = w.reasons.length ? ' — ' + w.reasons.map(reasonLine).join('; ') : ''
    Share.share({ message: `${winTitle}: ${fmtDate(w.dateISO)}${hour}${why}` }).catch(() => {})
  }
  const addToCalendar = (w: MomentoWindow) => {
    const dt = (iso: string) => new Date(iso).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
    let dates: string
    if (w.hourFromISO && w.hourToISO) dates = `${dt(w.hourFromISO)}/${dt(w.hourToISO)}`
    else {
      const d = w.dateISO.replace(/-/g, '')
      const nx = new Date(w.dateISO + 'T00:00:00Z'); nx.setUTCDate(nx.getUTCDate() + 1)
      dates = `${d}/${nx.toISOString().slice(0, 10).replace(/-/g, '')}`
    }
    const details = w.reasons.map(reasonLine).join('. ')
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(winTitle)}&dates=${dates}&details=${encodeURIComponent(details)}`
    Linking.openURL(url).catch(() => {})
  }
  const scoreColor = (s: number) => (s >= 70 ? C.good : s >= 50 ? C.gold : C.dim)

  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
      <View style={s.hero}>
        <Text style={s.heroKicker}>⭐ {tl('MOMENTO CERTO', 'RIGHT MOMENT', 'MOMENTO JUSTO', 'MOMENTO GIUSTO')}</Text>
        <Text style={s.heroTitle}>{tl('Quando agir', 'When to act', 'Cuando actuar', 'Quando agire')}</Text>
        <Text style={s.heroSub}>{tl('Escolha uma intenção e veja os melhores dias — em que o céu te apoia para aquilo.', 'Pick an intention and see the best days — when the sky supports you for it.', 'Elige una intencion y ve los mejores dias — cuando el cielo te apoya.', 'Scegli un\'intenzione e vedi i giorni migliori — quando il cielo ti sostiene.')}</Text>
      </View>

      <View style={s.grid}>
        {INTENTIONS.map((it) => {
          const on = intention === it.k
          return (
            <TouchableOpacity key={it.k} style={[s.card, on && s.cardOn]} activeOpacity={0.85} onPress={() => setIntention(it.k)}>
              <Ionicons name={it.icon as any} size={20} color={on ? '#0F0F23' : C.gold} />
              <Text style={[s.cardTx, on && s.cardTxOn]}>{it.label}</Text>
            </TouchableOpacity>
          )
        })}
      </View>

      {!premium ? (
        <TouchableOpacity style={s.paywall} activeOpacity={0.9} onPress={() => navigation.navigate('Premium', { openTab: 'features' })}>
          <Text style={s.paywallTitle}>{tl('Recurso Premium', 'Premium feature', 'Funcion Premium', 'Funzione Premium')}</Text>
          <Text style={s.paywallSub}>{tl('Descubra os melhores dias para amor, carreira e decisões. Assine para desbloquear.', 'Discover the best days for love, career and decisions. Subscribe to unlock.', 'Descubre los mejores dias para amor, carrera y decisiones. Suscribete.', 'Scopri i giorni migliori per amore, carriera e decisioni. Abbonati.')}</Text>
          <View style={s.paywallCta}><Text style={s.paywallCtaTx}>{tl('Ver planos', 'See plans', 'Ver planes', 'Vedi i piani')}</Text></View>
        </TouchableOpacity>
      ) : loading ? (
        <ActivityIndicator color={C.gold} style={{ marginTop: 30 }} />
      ) : !windows || windows.length === 0 ? (
        <View style={s.soon}><Ionicons name="planet-outline" size={26} color={C.dim} /><Text style={s.soonTx}>{tl('Sem janelas fortes no período. Tente outra intenção.', 'No strong windows in this period. Try another intention.', 'Sin ventanas fuertes en el periodo. Prueba otra intencion.', 'Nessuna finestra forte nel periodo. Prova un\'altra intenzione.')}</Text></View>
      ) : (
        <View style={{ marginTop: 18, gap: 10 }}>
          <Text style={s.label}>{tl('Melhores dias', 'Best days', 'Mejores dias', 'Giorni migliori')}</Text>
          {windows.map((w, i) => (
            <TouchableOpacity key={w.dateISO + i} style={s.win} activeOpacity={0.85} onPress={() => setDetail(w)}>
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={s.winDate}>{i === 0 ? '⭐ ' : ''}{fmtDate(w.dateISO)}</Text>
                {w.hourFromISO && w.hourToISO ? <Text style={s.winHour}>🕐 {fmtHour(w.hourFromISO)}–{fmtHour(w.hourToISO)}</Text> : null}
                {w.reasons.map((r, j) => <Text key={'r' + j} style={s.winReason}>✨ {reasonLine(r)}</Text>)}
                {w.cautions.map((c, j) => <Text key={'c' + j} style={s.winCaution}>⚠️ {cautionLine(c)}</Text>)}
              </View>
              <View style={[s.ring, { borderColor: scoreColor(w.score) }]}>
                <Text style={[s.ringTx, { color: scoreColor(w.score) }]}>{w.score}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={C.dim} />
            </TouchableOpacity>
          ))}
          <Text style={s.disclaimer}>{tl('Leitura orientativa, não determinista. As janelas apoiam — a escolha é sua.', 'Guidance, not fate. Windows support you — the choice is yours.', 'Orientativo, no determinista. Las ventanas apoyan — la eleccion es tuya.', 'Indicativo, non deterministico. Le finestre sostengono — la scelta e tua.')}</Text>
        </View>
      )}

      {/* Detalhe da janela + ações */}
      <Modal visible={!!detail} transparent animationType="slide" onRequestClose={() => setDetail(null)}>
        <View style={s.sheetBack}>
          <View style={s.sheet}>
            {detail ? (
              <>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Text style={s.sheetTitle}>{intentionLabel}</Text>
                  <TouchableOpacity onPress={() => setDetail(null)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}><Ionicons name="close" size={24} color={C.dim} /></TouchableOpacity>
                </View>
                <Text style={s.sheetDate}>{fmtDate(detail.dateISO)}</Text>
                {detail.hourFromISO && detail.hourToISO ? <Text style={s.sheetHour}>🕐 {fmtHour(detail.hourFromISO)}–{fmtHour(detail.hourToISO)}</Text> : null}
                <View style={{ marginTop: 12 }}>
                  {detail.reasons.map((r, j) => <Text key={'dr' + j} style={s.winReason}>✨ {reasonLine(r)}</Text>)}
                  {detail.cautions.map((c, j) => <Text key={'dc' + j} style={s.winCaution}>⚠️ {cautionLine(c)}</Text>)}
                </View>
                <View style={{ flexDirection: 'row', gap: 10, marginTop: 20 }}>
                  <TouchableOpacity style={[s.act, { backgroundColor: C.gold }]} onPress={() => detail && addToCalendar(detail)}>
                    <Ionicons name="calendar-outline" size={16} color="#0F0F23" /><Text style={s.actTx}>{tl('Calendário', 'Calendar', 'Calendario', 'Calendario')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[s.act, { backgroundColor: C.card2, borderWidth: 1, borderColor: C.line }]} onPress={() => detail && shareWindow(detail)}>
                    <Ionicons name="share-social-outline" size={16} color={C.tx} /><Text style={[s.actTx, { color: C.tx }]}>{tl('Compartilhar', 'Share', 'Compartir', 'Condividi')}</Text>
                  </TouchableOpacity>
                </View>
                <Text style={s.disclaimer}>{tl('Orientativo, não determinista. A escolha é sua.', 'Guidance, not fate. The choice is yours.', 'Orientativo, no determinista. La eleccion es tuya.', 'Indicativo, non deterministico. La scelta e tua.')}</Text>
              </>
            ) : null}
          </View>
        </View>
      </Modal>
    </ScrollView>
  )
}

const s = StyleSheet.create({
  hero: { marginBottom: 16 },
  heroKicker: { color: C.gold, fontSize: 11, fontWeight: '800', letterSpacing: 1.2 },
  heroTitle: { color: C.tx, fontSize: 24, fontWeight: '900', marginTop: 4 },
  heroSub: { color: C.dim, fontSize: 13.5, lineHeight: 19, marginTop: 8 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  card: { width: '47%', flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: C.card, borderRadius: 14, borderWidth: 1, borderColor: C.line, padding: 13 },
  cardOn: { backgroundColor: C.gold, borderColor: C.gold },
  cardTx: { color: C.tx, fontSize: 14, fontWeight: '700' },
  cardTxOn: { color: '#0F0F23', fontWeight: '800' },
  label: { color: C.tx, fontSize: 14, fontWeight: '800' },
  win: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: C.card, borderRadius: 14, borderWidth: 1, borderColor: C.line, padding: 14 },
  winDate: { color: C.tx, fontSize: 15, fontWeight: '800', textTransform: 'capitalize' },
  winHour: { color: C.good, fontSize: 13, fontWeight: '800', marginTop: 3 },
  winReason: { color: C.dim, fontSize: 13, lineHeight: 18, marginTop: 3 },
  winCaution: { color: C.gold, fontSize: 12.5, lineHeight: 18, marginTop: 2 },
  ring: { width: 46, height: 46, borderRadius: 23, borderWidth: 2.5, alignItems: 'center', justifyContent: 'center' },
  ringTx: { fontSize: 16, fontWeight: '900' },
  disclaimer: { color: C.dim, fontSize: 11.5, fontStyle: 'italic', marginTop: 8, lineHeight: 16 },
  soon: { alignItems: 'center', gap: 10, backgroundColor: C.card, borderRadius: 16, borderWidth: 1, borderColor: C.line, padding: 24, marginTop: 22 },
  soonTx: { color: C.dim, fontSize: 14, textAlign: 'center', lineHeight: 20 },
  paywall: { backgroundColor: C.card, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,215,0,0.4)', padding: 20, marginTop: 22, alignItems: 'center' },
  paywallTitle: { color: C.gold, fontSize: 16, fontWeight: '900' },
  paywallSub: { color: C.dim, fontSize: 13.5, lineHeight: 19, textAlign: 'center', marginTop: 8 },
  paywallCta: { marginTop: 16, backgroundColor: C.gold, borderRadius: 12, paddingVertical: 12, paddingHorizontal: 26 },
  paywallCtaTx: { color: '#0F0F23', fontWeight: '800', fontSize: 14 },
  sheetBack: { flex: 1, backgroundColor: 'rgba(8,6,18,0.7)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: C.bg, borderTopLeftRadius: 22, borderTopRightRadius: 22, borderWidth: 1, borderColor: C.line, padding: 20, paddingBottom: 34 },
  sheetTitle: { color: C.gold, fontSize: 13, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 0.5 },
  sheetDate: { color: C.tx, fontSize: 22, fontWeight: '900', marginTop: 6, textTransform: 'capitalize' },
  sheetHour: { color: C.good, fontSize: 15, fontWeight: '800', marginTop: 4 },
  act: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 12, paddingVertical: 13 },
  actTx: { color: '#0F0F23', fontSize: 14, fontWeight: '800' },
})
