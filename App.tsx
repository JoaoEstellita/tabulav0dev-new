import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ErrorUtils, Platform } from 'react-native';
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
import ErrorReportingService from './src/services/firebase/ErrorReportingService';
import * as Sentry from '@sentry/react-native';

// Crash reporting NATIVO — captura o FATAL EXCEPTION no boot (o alvo do
// diagnóstico do crash em release na Play). Só ativa com DSN configurado
// (EXPO_PUBLIC_SENTRY_DSN) e fora da web; sem isso é inerte (não afeta o PWA).
Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  enabled: !!process.env.EXPO_PUBLIC_SENTRY_DSN && Platform.OS !== 'web',
  enableNativeCrashHandling: true,
  tracesSampleRate: 0,
});

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
  // Captura erros JS não tratados fora do React tree (async, native bridge)
  useEffect(() => {
    // ErrorUtils não existe em web — guard para compatibilidade PWA
    if (Platform.OS === 'web') return
    const previousHandler = ErrorUtils.getGlobalHandler()
    ErrorUtils.setGlobalHandler((error: Error, isFatal?: boolean) => {
      ErrorReportingService.logError(error, {
        action: isFatal ? 'fatal_js_error' : 'unhandled_js_error',
        source: 'global-handler',
      })
      previousHandler(error, isFatal)
    })
    return () => ErrorUtils.setGlobalHandler(previousHandler)
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
