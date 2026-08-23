import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, ActivityIndicator, Modal, Alert } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useAppLanguage } from '../../hooks/useAppLanguage'
import { useAuth } from '../../hooks/useAuth'
import { getSynastry, type PublicProfile, type SynastryAspect } from '../../services/DiscoveryService'
import { listConnections, requestConnection, removeConnection, type Connection } from '../../services/ConnectionsService'
import GroupService, { type Group } from '../../services/firebase/GroupService'
import InviteService from '../../services/InviteService'

const C = {
  void: '#0F0F23', surface: '#161728', surface2: '#1E2038',
  line: 'rgba(255,255,255,0.07)', line2: 'rgba(255,255,255,0.12)',
  ink: '#EDEBF7', dim: '#9A9CB8', faint: '#6E6F8C',
  gold: '#FFD700', goldDeep: '#C9A227', magenta: '#FF4D8D', good: '#22C55E',
}
const PLANET_GLYPH: Record<string, string> = {
  sun: '☉', moon: '☽', mercury: '☿', venus: '♀', mars: '♂',
  jupiter: '♃', saturn: '♄', uranus: '♅', neptune: '♆', pluto: '♇',
}

export default function PersonProfileScreen() {
  const navigation = useNavigation<any>()
  const route = useRoute<any>()
  const insets = useSafeAreaInsets()
  const { language } = useAppLanguage()
  const tl = (pt: string, en: string, es: string, it: string) =>
    language === 'en-US' ? en : language === 'es-ES' ? es : language === 'it-IT' ? it : pt

  const params = (route.params || {}) as Partial<PublicProfile> & { uid: string }
  const uid = params.uid
  const [target, setTarget] = useState<PublicProfile | null>(params.uid ? { uid: params.uid, displayName: params.displayName || '', photoURL: params.photoURL || null, sunSign: params.sunSign || null, moonSign: params.moonSign || null, ascSign: params.ascSign || null, city: params.city || null } : null)
  const [premium, setPremium] = useState<boolean>(false)
  const [score, setScore] = useState<number | null>(null)
  const [aspects, setAspects] = useState<SynastryAspect[] | undefined>(undefined)
  const [conns, setConns] = useState<Connection[]>([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [sentLocal, setSentLocal] = useState(false)
  // convidar para grupo
  const { user } = useAuth()
  const [groupPicker, setGroupPicker] = useState(false)
  const [myGroups, setMyGroups] = useState<Group[] | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    const [syn, cl] = await Promise.all([
      getSynastry(uid).catch(() => ({ premium: false } as any)),
      listConnections().catch(() => ({ connections: [] as Connection[] })),
    ])
    if (syn.target) setTarget(syn.target)
    setPremium(!!syn.premium)
    setScore(syn.score ?? null)
    setAspects(syn.aspects)
    setConns(cl.connections)
    setLoading(false)
  }, [uid])
  useEffect(() => { load() }, [load])

  const conn = useMemo(() => conns.find((c) => c.other === uid), [conns, uid])
  const status: 'none' | 'pending' | 'accepted' = conn ? (conn.status === 'accepted' ? 'accepted' : 'pending') : (sentLocal ? 'pending' : 'none')

  const doConnect = async () => {
    if (sending) return
    setSending(true)
    try { await requestConnection(uid, null, false); setSentLocal(true) } catch { /* */ }
    setSending(false)
  }

  const openGroupPicker = async () => {
    setGroupPicker(true)
    if (myGroups === null && user?.uid) {
      try { setMyGroups(await GroupService.getUserGroups(user.uid)) } catch { setMyGroups([]) }
    }
  }
  const inviteToGroup = async (g: Group) => {
    setGroupPicker(false)
    if (!g.inviteCode) return
    try { await InviteService.shareInvite(g.inviteCode, g.name) } catch { /* */ }
  }
  const doRemove = () => Alert.alert(
    tl('Desfazer conexão', 'Remove connection', 'Deshacer conexión', 'Rimuovi connessione'),
    tl('Vocês deixam de estar conectados.', 'You will no longer be connected.', 'Dejaran de estar conectados.', 'Non sarete piu connessi.'),
    [{ text: tl('Cancelar', 'Cancel', 'Cancelar', 'Annulla'), style: 'cancel' },
     { text: tl('Desfazer', 'Remove', 'Quitar', 'Rimuovi'), style: 'destructive', onPress: async () => { try { await removeConnection(uid) } catch { /* */ } ; load() } }],
  )

  const aspectLabel = (labelPt: string) => {
    const m = labelPt.toLowerCase()
    if (m.includes('conjun')) return tl('conjunção', 'conjunction', 'conjuncion', 'congiunzione')
    if (m.includes('trig') || m.includes('tríg')) return tl('trígono', 'trine', 'trigono', 'trigono')
    if (m.includes('sext')) return tl('sextil', 'sextile', 'sextil', 'sestile')
    if (m.includes('quadr')) return tl('quadratura', 'square', 'cuadratura', 'quadratura')
    if (m.includes('opos')) return tl('oposição', 'opposition', 'oposicion', 'opposizione')
    return labelPt
  }
  const trio = target ? [target.sunSign && `☉ ${target.sunSign}`, target.moonSign && `☽ ${target.moonSign}`, target.ascSign && `ASC ${target.ascSign}`].filter(Boolean).join('  ·  ') : ''
  const name = target?.displayName || tl('Pessoa', 'Person', 'Persona', 'Persona')

  return (
    <ScrollView style={s.screen} contentContainerStyle={{ paddingTop: insets.top + 8, paddingBottom: 40 }}>
      <TouchableOpacity style={s.back} onPress={() => navigation.goBack()}>
        <Ionicons name="chevron-back" size={24} color={C.ink} />
      </TouchableOpacity>

      {/* Cabeçalho da pessoa */}
      <View style={s.hero}>
        {target?.photoURL
          ? <Image source={{ uri: target.photoURL }} style={s.avatar} />
          : <View style={[s.avatar, s.avatarFb]}><Text style={s.avatarInit}>{name.slice(0, 1).toUpperCase()}</Text></View>}
        <Text style={s.name} numberOfLines={2}>{name}</Text>
        {trio ? <Text style={s.trio}>{trio}</Text> : null}
        {target?.city ? <Text style={s.city}><Ionicons name="location-outline" size={13} color={C.faint} /> {target.city}</Text> : null}

        {status === 'accepted' ? (
          <View style={[s.cta, s.ctaDone]}><Ionicons name="checkmark-circle" size={18} color={C.good} /><Text style={s.ctaDoneTx}>{tl('Conectados', 'Connected', 'Conectados', 'Connessi')}</Text></View>
        ) : status === 'pending' ? (
          <View style={[s.cta, s.ctaPending]}><Ionicons name="time-outline" size={18} color={C.gold} /><Text style={s.ctaPendingTx}>{tl('Pedido enviado', 'Request sent', 'Solicitud enviada', 'Richiesta inviata')}</Text></View>
        ) : (
          <TouchableOpacity style={s.cta} onPress={doConnect} disabled={sending}>
            {sending ? <ActivityIndicator size="small" color="#1a1405" /> : <><Ionicons name="person-add" size={17} color="#1a1405" /><Text style={s.ctaTx}>{tl('Conectar', 'Connect', 'Conectar', 'Connetti')}</Text></>}
          </TouchableOpacity>
        )}
      </View>

      {/* Sinastria — paga */}
      <View style={s.block}>
        <Text style={s.blockTitle}>{tl('Compatibilidade com você', 'Compatibility with you', 'Compatibilidad contigo', 'Compatibilita con te')}</Text>
        {loading ? (
          <ActivityIndicator color={C.gold} style={{ marginVertical: 20 }} />
        ) : !premium ? (
          <TouchableOpacity style={s.locked} activeOpacity={0.9} onPress={() => navigation.navigate('Premium', { openTab: 'features' })}>
            <View style={s.lockIcon}><Ionicons name="lock-closed" size={20} color={C.magenta} /></View>
            <View style={{ flex: 1 }}>
              <Text style={s.lockTitle}>{tl('Descubra o quanto vocês combinam', 'Discover how much you match', 'Descubre cuanto combinan', 'Scopri quanto corrispondete')}</Text>
              <Text style={s.lockSub}>{tl('Índice de compatibilidade e aspectos entre seus mapas — no plano Pro.', 'Compatibility index and aspects between your charts — on the Pro plan.', 'Indice de compatibilidad y aspectos — en el plan Pro.', 'Indice di compatibilita e aspetti — nel piano Pro.')}</Text>
            </View>
            <View style={s.proTag}><Text style={s.proTagTx}>PRO</Text></View>
          </TouchableOpacity>
        ) : (
          <>
            {typeof score === 'number' ? (
              <View style={s.scoreRow}>
                <Text style={s.scoreBig}>{score}<Text style={s.scorePct}>%</Text></Text>
                <Text style={s.scoreCaption}>{score >= 75 ? tl('Alta afinidade', 'High affinity', 'Alta afinidad', 'Alta affinita') : score >= 55 ? tl('Boa sintonia', 'Good harmony', 'Buena sintonia', 'Buona sintonia') : tl('Afinidade sutil', 'Subtle affinity', 'Afinidad sutil', 'Affinita sottile')}</Text>
              </View>
            ) : null}
            {aspects && aspects.length ? (
              <View style={s.aspList}>
                {aspects.slice(0, 12).map((a, i) => (
                  <View key={i} style={s.aspRow}>
                    <Text style={s.aspGlyph}>{PLANET_GLYPH[a.mine] || '•'}<Text style={s.aspMid}> {aspectLabel(a.aspect)} </Text>{PLANET_GLYPH[a.theirs] || '•'}</Text>
                    <Text style={s.aspOrb}>{a.orb}°</Text>
                  </View>
                ))}
              </View>
            ) : <Text style={s.dimTx}>{tl('Sem aspectos relevantes entre os mapas.', 'No relevant aspects between the charts.', 'Sin aspectos relevantes.', 'Nessun aspetto rilevante.')}</Text>}
          </>
        )}
      </View>

      {/* Ações — quando conectados */}
      {status === 'accepted' ? (
        <View style={s.block}>
          <Text style={s.blockTitle}>{tl('Ações', 'Actions', 'Acciones', 'Azioni')}</Text>
          <TouchableOpacity style={s.actionRow} onPress={openGroupPicker}>
            <View style={s.actionIcon}><Ionicons name="people" size={18} color={C.gold} /></View>
            <Text style={s.actionTx}>{tl('Convidar para um grupo', 'Invite to a group', 'Invitar a un grupo', 'Invita a un gruppo')}</Text>
            <Ionicons name="chevron-forward" size={18} color={C.faint} />
          </TouchableOpacity>
          <Text style={s.dimTx}>{tl('Para ver o mapa completo, adicione a pessoa a um grupo em comum.', 'To see the full chart, add the person to a shared group.', 'Para ver el mapa completo, agrega a la persona a un grupo en comun.', 'Per vedere la carta completa, aggiungi la persona a un gruppo comune.')}</Text>
          <TouchableOpacity style={s.removeRow} onPress={doRemove}>
            <Ionicons name="close-circle-outline" size={17} color={C.faint} />
            <Text style={s.removeTx}>{tl('Desfazer conexão', 'Remove connection', 'Deshacer conexión', 'Rimuovi connessione')}</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {/* Modal escolher grupo */}
      <Modal visible={groupPicker} transparent animationType="fade" onRequestClose={() => setGroupPicker(false)}>
        <TouchableOpacity style={s.modalBg} activeOpacity={1} onPress={() => setGroupPicker(false)}>
          <View style={s.modalCard}>
            <Text style={s.modalTitle}>{tl('Convidar para qual grupo?', 'Invite to which group?', '¿A qué grupo?', 'In quale gruppo?')}</Text>
            {myGroups === null ? (
              <ActivityIndicator color={C.gold} style={{ marginVertical: 20 }} />
            ) : !myGroups.length ? (
              <Text style={s.dimTx}>{tl('Você ainda não tem grupos. Crie um na aba Grupos.', 'You have no groups yet. Create one in the Groups tab.', 'Aun no tienes grupos. Crea uno en Grupos.', 'Non hai gruppi. Creane uno in Gruppi.')}</Text>
            ) : myGroups.map((g) => (
              <TouchableOpacity key={g.id} style={s.groupRow} onPress={() => inviteToGroup(g)}>
                <Ionicons name="people-circle-outline" size={22} color={C.gold} />
                <Text style={s.groupName} numberOfLines={1}>{g.name}</Text>
                <Ionicons name="share-outline" size={18} color={C.dim} />
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </ScrollView>
  )
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.void },
  back: { paddingHorizontal: 12, paddingVertical: 6, alignSelf: 'flex-start' },
  hero: { alignItems: 'center', paddingHorizontal: 20, paddingTop: 8, paddingBottom: 20 },
  avatar: { width: 104, height: 104, borderRadius: 52, backgroundColor: '#241f3a', borderWidth: 2, borderColor: 'rgba(255,215,0,0.4)' },
  avatarFb: { alignItems: 'center', justifyContent: 'center' },
  avatarInit: { color: C.gold, fontSize: 42, fontWeight: '800' },
  name: { color: C.ink, fontSize: 24, fontWeight: '800', marginTop: 14, textAlign: 'center' },
  trio: { color: '#cfc3ee', fontSize: 14, marginTop: 6 },
  city: { color: C.faint, fontSize: 13, marginTop: 6 },
  cta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: C.gold, borderRadius: 13, paddingHorizontal: 26, paddingVertical: 12, marginTop: 18 },
  ctaTx: { color: '#1a1405', fontWeight: '800', fontSize: 15 },
  ctaDone: { backgroundColor: 'rgba(34,197,94,0.12)', borderWidth: 1, borderColor: 'rgba(34,197,94,0.4)' },
  ctaDoneTx: { color: C.good, fontWeight: '700', fontSize: 15 },
  ctaPending: { backgroundColor: 'rgba(255,215,0,0.1)', borderWidth: 1, borderColor: 'rgba(255,215,0,0.35)' },
  ctaPendingTx: { color: C.gold, fontWeight: '700', fontSize: 15 },
  block: { marginHorizontal: 16, marginBottom: 16, backgroundColor: C.surface, borderRadius: 18, borderWidth: 1, borderColor: C.line, padding: 16 },
  blockTitle: { color: C.gold, fontSize: 13, fontWeight: '800', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 12 },
  locked: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  lockIcon: { width: 42, height: 42, borderRadius: 11, backgroundColor: 'rgba(255,77,141,0.14)', alignItems: 'center', justifyContent: 'center' },
  lockTitle: { color: C.ink, fontSize: 14.5, fontWeight: '700' },
  lockSub: { color: C.dim, fontSize: 12.5, marginTop: 3, lineHeight: 17 },
  proTag: { backgroundColor: C.gold, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  proTagTx: { color: '#1a1405', fontWeight: '900', fontSize: 11, letterSpacing: 0.5 },
  scoreRow: { flexDirection: 'row', alignItems: 'baseline', gap: 12, marginBottom: 14 },
  scoreBig: { color: C.magenta, fontSize: 46, fontWeight: '900' },
  scorePct: { fontSize: 24 },
  scoreCaption: { color: C.dim, fontSize: 14, fontWeight: '600' },
  aspList: { gap: 8 },
  aspRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: C.surface2, borderRadius: 10, paddingHorizontal: 13, paddingVertical: 10 },
  aspGlyph: { color: C.ink, fontSize: 15, fontWeight: '600' },
  aspMid: { color: C.dim, fontSize: 13, fontWeight: '400' },
  aspOrb: { color: C.faint, fontSize: 12 },
  dimTx: { color: C.dim, fontSize: 13, lineHeight: 19 },
  actionRow: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: C.surface2, borderRadius: 12, padding: 13, marginBottom: 12 },
  actionIcon: { width: 38, height: 38, borderRadius: 10, backgroundColor: 'rgba(255,215,0,0.12)', alignItems: 'center', justifyContent: 'center' },
  actionTx: { flex: 1, color: C.ink, fontSize: 15, fontWeight: '700' },
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', paddingHorizontal: 24 },
  modalCard: { backgroundColor: C.surface, borderRadius: 20, padding: 20, borderWidth: 1, borderColor: C.line2 },
  modalTitle: { color: C.ink, fontSize: 17, fontWeight: '800', marginBottom: 16 },
  groupRow: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: C.surface2, borderRadius: 12, padding: 14, marginBottom: 8 },
  groupName: { flex: 1, color: C.ink, fontSize: 15, fontWeight: '600' },
  removeRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 14, alignSelf: 'flex-start' },
  removeTx: { color: C.faint, fontSize: 13, fontWeight: '600' },
})
