import React, { useEffect, useRef, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Platform, BackHandler } from 'react-native'
import { useAppLanguage } from '../hooks/useAppLanguage'
import { useTourState, useTourControls } from '../tour/TourProvider'

// Desenha o holofote: escurece a tela com 4 retângulos ao redor de um "buraco"
// sobre a âncora real + um balão explicando. Orquestra: navega até a aba do passo,
// rola até a âncora e mede a posição. Degrada para balão central se não medir.
const DIM = 'rgba(8,6,18,0.82)'
const GOLD = '#FFD700'
const PAD = 8 // folga do buraco ao redor do elemento

export default function TourOverlay() {
  const { active, steps, index, next, prev } = useTourState()
  const { anchors, scrollers, activeTab, stop } = useTourControls()
  const { language } = useAppLanguage()
  const tl = (pt: string, en: string, es: string, it: string) =>
    ({ 'pt-BR': pt, 'en-US': en, 'es-ES': es, 'it-IT': it } as any)[language] || pt
  const [rect, setRect] = useState<{ x: number; y: number; w: number; h: number } | null>(null)
  const timers = useRef<any[]>([])
  const enteredIdxRef = useRef<number | null>(null)

  const step = active ? steps[index] : null

  // onEnter/onExit dos passos (ex.: trocar o modo do mapa, abrir um modal). Chaveado
  // por índice (passos podem repetir o mesmo id de âncora).
  useEffect(() => {
    const prevIdx = enteredIdxRef.current
    const curIdx = active ? index : null
    if (prevIdx != null && prevIdx !== curIdx && steps[prevIdx]) { try { steps[prevIdx].onExit?.() } catch { /* noop */ } }
    if (step) { try { step.onEnter?.() } catch { /* noop */ } enteredIdxRef.current = index }
    else { enteredIdxRef.current = null }
  }, [index, active]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    timers.current.forEach(clearTimeout)
    timers.current = []
    if (!step) { setRect(null); return }
    setRect(null)
    // rola até a âncora e mede (com re-tentativas — o elemento pode montar depois)
    const attempt = (n: number) => {
      const a = anchors.current[step.id]
      if (a) {
        const scroller = (activeTab.current && scrollers.current[activeTab.current]) || Object.values(scrollers.current)[0]
        if (scroller && a.y > 0) { try { scroller(Math.max(0, a.y - 90)) } catch { /* noop */ } }
        const node = a.ref.current as any
        if (node && node.measureInWindow) {
          node.measureInWindow((x: number, y: number, w: number, h: number) => {
            if (w > 0 && h > 0) setRect({ x, y, w, h })
            else if (n < 4) timers.current.push(setTimeout(() => attempt(n + 1), 260))
          })
          return
        }
      }
      if (n < 6) timers.current.push(setTimeout(() => attempt(n + 1), 260))
    }
    timers.current.push(setTimeout(() => attempt(0), 420))
    return () => { timers.current.forEach(clearTimeout); timers.current = [] }
  }, [index, active]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!step) return null

  const { width: SW, height: SH } = Dimensions.get('window')
  const hole = rect
    ? { x: Math.max(0, rect.x - PAD), y: Math.max(0, rect.y - PAD), w: rect.w + PAD * 2, h: rect.h + PAD * 2 }
    : null
  // Balão: abaixo do buraco se couber; senão acima; sem buraco, centralizado.
  const balloonBelow = hole ? hole.y + hole.h + 180 < SH : true
  const balloonTop = !hole ? SH / 2 - 90 : balloonBelow ? hole.y + hole.h + 12 : Math.max(40, hole.y - 172)

  const isLast = index >= steps.length - 1

  // Botão voltar do aparelho fecha o guia em vez de sair do app. Sem isto, a
  // pessoa que quer apenas se livrar do tour é jogada para fora do aplicativo —
  // o reflexo de voltar é o primeiro que todo mundo tenta.
  useEffect(() => {
    if (!active || Platform.OS !== 'android') return
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      stop()
      return true // consumido: não propaga para a navegação nem encerra o app
    })
    return () => sub.remove()
  }, [active, stop])

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      {hole ? (
        <>
          {/* 4 retângulos escuros ao redor do buraco — tocáveis: tocar fora do
              balão fecha o guia, que é o gesto que todo mundo tenta primeiro. */}
          <TouchableOpacity activeOpacity={1} onPress={stop} style={[s.dim, { top: 0, left: 0, right: 0, height: hole.y }]} />
          <TouchableOpacity activeOpacity={1} onPress={stop} style={[s.dim, { top: hole.y + hole.h, left: 0, right: 0, bottom: 0 }]} />
          <TouchableOpacity activeOpacity={1} onPress={stop} style={[s.dim, { top: hole.y, left: 0, width: hole.x, height: hole.h }]} />
          <TouchableOpacity activeOpacity={1} onPress={stop} style={[s.dim, { top: hole.y, left: hole.x + hole.w, right: 0, height: hole.h }]} />
          {/* bloqueia toques no recurso durante o tour (evita abrir modais por engano) */}
          <View style={{ position: 'absolute', top: hole.y, left: hole.x, width: hole.w, height: hole.h }} />
          {/* anel dourado no recurso */}
          <View pointerEvents="none" style={[s.ring, { top: hole.y, left: hole.x, width: hole.w, height: hole.h }]} />
        </>
      ) : (
        <TouchableOpacity activeOpacity={1} onPress={stop} style={[StyleSheet.absoluteFill, { backgroundColor: DIM }]} />
      )}

      {/* Balão */}
      <View style={[s.balloon, { top: balloonTop, width: Math.min(SW - 24, 420) }]}>
        {/* X no canto: saída óbvia à primeira vista. O "Sair" de texto embaixo
            continua, mas ninguém procura por ele — procura-se o X. */}
        <TouchableOpacity
          onPress={stop}
          style={s.fechar}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          accessibilityRole="button"
          accessibilityLabel={tl('Fechar o guia', 'Close the guide', 'Cerrar la guia', 'Chiudi la guida')}
        >
          <Text style={s.fecharTx}>✕</Text>
        </TouchableOpacity>
        <Text style={s.counter}>{tl('Passo', 'Step', 'Paso', 'Passo')} {index + 1}/{steps.length}</Text>
        <Text style={s.title}>{step.title}</Text>
        <Text style={s.body}>{step.body}</Text>
        <View style={s.actions}>
          <TouchableOpacity onPress={stop} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text style={s.skip}>{tl('Sair', 'Exit', 'Salir', 'Esci')}</Text>
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            {index > 0 ? (
              <TouchableOpacity style={s.ghost} onPress={prev}><Text style={s.ghostTx}>{tl('Anterior', 'Back', 'Atras', 'Indietro')}</Text></TouchableOpacity>
            ) : null}
            <TouchableOpacity style={s.primary} onPress={next}>
              <Text style={s.primaryTx}>{isLast ? tl('Concluir', 'Finish', 'Terminar', 'Fine') : tl('Próximo', 'Next', 'Siguiente', 'Avanti')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  )
}

