# Tabula Estelar - Backend

Backend Node.js serverless (Vercel) para astrologia, notificações, grupos, uploads, assinatura e integrações.

## Endpoints principais

### Astrologia
- `POST /api/public?action=astro-positions` — Cálculo de posições planetárias e casas.

### Notificações
- `POST /api/notification/send` — Envio individual de push (FCM). Header: `Authorization: Bearer <BACKEND_SECRET>`.
- `POST /api/notification/webpush` — Envio de Web Push. Header: `Authorization: Bearer <BACKEND_SECRET>`.
- `POST /api/notification/cron-daily` — Notificações automáticas (cron). Header: `Authorization: CRON_SECRET_TOKEN`.

### Assinatura/Pagamento
- `POST /api/mercado-pago/create-preference` — Criação de preferência de pagamento Mercado Pago.
- `POST /api/mercado-pago/webhook` — Webhook Mercado Pago (público).
- `GET/POST /api/subscription` — Gerenciamento de assinatura (status, trial, cancel, reativar).

### Grupos
- `POST /api/public?action=group-notify` — Notificação para membros do grupo.

### Uploads
- `POST /api/public?action=upload-profile-photo` — Upload de foto de perfil (Firebase Storage).

### Timezone
- `GET /api/public?action=timezone&lat=...&lon=...&ts=...` — Proxy para Google Time Zone API.

## Variáveis de Ambiente (Vercel)

- `ALLOWED_ORIGINS` — Domínios permitidos para CORS
- `BACKEND_SECRET` — Token de autenticação dos endpoints protegidos (use também API_TOKEN para compatibilidade temporária)
- `CRON_SECRET_TOKEN` — Token para cron job
- `VAPID_PUBLIC_KEY` / `VAPID_PRIVATE_KEY` — Web Push
- `FIREBASE_PROJECT_ID`, `FIREBASE_PRIVATE_KEY_ID`, `FIREBASE_PRIVATE_KEY`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_CLIENT_ID` — Firebase Admin
- `FIREBASE_STORAGE_BUCKET` — Firebase Storage
- `MERCADO_PAGO_ACCESS_TOKEN` — Token Mercado Pago
- `GOOGLE_TZ_KEY` — Chave Google Time Zone API

## Exemplo de chamada protegida (frontend)

```js
fetch('/api/notification/send', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  'Authorization': 'Bearer <BACKEND_SECRET>'
  },
  body: JSON.stringify({ token, title, body, data })
})
```

## Deploy no Vercel
1. Conecte este repositório ao Vercel
2. Configure todas as variáveis de ambiente acima
3. Deploy automático

## Observações
- Todos os endpoints são públicos, exceto onde indicado (proteção por token).
- Webhook do Mercado Pago deve permanecer público.
- Endpoints de grupo, upload, astrologia e timezone foram unificados em `/api/public` via parâmetro `action`.
- Consulte o código de cada endpoint para detalhes de parâmetros e respostas.