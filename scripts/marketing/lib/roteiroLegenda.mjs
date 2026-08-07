/**
 * Legenda queimada do Reel — o texto que entra e sai ao longo do vídeo.
 *
 * A maioria assiste sem som. Sem legenda no quadro, o Reel depende de alguém
 * parar para ler um bloco estático embaixo do gráfico, e é aí que o dedo passa.
 * As contas que crescem no nicho queimam a legenda no vídeo, em pedaços curtos
 * que acompanham o ritmo.
 *
 * Nada disso precisa de áudio nem de reconhecimento de fala: o Reel já é uma
 * função determinística de `t`, e a legenda é só mais uma. O mesmo dia gera o
 * mesmo vídeo, que é a regra da casa.
 */

/** Depois do hook (que sai em 12%) e antes do fim, com folga para respirar. */
const INICIO = 0.16
const FIM = 0.97

/**
 * Quebra um texto em pedaços que cabem numa linha larga sem virar parágrafo.
 *
 * Sete palavras é o teto prático: acima disso a faixa ganha uma terceira linha e
 * come a carta. A quebra respeita fim de frase, porque cortar no meio de uma
 * oração obriga a reler.
 */
export function picar(texto, maxPalavras = 7) {
  const frases = String(texto || '')
    .split(/(?<=[.!?])\s+/)
    .map((f) => f.trim())
    .filter(Boolean)

  const pedacos = []
  for (const frase of frases) {
    const palavras = frase.split(/\s+/)
    if (palavras.length <= maxPalavras) {
      pedacos.push(frase)
      continue
    }
    // frase longa: parte em blocos, sem deixar um pedaço órfão de uma palavra
    for (let i = 0; i < palavras.length; i += maxPalavras) {
      const bloco = palavras.slice(i, i + maxPalavras)
      const resto = palavras.length - (i + maxPalavras)
      if (resto > 0 && resto < 3) {
        pedacos.push(palavras.slice(i).join(' '))
        break
      }
      pedacos.push(bloco.join(' '))
    }
  }
  return pedacos
}

/**
 * Segundos mínimos que um pedaço fica na tela.
 *
 * Legenda queimada se lê a umas três palavras por segundo. Sem piso, o reparto
 * proporcional dava 0,58s para "FALTAM 2 DIAS" — tempo de piscar, não de ler.
 */
const MINIMO_S = 0.9

/**
 * Segmentos com entrada e saída em `t`.
 *
 * A duração é proporcional ao tamanho do pedaço, com piso. Quando os pisos
 * somados não cabem na janela, a lista é enxugada pelo meio — o começo diz do
 * que se trata e o fim carrega o limite da casa; é o miolo que sobra.
 *
 * @returns {{de: number, ate: number, texto: string}[]}
 */
export function roteiroDeLegenda(partes, { inicio = INICIO, fim = FIM, segundos = 12 } = {}) {
  let pedacos = partes.filter(Boolean)
  if (!pedacos.length) return []

  const janela = fim - inicio
  const minimo = MINIMO_S / segundos

  // Enxuga até os pisos caberem. Tira do meio, nunca a primeira nem a última.
  while (pedacos.length > 2 && pedacos.length * minimo > janela) {
    pedacos = [...pedacos.slice(0, Math.floor(pedacos.length / 2)), ...pedacos.slice(Math.floor(pedacos.length / 2) + 1)]
  }

  const pesos = pedacos.map((p) => Math.max(3, p.split(/\s+/).length))
  const soma = pesos.reduce((a, b) => a + b, 0)

  // Proporcional com piso, depois normaliza para fechar exatamente na janela.
  const brutas = pesos.map((p) => Math.max(minimo, (p / soma) * janela))
  const escala = janela / brutas.reduce((a, b) => a + b, 0)
  const duracoes = brutas.map((d) => d * escala)

  const segmentos = []
  let cursor = inicio
  for (let i = 0; i < pedacos.length; i++) {
    segmentos.push({
      de: Number(cursor.toFixed(4)),
      // encosta no próximo sem sobrepor: dois segmentos visíveis ao mesmo tempo
      // viram borrão, e o teste varre os 360 quadros justamente por isso
      ate: Number(Math.min(fim, cursor + duracoes[i]).toFixed(4)),
      texto: pedacos[i],
    })
    cursor += duracoes[i]
  }
  return segmentos
}

/**
 * O roteiro da peça do dia.
 *
 * Só a LEITURA entra, nunca o título nem a data.
 *
 * A primeira versão repetia os dois, e o quadro ficava com a mesma informação
 * duas vezes: estática embaixo do gráfico e de novo na caixa. A divisão que
 * funciona é outra — o bloco fixo guarda a identificação da peça (o que é,
 * quando), e a legenda carrega o que se lê. Quem chega no meio do vídeo ainda vê
 * o título; quem fica, lê o resto.
 *
 * O limite fecha porque é a frase que diferencia a conta, e é a última que fica
 * na tela.
 */
export function legendaDoReel(dados, segundos = 12) {
  const corpo = dados.textoEvento || dados.leitura || ''
  const partes = [...picar(corpo), 'O céu é de todos. A casa é de cada um.']
  return roteiroDeLegenda(partes, { segundos })
}
