import React, { useEffect, useRef, useState, useCallback } from 'react'
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView,
  Platform, ActivityIndicator, Animated, Easing,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { useAuth } from '../../hooks/useAuth'
import { sendToAstrologer } from '../../services/AstrologerChatService'

/**
 * Astrólogo no app — chat com o mesmo agente do WhatsApp (via /api/app-chat).
 * Fase 1: texto + atalhos + digitando. Cards ricos inline = fase 2.
 */
const C = {
  bg: '#0F0F23', card: '#1C1C2E', cardBorder: 'rgba(255,255,255,0.08)',
  gold: '#FFD700', goldSoft: '#E9C46A', tx: '#EDEBF7', dim: '#9AA0C0', ink: '#241A05',
  head: '#12122A',
}

type Msg = { id: string; role: 'user' | 'assistant'; text: string }
let _seq = 0
const nid = () => `${Date.now()}_${_seq++}`

// Renderiza *negrito* + quebras de linha (o agente usa markdown leve do WhatsApp).
function RichText({ text, color }: { text: string; color: string }) {
  const parts = String(text || '').split(/(\*[^*]+\*)/g)
  return (
    <Text style={{ color, fontSize: 15, lineHeight: 21 }}>
      {parts.map((p, i) =>
        p.startsWith('*') && p.endsWith('*') && p.length > 2
          ? <Text key={i} style={{ fontWeight: '800' }}>{p.slice(1, -1)}</Text>
          : <Text key={i}>{p}</Text>,
      )}
    </Text>
  )
}

