import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Image } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../config/firebase'
import { useAuth } from '../hooks/useAuth'
import { useAppLanguage } from '../hooks/useAppLanguage'
import { decodeUnicodeEscapes } from '../utils/astro/pt'
import MoonPhaseButton from './MoonPhaseButton'

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function HomeHeader() {
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
          {userProfile?.natalAscDeg != null && (() => {
            try {
              const { degToSign: d2s } = require('../astro')
              const { sign } = d2s(userProfile.natalAscDeg)
              const SIGN_SYM: Record<string, string> = {
                Aries: '♈', Taurus: '♉', Gemini: '♊', Cancer: '♋',
                Leo: '♌', Virgo: '♍', Libra: '♎', Scorpio: '♏',
                Sagittarius: '♐', Capricorn: '♑', Aquarius: '♒', Pisces: '♓',
              }
              return (
                <Text style={styles.ascLabel}>
                  Asc {SIGN_SYM[sign] || ''} {sign}
                </Text>
              )
            } catch { return null }
          })()}
          <Text style={styles.houseSystemLabel}>{tl('Data Gregoriana', 'Gregorian Date', 'Fecha gregoriana', 'Data gregoriana')}</Text>
          <Text style={styles.date}>{formattedDate}</Text>
        </View>
      </View>

      <MoonPhaseButton userReady={!!user} />
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
  ascLabel: {
    fontSize: 11,
    color: 'rgba(255,215,0,0.7)',
    marginBottom: 1,
  },
  houseSystemLabel: {
    fontSize: 11,
    color: '#A0A0A0',
    marginTop: 2,
    lineHeight: 15,
    flexShrink: 1,
  },
  date: {
    fontSize: 11,
    color: '#A0A0A0',
    textTransform: 'capitalize',
  },
})
