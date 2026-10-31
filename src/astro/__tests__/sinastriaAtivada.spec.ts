import { describe, it, expect } from 'vitest'
import {
  contatosComGrau, ativacaoNoInstante, curvaDoVinculo, paraEscalaAtivacao,
  K_ATIVACAO, DIAS_DA_CURVA, PASSO_DIAS,
} from '../sinastriaAtivada'
import { AREAS_SINASTRIA } from '../sinastriaPorArea'

/**
 * O QUE O CÉU ATIVA NO VÍNCULO.
 *
 * ⚠️ São DUAS medidas separadas de propósito: o vínculo é FIXO (os aspectos
 * entre dois mapas não mudam) e a ativação VARIA. Num número só, a pessoa não
 * saberia se mudou o vínculo ou o céu — o mesmo erro que "hoje vs natal"
 * existe para evitar nas emoções.
 */

const asp = (mine: string, theirs: string, aspect: string, tone: string, orb = 1) =>
  ({ mine, theirs, aspect, symbol: '', tone, orb } as any)

describe('vínculo ativado pelo céu', () => {
  /**
   * ⚠️ O TRÂNSITO TOCA UM GRAU, não um nome de planeta. Contato sem longitude
   * não tem o que ser ativado, e entra como descarte — não como zero.
   */
  it('contato sem grau é descartado, não vira zero', () => {
    const aspectos = [asp('venus', 'mars', 'trigono', 'harmonioso')]
    expect(contatosComGrau(aspectos as any, { venus: 10 }, {}).length, 'falta a ponta do outro').toBe(0)
    expect(contatosComGrau(aspectos as any, {}, { mars: 200 }).length, 'falta a minha ponta').toBe(0)
    expect(contatosComGrau(aspectos as any, { venus: 10 }, { mars: 200 }).length).toBe(1)
    expect(contatosComGrau(null, {}, {}).length).toBe(0)
  })

  /**
   * ⚠️ A CONJUNÇÃO NÃO É "LEVEMENTE BOA". A primeira versão deu +0,4 a ela e,
   * sendo frequente, empurrava a soma de TODO par para o positivo — a curva
   * dizia "o céu favorece" na maioria dos dias, um constante que se lê como
   * descoberta. A regra é a do projeto: quem decide é quem se funde.
   */
  it('a conjunção pega o sinal de quem se funde', () => {
    const grau = { venus: 0 }
    const comSaturno = contatosComGrau([asp('venus', 'saturn', 'conjuncao', 'neutro')] as any, grau, { saturn: 0 })
    const comJupiter = contatosComGrau([asp('venus', 'jupiter', 'conjuncao', 'neutro')] as any, grau, { jupiter: 0 })
    // Um trânsito em cima do grau 0 ativa os dois; o sinal é que difere.
    const quando = new Date('2026-03-20T12:00:00Z')
    const a = ativacaoNoInstante(comSaturno, quando)
    const b = ativacaoNoInstante(comJupiter, quando)
    const somaDe = (r: any) => AREAS_SINASTRIA.reduce((s, k) => s + (r.areas[k] || 0), 0)
    expect(Math.sign(somaDe(a)), 'conjunção com Saturno tem de pesar').toBe(-1)
    expect(Math.sign(somaDe(b)), 'conjunção com Júpiter tem de apoiar').toBe(1)
  })

  /** Ativar não é melhorar: o sinal segue o TOM DO CONTATO, não o do trânsito. */
  it('acender um contato tenso acende a tensão', () => {
    const quando = new Date('2026-03-20T12:00:00Z')
    const tenso = contatosComGrau([asp('venus', 'mars', 'quadratura', 'tenso')] as any, { venus: 0 }, { mars: 90 })
    const harmonico = contatosComGrau([asp('venus', 'mars', 'trigono', 'harmonioso')] as any, { venus: 0 }, { mars: 120 })
    const soma = (r: any) => AREAS_SINASTRIA.reduce((s, k) => s + (r.areas[k] || 0), 0)
    expect(soma(ativacaoNoInstante(tenso, quando))).toBeLessThan(0)
    expect(soma(ativacaoNoInstante(harmonico, quando))).toBeGreaterThan(0)
  })

  /**
   * ⚠️ A ESCALA FOI MEDIDA, e a primeira tentativa errou por quatro vezes: com
   * K=0,55 a mediana dava 81 e 27% dos pontos batiam no teto — um gráfico
   * colado no topo não é gráfico. Medido em 3.597 amostras, K=0,12 dá
   * p10=19 · p50=55 · p90=87, com 2% nas pontas.
   */
  it('a escala não satura', () => {
    expect(K_ATIVACAO).toBeLessThan(0.2)
    expect(paraEscalaAtivacao(0), 'nada acontecendo é o meio da escala').toBe(50)
    // Soma típica (|mediana| medida ≈ 4,4) tem de cair no meio, não na ponta.
    const tipico = paraEscalaAtivacao(4.4)
    expect(tipico).toBeGreaterThan(55)
    expect(tipico, 'soma típica não pode já saturar').toBeLessThan(80)
    // Só o extremo chega perto do teto.
    expect(paraEscalaAtivacao(60)).toBeGreaterThan(95)
    expect(paraEscalaAtivacao(-60)).toBeLessThan(5)
    // E o sinal é preservado: tensão desce, apoio sobe.
    expect(paraEscalaAtivacao(-4.4)).toBeLessThan(50)
  })

  /**
   * ⚠️ UM PONTO POR DIA SERIA RUÍDO COM CARA DE SINAL. O que move a leitura de
   * um casal em 45 dias são os trânsitos LENTOS; a Lua mudaria o número todo
   * dia sem dizer nada sobre o período — por isso ela fica fora, e a amostragem
   * é a cada poucos dias.
   */
  it('a curva é amostrada, e a Lua fica de fora', () => {
    expect(PASSO_DIAS).toBeGreaterThan(1)
    const c = contatosComGrau(
      [asp('venus', 'mars', 'trigono', 'harmonioso'), asp('moon', 'venus', 'sextil', 'harmonioso')] as any,
      { venus: 10, moon: 50 }, { mars: 130, venus: 110 },
    )
    const curva = curvaDoVinculo(c)
    expect(curva.length).toBe(Math.floor(DIAS_DA_CURVA / PASSO_DIAS) + 1)
    // A Lua anda ~13°/dia: se ela entrasse, pontos vizinhos pulariam muito.
    const afeto = curva.map((p) => p.areas.afeto!).filter((x) => x != null)
    const saltos = afeto.slice(1).map((v, i) => Math.abs(v - afeto[i]))
    expect(Math.max(...saltos), 'salto grande entre pontos vizinhos sugere planeta rápido na conta').toBeLessThan(35)
  })

  it('a curva tem o que mostrar — ela se move', () => {
    const c = contatosComGrau(
      [
        asp('venus', 'mars', 'trigono', 'harmonioso'),
        asp('moon', 'saturn', 'quadratura', 'tenso'),
        asp('mercury', 'uranus', 'oposicao', 'tenso'),
      ] as any,
      { venus: 15, moon: 200, mercury: 95 }, { mars: 135, saturn: 290, uranus: 275 },
    )
    const curva = curvaDoVinculo(c)
    expect(curva.length).toBeGreaterThan(5)
    for (const p of curva) {
      expect(p.dia).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      for (const a of AREAS_SINASTRIA) {
        const v = p.areas[a]
        if (v == null) continue
        expect(v).toBeGreaterThanOrEqual(0)
        expect(v).toBeLessThanOrEqual(100)
      }
    }
  })

  it('sem contatos não há curva — e não é uma curva de zeros', () => {
    expect(curvaDoVinculo([]).length).toBe(0)
    expect(curvaDoVinculo(null as any).length).toBe(0)
  })

  /**
   * O ponto nomeia o que mais pesa nele — é o que permite a tela dizer "vem de
   * Plutão em quadratura" em vez de só desenhar uma linha.
   */
  it('cada ponto diz de onde vem', () => {
    const c = contatosComGrau([asp('venus', 'mars', 'trigono', 'harmonioso')] as any, { venus: 0 }, { mars: 120 })
    const curva = curvaDoVinculo(c, { dias: 9, passo: 3 })
    const comNome = curva.filter((p) => p.principal)
    expect(comNome.length, 'nenhum ponto soube dizer de onde vem').toBeGreaterThan(0)
    expect(comNome[0].principal!.planeta).toBeTruthy()
    expect(comNome[0].principal!.aspecto).toBeTruthy()
  })
})
