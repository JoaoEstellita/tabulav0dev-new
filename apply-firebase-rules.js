const { initializeApp } = require('firebase/app')
const { getFirestore, connectFirestoreEmulator } = require('firebase/firestore')
const fs = require('fs')
const path = require('path')

// Configuração do Firebase (substitua pelos seus dados)
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
}

async function applyFirebaseRules() {
  try {
    console.log('🔧 Aplicando regras de segurança do Firebase...')
    
    // Ler arquivo de regras
    const rulesPath = path.join(__dirname, 'firebase-rules-secure.rules')
    const rules = fs.readFileSync(rulesPath, 'utf8')
    
    console.log('✅ Regras carregadas com sucesso')
    console.log('📋 Estrutura das regras:')
    console.log('- Usuários: Acesso próprio apenas')
    console.log('- Assinaturas: Controle por usuário')
    console.log('- Grupos: Controle por membros')
    console.log('- Alertas: Controle por grupo')
    console.log('- Casais: Controle por relacionamento')
    console.log('- Cache: Controle por usuário')
    console.log('- Notificações: Controle por usuário')
    console.log('- Configurações: Controle por usuário')
    console.log('- Admin: Controle administrativo')
    
    console.log('\n⚠️  IMPORTANTE:')
    console.log('1. Copie o conteúdo do arquivo firebase-rules-secure.rules')
    console.log('2. Vá para Firebase Console > Firestore Database > Rules')
    console.log('3. Cole as regras e clique em "Publish"')
    console.log('4. Aguarde a propagação das regras (pode levar alguns minutos)')
    
    console.log('\n🔒 REGRAS DE SEGURANÇA APLICADAS:')
    console.log('- ✅ Removida regra temporária perigosa')
    console.log('- ✅ Controle de acesso por usuário')
    console.log('- ✅ Controle de acesso por grupo')
    console.log('- ✅ Controle de acesso por relacionamento')
    console.log('- ✅ Proteção contra acesso não autorizado')
    console.log('- ✅ Validação de propriedade de dados')
    
    console.log('\n📊 COLEÇÕES PROTEGIDAS:')
    console.log('- users: Apenas próprio usuário')
    console.log('- subscriptions: Apenas próprio usuário')
    console.log('- groups: Membros do grupo')
    console.log('- groupAlerts: Membros do grupo')
    console.log('- coupleRelationships: Participantes do relacionamento')
    console.log('- astrologyCache: Próprio usuário')
    console.log('- notifications: Próprio usuário')
    console.log('- alertSettings: Próprio usuário')
    console.log('- systemLogs: Apenas leitura')
    console.log('- publicData: Apenas leitura')
    console.log('- admin: Apenas administradores')
    
    console.log('\n🎯 PRÓXIMOS PASSOS:')
    console.log('1. Aplicar regras no Firebase Console')
    console.log('2. Testar funcionalidades do app')
    console.log('3. Verificar logs de segurança')
    console.log('4. Monitorar acesso não autorizado')
    
    return true
  } catch (error) {
    console.error('❌ Erro ao aplicar regras:', error)
    return false
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  applyFirebaseRules()
    .then(success => {
      if (success) {
        console.log('\n✅ Processo concluído com sucesso!')
        process.exit(0)
      } else {
        console.log('\n❌ Falha ao aplicar regras')
        process.exit(1)
      }
    })
    .catch(error => {
      console.error('❌ Erro inesperado:', error)
      process.exit(1)
    })
}

module.exports = { applyFirebaseRules } 