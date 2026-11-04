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

  /**
   * ⚠️ A REGRA MUDOU DE INTENCAO, e vale registrar por que. Antes era "nenhuma
   * imagem"; agora as dez fotos de planeta que o projeto ja tinha em
   * `public/planets` sao usadas — mas SOBRE o desenho, nunca no lugar dele.
   * Elas somam 11,2 MB (Mercurio: 2,3 MB em 1024x1024): no bundle engordariam
   * todo OTA, e como unica fonte deixariam a licao sem planeta offline.
   *
   * ⚠️ ESTE TESTE PASSOU UM TEMPO SEM TESTAR NADA. O `\b` do regex tinha sido
   * gravado como o BYTE 0x08 por um script, entao `/<Image<0x08>/` nao casava
   * com texto nenhum e o `.not.toMatch` passava sempre. Ver
   * `utils/__tests__/caractereDeControle.spec.ts`, que agora guarda isso.
   */
  it('a foto do planeta e camada sobre o SVG, nunca a unica fonte', () => {
    expect(FIGURA, 'o SVG deixou de ser desenhado: offline ficaria sem planeta')
      .toMatch(/<Svg[\s\S]*?<Image/)
    expect(FIGURA, 'sem onError, a foto que falha deixa um buraco no lugar do desenho')
      .toMatch(/onError=\{\(\) => setSemFoto\(true\)\}/)
    expect(FIGURA, 'a foto entrou no bundle: 11,2 MB em todo OTA')
      .not.toMatch(/require\(.*planets.*\.(png|jpe?g|webp)/i)
    expect(FIGURA, 'URL escrita a mao em vez de sair do config')
      .not.toMatch(/https?:\/\//)
  })

  /** A foto e decorativa: quem le com leitor de tela ja recebe a `descricao`. */
  it('a foto nao duplica o texto alternativo', () => {
    expect(FIGURA, 'o leitor de tela anunciaria a figura duas vezes')
      .toMatch(/accessible=\{false\}/)
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

  /**
   * ⚠️ UM CARTÃO TOCÁVEL, não uma linha de texto. A pergunta de quem volta é
   * "onde eu estava", e a resposta era uma frase cinza que não levava a lugar
   * nenhum: a pessoa tinha de caçar a lição na lista.
   */
  it('mostra onde a pessoa parou, e leva até lá', () => {
    expect(ESTUDO, 'o progresso sumiu do topo').toMatch(/proximaLicao\(\)/)
    expect(ESTUDO, 'a barra de progresso sumiu').toMatch(/barraCheia/)
    expect(ESTUDO, 'o cartão de continuar deixou de abrir a lição')
      .toMatch(/setAberta\(proxima\.id\)/)
  })

  /**
   * ⚠️ O ÍNDICE TEM DE ALCANÇAR A BIBLIOTECA. Ele cobria só os cinco
   * capítulos, e as cinco estantes — 41 verbetes, a maior parte do conteúdo —
   * ficavam de fora: para chegar a "Casas" era preciso rolar a trilha inteira.
   * Índice que não alcança o conteúdo todo é um atalho que mente sobre o
   * tamanho do que existe.
   */
  it('o índice cobre os capítulos E as estantes', () => {
    expect(ESTUDO, 'as estantes sumiram do índice').toMatch(/ESTANTES\.map/)
    expect(ESTUDO, 'o chip da estante não rola para lugar nenhum')
      .toMatch(/irParaEstante\(chave\)/)
    expect(ESTUDO, 'a posição das estantes deixou de ser medida')
      .toMatch(/posicaoDaEstante\.current\[chave\]/)
  })

  /**
   * ⚠️ A CONTINUIDADE VEM DA ORDEM DO CURSO, não de `verTambem`.
   *
   * Medido antes da correção: 37 das 53 unidades tinham link que VOLTAVA, e
   * 28 das 53 não tinham para onde ir. O Sol apontava para a Lua e a Lua
   * apontava de volta para o Sol — um ciclo de duas unidades do qual não se
   * saía. A causa era `verTambem` (lista de RELAÇÕES) fazendo as vezes de
   * percurso.
   */
  it('as vizinhas saem da ordem do curso, e valem para toda unidade', () => {
    expect(ESTUDO, 'a navegação voltou a sair de verTambem')
      .toMatch(/vizinhasNaOrdem\(u\.id\)/)
    expect(ESTUDO, 'alguma unidade voltou a ficar sem vizinhas por tipo')
      .not.toMatch(/tipo !== 'licao'\) return \{ anterior: null/)
  })

  /**
   * ⚠️ A ABERTURA É UMA UNIDADE, não um texto solto no topo. Como texto ela
   * ficava fora de tudo: não abria, não marcava como lida, não tinha anterior
   * nem próxima — e quem percorria a trilha pelo rodapé pulava as cinco sem
   * nunca as ver.
   */
  it('a abertura do capítulo é uma unidade abrível', () => {
    expect(ESTUDO, 'a abertura voltou a ser texto solto')
      .toMatch(/aberturaDoAto\(ato\)/)
    expect(ESTUDO, 'a abertura deixou de ser card').toMatch(/cardDe\(aberturaDoAto/)
  })

  /**
   * ⚠️ "CONTINUE POR AQUI" PROMETIA AVANÇO ONDE HAVIA REVISITA. A lista de
   * `verTambem` aponta para os lados e muitas vezes para trás — do signo de
   * Áries para Marte, da casa 5 para o Sol. Quem continua é o rodapé.
   */
  it('a lista lateral se chama Relacionado, não Continue', () => {
    expect(LICAO, 'a lista lateral voltou a prometer continuação')
      .not.toMatch(/'Continue por aqui'/)
    expect(LICAO, 'a lista lateral perdeu o título').toMatch(/'Relacionado'/)
  })

  /**
   * ⚠️ O ÍNDICE SÓ APARECE FORA DA BUSCA. Durante uma busca a lista não está
   * agrupada por ato, e um índice que rola para lugar nenhum é pior que
   * índice nenhum.
   */
  it('o índice de capítulos some durante a busca', () => {
    expect(ESTUDO, 'o índice ficaria visível com a lista de busca')
      .toMatch(/\{!achados && LICOES\.length \?/)
  })

  /**
   * ⚠️ A POSIÇÃO DE CADA ATO É MEDIDA, não estimada: a altura depende de
   * quantas lições tem, de quantas linhas o título ocupa naquele idioma e do
   * tamanho de fonte do aparelho.
   */
  it('o índice rola até o ato pela posição medida', () => {
    expect(ESTUDO, 'a medição por onLayout sumiu')
      .toMatch(/posicaoDoAto\.current\[ato\] = e\.nativeEvent\.layout\.y/)
    expect(ESTUDO, 'o chip do índice deixou de rolar').toMatch(/irParaAto\(ato\)/)
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
  })

  /**
   * ⚠️ A TELA AGORA TEM `onScroll` — para a BARRA DE PROGRESSO, e só. Este
   * teste antes proibia `onScroll` no arquivo inteiro, o que era uma trava
   * grosseira para uma regra fina: o proibido é a marca de LIDO depender da
   * rolagem, não a tela saber onde a leitura está.
   *
   * Agora a regra é cobrada onde ela vive: dentro do manipulador de rolagem
   * não pode haver `marcarLido`.
   */
  it('a rolagem move a barra, e não marca lido', () => {
    const aoRolar = LICAO.slice(LICAO.indexOf('const aoRolar'))
    const corpo = aoRolar.slice(0, aoRolar.indexOf('const ligados'))
    expect(corpo, 'o manipulador de rolagem sumiu').toContain('setLido')
    expect(corpo, 'marcar lido voltou a depender de rolar até o fim')
      .not.toContain('marcarLido')
  })

  /** Abrir a próxima pelo rodapé não pode começar no meio do texto. */
  it('volta ao topo ao trocar de unidade', () => {
    expect(LICAO, 'a próxima lição abriria na posição em que a anterior parou')
      .toMatch(/scrollTo\(\{ y: 0/)
  })

  /**
   * ⚠️ O RODAPÉ VALE PARA TODAS AS UNIDADES AGORA. Antes era só da trilha, e
   * a biblioteca não tinha vizinha nenhuma: abrir um planeta pelo glossário
   * deixava a pessoa sem saída a não ser fechar. A biblioteca ganhou ordem sem
   * deixar de ser biblioteca — como um dicionário, que tem ordem alfabética e
   * nem por isso se lê do A ao Z.
   */
  it('o rodapé avisa quando a natureza do conteúdo muda', () => {
    expect(LICAO, 'o botão não distingue lição de verbete')
      .toMatch(/proxima\.tipo === 'verbete'/)
  })

  /**
   * ⚠️ A PRÓXIMA LIÇÃO APARECIA DUAS VEZES. Toda lição declara a seguinte no
   * `verTambem` — isso existia antes de haver rodapé — então ela era oferecida
   * no meio do texto E embaixo, e no `verTambem` vinha misturada com verbetes,
   * nem sempre primeiro. Era isso que fazia a trilha parecer embaralhada.
   */
  it('"Continue por aqui" não repete o que o rodapé já mostra', () => {
    expect(LICAO, 'a próxima lição voltaria a aparecer duas vezes')
      .toMatch(/jaNoRodape\.has\(u\.id\)/)
  })

  /** Tela cheia: ler uma lição é a tarefa inteira enquanto dura. */
  it('a lição abre em tela cheia', () => {
    expect(LICAO, 'voltou a ser folha parcial sobre a tela anterior')
      .not.toMatch(/maxHeight: '9?\d%'/)
    expect(LICAO, 'sem respeitar a área segura o título entra sob o relógio')
      .toMatch(/useSafeAreaInsets/)
  })

  /** `flex: 1` no ScrollView e `minHeight: 0` na cadeia: regras deste projeto. */
  it('a rolagem funciona no web e no PWA', () => {
    expect(LICAO, 'ScrollView sem flex 1 não rola no web').toMatch(/style=\{\{ flex: 1 \}\}/)
    expect(ESTUDO, 'ScrollView sem flex 1 não rola no web').toMatch(/style=\{\{ flex: 1 \}\}/)
    expect(ESTUDO, 'sem minHeight 0 a rolagem trava no PWA').toMatch(/minHeight: 0/)
  })
})
