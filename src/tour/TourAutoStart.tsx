import { useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useAppLanguage } from '../hooks/useAppLanguage'
import { useTour } from './TourProvider'
import { buildTourSteps } from './tourSteps'

const KEY = 'app_tour_seen_v1'

// Dispara o tour guiado no 1º acesso (uma vez). Depois é reabrível em Configurações.
export default function TourAutoStart() {
  const { start } = useTour()
  const { language } = useAppLanguage()
  useEffect(() => {
    let alive = true
    const t = setTimeout(() => {
      AsyncStorage.getItem(KEY).then((v) => {
        if (!alive || v) return
        AsyncStorage.setItem(KEY, '1').catch(() => {})
        start(buildTourSteps(language))
      }).catch(() => {})
    }, 1200) // deixa a Home montar antes
    return () => { alive = false; clearTimeout(t) }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  return null
}
