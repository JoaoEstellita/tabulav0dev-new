import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import { View, type LayoutChangeEvent } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'

// Tour guiado (holofote) POR ABA. DOIS contextos:
//  - Registry (ESTÁVEL): refs de âncoras/scrollers + start/stop. As telas que só
//    registram âncora ou iniciam o tour NÃO re-renderizam a cada passo.
//  - State (muda): active/steps/index + next/prev — só o Overlay consome.

export type TourTab = 'Home' | 'Cosmos' | 'Groups' | 'Network' | 'Forecast' | 'Settings'
export type TourStep = {
  id: string
  title: string
  body: string
  onEnter?: () => void // executa ao ativar o passo (ex.: abrir um modal de demo)
  onExit?: () => void  // executa ao sair do passo (ex.: fechar o modal)
}

type AnchorInfo = { y: number; h: number; ref: React.RefObject<View | null> }
type Registry = {
  anchors: React.MutableRefObject<Record<string, AnchorInfo>>
  scrollers: React.MutableRefObject<Partial<Record<TourTab, (y: number) => void>>>
  activeTab: React.MutableRefObject<TourTab | null>
  registerScroller: (tab: TourTab, fn: (y: number) => void) => void
  start: (steps: TourStep[], tab?: TourTab) => void
  stop: () => void
}
type TourState = { active: boolean; steps: TourStep[]; index: number; next: () => void; prev: () => void }

const RegistryCtx = createContext<Registry | null>(null)
const StateCtx = createContext<TourState | null>(null)

export function TourProvider({ children }: { children: React.ReactNode }) {
  const [active, setActive] = useState(false)
  const [steps, setSteps] = useState<TourStep[]>([])
  const [index, setIndex] = useState(0)
  const anchors = useRef<Record<string, AnchorInfo>>({})
  const scrollers = useRef<Partial<Record<TourTab, (y: number) => void>>>({})
  const activeTab = useRef<TourTab | null>(null)
  const stepsRef = useRef<TourStep[]>([])
  stepsRef.current = steps

  const registerScroller = useCallback((tab: TourTab, fn: (y: number) => void) => { scrollers.current[tab] = fn }, [])
  const start = useCallback((s: TourStep[], tab?: TourTab) => { if (!s?.length) return; activeTab.current = tab ?? null; setSteps(s); setIndex(0); setActive(true) }, [])
  const stop = useCallback(() => { setActive(false); setIndex(0) }, [])
  const next = useCallback(() => setIndex((i) => { const n = i + 1; if (n >= stepsRef.current.length) { setActive(false); return 0 } return n }), [])
  const prev = useCallback(() => setIndex((i) => Math.max(0, i - 1)), [])

  // Registry NUNCA muda de referência (tudo stable) → sem re-render nas telas.
  const registry = useMemo<Registry>(() => ({ anchors, scrollers, activeTab, registerScroller, start, stop }), [registerScroller, start, stop])
  const state = useMemo<TourState>(() => ({ active, steps, index, next, prev }), [active, steps, index, next, prev])

  return (
    <RegistryCtx.Provider value={registry}>
      <StateCtx.Provider value={state}>{children}</StateCtx.Provider>
    </RegistryCtx.Provider>
  )
}

/** Estado do tour (só o Overlay). */
export function useTourState() {
  const c = useContext(StateCtx)
  if (!c) throw new Error('useTourState fora do TourProvider')
  return c
}
/** Controles + registro (estável) — não re-renderiza com o passo. */
export function useTourControls() {
  const c = useContext(RegistryCtx)
  if (!c) throw new Error('useTourControls fora do TourProvider')
  return c
}

/** Marca um elemento como âncora: espalhe {...useTourAnchor('id')} num <View>. */
export function useTourAnchor(id: string) {
  const c = useContext(RegistryCtx)
  const ref = useRef<View | null>(null)
  const onLayout = useCallback((e: LayoutChangeEvent) => {
    if (!c) return
    const { y, height } = e.nativeEvent.layout
    c.anchors.current[id] = { y, h: height, ref }
  }, [c, id])
  return { ref, onLayout, collapsable: false as const }
}

/** Registra o ScrollView de uma aba para o tour rolar até a âncora. */
export function useTourScroller(tab: TourTab, scrollTo: (y: number) => void) {
  const c = useContext(RegistryCtx)
  const reg = c?.registerScroller
  React.useEffect(() => { reg?.(tab, scrollTo) }, [reg, tab, scrollTo])
}

/** Tour da ABA: dispara no 1º foco (uma vez) e devolve openTour para o botão "?". */
export function useTabTour(storageKey: string, tab: TourTab, buildSteps: () => TourStep[]) {
  const { start, anchors } = useTourControls()
  const buildRef = useRef(buildSteps)
  buildRef.current = buildSteps
  const openTour = useCallback(() => start(buildRef.current(), tab), [start, tab])
  useFocusEffect(useCallback(() => {
    let alive = true
    let tries = 0
    let timer: ReturnType<typeof setTimeout>
    // Espera a 1ª âncora ESTAR MEDIDA (onLayout) antes de abrir — senão o holofote
    // dispara sobre um layout que ainda não existe e fica fora do lugar.
    const attempt = () => {
      if (!alive) return
      AsyncStorage.getItem(storageKey).then((v) => {
        if (!alive || v) return
        const steps = buildRef.current()
        const firstId = steps[0]?.id
        const ready = !firstId || !!anchors.current[firstId]
        if (!ready && tries < 24) { tries++; timer = setTimeout(attempt, 250); return } // até ~6s
        AsyncStorage.setItem(storageKey, '1').catch(() => { })
        if (alive) start(steps, tab)
      }).catch(() => { })
    }
    timer = setTimeout(attempt, 600)
    return () => { alive = false; clearTimeout(timer) }
  }, [storageKey, tab, start, anchors]))
  return { openTour }
}
