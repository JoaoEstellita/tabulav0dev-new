/**
 * Form do admin para criar um PERFIL GERENCIADO no grupo — pessoa sem conta
 * (parente etc.) que o admin quer acompanhar. Coleta nome + nascimento + cidade
 * (geocode via LocationService) e grava via GroupService.addManagedProfile. O
 * status/mapa é computado pelo backend a partir desses dados.
 */
import React, { useRef, useState } from 'react'
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native'
import { useAuth } from '../../hooks/useAuth'
import { useAppLanguage } from '../../hooks/useAppLanguage'
import LocationService, { type LocationSuggestion } from '../../services/LocationService'
import GroupService from '../../services/firebase/GroupService'

type Props = { visible: boolean; onClose: () => void; groupId: string | null; onCreated?: () => void }

export default function AddManagedProfileModal({ visible, onClose, groupId, onCreated }: Props) {
  const { user } = useAuth()
  const { language } = useAppLanguage()
  const tl = (pt: string, en: string, es: string, it: string) =>
    language === 'en-US' ? en : language === 'es-ES' ? es : language === 'it-IT' ? it : pt

  const [name, setName] = useState('')
  const [dateStr, setDateStr] = useState('')
  const [timeStr, setTimeStr] = useState('')
  const [cityQuery, setCityQuery] = useState('')
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([])
  const [picked, setPicked] = useState<LocationSuggestion | null>(null)
  const [saving, setSaving] = useState(false)
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const onCityChange = (text: string) => {
    setCityQuery(text)
    setPicked(null)
    if (searchTimer.current) clearTimeout(searchTimer.current)
    if (text.trim().length < 2) { setSuggestions([]); return }
    searchTimer.current = setTimeout(async () => {
      try { setSuggestions(await LocationService.searchLocations(text, 'BR', language)) } catch { setSuggestions([]) }
    }, 300)
  }

  const parseDate = (s: string): string | null => {
    const m = s.trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
    if (!m) return null
    const dd = Number(m[1]), mm = Number(m[2]), yy = Number(m[3])
    if (mm < 1 || mm > 12 || dd < 1 || dd > 31 || yy < 1900 || yy > 2100) return null
    return `${yy}-${String(mm).padStart(2, '0')}-${String(dd).padStart(2, '0')}`
  }
  const parseTime = (s: string): string => {
    const m = s.trim().match(/^(\d{1,2}):(\d{2})$/)
    if (!m) return '12:00'
    const hh = Math.min(23, Number(m[1])), mi = Math.min(59, Number(m[2]))
    return `${String(hh).padStart(2, '0')}:${String(mi).padStart(2, '0')}`
  }

  const reset = () => { setName(''); setDateStr(''); setTimeStr(''); setCityQuery(''); setSuggestions([]); setPicked(null) }

  const submit = async () => {
    if (!groupId || !user?.uid) return
    const nm = name.trim()
    const isoDate = parseDate(dateStr)
    if (!nm) return Alert.alert(tl('Nome', 'Name', 'Nombre', 'Nome'), tl('Informe o nome.', 'Enter a name.', 'Ingresa el nombre.', 'Inserisci il nome.'))
    if (!isoDate) return Alert.alert(tl('Data', 'Date', 'Fecha', 'Data'), tl('Data no formato DD/MM/AAAA.', 'Use DD/MM/YYYY.', 'Usa DD/MM/AAAA.', 'Usa GG/MM/AAAA.'))
    if (!picked) return Alert.alert(tl('Cidade', 'City', 'Ciudad', 'Città'), tl('Selecione a cidade de nascimento.', 'Pick the birth city.', 'Selecciona la ciudad.', 'Seleziona la città.'))
    const time = parseTime(timeStr)
    setSaving(true)
    try {
      await GroupService.addManagedProfile(groupId, user.uid, {
        name: nm,
        birthData: { datetime: `${isoDate}T${time}:00`, coordinates: { latitude: picked.latitude, longitude: picked.longitude } },
      })
      reset()
      onCreated?.()
      onClose()
    } catch (e: any) {
      Alert.alert(tl('Erro', 'Error', 'Error', 'Errore'), e?.message || tl('Não foi possível criar o perfil.', 'Could not create the profile.', 'No se pudo crear.', 'Impossibile creare.'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <ScrollView keyboardShouldPersistTaps="handled">
            <Text style={styles.title}>{tl('Adicionar pessoa', 'Add person', 'Agregar persona', 'Aggiungi persona')}</Text>
            <Text style={styles.sub}>
              {tl('Crie um perfil para acompanhar no grupo — a pessoa não precisa ter conta.',
                'Create a profile to follow in the group — the person needs no account.',
                'Crea un perfil para seguir en el grupo — la persona no necesita cuenta.',
                'Crea un profilo da seguire nel gruppo — la persona non ha bisogno di account.')}
            </Text>

            <Text style={styles.label}>{tl('Nome', 'Name', 'Nombre', 'Nome')}</Text>
            <TextInput style={styles.input} value={name} onChangeText={setName}
              placeholder={tl('Ex.: Tia Ana', 'E.g. Aunt Ana', 'Ej.: Tía Ana', 'Es.: Zia Ana')} placeholderTextColor="#667" />

            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>{tl('Nascimento', 'Birth date', 'Nacimiento', 'Nascita')}</Text>
                <TextInput style={styles.input} value={dateStr} onChangeText={setDateStr}
                  placeholder="DD/MM/AAAA" placeholderTextColor="#667" keyboardType="numbers-and-punctuation" />
              </View>
              <View style={{ width: 108 }}>
                <Text style={styles.label}>{tl('Hora', 'Time', 'Hora', 'Ora')}</Text>
                <TextInput style={styles.input} value={timeStr} onChangeText={setTimeStr}
                  placeholder="HH:MM" placeholderTextColor="#667" keyboardType="numbers-and-punctuation" />
              </View>
            </View>
            <Text style={styles.hint}>{tl('Sem a hora exata? Use 12:00.', 'No exact time? Use 12:00.', '¿Sin hora exacta? Usa 12:00.', 'Senza ora esatta? Usa 12:00.')}</Text>

            <Text style={styles.label}>{tl('Cidade de nascimento', 'Birth city', 'Ciudad de nacimiento', 'Città di nascita')}</Text>
            <TextInput style={styles.input} value={picked ? picked.displayName : cityQuery} onChangeText={onCityChange}
              placeholder={tl('Buscar cidade…', 'Search city…', 'Buscar ciudad…', 'Cerca città…')} placeholderTextColor="#667" />
            {!picked && suggestions.length > 0 ? (
              <View style={styles.suggestBox}>
                {suggestions.slice(0, 6).map((s, i) => (
                  <TouchableOpacity key={`${s.displayName}-${i}`} style={styles.suggestItem}
                    onPress={() => { setPicked(s); setSuggestions([]); setCityQuery(s.displayName) }}>
                    <Text style={styles.suggestText}>{s.displayName}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : null}

            <View style={styles.actions}>
              <TouchableOpacity style={[styles.btn, styles.btnGhost]} onPress={() => { reset(); onClose() }} disabled={saving}>
                <Text style={styles.btnGhostText}>{tl('Cancelar', 'Cancel', 'Cancelar', 'Annulla')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btn, styles.btnPrimary]} onPress={submit} disabled={saving}>
                {saving ? <ActivityIndicator color="#0F0F23" /> : <Text style={styles.btnPrimaryText}>{tl('Criar perfil', 'Create profile', 'Crear perfil', 'Crea profilo')}</Text>}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: '#141428', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: '88%' },
  title: { color: '#F8FAFC', fontSize: 20, fontWeight: '700', marginBottom: 4 },
  sub: { color: '#9AA0C0', fontSize: 13, lineHeight: 19, marginBottom: 14 },
  label: { color: '#C8CDE8', fontSize: 12, fontWeight: '600', marginTop: 10, marginBottom: 5 },
  input: { backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, color: '#F8FAFC', fontSize: 15 },
  row: { flexDirection: 'row', gap: 10 },
  hint: { color: '#777', fontSize: 11, marginTop: 4 },
  suggestBox: { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 10, marginTop: 4, overflow: 'hidden' },
  suggestItem: { paddingHorizontal: 12, paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.06)' },
  suggestText: { color: '#E2E8F0', fontSize: 14 },
  actions: { flexDirection: 'row', gap: 10, marginTop: 20 },
  btn: { flex: 1, borderRadius: 12, paddingVertical: 13, alignItems: 'center', justifyContent: 'center' },
  btnGhost: { backgroundColor: 'rgba(255,255,255,0.08)' },
  btnGhostText: { color: '#C8CDE8', fontSize: 15, fontWeight: '600' },
  btnPrimary: { backgroundColor: '#FFD700' },
  btnPrimaryText: { color: '#0F0F23', fontSize: 15, fontWeight: '700' },
})
