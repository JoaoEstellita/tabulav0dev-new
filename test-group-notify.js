// Teste específico para Group Notify
const axios = require('axios')

const BACKEND_URL = 'https://tabulav0dev-backend.vercel.app'

async function testGroupNotify() {
  console.log('🔍 Testando Group Notify especificamente...')
  
  const TEST_GROUP_ID = 'OwZiFrYSs0l0RuZgMf3l';
  
  try {
    const url = `${BACKEND_URL}/api/group/notify`;
    const data = { 
      groupId: TEST_GROUP_ID, 
      title: 'Teste de Alerta', 
      body: 'Mensagem de teste do grupo' 
    };
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
    console.log('📊 Response:', JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.error('❌ Erro:', error.response?.status || error.message);
    if (error.response?.data) {
      console.error('📄 Detalhes:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

testGroupNotify();