const s = StyleSheet.create({
  dim: { position: 'absolute', backgroundColor: DIM },
  fechar: { position: 'absolute', top: 6, right: 8, width: 32, height: 32, alignItems: 'center', justifyContent: 'center', zIndex: 2 },
  fecharTx: { color: '#9aa2b8', fontSize: 18, fontWeight: '700', lineHeight: 20 },
  ring: { position: 'absolute', borderWidth: 2, borderColor: GOLD, borderRadius: 14, ...(Platform.OS === 'web' ? { boxShadow: '0 0 0 3px rgba(255,215,0,0.25)' } as any : {}) },
  balloon: { position: 'absolute', alignSelf: 'center', backgroundColor: '#161728', borderRadius: 18, borderWidth: 1, borderColor: 'rgba(255,215,0,0.35)', padding: 18, shadowColor: '#000', shadowOpacity: 0.4, shadowRadius: 16, shadowOffset: { width: 0, height: 8 }, elevation: 12 },
  counter: { color: GOLD, fontSize: 11, fontWeight: '800', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 },
  title: { color: '#EDEBF7', fontSize: 18, fontWeight: '900', marginBottom: 6 },
  body: { color: '#B9BAD6', fontSize: 14, lineHeight: 20, marginBottom: 16 },
  actions: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  skip: { color: '#8E8FAd', fontSize: 14, fontWeight: '700' },
  ghost: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.14)' },
  ghostTx: { color: '#EDEBF7', fontSize: 14, fontWeight: '700' },
  primary: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 12, backgroundColor: GOLD },
  primaryTx: { color: '#0F0F23', fontSize: 14, fontWeight: '800' },
})
