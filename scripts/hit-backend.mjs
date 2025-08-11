import axios from 'axios'

function ts(date) { return Math.floor(date.getTime() / 1000) }

async function main(){
  const BACKEND = (process.env.EXPO_PUBLIC_BACKEND_URL || 'https://tabulav0dev-backend.vercel.app').replace(/\/$/, '')
  const TZ_ENDPOINT = (process.env.EXPO_PUBLIC_TZ_API_ENDPOINT || `${BACKEND}/api/timezone`).replace(/\/$/, '')

  const lat = -23.5505
  const lon = -46.6333
  const date = new Date('2024-01-15T12:00:00Z')

  console.log('Backend base:', BACKEND)
  console.log('Timezone endpoint:', TZ_ENDPOINT)

  try {
    const tz = await axios.get(`${TZ_ENDPOINT}?lat=${lat}&lon=${lon}&ts=${ts(date)}`, { timeout: 20000 })
    console.log('GET /api/timezone →', tz.status, tz.data)
  } catch (e) {
    console.error('GET /api/timezone FAILED →', e.response?.status || e.message, e.response?.data || '')
  }

  try {
    const payload = {
      datetimeISO: date.toISOString(),
      lat,
      lon,
      includeHouses: true,
      system: 'placidus'
    }
    const r = await axios.post(`${BACKEND}/api/astro/positions`, payload, { timeout: 30000 })
    console.log('POST /api/astro/positions →', r.status, {
      ok: r.data?.ok,
      numPositions: r.data?.positions?.length,
      hasHouses: !!r.data?.houses,
      asc: r.data?.houses?.ascendant,
      mc: r.data?.houses?.midheaven
    })
  } catch (e) {
    console.error('POST /api/astro/positions FAILED →', e.response?.status || e.message, e.response?.data || '')
  }
}

main().catch(err=>{ console.error(err) })


