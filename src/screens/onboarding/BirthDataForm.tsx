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

  const handleDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || tempDate
    setShowDatePicker(Platform.OS === 'ios')
    setTempDate(currentDate)
    
    if (Platform.OS !== 'ios') {
      setFormData(prev => ({
        ...prev,
        birthDate: currentDate.toISOString().split('T')[0]
      }))
    }
  }

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    const currentTime = selectedTime || tempTime
    setShowTimePicker(Platform.OS === 'ios')
    setTempTime(currentTime)
    
    if (Platform.OS !== 'ios') {
      const hours = currentTime.getHours().toString().padStart(2, '0')
      const minutes = currentTime.getMinutes().toString().padStart(2, '0')
      setFormData(prev => ({
        ...prev,
        birthTime: `${hours}:${minutes}`
      }))
    }
  }

  const confirmDate = () => {
    setFormData(prev => ({
      ...prev,
      birthDate: tempDate.toISOString().split('T')[0]
    }))
    setShowDatePicker(false)
  }

  const confirmTime = () => {
    const hours = tempTime.getHours().toString().padStart(2, '0')
    const minutes = tempTime.getMinutes().toString().padStart(2, '0')
    setFormData(prev => ({
      ...prev,
      birthTime: `${hours}:${minutes}`
    }))
    setShowTimePicker(false)
  }

  // Carregar sugestões iniciais quando o componente monta
  useEffect(() => {
    const loadInitialSuggestions = async () => {
      try {
        const initialSuggestions = await LocationService.searchLocations('')
        setLocationSuggestions(initialSuggestions)
      } catch (error) {
        console.error('Erro ao carregar sugestões iniciais:', error)
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
        console.log('✅ Foto carregada do localStorage')
      }
    }
  }, [])

  // Busca de localização com debounce
  useEffect(() => {
    if (locationQuery.length >= 2) {
      const timeoutId = setTimeout(async () => {
        setSearchingLocation(true)
        try {
          const suggestions = await LocationService.searchLocations(locationQuery)
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
          const defaultSuggestions = await LocationService.searchLocations('')
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
    
    // Se o usuário limpar o campo, limpa também os dados
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

  // Funções para manipulação de foto
  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== 'granted') {
      Alert.alert('Permissão Necessária', 'Precisamos de acesso à galeria para selecionar sua foto.')
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
          const reader = new FileReader()
          reader.onload = (e) => {
            const result = e.target?.result as string
            setFormData(prev => ({
              ...prev,
              profilePhoto: result,
            }))
            // Salvar no localStorage para persistência
            localStorage.setItem('tempProfilePhoto', result)
            console.log('✅ Foto selecionada na web')
          }
          reader.readAsDataURL(file)
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
      'Como você gostaria de adicionar sua foto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Galeria', onPress: () => pickImage('gallery') },
        { text: 'Câmera', onPress: () => pickImage('camera') },
      ]
    )
  }

  const pickImage = async (source: 'gallery' | 'camera') => {
    try {
      let result

      if (source === 'camera') {
        const { status } = await ImagePicker.requestCameraPermissionsAsync()
        if (status !== 'granted') {
          Alert.alert('Permissão Necessária', 'Precisamos de acesso à câmera.')
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

        console.log('✅ Foto processada e salva')
      }
    } catch (error) {
      console.error('Erro ao selecionar foto:', error)
      Alert.alert('Erro', 'Não foi possível selecionar a foto. Tente novamente.')
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
      Alert.alert('Atenção', 'Por favor, informe seu nome completo.')
      return false
    }
    if (formData.fullName.trim().length < 3) {
      Alert.alert('Atenção', 'O nome deve ter pelo menos 3 caracteres.')
      return false
    }
    return true
  }

  const validateStep2 = () => {
    if (!formData.birthDate) {
      Alert.alert('Atenção', 'Por favor, selecione sua data de nascimento.')
      return false
    }
    return true
  }

  const validateStep3 = () => {
    if (!formData.birthTime) {
      Alert.alert('Atenção', 'Por favor, informe sua hora de nascimento.')
      return false
    }
    return true
  }

  const validateStep4 = () => {
    // Aceita tanto localização selecionada quanto texto livre
    if (!selectedLocation && !locationQuery.trim()) {
      Alert.alert('Atenção', 'Por favor, informe sua cidade de nascimento.')
      return false
    }

    // Se tem texto mas não selecionou nenhuma cidade, usa os dados do texto
    if (!selectedLocation && locationQuery.trim()) {
      setFormData(prev => ({
        ...prev,
        city: locationQuery.trim(),
        country: 'Brasil', // Padrão para texto livre
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
    const birthData: BirthData = {
      fullName: formData.fullName.trim(),
      profilePhoto: formData.profilePhoto,
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
        Como você gostaria de ser chamado? E que tal adicionar uma foto?
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
        👋 Este nome aparecerá em seu perfil e para outros usuários
      </Text>
    </View>
  )

  const renderStep2 = () => (
    <View style={[styles.stepContainer, isLandscape && styles.stepContainerLandscape]}>
      <Ionicons name="calendar-outline" size={isDesktop() ? 80 : 64} color="#FFD700" style={styles.stepIcon} />
      
      <Text style={styles.stepTitle}>Quando você nasceu?</Text>
      <Text style={styles.stepDescription}>
        Sua data de nascimento é essencial para calcular seu mapa astral
      </Text>

      {/* Para web, usar input date nativo */}
      {typeof window !== 'undefined' ? (
        <View style={styles.dateInputContainer}>
          <Ionicons name="calendar" size={20} color="#FFD700" style={styles.inputIcon} />
          <input
            type="date"
            value={formData.birthDate}
            onChange={(e) => {
              setFormData(prev => ({
                ...prev,
                birthDate: e.target.value
              }))
              console.log('✅ Data selecionada:', e.target.value)
            }}
            max={new Date().toISOString().split('T')[0]}
            min="1900-01-01"
            style={{
              backgroundColor: '#2C2C2E',
              color: '#FFFFFF',
              fontSize: FONT_SIZES.md,
              padding: `${SPACING.md}px`,
              borderRadius: 12,
              border: '1px solid #444',
              flex: 1,
              outline: 'none',
              borderColor: '#FFD700'
            }}
          />
        </View>
      ) : (
        <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
          <Ionicons name="calendar" size={20} color="#FFD700" />
          <Text style={styles.dateButtonText}>
            {formData.birthDate || 'Selecionar data de nascimento'}
          </Text>
        </TouchableOpacity>
      )}

      {showDatePicker && (
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
      
      <Text style={styles.stepTitle}>Que horas você nasceu?</Text>
      <Text style={styles.stepDescription}>
        A hora exata é crucial para determinar seu ascendente e casas astrológicas
      </Text>

      {/* Para web, usar input time nativo */}
      {typeof window !== 'undefined' ? (
        <View style={styles.dateInputContainer}>
          <Ionicons name="time" size={20} color="#FFD700" style={styles.inputIcon} />
          <input
            type="time"
            value={formData.birthTime}
            onChange={(e) => {
              setFormData(prev => ({
                ...prev,
                birthTime: e.target.value
              }))
              console.log('✅ Hora selecionada:', e.target.value)
            }}
            style={{
              backgroundColor: '#2C2C2E',
              color: '#FFFFFF',
              fontSize: FONT_SIZES.md,
              padding: `${SPACING.md}px`,
              borderRadius: 12,
              border: '1px solid #444',
              flex: 1,
              outline: 'none',
              borderColor: '#FFD700'
            }}
          />
        </View>
      ) : (
        <TouchableOpacity style={styles.dateButton} onPress={() => setShowTimePicker(true)}>
          <Ionicons name="time" size={20} color="#FFD700" />
          <Text style={styles.dateButtonText}>
            {formData.birthTime || 'Selecionar hora de nascimento'}
          </Text>
        </TouchableOpacity>
      )}

      {showTimePicker && (
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
        💡 Se não souber a hora exata, consulte sua certidão de nascimento
      </Text>
    </View>
  )

  const renderStep4 = () => (
    <View style={[styles.stepContainer, isLandscape && styles.stepContainerLandscape]}>
      <Text style={styles.stepTitle}>📍 Local de Nascimento</Text>
      <Text style={styles.stepDescription}>
        Informe a cidade onde você nasceu para cálculos astrológicos precisos
      </Text>

      {/* Lista de sugestões - AGORA ACIMA DO CAMPO */}
      {showLocationSuggestions && locationSuggestions.length > 0 && (
        <View style={[styles.suggestionsContainer, styles.suggestionsAbove]}>
          <Text style={styles.suggestionsTitle}>
            ✨ Cidades disponíveis - Toque para selecionar:
          </Text>
          {locationSuggestions.slice(0, 6).map((item, index) => (
            <TouchableOpacity 
              key={`${item.city}-${index}`}
              style={styles.suggestionItem}
              onPress={() => handleLocationSelect(item)}
            >
              <Ionicons name="location" size={18} color="#FFD700" />
              <Text style={styles.suggestionText}>{item.displayName}</Text>
              <Ionicons name="chevron-forward" size={16} color="#666" />
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Campo de busca de localização */}
      <View style={styles.inputContainer}>
        <Ionicons name="search" size={20} color="#FFD700" style={styles.inputIcon} />
        <TextInput
          style={styles.locationInput}
          placeholder="Digite o nome da cidade..."
          placeholderTextColor="#8E8E93"
          value={locationQuery}
          onChangeText={handleLocationQueryChange}
          onFocus={() => {
            setShowLocationSuggestions(true)
            if (locationSuggestions.length === 0) {
              // Carregar sugestões padrão
              LocationService.searchLocations('').then(suggestions => {
                setLocationSuggestions(suggestions)
              }).catch(error => {
                console.error('Erro ao carregar sugestões padrão:', error)
              })
            }
          }}
          onBlur={() => {
            // Pequeno delay para permitir toque nas sugestões
            setTimeout(() => setShowLocationSuggestions(false), 200)
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

      {/* Mensagem para mostrar sugestões */}
      {!selectedLocation && !showLocationSuggestions && (
        <View style={styles.suggestionPrompt}>
          <Ionicons name="information-circle" size={20} color="#FFD700" />
          <Text style={styles.suggestionPromptText}>
            Toque no campo acima para ver as cidades disponíveis
          </Text>
        </View>
      )}

      {/* Confirmação da localização selecionada */}
      {selectedLocation && (
        <View style={styles.selectedLocationContainer}>
          <Ionicons name="checkmark-circle" size={24} color="#10B981" />
          <View style={styles.selectedLocationTextContainer}>
            <Text style={styles.selectedLocationLabel}>Cidade selecionada:</Text>
            <Text style={styles.selectedLocationText}>
              {selectedLocation.displayName}
            </Text>
          </View>
        </View>
      )}

      <Text style={styles.helpText}>
        {selectedLocation 
          ? "✅ Perfeito! Agora você pode finalizar" 
          : "🔍 Digite pelo menos 2 letras ou toque no campo para ver opções"
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
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
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
                    {currentStep === 4 ? 'Finalizar' : 'Próximo'}
                  </Text>
                  <Ionicons name="arrow-forward" size={20} color="#000" />
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Botão para voltar ao login */}
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
    paddingBottom: 40,
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
    flex: 1,
    justifyContent: 'center',
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