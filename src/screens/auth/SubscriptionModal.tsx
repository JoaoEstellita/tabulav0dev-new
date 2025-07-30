import React from 'react';
import { Modal, View, Text, TouchableOpacity, Linking, StyleSheet } from 'react-native';

const SUBSCRIPTION_URL = 'https://www.mercadopago.com.br/subscriptions/checkout?preapproval_plan_id=2c93808497f5fad10197f707d574005d';

export default function SubscriptionModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Assinatura Necessária</Text>
          <Text style={styles.text}>
            Seu período de teste grátis terminou. Para continuar usando todos os recursos do app, faça sua assinatura.
          </Text>
          <TouchableOpacity style={styles.button} onPress={() => Linking.openURL(SUBSCRIPTION_URL)}>
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