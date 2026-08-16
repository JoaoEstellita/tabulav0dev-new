import AsyncStorage from '@react-native-async-storage/async-storage'
import { auth } from '../config/firebase'
import { backendFetch } from './backend/client'

/**
 * Os eventos do funil, do lado do app.
 *
 * ── POR QUE ISTO EXISTE ────────────────────────────────────────────────────
 *
 * Não havia nenhuma medição. O João perguntou o que precisa para fazer "o
 * melhor conteúdo possível", e a resposta honesta é que ninguém sabe o que
 * funciona — dez rodadas de refino saíram de percepção, não de dado.
 *
 * ── AS REGRAS ──────────────────────────────────────────────────────────────
 *
 * 1. NUNCA quebra o app. Toda falha é engolida. Uma pessoa não pode deixar de
 *    ver o mapa dela porque a telemetria caiu.
 * 2. NUNCA bloqueia. Ninguém espera o `await` para navegar.
 * 3. Sem dado pessoal. Nome, e-mail, telefone e data de nascimento não entram.
 *    O `uid` vai só quando já há sessão, porque aí a conta já é dela.
 */

const CHAVE_SESSAO = 'te_sessao'

/**
 * Um identificador de visita, para ligar os passos de um mesmo funil.
 *
 * Não identifica pessoa: é aleatório, fica no aparelho e serve só para dizer
 * que o `quiz_passo_3` veio de quem abriu o `quiz_passo_1`. Sem ele os números
 * seriam totais soltos, e o que interessa é onde as pessoas DESISTEM.
 */
async function sessao(): Promise<string> {
  try {
    const guardada = await AsyncStorage.getItem(CHAVE_SESSAO)
    if (guardada) return guardada
    const nova = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`
    await AsyncStorage.setItem(CHAVE_SESSAO, nova)
    return nova
  } catch {
    return 'sem-sessao'
  }
}

export type NomeDeEvento =
  | 'quiz_passo_1' | 'quiz_passo_2' | 'quiz_passo_3'
  | 'conta_criada' | 'paywall_visto' | 'assinou'

/**
 * Registra um passo do funil. Nunca lança, nunca espera.
 *
 * Chamar sem `await` é o uso correto: a navegação não pode ficar atrás da
 * telemetria.
 */
export function registrar(evento: NomeDeEvento, dados: Record<string, unknown> = {}): void {
  void (async () => {
    try {
      await backendFetch('/api/evento', {
        method: 'POST',
        // manda o token quando há sessão; o endpoint aceita anônimo
        auth: !!auth.currentUser,
        timeoutMs: 4000,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ evento, sessao: await sessao(), dados }),
      })
    } catch {
      /* telemetria é best-effort, e silêncio aqui é proposital */
    }
  })()
}
