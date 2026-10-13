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

  it('o aviso vem da SÍNTESE, não de um trânsito só', () => {
    // A versão anterior usava o de maior força e ignorava os outros seis,
    // misturando escalas de tempo: tema de meses entrava como novidade de hoje.
    expect(FRASE).toContain('sintetizarODia')
    expect(FRASE, 'a palavra-chave solta era a abertura genérica').not.toContain('palavraDeSentido')
  })

  it('o expandido é só as frases, agrupadas por tempo', () => {
    // ⚠️ NÃO HÁ MAIS BLOCOS. Havia "O fundo" (os lentos em prosa), "Hoje" e
    // "Vem aí" — três estruturas para contar o que as frases já contam, cada
    // uma com a sua forma e o seu vocabulário. Saíram, uma a uma, junto com
    // "No saldo" e "O que fazer".
    expect(FRASE, 'uma estrutura só').not.toContain('leitura.blocos')
    expect(FRASE, 'as frases são agrupadas por tempo').toContain('GRUPOS.map')
  })

  it('os lentos têm grupo próprio', () => {
    // Era o que o bloco "O fundo" protegia: um trânsito de Plutão é tema de
    // meses e um aspecto da Lua dura horas. Lado a lado sob "Acontecendo
    // agora", os dois soam igual — e o de meses vira notícia do dia.
    expect(FRASE).toContain("chave: 'lentos'")
    expect(FRASE).toMatch(/chave === 'lentos' \? f\.lento/)
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
    expect(FRASE).toContain('.slice(0, MAX_DETALHES)')
  })

  it('o modal traz TODOS os aspectos da frase, não só o primeiro', () => {
    // ⚠️ Pegava so o primeiro (`.find(Boolean)`), e a frase cita ate dois:
    // "Mercurio em conjuncao e a Lua em conjuncao com o seu Plutao" abria o
    // modal de Mercurio e o da Lua nao existia em lugar nenhum. A linha
    // prometia dois transitos e o toque entregava um.
    //
    // Os dois num modal so, em sequencia — obrigar a escolher entre dois
    // nomes antes de ler seria um passo a mais para a mesma coisa.
    expect(FRASE).toContain('const partes = f.chaves')
    expect(FRASE, 'cada texto vem com o titulo do seu aspecto').toMatch(/partes\.map\(\(p\) => `\$\{p\.titulo\}/)
    expect(FRASE, 'sabe quando ha mais de um').toContain('varios: partes.length > 1')
  })

  it('a leitura completa fica atrás de um toque, não numa lista', () => {
    // A lista de aspectos SAIU da tela. Era ela que fazia o card crescer —
    // cada trânsito com quatro a cinco linhas do catálogo — e repetia, porque
    // a frase logo acima já dizia o que aquele trânsito faz.
    //
    // O texto curado é o ativo mais caro do projeto e não podia sumir: foi
    // para o toque. Cada frase abre a leitura completa do trânsito que a
    // originou.
    expect(FRASE).toContain('ReadingDetailModal')
    expect(FRASE).toContain('porChaveDoTransito')
    expect(FRASE, 'o corpo do modal vem do catálogo curado').toMatch(/modalBody \|\| n\?\.shortText/)
  })

  it('tem o controle de expandir, nos dois sentidos', () => {
    expect(FRASE).toMatch(/Ler mais/)
    expect(FRASE).toMatch(/Mostrar menos/)
  })
})

describe('o que não pode voltar', () => {
  it('nenhuma PALAVRA do texto responde a toque', () => {
    // ⚠️ A REGRA QUE ORIGINOU ESTE TESTE CONTINUA VALENDO.
    //
    // Duas tentativas de tornar PALAVRAS do texto tocáveis foram rejeitadas no
    // device: pontilhados dourados no meio do parágrafo leem como corretor
    // ortográfico, e tiram do lugar o texto que está sendo lido.
    //
    // O que mudou é outra coisa: o BLOCO inteiro da frase virou tocável, com
    // chevron à direita — um padrão de lista, reconhecível, que não interfere
    // na leitura do parágrafo. Foi o que permitiu tirar a lista de aspectos da
    // tela sem perder o texto curado do catálogo.
    //
    // A distinção que este teste protege: tocável é o bloco, nunca um trecho
    // dentro da frase.
    // Dois DESTINOS, e so dois: abrir a leitura daquela frase, ou alternar a
    // lista. A forma varia (condicional no cabecalho, direto no botao de
    // baixo) e isso nao importa — importa que nenhum toque leve a outro lugar,
    // e que nenhum esteja DENTRO do texto.
    const toques = [...new Set(FRASE.match(/onPress=\{[^}]*\}/g) || [])]
    const destinoValido = (t: string) => /setFraseAberta|alternar/.test(t)
    const invasores = toques.filter((t) => !destinoValido(t))
    expect(invasores, `toque com destino inesperado:
${invasores.join('\n')}`).toEqual([])
    expect(FRASE, 'o texto em si nunca recebe toque').not.toMatch(/<TextoComGlossario[^>]*onPress/)
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
