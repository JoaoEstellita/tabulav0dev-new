# Firebase Security Instructions (Runtime 2026-02)

Este documento substitui instrucoes antigas e deve refletir somente colecoes reais em uso.

## Single Source of Truth
- Regras ativas do projeto web/mobile: `frontend/firebase-rules-production.rules`
- Versao endurecida para validacao local: `frontend/firebase-rules-secure.rules`

## Colecoes e Subcolecoes em Runtime
- `users/{uid}`
- `users/{uid}/webPushSubscriptions/{subId}`
- `users/{uid}/fcmTokens/{tokenId}`
- `userStatus/{uid}`
- `groups/{groupId}`
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
  - write: bloquear cliente direto (fluxo oficial via backend/Admin SDK)

### Push e tokens
- `users/{uid}/webPushSubscriptions/{subId}`: read/write somente proprio usuario
- `users/{uid}/fcmTokens/{tokenId}`: read/write somente proprio usuario

### Grupos
- `groups`: leitura e update apenas para membros
- `groupMemberSettings`, `groupActivities`, `groupAlerts`: validar membro do grupo

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

## Anti-drift
- Nao usar colecoes legadas neste documento (`coupleRelationships`, `astrologyCache`, etc.)
- Qualquer nova colecao de runtime deve ser adicionada aqui e nas rules no mesmo PR.
