const axios = require('axios')

async function testProkeralaProxy() {
  console.log('🔍 Testando endpoint prokerala-proxy...')
  
  try {
    const response = await axios.post('https://tabulav0dev-backend.vercel.app/api/prokerala-proxy', {
      endpoint: '/v2/astrology/transit-planet-position',
      params: {
        'profile[datetime]': '2024-01-15T12:00:00',
        'profile[coordinates]': '28.6139,77.2090',
        ayanamsa: 1
      }
    }, {
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    console.log('✅ Sucesso:', response.data)
  } catch (error) {
    console.error('❌ Erro:', error.message)
    if (error.response) {
      console.error('Status:', error.response.status)
      console.error('Data:', error.response.data)
    }
  }
}

testProkeralaProxy() 