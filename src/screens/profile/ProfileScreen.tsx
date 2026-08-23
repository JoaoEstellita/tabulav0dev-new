"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Switch, Image, Modal, Platform, useWindowDimensions } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import * as ImagePicker from 'expo-image-picker'
import * as ImageManipulator from 'expo-image-manipulator'
import { useAuth } from "../../hooks/useAuth"
import { useAppLanguage } from "../../hooks/useAppLanguage"
import { collection, doc, getDoc, setDoc, updateDoc, serverTimestamp, getDocs, query, where, limit, orderBy } from "firebase/firestore"
import { db } from "../../config/firebase"
import { backendFetch } from "../../services/backend/client"
import { setDiscoverable } from "../../services/DiscoveryService"
import FCMService from "../../services/firebase/FCMService"
import FAQ from "../../components/FAQ"
import { useSubscription } from "../../hooks/useSubscription"
import { useUserSettings } from '../../hooks/useUserSettings'
import MoonPhaseIcon from '../../components/MoonPhaseIcon'
import {
  formatLocalDateTime,
  formatLocalTime,
  getMoonPhaseAngle,
  getMoonPhaseKeyFromAngle,
  getMoonPhaseLabelFromAngle,
  getMoonPhaseLabelFromKey
} from '../../utils/moonPhase'
// Removido reprocesso manual de casas natais deste fluxo

const BACKEND_URL = (process.env.EXPO_PUBLIC_BACKEND_URL || 'https://tabulav0dev-backend.vercel.app').replace(/\/$/, '')

interface UserProfile {
  displayName: string
  profilePhoto?: string
  birthDate: string
  birthTime: string
  birthLocation: {
    city: string
    country: string
    latitude: number
    longitude: number
  }
  zodiacSign: string
  preferences: {
    notifications: {
      pushEnabled?: boolean
      pushIncludeMemberName?: boolean
      quietHours?: {
        enabled: boolean
        start: string
        end: string
      }
      push?: {
        types?: {
          member_status_critical?: boolean
          user_status_critical?: boolean
          group_message?: boolean
        }
        limits?: {
          member_status_critical?: { dailyLimit: number; throttleMinutes: number }
          user_status_critical?: { dailyLimit: number; throttleMinutes: number }
          group_message?: { dailyLimit: number; throttleMinutes: number; burstWindowMinutes?: number }
        }
      }
      inApp?: {
        types?: {
          member_status_critical?: boolean
          user_status_critical?: boolean
          group_message?: boolean
        }
      }
      criticalAlerts?: boolean
      groupUpdates?: boolean
      dailyHoroscope?: boolean
      weeklyForecast?: boolean
    }
    privacy: {
      showStatusToGroups: boolean
      allowGroupInvites: boolean
      shareTransitDurations: boolean
      shareLocation: boolean
      discoverable?: boolean
    }
    theme: "dark" | "light" | "auto"
  }
  stats: {
    groupsJoined: number
    alertsSent: number
    alertsReceived: number
    daysActive: number
  }
}

const buildDefaultProfile = (email?: string | null, fallbackName = 'Usuario'): UserProfile => ({
  displayName: email?.split("@")[0] || fallbackName,
  birthDate: "",
  birthTime: "",
  birthLocation: {
    city: "",
    country: "",
    latitude: 0,
    longitude: 0,
  },
  zodiacSign: "",
  preferences: {
    notifications: {
      pushEnabled: true,
      pushIncludeMemberName: false,
      quietHours: { enabled: false, start: "22:00", end: "08:00" },
      push: {
        types: {
          member_status_critical: true,
          user_status_critical: true,
          group_message: true,
        },
        limits: {
          member_status_critical: { dailyLimit: 5, throttleMinutes: 60 },
          user_status_critical: { dailyLimit: 3, throttleMinutes: 240 },
          group_message: { dailyLimit: 20, throttleMinutes: 10, burstWindowMinutes: 10 },
        },
      },
      inApp: {
        types: {
          member_status_critical: true,
          user_status_critical: true,
          group_message: true,
        },
      },
    },
    privacy: {
      showStatusToGroups: true,
      allowGroupInvites: true,
      shareTransitDurations: true,
      shareLocation: false,
    },
    theme: "dark",
  },
  stats: {
    groupsJoined: 0,
    alertsSent: 0,
    alertsReceived: 0,
    daysActive: 1,
  },
})

const sanitizeUserProfile = (raw: any, email?: string | null, fallbackName = 'Usuario'): UserProfile => {
  const defaults = buildDefaultProfile(email, fallbackName)
  const birthLocation = raw?.birthLocation || {}
  return {
    ...defaults,
    ...raw,
    displayName: raw?.displayName || defaults.displayName,
    birthLocation: {
      ...defaults.birthLocation,
      ...birthLocation,
    },
    preferences: {
      ...defaults.preferences,
      ...(raw?.preferences || {}),
      notifications: {
        ...defaults.preferences.notifications,
        ...(raw?.preferences?.notifications || {}),
        push: {
          ...defaults.preferences.notifications.push,
          ...(raw?.preferences?.notifications?.push || {}),
          types: {
            ...defaults.preferences.notifications.push?.types,
            ...(raw?.preferences?.notifications?.push?.types || {}),
          },
          limits: {
            ...defaults.preferences.notifications.push?.limits,
            ...(raw?.preferences?.notifications?.push?.limits || {}),
          },
        },
        inApp: {
          ...defaults.preferences.notifications.inApp,
          ...(raw?.preferences?.notifications?.inApp || {}),
          types: {
            ...defaults.preferences.notifications.inApp?.types,
            ...(raw?.preferences?.notifications?.inApp?.types || {}),
          },
        },
      },
      privacy: {
        ...defaults.preferences.privacy,
        ...(raw?.preferences?.privacy || {}),
      },
      theme: (raw?.preferences?.theme as "dark" | "light" | "auto") || defaults.preferences.theme,
    },
    stats: {
      ...defaults.stats,
      ...(raw?.stats || {}),
    },
  }
}

