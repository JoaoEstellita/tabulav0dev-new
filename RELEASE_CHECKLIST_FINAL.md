# Release Checklist Final

Use this checklist before any production release.

## 1. Build and Guard
- `npm run guard:i18n` passes.
- `npm run build` passes.
- No new hardcoded UI text in onboarding/settings/premium/profile/groups.

## 2. Multilanguage
- Validate `pt-BR`, `en-US`, `es-ES`, `it-IT` in:
  - Onboarding
  - Profile
  - Settings
  - Premium
  - Groups
  - Forecast
- Confirm all new/changed strings have keys in `src/i18n/appI18n.ts`.

## 3. Onboarding
- Flow is scrollable on mobile/web.
- Language selector works on first step.
- Country selector works.
- Birth location selection works after country selection.
- Intro step appears before account completion.
- Notification step shows semi-required prompt with retry path.

## 4. Premium and Access Guards
- Premium screen loads without crashes.
- Payment provider selector works:
  - Mercado Pago/Pix
  - Stripe/International
- Access guards work for blocked features:
  - Forecast
  - Groups
- Profile/settings banners and premium status display are consistent.

## 5. Payment End-to-End
- Mercado Pago:
  - Checkout opens
  - Webhook updates subscription
  - Premium unlock happens after success
- Stripe:
  - Checkout session opens
  - Success callback includes `provider=stripe&session_id=...`
  - `sync-checkout-session` updates subscription
  - Premium unlock happens after success

## 6. Notifications and Preferences
- Notification options screen scrolls correctly.
- Push/in-app toggles save and persist after reload.
- Group and forecast filters persist.
- Critical/personal/group alerts respect selected filters.

## 7. Smoke Navigation
- Login -> Home -> Profile -> Settings -> Premium -> Groups -> Forecast.
- No blank screens.
- No blocking JS runtime errors in console.

## 8. Release Notes and Handoff
- Update `HANDOFF_COMPLETO.md` with:
  - What changed
  - New env vars
  - Manual setup steps
  - Known limitations
- Keep this file updated when adding new critical flows.
