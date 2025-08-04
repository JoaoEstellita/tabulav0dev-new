/**
 * 🔔 NOTIFICATION SETTINGS SCREEN 🔔
 * 
 * Tela para configurações personalizadas de notificações
 * 
 * FUNCIONALIDADES:
 * - Configurar notificações por estado crítico
 * - Frase pessoal diária para grupos
 * - Horários personalizados
 * - Tipos de alertas específicos
 */

import React, { useState, useEffect } from 'react'
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Switch,
  TextInput,
  Alert,
  Platform
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import DateTimePicker from '@react-native-community/datetimepicker'
import { useAuth } from '../../hooks/useAuth'
import PushNotificationService, { NotificationPreferences } from '../../services/notifications/PushNotificationService'

interface CriticalStateSettings {
  amor: boolean
  carreira: boolean
  financas: boolean
  saude: boolean
  familia: boolean
  espiritualidade: boolean
  comunicacao: boolean
  transformacao: boolean
}

export default function NotificationSettingsScreen() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  // Estados das configurações
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [dailyTime, setDailyTime] = useState(new Date())
  const [showTimePicker, setShowTimePicker] = useState(false)
  const [personalMessage, setPersonalMessage] = useState('')
  const [criticalStates, setCriticalStates] = useState<CriticalStateSettings>({
    amor: true,
    carreira: true,
    financas: true,
    saude: true,
    familia: true,
    espiritualidade: false,
    comunicacao: false,
    transformacao: false
  })
  
  const [alertTypes, setAlertTypes] = useState({
    dailyOverview: true,
    criticalAlerts: true,
    favorableAspects: true,
    challenges: true,
    groupMessages: true
  })

  useEffect(() => {
    if (user) {
      loadUserPreferences()
    }
  }, [user])

  const loadUserPreferences = async () => {
    try {
      setLoading(true)
      
      // Carregar preferências existentes
      const preferences = await PushNotificationService.getUserPreferences(user!.uid)
      
      setNotificationsEnabled(preferences.enabled)
      
      // Converter string de tempo para Date
      const [hours, minutes] = preferences.dailyTime.split(':')
      const timeDate = new Date()
      timeDate.setHours(parseInt(hours), parseInt(minutes), 0, 0)
      setDailyTime(timeDate)
      
      setAlertTypes(preferences.types)
      
      // Carregar configurações específicas
      const userSettings = await PushNotificationService.getUserSpecificSettings(user!.uid)
      if (userSettings) {
        setPersonalMessage(userSettings.personalMessage || '')
        setCriticalStates(userSettings.criticalStates || criticalStates)
      }
      
    } catch (error) {
      console.error('Erro ao carregar preferências:', error)
    } finally {
      setLoading(false)
    }
  }

  const savePreferences = async () => {
    if (!user) return
    
    try {
      setSaving(true)
      
      const timeString = `${dailyTime.getHours().toString().padStart(2, '0')}:${dailyTime.getMinutes().toString().padStart(2, '0')}`
      
      const preferences: NotificationPreferences = {
        enabled: notificationsEnabled,
        dailyTime: timeString,
        types: alertTypes
      }
      
      // Salvar preferências básicas
      await PushNotificationService.updateUserPreferences(user.uid, preferences)
      
      // Salvar configurações específicas
      await PushNotificationService.updateUserSpecificSettings(user.uid, {
        personalMessage: personalMessage.trim(),
        criticalStates
      })
      
      Alert.alert('✅ Sucesso', 'Configurações de notificação atualizadas!')
      
    } catch (error) {
      console.error('Erro ao salvar preferências:', error)
      Alert.alert('❌ Erro', 'Não foi possível salvar as configurações.')
    } finally {
      setSaving(false)
    }
  }

  const toggleCriticalState = (state: keyof CriticalStateSettings) => {
    setCriticalStates(prev => ({
      ...prev,
      [state]: !prev[state]
    }))
  }

  const toggleAlertType = (type: keyof typeof alertTypes) => {
    setAlertTypes(prev => ({
      ...prev,
      [type]: !prev[type]
    }))
  }

  const onTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(Platform.OS === 'ios')
    if (selectedTime) {
      setDailyTime(selectedTime)
    }
  }

  const getStateIcon = (state: string): string => {
    const icons: { [key: string]: string } = {
      amor: '💕',
      carreira: '💼',
      financas: '💰',
      saude: '🏥',
      familia: '👨‍👩‍👧‍👦',
      espiritualidade: '🧘‍♀️',
      comunicacao: '💬',
      transformacao: '🦋'
    }
    return icons[state] || '🌟'
  }

  const getStateName = (state: string): string => {
    const names: { [key: string]: string } = {
      amor: 'Amor',
      carreira: 'Carreira',
      financas: 'Finanças',
      saude: 'Saúde',
      familia: 'Família',
      espiritualidade: 'Espiritualidade',
      comunicacao: 'Comunicação',
      transformacao: 'Transformação'
    }
    return names[state] || state
  }

  if (loading) {
    return (
      <LinearGradient colors={['#0F0F23', '#1A1A3A']} style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>🔔 Carregando configurações...</Text>
        </View>
      </LinearGradient>
    )
  }

  return (
    <LinearGradient colors={['#0F0F23', '#1A1A3A']} style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>🔔 Configurações de Notificação</Text>
          <Text style={styles.headerSubtitle}>Personalize suas notificações astrológicas</Text>
        </View>

        {/* Notificações Gerais */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📱 Configurações Gerais</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingName}>Notificações Habilitadas</Text>
              <Text style={styles.settingDescription}>Receber notificações push diárias</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#767577', true: '#FFD700' }}
              thumbColor={notificationsEnabled ? '#FFFFFF' : '#f4f3f4'}
            />
          </View>

          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => setShowTimePicker(true)}
          >
            <View style={styles.settingInfo}>
              <Text style={styles.settingName}>Horário Diário</Text>
              <Text style={styles.settingDescription}>
                {dailyTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
            <Ionicons name="time-outline" size={24} color="#FFD700" />
          </TouchableOpacity>

          {showTimePicker && (
            <DateTimePicker
              value={dailyTime}
              mode="time"
              is24Hour={true}
              display="default"
              onChange={onTimeChange}
            />
          )}
        </View>

        {/* Frase Pessoal para Grupos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💬 Mensagem Pessoal para Grupos</Text>
          <Text style={styles.sectionDescription}>
            Esta frase será enviada diariamente para seus grupos junto com os alertas astrológicos
          </Text>
          
          <TextInput
            style={styles.textInput}
            placeholder="Ex: Enviando energias positivas para todos! ✨"
            placeholderTextColor="#888888"
            value={personalMessage}
            onChangeText={setPersonalMessage}
            maxLength={120}
            multiline
          />
          <Text style={styles.characterCount}>
            {personalMessage.length}/120 caracteres
          </Text>
        </View>

        {/* Alertas por Estado Crítico */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🚨 Alertas por Estado Crítico</Text>
          <Text style={styles.sectionDescription}>
            Escolha para quais áreas da vida você quer receber alertas quando estiverem críticas
          </Text>
          
          {Object.entries(criticalStates).map(([state, enabled]) => (
            <View key={state} style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingName}>
                  {getStateIcon(state)} {getStateName(state)}
                </Text>
                <Text style={styles.settingDescription}>
                  Alerta quando {getStateName(state).toLowerCase()} estiver crítico
                </Text>
              </View>
              <Switch
                value={enabled}
                onValueChange={() => toggleCriticalState(state as keyof CriticalStateSettings)}
                trackColor={{ false: '#767577', true: '#FF4444' }}
                thumbColor={enabled ? '#FFFFFF' : '#f4f3f4'}
              />
            </View>
          ))}
        </View>

        {/* Tipos de Alertas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔔 Tipos de Notificações</Text>
          
          {Object.entries(alertTypes).map(([type, enabled]) => {
            const typeInfo = {
              dailyOverview: { name: 'Visão Geral Diária', desc: 'Resumo das energias do dia', icon: '📅' },
              criticalAlerts: { name: 'Alertas Críticos', desc: 'Quando áreas precisam de atenção', icon: '🚨' },
              favorableAspects: { name: 'Aspectos Favoráveis', desc: 'Oportunidades e energias positivas', icon: '✨' },
              challenges: { name: 'Desafios', desc: 'Áreas que requerem cuidado', icon: '⚠️' },
              groupMessages: { name: 'Mensagens de Grupo', desc: 'Notificações dos seus grupos', icon: '👥' }
            }[type] || { name: type, desc: '', icon: '🔔' }
            
            return (
              <View key={type} style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingName}>
                    {typeInfo.icon} {typeInfo.name}
                  </Text>
                  <Text style={styles.settingDescription}>{typeInfo.desc}</Text>
                </View>
                <Switch
                  value={enabled}
                  onValueChange={() => toggleAlertType(type as keyof typeof alertTypes)}
                  trackColor={{ false: '#767577', true: '#44AA44' }}
                  thumbColor={enabled ? '#FFFFFF' : '#f4f3f4'}
                />
              </View>
            )
          })}
        </View>

        {/* Botão Salvar */}
        <TouchableOpacity 
          style={[styles.saveButton, saving && styles.saveButtonDisabled]}
          onPress={savePreferences}
          disabled={saving}
        >
          <Text style={styles.saveButtonText}>
            {saving ? '⏳ Salvando...' : '💾 Salvar Configurações'}
          </Text>
        </TouchableOpacity>

        {/* Informações Adicionais */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>ℹ️ Informações</Text>
          <Text style={styles.infoText}>
            • As notificações são enviadas usando Firebase (100% gratuito){'\n'}
            • Sua frase pessoal será incluída nas notificações de grupo{'\n'}
            • Você pode modificar essas configurações a qualquer momento{'\n'}
            • Os alertas críticos são baseados em cálculos astrológicos reais
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#AAAAAA',
  },
  section: {
    backgroundColor: '#1C1C1E',
    margin: 16,
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#AAAAAA',
    marginBottom: 16,
    lineHeight: 20,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  settingInfo: {
    flex: 1,
    marginRight: 12,
  },
  settingName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#AAAAAA',
  },
  textInput: {
    backgroundColor: '#2C2C2E',
    borderRadius: 8,
    padding: 12,
    color: '#FFFFFF',
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  characterCount: {
    fontSize: 12,
    color: '#888888',
    textAlign: 'right',
    marginTop: 4,
  },
  saveButton: {
    backgroundColor: '#FFD700',
    margin: 16,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#666666',
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  infoSection: {
    margin: 16,
    padding: 16,
    backgroundColor: '#1A1A3A',
    borderRadius: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#CCCCCC',
    lineHeight: 20,
  },
})