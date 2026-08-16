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
import type { AppLanguage } from '../../i18n/appI18n'
import { registrar } from '../../services/eventos'
import { signoSolarDaData } from '../../utils/signoSolar'

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


export default function BirthDataForm({ onComplete, loading = false }: BirthDataFormProps) {
  const { logout, user } = useAuth()
  const { language, languages, setLanguage, t } = useAppLanguage()
  const { isLandscape } = useOrientation()
  const isCompactMobile = !isDesktop() && !isTablet()

  /**
   * O QUIZ: tres passos, com recompensa em cada um.
   *
   * ── A REGRA QUE NAO SE NEGOCIA ────────────────────────────────────────
   *
   * Isto ja foi um wizard de seis passos, e o Joao pediu para virar UMA tela
   * porque ficou preso nele. O defeito nao era ter passos: era que so o passo
   * 6 chamava `handleComplete`, entao quando o pedido de permissao de
   * notificacao enroscava nao havia saida.
   *
   * Aqui `handleSubmit` fica alcancavel de QUALQUER passo assim que os quatro
   * campos estiverem validos. Nenhum passo tem saida unica, e as notificacoes
   * nao voltaram para dentro do fluxo.
   */
  const [passo, setPasso] = useState(1)
  const TOTAL_PASSOS = 3
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
  const [nameError, setNameError] = useState('')
  const [countryError, setCountryError] = useState('')
  const [locationError, setLocationError] = useState('')

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
  const scrollRef = useRef<ScrollView | null>(null)
  const nameInputRef = useRef<TextInput | null>(null)
  const birthDateInputRef = useRef<TextInput | null>(null)
  const birthTimeInputRef = useRef<TextInput | null>(null)
  const locationInputRef = useRef<TextInput | null>(null)
  const detectedRef = useRef(false)

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

  // Detecta país + idioma do aparelho (1×) e já preenche por padrão. A pessoa pode trocar.
  useEffect(() => {
    if (detectedRef.current) return
    detectedRef.current = true
    ;(async () => {
      try {
        let locale = ''
        try { locale = Intl.DateTimeFormat().resolvedOptions().locale || '' } catch { /* sem Intl */ }
        if (!locale && typeof navigator !== 'undefined') locale = (navigator as any).language || ''
        if (!locale) return
        const [langPart, regionRaw] = locale.split('-')
        const region = (regionRaw || '').toUpperCase()
        // País (só se ainda não escolhido)
        if (!selectedCountry && region.length === 2) {
          try {
            const countries = await LocationService.getCountries('', formData.language)
            const match = countries.find((c) => c.code === region)
            if (match) {
              setSelectedCountry(match)
              setFormData(prev => ({ ...prev, birthCountryCode: match.code, country: match.name }))
            }
          } catch { /* mantém sem país */ }
        }
        // Idioma → mapeia para um dos 4 suportados
        const supported: Record<string, AppLanguage> = { pt: 'pt-BR', en: 'en-US', es: 'es-ES', it: 'it-IT' }
        const detectedLang = supported[(langPart || '').toLowerCase()]
        if (detectedLang && detectedLang !== formData.language) {
          setFormData(prev => ({ ...prev, language: detectedLang }))
          await setLanguage(detectedLang)
        }
      } catch { /* silencioso */ }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleLocationSelect = (location: LocationSuggestion) => {
    setSelectedLocation(location)
    setLocationError('')
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
      // Data completa e válida → pula para a hora automaticamente.
      setTimeout(() => birthTimeInputRef.current?.focus(), 60)
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
      // Hora completa e válida → pula para o local (abre as sugestões).
      setTimeout(() => {
        locationInputRef.current?.focus()
        scrollRef.current?.scrollToEnd({ animated: true })
      }, 60)
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

  /**
   * Foco no primeiro campo do passo novo.
   *
   * Era dirigido por `currentStep`, do wizard de seis passos, e ficou orfao
   * quando o formulario virou uma tela so: `currentStep` nunca mais mudou, e o
   * efeito nunca mais rodou. Agora quem manda e `passo`.
   *
   * Sem isto a pessoa troca de passo e precisa tocar no campo para digitar, o
   * que no celular custa um toque a mais em cada etapa.
   *
   * O passo 1 fica de fora de proposito: focar sozinho ao abrir a tela sobe o
   * teclado antes de a pessoa ler o que esta sendo pedido.
   */
  useEffect(() => {
    if (passo === 1) return
    const alvo = passo === 2 ? birthTimeInputRef : locationInputRef
    const id = setTimeout(() => alvo.current?.focus?.(), 120)
    return () => clearTimeout(id)
  }, [passo])

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

  // Validadores com erro INLINE (sem pop-up). Cada um seta/limpa o erro do campo.
  const validateStep2 = () => {
    let ok = true
    if (language !== 'pt-BR' && !formData.birthCountryCode) {
      setCountryError(t('onboarding.validation.countryRequired')); ok = false
    } else setCountryError('')
    if (!formData.fullName.trim()) {
      setNameError(t('onboarding.validation.nameRequired')); ok = false
    } else if (formData.fullName.trim().length < 3) {
      setNameError(t('onboarding.validation.nameMin')); ok = false
    } else setNameError('')
    return ok
  }

  const validateStep3 = () => {
    if (!formData.birthDate) {
      setBirthDateError(birthDateDisplay.trim().length > 0
        ? t('onboarding.validation.birthDateInvalid')
        : t('onboarding.validation.birthDateRequired'))
      return false
    }
    setBirthDateError('')
    return true
  }

  const validateStep4 = () => {
    if (!formData.birthTime) {
      setBirthTimeError(birthTimeDisplay.trim().length > 0
        ? t('onboarding.validation.birthTimeInvalid')
        : t('onboarding.validation.birthTimeRequired'))
      return false
    }
    setBirthTimeError('')
    return true
  }

  // Local EXIGE escolher uma cidade da lista (coordenadas exatas) — nada de
  // fallback pro centro do Brasil, que gerava mapa errado.
  const validateStep5 = () => {
    if (!selectedLocation) {
      setLocationError(locationQuery.trim().length > 0
        ? t('onboarding.validation.locationPick')
        : t('onboarding.validation.locationRequired'))
      return false
    }
    setLocationError('')
    return true
  }

  // Valida tudo (curto-circuito: só um alerta por vez) e conclui.
  const handleSubmit = () => {
    // Roda TODOS (marca todos os erros inline de uma vez) e foca/rola até o 1º inválido.
    const okName = validateStep2()
    const okDate = validateStep3()
    const okTime = validateStep4()
    const okLoc = validateStep5()
    if (okName && okDate && okTime && okLoc) {
      handleComplete()
      return
    }
    // Focar o input do 1º campo inválido faz o ScrollView rolar até ele.
    const focusRef = !okName ? nameInputRef
      : !okDate ? birthDateInputRef
      : !okTime ? birthTimeInputRef
      : locationInputRef
    setTimeout(() => focusRef.current?.focus?.(), 40)
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
      birthTime: formData.birthTime,
      birthLocation,
      language: formData.language,
      birthCountryCode: formData.birthCountryCode,
    }

    // O fim do funil de cadastro. Sem `await`: a navegação não espera a
    // telemetria, e falha aqui não pode impedir alguém de ver o mapa.
    registrar('conta_criada')
    onComplete(birthData)
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
    <View style={styles.fieldGroup}>
      <Text style={styles.fieldLabel}>{t('onboarding.field.country')}</Text>
      <TouchableOpacity
        style={[styles.countrySelectorButton, !!countryError && styles.inputContainerError]}
        onPress={() => {
          setCountryError('')
          setCountryModalVisible(true)
          setShowCountrySuggestions(true)
        }}
      >
        <View style={styles.countrySelectorLeft}>
          <Ionicons name="globe-outline" size={18} color="#FFD700" />
          <Text style={styles.countrySelectorText}>
            {selectedCountry
              ? `${selectedCountry.flag} ${selectedCountry.name}`
              : t('onboarding.field.country')}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color="#FFD700" />
      </TouchableOpacity>
      {!!countryError && <Text style={styles.fieldErrorText}>{countryError}</Text>}

      {/* Nome */}
      <Text style={[styles.fieldLabel, styles.fieldLabelSpaced]}>{t('onboarding.field.name')}</Text>
      <View style={[styles.inputContainer, !!nameError && styles.inputContainerError]}>
        <Ionicons name="person" size={20} color="#666" style={styles.inputIcon} />
        <TextInput
          ref={nameInputRef}
          style={styles.nameInput}
          placeholder={t('onboarding.field.name')}
          placeholderTextColor="#666"
          value={formData.fullName}
          onChangeText={(text) => { setFormData(prev => ({ ...prev, fullName: text })); if (nameError) setNameError('') }}
          autoCapitalize="words"
          returnKeyType="next"
          onSubmitEditing={() => birthDateInputRef.current?.focus()}
        />
      </View>
      {!!nameError && <Text style={styles.fieldErrorText}>{nameError}</Text>}
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
    <View style={styles.fieldGroup}>
      <Text style={styles.fieldLabel}>{t('onboarding.step.date.title')}</Text>
      <View style={[styles.inputContainer, !!birthDateError && styles.inputContainerError]}>
        <TouchableOpacity style={styles.inputIconButton} onPress={() => Platform.OS === 'web' ? birthDateInputRef.current?.focus() : openDatePicker()}>
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
      {!!birthDateError && <Text style={styles.fieldErrorText}>{birthDateError}</Text>}

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
    <View style={styles.fieldGroup}>
      <Text style={styles.fieldLabel}>{t('onboarding.step.time.title')}</Text>

      <View style={[styles.inputContainer, !!birthTimeError && styles.inputContainerError]}>
        <TouchableOpacity style={styles.inputIconButton} onPress={() => Platform.OS === 'web' ? birthTimeInputRef.current?.focus() : openTimePicker()}>
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
      {!!birthTimeError && <Text style={styles.fieldErrorText}>{birthTimeError}</Text>}

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
    </View>
  )

  const renderStep4 = () => (
    <View style={styles.fieldGroup}>
      <Text style={styles.fieldLabel}>{t('onboarding.step.location.title')}</Text>
      <View style={[styles.inputContainer, !!locationError && styles.inputContainerError]}>
        <TouchableOpacity style={styles.inputIconButton} onPress={() => setShowLocationSuggestions(true)}>
          <Ionicons name="search" size={20} color="#FFD700" />
        </TouchableOpacity>
        <TextInput
          ref={locationInputRef}
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

      {!!locationError
        ? <Text style={styles.fieldErrorText}>{locationError}</Text>
        : selectedLocation ? <Text style={styles.helpText}>{t('onboarding.location.ready')}</Text> : null
      }
    </View>
  )
  /**
   * O que cada passo pede, e o que ele devolve.
   *
   * O nome vai junto da data no passo 1 de proposito: sozinho ele nao devolve
   * nada, e um passo sem recompensa e so um formulario cortado em pedacos.
   */
  const validaDoPasso = (n: number) => {
    if (n === 1) {
      const ok1 = validateStep2()
      const ok2 = validateStep3()
      return ok1 && ok2
    }
    if (n === 2) return validateStep4()
    return validateStep5()
  }

  /** Tudo valido? E o que libera concluir de qualquer passo. */
  const tudoPronto = () =>
    !!formData.fullName.trim() && !!formData.birthDate && !!formData.birthTime && !!selectedLocation

  const avancar = () => {
    if (!validaDoPasso(passo)) return
    registrar(passo === 1 ? 'quiz_passo_1' : passo === 2 ? 'quiz_passo_2' : 'quiz_passo_3')
    if (passo < TOTAL_PASSOS) setPasso(passo + 1)
    else handleSubmit()
  }

  /**
   * A recompensa do passo 1: o signo solar, CALCULADO.
   *
   * Nao e tabela de datas. "Libra comeca em 23/09" erra com frequencia, porque
   * o instante em que o Sol cruza 180 graus muda de ano para ano — e quem
   * nasceu na virada e exatamente quem confere. A landing promete "calculo de
   * verdade por tras de cada frase", e o primeiro passo do produto nao pode
   * desmentir isso.
   *
   * `naVirada` existe porque aqui ainda nao ha hora: a menos de um grau da
   * fronteira o texto diz que a hora pode mudar o resultado, em vez de afirmar.
   */
  const recompensa = () => {
    if (passo === 2) {
      const sol = signoSolarDaData(formData.birthDate)
      if (!sol) return null
      return (
        <View style={styles.recompensa}>
          <Ionicons name="sunny" size={18} color="#FFD700" />
          <Text style={styles.recompensaTexto}>
            {sol.naVirada
              ? t('quiz.premio.solNaVirada').replace('{signo}', sol.signo)
              : t('quiz.premio.sol').replace('{signo}', sol.signo)}
          </Text>
        </View>
      )
    }
    if (passo === 3) {
      return (
        <View style={styles.recompensa}>
          <Ionicons name="compass" size={18} color="#FFD700" />
          <Text style={styles.recompensaTexto}>{t('quiz.premio.hora')}</Text>
        </View>
      )
    }
    return null
  }

  const renderProgressBar = () => (
    <View style={[styles.progressContainer, isCompactMobile && styles.progressContainerCompact]}>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${(passo / TOTAL_PASSOS) * 100}%` }]} />
      </View>
      <Text style={styles.progressText}>{t('onboarding.progress', { current: passo, total: TOTAL_PASSOS })}</Text>
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
          style={styles.container}
          contentContainerStyle={[styles.scrollContainer, isCompactMobile && styles.scrollContainerCompact]}
          showsVerticalScrollIndicator={true}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
          <ResponsiveContainer style={styles.responsiveContent}>
            {renderCountryModal()}

            {/* Idioma — sutil, no topo */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.langPills}>
              {languages.map((option) => {
                const active = formData.language === option.code
                return (
                  <TouchableOpacity
                    key={option.code}
                    style={[styles.langPill, active && styles.langPillActive]}
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
                    <Text style={[styles.langPillText, active && styles.langPillTextActive]}>{option.nativeLabel}</Text>
                  </TouchableOpacity>
                )
              })}
            </ScrollView>

            <Text style={styles.formTitle}>{t('onboarding.step.intro.title')}</Text>

            {renderProgressBar()}
            {recompensa()}

            {/* Um passo por vez. `key` força o AnimatedMount a reanimar na
                troca — sem ela o React reusa o nó e o passo novo aparece
                estático, o que lê como travamento. */}
            <View style={[styles.content, isCompactMobile && styles.contentCompact]}>
              {passo === 1 && (
                <AnimatedMount key="p1" delay={40}>
                  <>
                    {renderStep1()}
                    {renderStep2()}
                  </>
                </AnimatedMount>
              )}
              {passo === 2 && <AnimatedMount key="p2" delay={40}>{renderStep3()}</AnimatedMount>}
              {passo === 3 && <AnimatedMount key="p3" delay={40}>{renderStep4()}</AnimatedMount>}
            </View>

            <View style={[styles.buttonContainer, isCompactMobile && styles.buttonContainerCompact]}>
              <TouchableOpacity
                style={[styles.nextButton, styles.submitButton, loading && styles.disabledButton]}
                onPress={avancar}
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
                    <Ionicons name={passo === TOTAL_PASSOS ? 'sparkles' : 'arrow-forward'} size={20} color="#0F0F23" />
                    <Text style={styles.nextButtonText}>
                      {passo === TOTAL_PASSOS ? t('onboarding.submit') : t('quiz.continuar')}
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            {/**
              * A SAIDA QUE NUNCA PODE FALTAR.
              *
              * O wizard antigo prendeu o Joao porque so o ultimo passo concluia.
              * Assim que os quatro campos estao validos, concluir fica
              * disponivel de qualquer passo — nenhum passo tem saida unica.
              */}
            {passo < TOTAL_PASSOS && tudoPronto() && !loading && (
              <TouchableOpacity style={styles.atalhoConcluir} onPress={handleSubmit} activeOpacity={0.8}>
                <Text style={styles.atalhoConcluirTexto}>{t('quiz.concluirAgora')}</Text>
              </TouchableOpacity>
            )}

            {passo > 1 && !loading && (
              <TouchableOpacity style={styles.voltarPasso} onPress={() => setPasso(passo - 1)} activeOpacity={0.8}>
                <Ionicons name="arrow-back" size={15} color="#B0B0B0" />
                <Text style={styles.voltarPassoTexto}>{t('quiz.voltar')}</Text>
              </TouchableOpacity>
            )}

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
  recompensa: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'center',
    backgroundColor: 'rgba(255,215,0,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.30)',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 14,
    maxWidth: 460,
  },
  recompensaTexto: { flex: 1, color: '#F2E7CE', fontSize: 13, lineHeight: 18 },
  atalhoConcluir: { alignSelf: 'center', paddingVertical: 10, paddingHorizontal: 14 },
  atalhoConcluirTexto: { color: '#FFD700', fontSize: 13, textDecorationLine: 'underline' },
  voltarPasso: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'center', paddingVertical: 8 },
  voltarPassoTexto: { color: '#B0B0B0', fontSize: 13 },
  container: {
    flex: 1,
  },
  responsiveContent: {
    flex: 0,
    width: '100%',
  },
  formTitle: {
    color: '#FFFFFF',
    fontSize: FONT_SIZES.xl,
    fontWeight: '800',
    marginTop: 14,
    marginBottom: 14,
  },
  // Idioma sutil no topo
  langPills: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 2,
  },
  langPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  langPillActive: {
    backgroundColor: 'rgba(255,215,0,0.14)',
    borderColor: '#FFD700',
  },
  langPillText: {
    color: '#9AA0C0',
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
  },
  langPillTextActive: {
    color: '#FFD700',
  },
  // Campo compacto (label + input)
  fieldGroup: {
    width: '100%',
    marginBottom: 14,
  },
  fieldLabel: {
    color: '#FFD700',
    fontSize: FONT_SIZES.sm,
    fontWeight: '700',
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  fieldLabelSpaced: {
    marginTop: 12,
  },
  inputContainerError: {
    borderColor: '#EF4444',
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
    paddingTop: 24,
    paddingBottom: Platform.OS === 'android' ? 120 : 80,
  },
  scrollContainerCompact: {
    paddingTop: 16,
    paddingHorizontal: SPACING.md,
    paddingBottom: Platform.OS === 'android' ? 100 : 72,
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
    marginBottom: 0,
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
    textAlign: 'left',
    marginTop: 6,
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
    marginTop: 4,
    marginBottom: 2,
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








