#!/usr/bin/env node

console.log(`
🚨 APLICAR REGRAS FIREBASE - EMERGÊNCIA 🚨

INSTRUÇÕES PARA APLICAR AS REGRAS EMERGENCIAIS:

1. Abra o Firebase Console: https://console.firebase.google.com/
2. Selecione seu projeto: tabula-estelar-new
3. Vá em "Firestore Database" > "Rules"
4. COLE O CONTEÚDO ABAIXO substituindo TUDO:

=== INÍCIO DAS REGRAS ===
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /astrologyCache/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /groups/{groupId} {
      allow read, write: if request.auth != null;
    }
    
    match /groupAlerts/{alertId} {
      allow read, write: if request.auth != null;
    }
    
    match /coupleRelationships/{relationshipId} {
      allow read, write: if request.auth != null;
    }
    
    match /notifications/{notificationId} {
      allow read, write: if request.auth != null;
    }
    
    match /subscriptions/{subscriptionId} {
      allow read, write: if request.auth != null;
    }
    
    match /alertSettings/{settingId} {
      allow read, write: if request.auth != null;
    }
    
    match /systemLogs/{logId} {
      allow read, write: if request.auth != null;
    }
  }
}
=== FIM DAS REGRAS ===

5. Clique em "Publicar"
6. Aguarde 1-2 minutos para propagação
7. Teste o app novamente

🎯 ESSAS REGRAS SÃO MAIS SIMPLES E DEVEM RESOLVER O PROBLEMA!
`)

process.exit(0)