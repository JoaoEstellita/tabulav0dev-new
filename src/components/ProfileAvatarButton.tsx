import React, { useEffect, useState } from 'react'
import { View, Image, TouchableOpacity, Text, StyleSheet, Platform, Alert, ActivityIndicator } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'
import * as ImageManipulator from 'expo-image-manipulator'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../config/firebase'
import { useAuth } from '../hooks/useAuth'
import { useAppLanguage } from '../hooks/useAppLanguage'
import UserService from '../services/firebase/UserService'

interface Props {
  size?: number
}

// Compressão no web: file -> canvas 600px -> dataURL jpeg (mesmo padrão do ProfileScreen).
async function fileToDataUrl(file: File): Promise<string> {
  const objectUrl = URL.createObjectURL(file)
  const img: HTMLImageElement = await new Promise((res) => {
    const im = new (window as any).Image()
    im.onload = () => res(im)
    im.src = objectUrl
  })
  const canvas = document.createElement('canvas')
  const maxSize = 600
  const scale = Math.min(maxSize / img.width, maxSize / img.height, 1)
  canvas.width = Math.round(img.width * scale)
  canvas.height = Math.round(img.height * scale)
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
  URL.revokeObjectURL(objectUrl)
  return canvas.toDataURL('image/jpeg', 0.82)
}

/** Avatar do usuário com um "+" para adicionar/trocar a foto ali mesmo (1ª aba). */
export default function ProfileAvatarButton({ size = 72 }: Props) {
  const { user } = useAuth()
  const { t } = useAppLanguage()
  const [photo, setPhoto] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    let alive = true
    if (!user?.uid) return
    getDoc(doc(db, 'users', user.uid))
      .then((snap) => { if (alive) setPhoto((snap.data() as any)?.profilePhoto || null) })
      .catch(() => { /* sem foto */ })
    return () => { alive = false }
  }, [user?.uid])

  const save = async (dataUrl: string) => {
    if (!user?.uid) return
    setBusy(true)
    try {
      const url = await UserService.setProfilePhoto(user.uid, dataUrl)
      setPhoto(url)
    } catch (e) {
      Alert.alert(t('common.attention'), t('home.addPhotoFailed'))
    } finally {
      setBusy(false)
    }
  }

  const pickNative = async (source: 'gallery' | 'camera') => {
    try {
      let result
      if (source === 'camera') {
        const { status } = await ImagePicker.requestCameraPermissionsAsync()
        if (status !== 'granted') return
        result = await ImagePicker.launchCameraAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [1, 1], quality: 0.8 })
      } else {
        result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [1, 1], quality: 0.8 })
      }
      if (!result.canceled && result.assets?.[0]) {
        const m = await ImageManipulator.manipulateAsync(result.assets[0].uri, [{ resize: { width: 600, height: 600 } }], { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG, base64: true })
        const dataUrl = m.base64 ? `data:image/jpeg;base64,${m.base64}` : m.uri
        await save(dataUrl)
      }
    } catch { /* cancelado/erro */ }
  }

  const onPress = () => {
    if (busy) return
    if (Platform.OS === 'web') {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = 'image/*'
      input.onchange = async () => {
        const file = input.files?.[0]
        if (!file) return
        try { await save(await fileToDataUrl(file)) } catch { /* erro */ }
      }
      input.click()
      return
    }
    Alert.alert(
      t('home.addPhoto'),
      undefined,
      [
        { text: t('common.cancel'), style: 'cancel' },
        { text: t('profile.photo.gallery'), onPress: () => pickNative('gallery') },
        { text: t('profile.photo.camera'), onPress: () => pickNative('camera') },
      ]
    )
  }

  const radius = size / 2
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={[styles.wrap, { width: size, height: size, borderRadius: radius }]}>
      {photo ? (
        <Image source={{ uri: photo }} style={{ width: size, height: size, borderRadius: radius }} />
      ) : (
        <View style={[styles.placeholder, { width: size, height: size, borderRadius: radius }]}>
          <Ionicons name="person" size={size * 0.5} color="#4A4A66" />
        </View>
      )}
      {busy ? (
        <View style={[styles.badge, styles.badgeBusy]}>
          <ActivityIndicator size="small" color="#0F0F23" />
        </View>
      ) : (
        <View style={styles.badge}>
          <Ionicons name={photo ? 'pencil' : 'add'} size={14} color="#0F0F23" />
        </View>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  wrap: {
    position: 'relative',
  },
  placeholder: {
    backgroundColor: '#1E1E38',
    borderWidth: 2,
    borderColor: '#FFD700',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFD700',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#0F0F23',
  },
  badgeBusy: {
    backgroundColor: '#FFD700',
  },
})
