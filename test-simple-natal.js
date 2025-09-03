// Teste simples para verificar o problema das casas natais
const axios = require('axios')

const BACKEND_URL = 'https://tabulav0dev-backend.vercel.app'

async function testSimpleNatal() {
  console.log('🔍 Teste simples para verificar casas natais...')
  
  // Teste com parâmetros mínimos
  const requestBody = {
    datetimeISO: '2025-09-03T18:30:00Z',
    lat: -22.9068,
    lon: -43.1729,
    includeHouses: true,
    natalLocal: '1989-04-10T06:59:00',
    natalLat: -22.9068,
    natalLon: -43.1729,
    debug: true
  }
  
  console.log('📤 Request:', JSON.stringify(requestBody, null, 2))
  
  try {
    const response = await axios.post(`${BACKEND_URL}/api/astro/positions?debug=true`, requestBody)
    
    console.log('✅ Status:', response.status)
    console.log('📊 natal.houses:', response.data.natal?.houses)
    console.log('📊 natal.positions:', response.data.natal?.positions?.length || 0)
    
    if (response.data.natal?.positions) {
      console.log('\n🌞 Primeiros 3 planetas natais:')
      response.data.natal.positions.slice(0, 3).forEach(p => {
        console.log(`${p.body}: ${p.lon.toFixed(2)}° em ${p.sign} - Casa ${p.house || 'N/A'}`)
      })
    }
    
  } catch (error) {
    console.error('❌ Erro:', error.response?.data || error.message)
  }
}

testSimpleNatal()
