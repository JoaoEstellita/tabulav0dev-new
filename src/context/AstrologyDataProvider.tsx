import React, { createContext, useContext, useEffect, useState } from 'react'
import type { RealAstrologyData } from '../services/astrology/RealAstrologyEngine'

type Ctx = {
  data: RealAstrologyData | null
  setData: (d: RealAstrologyData | null) => void
}

const AstrologyDataContext = createContext<Ctx | undefined>(undefined)

let externalSetter: ((d: RealAstrologyData | null) => void) | null = null

export function AstrologyDataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<RealAstrologyData | null>(null)
  useEffect(() => {
    externalSetter = setData
    return () => { externalSetter = null }
  }, [])
  return (
    <AstrologyDataContext.Provider value={{ data, setData }}>
      {children}
    </AstrologyDataContext.Provider>
  )
}

export function useAstrologyData(): Ctx {
  const ctx = useContext(AstrologyDataContext)
  if (!ctx) {
    return { data: null, setData: () => {} }
  }
  return ctx
}

export function publishAstrologyData(d: RealAstrologyData) {
  if (externalSetter) externalSetter(d)
  // backward-compat until all hooks migrate
  ;(globalThis as any).__lastTransitData = d
}


