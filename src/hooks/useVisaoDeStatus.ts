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
 * O padrão depende de ONDE: fichas na Home, roda no grupo. O porquê de cada
 * um está em `PADRAO`, logo abaixo. Quem prefere o contrário troca uma vez,
 * em cada tela, e as duas escolhas ficam guardadas separadas.
 *
 * Guardado só no aparelho (AsyncStorage): é preferência de leitura, não dado de
 * conta — não justifica uma escrita no Firestore a cada toque.
 */

export type VisaoDeStatus = 'roda' | 'fichas'

/**
 * ⚠️ A PREFERÊNCIA É POR ESCOPO, e os padrões são DIFERENTES de propósito.
 *
 * Na Home as fichas vêm primeiro: a pessoa abre o app para saber do próprio
 * dia, e a ficha diz nome, nota e contagem sem pedir que ela aprenda a ler uma
 * figura.
 *
 * No grupo a RODA vem primeiro, e pelo motivo oposto: ali são várias pessoas
 * na mesma tela, e o que se quer é comparar silhuetas de relance. Oito fichas
 * por membro viram uma parede de números.
 *
 * Um estado só para os dois escopos faria trocar no grupo mudar a Home — duas
 * telas com necessidades contrárias brigando pela mesma chave.
 */
export type EscopoDaVisao = 'home' | 'grupo'

const CHAVE: Record<EscopoDaVisao, string> = {
  home: '@tabula_estelar:visao_status',
  grupo: '@tabula_estelar:visao_status_grupo',
}

const PADRAO: Record<EscopoDaVisao, VisaoDeStatus> = {
  home: 'fichas',
  grupo: 'roda',
}

// Estado compartilhado em memória POR ESCOPO, igual ao de `useGradeRetraida`:
// mais de um ponto da tela pode ler isto e todos têm de reagir juntos sem
// reler o disco.
const visaoAtual: Record<EscopoDaVisao, VisaoDeStatus> = { ...PADRAO }
const carregado: Record<EscopoDaVisao, boolean> = { home: false, grupo: false }
const ouvintes: Record<EscopoDaVisao, Set<(v: VisaoDeStatus) => void>> = {
  home: new Set(),
  grupo: new Set(),
}

function publicar(escopo: EscopoDaVisao, nova: VisaoDeStatus) {
  visaoAtual[escopo] = nova
  ouvintes[escopo].forEach((fn) => fn(nova))
}

export function useVisaoDeStatus(escopo: EscopoDaVisao = 'home') {
  const [visao, setVisao] = useState<VisaoDeStatus>(visaoAtual[escopo])

  useEffect(() => {
    ouvintes[escopo].add(setVisao)
    setVisao(visaoAtual[escopo])
    if (!carregado[escopo]) {
      AsyncStorage.getItem(CHAVE[escopo])
        .then((v) => {
          carregado[escopo] = true
          // ⚠️ Só aceita os dois valores conhecidos. Uma chave corrompida ou de
          // uma versão futura não pode deixar a tela sem nenhuma das visões.
          if (v === 'roda' || v === 'fichas') publicar(escopo, v)
        })
        .catch(() => { carregado[escopo] = true })
    }
    return () => { ouvintes[escopo].delete(setVisao) }
  }, [escopo])

  const alternar = useCallback(() => {
    const nova: VisaoDeStatus = visaoAtual[escopo] === 'roda' ? 'fichas' : 'roda'
    publicar(escopo, nova)
    AsyncStorage.setItem(CHAVE[escopo], nova).catch(() => {})
  }, [escopo])

  return { visao, alternar }
}
