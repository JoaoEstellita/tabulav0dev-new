import React, { useEffect, useState, useCallback } from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View, Platform } from 'react-native'
import { useNavigation, useIsFocused } from '@react-navigation/native'
import { getAstrologerUnread } from '../services/AstrologerChatService'

/**
 * Botão flutuante que abre o Astrólogo (chat no app). Fica sobre as abas
 * principais. Um badge com NÚMERO mostra quantas proativas (matinal, picos,
 * match, avaliação…) estão não-lidas; some ao ler.
 *
 * ⚠️ O ROSTO É O MESMO do chat (`assets/astrologer-avatar.png`), de propósito.
 * O botão trazia um ✦ dourado, que não dizia o que havia do outro lado — podia
 * ser qualquer coisa "mágica" do app. Com o rosto, o botão e a tela que ele
 * abre passam a ser visivelmente a mesma pessoa, e o toque deixa de ser uma
 * aposta.
 *
 * ⚠️ NÃO PULSA MAIS. Havia um brilho dourado em laço infinito por baixo, para
 * chamar atenção. Chamava — o tempo todo, em cima de toda leitura da Home, sem
 * nada de novo para anunciar. Animação permanente não destaca nada: ela só
 * ensina o olho a ignorar aquele canto. Quem tem de chamar atenção é o badge
 * vermelho, e ele só aparece quando há mensagem esperando.
 */
export default function AstrologerFab() {
  const navigation = useNavigation<any>()
  const isFocused = useIsFocused()
  const [unread, setUnread] = useState(0)

  // Conta não-lidas ao montar e sempre que a Home volta ao foco (após ler, zera).
  useEffect(() => {
    if (!isFocused) return
    let alive = true
    getAstrologerUnread().then((n) => { if (alive) setUnread(n || 0) }).catch(() => {})
    return () => { alive = false }
  }, [isFocused])

  const open = useCallback(() => {
    setUnread(0)
    navigation.navigate('AstrologerChat')
  }, [navigation])

  return (
    <TouchableOpacity
      style={s.wrap}
      activeOpacity={0.85}
      onPress={open}
      accessibilityRole="button"
      accessibilityLabel="Falar com o astrólogo"
      accessibilityHint={unread > 0 ? `${unread} mensagem(ns) não lida(s)` : undefined}
    >
      <Image source={require('../../assets/astrologer-avatar.png')} style={s.foto} />
      {unread > 0 && (
        <View style={s.badge}><Text style={s.badgeTx}>{unread > 9 ? '9+' : String(unread)}</Text></View>
      )}
    </TouchableOpacity>
  )
}

const s = StyleSheet.create({
  wrap: {
    position: 'absolute',
    right: 18,
    bottom: Platform.OS === 'ios' ? 24 : 18, // logo acima da barra de abas (dentro da Home)
    width: 58, height: 58, borderRadius: 29,
    // ⚠️ O aro dourado FICA, mesmo sem o ✦: é ele que separa o botão do fundo
    // escuro e da roda natal, que também é redonda e cheia de símbolo. Sem o
    // aro, uma foto redonda no canto some no desenho.
    borderWidth: 2,
    borderColor: '#FFD700',
    backgroundColor: '#0F0F23',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#FFD700', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.45, shadowRadius: 12, elevation: 8,
    zIndex: 50,
  },
  // 54 dentro de um aro de 58 com borda 2: a foto encosta no aro sem passar por
  // baixo dele, que é o que deixa a borda irregular em tela de alta densidade.
  foto: { width: 54, height: 54, borderRadius: 27 },
  badge: { position: 'absolute', top: -2, right: -2, minWidth: 20, height: 20, borderRadius: 10, paddingHorizontal: 4, backgroundColor: '#FF4D6D', borderWidth: 2, borderColor: '#0F0F23', alignItems: 'center', justifyContent: 'center' },
  badgeTx: { color: '#FFFFFF', fontSize: 11, fontWeight: '900' },
})
