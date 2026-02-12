import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAppLanguage } from '../../hooks/useAppLanguage';

interface SubscriptionModalProps {
  visible: boolean;
  onClose: () => void;
  onSubscribe?: () => void;
}

export default function SubscriptionModal({ visible, onClose, onSubscribe }: SubscriptionModalProps) {
  useAppLanguage();
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Assinatura Necessária</Text>
          <Text style={styles.text}>
            Seu período de teste grátis terminou. Para continuar usando todos os recursos do app, faça sua assinatura.
          </Text>
          <TouchableOpacity style={styles.button} onPress={onSubscribe || onClose}>
            <Text style={styles.buttonText}>Assinar agora</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    width: 320,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  text: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#009ee3',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginBottom: 12,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    color: '#009ee3',
    fontSize: 14,
  },
});
