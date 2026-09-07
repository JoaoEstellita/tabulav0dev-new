import React, { useEffect, useRef, useState, useCallback } from 'react'
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView,
  Platform, ActivityIndicator, Animated, Easing, Image, ScrollView,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useAuth } from '../../hooks/useAuth'
import { sendToAstrologer, type ChatCard, type ChatQuota } from '../../services/AstrologerChatService'
import { NatalChartWheelContent } from '../cosmos/NatalChartWheelScreen'

/**
 * Astrólogo no app — chat com o mesmo agente do WhatsApp (via /api/app-chat).
 * Fase 1: texto + atalhos + digitando. Cards ricos inline = fase 2.
 */
const C = {
  bg: '#0F0F23', card: '#1C1C2E', cardBorder: 'rgba(255,255,255,0.08)',
  gold: '#FFD700', goldSoft: '#E9C46A', tx: '#EDEBF7', dim: '#9AA0C0', ink: '#241A05',
  head: '#12122A',
}

const AVATAR = require('../../../assets/astrologer-avatar.png')

// Perguntas prévias — mostram TUDO que a IA responde. Preenchem a tela vazia.
const SUGGESTIONS: { cat: string; qs: string[] }[] = [
  { cat: 'Seu dia', qs: ['Como está o meu dia?', 'O que pesa mais hoje?', 'Onde tá minha melhor energia agora?'] },
  { cat: 'Amor & relações', qs: ['Qual meu melhor dia pro amor?', 'Como tá meu coração hoje?', 'Com quem eu mais combino?'] },
  { cat: 'Carreira & decisões', qs: ['Como está minha carreira?', 'Qual o melhor dia pra decidir algo?', 'É bom momento pra começar um projeto?'] },
  { cat: 'Seu mapa', qs: ['Me mostra meu mapa natal', 'Qual é o meu propósito de vida?', 'O que minha Lua diz de mim?', 'Como sou nos 4 sistemas (védico, maia, chinês)?'] },
  { cat: 'O céu agora', qs: ['O que Marte está mexendo em mim?', 'Tem algum trânsito forte no meu céu?', 'O que vem pela frente pra mim?', 'Estou numa fase difícil, por quê?'] },
  { cat: 'Lugares, grupos & ciclos', qs: ['Onde no mundo o céu me favorece?', 'Como estão meus grupos?', 'Como está meu ano (retorno solar)?'] },
]

type Msg = { id: string; role: 'user' | 'assistant'; text: string; cards?: ChatCard[]; paywall?: boolean }
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

