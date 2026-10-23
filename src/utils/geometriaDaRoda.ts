/**
 * A geometria da roda de status — só matemática, sem React.
 *
 * ⚠️ Fora do componente de propósito. Importar um `.tsx` puxa `react-native`,
 * que o vitest não parseia (Flow), e aí nenhum teste alcança estas contas. Duas
 * vezes hoje foi preciso extrair dado testável de dentro de UI (a tabela de
 * símbolos da grade, o padrão de notificações); aqui já começa separado.
 */

/** Um eixo da roda: a área, o rótulo e o valor de 0 a 100 (ou nulo). */
export type EixoDaRoda = {
  chave: string
  rotulo: string
  valor: number | null
  /**
   * De 0 a 100: quanto do peso desta área vem de trânsito que passa rápido.
   *
   * Vira a SOMBRA dentro do polígono — a fatia da nota que está em jogo hoje.
   * `null` ou ausente simplesmente não desenha sombra naquele eixo; a roda
   * funciona igual sem isto, que é como ela nasceu.
   */
  movimento?: number | null
}

export type Ponto = { x: number; y: number }

/**
 * O ângulo de um eixo, em radianos.
 *
 * ⚠️ Começa no TOPO e anda no sentido horário — é como as pessoas leem uma roda
 * de atributos, e é o que a referência que o João mandou faz. Sem o `-90°` a
 * primeira área nasceria na direita, e a figura inteira pareceria girada.
 */
export function anguloDoEixo(indice: number, total: number, giro = 0): number {
  if (total <= 0) return 0
  return ((indice + giro) / total) * Math.PI * 2 - Math.PI / 2
}

/**
 * Quantas posições girar a roda para o nome mais longo cair onde há espaço.
 *
 * ⚠️ O ângulo inicial é livre, a ORDEM não. Girar o conjunto não reordena nada
 * — cada área mantém os mesmos vizinhos — mas muda QUAL posição cada nome
 * ocupa, e as posições têm espaço muito diferente: no topo e na base o rótulo
 * centraliza e dispõe da largura toda; nas laterais ele só tem o que sobra de
 * um lado.
 *
 * Medido: "Espiritualidade" caía exatamente na lateral esquerda e sozinha
 * limitava o diâmetro a 140px — numa tela de 320pt não cabia de jeito nenhum.
 * Girando 6 posições os nomes longos vão para topo e base, e o diâmetro vai a
 * 224px com o nome INTEIRO. O giro é calculado, não fixo, porque o tamanho dos
 * rótulos muda com o idioma.
 */
export function melhorGiro(
  rotulos: string[],
  lado: number,
  medirTexto: (texto: string) => number,
  folga: number,
): { giro: number; raio: number } {
  const total = rotulos.length
  if (!total || lado <= 0) return { giro: 0, raio: 0 }
  const centro = lado / 2
  let melhor = { giro: 0, raio: 0 }

  for (let giro = 0; giro < total; giro++) {
    let raio = 0
    for (let r = Math.floor(centro * 0.2); r < centro; r++) {
      let cabe = true
      for (let i = 0; i < total; i++) {
        const cos = Math.cos(anguloDoEixo(i, total, giro))
        const x = centro + cos * (r + folga)
        // No topo e na base o texto centraliza: o espaço é o dobro da menor
        // sobra. Nas laterais ele cresce para fora, e só conta aquele lado.
        const disponivel =
          Math.abs(cos) < 0.25 ? 2 * Math.min(x, lado - x) : cos > 0 ? lado - x : x
        if (medirTexto(rotulos[i]) > disponivel) { cabe = false; break }
      }
      if (cabe) raio = r
    }
    if (raio > melhor.raio) melhor = { giro, raio }
  }
  return melhor
}

/** Prende o valor entre 0 e 100. Nulo e lixo viram 0 — nunca NaN na tela. */
export function fracaoDoValor(valor: number | null | undefined): number {
  const n = Number(valor)
  if (!Number.isFinite(n)) return 0
  return Math.max(0, Math.min(100, n)) / 100
}

/**
 * Onde um ponto cai, dado o eixo e a fração do raio.
 *
 * ⚠️ O raio é proporcional ao valor (linear), não à raiz. Isso significa que a
 * ÁREA cresce com o quadrado: um valor duas vezes maior ocupa quatro vezes mais
 * espaço. É o defeito clássico do radar, e a saída aqui não é distorcer o raio
 * — é nunca deixar a área carregar a mensagem. Por isso cada vértice leva o
 * número escrito, e os anéis de 35 e 62 dão a referência.
 */
export function pontoNoEixo(
  indice: number,
  total: number,
  fracao: number,
  raio: number,
  centro: Ponto,
  giro = 0,
): Ponto {
  const a = anguloDoEixo(indice, total, giro)
  const r = Math.max(0, Math.min(1, fracao)) * raio
  return { x: centro.x + Math.cos(a) * r, y: centro.y + Math.sin(a) * r }
}

