import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Linking, Platform } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { useSubscription } from '../hooks/useSubscription'
import { useAppLanguage } from '../hooks/useAppLanguage'

// Número do Astrólogo Tábula no WhatsApp (Meta Cloud API)
const AGENT_NUMBER = (process.env.EXPO_PUBLIC_WHATSAPP_AGENT_NUMBER || '5522988237163').replace(/\D/g, '')

/**
 * Card de descoberta do Astrólogo no WhatsApp.
 * Assinante ativo → abre wa.me/<número>. Não assinante → paywall.
 */
export default function WhatsAppAgentCard() {
  const navigation = useNavigation()
  const { subscription, isInTrial } = useSubscription()
  const { t } = useAppLanguage()

  const isSubscriber =
    isInTrial ||
    subscription?.status === 'active' ||
    subscription?.status === 'trial'

  const handlePress = () => {
    if (isSubscriber) {
      const url = `https://wa.me/${AGENT_NUMBER}?text=${encodeURIComponent('Oi')}`
      Linking.openURL(url).catch(() => {})
    } else {
      ;(navigation as any).navigate('Premium', { openTab: 'features' })
    }
  }

  return (
    <TouchableOpacity activeOpacity={0.85} onPress={handlePress} style={styles.card}>
      <View style={styles.iconWrap}>
        <Ionicons name="logo-whatsapp" size={26} color="#25D366" />
      </View>
      <View style={styles.body}>
        <Text style={styles.title}>
          {t('home.whatsappCard.title')}
        </Text>
        <Text style={styles.subtitle}>
          {isSubscriber
            ? t('home.whatsappCard.subtitle')
            : t('home.whatsappCard.lockedSubtitle')}
        </Text>
      </View>
      <View style={styles.ctaWrap}>
        <Text style={styles.cta}>
          {isSubscriber
            ? t('home.whatsappCard.cta')
            : t('settings.profile.whatsappUpgradeCta')}
        </Text>
        <Ionicons name="chevron-forward" size={16} color="#8892a4" />
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#161a22',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#25D36633',
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 12,
    gap: 12,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#25D36618',
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { flex: 1, gap: 3 },
  title: { color: '#e2e8f0', fontSize: 14, fontWeight: '700' },
  subtitle: { color: '#8892a4', fontSize: 12, lineHeight: 16 },
  ctaWrap: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  cta: { color: '#25D366', fontSize: 12, fontWeight: '600' },
})
