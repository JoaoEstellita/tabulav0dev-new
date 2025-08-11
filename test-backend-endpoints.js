// Script para testar endpoints do backend Vercel diretamente
const axios = require('axios')

const BACKEND_URL = (process.env.EXPO_PUBLIC_BACKEND_URL || 'https://tabulav0dev-backend.vercel.app').replace(/\/$/, '')

async function testEndpoint(endpoint, params = {}) {
  console.log(`\n🔍 Testando: ${endpoint}`)
  console.log('📋 Parâmetros:', JSON.stringify(params, null, 2))
  
  try {
    const response = await axios.post(`${BACKEND_URL}/api/prokerala-proxy`, {
      endpoint,
      params
    }, {
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    console.log('✅ Status:', response.status)
    console.log('📊 Dados recebidos:', {
      success: response.data.success,
      dataKeys: Object.keys(response.data.data || {}),
      hasTransitAspect: !!(response.data.data?.transit_aspect),
      hasAspects: !!(response.data.data?.aspects),
      hasPlanetPosition: !!(response.data.data?.planet_position)
    })
    
    // Se tem aspectos, mostrar estrutura
    if (response.data.data?.transit_aspect) {
      console.log('🔗 transit_aspect tipo:', typeof response.data.data.transit_aspect)
      console.log('🔗 transit_aspect é array?', Array.isArray(response.data.data.transit_aspect))
      if (Array.isArray(response.data.data.transit_aspect)) {
        console.log('🔗 transit_aspect length:', response.data.data.transit_aspect.length)
        if (response.data.data.transit_aspect.length > 0) {
          console.log('🔗 Primeiro aspecto:', JSON.stringify(response.data.data.transit_aspect[0], null, 2))
        }
      }
    }
    
    return response.data
    
  } catch (error) {
    console.error('❌ Erro:', error.response?.status || error.message)
    if (error.response?.data) {
      console.error('📄 Detalhes:', error.response.data)
    }
    return null
  }
}

async function runTests() {
  console.log('🚀 Iniciando testes dos endpoints do backend...')
  
  // Parâmetros de teste (usar dados reais de exemplo)
  // Parâmetros FLAT conforme proxy premium
  const nowISO = '2024-01-15T12:00:00'
  const coords = '-23.5505,-46.6333'
  const testParamsFlat = {
    datetime: nowISO,
    coordinates: coords,
    ayanamsa: 1,
    transit_datetime: nowISO,
    current_coordinates: coords,
    house_system: 'placidus',
    la: 'en'
  }
  
  // Teste 1: Transit Planet Position
  await testEndpoint('/v2/astrology/transit-planet-position', testParamsFlat)
  
  // Teste 2: Transit Aspect Chart
  await testEndpoint('/v2/astrology/transit-aspect-chart', testParamsFlat)
  
  // Teste 3: Natal Aspect Chart
  await testEndpoint('/v2/astrology/natal-aspect-chart', {
    datetime: nowISO,
    coordinates: coords,
    ayanamsa: 1,
    house_system: 'placidus',
    aspect_filter: 'major',
    la: 'en'
  })
  
  // Teste 4: Health do backend
  console.log('\n🔍 Testando health do backend...')
  try {
    const healthResponse = await axios.get(`${BACKEND_URL}/api/health`)
    console.log('✅ Backend Health:', healthResponse.data)
  } catch (error) {
    console.error('❌ Backend Health Error:', error.message)
  }
  
  console.log('\n✅ Testes concluídos!')
}

runTests().catch(console.error)