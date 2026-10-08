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
    expect(s.blocos.map((b) => b.chave)).toEqual(['fundo', 'hoje', 'vemAi', 'saldo', 'conselho'])
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
    expect(saldo).toContain('7 trânsitos ativos')
    expect(saldo).toMatch(/Casa 10 concentra 2/)
  })

  it('o conselho sai da combinação, não de um molde fixo', () => {
    // Tenso dominante + lento já passado = esperar, não agir.
    const conselho = s.blocos.find((b) => b.chave === 'conselho')!.texto
    expect(conselho).toMatch(/pode esperar/)

    // Mudando o céu, muda o conselho.
    const calmo = sintetizarODia(
      [{ transitPlanet: 'Venus', natalPlanet: 'Moon', type: 'trigono', strength: 70, house: 4, window: { exact: dias(0) } }],
      'pt-BR', AGORA,
    )!
    expect(calmo.blocos.find((b) => b.chave === 'conselho')!.texto).not.toMatch(/pode esperar/)
  })

  it('o resumo do topo é o bloco de HOJE', () => {
    expect(s.resumo).toBe(s.blocos.find((b) => b.chave === 'hoje')!.texto)
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
    expect(porChave.hoje).toBe(
      'Hoje o Sol pressiona a sua imaginação e a Lua favorece. ' +
      'A clareza se perde e o cansaço vem, mas a intuição fica afiada.',
    )

    expect(porChave.fundo).toMatch(/^Dois movimentos longos sustentam o momento:/)
    expect(porChave.fundo).toContain('Plutão no topo do mapa')
    expect(porChave.fundo).toContain('Urano sobre Júpiter')
    expect(porChave.fundo).toMatch(/o que sobra ainda se arruma\.$/)

    expect(porChave.vemAi).toContain('Em 1 dia')
    expect(porChave.saldo).toContain('7 trânsitos ativos')
    expect(porChave.conselho.length).toBeGreaterThan(20)
  })
})
