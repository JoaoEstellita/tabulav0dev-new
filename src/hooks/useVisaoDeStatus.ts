import { useCallback, useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

/**
 * RODA ou FICHAS: como o status das oito áreas aparece na Home.
 *
 * As duas visões mostram exatamente os mesmos oito números e viviam em lugares
 * diferentes da mesma tela — a roda em cima, as fichas bem abaixo. Era a mesma
 * informação ocupando dois espaços e rolando duas vezes.
 *
 * Agora dividem um espaço só, com uma seta para trocar. Cada uma responde a uma
 * pergunta diferente e nenhuma substitui a outra: a roda dá o CONJUNTO de uma
 * olhada (onde a silhueta afunda é o que pede atenção) e as fichas dão o
 * DETALHE de cada área, com contagem de trânsitos e texto.
 *
 * Padrão é a RODA: é o resumo, e resumo vem antes do detalhe. Quem prefere as
 * fichas troca uma vez e a escolha fica guardada.
 *
 * Guardado só no aparelho (AsyncStorage): é preferência de leitura, não dado de
 * conta — não justifica uma escrita no Firestore a cada toque.
 */

const CHAVE = '@tabula_estelar:visao_status'

export type VisaoDeStatus = 'roda' | 'fichas'

// Estado compartilhado em memória, igual ao de `useAspectosMenores`: mais de um
// ponto da tela pode ler isto e todos têm de reagir juntos sem reler o disco.
let visaoAtual: VisaoDeStatus = 'roda'
let carregado = false
const ouvintes = new Set<(v: VisaoDeStatus) => void>()

function publicar(nova: VisaoDeStatus) {
  visaoAtual = nova
  ouvintes.forEach((fn) => fn(nova))
}

export function useVisaoDeStatus() {
  const [visao, setVisao] = useState<VisaoDeStatus>(visaoAtual)

  useEffect(() => {
    ouvintes.add(setVisao)
    if (!carregado) {
      AsyncStorage.getItem(CHAVE)
        .then((v) => {
          carregado = true
          // ⚠️ Só aceita os dois valores conhecidos. Uma chave corrompida ou de
          // uma versão futura não pode deixar a Home sem nenhuma das visões.
          if (v === 'roda' || v === 'fichas') publicar(v)
        })
        .catch(() => { carregado = true })
    }
    return () => { ouvintes.delete(setVisao) }
  }, [])

  const alternar = useCallback(() => {
    const nova: VisaoDeStatus = visaoAtual === 'roda' ? 'fichas' : 'roda'
    publicar(nova)
    AsyncStorage.setItem(CHAVE, nova).catch(() => {})
  }, [])

  return { visao, alternar }
}
