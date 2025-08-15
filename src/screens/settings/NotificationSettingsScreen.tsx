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
import AstroNotificationOrchestrator from '../../services/notifications/AstroNotificationOrchestrator'

export default function NotificationSettingsScreen() {
  const { preferences, loading, updatePreferences } = useNotificationPreferences()
  const [saving, setSaving] = useState(false)
  const [dailyTime, setDailyTime] = useState('08:00')
  const [daily, setDaily] = useState(true)
  const [weekly, setWeekly] = useState(true)
  const [monthly, setMonthly] = useState(true)
  const [personalAlerts, setPersonalAlerts] = useState(true)
  const [effectsHigh, setEffectsHigh] = useState(true)
 
  useEffect(() => {
    if (preferences) {
      setDailyTime((preferences as any)?.dailyTime || '08:00')
      setDaily((preferences as any)?.dailyNotifications ?? true)
      setWeekly((preferences as any)?.weeklyNotifications ?? true)
      setMonthly((preferences as any)?.monthlyNotifications ?? true)
      setPersonalAlerts((preferences as any)?.personalAlerts ?? true)
      setEffectsHigh((preferences as any)?.effectsHigh ?? true)
    }
  }, [preferences])
 
  const handleSave = async () => {
    try {
      setSaving(true)
      await updatePreferences({
        dailyNotifications: daily,
        weeklyNotifications: weekly,
        monthlyNotifications: monthly,
        personalAlerts: personalAlerts,
        dailyTime,
        effectsHigh,
      } as any)
      ;(globalThis as any).__effectsIntensity = effectsHigh ? 'high' : 'low'
      Alert.alert('Sucesso', 'Preferências salvas!')
    } finally { setSaving(false) }
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
          onPress: async () => { setDaily(true); setWeekly(true); setMonthly(true); setPersonalAlerts(true); setDailyTime('08:00') }
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
          <Text style={styles.subtitle}>Personalize quando e o que deseja receber</Text>
        </View>

        {/* Tipos de Notificação */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Tipos de Notificação</Text>
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Resumo Diário</Text>
              <Text style={styles.settingDescription}>Receba seu resumo Pessoal e Coletivo todos os dias</Text>
            </View>
            <Switch value={daily} onValueChange={setDaily} trackColor={{ false: '#3e3e3e', true: '#FFD700' }} thumbColor={daily ? '#000' : '#f4f3f4'} />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Digest Semanal</Text>
              <Text style={styles.settingDescription}>Principais aspectos Coletivos</Text>
            </View>
            <Switch value={weekly} onValueChange={setWeekly} trackColor={{ false: '#3e3e3e', true: '#FFD700' }} thumbColor={weekly ? '#000' : '#f4f3f4'} />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Digest Mensal</Text>
              <Text style={styles.settingDescription}>Movimentos Coletivos do mês</Text>
            </View>
            <Switch value={monthly} onValueChange={setMonthly} trackColor={{ false: '#3e3e3e', true: '#FFD700' }} thumbColor={monthly ? '#000' : '#f4f3f4'} />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Alertas Pessoais</Text>
              <Text style={styles.settingDescription}>Master aplicantes com pico em até 3 dias</Text>
            </View>
            <Switch value={personalAlerts} onValueChange={setPersonalAlerts} trackColor={{ false: '#3e3e3e', true: '#FFD700' }} thumbColor={personalAlerts ? '#000' : '#f4f3f4'} />
          </View>
        </View>

        {/* Horário das Notificações */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Horário diário</Text>
          </View>
          
          <View style={styles.timeInputContainer}>
            <View style={styles.timeInputRow}>
              <TextInput style={styles.timeInput} value={dailyTime} onChangeText={setDailyTime} placeholder="08:00" placeholderTextColor="#888" maxLength={5} keyboardType="numeric" />
              <TouchableOpacity style={[styles.saveButton, saving && styles.saveButtonDisabled]} onPress={handleSave} disabled={saving}>
                {saving ? (<ActivityIndicator size="small" color="#000" />) : (<Text style={styles.saveButtonText}>Salvar</Text>)}
              </TouchableOpacity>
            </View>
            <Text style={styles.timeHint}>Formato: HH:MM (ex: 08:00, 14:30)</Text>
          </View>
        </View>

        {/* Efeitos Visuais */}
        <View className="effects-section" style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Efeitos Visuais</Text>
          </View>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Intensidade Alta</Text>
              <Text style={styles.settingDescription}>Ativa starfield/pulse/stagger (pode consumir mais bateria)</Text>
            </View>
            <Switch value={effectsHigh} onValueChange={setEffectsHigh} trackColor={{ false: '#3e3e3e', true: '#FFD700' }} thumbColor={effectsHigh ? '#000' : '#f4f3f4'} />
          </View>
        </View>

        {/* Ação: Aplicar/agendar agora (teste rápido) */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.saveButton} onPress={async ()=>{
            try {
              setSaving(true)
              const userId = (globalThis as any).__currentUserId || ''
              const birthData = (globalThis as any).__currentBirthData
              if (!userId || !birthData) { Alert.alert('Atenção','Dados do usuário indisponíveis para teste.'); return }
              await AstroNotificationOrchestrator.scheduleAll(userId, birthData, {
                dailyTime,
                enableDaily: daily,
                enableWeekly: weekly,
                enableMonthly: monthly,
                enablePersonalAlerts: personalAlerts,
              })
              Alert.alert('Pronto','Notificações agendadas/enviadas para teste!')
            } finally { setSaving(false) }
          }}>
            <Text style={styles.saveButtonText}>Agendar/Testar Agora</Text>
          </TouchableOpacity>
        </View>

        {/* Ações */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.resetButton} onPress={handleResetSettings} disabled={saving}>
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