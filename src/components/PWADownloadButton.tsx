import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function PWADownloadButton() {
  const [showButton, setShowButton] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Verificar se está no navegador web
    if (typeof window !== 'undefined') {
      // Verificar se já está instalado
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      setIsInstalled(isStandalone);

      // Mostrar botão se não estiver instalado
      if (!isStandalone) {
        setShowButton(true);
      }

      // Escutar evento de instalação
      window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        setShowButton(true);
      });
    }
  }, []);

  const handleInstall = () => {
    if (typeof window !== 'undefined') {
      Alert.alert(
        '📱 Instalar App',
        'Para instalar o Tábula Estelar:\n\n1. Clique no ícone de instalação na barra de endereços\n2. Ou use o menu do navegador (⋮) > "Instalar app"\n\nIsso permitirá usar o app offline e como um app nativo!',
        [
          { text: 'Entendi', style: 'default' },
          { 
            text: 'Ver Tutorial', 
            onPress: () => {
              // Abrir tutorial ou landing page
              window.open('https://tabulaestelar.com.br', '_blank');
            }
          }
        ]
      );
    }
  };

  if (!showButton || isInstalled) {
    return null;
  }

  return (
    <TouchableOpacity style={styles.container} onPress={handleInstall}>
      <View style={styles.content}>
        <Ionicons name="download" size={20} color="#FFD700" />
        <Text style={styles.text}>🌟 Instalar App</Text>
        <Ionicons name="chevron-forward" size={16} color="#FFD700" />
      </View>
    </TouchableOpacity>
  );
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
});
