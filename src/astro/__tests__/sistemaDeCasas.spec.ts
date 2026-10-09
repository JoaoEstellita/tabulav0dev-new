import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { DEFAULT_HOUSE_SYSTEM, normalizeHouseSystem } from '../houseSystem'

/**
 * O sistema de casas não pode ser escolhido por acidente.
 *
 * Bug real, relatado olhando a tela: "marquei Placidus mas a roda mostra Casas
 * Inteiras". Estava certo — em quatro pontos o código forçava 'whole-sign':
 *
 *   - `computeNatalAsc(..., system = 'whole-sign')`
 *   - `computeAndPersist(..., system = 'whole-sign')`
 *   - o onboarding passava 'whole-sign' na mão
 *   - Configurações lia `globalThis.__userHouseSystem || 'whole-sign'`
 *
 * …enquanto `DEFAULT_HOUSE_SYSTEM` é 'placidus' e o comentário do módulo diz,
 * com todas as letras, que Placidus é o padrão porque é o que os outros
 * softwares usam. O código contradizia a própria documentação.
 *
 * Não é detalhe de exibição: a casa muda a leitura de CADA planeta. Um Sol na
 * Casa 2 em Placidus pode cair na 3 em Casas Inteiras, e a interpretação
 * inteira muda junto — sem nada acusar, porque os dois resultados são
 * plausíveis e nenhum dá erro.
 */

const raiz = join(__dirname, '..', '..')
const ler = (...p: string[]) => readFileSync(join(raiz, ...p), 'utf-8')

const NATAL_ASC = ler('services', 'astrology', 'NatalAscService.ts')
const ONBOARDING = ler('screens', 'onboarding', 'BirthDataFormContainer.tsx')
const SETTINGS = ler('screens', 'settings', 'SettingsScreen.tsx')

describe('o padrão é Placidus, e vale em todo lugar', () => {
  it('DEFAULT_HOUSE_SYSTEM é placidus', () => {
    // É o sistema que a maioria dos softwares e sites usa — é o número que a
    // pessoa espera ao comparar o mapa com outra fonte.
    expect(DEFAULT_HOUSE_SYSTEM).toBe('placidus')
  })

  it('quem calcula as cúspides não hardcoda o sistema', () => {
    expect(
      NATAL_ASC,
      "default 'whole-sign' aqui grava as cúspides no sistema errado para todo mundo",
    ).not.toMatch(/system: HouseSystem = 'whole-sign'/)
    expect(NATAL_ASC).toMatch(/system: HouseSystem = DEFAULT_HOUSE_SYSTEM/)
  })

  it('o onboarding usa o padrão, não um literal', () => {
    // Era aqui que o estrago acontecia para TODO usuário novo: a conta nascia
    // com as cúspides em Casas Inteiras antes de qualquer preferência existir.
    // Procura o literal como ARGUMENTO, não no comentário que explica o bug.
    const codigo = ONBOARDING.split('\n').filter((l) => !l.trim().startsWith('//')).join('\n')
    expect(codigo, 'onboarding não pode escolher o sistema na mão').not.toContain("'whole-sign'")
    expect(codigo).toContain('DEFAULT_HOUSE_SYSTEM')
  })

  it('o recálculo usa a preferência REAL do usuário', () => {
    // Lia `globalThis.__userHouseSystem || 'whole-sign'`: quando o globalThis
    // não estava setado — e ninguém garantia que estivesse — recalculava tudo
    // em Casas Inteiras, justamente na tela onde a pessoa acabou de escolher.
    expect(SETTINGS).not.toMatch(/__userHouseSystem/)

    const chamada = SETTINGS.slice(
      SETTINGS.indexOf('NatalAscService.computeAndPersist('),
      SETTINGS.indexOf('clearCache'),
    )
    expect(chamada, 'o recálculo tem de usar o estado vindo de userSettings')
      .toMatch(/\n\s+houseSystem\n/)
    expect(
      chamada.split('\n').filter((l) => !l.trim().startsWith('//')).join('\n'),
      'e nunca um literal',
    ).not.toContain("'whole-sign'")
  })
})

describe('normalização aceita o que chega do mundo real', () => {
  it('reconhece as grafias de Casas Inteiras', () => {
    for (const v of ['whole-sign', 'whole', 'equal', 'casas inteiras', 'Whole Sign Houses']) {
      expect(normalizeHouseSystem(v), `"${v}"`).toBe('whole-sign')
    }
  })

  it('valor vazio, desconhecido ou legado cai no padrão', () => {
    // "psychological-shift" foi removido: não era sistema de casas, deslocava
    // todos os planetas uma casa à frente.
    for (const v of [null, undefined, '', 'psychological-shift', 'qualquer coisa']) {
      expect(normalizeHouseSystem(v)).toBe(DEFAULT_HOUSE_SYSTEM)
    }
  })

  it('placidus continua placidus', () => {
    expect(normalizeHouseSystem('placidus')).toBe('placidus')
    expect(normalizeHouseSystem('PLACIDUS')).toBe('placidus')
  })
})
