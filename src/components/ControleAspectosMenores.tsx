import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'

/**
 * Liga e desliga os ASPECTOS MENORES (quincúncio, semiquadratura,
 * sesquiquadratura, semissextil).
 *
 * ⚠️ Mora DENTRO do card da grade, logo abaixo da legenda. Antes era uma linha
 * solta entre o filtro de planetas e as interpretações: lia como um ajuste
 * global do app, não como um controle daquela grade, e ficava longe de metade
 * do que governa. Colado na legenda, a relação é óbvia — a legenda mostra os
 * símbolos que estão na grade, e isto decide quantos símbolos existem.
 *
 * O número é parte do controle, não enfeite: sem ele "Aspectos menores" é um
 * interruptor sem etiqueta, e não dá para saber se ligar acrescenta 2 símbolos
 * ou 20.
 *
 * O estado vem do hook `useAspectosMenores`, compartilhado em memória — então
 * este mesmo controle aparece na Home e no Mapa e os dois andam juntos, sem
 * precisar passar nada entre as telas.
 */
export default function ControleAspectosMenores({
  mostrar,
  alternar,
  quantos,
  language,
}: {
  mostrar: boolean
  alternar: () => void
  quantos: number
  language?: string | null
}) {
  // Sem nenhum menor no mapa não há o que ligar — o controle seria um botão
  // que não muda nada, que é pior que botão nenhum.
  if (!quantos) return null

  const l = String(language || 'pt-BR')
  const tl = (pt: string, en: string, es: string, it: string) =>
    l.startsWith('en') ? en : l.startsWith('es') ? es : l.startsWith('it') ? it : pt

  return (
    <TouchableOpacity
      onPress={alternar}
      style={s.linha}
      accessibilityRole="switch"
      accessibilityState={{ checked: mostrar }}
      accessibilityLabel={tl(
        'Mostrar aspectos menores', 'Show minor aspects',
        'Mostrar aspectos menores', 'Mostra aspetti minori',
      )}
      hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
    >
      <View style={[s.caixa, mostrar ? s.caixaAtiva : null]}>
        {mostrar ? <Text style={s.marca}>✓</Text> : null}
      </View>
      <Text style={s.texto}>
        {tl('Aspectos menores', 'Minor aspects', 'Aspectos menores', 'Aspetti minori')}
        <Text style={s.conta}>{`  ${quantos}`}</Text>
      </Text>
      <Text style={s.dica}>
        {mostrar
          ? tl('tocar para ocultar', 'tap to hide', 'tocar para ocultar', 'tocca per nascondere')
          : tl('tocar para mostrar', 'tap to show', 'tocar para mostrar', 'tocca per mostrare')}
      </Text>
    </TouchableOpacity>
  )
}

const s = StyleSheet.create({
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    paddingVertical: 10,
    paddingHorizontal: 4,
    marginTop: 2,
    // Separa da legenda sem virar outro bloco: é o rodapé do mesmo card.
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#252b38',
  },
  caixa: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#3a4256',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  caixaAtiva: {
    borderColor: '#FFD700',
    backgroundColor: 'rgba(255, 215, 0, 0.14)',
  },
  marca: { fontSize: 12, lineHeight: 14, color: '#FFD700', fontWeight: '700' },
  texto: { flex: 1, fontSize: 13, color: '#8892a4' },
  conta: { color: '#5c6477' },
  dica: { fontSize: 11, color: '#5c6477' },
})
