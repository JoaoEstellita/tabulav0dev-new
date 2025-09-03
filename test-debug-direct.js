// Teste direto para verificar o problema
const axios = require('axios')

const BACKEND_URL = 'https://tabulav0dev-backend.vercel.app'

async function testDebugDirect() {
  console.log('🔍 Teste direto para verificar o problema...')
  
  // Teste 1: Com natalLocal
  console.log('\n📤 Teste 1: Com natalLocal')
  try {
    const response1 = await axios.post(`${BACKEND_URL}/api/astro/positions?debug=true`, {
      datetimeISO: '2025-09-03T18:30:00Z',
      lat: -22.9068,
      lon: -43.1729,
      includeHouses: true,
      natalLocal: '1989-04-10T06:59:00',
      natalLat: -22.9068,
      natalLon: -43.1729,
      debug: true
    })
    
    console.log('✅ Status:', response1.status)
    console.log('📊 natal existe:', !!response1.data.natal)
    console.log('📊 natal.houses:', response1.data.natal?.houses)
    console.log('📊 natal.positions:', response1.data.natal?.positions?.length || 0)
    
  } catch (error) {
    console.error('❌ Erro Teste 1:', error.response?.data || error.message)
  }
  
  // Teste 2: Com natalISO
  console.log('\n📤 Teste 2: Com natalISO')
  try {
    const response2 = await axios.post(`${BACKEND_URL}/api/astro/positions?debug=true`, {
      datetimeISO: '2025-09-03T18:30:00Z',
      lat: -22.9068,
      lon: -43.1729,
      includeHouses: true,
      natalISO: '1989-04-10T09:59:00Z', // UTC
      natalLat: -22.9068,
      natalLon: -43.1729,
      debug: true
    })
    
    console.log('✅ Status:', response2.status)
    console.log('📊 natal existe:', !!response2.data.natal)
    console.log('📊 natal.houses:', response2.data.natal?.houses)
    console.log('📊 natal.positions:', response2.data.natal?.positions?.length || 0)
    
  } catch (error) {
    console.error('❌ Erro Teste 2:', error.response?.data || error.message)
  }
  
  // Teste 3: Sem dados natais (controle)
  console.log('\n📤 Teste 3: Sem dados natais (controle)')
  try {
    const response3 = await axios.post(`${BACKEND_URL}/api/astro/positions?debug=true`, {
      datetimeISO: '2025-09-03T18:30:00Z',
      lat: -22.9068,
      lon: -43.1729,
      includeHouses: true,
      debug: true
    })
    
    console.log('✅ Status:', response3.status)
    console.log('📊 natal existe:', !!response3.data.natal)
    console.log('📊 natal.houses:', response3.data.natal?.houses)
    console.log('📊 natal.positions:', response3.data.natal?.positions?.length || 0)
    
  } catch (error) {
    console.error('❌ Erro Teste 3:', error.response?.data || error.message)
  }
}

testDebugDirect()
