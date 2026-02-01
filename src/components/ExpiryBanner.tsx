import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

type Props = {
  message: string
  variant?: 'info' | 'warn'
  onPress?: () => void
}

export default function ExpiryBanner({ message, variant = 'info', onPress }: Props) {
  if (!message) return null
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={styles.wrapper}>
      <View style={[styles.container, variant === 'warn' && styles.containerWarn]}>
        <Ionicons name="time-outline" size={14} color={variant === 'warn' ? '#FFD166' : '#B8C1FF'} />
        <Text style={styles.text}>{message}</Text>
        <Ionicons name="chevron-forward" size={14} color="#8A8AA8" />
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 16,
    marginBottom: 10,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(99, 102, 241, 0.12)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.35)',
  },
  containerWarn: {
    backgroundColor: 'rgba(255, 209, 102, 0.12)',
    borderColor: 'rgba(255, 209, 102, 0.4)',
  },
  text: {
    flex: 1,
    color: '#E5E7FF',
    fontSize: 12,
    fontWeight: '600',
  },
})