/** Os vértices do polígono dos valores, na ordem dos eixos. */
/**
 * O polígono da SOMBRA: em cada eixo, a parte do valor que está em movimento.
 *
 * ⚠️ Fica sempre DENTRO do polígono principal, nunca fora. O desenho cheio é a
 * nota; a sombra é a fatia dela que se mexe; o vão entre as duas é o que está
 * assentado. Desenhar a sombra no valor bruto do movimento colocaria duas
 * escalas diferentes no mesmo lugar — o jeito clássico de um gráfico mentir
 * sem querer.
 *
 * Eixo sem movimento conhecido cai no próprio valor, e ali a sombra encosta na
 * borda — melhor do que colapsar para o centro e sugerir "nada se move".
 */
export function poligonoDaSombra(eixos: EixoDaRoda[], raio: number, centro: Ponto, giro = 0): Ponto[] {
  return eixos.map((e, i) => {
    const m = e.movimento
    const fracaoMovel =
      m === null || m === undefined || !Number.isFinite(Number(m))
        ? 1
        : Math.max(0, Math.min(100, Number(m))) / 100
    return pontoNoEixo(i, eixos.length, fracaoDoValor(e.valor) * fracaoMovel, raio, centro, giro)
  })
}

export function poligonoDosValores(eixos: EixoDaRoda[], raio: number, centro: Ponto, giro = 0): Ponto[] {
  return eixos.map((e, i) => pontoNoEixo(i, eixos.length, fracaoDoValor(e.valor), raio, centro, giro))
}

/**
 * Um anel de referência — o contorno do polígono regular numa certa fração.
 *
 * Desenhado como POLÍGONO, não como círculo: num radar o valor mora no vértice,
 * e um anel circular passaria por dentro das arestas, fazendo um valor que
 * encosta no limiar parecer abaixo dele.
 */
export function anelDeReferencia(fracao: number, total: number, raio: number, centro: Ponto, giro = 0): Ponto[] {
  return Array.from({ length: total }, (_, i) => pontoNoEixo(i, total, fracao, raio, centro, giro))
}

/** "x,y x,y ..." — o formato que o `points` do SVG espera. */
export function paraPoints(pontos: Ponto[]): string {
  return pontos.map((p) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(' ')
}

/**
 * Onde o rótulo de um eixo fica, e como ancorá-lo.
 *
 * ⚠️ O ancoramento muda com o lado: à direita da roda o texto cresce para fora
 * (`start`), à esquerda para dentro (`end`), e em cima e embaixo fica centrado.
 * Sem isso, os rótulos das laterais invadem o desenho ou saem da tela — num
 * celular estreito, com oito deles, é o primeiro jeito de quebrar o layout.
 */
export function rotuloDoEixo(
  indice: number,
  total: number,
  raio: number,
  centro: Ponto,
  folga: number,
  giro = 0,
): { x: number; y: number; ancora: 'start' | 'middle' | 'end' } {
  const a = anguloDoEixo(indice, total, giro)
  const cos = Math.cos(a)
  const p = { x: centro.x + cos * (raio + folga), y: centro.y + Math.sin(a) * (raio + folga) }
  // A tolerância evita que um eixo quase vertical (cos ~ 0) seja tratado como
  // lateral e empurre o texto para cima do desenho.
  const ancora = Math.abs(cos) < 0.25 ? 'middle' : cos > 0 ? 'start' : 'end'
  return { ...p, ancora }
}

/**
 * A cor do valor, pelas MESMAS faixas que os cards de área usam.
 *
 * ⚠️ Os limiares vêm de fora (`STATUS_THRESHOLDS`, que o backend pode redefinir
 * em runtime) justamente para a roda não criar uma terceira régua: a tela já
 * tem os cards e a grade falando em crítico/moderado/bom.
 *
 * E a cor NUNCA anda sozinha: o validador de paleta mediu verde↔âmbar em ΔE 8.9
 * sob protanopia — passa no piso, mas por pouco. Por isso o componente escreve
 * o número em cada vértice.
 */
export function corDoValor(
  valor: number | null | undefined | '',
  limiares: { criticalBelow: number; positiveAbove: number },
  cores: { critico: string; moderado: string; bom: string; vazio: string },
): string {
  // ⚠️ `Number(null)` e `Number('')` dao ZERO, e `isFinite(0)` e true — sem este
  // guarda, uma area SEM DADO sairia vermelha de critico, dizendo que a vida da
  // pessoa esta em crise quando so falta o numero. Esta armadilha ja mordeu o
  // projeto outras vezes; aqui ela foi pega pelo teste.
  if (valor === null || valor === undefined || valor === '') return cores.vazio
  const n = Number(valor)
  if (!Number.isFinite(n)) return cores.vazio
  if (n >= limiares.positiveAbove) return cores.bom
  if (n >= limiares.criticalBelow) return cores.moderado
  return cores.critico
}
