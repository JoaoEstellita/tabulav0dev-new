/**
 * O carrossel educativo automático.
 *
 * ── POR QUE EXISTE ─────────────────────────────────────────────────────────
 *
 * O João: "quando é educativo, acho que educativo são os carrosséis, com mais
 * conteúdo, mais trabalhado; e post são para anunciar eventos". Um educativo
 * saía como post único, e um post não sustenta a leitura de um conceito.
 *
 * Só alguns educativos tinham carrossel escrito à mão (`temasDeCarrossel.mjs`).
 * Aqui qualquer educativo — conceito, planeta no signo, aspecto natal — vira um
 * carrossel curto, fatiando o texto curado que já existe:
 *
 *   capa   a roda do dia + o título + o gancho
 *   texto  o conteúdo em frases grandes, uma ou duas por slide
 *   fecho  a chamada para o app
 *
 * O texto inteiro continua na legenda; o carrossel é a versão para arrastar.
 */

/** Os tipos de assunto que viram carrossel educativo. */
export const TIPOS_EDUCATIVOS = ['conceito', 'planeta_no_signo', 'aspecto_natal']

export function ehEducativo(tipo) {
  return TIPOS_EDUCATIVOS.includes(tipo)
}

/**
 * O texto em fatias, uma ou duas frases por slide.
 *
 * Alvo de no máximo `maxSlides` fatias: para um texto de seis frases dá três
 * slides de duas; para um mais longo, agrupa mais por slide em vez de estourar
 * o carrossel. Nunca corta no meio de uma frase.
 */
export function fatiarTexto(texto, maxSlides = 4) {
  const frases = String(texto || '')
    .split(/(?<=[.!?])\s+/)
    .map((f) => f.trim())
    .filter(Boolean)
  if (!frases.length) return []

  const porGrupo = Math.max(1, Math.ceil(frases.length / maxSlides))
  const fatias = []
  for (let i = 0; i < frases.length; i += porGrupo) {
    fatias.push(frases.slice(i, i + porGrupo).join(' '))
  }
  return fatias
}

/**
 * Os slides prontos para `montarSlide`.
 *
 * @param {object} base  o mesmo `base` da peça: `{ data, corpos, forte,
 *   destaque, dataRotulo, signo, variacao }`
 * @param {object} peca  de `pecaDoAssunto`: `{ olho, titulo, texto }`
 * @returns {object[]} slides na ordem do carrossel
 */
export function slidesDoEducativo(base, peca) {
  const fatias = fatiarTexto(peca.texto)
  const total = fatias.length + 2 // capa + fatias + fecho

  const slides = [
    { ...base, tipo: 'capa', olho: peca.olho, titulo: peca.titulo, texto: peca.texto, passo: 1, total },
  ]
  fatias.forEach((t, i) => {
    slides.push({ ...base, tipo: 'texto', olho: peca.olho, texto: t, passo: i + 2, total })
  })
  slides.push({
    ...base,
    tipo: 'fecho',
    passo: total,
    total,
    titulo: 'Veja onde isso\ncai no seu mapa',
    texto: 'O cálculo completo do seu mapa, de graça, no link da bio.',
  })
  return slides
}
