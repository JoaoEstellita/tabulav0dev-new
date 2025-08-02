"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import {
  type User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithCredential,
} from "firebase/auth"
import { auth, db } from "../config/firebase"
import { doc, getDoc } from "firebase/firestore"
import { GoogleSignin } from '@react-native-google-signin/google-signin'

interface AuthContextType {
  user: User | null
  loading: boolean
  birthDataComplete: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  logout: () => Promise<void>
  checkBirthDataComplete: () => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [birthDataComplete, setBirthDataComplete] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('🔐 Auth state changed:', user ? `User: ${user.uid.substring(0, 8)}...` : 'No user')
      
      setUser(user)
      if (user) {
        console.log('⏳ Aguardando verificação de dados...')
        // Aguardar um pouco para garantir que o documento existe
        setTimeout(async () => {
          try {
            const isComplete = await checkBirthDataComplete(user.uid)
            console.log('✅ Verificação completa, resultado:', isComplete)
            setBirthDataComplete(isComplete)
          } catch (error) {
            console.error('❌ Erro na verificação:', error)
            setBirthDataComplete(false)
          } finally {
            setLoading(false)
          }
        }, 500)
      } else {
        setBirthDataComplete(false)
        setLoading(false)
      }
    })

    return unsubscribe
  }, [])

  const checkBirthDataComplete = async (userId?: string): Promise<boolean> => {
    const currentUser = user || auth.currentUser
    const targetUserId = userId || currentUser?.uid
    
    if (!targetUserId) {
      console.log('❌ Nenhum usuário para verificar')
      setBirthDataComplete(false)
      return false
    }

    try {
      console.log('🔍 Iniciando verificação para usuário:', targetUserId.substring(0, 8) + '...')
      const userDoc = await getDoc(doc(db, 'users', targetUserId))
      
      if (userDoc.exists()) {
        const userData = userDoc.data()
        
        // Verificar tanto o flag quanto os dados específicos
        const hasFlag = userData.birthDataComplete === true
        const hasData = !!(userData.birthDate && userData.birthTime && userData.birthLocation && userData.displayName)
        const isComplete = hasFlag && hasData
        
        console.log('🔍 Verificação dados de nascimento:', {
          userId: targetUserId.substring(0, 8) + '...',
          hasFlag,
          hasData,
          isComplete,
          birthDate: !!userData.birthDate,
          birthTime: !!userData.birthTime,
          birthLocation: !!userData.birthLocation,
          displayName: !!userData.displayName
        })
        
        setBirthDataComplete(isComplete)
        return isComplete
      }
      
      console.log('❌ Documento do usuário não existe')
      setBirthDataComplete(false)
      return false
    } catch (error) {
      console.error('❌ Erro ao verificar dados de nascimento:', error)
      setBirthDataComplete(false)
      return false
    }
  }

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password)
  }

  const signUp = async (email: string, password: string) => {
    await createUserWithEmailAndPassword(auth, email, password)
  }

  const signInWithGoogle = async () => {
    try {
      console.log('🔑 Iniciando Google Sign-In...')
      
      // Configure Google Sign-In
      GoogleSignin.configure({
        webClientId: '729037358278-csudf5cv2v9phm0d4oe5qvj31qojv8ac.apps.googleusercontent.com', // Será configurado no Firebase
      })

      // Check if your device supports Google Play
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true })

      // Get the users ID token
      const signInResult = await GoogleSignin.signIn()
      const idToken = signInResult.data?.idToken

      // Create a Google credential with the token
      if (!idToken) {
        throw new Error('Não foi possível obter token do Google')
      }
      const googleCredential = GoogleAuthProvider.credential(idToken)

      // Sign-in the user with the credential
      await signInWithCredential(auth, googleCredential)
      
      console.log('✅ Google Sign-In realizado com sucesso!')
    } catch (error) {
      console.error('❌ Erro no Google Sign-In:', error)
      throw error
    }
  }

  const logout = async () => {
    await signOut(auth)
  }

  const value = {
    user,
    loading,
    birthDataComplete,
    signIn,
    signUp,
    signInWithGoogle,
    logout,
    checkBirthDataComplete,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
