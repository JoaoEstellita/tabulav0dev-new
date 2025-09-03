// Script para testar apenas subscription para debug
const axios = require('axios')

const BACKEND_URL = (process.env.EXPO_PUBLIC_BACKEND_URL || 'https://tabulav0dev-backend.vercel.app').replace(/\/$/, '')

async function testSubscriptionStatus() {
  console.log('🔍 Testando apenas subscription status...')
  
  const TEST_USER_ID = 'gdRXHrfxS0QTvTmDJttW4e7pIrl2';
  
  try {
    const url = `${BACKEND_URL}/api/subscription`;
    const data = { userId: TEST_USER_ID, action: 'debug' };
    const headers = { 'Content-Type': 'application/json' };
    
    console.log('🔍 URL:', url);
    console.log('🔍 Data:', JSON.stringify(data, null, 2));
    
    const response = await axios({
      method: 'post',
      url,
      data,
      headers,
      timeout: 30000
    });
    
    console.log('✅ Status:', response.status);
    console.log('📊 Response:', response.data);
    
  } catch (error) {
    console.error('❌ Erro:', error.response?.status || error.message);
    if (error.response?.data) {
      console.error('📄 Detalhes:', error.response.data);
    }
  }
}

testSubscriptionStatus();
