import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import DateTimePicker from '@react-native-community/datetimepicker'

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

  const searchLocation = async (query: string) => {
    if (query.length < 3) return

    try {
      // Simulação de busca de localização - integrar com API real depois
      const mockLocations = [
        { city: 'São Paulo', country: 'Brasil', latitude: -23.5505, longitude: -46.6333 },
        { city: 'Rio de Janeiro', country: 'Brasil', latitude: -22.9068, longitude: -43.1729 },
        { city: 'Belo Horizonte', country: 'Brasil', latitude: -19.9167, longitude: -43.9345 },
        { city: 'Salvador', country: 'Brasil', latitude: -12.9714, longitude: -38.5014 },
        { city: 'Brasília', country: 'Brasil', latitude: -15.7942, longitude: -47.8825 },
      ]

      const filtered = mockLocations.filter(loc => 
        loc.city.toLowerCase().includes(query.toLowerCase())
      )

      return filtered
    } catch (error) {
      console.log('Erro ao buscar localização:', error)
      return []
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
    if (!formData.city || !formData.country) {
      Alert.alert('Atenção', 'Por favor, informe sua cidade de nascimento.')
      return false
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
          value={formData.city}
          onChangeText={(text) => {
            setFormData(prev => ({ ...prev, city: text }))
            if (text.length >= 3) {
              // Aqui você pode implementar busca em tempo real
              searchLocation(text)
            }
          }}
        />
      </View>

      <TextInput
        style={styles.input}
        placeholder="País"
        placeholderTextColor="#666"
        value={formData.country}
        onChangeText={(text) => setFormData(prev => ({ ...prev, country: text }))}
      />

      <Text style={styles.helpText}>
        🔍 Comece digitando e selecionaremos a localização automaticamente
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
            style={[styles.nextButton, loading && styles.disabledButton]} 
            onPress={handleNext}
            disabled={loading}
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