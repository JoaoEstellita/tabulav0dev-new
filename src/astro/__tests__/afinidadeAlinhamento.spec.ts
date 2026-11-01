import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { synastryScore, explicarAfinidade } from '../synastryReading'
import { affinityBand, affinityColor, AFFINITY_CUTS } from '../../theme/lenses'

/**
 * O ALINHAMENTO DO NÚMERO DE AFINIDADE.
 *
 * ⚠️ O MESMO CONCEITO APARECE EM QUATRO LUGARES — o card dos Grupos, o modal
 * de sinastria, a matriz de duplas e o card do Match — e cada um tinha a sua
 * própria ideia de onde começa "alta". Foi assim que `altissima` virou uma
 * faixa morta: a escala mudou e os cortes ficaram.
 *
 * O que este teste guarda é que os limiares sejam MEDIDOS e os mesmos dos dois
 * lados, e que nenhuma faixa deixe de acontecer.
 */

const RAIZ_BACK = join(__dirname, '..', '..', '..', '..', 'backend')
const AFFINITY_JS = join(RAIZ_BACK, 'lib', 'discovery', 'affinity.js')

/** Pares sintéticos determinísticos — o mesmo índice sai igual toda execução. */
function pares(quantos: number) {
  const PL = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto']
  const ANG: Record<string, number> = { conjuncao: 0, sextil: 60, quadratura: 90, trigono: 120, oposicao: 180 }
  const TOM: Record<string, string> = {
    conjuncao: 'neutro', sextil: 'harmonioso', quadratura: 'tenso',
    trigono: 'harmonioso', oposicao: 'tenso',
  }
  const out: any[][] = []
  for (let n = 1; n <= quantos; n++) {
    let s = n * 7919
    const r = () => { s = (s * 1103515245 + 12345) % 2147483648; return s / 2147483648 }
    const A: Record<string, number> = {}
    const B: Record<string, number> = {}
    for (const p of PL) { A[p] = r() * 360; B[p] = r() * 360 }
    const lista: any[] = []
    for (const m of PL) {
      for (const t of PL) {
        let d = Math.abs(A[m] - B[t]) % 360
        if (d > 180) d = 360 - d
        for (const [nome, ang] of Object.entries(ANG)) {
          const orb = Math.abs(d - ang)
          if (orb <= 6) { lista.push({ mine: m, theirs: t, aspect: nome, tone: TOM[nome], orb }); break }
        }
      }
    }
    out.push(lista)
  }
  return out
}

describe('as faixas de afinidade', () => {
  /**
   * ⚠️ UMA FAIXA QUE NUNCA ACONTECE É TÃO INÚTIL QUANTO UMA QUE ACONTECE
   * SEMPRE. Com os cortes antigos (80/65/50/35), herdados da escala saturada,
   * "afinidade altíssima" aparecia em 0,45% dos pares — na prática, nunca.
   */
  it('toda faixa acontece, e nenhuma domina', () => {
    const contagem: Record<string, number> = {}
    const valores: number[] = []
    for (const lista of pares(2000)) {
      const pct = synastryScore(lista as never).pct
      valores.push(pct)
      const b = affinityBand(pct)
      contagem[b] = (contagem[b] || 0) + 1
    }
    const total = valores.length
    for (const faixa of ['altissima', 'alta', 'boa', 'moderada', 'baixa'] as const) {
      const share = (contagem[faixa] || 0) / total
      expect(share, `"${faixa}" acontece em ${(share * 100).toFixed(1)}% dos pares — faixa morta`)
        .toBeGreaterThan(0.02)
      expect(share, `"${faixa}" acontece em ${(share * 100).toFixed(1)}% dos pares — faixa que engole as outras`)
        .toBeLessThan(0.55)
    }
  })

  /**
   * ⚠️ COR E PALAVRA TÊM DE VIRAR NO MESMO PONTO. Quando viravam em pontos
   * diferentes existia uma faixa onde a tela dizia "boa afinidade" em âmbar de
   * alerta — dois sinais contraditórios sobre o mesmo número.
   */
  it('a cor vira no mesmo ponto que o rótulo', () => {
    const corDaFaixa: Record<string, string> = {}
    for (let pct = 0; pct <= 100; pct++) {
      const b = affinityBand(pct)
      const c = affinityColor(pct)
      if (corDaFaixa[b] && corDaFaixa[b] !== c) {
        // "altissima" e "alta" compartilham o verde de propósito — o que não
        // pode é a cor mudar NO MEIO de uma faixa.
        expect(b, `a cor muda dentro da faixa "${b}" (em ${pct}%)`).toBe('__nunca__')
      }
      corDaFaixa[b] = c
    }
    expect(Object.keys(corDaFaixa).length).toBe(5)
  })

  /**
   * ⚠️ OS CORTES SÃO OS MESMOS NOS DOIS REPOS. As duas telas usam as MESMAS
   * PALAVRAS ("Alta afinidade"); limiares diferentes fariam o mesmo rótulo
   * significar coisas distintas nos Grupos e no Match, sem nada acusar.
   */
  it('o app e o backend cortam as faixas nos mesmos números', () => {
    if (!existsSync(AFFINITY_JS)) {
      console.warn(`[afinidade] backend ausente em ${AFFINITY_JS} — paridade NÃO verificada`)
      return
    }
    const fonte = readFileSync(AFFINITY_JS, 'utf8')
    const bloco = fonte.match(/function tierOf\(score\) \{([\s\S]*?)\n\}/)
    expect(bloco, 'tierOf sumiu do backend').not.toBeNull()
    const numeros = [...bloco![1].matchAll(/>=\s*(\d+)/g)].map((m) => Number(m[1]))
    expect(numeros, 'os cortes do backend divergiram do app')
      .toEqual([AFFINITY_CUTS.altissima, AFFINITY_CUTS.alta, AFFINITY_CUTS.boa, AFFINITY_CUTS.moderada])
  })

  /** Os cortes antigos não podem voltar por descuido. */
  it('os cortes da escala saturada não voltaram', () => {
    expect(
      [AFFINITY_CUTS.altissima, AFFINITY_CUTS.alta, AFFINITY_CUTS.boa, AFFINITY_CUTS.moderada],
      'voltaram os cortes 80/65/50/35, que são da escala que saturava',
    ).not.toEqual([80, 65, 50, 35])
  })
})

