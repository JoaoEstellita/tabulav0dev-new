/**
 *  GROUP DETAIL MODAL 
 * 
 * Modal completo com todos os detalhes do grupo:
 * - Informacoes do grupo
 * - Lista de membros com avatars e status
 * - Historico de atividades
 * - Sistema de convites
 * - Configuracoes de notificacao
 */

import React, { useState } from 'react'
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Share,
  Platform
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import Avatar from './Avatar'
import InviteModal from './InviteModal'
import GroupNotificationSettings from './GroupNotificationSettings'
import InviteService from '../services/InviteService'
import type { Group, GroupMember } from '../services/firebase/GroupService'

export interface GroupDetailModalProps {
  visible: boolean
  group: Group | null
  members: GroupMember[]
  currentUserId: string
  onClose: () => void
  onInvite: () => void
  onLeaveGroup: () => void
  onRemoveMember?: (member: GroupMember) => void
  onMemberProfile: (member: GroupMember) => void
}

// Extender interface para incluir profilePhoto
interface ExtendedGroupMember extends GroupMember {
  profilePhoto?: string
}

function normalizeDate(value: unknown): Date | null {
  if (value instanceof Date) return value
  if (value && typeof (value as { toDate?: () => Date }).toDate === 'function') {
    return (value as { toDate: () => Date }).toDate()
  }
  if (typeof value === 'number' || typeof value === 'string') {
    const parsed = new Date(value)
    if (!Number.isNaN(parsed.getTime())) return parsed
  }
  return null
}

/**
 * Formata tempo relativo (ex: "2 horas atras")
 */
function formatRelativeTime(date: unknown): string {
  const normalizedDate = normalizeDate(date)
  if (!normalizedDate) return 'Agora'
  const now = new Date()
  const diffMs = now.getTime() - normalizedDate.getTime()
  const diffMinutes = Math.floor(diffMs / (1000 * 60))
  
  if (diffMinutes < 1) return 'Agora'
  if (diffMinutes < 60) return `${diffMinutes}min atras`
  
  const diffHours = Math.floor(diffMinutes / 60)
  if (diffHours < 24) return `${diffHours}h atras`
  
  const diffDays = Math.floor(diffHours / 24)
  if (diffDays < 7) return `${diffDays}d atras`
  
  return date.toLocaleDateString('pt-BR')
}

/**
 * Gera link de convite
 */
function generateInviteLink(groupId: string, inviteCode: string): string {
  return `https://tabulaestelar.com.br/join/${inviteCode}`
}

const LIFE_AREA_LABELS: Record<string, string> = {
  amor: 'Amor',
  carreira: 'Carreira',
  financas: 'Financas',
  saude: 'Saude',
  familia: 'Familia',
  espiritualidade: 'Espiritualidade',
  comunicacao: 'Comunicacao',
  transformacao: 'Transformacao',
}

const formatLifeAreas = (areas?: string[]) => {
  if (!areas || areas.length === 0) return 'Todas as areas'
  return areas.map((area) => LIFE_AREA_LABELS[area] || area).join(', ')
}

