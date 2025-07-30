import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import SubscriptionModal from './src/screens/auth/SubscriptionModal';
import { useSubscriptionCheck } from './src/hooks/useSubscriptionCheck';

export default function App() {
  const { showModal, setShowModal, loading } = useSubscriptionCheck();

  if (loading) return null; // Pode exibir um splash ou loader

  return (
    <NavigationContainer>
      <AppNavigator />
      <SubscriptionModal visible={showModal} onClose={() => setShowModal(false)} />
      <StatusBar style="light" />
    </NavigationContainer>
  );
}
