import { signOut } from 'firebase/auth'
import { auth } from '../../config/firebase'

export async function hardSignOut(): Promise<void> {
  try {
    await signOut(auth)
  } catch (e) {
    console.warn('signOut failed (ignorable):', e)
  }
  try {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('userProfile')
      localStorage.removeItem('onboardingDraft')
      localStorage.removeItem('tempProfilePhoto')
    }
  } catch {}
}


