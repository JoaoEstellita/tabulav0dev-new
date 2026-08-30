import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import { View, type LayoutChangeEvent } from 'react-native'

// Tour guiado (holofote). DOIS contextos:
//  - Registry: refs de âncoras/scrollers — valor ESTÁVEL (não muda), então as
//    telas que só registram âncora (Home/Cosmos/Grupos) NÃO re-renderizam a cada
//    passo do tour.
//  - State: active/steps/index + controles — muda; só o Overlay e quem controla.

export type TourTab = 'Home' | 'Cosmos' | 'Groups' | 'Network' | 'Forecast' | 'Settings'
export type TourStep = { id: string; tab: TourTab; title: string; body: string; hint?: string }

type AnchorInfo = { y: number; h: number; ref: React.RefObject<View | null> }
type Registry = {
  anchors: React.MutableRefObject<Record<string, AnchorInfo>>
  scrollers: React.MutableRefObject<Partial<Record<TourTab, (y: number) => void>>>
  registerScroller: (tab: TourTab, fn: (y: number) => void) => void
}
type TourState = {
  active: boolean
  steps: TourStep[]
  index: number
  start: (steps: TourStep[]) => void
  next: () => void
  prev: () => void
  stop: () => void
}

const RegistryCtx = createContext<Registry | null>(null)
const StateCtx = createContext<(TourState & Registry) | null>(null)

export function TourProvider({ children }: { children: React.ReactNode }) {
  const [active, setActive] = useState(false)
  const [steps, setSteps] = useState<TourStep[]>([])
  const [index, setIndex] = useState(0)
  const anchors = useRef<Record<string, AnchorInfo>>({})
  const scrollers = useRef<Partial<Record<TourTab, (y: number) => void>>>({})

  const registerScroller = useCallback((tab: TourTab, fn: (y: number) => void) => { scrollers.current[tab] = fn }, [])
  const registry = useMemo<Registry>(() => ({ anchors, scrollers, registerScroller }), [registerScroller])

  const start = useCallback((s: TourStep[]) => { if (!s.length) return; setSteps(s); setIndex(0); setActive(true) }, [])
  const stop = useCallback(() => { setActive(false); setIndex(0) }, [])
  const next = useCallback(() => setIndex((i) => { const n = i + 1; if (n >= steps.length) { setActive(false); return 0 } return n }), [steps.length])
  const prev = useCallback(() => setIndex((i) => Math.max(0, i - 1)), [])

  const state = useMemo(() => ({ active, steps, index, start, next, prev, stop, ...registry }), [active, steps, index, start, next, prev, stop, registry])

  return (
    <RegistryCtx.Provider value={registry}>
      <StateCtx.Provider value={state}>{children}</StateCtx.Provider>
    </RegistryCtx.Provider>
  )
}

/** Controle + estado do tour (Overlay e quem inicia). */
export function useTour() {
  const c = useContext(StateCtx)
  if (!c) throw new Error('useTour fora do TourProvider')
  return c
}

/** Marca um elemento como âncora: espalhe {...useTourAnchor('id')} num <View>.
 * Só usa o Registry estável — não re-renderiza quando o passo do tour muda. */
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
