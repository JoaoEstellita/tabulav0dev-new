import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { emocoesDoDia, EMOCOES, REFERENCIA_POR_ANEL } from '../emocoesDoDia'
import fixtures from './fixtures_transitos.json'

/**
 * A REFERÊNCIA DE CADA ANEL — o que torna os oito comparáveis.
 *
 * ⚠️ O PROBLEMA QUE ELA RESOLVE, medido nos 21 mapas reais: o valor 45 fica
 * acima de 90% dos casos no Afeto e acima de apenas 33% no Entusiasmo. A roda
 * mostra os dois como anéis idênticos, lado a lado, convidando a comparação
 * que engana. A causa é estrutural — cada anel tem um conjunto diferente de
 * planetas-fonte e somas de peso diferentes, logo tetos diferentes.
 *
 * ⚠️ A marca NÃO muda o número. O valor do dia é o mesmo que o agente, o grupo
 * e a matinal usam; o que ela acrescenta é a régua.
 */

describe('referência por anel', () => {
  it('há uma referência para cada uma das oito', () => {
    for (const k of EMOCOES) {
      const v = (REFERENCIA_POR_ANEL as Record<string, number>)[k]
      expect(v, `sem referência: ${k}`).toBeTypeOf('number')
      expect(v, `referência fora da escala: ${k} = ${v}`).toBeGreaterThan(0)
      expect(v).toBeLessThan(100)
    }
    expect(Object.keys(REFERENCIA_POR_ANEL).sort()).toEqual([...EMOCOES].sort())
  })

  /**
   * ⚠️ AS REFERÊNCIAS PRECISAM DIFERIR ENTRE SI — é a razão de existirem. Se um
   * dia caírem todas no mesmo valor, a marca virou enfeite e a roda voltou a
   * comparar escalas diferentes como se fossem iguais.
   */
  it('as referências não são todas iguais — é esse o ponto', () => {
    const vals = EMOCOES.map((k) => (REFERENCIA_POR_ANEL as Record<string, number>)[k])
    const min = Math.min(...vals)
    const max = Math.max(...vals)
    expect(max - min, `as oito referências quase não diferem (${min}–${max})`).toBeGreaterThanOrEqual(15)
  })

  /**
   * ⚠️ A REFERÊNCIA TEM DE CAIR DENTRO DO QUE O ANEL REALMENTE PRODUZ.
   *
   * Uma referência acima do teto do anel marcaria "sempre abaixo do normal", e
   * uma abaixo do piso marcaria "sempre acima" — nos dois casos a marca
   * mentiria todo dia, sem dar erro. (O Entusiasmo tem piso 14: nunca chega a
   * zero. Uma referência de 5 para ele seria exatamente esse defeito.)
   */
  it('cada referência cai dentro da faixa que o anel produz de verdade', () => {
    const vistos: Record<string, number[]> = {}
    for (const u of fixtures as any[]) {
      const r = emocoesDoDia(u.transitos)
      if (!r) continue
      for (const e of r) (vistos[e.chave] = vistos[e.chave] || []).push(e.valor)
    }
    const fora: string[] = []
    for (const k of EMOCOES) {
      const v = (REFERENCIA_POR_ANEL as Record<string, number>)[k]
      const obs = vistos[k] || []
      if (!obs.length) continue
      const min = Math.min(...obs)
      const max = Math.max(...obs)
      if (v < min || v > max) fora.push(`${k}: referência ${v} fora do observado ${min}–${max}`)
    }
    expect(fora, fora.join('\n')).toEqual([])
  })

  /**
   * ⚠️ A referência é a MEDIANA simulada, então mais ou menos metade dos casos
   * reais tem de cair de cada lado. Muito desequilibrado quer dizer que a
   * calibração descolou do real — foi o que aconteceu na primeira versão do
   * script, que simulava dias ralos e dava mediana 8 para o Afeto contra 27
   * observados.
   */
  it('a referência fica no meio do que se observa, não numa ponta', () => {
    const desequilibrio: string[] = []
    for (const k of EMOCOES) {
      const v = (REFERENCIA_POR_ANEL as Record<string, number>)[k]
      const obs: number[] = []
      for (const u of fixtures as any[]) {
        const r = emocoesDoDia(u.transitos)
        if (!r) continue
        const e = r.find((x) => x.chave === k)
        if (e) obs.push(e.valor)
      }
      if (obs.length < 10) continue
      const acima = obs.filter((x) => x > v).length / obs.length
      // Folga larga de propósito: a referência vem de simulação e a amostra
      // real é de um único dia. O que se trava é "não está numa ponta".
      if (acima < 0.2 || acima > 0.8) {
        desequilibrio.push(`${k}: ${Math.round(acima * 100)}% dos casos acima da referência ${v}`)
      }
    }
    expect(desequilibrio, desequilibrio.join('\n')).toEqual([])
  })

  /**
   * ⚠️ PARIDADE com o gêmeo do backend. A tabela vive nos dois arquivos, e este
   * projeto já provou que gêmeo sem teste diverge calado.
   */
  it('a tabela é a mesma no backend', () => {
    const JS = join(__dirname, '..', '..', '..', '..', 'backend', 'lib', 'status', 'emocoes-do-dia.js')
    if (!existsSync(JS)) {
      console.warn(`[referência] backend ausente em ${JS} — paridade NÃO verificada`)
      return
    }
    const fonte = readFileSync(JS, 'utf8')
    const bloco = fonte.match(/const REFERENCIA_POR_ANEL = \{([\s\S]*?)\};/)
    expect(bloco, 'REFERENCIA_POR_ANEL sumiu do backend').not.toBeNull()
    const doBackend: Record<string, number> = {}
    for (const m of bloco![1].matchAll(/(\w+):\s*(\d+)/g)) doBackend[m[1]] = Number(m[2])
    expect(doBackend, 'a referência divergiu entre app e backend').toEqual({ ...REFERENCIA_POR_ANEL })
  })
})
