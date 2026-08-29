import React, { useRef, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList, useWindowDimensions } from 'react-native'

export type IntroSlide = { emoji: string; title: string; text: string }

type Props = {
  visible: boolean
  slides: IntroSlide[]
  onClose: () => void
  labels?: { skip?: string; next?: string; done?: string }
}

const C = { bg: '#141428', card: '#1c1c34', gold: '#e8b84b', magenta: '#d6409f', tx: '#eaeaf5', dim: '#8892a4', dot: '#3a3a5a' }

/** Carrossel de introdução genérico (reutilizável). Slides deslizáveis + dots + CTA. */
export default function IntroCarousel({ visible, slides, onClose, labels }: Props) {
  const { width } = useWindowDimensions()
  const [idx, setIdx] = useState(0)
  const ref = useRef<FlatList<IntroSlide>>(null)
  const w = Math.min(width, 520)

  const go = (i: number) => {
    const n = Math.max(0, Math.min(slides.length - 1, i))
    setIdx(n)
    ref.current?.scrollToOffset({ offset: n * w, animated: true })
  }

  const last = idx >= slides.length - 1
  const L = { skip: labels?.skip || 'Pular', next: labels?.next || 'Próximo', done: labels?.done || 'Começar' }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={s.backdrop}>
        <View style={[s.sheet, { width: w }]}>
          <TouchableOpacity style={s.skip} onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Text style={s.skipTx}>{L.skip}</Text>
          </TouchableOpacity>

          <FlatList
            ref={ref}
            data={slides}
            keyExtractor={(_, i) => String(i)}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(e) => setIdx(Math.round(e.nativeEvent.contentOffset.x / w))}
            renderItem={({ item }) => (
              <View style={[s.slide, { width: w }]}>
                <Text style={s.emoji}>{item.emoji}</Text>
                <Text style={s.title}>{item.title}</Text>
                <Text style={s.text}>{item.text}</Text>
              </View>
            )}
          />

          <View style={s.dots}>
            {slides.map((_, i) => <View key={i} style={[s.dot, i === idx && s.dotOn]} />)}
          </View>

          <TouchableOpacity style={s.cta} onPress={() => (last ? onClose() : go(idx + 1))} activeOpacity={0.9}>
            <Text style={s.ctaTx}>{last ? L.done : L.next}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

const s = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.72)', alignItems: 'center', justifyContent: 'center', padding: 16 },
  sheet: { backgroundColor: C.bg, borderRadius: 22, paddingVertical: 28, borderWidth: 1, borderColor: '#2a2a44', overflow: 'hidden' },
  skip: { position: 'absolute', top: 14, right: 16, zIndex: 2 },
  skipTx: { color: C.dim, fontSize: 13, fontWeight: '600' },
  slide: { alignItems: 'center', paddingHorizontal: 26, paddingTop: 10 },
  emoji: { fontSize: 58, marginBottom: 18 },
  title: { color: C.tx, fontSize: 21, fontWeight: '800', textAlign: 'center', marginBottom: 10 },
  text: { color: C.dim, fontSize: 15, lineHeight: 22, textAlign: 'center' },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 22, marginBottom: 18 },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: C.dot },
  dotOn: { backgroundColor: C.magenta, width: 20 },
  cta: { marginHorizontal: 24, backgroundColor: C.gold, borderRadius: 14, paddingVertical: 14, alignItems: 'center' },
  ctaTx: { color: '#1a1400', fontSize: 15, fontWeight: '800' },
})
