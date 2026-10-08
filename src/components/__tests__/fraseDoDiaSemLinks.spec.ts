import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

/**
 * A leitura do dia é texto. Só texto.
 *
 * Quatro versões tentaram torná-la interativa, e a última chegou a funcionar:
 * toda palavra-chave de um trânsito ativo virava porta para a interpretação
 * dele. No aparelho ficou ruim — quatro sublinhados pontilhados dourados num
 * parágrafo de cinco linhas leem como corretor ortográfico, não como link, e o
 * bloco que devia ser a parte mais calma da tela virou a mais agitada.
 *
 * A frase não precisa levar a lugar nenhum: o caminho para a interpretação já
 * existe e é melhor — a grade logo abaixo e o modal de cada planeta, que tem o
 * link próprio para a lista.
 *
 * Isto aqui existe porque a tentação de "ligar" a frase volta sempre: ela é o
 * texto mais lido da Home e parece o lugar óbvio para um atalho. Já custou
 * quatro rodadas; o teste guarda a decisão.
 */

const raiz = join(__dirname, '..', '..')
const FRASE = readFileSync(join(raiz, 'components', 'FraseDoDia.tsx'), 'utf-8')
const HOME = readFileSync(join(raiz, 'screens', 'home', 'HomeScreen.tsx'), 'utf-8')

describe('leitura do dia: texto sem links', () => {
  it('não tem palavra tocável', () => {
    expect(FRASE, 'nada na frase deve responder a toque').not.toMatch(/onPress/)
    expect(FRASE, 'nem receber ação de fora').not.toMatch(/\bonAbrirTransito\b/)
    expect(FRASE, 'nem a que rolava a tela').not.toMatch(/\bonSelectTransit\b/)
  })

  it('não tem estilo de link sobrando', () => {
    // O pontilhado dourado era o que lia como erro de ortografia.
    expect(FRASE).not.toMatch(/textDecorationStyle/)
    expect(FRASE).not.toMatch(/textDecorationLine/)
  })

  it('a Home monta a frase sem passar ação nenhuma', () => {
    expect(HOME).toMatch(/<FraseDoDia[\s\S]{0,200}areas=\{orderedLifeAreas\}[\s\S]{0,40}\/>/)
    expect(HOME).not.toContain('onAbrirTransito')
  })

  it('o conteúdo continua: o resumo do status não saiu junto com os links', () => {
    // Tirar o link não podia virar tirar o texto. A área que mais pede atenção
    // e a que tem folga continuam ditas.
    expect(FRASE).toContain('getLifeAreaLabel')
    expect(FRASE).toMatch(/porStatus\.length >= 2/)
  })

  it('a frase devolve uma string, não pedaços', () => {
    // Pedaços só existiam para marcar âncoras.
    expect(FRASE).toMatch(/useMemo<string \| null>/)
  })
})
