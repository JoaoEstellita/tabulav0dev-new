// Script para testar endpoints do backend Vercel diretamente
const axios = require('axios')

const BACKEND_URL = (process.env.EXPO_PUBLIC_BACKEND_URL || 'https://tabulav0dev-backend.vercel.app').replace(/\/$/, '')


async function testEndpoint(desc, method, path, data = {}, headers = {}) {
  try {
    const url = `${BACKEND_URL}${path}`;
    // Adiciona Content-Type e x-user-id se relevante
    const finalHeaders = {
      ...headers,
      ...(method !== 'get' ? { 'Content-Type': 'application/json' } : {}),
      ...(data && data.userId ? { 'x-user-id': data.userId } : {})
    };
    const response = await axios({
      method,
      url,
      data,
      headers: finalHeaders,
      timeout: 30000
    });
    console.log(`\n[${desc}]`);
    console.log('✅ Status:', response.status);
    console.log('📊 Response:', response.data);
  } catch (error) {
    console.error(`\n[${desc}]`);
    console.error('❌ Erro:', error.response?.status || error.message);
    if (error.response?.data) {
      console.error('📄 Detalhes:', error.response.data);
    }
    if (error.response?.status === 500) {
      console.error('🔍 URL testada:', `${BACKEND_URL}${path}`);
      console.error('🔍 Dados enviados:', JSON.stringify(data, null, 2));
      console.error('🔍 Headers:', JSON.stringify(finalHeaders, null, 2));
    }
  }
}

async function runTests() {
  console.log('🚀 Iniciando testes dos endpoints do backend...')

  const TEST_USER_ID = 'gdRXHrfxS0QTvTmDJttW4e7pIrl2';
  const TEST_GROUP_ID = 'OwZiFrYSs0l0RuZgMf3l';
  const TEST_TOKEN = 'F1697524896535986548523649517594';
  const TEST_CRON_SECRET = 'tabula-estelar-cron-2025';

  // Preparando dados de teste
  console.log('📝 Preparando dados de teste...');


  // Subscription endpoints (ordem importante: start-trial cria o usuário)
  await testEndpoint('Start Trial', 'post', '/api/subscription', { userId: TEST_USER_ID, planId: 'monthly', action: 'start-trial' });
  await testEndpoint('Subscription Status', 'post', '/api/subscription', { userId: TEST_USER_ID, action: 'status' });
  await testEndpoint('Cancel Subscription', 'post', '/api/subscription', { userId: TEST_USER_ID, action: 'cancel' });
  await testEndpoint('Reactivate Subscription', 'post', '/api/subscription', { userId: TEST_USER_ID, action: 'reactivate' });

  // Astro positions
  await testEndpoint('Astro Positions', 'post', '/api/astro/positions', { datetimeISO: '2025-09-02T12:00:00Z', lat: -23.5, lon: -46.6 });

  // Group notify
  await testEndpoint('Group Notify', 'post', '/api/group/notify', { groupId: TEST_GROUP_ID, title: 'Alerta', body: 'Mensagem de grupo' });

  // Profile photo upload
  await testEndpoint('Profile Photo Upload', 'post', '/api/upload/profile-photo', { userId: TEST_USER_ID, dataUrl: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD...' });

  // Webpush subscribe (corrigido: precisa de subscription)
  await testEndpoint('Webpush Subscribe', 'post', '/api/webpush/subscribe', {
    userId: TEST_USER_ID,
    subscription: {
      endpoint: 'https://fcm.googleapis.com/fcm/send/fake-token',
      keys: { p256dh: 'fakeP256dh', auth: 'fakeAuth' }
    }
  });

  // Notification preferences (corrigido: precisa de userId e preferences)
  await testEndpoint('Notification Preferences', 'post', '/api/notification-preferences', {
    userId: TEST_USER_ID,
    preferences: { daily: true, marketing: false }
  });

  // Timezone (corrigido: método GET com query string)
  await testEndpoint('Timezone', 'get', `/api/timezone?lat=-23.5&lon=-46.6&ts=1756785600`);

  // Cron daily notifications (corrigido: header de autorização)
  await testEndpoint('Cron Daily Notifications', 'post', '/api/cron-daily-notifications', {}, { 'Authorization': `Bearer ${TEST_CRON_SECRET}` });

  // Create payment preference (corrigido: todos os campos obrigatórios)
  await testEndpoint('Create Payment Preference', 'post', '/api/mercado-pago/create-preference', {
    userId: TEST_USER_ID,
    planId: 'monthly',
    payer: { email: 'user@email.com', name: 'Test User' },
    items: [{ title: 'Plano Mensal', quantity: 1, unit_price: 10 }],
    back_urls: {
      success: 'https://tabulaestelar.com.br/payment/success',
      failure: 'https://tabulaestelar.com.br/payment/failure', 
      pending: 'https://tabulaestelar.com.br/payment/pending'
    },
    auto_return: 'approved'
  });

  // Mercado Pago webhook (mantido como exemplo, pode ajustar conforme necessário)
  await testEndpoint('Mercado Pago Webhook', 'post', '/api/mercado-pago/webhook', { action: 'test' });

  console.log('\n✅ Testes concluídos!');
}

runTests().catch(console.error)