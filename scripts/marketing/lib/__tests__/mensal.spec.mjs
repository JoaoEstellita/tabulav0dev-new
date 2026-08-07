import { describe, expect, it } from 'vitest'

import {
  eventosDoMes,
  mesPorSigno,
  aberturaDoSigno,
  linhaDoAscendente,
  casaPorAscendente,
  ORDEM_SIGNOS,
  GLIFO,
} from '../mensal.mjs'
import { picar, roteiroDeLegenda, legendaDoReel } from '../roteiroLegenda.mjs'

/**
 * A peça mensal por signo e por ascendente.
 *
 * A referência que originou isto afirma "your routines reset" presumindo que o
 * signo do post é a casa 1 de quem lê. Aqui a casa é conta, e estes testes
 * existem para garantir que continue sendo — no dia em que a aritmética
 * divergir do app, a peça passa a mentir com cara de precisão.
 */
describe('casa pelo ascendente', () => {
  // Mesma fórmula de src/astro/houses.math.ts:83 — se divergir, a peça mente.
  it('reproduz a conta de casas inteiras do app', () => {
    for (let asc = 0; asc < 12; asc++) {
      for (let ev = 0; ev < 12; ev++) {
        const esperado = ((ev - asc + 12) % 12) + 1
        expect(casaPorAscendente(ORDEM_SIGNOS[ev], ORDEM_SIGNOS[asc])).toBe(esperado)
      }
    }
  })

  it('o próprio signo é sempre a casa 1, e o oposto a casa 7', () => {
    for (let i = 0; i < 12; i++) {
      const signo = ORDEM_SIGNOS[i]
      const oposto = ORDEM_SIGNOS[(i + 6) % 12]
      expect(casaPorAscendente(signo, signo), signo).toBe(1)
      expect(casaPorAscendente(oposto, signo), signo).toBe(7)
    }
  })

  it('signo desconhecido não vira casa inventada', () => {
    expect(casaPorAscendente('Ofiúco', 'Áries')).toBeNull()
  })
})

describe('eventos do mês', () => {
  const agosto = eventosDoMes(2026, 7)

  it('agosto de 2026 tem os dois eclipses', () => {
    const eclipses = agosto.filter((e) => e.tipo === 'eclipse')
    expect(eclipses).toHaveLength(2)
    expect(eclipses[0].signo).toBe('Leão')
    expect(eclipses[1].signo).toBe('Peixes')
  })

  // Todo eclipse É uma lunação: sem a limpeza, "dois eclipses" viraria quatro
  // eventos no mesmo instante e a contagem da capa sairia errada.
  it('não conta a lunação que o eclipse já contém', () => {
    const diasDeEclipse = new Set(
      agosto.filter((e) => e.tipo === 'eclipse').map((e) => e.quando.toISOString().slice(0, 10))
    )
    const fasesNoMesmoDia = agosto.filter(
      (e) => e.tipo === 'fase' && diasDeEclipse.has(e.quando.toISOString().slice(0, 10))
    )
    expect(fasesNoMesmoDia).toEqual([])
  })

  it('fica dentro do mês pedido', () => {
    for (const e of agosto) {
      expect(e.quando.getUTCMonth(), e.quando.toISOString()).toBe(7)
      expect(e.quando.getUTCFullYear()).toBe(2026)
    }
  })
})

