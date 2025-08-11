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
    const natalISO = '1989-04-10T09:59:00Z'
    const payload = { datetimeISO: natalISO, lat: -22.9068, lon: -43.1729, includeHouses: true, system: 'placidus' }
    const r = await axios.post(`${BACKEND}/api/astro/positions`, payload, { timeout: 30000 })
    console.log('POST /api/astro/positions (RJ natal) →', r.status, {
      ok: r.data?.ok,
      SunHouse: r.data?.positions?.find?.(p=>p.body==='Sun')?.house,
      asc: r.data?.houses?.ascendant,
      mc: r.data?.houses?.midheaven,
      approx: r.data?.houses?.approximate === true
    })
  } catch (e) {
    console.error('POST /api/astro/positions FAILED →', e.response?.status || e.message, e.response?.data || '')
  }

  // Teste de approx em latitudes extremas
  try {
    const extreme = await axios.post(`${BACKEND}/api/astro/positions`, {
      datetimeISO: date.toISOString(),
      lat: 70,
      lon: 0,
      includeHouses: true,
      system: 'placidus'
    }, { timeout: 30000 })
    console.log('POST /api/astro/positions (lat=70) →', extreme.status, {
      approx: extreme.data?.houses?.approximate === true,
      system: extreme.data?.houses?.system,
      asc: extreme.data?.houses?.ascendant,
      mc: extreme.data?.houses?.midheaven
    })
  } catch (e) {
    console.error('POST /api/astro/positions (lat=70) FAILED →', e.response?.status || e.message, e.response?.data || '')
  }
}

main().catch(err=>{ console.error(err) })


