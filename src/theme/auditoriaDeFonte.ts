/**
 * Encontra texto miúdo demais para ser lido.
 *
 * Serve ao teste que mantém a escala tipográfica viva. O `theme/ui.ts` provou
 * que token não pega por existir: foi criado dizendo a coisa certa e terminou
 * usado em dois arquivos. O que faz diferença é algo que FALHE quando o texto
 * miúdo volta a crescer.
 *
 * A regra não é "nenhum fontSize abaixo de 14". CAPS curto de categoria
 * ("TRÂNSITO", "SOL") não é para ler, é para localizar, e em 14px com
 * `letterSpacing` ele passa a competir com o conteúdo. Então a exceção é
 * explícita e estreita: `textTransform: 'uppercase'` no mesmo estilo.
 *
 * O parser é deliberadamente simples — equilibra chaves a partir de
 * `nome: {`, sem entender TypeScript. Em troca não tem dependência e roda em
 * milissegundos sobre o fonte. Ele pode errar em construções exóticas; por isso
 * o resultado alimenta um limite que só pode DIMINUIR, nunca uma proibição
 * absoluta que travaria o trabalho de todo mundo num falso positivo.
 */

export interface EstiloMiudo {
  /** Nome do estilo (`skyLegendMax`), ou `?` quando não foi possível atribuir. */
  nome: string
  tamanho: number
  /** Linha 1-indexada onde está o `fontSize`. */
  linha: number
}

const RE_ABRE = /(?:^|[\s,{(])([A-Za-z_$][\w$]*)\s*:\s*\{/
const RE_FONT = /fontSize:\s*([0-9]+(?:\.[0-9]+)?)/
const RE_CAPS = /textTransform:\s*['"]uppercase['"]/

/**
 * Os estilos com texto de leitura abaixo do piso.
 *
 * Um estilo entra uma vez por `fontSize` encontrado. Estilos aninhados herdam o
 * nome do mais interno, que é o que identifica o texto na tela.
 */
export function estilosDeTextoMiudo(fonte: string, piso: number): EstiloMiudo[] {
  const linhas = String(fonte || '').split('\n')

  // Pilha de nomes abertos, para saber a qual estilo um fontSize pertence.
  const pilha: Array<{ nome: string; corpo: string[] }> = []
  const achados: EstiloMiudo[] = []
  // Guarda o fontSize até o fim do bloco: `textTransform` pode vir DEPOIS dele,
  // e decidir na hora da leitura classificaria uma etiqueta como ofensora.
  const pendentes: Array<{ nome: string; tamanho: number; linha: number; bloco: string[] }> = []

  linhas.forEach((linha, i) => {
    let resto = linha

    // Abre quantos blocos nomeados houver nesta linha.
    for (;;) {
      const m = RE_ABRE.exec(resto)
      if (!m) break
      const corpo: string[] = []
      pilha.push({ nome: m[1], corpo })
      resto = resto.slice((m.index ?? 0) + m[0].length)
    }

    for (const nivel of pilha) nivel.corpo.push(linha)

    const f = RE_FONT.exec(linha)
    if (f) {
      const tamanho = Number(f[1])
      const atual = pilha[pilha.length - 1]
      if (Number.isFinite(tamanho) && tamanho < piso) {
        pendentes.push({
          nome: atual?.nome || '?',
          tamanho,
          linha: i + 1,
          bloco: atual?.corpo || [linha],
        })
      }
    }

    // Fecha os blocos terminados nesta linha.
    const fechamentos = (resto.match(/\}/g) || []).length
    for (let k = 0; k < fechamentos && pilha.length; k++) pilha.pop()
  })

  for (const p of pendentes) {
    // Etiqueta em CAPS é a única exceção ao piso.
    if (p.bloco.some((l) => RE_CAPS.test(l))) continue
    achados.push({ nome: p.nome, tamanho: p.tamanho, linha: p.linha })
  }

  return achados
}

/** Quantos estilos de leitura estão abaixo do piso. */
export function contarTextoMiudo(fonte: string, piso: number): number {
  return estilosDeTextoMiudo(fonte, piso).length
}
