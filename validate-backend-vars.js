// Script para validar variáveis do backend
const axios = require('axios')

const BACKEND_URL = 'https://tabulav0dev-backend.vercel.app'

async function validateBackendVars() {
  console.log('🔍 Validando variáveis do backend no Vercel...\n')
  
  try {
    // Testar subscription com debug para ver variáveis
    const response = await axios({
      method: 'post',
      url: `${BACKEND_URL}/api/subscription`,
      data: { userId: 'test', action: 'debug' },
      headers: { 'Content-Type': 'application/json' },
      timeout: 10000
    });
    
    console.log('✅ Debug Response:', JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.error('❌ Erro no debug:', error.response?.status || error.message);
    if (error.response?.data) {
      console.error('📄 Detalhes:', error.response.data);
    }
  }
  
  console.log('\n📋 VARIÁVEIS NECESSÁRIAS NO BACKEND VERCEL:');
  console.log('🔴 OBRIGATÓRIAS:');
  console.log('   FIREBASE_PROJECT_ID=tabula-estelar-84fdc');
  console.log('   FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@tabula-estelar-84fdc.iam.gserviceaccount.com');
  console.log('   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\n[CHAVE COMPLETA]\\n-----END PRIVATE KEY-----"');
  console.log('   MERCADO_PAGO_ACCESS_TOKEN=[seu token]');
  console.log('   VAPID_PUBLIC_KEY=BOLOXfFeZnSCZpQ0XJRwbibE0Cjwd70UIRObllu6c18RpX6_IJfHGsSsQ-517uG0Wjp53O3Lici8fvnTuu9Obks');
  console.log('   VAPID_PRIVATE_KEY=AjC4Gr1Pyx6Iif1PHoMJBISPsHM03-qtPy_Biy15gBKRGxJHQN6Tk-Gq3nIHCDYtF');
  console.log('   CRON_SECRET_TOKEN=tabula-estelar-cron-2025');
  
  console.log('\n🟡 JÁ CONFIGURADAS:');
  console.log('   ✅ ALLOWED_ORIGINS');
  console.log('   ✅ FIREBASE_STORAGE_BUCKET');
  console.log('   ❌ FIREBASE_PRIVATE_KEY (incompleta)');
}

validateBackendVars();
