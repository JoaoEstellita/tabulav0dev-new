import React, { useState, useEffect } from 'react'
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
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import DateTimePicker from '@react-native-community/datetimepicker'
import * as ImagePicker from 'expo-image-picker'
import * as ImageManipulator from 'expo-image-manipulator'
import LocationService, { type LocationSuggestion } from '../../services/LocationService'
import { useAuth } from '../../hooks/useAuth'
import { hardSignOut } from '../../services/auth/logout'
import ResponsiveContainer from '../../components/ResponsiveContainer'
import { FONT_SIZES, SPACING, isDesktop, isTablet } from '../../styles/responsive'
import { useOrientation } from '../../hooks/useOrientation'

interface BirthDataFormProps {
  onComplete: (data: BirthData) => void
  loading?: boolean
}

export interface BirthData {
  fullName: string
  profilePhoto?: string
  birthDate: string
  birthTime: string
  birthLocation: {
    city: string
    country: string
    latitude: number
    longitude: number
  }
}

export default function BirthDataForm({ onComplete, loading = false }: BirthDataFormProps) {
  const { logout } = useAuth()
  const { isLandscape } = useOrientation()
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
  })
  const [birthDateDisplay, setBirthDateDisplay] = useState('')
  const [birthTimeDisplay, setBirthTimeDisplay] = useState('')

  // Estados para DateTimePicker
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showTimePicker, setShowTimePicker] = useState(false)
  const [tempDate, setTempDate] = useState(new Date())
  const [tempTime, setTempTime] = useState(new Date())

  // Estados para busca de localizaÃ§Ã£o
  const [locationQuery, setLocationQuery] = useState('')
  const [locationSuggestions, setLocationSuggestions] = useState<LocationSuggestion[]>([])
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false)
  const [searchingLocation, setSearchingLocation] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<LocationSuggestion | null>(null)

  const formatDateDisplay = (isoDate: string) => {
    if (!isoDate) return ''
    const parts = isoDate.split('-')
    if (parts.length !== 3) return isoDate
    return `${parts[2]}/${parts[1]}/${parts[0]}`
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
    const day = parseInt(digits.slice(0, 2), 10)
    const month = parseInt(digits.slice(2, 4), 10)
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

  // Carregar sugestÃµes iniciais quando o componente monta
  useEffect(() => {
    const loadInitialSuggestions = async () => {
      try {
        const initialSuggestions = await LocationService.searchLocations('')
        setLocationSuggestions(initialSuggestions)
      } catch (error) {
        console.error('Erro ao carregar sugestÃµes iniciais:', error)
      }
    }
    loadInitialSuggestions()

    // Carregar foto salva no localStorage
    if (typeof window !== 'undefined') {
      const savedPhoto = localStorage.getItem('tempProfilePhoto')
      if (savedPhoto) {
        setFormData(prev => ({
          ...prev,
          profilePhoto: savedPhoto,
        }))
        console.log('âœ… Foto carregada do localStorage')
      }
    }
  }, [])

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

  // Busca de localizaÃ§Ã£o com debounce
  useEffect(() => {
    if (locationQuery.length >= 2) {
      const timeoutId = setTimeout(async () => {
        setSearchingLocation(true)
        try {
          const suggestions = await LocationService.searchLocations(locationQuery)
          setLocationSuggestions(suggestions)
          setShowLocationSuggestions(true)
          console.log('SugestÃµes encontradas:', suggestions.length)
        } catch (error) {
          console.error('Erro ao buscar localizaÃ§Ãµes:', error)
        } finally {
          setSearchingLocation(false)
        }
      }, 300) // Debounce de 300ms

      return () => clearTimeout(timeoutId)
    } else if (locationQuery.length === 0) {
      // Se campo vazio, carrega sugestÃµes padrÃ£o
      const loadDefaultSuggestions = async () => {
        try {
          const defaultSuggestions = await LocationService.searchLocations('')
          setLocationSuggestions(defaultSuggestions)
        } catch (error) {
          console.error('Erro ao carregar sugestÃµes padrÃ£o:', error)
        }
      }
      loadDefaultSuggestions()
    } else {
      setLocationSuggestions([])
      setShowLocationSuggestions(false)
    }
  }, [locationQuery])

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
    
    // Se o usuÃ¡rio limpar o campo, limpa tambÃ©m os dados
    if (!text) {
      setFormData(prev => ({
        ...prev,
        city: '',
        country: '',
        latitude: 0,
        longitude: 0,
      }))
    }
  }

  const handleBirthDateInput = (text: string) => {
    const formatted = formatDateInput(text)
    setBirthDateDisplay(formatted)

    if (!formatted) {
      setFormData(prev => ({ ...prev, birthDate: '' }))
      return
    }

    const iso = toIsoDateFromDisplay(formatted)
    if (iso) {
      setFormData(prev => ({ ...prev, birthDate: iso }))
    }
  }

  const handleBirthTimeInput = (text: string) => {
    const formatted = formatTimeInput(text)
    setBirthTimeDisplay(formatted)

    if (!formatted) {
      setFormData(prev => ({ ...prev, birthTime: '' }))
      return
    }

    const timeValue = toTimeFromDisplay(formatted)
    if (timeValue) {
      setFormData(prev => ({ ...prev, birthTime: timeValue }))
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

  // FunÃ§Ãµes para manipulaÃ§Ã£o de foto
  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== 'granted') {
      Alert.alert('PermissÃ£o NecessÃ¡ria', 'Precisamos de acesso Ã  galeria para selecionar sua foto.')
      return false
    }
    return true
  }

  const selectPhoto = async () => {
    // Para web, usar input file nativo
    if (typeof window !== 'undefined') {
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
            console.log('âœ… Foto selecionada na web (comprimida)')
          } catch {
            // Se algo falhar no localStorage, apenas ignore
          }
        }
      }
      input.click()
      return
    }

    // Para mobile, usar ImagePicker
    const hasPermission = await requestPermissions()
    if (!hasPermission) return

    Alert.alert(
      'Escolher Foto',
      'Como vocÃª gostaria de adicionar sua foto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Galeria', onPress: () => pickImage('gallery') },
        { text: 'CÃ¢mera', onPress: () => pickImage('camera') },
      ]
    )
  }

  const pickImage = async (source: 'gallery' | 'camera') => {
    try {
      let result

      if (source === 'camera') {
        const { status } = await ImagePicker.requestCameraPermissionsAsync()
        if (status !== 'granted') {
          Alert.alert('PermissÃ£o NecessÃ¡ria', 'Precisamos de acesso Ã  cÃ¢mera.')
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
        console.log('ðŸ“¸ Foto selecionada:', asset.uri)
        
        // Redimensionar a imagem para otimizar
        const manipulatedImage = await ImageManipulator.manipulateAsync(
          asset.uri,
          [{ resize: { width: 300, height: 300 } }],
          { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
        )

        setFormData(prev => ({
          ...prev,
          profilePhoto: manipulatedImage.uri,
        }))

        console.log('âœ… Foto processada e salva')
      }
    } catch (error) {
      console.error('Erro ao selecionar foto:', error)
      Alert.alert('Erro', 'NÃ£o foi possÃ­vel selecionar a foto. Tente novamente.')
    }
  }

  const removePhoto = () => {
    Alert.alert(
      'Remover Foto',
      'Tem certeza que deseja remover a foto selecionada?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Remover', 
          style: 'destructive',
          onPress: () => setFormData(prev => ({ ...prev, profilePhoto: '' }))
        },
      ]
    )
  }

  const validateStep1 = () => {
    if (!formData.fullName.trim()) {
      Alert.alert('Atencao', 'Por favor, informe seu nome completo.')
      return false
    }
    if (formData.fullName.trim().length < 3) {
      Alert.alert('Atencao', 'O nome deve ter pelo menos 3 caracteres.')
      return false
    }
    return true
  }

  const validateStep2 = () => {
    if (!formData.birthDate) {
      Alert.alert('Atencao', 'Por favor, selecione sua data de nascimento.')
      return false
    }
    return true
  }

  const validateStep3 = () => {
    if (!formData.birthTime) {
      Alert.alert('Atencao', 'Por favor, informe sua hora de nascimento.')
      return false
    }
    return true
  }

  const validateStep4 = () => {
    // Aceita tanto localizaÃ§Ã£o selecionada quanto texto livre
    if (!selectedLocation && !locationQuery.trim()) {
      Alert.alert('Atencao', 'Por favor, informe a cidade e o estado de nascimento.')
      return false
    }

    // Se tem texto mas nÃ£o selecionou nenhuma cidade, usa os dados do texto
    if (!selectedLocation && locationQuery.trim()) {
      setFormData(prev => ({
        ...prev,
        city: locationQuery.trim(),
        country: 'Brasil', // PadrÃ£o para texto livre
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
        isValid = validateStep1()
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
    }

    if (isValid && currentStep < 4) {
      setCurrentStep(currentStep + 1)
    } else if (isValid && currentStep === 4) {
      handleComplete()
    }
  }

  const handleComplete = () => {
    let profilePhoto = formData.profilePhoto
    if (!profilePhoto && typeof window !== 'undefined') {
      const savedPhoto = localStorage.getItem('tempProfilePhoto')
      if (savedPhoto) {
        profilePhoto = savedPhoto
      }
    }

    const birthData: BirthData = {
      fullName: formData.fullName.trim(),
      profilePhoto,
      birthDate: formData.birthDate,
      birthTime: formData.birthTime,
      birthLocation: {
        city: formData.city,
        country: formData.country,
        latitude: formData.latitude,
        longitude: formData.longitude,
      }
    }

    onComplete(birthData)
  }

  const renderStep1 = () => (
    <View style={[styles.stepContainer, isLandscape && styles.stepContainerLandscape]}>
      <Ionicons name="person-outline" size={isDesktop() ? 80 : 64} color="#FFD700" style={styles.stepIcon} />
      
      <Text style={styles.stepTitle}>Vamos nos conhecer!</Text>
      <Text style={styles.stepDescription}>
        Como vocÃª gostaria de ser chamado? E que tal adicionar uma foto?
      </Text>

      {/* Foto de Perfil */}
      <View style={styles.photoContainer}>
        {formData.profilePhoto ? (
          <View style={styles.photoSelected}>
            <Image source={{ uri: formData.profilePhoto }} style={styles.profilePhoto} />
            <TouchableOpacity style={styles.removePhotoButton} onPress={removePhoto}>
              <Ionicons name="close-circle" size={24} color="#EF4444" />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.photoPlaceholder} onPress={selectPhoto}>
            <Ionicons name="camera-outline" size={isDesktop() ? 50 : 40} color="#666" />
            <Text style={styles.photoPlaceholderText}>Adicionar Foto</Text>
            <Text style={styles.photoOptionalText}>(Opcional)</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Nome Completo */}
      <View style={styles.inputContainer}>
        <Ionicons name="person" size={20} color="#666" style={styles.inputIcon} />
        <TextInput
          style={styles.nameInput}
          placeholder="Seu nome completo"
          placeholderTextColor="#666"
          value={formData.fullName}
          onChangeText={(text) => setFormData(prev => ({ ...prev, fullName: text }))}
          autoCapitalize="words"
          returnKeyType="next"
        />
      </View>

      <Text style={styles.helpText}>
        ðŸ‘‹ Este nome aparecerÃ¡ em seu perfil e para outros usuÃ¡rios
      </Text>
    </View>
  )

  const renderStep2 = () => (
    <View style={[styles.stepContainer, isLandscape && styles.stepContainerLandscape]}>
      <Ionicons name="calendar-outline" size={isDesktop() ? 80 : 64} color="#FFD700" style={styles.stepIcon} />
      
      <Text style={styles.stepTitle}>Quando voce nasceu?</Text>
      <Text style={styles.stepDescription}>
        Sua data de nascimento e essencial para calcular seu mapa astral
      </Text>

      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.inputIconButton} onPress={openDatePicker}>
          <Ionicons name="calendar" size={20} color="#FFD700" />
        </TouchableOpacity>
        <TextInput
          style={styles.dateInput}
          placeholder="DD/MM/AAAA"
          placeholderTextColor="#8E8E93"
          value={birthDateDisplay}
          onChangeText={handleBirthDateInput}
          keyboardType={Platform.OS === 'web' ? 'default' : 'number-pad'}
          returnKeyType="next"
        />
        <TouchableOpacity style={styles.inputIconButton} onPress={openDatePicker}>
          <Ionicons name="calendar-outline" size={20} color="#FFD700" />
        </TouchableOpacity>
      </View>

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
                <Text style={styles.pickerButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={confirmDate} style={[styles.pickerButton, styles.confirmButton]}>
                <Text style={[styles.pickerButtonText, styles.confirmButtonText]}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          )}
          {Platform.OS !== 'ios' && (
            <TouchableOpacity onPress={confirmDate} style={[styles.pickerButton, styles.confirmButton, { marginTop: 16 }]}>
              <Text style={[styles.pickerButtonText, styles.confirmButtonText]}>Confirmar</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  )

  const renderStep3 = () => (
    <View style={[styles.stepContainer, isLandscape && styles.stepContainerLandscape]}>
      <Ionicons name="time-outline" size={isDesktop() ? 80 : 64} color="#FFD700" style={styles.stepIcon} />
      
      <Text style={styles.stepTitle}>Que horas voce nasceu?</Text>
      <Text style={styles.stepDescription}>
        A hora exata e crucial para determinar seu ascendente e casas astrologicas
      </Text>

      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.inputIconButton} onPress={openTimePicker}>
          <Ionicons name="time" size={20} color="#FFD700" />
        </TouchableOpacity>
        <TextInput
          style={styles.dateInput}
          placeholder="HH:MM"
          placeholderTextColor="#8E8E93"
          value={birthTimeDisplay}
          onChangeText={handleBirthTimeInput}
          keyboardType={Platform.OS === 'web' ? 'default' : 'number-pad'}
          returnKeyType="next"
        />
        <TouchableOpacity style={styles.inputIconButton} onPress={openTimePicker}>
          <Ionicons name="time-outline" size={20} color="#FFD700" />
        </TouchableOpacity>
      </View>

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
                <Text style={styles.pickerButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={confirmTime} style={[styles.pickerButton, styles.confirmButton]}>
                <Text style={[styles.pickerButtonText, styles.confirmButtonText]}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}

      <Text style={styles.helpText}>
        Se nao souber a hora exata, consulte sua certidao de nascimento
      </Text>
    </View>
  )

  const renderStep4 = () => (
    <View style={[styles.stepContainer, isLandscape && styles.stepContainerLandscape]}>
      <Text style={styles.stepTitle}>Local de nascimento</Text>
      <Text style={styles.stepDescription}>
        Informe a cidade e o estado (UF) onde voce nasceu para calculos mais precisos
      </Text>

      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.inputIconButton} onPress={() => setShowLocationSuggestions(true)}>
          <Ionicons name="search" size={20} color="#FFD700" />
        </TouchableOpacity>
        <TextInput
          style={styles.locationInput}
          placeholder="Cidade e estado (ex: Rio de Janeiro, RJ)"
          placeholderTextColor="#8E8E93"
          value={locationQuery}
          onChangeText={handleLocationQueryChange}
          onFocus={() => {
            setShowLocationSuggestions(true)
            if (locationSuggestions.length === 0) {
              LocationService.searchLocations('').then(suggestions => {
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
          <Text style={styles.suggestionsTitle}>Cidades e estados disponiveis</Text>
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

      {!selectedLocation && !showLocationSuggestions && (
        <TouchableOpacity style={styles.suggestionPrompt} onPress={() => setShowLocationSuggestions(true)}>
          <Ionicons name="information-circle" size={20} color="#FFD700" />
          <Text style={styles.suggestionPromptText}>
            Toque para ver sugestoes de cidades e estados
          </Text>
        </TouchableOpacity>
      )}

      {selectedLocation && (
        <View style={styles.selectedLocationContainer}>
          <Ionicons name="checkmark-circle" size={24} color="#10B981" />
          <View style={styles.selectedLocationTextContainer}>
            <Text style={styles.selectedLocationLabel}>Local selecionado:</Text>
            <Text style={styles.selectedLocationText}>
              {selectedLocation.displayName}
            </Text>
          </View>
        </View>
      )}

      <Text style={styles.helpText}>
        {selectedLocation
          ? "Pronto. Voce pode finalizar."
          : "Digite pelo menos 2 letras para filtrar as opcoes."
        }
      </Text>
    </View>
  )
const renderProgressBar = () => (
    <View style={styles.progressContainer}>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${(currentStep / 4) * 100}%` }]} />
      </View>
      <Text style={styles.progressText}>{currentStep} de 4</Text>
    </View>
  )

  return (
    <LinearGradient colors={['#1a1a2e', '#16213e', '#0f0f23']} style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        <ResponsiveContainer>
          {renderProgressBar()}
          
          <View style={styles.content}>
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
            {currentStep === 4 && renderStep4()}
          </View>

          <View style={styles.buttonContainer}>
            {currentStep > 1 && (
              <TouchableOpacity 
                style={styles.backButton} 
                onPress={() => setCurrentStep(currentStep - 1)}
              >
                <Ionicons name="arrow-back" size={20} color="#FFD700" />
                <Text style={styles.backButtonText}>Voltar</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity 
              style={[
                styles.nextButton, 
                (loading || (currentStep === 4 && !selectedLocation && !locationQuery.trim())) && styles.disabledButton
              ]} 
              onPress={handleNext}
              disabled={loading || (currentStep === 4 && !selectedLocation && !locationQuery.trim())}
            >
              {loading ? (
                <Text style={styles.nextButtonText}>Salvando...</Text>
              ) : (
                <>
                  <Text style={styles.nextButtonText}>
                    {currentStep === 4 ? 'Finalizar' : 'PrÃ³ximo'}
                  </Text>
                  <Ionicons name="arrow-forward" size={20} color="#000" />
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* BotÃ£o para voltar ao login */}
          <TouchableOpacity 
            style={styles.backToLoginButton} 
            onPress={async () => { await hardSignOut(); logout(); }}
          >
            <Ionicons name="log-out-outline" size={16} color="#FFD700" />
            <Text style={styles.backToLoginText}>Voltar ao Login</Text>
          </TouchableOpacity>
        </ResponsiveContainer>
      </ScrollView>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: 60,
    paddingBottom: 80,
  },
  progressContainer: {
    marginBottom: 40,
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
  stepContainer: {
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
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
    top: -5,
    right: -5,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
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
    // Sombra para destacar que estÃ¡ "flutuando" acima
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
    marginTop: 40,
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



