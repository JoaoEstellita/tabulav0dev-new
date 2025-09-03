const axios = require('axios')

const BACKEND_URL = 'https://tabulav0dev-backend.vercel.app'

async function testSubscription404() {
  console.log('🔍 Testando erro 404 no endpoint subscription...')
  
  // Usar o userId real do frontend (do console)
  const realUserId = 'gdRXHrfxS0QTvTmDJttW4e7pIrl2'
  
  // Teste 0: Verificar se a URL está correta
  console.log('\n📡 Teste 0: Verificar URLs')
  console.log('🔗 URL do backend:', BACKEND_URL)
  console.log('🔗 URL completa:', `${BACKEND_URL}/api/subscription`)
  
  try {
    // Teste 1: Verificar se o endpoint existe com userId real
    console.log('\n📡 Teste 1: Verificar se o endpoint existe com userId real')
    const response1 = await axios.post(`${BACKEND_URL}/api/subscription`, {
      action: 'status',
      userId: realUserId
    }, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 10000
    })
    console.log('✅ Endpoint existe:', response1.status)
    console.log('📄 Response:', response1.data)
    
  } catch (error) {
    console.log('❌ Erro no teste 1:')
    console.log('📄 Status:', error.response?.status)
    console.log('📄 Status Text:', error.response?.statusText)
    console.log('📄 Data:', error.response?.data)
    console.log('📄 Headers:', error.response?.headers)
  }
  
  try {
    // Teste 2: Verificar se o problema é específico do POST
    console.log('\n📡 Teste 2: Verificar se o problema é específico do POST')
    const response2 = await axios.get(`${BACKEND_URL}/api/subscription?action=status&userId=${realUserId}`, {
      timeout: 10000
    })
    console.log('✅ GET funciona:', response2.status)
    console.log('📄 Response:', response2.data)
    
  } catch (error) {
    console.log('❌ Erro no teste 2:')
    console.log('📄 Status:', error.response?.status)
    console.log('📄 Data:', error.response?.data)
  }
  
  try {
    // Teste 3: Verificar se outros endpoints funcionam
    console.log('\n📡 Teste 3: Verificar outros endpoints')
    const response3 = await axios.post(`${BACKEND_URL}/api/timezone`, {
      lat: -22.9068,
      lon: -43.1729,
      ts: 608212800
    }, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 10000
    })
    console.log('✅ Outro endpoint funciona:', response3.status)
    console.log('📄 Response:', response3.data)
    
  } catch (error) {
    console.log('❌ Erro no teste 3:')
    console.log('📄 Status:', error.response?.status)
    console.log('📄 Data:', error.response?.data)
  }
  
  try {
    // Teste 4: Verificar se o problema é com o CORS
    console.log('\n📡 Teste 4: Verificar se o problema é com o CORS')
    const response4 = await axios.post(`${BACKEND_URL}/api/subscription`, {
      action: 'status',
      userId: realUserId
    }, {
      headers: { 
        'Content-Type': 'application/json',
        'Origin': 'https://www.tabulaestelar.com.br'
      },
      timeout: 10000
    })
    console.log('✅ CORS funciona:', response4.status)
    console.log('📄 Response:', response4.data)
    
  } catch (error) {
    console.log('❌ Erro no teste 4:')
    console.log('📄 Status:', error.response?.status)
    console.log('📄 Data:', error.response?.data)
  }
  
  try {
    // Teste 5: Simular exatamente a requisição do frontend
    console.log('\n📡 Teste 5: Simular exatamente a requisição do frontend')
    const frontendUrl = 'https://tabulav0dev-backend.vercel.app/api/subscription'
    console.log('🔗 URL simulada:', frontendUrl)
    
    const response5 = await axios.post(frontendUrl, {
      action: 'status',
      userId: realUserId
    }, {
      headers: { 
        'Content-Type': 'application/json',
        'Origin': 'https://www.tabulaestelar.com.br',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000
    })
    console.log('✅ Frontend simulado funciona:', response5.status)
    console.log('📄 Response:', response5.data)
    
  } catch (error) {
    console.log('❌ Erro no teste 5:')
    console.log('📄 Status:', error.response?.status)
    console.log('📄 Data:', error.response?.data)
    console.log('📄 URL tentada:', error.config?.url)
  }
}

testSubscription404().catch(console.error)
