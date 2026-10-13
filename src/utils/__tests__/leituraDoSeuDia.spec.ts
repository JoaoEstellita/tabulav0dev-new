import { describe, it, expect } from 'vitest'
import { sintetizarODia, type TransitoAtivo } from '../sinteseDoDia'

// O motor grava as janelas com `toISOString()`. Datas sem hora viram meia-noite
// UTC e, no Brasil, caem no dia anterior — então o teste usa o formato real.
const iso = (dia: string, hora = '12:00:00-03:00') => new Date(`${dia}T${hora}`).toISOString()

const HOJE = new Date('2026-10-13T09:00:00-03:00')

function transito(p: Partial<TransitoAtivo> & { window: TransitoAtivo['window'] }): TransitoAtivo {
  return { transitPlanet: 'Mercury', natalPlanet: 'Pluto', type: 'conjunção', strength: 80, house: 5, ...p }
}

const linhas = (ts: TransitoAtivo[], lang = 'pt-BR') =>
  (sintetizarODia(ts, lang as any, HOJE)?.frases || []).flatMap(f => f.origens)

describe('leitura do "Seu dia"', () => {
  // ⚠️ Saiu na tela do João: "o Sol em trígono ao seu Lua", "Júpiter em sextil
  // com o seu Lua". A Lua é feminina e o possessivo estava fixo no masculino.
  it('o possessivo concorda com o gênero do alvo natal', () => {
    const [o] = linhas([transito({
      transitPlanet: 'Sun', natalPlanet: 'Moon', type: 'trígono',
      window: { start: iso('2026-10-03'), exact: iso('2026-10-13'), end: iso('2026-10-21') },
    })])
    expect(o.texto).toContain('à sua Lua')
    expect(o.texto).not.toContain('ao seu Lua')

    const [c] = linhas([transito({
      transitPlanet: 'Jupiter', natalPlanet: 'Moon', type: 'sextil',
      window: { start: iso('2026-08-21'), exact: iso('2026-12-02'), end: iso('2026-11-04') },
    })])
    expect(c.texto).toContain('com a sua Lua')

    // E o masculino não pode ter virado feminino no caminho.
    const [m] = linhas([transito({
      window: { start: iso('2026-10-07'), exact: iso('2026-10-15'), end: iso('2026-10-18') },
    })])
    expect(m.texto).toContain('com o seu Plutão')
  })

  // Sol e Lua levam artigo para costurar no meio da frase ("Mercúrio em
  // conjunção E A LUA em conjunção"). Quando lideram a linha, ela abria
  // minúscula e lia como erro de digitação.
  it('a linha de origem abre com maiúscula mesmo quando o agente leva artigo', () => {
    const [o] = linhas([transito({
      transitPlanet: 'Moon', natalPlanet: 'Pluto',
      window: { start: iso('2026-10-11'), exact: iso('2026-10-12'), end: iso('2026-10-13') },
    })])
    expect(o.texto.startsWith('A Lua')).toBe(true)
  })

  // ⚠️ A fase é EXCEÇÃO, não rótulo. A primeira versão marcava toda linha
  // ("pico em 2 dias", "depois do pico", "em curso") e com dez trânsitos cada
  // linha virava duas — a maioria carregando "depois do pico", que é o rótulo
  // mais comum e o que menos muda a decisão de hoje. Marcador que aparece
  // sempre não marca nada.
  describe('fase aparece só quando muda a decisão de hoje', () => {
    const marca: Array<[string, TransitoAtivo['window'], string]> = [
      ['acaba hoje', { start: iso('2026-10-11'), exact: iso('2026-10-12'), end: iso('2026-10-13') }, 'último dia'],
      ['exato hoje', { start: iso('2026-10-03'), exact: iso('2026-10-13'), end: iso('2026-10-21') }, 'pico hoje'],
    ]
    for (const [nome, window, esperado] of marca) {
      it(`marca: ${nome}`, () => {
        expect(linhas([transito({ window })])[0].quando).toContain(esperado)
      })
    }

    // O período basta para tudo o mais: começo, fim e pico futuro se leem das datas.
    const soDatas: Array<[string, TransitoAtivo['window']]> = [
      ['exato amanhã',  { start: iso('2026-10-07'), exact: iso('2026-10-14'), end: iso('2026-10-18') }],
      ['exato em dias', { start: iso('2026-10-07'), exact: iso('2026-10-15'), end: iso('2026-10-18') }],
      ['pico passou',   { start: iso('2026-10-01'), exact: iso('2026-10-09'), end: iso('2026-10-20') }],
      ['pico distante', { start: iso('2026-08-21'), exact: iso('2026-12-02'), end: iso('2026-12-20') }],
    ]
    for (const [nome, window] of soDatas) {
      it(`sem marca: ${nome}`, () => {
        const q = linhas([transito({ window })])[0].quando
        expect(q, nome).toMatch(/^\d{2}\/\d{2}(\/\d{2})? a \d{2}\/\d{2}(\/\d{2})?$/)
      })
    }

    // "último dia" ganha de "pico hoje" de propósito: é o que mais muda a decisão.
    it('o fim de hoje tem prioridade sobre a informação de pico', () => {
      const q = linhas([transito({
        window: { start: iso('2026-10-11'), exact: iso('2026-10-13'), end: iso('2026-10-13') },
      })])[0].quando
      expect(q).toContain('último dia')
      expect(q).not.toContain('pico hoje')
    })
  })

  // "em curso" foi removido: custava duas palavras em TODA linha de lento, e o
  // título do grupo "Trânsitos lentos" já diz que aquilo é tema em andamento.
  it('o lento mostra só as datas, sem rótulo "em curso"', () => {
    const q = linhas([transito({
      transitPlanet: 'Uranus', natalPlanet: 'Jupiter',
      window: { start: iso('2026-04-12'), exact: iso('2027-03-10'), end: iso('2027-04-12') },
    })])[0].quando
    expect(q).toBe('12/04/26 a 12/04/27')
  })

  // ⚠️ Ordenar pelo TEXTO do período daria certo por acidente dentro do mesmo
  // ano e quebraria na virada — por isso a frase carrega a data crua.
  it('a frase expõe a data de início crua, para a tela ordenar', () => {
    const s = sintetizarODia([transito({
      window: { start: iso('2026-04-12'), exact: iso('2027-03-10'), end: iso('2027-04-12') },
    })], 'pt-BR' as any, HOJE)!
    expect(s.frases[0].inicio).toBe(iso('2026-04-12'))
  })

  // ⚠️ O "em" era português e vazava para es-ES e it-IT: "Sole em trigono",
  // "Sol em trigono a tu Luna". Só o inglês escapava, porque tinha ramo próprio.
  it('a preposição do agente é a do idioma, não a portuguesa', () => {
    const umTransito = [transito({
      transitPlanet: 'Sun', natalPlanet: 'Moon', type: 'trígono',
      window: { start: iso('2026-10-03'), exact: iso('2026-10-13'), end: iso('2026-10-21') },
    })]
    expect(linhas(umTransito, 'es-ES')[0].texto).toContain('en trigono')
    expect(linhas(umTransito, 'it-IT')[0].texto).toContain('in trigono')
    for (const lang of ['en-US', 'es-ES', 'it-IT']) {
      expect(linhas(umTransito, lang)[0].texto, lang).not.toMatch(/\bem\b/)
    }
  })

  // Preposizione articolata: "a" funde com o artigo do possessivo.
  it('it-IT funde a preposição no possessivo ("alla tua Luna", não "a la tua")', () => {
    const t = linhas([transito({
      transitPlanet: 'Sun', natalPlanet: 'Moon', type: 'trígono',
      window: { start: iso('2026-10-03'), exact: iso('2026-10-13'), end: iso('2026-10-21') },
    })], 'it-IT')[0].texto
    expect(t).toContain('alla tua Luna')
    expect(t).not.toContain('a la tua')
    expect(t).not.toContain('il tuo Luna')
  })
})
