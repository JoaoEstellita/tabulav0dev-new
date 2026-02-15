# Firebase Security Instructions (Runtime 2026-02)

Este documento substitui instrucoes antigas e deve refletir somente colecoes reais em uso.

## Single Source of Truth
- Regras ativas do projeto web/mobile: `frontend/firebase-rules-production.rules`
- Versao endurecida para validacao local: `frontend/firebase-rules-secure.rules`

## Colecoes e Subcolecoes em Runtime
- `users/{uid}`
- `users/{uid}/webPushSubscriptions/{subId}`
- `users/{uid}/fcmTokens/{tokenId}`
- `fcmTokens/{docId}` (legado de compatibilidade)
- `userStatus/{uid}`
- `groups/{groupId}`
- `groups/{groupId}/memberStatus/{uid}`
- `groupMemberSettings/{docId}`
- `groupActivities/{activityId}`
- `groupAlerts/{alertId}`
- `couples/{relationshipId}`
- `notifications/{notificationId}`
- `hot_users/{uid}`
- `hot_queue/{hourKey}/items/{uid}`
- `notification_throttle_*` (colecoes de throttle)

## Politica recomendada por dominio
### Perfil e status
- `users/{uid}`: read/write somente `request.auth.uid == uid`
- `userStatus/{uid}`:
  - read: somente o proprio usuario
  - write: bloqueado no cliente (fluxo oficial via backend/Admin SDK)

### Push e tokens
- `users/{uid}/webPushSubscriptions/{subId}`: read/write somente proprio usuario
- `users/{uid}/fcmTokens/{tokenId}`: read/write somente proprio usuario
- `fcmTokens/{docId}`: somente dono (`userId`) para compatibilidade de clientes antigos

### Grupos
- `groups`: leitura e update apenas para membros
- `groups/{groupId}/memberStatus/{uid}`: leitura para membro; escrita so do proprio uid membro
- `groupMemberSettings`: leitura/escrita apenas do proprio uid membro
- `groupActivities`, `groupAlerts`: leitura para membro; escrita somente backend/Admin SDK

### Notificacoes
- `notifications`: leitura apenas para dono (`userId == request.auth.uid`)
- escrita de sistema via backend/Admin SDK

## Publicacao segura
1. Abrir Firebase Console > Firestore > Rules
2. Publicar `frontend/firebase-rules-production.rules`
3. Validar fluxos:
   - login
   - profile/status
   - groups
   - notifications
4. Revisar logs de negacao de regra no console

## App Check (Web)
- Variavel obrigatoria para ativar: `EXPO_PUBLIC_FIREBASE_APPCHECK_SITE_KEY`
- Variavel opcional de debug local: `EXPO_PUBLIC_FIREBASE_APPCHECK_DEBUG_TOKEN`
- Com site key configurada, o app inicializa App Check no bootstrap do Firebase (`src/config/firebase.ts`).
- Em desenvolvimento, usar debug token apenas localmente (nao publicar em ambiente produtivo).

## Anti-drift
- Nao usar colecoes legadas neste documento (`coupleRelationships`, `astrologyCache`, etc.)
- Qualquer nova colecao de runtime deve ser adicionada aqui e nas rules no mesmo PR.
