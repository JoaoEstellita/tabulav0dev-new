import React from 'react'
import { TouchableOpacity, StyleSheet, Platform } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

/**
 * Botão flutuante "subir ao topo".
 *
 * Só aparece depois que o usuário desce — no topo ele seria puro ruído cobrindo
 * conteúdo. Quem usa controla a visibilidade a partir do onScroll da própria
 * ScrollView (ver SCROLL_TOP_THRESHOLD), porque o botão não tem acesso a ela.
 */

/** A partir de quantos px de rolagem o botão aparece. */
export const SCROLL_TOP_THRESHOLD = 400

type Props = {
  visible: boolean
  onPress: () => void
  /** Distância do rodapé — sobe um pouco quando há barra de abas. */
  bottom?: number
}

export default function ScrollTopButton({ visible, onPress, bottom = 24 }: Props) {
  if (!visible) return null
  return (
    <TouchableOpacity
      style={[styles.fab, { bottom }]}
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel="Subir ao topo"
    >
      <Ionicons name="arrow-up" size={22} color="#0F0F23" />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 18,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFD700',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
    ...Platform.select({
      web: { boxShadow: '0 2px 10px rgba(0,0,0,0.35)' } as any,
      default: {
        shadowColor: '#000',
        shadowOpacity: 0.35,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 6,
      },
    }),
  },
})
