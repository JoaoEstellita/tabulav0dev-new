import { getApp, getApps, initializeApp } from 'firebase/app'
import { browserLocalPersistence, getAuth, setPersistence } from 'firebase/auth'
import { initializeFirestore } from 'firebase/firestore'
import { getMessaging } from 'firebase/messaging'
import { getStorage } from 'firebase/storage'
import { ReCaptchaV3Provider, getToken as getAppCheckSdkToken, initializeAppCheck } from 'firebase/app-check'

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || 'AIzaSyDPH1K_JQnyjGePrqYnEuTe5U-pJChUDrM',
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || 'tabula-estelar-84fdc.firebaseapp.com',
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || 'tabula-estelar-84fdc',
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || 'tabula-estelar-84fdc.appspot.com',
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '729037358278',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || '1:729037358278:web:35bd0e39a865439a00c3c7',
}

console.log('Firebase init config:', {
  apiKey: firebaseConfig.apiKey ? 'configured' : 'missing',
  authDomain: firebaseConfig.authDomain ? 'configured' : 'missing',
  projectId: firebaseConfig.projectId ? 'configured' : 'missing',
})

const app = getApps().length ? getApp() : initializeApp(firebaseConfig)
let appCheckInitialized = false
let appCheckInstance: any = null

const describeAppCheckKey = (value: string) => {
  if (!value) return { kind: 'missing', preview: 'missing' }
  if (value.startsWith('6L')) return { kind: 'recaptcha_site_key', preview: `${value.slice(0, 4)}...${value.slice(-4)}` }
  if (value.startsWith('AIza')) return { kind: 'firebase_api_key_incorrect', preview: `${value.slice(0, 4)}...${value.slice(-4)}` }
  return { kind: 'unknown_format', preview: `${value.slice(0, 4)}...${value.slice(-4)}` }
}

const initAppCheckWeb = async () => {
  if (typeof window === 'undefined') return
  const siteKey = (process.env.EXPO_PUBLIC_FIREBASE_APPCHECK_SITE_KEY || '').trim()
  const keyInfo = describeAppCheckKey(siteKey)
  console.log('App Check key diagnostic:', keyInfo)
  if (!siteKey) return

  const debugToken = (process.env.EXPO_PUBLIC_FIREBASE_APPCHECK_DEBUG_TOKEN || '').trim()
  if (debugToken) {
    ;(globalThis as any).FIREBASE_APPCHECK_DEBUG_TOKEN = debugToken
  }

  try {
    appCheckInstance = initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider(siteKey),
      isTokenAutoRefreshEnabled: true,
    })
    appCheckInitialized = true
    console.log('Firebase App Check initialized (web)')
  } catch (error) {
    console.warn('Failed to initialize App Check (web):', error)
  }
}
void initAppCheckWeb()

export const getAppCheckToken = async (): Promise<string | null> => {
  if (typeof window === 'undefined') return null
  const siteKey = (process.env.EXPO_PUBLIC_FIREBASE_APPCHECK_SITE_KEY || '').trim()
  if (!siteKey || !appCheckInitialized) return null
  try {
    if (!appCheckInstance) return null
    const tokenResult = await getAppCheckSdkToken(appCheckInstance, false)
    return tokenResult?.token || null
  } catch {
    return null
  }
}

const auth = getAuth(app)
try {
  void setPersistence(auth, browserLocalPersistence)
} catch {}

const db = initializeFirestore(app, {
  ignoreUndefinedProperties: true,
  experimentalForceLongPolling: true,
})

const storage = getStorage(app)

let messaging: ReturnType<typeof getMessaging> | undefined
if (typeof window !== 'undefined') {
  try {
    messaging = getMessaging(app)
  } catch {
    messaging = undefined
  }
}

console.log('Firebase initialized')

export { auth, db, messaging, storage }
