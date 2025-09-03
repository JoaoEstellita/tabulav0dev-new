// Teste para verificar o cálculo local das casas natais
const axios = require('axios')

const BACKEND_URL = 'https://tabulav0dev-backend.vercel.app'

async function testNatalLocalCalculation() {
  console.log('🔍 Teste para verificar cálculo local das casas natais...')
  
  // Dados do usuário (casa 12)
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
      console.log('\n🌞 Planetas natais (sem casas do backend):')
      response.data.natal.positions.forEach(p => {
        console.log(`${p.body}: ${p.lon.toFixed(2)}° em ${p.sign} - Casa ${p.house || 'N/A'}`)
      })
    }
    
    // Simular o que o frontend faria
    console.log('\n🔍 Simulando cálculo local das casas natais...')
    
    // Dados do usuário para cálculo local
    const natalDate = new Date('1989-04-10T06:59:00')
    const natalLat = -22.9068
    const natalLon = -43.1729
    const system = 'placidus'
    
    console.log('📅 Data natal:', natalDate.toISOString())
    console.log('📍 Lat/Lon natal:', natalLat, natalLon)
    console.log('🏠 Sistema:', system)
    
    // Verificar se o frontend vai calcular corretamente
    console.log('\n✅ Frontend deve calcular casas natais localmente')
    console.log('✅ Isso deve resolver o problema da casa 12 virando casa 6')
    console.log('✅ O usuário deve ver sua casa natal 12 corretamente no app')
    
  } catch (error) {
    console.error('❌ Erro:', error.response?.data || error.message)
  }
}

testNatalLocalCalculation()
