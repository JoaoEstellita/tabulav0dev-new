"use client"

import type React from "react"
import { createContext, useContext, useEffect, useRef, useState } from "react"
import { Platform } from "react-native"
import {
  type User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  deleteUser,
  GoogleAuthProvider,
} from "firebase/auth"
import { auth, db } from "../config/firebase"
import { doc, getDoc, setDoc, deleteDoc, serverTimestamp, Timestamp } from "firebase/firestore"
import LoadingScreen from "../components/LoadingScreen"
import { captureClaimTokenFromUrl, consumePendingClaim } from "../services/claimOnboarding"

interface AuthContextType {
  user: User | null
  loading: boolean
  birthDataComplete: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  logout: () => Promise<void>
  deleteAccount: () => Promise<void>
  checkBirthDataComplete: () => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [birthDataComplete, setBirthDataComplete] = useState(false)
  const loadingRef = useRef(true)

  useEffect(() => {
    loadingRef.current = loading
  }, [loading])

  // Onboarding via WhatsApp (Fase 2): captura o token do link /vincular?t=…
  // logo no carregamento, antes do login do Google, para não perdê-lo no redirect.
  useEffect(() => {
    captureClaimTokenFromUrl().catch(() => {})
  }, [])

  const ensureUserDocuments = async (authUser: User) => {
    const userDoc = await getDoc(doc(db, 'users', authUser.uid))
    if (!userDoc.exists()) {
      await setDoc(doc(db, 'users', authUser.uid), {
        email: authUser.email,
        displayName: authUser.displayName || authUser.email?.split('@')[0],
        createdAt: new Date(),
        birthDataComplete: false,
      })

      await setDoc(doc(db, 'userPublicProfiles', authUser.uid), {
        displayName: authUser.displayName || authUser.email?.split('@')[0],
        profilePhoto: authUser.photoURL || null,
        updatedAt: new Date(),
      })
    }
  }

  const syncPublicProfile = async (authUser: User) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', authUser.uid))
      const userData = userDoc.exists() ? userDoc.data() : {}
      const displayName =
        userData.displayName ||
        userData.fullName ||
        authUser.displayName ||
        authUser.email?.split('@')[0] ||
        'Usuario'
      const profilePhoto = userData.profilePhoto || authUser.photoURL || null