export default function ProfileScreen() {
  const { t, language } = useAppLanguage()
  const tr = (key: string, fallback: string, vars?: Record<string, string | number>) => {
    const value = t(key, vars as any)
    return value === key ? fallback : value
  }
  const navigation = useNavigation<any>()
  const { width } = useWindowDimensions()
  const isDesktopWeb = Platform.OS === 'web' && width >= 1024
  const { user, logout } = useAuth()
  const { subscription, isInTrial, trialDaysRemaining } = useSubscription()
  const { settings } = useUserSettings()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [showLocationModal, setShowLocationModal] = useState(false)
  const [showFAQ, setShowFAQ] = useState(false)
  const [savingPhoto, setSavingPhoto] = useState(false)
  const [moonPhaseKey, setMoonPhaseKey] = useState<string | null>(null)
  const [moonPhaseLabel, setMoonPhaseLabel] = useState<string | null>(null)
  const [moonLine2, setMoonLine2] = useState<string | null>(null)
  const [moonIsVoid, setMoonIsVoid] = useState(false)
  const [voidInfoVisible, setVoidInfoVisible] = useState(false)
  const [moonModalVisible, setMoonModalVisible] = useState(false)
  const [moonDetails, setMoonDetails] = useState<{
    phaseLabel: string
    phaseUntilLabel: string
    currentVoidLabel: string
    nextVoidLabel: string
    upcomingPhases: Array<{ label: string; when: string }>
  }>({
    phaseLabel: tr('profile.moon.defaultLabel', 'Lua'),
    phaseUntilLabel: tr('profile.moon.updatingPhase', 'fase em atualização'),
    currentVoidLabel: tr('profile.moon.no', 'Não'),
    nextVoidLabel: tr('profile.moon.noForecast', 'Sem previsão'),
    upcomingPhases: [],
  })
  const [recentReadings, setRecentReadings] = useState<Array<{
    id: string
    areaName: string | null
    areaScore: number | null
    areaTrend: string | null
    source: string
    readAt: { seconds: number } | null
  }>>([])

  const formatTimeAgo = (ms: number) => {
    const diff = Date.now() - ms
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return tr('profile.readings.justNow', 'agora')
    if (mins < 60) return `${mins}min`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h`
    return `${Math.floor(hrs / 24)}d`
  }

  const uploadProfilePhoto = async (userId: string, dataUrl: string): Promise<string | null> => {
    try {
      const response = await backendFetch('/api/upload/profile-photo', {
        method: 'POST',
        auth: true,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, dataUrl }),
      })
      if (!response.ok) return null
      const payload = await response.json()
      return payload?.url || null
    } catch (error) {
      console.warn('Falha ao enviar foto:', error)
      return null
    }
  }

  const forceBackendStatusRefresh = async (uid: string, reason: string) => {
    if (!BACKEND_URL) return
    try {
      await backendFetch('/api/status-refresh', {
        method: 'POST',
        auth: true,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: uid, force: true, reason }),
      })
    } catch (error) {
      console.warn('Falha ao forcar refresh de status no backend:', error)
    }
  }

  useEffect(() => {
    if (user) {
      loadUserProfile()
    }
  }, [user])

  useEffect(() => {
    if (user) {
      loadLunarCalendar()
    }
  }, [user, language, settings?.timezone])

  useEffect(() => {
    if (!user?.uid) return
    getDocs(query(
      collection(db, 'users', user.uid, 'readings'),
      orderBy('readAt', 'desc'),
      limit(5)
    )).then(snap => {
      setRecentReadings(snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })))
    }).catch(() => {})
  }, [user?.uid])

  const getDateOrderForDisplay = (): 'DMY' | 'MDY' => {
    const countryRaw = String(profile?.birthLocation?.country || '').trim().toLowerCase()
    const isUSCountry =
      countryRaw === 'us' ||
      countryRaw === 'usa' ||
      countryRaw.includes('united states') ||
      countryRaw.includes('estados unidos')
    if (isUSCountry) return 'MDY'
    if (language === 'en-US' && !countryRaw) return 'MDY'
    return 'DMY'
  }

  const getDayTokenForDisplay = () => (language === 'it-IT' ? 'GG' : 'DD')
  const getYearTokenForDisplay = () => (language === 'en-US' ? 'YYYY' : 'AAAA')
  const getBirthDateMaskForDisplay = () => {
    const order = getDateOrderForDisplay()
    const dayToken = getDayTokenForDisplay()
    const yearToken = getYearTokenForDisplay()
    return order === 'MDY' ? `MM/${dayToken}/${yearToken}` : `${dayToken}/MM/${yearToken}`
  }

  const normalizeBirthDateToIso = (value?: string) => {
    const raw = String(value || '').trim()
    if (!raw) return ''
    const isoMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(raw)
    if (isoMatch) return raw
    const digits = raw.replace(/\D/g, '')
    if (digits.length !== 8) return null
    const order = getDateOrderForDisplay()
    const first = parseInt(digits.slice(0, 2), 10)
    const second = parseInt(digits.slice(2, 4), 10)
    const day = order === 'MDY' ? second : first
    const month = order === 'MDY' ? first : second
    const year = parseInt(digits.slice(4, 8), 10)
    if (Number.isNaN(day) || Number.isNaN(month) || Number.isNaN(year)) return null
    if (year < 1900 || month < 1 || month > 12 || day < 1 || day > 31) return null
    const check = new Date(Date.UTC(year, month - 1, day))
    if (check.getUTCFullYear() !== year || check.getUTCMonth() + 1 !== month || check.getUTCDate() !== day) return null
    return `${year.toString().padStart(4, '0')}-${month.toString().padStart(2, '0')}-${day
      .toString()
      .padStart(2, '0')}`
  }

  const formatBirthDateForDisplay = (value?: string) => {
    if (!value) return tr('profile.info.notInformed', 'Não informado')
    const isoMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value).trim())
    if (!isoMatch) return String(value)
    const [, year, month, day] = isoMatch
    return getDateOrderForDisplay() === 'MDY'
      ? `${month}/${day}/${year}`
      : `${day}/${month}/${year}`
  }

  const normalizePhaseLabel = (raw?: string | null) => {
    if (!raw) return ""
    return raw.toLowerCase()
      .replace(/[áàãâ]/g, "a")
      .replace(/[éê]/g, "e")
      .replace(/[í]/g, "i")
      .replace(/[óôõ]/g, "o")
      .replace(/[ú]/g, "u")
  }

  const extractPhaseKey = (event: any) => {
    const raw = [
      event?.phase,
      event?.title,
      event?.name,
      event?.label,
      event?.eventId,
      event?.summary,
    ].filter(Boolean).join(" ")
    const label = normalizePhaseLabel(raw)
    if (label.includes("new") || label.includes("nova")) return "new"
    if (label.includes("full") || label.includes("cheia")) return "full"
    if ((label.includes("first") && label.includes("quarter")) || label.includes("quarto crescente")) return "firstQuarter"
    if ((label.includes("last") && label.includes("quarter")) || label.includes("quarto minguante")) return "lastQuarter"
    if (label.includes("waxing") && label.includes("crescent")) return "waxingCrescent"
    if (label.includes("waning") && label.includes("crescent")) return "waningCrescent"
    if (label.includes("waxing") && label.includes("gibbous")) return "waxingGibbous"
    if (label.includes("waning") && label.includes("gibbous")) return "waningGibbous"
    if (label.includes("crescente")) return "waxingCrescent"
    if (label.includes("minguante")) return "waningCrescent"
    return "new"
  }


  const loadLunarCalendar = async () => {
    try {
      const calendarSnap = await getDoc(doc(db, "settings", "astro_event_calendar"))
      if (!calendarSnap.exists()) {
        setMoonPhaseKey(null)
        setMoonIsVoid(false)
        setMoonDetails({
          phaseLabel: tr('profile.moon.defaultLabel', 'Lua'),
          phaseUntilLabel: tr('profile.moon.updatingPhase', 'fase em atualização'),
          currentVoidLabel: tr('profile.moon.no', 'Não'),
          nextVoidLabel: tr('profile.moon.noForecast', 'Sem previsão'),
          upcomingPhases: [],
        })
        return
      }
      const data = calendarSnap.data() || {}
      const events = Array.isArray(data.events) ? data.events : []
      const now = new Date()
      const userTz = settings?.timezone || 'America/Sao_Paulo'
      const toDate = (value: any) => {
        if (!value) return null
        if (typeof value?.toDate === 'function') return value.toDate()
        const parsed = new Date(value)
        return Number.isNaN(parsed.getTime()) ? null : parsed
      }

      let nextExact: Date | null = null
      let nextVoidStart: Date | null = null
      let nextVoidEnd: Date | null = null
      const upcomingPhases: Array<{ label: string; when: string }> = []

      for (const event of events) {
        const type = String(event?.eventType || '').toUpperCase()
        if (type !== 'LUNAR_PHASE') continue
        const exact = toDate(event.exactAt) || toDate(event.peakAt) || toDate(event.exact)
        if (exact && exact > now && (!nextExact || exact < nextExact)) {
          nextExact = exact
        }
        if (exact && exact > now && upcomingPhases.length < 4) {
          const phaseEventKey = extractPhaseKey(event)
          upcomingPhases.push({
            label: getMoonPhaseLabelFromKey(phaseEventKey as any, language),
            when: formatLocalDateTime(exact, userTz, language),
          })
        }
      }

      const voidEvents = events
        .filter((event) => String(event?.eventType || "").toUpperCase().includes("LUNAR_VOID"))
        .map((event) => ({
          startAt: toDate(event.startAt) || toDate(event.beginAt) || toDate(event.start),
          endAt: toDate(event.endAt) || toDate(event.finishAt) || toDate(event.end),
        }))
        .filter((event) => event.startAt && event.endAt) as Array<{ startAt: Date; endAt: Date }>

      const currentVoid = voidEvents.find((event) => now >= event.startAt && now <= event.endAt)
      const isVoid = Boolean(currentVoid)
      const nextVoid = voidEvents
        .filter((event) => event.startAt > now)
        .sort((a, b) => a.startAt.getTime() - b.startAt.getTime())[0]
      if (nextVoid) {
        nextVoidStart = nextVoid.startAt
        nextVoidEnd = nextVoid.endAt
      }

      const angle = getMoonPhaseAngle(now)
      const angleKey = getMoonPhaseKeyFromAngle(angle)
      const phaseKey = angle >= 315 ? "waningCrescent" : angleKey
      let phaseLabel = getMoonPhaseLabelFromAngle(angle, language)
      if (angle >= 315) phaseLabel = tr('profile.moon.balsamic', 'Lua Balsâmica')

      const line1 = isVoid ? `${phaseLabel} · ${tr('profile.moon.void', 'Lua Vazia')}` : phaseLabel
      const line2Base = nextExact
        ? tr('profile.moon.until', 'até {date}', { date: formatLocalDateTime(nextExact, userTz, language) })
        : tr('profile.moon.updatingPhase', 'fase em atualização')
      setMoonPhaseKey(phaseKey)
      setMoonPhaseLabel(line1)
      setMoonLine2(line2Base)
      setMoonIsVoid(isVoid)
      setMoonDetails({
        phaseLabel,
        phaseUntilLabel: line2Base,
        currentVoidLabel: isVoid && currentVoid?.endAt
          ? tr('profile.moon.currentVoidYesUntil', 'Sim, até {time}', { time: formatLocalTime(new Date(currentVoid.endAt), userTz, language) })
          : tr('profile.moon.no', 'Não'),
        nextVoidLabel: nextVoidStart
          ? `${formatLocalDateTime(nextVoidStart, userTz, language)}${nextVoidEnd ? ` ${tr('profile.moon.until', 'até {date}', { date: formatLocalTime(nextVoidEnd, userTz, language) })}` : ""}`
          : tr('profile.moon.noForecast', 'Sem previsão'),
        upcomingPhases,
      })
    } catch (error) {
      console.warn("Falha ao carregar calendario lunar:", error)
    }
  }

  const loadUserProfile = async () => {
    try {
      setLoading(true)
      const userDoc = await getDoc(doc(db, "users", user!.uid))

      if (userDoc.exists()) {
        const safeProfile = sanitizeUserProfile(
          userDoc.data(),
          user?.email,
          tr('common.user', 'Usuario')
        )
        setProfile(safeProfile)
      } else {
        const defaultProfile = buildDefaultProfile(user?.email, tr('common.user', 'Usuario'))

        await setDoc(doc(db, "users", user!.uid), defaultProfile)
        setProfile(defaultProfile)
      }
    } catch (error) {
      console.error("Erro ao carregar perfil:", error)
      Alert.alert(tr('profile.alert.errorTitle', 'Erro'), tr('profile.alert.loadFailed', 'Não foi possível carregar o perfil'))
    } finally {
      setLoading(false)
    }
  }

  const subscriptionStatusLabel = (() => {
    if (isInTrial) return tr('profile.subscription.trial', 'Teste ({days} dias)', { days: trialDaysRemaining })
    if (!subscription) return tr('profile.subscription.none', 'Sem assinatura')
    if (subscription.status === 'active' || subscription.isActive) return tr('profile.subscription.active', 'Ativa')
    if (subscription.status === 'trial') return tr('profile.subscription.trial', 'Teste ({days} dias)', { days: trialDaysRemaining })
    if (subscription.status === 'cancelled') return tr('profile.subscription.cancelled', 'Cancelada')
    if (subscription.status === 'pending') return tr('profile.subscription.pending', 'Pendente')
    return tr('profile.subscription.none', 'Sem assinatura')
  })()

  const saveProfile = async () => {
    if (!profile) return

    try {
      const normalizedBirthDate = normalizeBirthDateToIso(profile.birthDate)
      if (profile.birthDate && !normalizedBirthDate) {
        Alert.alert(
          tr('profile.alert.errorTitle', 'Erro'),
          `${tr('profile.input.birthDate', 'Data de nascimento')} ${getBirthDateMaskForDisplay()}`
        )
        return
      }
      let updatedPhoto = profile.profilePhoto || null
      if (user && updatedPhoto && updatedPhoto.startsWith('data:')) {
        setSavingPhoto(true)
        const uploaded = await uploadProfilePhoto(user.uid, updatedPhoto)
        updatedPhoto = uploaded || updatedPhoto
      }

      const payload = {
        displayName: profile.displayName,
        birthDate: normalizedBirthDate || '',
        birthTime: profile.birthTime,
        birthLocation: profile.birthLocation,
        zodiacSign: profile.zodiacSign,
        profilePhoto: updatedPhoto,
      }
      await updateDoc(doc(db, "users", user!.uid), payload)
      await setDoc(
        doc(db, "userPublicProfiles", user!.uid),
        {
          displayName: profile.displayName || "Usuario",
          profilePhoto: updatedPhoto || null,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      )
      await forceBackendStatusRefresh(user!.uid, 'profile_screen_save')
      setEditing(false)
      Alert.alert(tr('profile.alert.successTitle', 'Sucesso'), tr('profile.alert.saveSuccess', 'Perfil atualizado com sucesso!'))
    } catch (error) {
      console.error("Erro ao salvar perfil:", error)
      Alert.alert(tr('profile.alert.errorTitle', 'Erro'), tr('profile.alert.saveFailed', 'Não foi possível salvar o perfil'))
    } finally {
      setSavingPhoto(false)
    }
  }

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== 'granted') {
      Alert.alert(tr('profile.permission.title', 'Permissão Necessária'), tr('profile.permission.gallery', 'Precisamos de acesso à galeria para selecionar sua foto.'))
      return false
    }
    return true
  }

  const selectPhoto = async () => {
    if (!profile || !user) return

    if (Platform.OS === 'web') {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = 'image/*'
      input.onchange = async (event: any) => {
        const file = event.target.files[0]
        if (!file) return

        const compressToDataUrl = async (file: File): Promise<string> => {
          const img = document.createElement('img')
          const objectUrl = URL.createObjectURL(file)
          await new Promise((res) => {
            img.onload = () => res(null as any)
            img.src = objectUrl
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

        const dataUrl = await compressToDataUrl(file)
        setProfile({ ...profile, profilePhoto: dataUrl })
      }
      input.click()
      return
    }

    const hasPermission = await requestPermissions()
    if (!hasPermission) return

    Alert.alert(
      tr('profile.photo.chooseTitle', 'Escolher Foto'),
      tr('profile.photo.chooseBody', 'Como você gostaria de adicionar sua foto?'),
      [
        { text: tr('common.cancel', 'Cancelar'), style: 'cancel' },
        { text: tr('profile.photo.gallery', 'Galeria'), onPress: () => pickImage('gallery') },
        { text: tr('profile.photo.camera', 'Câmera'), onPress: () => pickImage('camera') },
      ]
    )
  }

  const pickImage = async (source: 'gallery' | 'camera') => {
    if (!profile) return

    try {
      let result

      if (source === 'camera') {
        const { status } = await ImagePicker.requestCameraPermissionsAsync()
        if (status !== 'granted') {
          Alert.alert(tr('profile.permission.title', 'Permissão Necessária'), tr('profile.permission.camera', 'Precisamos de acesso à câmera.'))
          return
        }
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        })
      } else {
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        })
      }

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0]
        const manipulatedImage = await ImageManipulator.manipulateAsync(
          asset.uri,
          [{ resize: { width: 600, height: 600 } }],
          { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG, base64: true }
        )
        const dataUrl = manipulatedImage.base64
          ? `data:image/jpeg;base64,${manipulatedImage.base64}`
          : manipulatedImage.uri
        setProfile({ ...profile, profilePhoto: dataUrl })
      }
    } catch (error) {
      console.error('Erro ao selecionar foto:', error)
      Alert.alert(tr('profile.alert.errorTitle', 'Erro'), tr('profile.alert.selectPhotoFailed', 'Não foi possível selecionar a foto. Tente novamente.'))
    }
  }

  const handleLogout = async () => {
    // Web: usar confirm() para garantir fluxo sem modais nativos bloqueando estado
    if (Platform.OS === 'web') {
      // eslint-disable-next-line no-restricted-globals
      const ok = window.confirm(tr('profile.logout.confirm', 'Tem certeza que deseja sair da sua conta?'))
      if (!ok) return
      try {
        await FCMService.clearAllNotifications()
        await logout()
      } catch (error) {
        console.error('Erro ao fazer logout (web):', error)
      }
      return
    }

    Alert.alert(tr('profile.logout.title', 'Sair'), tr('profile.logout.confirm', 'Tem certeza que deseja sair da sua conta?'), [
      { text: tr('common.cancel', 'Cancelar'), style: "cancel" },
      {
        text: tr('profile.logout.title', 'Sair'),
        style: "destructive",
        onPress: async () => {
          try {
            await FCMService.clearAllNotifications()
            await logout()
          } catch (error) {
            console.error("Erro ao fazer logout:", error)
          }
        },
      },
    ])
  }

  const updatePrivacyPreference = async (key: keyof UserProfile["preferences"]["privacy"], value: boolean) => {
    if (!profile) return

    const updatedProfile = {
      ...profile,
      preferences: {
        ...profile.preferences,
        privacy: {
          ...profile.preferences.privacy,
          [key]: value,
        },
      },
    }

    setProfile(updatedProfile)

    try {
      await updateDoc(doc(db, "users", user!.uid), {
        "preferences.privacy": updatedProfile.preferences.privacy,
      })
    } catch (error) {
      console.error("Erro ao atualizar preferência:", error)
    }
  }

  // "Quero ser encontrado": além da preferência, chama o backend que PUBLICA o
  // perfil público (calcula o trio, popula userPublicProfiles) ou o despublica.
  const handleDiscoverable = async (value: boolean) => {
    updatePrivacyPreference("discoverable", value)
    try { await setDiscoverable(value) } catch (e) { console.warn("setDiscoverable falhou:", (e as any)?.message) }
  }


  if (loading) {
    return (
      <LinearGradient colors={["#0F0F23", "#1A1A3A"]} style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>{tr('profile.loading', 'Carregando perfil...')}</Text>
        </View>
      </LinearGradient>
    )
  }

  if (!profile) {
    return (
      <LinearGradient colors={["#0F0F23", "#1A1A3A"]} style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{tr('profile.error.load', 'Erro ao carregar perfil')}</Text>
        </View>
      </LinearGradient>
    )
  }

  return (
    <LinearGradient colors={["#0F0F23", "#1A1A3A"]} style={styles.container}>
      <ScrollView
        style={[styles.scrollView, isDesktopWeb ? styles.scrollViewDesktopWeb : null]}
        showsVerticalScrollIndicator={isDesktopWeb}
      >
        {/* Header do Perfil */}
        <View style={styles.profileHeader}>
          <View style={styles.profileHeaderTop}>
            <View style={styles.profileHeaderSpacer} />
            <TouchableOpacity style={styles.moonWidget} onPress={() => setMoonModalVisible(true)}>
              <View style={styles.moonIconWrap}>
                <MoonPhaseIcon phaseKey={moonPhaseKey as any} size={36} />
              </View>
              <View style={styles.moonLegend}>
                <Text style={styles.moonLegendLine1} numberOfLines={1}>
                  {moonPhaseLabel || tr('profile.moon.defaultLabel', 'Lua')}
                </Text>
                <View style={styles.moonLegendLine2Row}>
                  <Text style={styles.moonLegendLine2} numberOfLines={1}>
                    {moonLine2 || tr('profile.moon.updatingPhase', 'fase em atualização')}
                  </Text>
                  {moonIsVoid && (
                    <TouchableOpacity onPress={() => setVoidInfoVisible(true)}>
                      <Text style={styles.moonVoidAlertText}> · {tr('profile.moon.void', 'Lua Vazia')}</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.avatarContainer} onPress={selectPhoto} disabled={savingPhoto}>
            {profile.profilePhoto ? (
              <Image source={{ uri: profile.profilePhoto }} style={styles.avatarImage} />
            ) : (
              <Ionicons name="person-circle" size={80} color="#FFD700" />
            )}
            <View style={styles.avatarEditBadge}>
              <Ionicons name="camera" size={14} color="#000" />
            </View>
          </TouchableOpacity>
          <Text style={styles.displayName}>{profile.displayName}</Text>
          <Text style={styles.email}>{user?.email}</Text>
          {profile.zodiacSign && <Text style={styles.zodiacSign}>♈ {profile.zodiacSign}</Text>}
        </View>

        {/* Estatísticas */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{profile.stats?.groupsJoined || 0}</Text>
            <Text style={styles.statLabel}>{tr('profile.stats.groups', 'Grupos')}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{profile.stats?.alertsSent || 0}</Text>
            <Text style={styles.statLabel}>{tr('profile.stats.alertsSent', 'Alertas Enviados')}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{profile.stats?.alertsReceived || 0}</Text>
            <Text style={styles.statLabel}>{tr('profile.stats.alertsReceived', 'Alertas Recebidos')}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{profile.stats?.daysActive || 1}</Text>
            <Text style={styles.statLabel}>{tr('profile.stats.daysActive', 'Dias Ativo')}</Text>
          </View>
        </View>

        {/* Subscription Button */}
        <TouchableOpacity
          style={styles.subscriptionButton}
          onPress={() => navigation.navigate('Premium', { openTab: 'features' })}
          activeOpacity={0.8}
        >
          <View style={styles.subscriptionButtonContent}>
            <Ionicons name="card-outline" size={24} color="#8B5FBF" />
            <View style={styles.subscriptionButtonTextContainer}>
              <Text style={styles.subscriptionButtonText}>{tr('profile.subscription.title', 'Assinatura')}</Text>
              <Text style={styles.subscriptionStatus}>{subscriptionStatusLabel}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#8B5FBF" />
          </View>
        </TouchableOpacity>

        {/* Leituras Recentes */}
        {recentReadings.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{tr('profile.readings.title', 'Leituras Recentes')}</Text>
            {recentReadings.map(r => (
              <View key={r.id} style={styles.readingItem}>
                <View style={styles.readingIconWrap}>
                  <Ionicons
                    name={r.areaTrend === 'positive' ? 'trending-up' : r.areaTrend === 'negative' ? 'trending-down' : 'remove'}
                    size={16}
                    color={r.areaTrend === 'positive' ? '#4CAF50' : r.areaTrend === 'negative' ? '#FF6B6B' : '#888'}
                  />
                </View>
                <View style={styles.readingContent}>
                  <Text style={styles.readingArea}>{r.areaName ?? tr('profile.readings.fullConsult', 'Consulta WA')}</Text>
                  {r.areaScore != null && (
                    <Text style={styles.readingScore}>{r.areaScore}/100</Text>
                  )}
                </View>
                <View style={styles.readingMeta}>
                  <Text style={styles.readingSource}>{r.source === 'whatsapp_agent' ? '📱 WA' : '⭐ App'}</Text>
                  {r.readAt?.seconds != null && (
                    <Text style={styles.readingTime}>{formatTimeAgo(r.readAt.seconds * 1000)}</Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* FAQ Button */}
        <TouchableOpacity
          style={styles.faqButton}
          onPress={() => setShowFAQ(true)}
          activeOpacity={0.8}
        >
          <View style={styles.faqButtonContent}>
            <Ionicons name="help-circle-outline" size={24} color="#8B5FBF" />
            <Text style={styles.faqButtonText}>{tr('profile.faq.cta', 'Como este aplicativo funciona?')}</Text>
            <Ionicons name="chevron-forward" size={20} color="#8B5FBF" />
          </View>
        </TouchableOpacity>

        {/* Informações Pessoais */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{tr('profile.section.personalInfo', 'Informações Pessoais')}</Text>
            <TouchableOpacity onPress={() => setEditing(!editing)}>
              <Ionicons name={editing ? "checkmark" : "pencil"} size={20} color="#FFD700" />
            </TouchableOpacity>
          </View>

          {editing ? (
            <>
              <TextInput
                style={styles.input}
                placeholder={tr('profile.input.displayName', 'Nome de exibição')}
                placeholderTextColor="#888"
                value={profile.displayName}
                onChangeText={(text) => setProfile({ ...profile, displayName: text })}
              />
              <TextInput
                style={styles.input}
                placeholder={`${tr('profile.input.birthDate', 'Data de nascimento')} (${getBirthDateMaskForDisplay()})`}
                placeholderTextColor="#888"
                value={profile.birthDate}
                onChangeText={(text) => setProfile({ ...profile, birthDate: text })}
              />
              <TextInput
                style={styles.input}
                placeholder={tr('profile.input.birthTime', 'Horário de nascimento (HH:MM)')}
                placeholderTextColor="#888"
                value={profile.birthTime}
                onChangeText={(text) => setProfile({ ...profile, birthTime: text })}
              />
              <TouchableOpacity style={styles.locationButton} onPress={() => setShowLocationModal(true)}>
                <Text style={styles.locationButtonText}>
                  {profile.birthLocation?.city
                    ? `${profile.birthLocation.city}, ${profile.birthLocation.country}`
                    : tr('profile.input.setBirthLocation', 'Definir local de nascimento')}
                </Text>
                <Ionicons name="location" size={20} color="#FFD700" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={saveProfile}>
                <Text style={styles.saveButtonText}>{tr('profile.saveChanges', 'Salvar Alterações')}</Text>
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.infoContainer}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>{tr('profile.info.birthDate', 'Data de Nascimento:')}</Text>
                <Text style={styles.infoValue}>{formatBirthDateForDisplay(profile.birthDate)}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>{tr('profile.info.birthTime', 'Horário:')}</Text>
                <Text style={styles.infoValue}>{profile.birthTime || tr('profile.info.notInformed', 'Não informado')}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>{tr('profile.info.location', 'Local:')}</Text>
                <Text style={styles.infoValue}>
                  {profile.birthLocation?.city
                    ? `${profile.birthLocation.city}, ${profile.birthLocation.country}`
                    : tr('profile.info.notInformed', 'Não informado')}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Preferências de Privacidade */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{tr('profile.section.privacy', 'Privacidade')}</Text>

          <View style={styles.preferenceItem}>
            <View style={styles.preferenceInfo}>
              <Text style={styles.preferenceTitle}>{tr('profile.privacy.discoverable.title', 'Quero ser encontrado')}</Text>
              <Text style={styles.preferenceDescription}>
                {tr('profile.privacy.discoverable.desc', 'Aparecer na busca de pessoas com nome, foto, signos e cidade. Sua data de nascimento nunca fica pública.')}
              </Text>
            </View>
            <Switch
              value={profile.preferences?.privacy?.discoverable || false}
              onValueChange={handleDiscoverable}
              trackColor={{ false: "#2C2C2E", true: "#FFD700" }}
              thumbColor={profile.preferences?.privacy?.discoverable ? "#000" : "#888"}
            />
          </View>

          <View style={styles.preferenceItem}>
            <View style={styles.preferenceInfo}>
              <Text style={styles.preferenceTitle}>{tr('profile.privacy.showStatus.title', 'Mostrar Status nos Grupos')}</Text>
              <Text style={styles.preferenceDescription}>
                {tr('profile.privacy.showStatus.desc', 'Permitir que membros do grupo vejam seu status astrológico')}
              </Text>
            </View>
            <Switch
              value={profile.preferences?.privacy?.showStatusToGroups || false}
              onValueChange={(value) => updatePrivacyPreference("showStatusToGroups", value)}
              trackColor={{ false: "#2C2C2E", true: "#FFD700" }}
              thumbColor={profile.preferences?.privacy?.showStatusToGroups ? "#000" : "#888"}
            />
          </View>

          <View style={styles.preferenceItem}>
            <View style={styles.preferenceInfo}>
              <Text style={styles.preferenceTitle}>{tr('profile.privacy.shareTransit.title', 'Compartilhar duração dos trânsitos')}</Text>
              <Text style={styles.preferenceDescription}>
                {tr('profile.privacy.shareTransit.desc', 'Permitir que membros vejam a duração exata dos aspectos no grupo')}
              </Text>
            </View>
            <Switch
              value={profile.preferences?.privacy?.shareTransitDurations ?? true}
              onValueChange={(value) => updatePrivacyPreference("shareTransitDurations", value)}
              trackColor={{ false: "#2C2C2E", true: "#FFD700" }}
              thumbColor={profile.preferences?.privacy?.shareTransitDurations ? "#000" : "#888"}
            />
          </View>

          <View style={styles.preferenceItem}>
            <View style={styles.preferenceInfo}>
              <Text style={styles.preferenceTitle}>{tr('profile.privacy.allowInvites.title', 'Permitir Convites')}</Text>
              <Text style={styles.preferenceDescription}>{tr('profile.privacy.allowInvites.desc', 'Receber convites para novos grupos')}</Text>
            </View>
            <Switch
              value={profile.preferences?.privacy?.allowGroupInvites || false}
              onValueChange={(value) => updatePrivacyPreference("allowGroupInvites", value)}
              trackColor={{ false: "#2C2C2E", true: "#FFD700" }}
              thumbColor={profile.preferences?.privacy?.allowGroupInvites ? "#000" : "#888"}
            />
          </View>
        </View>

        {/* Ações */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out" size={20} color="#FF4444" />
            <Text style={styles.logoutButtonText}>{tr('profile.logout.button', 'Sair da Conta')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal
        visible={moonModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMoonModalVisible(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={styles.moonModalBackdrop}
          onPress={() => setMoonModalVisible(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={styles.moonModalCard}
            onPress={() => { }}
          >
            <Text style={styles.moonModalTitle}>{tr('profile.moon.modal.title', 'Calendário Lunar')}</Text>
            <ScrollView style={styles.moonModalScroll} showsVerticalScrollIndicator={false}>
              <Text style={styles.moonModalSectionTitle}>{tr('profile.moon.modal.now', 'Lua agora')}</Text>
              <Text style={styles.moonModalText}>{moonDetails.phaseLabel}</Text>
              <Text style={styles.moonModalText}>{moonDetails.phaseUntilLabel}</Text>

              <Text style={styles.moonModalSectionTitle}>{tr('profile.moon.modal.void', 'Lua vazia')}</Text>
              <Text style={styles.moonModalText}>{tr('profile.moon.modal.current', 'Atual')}: {moonDetails.currentVoidLabel}</Text>
              <Text style={styles.moonModalText}>{tr('profile.moon.modal.next', 'Próxima')}: {moonDetails.nextVoidLabel}</Text>

              <Text style={styles.moonModalSectionTitle}>{tr('profile.moon.modal.upcoming', 'Próximas fases')}</Text>
              {moonDetails.upcomingPhases.length ? (
                moonDetails.upcomingPhases.map((item) => (
                  <View key={`${item.label}-${item.when}`} style={styles.moonModalItem}>
                    <Text style={styles.moonModalItemLabel}>{item.label}</Text>
                    <Text style={styles.moonModalItemWhen}>{item.when}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.moonModalText}>{tr('profile.moon.modal.noUpcoming', 'Sem eventos futuros no calendário.')}</Text>
              )}
            </ScrollView>
            <TouchableOpacity
              style={styles.moonModalCloseButton}
              onPress={() => setMoonModalVisible(false)}
            >
              <Text style={styles.moonModalCloseText}>{tr('common.close', 'Fechar')}</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      <Modal
        visible={voidInfoVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setVoidInfoVisible(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={styles.moonModalBackdrop}
          onPress={() => setVoidInfoVisible(false)}
        >
          <TouchableOpacity activeOpacity={1} style={styles.moonModalCard} onPress={() => { }}>
            <Text style={styles.moonModalTitle}>{tr('profile.moon.void', 'Lua Vazia')}</Text>
            <Text style={styles.moonModalText}>
              {tr('profile.moon.voidInfo.body1', 'A Lua Vazia é um período entre o último aspecto da Lua em um signo e a entrada no próximo signo.')}
            </Text>
            <Text style={styles.moonModalText}>
              {tr('profile.moon.voidInfo.body2', 'Tendência: menor tração para decisões finais e temas novos. Melhor para revisão, finalização e descanso.')}
            </Text>
            <Text style={styles.moonModalSectionTitle}>{tr('profile.moon.voidInfo.recommendations', 'Recomendações')}</Text>
            <Text style={styles.moonModalText}>• {tr('profile.moon.voidInfo.tip1', 'Revisar pendências e organizar o que já está em andamento.')}</Text>
            <Text style={styles.moonModalText}>• {tr('profile.moon.voidInfo.tip2', 'Evitar iniciar algo importante sem urgência real.')}</Text>
            <Text style={styles.moonModalText}>• {tr('profile.moon.voidInfo.tip3', 'Priorizar autocuidado, observação e ajustes finos.')}</Text>
            <TouchableOpacity
              style={styles.moonModalCloseButton}
              onPress={() => setVoidInfoVisible(false)}
            >
              <Text style={styles.moonModalCloseText}>{tr('common.close', 'Fechar')}</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* FAQ Modal */}
      <FAQ visible={showFAQ} onClose={() => setShowFAQ(false)} />

    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  scrollViewDesktopWeb: {
    paddingRight: 8,
    ...(Platform.OS === 'web'
      ? ({
        overflowY: 'scroll',
        scrollbarWidth: 'thin',
        scrollbarColor: '#64748B rgba(15,23,42,0.35)',
      } as any)
      : null),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "#FF4444",
    fontSize: 16,
  },
  profileHeader: {
    alignItems: "center",
    paddingTop: 8,
    paddingBottom: 16,
  },
  profileHeaderTop: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  profileHeaderSpacer: {
    width: 24,
  },
  moonWidget: {
    alignItems: "flex-end",
    gap: 6,
  },
  moonIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1C1C1E",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarContainer: {
    marginBottom: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarEditBadge: {
    position: "absolute",
    right: -2,
    bottom: -2,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#FFD700",
    alignItems: "center",
    justifyContent: "center",
  },
  displayName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: "#888",
    marginBottom: 8,
  },
  zodiacSign: {
    fontSize: 18,
    color: "#FFD700",
    fontWeight: "bold",
  },
  moonLegend: {
    alignItems: "flex-end",
  },
  moonLegendLine1: {
    fontSize: 12,
    color: "#F5F0C8",
    fontWeight: "600",
    lineHeight: 16,
  },
  moonLegendLine2: {
    fontSize: 11,
    color: "#C9C3A2",
    lineHeight: 14,
  },
  moonLegendLine2Row: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "nowrap",
  },
  moonVoidAlertText: {
    fontSize: 11,
    color: "#FF6B6B",
    fontWeight: "700",
    lineHeight: 14,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#1C1C1E",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFD700",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#888",
    textAlign: "center",
  },
  section: {
    backgroundColor: "#1C1C1E",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  advancedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2C2C2E',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  advancedButtonText: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 4,
  },
  input: {
    backgroundColor: "#2C2C2E",
    borderRadius: 8,
    padding: 12,
    color: "#FFFFFF",
    fontSize: 16,
    marginBottom: 12,
  },
  locationButton: {
    backgroundColor: "#2C2C2E",
    borderRadius: 8,
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  locationButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: "#FFD700",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    marginTop: 8,
  },
  saveButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
  infoContainer: {
    gap: 12,
  },
  infoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoLabel: {
    color: "#888",
    fontSize: 14,
  },
  infoValue: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
  },
  preferenceItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#2C2C2E",
  },
  preferenceInfo: {
    flex: 1,
    marginRight: 16,
  },
  preferenceTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  preferenceDescription: {
    color: "#888",
    fontSize: 12,
    lineHeight: 16,
  },
  testButton: {
    backgroundColor: "#FFD700",
    borderRadius: 8,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },
  testButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  logoutButton: {
    backgroundColor: "#2C1B1B",
    borderRadius: 8,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#FF4444",
  },
  logoutButtonText: {
    color: "#FF4444",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  faqButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  faqButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  faqButtonText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: "#2D1B69",
    marginLeft: 12,
  },
  subscriptionButton: {
    backgroundColor: "#1C1C1E",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  subscriptionButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  subscriptionButtonTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  subscriptionButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  subscriptionStatus: {
    fontSize: 12,
    color: "#8B5FBF",
    marginTop: 2,
  },
  readingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2E',
  },
  readingIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#2C2C2E',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  readingContent: {
    flex: 1,
  },
  readingArea: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  readingScore: {
    color: '#FFD700',
    fontSize: 12,
    marginTop: 2,
  },
  readingMeta: {
    alignItems: 'flex-end',
  },
  readingSource: {
    fontSize: 11,
    color: '#888',
  },
  readingTime: {
    fontSize: 11,
    color: '#888',
    marginTop: 2,
  },
  notificationModal: {
    backgroundColor: "#0F0F23",
    borderRadius: 16,
    width: "90%",
    maxHeight: "80%",
    overflow: "hidden",
  },
  notificationList: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  notificationItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#2C2C2E",
  },
  notificationIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#1C1C1E",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  notificationBody: {
    color: "#B8B8C3",
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 6,
  },
  notificationMeta: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 6,
  },
  notificationTag: {
    backgroundColor: "#2C2C2E",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  notificationTagText: {
    color: "#FFD700",
    fontSize: 10,
    fontWeight: "600",
  },
  notificationTime: {
    color: "#8A8AA8",
    fontSize: 10,
    marginLeft: "auto",
  },
  notificationEmpty: {
    color: "#888",
    textAlign: "center",
    paddingVertical: 24,
  },
  moonModalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.65)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  moonModalCard: {
    width: "100%",
    maxWidth: 420,
    maxHeight: "80%",
    backgroundColor: "#15152D",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 215, 0, 0.25)",
    padding: 16,
  },
  moonModalTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
  },
  moonModalScroll: {
    marginBottom: 12,
  },
  moonModalSectionTitle: {
    color: "#FFD700",
    fontSize: 14,
    fontWeight: "700",
    marginTop: 10,
    marginBottom: 6,
  },
  moonModalText: {
    color: "#E6E6E6",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  moonModalItem: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
  },
  moonModalItemLabel: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  moonModalItemWhen: {
    color: "#B8B8B8",
    fontSize: 13,
    marginTop: 2,
  },
  moonModalCloseButton: {
    alignSelf: "flex-end",
    backgroundColor: "#FFD700",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  moonModalCloseText: {
    color: "#1A1A1A",
    fontSize: 13,
    fontWeight: "700",
  },
})
