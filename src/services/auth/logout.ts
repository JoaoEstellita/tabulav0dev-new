import { signOut } from 'firebase/auth'
import { Platform } from 'react-native'
import { auth } from '../../config/firebase'

export async function hardSignOut(): Promise<void> {
  try {
    await signOut(auth)
  } catch (e) {
    console.warn('signOut failed (ignorable):', e)
  }
  try {
    if (Platform.OS === 'web') {
      localStorage.removeItem('userProfile')
      localStorage.removeItem('onboardingDraft')
      localStorage.removeItem('tempProfilePhoto')
    }
  } catch { }
}


