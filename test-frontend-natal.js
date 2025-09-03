// Teste para verificar se o frontend está calculando as casas natais corretamente
const axios = require('axios')

const BACKEND_URL = 'https://tabulav0dev-backend.vercel.app'

async function testFrontendNatal() {
  console.log('🔍 Teste para verificar cálculo de casas natais no frontend...')
  
  // Teste com dados natais
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
      console.log('\n🌞 Planetas natais com casas:')
      response.data.natal.positions.forEach(p => {
        console.log(`${p.body}: ${p.lon.toFixed(2)}° em ${p.sign} - Casa ${p.house || 'N/A'}`)
      })
    }
    
    // Verificar se o frontend vai calcular as casas natais localmente
    console.log('\n🔍 Verificando se o frontend vai calcular casas natais localmente...')
    console.log('📊 Backend forneceu casas natais:', !!response.data.natal?.houses)
    
    if (!response.data.natal?.houses) {
      console.log('⚠️ Backend não forneceu casas natais - frontend deve calcular localmente')
      console.log('✅ Isso deve resolver o problema da casa 12 virando casa 6')
    } else {
      console.log('✅ Backend forneceu casas natais - problema pode estar em outro lugar')
    }
    
  } catch (error) {
    console.error('❌ Erro:', error.response?.data || error.message)
  }
}

testFrontendNatal()
