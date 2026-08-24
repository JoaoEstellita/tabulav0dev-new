import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, Linking, Image, StyleSheet, Alert, Switch, ActivityIndicator, TextInput } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useAuth } from '../../hooks/useAuth'
import { useAppLanguage } from '../../hooks/useAppLanguage'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { listConnections, respondConnection, shareWhatsapp, blockConnection, removeConnection, requestConnection, type Connection } from '../../services/ConnectionsService'
import { listPeople, ensureSelfDiscoverable, setDiscoverable, searchProfiles, type PublicProfile } from '../../services/DiscoveryService'

const WELCOME_KEY = 'network_welcome_seen_v1'

// Paleta da Rede (mockup aprovado): índigo profundo + dourado (identidade) + magenta (match/sinastria)
const C = {
  void: '#0F0F23', surface: '#161728', surface2: '#1E2038',
  line: 'rgba(255,255,255,0.07)', line2: 'rgba(255,255,255,0.12)',
  ink: '#EDEBF7', dim: '#9A9CB8', faint: '#6E6F8C',
  gold: '#FFD700', goldDeep: '#C9A227', magenta: '#FF4D8D', good: '#22C55E',
}
type Page = 'connections' | 'discover'

export default function NetworkScreen() {
  const { user } = useAuth()
  const navigation = useNavigation<any>()
  const insets = useSafeAreaInsets()
  const { language } = useAppLanguage()
  const tl = (pt: string, en: string, es: string, it: string) =>
    language === 'en-US' ? en : language === 'es-ES' ? es : language === 'it-IT' ? it : pt

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
  const accept = (c: Connection) => run(`a:${c.id}`, () => respondConnection(c.other, true, shareOnAccept.has(c.id)))
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

  return (
    <ScrollView
      style={st.screen}
      contentContainerStyle={{ paddingTop: insets.top + 12, paddingBottom: 40 }}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={() => load(true)} tintColor={C.gold} />}
    >
      {/* Header */}
      <View style={st.head}>
        <Text style={st.title}>Re<Text style={{ color: C.magenta }}>de</Text></Text>
        <View style={st.visChip}>
          <Ionicons name={visible ? 'eye' : 'eye-off-outline'} size={15} color={visible ? C.gold : C.faint} />
          <Text style={[st.visChipTx, { color: visible ? C.ink : C.faint }]}>{tl('Na Rede', 'In Network', 'En la Red', 'Nella Rete')}</Text>
          <Switch value={visible} disabled={togglingVisible} onValueChange={toggleVisible} trackColor={{ true: C.gold, false: '#3a3a4a' }} thumbColor="#fff" style={{ transform: [{ scale: 0.75 }] }} />
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
        <TouchableOpacity style={[st.segBtn, page === 'connections' && st.segOn]} onPress={() => setPage('connections')}>
          <Text style={[st.segTx, page === 'connections' && st.segTxOn]}>{tl('Conexões', 'Connections', 'Conexiones', 'Connessioni')}</Text>
          {received.length ? <View style={st.segBadge}><Text style={st.segBadgeTx}>{received.length}</Text></View> : null}
        </TouchableOpacity>
        <TouchableOpacity style={[st.segBtn, page === 'discover' && st.segOn]} onPress={() => setPage('discover')}>
          <Text style={[st.segTx, page === 'discover' && st.segTxOn]}>{tl('Descobrir', 'Discover', 'Descubrir', 'Scopri')}</Text>
        </TouchableOpacity>
      </View>

      {loading && !items.length && !people.length ? (
        <ActivityIndicator color={C.gold} style={{ marginTop: 40 }} />
      ) : page === 'discover' ? (
        <View style={st.pad}>
          {/* Acesso ao Match premium — recurso à parte, varre todos os usuários */}
          <TouchableOpacity style={st.matchHero} activeOpacity={0.9} onPress={() => navigation.navigate('Matches')}>
            <View style={st.matchHeroIcon}><Ionicons name="sparkles" size={22} color={C.magenta} /></View>
            <View style={{ flex: 1 }}>
              <Text style={st.matchHeroTitle}>{tl('Quem mais combina comigo', 'Who matches me most', 'Quien combina mas conmigo', 'Chi mi corrisponde di piu')}</Text>
              <Text style={st.matchHeroSub}>{tl('Ranking de compatibilidade entre todos', 'Compatibility ranking across everyone', 'Ranking de compatibilidad con todos', 'Classifica di compatibilita con tutti')}</Text>
            </View>
            <Ionicons name="lock-closed" size={17} color={C.gold} />
          </TouchableOpacity>

          {/* Busca */}
          <View style={st.search}>
            <Ionicons name="search" size={18} color={C.faint} />
            <TextInput
              style={st.searchInput}
              placeholder={tl('Buscar pessoas por nome', 'Search people by name', 'Buscar personas por nombre', 'Cerca persone per nome')}
              placeholderTextColor={C.faint}
              value={term}
              onChangeText={setTerm}
              onSubmitEditing={doSearch}
              returnKeyType="search"
              autoCapitalize="none"
            />
            {term ? <TouchableOpacity onPress={clearSearch}><Ionicons name="close-circle" size={18} color={C.faint} /></TouchableOpacity> : null}
          </View>

          {/* Resultados da busca OU feed */}
          {searchResults !== null ? (
            <>
              <SectionLabel>{tl('Resultados', 'Results', 'Resultados', 'Risultati')}</SectionLabel>
              {searching ? <ActivityIndicator color={C.gold} style={{ marginVertical: 16 }} /> :
                searchResults.length ? searchResults.map((p) => <PersonCard key={p.uid} uid={p.uid} name={p.displayName} photo={p.photoURL} sun={p.sunSign} moon={p.moonSign} asc={p.ascSign} city={p.city} />)
                  : <Text style={st.emptyTx}>{tl('Ninguém encontrado. Tente outro nome.', 'No one found. Try another name.', 'Nadie encontrado. Prueba otro nombre.', 'Nessuno trovato. Prova un altro nome.')}</Text>}
            </>
          ) : (
            <>
              <SectionLabel>{tl('Pessoas na Rede', 'People in the Network', 'Personas en la Red', 'Persone nella Rete')}</SectionLabel>
              {people.length ? people.map((p) => <PersonCard key={p.uid} uid={p.uid} name={p.displayName} photo={p.photoURL} sun={p.sunSign} moon={p.moonSign} asc={p.ascSign} city={p.city} />)
                : <View style={st.emptyCard}><Ionicons name="planet-outline" size={34} color={C.dim} /><Text style={st.emptyTx}>{tl('Ainda não há pessoas visíveis.', 'No visible people yet.', 'Aun no hay personas visibles.', 'Ancora nessuna persona.')}</Text></View>}
            </>
          )}

          {visible ? (
            <Text style={st.nudge}>{tl('Dica: perfis com foto e cidade recebem mais conexões — edite na aba Perfil.', 'Tip: profiles with photo and city get more connections — edit them in the Profile tab.', 'Tip: perfiles con foto y ciudad reciben mas conexiones — editalos en Perfil.', 'Suggerimento: profili con foto e citta ricevono piu connessioni — modificali in Profilo.')}</Text>
          ) : null}
        </View>
      ) : (
        /* ===== CONEXÕES ===== */
        <View style={st.pad}>
          {received.length ? (
            <>
              <SectionLabel>{tl(`✦ ${received.length} ${received.length === 1 ? 'pedido esperando' : 'pedidos esperando'}`, `✦ ${received.length} waiting`, `✦ ${received.length} esperando`, `✦ ${received.length} in attesa`)}</SectionLabel>
              {received.map((c) => (
                <View key={c.id} style={st.req}>
                  <View style={st.reqTop}><Avatar name={c.otherName} photo={c.otherPhoto} size={46} /><Text style={st.personName} numberOfLines={1}>{c.otherName || tl('Alguém', 'Someone', 'Alguien', 'Qualcuno')}</Text></View>
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
              <Text style={st.emptyTx}>{tl('Você ainda não tem conexões.', 'No connections yet.', 'Aun no tienes conexiones.', 'Nessuna connessione.')}</Text>
              <TouchableOpacity style={st.goDiscover} onPress={() => setPage('discover')}><Text style={st.goDiscoverTx}>{tl('Encontrar pessoas', 'Find people', 'Encontrar personas', 'Trova persone')}</Text></TouchableOpacity>
            </View>
          ) : accepted.map((c) => (
            <View key={c.id} style={st.conn}>
              <Avatar name={c.otherName} photo={c.otherPhoto} size={46} />
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={st.personName} numberOfLines={1}>{c.otherName || tl('Conexão', 'Connection', 'Conexión', 'Connessione')}</Text>
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
    </ScrollView>
  )
}

const st = StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.void },
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
