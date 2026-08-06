/**
 * Cache curto e compartilhado para leituras repetidas do Firestore.
 *
 * O problema que isto resolve: `useLifeAreas` é chamado em oito telas (Home,
 * Cosmos, Perfil Astrologico, Roda Natal, Analise, Linha do Tempo, Astrologia
 * Gratuita e Transitos Coletivos) e todo o estado dele vive em `useRef` — ou
 * seja, por instancia. Cada montagem relia `users/{uid}` e `userStatus/{uid}`
 * do zero, e navegar entre as telas multiplicava as mesmas leituras. Medicao do
 * Cloud Monitoring: 58 a 70 mil leituras por dia para ~150 ativos, contra teto
 * gratuito de 50 mil — cerca de 390 leituras por usuario por dia, enquanto as
 * escritas somam ~400 no total.
 *
 * Duas coisas acontecem aqui:
 *
 * 1. TTL curto. Perfil e status sao dados de sessao, nao de tempo real — o
 *    proprio `userStatus` ja carrega validade de 6 horas.
 * 2. Deduplicacao de chamadas em voo. Quando tres telas montam juntas, sai UMA
 *    leitura e as tres esperam a mesma promessa. Esse e o ganho maior, porque a
 *    rajada de montagem simultanea nao e coberta por TTL nenhum.
 *
 * O cache guarda o dado ja convertido (nao o DocumentSnapshot), entao Timestamp
 * continua sendo Timestamp e `.toDate()` segue funcionando em quem consome.
 */

interface Entrada {
  valor: unknown
  expiraEm: number
}

const cache = new Map<string, Entrada>()
const emVoo = new Map<string, Promise<unknown>>()

export interface OpcoesLeitura {
  /** Ignora o que estiver guardado e forca uma leitura nova (usado por refresh manual). */
  forcar?: boolean
}

/**
 * Le com cache. `carregar` so roda quando nao ha valor fresco nem chamada em voo.
 */
export async function lerComCache<T>(
  chave: string,
  ttlMs: number,
  carregar: () => Promise<T>,
  opcoes: OpcoesLeitura = {}
): Promise<T> {
  const agora = Date.now()

  if (opcoes.forcar) {
    cache.delete(chave)
  } else {
    const guardado = cache.get(chave)
    if (guardado && guardado.expiraEm > agora) {
      return guardado.valor as T
    }
    // Uma leitura identica ja esta a caminho: espera ela em vez de abrir outra.
    const jaEmVoo = emVoo.get(chave)
    if (jaEmVoo) return jaEmVoo as Promise<T>
  }

  const promessa = carregar()
    .then((valor) => {
      cache.set(chave, { valor, expiraEm: Date.now() + ttlMs })
      return valor
    })
    .finally(() => {
      emVoo.delete(chave)
    })

  emVoo.set(chave, promessa)
  return promessa
}

/**
 * Grava um valor que ja veio de outro caminho — o snapshot devolvido pelo
 * `/api/status-refresh`, por exemplo. Evita que a proxima tela releia o que o
 * backend acabou de entregar.
 */
export function guardarNoCache(chave: string, valor: unknown, ttlMs: number): void {
  cache.set(chave, { valor, expiraEm: Date.now() + ttlMs })
}

/**
 * Invalida o cache. Sem argumento limpa tudo (logout); com prefixo limpa so o
 * que casa (depois de uma escrita no documento).
 */
export function invalidarCache(prefixo?: string): void {
  if (!prefixo) {
    cache.clear()
    emVoo.clear()
    return
  }
  for (const chave of [...cache.keys()]) {
    if (chave.startsWith(prefixo)) cache.delete(chave)
  }
  for (const chave of [...emVoo.keys()]) {
    if (chave.startsWith(prefixo)) emVoo.delete(chave)
  }
}

/** Chaves canonicas, para nao haver divergencia entre quem le e quem invalida. */
export const chaveUsuario = (uid: string) => `users:${uid}`
export const chaveStatusUsuario = (uid: string) => `userStatus:${uid}`

/** Perfil muda por acao do proprio usuario, e toda escrita passa por invalidacao. */
export const TTL_PERFIL_MS = 60_000
/** Snapshot do backend, valido por 6 horas — 2 minutos aqui e conservador. */
export const TTL_STATUS_MS = 120_000
