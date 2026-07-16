import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Linking, Platform } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { useSubscription } from '../hooks/useSubscription'
import { useAppLanguage } from '../hooks/useAppLanguage'
import { openWhatsAppAgent } from '../utils/whatsappAgent'

const DISMISS_KEY = 'wa_agent_banner_dismissed'

/**
 * Banner de descoberta do Astrólogo no WhatsApp.
 *
 * Antes era um card fixo no topo da Home, ocupando espaço pra sempre. Agora é
 * um banner flutuante que some depois do primeiro clique (ou do X) e não volta
 * — o acesso permanente fica em Configurações.
 */
export default function WhatsAppAgentBanner() {
  const navigation = useNavigation()
  const { subscription, isInTrial } = useSubscription()
  const { t } = useAppLanguage()
  const [visible, setVisible] = useState(false)
  const [installBannerVisible, setInstallBannerVisible] = useState(false)

  const isSubscriber =
    isInTrial ||
    subscription?.status === 'active' ||
    subscription?.status === 'trial'

  useEffect(() => {
    let active = true
    AsyncStorage.getItem(DISMISS_KEY)
      .then((v) => { if (active) setVisible(v !== '1') })
      .catch(() => { if (active) setVisible(true) })
    return () => { active = false }
  }, [])

  // Evita empilhar em cima do banner "Instalar App" (também flutuante).
  useEffect(() => {
    if (Platform.OS !== 'web') return
    try {
      const { subscribePwaInstall } = require('../utils/pwaInstall')
      return subscribePwaInstall((s: any) => {
        setInstallBannerVisible(!!s.isMobile && !s.isInstalled && !!s.canInstall)
      })
    } catch {
      return
    }
  }, [])

  const dismiss = async () => {
    setVisible(false)
    AsyncStorage.setItem(DISMISS_KEY, '1').catch(() => {})
  }

  const handlePress = async () => {
    if (isSubscriber) {
      openWhatsAppAgent('discovery')
    } else {
      ;(navigation as any).navigate('Premium', { openTab: 'features' })
    }
    // Cumpriu o papel de descoberta — não precisa aparecer de novo.
    dismiss()
  }

  if (!visible) return null

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={handlePress}
      style={[styles.banner, { bottom: installBannerVisible ? 92 : 20 }]}
    >
      <View style={styles.iconWrap}>
        <Ionicons name="logo-whatsapp" size={22} color="#25D366" />
      </View>
      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={1}>{t('home.whatsappCard.title')}</Text>
        <Text style={styles.subtitle} numberOfLines={2}>
          {isSubscriber ? t('home.whatsappCard.subtitle') : t('home.whatsappCard.lockedSubtitle')}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.close}
        onPress={dismiss}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons name="close" size={18} color="#8892a4" />
      </TouchableOpacity>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  banner: {
    position: 'absolute',
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(22, 26, 34, 0.97)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#25D36655',
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 12,
    zIndex: 999,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#25D3661a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { flex: 1 },
  title: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  subtitle: { color: '#8892a4', fontSize: 11, marginTop: 2, lineHeight: 15 },
  close: { padding: 4 },
})
