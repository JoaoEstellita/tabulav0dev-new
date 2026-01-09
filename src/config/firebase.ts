import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth'
import { initializeFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const defaultAuthDomain =
  process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "tabula-estelar-84fdc.firebaseapp.com"
const runtimeAuthDomain =
  typeof window !== 'undefined' && /(^|\.)tabulaestelar\.com\.br$/i.test(window.location.hostname)
    ? window.location.hostname
    : defaultAuthDomain

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "AIzaSyDPH1K_JQnyjGePrqYnEuTe5U-pJChUDrM",
  authDomain: runtimeAuthDomain,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "tabula-estelar-84fdc",
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "tabula-estelar-84fdc.appspot.com",
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "729037358278",
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "1:729037358278:web:35bd0e39a865439a00c3c7",
}

console.log('🔥 Inicializando Firebase com config real:', {
  apiKey: firebaseConfig.apiKey ? '✅ Configurado' : '❌ Não configurado',
  authDomain: firebaseConfig.authDomain ? '✅ Configurado' : '❌ Não configurado',
  projectId: firebaseConfig.projectId ? '✅ Configurado' : '❌ Não configurado',
})

// Initialize Firebase (singleton)
const app = getApps().length ? getApp() : initializeApp(firebaseConfig)

// Initialize Auth + persistência local no Web
const auth = getAuth(app)
// Ignorar erro assíncrono de ambientes nativos sem localStorage
try {
  void setPersistence(auth, browserLocalPersistence)
} catch {}

// Initialize Firestore com endurecimento para Web
const db = initializeFirestore(app, {
  ignoreUndefinedProperties: true,
  experimentalForceLongPolling: true,
  useFetchStreams: false,
})

// Initialize Storage
const storage = getStorage(app)

console.log('✅ Firebase inicializado com sucesso')

export { auth, db, storage }