// Revela o texto progressivamente (sensação de digitação ao vivo, sem SSE).
function TypewriterText({ text, color, onTick, onDone }: { text: string; color: string; onTick?: () => void; onDone?: () => void }) {
  const [n, setN] = useState(0)
  useEffect(() => {
    setN(0)
    if (!text) { onDone?.(); return }
    const step = Math.max(2, Math.round(text.length / 90)) // ~90 quadros
    const id = setInterval(() => {
      setN((x) => {
        const nx = x + step
        if (nx >= text.length) { clearInterval(id); onDone?.(); return text.length }
        onTick?.()
        return nx
      })
    }, 22)
    return () => clearInterval(id)
  }, [text]) // eslint-disable-line react-hooks/exhaustive-deps
  return <RichText text={text.slice(0, n)} color={color} />
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

// Fase 2: card rico embaixo do balão do astrólogo — roda natal NATIVA inline (o
// componente busca o mapa do usuário logado sozinho) ou atalho tappável.
function CardBlock({ card }: { card: ChatCard }) {
  const navigation = useNavigation<any>()
  if (card.type === 'natal_wheel') {
    return (
      <View style={s.wheelCard}>
        <Text style={s.cardTitle}>✦ Seu mapa natal</Text>
        <NatalChartWheelContent transitData={null} loading={false} showLegend={false} />
      </View>
    )
  }
  const go = () => {
    if (card.action === 'momento') navigation.navigate('Tabs', { screen: 'Forecast', params: { momentoIntention: 'amor' } })
    else if (card.action === 'forecast') navigation.navigate('Tabs', { screen: 'Forecast' })
    else if (card.action === 'groups') navigation.navigate('Tabs', { screen: 'Groups' })
  }
  return (
    <TouchableOpacity style={s.actionCard} onPress={go} activeOpacity={0.85}>
      <Text style={s.actionLabel}>{card.label}</Text>
      <Ionicons name="chevron-forward" size={18} color={C.gold} />
    </TouchableOpacity>
  )
}

// Paywall bonito inline (não muro): aparece quando a resposta é de não-assinante.
function PaywallCard() {
  const navigation = useNavigation<any>()
  return (
    <TouchableOpacity style={s.paywallCard} activeOpacity={0.9} onPress={() => navigation.navigate('Premium', { openTab: 'features' })}>
      <Text style={s.paywallTitle}>✦ Destrave o astrólogo completo</Text>
      <Text style={s.paywallSub}>Leituras à vontade, sinastria, previsões e seus grupos. A partir de R$ 19,90/mês.</Text>
      <View style={s.paywallCta}><Text style={s.paywallCtaTx}>Ver planos</Text><Ionicons name="arrow-forward" size={14} color="#241A05" /></View>
    </TouchableOpacity>
  )
}

// Tela inicial (chat vazio): herói + MUITAS perguntas prévias por categoria.
function EmptyState({ onPick }: { onPick: (q: string) => void }) {
  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 18, paddingBottom: 10 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
      <View style={{ alignItems: 'center', marginTop: 6, marginBottom: 18 }}>
        <Image source={AVATAR} style={s.hero} />
        <Text style={s.heroName}>Seu astrólogo ✦</Text>
        <Text style={s.heroSub}>Pergunte o que quiser do seu céu, ou comece por um destes:</Text>
      </View>
      {SUGGESTIONS.map((g) => (
        <View key={g.cat} style={{ marginBottom: 15 }}>
          <Text style={s.catTitle}>{g.cat}</Text>
          <View style={s.catChips}>
            {g.qs.map((q) => (
              <TouchableOpacity key={q} style={s.sugChip} activeOpacity={0.85} onPress={() => onPick(q)}>
                <Text style={s.sugChipTx}>{q}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}
    </ScrollView>
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
  const [streamingId, setStreamingId] = useState<string | null>(null)
  const [quota, setQuota] = useState<ChatQuota | null>(null)
  const [chips, setChips] = useState<string[]>(['Como está o meu dia', 'Meu melhor dia pro amor', 'Como estão meus grupos'])
  const listRef = useRef<FlatList<Msg>>(null)
  const storeKey = `astrologer_chat_${(user as any)?.uid || 'anon'}`
  const loaded = useRef(false)

  // Continuidade: carrega o histórico salvo ao abrir; salva a cada mudança (últimas 40).
  useEffect(() => {
    AsyncStorage.getItem(storeKey).then((raw) => {
      if (raw) { try { const arr = JSON.parse(raw); if (Array.isArray(arr) && arr.length) setMessages(arr) } catch {} }
      loaded.current = true
    }).catch(() => { loaded.current = true })
  }, [storeKey])
  useEffect(() => {
    if (!loaded.current) return
    AsyncStorage.setItem(storeKey, JSON.stringify(messages.slice(0, 40))).catch(() => {})
  }, [messages, storeKey])

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
    setQuota(r.quota || null)
    const aid = nid()
    setMessages((m) => [{ id: aid, role: 'assistant', text: r.reply || '🌙', cards: r.cards, paywall: r.status === 'not_premium' }, ...m])
    setStreamingId(aid)
    if (r.quickReplies && r.quickReplies.length) setChips(r.quickReplies.slice(0, 3))
    scrollDown()
  }, [sending, scrollDown])

  // FlatList invertida: dados mais novos primeiro; render normal fica na ordem certa.
  const data = sending ? ([{ id: '__typing__', role: 'assistant', text: '' } as Msg, ...messages]) : messages
  const fresh = messages.length <= 1 // só a saudação → mostra a tela de perguntas prévias

  return (
    <SafeAreaView style={s.screen} edges={['top', 'bottom']}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons name="chevron-back" size={26} color={C.tx} />
        </TouchableOpacity>
        <Image source={AVATAR} style={s.avatarImg} />
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text style={s.hName}>Astrólogo</Text>
          <Text style={s.hStatus}>online</Text>
        </View>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}>
        {fresh ? <EmptyState onPick={send} /> : (
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
              <View style={{ gap: 8 }}>
                <View style={[s.row, { justifyContent: mine ? 'flex-end' : 'flex-start' }]}>
                  <View style={[s.bubble, mine ? s.bubbleU : s.bubbleA]}>
                    {!mine && item.id === streamingId
                      ? <TypewriterText text={item.text} color={C.tx} onTick={scrollDown} onDone={() => setStreamingId(null)} />
                      : <RichText text={item.text} color={mine ? C.ink : C.tx} />}
                  </View>
                </View>
                {!mine && item.id !== streamingId && item.cards?.map((c, i) => <CardBlock key={i} card={c} />)}
                {!mine && item.id !== streamingId && item.paywall && <PaywallCard />}
              </View>
            )
          }}
        />
        )}

        {!fresh && quota && typeof quota.dailyRemaining === 'number' && (
          <View style={s.saldoWrap}>
            <Text style={s.saldoTx}>{quota.dailyRemaining > 0 ? `🌙 ${quota.dailyRemaining} conversa${quota.dailyRemaining === 1 ? '' : 's'} hoje` : '🌙 Seu saldo volta amanhã'}</Text>
          </View>
        )}

        {!fresh && chips.length > 0 && (
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
  avatarImg: { width: 38, height: 38, borderRadius: 19, borderWidth: 1, borderColor: 'rgba(255,215,0,0.5)' },
  hero: { width: 104, height: 104, borderRadius: 52, borderWidth: 2, borderColor: 'rgba(255,215,0,0.6)' },
  heroName: { color: C.tx, fontSize: 18, fontWeight: '900', marginTop: 12 },
  heroSub: { color: C.dim, fontSize: 13.5, textAlign: 'center', marginTop: 6, lineHeight: 19, maxWidth: 300 },
  catTitle: { color: C.goldSoft, fontSize: 12, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8, marginLeft: 2 },
  catChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  sugChip: { backgroundColor: C.card, borderWidth: 1, borderColor: C.cardBorder, borderRadius: 14, paddingVertical: 9, paddingHorizontal: 13 },
  sugChipTx: { color: C.tx, fontSize: 13.5, fontWeight: '600' },
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
  wheelCard: { alignSelf: 'stretch', backgroundColor: C.card, borderWidth: 1, borderColor: C.cardBorder, borderRadius: 16, padding: 10, marginRight: 8 },
  cardTitle: { color: C.goldSoft, fontSize: 13, fontWeight: '800', marginBottom: 6, marginLeft: 4 },
  actionCard: { alignSelf: 'flex-start', maxWidth: '84%', flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.card, borderWidth: 1, borderColor: 'rgba(255,215,0,0.35)', borderRadius: 14, paddingVertical: 12, paddingHorizontal: 16 },
  actionLabel: { color: C.tx, fontSize: 14, fontWeight: '700' },
  paywallCard: { alignSelf: 'stretch', backgroundColor: C.card, borderWidth: 1, borderColor: 'rgba(255,215,0,0.4)', borderRadius: 16, padding: 16, marginRight: 8 },
  paywallTitle: { color: C.gold, fontSize: 15, fontWeight: '900' },
  paywallSub: { color: C.dim, fontSize: 13, lineHeight: 18, marginTop: 6 },
  paywallCta: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: C.gold, borderRadius: 999, paddingVertical: 9, paddingHorizontal: 18, marginTop: 12 },
  paywallCtaTx: { color: C.ink, fontSize: 13.5, fontWeight: '800' },
  saldoWrap: { alignItems: 'center', paddingBottom: 6 },
  saldoTx: { color: C.dim, fontSize: 11.5, fontWeight: '600' },
  inputBar: { flexDirection: 'row', alignItems: 'flex-end', gap: 10, paddingHorizontal: 12, paddingVertical: 10, borderTopWidth: 1, borderTopColor: C.cardBorder, backgroundColor: C.head },
  input: { flex: 1, color: C.tx, fontSize: 15, maxHeight: 120, paddingVertical: 8, paddingHorizontal: 6 },
  sendBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: C.gold, alignItems: 'center', justifyContent: 'center' },
})
