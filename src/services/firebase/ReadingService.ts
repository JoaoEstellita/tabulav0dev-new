import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../../config/firebase'

export interface ReadingEntry {
  areaName: string
  areaScore: number
  areaTrend: string
  language: string
  source: 'app' | 'whatsapp_agent'
}

/**
 * Registra uma leitura de área de vida no histórico do usuário.
 * Fire-and-forget — nunca lança exceção, não bloqueia a UI.
 */
async function logReading(uid: string, entry: ReadingEntry): Promise<void> {
  try {
    await addDoc(collection(db, 'users', uid, 'readings'), {
      ...entry,
      readAt: serverTimestamp(),
    })
  } catch (err: unknown) {
    console.warn('[ReadingService] logReading failed:', (err as Error)?.message)
  }
}

export default { logReading }
