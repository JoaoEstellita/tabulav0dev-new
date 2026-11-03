import React from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import type { IdiomaEstudo, Unidade } from '../../data/estudo'

/**
 * O card de uma unidade — serve a TRILHA e a BIBLIOTECA.
 *
 * ⚠️ UM COMPONENTE SÓ para os dois usos, de propósito. Duas cópias
 * divergiriam no primeiro ajuste de espaçamento, e a tela mostraria dois
 * cartões com cara diferente para a mesma coisa.
 */
export default function CardDaUnidade({
  unidade, idioma, lido, recomendado, aoAbrir, rotuloMinutos,
}: {
  unidade: Unidade
  idioma: IdiomaEstudo
  lido: boolean
  /** Marca a próxima lição da trilha. A biblioteca nunca recomenda. */
  recomendado?: boolean
  aoAbrir: (id: string) => void
  /** "min" traduzido — o card não decide idioma sozinho. */
  rotuloMinutos: string
}) {
  return (
    <Pressable
      onPress={() => aoAbrir(unidade.id)}
      accessibilityRole="button"
      accessibilityLabel={`${unidade.titulo[idioma]}. ${unidade.resumo[idioma]}`}
      style={({ pressed }) => [
        s.card,
        recomendado && s.cardRecomendado,
        pressed && { opacity: 0.7 },
      ]}
    >
      <View style={s.topo}>
        <Text style={[s.titulo, lido && s.tituloLido]} numberOfLines={2}>
          {unidade.titulo[idioma]}
        </Text>
        {/* ⚠️ A MARCA DE LIDO É DISCRETA. Ela informa; não premia nem cobra —
            esta área não é um jogo de completar. */}
        {lido ? <Ionicons name="checkmark-circle" size={17} color="#4ECDC4" /> : null}
      </View>

      <Text style={s.resumo} numberOfLines={2}>{unidade.resumo[idioma]}</Text>

      <Text style={s.minutos}>{`${unidade.minutos} ${rotuloMinutos}`}</Text>
    </Pressable>
  )
}

const s = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  // A recomendação é uma borda, não um bloqueio: a trilha sugere a próxima e
  // deixa a pessoa ir para onde quiser.
  cardRecomendado: { borderColor: 'rgba(255,215,0,0.45)', backgroundColor: 'rgba(255,215,0,0.07)' },
  topo: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  titulo: { flex: 1, color: '#F2F5FA', fontSize: 15, fontWeight: '700', lineHeight: 21 },
  tituloLido: { color: '#B8C0D4' },
  resumo: { color: '#9AA3BA', fontSize: 13, lineHeight: 19, marginTop: 5 },
  minutos: { color: '#6B7490', fontSize: 11, marginTop: 8 },
})
