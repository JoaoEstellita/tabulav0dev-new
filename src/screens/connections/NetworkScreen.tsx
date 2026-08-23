import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, Linking, Image, StyleSheet, Alert, Switch, ActivityIndicator } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useAuth } from '../../hooks/useAuth'
import { useAppLanguage } from '../../hooks/useAppLanguage'
import { listConnections, respondConnection, shareWhatsapp, blockConnection, requestConnection, type Connection } from '../../services/ConnectionsService'
import { listPeople, ensureSelfDiscoverable, setDiscoverable, type PublicProfile } from '../../services/DiscoveryService'

export default function NetworkScreen() {
  const { user } = useAuth()
  const navigation = useNavigation<any>()
  const insets = useSafeAreaInsets()
  const { language } = useAppLanguage()
  const tl = (pt: string, en: string, es: string, it: string) =>
    language === 'en-US' ? en : language === 'es-ES' ? es : language === 'it-IT' ? it : pt

  const [items, setItems] = useState<Connection[]>([])
  const [people, setPeople] = useState<PublicProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState<string | null>(null)
  const [shareOnAccept, setShareOnAccept] = useState<Set<string>>(new Set())
  const [sentIds, setSentIds] = useState<Set<string>>(new Set())
  const [visible, setVisible] = useState(true)
  const [togglingVisible, setTogglingVisible] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    const [conns, self, ppl] = await Promise.all([
      listConnections().catch(() => ({ connections: [] as Connection[] })),
      ensureSelfDiscoverable().catch(() => ({ discoverable: true, published: false })),
      listPeople().catch(() => [] as PublicProfile[]),
    ])
    setItems(conns.connections)
    setVisible(self.discoverable)
    setPeople(ppl)
    setLoading(false)
  }, [])
  useEffect(() => { load() }, [load])

  const received = useMemo(() => items.filter((c) => c.status === 'pending' && c.requestedBy !== user?.uid), [items, user?.uid])
  const accepted = useMemo(() => items.filter((c) => c.status === 'accepted'), [items])
  // uids que já têm qualquer conexão (pra marcar no diretório)
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

  const connectPerson = async (p: PublicProfile) => {
    if (busy) return
    setBusy(`c:${p.uid}`)
    try {
      await requestConnection(p.uid, null, false)
      setSentIds((prev) => new Set(prev).add(p.uid))
    } catch { /* silencioso */ }
    setBusy(null)
  }

  const toggleVisible = async (next: boolean) => {
    setTogglingVisible(true)
    setVisible(next)
    try { await setDiscoverable(next) } catch { setVisible(!next) }
    setTogglingVisible(false)
  }

  const trioLine = (p: { sunSign: string | null; moonSign: string | null; ascSign: string | null }) => {
    const parts: string[] = []
    if (p.sunSign) parts.push(`☉ ${p.sunSign}`)
    if (p.moonSign) parts.push(`☽ ${p.moonSign}`)
    if (p.ascSign) parts.push(`ASC ${p.ascSign}`)
    return parts.join('  ·  ')
  }

  const Avatar = ({ name, photo, size = 44 }: { name?: string | null; photo?: string | null; size?: number }) => (
    photo
      ? <Image source={{ uri: photo }} style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]} />
      : <View style={[styles.avatar, styles.avatarFallback, { width: size, height: size, borderRadius: size / 2 }]}><Text style={styles.avatarInitial}>{(name || '?').slice(0, 1).toUpperCase()}</Text></View>
  )

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={{ padding: 16, paddingTop: insets.top + 12, paddingBottom: 40 }}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={load} tintColor="#FFD700" />}
    >
      <Text style={styles.title}>{tl('Rede', 'Network', 'Red', 'Rete')}</Text>
      <Text style={styles.subtitle}>{tl('Descubra com quem você combina e conecte-se.', 'Discover who matches you and connect.', 'Descubre con quien combinas y conecta.', 'Scopri con chi corrispondi e connettiti.')}</Text>

      <TouchableOpacity style={styles.heroMatch} activeOpacity={0.9} onPress={() => navigation.navigate('Matches')}>
        <Ionicons name="sparkles" size={26} color="#0B0A18" />
        <View style={{ flex: 1 }}>
          <Text style={styles.heroMatchTitle}>{tl('Quem mais combina comigo', 'Who matches me most', 'Quien combina mas conmigo', 'Chi mi corrisponde di piu')}</Text>
          <Text style={styles.heroMatchSub}>{tl('Seu ranking de compatibilidade astrológica', 'Your astrological compatibility ranking', 'Tu ranking de compatibilidad', 'La tua classifica di compatibilita')}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#0B0A18" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.heroFind} activeOpacity={0.9} onPress={() => navigation.navigate('Discover')}>
        <Ionicons name="search" size={22} color="#FFD700" />
        <View style={{ flex: 1 }}>
          <Text style={styles.heroFindTitle}>{tl('Encontrar pessoas', 'Find people', 'Encontrar personas', 'Trova persone')}</Text>
          <Text style={styles.heroFindSub}>{tl('Busque por nome e conecte-se', 'Search by name and connect', 'Busca por nombre y conecta', 'Cerca per nome e connettiti')}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#8892a4" />
      </TouchableOpacity>

      {received.length ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{tl('Pedidos recebidos', 'Requests received', 'Solicitudes recibidas', 'Richieste ricevute')}</Text>
          {received.map((c) => (
            <View key={c.id} style={styles.card}>
              <View style={styles.row}><Avatar name={c.otherName} photo={c.otherPhoto} /><Text style={styles.name} numberOfLines={1}>{c.otherName || tl('Alguém', 'Someone', 'Alguien', 'Qualcuno')}</Text></View>
              <TouchableOpacity style={styles.checkRow} onPress={() => setShareOnAccept((p) => { const n = new Set(p); n.has(c.id) ? n.delete(c.id) : n.add(c.id); return n })}>
                <Ionicons name={shareOnAccept.has(c.id) ? 'checkbox' : 'square-outline'} size={18} color="#FFD700" />
                <Text style={styles.checkLabel}>{tl('Compartilhar meu WhatsApp', 'Share my WhatsApp', 'Compartir mi WhatsApp', 'Condividi il mio WhatsApp')}</Text>
              </TouchableOpacity>
              <View style={styles.actions}>
                <TouchableOpacity style={[styles.btn, styles.btnGhost]} disabled={!!busy} onPress={() => decline(c)}><Text style={styles.btnGhostText}>{tl('Recusar', 'Decline', 'Rechazar', 'Rifiuta')}</Text></TouchableOpacity>
                <TouchableOpacity style={[styles.btn, styles.btnPrimary]} disabled={!!busy} onPress={() => accept(c)}><Text style={styles.btnPrimaryText}>{tl('Aceitar', 'Accept', 'Aceptar', 'Accetta')}</Text></TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      ) : null}

      {/* Diretório — todas as pessoas visíveis na Rede */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{tl('Pessoas', 'People', 'Personas', 'Persone')}</Text>
        {loading && !people.length ? (
          <ActivityIndicator color="#FFD700" style={{ marginVertical: 20 }} />
        ) : !people.length ? (
          <View style={styles.emptyCard}>
            <Ionicons name="planet-outline" size={34} color="#8892a4" />
            <Text style={styles.empty}>{tl('Ainda não há pessoas visíveis.', 'No visible people yet.', 'Aun no hay personas visibles.', 'Ancora nessuna persona visibile.')}</Text>
          </View>
        ) : people.map((p) => {
          const already = connectedUids.has(p.uid) || sentIds.has(p.uid)
          return (
            <View key={p.uid} style={styles.personCard}>
              <Avatar name={p.displayName} photo={p.photoURL} size={48} />
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={styles.name} numberOfLines={1}>{p.displayName || tl('Alguém', 'Someone', 'Alguien', 'Qualcuno')}</Text>
                {trioLine(p) ? <Text style={styles.trio} numberOfLines={1}>{trioLine(p)}</Text> : null}
                {p.city ? <Text style={styles.city} numberOfLines={1}>{p.city}</Text> : null}
              </View>
              {already ? (
                <View style={styles.connectedTag}><Ionicons name="checkmark" size={14} color="#22C55E" /><Text style={styles.connectedTagText}>{tl('Enviado', 'Sent', 'Enviado', 'Inviato')}</Text></View>
              ) : (
                <TouchableOpacity style={styles.connectBtn} disabled={busy === `c:${p.uid}`} onPress={() => connectPerson(p)}>
                  {busy === `c:${p.uid}` ? <ActivityIndicator size="small" color="#0B0A18" /> : <Text style={styles.connectBtnText}>{tl('Conectar', 'Connect', 'Conectar', 'Connetti')}</Text>}
                </TouchableOpacity>
              )}
            </View>
          )
        })}
      </View>

      {accepted.length ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{tl('Minhas conexões', 'My connections', 'Mis conexiones', 'Le mie connessioni')}</Text>
          {accepted.map((c) => (
            <View key={c.id} style={styles.card}>
              <View style={styles.row}>
                <Avatar name={c.otherName} photo={c.otherPhoto} />
                <Text style={styles.name} numberOfLines={1}>{c.otherName || tl('Conexão', 'Connection', 'Conexión', 'Connessione')}</Text>
                <TouchableOpacity onPress={() => doBlock(c)} style={styles.blockBtn}><Ionicons name="ban-outline" size={16} color="#8892a4" /></TouchableOpacity>
              </View>
              {c.otherWhatsapp ? (
                <TouchableOpacity style={[styles.btn, styles.btnWa]} onPress={() => openWhatsapp(c.otherWhatsapp!)}><Ionicons name="logo-whatsapp" size={16} color="#0B0A18" /><Text style={styles.btnWaText}>{tl('Abrir WhatsApp', 'Open WhatsApp', 'Abrir WhatsApp', 'Apri WhatsApp')}</Text></TouchableOpacity>
              ) : !c.iShared ? (
                <TouchableOpacity style={[styles.btn, styles.btnGhost]} disabled={!!busy} onPress={() => doShare(c)}><Text style={styles.btnGhostText}>{tl('Compartilhar meu WhatsApp', 'Share my WhatsApp', 'Compartir mi WhatsApp', 'Condividi il mio WhatsApp')}</Text></TouchableOpacity>
              ) : (
                <Text style={styles.waiting}>{tl('Aguardando a outra pessoa compartilhar o WhatsApp.', 'Waiting for the other person to share WhatsApp.', 'Esperando que la otra persona comparta WhatsApp.', 'In attesa che l\'altra persona condivida WhatsApp.')}</Text>
              )}
            </View>
          ))}
        </View>
      ) : null}

      {/* Visibilidade */}
      <View style={styles.visibleRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.visibleTitle}>{tl('Apareço na Rede', 'I appear in the Network', 'Aparezco en la Red', 'Compaio nella Rete')}</Text>
          <Text style={styles.visibleSub}>{tl('Outras pessoas podem me encontrar (foto, nome e signos). Nunca sua data ou local de nascimento.', 'Others can find me (photo, name and signs). Never your birth date or place.', 'Otros pueden encontrarme (foto, nombre y signos). Nunca tu fecha o lugar de nacimiento.', 'Altri possono trovarmi (foto, nome e segni). Mai la tua data o luogo di nascita.')}</Text>
        </View>
        <Switch value={visible} disabled={togglingVisible} onValueChange={toggleVisible} trackColor={{ true: '#FFD700', false: '#3a3a4a' }} thumbColor="#fff" />
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0F0F23' },
  title: { color: '#FFFFFF', fontSize: 26, fontWeight: '800' },
  subtitle: { color: '#8892a4', fontSize: 14, marginTop: 4, marginBottom: 18 },
  heroMatch: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#FFD700', borderRadius: 16, padding: 16, marginBottom: 12 },
  heroMatchTitle: { color: '#0B0A18', fontSize: 16, fontWeight: '800' },
  heroMatchSub: { color: '#3a2f00', fontSize: 12, marginTop: 2 },
  heroFind: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#161728', borderRadius: 16, padding: 16, marginBottom: 22, borderWidth: 1, borderColor: 'rgba(255,215,0,0.3)' },
  heroFindTitle: { color: '#e2e8f0', fontSize: 16, fontWeight: '700' },
  heroFindSub: { color: '#8892a4', fontSize: 12, marginTop: 2 },
  section: { marginBottom: 20 },
  sectionTitle: { color: '#FFD700', fontSize: 13, fontWeight: '700', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 },
  card: { backgroundColor: '#161728', borderRadius: 14, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  personCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#161728', borderRadius: 14, padding: 12, marginBottom: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  emptyCard: { backgroundColor: '#161728', borderRadius: 14, padding: 24, alignItems: 'center', gap: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatar: { backgroundColor: '#12101f' },
  avatarFallback: { alignItems: 'center', justifyContent: 'center' },
  avatarInitial: { color: '#FFD700', fontSize: 18, fontWeight: '700' },
  name: { color: '#e2e8f0', fontSize: 16, fontWeight: '600', flex: 1 },
  trio: { color: '#c9cfe0', fontSize: 12.5, marginTop: 3 },
  city: { color: '#8892a4', fontSize: 12, marginTop: 2 },
  blockBtn: { padding: 6 },
  empty: { color: '#e2e8f0', fontSize: 15, fontWeight: '600', textAlign: 'center', marginTop: 4 },
  connectBtn: { backgroundColor: '#FFD700', paddingHorizontal: 16, paddingVertical: 9, borderRadius: 10, minWidth: 88, alignItems: 'center' },
  connectBtnText: { color: '#0B0A18', fontWeight: '700', fontSize: 13 },
  connectedTag: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10 },
  connectedTagText: { color: '#22C55E', fontSize: 12, fontWeight: '600' },
  checkRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12 },
  checkLabel: { color: '#c9cfe0', fontSize: 13, flexShrink: 1 },
  actions: { flexDirection: 'row', gap: 10, marginTop: 14 },
  btn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: 10, flex: 1 },
  btnPrimary: { backgroundColor: '#FFD700' },
  btnPrimaryText: { color: '#0B0A18', fontWeight: '700', fontSize: 14 },
  btnGhost: { backgroundColor: 'rgba(255,255,255,0.06)' },
  btnGhostText: { color: '#e2e8f0', fontWeight: '600', fontSize: 14 },
  btnWa: { backgroundColor: '#22C55E', marginTop: 12 },
  btnWaText: { color: '#0B0A18', fontWeight: '700', fontSize: 14 },
  waiting: { color: '#8892a4', fontSize: 12, marginTop: 12, fontStyle: 'italic' },
  visibleRow: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#12101f', borderRadius: 14, padding: 16, marginTop: 4, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  visibleTitle: { color: '#e2e8f0', fontSize: 15, fontWeight: '700' },
  visibleSub: { color: '#8892a4', fontSize: 12, marginTop: 3, lineHeight: 17 },
})
