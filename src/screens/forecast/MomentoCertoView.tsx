import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Modal, Switch, Linking } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { useAuth } from '../../hooks/useAuth'
import { useAppLanguage } from '../../hooks/useAppLanguage'
import { getMomento, getMomentoOverview, getMomentoPair, setMomentoAlert, type MomentoIntention, type MomentoOverview, type MomentoWindow, type MomentoReason } from '../../services/MomentoService'
import { listConnections, type Connection } from '../../services/ConnectionsService'
import { useTourAnchor } from '../../tour/TourProvider'

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

export default function MomentoCertoView({ premium, initialIntention }: { premium: boolean; initialIntention?: MomentoIntention }) {
  const navigation = useNavigation<any>()
  const { user } = useAuth()
  const { language } = useAppLanguage()
  const lang = language as 'pt-BR' | 'en-US' | 'es-ES' | 'it-IT'
  const tl = (pt: string, en: string, es: string, it: string) => ({ 'pt-BR': pt, 'en-US': en, 'es-ES': es, 'it-IT': it }[lang] || pt)
  const [intention, setIntention] = useState<MomentoIntention>(initialIntention || 'amor')
  // Chegou de um card de área (deep-link com intenção) → seleciona ela.
  useEffect(() => { if (initialIntention) setIntention(initialIntention) }, [initialIntention])
  const [loading, setLoading] = useState(false)
  const [windows, setWindows] = useState<MomentoWindow[] | null>(null)
  const [detail, setDetail] = useState<MomentoWindow | null>(null)
  const [alertOn, setAlertOn] = useState(false)
  const [alertBusy, setAlertBusy] = useState(false)
  // Resumo "melhor dia por intenção" (as 8 de uma vez) + horizonte ajustável.
  const [overview, setOverview] = useState<MomentoOverview | null>(null)
  const [horizon, setHorizon] = useState<15 | 30 | 45>(45)
  // "Pra vocês dois": conexões aceitas + parceiro escolhido + janelas do par.
  const [conns, setConns] = useState<Connection[]>([])
  const [pickerOpen, setPickerOpen] = useState(false)
  const [pairPartner, setPairPartner] = useState<{ uid: string; name: string } | null>(null)
  const [pairWindows, setPairWindows] = useState<MomentoWindow[] | null>(null)
  const [pairLoading, setPairLoading] = useState(false)
  const [pairErr, setPairErr] = useState<string | null>(null)
  // Âncoras do tour holofote da aba (ids casam com o buildForecastTour em modo momento).
  const aIntentions = useTourAnchor('momento.intentions')
  const aWindows = useTourAnchor('momento.windows')
  const aAlert = useTourAnchor('momento.alert')

  const INTENTIONS: { k: MomentoIntention; icon: string; label: string }[] = [
    { k: 'amor', icon: 'heart', label: tl('Amor', 'Love', 'Amor', 'Amore') },
    { k: 'carreira', icon: 'briefcase', label: tl('Carreira', 'Career', 'Carrera', 'Carriera') },
    { k: 'decisao', icon: 'compass', label: tl('Decisão', 'Decision', 'Decision', 'Decisione') },
    { k: 'conversa', icon: 'chatbubbles', label: tl('Conversa', 'Talk', 'Conversacion', 'Conversazione') },
    { k: 'saude', icon: 'fitness', label: tl('Saúde', 'Health', 'Salud', 'Salute') },
    { k: 'viagem', icon: 'airplane', label: tl('Viagem', 'Travel', 'Viaje', 'Viaggio') },
    { k: 'lancar', icon: 'rocket', label: tl('Começar', 'Launch', 'Empezar', 'Iniziare') },
    { k: 'contrato', icon: 'document-text', label: tl('Contrato', 'Contract', 'Contrato', 'Contratto') },
  ]

  useEffect(() => {
    if (!premium || !user?.uid) return
    setLoading(true); setWindows(null)
    getMomento(user.uid, intention).then((r) => { setWindows(r.windows); setAlertOn(r.alertEnabled === true) }).finally(() => setLoading(false))
  }, [premium, user?.uid, intention])

  // Resumo geral: melhor dia por intenção (1 chamada, cache dos 8 blocos).
  useEffect(() => {
    if (!premium || !user?.uid) return
    getMomentoOverview(user.uid).then(setOverview).catch(() => {})
  }, [premium, user?.uid])

  // Conexões aceitas (para "pra vocês dois").
  useEffect(() => {
    if (!premium || !user?.uid) return
    listConnections().then((r) => setConns((r.connections || []).filter((c) => c.status === 'accepted'))).catch(() => {})
  }, [premium, user?.uid])

  // Janelas do par: recarrega quando troca o parceiro ou a intenção.
  useEffect(() => {
    if (!user?.uid || !pairPartner) { setPairWindows(null); return }
    setPairLoading(true); setPairErr(null); setPairWindows(null)
    getMomentoPair(user.uid, pairPartner.uid, intention).then((r) => {
      if (r.notConnected) setPairErr(tl('Vocês não estão mais conectados.', 'You are no longer connected.', 'Ya no estan conectados.', 'Non siete piu connessi.'))
      else if (r.partnerNoBirth) setPairErr(tl('Faltam os dados de nascimento dessa pessoa.', 'This person is missing birth data.', 'Faltan los datos de nacimiento de esa persona.', 'Mancano i dati di nascita di questa persona.'))
      else if (r.gated) setPairErr(tl('Recurso Premium.', 'Premium feature.', 'Funcion Premium.', 'Funzione Premium.'))
      else if (r.error) setPairErr(tl('Não consegui montar agora. Tente de novo.', 'Could not build it now. Try again.', 'No pude montarlo ahora. Intenta de nuevo.', 'Non sono riuscito ora. Riprova.'))
      else setPairWindows(r.windows)
    }).finally(() => setPairLoading(false))
  }, [user?.uid, pairPartner, intention])

  const toggleAlert = async (value: boolean) => {
    if (!user?.uid || alertBusy) return
    setAlertOn(value); setAlertBusy(true) // otimista
    const ok = await setMomentoAlert(user.uid, intention, value)
    if (!ok && value) setAlertOn(false) // falhou ao ligar → reverte
    setAlertBusy(false)
  }

  const planetName = (k: string) => (PLANET[k] ? PLANET[k][lang === 'pt-BR' ? 'pt' : lang === 'es-ES' ? 'es' : lang === 'it-IT' ? 'it' : 'en'] : k)
  const ANGLE_LABEL: Record<string, string> = { ASC: 'Asc', DSC: 'Desc', MC: 'MC', IC: 'IC' }
  const targetLabel = (t: string | null) => {
    if (!t) return ''
    const a = /^angle:(\w+)$/.exec(t)
    if (a) return ANGLE_LABEL[a[1]] || a[1]
    const m = /^casa(\d+)$/.exec(t) // legado — não deve mais ocorrer
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

  // Título "Melhores dias para ..." por intenção (substitui a frase repetida nos cards).
  const bestDaysTitle = (k: MomentoIntention): string => (({
    amor: tl('Melhores dias para se abrir e se aproximar', 'Best days to open up and connect', 'Mejores dias para abrirte y acercarte', 'Migliori giorni per aprirti e avvicinarti'),
    carreira: tl('Melhores dias para dar um passo profissional', 'Best days to take a career step', 'Mejores dias para dar un paso profesional', 'Migliori giorni per un passo di carriera'),
    decisao: tl('Melhores dias para decidir com clareza', 'Best days to decide clearly', 'Mejores dias para decidir con claridad', 'Migliori giorni per decidere con chiarezza'),
    conversa: tl('Melhores dias para aquela conversa', 'Best days for that talk', 'Mejores dias para esa conversacion', 'Migliori giorni per quella conversazione'),
    saude: tl('Melhores dias para cuidar de você', 'Best days to care for yourself', 'Mejores dias para cuidarte', 'Migliori giorni per prenderti cura di te'),
    viagem: tl('Melhores dias para viajar', 'Best days to travel', 'Mejores dias para viajar', 'Migliori giorni per viaggiare'),
    lancar: tl('Melhores dias para começar algo', 'Best days to start something', 'Mejores dias para empezar algo', 'Migliori giorni per iniziare qualcosa'),
    contrato: tl('Melhores dias para assinar ou fechar', 'Best days to sign or close a deal', 'Mejores dias para firmar o cerrar', 'Migliori giorni per firmare o chiudere'),
  } as Record<MomentoIntention, string>)[k] || tl('Melhores dias', 'Best days', 'Mejores dias', 'Giorni migliori'))

  // Data curta (dia + mês) para os chips do resumo.
  const fmtShort = (iso: string) => new Date(iso + 'T12:00:00').toLocaleDateString(lang, { day: '2-digit', month: 'short' })
  // Horizonte ajustável: recorta as janelas aos próximos N dias (client-side).
  const horizonCutoff = (() => { const d = new Date(); d.setDate(d.getDate() + horizon); return d.toISOString().slice(0, 10) })()
  const inHorizon = (windows || []).filter((w) => w.dateISO <= horizonCutoff)
  // Dias favoráveis = score >= 50. Se não houver nenhum, não deixa vazio:
  // mostra o mais favorável do período (rótulo honesto pela banda).
  const favorable = inHorizon.filter((w) => Number(w.score) >= 50)
  const weak = favorable.length === 0
  const shown = weak ? inHorizon.slice(0, 2) : favorable
  const HORIZONS: (15 | 30 | 45)[] = [15, 30, 45]
  // Par: favoráveis pros dois (≥50) ou, se nenhum, os 2 melhores.
  const pairFav = (pairWindows || []).filter((w) => Number(w.score) >= 50)
  const pairShown = pairFav.length ? pairFav : (pairWindows || []).slice(0, 2)
  const intentionLabel = INTENTIONS.find((x) => x.k === intention)?.label || ''
  const winTitle = tl('Momento Certo', 'Right Moment', 'Momento Justo', 'Momento Giusto') + ' · ' + intentionLabel
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
  // Intenção com o maior score (≥50) → recebe o selo "🔥 melhor agora" no seletor.
  // Não reordena os tiles: só marca, preservando as posições fixas.
  const topK = (() => {
    if (!overview) return null
    let bk: MomentoIntention | null = null, bs = 49
    for (const it of INTENTIONS) { const sc = overview[it.k]?.score ?? -1; if (sc > bs) { bs = sc; bk = it.k } }
    return bk
  })()
  const scoreColor = (s: number) => (s >= 70 ? C.good : s >= 50 ? C.gold : C.dim)
  const scoreBand = (s: number) => (
    s >= 70 ? tl('Momento forte', 'Strong window', 'Momento fuerte', 'Momento forte')
      : s >= 55 ? tl('Momento bom', 'Good window', 'Momento bueno', 'Buon momento')
        : s >= 40 ? tl('Momento neutro', 'Neutral window', 'Momento neutro', 'Momento neutro')
          : tl('Momento fraco', 'Weak window', 'Momento debil', 'Momento debole')
  )

  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
      <View style={s.hero}>
        <Text style={s.heroKicker}>⭐ {tl('MOMENTO CERTO', 'RIGHT MOMENT', 'MOMENTO JUSTO', 'MOMENTO GIUSTO')}</Text>
        <Text style={s.heroTitle}>{tl('Quando agir', 'When to act', 'Cuando actuar', 'Quando agire')}</Text>
        <Text style={s.heroSub}>{tl('Escolha uma intenção e veja os melhores dias — em que o céu te apoia para aquilo.', 'Pick an intention and see the best days — when the sky supports you for it.', 'Elige una intencion y ve los mejores dias — cuando el cielo te apoya.', 'Scegli un\'intenzione e vedi i giorni migliori — quando il cielo ti sostiene.')}</Text>
      </View>

      {/* Seletor unificado: seleciona a intenção E mostra o melhor dia por intenção
          (funde o antigo grid + a régua "melhor dia por intenção"). */}
      <View style={s.selWrap}>
        <View style={s.selHead}>
          <Text style={s.selTitle}>{tl('Escolha sua intenção', 'Pick your intention', 'Elige tu intencion', 'Scegli la tua intenzione')}</Text>
          {premium ? <Text style={s.selCaption}>{tl('Melhor dia · próximos 45 dias', 'Best day · next 45 days', 'Mejor dia · proximos 45 dias', 'Giorno migliore · prossimi 45 giorni')}</Text> : null}
        </View>
        <View style={s.grid} {...aIntentions}>
          {INTENTIONS.map((it) => {
            const on = intention === it.k
            const o = overview ? overview[it.k] : null
            const isTop = topK === it.k && !on
            return (
              <TouchableOpacity key={it.k} style={[s.tile, on && s.tileOn, isTop && s.tileTop]} activeOpacity={0.85} onPress={() => setIntention(it.k)}>
                <View style={s.tileHead}>
                  <Ionicons name={it.icon as any} size={18} color={on ? '#0F0F23' : C.gold} />
                  <Text style={[s.tileTx, on && s.tileTxOn]} numberOfLines={1}>{it.label}</Text>
                </View>
                {o ? (
                  <View style={s.tileMeta}>
                    {isTop ? <Text style={s.tileHot}>🔥</Text> : null}
                    <Text style={[s.tileDate, on && s.tileMetaOn]}>{fmtShort(o.dateISO)}</Text>
                    <View style={[s.tileDot, { backgroundColor: on ? '#0F0F23' : scoreColor(o.score) }]} />
                    <Text style={[s.tileScore, { color: on ? '#0F0F23' : scoreColor(o.score) }]}>{o.score}</Text>
                  </View>
                ) : premium ? (
                  <Text style={[s.tileDate, on && s.tileMetaOn, { opacity: 0.5 }]}>—</Text>
                ) : null}
              </TouchableOpacity>
            )
          })}
        </View>
      </View>

      {!premium ? (
        <TouchableOpacity style={s.paywall} activeOpacity={0.9} onPress={() => navigation.navigate('Premium', { openTab: 'features' })}>
          <Text style={s.paywallTitle}>{tl('Recurso Premium', 'Premium feature', 'Funcion Premium', 'Funzione Premium')}</Text>
          <Text style={s.paywallSub}>{tl('Descubra os melhores dias para amor, carreira e decisões. Assine para desbloquear.', 'Discover the best days for love, career and decisions. Subscribe to unlock.', 'Descubre los mejores dias para amor, carrera y decisiones. Suscribete.', 'Scopri i giorni migliori per amore, carriera e decisioni. Abbonati.')}</Text>
          <View style={s.paywallCta}><Text style={s.paywallCtaTx}>{tl('Ver planos', 'See plans', 'Ver planes', 'Vedi i piani')}</Text></View>
        </TouchableOpacity>
      ) : loading ? (
        <View style={{ marginTop: 30, alignItems: 'center', gap: 10 }}>
          <ActivityIndicator color={C.gold} />
          <Text style={s.loadHint}>{tl('Montando as melhores janelas para você…', 'Building your best windows…', 'Montando tus mejores ventanas…', 'Sto costruendo le tue finestre migliori…')}</Text>
        </View>
      ) : (
        <View style={{ marginTop: 18, gap: 10 }}>
          {(windows || []).length > 0 ? (
            <View style={s.horizonRow}>
              <Text style={s.horizonLabel}>{tl('Horizonte', 'Horizon', 'Horizonte', 'Orizzonte')}</Text>
              <View style={s.segment}>
                {HORIZONS.map((h) => (
                  <TouchableOpacity key={'h' + h} style={[s.segItem, horizon === h && s.segItemOn]} activeOpacity={0.85} onPress={() => setHorizon(h)}>
                    <Text style={[s.segTx, horizon === h && s.segTxOn]}>{h}{tl('d', 'd', 'd', 'g')}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ) : null}
          {shown.length === 0 ? (
            <View style={s.soon}><Ionicons name="planet-outline" size={26} color={C.dim} /><Text style={s.soonTx}>{tl('Sem janelas no período. Tente outra intenção ou volte mais pra frente.', 'No windows in this period. Try another intention or check back later.', 'Sin ventanas en el periodo. Prueba otra intencion o vuelve mas adelante.', 'Nessuna finestra nel periodo. Prova un\'altra intenzione o torna piu avanti.')}</Text></View>
          ) : (
            <>
              <Text style={s.label} {...aWindows}>{weak ? tl('Nenhum dia forte por aqui', 'No strong day here', 'Ningun dia fuerte aqui', 'Nessun giorno forte qui') : bestDaysTitle(intention)}</Text>
              {weak ? <Text style={s.weakNote}>{tl('Mostrando o dia mais favorável do período — mesmo sem ser forte.', 'Showing the most favorable day of the period — even if not strong.', 'Mostrando el dia mas favorable del periodo — aunque no sea fuerte.', 'Mostro il giorno piu favorevole del periodo — anche se non forte.')}</Text> : null}
              {shown.map((w, i) => (
                <TouchableOpacity key={w.dateISO + i} style={s.win} activeOpacity={0.85} onPress={() => setDetail(w)}>
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <Text style={s.winDate}>{i === 0 ? '⭐ ' : ''}{fmtDate(w.dateISO)}</Text>
                    {w.hourFromISO && w.hourToISO ? <Text style={s.winHour}>🕐 {fmtHour(w.hourFromISO)}–{fmtHour(w.hourToISO)}</Text> : null}
                    {w.reasons.slice(0, 2).map((r, j) => <Text key={'r' + j} style={s.winReason}>✨ {reasonLine(r)}</Text>)}
                    {w.cautions.slice(0, 1).map((c, j) => <Text key={'c' + j} style={s.winCaution}>⚠️ {cautionLine(c)}</Text>)}
                    {w.reasons.length + w.cautions.length > 3 ? <Text style={s.winMore}>{tl('ver mais', 'see more', 'ver mas', 'vedi altro')} ›</Text> : null}
                  </View>
                  <View style={[s.ring, { borderColor: scoreColor(w.score) }]}>
                    <Text style={[s.ringTx, { color: scoreColor(w.score) }]}>{w.score}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color={C.dim} />
                </TouchableOpacity>
              ))}
            </>
          )}
          <View style={s.alertRow} {...aAlert}>
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text style={s.alertTitle}>🔔 {tl('Avise-me quando abrir', 'Alert me when it opens', 'Avisame cuando se abra', 'Avvisami quando si apre')}</Text>
              <Text style={s.alertSub}>{tl('Um push quando uma janela forte desta intenção estiver chegando.', 'A push when a strong window for this intention is near.', 'Un aviso cuando una ventana fuerte de esta intencion se acerque.', 'Una notifica quando una finestra forte di questa intenzione si avvicina.')}</Text>
            </View>
            <Switch value={alertOn} onValueChange={toggleAlert} disabled={alertBusy} trackColor={{ true: C.good, false: C.line }} thumbColor="#fff" />
          </View>
          {conns.length > 0 ? (
            <TouchableOpacity style={s.pairBtn} activeOpacity={0.85} onPress={() => setPickerOpen(true)}>
              <Ionicons name="people" size={18} color={C.gold} />
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={s.pairBtnTx}>{tl('Momento pra vocês dois', 'Right moment for you two', 'Momento para ustedes dos', 'Momento per voi due')}</Text>
                <Text style={s.pairBtnSub}>{tl('Janelas boas pros dois de uma conexão.', 'Windows that work for both of a connection.', 'Ventanas buenas para ambos de una conexion.', 'Finestre buone per entrambi di una connessione.')}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={C.dim} />
            </TouchableOpacity>
          ) : null}
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
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6 }}>
                  <Text style={s.sheetDate}>{fmtDate(detail.dateISO)}</Text>
                  <View style={[s.bandTag, { borderColor: scoreColor(detail.score) }]}><Text style={[s.bandTx, { color: scoreColor(detail.score) }]}>{scoreBand(detail.score)} · {detail.score}</Text></View>
                </View>
                {detail.hourFromISO && detail.hourToISO ? (
                  <>
                    <Text style={s.sheetHour}>🕐 {fmtHour(detail.hourFromISO)}–{fmtHour(detail.hourToISO)}</Text>
                    <Text style={s.hourNote}>{tl('Hora planetária ideal — um reforço, não obrigatória.', 'Ideal planetary hour — a boost, not a must.', 'Hora planetaria ideal — un refuerzo, no obligatoria.', 'Ora planetaria ideale — un rinforzo, non obbligatoria.')}</Text>
                  </>
                ) : null}
                <View style={{ marginTop: 14 }}>
                  <Text style={s.legend}>✨ {tl('a favor', 'in favor', 'a favor', 'a favore')}   ·   ⚠️ {tl('atenção', 'caution', 'atencion', 'attenzione')}</Text>
                  {detail.reasons.length ? <Text style={s.groupTitle}>{tl('O que apoia', 'What supports', 'Lo que apoya', 'Cosa sostiene')}</Text> : null}
                  {detail.reasons.map((r, j) => <Text key={'dr' + j} style={s.winReason}>✨ {reasonLine(r)}</Text>)}
                  {detail.cautions.length ? <Text style={s.groupTitle}>{tl('O que pesar', 'What to weigh', 'Que sopesar', 'Cosa valutare')}</Text> : null}
                  {detail.cautions.map((c, j) => <Text key={'dc' + j} style={s.winCaution}>⚠️ {cautionLine(c)}</Text>)}
                </View>
                <View style={{ marginTop: 20 }}>
                  <TouchableOpacity style={[s.act, { backgroundColor: C.gold }]} onPress={() => detail && addToCalendar(detail)}>
                    <Ionicons name="calendar-outline" size={16} color="#0F0F23" /><Text style={s.actTx}>{tl('Adicionar ao calendário', 'Add to calendar', 'Anadir al calendario', 'Aggiungi al calendario')}</Text>
                  </TouchableOpacity>
                </View>
                <Text style={s.disclaimer}>{tl('Orientativo, não determinista. A escolha é sua.', 'Guidance, not fate. The choice is yours.', 'Orientativo, no determinista. La eleccion es tuya.', 'Indicativo, non deterministico. La scelta e tua.')}</Text>
              </>
            ) : null}
          </View>
        </View>
      </Modal>

      {/* Picker: escolher uma conexão para "pra vocês dois" */}
      <Modal visible={pickerOpen} transparent animationType="slide" onRequestClose={() => setPickerOpen(false)}>
        <View style={s.sheetBack}>
          <View style={s.sheet}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={s.sheetTitle}>{tl('Escolha uma conexão', 'Choose a connection', 'Elige una conexion', 'Scegli una connessione')}</Text>
              <TouchableOpacity onPress={() => setPickerOpen(false)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}><Ionicons name="close" size={24} color={C.dim} /></TouchableOpacity>
            </View>
            <ScrollView style={{ maxHeight: 360, marginTop: 12 }}>
              {conns.map((c) => (
                <TouchableOpacity key={c.other} style={s.connRow} activeOpacity={0.85} onPress={() => { setPairPartner({ uid: c.other, name: c.otherName || tl('Conexão', 'Connection', 'Conexion', 'Connessione') }); setPickerOpen(false) }}>
                  <View style={s.connAvatar}><Text style={s.connAvatarTx}>{(c.otherName || '?').slice(0, 1).toUpperCase()}</Text></View>
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <Text style={s.connName} numberOfLines={1}>{c.otherName || tl('Conexão', 'Connection', 'Conexion', 'Connessione')}</Text>
                    {c.origin === 'match' && c.score != null ? <Text style={s.connMeta}>💘 {c.score}% {tl('de match', 'match', 'de match', 'di match')}</Text> : <Text style={s.connMeta}>{tl('Conexão', 'Connection', 'Conexion', 'Connessione')}</Text>}
                  </View>
                  <Ionicons name="chevron-forward" size={16} color={C.dim} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Resultado "pra vocês dois" */}
      <Modal visible={!!pairPartner} transparent animationType="slide" onRequestClose={() => setPairPartner(null)}>
        <View style={s.sheetBack}>
          <View style={s.sheet}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={s.sheetTitle}>💞 {tl('Pra vocês dois', 'For you two', 'Para ustedes dos', 'Per voi due')} · {intentionLabel}</Text>
              <TouchableOpacity onPress={() => setPairPartner(null)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}><Ionicons name="close" size={24} color={C.dim} /></TouchableOpacity>
            </View>
            {pairPartner ? <Text style={s.pairWho}>{tl('Você', 'You', 'Tu', 'Tu')} + {pairPartner.name}</Text> : null}
            {pairLoading ? (
              <View style={{ paddingVertical: 30, alignItems: 'center', gap: 10 }}>
                <ActivityIndicator color={C.gold} />
                <Text style={s.loadHint}>{tl('Cruzando os dois céus…', 'Crossing both skies…', 'Cruzando los dos cielos…', 'Incrocio i due cieli…')}</Text>
              </View>
            ) : pairErr ? (
              <View style={s.soon}><Ionicons name="alert-circle-outline" size={26} color={C.dim} /><Text style={s.soonTx}>{pairErr}</Text></View>
            ) : (
              <ScrollView style={{ maxHeight: 420, marginTop: 12 }} contentContainerStyle={{ gap: 10, paddingBottom: 8 }}>
                {pairShown.length === 0 ? (
                  <View style={s.soon}><Ionicons name="planet-outline" size={26} color={C.dim} /><Text style={s.soonTx}>{tl('Sem janelas boas pros dois no período.', 'No good windows for both in this period.', 'Sin ventanas buenas para ambos en el periodo.', 'Nessuna finestra buona per entrambi nel periodo.')}</Text></View>
                ) : (
                  <>
                    {pairFav.length === 0 ? <Text style={s.weakNote}>{tl('Sem dia forte — mostrando o mais favorável pros dois.', 'No strong day — showing the most favorable for both.', 'Sin dia fuerte — mostrando el mas favorable para ambos.', 'Nessun giorno forte — mostro il piu favorevole per entrambi.')}</Text> : null}
                    {pairShown.map((w, i) => (
                      <View key={w.dateISO + i} style={s.win}>
                        <View style={{ flex: 1, minWidth: 0 }}>
                          <Text style={s.winDate}>{i === 0 ? '⭐ ' : ''}{fmtDate(w.dateISO)}</Text>
                          {(w.pctA != null || w.pctB != null) ? <Text style={s.pairPct}>{tl('Você', 'You', 'Tu', 'Tu')} {w.pctA ?? '—'}%  ·  {pairPartner?.name} {w.pctB ?? '—'}%</Text> : null}
                          {w.reasons.slice(0, 2).map((r, j) => <Text key={'pr' + j} style={s.winReason}>✨ {reasonLine(r)}</Text>)}
                          {w.cautions.slice(0, 1).map((c, j) => <Text key={'pc' + j} style={s.winCaution}>⚠️ {cautionLine(c)}</Text>)}
                        </View>
                        <View style={[s.ring, { borderColor: scoreColor(w.score) }]}>
                          <Text style={[s.ringTx, { color: scoreColor(w.score) }]}>{w.score}</Text>
                        </View>
                      </View>
                    ))}
                    <Text style={s.hourNote}>{tl('Sem hora ideal aqui — o local de vocês dois é diferente.', 'No ideal hour here — your two locations differ.', 'Sin hora ideal aqui — sus dos lugares son distintos.', 'Nessuna ora ideale qui — i vostri due luoghi differiscono.')}</Text>
                  </>
                )}
              </ScrollView>
            )}
            <Text style={s.disclaimer}>{tl('Orientativo. As janelas apoiam os dois — a escolha é de vocês.', 'Guidance. Windows support you both — the choice is yours.', 'Orientativo. Las ventanas apoyan a ambos — la eleccion es de ustedes.', 'Indicativo. Le finestre sostengono entrambi — la scelta e vostra.')}</Text>
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
  selWrap: {},
  selHead: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 10 },
  selTitle: { color: C.tx, fontSize: 14, fontWeight: '800' },
  selCaption: { color: C.dim, fontSize: 11.5, fontWeight: '700' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  tile: { width: '47%', flexGrow: 1, backgroundColor: C.card, borderRadius: 14, borderWidth: 1, borderColor: C.line, padding: 12, gap: 9 },
  tileOn: { backgroundColor: C.gold, borderColor: C.gold },
  tileTop: { borderColor: 'rgba(255,215,0,0.55)' },
  tileHead: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  tileTx: { color: C.tx, fontSize: 14, fontWeight: '700', flexShrink: 1 },
  tileTxOn: { color: '#0F0F23', fontWeight: '800' },
  tileMeta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  tileMetaOn: { color: '#0F0F23' },
  tileHot: { fontSize: 12 },
  tileDate: { color: C.dim, fontSize: 12.5, fontWeight: '800', textTransform: 'capitalize' },
  tileDot: { width: 8, height: 8, borderRadius: 4 },
  tileScore: { fontSize: 12.5, fontWeight: '900' },
  label: { color: C.tx, fontSize: 14, fontWeight: '800' },
  horizonRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  horizonLabel: { color: C.dim, fontSize: 12.5, fontWeight: '700', marginRight: 2 },
  segment: { flexDirection: 'row', backgroundColor: C.card, borderRadius: 10, borderWidth: 1, borderColor: C.line, overflow: 'hidden' },
  segItem: { paddingVertical: 6, paddingHorizontal: 15 },
  segItemOn: { backgroundColor: C.card2 },
  segTx: { color: C.dim, fontSize: 13, fontWeight: '800' },
  segTxOn: { color: C.gold },
  win: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: C.card, borderRadius: 14, borderWidth: 1, borderColor: C.line, padding: 14 },
  winDate: { color: C.tx, fontSize: 15, fontWeight: '800', textTransform: 'capitalize' },
  winHuman: { color: C.tx, fontSize: 13.5, fontWeight: '700', lineHeight: 18, marginTop: 3 },
  loadHint: { color: C.dim, fontSize: 13, textAlign: 'center' },
  weakNote: { color: C.dim, fontSize: 12.5, fontStyle: 'italic', marginTop: -4, marginBottom: 2, lineHeight: 17 },
  winHour: { color: C.good, fontSize: 13, fontWeight: '800', marginTop: 3 },
  winReason: { color: C.dim, fontSize: 13, lineHeight: 18, marginTop: 3 },
  winCaution: { color: C.gold, fontSize: 12.5, lineHeight: 18, marginTop: 2 },
  winMore: { color: C.gold, fontSize: 12, fontWeight: '800', marginTop: 5 },
  bandTag: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  bandTx: { fontSize: 12, fontWeight: '900' },
  hourNote: { color: C.dim, fontSize: 11.5, fontStyle: 'italic', marginTop: 2 },
  legend: { color: C.dim, fontSize: 12, marginBottom: 8 },
  groupTitle: { color: C.tx, fontSize: 12.5, fontWeight: '800', marginTop: 10, marginBottom: 1, textTransform: 'uppercase', letterSpacing: 0.4 },
  ring: { width: 46, height: 46, borderRadius: 23, borderWidth: 2.5, alignItems: 'center', justifyContent: 'center' },
  ringTx: { fontSize: 16, fontWeight: '900' },
  pairBtn: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: C.card2, borderRadius: 14, borderWidth: 1, borderColor: 'rgba(255,215,0,0.35)', padding: 14, marginTop: 4 },
  pairBtnTx: { color: C.tx, fontSize: 14, fontWeight: '800' },
  pairBtnSub: { color: C.dim, fontSize: 12.5, lineHeight: 17, marginTop: 3 },
  pairWho: { color: C.gold, fontSize: 13.5, fontWeight: '800', marginTop: 8 },
  pairPct: { color: C.dim, fontSize: 12.5, fontWeight: '700', marginTop: 3 },
  connRow: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: C.card, borderRadius: 14, borderWidth: 1, borderColor: C.line, padding: 12, marginBottom: 8 },
  connAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: C.card2, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: C.line },
  connAvatarTx: { color: C.gold, fontSize: 17, fontWeight: '900' },
  connName: { color: C.tx, fontSize: 15, fontWeight: '800' },
  connMeta: { color: C.dim, fontSize: 12.5, marginTop: 2 },
  alertRow: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: C.card2, borderRadius: 14, borderWidth: 1, borderColor: C.line, padding: 14, marginTop: 4 },
  alertTitle: { color: C.tx, fontSize: 14, fontWeight: '800' },
  alertSub: { color: C.dim, fontSize: 12.5, lineHeight: 17, marginTop: 3 },
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
