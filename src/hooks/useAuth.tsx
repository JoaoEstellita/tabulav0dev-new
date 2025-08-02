"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import {
  type User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth"
import { auth, db } from "../config/firebase"
import { doc, getDoc } from "firebase/firestore"

interface AuthContextType {
  user: User | null
  loading: boolean
  birthDataComplete: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
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
      setUser(user)
      if (user) {
        const isComplete = await checkBirthDataComplete()
        setBirthDataComplete(isComplete)
      } else {
        setBirthDataComplete(false)
      }
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const checkBirthDataComplete = async (): Promise<boolean> => {
    if (!user) {
      setBirthDataComplete(false)
      return false
    }

    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid))
      if (userDoc.exists()) {
        const userData = userDoc.data()
        const isComplete = !!(userData.birthDate && userData.birthTime && userData.birthLocation)
        setBirthDataComplete(isComplete)
        console.log('Dados de nascimento completos:', isComplete)
        return isComplete
      }
      setBirthDataComplete(false)
      return false
    } catch (error) {
      console.error('Erro ao verificar dados de nascimento:', error)
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

  const logout = async () => {
    await signOut(auth)
  }

  const value = {
    user,
    loading,
    birthDataComplete,
    signIn,
    signUp,
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
