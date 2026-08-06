import { getApp, getApps, initializeApp } from 'firebase/app'
import { getAuth, setPersistence } from 'firebase/auth'
import { initializeFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { Platform } from 'react-native'

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || 'AIzaSyDPH1K_JQnyjGePrqYnEuTe5U-pJChUDrM',
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || 'tabula-estelar-84fdc.firebaseapp.com',
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || 'tabula-estelar-84fdc',
  // Projetos criados a partir de out/2024 usam .firebasestorage.app; o bucket
  // .appspot.com nao existe neste projeto.
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || 'tabula-estelar-84fdc.firebasestorage.app',
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '729037358278',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || '1:729037358278:web:35bd0e39a865439a00c3c7',
}

if (__DEV__) console.log('Firebase init config:', {
  apiKey: firebaseConfig.apiKey ? 'configured' : 'missing',
  authDomain: firebaseConfig.authDomain ? 'configured' : 'missing',
  projectId: firebaseConfig.projectId ? 'configured' : 'missing',
})

const app = getApps().length ? getApp() : initializeApp(firebaseConfig)
let appCheckInitialized = false
let appCheckInstance: any = null
let appCheckDisabledForSession = false

const describeAppCheckKey = (value: string) => {
  if (!value) return { kind: 'missing', preview: 'missing' }
  if (value.startsWith('6L')) return { kind: 'recaptcha_site_key', preview: `${value.slice(0, 4)}...${value.slice(-4)}` }
  if (value.startsWith('AIza')) return { kind: 'firebase_api_key_incorrect', preview: `${value.slice(0, 4)}...${value.slice(-4)}` }
  return { kind: 'unknown_format', preview: `${value.slice(0, 4)}...${value.slice(-4)}` }
}

const initAppCheckWeb = async () => {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return
  try {
    const { ReCaptchaV3Provider, initializeAppCheck: initAC } = await import('firebase/app-check')
    const siteKey = (process.env.EXPO_PUBLIC_FIREBASE_APPCHECK_SITE_KEY || '').trim()
    const keyInfo = describeAppCheckKey(siteKey)
    const appCheckInfo = {
      projectId: firebaseConfig.projectId,
      appId: firebaseConfig.appId,
      siteKeyKind: keyInfo.kind,
      siteKeyPreview: keyInfo.preview,
      origin: window.location.origin,
    }
      ; (globalThis as any).__APPCHECK_INFO__ = appCheckInfo
    if (__DEV__) console.log('App Check key diagnostic:', appCheckInfo)
    if (!siteKey) return
    if (keyInfo.kind !== 'recaptcha_site_key') {
      console.warn(
        'App Check disabled: EXPO_PUBLIC_FIREBASE_APPCHECK_SITE_KEY is not a valid reCAPTCHA site key format.'
      )
      return
    }

    const debugToken = (process.env.EXPO_PUBLIC_FIREBASE_APPCHECK_DEBUG_TOKEN || '').trim()
    if (debugToken) {
      ; (globalThis as any).FIREBASE_APPCHECK_DEBUG_TOKEN = debugToken
    }

    appCheckInstance = initAC(app, {
      provider: new ReCaptchaV3Provider(siteKey),
      isTokenAutoRefreshEnabled: true,
    })
    appCheckInitialized = true
    if (__DEV__) console.log('Firebase App Check initialized (web)')
  } catch (error) {
    console.warn('Failed to initialize App Check (web):', error)
  }
}
void initAppCheckWeb()

export const getAppCheckToken = async (): Promise<string | null> => {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return null
  const siteKey = (process.env.EXPO_PUBLIC_FIREBASE_APPCHECK_SITE_KEY || '').trim()
  if (!siteKey || !appCheckInitialized || appCheckDisabledForSession) return null
  try {
    if (!appCheckInstance) return null
    const { getToken: getAppCheckSdkToken } = await import('firebase/app-check')
    const tokenResult = await getAppCheckSdkToken(appCheckInstance, false)
    return tokenResult?.token || null
  } catch (error: any) {
    const msg = String(error?.message || error || '').toLowerCase()
    if (msg.includes('403') || msg.includes('forbidden') || msg.includes('throttle')) {
      appCheckDisabledForSession = true
      console.warn('App Check disabled for this session after token failure:', error)
    }
    return null
  }
}

const auth = getAuth(app)
if (Platform.OS === 'web') {
  try {
    import('firebase/auth').then(({ browserLocalPersistence }) => {
      setPersistence(auth, browserLocalPersistence).catch(() => { })
    }).catch(() => { })
  } catch { }
}

const db = initializeFirestore(app, {
  ignoreUndefinedProperties: true,
  experimentalForceLongPolling: true,
})

const storage = getStorage(app)

let messaging: any = undefined
if (Platform.OS === 'web' && typeof window !== 'undefined') {
  try {
    const firebaseMessaging = require('firebase/messaging')
    messaging = firebaseMessaging.getMessaging(app)
  } catch {
    messaging = undefined
  }
}

if (__DEV__) console.log('Firebase initialized')

export { auth, db, messaging, storage }
