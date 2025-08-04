// Script para debugar permissões do Firebase
const admin = require('firebase-admin')

// Verificar se as regras estão sendo aplicadas corretamente
function debugFirebaseRules() {
  console.log('🔍 Debugando regras do Firebase...')
  console.log('')
  console.log('📋 Checklist de verificação:')
  console.log('1. ✓ Regras aplicadas no Firebase Console')
  console.log('2. ❓ Usuário autenticado corretamente')
  console.log('3. ❓ UID do usuário corresponde aos documentos')
  console.log('4. ❓ Estrutura dos documentos está correta')
  console.log('')
  
  console.log('🚨 Possíveis causas do erro "Missing or insufficient permissions":')
  console.log('1. Regras não propagaram completamente (pode levar até 10 minutos)')
  console.log('2. Usuário não está autenticado no momento da operação')
  console.log('3. UID do usuário não corresponde ao documento sendo acessado')
  console.log('4. Estrutura do documento não atende às validações das regras')
  console.log('5. Cache do Firebase ainda tem regras antigas')
  console.log('')
  
  console.log('🔧 Ações recomendadas:')
  console.log('1. Verificar no Firebase Console > Authentication se o usuário está logado')
  console.log('2. Verificar no Firestore > Data se os documentos existem')
  console.log('3. Verificar no Firestore > Rules se as regras estão publicadas')
  console.log('4. Tentar logout/login no app para limpar cache')
  console.log('5. Aguardar 10 minutos após aplicar regras')
  console.log('')
  
  console.log('📱 No app, adicionar logs de debug para:')
  console.log('- auth.currentUser?.uid')
  console.log('- Caminho do documento sendo acessado')
  console.log('- Timestamp da operação')
}

debugFirebaseRules()