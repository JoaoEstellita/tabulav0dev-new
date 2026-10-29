import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

/**
 * O CONTRASTE DOS NOMES, na roda de status e nas tendências emocionais.
 *
 * Os dois componentes mostram um par: um NÚMERO grande e colorido, e o NOME do
 * que ele mede. O nome é metade da informação — "44" sozinho não diz 44 de quê
 * —, e nos dois ele estava no mesmo cinza dos textos de apoio, em 12px, sobre
 * fundo escuro. Dava para ver que havia uma palavra ali e não para lê-la.
 *
 * ⚠️ NÃO foi resolvido com fonte maior, e o motivo é medido: na roda, subir o
 * rótulo de 12 para 14px encolhe o diâmetro em 17 a 21%, porque o raio sai de
 * uma busca limitada pela LARGURA dos chips. A roda pequena demais já tinha
 * sido queixa — resolver uma reclamação criando a anterior de novo não é
 * resolver.
 *
 * Este teste trava o contraste, não o tamanho.
 */

const raiz = join(__dirname, '..', '..')
const arquivo = (p: string) => readFileSync(join(raiz, p), 'utf-8')

/** Luminância relativa (WCAG). */
function luminancia(hex: string): number {
  const n = hex.replace('#', '')
  const canais = [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16) / 255)
  const lin = canais.map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4))
  return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2]
}

function contraste(a: string, b: string): number {
  const [x, y] = [luminancia(a), luminancia(b)].sort((p, q) => q - p)
  return (x + 0.05) / (y + 0.05)
}

/** O fundo do app: o degradê vai de #0F0F23 a #1A1A3A. O mais claro é o pior caso. */
const FUNDO = '#1A1A3A'

describe('contraste dos rótulos', () => {
  it('a conta de contraste está certa — âncoras conhecidas', () => {
    expect(contraste('#FFFFFF', '#000000')).toBeCloseTo(21, 1)
    expect(contraste('#000000', '#000000')).toBeCloseTo(1, 5)
  })

  /**
   * ⚠️ O CINZA ANTIGO FICA REGISTRADO AQUI. Se alguém reverter o rótulo para
   * `TINTA`, este teste diz exatamente quanto se perde — em vez de a queixa
   * voltar meses depois sem ninguém lembrar que já tinha sido corrigida.
   */
  it('o cinza de apoio não serve para o nome, e por quanto', () => {
    const antigo = contraste('#8892a4', FUNDO)
    const novo = contraste('#C7D2E8', FUNDO)
    expect(novo, `antigo ${antigo.toFixed(1)}:1 · novo ${novo.toFixed(1)}:1`).toBeGreaterThan(antigo * 1.5)
    // AAA para texto normal é 7:1. O nome é pequeno e importa, então mira alto.
    expect(novo).toBeGreaterThanOrEqual(7)
  })

  for (const [nome, caminho] of [
    ['roda de status', 'components/RodaDeStatus.tsx'],
    ['tendências emocionais', 'components/ClimaEmocional.tsx'],
  ] as const) {
    it(`${nome}: o rótulo usa a cor de contraste, não a de apoio`, () => {
      const fonte = arquivo(caminho)
      const m = fonte.match(/const TINTA_ROTULO = '(#[0-9A-Fa-f]{6})'/)
      expect(m, 'TINTA_ROTULO sumiu — o rótulo voltou para a cor de apoio?').not.toBeNull()
      const cor = m![1]
      expect(contraste(cor, FUNDO), `${cor} dá ${contraste(cor, FUNDO).toFixed(1)}:1`)
        .toBeGreaterThanOrEqual(7)
      // E o estilo do rótulo tem de de fato usá-la.
      expect(fonte).toMatch(/rotulo: \{[^}]*color: TINTA_ROTULO/)
    })
  }

  /**
   * A linha que diz "Tendência do dia" é a ressalva de que estes números são
   * leitura do céu e não medida da pessoa. Uma ressalva que ninguém lê não
   * cumpre o papel de ressalva — ela era #5c6477, mais escura que o rótulo.
   */
  it('a ressalva das tendências é legível', () => {
    const m = arquivo('components/ClimaEmocional.tsx').match(/nota: \{[^}]*color: '(#[0-9A-Fa-f]{6})'/)
    expect(m, 'estilo `nota` sumiu').not.toBeNull()
    expect(contraste(m![1], FUNDO), `${m![1]} dá ${contraste(m![1], FUNDO).toFixed(1)}:1`)
      .toBeGreaterThanOrEqual(4.5)
  })
})
