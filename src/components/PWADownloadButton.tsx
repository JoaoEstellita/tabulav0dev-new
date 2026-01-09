import React, { useEffect, useRef, useState } from 'react'
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
}

export default function PWADownloadButton() {
  const [showButton, setShowButton] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [canInstall, setCanInstall] = useState(false)
  const [isIos, setIsIos] = useState(false)
  const deferredPromptRef = useRef<BeforeInstallPromptEvent | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const ua = window.navigator.userAgent || ''
    const ios = /iphone|ipad|ipod/i.test(ua) && !(window as any).MSStream
    setIsIos(ios)

    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true

    setIsInstalled(standalone)
    setShowButton(!standalone)

    const onBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      deferredPromptRef.current = e as BeforeInstallPromptEvent
      setCanInstall(true)
      setShowButton(true)
    }

    const onAppInstalled = () => {
      deferredPromptRef.current = null
      setCanInstall(false)
      setIsInstalled(true)
      setShowButton(false)
    }

    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt)
    window.addEventListener('appinstalled', onAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt)
      window.removeEventListener('appinstalled', onAppInstalled)
    }
  }, [])

  const getPwaDebug = async () => {
    if (typeof window === 'undefined') {
      return {
        userAgent: '',
        isIOS: false,
        isStandalone: false,
        hasDeferredPrompt: false,
        hasServiceWorkerRegistration: false,
        manifestLinkFound: false,
        origin: '',
        isHttps: false,
      }
    }

    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true
    const manifestLinkFound = !!document.querySelector('link[rel="manifest"]')
    const regs = await window.navigator.serviceWorker?.getRegistrations?.()

    return {
      userAgent: window.navigator.userAgent || '',
      isIOS: isIos,
      isStandalone,
      hasDeferredPrompt: !!deferredPromptRef.current,
      hasServiceWorkerRegistration: !!(regs && regs.length),
      manifestLinkFound,
      origin: window.location.origin,
      isHttps: window.location.protocol === 'https:' || window.location.hostname === 'localhost',
    }
  }

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

    if (deferredPromptRef.current) {
      const promptEvent = deferredPromptRef.current
      await promptEvent.prompt()
      const choice = await promptEvent.userChoice
      if (shouldLog) {
        console.log('[PWA Install Choice]', choice?.outcome)
      }
      deferredPromptRef.current = null
      setCanInstall(false)
      return
    }

    Alert.alert(
      'Instalação indisponível agora',
      'Para instalar, use o Chrome e confirme que o app tem manifest válido e service worker ativo. Se acabou de fazer deploy, pode ser cache: feche e reabra o navegador.',
      [{ text: 'OK', style: 'default' }]
    )
  }

  if (!showButton || isInstalled) {
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
