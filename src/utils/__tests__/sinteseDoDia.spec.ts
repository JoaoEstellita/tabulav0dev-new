import { describe, it, expect } from 'vitest'
import {
  sintetizarODia,
  faseDoTransito,
  diasAteExato,
  casaQueConcentra,
  pontoFocal,
  balanco,
} from '../sinteseDoDia'

/**
 * A síntese do momento.
 *
 * O que esta camada conserta: a frase usava UM trânsito — o de maior força — e
 * ignorava os outros seis. E misturava escalas de tempo: "Urano sobre Júpiter"
 * é tema de meses, "Lua em trígono a Netuno" dura horas, e tratar os dois como
 * "hoje" é o que fazia o texto soar solto por mais correto que estivesse.
 *
 * O céu usado nos testes é o real de 08/10/2026, o mesmo que apareceu na tela.
 */

const AGORA = new Date('2026-10-08T12:00:00Z')
const dias = (n: number) => new Date(AGORA.getTime() + n * 24 * 60 * 60 * 1000).toISOString()

/** Trânsitos reais do dia em que isto foi escrito. */
const CEU_REAL = [
  { transitPlanet: 'Uranus', natalPlanet: 'Jupiter', type: 'conjuncao', strength: 97, house: 2, window: { exact: dias(-6) } },
  { transitPlanet: 'Pluto', natalPlanet: 'Meio do Céu', type: 'conjuncao', strength: 96, house: 10, window: { exact: dias(-9) } },
  { transitPlanet: 'Sun', natalPlanet: 'Neptune', type: 'quadratura', strength: 56, house: 6, window: { exact: dias(1) } },
  { transitPlanet: 'Mars', natalPlanet: 'Meio do Céu', type: 'oposicao', strength: 54, house: 10, window: { exact: dias(4) } },
  { transitPlanet: 'Moon', natalPlanet: 'Neptune', type: 'trigono', strength: 46, house: 5, window: { exact: dias(0.02) } },
  { transitPlanet: 'Mars', natalPlanet: 'Jupiter', type: 'sextil', strength: 45, house: 4, window: { exact: dias(-0.8) } },
  { transitPlanet: 'Moon', natalPlanet: 'Uranus', type: 'trigono', strength: 43, house: 5, window: { exact: dias(0) } },
]

describe('fase pela janela', () => {
  it('distingue o que vem, o que é agora e o que passou', () => {
    expect(faseDoTransito({ window: { exact: dias(4) } }, AGORA)).toBe('antes')
    expect(faseDoTransito({ window: { exact: dias(0.1) } }, AGORA)).toBe('agora')
    expect(faseDoTransito({ window: { exact: dias(-6) } }, AGORA)).toBe('depois')
  })

  it('sem janela, trata como agora em vez de inventar', () => {
    expect(faseDoTransito({}, AGORA)).toBe('agora')
    expect(faseDoTransito({ window: { exact: 'não é data' } }, AGORA)).toBe('agora')
  })

  it('conta os dias nos dois sentidos', () => {
    expect(diasAteExato({ window: { exact: dias(4) } }, AGORA)).toBe(4)
    expect(diasAteExato({ window: { exact: dias(-6) } }, AGORA)).toBe(-6)
    expect(diasAteExato({}, AGORA)).toBeNull()
  })
})

