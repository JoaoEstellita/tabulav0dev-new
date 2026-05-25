import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db, auth } from '../../config/firebase'

export interface ErrorContext {
  screen?: string
  action?: string
  componentStack?: string
  source?: string
}

/**
 * Persiste erros de produção no Firestore para rastreamento.
 * Fire-and-forget — nunca lança exceção, não bloqueia a UI.
 *
 * Schema: appErrors/{auto}
 *   message, stack, userId, screen, action, componentStack,
 *   platform, source, createdAt
 */
async function logError(error: Error, context: ErrorContext = {}): Promise<void> {
  try {
    const userId = auth.currentUser?.uid || null
    await addDoc(collection(db, 'appErrors'), {
      message: error.message,
      stack: error.stack || null,
      userId,
      screen: context.screen || null,
      action: context.action || null,
      componentStack: context.componentStack || null,
      source: context.source || 'unknown',
      platform: 'react-native',
      createdAt: serverTimestamp(),
    })
  } catch {
    // silencioso — nunca propaga
  }
}

export default { logError }
