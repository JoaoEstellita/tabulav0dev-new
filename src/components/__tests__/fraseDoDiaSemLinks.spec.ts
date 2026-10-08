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
  it('nenhuma PALAVRA do texto responde a toque', () => {
    // O unico toque permitido e o do botao "Ler mais", que e um controle
    // separado, abaixo do paragrafo. O que nao pode voltar e palavra tocavel
    // DENTRO da frase — era isso que lia como corretor ortografico.
    const toques = FRASE.match(/onPress=\{[^}]*\}/g) || []
    expect(toques, 'so o botao de expandir pode ter onPress').toEqual(['onPress={alternar}'])

    expect(FRASE, 'nao recebe acao de fora').not.toMatch(/\bonAbrirTransito\b/)
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

  it('o resumo e texto corrido, nao uma lista de pedacos', () => {
    // Pedacos so existiam para marcar ancoras no meio da frase.
    expect(FRASE, 'o resumo e costurado como texto').toContain('const resumo = costurar(')
    expect(FRASE).not.toMatch(/Pedaco/)
  })
})

describe('leitura do dia: especifica, nao generica', () => {
  it('a narrativa recebe a AREA REAL, nunca null', () => {
    // Esta era a causa da frase generica. `buildActionHint` escolhe entre
    // quatro templates por tipo de aspecto; com areaLabel nulo ele caia no
    // ramo mais vago E escrevia literalmente "em area de vida":
    //
    //   "Acao pratica: observe sinais, registre decisoes e execute um proximo
    //    passo simples em area de vida conectado a recursos..."
    //
    // Serve para qualquer pessoa em qualquer dia, que e outra forma de dizer
    // que nao serve.
    expect(FRASE).toContain('buildUnifiedTransitNarrative(t as any, areasDe(t)[0] || null, language)')
    expect(
      FRASE,
      'passar null de volta aqui traz o texto generico junto',
    ).not.toMatch(/buildUnifiedTransitNarrative\([^)]*,\s*null\s*,/)
  })

  it('abre com o tema curado do transito, nao com uma palavra solta', () => {
    // "Prova de maturidade" diz algo; "o dia pede foco" nao diz nada.
    expect(FRASE).toContain('temaDoTransito')
    expect(FRASE, 'a palavra-chave solta era a abertura generica').not.toContain('palavraDeSentido')
  })

  it('usa o texto curado do catalogo e o momento real do transito', () => {
    expect(FRASE, 'o corpo vem do catalogo curado').toMatch(/modalBody \|\| n\w*\?\.shortText/)
    expect(FRASE, 'quando o transito pica e informacao especifica').toContain('formatPeakETA')
    expect(FRASE).toContain('getTransitState')
  })
})

describe('leitura do dia: dois niveis', () => {
  it('tem o controle de expandir', () => {
    expect(FRASE).toMatch(/Ler mais/)
    expect(FRASE).toMatch(/Mostrar menos/)
  })

  it('o expandido NAO repete a abertura ja lida', () => {
    // A primeira frase do principal vai no resumo. Repeti-la no topo do
    // detalhe faz o bloco expandido parecer que nao acrescenta nada.
    expect(FRASE).toContain('semAPrimeiraFrase')
    expect(FRASE, 'o resumo usa a primeira frase').toContain('primeiraFrase(curadoPrincipal)')
    expect(FRASE, 'so o principal e cortado; os seguintes vem inteiros')
      .toMatch(/i === 0 \? semAPrimeiraFrase\(completo\) : completo/)
  })

  it('o detalhe tem teto — alem disso vira lista, nao leitura', () => {
    expect(FRASE).toMatch(/MAX_DETALHES = \d/)
    expect(FRASE).toContain('ordenados.slice(0, MAX_DETALHES)')
  })
})