describe('convergência — o achado que faz a leitura parecer certeira', () => {
  it('acha a casa tocada por mais de um trânsito', () => {
    // No céu real: Casa 10 recebe Plutão no MC e Marte opondo o MC.
    const r = casaQueConcentra(CEU_REAL)
    expect(r).toEqual({ casa: 10, quantos: 2 })
  })

  it('casa tocada uma vez só não é convergência', () => {
    const r = casaQueConcentra([CEU_REAL[0]])
    expect(r).toBeNull()
  })

  it('acha o ponto natal que recebe mais, desempatando por peso', () => {
    // No céu inteiro vence o Meio do Céu: recebe Plutão (96) e Marte (54),
    // peso maior que o de Netuno (56 + 46) — mesmo com a mesma contagem.
    expect(pontoFocal(CEU_REAL)?.planeta).toBe('Meio do Céu')

    // Entre os RÁPIDOS, que é o recorte usado no bloco "Hoje", o foco é Netuno:
    // recebe Sol em atrito e Lua em fluxo.
    const rapidos = CEU_REAL.filter((t) => ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars'].includes(t.transitPlanet))
    expect(pontoFocal(rapidos)?.planeta).toBe('Neptune')
  })

  it('empate de contagem é desempatado por FORÇA', () => {
    // Dois pares com 2 trânsitos cada: vence o que pesa mais, não o primeiro.
    const r = pontoFocal([
      { transitPlanet: 'Sun', natalPlanet: 'Mars', type: 'quadratura', strength: 10 },
      { transitPlanet: 'Moon', natalPlanet: 'Mars', type: 'trigono', strength: 10 },
      { transitPlanet: 'Sun', natalPlanet: 'Venus', type: 'quadratura', strength: 90 },
      { transitPlanet: 'Moon', natalPlanet: 'Venus', type: 'trigono', strength: 90 },
    ])
    expect(r?.planeta).toBe('Venus')
  })
})

describe('balanço ponderado', () => {
  it('pondera por força — dois sextis fracos não anulam uma quadratura exata', () => {
    const r = balanco([
      { type: 'quadratura', strength: 95 },
      { type: 'sextil', strength: 10 },
      { type: 'trigono', strength: 10 },
    ])
    expect(r.dominante).toBe('tenso')
    expect(r.nTenso).toBe(1)
    expect(r.nHarmonico).toBe(2)
  })

  it('reconhece predomínio de apoio', () => {
    const r = balanco([{ type: 'trigono', strength: 80 }, { type: 'quadratura', strength: 20 }])
    expect(r.dominante).toBe('harmonico')
  })
})

describe('a síntese montada', () => {
  const s = sintetizarODia(CEU_REAL, 'pt-BR', AGORA)!

  it('produz as frases do dia', () => {
    expect(s).toBeTruthy()
    // ⚠️ NAO HA MAIS BLOCOS. Havia "O fundo" (lentos em prosa), "Hoje" e
    // "Vem ai" — tres estruturas para contar o que as frases ja contam, cada
    // uma com a sua forma e o seu vocabulario. Uma estrutura so.
    expect(s.frases.length).toBeGreaterThan(0)
    expect((s as any).blocos, 'os blocos sairam').toBeUndefined()
  })

  it('separa o período (lentos) do dia (rápidos)', () => {
    // A distincao continua: era a razao de existir do bloco "O fundo", e sem
    // ele passou a viver na propria frase. Um transito de Plutao e tema de
    // meses; um aspecto da Lua dura horas. Lado a lado sem marca, os dois
    // soariam igual.
    const lentas = s.frases.filter((f) => f.lento)
    const rapidas = s.frases.filter((f) => !f.lento)
    expect(lentas.length, 'os lentos viram frase, nao somem').toBeGreaterThan(0)
    expect(rapidas.length).toBeGreaterThan(0)
    expect(lentas.some((f) => f.fonte.includes('Plutão') || f.fonte.includes('Urano'))).toBe(true)
    expect(rapidas.every((f) => !f.fonte.startsWith('Plutão')), 'lento nunca entra como rápido').toBe(true)
  })

  it('a janela é dita em palavras, sem jargão', () => {
    const comJanela = s.frases.filter((f) => f.quando)
    expect(comJanela.length).toBeGreaterThan(0)
    for (const f of comJanela) {
      expect(f.quando, 'nada de "aplicando" ou "separando"').not.toMatch(/aplicando|separando|orbe/i)
    }
  })

  it('anuncia o que ainda vai chegar, com o prazo', () => {
    // ⚠️ O bloco "Vem ai" produzia "Em 1 dia, Mercurio sobre Plutao chega ao
    // ponto exato em Amor" — diz o quando e o que, mas nao diz o que MUDA,
    // que e o trabalho deste modulo. O grupo "chegando" entrega as tres
    // coisas: efeito, aspecto nomeado e janela.
    const chegando = s.frases.filter((f) => f.fase === 'antes')
    expect(chegando.length).toBeGreaterThan(0)
    // "amanha" e "em 3 dias" sao as duas formas da janela proxima — a
    // primeira nao tem numero, entao casar so por digito deixava passar.
    expect(chegando.some((f) => /dia|amanhã/.test(f.quando))).toBe(true)
    for (const f of chegando) expect(f.efeito, 'o efeito vem antes do prazo').toMatch(/\.$/)
  })

  it('não há mais os blocos de saldo, conselho e fundo', () => {
    // Todos resumiam ou repetiam o que as frases dizem. Saíram por decisão do
    // João, um a um, nesta ordem: "O que fazer", "No saldo", "O fundo".
    expect((s as any).blocos).toBeUndefined()
  })


  it('o resumo do topo é o EFEITO, não a origem astrológica', () => {
    // ⚠️ A ORDEM INVERTEU.
    //
    // Antes o topo era o bloco "Hoje", que começava pela fonte: "Hoje o Sol
    // pressiona a sua imaginação e a Lua favorece. A clareza custa mais..." —
    // punha na frente o que menos importa para quem lê. O aspecto é a FONTE da
    // informação, não a informação.
    //
    // Agora o topo é o efeito da primeira frase, e a origem vai numa linha
    // própria, menor e em tom mais baixo.
    expect(s.resumo).toBe(s.frases[0].efeito)
    expect(s.resumo, 'o resumo não começa pela origem').not.toMatch(/^Hoje (o|a) /)
  })

  it('cada frase traz o efeito e a origem separados', () => {
    // Separados, e não costurados numa string: é o que deixa a tela dar
    // tamanho e cor diferentes a cada parte.
    expect(s.frases.length).toBeGreaterThan(1)
    for (const f of s.frases) {
      expect(f.efeito, 'o efeito é uma frase fechada').toMatch(/\.$/)
      expect(f.fonte, 'a origem nomeia planeta e aspecto').toMatch(/ em | sobre /)
      expect(f.chaves.length, 'a frase sabe quais trânsitos citou').toBeGreaterThan(0)
    }
  })

  it('ponto dividido tem texto PRÓPRIO, não dois opostos colados', () => {
    // ⚠️ Antes isto colava `tenso` e `facil` com um "mas". Como os dois foram
    // escritos como espelhos, a frase se desdizia:
    //
    //     "Agir encontra mais obstáculo do que de costume — mas agir
    //      encontra menos obstáculo do que de costume."
    //
    // Passava despercebido quando os lados falavam de sujeitos diferentes
    // ("a clareza custa mais… mas a intuição fica mais afiada"); com o mesmo
    // sujeito, virava contradição literal na tela.
    const AG = new Date('2026-10-11T12:00:00Z')
    const q = (n: number) => new Date(AG.getTime() + n * 864e5).toISOString()
    const r = sintetizarODia([
      { transitPlanet: 'Sun', natalPlanet: 'Mars', type: 'trigono', strength: 80, house: 6, window: { exact: q(0) } },
      { transitPlanet: 'Moon', natalPlanet: 'Mars', type: 'sesquiquadratura', strength: 75, house: 6, window: { exact: q(0) } },
    ], 'pt-BR', AG)!

    const marte = r.frases[0].efeito
    expect(marte, 'descreve a divisão').toBe('A ação rende numa frente e esbarra em outra.')
    expect(marte, 'nunca se desdiz').not.toMatch(/mais obstáculo.*menos obstáculo/)
    expect(marte, 'não cola os dois lados com "mas"').not.toMatch(/ — mas /)
  })

  it('o período vem em DATAS, não em tempo relativo', () => {
    // ⚠️ Era relativo: "chega ao exato em 3 dias", "até maio", "no ponto exato
    // agora". Le facil, mas deixa a pergunta pratica sem resposta — quando
    // comeca e quando acaba. Para marcar uma conversa ou escolher uma semana,
    // a pessoa precisa da data.
    //
    // Vale para TODOS os grupos, inclusive o "acontecendo agora", que antes
    // ficava sem janela por ser redundante com o cabecalho. Era redundante
    // enquanto a janela dizia so "hoje".
    const AG = new Date('2026-10-12T12:00:00Z')
    const q = (n: number) => new Date(AG.getTime() + n * 864e5).toISOString()
    const r = sintetizarODia([
      { transitPlanet: 'Mercury', natalPlanet: 'Pluto', type: 'conjuncao', strength: 90, house: 7, window: { start: q(-2), exact: q(0), end: q(4) } },
      { transitPlanet: 'Sun', natalPlanet: 'Neptune', type: 'quadratura', strength: 60, house: 5, window: { start: q(1), exact: q(3), end: q(6) } },
      { transitPlanet: 'Uranus', natalPlanet: 'Jupiter', type: 'conjuncao', strength: 95, house: 2, window: { start: q(-120), exact: q(-6), end: q(190) } },
    ], 'pt-BR', AG)!

    // ⚠️ `toContain`, não `toBe`: o período agora vem acompanhado da FASE
    // ("pico hoje", "último dia", "em curso"), porque as datas sozinhas não
    // dizem onde hoje está dentro delas. O que este teste guarda é que a
    // janela vem em DATAS — não que ela seja só isso.
    const agora = r.frases.find((f) => f.fase === 'agora')!
    expect(agora.quando, 'o que acontece hoje também diz de quando a quando').toContain('10/10 a 16/10')
    expect(agora.quando, 'e diz onde hoje está na janela').toContain('pico hoje')

    const chegando = r.frases.find((f) => f.fonte.includes('Netuno'))!
    expect(chegando.quando).toContain('13/10 a 18/10')

    // O ano só aparece quando o período cruza a virada — dentro do mesmo ano
    // ele é ruído repetido em doze linhas.
    const lento = r.frases.find((f) => f.lento)!
    expect(lento.quando).toContain('14/06/26 a 20/04/27')
    expect(lento.quando, 'lento ativo não lê como compromisso futuro').toContain('em curso')
    // Sem ano = duas barras (dd/mm a dd/mm); com ano = quatro. Conta no que o
    // código produziu, não num literal repetido do `toContain` acima — senão o
    // teste compara a expectativa consigo mesma e passa com qualquer código.
    const barras = (s: string) => (s.match(/\//g) || []).length
    expect(barras(agora.quando), 'sem ano quando não cruza').toBe(2)
    expect(barras(lento.quando), 'com ano quando cruza').toBe(4)
  })

  it('a frase diz de que lado pende, para o toque ter cor', () => {
    // Varrer doze frases por cor é mais rápido que ler doze frases: vermelho
    // onde pesa, verde onde favorece, azul no dividido — que não pende para
    // lado nenhum.
    const AG = new Date('2026-10-12T12:00:00Z')
    const q = (n: number) => new Date(AG.getTime() + n * 864e5).toISOString()
    const r = sintetizarODia([
      { transitPlanet: 'Sun', natalPlanet: 'Mars', type: 'trigono', strength: 80, house: 6, window: { exact: q(0) } },
      { transitPlanet: 'Moon', natalPlanet: 'Mars', type: 'quadratura', strength: 75, house: 6, window: { exact: q(0) } },
      { transitPlanet: 'Venus', natalPlanet: 'Saturn', type: 'quadratura', strength: 70, house: 7, window: { exact: q(0) } },
      { transitPlanet: 'Mercury', natalPlanet: 'Jupiter', type: 'sextil', strength: 65, house: 2, window: { exact: q(0) } },
    ], 'pt-BR', AG)!

    const porFonte = (p: string) => r.frases.find((f) => f.fonte.includes(p))!
    expect(porFonte('Marte').natureza, 'os dois lados = dividido').toBe('misto')
    expect(porFonte('Saturno').natureza).toBe('tenso')
    expect(porFonte('Júpiter').natureza).toBe('facil')
  })

  it('uma frase por PONTO tocado, não uma por trânsito', () => {
    // Sol em quadratura a Netuno e Lua em trígono a Netuno contam a mesma
    // história — cabem na mesma frase, com a ressalva ("mas").
    const netuno = s.frases.find((f) => f.fonte.includes('Netuno'))!
    expect(netuno.chaves.length, 'os dois trânsitos a Netuno na mesma frase').toBe(2)
    // O texto do estado MISTO descreve a divisão; não é mais a colagem de
    // `tenso` + "mas" + `facil`.
    expect(netuno.efeito, 'diz que o ponto está dividido')
      .toBe('A intuição fica afiada enquanto a clareza se perde.')
  })

  it('os ângulos levam artigo em português', () => {
    // "em oposição a Meio do Céu" está errado; o certo é "ao Meio do Céu".
    const mc = s.frases.find((f) => f.fonte.includes('Meio do Céu'))
    if (mc) expect(mc.fonte).not.toMatch(/ a Meio do Céu/)
  })

  it('o trânsito sobre o PRÓPRIO planeta diz qual é qual', () => {
    // ⚠️ Saía "Sol em oposição a Sol", que lê como erro de digitação e não
    // como informação — ainda por cima num dos trânsitos mais significativos
    // que existem, o retorno do planeta a si mesmo. O segundo é o NATAL, o do
    // mapa da pessoa, e dizer isso resolve a repetição e esclarece.
    const AGORA2 = new Date('2026-10-11T12:00:00Z')
    const hoje = (n: number) => new Date(AGORA2.getTime() + n * 864e5).toISOString()
    const r = sintetizarODia([
      { transitPlanet: 'Sun', natalPlanet: 'Sun', type: 'oposicao', strength: 90, house: 1, window: { exact: hoje(0) } },
      { transitPlanet: 'Venus', natalPlanet: 'Venus', type: 'quadratura', strength: 70, house: 2, window: { exact: hoje(0) } },
      { transitPlanet: 'Mars', natalPlanet: 'Meio do Céu', type: 'trigono', strength: 60, house: 10, window: { exact: hoje(0) } },
    ], 'pt-BR', AGORA2)!

    const fontes = r.frases.map((f) => f.fonte)
    expect(fontes, 'nunca repete o planeta cru').not.toContain('o Sol em oposição a Sol')
    expect(fontes.some((f) => f === 'o Sol em oposição ao seu Sol natal')).toBe(true)
    // "com" não vira "ao": a contração depende da preposição do aspecto.
    expect(fontes.some((f) => f === 'Vênus em quadratura com o seu Vênus natal')).toBe(true)
    // O angulo tambem leva possessivo: e o que distingue o ponto do MAPA DA
    // PESSOA do planeta que transita hoje. Sem "natal" pendurado, que so faz
    // falta quando os dois nomes sao iguais.
    expect(fontes.some((f) => f === 'Marte em trígono ao seu Meio do Céu')).toBe(true)
  })

  it('respeita o teto de frases', () => {
    // Num dia com dezenas de trânsitos ativos, sem teto isto deixa de ser
    // leitura e vira planilha.
    expect(s.frases.length).toBeLessThanOrEqual(4)
  })

  it('o Meio do Céu é citado com possessivo, como ponto do mapa da pessoa', () => {
    // Era "no topo do mapa" no bloco "O fundo", que saiu. Na frase o papel é
    // outro: distinguir o ponto NATAL do planeta que transita hoje.
    const mc = s.frases.find((f) => f.fonte.includes('Meio do Céu'))
    expect(mc, 'o Meio do Céu aparece nas frases').toBeTruthy()
    expect(mc!.fonte, 'com possessivo, porque é do mapa dela').toContain('seu Meio do Céu')
  })
})

describe('bordas e idiomas', () => {
  it('sem trânsito, fica em silêncio', () => {
    expect(sintetizarODia([], 'pt-BR', AGORA)).toBeNull()
    expect(sintetizarODia([{ transitPlanet: 'Sun' }], 'pt-BR', AGORA)).toBeNull()
  })

  it('um trânsito só ainda produz leitura', () => {
    const r = sintetizarODia([CEU_REAL[0]], 'pt-BR', AGORA)
    expect(r).toBeTruthy()
    // ⚠️ Antes isto so produzia leitura porque o transito era LENTO e caia no
    // bloco "O fundo". Com o fundo removido, as frases passaram a cobrir o
    // ceu INTEIRO — sem isso, Urano e Plutao sumiriam da tela.
    expect(r!.frases.length, 'um lento sozinho tambem vira frase').toBe(1)
    expect(r!.frases[0].lento, 'marcado como tema de meses').toBe(true)
    expect(r!.resumo.length, 'o topo nunca fica vazio').toBeGreaterThan(10)
  })

  it('fala os 4 idiomas, com es/it sem acento', () => {
    const ACENTO = /[áàâãéèêíìóòôõúùçñ]/i
    for (const idioma of ['es-ES', 'it-IT'] as const) {
      const r = sintetizarODia(CEU_REAL, idioma, AGORA)!
      for (const f of r.frases) {
        expect(ACENTO.test(f.efeito), `efeito (${idioma}): ${f.efeito}`).toBe(false)
        expect(ACENTO.test(f.fonte), `origem (${idioma}): ${f.fonte}`).toBe(false)
      }
    }
  })

  it('nenhuma frase sai vazia ou com pontuação solta', () => {
    for (const idioma of ['pt-BR', 'en-US', 'es-ES', 'it-IT'] as const) {
      const r = sintetizarODia(CEU_REAL, idioma, AGORA)!
      for (const f of r.frases) {
        expect(f.efeito.trim().length, idioma).toBeGreaterThan(10)
        expect(f.efeito, 'sem pontuação solta').not.toMatch(/\s[.,;]|[.,;]{2}/)
        expect(f.fonte.trim().length, idioma).toBeGreaterThan(5)
      }
    }
  })
})

describe('o texto que sai, palavra por palavra', () => {
  /**
   * Trava o resultado completo com o céu real. Serve de duas coisas:
   * documenta o que a pessoa lê, e denuncia mudança de redação que ninguém
   * pediu — texto é a parte do app que mais muda sem querer.
   */
  it('monta a leitura do céu de 08/10/2026', () => {
    const r = sintetizarODia(CEU_REAL, 'pt-BR', AGORA)!

    // O formato de cada frase: EFEITO em destaque, origem discreta, janela
    // quando ela informa. A ordem antiga — "Hoje o Sol pressiona a sua
    // imaginação e a Lua favorece" — punha na frente o que menos importa.
    //
    // ⚠️ E o vocabulário saiu do VEREDICTO. "A clareza se perde e o cansaço
    // vem" decretava um resultado sobre a pessoa; lidas todo dia, uma após a
    // outra, essas frases faziam o app soar como quem repreende. A correção
    // não foi suavizar com "pode ser que" — foi dizer O QUE MUDA E EM RELAÇÃO
    // A QUÊ, que afirma com a mesma firmeza e situa o dia contra a linha de
    // base da própria pessoa.
    const netuno = r.frases.find((f) => f.fonte.includes('Netuno'))!
    expect(netuno.efeito).toBe('A intuição fica afiada enquanto a clareza se perde.')
    expect(netuno.fonte).toBe('o Sol em quadratura e a Lua em trígono ao seu Netuno')

    // Os lentos agora são frase, não mais o bloco "O fundo" — e marcados,
    // para um tema de meses não soar como novidade do dia.
    const lentas = r.frases.filter((f) => f.lento)
    expect(lentas.length, 'Urano e Plutão viram frase').toBeGreaterThanOrEqual(2)
    expect(lentas.some((f) => f.fonte.includes('Plutão') && f.fonte.includes('seu Meio do Céu'))).toBe(true)
    expect(lentas.some((f) => f.fonte.includes('Urano') && f.fonte.includes('seu Júpiter'))).toBe(true)

    // O que chega traz o prazo — era o papel do bloco "Vem aí", que produzia
    // "Em 1 dia, Mercúrio sobre Plutão chega ao ponto exato em Amor": diz o
    // quando e o quê, mas não diz o que MUDA.
    const chegando = r.frases.filter((f) => f.fase === 'antes')
    expect(chegando.some((f) => /dia|amanhã/.test(f.quando))).toBe(true)

    // Uma estrutura só: os três blocos saíram.
    expect((r as any).blocos).toBeUndefined()
  })
})
