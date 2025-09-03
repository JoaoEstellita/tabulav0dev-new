// Teste das correções de CORS e URLs
const axios = require('axios')

const BACKEND_URL = 'https://tabulav0dev-backend.vercel.app'

async function testCorsAndUrls() {
  console.log('🧪 Testando correções de CORS e URLs...')
  
  const tests = [
    {
      name: 'Subscription Status (novo formato)',
      method: 'post',
      url: `${BACKEND_URL}/api/subscription`,
      data: { action: 'status', userId: 'test-user' },
      headers: { 
        'Content-Type': 'application/json',
        'Origin': 'https://www.tabulaestelar.com.br'
      }
    },
    {
      name: 'Timezone (novo formato)',
      method: 'get',
      url: `${BACKEND_URL}/api/timezone?lat=-22.9068&lon=-43.1729&ts=608212800`,
      headers: { 
        'Origin': 'https://www.tabulaestelar.com.br'
      }
    },
    {
      name: 'Astro Positions (novo formato)',
      method: 'post',
      url: `${BACKEND_URL}/api/astro/positions`,
      data: {
        datetimeISO: '2025-09-03T17:41:40.762Z',
        lat: -22.9068,
        lon: -43.1729,
        includeHouses: true
      },
      headers: { 
        'Content-Type': 'application/json',
        'Origin': 'https://www.tabulaestelar.com.br'
      }
    }
  ]

  for (const test of tests) {
    try {
      console.log(`\n[${test.name}]`)
      const response = await axios({
        method: test.method,
        url: test.url,
        data: test.data,
        headers: test.headers,
        timeout: 10000
      })
      
      console.log('✅ Status:', response.status)
      console.log('🔗 CORS Headers:', {
        'Access-Control-Allow-Origin': response.headers['access-control-allow-origin'],
        'Access-Control-Allow-Methods': response.headers['access-control-allow-methods']
      })
      
    } catch (error) {
      console.error('❌ Erro:', error.response?.status || error.message)
      if (error.response?.data) {
        console.error('📄 Detalhes:', error.response.data)
      }
    }
  }
}

testCorsAndUrls();
