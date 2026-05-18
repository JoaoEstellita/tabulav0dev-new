import { TimezoneData } from './timezone.types'

const backend = process.env.EXPO_PUBLIC_BACKEND_URL || 'https://tabulav0dev-backend.vercel.app'

export async function getTimezoneData(lat: number, lon: number, timestampSec: number): Promise<TimezoneData> {
  try {
    const r = await fetch(`${backend}/api/timezone?lat=${lat}&lon=${lon}&ts=${timestampSec}`)
    if (!r.ok) throw new Error(`HTTP ${r.status}`)
    return await r.json()
  } catch (error) {
    console.error('❌ Erro ao buscar timezone:', error)
    throw error // propaga erro — chamadores usam fallback por longitude
  }
}

export class TimezoneService {
  static async resolveOffsetSeconds(lat: number, lon: number, timestampSec: number): Promise<TimezoneData> {
    return getTimezoneData(lat, lon, timestampSec)
  }
}


