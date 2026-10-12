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

  it('produz os blocos do formato escolhido', () => {
    expect(s).toBeTruthy()
    expect(s.blocos.map((b) => b.chave)).toEqual(['fundo', 'hoje', 'vemAi', 'saldo'])
  })

  it('separa o período (lentos) do dia (rápidos)', () => {
    // Era a confusão central: tema de meses tratado como novidade de hoje.
    const fundo = s.blocos.find((b) => b.chave === 'fundo')!.texto
    expect(fundo, 'o fundo é feito dos lentos').toContain('Plutão')
    expect(fundo).toContain('Urano')
    expect(fundo, 'Lua não é pano de fundo de nada').not.toContain('Lua')

    const hoje = s.blocos.find((b) => b.chave === 'hoje')!.texto
    // O bloco de hoje vem dos rápidos, e fala do EFEITO no ponto tocado —
    // "a sua imaginação" diz mais a quem lê do que "Netuno".
    expect(hoje, 'o foco de hoje vem dos rápidos').toContain('o Sol')
    expect(hoje).toContain('a Lua')
    expect(hoje, 'o ponto é dito pelo que ele governa').toContain('imaginação')
  })

  it('diz que os lentos já passaram do ponto exato, sem jargão', () => {
    // "Fase de efeito, não de novidade" classificava a fase em vocabulário de
    // quem escreve. O que importa é o que a pessoa percebe.
    const fundo = s.blocos.find((b) => b.chave === 'fundo')!.texto
    expect(fundo).toMatch(/momento mais forte dos dois já passou/)
    expect(fundo, 'nada de classificar a fase').not.toMatch(/fase de efeito/)
  })

  it('anuncia o que ainda vai chegar, com o prazo', () => {
    const vem = s.blocos.find((b) => b.chave === 'vemAi')!.texto
    expect(vem, 'Sol quadratura Netuno chega em 1 dia').toMatch(/Em 1 dia/)
  })

  it('o saldo conta os trânsitos e aponta a casa que concentra', () => {
    const saldo = s.blocos.find((b) => b.chave === 'saldo')!.texto
    // ⚠️ A frase NAO anuncia mais um total.
    //
    // Ela dizia "44 transitos ativos: os 27 que pedem cuidado pesam mais que os
    // 15 de apoio" — e 27 + 15 = 42. Os 2 que faltavam eram os NEUTROS, que nao
    // entram em nenhum dos lados. Aqui no fixture a soma fechava por acaso
    // (4 + 3 = 7), entao o teste passava enquanto a tela mostrava a conta errada.
    //
    // Um numero que nao bate com as proprias parcelas faz desconfiar do resto do
    // texto. Agora so as duas parcelas aparecem, que e o que a frase compara.
    expect(saldo).toContain('Dos trânsitos ativos')
    expect(saldo, 'cita as duas parcelas que de fato compara').toMatch(/os 4 que pedem cuidado.*os 3 de apoio/)
    expect(saldo).toMatch(/Casa 10 concentra 2/)
  })

  it('não há mais bloco de conselho', () => {
    // O bloco "O que fazer" saiu por decisão do João, e faz sentido com o
    // resto: as frases do dia já dizem o que muda e em relação a quê, e a
    // pessoa decide o que fazer com isso. O conselho vinha de um conjunto
    // pequeno de moldes, então repetia com frequência — e conselho que se
    // repete deixa de ser conselho.
    expect(s.blocos.some((b) => (b.chave as string) === 'conselho')).toBe(false)
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
    expect(fontes, 'nunca repete o planeta cru').not.toContain('Sol em oposição a Sol')
    expect(fontes.some((f) => f === 'Sol em oposição ao seu Sol natal')).toBe(true)
    // "com" não vira "ao": a contração depende da preposição do aspecto.
    expect(fontes.some((f) => f === 'Vênus em quadratura com o seu Vênus natal')).toBe(true)
    // E o ângulo segue com a contração dele, sem "natal" pendurado.
    expect(fontes.some((f) => f === 'Marte em trígono ao Meio do Céu')).toBe(true)
  })

  it('respeita o teto de frases', () => {
    // Num dia com dezenas de trânsitos ativos, sem teto isto deixa de ser
    // leitura e vira planilha.
    expect(s.frases.length).toBeLessThanOrEqual(4)
  })

  it('o Meio do Céu é citado como lugar, não como planeta', () => {
    const fundo = s.blocos.find((b) => b.chave === 'fundo')!.texto
    expect(fundo).toContain('no topo do mapa')
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
    expect(r!.blocos.length).toBeGreaterThanOrEqual(2)
  })

  it('fala os 4 idiomas, com es/it sem acento', () => {
    const ACENTO = /[áàâãéèêíìóòôõúùçñ]/i
    for (const idioma of ['es-ES', 'it-IT'] as const) {
      const r = sintetizarODia(CEU_REAL, idioma, AGORA)!
      for (const b of r.blocos) {
        expect(ACENTO.test(b.rotulo), `rótulo "${b.rotulo}" (${idioma})`).toBe(false)
        expect(ACENTO.test(b.texto), `texto (${idioma}): ${b.texto}`).toBe(false)
      }
    }
  })

  it('nenhum bloco sai vazio ou com pontuação solta', () => {
    for (const idioma of ['pt-BR', 'en-US', 'es-ES', 'it-IT'] as const) {
      const r = sintetizarODia(CEU_REAL, idioma, AGORA)!
      for (const b of r.blocos) {
        expect(b.texto.trim().length, `${b.chave}/${idioma} vazio`).toBeGreaterThan(10)
        expect(b.texto, `${b.chave}/${idioma} com espaço antes da pontuação`).not.toMatch(/\s[.,]/)
        expect(b.texto, `${b.chave}/${idioma} com pontuação dupla`).not.toMatch(/[.,]{2}/)
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
    const s = sintetizarODia(CEU_REAL, 'pt-BR', AGORA)!
    const porChave = Object.fromEntries(s.blocos.map((b) => [b.chave, b.texto]))

    // Diz QUEM toca, O QUE é tocado e O QUE acontece. Sem "ponto focal"
    // (jargão), sem "em atrito" (geometria, não efeito) e sem comentar o
    // próprio texto ("isso é informação, não contradição") — que era o que
    // soava estranho na tela.
    // ⚠️ O vocabulario saiu do VEREDICTO. "A clareza se perde e o cansaco vem"
    // decretava um resultado sobre a pessoa; lidas todo dia, uma apos a outra,
    // essas frases faziam o app soar como quem repreende (relatado na tela:
    // "a imagem que voce passa incomoda" ficou forte demais).
    //
    // A correcao nao foi suavizar com "pode ser que" — isso tiraria a
    // assertividade sem devolver informacao. E dizer O QUE MUDA E EM RELACAO A
    // QUE: "custa mais", "aparece antes", "mais que o normal" afirmam com a
    // mesma firmeza e situam o dia contra a linha de base da pessoa.
    expect(porChave.hoje).toBe(
      'Hoje o Sol pressiona a sua imaginação e a Lua favorece. ' +
      'A clareza custa mais e o cansaço aparece antes, mas a intuição fica mais afiada que o normal.',
    )

    expect(porChave.fundo).toMatch(/^Dois movimentos longos sustentam o momento:/)
    expect(porChave.fundo).toContain('Plutão no topo do mapa')
    expect(porChave.fundo).toContain('Urano sobre Júpiter')
    expect(porChave.fundo).toMatch(/o que sobra ainda se arruma\.$/)

    expect(porChave.vemAi).toContain('Em 1 dia')
    expect(porChave.saldo).toContain('Dos trânsitos ativos')
    expect(porChave.conselho, 'o bloco de conselho saiu').toBeUndefined()
  })
})
