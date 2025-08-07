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
  signInWithPopup,
} from "firebase/auth"
import { auth, db } from "../config/firebase"
import { doc, getDoc, setDoc } from "firebase/firestore"

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
    try {
      console.log('🔐 Tentando login com email:', email)
      const result = await signInWithEmailAndPassword(auth, email, password)
      console.log('✅ Login bem-sucedido:', result.user.uid)
    } catch (error: any) {
      console.error('❌ Erro no login:', error.message)
      throw error
    }
  }

  const signUp = async (email: string, password: string) => {
    try {
      console.log('📝 Tentando cadastro com email:', email)
      const result = await createUserWithEmailAndPassword(auth, email, password)
      
      // Criar documento do usuário no Firestore
      await setDoc(doc(db, 'users', result.user.uid), {
        email: result.user.email,
        displayName: result.user.displayName || email.split('@')[0],
        createdAt: new Date(),
        birthDataComplete: false,
      })
      
      console.log('✅ Cadastro bem-sucedido:', result.user.uid)
    } catch (error: any) {
      console.error('❌ Erro no cadastro:', error.message)
      throw error
    }
  }

  const signInWithGoogle = async () => {
    try {
      console.log('🔐 Tentando login com Google')
      // Para web, usar popup
      if (typeof window !== 'undefined') {
        const provider = new GoogleAuthProvider()
        const result = await signInWithPopup(auth, provider)
        
        // Verificar se usuário já existe no Firestore
        const userDoc = await getDoc(doc(db, 'users', result.user.uid))
        if (!userDoc.exists()) {
          // Criar documento para novo usuário Google
          await setDoc(doc(db, 'users', result.user.uid), {
            email: result.user.email,
            displayName: result.user.displayName || result.user.email?.split('@')[0],
            createdAt: new Date(),
            birthDataComplete: false,
          })
        }
        
        console.log('✅ Login Google bem-sucedido:', result.user.uid)
      } else {
        throw new Error('Google Sign-In não disponível no Expo Go. Use um development build.')
      }
    } catch (error: any) {
      console.error('❌ Erro no login Google:', error.message)
      
      // Tratamento específico para domínio não autorizado
      if (error.code === 'auth/unauthorized-domain') {
        throw new Error('Domínio não autorizado. Adicione tabulaestelar.com.br nas configurações do Firebase.')
      }
      
      throw error
    }
  }

  const logout = async () => {
    await signOut(auth)
    console.log('✅ Logout realizado')
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
