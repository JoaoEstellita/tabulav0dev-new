# QA Checklist Funcional - Tabula Estelar

Use this file for manual or semi-automatic execution.
Mark each item as `OK`, `NOK`, or `N/A` with notes and evidence.

## Execution metadata
- Date:
- Environment: `local` / `staging` / `production`
- Platform: `web` / `android` / `ios`
- Build/commit:
- Tester:

## 1) Onboarding
- [ ] Vertical scroll works on small screens (no clipped content)
- [ ] Language can be chosen at onboarding start
- [ ] Country can be selected and drives city search scope
- [ ] City search works for selected country
- [ ] Date/time validation works (`YYYY-MM-DD`, `HH:MM` or masks)
- [ ] Profile photo flow works (gallery/camera where supported)
- [ ] Intro/explanation step renders correctly
- [ ] Notification step shows semi-required popup and allows retry

Notes:

## 2) i18n (pt-BR, en-US, es-ES, it-IT)
- [ ] Home has no hardcoded text
- [ ] Onboarding has no hardcoded text
- [ ] Settings shows friendly text (no literal `settings.xxx` keys)
- [ ] Premium has no hardcoded text
- [ ] Notification labels and states follow selected language
- [ ] Changing language in Settings reflects immediately

Notes:

## 3) Subscription and access guards
- [ ] Profile shows correct subscription state
- [ ] Premium opens from Profile/Settings/Groups/Forecast CTAs
- [ ] Forecast and Groups guard behavior is correct without subscription
- [ ] Trial access rules are correct
- [ ] Admin bypass behavior is correct

Notes:

## 4) Payments - Mercado Pago
- [ ] Preference creation returns valid checkout URL
- [ ] Redirect opens checkout correctly
- [ ] Webhook updates subscription status
- [ ] Post-payment access reflects in app
- [ ] Cancel/failure returns consistent app state

Notes:

## 5) Payments - Stripe
- [ ] Checkout Session creation returns valid URL
- [ ] Redirect to Stripe Checkout works
- [ ] Stripe webhook reaches configured endpoint
- [ ] Subscription status updates after payment
- [ ] `success` and `cancel` flows are handled

Notes:

## 6) Notifications
- [ ] FCM registration works on mobile
- [ ] Web Push registration works on web/PWA
- [ ] Preferences persist and are respected
- [ ] Health/debug/dispatch routes run without index errors
- [ ] Disabled event types do not send push
- [ ] Throttle and daily limits are enforced

Notes:

## 7) Firestore/infra
- [ ] Required indexes are Enabled
- [ ] No `FAILED_PRECONDITION: missing index` errors
- [ ] Security/rules behavior is expected for critical collections

Notes:

## 8) Technical smoke
- [ ] `frontend: npm run guard:i18n`
- [ ] `frontend: npm run build`
- [ ] `backend: npm run dev` boots without errors
- [ ] Core backend routes smoke tested (`/health`, payment, push)

Notes:

## 9) Final result
- Overall status: `APPROVED` / `REJECTED`
- Blocking issues:
- Post-release follow-ups:
