import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getMessaging } from "firebase/messaging"

const firebaseConfig = {
  apiKey: "AIzaSyDPH1K_JQnyjGePrqYnEuTe5U-pJChUDrM",
  authDomain: "tabula-estelar-84fdc.firebaseapp.com",
  projectId: "tabula-estelar-84fdc",
  storageBucket: "tabula-estelar-84fdc.firebasestorage.app",
  messagingSenderId: "729037358278",
  appId: "1:729037358278:web:35bd0e39a865439a00c3c7",
  measurementId: "G-24LHB4BH9L",
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)

// Configuração FCM para produção
let messaging: any = null
if (typeof window !== "undefined") {
  try {
    messaging = getMessaging(app)
  } catch (error) {
    console.log("FCM não disponível neste ambiente:", error)
  }
}

export { messaging }
export default app
