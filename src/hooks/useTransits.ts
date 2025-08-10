import { useMemo } from 'react'
import type { BirthData } from '../types/astrology'
import type { RealAstrologyData } from '../services/astrology/RealAstrologyEngine'
import { filterPersonalTransits } from '../astro/transits.utils'
import type { PersonalTransitFilters } from '../astro/transits.types'
import { useAstrologyData } from '../context/AstrologyDataProvider'

export interface UseTransitsResult {
  data: RealAstrologyData | null
  loading: boolean
  error: string | null
  personal: NonNullable<RealAstrologyData['transits']>['personal'] | []
  general: NonNullable<RealAstrologyData['transits']>['general'] | []
  byArea: NonNullable<NonNullable<RealAstrologyData['transits']>['byArea']> | {}
  statusPersonal: RealAstrologyData['statusPersonal'] | undefined
  filterPersonal: (filters: PersonalTransitFilters) => NonNullable<RealAstrologyData['transits']>['personal']
}

// Este hook supõe que um provedor de dados em nível superior já tenha carregado e guardado
// o último RealAstrologyData em um singleton simples (global). Integrações reais podem
// usar React Query/SWR; mantemos simples aqui para não quebrar a UI existente.
export function useTransits(_birthData: BirthData | null): UseTransitsResult {
  const { data: state } = useAstrologyData()

  const personal = state?.transits?.personal ?? []
  const general = state?.transits?.general ?? []
  const byArea = state?.transits?.byArea ?? {}
  const statusPersonal = state?.statusPersonal

  const filterPersonal = (filters: PersonalTransitFilters) => filterPersonalTransits(personal as any, filters)

  return {
    data: state ?? null,
    loading: false,
    error: null,
    personal: personal as any,
    general: general as any,
    byArea,
    statusPersonal,
    filterPersonal,
  }
}

export default useTransits


