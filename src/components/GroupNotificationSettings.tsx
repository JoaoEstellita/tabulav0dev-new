/**
 * ⚙️ GROUP NOTIFICATION SETTINGS ⚙️
 * 
 * Configurações granulares de notificações por grupo
 * - Filtros por área de vida
 * - Horários personalizados
 * - Tipos de alertas
 * - Configurações avançadas
 */

import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  StyleSheet,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import type { Group } from '../services/firebase/GroupService'

export interface GroupNotificationSettingsProps {
  visible: boolean
  group: Group | null
  onClose: () => void
  onSave?: (settings: GroupNotificationSettings) => void
}

export interface GroupNotificationSettings {
  enabled: boolean
  types: {
    criticalAlerts: boolean
    favorableEvents: boolean
    memberUpdates: boolean
    groupMessages: boolean
  }
  lifeAreas: {
    amor: boolean
    carreira: boolean
    financas: boolean
    saude: boolean
    familia: boolean
    espiritualidade: boolean
    comunicacao: boolean
    transformacao: boolean
  }
  schedule: {
    doNotDisturb: boolean
    startTime: string // HH:MM
    endTime: string // HH:MM
  }
  priority: 'all' | 'critical_only' | 'none'
}

const defaultSettings: GroupNotificationSettings = {
  enabled: true,
  types: {
    criticalAlerts: true,
    favorableEvents: true,
    memberUpdates: true,
    groupMessages: true,
  },
  lifeAreas: {
    amor: true,
    carreira: true,
    financas: true,
    saude: true,
    familia: true,
    espiritualidade: true,
    comunicacao: true,
    transformacao: true,
  },
  schedule: {
    doNotDisturb: false,
    startTime: '22:00',
    endTime: '07:00',
  },
  priority: 'all'
}

const lifeAreaLabels = {
  amor: { label: 'Amor', icon: '❤️', color: '#FF69B4' },
  carreira: { label: 'Carreira', icon: '💼', color: '#4A90E2' },
  financas: { label: 'Finanças', icon: '💰', color: '#4CAF50' },
  saude: { label: 'Saúde', icon: '🏥', color: '#FF9800' },
  familia: { label: 'Família', icon: '👨‍👩‍👧‍👦', color: '#9C27B0' },
  espiritualidade: { label: 'Espiritualidade', icon: '🙏', color: '#673AB7' },
  comunicacao: { label: 'Comunicação', icon: '💬', color: '#00BCD4' },
  transformacao: { label: 'Transformação', icon: '🔄', color: '#FF5722' },
}

