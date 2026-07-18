import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../config/firebase'
import { useAuth } from '../hooks/useAuth'
import { useAppLanguage } from '../hooks/useAppLanguage'
import { decodeUnicodeEscapes, translateSignName } from '../utils/astro/pt'
import MoonPhaseButton from './MoonPhaseButton'

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface HomeHeaderProps {
  sunSign?: string
  moonSign?: string
  unreadCount?: number
  onPressBell?: () => void
}

export default function HomeHeader({ sunSign, moonSign, unreadCount = 0, onPressBell }: HomeHeaderProps) {
  const { user } = useAuth()
  const { language } = useAppLanguage()

  const tl = React.useCallback(
    (pt: string, en: string, es: string, it: string) => {
      if (language === 'en-US') return en
      if (language === 'es-ES') return es
      if (language === 'it-IT') return it
      return pt
    },
    [language],
  )

  const [userProfile, setUserProfile] = useState<{
    displayName: string
    profilePhoto?: string
    natalAscDeg?: number
  } | null>(null)

  useEffect(() => {
    if (!user) return
    const loadUserProfile = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid))
        if (userDoc.exists()) {
          const data = userDoc.data()
          setUserProfile({
            displayName: data.displayName || data.fullName || 'Usuário',
            profilePhoto: data.profilePhoto,
            natalAscDeg: typeof data.natalAscDeg === 'number' ? data.natalAscDeg : undefined,
          })
        }
      } catch {
        // silently ignore — header degrades gracefully
      }
    }
    loadUserProfile()
  }, [user])

  const displayName = (() => {
    const raw =
      userProfile?.displayName ||
      user?.displayName ||
      (user?.email ? user.email.split('@')[0] : '') ||
      tl('Usuário', 'User', 'Usuario', 'Utente')
    return decodeUnicodeEscapes(raw)
  })()

  const formattedDate = (() => {
    const locale =
      language === 'en-US' ? 'en-US' :
      language === 'es-ES' ? 'es-ES' :
      language === 'it-IT' ? 'it-IT' : 'pt-BR'
    return new Date().toLocaleDateString(locale, {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    })
  })()

  return (
    <View style={styles.header}>
      <View style={styles.userSection}>
        <View style={styles.avatarContainer}>
          {userProfile?.profilePhoto ? (
            <Image source={{ uri: userProfile.profilePhoto }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={24} color="#FFD700" />
            </View>
          )}
        </View>
        <View style={styles.headerContent}>
          <Text style={styles.greeting}>{tl('Olá', 'Hello', 'Hola', 'Ciao')}, {displayName}!</Text>
          {(() => {
            let ascSign: string | undefined
            try {
              if (userProfile?.natalAscDeg != null) {
                const { degToSign: d2s } = require('../astro')
                ascSign = d2s(userProfile.natalAscDeg)?.sign
              }
            } catch { ascSign = undefined }
            const parts: string[] = []
            if (sunSign) parts.push(`${tl('Signo', 'Sun', 'Signo', 'Segno')} ${translateSignName(sunSign, language)}`)
            if (ascSign) parts.push(`Asc ${translateSignName(ascSign, language)}`)
            if (moonSign) parts.push(`${tl('Lua', 'Moon', 'Luna', 'Luna')} ${translateSignName(moonSign, language)}`)
            if (!parts.length) return null
            return <Text style={styles.signLine}>{parts.join('  ·  ')}</Text>
          })()}
          <Text style={styles.date}>{tl('Hoje', 'Today', 'Hoy', 'Oggi')} · {formattedDate}</Text>
        </View>
      </View>

      <View style={styles.headerActions}>
        {onPressBell ? (
          <TouchableOpacity
            style={styles.bellButton}
            onPress={onPressBell}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={tl('Notificações', 'Notifications', 'Notificaciones', 'Notifiche')}
          >
            <Ionicons name="notifications-outline" size={24} color="#FFD700" />
            {unreadCount > 0 ? (
              <View style={styles.bellBadge}>
                <Text style={styles.bellBadgeText}>{unreadCount > 99 ? '99+' : unreadCount}</Text>
              </View>
            ) : null}
          </TouchableOpacity>
        ) : null}
        <MoonPhaseButton userReady={!!user} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 4,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minWidth: 0,
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#2A2A3E',
    borderWidth: 2,
    borderColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
    minWidth: 0,
    paddingRight: 8,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  signLine: {
    fontSize: 12,
    color: 'rgba(255,215,0,0.8)',
    marginBottom: 2,
    flexShrink: 1,
  },
  date: {
    fontSize: 11,
    color: '#A0A0A0',
    textTransform: 'capitalize',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bellButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2A2A3E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bellBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FF3B30',
    paddingHorizontal: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bellBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
  },
})
