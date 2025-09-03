// Script para debugar a resposta real da API Prokerala
const axios = require('axios')

async function testProkeralaAPI() {
  console.log('🔍 Testando API Prokerala...')
  
  try {
    const response = await axios.post('https://tabula-estelar-backend.vercel.app/api/prokerala-proxy', {
      endpoint: '/v2/astrology/transit-planet-position',
      params: {
        'profile[datetime]': '2024-01-15T12:00:00',
        'profile[coordinates]': '28.6139,77.2090',
        ayanamsa: 1
      }
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    console.log('✅ Resposta da API:')
    console.log('Status:', response.status)
    console.log('Data keys:', Object.keys(response.data))
    
    if (response.data.data) {
      console.log('🔍 Estrutura response.data.data:')
      console.log('Type:', typeof response.data.data)
      console.log('Keys:', Object.keys(response.data.data))
      console.log('Primeiro nível completo:', JSON.stringify(response.data.data, null, 2))
    }
    
  } catch (error) {
    console.error('❌ Erro:', error.message)
    if (error.response) {
      console.error('Status:', error.response.status)
      console.error('Data:', error.response.data)
    }
  }
}

testProkeralaAPI()