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
import { pecaDoAssunto, enqueteDaPeca } from '../pecaDoAssunto.mjs'
import { montarFoto, fundoDeCeu } from '../templateFoto.mjs'

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

  /**
   * Seis telas seguidas cansam; texto puro não mostra o produto.
   *
   * Vale para os temas SOBRE O APP. O carrossel da lua fora de curso é conteúdo
   * astrológico: não existe tela do aplicativo sobre o assunto, e enfiar uma só
   * para cumprir o formato seria propaganda no meio da aula.
   */
  it('tema sobre o app mistura slide de texto com slide de tela', () => {
    for (const chave of CHAVES_DE_TEMA) {
      const slides = TEMA[chave].slides
      if (!TEMA[chave].sobreOApp) {
        expect(slides.every((s) => !s.tela), `${chave} não devia ter tela`).toBe(true)
        continue
      }
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

/**
 * O STORY NÃO É O POST ESTICADO.
 *
 * Era: a única diferença entre os formatos era a altura, 1920 contra 1350.
 * Mesmo texto, mesmo corpo, mesmo bloco. Um story se lê em cinco segundos,
 * passando o dedo, e o adesivo de enquete é colado por cima na hora de postar.
 */
describe('o story tem forma própria', () => {
  const peca = {
    olho: '13 de agosto',
    titulo: 'Lua fora\nde curso',
    texto: 'Primeira frase, que é a que importa. Segunda frase, que ainda cabe. '
      + 'Terceira frase, que num story ninguém lê. Quarta frase, idem. '
      + 'Quinta frase, só para o texto passar de trezentos caracteres com folga.',
    signo: 'Virgem',
  }

  const semEstilo = (html) => html.replace(/<style>[\s\S]*?<\/style>/g, '')

  it('o story corta o texto e o post não', () => {
    const noStory = semEstilo(montarFoto({ ...peca, formato: 'story' }))
    const noPost = semEstilo(montarFoto({ ...peca, formato: 'feed' }))

    expect(noPost).toContain('Terceira frase')
    expect(noStory, 'story tem de ficar nas duas primeiras frases').not.toContain('Terceira frase')
    expect(noStory).toContain('Primeira frase')
  })

  /** Sem a faixa, o adesivo de enquete cobre rodapé e assinatura. */
  it('o story reserva a faixa de baixo para o adesivo', () => {
    const html = montarFoto({ ...peca, formato: 'story' })
    expect(html).toMatch(/padding:\s*8cqw 7\.5cqw 26cqw/)

    const post = montarFoto({ ...peca, formato: 'feed' })
    expect(post).toMatch(/padding:\s*8cqw 7\.5cqw 7cqw/)
  })

  it('e o título é maior no story, onde sobra altura', () => {
    expect(montarFoto({ ...peca, formato: 'story' })).toContain('font-size: 8.6cqw')
    expect(montarFoto({ ...peca, formato: 'feed' })).toContain('font-size: 7.2cqw')
  })
})

/**
 * A ENQUETE, que existia e estava desligada.
 *
 * `perguntaDeEnquete` é testada desde sempre; quem a usava era `gerarCard.mjs`,
 * que saiu do fluxo, e a enquete saiu junto sem ninguém notar.
 */
describe('a enquete acompanha a peça', () => {
  it('cada tipo de assunto tem pergunta e duas opções', () => {
    const casos = [
      { tipo: 'eclipse', luminar: 'solar', signo: 'Leão' },
      { tipo: 'ingresso', corpoPt: 'Sol', signo: 'Virgem' },
      { tipo: 'lua_fora_de_curso', signo: 'Virgem' },
      { tipo: 'conceito', chave: 'orbe' },
      { tipo: 'recurso', chave: 'grupos' },
      { tipo: 'planeta_no_signo', chave: 'x' },
    ]
    for (const assunto of casos) {
      const e = enqueteDaPeca(assunto)
      expect(e.pergunta, assunto.tipo).toMatch(/\?$/)
      expect(e.opcoes, assunto.tipo).toHaveLength(2)
    }
  })

  it('a pergunta do eclipse fala de eclipse', () => {
    expect(enqueteDaPeca({ tipo: 'eclipse', luminar: 'solar' }).pergunta).toMatch(/eclipse/i)
  })
})

/** A peça da Lua com o Sol atrás: "não tem nada a ver". */
describe('o fundo por família', () => {
  const SIGNOS = ['Áries', 'Touro', 'Gêmeos', 'Câncer', 'Leão', 'Virgem',
    'Libra', 'Escorpião', 'Sagitário', 'Capricórnio', 'Aquário', 'Peixes']

  it('peça da Lua recebe foto de Lua', () => {
    for (const signo of SIGNOS) {
      for (let v = 0; v < 6; v++) {
        expect(fundoDeCeu(signo, v, 'Moon').arquivo, `${signo} v${v}`).toMatch(/^lua/)
      }
    }
  })

  /** A família da Lua é reservada: não pode vazar para peça de outro corpo. */
  it('quem não é a Lua nunca recebe foto de Lua', () => {
    for (const signo of SIGNOS) {
      for (let v = 0; v < 12; v++) {
        expect(fundoDeCeu(signo, v, 'Sun').arquivo).not.toMatch(/^lua/)
        expect(fundoDeCeu(signo, v, '').arquivo).not.toMatch(/^lua/)
      }
    }
  })

  it('nenhuma família fica pequena a ponto de repetir toda semana', () => {
    const porFamilia = {}
    for (const signo of SIGNOS) {
      for (let v = 0; v < 40; v++) {
        const a = fundoDeCeu(signo, v, '').arquivo
        const f = a.split('-')[0]
        ;(porFamilia[f] = porFamilia[f] || new Set()).add(a)
      }
    }
    for (const [f, arquivos] of Object.entries(porFamilia)) {
      expect(arquivos.size, `família ${f} com ${arquivos.size} fotos`).toBeGreaterThanOrEqual(4)
    }
  })
})
