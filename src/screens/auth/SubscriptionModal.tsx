import React from 'react'
import { Modal, View, Text, TouchableOpacity, StyleSheet, PanResponder, Animated } from 'react-native'
import { useAppLanguage } from '../../hooks/useAppLanguage'

interface SubscriptionModalProps {
  visible: boolean
  onClose: () => void
  onSubscribe?: () => void
}

export default function SubscriptionModal({ visible, onClose, onSubscribe }: SubscriptionModalProps) {
  const { t } = useAppLanguage()
  const translateY = React.useRef(new Animated.Value(400)).current

  React.useEffect(() => {
    if (visible) {
      translateY.setValue(400)
      Animated.timing(translateY, { toValue: 0, duration: 280, useNativeDriver: true }).start()
    }
  }, [visible, translateY])

  const closeWithAnimation = React.useCallback(() => {
    Animated.timing(translateY, { toValue: 400, duration: 200, useNativeDriver: true }).start(() => {
      translateY.setValue(400)
      onClose()
    })
  }, [translateY, onClose])

  const panResponder = React.useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, { dy, dx }) => dy > 10 && Math.abs(dy) > Math.abs(dx),
        onPanResponderMove: (_, { dy }) => {
          if (dy > 0) translateY.setValue(dy)
        },
        onPanResponderRelease: (_, { dy, vy }) => {
          if (dy > 80 || vy > 1) {
            Animated.timing(translateY, { toValue: 400, duration: 200, useNativeDriver: true }).start(() => {
              translateY.setValue(0)
              onClose()
            })
          } else {
            Animated.spring(translateY, { toValue: 0, useNativeDriver: true }).start()
          }
        },
        onPanResponderTerminate: () => {
          Animated.spring(translateY, { toValue: 0, useNativeDriver: true }).start()
        },
      }),
    [onClose, translateY]
  )

  return (
    <Modal visible={visible} transparent animationType="none">
      <View style={styles.overlay}>
        <Animated.View
          style={[styles.container, { transform: [{ translateY }] }]}
          {...panResponder.panHandlers}
        >
          <Text style={styles.title}>{t('subscription.modal.title')}</Text>
          <Text style={styles.text}>{t('subscription.modal.body')}</Text>
          <TouchableOpacity style={styles.button} onPress={onSubscribe || closeWithAnimation}>
            <Text style={styles.buttonText}>{t('subscription.modal.subscribe')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeButton} onPress={closeWithAnimation}>
            <Text style={styles.closeButtonText}>{t('common.close')}</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  )
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
    width: '85%',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#222',
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    color: '#333',
    marginBottom: 24,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#FFD700',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginBottom: 12,
  },
  buttonText: {
    color: '#222',
    fontWeight: 'bold',
    fontSize: 16,
  },
  closeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  closeButtonText: {
    color: '#666',
    fontSize: 15,
  },
})
