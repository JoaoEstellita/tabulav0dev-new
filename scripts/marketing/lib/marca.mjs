/**
 * A identidade: a paleta e a estrela da logo.
 *
 * ── DE ONDE SAIU ───────────────────────────────────────────────────────────
 *
 * Da logo do Tábula Estelar: fundo azul quase preto, uma estrela de oito pontas
 * dourada com halo, três reis magos em silhueta contra o horizonte, e o nome em
 * serif romana de caixa alta, "TÁBULA" em creme sobre "ESTELAR" em dourado.
 *
 * As peças já vinham perto sem terem sido feitas para isso: void quase preto,
 * pergaminho e bronze. O que faltava era o essencial da marca — a estrela, a
 * serif do título e o dourado exato.
 *
 * O app entra na conta pelo gradiente `#0F0F23 → #1A1A3A` da HomeScreen: o
 * fundo das peças fica entre o navy da logo e o do aplicativo, para quem vê o
 * post e abre o app reconhecer o mesmo lugar.
 */

/** O azul de fundo, entre o da logo e o do app. */
export const NOITE = '#0B0E22'
export const NOITE_2 = '#141833'

/** O dourado da estrela e de "ESTELAR". */
export const OURO = '#E8B33C'

/** O dourado claro do miolo da estrela, para brilho e destaque. */
export const OURO_CLARO = '#F5D383'

/** O creme de "TÁBULA": o texto longo vive nele. */
export const CREME = '#F2E7CE'

/**
 * A estrela de oito pontas.
 *
 * Quatro pontas longas nos eixos e quatro curtas nas diagonais, como no
 * desenho da logo. Fica como assinatura no rodapé e como selo na capa: é a
 * parte da marca que se reconhece a um metro de distância, antes de ler.
 *
 * @param {number} tamanho  lado do SVG
 * @param {boolean} comHalo o brilho radial atrás, para uso sobre fundo escuro
 */
export function estrelaDeOitoPontas(tamanho = 64, comHalo = false) {
  const c = 50
  const longa = 46
  const curta = 13

  // alterna ponta longa e curta a cada 45°, começando no topo
  const pontos = Array.from({ length: 16 }, (_, i) => {
    const raio = i % 2 === 0 ? longa : curta
    const ang = (i * 22.5 - 90) * (Math.PI / 180)
    return `${(c + raio * Math.cos(ang)).toFixed(2)},${(c + raio * Math.sin(ang)).toFixed(2)}`
  }).join(' ')

  const halo = comHalo
    ? `<defs><radialGradient id="halo"><stop offset="0%" stop-color="${OURO_CLARO}" stop-opacity="0.55"/><stop offset="100%" stop-color="${OURO}" stop-opacity="0"/></radialGradient></defs>
       <circle cx="${c}" cy="${c}" r="48" fill="url(#halo)"/>`
    : ''

  return `<svg viewBox="0 0 100 100" width="${tamanho}" height="${tamanho}" role="img" aria-label="Tábula Estelar">
  ${halo}<polygon points="${pontos}" fill="${OURO}"/>
  <circle cx="${c}" cy="${c}" r="6" fill="${OURO_CLARO}"/>
</svg>`
}

/**
 * A assinatura do rodapé: estrela e arroba, na mesma linha.
 *
 * O rodapé trazia só "@tabula_estelar" em mono, que é assinatura de qualquer
 * conta. Com a estrela ao lado, a peça fica reconhecível mesmo recortada e
 * repostada sem crédito.
 */
export function assinatura(tamanho = 22) {
  return `<span class="assina">${estrelaDeOitoPontas(tamanho)}<span>@tabula_estelar</span></span>`
}

/** O CSS da assinatura, para o `<style>` de quem usa. */
export const CSS_ASSINATURA = `
  .assina { display: inline-flex; align-items: center; gap: 0.8em; }
  .assina svg { display: block; opacity: 0.9; }
`
