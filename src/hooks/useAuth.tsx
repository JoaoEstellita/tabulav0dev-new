"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

// Mock user interface
interface MockUser {
  uid: string
  email: string
  displayName?: string
}

interface AuthContextType {
  user: MockUser | null
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
  const [user, setUser] = useState<MockUser | null>(null)
  const [loading, setLoading] = useState(false)
  const [birthDataComplete, setBirthDataComplete] = useState(false)

  const signIn = async (email: string, password: string) => {
    try {
      console.log('🔐 Tentando login com email:', email)
      // Mock login - sempre funciona
      const mockUser: MockUser = {
        uid: 'mock-user-id',
        email: email,
        displayName: email.split('@')[0]
      }
      setUser(mockUser)
      console.log('✅ Login mock bem-sucedido:', mockUser.uid)
    } catch (error: any) {
      console.error('❌ Erro no login:', error.message)
      throw error
    }
  }

  const signUp = async (email: string, password: string) => {
    try {
      console.log('📝 Tentando cadastro com email:', email)
      // Mock signup - sempre funciona
      const mockUser: MockUser = {
        uid: 'mock-user-id-' + Date.now(),
        email: email,
        displayName: email.split('@')[0]
      }
      setUser(mockUser)
      console.log('✅ Cadastro mock bem-sucedido:', mockUser.uid)
    } catch (error: any) {
      console.error('❌ Erro no cadastro:', error.message)
      throw error
    }
  }

  const signInWithGoogle = async () => {
    try {
      console.log('🔐 Tentando login com Google')
      // Mock Google login
      const mockUser: MockUser = {
        uid: 'google-mock-user-id',
        email: 'google@example.com',
        displayName: 'Google User'
      }
      setUser(mockUser)
      console.log('✅ Login Google mock bem-sucedido:', mockUser.uid)
    } catch (error: any) {
      console.error('❌ Erro no login Google:', error.message)
      throw error
    }
  }

  const logout = async () => {
    setUser(null)
    console.log('✅ Logout realizado')
  }

  const checkBirthDataComplete = async (): Promise<boolean> => {
    // Mock - sempre retorna false para mostrar onboarding
    return false
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
