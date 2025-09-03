export class TimezoneService {
  static async resolveOffsetSeconds(lat: number, lon: number, timestampSec: number): Promise<{ offsetSec: number; timeZoneId?: string } | null> {
    try {
      // Preferir endpoint backend (não expõe chave no cliente)
      const backend = process.env.EXPO_PUBLIC_BACKEND_URL
      if (backend) {
        try {
          const r = await fetch(`${backend}/api/timezone?lat=${lat}&lon=${lon}&ts=${timestampSec}`)
          if (r.ok) {
            const j = await r.json()
            if (j && typeof j.offsetSec === 'number') {
              return { offsetSec: j.offsetSec, timeZoneId: j.timeZoneId }
            }
          }
        } catch {}
      }

      // Fallback: chamada direta ao Google somente se chave pública estiver configurada
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

      return null
    } catch {
      return null
    }
  }
}


