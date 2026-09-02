import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  Switch,
  TextInput,
  Alert,
  StyleSheet,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import GroupService, { type Group } from '../services/firebase/GroupService'
import { db } from '../config/firebase'
import {
  LIFE_AREA_COLORS,
  LIFE_AREA_ICONS,
  LIFE_AREA_LABELS,
  LIFE_AREA_ORDER,
} from '../constants/lifeAreas'

export interface GroupNotificationSettingsProps {
  visible: boolean
  group: Group | null
  currentUserId: string
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
  customAlertMessages: {
    amor: string
    carreira: string
    financas: string
    saude: string
    familia: string
    espiritualidade: string
    comunicacao: string
    transformacao: string
  }
  sharedLifeAreas: {
    amor: boolean
    carreira: boolean
    financas: boolean
    saude: boolean
    familia: boolean
    espiritualidade: boolean
    comunicacao: boolean
    transformacao: boolean
  }
  notifiedLifeAreas: {
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
    startTime: string
    endTime: string
  }
  shareStatus: boolean
  shareChart: boolean
  shareSynastry: boolean
  cooldownMinutes: number
  priority: 'all' | 'critical_only' | 'none'
}

type LifeAreaState = GroupNotificationSettings['sharedLifeAreas']

const defaultLifeAreas: LifeAreaState = {
  amor: true,
  carreira: true,
  financas: true,
  saude: true,
  familia: true,
  espiritualidade: true,
  comunicacao: true,
  transformacao: true,
}

const defaultSettings: GroupNotificationSettings = {
  enabled: true,
  types: {
    criticalAlerts: true,
    favorableEvents: true,
    memberUpdates: true,
    groupMessages: true,
  },
  customAlertMessages: {
    amor: '',
    carreira: '',
    financas: '',
    saude: '',
    familia: '',
    espiritualidade: '',
    comunicacao: '',
    transformacao: '',
  },
  sharedLifeAreas: { ...defaultLifeAreas },
  notifiedLifeAreas: { ...defaultLifeAreas },
  schedule: {
    doNotDisturb: false,
    startTime: '22:00',
    endTime: '07:00',
  },
  shareStatus: true,
  shareChart: true,
  shareSynastry: true,
  cooldownMinutes: 0,
  priority: 'all',
}

const lifeAreaLabels: Record<keyof LifeAreaState, { label: string; icon: string; color: string }> = LIFE_AREA_ORDER
  .reduce((acc, key) => {
    const label = LIFE_AREA_LABELS[key] || key
    const icon = LIFE_AREA_ICONS[key] || 'help-circle'
    const color = LIFE_AREA_COLORS[key]?.[0] || '#FFD700'
    acc[key as keyof LifeAreaState] = { label, icon, color }
    return acc
  }, {} as Record<keyof LifeAreaState, { label: string; icon: string; color: string }>)

const LIFE_AREAS = LIFE_AREA_ORDER

const buildLifeAreasState = (enabled?: readonly string[] | string[]): LifeAreaState => ({
  amor: enabled ? enabled.includes('amor') : true,
  carreira: enabled ? enabled.includes('carreira') : true,
  financas: enabled ? enabled.includes('financas') : true,
  saude: enabled ? enabled.includes('saude') : true,
  familia: enabled ? enabled.includes('familia') : true,
  espiritualidade: enabled ? enabled.includes('espiritualidade') : true,
  comunicacao: enabled ? enabled.includes('comunicacao') : true,
  transformacao: enabled ? enabled.includes('transformacao') : true,
})

const buildMessageState = (messages?: Record<string, string> | null): GroupNotificationSettings['customAlertMessages'] => ({
  amor: messages?.amor || '',
  carreira: messages?.carreira || '',
  financas: messages?.financas || '',
  saude: messages?.saude || '',
  familia: messages?.familia || '',
  espiritualidade: messages?.espiritualidade || '',
  comunicacao: messages?.comunicacao || '',
  transformacao: messages?.transformacao || '',
})

const toLifeAreasList = (lifeAreas: LifeAreaState) =>
  Object.entries(lifeAreas)
    .filter(([, value]) => value)
    .map(([key]) => key)

