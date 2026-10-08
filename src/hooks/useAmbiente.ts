import { useCallback, useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

/**
 * Densidade da interface: quanto a tela mostra de uma vez.
 *
 * Eixo SEPARADO do modo de leitura. `useModoLeitura` decide a LINGUAGEM
 * (técnica ou comum); este decide a QUANTIDADE. São escolhas independentes:
 * tem quem queira o vocabulário técnico numa tela enxuta, e quem queira tudo
 * na tela explicado em português comum.
 *
 * Por que existe: a Home empilhava nove blocos e respondia cinco perguntas ao
 * mesmo tempo — roda, leitura do dia, grade de aspectos, fita de planetas, card
 * de trânsitos, oito barras de área e mais uma grade coletiva. Para quem abre o
 * app de manhã querendo saber como está o dia, isso é um painel de instrumentos
 * onde devia haver uma frase.
 *
 * Padrão LEVE. O caminho que precisa ser fácil é o de quem chega agora; quem
 * estuda acha o resto num toque, e a escolha fica salva. O botão de alternar
 * mora na própria Home, não enterrado em Configurações: um modo que esconde
 * conteúdo tem de deixar óbvio como mostrar de novo.
 */

export type Ambiente = 'leve' | 'completo'

const CHAVE = '@tabula_estelar:ambiente'

const valido = (v: unknown): v is Ambiente => v === 'leve' || v === 'completo'

// Estado compartilhado em memória: o hook é consumido por várias telas ao mesmo
// tempo e todas precisam reagir juntas, sem cada uma reler o disco.
let ambienteAtual: Ambiente = 'leve'
let carregado = false
const ouvintes = new Set<(a: Ambiente) => void>()

function publicar(novo: Ambiente) {
  ambienteAtual = novo
  ouvintes.forEach((fn) => fn(novo))
}

export function useAmbiente() {
  const [ambiente, setAmbiente] = useState<Ambiente>(ambienteAtual)
  const [pronto, setPronto] = useState(carregado)

  useEffect(() => {
    ouvintes.add(setAmbiente)
    if (!carregado) {
      AsyncStorage.getItem(CHAVE)
        .then((v) => {
          if (valido(v)) publicar(v)
          carregado = true
          setPronto(true)
        })
        .catch(() => {
          // Sem preferência salva seguimos no padrão: nunca travar a tela por
          // causa de uma leitura de disco.
          carregado = true
          setPronto(true)
        })
    }
    return () => { ouvintes.delete(setAmbiente) }
  }, [])

  const trocar = useCallback((novo: Ambiente) => {
    publicar(novo)
    AsyncStorage.setItem(CHAVE, novo).catch(() => {})
  }, [])

  const alternar = useCallback(() => {
    trocar(ambienteAtual === 'leve' ? 'completo' : 'leve')
  }, [trocar])

  return { ambiente, pronto, trocar, alternar, leve: ambiente === 'leve' }
}

/** Quantas das 8 áreas de vida aparecem no modo leve. */
export const AREAS_NO_MODO_LEVE = 3

/**
 * As áreas que mais pedem atenção primeiro.
 *
 * No modo leve só três cabem, e as três que importam são as de pior pontuação —
 * mostrar as oito em ordem fixa gasta a tela com o que está tudo bem. Ordena uma
 * CÓPIA: `memoizedAreas` é memorizado e reordenar no lugar mudaria a ordem para
 * quem está no modo completo também.
 *
 * Quem não tem pontuação vai para o fim: sem número não há como dizer que pede
 * atenção, e deixá-lo na frente esconderia uma área que de fato pede.
 */
export function areasQuePedemAtencao<T extends { normalizedArea?: { percentage?: number | null } | null }>(
  areas: ReadonlyArray<T>,
  quantas: number = AREAS_NO_MODO_LEVE,
): T[] {
  const pct = (a: T): number => {
    const v = a?.normalizedArea?.percentage
    return typeof v === 'number' && Number.isFinite(v) ? v : Number.POSITIVE_INFINITY
  }
  return [...(areas || [])].sort((x, y) => pct(x) - pct(y)).slice(0, Math.max(0, quantas))
}
