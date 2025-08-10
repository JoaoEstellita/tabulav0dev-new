export class TimezoneService {
  static async resolveOffsetSeconds(lat: number, lon: number, timestampSec: number): Promise<{ offsetSec: number; timeZoneId?: string } | null> {
    try {
      const googleKey = process.env.EXPO_PUBLIC_GOOGLE_TZ_KEY
      if (googleKey) {
        const url = `https://maps.googleapis.com/maps/api/timezone/json?location=${lat},${lon}&timestamp=${timestampSec}&key=${googleKey}`
        const resp = await fetch(url)
        if (resp.ok) {
          const data = await resp.json()
          if (data && typeof data.rawOffset === 'number' && typeof data.dstOffset === 'number') {
            const total = (data.rawOffset as number) + (data.dstOffset as number)
            return { offsetSec: total, timeZoneId: data.timeZoneId }
          }
        }
      }
      // Backend opcional
      const endpoint = process.env.EXPO_PUBLIC_TZ_API_ENDPOINT
      if (endpoint) {
        const r = await fetch(`${endpoint}?lat=${lat}&lon=${lon}&ts=${timestampSec}`)
        if (r.ok) {
          const j = await r.json()
          if (typeof j.offsetSec === 'number') return { offsetSec: j.offsetSec, timeZoneId: j.timeZoneId }
        }
      }
      return null
    } catch {
      return null
    }
  }
}


