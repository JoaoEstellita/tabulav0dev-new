/**
 * ⚙️ NOTIFICATION SETTINGS SCREEN ⚙️
 * 
 * Tela para configuração das preferências de notificações
 * - Ativar/desativar tipos de notificação
 * - Configurar horário das notificações diárias
 * - Mensagem personalizada para grupos
 * - Configurações específicas de grupos
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
  ActivityIndicator,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { useNotificationPreferences } from '../../hooks/useNotificationPreferences'

export default function NotificationSettingsScreen() {
  const {
    preferences,
    loading,
    error,
    updateNotificationType,
    updateDailyTime,
    updatePersonalMessage,
    updateGroupSetting,
    toggleAllNotifications,
    resetToDefault,
  } = useNotificationPreferences()

  const [localTime, setLocalTime] = useState('')
  const [localMessage, setLocalMessage] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (preferences) {
      setLocalTime(preferences.dailyTime)
      setLocalMessage(preferences.personalMessage)
    }
  }, [preferences])

  const handleSaveTime = async () => {
    try {
      setSaving(true)
      await updateDailyTime(localTime)
      Alert.alert('Sucesso', 'Horário atualizado com sucesso!')
    } catch (error: any) {
      Alert.alert('Erro', error.message)
    } finally {
      setSaving(false)
    }
  }

  const handleSaveMessage = async () => {
    try {
      setSaving(true)
      await updatePersonalMessage(localMessage)
      Alert.alert('Sucesso', 'Mensagem personalizada salva!')
    } catch (error: any) {
      Alert.alert('Erro', error.message)
    } finally {
      setSaving(false)
    }
  }

  const handleResetSettings = () => {
    Alert.alert(
      'Redefinir Configurações',
      'Deseja restaurar todas as configurações para o padrão?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Redefinir',
          style: 'destructive',
          onPress: async () => {
            try {
              setSaving(true)
              await resetToDefault()
              Alert.alert('Sucesso', 'Configurações redefinidas!')
            } catch (error: any) {
              Alert.alert('Erro', error.message)
            } finally {
              setSaving(false)
            }
          }
        }
      ]
    )
  }

  if (loading) {
    return (
      <LinearGradient colors={['#0F0F23', '#1A1A3A']} style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFD700" />
          <Text style={styles.loadingText}>Carregando configurações...</Text>
        </View>
      </LinearGradient>
    )
  }

  return (
    <LinearGradient colors={['#0F0F23', '#1A1A3A']} style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>🔔 Configurações de Notificações</Text>
          <Text style={styles.subtitle}>
            Personalize como e quando você recebe notificações
          </Text>
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <Ionicons name="warning" size={20} color="#FF4444" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Controle Geral */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Controle Geral</Text>
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Ativar Notificações</Text>
              <Text style={styles.settingDescription}>
                Ativar/desativar todas as notificações do app
              </Text>
            </View>
            <Switch
              value={preferences?.enabled || false}
              onValueChange={toggleAllNotifications}
              trackColor={{ false: '#3e3e3e', true: '#FFD700' }}
              thumbColor={preferences?.enabled ? '#000' : '#f4f3f4'}
            />
          </View>
        </View>

        {/* Tipos de Notificação */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Tipos de Notificação</Text>
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Resumo Diário</Text>
              <Text style={styles.settingDescription}>
                Receba seu resumo astrológico todos os dias
              </Text>
            </View>
            <Switch
              value={preferences?.types?.dailyOverview || false}
              onValueChange={(value) => updateNotificationType('dailyOverview', value)}
              trackColor={{ false: '#3e3e3e', true: '#FFD700' }}
              thumbColor={preferences?.types?.dailyOverview ? '#000' : '#f4f3f4'}
              disabled={!preferences?.enabled}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Alertas Críticos</Text>
              <Text style={styles.settingDescription}>
                Notificações sobre aspectos desafiadores importantes
              </Text>
            </View>
            <Switch
              value={preferences?.types?.criticalAlerts || false}
              onValueChange={(value) => updateNotificationType('criticalAlerts', value)}
              trackColor={{ false: '#3e3e3e', true: '#FFD700' }}
              thumbColor={preferences?.types?.criticalAlerts ? '#000' : '#f4f3f4'}
              disabled={!preferences?.enabled}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Aspectos Favoráveis</Text>
              <Text style={styles.settingDescription}>
                Notificações sobre energias positivas e oportunidades
              </Text>
            </View>
            <Switch
              value={preferences?.types?.favorableAspects || false}
              onValueChange={(value) => updateNotificationType('favorableAspects', value)}
              trackColor={{ false: '#3e3e3e', true: '#FFD700' }}
              thumbColor={preferences?.types?.favorableAspects ? '#000' : '#f4f3f4'}
              disabled={!preferences?.enabled}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Desafios Astrológicos</Text>
              <Text style={styles.settingDescription}>
                Alertas sobre períodos desafiadores (pode ser intenso)
              </Text>
            </View>
            <Switch
              value={preferences?.types?.challenges || false}
              onValueChange={(value) => updateNotificationType('challenges', value)}
              trackColor={{ false: '#3e3e3e', true: '#FFD700' }}
              thumbColor={preferences?.types?.challenges ? '#000' : '#f4f3f4'}
              disabled={!preferences?.enabled}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Mensagens de Grupo</Text>
              <Text style={styles.settingDescription}>
                Notificações dos seus grupos astrológicos
              </Text>
            </View>
            <Switch
              value={preferences?.types?.groupMessages || false}
              onValueChange={(value) => updateNotificationType('groupMessages', value)}
              trackColor={{ false: '#3e3e3e', true: '#FFD700' }}
              thumbColor={preferences?.types?.groupMessages ? '#000' : '#f4f3f4'}
              disabled={!preferences?.enabled}
            />
          </View>
        </View>

        {/* Horário das Notificações */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Horário das Notificações</Text>
          </View>
          
          <View style={styles.timeInputContainer}>
            <Text style={styles.timeLabel}>Horário do resumo diário:</Text>
            <View style={styles.timeInputRow}>
              <TextInput
                style={styles.timeInput}
                value={localTime}
                onChangeText={setLocalTime}
                placeholder="08:00"
                placeholderTextColor="#888"
                maxLength={5}
                keyboardType="numeric"
              />
              <TouchableOpacity
                style={[styles.saveButton, saving && styles.saveButtonDisabled]}
                onPress={handleSaveTime}
                disabled={saving || !localTime}
              >
                {saving ? (
                  <ActivityIndicator size="small" color="#000" />
                ) : (
                  <Text style={styles.saveButtonText}>Salvar</Text>
                )}
              </TouchableOpacity>
            </View>
            <Text style={styles.timeHint}>
              Formato: HH:MM (ex: 08:00, 14:30)
            </Text>
          </View>
        </View>

        {/* Configurações de Grupo */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Configurações de Grupo</Text>
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Permitir Mensagens Pessoais</Text>
              <Text style={styles.settingDescription}>
                Outros membros podem incluir sua mensagem pessoal
              </Text>
            </View>
            <Switch
              value={preferences?.groupSettings?.allowPersonalMessages || false}
              onValueChange={(value) => updateGroupSetting('allowPersonalMessages', value)}
              trackColor={{ false: '#3e3e3e', true: '#FFD700' }}
              thumbColor={preferences?.groupSettings?.allowPersonalMessages ? '#000' : '#f4f3f4'}
              disabled={!preferences?.enabled}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Eventos Críticos do Grupo</Text>
              <Text style={styles.settingDescription}>
                Receber notificações automáticas sobre eventos críticos do grupo
              </Text>
            </View>
            <Switch
              value={preferences?.groupSettings?.notifyOnCriticalEvents || false}
              onValueChange={(value) => updateGroupSetting('notifyOnCriticalEvents', value)}
              trackColor={{ false: '#3e3e3e', true: '#FFD700' }}
              thumbColor={preferences?.groupSettings?.notifyOnCriticalEvents ? '#000' : '#f4f3f4'}
              disabled={!preferences?.enabled}
            />
          </View>

          <View style={styles.messageInputContainer}>
            <Text style={styles.messageLabel}>Mensagem Pessoal para Grupos:</Text>
            <TextInput
              style={styles.messageInput}
              value={localMessage}
              onChangeText={setLocalMessage}
              placeholder="Ex: Sempre aqui para apoiar vocês! ✨"
              placeholderTextColor="#888"
              maxLength={100}
              multiline
              numberOfLines={3}
            />
            <View style={styles.messageInputFooter}>
              <Text style={styles.characterCount}>
                {localMessage.length}/100 caracteres
              </Text>
              <TouchableOpacity
                style={[styles.saveButton, saving && styles.saveButtonDisabled]}
                onPress={handleSaveMessage}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator size="small" color="#000" />
                ) : (
                  <Text style={styles.saveButtonText}>Salvar</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Ações */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.resetButton}
            onPress={handleResetSettings}
            disabled={saving}
          >
            <Ionicons name="refresh" size={20} color="#FF4444" />
            <Text style={styles.resetButtonText}>Redefinir Configurações</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpacer} />
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
    paddingHorizontal: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    lineHeight: 22,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2C1B1B',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    gap: 8,
  },
  errorText: {
    color: '#FF4444',
    fontSize: 14,
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1C1E',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#888',
    lineHeight: 20,
  },
  timeInputContainer: {
    backgroundColor: '#1C1C1E',
    padding: 16,
    borderRadius: 12,
  },
  timeLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  timeInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  timeInput: {
    flex: 1,
    backgroundColor: '#2C2C2E',
    color: '#FFFFFF',
    fontSize: 16,
    padding: 12,
    borderRadius: 8,
    textAlign: 'center',
  },
  timeHint: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
  },
  messageInputContainer: {
    backgroundColor: '#1C1C1E',
    padding: 16,
    borderRadius: 12,
  },
  messageLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  messageInput: {
    backgroundColor: '#2C2C2E',
    color: '#FFFFFF',
    fontSize: 14,
    padding: 12,
    borderRadius: 8,
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: 8,
  },
  messageInputFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  characterCount: {
    fontSize: 12,
    color: '#888',
  },
  saveButton: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    minWidth: 60,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#555',
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '600',
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2C1B1B',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  resetButtonText: {
    color: '#FF4444',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomSpacer: {
    height: 32,
  },
})