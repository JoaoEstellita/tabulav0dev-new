import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, Linking, Image, StyleSheet, Alert, Switch, ActivityIndicator, TextInput, Modal } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useAuth } from '../../hooks/useAuth'
import { useAppLanguage } from '../../hooks/useAppLanguage'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { listConnections, respondConnection, shareWhatsapp, blockConnection, removeConnection, requestConnection, type Connection } from '../../services/ConnectionsService'
import { listPeople, ensureSelfDiscoverable, setDiscoverable, searchProfiles, type PublicProfile } from '../../services/DiscoveryService'
import NetworkProfileEditor from './NetworkProfileEditor'
import DiscoverDeck from './DiscoverDeck'
import { getMyMatches, getMyProfile, setDeckVisible as setDeckVisibleApi, setShareChart as setShareChartApi, type MatchRow } from '../../services/DiscoveryService'
import { useSubscriptionCheck } from '../../hooks/useSubscriptionCheck'
import IntroCarousel from '../../components/IntroCarousel'
import { matchIntroSlides } from './matchIntroSlides'

const WELCOME_KEY = 'network_welcome_seen_v1'
const MATCH_TOUR_KEY = 'match_tour_seen_v1'

// Paleta da Rede (mockup aprovado): índigo profundo + dourado (identidade) + magenta (match/sinastria)
const C = {
  void: '#0F0F23', surface: '#161728', surface2: '#1E2038',
  line: 'rgba(255,255,255,0.07)', line2: 'rgba(255,255,255,0.12)',
  ink: '#EDEBF7', dim: '#9A9CB8', faint: '#6E6F8C',
  gold: '#FFD700', goldDeep: '#C9A227', magenta: '#FF4D8D', good: '#22C55E',
}
type Page = 'connections' | 'discover' | 'profile'

