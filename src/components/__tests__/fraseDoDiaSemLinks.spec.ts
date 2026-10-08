import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

/**
 * A leitura do dia: um aviso de UMA frase, e o detalhe a um toque.
 *
 * Seis versões ficaram pelo caminho, e as armadilhas se repetem — por isso
 * cada uma virou asserção aqui:
 *
 *  1. dizer o óbvio ("hoje o dinheiro pede cuidado");
 *  2. nomear o aspecto como se nome fosse conselho;
 *  3. e 4. tornar palavras tocáveis (rolar a tela; abrir modal) — no aparelho
 *     os sublinhados pontilhados leram como corretor ortográfico;
 *  5. texto correto mas comprido, fechado por template genérico;
 *  6. o mesmo template repetido em cada card do detalhe, deixando claro que
 *     era molde e não conselho.
 *
 * O bloco é o mais nobre da Home. Tudo que entra nele tem de caber numa linha
 * ou ficar atrás do "Ler mais".
 */

const raiz = join(__dirname, '..', '..')
const FRASE = readFileSync(join(raiz, 'components', 'FraseDoDia.tsx'), 'utf-8')
const HOME = readFileSync(join(raiz, 'screens', 'home', 'HomeScreen.tsx'), 'utf-8')

describe('o aviso: uma frase', () => {
  it('o topo monta UM aviso, não um parágrafo', () => {
    expect(FRASE).toContain('const aviso =')
    // O resumo de quatro partes (tema + significado + onde pega + status)
    // estava correto e era longo demais para o lugar que ocupa.
    expect(FRASE, 'o status tem cards próprios logo abaixo; no texto duplicava')
      .not.toContain('getLifeAreaLabel')
  })

  it('abre com o tema curado, não com palavra solta nem template', () => {
    expect(FRASE).toContain('temaDoTransito')
    expect(FRASE, 'a palavra-chave solta era a abertura genérica').not.toContain('palavraDeSentido')
  })
})

describe('o detalhe: aspecto e texto, nada mais', () => {
  it('o título de cada item é o ASPECTO', () => {
    expect(FRASE).toContain('buildTransitTitle')
  })

  it('NÃO repete o template de ação prática', () => {
    // Quatro cards com "observe sinais, registre decisões e execute um próximo
    // passo simples" deixam claro que é molde, não conselho.
    expect(FRASE, 'actionText é o template de quatro variações').not.toContain('actionText')
  })

  it('o corpo vem do catálogo curado', () => {
    expect(FRASE).toMatch(/modalBody \|\| n\?\.shortText/)
  })

  it('tem teto — além disso vira lista, não leitura', () => {
    expect(FRASE).toMatch(/MAX_DETALHES = \d/)
    expect(FRASE).toContain('ordenados.slice(0, MAX_DETALHES)')
  })

  it('tem o controle de expandir, nos dois sentidos', () => {
    expect(FRASE).toMatch(/Ler mais/)
    expect(FRASE).toMatch(/Mostrar menos/)
  })
})

describe('o que não pode voltar', () => {
  it('nenhuma PALAVRA do texto responde a toque', () => {
    // O único toque permitido é o do botão "Ler mais", que é um controle
    // separado, abaixo do parágrafo.
    const toques = FRASE.match(/onPress=\{[^}]*\}/g) || []
    expect(toques, 'só o botão de expandir pode ter onPress').toEqual(['onPress={alternar}'])
    expect(FRASE).not.toMatch(/\bonAbrirTransito\b/)
    expect(FRASE).not.toMatch(/\bonSelectTransit\b/)
  })

  it('não tem estilo de link sobrando', () => {
    expect(FRASE).not.toMatch(/textDecorationStyle/)
    expect(FRASE).not.toMatch(/textDecorationLine/)
  })

  it('a narrativa recebe a ÁREA REAL, nunca null', () => {
    // Era a causa do texto genérico: sem área, o catálogo cai no ramo default
    // E escreve literalmente "em área de vida".
    expect(FRASE).toContain('buildUnifiedTransitNarrative(t as any, areasDe(t)[0] || null, language)')
    expect(
      FRASE,
      'passar null de volta aqui traz o texto genérico junto',
    ).not.toMatch(/buildUnifiedTransitNarrative\([^)]*,\s*null\s*,/)
  })

  it('a janela aparece em palavras, não na forma compacta', () => {
    // "pico ha 6d" apareceu no meio de um parágrafo e ninguém entendeu: sem
    // acento, abreviado e sem sujeito.
    expect(FRASE).toContain('janelaEmPalavras')
    expect(FRASE, 'a forma compacta serve a chip, não a texto corrido')
      .not.toContain('formatPeakETA')
  })

  it('a Home monta a frase sem passar ação nenhuma', () => {
    expect(HOME).toMatch(/<FraseDoDia[\s\S]{0,200}\/>/)
    expect(HOME).not.toContain('onAbrirTransito')
  })
})
