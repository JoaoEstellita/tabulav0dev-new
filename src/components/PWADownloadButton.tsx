import React, { useEffect, useState } from 'react'
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import {
  getPwaDebug,
  getPwaState,
  promptInstall,
  subscribePwaInstall,
} from '../utils/pwaInstall'

export default function PWADownloadButton() {
  const [pwaState, setPwaState] = useState(getPwaState())
  const [showButton, setShowButton] = useState(!getPwaState().isInstalled)

  useEffect(() => {
    const unsubscribe = subscribePwaInstall((next) => {
      setPwaState(next)
      setShowButton(!next.isInstalled)
    })
    return unsubscribe
  }, [])

  const handleInstall = async () => {
    if (typeof window === 'undefined') return

    const isDev = typeof __DEV__ !== 'undefined' ? __DEV__ : false
    const shouldLog = isDev || (globalThis as any).__PWA_DEBUG__ === true
    const debugInfo = await getPwaDebug()

    if (shouldLog) {
      console.log('[PWA Install Debug]', debugInfo)
    }

    if (debugInfo.isStandalone) {
      setShowButton(false)
      return
    }

    if (debugInfo.isIOS) {
      Alert.alert(
        'Instalar no iPhone',
        'No Safari: toque em Compartilhar e depois em "Adicionar à Tela de Início".',
        [{ text: 'OK', style: 'default' }]
      )
      return
    }

    const choice = await promptInstall()
    if (choice) {
      if (shouldLog) {
        console.log('[PWA Install Choice]', choice?.outcome)
      }
      return
    }

    Alert.alert(
      'Instalação indisponível agora',
      'Para instalar, use o Chrome e confirme que o app tem manifest válido e service worker ativo. Se acabou de fazer deploy, pode ser cache: feche e reabra o navegador.',
      [{ text: 'OK', style: 'default' }]
    )
  }

  if (!showButton || pwaState.isInstalled || !pwaState.isMobile) {
    return null
  }

  return (
    <TouchableOpacity style={styles.container} onPress={handleInstall}>
      <View style={styles.content}>
        <Ionicons name="download" size={20} color="#FFD700" />
        <Text style={styles.text}>Instalar App</Text>
        <Ionicons name="chevron-forward" size={16} color="#FFD700" />
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(26, 31, 58, 0.95)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFD700',
    padding: 16,
    zIndex: 1000,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  text: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
})