export default function NetworkScreen() {
  const { user } = useAuth()
  const navigation = useNavigation<any>()
  const insets = useSafeAreaInsets()
  const { language } = useAppLanguage()
  const tl = (pt: string, en: string, es: string, it: string) =>
    language === 'en-US' ? en : language === 'es-ES' ? es : language === 'it-IT' ? it : pt

  const { isAdmin, subscription, trialActive } = useSubscriptionCheck()
  // Gate: a Rede/Match é para assinante ATIVO ou TRIAL; grátis vê o paywall.
  const gated = !isAdmin && !subscription?.active && !trialActive
  const [showTour, setShowTour] = useState(false)
  const [showList, setShowList] = useState(false)
  const [matches, setMatches] = useState<MatchRow[]>([])
  const [deckVisible, setDeckVis] = useState(true)
  const [togglingDeck, setTogglingDeck] = useState(false)
  const [shareOpen, setShareOpen] = useState(true)
  const [togglingShare, setTogglingShare] = useState(false)
  useEffect(() => {
    getMyProfile().then((r) => {
      if (r.gated) return
      setDeckVis(!r.deckHidden)
      setShareOpen((r.profile as any)?.shareChart !== false)
    }).catch(() => {})
  }, [])
  const toggleDeck = async (v: boolean) => {
    setTogglingDeck(true); setDeckVis(v)
    try { await setDeckVisibleApi(v) } catch { setDeckVis(!v) } finally { setTogglingDeck(false) }
  }
  const toggleShare = async (v: boolean) => {
    setTogglingShare(true); setShareOpen(v)
    try { await setShareChartApi(v) } catch { setShareOpen(!v) } finally { setTogglingShare(false) }
  }

  const [page, setPage] = useState<Page>('discover')
  const [items, setItems] = useState<Connection[]>([])
  const [people, setPeople] = useState<PublicProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState<string | null>(null)
  const [shareOnAccept, setShareOnAccept] = useState<Set<string>>(new Set())
  const [sentIds, setSentIds] = useState<Set<string>>(new Set())
  const [visible, setVisible] = useState(true)
  const [togglingVisible, setTogglingVisible] = useState(false)
  const [showWelcome, setShowWelcome] = useState(false)
  const [justConnected, setJustConnected] = useState<{ uid: string; name: string | null } | null>(null)
  // busca
  const [term, setTerm] = useState('')
  const [searchResults, setSearchResults] = useState<PublicProfile[] | null>(null)
  const [searching, setSearching] = useState(false)

  const load = useCallback(async (force = false) => {
    setLoading(true)
    // getMatches NÃO entra aqui de propósito: custa ~300 leituras + o cálculo de
    // sinastria de todo o pool. Só é preciso na tela Matches (Pro), não a cada
    // abertura da Rede — o card abaixo é só um acesso.
    const [conns, self, ppl] = await Promise.all([
      listConnections().catch(() => ({ connections: [] as Connection[] })),
      ensureSelfDiscoverable().catch(() => ({ discoverable: true, published: false })),
      listPeople(force).catch(() => [] as PublicProfile[]),
    ])
    setItems(conns.connections)
    setVisible(self.discoverable)
    setPeople(ppl)
    setLoading(false)
  }, [])
  useEffect(() => { load() }, [load])
  useEffect(() => {
    AsyncStorage.getItem(WELCOME_KEY).then((v) => { if (!v) setShowWelcome(true) }).catch(() => {})
  }, [])
  const dismissWelcome = () => { setShowWelcome(false); AsyncStorage.setItem(WELCOME_KEY, '1').catch(() => {}) }
  const doRemove = (c: Connection) => Alert.alert(
    tl('Desfazer conexão', 'Remove connection', 'Deshacer conexión', 'Rimuovi connessione'),
    tl('Remover esta conexão? Vocês deixam de estar conectados.', 'Remove this connection? You will no longer be connected.', '¿Quitar esta conexión?', 'Rimuovere questa connessione?'),
    [{ text: tl('Cancelar', 'Cancel', 'Cancelar', 'Annulla'), style: 'cancel' },
     { text: tl('Desfazer', 'Remove', 'Quitar', 'Rimuovi'), style: 'destructive', onPress: () => run(`r:${c.id}`, () => removeConnection(c.other)) }],
  )
  const connMenu = (c: Connection) => Alert.alert(
    c.otherName || tl('Conexão', 'Connection', 'Conexión', 'Connessione'),
    undefined,
    [{ text: tl('Desfazer conexão', 'Remove connection', 'Deshacer conexión', 'Rimuovi connessione'), onPress: () => doRemove(c) },
     { text: tl('Bloquear', 'Block', 'Bloquear', 'Blocca'), style: 'destructive', onPress: () => doBlock(c) },
     { text: tl('Cancelar', 'Cancel', 'Cancelar', 'Annulla'), style: 'cancel' }],
  )

  const received = useMemo(() => items.filter((c) => c.status === 'pending' && c.requestedBy !== user?.uid), [items, user?.uid])
  const sent = useMemo(() => items.filter((c) => c.status === 'pending' && c.requestedBy === user?.uid), [items, user?.uid])
  const accepted = useMemo(() => items.filter((c) => c.status === 'accepted'), [items])
  const connectedUids = useMemo(() => new Set(items.map((c) => c.other)), [items])

  const run = async (key: string, fn: () => Promise<any>) => {
    if (busy) return
    setBusy(key)
    try { await fn() } catch { /* silencioso */ }
    await load(); setBusy(null)
  }
  const accept = (c: Connection) => run(`a:${c.id}`, async () => {
    await respondConnection(c.other, true, shareOnAccept.has(c.id))
    setJustConnected({ uid: c.other, name: c.otherName })
  })
  // Tipo da conexão pra rotular no card (💘 Match do baralho vs 🤝 Amizade).
  const connKind = (c: Connection) => (c.origin === 'match'
    ? { emoji: '💘', label: tl('Match', 'Match', 'Match', 'Match'), color: C.magenta }
    : { emoji: '🤝', label: tl('Amizade', 'Friend', 'Amistad', 'Amicizia'), color: C.good })
  const decline = (c: Connection) => run(`d:${c.id}`, () => respondConnection(c.other, false, false))
  const doShare = (c: Connection) => run(`s:${c.id}`, () => shareWhatsapp(c.other))
  const doBlock = (c: Connection) => Alert.alert(
    tl('Bloquear', 'Block', 'Bloquear', 'Blocca'),
    tl('Bloquear esta pessoa?', 'Block this person?', '¿Bloquear a esta persona?', 'Bloccare questa persona?'),
    [{ text: tl('Cancelar', 'Cancel', 'Cancelar', 'Annulla'), style: 'cancel' },
     { text: tl('Bloquear', 'Block', 'Bloquear', 'Blocca'), style: 'destructive', onPress: () => run(`b:${c.id}`, () => blockConnection(c.other)) }],
  )
  const openWhatsapp = (phone: string) => Linking.openURL(`https://wa.me/${phone.replace(/\D/g, '')}`).catch(() => {})

  const connectPerson = async (uid: string) => {
    if (busy) return
    setBusy(`c:${uid}`)
    try { await requestConnection(uid, null, false); setSentIds((prev) => new Set(prev).add(uid)) } catch { /* */ }
    setBusy(null)
  }

  const toggleVisible = async (next: boolean) => {
    setTogglingVisible(true); setVisible(next)
    try { await setDiscoverable(next) } catch { setVisible(!next) }
    setTogglingVisible(false)
  }

  const doSearch = async () => {
    const t = term.trim()
    if (t.length < 2) { setSearchResults(null); return }
    setSearching(true)
    try { setSearchResults(await searchProfiles(t)) } catch { setSearchResults([]) }
    setSearching(false)
  }
  const clearSearch = () => { setTerm(''); setSearchResults(null) }

  const trioLine = (p: { sunSign: string | null; moonSign: string | null; ascSign: string | null }) => {
    const parts: string[] = []
    if (p.sunSign) parts.push(`☉ ${p.sunSign}`)
    if (p.moonSign) parts.push(`☽ ${p.moonSign}`)
    if (p.ascSign) parts.push(`ASC ${p.ascSign}`)
    return parts.join('  ·  ')
  }
  const initial = (n?: string | null) => (n || '?').trim().slice(0, 1).toUpperCase()

  const Avatar = ({ name, photo, size = 54, ring }: { name?: string | null; photo?: string | null; size?: number; ring?: boolean }) => (
    photo
      ? <Image source={{ uri: photo }} style={[st.avatar, { width: size, height: size, borderRadius: size / 2 }, ring && st.avatarRing]} />
      : <View style={[st.avatar, st.avatarFb, { width: size, height: size, borderRadius: size / 2 }, ring && st.avatarRing]}><Text style={[st.avatarInit, { fontSize: size * 0.4 }]}>{initial(name)}</Text></View>
  )

  const openPerson = (p: { uid: string; name: string | null; photo: string | null; sun: string | null; moon: string | null; asc: string | null; city: string | null }) =>
    navigation.navigate('PersonProfile', { uid: p.uid, displayName: p.name, photoURL: p.photo, sunSign: p.sun, moonSign: p.moon, ascSign: p.asc, city: p.city })

  const PersonCard = ({ uid, name, photo, sun, moon, asc, city }: { uid: string; name: string | null; photo: string | null; sun: string | null; moon: string | null; asc: string | null; city: string | null }) => {
    const already = connectedUids.has(uid) || sentIds.has(uid)
    return (
      <View style={st.person}>
        <TouchableOpacity style={st.personTap} activeOpacity={0.7} onPress={() => openPerson({ uid, name, photo, sun, moon, asc, city })}>
          <Avatar name={name} photo={photo} size={54} />
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text style={st.personName} numberOfLines={1}>{name || tl('Alguém', 'Someone', 'Alguien', 'Qualcuno')}</Text>
            {trioLine({ sunSign: sun, moonSign: moon, ascSign: asc }) ? <Text style={st.trio} numberOfLines={1}>{trioLine({ sunSign: sun, moonSign: moon, ascSign: asc })}</Text> : null}
            {city ? <Text style={st.city} numberOfLines={1}>{city}</Text> : null}
          </View>
        </TouchableOpacity>
        {already ? (
          <View style={st.doneTag}><Ionicons name="checkmark" size={14} color={C.good} /><Text style={st.doneTagTx}>{tl('Enviado', 'Sent', 'Enviado', 'Inviato')}</Text></View>
        ) : (
          <TouchableOpacity style={st.connectBtn} disabled={busy === `c:${uid}`} onPress={() => connectPerson(uid)}>
            {busy === `c:${uid}` ? <ActivityIndicator size="small" color="#1a1405" /> : <Text style={st.connectTx}>{tl('Conectar', 'Connect', 'Conectar', 'Connetti')}</Text>}
          </TouchableOpacity>
        )}
      </View>
    )
  }

  const SectionLabel = ({ children }: { children: React.ReactNode }) => (
    <View style={st.sectRow}><Text style={st.sectLabel}>{children}</Text><View style={st.sectLine} /></View>
  )

  // Guia de introdução ao Match: abre no 1º acesso; reabrível pelo botão de ajuda.
  useEffect(() => {
    AsyncStorage.getItem(MATCH_TOUR_KEY).then((v) => { if (!v) setShowTour(true) }).catch(() => {})
  }, [])
  const closeTour = () => { setShowTour(false); AsyncStorage.setItem(MATCH_TOUR_KEY, '1').catch(() => {}) }
  useEffect(() => {
    if (page === 'connections' && !gated) getMyMatches().then((r) => setMatches(r.matches)).catch(() => {})
  }, [page, gated])
  const tourLabels = { skip: tl('Pular', 'Skip', 'Saltar', 'Salta'), next: tl('Próximo', 'Next', 'Siguiente', 'Avanti'), done: gated ? tl('Assinar', 'Subscribe', 'Suscribirse', 'Abbonati') : tl('Começar', 'Start', 'Empezar', 'Inizia') }

  // Paywall: a seção Match é só para assinante ativo ou trial.
  if (gated) {
    return (
      <View style={[st.screen, { paddingTop: insets.top + 48, alignItems: 'center', paddingHorizontal: 26 }]}>
        <Ionicons name="heart" size={46} color={C.magenta} />
        <Text style={[st.title, { marginTop: 16, textAlign: 'center' }]}>Match 💘</Text>
        <Text style={{ color: C.faint, textAlign: 'center', marginTop: 12, fontSize: 15, lineHeight: 22 }}>
          {tl('Descubra com quem você mais combina e dê match. Esta seção é para assinantes.', 'Discover who matches you most and match. This section is for subscribers.', 'Descubre con quien mas combinas y haz match. Esta seccion es para suscriptores.', 'Scopri con chi combini di piu e fai match. Questa sezione e per abbonati.')}
        </Text>
        <TouchableOpacity style={st.payCta} onPress={() => navigation.navigate('Premium')} activeOpacity={0.9}>
          <Text style={st.payCtaTx}>{tl('Assinar para descobrir', 'Subscribe to discover', 'Suscribirse para descubrir', 'Abbonati per scoprire')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ marginTop: 16 }} onPress={() => setShowTour(true)}>
          <Text style={{ color: C.faint, fontSize: 13 }}>{tl('Como funciona?', 'How it works?', 'Como funciona?', 'Come funziona?')}</Text>
        </TouchableOpacity>
        <IntroCarousel visible={showTour} slides={matchIntroSlides(language as any, true)} onClose={closeTour} labels={tourLabels} />
      </View>
    )
  }

  return (
    <ScrollView
      style={st.screen}
      contentContainerStyle={{ paddingTop: insets.top + 12, paddingBottom: 40 }}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={() => load(true)} tintColor={C.gold} />}
    >
      {/* Header */}
      <View style={st.head}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text style={st.title}>Mat<Text style={{ color: C.magenta }}>ch</Text></Text>
          <TouchableOpacity onPress={() => setShowTour(true)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name="help-circle-outline" size={20} color={C.faint} />
          </TouchableOpacity>
        </View>
        <View style={{ gap: 6, alignItems: 'flex-end' }}>
          <View style={st.visChip}>
            <Ionicons name={deckVisible ? 'heart' : 'heart-dislike-outline'} size={15} color={deckVisible ? C.gold : C.faint} />
            <Text style={[st.visChipTx, { color: deckVisible ? C.ink : C.faint }]}>{deckVisible ? tl('Match visível', 'Match visible', 'Match visible', 'Match visibile') : tl('Match oculto', 'Match hidden', 'Match oculto', 'Match nascosto')}</Text>
            <Switch value={deckVisible} disabled={togglingDeck} onValueChange={toggleDeck} trackColor={{ true: C.gold, false: '#3a3a4a' }} thumbColor="#fff" style={{ transform: [{ scale: 0.75 }] }} />
          </View>
          <View style={st.visChip}>
            <Ionicons name={shareOpen ? 'pie-chart' : 'lock-closed-outline'} size={15} color={shareOpen ? C.gold : C.faint} />
            <Text style={[st.visChipTx, { color: shareOpen ? C.ink : C.faint }]}>{shareOpen ? tl('Sinastria visível', 'Synastry visible', 'Sinastria visible', 'Sinastria visibile') : tl('Sinastria oculta', 'Synastry hidden', 'Sinastria oculta', 'Sinastria nascosta')}</Text>
            <Switch value={shareOpen} disabled={togglingShare} onValueChange={toggleShare} trackColor={{ true: C.gold, false: '#3a3a4a' }} thumbColor="#fff" style={{ transform: [{ scale: 0.75 }] }} />
          </View>
        </View>
      </View>

      {/* Boas-vindas / opt-out — só na 1ª visita */}
      {showWelcome ? (
        <View style={st.welcome}>
          <View style={st.welcomeTop}>
            <Ionicons name="planet" size={22} color={C.magenta} />
            <Text style={st.welcomeTitle}>{tl('Bem-vindo à Rede', 'Welcome to the Network', 'Bienvenido a la Red', 'Benvenuto nella Rete')}</Text>
          </View>
          <Text style={st.welcomeBody}>
            {tl('Aqui você encontra pessoas, vê com quem combina e se conecta. Ao conectar, a outra pessoa recebe um pedido — aceito, vocês podem trocar WhatsApp ou entrar num grupo juntos.',
              'Here you find people, see who you match with and connect. When you connect, the other person gets a request — once accepted, you can share WhatsApp or join a group together.',
              'Aqui encuentras personas, ves con quien combinas y conectas. Al conectar, la otra persona recibe una solicitud; aceptada, pueden compartir WhatsApp o entrar en un grupo.',
              'Qui trovi persone, vedi con chi corrispondi e ti connetti. Alla connessione l\'altra persona riceve una richiesta; accettata, potete condividere WhatsApp o entrare in un gruppo.')}
          </Text>
          <TouchableOpacity style={st.welcomeBtn} onPress={dismissWelcome}><Text style={st.welcomeBtnTx}>{tl('Entendi', 'Got it', 'Entendido', 'Ho capito')}</Text></TouchableOpacity>
        </View>
      ) : null}

      {/* Segmented */}
      <View style={st.seg}>
        <TouchableOpacity style={[st.segBtn, page === 'discover' && st.segOn]} onPress={() => setPage('discover')}>
          <Text style={[st.segTx, page === 'discover' && st.segTxOn]}>{tl('Descobrir', 'Discover', 'Descubrir', 'Scopri')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[st.segBtn, page === 'connections' && st.segOn]} onPress={() => setPage('connections')}>
          <Text style={[st.segTx, page === 'connections' && st.segTxOn]}>{tl('Match', 'Match', 'Match', 'Match')}</Text>
          {received.length ? <View style={st.segBadge}><Text style={st.segBadgeTx}>{received.length}</Text></View> : null}
        </TouchableOpacity>
        <TouchableOpacity style={[st.segBtn, page === 'profile' && st.segOn]} onPress={() => setPage('profile')}>
          <Text style={[st.segTx, page === 'profile' && st.segTxOn]}>{tl('Perfil', 'Profile', 'Perfil', 'Profilo')}</Text>
        </TouchableOpacity>
      </View>

      {loading && !items.length && !people.length ? (
        <ActivityIndicator color={C.gold} style={{ marginTop: 40 }} />
      ) : page === 'discover' ? (
        <View style={st.pad}>
          {/* Só o baralho de swipe. A busca por nome abre pelo botão "Buscar". */}
          <DiscoverDeck onOpenList={() => setShowList(true)} onGoProfile={() => setPage('profile')} />
        </View>
      ) : page === 'profile' ? (
        <NetworkProfileEditor />
      ) : (
        /* ===== MATCH (conexões + pedidos) ===== */
        <View style={st.pad}>
          {matches.length ? (
            <>
              <SectionLabel>{tl('Seus Matches 💘', 'Your Matches 💘', 'Tus Matches 💘', 'I tuoi Match 💘')}</SectionLabel>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 8 }} contentContainerStyle={{ gap: 14, paddingVertical: 4 }}>
                {matches.map((m) => (
                  <View key={m.uid} style={{ alignItems: 'center', width: 76 }}>
                    <Avatar name={m.displayName} photo={m.photoURL} size={60} ring />
                    <Text style={{ color: C.ink, fontSize: 12, fontWeight: '700', marginTop: 4 }} numberOfLines={1}>{m.displayName}</Text>
                    {typeof m.score === 'number' ? <Text style={{ color: C.magenta, fontSize: 11, fontWeight: '800' }}>{Math.round(m.score)}%</Text> : null}
                  </View>
                ))}
              </ScrollView>
            </>
          ) : null}
          {received.length ? (
            <>
              <SectionLabel>{tl(`✦ ${received.length} ${received.length === 1 ? 'pedido esperando' : 'pedidos esperando'}`, `✦ ${received.length} waiting`, `✦ ${received.length} esperando`, `✦ ${received.length} in attesa`)}</SectionLabel>
              {received.map((c) => (
                <View key={c.id} style={st.req}>
                  <View style={st.reqTop}>
                    <Avatar name={c.otherName} photo={c.otherPhoto} size={46} />
                    <View style={{ flex: 1, minWidth: 0 }}>
                      <Text style={st.personName} numberOfLines={1}>{c.otherName || tl('Alguém', 'Someone', 'Alguien', 'Qualcuno')}</Text>
                      <View style={[st.kindBadge, { borderColor: connKind(c).color }]}><Text style={[st.kindTx, { color: connKind(c).color }]}>{connKind(c).emoji} {connKind(c).label}</Text></View>
                    </View>
                  </View>
                  <TouchableOpacity style={st.checkRow} onPress={() => setShareOnAccept((p) => { const n = new Set(p); n.has(c.id) ? n.delete(c.id) : n.add(c.id); return n })}>
                    <Ionicons name={shareOnAccept.has(c.id) ? 'checkbox' : 'square-outline'} size={18} color={C.gold} />
                    <Text style={st.checkTx}>{tl('Compartilhar meu WhatsApp', 'Share my WhatsApp', 'Compartir mi WhatsApp', 'Condividi WhatsApp')}</Text>
                  </TouchableOpacity>
                  <View style={st.reqActs}>
                    <TouchableOpacity style={[st.actBtn, st.decline]} disabled={!!busy} onPress={() => decline(c)}><Text style={st.declineTx}>{tl('Recusar', 'Decline', 'Rechazar', 'Rifiuta')}</Text></TouchableOpacity>
                    <TouchableOpacity style={[st.actBtn, st.accept]} disabled={!!busy} onPress={() => accept(c)}><Text style={st.acceptTx}>{tl('Aceitar', 'Accept', 'Aceptar', 'Accetta')}</Text></TouchableOpacity>
                  </View>
                </View>
              ))}
            </>
          ) : null}

          <SectionLabel>{tl(`Minhas conexões${accepted.length ? ' · ' + accepted.length : ''}`, `My connections${accepted.length ? ' · ' + accepted.length : ''}`, `Mis conexiones${accepted.length ? ' · ' + accepted.length : ''}`, `Connessioni${accepted.length ? ' · ' + accepted.length : ''}`)}</SectionLabel>
          {!accepted.length ? (
            <View style={st.emptyCard}>
              <Ionicons name="people-outline" size={34} color={C.dim} />
              <Text style={st.emptyTx}>{tl('Seus matches 💘 e amizades 🤝 aparecem aqui.', 'Your matches 💘 and friends 🤝 show up here.', 'Tus matches 💘 y amistades 🤝 aparecen aqui.', 'I tuoi match 💘 e amicizie 🤝 appaiono qui.')}</Text>
            </View>
          ) : accepted.map((c) => (
            <View key={c.id} style={st.conn}>
              <Avatar name={c.otherName} photo={c.otherPhoto} size={46} />
              <View style={{ flex: 1, minWidth: 0 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={st.personName} numberOfLines={1}>{c.otherName || tl('Conexão', 'Connection', 'Conexión', 'Connessione')}</Text>
                  <View style={[st.kindBadge, { borderColor: connKind(c).color }]}><Text style={[st.kindTx, { color: connKind(c).color }]}>{connKind(c).emoji} {connKind(c).label}</Text></View>
                </View>
                {c.otherWhatsapp
                  ? <Text style={st.city}>{tl('WhatsApp liberado', 'WhatsApp shared', 'WhatsApp disponible', 'WhatsApp disponibile')}</Text>
                  : c.iShared ? <Text style={st.city} numberOfLines={1}>{tl('Aguardando o WhatsApp da outra pessoa', 'Waiting their WhatsApp', 'Esperando su WhatsApp', 'In attesa del WhatsApp')}</Text>
                    : null}
              </View>
              {c.otherWhatsapp ? (
                <TouchableOpacity style={st.wa} onPress={() => openWhatsapp(c.otherWhatsapp!)}><Ionicons name="logo-whatsapp" size={15} color="#04220f" /><Text style={st.waTx}>WhatsApp</Text></TouchableOpacity>
              ) : !c.iShared ? (
                <TouchableOpacity style={st.shareBtn} disabled={!!busy} onPress={() => doShare(c)}><Text style={st.shareTx}>{tl('Meu WhatsApp', 'My WhatsApp', 'Mi WhatsApp', 'Mio WhatsApp')}</Text></TouchableOpacity>
              ) : null}
              <TouchableOpacity onPress={() => connMenu(c)} style={st.blockBtn}><Ionicons name="ellipsis-vertical" size={16} color={C.faint} /></TouchableOpacity>
            </View>
          ))}

          {sent.length ? (
            <>
              <SectionLabel>{tl('Pedidos enviados', 'Sent requests', 'Enviadas', 'Inviate')}</SectionLabel>
              {sent.map((c) => (
                <View key={c.id} style={st.conn}>
                  <Avatar name={c.otherName} photo={c.otherPhoto} size={46} />
                  <View style={{ flex: 1, minWidth: 0 }}><Text style={st.personName} numberOfLines={1}>{c.otherName || '—'}</Text><Text style={st.city}>{tl('Aguardando aceite', 'Awaiting acceptance', 'Esperando', 'In attesa')}</Text></View>
                  <Ionicons name="time-outline" size={18} color={C.faint} />
                </View>
              ))}
            </>
          ) : null}
        </View>
      )}

      <IntroCarousel visible={showTour} slides={matchIntroSlides(language as any, false)} onClose={closeTour} labels={tourLabels} />

      {/* Busca por usuários (aberta pelo botão "Buscar" do baralho) */}
      <Modal visible={showList} animationType="slide" onRequestClose={() => setShowList(false)}>
        <View style={{ flex: 1, backgroundColor: C.void, paddingTop: insets.top + 12 }}>
          <View style={[st.head, { marginBottom: 8 }]}>
            <Text style={st.title}>{tl('Buscar pessoas', 'Search people', 'Buscar personas', 'Cerca persone')}</Text>
            <TouchableOpacity onPress={() => setShowList(false)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}><Ionicons name="close" size={26} color={C.faint} /></TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
            {/* Ser encontrável na busca por nome (independe de aparecer no baralho) */}
            <View style={[st.visChip, { alignSelf: 'flex-start', marginBottom: 14 }]}>
              <Ionicons name={visible ? 'eye' : 'eye-off-outline'} size={15} color={visible ? C.gold : C.faint} />
              <Text style={[st.visChipTx, { color: visible ? C.ink : C.faint }]}>{tl('Aparecer na busca', 'Appear in search', 'Aparecer en la busqueda', 'Appari nella ricerca')}</Text>
              <Switch value={visible} disabled={togglingVisible} onValueChange={toggleVisible} trackColor={{ true: C.gold, false: '#3a3a4a' }} thumbColor="#fff" style={{ transform: [{ scale: 0.75 }] }} />
            </View>
            <View style={st.search}>
              <Ionicons name="search" size={18} color={C.faint} />
              <TextInput style={st.searchInput} placeholder={tl('Buscar por nome', 'Search by name', 'Buscar por nombre', 'Cerca per nome')} placeholderTextColor={C.faint} value={term} onChangeText={setTerm} onSubmitEditing={doSearch} returnKeyType="search" autoCapitalize="none" autoFocus />
              {term ? <TouchableOpacity onPress={clearSearch}><Ionicons name="close-circle" size={18} color={C.faint} /></TouchableOpacity> : null}
            </View>
            {searchResults !== null ? (
              searching ? <ActivityIndicator color={C.gold} style={{ marginVertical: 16 }} /> :
                searchResults.length ? searchResults.map((p) => <PersonCard key={p.uid} uid={p.uid} name={p.displayName} photo={p.photoURL} sun={p.sunSign} moon={p.moonSign} asc={p.ascSign} city={p.city} />)
                  : <Text style={st.emptyTx}>{tl('Ninguém encontrado.', 'No one found.', 'Nadie encontrado.', 'Nessuno trovato.')}</Text>
            ) : (
              <View style={st.emptyCard}><Ionicons name="search" size={32} color={C.dim} /><Text style={st.emptyTx}>{tl('Digite um nome para buscar pessoas do app.', 'Type a name to search app users.', 'Escribe un nombre para buscar personas.', 'Scrivi un nome per cercare persone.')}</Text></View>
            )}
          </ScrollView>
        </View>
      </Modal>

      {/* "Conectado!" — ao aceitar, oferece o gancho pro core do app (grupo/sinastria) */}
      <Modal visible={!!justConnected} transparent animationType="fade" onRequestClose={() => setJustConnected(null)}>
        <View style={st.sheetBack}>
          <View style={st.sheet}>
            <Text style={st.sheetSpark}>🎉</Text>
            <Text style={st.sheetTitle}>{tl('Conectado!', 'Connected!', '¡Conectado!', 'Connesso!')}</Text>
            <Text style={st.sheetSub}>{tl(`Você e ${justConnected?.name || ''} estão conectados. Que tal criar um grupo pra ver a sinastria e as áreas da vida de vocês?`, `You and ${justConnected?.name || ''} are connected. Create a group to see your synastry and life areas?`, `Tú y ${justConnected?.name || ''} están conectados. ¿Crear un grupo para ver la sinastría?`, `Tu e ${justConnected?.name || ''} siete connessi. Creare un gruppo per la sinastria?`)}</Text>
            <TouchableOpacity style={st.sheetPrimary} onPress={() => { const jc = justConnected; setJustConnected(null); navigation.navigate('Groups', { createWith: jc }) }}>
              <Ionicons name="people" size={17} color="#0F0F23" />
              <Text style={st.sheetPrimaryTx}>{tl('Criar grupo com', 'Create group with', 'Crear grupo con', 'Crea gruppo con')} {justConnected?.name || tl('a pessoa', 'them', 'la persona', 'la persona')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={st.sheetGhost} onPress={() => setJustConnected(null)}>
              <Text style={st.sheetGhostTx}>{tl('Agora não', 'Not now', 'Ahora no', 'Non ora')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  )
}

const st = StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.void },
  kindBadge: { alignSelf: 'flex-start', borderWidth: 1, borderRadius: 10, paddingHorizontal: 7, paddingVertical: 1, marginTop: 3 },
  kindTx: { fontSize: 11, fontWeight: '800' },
  sheetBack: { flex: 1, backgroundColor: 'rgba(8,6,18,0.86)', justifyContent: 'center', alignItems: 'center', padding: 28 },
  sheet: { backgroundColor: C.surface, borderRadius: 22, borderWidth: 1, borderColor: C.line2, padding: 24, alignItems: 'center', width: '100%', maxWidth: 380 },
  sheetSpark: { fontSize: 38, marginBottom: 4 },
  sheetTitle: { color: C.ink, fontSize: 22, fontWeight: '900', marginBottom: 8 },
  sheetSub: { color: C.dim, fontSize: 14, lineHeight: 20, textAlign: 'center', marginBottom: 20 },
  sheetPrimary: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: C.gold, borderRadius: 14, paddingVertical: 14, paddingHorizontal: 20, alignSelf: 'stretch' },
  sheetPrimaryTx: { color: '#0F0F23', fontSize: 14.5, fontWeight: '800' },
  sheetGhost: { marginTop: 12, paddingVertical: 8 },
  sheetGhostTx: { color: C.faint, fontSize: 14, fontWeight: '600' },
  payCta: { marginTop: 26, backgroundColor: C.magenta, borderRadius: 14, paddingVertical: 15, paddingHorizontal: 28 },
  payCtaTx: { color: '#fff', fontSize: 15, fontWeight: '800' },
  pad: { paddingHorizontal: 16 },
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, marginBottom: 14 },
  title: { color: C.ink, fontSize: 30, fontWeight: '900', letterSpacing: -0.5 },
  meRing: { width: 42, height: 42, borderRadius: 21, padding: 2, backgroundColor: C.magenta },
  seg: { flexDirection: 'row', gap: 6, backgroundColor: C.surface, borderWidth: 1, borderColor: C.line, borderRadius: 14, padding: 5, marginHorizontal: 16, marginBottom: 18 },
  segBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 9, borderRadius: 10 },
  segOn: { backgroundColor: C.surface2 },
  segTx: { color: C.dim, fontWeight: '700', fontSize: 13.5 },
  segTxOn: { color: C.ink },
  segBadge: { minWidth: 18, paddingHorizontal: 5, borderRadius: 9, backgroundColor: C.magenta },
  segBadgeTx: { color: '#1a0410', fontSize: 10, fontWeight: '800', textAlign: 'center', lineHeight: 16 },

  sectRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8, marginBottom: 12 },
  sectLabel: { color: C.goldDeep, fontSize: 11.5, fontWeight: '800', letterSpacing: 1.2, textTransform: 'uppercase' },
  sectLine: { flex: 1, height: 1, backgroundColor: C.line2 },

  rail: { marginHorizontal: -16, paddingHorizontal: 16, marginBottom: 18 },
  mCard: { width: 150, marginRight: 12, borderRadius: 20, padding: 14, backgroundColor: C.surface, borderWidth: 1, borderColor: C.line2 },
  pct: { position: 'absolute', top: 12, right: 12, color: C.magenta, fontSize: 15, fontWeight: '800' },
  mName: { color: C.ink, fontSize: 14, fontWeight: '700', marginTop: 10 },
  mTrio: { color: C.dim, fontSize: 11, marginTop: 3, lineHeight: 15 },
  mConnect: { marginTop: 11, backgroundColor: C.gold, borderRadius: 10, paddingVertical: 8, alignItems: 'center' },
  mConnectTx: { color: '#1a1405', fontWeight: '800', fontSize: 12.5 },
  mDone: { marginTop: 11, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, paddingVertical: 8 },
  mDoneTx: { color: C.good, fontWeight: '700', fontSize: 12 },
  mSeeAll: { width: 150, borderRadius: 20, padding: 14, backgroundColor: 'rgba(255,215,0,0.06)', borderWidth: 1, borderColor: 'rgba(255,215,0,0.3)', justifyContent: 'center' },
  mSeeAllTx: { color: C.gold, fontWeight: '800', fontSize: 13.5, marginTop: 8 },
  mSeeAllSub: { color: C.dim, fontSize: 11, marginTop: 4, lineHeight: 15 },

  matchHero: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 18, padding: 15, marginBottom: 18, backgroundColor: 'rgba(255,77,141,0.08)', borderWidth: 1, borderColor: 'rgba(255,77,141,0.35)' },
  matchHeroIcon: { width: 44, height: 44, borderRadius: 12, backgroundColor: 'rgba(255,77,141,0.14)', alignItems: 'center', justifyContent: 'center' },
  matchHeroTitle: { color: C.ink, fontSize: 16, fontWeight: '800' },
  matchHeroSub: { color: C.dim, fontSize: 12.5, marginTop: 2, lineHeight: 16 },
  proTag: { backgroundColor: C.gold, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  proTagTx: { color: '#1a1405', fontWeight: '900', fontSize: 11, letterSpacing: 0.5 },
  search: { flexDirection: 'row', alignItems: 'center', gap: 9, backgroundColor: C.surface, borderWidth: 1, borderColor: C.line, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 4, marginBottom: 18 },
  searchInput: { flex: 1, color: C.ink, fontSize: 14, paddingVertical: 10 },

  person: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.surface, borderWidth: 1, borderColor: C.line, borderRadius: 18, padding: 13, marginBottom: 11 },
  personTap: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 13, minWidth: 0 },
  personName: { color: C.ink, fontSize: 15.5, fontWeight: '700', flex: 1 },
  trio: { color: '#cfc3ee', fontSize: 12, marginTop: 3 },
  city: { color: C.faint, fontSize: 11.5, marginTop: 2 },
  connectBtn: { backgroundColor: C.gold, borderRadius: 11, paddingHorizontal: 15, paddingVertical: 9, minWidth: 84, alignItems: 'center' },
  connectTx: { color: '#1a1405', fontWeight: '800', fontSize: 12.5 },
  doneTag: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8 },
  doneTagTx: { color: C.good, fontSize: 12, fontWeight: '600' },

  avatar: { backgroundColor: '#241f3a' },
  avatarFb: { alignItems: 'center', justifyContent: 'center' },
  avatarRing: { borderWidth: 2, borderColor: 'rgba(255,215,0,0.5)' },
  avatarInit: { color: C.gold, fontWeight: '800' },

  req: { backgroundColor: C.surface, borderWidth: 1, borderColor: C.line, borderRadius: 18, padding: 14, marginBottom: 12 },
  reqTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  checkRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12 },
  checkTx: { color: '#c9cfe0', fontSize: 13, flexShrink: 1 },
  reqActs: { flexDirection: 'row', gap: 9, marginTop: 14 },
  actBtn: { flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: 11 },
  decline: { backgroundColor: 'rgba(255,255,255,0.06)' },
  declineTx: { color: C.ink, fontWeight: '700', fontSize: 13 },
  accept: { backgroundColor: C.gold },
  acceptTx: { color: '#1a1405', fontWeight: '800', fontSize: 13 },

  conn: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: C.surface, borderWidth: 1, borderColor: C.line, borderRadius: 16, padding: 12, marginBottom: 10 },
  wa: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: C.good, borderRadius: 11, paddingHorizontal: 13, paddingVertical: 9 },
  waTx: { color: '#04220f', fontWeight: '800', fontSize: 12.5 },
  shareBtn: { backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 11, paddingHorizontal: 13, paddingVertical: 9 },
  shareTx: { color: C.ink, fontWeight: '700', fontSize: 12.5 },
  blockBtn: { padding: 4 },
  welcome: { marginHorizontal: 16, marginBottom: 16, borderRadius: 18, padding: 18, backgroundColor: 'rgba(255,77,141,0.07)', borderWidth: 1, borderColor: 'rgba(255,77,141,0.3)' },
  welcomeTop: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  welcomeTitle: { color: C.ink, fontSize: 18, fontWeight: '800' },
  welcomeBody: { color: '#c9cfe0', fontSize: 13.5, lineHeight: 20 },
  welcomeNote: { color: C.dim, fontSize: 12.5, lineHeight: 18, marginTop: 10 },
  welcomeBtn: { alignSelf: 'flex-start', marginTop: 14, backgroundColor: C.gold, borderRadius: 11, paddingHorizontal: 20, paddingVertical: 10 },
  welcomeBtnTx: { color: '#1a1405', fontWeight: '800', fontSize: 14 },
  nudge: { color: C.faint, fontSize: 12, lineHeight: 17, marginTop: 10, paddingHorizontal: 4 },

  emptyCard: { backgroundColor: C.surface, borderRadius: 18, padding: 24, alignItems: 'center', gap: 10, borderWidth: 1, borderColor: C.line, marginBottom: 12 },
  emptyTx: { color: C.dim, fontSize: 14, textAlign: 'center', lineHeight: 20 },
  goDiscover: { backgroundColor: C.gold, borderRadius: 11, paddingHorizontal: 18, paddingVertical: 10, marginTop: 4 },
  goDiscoverTx: { color: '#1a1405', fontWeight: '800', fontSize: 13 },

  visChip: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#161728', borderRadius: 20, paddingLeft: 10, paddingRight: 2, borderWidth: 1, borderColor: C.line },
  visChipTx: { fontSize: 12, fontWeight: '600' },
  visRow: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#12101f', borderRadius: 14, padding: 16, marginTop: 10, marginBottom: 8, borderWidth: 1, borderColor: C.line },
  visTitle: { color: C.ink, fontSize: 15, fontWeight: '700' },
  visSub: { color: C.dim, fontSize: 12, marginTop: 3, lineHeight: 17 },
})
