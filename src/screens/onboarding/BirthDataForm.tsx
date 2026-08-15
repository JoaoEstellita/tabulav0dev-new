import React, { useState, useEffect, useRef } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
  FlatList,
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Modal,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import DateTimePicker from '@react-native-community/datetimepicker'
import * as ImagePicker from 'expo-image-picker'
import * as ImageManipulator from 'expo-image-manipulator'
import LocationService, { type LocationSuggestion, type CountryOption } from '../../services/LocationService'
import { useAuth } from '../../hooks/useAuth'
import { hardSignOut } from '../../services/auth/logout'
import ResponsiveContainer from '../../components/ResponsiveContainer'
import StarLoader from '../../components/StarLoader'
import { AnimatedMount } from '../../ui/anim/adapter'
import { FONT_SIZES, SPACING, isDesktop, isTablet } from '../../styles/responsive'
import { useOrientation } from '../../hooks/useOrientation'
import { useAppLanguage } from '../../hooks/useAppLanguage'
import { subscribeWebPush } from '../../webpush/subscribe'
import { registerDeviceToken } from '../../services/notifications/registerDeviceToken'
import type { AppLanguage } from '../../i18n/appI18n'

interface BirthDataFormProps {
  onComplete: (data: BirthData) => void
  loading?: boolean
}

export interface BirthData {
  fullName?: string
  profilePhoto?: string
  birthDate: string
  birthTime: string
  birthTimeUnknown?: boolean
  birthLocation: {
    city: string
    country: string
    latitude: number
    longitude: number
  }
  language?: AppLanguage
  birthCountryCode?: string
}

const TOTAL_STEPS = 6

