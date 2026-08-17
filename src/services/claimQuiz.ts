import AsyncStorage from '@react-native-async-storage/async-storage'
import { Platform } from 'react-native'
import { backendFetch } from './backend/client'

/**
 * O link que traz o mapa do quiz de volta, em qualquer aparelho.
 *
 * ── POR QUE EXISTE ─────────────────────────────────────────────────────────
 *
 * O João perguntou: "não teria problema da pessoa abrir o app com a conta
 * criada, mas depois se for logar em outro lugar ter dificuldade de logar na
 * própria conta?".
 *
 * O quiz roda antes do login, numa conta anônima, e conta anônima vive naquele
 * navegador. No mesmo aparelho `linkWithCredential` resolve — promove o mesmo
 * uid e nada se move. Em outro aparelho, nada alcança aquela conta.
 *
 * Este módulo é o par do `claimOnboarding.ts`, que faz o mesmo para quem chega
 * pelo WhatsApp. A forma é igual de propósito: `/vincular?q=<token>`, capturado
 * ANTES do redirect do Google, consumido depois do login.
 */

const CHAVE = 'quiz_claim_token'

/** A base pública, para montar o link que a pessoa guarda. */
const SITE = 'https://www.tabulaestelar.com.br'

/**
 * Pede ao backend um token para o mapa da conta atual.
 *
 * @returns o link pronto, ou `null` quando não deu — e não dar não é erro
 *   grave: a pessoa continua com o mapa nesta sessão.
 */
export async function emitirLinkDeAcesso(): Promise<string | null> {
  try {
    const resp = await backendFetch('/api/claim-quiz', {
      method: 'POST',
      auth: true,
      timeoutMs: 12000,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'criar' }),
    })
    if (!resp.ok) return null
    const dados = await resp.json()
    return dados?.token ? `${SITE}/vincular?q=${dados.token}` : null
  } catch {
    return null
  }
}

/**
 * Captura o `?q=` da URL e guarda, para sobreviver ao redirect do Google.
 *
 * O mesmo cuidado do `claimOnboarding`: o login do Google no navegador sai da
 * página e volta, e um token que estivesse só na barra de endereço se perderia
 * exatamente no meio do caminho.
 *
 * Limpa o parâmetro depois — ele é de uso único e não deve ser copiado junto
 * quando alguém compartilha a URL.
 */
export async function capturarTokenDoQuiz(): Promise<void> {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return
  try {
    const params = new URLSearchParams(window.location.search)
    const token = params.get('q')
    if (!token) return
    await AsyncStorage.setItem(CHAVE, token)
    params.delete('q')
    const qs = params.toString()
    window.history.replaceState(
      {},
      '',
      window.location.pathname + (qs ? `?${qs}` : '') + window.location.hash
    )
  } catch {
    /* captura é best-effort */
  }
}

/**
 * Consome o token guardado, fundindo o mapa na conta logada.
 *
 * @returns `true` quando o mapa foi transferido de fato.
 */
export async function consumirTokenDoQuiz(): Promise<boolean> {
  let token: string | null = null
  try { token = await AsyncStorage.getItem(CHAVE) } catch { token = null }
  if (!token) return false

  try {
    const resp = await backendFetch('/api/claim-quiz', {
      method: 'POST',
      auth: true,
      timeoutMs: 15000,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'usar', token }),
    })

    if (resp.ok) {
      await AsyncStorage.removeItem(CHAVE)
      const dados = await resp.json().catch(() => null)
      return dados?.fundiu === true
    }

    /**
     * Token morto: descarta para não tentar de novo a cada abertura.
     *
     * 404 desconhecido, 409 já usado, 410 expirado. O 409 inclui o caso em que
     * a conta de destino já tinha mapa — a carta antiga ganhou, o token foi
     * consumido, e insistir não mudaria nada.
     */
    if ([404, 409, 410].includes(resp.status)) {
      await AsyncStorage.removeItem(CHAVE)
    }
    return false
  } catch {
    // erro de rede: mantém o token para a próxima tentativa
    return false
  }
}

export async function temTokenDoQuizPendente(): Promise<boolean> {
  try { return !!(await AsyncStorage.getItem(CHAVE)) } catch { return false }
}
