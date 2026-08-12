import { describe, expect, it } from 'vitest'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { lerLiterais } from '../catalogo.mjs'
import {
  LIFE_AREA_ORDER, LIFE_AREA_COLORS, NOME_DA_AREA, STATUS_THRESHOLDS, DIA_DE_EXEMPLO,
} from '../areasDoApp.mjs'
import { molduraDeCelular, corDoScore, faixaDaArea, TELAS } from '../telaDoApp.mjs'
import { montarRecurso } from '../templateRecurso.mjs'
import { RECURSO, CHAVES_DE_RECURSO, recursoDoDia } from '../textosRecurso.mjs'
import { dadosDaTela } from '../dadosDaTela.mjs'
import { TEMA, CHAVES_DE_TEMA, temaPorChave } from '../temasDeCarrossel.mjs'
import { mapaDoCeu } from '../ceu.mjs'
import { pecaDoAssunto } from '../pecaDoAssunto.mjs'

const FRONTEND = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..')

const [areas, limiares, orbes] = await Promise.all([
  lerLiterais(path.join(FRONTEND, 'src/constants/lifeAreas.ts'),
    ['LIFE_AREA_ORDER', 'LIFE_AREA_COLORS', 'LIFE_AREA_LABELS']),
  lerLiterais(path.join(FRONTEND, 'src/constants/statusThresholds.ts'), ['STATUS_THRESHOLDS']),
  lerLiterais(path.join(FRONTEND, 'src/astro/aspect-config.ts'), ['PLANET_ASPECT_ORBS']),
])

/**
 * A TRAVA DO MOCKUP.
 *
 * O João decidiu que as telas do app seriam desenhadas por mim em vez de
 * fotografadas, e eu registrei o risco: um desenho que diverge da tela real
 * vira promessa que o app não cumpre.
 *
 * `areasDoApp.mjs` é cópia declarada das constantes do app, porque o gerador é
 * `.mjs` e não importa TypeScript. Estes testes leem os `.ts` DE VERDADE e
 * quebram na primeira divergência. É o que impede o desenho de envelhecer em
 * silêncio quando alguém mexer no aplicativo.
 */
describe('o desenho não pode divergir do app', () => {
  it('tem as mesmas oito áreas, na mesma ordem', () => {
    expect(LIFE_AREA_ORDER).toEqual(areas.LIFE_AREA_ORDER)
  })

  it('pinta cada área com a cor do app', () => {
    for (const chave of LIFE_AREA_ORDER) {
      expect(LIFE_AREA_COLORS[chave], chave).toEqual(areas.LIFE_AREA_COLORS[chave])
    }
  })

  it('chama cada área pelo nome do app', () => {
    for (const chave of LIFE_AREA_ORDER) {
      expect(NOME_DA_AREA[chave], chave).toBe(areas.LIFE_AREA_LABELS[chave])
    }
  })

  it('usa os limiares do app para o rótulo da área', () => {
    expect(STATUS_THRESHOLDS).toEqual(limiares.STATUS_THRESHOLDS)
  })

  /**
   * A cor do score do dia usa 65 e 40, e NÃO os limiares de STATUS_THRESHOLDS.
   * São dois critérios diferentes no app (HomeScreen.tsx:476 contra
   * LifeAreaCard), e trocar um pelo outro pinta de verde um dia que o app
   * pinta de amarelo.
   */
  it('separa a cor do score da faixa da área', () => {
    expect(corDoScore(65)).toBe('#4CAF50')
    expect(corDoScore(64)).toBe('#FFD700')
    expect(corDoScore(40)).toBe('#FFD700')
    expect(corDoScore(39)).toBe('#FF6B6B')

    expect(faixaDaArea(62, STATUS_THRESHOLDS)).toBe('Positivo')
    expect(faixaDaArea(61, STATUS_THRESHOLDS)).toBe('Moderado')
    expect(faixaDaArea(34, STATUS_THRESHOLDS)).toBe('Crítico')
  })
})

