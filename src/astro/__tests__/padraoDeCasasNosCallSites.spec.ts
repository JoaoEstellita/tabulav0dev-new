import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import { normalizeHouseSystem, DEFAULT_HOUSE_SYSTEM } from '../houseSystem'

/**
 * O padrão do app é Placidus — e os call sites não podem contradizer isso.
 *
 * `normalizeHouseSystem(undefined)` já devolve `DEFAULT_HOUSE_SYSTEM`
 * ('placidus'). Mesmo assim, treze pontos do motor escreviam:
 *
 *     normalizeHouseSystem((globalThis as any).__userHouseSystem || 'whole-sign')
 *
 * …que ANULA o padrão do módulo: quando o `globalThis` não estava setado — e ele
 * é preenchido de forma assíncrona, então na primeira carga costuma não estar —
 * o cálculo saía em Casas Inteiras. Um deles era o `system` enviado ao backend
 * em `fetchBackendBundle`: o servidor recebia 'whole-sign' e devolvia cúspides
 * em Casas Inteiras, com a preferência do usuário marcada em Placidus.
 *
 * Esse é o relato "marquei Placidus mas a roda mostra Casas Inteiras". A
 * primeira correção pegou quatro pontos (onboarding, Configurações e os dois
 * defaults de `NatalAscService`) e deixou treze vivos no caminho de cálculo em
 * runtime — que é o pior lugar para deixar, porque roda em toda carga.
 *
 * ⚠️ Regra que isto trava: quem tem um padrão declarado não repete o padrão no
 * call site. Repetir é como ele se perde, e perde em silêncio: os dois sistemas
 * produzem resultados plausíveis e nenhum dá erro.
 */

const ARQUIVOS = [
  'AstrologyCacheService.ts',
  'LocalAstrologyService.ts',
  'RealAstrologyEngine.ts',
]

describe('sistema de casas — padrão nos call sites', () => {
  it('o módulo já cai em Placidus sem valor', () => {
    expect(normalizeHouseSystem(undefined)).toBe(DEFAULT_HOUSE_SYSTEM)
    expect(normalizeHouseSystem(null)).toBe('placidus')
    expect(normalizeHouseSystem('')).toBe('placidus')
  })

  for (const arquivo of ARQUIVOS) {
    it(`${arquivo} não sobrescreve o padrão com 'whole-sign'`, () => {
      const fonte = readFileSync(
        resolve(__dirname, '../../services/astrology/', arquivo),
        'utf8',
      )
      const infratores = fonte
        .split('\n')
        .map((linha, i) => [i + 1, linha] as const)
        .filter(([, linha]) => /__userHouseSystem\s*\|\|\s*'whole-sign'/.test(linha))

      expect(
        infratores,
        `o padrão do módulo é ${DEFAULT_HOUSE_SYSTEM}; estas linhas o anulam:\n` +
          infratores.map(([n, l]) => `  ${arquivo}:${n} ${l.trim()}`).join('\n'),
      ).toEqual([])
    })
  }

  it('a guarda da autocorreção continua sendo a exceção documentada', () => {
    // Único 'whole-sign' legítimo: ali o valor significa "sistema desconhecido,
    // não mexa", porque a autocorreção de cúspides só vale para Placidus.
    // Trocá-lo pelo padrão inverteria a guarda — por isso fica, com o porquê
    // escrito ao lado.
    const fonte = readFileSync(
      resolve(__dirname, '../../services/astrology/RealAstrologyEngine.ts'),
      'utf8',
    )
    expect(
      /NAO e o mesmo caso dos outros call sites/.test(fonte),
      'a exceção precisa continuar explicada, senão alguém a "corrige" junto',
    ).toBe(true)
  })
})
