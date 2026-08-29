import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, ActivityIndicator, ScrollView, Alert, Platform, Switch } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import * as ImagePicker from 'expo-image-picker'
import { useAuth } from '../../hooks/useAuth'
import { useAppLanguage } from '../../hooks/useAppLanguage'
import { getMyProfile, setProfile } from '../../services/DiscoveryService'
import UserService from '../../services/firebase/UserService'
import { NETWORK_INTERESTS, interestLabel, PROFILE_PROMPTS, type NetworkLang } from '../../constants/networkInterests'

const C = { bg: '#141428', card: '#1c1c34', line: '#2a2a44', gold: '#e8b84b', magenta: '#d6409f', tx: '#eaeaf5', dim: '#8892a4' }
const MAX_PHOTOS = 4
const MAX_TAGS = 10

// Web: <input type=file> + canvas (o ImagePicker não retorna base64 confiável no
// web). Native: ImagePicker com base64. Mesmo padrão do ProfileAvatarButton.
async function fileToDataUrl(file: File): Promise<string> {
  const objectUrl = URL.createObjectURL(file)
  const img: HTMLImageElement = await new Promise((res, rej) => {
    const im = new (window as any).Image()
    im.onload = () => res(im); im.onerror = rej; im.src = objectUrl
  })
  const canvas = document.createElement('canvas')
  const maxSize = 800
  const scale = Math.min(maxSize / img.width, maxSize / img.height, 1)
  canvas.width = Math.round(img.width * scale)
  canvas.height = Math.round(img.height * scale)
  canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height)
  URL.revokeObjectURL(objectUrl)
  return canvas.toDataURL('image/jpeg', 0.82)
}
async function pickPhotoDataUrl(): Promise<string | null> {
  if (Platform.OS === 'web') {
    return new Promise((resolve) => {
      const input = document.createElement('input')
      input.type = 'file'; input.accept = 'image/*'
      input.onchange = async () => {
        const f = input.files?.[0]
        if (!f) return resolve(null)
        try { resolve(await fileToDataUrl(f)) } catch { resolve(null) }
      }
      input.click()
    })
  }
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
  const [prompts, setPrompts] = useState<Record<string, string>>({})
  const [gender, setGender] = useState<'m' | 'f' | 'nb' | null>(null)
  const [seeking, setSeeking] = useState<'m' | 'f' | 'all' | null>(null)
  const [shareChart, setShareChart] = useState(false)

  useEffect(() => {
    let alive = true
    getMyProfile().then((r) => {
      if (!alive) return
      const p = r.profile
      setPhotos(Array.isArray(p?.photos) ? p!.photos! : (p?.photoURL ? [p.photoURL] : []))
      setInterests(Array.isArray(p?.interests) ? p!.interests! : [])
      setBio(p?.bio || '')
      setPrompts(p?.prompts && typeof p.prompts === 'object' ? p.prompts : {})
      setGender((p as any)?.gender || null)
      setSeeking((p as any)?.seeking || null)
      setShareChart((p as any)?.shareChart === true)
    }).finally(() => alive && setLoading(false))
    return () => { alive = false }
  }, [user?.uid])

  const setPrompt = (key: string, val: string) => setPrompts((p) => ({ ...p, [key]: val.slice(0, 120) }))

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
      const r = await setProfile({ photos, interests, bio, prompts, gender, seeking, shareChart })
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
      {/* Prévia de como seu card aparece */}
      <Text style={s.label}>{tl('Prévia do seu card', 'Preview of your card', 'Vista previa de tu tarjeta', 'Anteprima della tua card')}</Text>
      <View style={s.preview}>
        {photos[0]
          ? <Image source={{ uri: photos[0] }} style={s.prevPhoto} />
          : <View style={[s.prevPhoto, s.prevFb]}><Ionicons name="person" size={48} color="#3a3a5a" /></View>}
        <LinearGradient colors={['transparent', 'rgba(12,8,24,0.94)']} style={s.prevGrad} pointerEvents="none" />
        <View style={s.prevInfo}>
          {bio ? <Text style={s.prevBio} numberOfLines={2}>{bio}</Text> : <Text style={[s.prevBio, { color: C.dim }]}>{tl('Sua bio aparece aqui', 'Your bio shows here', 'Tu bio aparece aqui', 'La tua bio appare qui')}</Text>}
          {interests.length ? (
            <View style={s.prevChips}>
              {interests.slice(0, 4).map((sl) => <Text key={sl} style={s.prevChip}>{interestLabel(sl, lang)}</Text>)}
            </View>
          ) : null}
        </View>
      </View>

      {/* Gênero + preferência */}
      <Text style={s.label}>{tl('Você é', 'You are', 'Eres', 'Sei')}</Text>
      <View style={s.tags}>
        {([['m', tl('Homem', 'Man', 'Hombre', 'Uomo')], ['f', tl('Mulher', 'Woman', 'Mujer', 'Donna')], ['nb', tl('Não-binário', 'Non-binary', 'No binario', 'Non binario')]] as const).map(([v, l]) => (
          <TouchableOpacity key={v} style={[s.tag, gender === v && s.tagOn]} onPress={() => setGender(v as any)}>
            <Text style={[s.tagTx, gender === v && s.tagTxOn]}>{l}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={[s.label, { marginTop: 18 }]}>{tl('Quer conhecer', 'Looking to meet', 'Quiere conocer', 'Vuoi conoscere')}</Text>
      <View style={s.tags}>
        {([['m', tl('Homens', 'Men', 'Hombres', 'Uomini')], ['f', tl('Mulheres', 'Women', 'Mujeres', 'Donne')], ['all', tl('Todos', 'Everyone', 'Todos', 'Tutti')]] as const).map(([v, l]) => (
          <TouchableOpacity key={v} style={[s.tag, seeking === v && s.tagOn]} onPress={() => setSeeking(v as any)}>
            <Text style={[s.tagTx, seeking === v && s.tagTxOn]}>{l}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Abrir a roda de sinastria no card (default fechado) */}
      <View style={s.shareRow}>
        <View style={{ flex: 1, paddingRight: 12 }}>
          <Text style={s.shareTitle}>{tl('Abrir minha roda de sinastria', 'Share my synastry wheel', 'Abrir mi rueda de sinastria', 'Apri la mia ruota di sinastria')}</Text>
          <Text style={s.shareSub}>{tl('Se ligado, quem vê seu card pode abrir a roda e a grade de aspectos com o mapa dela. Desligado: só a % de afinidade.', 'If on, whoever sees your card can open the wheel and aspect grid with your chart. Off: only the affinity %.', 'Si esta activo, quien ve tu tarjeta puede abrir la rueda y la grilla con tu carta. Apagado: solo el % de afinidad.', 'Se attivo, chi vede la tua card puo aprire la ruota e la griglia con la tua carta. Spento: solo la % di affinita.')}</Text>
        </View>
        <Switch value={shareChart} onValueChange={setShareChart} trackColor={{ true: C.gold, false: '#3a3a4a' }} thumbColor="#fff" />
      </View>

      {/* Fotos */}
      <Text style={[s.label, { marginTop: 22 }]}>{tl('Suas fotos', 'Your photos', 'Tus fotos', 'Le tue foto')} <Text style={s.hint}>({photos.length}/{MAX_PHOTOS})</Text></Text>
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

      {/* Favoritos preenchíveis */}
      <Text style={[s.label, { marginTop: 22 }]}>{tl('Seus favoritos', 'Your favorites', 'Tus favoritos', 'I tuoi preferiti')}</Text>
      {PROFILE_PROMPTS.map((p) => (
        <View key={p.key} style={s.promptRow}>
          <Text style={s.promptLabel}>{p.emoji} {p.label[lang] || p.label['pt-BR']}</Text>
          <TextInput
            style={s.promptInput}
            value={prompts[p.key] || ''}
            onChangeText={(v) => setPrompt(p.key, v)}
            placeholder={p.placeholder[lang] || p.placeholder['pt-BR']}
            placeholderTextColor={C.dim}
            maxLength={120}
          />
        </View>
      ))}

      <TouchableOpacity style={s.saveBtn} onPress={save} disabled={saving} activeOpacity={0.9}>
        {saving ? <ActivityIndicator color="#1a1400" /> : <Text style={s.saveTx}>{tl('Salvar perfil', 'Save profile', 'Guardar perfil', 'Salva profilo')}</Text>}
      </TouchableOpacity>
    </ScrollView>
  )
}

const s = StyleSheet.create({
  wrap: { flex: 1 },
  label: { color: C.tx, fontSize: 15, fontWeight: '800', marginBottom: 10 },
  preview: { height: 200, borderRadius: 18, overflow: 'hidden', backgroundColor: C.card, borderWidth: 1, borderColor: C.line, marginBottom: 22 },
  prevPhoto: { width: '100%', height: '100%', backgroundColor: '#000' },
  prevFb: { alignItems: 'center', justifyContent: 'center', backgroundColor: '#0d0d1c' },
  prevGrad: { position: 'absolute', left: 0, right: 0, bottom: 0, height: '65%' },
  prevInfo: { position: 'absolute', left: 14, right: 14, bottom: 12 },
  prevBio: { color: '#fff', fontSize: 14, fontWeight: '600' },
  prevChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 },
  prevChip: { color: '#fff', fontSize: 11, fontWeight: '700', backgroundColor: 'rgba(214,64,159,0.4)', borderRadius: 12, paddingHorizontal: 9, paddingVertical: 3, overflow: 'hidden' },
  hint: { color: C.dim, fontSize: 12, fontWeight: '600' },
  shareRow: { flexDirection: 'row', alignItems: 'center', marginTop: 22, backgroundColor: C.card, borderRadius: 14, borderWidth: 1, borderColor: C.line, padding: 14 },
  shareTitle: { color: C.tx, fontSize: 14, fontWeight: '800' },
  shareSub: { color: C.dim, fontSize: 12, lineHeight: 17, marginTop: 3 },
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
  promptRow: { marginBottom: 12 },
  promptLabel: { color: C.tx, fontSize: 13, fontWeight: '700', marginBottom: 5 },
  promptInput: { backgroundColor: C.card, borderRadius: 10, borderWidth: 1, borderColor: C.line, color: C.tx, paddingHorizontal: 12, paddingVertical: 9, fontSize: 14 },
  saveBtn: { marginTop: 24, backgroundColor: C.gold, borderRadius: 14, paddingVertical: 15, alignItems: 'center' },
  saveTx: { color: '#1a1400', fontSize: 15, fontWeight: '800' },
})
