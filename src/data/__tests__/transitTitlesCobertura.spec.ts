import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { TRANSIT_TITLES_PTBR, buildFallbackTransitTitle } from '../transitTitlesPtBR'

/**
 * Todo trânsito que o app sabe interpretar precisa de um título.
 *
 * O título abre o aviso do dia e o card da lista. Sem ele, a frase mais lida da
 * Home cai no genérico — e o buraco é silencioso: nada quebra, o texto só fica
 * sem graça, e ninguém reporta "o título está fraco".
 *
 * A cobertura é garantida em dois níveis: curado onde o título aparece em
 * destaque (planeta lento sobre ponto pessoal, que é o que o aviso mostra), e
 * gerado para o resto. O que este teste trava é que NENHUM par fique sem os
 * dois.
 */

// Os pares que o catálogo de interpretações conhece — a fonte da verdade sobre
// o que pode aparecer na tela.
const CATALOGO = readFileSync(
  join(__dirname, '..', 'transitCatalogPtBR.ts'),
  'utf-8',
)

const pares = [...new Set(CATALOGO.match(/transit:[a-z_]+\|[a-z_]+\|[a-z_0-9]+/g) || [])]

/** Reproduz o que `temaDoTransito` faz: curado primeiro, gerado depois. */
function tituloDe(chave: string): string | null {
  if (TRANSIT_TITLES_PTBR[chave]) return TRANSIT_TITLES_PTBR[chave]
  const [, resto] = chave.split('transit:')
  const [agente, aspecto, alvo] = resto.split('|')
  return buildFallbackTransitTitle(agente, alvo, aspecto)
}

const LENTOS = ['jupiter', 'saturn', 'uranus', 'neptune', 'pluto']
const PESSOAIS = ['sun', 'moon', 'mercury', 'venus', 'mars', 'ascendente', 'meio_do_ceu']

describe('cobertura dos títulos de trânsito', () => {
  it('o catálogo de interpretações foi lido', () => {
    // Se o regex parar de casar, todos os testes abaixo passam vazios.
    expect(pares.length, 'nenhum par encontrado — o formato da chave mudou?').toBeGreaterThan(400)
  })

  it('TODO par tem título: curado ou gerado', () => {
    const semTitulo = pares.filter((k) => !tituloDe(k))
    expect(semTitulo.slice(0, 20), `${semTitulo.length} pares sem título`).toEqual([])
  })

  it('planeta LENTO sobre ponto pessoal é sempre CURADO', () => {
    // É o que o aviso do dia mostra — força alta quase sempre é planeta lento.
    // Aqui o gerado não basta: a frase mais lida da Home merece texto escrito.
    const faltando = pares.filter((k) => {
      const [agente, aspecto, alvo] = k.split('transit:')[1].split('|')
      if (aspecto === 'ingress') return false
      return LENTOS.includes(agente) && PESSOAIS.includes(alvo) && !TRANSIT_TITLES_PTBR[k]
    })
    expect(faltando.slice(0, 20), `${faltando.length} pares de destaque sem título curado`).toEqual([])
  })

  it('nenhum título curado é vazio, duplicado do nome técnico ou gigante', () => {
    const ruins: string[] = []
    for (const [chave, titulo] of Object.entries(TRANSIT_TITLES_PTBR)) {
      if (!titulo.trim()) ruins.push(`${chave}: vazio`)
      // Regra do arquivo: frase nominal curta. Mais que isso não cabe na linha.
      else if (titulo.length > 46) ruins.push(`${chave}: ${titulo.length} chars`)
      // Um título que repete o nome do aspecto não acrescenta nada ao card, que
      // já mostra o nome técnico logo abaixo.
      else if (/\b(conjun|quadratur|tr[íi]gono|sextil|oposi)/i.test(titulo)) ruins.push(`${chave}: nomeia o aspecto`)
    }
    expect(ruins).toEqual([])
  })

  it('ingresso vira título sobre a ÁREA da casa', () => {
    // O ingresso não tem planeta natal do outro lado — o alvo é a casa. Sem
    // tratamento próprio, os 119 ingressos do catálogo ficavam sem título
    // nenhum: o gerador procurava `house_2` em ALVO_NATAL e devolvia null.
    // O vocabulário do agente é o mesmo usado nos outros títulos gerados, para
    // a lista inteira soar como uma coisa só.
    expect(buildFallbackTransitTitle('Jupiter', 'house_2', 'ingress')).toBe('Otimismo em recursos e segurança')
    expect(buildFallbackTransitTitle('Mars', 'house_10', 'ingress')).toBe('Impulso em carreira e imagem pública')
    // As 12 casas respondem.
    for (let n = 1; n <= 12; n++) {
      const t = buildFallbackTransitTitle('Saturn', `house_${n}`, 'ingress')
      expect(t, `casa ${n} sem título`).toBeTruthy()
      expect(t, `casa ${n} não deve expor a chave crua`).not.toMatch(/house/i)
    }
  })

  it('nenhum título gerado vaza chave crua ou fica pela metade', () => {
    const ruins: string[] = []
    for (const chave of pares) {
      const t = tituloDe(chave)
      if (!t) continue
      if (/house_|undefined|null|\|/.test(t)) ruins.push(`${chave}: ${t}`)
      if (t.length > 60) ruins.push(`${chave}: ${t.length} chars`)
    }
    expect(ruins.slice(0, 10)).toEqual([])
  })

  it('não há título repetido entre pares diferentes', () => {
    // Dois trânsitos distintos com o mesmo rótulo fazem a lista parecer
    // quebrada — e escondem que são leituras diferentes.
    const porTitulo = new Map<string, string[]>()
    for (const [chave, titulo] of Object.entries(TRANSIT_TITLES_PTBR)) {
      const lista = porTitulo.get(titulo) || []
      lista.push(chave)
      porTitulo.set(titulo, lista)
    }
    const repetidos = [...porTitulo.entries()]
      .filter(([, chaves]) => chaves.length > 1)
      .map(([titulo, chaves]) => `"${titulo}" em ${chaves.join(', ')}`)
    expect(repetidos).toEqual([])
  })
})
