import { initializeApp } from 'firebase/app'
import { initializeAuth, getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "AIzaSyBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "tabula-estelar.firebaseapp.com",
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "tabula-estelar",
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "tabula-estelar.appspot.com",
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "729037358278",
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "1:729037358278:web:XXXXXXXXXXXXXXXXXXXX",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Auth
const auth = getAuth(app)

// Initialize Firestore
const db = getFirestore(app)

// Initialize Storage
const storage = getStorage(app)

export { auth, db, storage }
