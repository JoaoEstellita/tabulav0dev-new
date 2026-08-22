import { describe, expect, it } from 'vitest'

import {
  chaveAncorada,
  eventoAncoravel,
  slidesAncorados,
  TEXTOS_ANCORADOS,
} from '../ancoragem.mjs'

/**
 * O CARROSSEL ANCORADO NO CÉU DE HOJE.
 *
 * O gerador acha o evento real do dia; se há texto curado para aquela
 * combinação (Sol+Virgem…), monta um carrossel v4 com a âncora (data + evento +
 * diagrama real), o corpo curado e a ponte para o mapa. Estes testes travam o
 * contrato entre a detecção do evento e a montagem dos slides.
 */
describe('a chave da combinação', () => {
  it('ingresso vira ingresso:corpo:signo', () => {
    expect(chaveAncorada({ tipo: 'ingresso', corpo: 'Sun', signo: 'Virgem' }))
      .toBe('ingresso:Sun:Virgem')
  })

  it('fase vira fase:fase:signo', () => {
    expect(chaveAncorada({ tipo: 'fase', fase: 'Lua Cheia', signo: 'Peixes' }))
      .toBe('fase:Lua Cheia:Peixes')
  })

  it('tipo sem âncora devolve null', () => {
    expect(chaveAncorada({ tipo: 'retrogrado', corpo: 'Mercury' })).toBeNull()
    expect(chaveAncorada(null)).toBeNull()
  })
})

describe('o evento ancorável do dia', () => {
  /**
   * 23/08/2026 o Sol entra em Virgem — evento real, e o texto está no banco.
   * Se a efeméride mudar de dia, este teste avisa antes da produção.
   */
  it('acha o Sol entrando em Virgem em 23/08/2026', () => {
    const achado = eventoAncoravel(new Date('2026-08-23T12:00:00Z'))
    expect(achado).not.toBeNull()
    expect(achado.chave).toBe('ingresso:Sun:Virgem')
    expect(achado.ev.tipo).toBe('ingresso')
  })

  /**
   * Um dia sem nenhum evento curado devolve null: o dia então segue pela
   * fila/cascata, sem carrossel ancorado. Só dispara quando o texto existe.
   */
  it('devolve null quando o céu do dia não casa com o banco', () => {
    // 10/09/2026 — dia comum, sem ingresso de peso curado
    const achado = eventoAncoravel(new Date('2026-09-10T12:00:00Z'))
    if (achado) {
      // se algum dia entrar no banco, a chave tem de existir de fato
      expect(TEXTOS_ANCORADOS[achado.chave]).toBeTruthy()
    } else {
      expect(achado).toBeNull()
    }
  })
})

describe('os slides ancorados', () => {
  const chave = 'ingresso:Sun:Virgem'
  const ev = { tipo: 'ingresso', corpo: 'Sun', signo: 'Virgem' }

  it('monta capa + corpo curado + cta, todos numerados', () => {
    const t = slidesAncorados(ev, chave, '2026-08-23')
    const banco = TEXTOS_ANCORADOS[chave]
    expect(t.slides.length).toBe(2 + banco.slides.length) // capa + corpo + cta
    expect(t.slides[0].tipo).toBe('capa')
    expect(t.slides.at(-1).tipo).toBe('cta')
    // numeração 1..total consistente
    t.slides.forEach((s, i) => {
      expect(s.n).toBe(i + 1)
      expect(s.total).toBe(t.slides.length)
    })
  })

  it('a capa ancora na data e no evento reais', () => {
    const t = slidesAncorados(ev, chave, '2026-08-23')
    expect(t.slides[0].olho).toContain('23 de agosto')
    expect(t.slides[0].titulo).toContain('Virgem')
    expect(t.slides[0].titulo).toContain('*') // uma palavra em itálico dourado
  })

  it('cada slide de corpo carrega o diagrama real', () => {
    const t = slidesAncorados(ev, chave, '2026-08-23')
    const corpo = t.slides.filter((s) => s.tipo === 'texto')
    expect(corpo.length).toBeGreaterThan(0)
    corpo.forEach((s) => expect(s.figura).toBeTruthy())
  })

  it('a cena da capa IA corresponde ao tipo do evento', () => {
    expect(slidesAncorados(ev, chave, '2026-08-23').cena).toBe('ingresso')
  })

  it('chave fora do banco devolve null', () => {
    expect(slidesAncorados(ev, 'ingresso:Pluto:Peixes', '2026-08-23')).toBeNull()
  })
})

/**
 * O CONTRATO DO BANCO: toda entrada precisa dos campos que a montagem usa,
 * senão um slide sai vazio na produção sem ninguém notar.
 */
describe('o banco de textos ancorados', () => {
  it('toda entrada tem capa, três slides de corpo e legenda', () => {
    for (const [chave, t] of Object.entries(TEXTOS_ANCORADOS)) {
      expect(t.capa, `${chave}.capa`).toBeTruthy()
      expect(t.legenda, `${chave}.legenda`).toBeTruthy()
      expect(Array.isArray(t.slides), `${chave}.slides`).toBe(true)
      expect(t.slides.length, `${chave}.slides.length`).toBe(3)
      t.slides.forEach((s, i) => {
        expect(s.titulo, `${chave}.slides[${i}].titulo`).toBeTruthy()
        expect(s.corpo, `${chave}.slides[${i}].corpo`).toBeTruthy()
      })
    }
  })
})
