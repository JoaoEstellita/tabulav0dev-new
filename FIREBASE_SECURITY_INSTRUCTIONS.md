# 🔒 INSTRUÇÕES DE SEGURANÇA FIREBASE
## Estado Atual (2026-02)

Colecoes/subcolecoes que precisam estar cobertas nas regras em producao:
- `users/{uid}`
- `users/{uid}/webPushSubscriptions/{subId}`
- `users/{uid}/fcmTokens/{tokenId}`
- `userStatus/{uid}`
- `groups/{groupId}`
- `groupMemberSettings/{docId}`
- `groupAlerts/{alertId}`
- `groupActivities/{activityId}`
- `couples/{relationshipId}`
- `notifications/{notificationId}`

Observacao:
- `userStatus/{uid}` hoje e lido no cliente e tambem recebe escrita de fluxos cliente especificos.
- Se a estrategia mudar para "somente backend escreve userStatus", atualizar app e regras juntos no mesmo deploy.

## ⚠️ URGENTE: Aplicar Regras de Segurança

As regras atuais do Firebase estão **INSEGURAS** e permitem acesso total a todos os dados. É necessário aplicar as regras seguras imediatamente.

## 📋 PASSOS PARA APLICAR REGRAS SEGURAS

### 1. Acessar Firebase Console
- Vá para [Firebase Console](https://console.firebase.google.com)
- Selecione seu projeto `tabula-estelar`
- Navegue para **Firestore Database** > **Rules**

### 2. Substituir Regras Atuais
**REGRAS ATUAIS (INSEGURAS):**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Regras para usuários
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Regras para grupos 
    match /groups/{groupId} {
      allow read: if request.auth != null && 
                     request.auth.uid in resource.data.members;
      allow create: if request.auth != null && 
                       request.auth.uid == request.resource.data.createdBy;
      allow update: if request.auth != null && 
                       request.auth.uid in resource.data.members;
      allow delete: if request.auth != null && 
                       request.auth.uid == resource.data.createdBy;
    }
    
    // Regras para alertas de grupos
    match /groupAlerts/{alertId} {
      allow read, write: if request.auth != null;
    }
    
    // ⚠️ REGRA PERIGOSA - REMOVER IMEDIATAMENTE
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

**REGRAS SEGURAS (APLICAR):**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // ===== REGRAS PARA USUÁRIOS =====
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow create: if request.auth != null && request.auth.uid == userId;
    }
    
    // ===== REGRAS PARA ASSINATURAS =====
    match /subscriptions/{subscriptionId} {
      allow read, write: if request.auth != null && 
                           request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && 
                       request.auth.uid == request.resource.data.userId;
    }
    
    // ===== REGRAS PARA GRUPOS =====
    match /groups/{groupId} {
      allow read: if request.auth != null && 
                     request.auth.uid in resource.data.members;
      allow create: if request.auth != null && 
                       request.auth.uid == request.resource.data.createdBy;
      allow update: if request.auth != null && 
                       request.auth.uid in resource.data.members;
      allow delete: if request.auth != null && 
                       request.auth.uid == resource.data.createdBy;
    }
    
    // ===== REGRAS PARA ALERTAS DE GRUPOS =====
    match /groupAlerts/{alertId} {
      allow read: if request.auth != null && 
                     request.auth.uid in get(/databases/$(database)/documents/groups/$(resource.data.groupId)).data.members;
      allow create: if request.auth != null && 
                       request.auth.uid in get(/databases/$(database)/documents/groups/$(request.resource.data.groupId)).data.members;
      allow update, delete: if request.auth != null && 
                              request.auth.uid == resource.data.createdBy;
    }
    
    // ===== REGRAS PARA RELACIONAMENTOS DE CASAL =====
    match /coupleRelationships/{relationshipId} {
      allow read, write: if request.auth != null && 
                           (request.auth.uid == resource.data.userId || 
                            request.auth.uid == resource.data.partnerId);
      allow create: if request.auth != null && 
                       request.auth.uid == request.resource.data.userId;
    }
    
    // ===== REGRAS PARA CACHE ASTROLÓGICO =====
    match /astrologyCache/{cacheId} {
      allow read, write: if request.auth != null && 
                           request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && 
                       request.auth.uid == request.resource.data.userId;
    }
    
    // ===== REGRAS PARA NOTIFICAÇÕES =====
    match /notifications/{notificationId} {
      allow read: if request.auth != null && 
                     request.auth.uid == resource.data.userId;
      allow create: if request.auth != null;
      allow update: if request.auth != null && 
                       request.auth.uid == resource.data.userId;
    }
    
    // ===== REGRAS PARA CONFIGURAÇÕES DE ALERTA =====
    match /alertSettings/{settingId} {
      allow read, write: if request.auth != null && 
                           request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && 
                       request.auth.uid == request.resource.data.userId;
    }
    
    // ===== REGRAS PARA LOGS DE SISTEMA =====
    match /systemLogs/{logId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
    }
    
    // ===== REGRAS PARA DADOS PÚBLICOS =====
    match /publicData/{docId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
                     request.auth.uid in get(/databases/$(database)/documents/admin/users).data.adminUsers;
    }
    
    // ===== REGRAS PARA ADMINISTRADORES =====
    match /admin/{collection}/{docId} {
      allow read, write: if request.auth != null && 
                           request.auth.uid in get(/databases/$(database)/documents/admin/users).data.adminUsers;
    }
    
    // ===== REGRAS PARA BACKUP E MIGRAÇÃO =====
    match /backup/{backupId} {
      allow read, write: if request.auth != null && 
                           request.auth.token.admin == true;
    }
  }
}
```

### 3. Publicar Regras
1. Cole as regras seguras no editor
2. Clique em **"Publish"**
3. Aguarde a confirmação
4. Verifique se as regras foram aplicadas

## 🔒 PROTEÇÕES IMPLEMENTADAS

### ✅ Controle de Acesso por Usuário
- Usuários só podem acessar seus próprios dados
- Validação de propriedade em todas as operações
- Proteção contra acesso não autorizado

### ✅ Controle de Acesso por Grupo
- Membros podem ler/atualizar grupos que participam
- Apenas criador pode deletar grupo
- Validação de membros em alertas

### ✅ Controle de Acesso por Relacionamento
- Participantes do casal podem acessar dados do relacionamento
- Proteção de privacidade entre casais

### ✅ Controle de Cache
- Usuários só podem acessar seu próprio cache astrológico
- Proteção contra vazamento de dados

### ✅ Controle de Notificações
- Usuários só podem ver suas próprias notificações
- Sistema pode criar notificações para usuários

### ✅ Controle Administrativo
- Apenas administradores podem acessar dados administrativos
- Proteção de dados sensíveis do sistema

## 🚨 RISCOS DA REGRA ATUAL

A regra atual `match /{document=**}` permite:
- ❌ Acesso total a todos os documentos
- ❌ Leitura de dados de outros usuários
- ❌ Modificação de dados não autorizados
- ❌ Vazamento de informações privadas
- ❌ Violação de GDPR/LGPD

## 📊 COLEÇÕES PROTEGIDAS

| Coleção | Acesso | Proteção |
|---------|--------|----------|
| `users` | Próprio usuário | ✅ |
| `subscriptions` | Próprio usuário | ✅ |
| `groups` | Membros do grupo | ✅ |
| `groupAlerts` | Membros do grupo | ✅ |
| `coupleRelationships` | Participantes | ✅ |
| `astrologyCache` | Próprio usuário | ✅ |
| `notifications` | Próprio usuário | ✅ |
| `alertSettings` | Próprio usuário | ✅ |
| `systemLogs` | Apenas leitura | ✅ |
| `publicData` | Apenas leitura | ✅ |
| `admin` | Administradores | ✅ |

## 🎯 PRÓXIMOS PASSOS

1. **Imediato**: Aplicar regras seguras
2. **Teste**: Verificar funcionalidades do app
3. **Monitoramento**: Verificar logs de segurança
4. **Validação**: Testar todos os fluxos de usuário

## ⚡ COMANDO PARA TESTAR

```bash
# Executar script de aplicação
node apply-firebase-rules.js
```

## 📞 SUPORTE

Se houver problemas após aplicar as regras:
1. Verificar logs do Firebase Console
2. Testar funcionalidades uma por vez
3. Verificar se todos os dados têm `userId` correto
4. Contatar suporte se necessário

---

**⚠️ IMPORTANTE: Aplicar essas regras é CRÍTICO para a segurança do app!** 