describe('a porcentagem explicada', () => {
  /**
   * ⚠️ SEM DIZER ONDE FICA O EMPATE, O NÚMERO NÃO SE LÊ. "71%" sozinho é
   * tomado por "71 de 100 pontos possíveis" — e não é isso: é um saldo entre o
   * que flui e o que atrita, com 50 no empate.
   */
  it('diz onde fica o empate', () => {
    const score = synastryScore(pares(1)[0] as never)
    const linhas = explicarAfinidade(score, 'pt-BR')
    expect(linhas.length, 'a explicação sumiu').toBeGreaterThan(0)
    expect(linhas.join(' '), 'a explicação não diz onde fica o empate').toMatch(/50%/)
  })

  /**
   * ⚠️ A RESSALVA DO SALDO SÓ CABE QUANDO HÁ OS DOIS LADOS. Num par sem
   * nenhuma tensão ela soaria como desculpa para um número que não precisa de
   * nenhuma.
   */
  it('só fala de saldo quando há os dois lados', () => {
    const soHarmonico = [
      { mine: 'venus', theirs: 'mars', aspect: 'trigono', tone: 'harmonioso', orb: 1 },
      { mine: 'moon', theirs: 'venus', aspect: 'sextil', tone: 'harmonioso', orb: 2 },
    ]
    const linhas = explicarAfinidade(synastryScore(soHarmonico as never), 'pt-BR')
    expect(linhas.join(' '), 'falou de saldo num par sem tensão nenhuma').not.toMatch(/saldo/i)
  })

  it('a participação citada bate com o número mostrado', () => {
    for (const lista of pares(60)) {
      const score = synastryScore(lista as never)
      const linhas = explicarAfinidade(score, 'pt-BR')
      const m = linhas.join(' ').match(/Aqui, (\d+)% do contato/)
      expect(m, 'a explicação deixou de citar a participação').not.toBeNull()
      const citado = Number(m![1])
      const esperado = Math.round((score.apoio / (score.apoio + score.tensao)) * 100)
      expect(citado, 'a participação citada não é a que produz a porcentagem').toBe(esperado)
      // ⚠️ E TEM DE ANDAR JUNTO COM A %: mais de metade do peso do lado que
      // flui tem de significar acima de 50. Se um dia divergirem, a frase
      // estaria explicando um número diferente do que está na tela.
      if (citado > 55) expect(score.pct, `participação ${citado}% mas pct ${score.pct}`).toBeGreaterThan(50)
      if (citado < 45) expect(score.pct, `participação ${citado}% mas pct ${score.pct}`).toBeLessThan(50)
    }
  })

  it('existe nos 4 idiomas', () => {
    const score = synastryScore(pares(1)[0] as never)
    const pt = explicarAfinidade(score, 'pt-BR').join(' ')
    for (const lang of ['en-US', 'es-ES', 'it-IT'] as const) {
      const txt = explicarAfinidade(score, lang).join(' ')
      expect(txt.length, `${lang}: explicação vazia`).toBeGreaterThan(20)
      expect(txt, `${lang}: devolveu o texto em português`).not.toBe(pt)
    }
    // Regra do projeto: es-ES sem tildes nem ñ; it-IT sem acentos.
    expect(explicarAfinidade(score, 'es-ES').join(' '), 'es-ES com tilde ou ñ').not.toMatch(/[áéíóúñ]/i)
    expect(explicarAfinidade(score, 'it-IT').join(' '), 'it-IT com acento').not.toMatch(/[àèéìòù]/i)
  })
})

describe('o cartão do membro, nos Grupos', () => {
  /**
   * ⚠️ O NOME FOI ESPREMIDO POR UM BOTÃO NOVO. As ações dividiam a linha com o
   * nome; ao virarem três, o `flex: 1` do bloco do nome cedeu antes dos botões
   * e a tela passou a mostrar "Érica …". Quem cresce não pode empurrar quem
   * identifica.
   */
  it('as ações têm linha própria, e ela quebra em vez de espremer o nome', () => {
    const fonte = readFileSync(
      join(__dirname, '..', '..', 'screens', 'groups', 'GroupsScreen.tsx'), 'utf8',
    )
    expect(fonte, 'a linha de ações sumiu').toMatch(/memberAcoes:/)
    expect(fonte, 'a linha de ações não quebra — botão novo volta a espremer o nome')
      .toMatch(/memberAcoes:\s*\{[^}]*flexWrap:\s*"wrap"/)
    // ⚠️ `minWidth: 0` é o que deixa o `numberOfLines={1}` truncar dentro de um
    // flex row; sem ele o filho se recusa a encolher e empurra o resto.
    expect(fonte, 'memberHeaderInfo perdeu o minWidth que permite truncar')
      .toMatch(/memberHeaderInfo:\s*\{[\s\S]{0,400}?minWidth:\s*0/)
  })
})
