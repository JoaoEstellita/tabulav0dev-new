import { useCallback, useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

/**
 * A ORDEM DOS BLOCOS DA HOME, escolhida por quem usa.
 *
 * A ordem padrão é um roteiro de leitura — "Seu dia" responde, o céu mostra de
 * onde a resposta saiu, o status diz onde aquilo pega na vida e as emoções
 * dizem que tom o dia tende a ter. Do que acontece para o que significa.
 *
 * Mas esse roteiro é UMA leitura, não A leitura: quem abre o app para saber do
 * humor quer as emoções primeiro; quem estuda o mapa quer o céu. A ordem foi
 * trocada quatro vezes durante o ajuste, o que já é evidência de que não há uma
 * resposta única.
 *
 * ⚠️ A GRADE NÃO É UM BLOCO SEPARADO, e isso não é esquecimento: ela mora
 * dentro do componente da roda natal (`NatalChartWheelContent`), que a desenha
 * logo abaixo do círculo. Separar as duas exigiria extrair a grade com todo o
 * estado local dela — a mesma mudança que já falhou três vezes neste projeto,
 * sempre do mesmo jeito: compila, renderiza e move a coisa errada. Roda e grade
 * andam juntas como "o céu", que é como elas se leem de qualquer forma.
 *
 * ⚠️ "Seu dia" também não entra. Ele é a única parte que responde sozinha a
 * quem abre o app de manhã e não quer mais nada — tirar do topo é a única
 * reordenação que piora a tela para todo mundo, inclusive para quem pediu.
 *
 * Guardado só no aparelho (AsyncStorage): é preferência de leitura, não dado de
 * conta — não justifica uma escrita no Firestore a cada toque.
 */

const CHAVE = '@tabula_estelar:ordem_home'

export type BlocoDaHome = 'ceu' | 'status' | 'emocoes'

/** A ordem de fábrica: o céu primeiro, depois onde ele pega, depois o tom. */
export const ORDEM_PADRAO: readonly BlocoDaHome[] = ['ceu', 'status', 'emocoes'] as const

const VALIDOS = new Set<string>(ORDEM_PADRAO)

/**
 * Garante que a ordem lida do disco é utilizável.
 *
 * ⚠️ Não basta validar os nomes: uma versão futura pode acrescentar um bloco, e
 * a ordem guardada do aparelho não o teria. Sem completar com o que falta, o
 * bloco novo simplesmente não apareceria para quem já tinha preferência salva —
 * uma seção inteira sumindo em silêncio, só para parte das pessoas.
 */
export function normalizarOrdem(bruta: unknown): BlocoDaHome[] {
  const lista = Array.isArray(bruta) ? bruta.map(String) : []
  const vistos = new Set<string>()
  const limpa: BlocoDaHome[] = []
  for (const b of lista) {
    if (VALIDOS.has(b) && !vistos.has(b)) {
      vistos.add(b)
      limpa.push(b as BlocoDaHome)
    }
  }
  for (const b of ORDEM_PADRAO) if (!vistos.has(b)) limpa.push(b)
  return limpa
}

// Estado compartilhado em memória, igual aos outros controles de leitura.
let ordemAtual: BlocoDaHome[] = [...ORDEM_PADRAO]
let carregado = false
const ouvintes = new Set<(v: BlocoDaHome[]) => void>()

function publicar(nova: BlocoDaHome[]) {
  ordemAtual = nova
  ouvintes.forEach((fn) => fn(nova))
}

/** Move um bloco uma casa para cima (-1) ou para baixo (+1). */
export function moverNaOrdem(ordem: BlocoDaHome[], bloco: BlocoDaHome, passo: -1 | 1): BlocoDaHome[] {
  const i = ordem.indexOf(bloco)
  const j = i + passo
  if (i < 0 || j < 0 || j >= ordem.length) return ordem
  const nova = [...ordem]
  nova[i] = nova[j]
  nova[j] = bloco
  return nova
}

export function useOrdemDaHome() {
  const [ordem, setOrdem] = useState<BlocoDaHome[]>(ordemAtual)

  useEffect(() => {
    ouvintes.add(setOrdem)
    if (!carregado) {
      AsyncStorage.getItem(CHAVE)
        .then((v) => {
          carregado = true
          if (!v) return
          try {
            publicar(normalizarOrdem(JSON.parse(v)))
          } catch {
            // JSON corrompido mantém o padrão: a Home não pode ficar vazia
            // porque uma chave do disco veio quebrada.
          }
        })
        .catch(() => { carregado = true })
    }
    return () => { ouvintes.delete(setOrdem) }
  }, [])

  const mover = useCallback((bloco: BlocoDaHome, passo: -1 | 1) => {
    const nova = moverNaOrdem(ordemAtual, bloco, passo)
    if (nova === ordemAtual) return
    publicar(nova)
    AsyncStorage.setItem(CHAVE, JSON.stringify(nova)).catch(() => {})
  }, [])

  const restaurar = useCallback(() => {
    publicar([...ORDEM_PADRAO])
    AsyncStorage.removeItem(CHAVE).catch(() => {})
  }, [])

  return { ordem, mover, restaurar }
}
