import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const LF = String.fromCharCode(10)
const limpar = (p: string) => readFileSync(p, 'utf8')
  .split(LF)
  .filter((l) => !/^\s*(\/\/|\*|\/\*)/.test(l))
  .join(LF)

const ESTUDO = limpar(join(__dirname, '..', 'EstudoScreen.tsx'))
const LICAO = limpar(join(__dirname, '..', 'LicaoScreen.tsx'))
const BLOCO = limpar(join(__dirname, '..', '..', '..', 'components', 'estudo', 'BlocoDoEstudo.tsx'))
const COSMOS = limpar(join(__dirname, '..', '..', 'cosmos', 'CosmosScreen.tsx'))

describe('a aba Estudo dentro de Mapa', () => {
  /**
   * ⚠️ ESTUDO NÃO É UM QUINTO SISTEMA DE MAPA. Pô-lo como par de "Védico"
   * mentiria sobre o que ele é, e cinco botões não cabem numa linha de celular
   * (hoje são quatro a ~70px). Ele é um nível ACIMA.
   */
  it('não entra no alternador de sistemas', () => {
    expect(COSMOS, 'Estudo virou um quinto mapMode').not.toMatch(/mapMode === 'estudo'/)
    expect(COSMOS, 'o alternador de sistemas ganhou um quinto botão')
      .not.toMatch(/setMapMode\(['"]estudo['"]\)/)
  })

  it('existe um alternador de topo com duas faces', () => {
    expect(COSMOS, 'o estado da aba de topo sumiu').toMatch(/abaDoMapa/)
    expect(COSMOS, 'o alternador Mapas|Estudo sumiu').toMatch(/setAbaDoMapa\(/)
  })

  /** O alternador de sistemas e todo o conteúdo de mapa ficam DENTRO de "Mapas". */
  it('o conteúdo de mapa fica condicionado à face Mapas', () => {
    expect(COSMOS, 'o conteúdo de mapa ficou fora da condição da aba')
      .toMatch(/abaDoMapa === 'mapas'/)
    expect(COSMOS, 'a tela do Estudo não foi ligada').toMatch(/<EstudoScreen \/>/)
  })
})

describe('o renderizador de blocos', () => {
  /**
   * ⚠️ O GANCHO É INERTE NA FASE 1. Se ele renderizar qualquer coisa — nem que
   * seja um espaço — a lição ganha um buraco visual que ninguém pediu, e a
   * fase 2 passa a ter de "consertar" em vez de só preencher.
   */
  it('ganchoPessoal não desenha nada', () => {
    expect(BLOCO, 'o gancho deixou de ser inerte')
      .toMatch(/ganchoPessoal'\)\s*return null/)
  })

  /** Um tipo sem tratamento sumiria da tela em silêncio. */
  it('cobre os sete tipos de bloco', () => {
    for (const t of ['paragrafo', 'destaque', 'sincronicidade', 'exemplo', 'cuidado', 'ganchoPessoal', 'figura']) {
      expect(BLOCO, `o tipo "${t}" não é tratado`).toContain(`'${t}'`)
    }
  })

  /**
   * ⚠️ A SINCRONICIDADE SEPARA FATO DE LEITURA. As duas primeiras linhas são
   * verificáveis; a terceira é interpretação da tradição. Emendá-las
   * apresentaria a leitura como demonstrada — e é justamente a credibilidade
   * que esta área existe para construir.
   */
  it('a sincronicidade separa visualmente o fato da leitura', () => {
    expect(BLOCO, 'o divisor entre fato e leitura sumiu').toMatch(/sincDivisor/)
    expect(BLOCO, 'a leitura deixou de ter tratamento próprio').toMatch(/sincLeitura/)
  })

  /**
   * ⚠️ O MODO EXPLICADO FICA DESLIGADO AQUI. Fora do Estudo ele troca
   * "quadratura" pela palavra comum; aqui o termo técnico É o assunto da
   * lição, e trocá-lo esvaziaria o que se foi aprender.
   */
  it('liga o glossário mas desliga a troca do modo Explicado', () => {
    expect(BLOCO, 'a lição deixou de ligar os termos ao glossário')
      .toMatch(/TextoComGlossario/)
    const comSimples = BLOCO.match(/<TextoComGlossario[^>]*simples/g) || []
    const total = BLOCO.match(/<TextoComGlossario/g) || []
    expect(comSimples.length, 'algum texto do Estudo voltaria a trocar o termo técnico')
      .toBe(total.length)
  })
})

/**
 * ⚠️ AS FIGURAS SAO DESENHADAS, NAO CARREGADAS. Imagem raster engordaria todo
 * OTA (os assets do app ja somam 9 MB) e borraria em tela densa; URL remota
 * deixaria a licao sem figura justamente offline, que e quando se estuda.
 */
describe('as figuras do Estudo', () => {
  const FIGURA = limpar(join(__dirname, '..', '..', '..', 'components', 'estudo', 'FiguraDoEstudo.tsx'))

  it('nao usa imagem raster nem rede', () => {
    expect(FIGURA, 'virou <Image>, que pesa no OTA e borra em tela densa').not.toMatch(/<Image/)
    expect(FIGURA, 'figura vindo de require() de asset').not.toMatch(/require\(.*\.(png|jpe?g|webp|gif)/i)
    expect(FIGURA, 'figura vindo da rede: sem ela offline').not.toMatch(/https?:\/\//)
  })

  it('uma chave sem desenho nao vira moldura vazia', () => {
    expect(FIGURA, 'o never sumiu — chave nova sairia em branco e em silencio')
      .toMatch(/const naoDesenhada: never = chave/)
  })

  /** Quem usa leitor de tela recebe a descricao no lugar do desenho. */
  it('a figura e um no acessivel com texto alternativo', () => {
    expect(FIGURA, 'sem accessibilityLabel o desenho e mudo no leitor de tela')
      .toMatch(/accessibilityLabel=\{descricao\}/)
    expect(FIGURA, 'sem role de imagem o leitor nao anuncia o que e')
      .toMatch(/accessibilityRole="image"/)
  })
})

describe('a tela do Estudo', () => {
  /**
   * ⚠️ NADA É TRAVADO. A trilha RECOMENDA a próxima com uma borda, não a
   * impõe. Travar pune o curioso, e o curioso é exatamente quem esta área
   * existe para servir.
   */
  it('não bloqueia lição por ordem', () => {
    expect(ESTUDO, 'a trilha passou a travar lição').not.toMatch(/disabled=/)
    expect(ESTUDO, 'apareceu cadeado na trilha').not.toMatch(/lock-closed/)
  })

  it('mostra onde a pessoa parou', () => {
    expect(ESTUDO, 'o progresso sumiu do topo').toMatch(/proximaLicao\(\)/)
    expect(ESTUDO, 'a barra de progresso sumiu').toMatch(/barraCheia/)
  })

  it('a busca cobre lições E verbetes', () => {
    expect(ESTUDO, 'a busca deixou de cobrir as duas camadas').toMatch(/CATALOGO\.filter/)
  })

  it('agrupa a trilha por ato e a biblioteca por categoria', () => {
    expect(ESTUDO, 'o agrupamento por ato sumiu').toMatch(/l\.ato === ato/)
    expect(ESTUDO, 'o agrupamento por categoria sumiu').toMatch(/v\.categoria === chave/)
  })

  /**
   * ⚠️ SEM LIÇÃO NENHUMA A TELA TEM DE ABRIR. A trilha é escrita em várias
   * tarefas; se a tela quebrasse com o catálogo incompleto, ninguém
   * conseguiria ver o progresso do trabalho.
   */
  it('aguenta o catálogo sem lições', () => {
    expect(ESTUDO, 'divisão por zero quando não há lição')
      .toMatch(/LICOES\.length \?/)
    expect(ESTUDO, 'falta a mensagem de curso em construção')
      .toMatch(/está sendo escrito/)
  })

  /**
   * ⚠️ MARCA COMO LIDA AO ABRIR, não ao rolar até o fim. Detectar o fim da
   * rolagem erra para texto curto (que cabe na tela e nunca dispara) e para
   * quem lê em duas sentadas.
   */
  it('a lição marca como lida ao abrir', () => {
    expect(LICAO, 'a marca de lido virou dependente da rolagem')
      .toMatch(/useEffect\(\(\) => \{ marcarLido\(unidade\.id\) \}/)
    expect(LICAO, 'apareceu detecção de fim de rolagem').not.toMatch(/onScroll|contentOffset/)
  })

  /** `flex: 1` no ScrollView e `minHeight: 0` na cadeia: regras deste projeto. */
  it('a rolagem funciona no web e no PWA', () => {
    expect(LICAO, 'ScrollView sem flex 1 não rola no web').toMatch(/style=\{\{ flex: 1 \}\}/)
    expect(ESTUDO, 'ScrollView sem flex 1 não rola no web').toMatch(/style=\{\{ flex: 1 \}\}/)
    expect(ESTUDO, 'sem minHeight 0 a rolagem trava no PWA').toMatch(/minHeight: 0/)
  })
})
