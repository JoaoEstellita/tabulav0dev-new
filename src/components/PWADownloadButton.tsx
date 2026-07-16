import React, { useEffect, useState } from 'react'
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

// PWA install utilities are web-only; lazy-load to avoid native crashes
const getPwaStateSafe = () => ({ canInstall: false, isInstalled: true, isIos: false, isMobile: false, deferredPrompt: null })

export default function PWADownloadButton() {
  // This component is exclusively for PWA web — skip entirely on native
  if (Platform.OS !== 'web') return null

  return <PWADownloadButtonInner />
}

function PWADownloadButtonInner() {
  const {
    getPwaState,
    subscribePwaInstall,
    promptInstall,
    getPwaDebug,
  } = require('../utils/pwaInstall')
  const { trackPwaInstallClick } = require('../services/analytics/PwaInstallTracker')

  const [pwaState, setPwaState] = useState(getPwaState())
  const [showButton, setShowButton] = useState(!getPwaState().isInstalled)
  const [showIosHelp, setShowIosHelp] = useState(false)
  const [showAndroidHelp, setShowAndroidHelp] = useState(false)

  useEffect(() => {
    const unsubscribe = subscribePwaInstall((next: any) => {
      setPwaState(next)
      setShowButton(!next.isInstalled)
      if (next.isInstalled) {
        setShowIosHelp(false)
        setShowAndroidHelp(false)
      }
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

    const ua = debugInfo.userAgent || ''
    const isAndroid = /android/i.test(ua)
    const isInstagram = /instagram/i.test(ua)

    await trackPwaInstallClick('install_button', {
      isStandalone: debugInfo.isStandalone,
      hasDeferredPrompt: debugInfo.hasDeferredPrompt,
      isIos: debugInfo.isIOS,
      isHttps: debugInfo.isHttps,
      origin: debugInfo.origin,
    })

    if (debugInfo.isIOS) {
      setShowIosHelp(true)
      return
    }

    if (isAndroid && isInstagram) {
      openInstallInBrowser()
      return
    }

    const choice = await promptInstall()
    if (choice) {
      if (shouldLog) {
        console.log('[PWA Install Choice]', choice?.outcome)
      }
      return
    }

    // Sem prompt disponível: mostra instruções. Antes usava Alert.alert, que é
    // no-op no react-native-web — o clique simplesmente não fazia nada.
    setShowAndroidHelp(true)
  }

  const openInstallInBrowser = () => {
    if (typeof window === 'undefined') return
    const base = window.location.origin
    const openUrl = `${base}/abrir?to=${encodeURIComponent(window.location.href)}`
    window.location.href = openUrl
  }

  // Só mostra o banner quando ele consegue fazer algo: prompt nativo disponível,
  // iOS (instruções do Safari) ou in-app browser do Instagram (abrir no Chrome).
  // Antes aparecia sempre em mobile e o clique virava um no-op.
  const ua = typeof window !== 'undefined' ? window.navigator.userAgent || '' : ''
  const isInstagram = /instagram/i.test(ua)
  const isActionable = pwaState.canInstall || pwaState.isIos || isInstagram

  if (!showButton || pwaState.isInstalled || !pwaState.isMobile || !isActionable) {
    return null
  }

  return (
    <>
      <TouchableOpacity style={styles.container} onPress={handleInstall}>
        <View style={styles.content}>
          <Ionicons name="download" size={20} color="#FFD700" />
          <Text style={styles.text}>Instalar App</Text>
          <Ionicons name="chevron-forward" size={16} color="#FFD700" />
        </View>
      </TouchableOpacity>

      {showIosHelp && pwaState.isIos && !pwaState.isInstalled && (
        <View style={styles.iosOverlay}>
          <View style={styles.iosCard}>
            <View style={styles.iosHeader}>
              <Ionicons name="logo-apple" size={20} color="#FFD700" />
              <Text style={styles.iosTitle}>Instalar no iPhone</Text>
              <TouchableOpacity onPress={() => setShowIosHelp(false)}>
                <Ionicons name="close" size={20} color="#8E8E93" />
              </TouchableOpacity>
            </View>
            <Text style={styles.iosText}>
              Use o Safari para instalar como app.
            </Text>
            <View style={styles.iosSteps}>
              <View style={styles.iosStep}>
                <Text style={styles.iosStepNumber}>1</Text>
                <Text style={styles.iosStepText}>Toque em Compartilhar</Text>
              </View>
              <View style={styles.iosStep}>
                <Text style={styles.iosStepNumber}>2</Text>
                <Text style={styles.iosStepText}>Escolha "Adicionar a Tela de Inicio"</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.iosButton} onPress={() => setShowIosHelp(false)}>
              <Text style={styles.iosButtonText}>Entendi</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {showAndroidHelp && !pwaState.isIos && !pwaState.isInstalled && (
        <View style={styles.androidOverlay}>
          <View style={styles.androidCard}>
            <View style={styles.androidHeader}>
              <Ionicons name="logo-android" size={20} color="#FFD700" />
              <Text style={styles.androidTitle}>Instalar no Android</Text>
              <TouchableOpacity onPress={() => setShowAndroidHelp(false)}>
                <Ionicons name="close" size={20} color="#8E8E93" />
              </TouchableOpacity>
            </View>
            <Text style={styles.androidText}>
              {isInstagram
                ? 'No Instagram, o instalador nao aparece. Abra no Chrome para instalar.'
                : 'Seu navegador nao ofereceu a instalacao agora. Da pra instalar pelo menu do Chrome.'}
            </Text>
            <View style={styles.androidSteps}>
              <View style={styles.androidStep}>
                <Text style={styles.androidStepNumber}>1</Text>
                <Text style={styles.androidStepText}>
                  {isInstagram ? 'Toque em ⋯ e escolha Abrir no navegador' : 'Toque no menu ⋮ do Chrome'}
                </Text>
              </View>
              <View style={styles.androidStep}>
                <Text style={styles.androidStepNumber}>2</Text>
                <Text style={styles.androidStepText}>
                  {isInstagram ? 'No Chrome, toque em Instalar app' : 'Escolha "Instalar app" ou "Adicionar a tela inicial"'}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.androidButton}
              onPress={isInstagram ? openInstallInBrowser : () => setShowAndroidHelp(false)}
            >
              <Text style={styles.androidButtonText}>{isInstagram ? 'Abrir no navegador' : 'Entendi'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </>
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
  iosOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    zIndex: 2000,
  },
  iosCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#1a1a2e',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FFD700',
    padding: 16,
  },
  iosHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  iosTitle: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    marginLeft: 8,
  },
  iosText: {
    color: '#D0D0D0',
    fontSize: 13,
    marginBottom: 12,
  },
  iosSteps: {
    gap: 8,
    marginBottom: 16,
  },
  iosStep: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iosStepNumber: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FFD700',
    color: '#0F0F23',
    textAlign: 'center',
    fontWeight: 'bold',
    lineHeight: 22,
  },
  iosStepText: {
    color: '#FFFFFF',
    fontSize: 14,
    flex: 1,
  },
  iosButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  iosButtonText: {
    color: '#0F0F23',
    fontWeight: 'bold',
    fontSize: 14,
  },
  androidOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    zIndex: 2000,
  },
  androidCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#1a1a2e',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FFD700',
    padding: 16,
  },
  androidHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  androidTitle: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    marginLeft: 8,
  },
  androidText: {
    color: '#D0D0D0',
    fontSize: 13,
    marginBottom: 12,
  },
  androidSteps: {
    gap: 8,
    marginBottom: 16,
  },
  androidStep: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  androidStepNumber: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FFD700',
    color: '#0F0F23',
    textAlign: 'center',
    fontWeight: 'bold',
    lineHeight: 22,
  },
  androidStepText: {
    color: '#FFFFFF',
    fontSize: 14,
    flex: 1,
  },
  androidButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  androidButtonText: {
    color: '#0F0F23',
    fontWeight: 'bold',
    fontSize: 14,
  },
})
