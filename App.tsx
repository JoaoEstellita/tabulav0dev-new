import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider } from './src/hooks/useAuth';
import AppNavigator from './src/navigation/AppNavigator';
import { AstrologyDataProvider } from './src/context/AstrologyDataProvider';
import { NotificationProvider } from './src/context/NotificationStore';
import SubscriptionModal from './src/screens/auth/SubscriptionModal';
import { useSubscriptionCheck } from './src/hooks/useSubscriptionCheck';
import { useEffect } from 'react';
import { registerAndroidDeviceToken } from './src/services/notifications/registerDeviceToken';
import { useAuth } from './src/hooks/useAuth';
import ErrorBoundary from './src/components/ErrorBoundary';
import { ensureStatusPolicyLoaded } from './src/services/status/StatusPolicyService';
import { initMetaPixel } from './src/services/metaPixel';
import ErrorReportingService from './src/services/firebase/ErrorReportingService';
import * as Sentry from '@sentry/react-native';

// Sentry.init agora vive em `src/instrument.ts`, importado na PRIMEIRA linha do
// index.ts — arma o handler antes da avaliação dos módulos deste arquivo, para
// capturar crashes de boot. Aqui só usamos `Sentry.wrap` (init já rodou).

function AppContent() {
  const { showModal, setShowModal, loading } = useSubscriptionCheck();
  const { user } = useAuth();

  useEffect(() => {
    if (user?.uid) {
      registerAndroidDeviceToken(user.uid).catch(() => {})
    }
  }, [user?.uid])

  useEffect(() => {
    ensureStatusPolicyLoaded().catch(() => {})
    initMetaPixel() // Meta Pixel (web/PWA, se EXPO_PUBLIC_META_PIXEL_ID setado)
  }, [])

  if (loading) return null; // Pode exibir um splash ou loader

  return (
    <ErrorBoundary>
      <AppNavigator />
      <SubscriptionModal visible={showModal} onClose={() => setShowModal(false)} />
      <StatusBar style="light" />
    </ErrorBoundary>
  );
}

function App() {
  // Captura erros JS não tratados fora do React tree (async, native bridge).
  useEffect(() => {
    if (Platform.OS === 'web') return
    // ErrorUtils é um GLOBAL do RN — NÃO um export de 'react-native'. Na New
    // Architecture (RN 0.79) `import { ErrorUtils } from 'react-native'` vinha
    // `undefined`, e `undefined.getGlobalHandler()` derrubava o app no boot
    // (crash da Play: "Cannot read property 'getGlobalHandler' of undefined").
    // Acessa o global com guard — some de vez o crash de lançamento.
    const EU: any = (globalThis as any).ErrorUtils
    if (!EU || typeof EU.getGlobalHandler !== 'function') return
    const previousHandler = EU.getGlobalHandler()
    EU.setGlobalHandler((error: Error, isFatal?: boolean) => {
      ErrorReportingService.logError(error, {
        action: isFatal ? 'fatal_js_error' : 'unhandled_js_error',
        source: 'global-handler',
      })
      if (typeof previousHandler === 'function') previousHandler(error, isFatal)
    })
    return () => EU.setGlobalHandler(previousHandler)
  }, [])

  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AuthProvider>
          <AstrologyDataProvider>
            <NotificationProvider>
              <AppContent />
            </NotificationProvider>
          </AstrologyDataProvider>
        </AuthProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}

export default Sentry.wrap(App);