export default function GroupNotificationSettings({
  visible,
  group,
  currentUserId,
  onClose,
  onSave,
}: GroupNotificationSettingsProps) {
  const [settings, setSettings] = useState<GroupNotificationSettings>(defaultSettings)
  const [hasChanges, setHasChanges] = useState(false)
  const [shareTransitDurationsPref, setShareTransitDurationsPref] = useState(true)
  const [shareTransitDurationsDirty, setShareTransitDurationsDirty] = useState(false)

  useEffect(() => {
    if (!group) return

    let isActive = true

    const loadSettings = async () => {
      const sharedDefaults = group.sharedLifeAreas || LIFE_AREAS
      const notifiedDefaults = group.notifiedLifeAreas || LIFE_AREAS

      const [memberSettings, userDoc] = await Promise.all([
        GroupService.getMemberSettings(group.id, currentUserId),
        getDoc(doc(db, 'users', currentUserId)),
      ])
      const sharedLifeAreas = memberSettings?.sharedLifeAreas || sharedDefaults
      const notifiedLifeAreas = memberSettings?.notifiedLifeAreas || notifiedDefaults
      const userData = userDoc.exists() ? userDoc.data() : {}
      const shareDurations = userData?.preferences?.privacy?.shareTransitDurations !== false

      if (!isActive) return

      setSettings({
        ...defaultSettings,
        enabled: memberSettings?.enabled ?? true,
        types: { ...defaultSettings.types, ...(memberSettings?.types || {}) },
        schedule: { ...defaultSettings.schedule, ...(memberSettings?.schedule || {}) },
        priority: memberSettings?.priority || defaultSettings.priority,
        shareStatus: memberSettings?.shareStatus ?? defaultSettings.shareStatus,
        shareChart: memberSettings?.shareChart ?? defaultSettings.shareChart,
        shareSynastry: memberSettings?.shareSynastry ?? defaultSettings.shareSynastry,
        cooldownMinutes: memberSettings?.cooldownMinutes ?? defaultSettings.cooldownMinutes,
        customAlertMessages: buildMessageState(memberSettings?.customAlertMessages),
        sharedLifeAreas: buildLifeAreasState(sharedLifeAreas),
        notifiedLifeAreas: buildLifeAreasState(notifiedLifeAreas),
      })
      setShareTransitDurationsPref(shareDurations)
      setShareTransitDurationsDirty(false)
      setHasChanges(false)
    }

    loadSettings()

    return () => {
      isActive = false
    }
  }, [group, currentUserId])

  const updateSettings = (updates: Partial<GroupNotificationSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }))
    setHasChanges(true)
  }

  const updateType = (type: keyof GroupNotificationSettings['types'], value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      types: { ...prev.types, [type]: value },
    }))
    setHasChanges(true)
  }

  const updateSharedLifeArea = (area: keyof LifeAreaState, value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      sharedLifeAreas: { ...prev.sharedLifeAreas, [area]: value },
    }))
    setHasChanges(true)
  }

  const updateNotifiedLifeArea = (area: keyof LifeAreaState, value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      notifiedLifeAreas: { ...prev.notifiedLifeAreas, [area]: value },
    }))
    setHasChanges(true)
  }

  const updateCustomMessage = (area: keyof GroupNotificationSettings['customAlertMessages'], value: string) => {
    setSettings((prev) => ({
      ...prev,
      customAlertMessages: { ...prev.customAlertMessages, [area]: value },
    }))
    setHasChanges(true)
  }

  const updateSchedule = (updates: Partial<GroupNotificationSettings['schedule']>) => {
    setSettings((prev) => ({
      ...prev,
      schedule: { ...prev.schedule, ...updates },
    }))
    setHasChanges(true)
  }

  const handleSave = async () => {
    if (!group) return

    try {
      await GroupService.setMemberSettings(group.id, currentUserId, {
        sharedLifeAreas: toLifeAreasList(settings.sharedLifeAreas),
        notifiedLifeAreas: toLifeAreasList(settings.notifiedLifeAreas),
        enabled: settings.enabled,
        types: settings.types,
        schedule: settings.schedule,
        priority: settings.priority,
        shareStatus: settings.shareStatus,
        shareChart: settings.shareChart,
        cooldownMinutes: settings.cooldownMinutes,
        customAlertMessages: settings.customAlertMessages,
      })

      if (shareTransitDurationsDirty) {
        await updateDoc(doc(db, 'users', currentUserId), {
          'preferences.privacy.shareTransitDurations': shareTransitDurationsPref,
        })
        setShareTransitDurationsDirty(false)
      }

      if (onSave) {
        onSave(settings)
      }

      setHasChanges(false)
      Alert.alert('Sucesso', 'Configurações salvas com sucesso!')
    } catch (error) {
      console.error('Erro ao salvar configurações do grupo:', error)
      Alert.alert('Erro', 'Não foi possível salvar as configurações')
    }
  }

  const handleReset = () => {
    if (!group) return

    Alert.alert(
      'Restaurar padrões',
      'Deseja restaurar as configurações padrão do grupo?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Restaurar',
          style: 'destructive',
          onPress: () => {
            const sharedDefaults = group.sharedLifeAreas || LIFE_AREAS
            const notifiedDefaults = group.notifiedLifeAreas || LIFE_AREAS

            setSettings((prev) => ({
              ...prev,
              enabled: true,
              types: defaultSettings.types,
              schedule: defaultSettings.schedule,
              priority: defaultSettings.priority,
              shareStatus: defaultSettings.shareStatus,
              cooldownMinutes: defaultSettings.cooldownMinutes,
              customAlertMessages: defaultSettings.customAlertMessages,
              sharedLifeAreas: buildLifeAreasState(sharedDefaults),
              notifiedLifeAreas: buildLifeAreasState(notifiedDefaults),
            }))
            setHasChanges(true)
          },
        },
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
          { text: 'Sair', style: 'destructive', onPress: onClose },
        ]
      )
    } else {
      onClose()
    }
  }

  if (!group) return null

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.headerInfo}>
            <Text style={styles.title}>Configurações</Text>
            <Text style={styles.groupName}>{group.name}</Text>
          </View>

          <TouchableOpacity
            onPress={handleSave}
            style={[styles.saveButton, !hasChanges && styles.saveButtonDisabled]}
            disabled={!hasChanges}
          >
            <Ionicons name="checkmark" size={20} color={hasChanges ? '#000' : '#666'} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Controle geral</Text>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Receber notificações</Text>
                <Text style={styles.settingDescription}>
                  Ativar ou desativar todas as notificações deste grupo
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
                <Text style={styles.settingLabel}>Compartilhar status</Text>
                <Text style={styles.settingDescription}>
                  Permitir que membros vejam seu status neste grupo
                </Text>
              </View>
              <Switch
                value={settings.shareStatus}
                onValueChange={(value) => updateSettings({ shareStatus: value })}
                trackColor={{ false: '#3e3e3e', true: '#FFD700' }}
                thumbColor={settings.shareStatus ? '#000' : '#f4f3f4'}
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Compartilhar mapa completo</Text>
                <Text style={styles.settingDescription}>
                  Permitir que membros abram seu mapa natal e trânsitos neste grupo
                </Text>
              </View>
              <Switch
                value={settings.shareChart}
                onValueChange={(value) => updateSettings({ shareChart: value })}
                trackColor={{ false: '#3e3e3e', true: '#FFD700' }}
                thumbColor={settings.shareChart ? '#000' : '#f4f3f4'}
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Compartilhar sinastria</Text>
                <Text style={styles.settingDescription}>
                  Aparecer na sinastria do grupo (compatibilidade com os membros)
                </Text>
              </View>
              <Switch
                value={settings.shareSynastry}
                onValueChange={(value) => updateSettings({ shareSynastry: value })}
                trackColor={{ false: '#3e3e3e', true: '#FFD700' }}
                thumbColor={settings.shareSynastry ? '#000' : '#f4f3f4'}
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Compartilhar duração dos trânsitos</Text>
                <Text style={styles.settingDescription}>
                  Permitir que membros vejam a duração exata dos aspectos
                </Text>
              </View>
              <Switch
                value={shareTransitDurationsPref}
                onValueChange={(value) => {
                  setShareTransitDurationsPref(value)
                  setShareTransitDurationsDirty(true)
                  setHasChanges(true)
                }}
                trackColor={{ false: '#3e3e3e', true: '#FFD700' }}
                thumbColor={shareTransitDurationsPref ? '#000' : '#f4f3f4'}
              />
            </View>

            <View style={[styles.settingItem, styles.settingItemStacked]}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Prioridade</Text>
                <Text style={styles.settingDescription}>
                  Controle quais tipos de notificacao receber
                </Text>
              </View>
              <View style={styles.priorityButtons}>
                {['all', 'critical_only', 'none'].map((priority) => (
                  <TouchableOpacity
                    key={priority}
                    style={[
                      styles.priorityButton,
                      settings.priority === priority && styles.priorityButtonActive,
                    ]}
                    onPress={() => updateSettings({ priority: priority as any })}
                  >
                    <Text
                      style={[
                        styles.priorityButtonText,
                        settings.priority === priority && styles.priorityButtonTextActive,
                      ]}
                    >
                      {priority === 'all' ? 'Todas' : priority === 'critical_only' ? 'Críticas' : 'Nenhuma'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={[styles.settingItem, styles.settingItemStacked]}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Cooldown do grupo (push)</Text>
                <Text style={styles.settingDescription}>
                  Evita vários pushes seguidos deste grupo. Notificações internas continuam aparecendo no app.
                </Text>
              </View>
              <View style={styles.priorityButtons}>
                {[0, 30, 120, 360, 720].map((minutes) => (
                  <TouchableOpacity
                    key={`cooldown-${minutes}`}
                    style={[
                      styles.priorityButton,
                      settings.cooldownMinutes === minutes && styles.priorityButtonActive,
                    ]}
                    onPress={() => updateSettings({ cooldownMinutes: minutes })}
                  >
                    <Text
                      style={[
                        styles.priorityButtonText,
                        settings.cooldownMinutes === minutes && styles.priorityButtonTextActive,
                      ]}
                    >
                      {minutes === 0 ? 'Sem' : minutes >= 60 ? `${minutes / 60}h` : `${minutes}m`}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tipos de notificacao</Text>

            {Object.entries({
              criticalAlerts: {
                label: 'Alertas de atencao',
                icon: 'warning',
                desc: 'Quando membros passam por momentos dificeis',
              },
              favorableEvents: {
                label: 'Eventos favoraveis',
                icon: 'sparkles',
                desc: 'Quando membros tem energias positivas',
              },
              memberUpdates: {
                label: 'Atualizacoes de membros',
                icon: 'people',
                desc: 'Quando membros atualizam seus status',
              },
              groupMessages: {
                label: 'Mensagens do grupo',
                icon: 'chatbubble-ellipses',
                desc: 'Mensagens enviadas pelos membros',
              },
            }).map(([key, config]) => (
              <View key={key} style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <View style={styles.settingHeader}>
                    <Ionicons name={config.icon as any} size={16} color="#FFD700" />
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

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Áreas de vida</Text>
            <Text style={styles.sectionDescription}>
              Escolha o que você compartilha e o que deseja receber neste grupo
            </Text>

            <Text style={styles.subsectionTitle}>Compartilhar com o grupo</Text>
            <View style={styles.lifeAreasGrid}>
              {Object.entries(lifeAreaLabels).map(([key, config]) => (
                <TouchableOpacity
                  key={`shared-${key}`}
                  style={[
                    styles.lifeAreaItem,
                    settings.sharedLifeAreas[key as keyof LifeAreaState] && styles.lifeAreaItemActive,
                    !settings.enabled && styles.lifeAreaItemDisabled,
                  ]}
                  onPress={() =>
                    updateSharedLifeArea(
                      key as keyof LifeAreaState,
                      !settings.sharedLifeAreas[key as keyof LifeAreaState]
                    )
                  }
                  disabled={!settings.enabled}
                >
                  <Ionicons name={config.icon as any} size={20} color={config.color} />
                  <Text
                    style={[
                      styles.lifeAreaLabel,
                      settings.sharedLifeAreas[key as keyof LifeAreaState] && styles.lifeAreaLabelActive,
                    ]}
                  >
                    {config.label}
                  </Text>
                  {settings.sharedLifeAreas[key as keyof LifeAreaState] && (
                    <View style={styles.lifeAreaCheck}>
                      <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.subsectionTitle}>Receber notificações</Text>
            <View style={styles.lifeAreasGrid}>
              {Object.entries(lifeAreaLabels).map(([key, config]) => (
                <TouchableOpacity
                  key={`notified-${key}`}
                  style={[
                    styles.lifeAreaItem,
                    settings.notifiedLifeAreas[key as keyof LifeAreaState] && styles.lifeAreaItemActive,
                    !settings.enabled && styles.lifeAreaItemDisabled,
                  ]}
                  onPress={() =>
                    updateNotifiedLifeArea(
                      key as keyof LifeAreaState,
                      !settings.notifiedLifeAreas[key as keyof LifeAreaState]
                    )
                  }
                  disabled={!settings.enabled}
                >
                  <Ionicons name={config.icon as any} size={20} color={config.color} />
                  <Text
                    style={[
                      styles.lifeAreaLabel,
                      settings.notifiedLifeAreas[key as keyof LifeAreaState] && styles.lifeAreaLabelActive,
                    ]}
                  >
                    {config.label}
                  </Text>
                  {settings.notifiedLifeAreas[key as keyof LifeAreaState] && (
                    <View style={styles.lifeAreaCheck}>
                      <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Mensagens para alertas de atencao</Text>
            <Text style={styles.sectionDescription}>
              Personalize a mensagem enviada ao grupo quando uma área ficar crítica.
            </Text>
            {Object.entries(lifeAreaLabels).map(([key, config]) => (
              <View key={`message-${key}`} style={styles.messageBlock}>
                <View style={styles.messageHeader}>
                  <Ionicons name={config.icon as any} size={16} color={config.color} />
                  <Text style={styles.messageTitle}>{config.label}</Text>
                </View>
                <TextInput
                  style={styles.messageInput}
                  placeholder={`Mensagem para ${config.label.toLowerCase()}`}
                  placeholderTextColor="#666"
                  value={settings.customAlertMessages[key as keyof GroupNotificationSettings['customAlertMessages']]}
                  onChangeText={(value) =>
                    updateCustomMessage(key as keyof GroupNotificationSettings['customAlertMessages'], value)
                  }
                  maxLength={180}
                  multiline
                  editable={settings.enabled}
                />
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Não perturbe</Text>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Modo não perturbe</Text>
                <Text style={styles.settingDescription}>Silenciar notificações durante certas horas</Text>
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
                <Text style={styles.timeRangeLabel}>Horario de silencio:</Text>
                <View style={styles.timeRangeRow}>
                  <View style={styles.timeInput}>
                    <Text style={styles.timeInputLabel}>De:</Text>
                    <Text style={styles.timeInputValue}>{settings.schedule.startTime}</Text>
                  </View>
                  <Text style={styles.timeRangeSeparator}>ate</Text>
                  <View style={styles.timeInput}>
                    <Text style={styles.timeInputLabel}>Ate:</Text>
                    <Text style={styles.timeInputValue}>{settings.schedule.endTime}</Text>
                  </View>
                </View>
              </View>
            )}
          </View>

          <View style={styles.section}>
            <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
              <Ionicons name="refresh" size={20} color="#FF4444" />
              <Text style={styles.resetButtonText}>Restaurar padroes</Text>
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
  subsectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
    marginTop: 12,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#888',
    marginBottom: 16,
    lineHeight: 20,
  },
  messageBlock: {
    backgroundColor: '#1C1C1E',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  messageTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  messageInput: {
    backgroundColor: '#2C2C2E',
    color: '#FFFFFF',
    fontSize: 13,
    padding: 10,
    borderRadius: 8,
    minHeight: 64,
    textAlignVertical: 'top',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1C1E',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  settingItemStacked: {
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 8,
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
    flexWrap: 'wrap',
    marginTop: 10,
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
  lifeAreaLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#888',
    textAlign: 'center',
    marginTop: 8,
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
