import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, Linking, Image, StyleSheet, Alert } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useAuth } from '../../hooks/useAuth'
import { useAppLanguage } from '../../hooks/useAppLanguage'
import {
  listConnections, respondConnection, shareWhatsapp, blockConnection, type Connection,
} from '../../services/ConnectionsService'

export default function ConnectionsScreen() {
  const { user } = useAuth()
  const { language } = useAppLanguage()
  const tl = (pt: string, en: string, es: string, it: string) =>
    language === 'en-US' ? en : language === 'es-ES' ? es : language === 'it-IT' ? it : pt
  const [items, setItems] = useState<Connection[]>([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState<string | null>(null)
  const [shareOnAccept, setShareOnAccept] = useState<Set<string>>(new Set())

  const load = useCallback(async () => {
    setLoading(true)
    try { const r = await listConnections(); setItems(r.connections) } catch { /* mantém */ }
    setLoading(false)
  }, [])
  useEffect(() => { load() }, [load])

  const received = useMemo(() => items.filter((c) => c.status === 'pending' && c.requestedBy !== user?.uid), [items, user?.uid])
  const sent = useMemo(() => items.filter((c) => c.status === 'pending' && c.requestedBy === user?.uid), [items, user?.uid])
  const accepted = useMemo(() => items.filter((c) => c.status === 'accepted'), [items])

  const run = async (key: string, fn: () => Promise<any>) => {
    if (busy) return
    setBusy(key)
    try { await fn() } catch { /* silencioso */ }
    await load()
    setBusy(null)
  }
  const accept = (c: Connection) => run(`acc:${c.id}`, () => respondConnection(c.other, true, shareOnAccept.has(c.id)))
  const decline = (c: Connection) => run(`dec:${c.id}`, () => respondConnection(c.other, false, false))
  const doShare = (c: Connection) => run(`sh:${c.id}`, () => shareWhatsapp(c.other))
  const doBlock = (c: Connection) => {
    Alert.alert(
      tl('Bloquear', 'Block', 'Bloquear', 'Blocca'),
      tl('Bloquear esta pessoa? Ela some das suas conexões.', 'Block this person? They disappear from your connections.', 'Bloquear a esta persona?', 'Bloccare questa persona?'),
      [
        { text: tl('Cancelar', 'Cancel', 'Cancelar', 'Annulla'), style: 'cancel' },
        { text: tl('Bloquear', 'Block', 'Bloquear', 'Blocca'), style: 'destructive', onPress: () => run(`bl:${c.id}`, () => blockConnection(c.other)) },
      ],
    )
  }
  const openWhatsapp = (phone: string) => {
    const digits = phone.replace(/\D/g, '')
    Linking.openURL(`https://wa.me/${digits}`).catch(() => {})
  }

  const Avatar = ({ c }: { c: Connection }) => (
    c.otherPhoto
      ? <Image source={{ uri: c.otherPhoto }} style={styles.avatar} />
      : <View style={[styles.avatar, styles.avatarFallback]}><Text style={styles.avatarInitial}>{(c.otherName || '?').slice(0, 1).toUpperCase()}</Text></View>
  )

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  )

  const empty = !loading && !items.length

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={load} tintColor="#FFD700" />}
    >
      {empty ? (
        <Text style={styles.empty}>
          {tl('Você ainda não tem conexões. Conecte-se com pessoas dos seus grupos.',
            'You have no connections yet. Connect with people from your groups.',
            'Aun no tienes conexiones. Conecta con gente de tus grupos.',
            'Non hai ancora connessioni. Connettiti con le persone dei tuoi gruppi.')}
        </Text>
      ) : null}

      {received.length ? (
        <Section title={tl('Pedidos recebidos', 'Requests received', 'Solicitudes recibidas', 'Richieste ricevute')}>
          {received.map((c) => (
            <View key={c.id} style={styles.card}>
              <View style={styles.row}>
                <Avatar c={c} />
                <Text style={styles.name} numberOfLines={1}>{c.otherName || tl('Alguém', 'Someone', 'Alguien', 'Qualcuno')}</Text>
              </View>
              <TouchableOpacity
                style={styles.checkRow}
                onPress={() => setShareOnAccept((p) => { const n = new Set(p); n.has(c.id) ? n.delete(c.id) : n.add(c.id); return n })}
              >
                <Ionicons name={shareOnAccept.has(c.id) ? 'checkbox' : 'square-outline'} size={18} color="#FFD700" />
                <Text style={styles.checkLabel}>{tl('Compartilhar meu WhatsApp', 'Share my WhatsApp', 'Compartir mi WhatsApp', 'Condividi il mio WhatsApp')}</Text>
              </TouchableOpacity>
              <View style={styles.actions}>
                <TouchableOpacity style={[styles.btn, styles.btnGhost]} disabled={!!busy} onPress={() => decline(c)}>
                  <Text style={styles.btnGhostText}>{tl('Recusar', 'Decline', 'Rechazar', 'Rifiuta')}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.btn, styles.btnPrimary]} disabled={!!busy} onPress={() => accept(c)}>
                  <Text style={styles.btnPrimaryText}>{tl('Aceitar', 'Accept', 'Aceptar', 'Accetta')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </Section>
      ) : null}

      {accepted.length ? (
        <Section title={tl('Conexões', 'Connections', 'Conexiones', 'Connessioni')}>
          {accepted.map((c) => (
            <View key={c.id} style={styles.card}>
              <View style={styles.row}>
                <Avatar c={c} />
                <Text style={styles.name} numberOfLines={1}>{c.otherName || tl('Conexão', 'Connection', 'Conexión', 'Connessione')}</Text>
                <TouchableOpacity onPress={() => doBlock(c)} style={styles.blockBtn}>
                  <Ionicons name="ban-outline" size={16} color="#8892a4" />
                </TouchableOpacity>
              </View>
              {c.otherWhatsapp ? (
                <TouchableOpacity style={[styles.btn, styles.btnWa]} onPress={() => openWhatsapp(c.otherWhatsapp!)}>
                  <Ionicons name="logo-whatsapp" size={16} color="#0B0A18" />
                  <Text style={styles.btnWaText}>{tl('Abrir WhatsApp', 'Open WhatsApp', 'Abrir WhatsApp', 'Apri WhatsApp')}</Text>
                </TouchableOpacity>
              ) : !c.iShared ? (
                <TouchableOpacity style={[styles.btn, styles.btnGhost]} disabled={!!busy} onPress={() => doShare(c)}>
                  <Text style={styles.btnGhostText}>{tl('Compartilhar meu WhatsApp', 'Share my WhatsApp', 'Compartir mi WhatsApp', 'Condividi il mio WhatsApp')}</Text>
                </TouchableOpacity>
              ) : (
                <Text style={styles.waiting}>{tl('Aguardando a outra pessoa compartilhar o WhatsApp.', 'Waiting for the other person to share WhatsApp.', 'Esperando que la otra persona comparta WhatsApp.', 'In attesa che l\'altra persona condivida WhatsApp.')}</Text>
              )}
            </View>
          ))}
        </Section>
      ) : null}

      {sent.length ? (
        <Section title={tl('Pedidos enviados', 'Requests sent', 'Solicitudes enviadas', 'Richieste inviate')}>
          {sent.map((c) => (
            <View key={c.id} style={styles.card}>
              <View style={styles.row}>
                <Avatar c={c} />
                <Text style={styles.name} numberOfLines={1}>{c.otherName || tl('Alguém', 'Someone', 'Alguien', 'Qualcuno')}</Text>
                <Text style={styles.pendingTag}>{tl('Pendente', 'Pending', 'Pendiente', 'In attesa')}</Text>
              </View>
            </View>
          ))}
        </Section>
      ) : null}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0F0F23' },
  empty: { color: '#8892a4', fontSize: 14, textAlign: 'center', paddingVertical: 40, lineHeight: 20 },
  section: { marginBottom: 22 },
  sectionTitle: { color: '#FFD700', fontSize: 13, fontWeight: '700', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 },
  card: { backgroundColor: '#161728', borderRadius: 14, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#12101f' },
  avatarFallback: { alignItems: 'center', justifyContent: 'center' },
  avatarInitial: { color: '#FFD700', fontSize: 18, fontWeight: '700' },
  name: { color: '#e2e8f0', fontSize: 16, fontWeight: '600', flex: 1 },
  blockBtn: { padding: 6 },
  pendingTag: { color: '#8892a4', fontSize: 12, fontStyle: 'italic' },
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
})
