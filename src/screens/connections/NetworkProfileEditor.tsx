import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, ActivityIndicator, ScrollView, Alert, Platform } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'
import { useAuth } from '../../hooks/useAuth'
import { useAppLanguage } from '../../hooks/useAppLanguage'
import { getMyProfile, setProfile } from '../../services/DiscoveryService'
import UserService from '../../services/firebase/UserService'
import { NETWORK_INTERESTS, interestLabel, type NetworkLang } from '../../constants/networkInterests'

const C = { bg: '#141428', card: '#1c1c34', line: '#2a2a44', gold: '#e8b84b', magenta: '#d6409f', tx: '#eaeaf5', dim: '#8892a4' }
const MAX_PHOTOS = 4
const MAX_TAGS = 10

// expo-image-picker >= 15 expõe manipulate via expo-image-manipulator; aqui usamos
// o resultado do picker direto (dataUrl base64) pra não depender da versão.
async function pickPhotoDataUrl(): Promise<string | null> {
  try {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, aspect: [3, 4], quality: 0.7, base64: true,
    })
    if (res.canceled || !res.assets?.[0]) return null
    const a = res.assets[0]
    return a.base64 ? `data:image/jpeg;base64,${a.base64}` : a.uri
  } catch { return null }
}

export default function NetworkProfileEditor() {
  const { user } = useAuth()
  const { language } = useAppLanguage()
  const lang = language as NetworkLang
  const tl = (pt: string, en: string, es: string, it: string) =>
    ({ 'pt-BR': pt, 'en-US': en, 'es-ES': es, 'it-IT': it }[lang] || pt)

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [photos, setPhotos] = useState<string[]>([])
  const [interests, setInterests] = useState<string[]>([])
  const [bio, setBio] = useState('')

  useEffect(() => {
    let alive = true
    getMyProfile().then((r) => {
      if (!alive) return
      const p = r.profile
      setPhotos(Array.isArray(p?.photos) ? p!.photos! : (p?.photoURL ? [p.photoURL] : []))
      setInterests(Array.isArray(p?.interests) ? p!.interests! : [])
      setBio(p?.bio || '')
    }).finally(() => alive && setLoading(false))
    return () => { alive = false }
  }, [user?.uid])

  const addPhoto = async () => {
    if (photos.length >= MAX_PHOTOS || uploading || !user?.uid) return
    const dataUrl = await pickPhotoDataUrl()
    if (!dataUrl) return
    setUploading(true)
    try {
      const url = await UserService.uploadImage(user.uid, dataUrl)
      setPhotos((prev) => [...prev, url].slice(0, MAX_PHOTOS))
    } catch {
      Alert.alert(tl('Ops', 'Oops', 'Ups', 'Ops'), tl('Não consegui subir a foto. Tente de novo.', 'Could not upload the photo. Try again.', 'No pude subir la foto. Intenta de nuevo.', 'Non ho caricato la foto. Riprova.'))
    } finally { setUploading(false) }
  }

  const removePhoto = (i: number) => setPhotos((prev) => prev.filter((_, idx) => idx !== i))
  const makeCover = (i: number) => setPhotos((prev) => { const n = [...prev]; const [x] = n.splice(i, 1); n.unshift(x); return n })

  const toggleTag = (slug: string) => setInterests((prev) => {
    if (prev.includes(slug)) return prev.filter((s) => s !== slug)
    if (prev.length >= MAX_TAGS) return prev
    return [...prev, slug]
  })

  const save = async () => {
    setSaving(true)
    try {
      const r = await setProfile({ photos, interests, bio })
      if (r.gated) { Alert.alert(tl('Assinatura', 'Subscription', 'Suscripcion', 'Abbonamento'), tl('Esta seção é para assinantes.', 'This section is for subscribers.', 'Esta seccion es para suscriptores.', 'Questa sezione e per abbonati.')); return }
      if (!r.ok) throw new Error('save')
      Alert.alert(tl('Pronto!', 'Done!', 'Listo!', 'Fatto!'), tl('Seu perfil foi salvo.', 'Your profile was saved.', 'Tu perfil fue guardado.', 'Il tuo profilo e stato salvato.'))
    } catch {
      Alert.alert(tl('Ops', 'Oops', 'Ups', 'Ops'), tl('Não consegui salvar. Tente de novo.', 'Could not save. Try again.', 'No pude guardar. Intenta de nuevo.', 'Non ho salvato. Riprova.'))
    } finally { setSaving(false) }
  }

  if (loading) return <ActivityIndicator color={C.gold} style={{ marginTop: 40 }} />

  return (
    <ScrollView style={s.wrap} contentContainerStyle={{ padding: 16, paddingBottom: 60 }}>
      {/* Fotos */}
      <Text style={s.label}>{tl('Suas fotos', 'Your photos', 'Tus fotos', 'Le tue foto')} <Text style={s.hint}>({photos.length}/{MAX_PHOTOS})</Text></Text>
      <View style={s.photoGrid}>
        {photos.map((uri, i) => (
          <View key={uri + i} style={s.photoBox}>
            <Image source={{ uri }} style={s.photo} />
            {i === 0 ? <View style={s.coverTag}><Text style={s.coverTx}>{tl('Capa', 'Cover', 'Portada', 'Copertina')}</Text></View> : (
              <TouchableOpacity style={s.mkCover} onPress={() => makeCover(i)}><Ionicons name="star-outline" size={13} color="#fff" /></TouchableOpacity>
            )}
            <TouchableOpacity style={s.rm} onPress={() => removePhoto(i)}><Ionicons name="close" size={14} color="#fff" /></TouchableOpacity>
          </View>
        ))}
        {photos.length < MAX_PHOTOS ? (
          <TouchableOpacity style={[s.photoBox, s.addBox]} onPress={addPhoto} disabled={uploading}>
            {uploading ? <ActivityIndicator color={C.gold} /> : <Ionicons name="add" size={30} color={C.gold} />}
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Interesses */}
      <Text style={[s.label, { marginTop: 22 }]}>{tl('Seus interesses', 'Your interests', 'Tus intereses', 'I tuoi interessi')} <Text style={s.hint}>({interests.length}/{MAX_TAGS})</Text></Text>
      <View style={s.tags}>
        {NETWORK_INTERESTS.map((t) => {
          const on = interests.includes(t.slug)
          return (
            <TouchableOpacity key={t.slug} style={[s.tag, on && s.tagOn]} onPress={() => toggleTag(t.slug)} activeOpacity={0.8}>
              <Text style={[s.tagTx, on && s.tagTxOn]}>{t.emoji} {interestLabel(t.slug, lang)}</Text>
            </TouchableOpacity>
          )
        })}
      </View>

      {/* Bio */}
      <Text style={[s.label, { marginTop: 22 }]}>{tl('Sobre você', 'About you', 'Sobre ti', 'Su di te')} <Text style={s.hint}>({bio.length}/300)</Text></Text>
      <TextInput
        style={s.bio}
        value={bio}
        onChangeText={(v) => setBio(v.slice(0, 300))}
        placeholder={tl('Uma frase que te descreve…', 'A line that describes you…', 'Una frase que te describe…', 'Una frase che ti descrive…')}
        placeholderTextColor={C.dim}
        multiline
        maxLength={300}
      />

      <TouchableOpacity style={s.saveBtn} onPress={save} disabled={saving} activeOpacity={0.9}>
        {saving ? <ActivityIndicator color="#1a1400" /> : <Text style={s.saveTx}>{tl('Salvar perfil', 'Save profile', 'Guardar perfil', 'Salva profilo')}</Text>}
      </TouchableOpacity>
    </ScrollView>
  )
}

const s = StyleSheet.create({
  wrap: { flex: 1 },
  label: { color: C.tx, fontSize: 15, fontWeight: '800', marginBottom: 10 },
  hint: { color: C.dim, fontSize: 12, fontWeight: '600' },
  photoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  photoBox: { width: 96, height: 128, borderRadius: 12, overflow: 'hidden', backgroundColor: C.card, borderWidth: 1, borderColor: C.line },
  photo: { width: '100%', height: '100%' },
  addBox: { alignItems: 'center', justifyContent: 'center', borderStyle: 'dashed' },
  coverTag: { position: 'absolute', bottom: 4, left: 4, backgroundColor: C.gold, borderRadius: 6, paddingHorizontal: 6, paddingVertical: 1 },
  coverTx: { color: '#1a1400', fontSize: 10, fontWeight: '800' },
  mkCover: { position: 'absolute', bottom: 4, left: 4, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 10, padding: 4 },
  rm: { position: 'absolute', top: 4, right: 4, backgroundColor: 'rgba(0,0,0,0.55)', borderRadius: 10, padding: 3 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 18, backgroundColor: C.card, borderWidth: 1, borderColor: C.line },
  tagOn: { backgroundColor: 'rgba(214,64,159,0.18)', borderColor: C.magenta },
  tagTx: { color: C.dim, fontSize: 13, fontWeight: '600' },
  tagTxOn: { color: C.tx },
  bio: { minHeight: 88, backgroundColor: C.card, borderRadius: 12, borderWidth: 1, borderColor: C.line, color: C.tx, padding: 12, fontSize: 14, textAlignVertical: 'top' },
  saveBtn: { marginTop: 24, backgroundColor: C.gold, borderRadius: 14, paddingVertical: 15, alignItems: 'center' },
  saveTx: { color: '#1a1400', fontSize: 15, fontWeight: '800' },
})