describe('as telas desenhadas', () => {
  const mapa = mapaDoCeu(new Date('2026-08-11T12:00:00Z'), orbes.PLANET_ASPECT_ORBS)

  it('todas montam sem buraco', () => {
    for (const qual of Object.keys(TELAS)) {
      const html = molduraDeCelular(qual, dadosDaTela(qual, { mapa, limiares: STATUS_THRESHOLDS }))
      expect(html, qual).not.toMatch(/undefined|NaN|\[object/)
      expect(html.length, qual).toBeGreaterThan(200)
    }
  })

  it('a tela do Perfil mostra as oito áreas com o nome do app', () => {
    const html = molduraDeCelular('inicio', dadosDaTela('inicio', { mapa, limiares: STATUS_THRESHOLDS }))
    for (const chave of LIFE_AREA_ORDER) {
      expect(html, chave).toContain(NOME_DA_AREA[chave])
    }
  })

  /** A roda usa posição real: se o cálculo sumir, a peça não pode sair vazia. */
  it('a roda do mapa desenha os dez corpos', () => {
    const html = molduraDeCelular('mapa', dadosDaTela('mapa', { mapa }))
    for (const glifo of ['☉', '☽', '☿', '♀', '♂', '♃', '♄', '♅', '♆', '♇']) {
      expect(html, glifo).toContain(glifo)
    }
  })

  /** Nome de aba que não existe manda a pessoa procurar o que não há. */
  it('só cita abas que existem no app', () => {
    const ABAS = ['Perfil', 'Mapa Natal', 'Grupos', 'Previsões', 'Assinatura', 'Configurações']
    for (const chave of CHAVES_DE_RECURSO) {
      const onde = RECURSO[chave].onde
      expect(ABAS.some((a) => onde.includes(a)), `${chave}: ${onde}`).toBe(true)
    }
  })

  it('o exemplo cobre as três faixas, e não só o que é bonito', () => {
    const valores = Object.values(DIA_DE_EXEMPLO.areas)
    expect(valores.some((v) => v >= STATUS_THRESHOLDS.positiveAbove)).toBe(true)
    expect(valores.some((v) => v < STATUS_THRESHOLDS.criticalBelow)).toBe(true)
  })
})

describe('as peças de recurso', () => {
  const mapa = mapaDoCeu(new Date('2026-08-11T12:00:00Z'), orbes.PLANET_ASPECT_ORBS)

  /**
   * O `<style>` sai antes da conferência.
   *
   * As fontes viajam em `data:` URI, e um base64 de 300 KB contém "NaN" e
   * "undefined" por acidente estatístico. Testar o HTML inteiro dava falha em
   * peça perfeita — e, pior, daria PASSE se eu tivesse afrouxado a regex.
   */
  const semEstilo = (html) => html.replace(/<style>[\s\S]*?<\/style>/g, '')

  it('cada recurso monta uma peça inteira', () => {
    for (const chave of CHAVES_DE_RECURSO) {
      const assunto = { tipo: 'recurso', ...recursoDoDia('2026-08-11', new Set(), chave) }
      const peca = pecaDoAssunto(assunto, { iso: '2026-08-11' })
      const html = montarRecurso({
        ...peca,
        dadosDaTela: dadosDaTela(peca.tela, { mapa, limiares: STATUS_THRESHOLDS }),
        formato: 'feed',
      })
      expect(semEstilo(html), chave).not.toMatch(/undefined|NaN|\[object/)
      expect(`${peca.titulo} ${peca.texto}`, chave).not.toContain('—')
      expect(peca.tela, chave).toBeTruthy()
      expect(peca.ponte, chave).toBeTruthy()
    }
  })

  /** Peça de produto que se defende soa como quem não tem o que mostrar. */
  it('nenhum texto se defende nem promete', () => {
    const proibido = /o único (app|aplicativo)|melhor app|garantimos|100% de acerto|nunca erra/i
    for (const chave of CHAVES_DE_RECURSO) {
      expect(`${chave}: ${RECURSO[chave].texto}`).not.toMatch(proibido)
    }
  })

  it('a tela citada existe', () => {
    for (const chave of CHAVES_DE_RECURSO) {
      expect(Object.keys(TELAS), chave).toContain(RECURSO[chave].tela)
    }
  })
})

describe('os carrosséis de tema', () => {
  it('cada tema tem começo, meio e fecho', () => {
    for (const chave of CHAVES_DE_TEMA) {
      const t = TEMA[chave]
      expect(t.slides.length, chave).toBeGreaterThanOrEqual(4)
      expect(t.slides.length, chave).toBeLessThanOrEqual(6)
      expect(t.ponte, chave).toBeTruthy()
    }
  })

  /** Seis telas seguidas cansam; texto puro não mostra o produto. */
  it('mistura slide de texto com slide de tela', () => {
    for (const chave of CHAVES_DE_TEMA) {
      const slides = TEMA[chave].slides
      expect(slides.some((s) => s.tela), `${chave} sem nenhuma tela`).toBe(true)
      expect(slides.some((s) => !s.tela), `${chave} só com telas`).toBe(true)
      for (const s of slides.filter((x) => x.tela)) {
        expect(Object.keys(TELAS), `${chave}: ${s.tela}`).toContain(s.tela)
      }
    }
  })

  it('nenhum slide sai sem texto, e nenhum usa travessão', () => {
    for (const chave of CHAVES_DE_TEMA) {
      for (const s of TEMA[chave].slides) {
        expect(s.texto.length, `${chave}: ${s.titulo}`).toBeGreaterThan(80)
        expect(`${s.titulo} ${s.texto}`, chave).not.toContain('—')
        expect(s.titulo, chave).toContain('\n')
      }
    }
  })

  it('recusa tema que não existe', () => {
    expect(() => temaPorChave('inventado')).toThrow(/não existe/)
  })
})
