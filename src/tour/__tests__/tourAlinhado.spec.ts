import { describe, it, expect } from 'vitest'
import { readFileSync, readdirSync } from 'fs'
import { resolve, join } from 'path'

/**
 * O tour não pode prometer o que a tela não tem — nem calar o que ela tem.
 *
 * Como ele desalinha: a tela muda, o passo continua lá. Nada quebra, nada
 * acusa — o holofote só cai num lugar que não existe mais, ou a parte nova
 * fica sem explicação. Dois casos reais já aconteceram:
 *
 *  - `home.transits` apontava para a grade quando ela estava escondida no modo
 *    leve: holofote em lugar nenhum.
 *  - "O seu dia" foi reconstruído inteiro (frases agrupadas por tempo, origem
 *    discreta, toque abrindo a leitura) e o tour passava direto dele — a parte
 *    que mais mudou era a única sem passo.
 *
 * ⚠️ Este teste é de FONTE: montar as telas aqui exige Firebase, navegação e o
 * motor astral. O que ele trava é a correspondência mecânica — âncora sem
 * passo, passo sem âncora — que é exatamente como os dois casos acima
 * passaram despercebidos.
 */

const TELAS = resolve(__dirname, '../../screens')

function arquivos(dir: string): string[] {
  const out: string[] = []
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name)
    if (e.isDirectory()) { if (e.name !== '__tests__') out.push(...arquivos(p)); continue }
    if (/\.tsx?$/.test(e.name)) out.push(p)
  }
  return out
}

const FONTES = arquivos(TELAS).map((p) => ({ p, s: readFileSync(p, 'utf8') }))

const ancoras = new Map<string, string>()
const passos = new Map<string, string>()
for (const { p, s } of FONTES) {
  for (const m of s.matchAll(/useTourAnchor\('([^']+)'\)/g)) ancoras.set(m[1], p)
  for (const m of s.matchAll(/\{\s*id:\s*'([a-z]+\.[a-zA-Z]+)'/g)) passos.set(m[1], p)
}

describe('tour — âncoras e passos', () => {
  it('toda âncora declarada tem um passo', () => {
    // Âncora sem passo é marcação morta: alguém preparou o holofote e o passo
    // nunca veio, ou o passo foi removido e a marcação ficou.
    const orfas = [...ancoras.keys()].filter((a) => !passos.has(a))
    expect(orfas, `âncoras sem passo:\n${orfas.map((a) => `  ${a} (${ancoras.get(a)})`).join('\n')}`).toEqual([])
  })

  it('todo passo tem uma âncora', () => {
    // Passo sem âncora é holofote em lugar nenhum: o texto aparece e nada é
    // destacado, então a pessoa lê sobre algo que não consegue achar.
    const soltos = [...passos.keys()].filter((p) => !ancoras.has(p))
    expect(soltos, `passos sem âncora:\n${soltos.map((p) => `  ${p} (${passos.get(p)})`).join('\n')}`).toEqual([])
  })

  it('a Home explica "O seu dia", que é o primeiro card da tela', () => {
    // É a parte que mais mudou e a que responde sozinha à pergunta de quem
    // abre o app de manhã. Ficou sem passo nenhum por duas sessões.
    expect(passos.has('home.today'), 'o card principal da Home precisa de passo').toBe(true)
    expect(ancoras.has('home.today')).toBe(true)
  })

  it('o passo do "seu dia" ensina o toque, que é o caminho para o catálogo', () => {
    const home = FONTES.find(({ p }) => p.endsWith('HomeScreen.tsx'))!.s
    const i = home.indexOf("{ id: 'home.today'")
    const bloco = home.slice(i, home.indexOf("{ id: 'home.", i + 10))
    expect(bloco, 'sem isso ninguém descobre que a frase abre leitura').toMatch(/Toque em qualquer frase/)
  })
})
