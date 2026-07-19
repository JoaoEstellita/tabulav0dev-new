import { describe, it, expect } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import mapaAcentos from '../../../scripts/data/ptbrAccentMap.json'
import frasesProtegidas from '../../../scripts/data/ptbrAccentProtected.json'

/**
 * Trava o passe de reacentuação do corpus curado pt-BR.
 *
 * O escopo é definido pelo PRÓPRIO mapa que o script aplicou
 * (scripts/data/ptbrAccentMap.json), não por uma lista inventada aqui. É assim
 * que se evita falso positivo: palavras que legitimamente não levam acento —
 * "para", "de", "como", "ele", "ciclo", "casa" — nunca entraram no mapa, então
 * o teste nunca afirma nada sobre elas. O escopo do teste é, por construção,
 * idêntico ao que o script mudou.
 *
 * Deixados de fora do mapa DE PROPÓSITO (e portanto não cobertos aqui):
 * `e/é`, `a/à`, `as/às`, `esta/está`, `tem/têm`, `por/pôr`. As duas leituras
 * convivem e só o contexto resolve; um "à" errado é erro de português visível
 * num produto pago, pior do que a falta do acento. Não adicione essas ao mapa
 * sem tratar o contexto — todo "para" do corpus passaria a falhar.
 */
const ARQUIVOS = [
  'src/data/transitCatalogOverridesPtBR.ts',
  'src/data/chironInHouseOverridesPtBR.ts',
  'src/data/chironAspectOverridesPtBR.ts',
  'src/data/natalPlanetInHouseOverridesPtBR.ts',
]

const raiz = path.resolve(__dirname, '../../..')
const ler = (rel: string) => fs.readFileSync(path.join(raiz, rel), 'utf8')

/**
 * Só os VALORES.
 *
 * As CHAVES ('transit:jupiter|trigono|meio_do_ceu') e os comentários de
 * cabeçalho ("Planetas cobertos: sun, moon, venus…") trazem os nomes dos
 * planetas sem acento de propósito — são identificadores, não texto exibido.
 * Sem filtrar os dois, o teste acusaria 'venus' e 'jupiter' para sempre.
 */
function valoresDe(conteudo: string): string {
  return conteudo
    .split('\n')
    .filter((l) => !/^\s*\/\//.test(l)) // comentário de linha
    .join('\n')
    .replace(/'[a-z_]+:[^']*'/g, '') // a chave, esteja onde estiver
}

describe('acentuação do corpus curado pt-BR', () => {
  it('o mapa congelado existe e é substancial', () => {
    expect(Object.keys(mapaAcentos).length).toBeGreaterThan(500)
  })

  for (const rel of ARQUIVOS) {
    it(`${rel} — nenhuma palavra do mapa aparece sem acento`, () => {
      // Tira as frases protegidas antes de varrer: "esta era", "esta é" e
      // "esta posição" continuam sem acento DE PROPÓSITO (são pronome, não
      // verbo), então acusariam 'esta' como vazamento para sempre.
      let valores = valoresDe(ler(rel))
      for (const frase of frasesProtegidas as string[]) {
        valores = valores.split(frase).join(' ')
      }
      const vazando: string[] = []

      for (const plano of Object.keys(mapaAcentos)) {
        if (new RegExp(`\\b${plano}\\b`, 'i').test(valores)) vazando.push(plano)
      }

      expect(vazando).toEqual([])
    })

    it(`${rel} — densidade de diacrítico compatível com pt-BR`, () => {
      // Pega revert, merge ruim ou round-trip de encoding que tenha comido os
      // acentos: a contagem cai a zero e o teste quebra, mesmo que o texto
      // continue lá e o teste acima passe por coincidência.
      const texto = ler(rel)
      const acentuados = (texto.match(/[áàâãéêíóôõúüç]/gi) || []).length
      expect(acentuados / texto.length).toBeGreaterThan(0.008)
    })

    it(`${rel} — sem mojibake`, () => {
      const texto = ler(rel)
      expect(texto).not.toContain('�')
      expect(texto).not.toMatch(/[\u00C2\u00C3][\u0080-\u00BF]/)
      expect(texto).not.toContain('â€')
    })
  }

  it('a ênclise não recebe acento no pronome — só o verbo', () => {
    // Peguei "realizá-lá" conferindo o diff à mão, não por teste: o advérbio
    // "lá" existe em outro catálogo e o léxico propôs 'la' -> 'lá', que casaria
    // o pronome enclítico. Quem leva o acento é o verbo ("realizá-la").
    for (const rel of ARQUIVOS) {
      expect(ler(rel)).not.toMatch(/-l[áó]s?/)
    }
  })

  it('o typo que o script recusou foi corrigido à mão', () => {
    // 'estaavel' -> 'estável' viola o invariante deaccent(novo)===deaccent(antigo),
    // então o script se recusa a fazer — corretamente, porque é typo e não acento.
    expect(ler('src/data/chironAspectOverridesPtBR.ts')).not.toContain('estaavel')
  })

  it('"pratica" virou substantivo onde é substantivo', () => {
    // 21 das 22 ocorrências são "prática" (aplicação prática, na prática).
    // A única verbal ("espiritualidade também se pratica lavando a louça") mora
    // em lunarNodeHouseOverridesPtBR, que não é alvo deste passe — por isso não
    // corre risco. A proteção por frase no script cobre o caso se um dia mudar.
    const texto = ler('src/data/transitCatalogOverridesPtBR.ts')
    expect(texto).toContain('na prática')
    expect(texto).not.toMatch(/base pratica/)
  })
})