export default function GroupNotificationSettings({
  visible,
  group,
  onClose,
  onSave
}: GroupNotificationSettingsProps) {
  const [settings, setSettings] = useState<GroupNotificationSettings>(defaultSettings)
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    // Aqui carregaríamos as configurações salvas do grupo
    // Por enquanto, usamos as configurações padrão
    setSettings(defaultSettings)
    setHasChanges(false)
  }, [group])

  const updateSettings = (updates: Partial<GroupNotificationSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }))
    setHasChanges(true)
  }

  const updateType = (type: keyof GroupNotificationSettings['types'], value: boolean) => {
    setSettings(prev => ({
      ...prev,
      types: { ...prev.types, [type]: value }
    }))
    setHasChanges(true)
  }

  const updateLifeArea = (area: keyof GroupNotificationSettings['lifeAreas'], value: boolean) => {
    setSettings(prev => ({
      ...prev,
      lifeAreas: { ...prev.lifeAreas, [area]: value }
    }))
    setHasChanges(true)
  }

  const updateSchedule = (updates: Partial<GroupNotificationSettings['schedule']>) => {
    setSettings(prev => ({
      ...prev,
      schedule: { ...prev.schedule, ...updates }
    }))
    setHasChanges(true)
  }

  const handleSave = () => {
    if (onSave) {
      onSave(settings)
    }
    setHasChanges(false)
    Alert.alert('Sucesso', 'Configurações salvas com sucesso!')
  }

  const handleReset = () => {
    Alert.alert(
      'Restaurar Padrões',
      'Deseja restaurar as configurações padrão?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Restaurar',
          style: 'destructive',
          onPress: () => {
            setSettings(defaultSettings)
            setHasChanges(true)
          }
        }
      ]
    )
  }

  const handleClose = () => {
    if (hasChanges) {
      Alert.alert(
        'Alterações não salvas',
        'Você tem alterações não salvas. Deseja sair mesmo assim?',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Sair', style: 'destructive', onPress: onClose }
        ]
      )
    } else {
      onClose()
    }
  }

  if (!group) return null

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          
          <View style={styles.headerInfo}>
            <Text style={styles.title}>⚙️ Configurações</Text>
            <Text style={styles.groupName}>{group.name}</Text>
          </View>
          
          <TouchableOpacity 
            onPress={handleSave} 
            style={[styles.saveButton, !hasChanges && styles.saveButtonDisabled]}
            disabled={!hasChanges}
          >
            <Ionicons name="checkmark" size={20} color={hasChanges ? "#000" : "#666"} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          
          {/* Controle Geral */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🔔 Controle Geral</Text>
            
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Receber Notificações</Text>
                <Text style={styles.settingDescription}>
                  Ativar/desativar todas as notificações deste grupo
                </Text>
              </View>
              <Switch
                value={settings.enabled}
                onValueChange={(value) => updateSettings({ enabled: value })}
                trackColor={{ false: '#3e3e3e', true: '#FFD700' }}
                thumbColor={settings.enabled ? '#000' : '#f4f3f4'}
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Prioridade</Text>
                <Text style={styles.settingDescription}>
                  Controle quais tipos de notificação receber
                </Text>
              </View>
              <View style={styles.priorityButtons}>
                {['all', 'critical_only', 'none'].map((priority) => (
                  <TouchableOpacity
                    key={priority}
                    style={[
                      styles.priorityButton,
                      settings.priority === priority && styles.priorityButtonActive
                    ]}
                    onPress={() => updateSettings({ priority: priority as any })}
                  >
                    <Text style={[
                      styles.priorityButtonText,
                      settings.priority === priority && styles.priorityButtonTextActive
                    ]}>
                      {priority === 'all' ? 'Todas' : 
                       priority === 'critical_only' ? 'Críticas' : 'Nenhuma'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* Tipos de Notificação */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📱 Tipos de Notificação</Text>
            
            {Object.entries({
              criticalAlerts: { label: 'Alertas Críticos', icon: '⚠️', desc: 'Quando membros passam por momentos difíceis' },
              favorableEvents: { label: 'Eventos Favoráveis', icon: '✨', desc: 'Quando membros têm energias positivas' },
              memberUpdates: { label: 'Atualizações de Membros', icon: '👤', desc: 'Quando membros atualizam seus status' },
              groupMessages: { label: 'Mensagens do Grupo', icon: '💬', desc: 'Mensagens enviadas pelos membros' },
            }).map(([key, config]) => (
              <View key={key} style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <View style={styles.settingHeader}>
                    <Text style={styles.settingIcon}>{config.icon}</Text>
                    <Text style={styles.settingLabel}>{config.label}</Text>
                  </View>
                  <Text style={styles.settingDescription}>{config.desc}</Text>
                </View>
                <Switch
                  value={settings.types[key as keyof typeof settings.types]}
                  onValueChange={(value) => updateType(key as keyof typeof settings.types, value)}
                  trackColor={{ false: '#3e3e3e', true: '#FFD700' }}
                  thumbColor={settings.types[key as keyof typeof settings.types] ? '#000' : '#f4f3f4'}
                  disabled={!settings.enabled}
                />
              </View>
            ))}
          </View>

          {/* Áreas de Vida */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>💝 Áreas de Vida</Text>
            <Text style={styles.sectionDescription}>
              Escolha quais áreas você quer receber notificações
            </Text>
            
            <View style={styles.lifeAreasGrid}>
              {Object.entries(lifeAreaLabels).map(([key, config]) => (
                <TouchableOpacity
                  key={key}
                  style={[
                    styles.lifeAreaItem,
                    settings.lifeAreas[key as keyof typeof settings.lifeAreas] && styles.lifeAreaItemActive,
                    !settings.enabled && styles.lifeAreaItemDisabled
                  ]}
                  onPress={() => updateLifeArea(key as keyof typeof settings.lifeAreas, !settings.lifeAreas[key as keyof typeof settings.lifeAreas])}
                  disabled={!settings.enabled}
                >
                  <Text style={styles.lifeAreaIcon}>{config.icon}</Text>
                  <Text style={[
                    styles.lifeAreaLabel,
                    settings.lifeAreas[key as keyof typeof settings.lifeAreas] && styles.lifeAreaLabelActive
                  ]}>
                    {config.label}
                  </Text>
                  {settings.lifeAreas[key as keyof typeof settings.lifeAreas] && (
                    <View style={styles.lifeAreaCheck}>
                      <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Horários */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>⏰ Não Perturbe</Text>
            
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Modo Não Perturbe</Text>
                <Text style={styles.settingDescription}>
                  Silenciar notificações durante certas horas
                </Text>
              </View>
              <Switch
                value={settings.schedule.doNotDisturb}
                onValueChange={(value) => updateSchedule({ doNotDisturb: value })}
                trackColor={{ false: '#3e3e3e', true: '#FFD700' }}
                thumbColor={settings.schedule.doNotDisturb ? '#000' : '#f4f3f4'}
                disabled={!settings.enabled}
              />
            </View>

            {settings.schedule.doNotDisturb && (
              <View style={styles.timeRangeContainer}>
                <Text style={styles.timeRangeLabel}>Horário de silêncio:</Text>
                <View style={styles.timeRangeRow}>
                  <View style={styles.timeInput}>
                    <Text style={styles.timeInputLabel}>De:</Text>
                    <Text style={styles.timeInputValue}>{settings.schedule.startTime}</Text>
                  </View>
                  <Text style={styles.timeRangeSeparator}>até</Text>
                  <View style={styles.timeInput}>
                    <Text style={styles.timeInputLabel}>Até:</Text>
                    <Text style={styles.timeInputValue}>{settings.schedule.endTime}</Text>
                  </View>
                </View>
              </View>
            )}
          </View>

          {/* Ações */}
          <View style={styles.section}>
            <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
              <Ionicons name="refresh" size={20} color="#FF4444" />
              <Text style={styles.resetButtonText}>Restaurar Padrões</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.bottomSpacer} />
        </ScrollView>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F23',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2E',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2C2C2E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerInfo: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  groupName: {
    color: '#FFD700',
    fontSize: 14,
    marginTop: 2,
  },
  saveButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#2C2C2E',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#888',
    marginBottom: 16,
    lineHeight: 20,
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
  settingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  settingIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  settingDescription: {
    fontSize: 14,
    color: '#888',
    lineHeight: 18,
  },
  priorityButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  priorityButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#2C2C2E',
    borderWidth: 1,
    borderColor: '#3C3C3E',
  },
  priorityButtonActive: {
    backgroundColor: '#FFD700',
    borderColor: '#FFD700',
  },
  priorityButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#888',
  },
  priorityButtonTextActive: {
    color: '#000',
  },
  lifeAreasGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  lifeAreaItem: {
    width: '47%',
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    position: 'relative',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  lifeAreaItemActive: {
    backgroundColor: '#2C2C2E',
    borderColor: '#FFD700',
  },
  lifeAreaItemDisabled: {
    opacity: 0.5,
  },
  lifeAreaIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  lifeAreaLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#888',
    textAlign: 'center',
  },
  lifeAreaLabelActive: {
    color: '#FFFFFF',
  },
  lifeAreaCheck: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeRangeContainer: {
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    padding: 16,
  },
  timeRangeLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  timeRangeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timeInput: {
    flex: 1,
    alignItems: 'center',
  },
  timeInputLabel: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
  },
  timeInputValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  timeRangeSeparator: {
    fontSize: 14,
    color: '#888',
    marginHorizontal: 16,
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
    fontWeight: '500',
  },
  bottomSpacer: {
    height: 32,
  },
})