      await setDoc(
        doc(db, 'userPublicProfiles', authUser.uid),
        {
          displayName,
          profilePhoto,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      )
    } catch (error) {
      console.warn('Falha ao sincronizar perfil publico:', error)
    }
  }

  const getDatePartsInTimeZone = (date: Date, timeZone: string) => {
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
    const parts = formatter.formatToParts(date)
    const lookup: Record<string, string> = {}
    parts.forEach((part) => {
      if (part.type !== 'literal') lookup[part.type] = part.value
    })
    return {
      year: Number(lookup.year),
      month: Number(lookup.month),
      day: Number(lookup.day),
    }
  }

  const getTimeZoneOffsetMinutes = (date: Date, timeZone: string) => {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone,
      timeZoneName: 'shortOffset',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
    const parts = formatter.formatToParts(date)
    const tzPart = parts.find((part) => part.type === 'timeZoneName')?.value || 'UTC'
    const match = tzPart.match(/([+-])(\d{1,2})(?::?(\d{2}))?/)
    if (!match) return 0
    const sign = match[1] === '-' ? -1 : 1
    const hours = Number(match[2] || 0)
    const minutes = Number(match[3] || 0)
    return sign * (hours * 60 + minutes)
  }

  const buildDayKeyAndHotUntil = (now: Date, timeZone: string) => {
    const parts = getDatePartsInTimeZone(now, timeZone)
    const dayKey = `${parts.year.toString().padStart(4, '0')}-${String(parts.month).padStart(2, '0')}-${String(parts.day).padStart(2, '0')}`
    const endOfDayUtcGuess = Date.UTC(parts.year, parts.month - 1, parts.day, 23, 59, 59, 999)
    const offsetMinutes = getTimeZoneOffsetMinutes(new Date(endOfDayUtcGuess), timeZone)
    const endOfDayUtc = new Date(endOfDayUtcGuess - offsetMinutes * 60 * 1000)
    return { dayKey, endOfDayUtc }
  }

  const recordUserActivity = async (authUser: User) => {
    const userRef = doc(db, 'users', authUser.uid)
    try {
      const snap = await getDoc(userRef)
      const data = snap.exists() ? snap.data() : {}
      const timeZone =
        (data?.settings as any)?.timezone ||
        (data as any)?.timezone ||
        'America/Sao_Paulo'
      const { dayKey, endOfDayUtc } = buildDayKeyAndHotUntil(new Date(), timeZone)
      const previousDayKey = (data as any)?.dayKey || null
      const previousCount = typeof (data as any)?.loginCountToday === 'number'
        ? (data as any).loginCountToday
        : 0
      const resetCount = previousDayKey !== dayKey
      const nextCount = (resetCount ? 0 : previousCount) + 1
      const shouldHot = nextCount >= 2

      await setDoc(
        userRef,
        {
          lastSeenAt: serverTimestamp(),
          dayKey,
          loginCountToday: nextCount,
          hotUntil: shouldHot ? Timestamp.fromDate(endOfDayUtc) : null,
        },
        { merge: true }
      )
    } catch (error) {
      console.warn('Falha ao registrar atividade do usuario:', error)
    }
  }

  useEffect(() => {
    if (Platform.OS === 'web') {
      import('firebase/auth').then(({ getRedirectResult }) => {
        getRedirectResult(auth)
          .then(async (result) => {
            if (result?.user) {
              await ensureUserDocuments(result.user)
            }
          })
          .catch((error) => {
            console.warn('Falha ao processar retorno do Google:', error)
          })
      }).catch(() => { })
    }

    const watchdog = setTimeout(() => {
      if (!loadingRef.current) return
      console.warn('Auth loading timeout. Forcing UI to recover.')
      setUser(auth.currentUser ?? null)
      setBirthDataComplete(false)
      setLoading(false)
    }, 6000)

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (__DEV__) console.log('Auth state changed:', user ? `User: ${user.uid.substring(0, 8)}...` : 'No user')

      setUser(user)
      if (user) {
        if (__DEV__) console.log('Aguardando verificacao de dados...')
        syncPublicProfile(user)
        recordUserActivity(user)
        // Verificar imediatamente — Firestore retorna erro se doc não existir, tratado no catch
        setTimeout(async () => {
          try {
            const isComplete = await checkBirthDataComplete(user.uid)
            if (__DEV__) console.log('Verificacao completa, resultado:', isComplete)
            setBirthDataComplete(isComplete)
          } catch (error) {
            console.error('Erro na verificacao:', error)
            setBirthDataComplete(false)
          } finally {
            setLoading(false)
          }
        }, 0)
      } else {
        setBirthDataComplete(false)
        setLoading(false)
      }
    })

    return () => {
      clearTimeout(watchdog)
      unsubscribe()
    }
  }, [])

  const checkBirthDataComplete = async (userId?: string): Promise<boolean> => {
    const currentUser = user || auth.currentUser
    const targetUserId = userId || currentUser?.uid

    if (!targetUserId) {
      if (__DEV__) console.log('Nenhum usuario para verificar')
      setBirthDataComplete(false)
      return false
    }

    try {
      if (__DEV__) console.log('Iniciando verificacao para usuario:', targetUserId.substring(0, 8) + '...')
      const readComplete = async (): Promise<boolean> => {
        const snap = await getDoc(doc(db, 'users', targetUserId))
        if (!snap.exists()) return false
        const d = snap.data()
        const hasFlag = d.birthDataComplete === true
        const hasData = !!(d.birthDate && d.birthTime && d.birthLocation && d.displayName)
        return hasFlag && hasData
      }

      let isComplete = await readComplete()

      // Onboarding via WhatsApp (Fase 2): se o perfil ainda não está completo e
      // há um token de vinculação guardado, funde o perfil pendente e relê uma vez.
      if (!isComplete) {
        const merged = await consumePendingClaim()
        if (merged) isComplete = await readComplete()
      }

      setBirthDataComplete(isComplete)
      return isComplete
    } catch (error) {
      console.error('Erro ao verificar dados de nascimento:', error)
      setBirthDataComplete(false)
      return false
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      if (__DEV__) console.log('Tentando login com email:', email)
      const result = await signInWithEmailAndPassword(auth, email, password)
      if (__DEV__) console.log('Login bem-sucedido:', result.user.uid)
    } catch (error: any) {
      console.error('Erro no login:', error.message)
      throw error
    }
  }

  const signUp = async (email: string, password: string) => {
    try {
      if (__DEV__) console.log('Tentando cadastro com email:', email)
      const result = await createUserWithEmailAndPassword(auth, email, password)

      // Criar documento do usuario no Firestore
      await setDoc(doc(db, 'users', result.user.uid), {
        email: result.user.email,
        displayName: result.user.displayName || email.split('@')[0],
        createdAt: new Date(),
        birthDataComplete: false,
      })

      await setDoc(doc(db, 'userPublicProfiles', result.user.uid), {
        displayName: result.user.displayName || email.split('@')[0],
        profilePhoto: result.user.photoURL || null,
        updatedAt: new Date(),
      })

      if (__DEV__) console.log('Cadastro bem-sucedido:', result.user.uid)
    } catch (error: any) {
      console.error('Erro no cadastro:', error.message)
      throw error
    }
  }

  const signInWithGoogle = async () => {
    try {
      if (__DEV__) console.log('Tentando login com Google')
      if (Platform.OS === 'web') {
        const { signInWithPopup, signInWithRedirect } = await import('firebase/auth')
        const provider = new GoogleAuthProvider()
        provider.setCustomParameters({ prompt: 'select_account' })
        const result = await signInWithPopup(auth, provider)
        await ensureUserDocuments(result.user)
        if (__DEV__) console.log('Login Google bem-sucedido:', result.user.uid)
      } else {
        // Native Google Sign-In via @react-native-google-signin/google-signin
        const { GoogleSignin } = require('@react-native-google-signin/google-signin')
        const { signInWithCredential } = await import('firebase/auth')

        GoogleSignin.configure({
          webClientId: '729037358278-csudf5cv2v9phm0d4oe5qvj31qojv8ac.apps.googleusercontent.com',
        })

        await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true })
        const signInResult = await GoogleSignin.signIn()

        // v15 returns { data: { idToken } } or { idToken } depending on version
        const idToken = signInResult?.data?.idToken || signInResult?.idToken
        if (!idToken) {
          throw new Error('Google Sign-In não retornou um token de autenticação.')
        }

        const credential = GoogleAuthProvider.credential(idToken)
        const firebaseResult = await signInWithCredential(auth, credential)
        await ensureUserDocuments(firebaseResult.user)
        if (__DEV__) console.log('Login Google nativo bem-sucedido:', firebaseResult.user.uid)
      }
    } catch (error: any) {
      console.error('Erro no login Google:', error.message)
      if (
        Platform.OS === 'web' &&
        (error.code === 'auth/popup-blocked' ||
          error.code === 'auth/popup-closed-by-user' ||
          error.code === 'auth/cancelled-popup-requested')
      ) {
        const { signInWithRedirect } = await import('firebase/auth')
        const provider = new GoogleAuthProvider()
        provider.setCustomParameters({ prompt: 'select_account' })
        await signInWithRedirect(auth, provider)
        return
      }

      // Tratamento especifico para dominio nao autorizado
      if (error.code === 'auth/unauthorized-domain') {
        throw new Error('Dominio nao autorizado. Adicione tabulaestelar.com.br nas configuracoes do Firebase.')
      }

      throw error
    }
  }

  const logout = async () => {
    try {
      if (__DEV__) console.log('Iniciando logout...')
      if (__DEV__) console.log('Usuario atual:', auth.currentUser?.uid)

      if (!auth.currentUser) {
        if (__DEV__) console.log('Nenhum usuario logado')
        setUser(null)
        setBirthDataComplete(false)
        return
      }

      await signOut(auth)
      // Forcar estado local imediatamente para refletir na navegacao
      setUser(null)
      setBirthDataComplete(false)
        ; (globalThis as any).__userHouseSystem = undefined
      if (__DEV__) console.log('Logout realizado com sucesso (estado limpo)')

    } catch (error) {
      console.error('Erro no logout:', error)
      // Ainda assim limpar estado local para evitar travar o usuario logado
      setUser(null)
      setBirthDataComplete(false)
      throw error
    }
  }

  const deleteAccount = async () => {
    try {
      const currentUser = auth.currentUser
      if (!currentUser) {
        throw new Error('Nenhum usuario logado')
      }

      if (__DEV__) console.log('Iniciando exclusao de conta...')

      // Deletar dados do Firestore primeiro
      await deleteDoc(doc(db, 'users', currentUser.uid))
      if (__DEV__) console.log('Dados do Firestore deletados')

      // Deletar conta do Firebase Auth
      await deleteUser(currentUser)
      if (__DEV__) console.log('Conta deletada com sucesso')

    } catch (error) {
      console.error('Erro ao deletar conta:', error)
      throw error
    }
  }

  const value = {
    user,
    loading,
    birthDataComplete,
    signIn,
    signUp,
    signInWithGoogle,
    logout,
    deleteAccount,
    checkBirthDataComplete,
  }

  if (loading) {
    return <LoadingScreen />
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
