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
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import DateTimePicker from '@react-native-community/datetimepicker'
import LocationService, { type LocationSuggestion } from '../../services/LocationService'

interface BirthDataFormProps {
  onComplete: (data: BirthData) => void
  loading?: boolean
}

export interface BirthData {
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
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
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

  const validateStep1 = () => {
    if (!formData.birthDate) {
      Alert.alert('Atenção', 'Por favor, selecione sua data de nascimento.')
      return false
    }
    return true
  }

  const validateStep2 = () => {
    if (!formData.birthTime) {
      Alert.alert('Atenção', 'Por favor, informe sua hora de nascimento.')
      return false
    }
    return true
  }

  const validateStep3 = () => {
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
    }

    if (isValid && currentStep < 3) {
      setCurrentStep(currentStep + 1)
    } else if (isValid && currentStep === 3) {
      handleComplete()
    }
  }

  const handleComplete = () => {
    const birthData: BirthData = {
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
    <View style={styles.stepContainer}>
      <Ionicons name="calendar-outline" size={64} color="#FFD700" style={styles.stepIcon} />
      
      <Text style={styles.stepTitle}>Quando você nasceu?</Text>
      <Text style={styles.stepDescription}>
        Sua data de nascimento é essencial para calcular seu mapa astral
      </Text>

      <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
        <Ionicons name="calendar" size={20} color="#FFD700" />
        <Text style={styles.dateButtonText}>
          {formData.birthDate || 'Selecionar data de nascimento'}
        </Text>
      </TouchableOpacity>

      {showDatePicker && (
        <View style={styles.pickerContainer}>
          <DateTimePicker
            value={tempDate}
            mode="date"
            display="default"
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
        </View>
      )}
    </View>
  )

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Ionicons name="time-outline" size={64} color="#FFD700" style={styles.stepIcon} />
      
      <Text style={styles.stepTitle}>Que horas você nasceu?</Text>
      <Text style={styles.stepDescription}>
        A hora exata é crucial para determinar seu ascendente e casas astrológicas
      </Text>

      <TouchableOpacity style={styles.dateButton} onPress={() => setShowTimePicker(true)}>
        <Ionicons name="time" size={20} color="#FFD700" />
        <Text style={styles.dateButtonText}>
          {formData.birthTime || 'Selecionar hora de nascimento'}
        </Text>
      </TouchableOpacity>

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

  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <Ionicons name="location-outline" size={64} color="#FFD700" style={styles.stepIcon} />
      
      <Text style={styles.stepTitle}>Onde você nasceu?</Text>
      <Text style={styles.stepDescription}>
        Sua cidade de nascimento define a posição dos planetas no momento exato
      </Text>

      <View style={styles.inputContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.inputIcon} />
        <TextInput
          style={styles.locationInput}
          placeholder="Digite sua cidade de nascimento"
          placeholderTextColor="#666"
          value={locationQuery}
          onChangeText={handleLocationQueryChange}
          onFocus={() => {
            console.log('Campo focado. Sugestões disponíveis:', locationSuggestions.length)
            setShowLocationSuggestions(true)
          }}
          onBlur={() => {
            // Delay para permitir seleção de sugestão
            setTimeout(() => {
              if (!selectedLocation) {
                setShowLocationSuggestions(false)
              }
            }, 200)
          }}
        />
        {searchingLocation && (
          <ActivityIndicator 
            size="small" 
            color="#FFD700" 
            style={styles.searchIndicator} 
          />
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

      {/* Lista de sugestões */}
      {showLocationSuggestions && locationSuggestions.length > 0 && (
        <View style={styles.suggestionsContainer}>
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
        <View style={[styles.progressFill, { width: `${(currentStep / 3) * 100}%` }]} />
      </View>
      <Text style={styles.progressText}>{currentStep} de 3</Text>
    </View>
  )

  return (
    <LinearGradient colors={['#1a1a2e', '#16213e', '#0f0f23']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {renderProgressBar()}
        
        <View style={styles.content}>
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
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
              (loading || (currentStep === 3 && !selectedLocation && !locationQuery.trim())) && styles.disabledButton
            ]} 
            onPress={handleNext}
            disabled={loading || (currentStep === 3 && !selectedLocation && !locationQuery.trim())}
          >
            {loading ? (
              <Text style={styles.nextButtonText}>Salvando...</Text>
            ) : (
              <>
                <Text style={styles.nextButtonText}>
                  {currentStep === 3 ? 'Finalizar' : 'Próximo'}
                </Text>
                <Ionicons name="arrow-forward" size={20} color="#000" />
              </>
            )}
          </TouchableOpacity>
        </View>

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
    paddingHorizontal: 24,
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
    fontSize: 14,
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
    paddingHorizontal: 20,
  },
  stepIcon: {
    marginBottom: 24,
  },
  stepTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
  },
  stepDescription: {
    fontSize: 16,
    color: '#A0A0A0',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2C2C2E',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFD700',
    minWidth: '100%',
    justifyContent: 'center',
    marginBottom: 20,
  },
  dateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
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
    fontSize: 16,
    paddingVertical: 16,
  },
  input: {
    backgroundColor: '#2C2C2E',
    color: '#FFFFFF',
    fontSize: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#444',
    marginBottom: 16,
  },
  helpText: {
    color: '#A0A0A0',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 16,
    fontStyle: 'italic',
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
    fontSize: 16,
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
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
    fontWeight: '500',
  },
  suggestionsTitle: {
    color: '#FFD700',
    fontSize: 14,
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
    fontSize: 12,
    marginBottom: 4,
  },
  selectedLocationText: {
    color: '#10B981',
    fontSize: 16,
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
    fontSize: 16,
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
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  backButtonText: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFD700',
    paddingVertical: 16,
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
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
})