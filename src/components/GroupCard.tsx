/**
 * 💳 GROUP CARD COMPONENT 💳
 * 
 * Card premium para exibir grupos com:
 * - Visual moderno e informativo
 * - Ícone/foto do grupo
 * - Status dos membros
 * - Indicadores visuais
 * - Ação de clique para detalhes
 */

import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import Avatar from './Avatar'
import type { Group, GroupMember } from '../services/firebase/GroupService'

export interface GroupCardProps {
  group: Group
  members: GroupMember[]
  unreadCount?: number
  lastActivity?: string
  onPress: () => void
}

// Extender interface para incluir profilePhoto
interface ExtendedGroupMember extends GroupMember {
  profilePhoto?: string
}

/**
 * Calcula estatísticas dos membros
 */
function calculateMemberStats(members: GroupMember[]) {
  const stats = {
    total: members.length,
    critical: 0,
    excellent: 0,
    neutral: 0,
    activeMembers: 0
  }
  
  members.forEach(member => {
    if (member.astrologicalStatus) {
      stats.activeMembers++
      
      switch (member.astrologicalStatus.overall) {
        case 'critical':
        case 'challenging':
          stats.critical++
          break
        case 'excellent':
        case 'positive':
          stats.excellent++
          break
        default:
          stats.neutral++
      }
    }
  })
  
  return stats
}

/**
 * Gera ícone do grupo baseado no nome/tipo
 */
function getGroupIcon(groupName: string): string {
  const name = groupName.toLowerCase()
  
  if (name.includes('família') || name.includes('family')) return '👨‍👩‍👧‍👦'
  if (name.includes('casal') || name.includes('couple')) return '💑'
  if (name.includes('amigo') || name.includes('friend')) return '👯‍♀️'
  if (name.includes('trabalho') || name.includes('work')) return '💼'
  if (name.includes('estudo') || name.includes('study')) return '📚'
  
  return '🌟' // Ícone padrão
}

export default function GroupCard({
  group,
  members,
  unreadCount = 0,
  lastActivity = 'Agora',
  onPress
}: GroupCardProps) {
  const stats = calculateMemberStats(members)
  const groupIcon = getGroupIcon(group.name)
  
  // Primeiros 3 membros para exibir avatars
  const visibleMembers = (members as ExtendedGroupMember[]).slice(0, 3)
  const remainingCount = Math.max(0, members.length - 3)

  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Header com ícone e nome */}
      <View style={styles.header}>
        <View style={styles.groupIcon}>
          <Text style={styles.groupIconText}>{groupIcon}</Text>
        </View>
        
        <View style={styles.groupInfo}>
          <Text style={styles.groupName} numberOfLines={1}>
            {group.name}
          </Text>
          <Text style={styles.groupDescription} numberOfLines={1}>
            {group.description || 'Grupo astrológico'}
          </Text>
        </View>
        
        {unreadCount > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>
              {unreadCount > 99 ? '99+' : unreadCount}
            </Text>
          </View>
        )}
      </View>

      {/* Avatars dos membros */}
      <View style={styles.membersSection}>
        <View style={styles.avatarsContainer}>
          {visibleMembers.map((member, index) => (
            <View 
              key={member.userId} 
              style={[
                styles.avatarWrapper,
                { marginLeft: index > 0 ? -8 : 0 }
              ]}
            >
              <Avatar
                photoUrl={member.profilePhoto}
                name={member.displayName}
                size="small"
                showStatus={!!member.astrologicalStatus}
                status={
                  member.astrologicalStatus?.overall === 'critical' ? 'busy' :
                  member.astrologicalStatus?.overall === 'excellent' ? 'online' : 'offline'
                }
              />
            </View>
          ))}
          
          {remainingCount > 0 && (
            <View style={[styles.avatarWrapper, styles.remainingCount]}>
              <Text style={styles.remainingText}>+{remainingCount}</Text>
            </View>
          )}
        </View>
        
        <Text style={styles.membersCount}>
          {stats.total} membro{stats.total !== 1 ? 's' : ''}
        </Text>
      </View>

      {/* Estatísticas de status */}
      <View style={styles.statsSection}>
        <View style={styles.statItem}>
          <View style={[styles.statDot, { backgroundColor: '#FF4444' }]} />
          <Text style={styles.statText}>
            {stats.critical} crítico{stats.critical !== 1 ? 's' : ''}
          </Text>
        </View>
        
        <View style={styles.statItem}>
          <View style={[styles.statDot, { backgroundColor: '#4CAF50' }]} />
          <Text style={styles.statText}>
            {stats.excellent} ótimo{stats.excellent !== 1 ? 's' : ''}
          </Text>
        </View>
        
        <View style={styles.statItem}>
          <View style={[styles.statDot, { backgroundColor: '#888' }]} />
          <Text style={styles.statText}>
            {stats.neutral} neutro{stats.neutral !== 1 ? 's' : ''}
          </Text>
        </View>
      </View>

      {/* Footer com última atividade */}
      <View style={styles.footer}>
        <View style={styles.activityInfo}>
          <Ionicons name="time-outline" size={14} color="#888" />
          <Text style={styles.lastActivity}>
            Última atividade: {lastActivity}
          </Text>
        </View>
        
        <Ionicons name="chevron-forward" size={16} color="#FFD700" />
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  groupIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#2C2C2E',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  groupIconText: {
    fontSize: 20,
  },
  groupInfo: {
    flex: 1,
  },
  groupName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  groupDescription: {
    color: '#888',
    fontSize: 14,
  },
  unreadBadge: {
    backgroundColor: '#FF4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  membersSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  avatarsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarWrapper: {
    borderWidth: 2,
    borderColor: '#1C1C1E',
    borderRadius: 18,
  },
  remainingCount: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2C2C2E',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -8,
  },
  remainingText: {
    color: '#FFD700',
    fontSize: 10,
    fontWeight: 'bold',
  },
  membersCount: {
    color: '#888',
    fontSize: 12,
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#2C2C2E',
  },
  activityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lastActivity: {
    color: '#888',
    fontSize: 12,
    marginLeft: 4,
  },
})