function TypingDots() {
  const a = useRef(new Animated.Value(0)).current
  useEffect(() => {
    const loop = Animated.loop(Animated.sequence([
      Animated.timing(a, { toValue: 1, duration: 600, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      Animated.timing(a, { toValue: 0, duration: 600, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
    ]))
    loop.start()
    return () => loop.stop()
  }, [a])
  const dot = (delay: number) => ({
    opacity: a.interpolate({ inputRange: [0, 1], outputRange: [0.3, 1] }),
    transform: [{ translateY: a.interpolate({ inputRange: [0, 1], outputRange: [0, -3] }) }],
  })
  return (
    <View style={{ flexDirection: 'row', gap: 5, paddingVertical: 4, paddingHorizontal: 2 }}>
      {[0, 1, 2].map((i) => <Animated.View key={i} style={[s.dot, dot(i * 150)]} />)}
    </View>
  )
}

export default function AstrologerChatScreen() {
  const navigation = useNavigation<any>()
  const { user } = useAuth()
  const firstName = ((user as any)?.displayName || (user as any)?.name || '').split(' ')[0] || ''
  const greeting = `Oi${firstName ? ', ' + firstName : ''}! Sou seu astrólogo aqui no Tábula ✦\n\nMe pergunte o que quiser do seu céu, ou toque num atalho:`
  const [messages, setMessages] = useState<Msg[]>([{ id: nid(), role: 'assistant', text: greeting }])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [chips, setChips] = useState<string[]>(['Como está o meu dia', 'Meu melhor dia pro amor', 'Como estão meus grupos'])
  const listRef = useRef<FlatList<Msg>>(null)

  const scrollDown = useCallback(() => { requestAnimationFrame(() => listRef.current?.scrollToOffset({ offset: 0, animated: true })) }, [])

  const send = useCallback(async (raw: string) => {
    const text = String(raw || '').trim()
    if (!text || sending) return
    setInput('')
    setChips([])
    setMessages((m) => [{ id: nid(), role: 'user', text }, ...m])
    scrollDown()
    setSending(true)
    const r = await sendToAstrologer(text)
    setSending(false)
    setMessages((m) => [{ id: nid(), role: 'assistant', text: r.reply || '🌙' }, ...m])
    if (r.quickReplies && r.quickReplies.length) setChips(r.quickReplies.slice(0, 3))
    scrollDown()
  }, [sending, scrollDown])

  // FlatList invertida: dados mais novos primeiro; render normal fica na ordem certa.
  const data = sending ? ([{ id: '__typing__', role: 'assistant', text: '' } as Msg, ...messages]) : messages

  return (
    <SafeAreaView style={s.screen} edges={['top', 'bottom']}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons name="chevron-back" size={26} color={C.tx} />
        </TouchableOpacity>
        <View style={s.avatar}><Text style={{ fontSize: 18 }}>✦</Text></View>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text style={s.hName}>Astrólogo</Text>
          <Text style={s.hStatus}>online</Text>
        </View>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}>
        <FlatList
          ref={listRef}
          data={data}
          inverted
          keyExtractor={(m) => m.id}
          contentContainerStyle={{ padding: 14, gap: 10, paddingBottom: 8 }}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => {
            if (item.id === '__typing__') {
              return <View style={[s.row, { justifyContent: 'flex-start' }]}><View style={[s.bubble, s.bubbleA]}><TypingDots /></View></View>
            }
            const mine = item.role === 'user'
            return (
              <View style={[s.row, { justifyContent: mine ? 'flex-end' : 'flex-start' }]}>
                <View style={[s.bubble, mine ? s.bubbleU : s.bubbleA]}>
                  <RichText text={item.text} color={mine ? C.ink : C.tx} />
                </View>
              </View>
            )
          }}
        />

        {chips.length > 0 && (
          <View style={s.chips}>
            {chips.map((c, i) => (
              <TouchableOpacity key={i} style={s.chip} activeOpacity={0.85} onPress={() => send(c)} disabled={sending}>
                <Text style={s.chipTx} numberOfLines={1}>{c}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={s.inputBar}>
          <TextInput
            style={s.input}
            value={input}
            onChangeText={setInput}
            placeholder="Pergunte ao seu astrólogo…"
            placeholderTextColor={C.dim}
            multiline
            editable={!sending}
            onSubmitEditing={() => send(input)}
            returnKeyType="send"
          />
          <TouchableOpacity style={[s.sendBtn, (!input.trim() || sending) && { opacity: 0.5 }]} onPress={() => send(input)} disabled={!input.trim() || sending}>
            {sending ? <ActivityIndicator size="small" color={C.ink} /> : <Ionicons name="arrow-up" size={20} color={C.ink} />}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.bg },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14, paddingVertical: 10, backgroundColor: C.head, borderBottomWidth: 1, borderBottomColor: C.cardBorder },
  avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#0B0B1E', borderWidth: 1, borderColor: 'rgba(255,215,0,0.4)', alignItems: 'center', justifyContent: 'center' },
  hName: { color: C.tx, fontSize: 15.5, fontWeight: '800' },
  hStatus: { color: '#5BD6A0', fontSize: 11.5, fontWeight: '600' },
  row: { flexDirection: 'row', width: '100%' },
  bubble: { maxWidth: '84%', borderRadius: 16, paddingHorizontal: 13, paddingVertical: 9 },
  bubbleA: { backgroundColor: C.card, borderWidth: 1, borderColor: C.cardBorder, borderTopLeftRadius: 4 },
  bubbleU: { backgroundColor: C.goldSoft, borderTopRightRadius: 4 },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: C.dim },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: 14, paddingBottom: 8 },
  chip: { borderWidth: 1, borderColor: 'rgba(255,215,0,0.35)', backgroundColor: 'rgba(255,215,0,0.06)', borderRadius: 999, paddingVertical: 8, paddingHorizontal: 14 },
  chipTx: { color: C.goldSoft, fontSize: 13, fontWeight: '700' },
  inputBar: { flexDirection: 'row', alignItems: 'flex-end', gap: 10, paddingHorizontal: 12, paddingVertical: 10, borderTopWidth: 1, borderTopColor: C.cardBorder, backgroundColor: C.head },
  input: { flex: 1, color: C.tx, fontSize: 15, maxHeight: 120, paddingVertical: 8, paddingHorizontal: 6 },
  sendBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: C.gold, alignItems: 'center', justifyContent: 'center' },
})
