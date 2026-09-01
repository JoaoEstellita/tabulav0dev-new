import { Platform } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { setReferralCode } from './ReferralService'

// Captura a atribuição de parceria vinda de um link da Play Store:
//   https://play.google.com/store/apps/details?id=com.estellita.tabulaestelar&referrer=partner%3Dvanessaaguiarastro
// O Google entrega esse `referrer` na INSTALAÇÃO. Lemos 1x via Play Install
// Referrer API, extraímos o código e gravamos no ReferralService (first-touch) —
// funciona mesmo com cadastro pelo Google (não precisa do campo de código).
//
// Defensivo: se o módulo nativo não existir ou falhar, o app NÃO quebra.

const DONE_FLAG = 'tabula_play_referrer_done'

// Só chaves EXPLÍCITAS de parceria — nunca `utm_source` (instalação orgânica da
// Play manda utm_source=google-play, que atribuiria errado).
function extractPartnerCode(referrer: string | null | undefined): string | null {
  const raw = String(referrer || '')
  if (!raw) return null
  for (const part of raw.split('&')) {
    const idx = part.indexOf('=')
    if (idx <= 0) continue
    const key = decodeURIComponent(part.slice(0, idx)).trim().toLowerCase()
    if (key === 'partner' || key === 'parceria' || key === 'ref') {
      const val = decodeURIComponent(part.slice(idx + 1)).trim()
      if (val) return val
    }
  }
  return null
}

/** Lê o install referrer da Play (Android, uma única vez) e atribui a parceria. */
export async function capturePlayInstallReferrer(): Promise<void> {
  try {
    if (Platform.OS !== 'android') return
    const done = await AsyncStorage.getItem(DONE_FLAG).catch(() => null)
    if (done) return

    let PlayInstallReferrer: any = null
    try { PlayInstallReferrer = require('react-native-play-install-referrer').PlayInstallReferrer } catch { PlayInstallReferrer = null }
    if (!PlayInstallReferrer || typeof PlayInstallReferrer.getInstallReferrerInfo !== 'function') return

    PlayInstallReferrer.getInstallReferrerInfo((info: any, error: any) => {
      // Marca como feito de qualquer forma — a API só vale na instalação; não retentar.
      AsyncStorage.setItem(DONE_FLAG, '1').catch(() => { })
      try {
        if (error) return
        const code = extractPartnerCode(info?.installReferrer)
        if (code) setReferralCode(code) // grava first-touch (memória + AsyncStorage)
      } catch { /* noop */ }
    })
  } catch { /* noop */ }
}

// Exportado para teste unitário do parser.
export const __extractPartnerCode = extractPartnerCode