describe('slide de cada signo', () => {
  const agosto = eventosDoMes(2026, 7)
  const setembro = eventosDoMes(2026, 8)
  const totalEclipses = agosto.filter((e) => e.tipo === 'eclipse').length

  it('nenhum dos doze signos sai vazio, em agosto e em setembro', () => {
    for (const mes of [agosto, setembro]) {
      for (const signo of ORDEM_SIGNOS) {
        const resumo = mesPorSigno(mes, signo)
        expect(resumo, signo).not.toBeNull()
        expect(resumo.noEixo.length, `${signo} sem evento no eixo`).toBeGreaterThan(0)
      }
    }
  })

  it('a retomada concorda com o total anunciado', () => {
    // "Dois eclipses no mês. Ele em Peixes" era o erro: a retomada tem que
    // concordar com o total da frase anterior, não com quantos caem no signo.
    const peixes = mesPorSigno(agosto, 'Peixes')
    const texto = aberturaDoSigno(peixes, totalEclipses)
    expect(texto).toContain('Dois eclipses')
    expect(texto).toContain('Um deles em Peixes')
    expect(texto).not.toContain('Ele em Peixes')
  })

  it('a linha do ascendente dá a casa certa para o eclipse do próprio signo', () => {
    for (const signo of ['Leão', 'Peixes']) {
      const resumo = mesPorSigno(agosto, signo)
      const asc = linhaDoAscendente(resumo)
      expect(asc, signo).not.toBeNull()
      expect(asc.casa, `${signo}: eclipse no próprio signo é casa 1`).toBe(1)
    }
  })

  it('ascendente em Áries recebe Vênus em Libra na casa 7', () => {
    const aries = mesPorSigno(agosto, 'Áries')
    const asc = linhaDoAscendente(aries)
    expect(asc.casa).toBe(7)
  })

  // Sem o seletor de variação o Chrome desenha o glifo como emoji colorido no
  // meio de um rótulo em bronze.
  it('os glifos vêm com seletor de apresentação textual', () => {
    for (const signo of ORDEM_SIGNOS) {
      expect(GLIFO[signo], signo).toContain('︎')
    }
  })
})

/**
 * A legenda queimada.
 *
 * A maioria assiste sem som, e nenhuma peça nossa tinha legenda no quadro.
 */
describe('roteiro da legenda do Reel', () => {
  const dados = {
    titulo: 'Eclipse solar total em Leão',
    subtitulo: '12 de agosto, 14:45 · 20° de Leão',
    textoEvento:
      'Lua Nova com a Lua exatamente sobre o Sol. Começo de ciclo que costuma cobrar antes de abrir. Não é visível do Brasil.',
  }

  it('nunca mostra dois segmentos ao mesmo tempo', () => {
    const roteiro = legendaDoReel(dados)
    // varre os 360 quadros de um Reel de 12s a 30fps
    for (let q = 0; q < 360; q++) {
      const t = q / 360
      const visiveis = roteiro.filter((s) => t >= s.de && t < s.ate)
      expect(visiveis.length, `quadro ${q}`).toBeLessThanOrEqual(1)
    }
  })

  it('todo segmento fica tempo de ser lido', () => {
    const roteiro = legendaDoReel(dados)
    for (const s of roteiro) {
      const segundos = (s.ate - s.de) * 12
      expect(segundos, s.texto).toBeGreaterThanOrEqual(0.8)
    }
  })

  // O título e a data já estão estáticos no quadro: repeti-los na caixa deixava
  // a mesma informação duas vezes na tela.
  it('carrega a leitura, nunca o título nem a data', () => {
    const roteiro = legendaDoReel(dados)
    const tudo = roteiro.map((s) => s.texto).join(' ')
    expect(tudo).not.toContain(dados.titulo)
    expect(tudo).not.toContain(dados.subtitulo)
    expect(tudo).toContain('Lua Nova')
  })

  it('fecha com o limite da casa', () => {
    const roteiro = legendaDoReel(dados)
    expect(roteiro[roteiro.length - 1].texto).toContain('A casa é de cada um')
  })

  it('começa depois do hook e termina antes do fim', () => {
    const roteiro = legendaDoReel(dados)
    expect(roteiro[0].de).toBeGreaterThanOrEqual(0.13)
    expect(roteiro[roteiro.length - 1].ate).toBeLessThanOrEqual(1)
  })

  it('picar respeita fim de frase', () => {
    const p = picar('Uma frase curta. Outra frase igualmente curta.')
    expect(p).toEqual(['Uma frase curta.', 'Outra frase igualmente curta.'])
  })

  it('texto vazio não produz roteiro', () => {
    expect(roteiroDeLegenda([])).toEqual([])
    expect(legendaDoReel({}).length).toBeGreaterThan(0) // sobra o limite da casa
  })
})
