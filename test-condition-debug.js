// Teste específico para verificar a condição
const axios = require('axios')

const BACKEND_URL = 'https://tabulav0dev-backend.vercel.app'

async function testConditionDebug() {
  console.log('🔍 Teste específico para verificar a condição...')
  
  // Teste com valores explícitos
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
  
  console.log('📤 Request body:')
  console.log('- includeHouses:', requestBody.includeHouses, '(', typeof requestBody.includeHouses, ')')
  console.log('- natalLat:', requestBody.natalLat, '(', typeof requestBody.natalLat, ')')
  console.log('- natalLon:', requestBody.natalLon, '(', typeof requestBody.natalLon, ')')
  console.log('- Condição:', requestBody.includeHouses && requestBody.natalLat && requestBody.natalLon)
  
  try {
    const response = await axios.post(`${BACKEND_URL}/api/astro/positions?debug=true`, requestBody)
    
    console.log('\n✅ Status:', response.status)
    console.log('📊 natal existe:', !!response.data.natal)
    console.log('📊 natal.houses:', response.data.natal?.houses)
    console.log('📊 natal.positions:', response.data.natal?.positions?.length || 0)
    
    // Verificar se os planetas natais têm casas atribuídas
    if (response.data.natal?.positions) {
      console.log('\n🌞 Planetas natais com casas:')
      response.data.natal.positions.forEach(p => {
        console.log(`${p.body}: ${p.lon.toFixed(2)}° em ${p.sign} - Casa ${p.house || 'N/A'}`)
      })
    }
    
  } catch (error) {
    console.error('❌ Erro:', error.response?.data || error.message)
  }
}

testConditionDebug()