export default function BirthDataForm({ onComplete, loading = false }: BirthDataFormProps) {
  const { logout, user } = useAuth()
  const { language, languages, setLanguage, t } = useAppLanguage()
  const { isLandscape } = useOrientation()
  const isCompactMobile = !isDesktop() && !isTablet()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    fullName: '',
    profilePhoto: '',
    birthDate: '',
    birthTime: '',
    city: '',
    country: '',
    latitude: 0,
    longitude: 0,
    language,
    birthCountryCode: language === 'pt-BR' ? 'BR' : '',
  })
  const [birthDateDisplay, setBirthDateDisplay] = useState('')
  const [birthTimeDisplay, setBirthTimeDisplay] = useState('')
  const [birthDateError, setBirthDateError] = useState('')
  const [birthTimeError, setBirthTimeError] = useState('')
  const [birthTimeUnknown, setBirthTimeUnknown] = useState(false)

  // Estados para DateTimePicker
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showTimePicker, setShowTimePicker] = useState(false)
  const [tempDate, setTempDate] = useState(new Date())
  const [tempTime, setTempTime] = useState(new Date())

  // Estados para busca de localização
  const [locationQuery, setLocationQuery] = useState('')
  const [locationSuggestions, setLocationSuggestions] = useState<LocationSuggestion[]>([])
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false)
  const [searchingLocation, setSearchingLocation] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<LocationSuggestion | null>(null)
  const [countryQuery, setCountryQuery] = useState('')
  const [countryOptions, setCountryOptions] = useState<CountryOption[]>([])
  const [showCountrySuggestions, setShowCountrySuggestions] = useState(false)
  const [countryModalVisible, setCountryModalVisible] = useState(false)
  const [searchingCountry, setSearchingCountry] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState<CountryOption | null>(null)
  const [notificationsGranted, setNotificationsGranted] = useState(false)
  const scrollRef = useRef<ScrollView | null>(null)
  const birthDateInputRef = useRef<TextInput | null>(null)
  const birthTimeInputRef = useRef<TextInput | null>(null)

  const formatDateDisplay = (isoDate: string) => {
    if (!isoDate) return ''
    const parts = isoDate.split('-')
    if (parts.length !== 3) return isoDate
    const order = getDateOrder()
    if (order === 'MDY') return `${parts[1]}/${parts[2]}/${parts[0]}`
    return `${parts[2]}/${parts[1]}/${parts[0]}`
  }

  const getDateOrder = (): 'DMY' | 'MDY' => {
    const country = (formData.birthCountryCode || '').toUpperCase()
    if (country === 'US') return 'MDY'
    if (language === 'en-US' && !country) return 'MDY'
    return 'DMY'
  }

  const getDayToken = () => (language === 'it-IT' ? 'GG' : 'DD')
  const getYearToken = () => (language === 'en-US' ? 'YYYY' : 'AAAA')
  const getDatePlaceholder = () => {
    const order = getDateOrder()
    const dayToken = getDayToken()
    const yearToken = getYearToken()
    if (order === 'MDY') return `MM/${dayToken}/${yearToken}`
    return `${dayToken}/MM/${yearToken}`
  }

  const formatDateInput = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 8)
    if (digits.length <= 2) return digits
    if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`
  }

  const toIsoDateFromDisplay = (value: string) => {
    const digits = value.replace(/\D/g, '')
    if (digits.length !== 8) return null
    const order = getDateOrder()
    const first = parseInt(digits.slice(0, 2), 10)
    const second = parseInt(digits.slice(2, 4), 10)
    const day = order === 'MDY' ? second : first
    const month = order === 'MDY' ? first : second
    const year = parseInt(digits.slice(4, 8), 10)
    if (Number.isNaN(day) || Number.isNaN(month) || Number.isNaN(year)) return null
    if (year < 1900 || month < 1 || month > 12 || day < 1 || day > 31) return null
    const check = new Date(Date.UTC(year, month - 1, day))
    if (check.getUTCFullYear() !== year || check.getUTCMonth() + 1 !== month || check.getUTCDate() !== day) return null
    const iso = `${year.toString().padStart(4, '0')}-${month.toString().padStart(2, '0')}-${day
      .toString()
      .padStart(2, '0')}`
    return iso
  }

  const formatTimeInput = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 4)
    if (digits.length <= 2) return digits
    return `${digits.slice(0, 2)}:${digits.slice(2)}`
  }

  const toTimeFromDisplay = (value: string) => {
    const digits = value.replace(/\D/g, '')
    if (digits.length !== 4) return null
    const hours = parseInt(digits.slice(0, 2), 10)
    const minutes = parseInt(digits.slice(2, 4), 10)
    if (Number.isNaN(hours) || Number.isNaN(minutes)) return null
    if (hours > 23 || minutes > 59) return null
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
  }

  const handleDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || tempDate
    setShowDatePicker(Platform.OS === 'ios')
    setTempDate(currentDate)

    if (Platform.OS !== 'ios') {
      const iso = currentDate.toISOString().split('T')[0]
      setFormData(prev => ({
        ...prev,
        birthDate: iso
      }))
      setBirthDateDisplay(formatDateDisplay(iso))
    }
  }

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    const currentTime = selectedTime || tempTime
    setShowTimePicker(Platform.OS === 'ios')
    setTempTime(currentTime)

    if (Platform.OS !== 'ios') {
      const hours = currentTime.getHours().toString().padStart(2, '0')
      const minutes = currentTime.getMinutes().toString().padStart(2, '0')
      const timeValue = `${hours}:${minutes}`
      setFormData(prev => ({
        ...prev,
        birthTime: timeValue
      }))
      setBirthTimeDisplay(timeValue)
    }
  }

  const confirmDate = () => {
    const iso = tempDate.toISOString().split('T')[0]
    setFormData(prev => ({
      ...prev,
      birthDate: iso
    }))
    setBirthDateDisplay(formatDateDisplay(iso))
    setShowDatePicker(false)
  }

  const confirmTime = () => {
    const hours = tempTime.getHours().toString().padStart(2, '0')
    const minutes = tempTime.getMinutes().toString().padStart(2, '0')
    const timeValue = `${hours}:${minutes}`
    setFormData(prev => ({
      ...prev,
      birthTime: timeValue
    }))
    setBirthTimeDisplay(timeValue)
    setShowTimePicker(false)
  }

  const loadCountryOptions = async (query = '') => {
    setSearchingCountry(true)
    try {
      const options = await LocationService.getCountries(query, formData.language)
      setCountryOptions(options)
      if (!selectedCountry) {
        let initial: CountryOption | undefined
        if (formData.birthCountryCode) {
          initial = options.find((item) => item.code === formData.birthCountryCode)
        } else if (formData.language === 'pt-BR') {
          initial = options.find((item) => item.code === 'BR')
        }
        if (initial) {
          setSelectedCountry(initial)
          setCountryQuery(initial.name)
          setFormData((prev) => ({
            ...prev,
            birthCountryCode: initial.code,
            country: initial.name,
          }))
        }
      }
    } catch (error) {
      console.error('Erro ao carregar países:', error)
    } finally {
      setSearchingCountry(false)
    }
  }

  // Carregar dados iniciais quando o componente monta
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        await loadCountryOptions('')
        const initialSuggestions = await LocationService.searchLocations('', formData.birthCountryCode, formData.language)
        setLocationSuggestions(initialSuggestions)
      } catch (error) {
        console.error('Erro ao carregar dados iniciais:', error)
      }
    }
    loadInitialData()

    // Carregar foto salva no localStorage
    if (Platform.OS === 'web') {
      try {
        const savedPhoto = localStorage.getItem('tempProfilePhoto')
        if (savedPhoto) {
          setFormData(prev => ({
            ...prev,
            profilePhoto: savedPhoto,
          }))
          console.log('✅ Foto carregada do localStorage')
        }
      } catch { }
    }
  }, [])

  useEffect(() => {
    setFormData(prev => ({ ...prev, language }))
  }, [language])

  useEffect(() => {
    if (language === 'pt-BR') return
    // Fora de pt-BR, pais inicial deve ficar vazio (sem pre-selecao automatica)
    setSelectedCountry(null)
    setCountryQuery('')
    setFormData((prev) => ({
      ...prev,
      birthCountryCode: '',
      country: '',
      city: '',
      latitude: 0,
      longitude: 0,
    }))
  }, [language])

  useEffect(() => {
    loadCountryOptions(countryQuery)
  }, [countryQuery, formData.language])

  useEffect(() => {
    if (!selectedCountry?.code) return
    const syncSelectedCountryName = async () => {
      try {
        const options = await LocationService.getCountries('', formData.language)
        const translated = options.find((item) => item.code === selectedCountry.code)
        if (!translated) return
        setSelectedCountry(translated)
        setCountryQuery(translated.name)
        setFormData((prev) => ({ ...prev, country: translated.name }))
      } catch (error) {
        console.error('Erro ao sincronizar nome do pais com idioma:', error)
      }
    }
    syncSelectedCountryName()
  }, [formData.language, selectedCountry?.code])

  useEffect(() => {
    if (formData.birthDate) {
      setBirthDateDisplay(formatDateDisplay(formData.birthDate))
    } else if (birthDateDisplay) {
      setBirthDateDisplay('')
    }
  }, [formData.birthDate])

  useEffect(() => {
    if (formData.birthTime) {
      setBirthTimeDisplay(formData.birthTime)
    } else if (birthTimeDisplay) {
      setBirthTimeDisplay('')
    }
  }, [formData.birthTime])

  // Busca de localização com debounce
  useEffect(() => {
    if (locationQuery.length >= 2) {
      const timeoutId = setTimeout(async () => {
        setSearchingLocation(true)
        try {
          const suggestions = await LocationService.searchLocations(locationQuery, formData.birthCountryCode, formData.language)
          setLocationSuggestions(suggestions)
          setShowLocationSuggestions(true)
          console.log('Sugestões encontradas:', suggestions.length)
        } catch (error) {
          console.error('Erro ao buscar localizações:', error)
        } finally {
          setSearchingLocation(false)
        }
      }, 300) // Debounce de 300ms

      return () => clearTimeout(timeoutId)
    } else if (locationQuery.length === 0) {
      // Se campo vazio, carrega sugestões padrão
      const loadDefaultSuggestions = async () => {
        try {
          const defaultSuggestions = await LocationService.searchLocations('', formData.birthCountryCode, formData.language)
          setLocationSuggestions(defaultSuggestions)
        } catch (error) {
          console.error('Erro ao carregar sugestões padrão:', error)
        }
      }
      loadDefaultSuggestions()
    } else {
      setLocationSuggestions([])
      setShowLocationSuggestions(false)
    }
  }, [locationQuery, formData.birthCountryCode, formData.language])

  const handleLocationSelect = (location: LocationSuggestion) => {
    setSelectedLocation(location)
    setLocationQuery(location.displayName)
    setFormData(prev => ({
      ...prev,
      city: location.city,
      country: location.country,
      latitude: location.latitude,
      longitude: location.longitude,
    }))
    setShowLocationSuggestions(false)
  }

  const handleLocationQueryChange = (text: string) => {
    setLocationQuery(text)
    setSelectedLocation(null)

    // Se o usuário limpar o campo, limpa também os dados
    if (!text) {
      setFormData(prev => ({
        ...prev,
        city: '',
        country: selectedCountry?.name || prev.country,
        latitude: 0,
        longitude: 0,
      }))
    }
  }

  const handleCountryChange = async (country: CountryOption) => {
    setFormData(prev => ({
      ...prev,
      birthCountryCode: country.code,
      country: country.name,
      city: '',
      latitude: 0,
      longitude: 0,
    }))
    setSelectedCountry(country)
    setCountryQuery(country.name)
    setShowCountrySuggestions(false)
    setSelectedLocation(null)
    setLocationQuery('')
    try {
      const suggestions = await LocationService.searchLocations('', country.code, formData.language)
      setLocationSuggestions(suggestions)
    } catch (error) {
      console.error('Erro ao carregar sugestões do país selecionado:', error)
    }
  }

  const requestNotificationPermission = async () => {
    try {
      if (Platform.OS === 'web') {
        const webNotification = (globalThis as any).Notification
        if (!webNotification) return false
        let permission = webNotification.permission
        if (permission !== 'granted') permission = await webNotification.requestPermission()
        if (permission !== 'granted') return false
        if (user?.uid) await subscribeWebPush(user.uid)
        setNotificationsGranted(true)
        return true
      }

      if (!user?.uid) return false
      const result = await registerDeviceToken(user.uid)
      const ok = !result?.error
      setNotificationsGranted(ok)
      return ok
    } catch (error) {
      console.warn('Falha ao ativar notificacoes no onboarding', error)
      return false
    }
  }

  const handleNotificationSkip = async () => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const wantsEnable = window.confirm(t('onboarding.notifications.why.body'))
      if (wantsEnable) {
        const enabled = await requestNotificationPermission()
        if (enabled) {
          handleComplete()
          return
        }
        return
      }
      handleComplete()
      return
    }

    Alert.alert(t('onboarding.notifications.why.title'), t('onboarding.notifications.why.body'), [
      {
        text: t('onboarding.notifications.why.cta'),
        onPress: async () => {
          const enabled = await requestNotificationPermission()
          if (enabled) {
            handleComplete()
            return
          }
          handleComplete()
        },
      },
      {
        text: t('onboarding.notifications.why.skip'),
        style: 'cancel',
        onPress: handleComplete,
      },
    ])
  }

  const handleBirthDateInput = (text: string) => {
    const formatted = formatDateInput(text)
    setBirthDateDisplay(formatted)
    setBirthDateError('')

    if (!formatted) {
      setFormData(prev => ({ ...prev, birthDate: '' }))
      return
    }

    const iso = toIsoDateFromDisplay(formatted)
    if (iso) {
      setFormData(prev => ({ ...prev, birthDate: iso }))
      return
    }

    // Se digitacao parcial/invalida, limpa valor canonico para validar corretamente no "Next".
    setFormData(prev => ({ ...prev, birthDate: '' }))
    if (formatted.length === 10) {
      setBirthDateError(t('onboarding.validation.birthDateInvalid'))
    }
  }

  const handleBirthTimeInput = (text: string) => {
    const formatted = formatTimeInput(text)
    setBirthTimeDisplay(formatted)
    setBirthTimeError('')

    if (!formatted) {
      setFormData(prev => ({ ...prev, birthTime: '' }))
      return
    }

    const timeValue = toTimeFromDisplay(formatted)
    if (timeValue) {
      setFormData(prev => ({ ...prev, birthTime: timeValue }))
      return
    }

    // Se digitacao parcial/invalida, limpa valor canonico para validar corretamente no "Next".
    setFormData(prev => ({ ...prev, birthTime: '' }))
    if (formatted.length === 5) {
      setBirthTimeError(t('onboarding.validation.birthTimeInvalid'))
    }
  }

  const openDatePicker = () => {
    if (Platform.OS === 'web') return
    setShowDatePicker(true)
  }

  const openTimePicker = () => {
    if (Platform.OS === 'web') return
    setShowTimePicker(true)
  }

  useEffect(() => {
    if (currentStep === 3) {
      setTimeout(() => {
        birthDateInputRef.current?.focus()
        scrollRef.current?.scrollToEnd({ animated: true })
      }, 80)
    }
    if (currentStep === 4) {
      setTimeout(() => {
        birthTimeInputRef.current?.focus()
        scrollRef.current?.scrollToEnd({ animated: true })
      }, 80)
    }
  }, [currentStep])

  const selectPhoto = async () => {
    // Para web, usar input file nativo
    if (Platform.OS === 'web') {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = 'image/*'
      input.onchange = async (event: any) => {
        const file = event.target.files[0]
        if (file) {
          const compressToDataUrl = async (file: File): Promise<string> => {
            const img = document.createElement('img')
            const objectUrl = URL.createObjectURL(file)
            await new Promise((res) => { img.onload = () => res(null as any); img.src = objectUrl })
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
          try {
            setFormData(prev => ({
              ...prev,
              profilePhoto: dataUrl,
            }))
            localStorage.setItem('tempProfilePhoto', dataUrl)
            console.log('✅ Foto selecionada na web (comprimida)')
          } catch {
            // Se algo falhar no localStorage, apenas ignore
          }
        }
      }
      input.click()
      return
    }

    // Para mobile: a galeria usa o SELETOR DE FOTOS do sistema (Android 13+) e a
    // câmera pede a permissão CAMERA dentro de pickImage — nenhuma das duas exige
    // READ_MEDIA_IMAGES/VIDEO (removidas para cumprir a política do Google Play).
    Alert.alert(t('onboarding.photo.chooseTitle'), t('onboarding.photo.chooseBody'), [
      { text: t('common.cancel'), style: 'cancel' },
      { text: t('onboarding.photo.gallery'), onPress: () => pickImage('gallery') },
      { text: t('onboarding.photo.camera'), onPress: () => pickImage('camera') },
    ])
  }

  const pickImage = async (source: 'gallery' | 'camera') => {
    try {
      let result

      if (source === 'camera') {
        const { status } = await ImagePicker.requestCameraPermissionsAsync()
        if (status !== 'granted') {
          Alert.alert(t('onboarding.alert.permissionTitle'), t('onboarding.alert.cameraPermission'))
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
        console.log('📸 Foto selecionada:', asset.uri)

        // Redimensionar e converter para dataUrl para comportamento consistente
        // entre mobile/web e melhor persistencia durante onboarding.
        const manipulatedImage = await ImageManipulator.manipulateAsync(
          asset.uri,
          [{ resize: { width: 300, height: 300 } }],
          { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG, base64: true }
        )

        const dataUrl = manipulatedImage.base64
          ? `data:image/jpeg;base64,${manipulatedImage.base64}`
          : manipulatedImage.uri

        setFormData(prev => ({
          ...prev,
          profilePhoto: dataUrl,
        }))

        console.log('✅ Foto processada e salva')
      }
    } catch (error) {
      console.error('Erro ao selecionar foto:', error)
      Alert.alert(t('common.error'), t('onboarding.photo.selectFailed'))
    }
  }

  const removePhoto = () => {
    const clearPhoto = () => {
      setFormData(prev => ({ ...prev, profilePhoto: '' }))
      try { if (Platform.OS === 'web') localStorage.removeItem('tempProfilePhoto') } catch { }
    }

    if (Platform.OS === 'web') {
      // Em web, remove direto para evitar bloqueios/interferencia do confirm em alguns browsers/PWA.
      clearPhoto()
      return
    }

    Alert.alert(t('onboarding.photo.removeTitle'), t('onboarding.photo.removeBody'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('onboarding.photo.removeCta'),
        style: 'destructive',
        onPress: clearPhoto,
      },
    ])
  }

  const validateStep2 = () => {
    if (language !== 'pt-BR' && !formData.birthCountryCode) {
      Alert.alert(t('common.attention'), t('onboarding.validation.countryRequired'))
      return false
    }
    if (!formData.fullName.trim()) {
      Alert.alert(t('common.attention'), t('onboarding.validation.nameRequired'))
      return false
    }
    if (formData.fullName.trim().length < 3) {
      Alert.alert(t('common.attention'), t('onboarding.validation.nameMin'))
      return false
    }
    return true
  }

  const validateStep3 = () => {
    if (!formData.birthDate) {
      if (birthDateDisplay.trim().length > 0) {
        setBirthDateError(t('onboarding.validation.birthDateInvalid'))
        Alert.alert(t('common.attention'), t('onboarding.validation.birthDateInvalid'))
        return false
      }
      setBirthDateError(t('onboarding.validation.birthDateRequired'))
      Alert.alert(t('common.attention'), t('onboarding.validation.birthDateRequired'))
      return false
    }
    setBirthDateError('')
    return true
  }

  const validateStep4 = () => {
    if (!formData.birthTime) {
      if (birthTimeDisplay.trim().length > 0) {
        setBirthTimeError(t('onboarding.validation.birthTimeInvalid'))
        Alert.alert(t('common.attention'), t('onboarding.validation.birthTimeInvalid'))
        return false
      }
      setBirthTimeError(t('onboarding.validation.birthTimeRequired'))
      Alert.alert(t('common.attention'), t('onboarding.validation.birthTimeRequired'))
      return false
    }
    setBirthTimeError('')
    return true
  }

  const validateStep5 = () => {
    // Aceita tanto localização selecionada quanto texto livre
    if (!selectedLocation && !locationQuery.trim()) {
      Alert.alert(t('common.attention'), t('onboarding.validation.locationRequired'))
      return false
    }

    // Se tem texto mas não selecionou nenhuma cidade, usa os dados do texto
    if (!selectedLocation && locationQuery.trim()) {
      setFormData(prev => ({
        ...prev,
        city: locationQuery.trim(),
        country: selectedCountry?.name || prev.country,
        latitude: -15.7942, // Coordenadas do centro do Brasil
        longitude: -47.8825,
      }))
    }

    return true
  }

  const handleNext = () => {
    let isValid = false

    switch (currentStep) {
      case 1:
        isValid = true
        break
      case 2:
        isValid = validateStep2()
        break
      case 3:
        isValid = validateStep3()
        break
      case 4:
        isValid = validateStep4()
        break
      case 5:
        isValid = validateStep5()
        break
      case 6:
        isValid = true
        break
    }

    if (isValid && currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1)
    } else if (isValid && currentStep === TOTAL_STEPS) {
      handleComplete()
    }
  }

  // Valida tudo (curto-circuito: só um alerta por vez) e conclui.
  const handleSubmit = () => {
    if (!validateStep2()) return
    if (!validateStep3()) return
    if (!birthTimeUnknown && !validateStep4()) return
    if (!validateStep5()) return
    handleComplete()
  }

  const handleComplete = () => {
    // Localização vem direto do selectedLocation (preciso) — sem depender de
    // setFormData assíncrono. Sem seleção, cai no texto livre + centro do BR.
    const birthLocation = selectedLocation
      ? {
        city: selectedLocation.city,
        country: selectedLocation.country,
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
      }
      : {
        city: locationQuery.trim() || formData.city,
        country: selectedCountry?.name || formData.country,
        latitude: -15.7942,
        longitude: -47.8825,
      }

    const birthData: BirthData = {
      fullName: formData.fullName.trim(),
      birthDate: formData.birthDate,
      birthTime: birthTimeUnknown ? '12:00' : formData.birthTime,
      birthTimeUnknown,
      birthLocation,
      language: formData.language,
      birthCountryCode: formData.birthCountryCode,
    }

    onComplete(birthData)
  }

  const handleEnableNotifications = async () => {
    const enabled = await requestNotificationPermission()
    if (enabled) {
      handleComplete()
      return
    }

    Alert.alert(
      t('onboarding.notifications.why.title'),
      t('onboarding.notifications.enableFailed'),
      [
        {
          text: t('onboarding.notifications.why.skip'),
          style: 'cancel',
          onPress: handleComplete,
        },
        {
          text: t('onboarding.notifications.retry'),
          onPress: handleEnableNotifications,
        },
      ]
    )
  }

  const renderIntroStep = () => (
    <View style={[styles.stepContainer, isLandscape && styles.stepContainerLandscape]}>
      <Text style={styles.introKicker}>{t('onboarding.step.intro.kicker')}</Text>
      <View style={styles.filterRow}>
        <Text style={styles.filterTitle}>{t('onboarding.field.language')}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillsContainer}>
          {languages.map((option) => {
            const active = formData.language === option.code
            return (
              <TouchableOpacity
                key={option.code}
                style={[styles.filterPill, active && styles.filterPillActive]}
                onPress={async () => {
                  setFormData(prev => ({
                    ...prev,
                    language: option.code,
                    ...(option.code !== 'pt-BR'
                      ? {
                        birthCountryCode: '',
                        country: '',
                        city: '',
                        latitude: 0,
                        longitude: 0,
                      }
                      : {}),
                  }))
                  if (option.code !== 'pt-BR') {
                    setSelectedCountry(null)
                    setCountryQuery('')
                  }
                  await setLanguage(option.code)
                }}
              >
                <Text style={[styles.filterPillText, active && styles.filterPillTextActive]}>{option.nativeLabel}</Text>
              </TouchableOpacity>
            )
          })}
        </ScrollView>
      </View>
      <Text style={styles.stepTitle}>{t('onboarding.step.intro.title')}</Text>
      <Text style={styles.stepDescription}>{t('onboarding.step.intro.description')}</Text>
      <View style={styles.introCard}>
        <View style={styles.introFeatureRow}>
          <Ionicons name="heart-outline" size={18} color="#FFD700" />
          <Text style={styles.introLine}>{t('onboarding.step.intro.item1')}</Text>
        </View>
        <View style={styles.introFeatureRow}>
          <Ionicons name="layers-outline" size={18} color="#FFD700" />
          <Text style={styles.introLine}>{t('onboarding.step.intro.item2')}</Text>
        </View>
        <View style={styles.introFeatureRow}>
          <Ionicons name="notifications-outline" size={18} color="#FFD700" />
          <Text style={styles.introLine}>{t('onboarding.step.intro.item3')}</Text>
        </View>
        <View style={styles.introFeatureRow}>
          <Ionicons name="planet-outline" size={18} color="#FFD700" />
          <Text style={styles.introLine}>{t('onboarding.step.intro.item4')}</Text>
        </View>
      </View>
    </View>
  )

  const renderStep1 = () => (
    <View style={[styles.stepContainer, isLandscape && styles.stepContainerLandscape]}>
      <Ionicons name="person-outline" size={isDesktop() ? 80 : 64} color="#FFD700" style={styles.stepIcon} />

      <Text style={styles.stepTitle}>{t('onboarding.step.profile.title')}</Text>
      <Text style={styles.stepDescription}>{t('onboarding.step.profile.description')}</Text>

      <View style={styles.filterRow}>
        <Text style={styles.filterTitle}>{t('onboarding.field.country')}</Text>
        <TouchableOpacity
          style={styles.countrySelectorButton}
          onPress={() => {
            setCountryModalVisible(true)
            setShowCountrySuggestions(true)
          }}
        >
          <View style={styles.countrySelectorLeft}>
            <Ionicons name="globe-outline" size={20} color="#FFD700" />
            <Text style={styles.countrySelectorText}>
              {selectedCountry
                ? `${selectedCountry.flag} ${selectedCountry.name}`
                : t('onboarding.field.country')}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#FFD700" />
        </TouchableOpacity>
        {selectedCountry && (
          <Text style={styles.helperInlineText}>
            {t('onboarding.country.selected', { country: selectedCountry.name })}
          </Text>
        )}
      </View>

      {/* Nome Completo */}
      <View style={styles.inputContainer}>
        <Ionicons name="person" size={20} color="#666" style={styles.inputIcon} />
        <TextInput
          style={styles.nameInput}
          placeholder={t('onboarding.field.name')}
          placeholderTextColor="#666"
          value={formData.fullName}
          onChangeText={(text) => setFormData(prev => ({ ...prev, fullName: text }))}
          autoCapitalize="words"
          returnKeyType="next"
        />
      </View>

      <Text style={styles.helpText}>{t('onboarding.profile.help')}</Text>
    </View>
  )

  const renderCountryModal = () => (
    <Modal
      visible={countryModalVisible}
      animationType="slide"
      transparent
      onRequestClose={() => {
        setCountryModalVisible(false)
        setShowCountrySuggestions(false)
      }}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>{t('onboarding.field.country')}</Text>
              <Text style={styles.modalSubtitle}>{t('onboarding.country.prompt')}</Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                setCountryModalVisible(false)
                setShowCountrySuggestions(false)
              }}
              style={styles.modalCloseButton}
            >
              <Ionicons name="close" size={18} color="#FFD700" />
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <TouchableOpacity style={styles.inputIconButton}>
              <Ionicons name="search" size={20} color="#FFD700" />
            </TouchableOpacity>
            <TextInput
              style={styles.locationInput}
              placeholder={t('onboarding.field.country')}
              placeholderTextColor="#8E8E93"
              value={countryQuery}
              onChangeText={(text) => {
                setCountryQuery(text)
                setShowCountrySuggestions(true)
              }}
              autoFocus
            />
            {searchingCountry ? (
              <ActivityIndicator size="small" color="#FFD700" style={styles.searchIndicator} />
            ) : null}
          </View>

          {countryOptions.length > 0 ? (
            <FlatList
              data={countryOptions.slice(0, 80)}
              keyExtractor={(item) => item.code}
              keyboardShouldPersistTaps="handled"
              style={styles.modalList}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.suggestionItem}
                  onPress={() => {
                    handleCountryChange(item)
                    setCountryModalVisible(false)
                    setShowCountrySuggestions(false)
                  }}
                >
                  <Text style={styles.countrySuggestionFlag}>{item.flag}</Text>
                  <Text style={styles.suggestionText}>{item.name}</Text>
                  <Text style={styles.countryCodeText}>{item.code}</Text>
                </TouchableOpacity>
              )}
            />
          ) : (
            !searchingCountry && (
              <View style={styles.emptyStateCard}>
                <Ionicons name="search-outline" size={20} color="#FFD700" />
                <Text style={styles.emptyStateText}>{t('onboarding.country.empty')}</Text>
              </View>
            )
          )}
        </View>
      </View>
      {!!birthDateError && <Text style={styles.fieldErrorText}>{birthDateError}</Text>}
    </Modal>
  )

  const renderStep2 = () => (
    <View style={[styles.stepContainer, isLandscape && styles.stepContainerLandscape]}>
      <Ionicons name="calendar-outline" size={isDesktop() ? 80 : 64} color="#FFD700" style={styles.stepIcon} />

      <Text style={styles.stepTitle}>{t('onboarding.step.date.title')}</Text>
      <Text style={styles.stepDescription}>{t('onboarding.step.date.description')}</Text>

      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.inputIconButton} onPress={() => birthDateInputRef.current?.focus()}>
          <Ionicons name="calendar" size={20} color="#FFD700" />
        </TouchableOpacity>
        <TextInput
          ref={birthDateInputRef}
          style={styles.dateInput}
          placeholder={getDatePlaceholder()}
          placeholderTextColor="#8E8E93"
          value={birthDateDisplay}
          onChangeText={handleBirthDateInput}
          keyboardType="number-pad"
          inputMode="numeric"
          returnKeyType="next"
          maxLength={10}
          blurOnSubmit={false}
          onSubmitEditing={() => {
            birthTimeInputRef.current?.focus()
            scrollRef.current?.scrollToEnd({ animated: true })
          }}
          onFocus={() => scrollRef.current?.scrollToEnd({ animated: true })}
        />
      </View>
      {!!birthTimeError && <Text style={styles.fieldErrorText}>{birthTimeError}</Text>}

      {showDatePicker && Platform.OS !== 'web' && (
        <View style={styles.pickerContainer}>
          <DateTimePicker
            value={tempDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleDateChange}
            maximumDate={new Date()}
            minimumDate={new Date(1900, 0, 1)}
          />
          {Platform.OS === 'ios' && (
            <View style={styles.pickerButtons}>
              <TouchableOpacity onPress={() => setShowDatePicker(false)} style={styles.pickerButton}>
                <Text style={styles.pickerButtonText}>{t('common.cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={confirmDate} style={[styles.pickerButton, styles.confirmButton]}>
                <Text style={[styles.pickerButtonText, styles.confirmButtonText]}>{t('common.confirm')}</Text>
              </TouchableOpacity>
            </View>
          )}
          {Platform.OS !== 'ios' && (
            <TouchableOpacity onPress={confirmDate} style={[styles.pickerButton, styles.confirmButton, { marginTop: 16 }]}>
              <Text style={[styles.pickerButtonText, styles.confirmButtonText]}>{t('common.confirm')}</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  )

  const renderStep3 = () => (
    <View style={[styles.stepContainer, isLandscape && styles.stepContainerLandscape]}>
      <Ionicons name="time-outline" size={isDesktop() ? 80 : 64} color="#FFD700" style={styles.stepIcon} />

      <Text style={styles.stepTitle}>{t('onboarding.step.time.title')}</Text>
      <Text style={styles.stepDescription}>{t('onboarding.step.time.description')}</Text>

      {!birthTimeUnknown && (
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.inputIconButton} onPress={() => birthTimeInputRef.current?.focus()}>
            <Ionicons name="time" size={20} color="#FFD700" />
          </TouchableOpacity>
          <TextInput
            ref={birthTimeInputRef}
            style={styles.dateInput}
            placeholder={t('onboarding.time.placeholder')}
            placeholderTextColor="#8E8E93"
            value={birthTimeDisplay}
            onChangeText={handleBirthTimeInput}
            keyboardType="number-pad"
            inputMode="numeric"
            returnKeyType="done"
            maxLength={5}
            onFocus={() => scrollRef.current?.scrollToEnd({ animated: true })}
          />
        </View>
      )}

      {/* "Não sei a hora" → usa 12:00, mapa aproximado (sem Ascendente preciso) */}
      <TouchableOpacity
        style={styles.unknownToggle}
        onPress={() => { setBirthTimeUnknown(v => !v); setBirthTimeError('') }}
        activeOpacity={0.7}
      >
        <Ionicons name={birthTimeUnknown ? 'checkbox' : 'square-outline'} size={22} color="#FFD700" />
        <Text style={styles.unknownToggleText}>{t('onboarding.timeUnknown')}</Text>
      </TouchableOpacity>
      {birthTimeUnknown && (
        <Text style={styles.helpText}>{t('onboarding.timeUnknownHint')}</Text>
      )}

      {showTimePicker && Platform.OS !== 'web' && (
        <View style={styles.pickerContainer}>
          <DateTimePicker
            value={tempTime}
            mode="time"
            display="default"
            onChange={handleTimeChange}
            is24Hour={true}
          />
          {Platform.OS === 'ios' && (
            <View style={styles.pickerButtons}>
              <TouchableOpacity onPress={() => setShowTimePicker(false)} style={styles.pickerButton}>
                <Text style={styles.pickerButtonText}>{t('common.cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={confirmTime} style={[styles.pickerButton, styles.confirmButton]}>
                <Text style={[styles.pickerButtonText, styles.confirmButtonText]}>{t('common.confirm')}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}

      <Text style={styles.helpText}>{t('onboarding.time.help')}</Text>
    </View>
  )

  const renderStep4 = () => (
    <View style={[styles.stepContainer, isLandscape && styles.stepContainerLandscape]}>
      <Text style={styles.stepTitle}>{t('onboarding.step.location.title')}</Text>
      <Text style={styles.stepDescription}>{t('onboarding.step.location.description')}</Text>

      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.inputIconButton} onPress={() => setShowLocationSuggestions(true)}>
          <Ionicons name="search" size={20} color="#FFD700" />
        </TouchableOpacity>
        <TextInput
          style={styles.locationInput}
          placeholder={t('onboarding.location.placeholder')}
          placeholderTextColor="#8E8E93"
          value={locationQuery}
          onChangeText={handleLocationQueryChange}
          onFocus={() => {
            setShowLocationSuggestions(true)
            if (locationSuggestions.length === 0) {
              LocationService.searchLocations('', formData.birthCountryCode, formData.language).then(suggestions => {
                setLocationSuggestions(suggestions)
              }).catch(error => {
                console.error('Erro ao carregar sugestoes padrao:', error)
              })
            }
          }}
          onBlur={() => {
            setTimeout(() => setShowLocationSuggestions(false), 150)
          }}
        />
        {locationQuery.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => {
              setLocationQuery('')
              setSelectedLocation(null)
            }}
          >
            <Ionicons name="close-circle" size={20} color="#FFD700" />
          </TouchableOpacity>
        )}
      </View>

      {showLocationSuggestions && locationSuggestions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          <Text style={styles.suggestionsTitle}>{t('onboarding.location.suggestions')}</Text>
          <FlatList
            data={locationSuggestions.slice(0, 8)}
            keyExtractor={(item, index) => `${item.city}-${index}`}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.suggestionItem}
                onPress={() => handleLocationSelect(item)}
              >
                <Ionicons name="location" size={18} color="#FFD700" />
                <Text style={styles.suggestionText}>{item.displayName}</Text>
                <Ionicons name="chevron-forward" size={16} color="#666" />
              </TouchableOpacity>
            )}
          />
        </View>
      )}
      {showLocationSuggestions && !searchingLocation && locationQuery.length >= 2 && locationSuggestions.length === 0 && (
        <View style={styles.emptyStateCard}>
          <Ionicons name="search-outline" size={20} color="#FFD700" />
          <Text style={styles.emptyStateText}>{t('onboarding.location.empty')}</Text>
        </View>
      )}

      {!selectedLocation && !showLocationSuggestions && (
        <TouchableOpacity style={styles.suggestionPrompt} onPress={() => setShowLocationSuggestions(true)}>
          <Ionicons name="information-circle" size={20} color="#FFD700" />
          <Text style={styles.suggestionPromptText}>{t('onboarding.location.prompt')}</Text>
        </TouchableOpacity>
      )}

      {selectedLocation && (
        <View style={styles.selectedLocationContainer}>
          <Ionicons name="checkmark-circle" size={24} color="#10B981" />
          <View style={styles.selectedLocationTextContainer}>
            <Text style={styles.selectedLocationLabel}>{t('onboarding.location.selected')}</Text>
            <Text style={styles.selectedLocationText}>
              {selectedLocation.displayName}
            </Text>
          </View>
        </View>
      )}

      <Text style={styles.helpText}>
        {selectedLocation
          ? t('onboarding.location.ready')
          : t('onboarding.location.help')
        }
      </Text>
    </View>
  )
  const renderStep5 = () => (
    <View style={[styles.stepContainer, isLandscape && styles.stepContainerLandscape]}>
      <Ionicons
        name={notificationsGranted ? 'notifications' : 'notifications-outline'}
        size={isDesktop() ? 80 : 64}
        color={notificationsGranted ? '#10B981' : '#FFD700'}
        style={styles.stepIcon}
      />
      <Text style={styles.stepTitle}>{t('onboarding.step.notification.title')}</Text>
      <Text style={styles.stepDescription}>{t('onboarding.step.notification.description')}</Text>
      <TouchableOpacity
        style={[styles.nextButton, { marginLeft: 0 }]}
        onPress={handleEnableNotifications}
      >
        <Text style={styles.nextButtonText}>{t('onboarding.notifications.enable')}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.secondaryActionButton} onPress={handleNotificationSkip}>
        <Text style={styles.secondaryActionText}>{t('onboarding.notifications.notnow')}</Text>
      </TouchableOpacity>
    </View>
  )

  const renderProgressBar = () => (
    <View style={[styles.progressContainer, isCompactMobile && styles.progressContainerCompact]}>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${(currentStep / TOTAL_STEPS) * 100}%` }]} />
      </View>
      <Text style={styles.progressText}>{t('onboarding.progress', { current: currentStep, total: TOTAL_STEPS })}</Text>
    </View>
  )

  return (
    <LinearGradient colors={['#1a1a2e', '#16213e', '#0f0f23']} style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 16}
      >
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={[styles.scrollContainer, isCompactMobile && styles.scrollContainerCompact]}
          showsVerticalScrollIndicator={true}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
          <ResponsiveContainer style={styles.responsiveContent}>
            {renderCountryModal()}

            {/* Cabeçalho + seletor de idioma */}
            <View style={styles.formHeader}>
              <Ionicons name="planet-outline" size={40} color="#FFD700" />
              <Text style={styles.formTitle}>{t('onboarding.step.intro.title')}</Text>
              <Text style={styles.formSubtitle}>{t('onboarding.step.intro.description')}</Text>
            </View>

            <View style={styles.filterRow}>
              <Text style={styles.filterTitle}>{t('onboarding.field.language')}</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillsContainer}>
                {languages.map((option) => {
                  const active = formData.language === option.code
                  return (
                    <TouchableOpacity
                      key={option.code}
                      style={[styles.filterPill, active && styles.filterPillActive]}
                      onPress={async () => {
                        setFormData(prev => ({
                          ...prev,
                          language: option.code,
                          ...(option.code !== 'pt-BR'
                            ? { birthCountryCode: '', country: '', city: '', latitude: 0, longitude: 0 }
                            : {}),
                        }))
                        if (option.code !== 'pt-BR') { setSelectedCountry(null); setCountryQuery('') }
                        await setLanguage(option.code)
                      }}
                    >
                      <Text style={[styles.filterPillText, active && styles.filterPillTextActive]}>{option.nativeLabel}</Text>
                    </TouchableOpacity>
                  )
                })}
              </ScrollView>
            </View>

            {/* Formulário único — todos os campos numa tela, entrada suave */}
            <View style={[styles.content, isCompactMobile && styles.contentCompact]}>
              <AnimatedMount delay={40}>{renderStep1()}</AnimatedMount>
              <AnimatedMount delay={90}>{renderStep2()}</AnimatedMount>
              <AnimatedMount delay={140}>{renderStep3()}</AnimatedMount>
              <AnimatedMount delay={190}>{renderStep4()}</AnimatedMount>
            </View>

            <View style={[styles.buttonContainer, isCompactMobile && styles.buttonContainerCompact]}>
              <TouchableOpacity
                style={[styles.nextButton, styles.submitButton, loading && styles.disabledButton]}
                onPress={handleSubmit}
                disabled={loading}
                activeOpacity={0.85}
              >
                {loading ? (
                  <>
                    <StarLoader size={18} color="#0F0F23" />
                    <Text style={styles.nextButtonText}>{t('common.saving')}</Text>
                  </>
                ) : (
                  <>
                    <Ionicons name="sparkles" size={20} color="#0F0F23" />
                    <Text style={styles.nextButtonText}>{t('onboarding.submit')}</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.backToLoginButton, isCompactMobile && styles.backToLoginButtonCompact]}
              onPress={async () => { await hardSignOut(); logout(); }}
            >
              <Ionicons name="log-out-outline" size={16} color="#FFD700" />
              <Text style={styles.backToLoginText}>{t('onboarding.backToLogin')}</Text>
            </TouchableOpacity>
          </ResponsiveContainer>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  responsiveContent: {
    flex: 0,
    width: '100%',
  },
  formHeader: {
    alignItems: 'center',
    marginBottom: 20,
    gap: 8,
  },
  formTitle: {
    color: '#FFFFFF',
    fontSize: FONT_SIZES.xl,
    fontWeight: '800',
    textAlign: 'center',
  },
  formSubtitle: {
    color: '#9AA0C0',
    fontSize: FONT_SIZES.sm,
    textAlign: 'center',
    lineHeight: 20,
  },
  submitButton: {
    flex: 1,
    justifyContent: 'center',
  },
  unknownToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    alignSelf: 'flex-start',
  },
  unknownToggleText: {
    color: '#E5E7EB',
    fontSize: FONT_SIZES.md,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: 60,
    paddingBottom: Platform.OS === 'android' ? 180 : 120,
  },
  scrollContainerCompact: {
    paddingTop: 32,
    paddingHorizontal: SPACING.md,
    paddingBottom: Platform.OS === 'android' ? 160 : 100,
  },
  progressContainer: {
    marginBottom: 40,
  },
  progressContainerCompact: {
    marginBottom: 20,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#2C2C2E',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFD700',
    borderRadius: 2,
  },
  progressText: {
    color: '#FFD700',
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 8,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'flex-start',
  },
  contentCompact: {
    gap: 4,
  },
  stepContainer: {
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    width: '100%',
  },
  stepContainerLandscape: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  stepIcon: {
    marginBottom: SPACING.lg,
  },
  stepTitle: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  stepDescription: {
    fontSize: FONT_SIZES.md,
    color: '#A0A0A0',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  introCard: {
    width: '100%',
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#3F3F46',
    padding: 16,
    marginBottom: 16,
  },
  introKicker: {
    color: '#94A3B8',
    fontSize: FONT_SIZES.sm,
    fontWeight: '700',
    marginBottom: 8,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  introFeatureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  introLine: {
    color: '#E5E7EB',
    fontSize: FONT_SIZES.md,
    flex: 1,
  },
  helperInlineText: {
    color: '#94A3B8',
    fontSize: FONT_SIZES.xs,
    marginTop: 6,
    marginLeft: 2,
  },
  filterRow: {
    width: '100%',
    marginBottom: 12,
    zIndex: 5,
  },
  countrySelectorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#2C2C2E',
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 12,
    paddingHorizontal: 14,
    minHeight: 52,
  },
  countrySelectorLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  countrySelectorText: {
    color: '#FFFFFF',
    fontSize: FONT_SIZES.md,
  },
  filterTitle: {
    color: '#FFD700',
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    marginBottom: 6,
  },
  pillsContainer: {
    gap: 8,
    paddingRight: 8,
  },
  filterPill: {
    backgroundColor: '#2C2C2E',
    borderColor: '#4B5563',
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  filterPillActive: {
    borderColor: '#FFD700',
    backgroundColor: '#3A3220',
  },
  filterPillText: {
    color: '#D1D5DB',
    fontSize: FONT_SIZES.sm,
  },
  filterPillTextActive: {
    color: '#FFD700',
    fontWeight: '700',
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2C2C2E',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFD700',
    minWidth: '100%',
    justifyContent: 'center',
    marginBottom: 20,
  },
  dateButtonText: {
    color: '#FFFFFF',
    fontSize: FONT_SIZES.md,
    fontWeight: '500',
    marginLeft: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#444',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  inputIconButton: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: 4,
  },
  dateInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: FONT_SIZES.md,
    paddingVertical: SPACING.md,
  },
  locationInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: FONT_SIZES.md,
    paddingVertical: SPACING.md,
  },
  input: {
    backgroundColor: '#2C2C2E',
    color: '#FFFFFF',
    fontSize: FONT_SIZES.md,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#444',
    marginBottom: 16,
  },
  helpText: {
    color: '#A0A0A0',
    fontSize: FONT_SIZES.sm,
    textAlign: 'center',
    marginTop: 16,
    fontStyle: 'italic',
  },
  photoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  photoPlaceholder: {
    width: isDesktop() ? 150 : 120,
    height: isDesktop() ? 150 : 120,
    borderRadius: isDesktop() ? 75 : 60,
    backgroundColor: '#2C2C2E',
    borderWidth: 2,
    borderColor: '#444',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoPlaceholderText: {
    color: '#A0A0A0',
    fontSize: FONT_SIZES.sm,
    marginTop: 8,
    fontWeight: '500',
  },
  photoOptionalText: {
    color: '#666',
    fontSize: FONT_SIZES.xs,
    marginTop: 2,
  },
  photoSelected: {
    position: 'relative',
  },
  profilePhoto: {
    width: isDesktop() ? 150 : 120,
    height: isDesktop() ? 150 : 120,
    borderRadius: isDesktop() ? 75 : 60,
    borderWidth: 3,
    borderColor: '#FFD700',
  },
  removePhotoButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 2,
    zIndex: 20,
    elevation: 6,
  },
  fieldErrorText: {
    width: '100%',
    color: '#FF6B6B',
    fontSize: FONT_SIZES.sm,
    marginTop: -8,
    marginBottom: 8,
    textAlign: 'left',
  },
  nameInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: FONT_SIZES.md,
    paddingVertical: SPACING.md,
  },
  searchIndicator: {
    marginLeft: 8,
  },
  suggestionsContainer: {
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#444',
    marginBottom: 16,
    maxHeight: 200,
  },
  suggestionsAbove: {
    marginTop: 0,
    marginBottom: 8,
    // Sombra para destacar que está "flutuando" acima
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  suggestionsList: {
    maxHeight: 200,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
    backgroundColor: '#2A2A2E',
    marginHorizontal: 4,
    marginVertical: 1,
    borderRadius: 8,
  },
  suggestionText: {
    color: '#FFFFFF',
    fontSize: FONT_SIZES.md,
    marginLeft: 8,
    flex: 1,
  },
  countrySuggestionFlag: {
    fontSize: FONT_SIZES.lg,
    marginRight: 8,
  },
  countryCodeText: {
    color: '#A0A0A0',
    fontSize: FONT_SIZES.xs,
    fontWeight: '700',
    marginLeft: 6,
  },
  suggestionPrompt: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2C2C2E',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  suggestionPromptText: {
    color: '#FFD700',
    fontSize: FONT_SIZES.sm,
    marginLeft: 8,
    flex: 1,
    fontWeight: '500',
  },
  suggestionsTitle: {
    color: '#FFD700',
    fontSize: FONT_SIZES.sm,
    fontWeight: 'bold',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#1A1A1A',
  },
  selectedLocationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F2937',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#10B981',
  },
  selectedLocationTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  selectedLocationLabel: {
    color: '#A0A0A0',
    fontSize: FONT_SIZES.xs,
    marginBottom: 4,
  },
  selectedLocationText: {
    color: '#10B981',
    fontSize: FONT_SIZES.md,
    fontWeight: 'bold',
  },
  emptyStateCard: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4B5563',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#1F2937',
    marginBottom: 12,
    gap: 8,
  },
  emptyStateText: {
    color: '#D1D5DB',
    fontSize: FONT_SIZES.sm,
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.58)',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  modalCard: {
    backgroundColor: '#161A2A',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.25)',
    padding: 12,
    maxHeight: '82%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 10,
    gap: 8,
  },
  modalTitle: {
    color: '#F8FAFC',
    fontSize: FONT_SIZES.lg,
    fontWeight: '800',
  },
  modalSubtitle: {
    color: '#A0A0A0',
    fontSize: FONT_SIZES.sm,
    marginTop: 2,
  },
  modalCloseButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,215,0,0.08)',
  },
  modalList: {
    maxHeight: 360,
  },
  pickerContainer: {
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    width: '100%',
  },
  pickerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  pickerButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: '#444',
  },
  confirmButton: {
    backgroundColor: '#FFD700',
  },
  pickerButtonText: {
    color: '#FFFFFF',
    fontSize: FONT_SIZES.md,
    fontWeight: '500',
  },
  confirmButtonText: {
    color: '#000',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
  },
  buttonContainerCompact: {
    marginTop: 14,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
  },
  backButtonText: {
    color: '#FFD700',
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    marginLeft: 8,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFD700',
    paddingVertical: SPACING.md,
    paddingHorizontal: 32,
    borderRadius: 12,
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  disabledButton: {
    opacity: 0.6,
  },
  nextButtonText: {
    color: '#000',
    fontSize: FONT_SIZES.md,
    fontWeight: 'bold',
    marginRight: 8,
  },
  clearButton: {
    padding: 8,
  },
  secondaryActionButton: {
    marginTop: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#4B5563',
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: '#1E293B',
  },
  secondaryActionText: {
    color: '#D1D5DB',
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
  },
  backToLoginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  backToLoginButtonCompact: {
    marginTop: 12,
  },
  backToLoginText: {
    color: '#FFD700',
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    marginLeft: 8,
  },
  dateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#444',
    marginBottom: 16,
    paddingHorizontal: 16,
    minWidth: '100%',
  },
})