export default function GroupDetailModal({
  visible,
  group,
  members,
  currentUserId,
  onClose,
  onInvite,
  onLeaveGroup,
  onRemoveMember,
  onMemberProfile
}: GroupDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'members' | 'activity' | 'invite'>('members')
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [showGroupSettings, setShowGroupSettings] = useState(false)
  
  if (!group) return null
  
  const isGroupOwner = group.createdBy === currentUserId
  const inviteLink = group.inviteCode ? generateInviteLink(group.id, group.inviteCode) : ''
  const sharedAreasText = formatLifeAreas(group.sharedLifeAreas)
  const notifiedAreasText = formatLifeAreas(group.notifiedLifeAreas)
  
  const copyToClipboard = async (text: string, successMessage: string) => {
    if (!text) return
    if (Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(text)
        Alert.alert('Sucesso', successMessage)
        return
      } catch (error) {
        console.error('Erro ao copiar no navegador:', error)
      }
    }

    await InviteService.copyToClipboard(text, successMessage)
  }

  const handleShare = async () => {
    try {
      if (group.inviteCode) {
        await Share.share({
          message: `Junte-se ao meu grupo "${group.name}" no Tabula Estelar.\n\nLink: ${inviteLink}\nCodigo: ${group.inviteCode}\n\nAreas compartilhadas: ${sharedAreasText}\nAreas notificadas: ${notifiedAreasText}\n\nBaixe o app Tabula Estelar para entrar no grupo.`,
          title: `Convite - ${group.name}`
        })
      }
    } catch (error) {
      console.error('Erro ao compartilhar:', error)
    }
  }
  
  const handleCopyCode = () => {
    if (group.inviteCode) {
      copyToClipboard(group.inviteCode, 'Codigo copiado para a area de transferencia!')
    }
  }
  
  const handleCopyLink = () => {
    if (inviteLink) {
      copyToClipboard(inviteLink, 'Link copiado para a area de transferencia!')
    }
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          
          <View style={styles.headerInfo}>
            <Text style={styles.groupName}>{group.name}</Text>
            <Text style={styles.memberCount}>
              {members.length} membro{members.length !== 1 ? 's' : ''}
            </Text>
          </View>
          
          <TouchableOpacity onPress={() => setShowInviteModal(true)} style={styles.inviteButton}>
            <Ionicons name="person-add" size={20} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'members' && styles.activeTab]}
            onPress={() => setActiveTab('members')}
          >
            <Ionicons 
              name="people" 
              size={16} 
              color={activeTab === 'members' ? '#000' : '#888'} 
            />
            <Text style={[styles.tabText, activeTab === 'members' && styles.activeTabText]}>
              Membros
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'invite' && styles.activeTab]}
            onPress={() => setActiveTab('invite')}
          >
            <Ionicons 
              name="share" 
              size={16} 
              color={activeTab === 'invite' ? '#000' : '#888'} 
            />
            <Text style={[styles.tabText, activeTab === 'invite' && styles.activeTabText]}>
              Convidar
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'activity' && styles.activeTab]}
            onPress={() => setActiveTab('activity')}
          >
            <Ionicons 
              name="time" 
              size={16} 
              color={activeTab === 'activity' ? '#000' : '#888'} 
            />
            <Text style={[styles.tabText, activeTab === 'activity' && styles.activeTabText]}>
              Atividade
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          
          {/* Descricao do grupo */}
          {group.description && (
            <View style={styles.descriptionSection}>
              <Text style={styles.description}>{group.description}</Text>
            </View>
          )}

          {/* Tab: Membros */}
          {activeTab === 'members' && (
            <View style={styles.membersContainer}>
              {(members as ExtendedGroupMember[]).map((member) => (
                <TouchableOpacity 
                  key={member.userId}
                  style={styles.memberItem}
                  onPress={() => onMemberProfile(member)}
                >
                  <Avatar
                    photoUrl={member.profilePhoto}
                    name={member.displayName}
                    size="medium"
                    showStatus={!!member.astrologicalStatus}
                    status={
                      member.astrologicalStatus?.overall === 'critical' ? 'busy' :
                      member.astrologicalStatus?.overall === 'excellent' ? 'online' : 'offline'
                    }
                  />
                  
                  <View style={styles.memberInfo}>
                    <View style={styles.memberHeader}>
                      <Text style={styles.memberName}>{member.displayName}</Text>
                      {member.userId === group.createdBy && (
                        <View style={styles.ownerBadge}>
                          <Ionicons name="star" size={12} color="#FFD700" />
                          <Text style={styles.ownerText}>Admin</Text>
                        </View>
                      )}
                    </View>
                    
                    <Text style={styles.memberEmail}>{member.email}</Text>
                    
                    {member.astrologicalStatus && (
                      <View style={styles.statusContainer}>
                        <View style={[
                          styles.statusDot,
                          { backgroundColor: 
                            member.astrologicalStatus.overall === 'critical' ? '#FF4444' :
                            member.astrologicalStatus.overall === 'excellent' ? '#4CAF50' : '#888'
                          }
                        ]} />
                        <Text style={styles.statusText}>
                          {member.astrologicalStatus.mood || 'Status nao disponivel'}
                        </Text>
                      </View>
                    )}
                    
                    {member.lastStatusUpdate && (
                      <Text style={styles.lastUpdate}>
                        Atualizado {formatRelativeTime(member.lastStatusUpdate)}
                      </Text>
                    )}
                  </View>

                  {isGroupOwner && member.userId !== currentUserId && onRemoveMember ? (
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => {
                        Alert.alert(
                          'Remover membro',
                          `Remover ${member.displayName} do grupo?`,
                          [
                            { text: 'Cancelar', style: 'cancel' },
                            {
                              text: 'Remover',
                              style: 'destructive',
                              onPress: () => onRemoveMember(member),
                            },
                          ]
                        )
                      }}
                    >
                      <Ionicons name="trash" size={16} color="#FF4444" />
                    </TouchableOpacity>
                  ) : (
                    <Ionicons name="chevron-forward" size={16} color="#888" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Tab: Convites */}
          {activeTab === 'invite' && (
            <View style={styles.inviteContainer}>
              <Text style={styles.sectionTitle}>Convidar Pessoas</Text>
              
              {group.inviteCode && (
                <>
                  <View style={styles.inviteOption}>
                    <View style={styles.inviteHeader}>
                      <Ionicons name="link" size={20} color="#4A90E2" />
                      <Text style={styles.inviteTitle}>Link de Convite</Text>
                    </View>
                    <Text style={styles.inviteDescription}>
                      Compartilhe este link para convidar pessoas
                    </Text>
                    <View style={styles.linkContainer}>
                      <Text style={styles.linkText} numberOfLines={1}>
                        {inviteLink}
                      </Text>
                      <TouchableOpacity onPress={handleCopyLink} style={styles.copyButton}>
                        <Ionicons name="copy" size={16} color="#4A90E2" />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={styles.inviteOption}>
                    <View style={styles.inviteHeader}>
                      <Ionicons name="keypad" size={20} color="#FFD700" />
                      <Text style={styles.inviteTitle}>Codigo de Convite</Text>
                    </View>
                    <Text style={styles.inviteDescription}>
                      Digite este codigo no app
                    </Text>
                    <View style={styles.codeContainer}>
                      <Text style={styles.codeText}>{group.inviteCode}</Text>
                      <TouchableOpacity onPress={handleCopyCode} style={styles.copyButton}>
                        <Ionicons name="copy" size={16} color="#FFD700" />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
                    <Ionicons name="share" size={20} color="#FFFFFF" />
                    <Text style={styles.shareButtonText}>Compartilhar Convite</Text>
                  </TouchableOpacity>

                  <View style={styles.inviteInfoBox}>
                    <Text style={styles.inviteInfoTitle}>Areas compartilhadas no grupo</Text>
                    <Text style={styles.inviteInfoText}>{sharedAreasText}</Text>
                  </View>
                  <View style={styles.inviteInfoBox}>
                    <Text style={styles.inviteInfoTitle}>Areas notificadas no grupo</Text>
                    <Text style={styles.inviteInfoText}>{notifiedAreasText}</Text>
                  </View>

                  <TouchableOpacity style={styles.settingsButton} onPress={() => setShowGroupSettings(true)}>
                    <Ionicons name="options" size={18} color="#FFFFFF" />
                    <Text style={styles.settingsButtonText}>Preferencias de compartilhamento</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          )}

          {/* Tab: Atividade */}
          {activeTab === 'activity' && (
            <View style={styles.activityContainer}>
              <Text style={styles.sectionTitle}>Atividade Recente</Text>
              
              <View style={styles.activityItem}>
                <Ionicons name="person-add" size={16} color="#4CAF50" />
                <Text style={styles.activityText}>
                  Grupo criado por {members.find(m => m.userId === group.createdBy)?.displayName}
                </Text>
                <Text style={styles.activityTime}>
                  {formatRelativeTime(group.createdAt)}
                </Text>
              </View>
              
              {/* Placeholder para atividades futuras */}
              <View style={styles.emptyActivity}>
                <Ionicons name="pulse" size={32} color="#888" />
                <Text style={styles.emptyText}>
                  As atividades do grupo aparecerao aqui
                </Text>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Footer Actions */}
        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.leaveButton} 
            onPress={() => {
              const message = isGroupOwner
                ? 'Voce e o admin. Ao sair, a administracao passa para outro membro.'
                : 'Tem certeza que deseja sair deste grupo?'
              Alert.alert(
                'Sair do Grupo',
                message,
                [
                  { text: 'Cancelar', style: 'cancel' },
                  { text: 'Sair', style: 'destructive', onPress: onLeaveGroup }
                ]
              )
            }}
          >
            <Ionicons name="exit" size={16} color="#FF4444" />
            <Text style={styles.leaveButtonText}>Sair do Grupo</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Modal de Convites */}
      <InviteModal
        visible={showInviteModal}
        group={group}
        onClose={() => setShowInviteModal(false)}
        onInviteSent={() => {
          setShowInviteModal(false)
          if (onInvite) onInvite()
        }}
      />

      <GroupNotificationSettings
        visible={showGroupSettings}
        group={group}
        currentUserId={currentUserId}
        onClose={() => setShowGroupSettings(false)}
      />
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
  groupName: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  memberCount: {
    color: '#888',
    fontSize: 14,
    marginTop: 2,
  },
  inviteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 4,
    gap: 6,
  },
  activeTab: {
    backgroundColor: '#FFD700',
  },
  tabText: {
    color: '#888',
    fontSize: 14,
    fontWeight: '500',
  },
  activeTabText: {
    color: '#000',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  descriptionSection: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2E',
    marginBottom: 16,
  },
  description: {
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 24,
  },
  membersContainer: {
    paddingBottom: 20,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2E',
  },
  memberInfo: {
    flex: 1,
    marginLeft: 12,
  },
  memberHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  memberName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  ownerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2C2C2E',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    gap: 4,
  },
  ownerText: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: '500',
  },
  memberEmail: {
    color: '#888',
    fontSize: 14,
    marginBottom: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  lastUpdate: {
    color: '#666',
    fontSize: 11,
  },
  inviteContainer: {
    paddingBottom: 20,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  inviteOption: {
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  inviteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  inviteTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  inviteDescription: {
    color: '#888',
    fontSize: 14,
    marginBottom: 12,
  },
  linkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2C2C2E',
    borderRadius: 8,
    padding: 12,
  },
  linkText: {
    color: '#4A90E2',
    fontSize: 14,
    flex: 1,
  },
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2C2C2E',
    borderRadius: 8,
    padding: 12,
  },
  codeText: {
    color: '#FFD700',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 2,
    flex: 1,
    textAlign: 'center',
  },
  copyButton: {
    padding: 8,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4A90E2',
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  shareButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  inviteInfoBox: {
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
  },
  inviteInfoTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
  },
  inviteInfoText: {
    color: '#888',
    fontSize: 13,
    lineHeight: 18,
  },
  settingsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    padding: 14,
    marginTop: 16,
    gap: 8,
  },
  settingsButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  activityContainer: {
    paddingBottom: 20,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  activityText: {
    color: '#FFFFFF',
    fontSize: 14,
    flex: 1,
  },
  activityTime: {
    color: '#888',
    fontSize: 12,
  },
  emptyActivity: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    color: '#888',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#2C2C2E',
  },
  leaveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    gap: 8,
  },
  leaveButtonText: {
    color: '#FF4444',
    fontSize: 16,
    fontWeight: '500',
  },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2C1B1B',
    justifyContent: 'center',
    alignItems: 'center',
  },
})
