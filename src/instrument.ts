import * as Sentry from '@sentry/react-native'
import { Platform } from 'react-native'

// Sentry.init o mais cedo possível — ANTES de qualquer import do app.
// `index.ts` importa este módulo na PRIMEIRA linha, então o handler (nativo + JS)
// já está armado quando os módulos do App (firebase, providers, navigation) são
// avaliados. Um crash nessa avaliação de boot acontecia antes do Sentry.init que
// vivia no topo do App.tsx (a linha 22 roda DEPOIS dos imports das linhas 1-16),
// por isso o crash de lançamento nunca era capturado. Armando aqui, ele é.
//
// Inerte na web e sem DSN: `enabled` só liga com DSN presente fora do browser —
// não afeta o PWA.
Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  enabled: !!process.env.EXPO_PUBLIC_SENTRY_DSN && Platform.OS !== 'web',
  enableNativeCrashHandling: true,
  tracesSampleRate: 0,
})
