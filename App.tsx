import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { AuthProvider } from './src/hooks/useAuth';
import AppNavigator from './src/navigation/AppNavigator';
import SubscriptionModal from './src/screens/auth/SubscriptionModal';
import { useSubscriptionCheck } from './src/hooks/useSubscriptionCheck';
import { useEffect } from 'react';
import { registerAndroidDeviceToken } from './src/services/notifications/registerDeviceToken';
import { useAuth } from './src/hooks/useAuth';
import ErrorBoundary from './src/components/ErrorBoundary';

function AppContent() {
  const { showModal, setShowModal, loading } = useSubscriptionCheck();
  const { user } = useAuth();

  useEffect(() => {
    if (user?.uid) {
      registerAndroidDeviceToken(user.uid).catch(() => {})
    }
  }, [user?.uid])

  if (loading) return null; // Pode exibir um splash ou loader

  return (
    <ErrorBoundary>
      <AppNavigator />
      <SubscriptionModal visible={showModal} onClose={() => setShowModal(false)} />
      <StatusBar style="light" />
    </ErrorBoundary>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ErrorBoundary>
  );
}
