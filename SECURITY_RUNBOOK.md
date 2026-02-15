# Security Runbook (Frontend)

## Goal

Keep frontend security controls operational without blocking delivery quality.

## Active Controls

- `SECURITY.md` (private vulnerability reporting policy)
- `.github/dependabot.yml` (weekly dependency updates)
- `.github/workflows/security-smoke.yml`
  - TypeScript check
  - `smoke:rc`
  - Firestore rules tests
  - `npm audit --omit=dev --audit-level=high`

## Daily/Release Checklist

1. Confirm latest GitHub Action `Security Smoke` is green.
2. Confirm `npm run smoke:security` passes locally before release.
3. Confirm `status-policy` loading works in login and authenticated flows.
4. Confirm no CORS/auth errors in browser console for:
   - `/api/status-policy`
   - `/api/subscription`
5. Confirm App Check initializes without blocking user flow.

## Alert Triage

### Dependabot alert (frontend)

1. Classify scope:
   - `development` only
   - production/runtime
2. If production runtime and severity high/critical:
   - patch immediately
   - run `smoke:security`
   - release with short note
3. If development-only:
   - batch in scheduled maintenance PR
   - validate build/test before merge

### CI failure

1. Identify failing job step.
2. Reproduce locally with the same command.
3. Fix and re-run.
4. Merge only when security workflow is green.

## Incident Response (Frontend)

If secret/token leak or suspicious client behavior is detected:

1. Rotate affected key/secret in provider console.
2. Update Vercel environment variables.
3. Redeploy frontend.
4. Invalidate cached service worker/site data if required.
5. Document incident in internal changelog.

## Ownership

- Security triage owner: project maintainer
- SLA target:
  - initial triage: 72h
  - high severity fix: as soon as possible

