import React, { useState } from 'react'
import { View, Text, TextInput, ScrollView, TouchableOpacity, Image, ActivityIndicator, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useAppLanguage } from '../../hooks/useAppLanguage'
import { searchProfiles, type PublicProfile } from '../../services/DiscoveryService'
import { requestConnection } from '../../services/ConnectionsService'

export default function DiscoverScreen() {
  const { language } = useAppLanguage()
  const tl = (pt: string, en: string, es: string, it: string) =>
    language === 'en-US' ? en : language === 'es-ES' ? es : language === 'it-IT' ? it : pt

  const [term, setTerm] = useState('')
  const [results, setResults] = useState<PublicProfile[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [sentIds, setSentIds] = useState<Set<string>>(new Set())

  const doSearch = async () => {
    const t = term.trim()
    if (t.length < 2) return
    setLoading(true); setSearched(true)
    try { setResults(await searchProfiles(t)) } catch { setResults([]) }
    setLoading(false)
  }
  const connect = async (p: PublicProfile) => {
    try { await requestConnection(p.uid, null, false); setSentIds((s) => new Set(s).add(p.uid)) } catch { /* silencioso */ }
  }

  const trio = (p: PublicProfile) => [p.sunSign && `☉ ${p.sunSign}`, p.moonSign && `☽ ${p.moonSign}`, p.ascSign && `ASC ${p.ascSign}`]
    .filter(Boolean).join('  ·  ')

  return (
    <View style={styles.screen}>
      <View style={styles.searchBar}>
        <Ionicons name="search" size={18} color="#8892a4" />
        <TextInput
          style={styles.input}
          value={term}
          onChangeText={setTerm}
          onSubmitEditing={doSearch}
          returnKeyType="search"
          placeholder={tl('Buscar por nome…', 'Search by name…', 'Buscar por nombre…', 'Cerca per nome…')}
          placeholderTextColor="#6a7288"
          autoCapitalize="none"
        />
        <TouchableOpacity onPress={doSearch} style={styles.searchBtn}>
          <Text style={styles.searchBtnText}>{tl('Buscar', 'Search', 'Buscar', 'Cerca')}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingTop: 8 }}>
        {loading ? <ActivityIndicator color="#FFD700" style={{ marginTop: 30 }} /> : null}

        {!loading && searched && !results.length ? (
          <Text style={styles.empty}>{tl('Ninguém encontrado. Tente outro nome.', 'No one found. Try another name.', 'Nadie encontrado. Prueba otro nombre.', 'Nessuno trovato. Prova un altro nome.')}</Text>
        ) : null}

        {!loading && !searched ? (
          <Text style={styles.hint}>{tl('Digite um nome para encontrar pessoas que ativaram o perfil público.', 'Type a name to find people who turned on their public profile.', 'Escribe un nombre para encontrar personas con perfil publico.', 'Digita un nome per trovare persone col profilo pubblico.')}</Text>
        ) : null}

        {results.map((p) => (
          <View key={p.uid} style={styles.card}>
            {p.photoURL
              ? <Image source={{ uri: p.photoURL }} style={styles.avatar} />
              : <View style={[styles.avatar, styles.avatarFallback]}><Text style={styles.avatarInitial}>{(p.displayName || '?').slice(0, 1).toUpperCase()}</Text></View>}
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text style={styles.name} numberOfLines={1}>{p.displayName || tl('Sem nome', 'No name', 'Sin nombre', 'Senza nome')}</Text>
              {trio(p) ? <Text style={styles.trio} numberOfLines={1}>{trio(p)}</Text> : null}
              {p.city ? <Text style={styles.city} numberOfLines={1}>📍 {p.city}</Text> : null}
            </View>
            <TouchableOpacity
              style={[styles.connectBtn, sentIds.has(p.uid) && styles.connectBtnDone]}
              disabled={sentIds.has(p.uid)}
              onPress={() => connect(p)}
            >
              <Ionicons name={sentIds.has(p.uid) ? 'checkmark' : 'person-add-outline'} size={15} color="#0B0A18" />
              <Text style={styles.connectBtnText}>{sentIds.has(p.uid) ? tl('Enviado', 'Sent', 'Enviado', 'Inviato') : tl('Conectar', 'Connect', 'Conectar', 'Connetti')}</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0F0F23' },
  searchBar: { flexDirection: 'row', alignItems: 'center', gap: 8, margin: 16, marginBottom: 4, backgroundColor: '#161728', borderRadius: 12, paddingHorizontal: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  input: { flex: 1, color: '#e2e8f0', fontSize: 15, paddingVertical: 12 },
  searchBtn: { backgroundColor: '#FFD700', paddingHorizontal: 14, paddingVertical: 7, borderRadius: 9 },
  searchBtnText: { color: '#0B0A18', fontWeight: '700', fontSize: 13 },
  hint: { color: '#8892a4', fontSize: 14, textAlign: 'center', marginTop: 40, lineHeight: 20, paddingHorizontal: 20 },
  empty: { color: '#8892a4', fontSize: 14, textAlign: 'center', marginTop: 40 },
  card: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#161728', borderRadius: 14, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  avatar: { width: 46, height: 46, borderRadius: 23, backgroundColor: '#12101f' },
  avatarFallback: { alignItems: 'center', justifyContent: 'center' },
  avatarInitial: { color: '#FFD700', fontSize: 20, fontWeight: '700' },
  name: { color: '#e2e8f0', fontSize: 16, fontWeight: '600' },
  trio: { color: '#c9cfe0', fontSize: 12, marginTop: 2 },
  city: { color: '#8892a4', fontSize: 12, marginTop: 2 },
  connectBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#FFD700', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
  connectBtnDone: { backgroundColor: '#22C55E' },
  connectBtnText: { color: '#0B0A18', fontWeight: '700', fontSize: 13 },
})
