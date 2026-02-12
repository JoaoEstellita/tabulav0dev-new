# Handoff Completo - Tabula Estelar

Updated at: 2026-02-12 17:11:05 -03:00

## 1) Current snapshot
- Workspace has two apps:
  - `frontend` (Expo React Native Web + mobile)
  - `backend` (Node Express serverless)
- Payments are hybrid:
  - Mercado Pago / Pix (Brazil)
  - Stripe Checkout (international)
- Notifications:
  - In-app + push (FCM mobile + Web Push PWA)
  - Backend orchestration with preferences and throttling
- i18n:
  - Languages: `pt-BR`, `en-US`, `es-ES`, `it-IT`
  - Onboarding/Settings mostly migrated, with open i18n key gaps in Settings (see section 8)

## 2) Project structure
- Root: `d:\tabulaestelar`
- Backend: `d:\tabulaestelar\backend`
  - Entry: `backend/server.js`
  - Env validation: `backend/validate-env.js`
- Frontend: `d:\tabulaestelar\frontend`
  - Entry: `frontend/index.ts`
  - i18n: `frontend/src/i18n/appI18n.ts`
  - Onboarding: `frontend/src/screens/onboarding/*`
  - Premium/Payments: `frontend/src/screens/premium/*`, `frontend/src/services/payment/*`
  - Settings: `frontend/src/screens/settings/SettingsScreen.tsx`

## 3) Local run
### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run build
```

## 4) Environment map
Do not commit secrets.

### Backend (`backend/.env`)
- Firebase core:
  - `FIREBASE_PROJECT_ID`
  - `FIREBASE_CLIENT_EMAIL`
  - `FIREBASE_PRIVATE_KEY`
  - `FIREBASE_STORAGE_BUCKET` (optional)
- App/API:
  - `FRONTEND_URL` (must include `https://` in production)
  - `ALLOWED_ORIGINS`
  - `NODE_ENV`
- Mercado Pago:
  - `MERCADO_PAGO_ACCESS_TOKEN`
  - `MERCADO_PAGO_WEBHOOK_SECRET`
- Stripe:
  - `STRIPE_SECRET_KEY`
  - `STRIPE_WEBHOOK_SECRET`
  - `STRIPE_PRICE_ESSENTIAL_MONTHLY`
  - `STRIPE_PRICE_PRO_MONTHLY`
  - `STRIPE_PRICE_PREMIUM_MONTHLY`
- Push:
  - `VAPID_PUBLIC_KEY`
  - `VAPID_PRIVATE_KEY`
  - `VAPID_SUBJECT`
- Cron/ops:
  - `CRON_SECRET`
  - `CRON_LOG_TOKEN` (if used)

### Frontend build env
- Backend/site:
  - `EXPO_PUBLIC_BACKEND_URL`
  - `EXPO_PUBLIC_FRONTEND_URL` / `EXPO_PUBLIC_SITE_URL`
- Firebase public keys:
  - `EXPO_PUBLIC_FIREBASE_API_KEY`
  - `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN`
  - `EXPO_PUBLIC_FIREBASE_PROJECT_ID`
  - `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET`
  - `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
  - `EXPO_PUBLIC_FIREBASE_APP_ID`
- Web push:
  - `EXPO_PUBLIC_VAPID_PUBLIC_KEY`

## 5) Critical flows
### Subscription/payment
- Frontend chooses provider (Mercado Pago or Stripe).
- Backend creates checkout session/preference.
- Webhooks update subscription status.
- Premium/Profile/Settings and guards use this status for access.

### Notifications
- User preferences in Firestore.
- Backend cron/dispatch generates notifications.
- Push channels:
  - FCM (mobile token)
  - Web Push (service worker subscription)
- Firestore indexes for notifications must be Enabled.

### Onboarding + i18n
- Language selection at start.
- Country + city birth data flow.
- Notification permission step with retry.

## 6) Useful commands
### Frontend
```bash
cd frontend
npm run guard:i18n
npm run build
```

### Backend
```bash
cd backend
npm run dev
npm run astro:daily
npm run astro:hourly
```

### Firestore indexes
```bash
cd frontend
firebase deploy --only firestore:indexes
```

## 7) QA reference
- Functional checklist file: `QA_CHECKLIST_FUNCIONAL.md`

## 8) Open technical items
### P0 - Settings i18n key gaps
There are new keys used by `frontend/src/screens/settings/SettingsScreen.tsx` that are not present in `frontend/src/i18n/appI18n.ts`.
Examples:
- `settings.section.*`
- `settings.item.*`
- `settings.push.*`
- `settings.profile.*`
- `settings.houses.desc.*`

Impact:
- User may see literal keys (for example `settings.xxx`) in UI.

Recommended action:
- Add missing keys for all 4 languages or use a fallback helper (`tr(...)`) consistently in Settings.

### P1 - Backend generated text localization
- Ensure status/interpretations/notification text generation always respects user language.

### P1 - Payment QA final pass
- Validate success/cancel/failure for both providers.
- Confirm webhook idempotency and production updates.

## 9) Next logical step
1. Close P0 i18n gaps in Settings.
2. Run full `QA_CHECKLIST_FUNCIONAL.md`.
3. Validate real payment end-to-end for Stripe and Mercado Pago.
4. Freeze baseline and start AI assistant feature scope.

## Mandatory i18n rule
- Any UI or content change must be reviewed for all configured languages (pt-BR, en-US, es-ES, it-IT).
- Before finishing a task, confirm whether new/changed strings need keys in frontend/src/i18n/appI18n.ts.
- Avoid hardcoded strings in screens/components. Prefer translation keys with fallback only as temporary safety.



