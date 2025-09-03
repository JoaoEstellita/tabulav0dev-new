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

  // --- TESTES DO ENDPOINT CONSOLIDADO ---
  const fetch = require('node-fetch');
  // Preencha abaixo com os valores REAIS do seu ambiente para garantir testes corretos:
  const BASE_URL = 'https://tabulav0dev-backend.vercel.app/api/'; // URL do backend no Vercel
  const TEST_USER_ID = 'gdRXHrfxS0QTvTmDJttW4e7pIrl2'; // userId real do Firestore
  const TEST_GROUP_ID = 'OwZiFrYSs0l0RuZgMf3l'; // groupId real do Firestore
  const TEST_TOKEN = '1697524896535986548523649517594'; // BACKEND_SECRET/API_TOKEN do Vercel
  const TEST_CRON_SECRET = 'tabula-estelar-cron-2025'; // CRON_SECRET_TOKEN do Vercel

  async function testUnified(desc, url, options = {}) {
    try {
      const res = await fetch(url, options);
      const data = await res.json().catch(() => ({}));
      console.log(`\n[${desc}]`);
      console.log('Status:', res.status);
      console.log('Response:', data);
    } catch (e) {
      console.error(`Erro em ${desc}:`, e.message);
    }
  }

  // Subscription
  await testUnified('Subscription Status', `${BASE_URL}?route=subscription&action=status&userId=${TEST_USER_ID}`);
  await testUnified('Subscription Start Trial', `${BASE_URL}?route=subscription&action=start-trial`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId: TEST_USER_ID, planId: 'monthly' })
  });
  await testUnified('Subscription Cancel', `${BASE_URL}?route=subscription&action=cancel`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId: TEST_USER_ID })
  });
  await testUnified('Subscription Reactivate', `${BASE_URL}?route=subscription&action=reactivate`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId: TEST_USER_ID })
  });

  // Notification
  await testUnified('Notification Send', `${BASE_URL}?route=notification&action=send`, {
    method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${TEST_TOKEN}` },
    body: JSON.stringify({ token: 'FCM_TOKEN_AQUI', title: 'Teste', body: 'Mensagem de teste' })
  });
  await testUnified('Notification Webpush', `${BASE_URL}?route=notification&action=webpush`, {
    method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${TEST_TOKEN}` },
    body: JSON.stringify({ userId: TEST_USER_ID, title: 'Webpush', body: 'Mensagem webpush' })
  });
  await testUnified('Notification Cron Daily', `${BASE_URL}?route=notification&action=cron-daily`, {
    method: 'POST', headers: { Authorization: TEST_CRON_SECRET }
  });

  // Public
  await testUnified('Public Group Notify', `${BASE_URL}?route=public&action=group-notify`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ groupId: TEST_GROUP_ID, title: 'Alerta', body: 'Mensagem de grupo' })
  });
  await testUnified('Public Upload Profile Photo', `${BASE_URL}?route=public&action=upload-profile-photo`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId: TEST_USER_ID, dataUrl: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD...' })
  });
  await testUnified('Public Astro Positions', `${BASE_URL}?route=public&action=astro-positions`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ datetimeISO: '2025-09-02T12:00:00Z', lat: -23.5, lon: -46.6 })
  });
  await testUnified('Public Timezone', `${BASE_URL}?route=public&action=timezone&lat=-23.5&lon=-46.6&ts=1756785600`);

  // --- TESTES EXISTENTES ---
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