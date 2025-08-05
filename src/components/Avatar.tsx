/**
 * 👤 AVATAR COMPONENT 👤
 * 
 * Componente reutilizável para exibir avatars de usuários
 * - Foto de perfil se disponível
 * - Iniciais como fallback
 * - Diferentes tamanhos
 * - Indicador de status online/offline
 */

import React from 'react'
import { View, Text, Image, StyleSheet } from 'react-native'

export interface AvatarProps {
  /**
   * URL da foto de perfil
   */
  photoUrl?: string
  
  /**
   * Nome completo para gerar iniciais
   */
  name: string
  
  /**
   * Tamanho do avatar
   */
  size?: 'small' | 'medium' | 'large' | 'xlarge'
  
  /**
   * Mostrar indicador de status
   */
  showStatus?: boolean
  
  /**
   * Status do usuário (online, offline, busy)
   */
  status?: 'online' | 'offline' | 'busy'
  
  /**
   * Estilo personalizado
   */
  style?: any
}

/**
 * Gera iniciais a partir do nome completo
 */
function generateInitials(name: string): string {
  if (!name || name.trim().length === 0) {
    return '?'
  }
  
  const parts = name.trim().split(' ')
  
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase()
  }
  
  // Primeiro nome + último sobrenome
  const firstInitial = parts[0].charAt(0)
  const lastInitial = parts[parts.length - 1].charAt(0)
  
  return (firstInitial + lastInitial).toUpperCase()
}

/**
 * Gera cor de fundo baseada no nome
 */
function generateBackgroundColor(name: string): string {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
    '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D7BDE2'
  ]
  
  if (!name) return colors[0]
  
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  
  const index = Math.abs(hash) % colors.length
  return colors[index]
}

export default function Avatar({
  photoUrl,
  name,
  size = 'medium',
  showStatus = false,
  status = 'offline',
  style
}: AvatarProps) {
  const initials = generateInitials(name)
  const backgroundColor = generateBackgroundColor(name)
  
  // Dimensões baseadas no tamanho
  const sizeStyles = {
    small: { width: 32, height: 32, borderRadius: 16 },
    medium: { width: 48, height: 48, borderRadius: 24 },
    large: { width: 64, height: 64, borderRadius: 32 },
    xlarge: { width: 80, height: 80, borderRadius: 40 }
  }
  
  const textSizes = {
    small: 12,
    medium: 18,
    large: 24,
    xlarge: 30
  }
  
  const statusSizes = {
    small: 8,
    medium: 12,
    large: 16,
    xlarge: 20
  }
  
  const containerStyle = [
    styles.container,
    sizeStyles[size],
    { backgroundColor },
    style
  ]
  
  const textStyle = [
    styles.initials,
    { fontSize: textSizes[size] }
  ]
  
  const statusColors = {
    online: '#4CAF50',
    offline: '#9E9E9E',
    busy: '#FF9800'
  }
  
  const statusStyle = [
    styles.statusIndicator,
    {
      width: statusSizes[size],
      height: statusSizes[size],
      borderRadius: statusSizes[size] / 2,
      backgroundColor: statusColors[status],
      right: size === 'small' ? -2 : -4,
      bottom: size === 'small' ? -2 : -4,
    }
  ]

  return (
    <View style={styles.avatarWrapper}>
      <View style={containerStyle}>
        {photoUrl ? (
          <Image 
            source={{ uri: photoUrl }} 
            style={[styles.image, sizeStyles[size]]}
            onError={() => {
              // Se a imagem falhar, o componente vai renderizar as iniciais
              console.log('Erro ao carregar imagem do avatar, usando iniciais')
            }}
          />
        ) : (
          <Text style={textStyle}>{initials}</Text>
        )}
      </View>
      
      {showStatus && (
        <View style={statusStyle} />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  avatarWrapper: {
    position: 'relative',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  initials: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  statusIndicator: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
})