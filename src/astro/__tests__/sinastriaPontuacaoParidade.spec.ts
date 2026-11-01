import { describe, it, expect } from 'vitest'
import { createRequire } from 'node:module'
import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { pontuarContatos, synastryScore } from '../synastryReading'
import { vinculoPorArea, AREAS_SINASTRIA } from '../sinastriaPorArea'

/**
 * O MARCADOR DA SINASTRIA — e a paridade dos gêmeos.
 *
 * ⚠️ ESTE NÚMERO APARECE EM QUATRO LUGARES: o % da dupla nos Grupos, cada área
 * da Combinação, o % de afinidade da Rede (Match) e a leitura que o agente
 * recebe. Até esta correção eram TRÊS CÓPIAS da mesma fórmula em arquivos
 * diferentes — frontend `synastryReading.ts`, frontend `sinastriaPorArea.ts` e
 * backend `discovery/match.js` — mais uma quarta em `sinastria-combinada.js`.
 * Gêmeo sem teste de paridade é a causa recorrente de divergência silenciosa
 * neste projeto, e aqui a divergência seria invisível: dois números plausíveis
 * para o mesmo par, em telas diferentes.
 *
 * ⚠️ O QUE ESTE TESTE GUARDA, em ordem de importância:
 *   1. app e backend devolvem o MESMO inteiro para o mesmo contato;
 *   2. a escala NÃO SATURA — foi o bug que originou tudo isto;
 *   3. nenhum dos arquivos volta a ter fórmula própria.
 */

const require_ = createRequire(import.meta.url)
const RAIZ = join(__dirname, '..', '..', '..', '..', 'backend')
const CAMINHO_BACK = join(RAIZ, 'lib', 'astro', 'sinastria-pontuacao.js')

type Contato = { mine: string; theirs: string; aspect: string; tone?: string; orb: number }

/** Gerador determinístico — o mesmo par tem de sair igual em toda execução. */
function pares(quantos: number): Contato[][] {
  const PL = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto']
  const ANG: Record<string, number> = { conjuncao: 0, sextil: 60, quadratura: 90, trigono: 120, oposicao: 180 }
  const TOM: Record<string, string> = {
    conjuncao: 'neutro', sextil: 'harmonioso', quadratura: 'tenso',
    trigono: 'harmonioso', oposicao: 'tenso',
  }
  const saida: Contato[][] = []
  for (let n = 1; n <= quantos; n++) {
    let s = n * 7919
    const r = () => { s = (s * 1103515245 + 12345) % 2147483648; return s / 2147483648 }
    const A: Record<string, number> = {}; const B: Record<string, number> = {}
    for (const p of PL) { A[p] = r() * 360; B[p] = r() * 360 }
    const lista: Contato[] = []
    for (const m of PL) {
      for (const t of PL) {
        let d = Math.abs(A[m] - B[t]) % 360
        if (d > 180) d = 360 - d
        for (const [nome, ang] of Object.entries(ANG)) {
          const orb = Math.abs(d - ang)
          if (orb <= 6) { lista.push({ mine: m, theirs: t, aspect: nome, tone: TOM[nome], orb }); break }
        }
      }
    }
    saida.push(lista)
  }
  return saida
}

describe('marcador da sinastria', () => {
  /**
   * ⚠️ O BUG QUE ORIGINOU ISTO. A fórmula antiga era `50 + soma × 5` sobre
   * TODOS os aspectos. Medido em 600 pares: p50=74, p75 E p90 ambos em 95, 28%
   * nas pontas, 66% dos pares lendo "harmônica". Um índice de compatibilidade
   * que diz "harmônica" para dois terços das pessoas não distingue nada —
   * depois do décimo contato bom todo par recebia o mesmo 95.
   */
  it('não satura: mais contatos do mesmo tom não empurram pro teto', () => {
    const trigono = (orb = 0) => ({ mine: 'venus', theirs: 'mars', aspect: 'trigono', tone: 'harmonioso', orb })
    const dez = pontuarContatos(Array.from({ length: 10 }, () => trigono())).pct
    const trinta = pontuarContatos(Array.from({ length: 30 }, () => trigono())).pct
    const cem = pontuarContatos(Array.from({ length: 100 }, () => trigono())).pct

    expect(trinta, `30 trígonos exatos saturaram em ${trinta}`).toBeLessThan(95)
    // ⚠️ É A NORMALIZAÇÃO QUE IMPEDE O TETO DE VOLTAR: o balanço é
    // (apoio − tensão)/total, então triplicar contatos do mesmo tom não muda o
    // veredito. Se este assert cair, a soma crua voltou a ser a fonte do número.
    expect(Math.abs(cem - dez), 'de 10 para 100 contatos iguais o índice se mexeu')
      .toBeLessThanOrEqual(1)
  })

  it('a amplitude separa "mal se tocam" de "se tocam muito"', () => {
    const um = pontuarContatos([{ mine: 'venus', theirs: 'mars', aspect: 'trigono', tone: 'harmonioso', orb: 5.5 }]).pct
    const muitos = pontuarContatos(Array.from({ length: 8 },
      () => ({ mine: 'venus', theirs: 'mars', aspect: 'trigono', tone: 'harmonioso', orb: 0 }))).pct
    // Pouco contato tem de ficar PERTO DE 50 — não porque a relação seja
    // morna, mas porque há pouco a dizer.
    expect(Math.abs(um - 50), `um contato largo deu ${um}`).toBeLessThan(12)
    expect(muitos, 'muito contato harmônico tem de ler claramente alto').toBeGreaterThan(65)
  })

  /**
   * ⚠️ A CONJUNÇÃO PEGA O SINAL DE QUEM SE FUNDE. Antes era um `+0,6` fixo:
   * Lua–Vênus e Saturno–Lua entravam na conta com o mesmo sinal positivo, e
   * como a conjunção é o aspecto mais frequente que existe, isso era um viés
   * constante a favor em todo par.
   */
  it('conjunção com planeta pesado não conta como apoio', () => {
    const leve = pontuarContatos([
      { mine: 'venus', theirs: 'moon', aspect: 'conjuncao', tone: 'neutro', orb: 0 },
      { mine: 'venus', theirs: 'moon', aspect: 'conjuncao', tone: 'neutro', orb: 0 },
    ]).pct
    const pesada = pontuarContatos([
      { mine: 'saturn', theirs: 'moon', aspect: 'conjuncao', tone: 'neutro', orb: 0 },
      { mine: 'saturn', theirs: 'moon', aspect: 'conjuncao', tone: 'neutro', orb: 0 },
    ]).pct
    expect(leve, 'conjunção Lua–Vênus deveria apoiar').toBeGreaterThan(50)
    expect(pesada, 'conjunção Lua–Saturno deveria pesar').toBeLessThan(50)
  })

  it('sem contato não inventa veredito', () => {
    expect(pontuarContatos([]).pct).toBe(50)
    expect(synastryScore([]).pct).toBe(50)
    expect(synastryScore(null).bandKey).toBe('neutra')
  })

  /**
   * ⚠️ `Number(null)` É 0, E 0 PASSA EM `isFinite` — a armadilha que já mordeu
   * este projeto quatro vezes. Aqui ela entraria como orbe 0, ou seja o
   * contato MAIS forte possível, a partir de um dado ausente.
   */
  it('contato sujo não vira contato forte', () => {
    const sujo = pontuarContatos([
      { mine: '', theirs: '', aspect: '', orb: NaN } as never,
      { mine: 'venus', theirs: 'mars', aspect: 'trigono', tone: 'harmonioso', orb: 1 },
    ])
    expect(Number.isFinite(sujo.pct), 'pct não finito com contato sujo').toBe(true)
    expect(sujo.pct).toBeGreaterThanOrEqual(2)
    expect(sujo.pct).toBeLessThanOrEqual(98)
  })

  /**
   * ⚠️ A ESCALA DAS ÁREAS É A MESMA DA DUPLA. É isso que faz "Afeto 63" e "a
   * dupla 69" serem lidos na mesma tela sem mentira. Se divergirem, a tela
   * convida a uma comparação que não significa nada.
   */
  it('as áreas usam o mesmo marcador da dupla', () => {
    for (const lista of pares(40)) {
      const porArea = vinculoPorArea(lista as never)
      if (!porArea) continue
      for (const area of AREAS_SINASTRIA) {
        const v = porArea[area]
        if (!v) continue
        expect(v.pct, `${area}: fora da escala do marcador`).toBeGreaterThanOrEqual(2)
        expect(v.pct, `${area}: fora da escala do marcador`).toBeLessThanOrEqual(98)
      }
    }
  })

  /** A distribuição medida — se o teto voltar, este assert cai primeiro. */
  it('a distribuição em 600 pares fica longe das pontas', () => {
    const v = pares(600).map((l) => pontuarContatos(l).pct).sort((a, b) => a - b)
    const q = (p: number) => v[Math.floor((v.length - 1) * p)]
    const nasPontas = v.filter((x) => x <= 6 || x >= 94).length / v.length
    expect(nasPontas, `${Math.round(nasPontas * 100)}% dos pares nas pontas`).toBeLessThan(0.02)
    expect(q(0.5), `mediana ${q(0.5)} fora do esperado`).toBeGreaterThan(45)
    expect(q(0.5), `mediana ${q(0.5)} fora do esperado`).toBeLessThan(62)
    // ⚠️ E TEM DE HAVER ESPALHAMENTO. Uma escala que não satura mas colapsa
    // tudo em 50 também não distingue nada.
    expect(q(0.9) - q(0.1), 'a escala colapsou — p90 e p10 quase iguais').toBeGreaterThan(20)
  })
})

describe('paridade com o backend', () => {
  it('o backend existe e exporta o marcador', () => {
    expect(existsSync(CAMINHO_BACK), `backend ausente em ${CAMINHO_BACK}`).toBe(true)
  })

  /**
   * ⚠️ PARIDADE AO VIVO, não contra fixture congelada: o módulo do backend é
   * CommonJS puro e sem dependência, então o teste chama O CÓDIGO REAL. Uma
   * fixture só pega divergência na hora de regerá-la; isto pega na hora.
   */
  it('app e backend devolvem o MESMO inteiro, par por par', () => {
    if (!existsSync(CAMINHO_BACK)) return
    const back = require_(CAMINHO_BACK)
    const divergencias: string[] = []
    pares(300).forEach((lista, i) => {
      const a = pontuarContatos(lista).pct
      const b = back.pontuarContatos(lista).pct
      if (a !== b) divergencias.push(`par ${i}: app ${a} ≠ backend ${b} (${lista.length} contatos)`)
    })
    expect(divergencias.slice(0, 8), 'o marcador divergiu entre app e backend').toEqual([])
  })

  /** O tom resolvido pelo nome do aspecto também tem de bater. */
  it('batem também quando o tom vem só do nome do aspecto', () => {
    if (!existsSync(CAMINHO_BACK)) return
    const back = require_(CAMINHO_BACK)
    const divergencias: string[] = []
    pares(120).forEach((lista, i) => {
      // ⚠️ SEM `tone`: é a forma que o Match manda (só `labelPt`/`type`). Era
      // aqui que as duas cópias se separavam — uma classificava pelo nome do
      // aspecto, a outra caía no ramo neutro.
      const cru = lista.map(({ tone, ...resto }) => resto)
      const a = pontuarContatos(cru as never).pct
      const b = back.pontuarContatos(cru).pct
      if (a !== b) divergencias.push(`par ${i}: app ${a} ≠ backend ${b}`)
    })
    expect(divergencias.slice(0, 8), 'o tom pelo nome do aspecto divergiu').toEqual([])
  })

  it('as constantes da curva são as mesmas', () => {
    if (!existsSync(CAMINHO_BACK)) return
    const back = require_(CAMINHO_BACK)
    const fonteApp = readFileSync(join(__dirname, '..', 'synastryReading.ts'), 'utf8')
    const bloco = fonteApp.match(/const CALC = \{([^}]+)\}/)
    expect(bloco, 'CALC sumiu do app').not.toBeNull()
    const doApp: Record<string, number> = {}
    for (const m of bloco![1].matchAll(/(\w+):\s*([\d.e-]+)/g)) doApp[m[1]] = Number(m[2])
    expect(doApp, 'a curva do marcador divergiu entre app e backend').toEqual({ ...back.CALC })
    expect([...back.CONJUNCAO_PESADA].sort(), 'a lista de planetas pesados divergiu')
      .toEqual(['mars', 'neptune', 'pluto', 'saturn', 'uranus'])
  })

  /**
   * ⚠️ O QUE NÃO PODE VOLTAR: fórmula própria em qualquer um dos arquivos. Era
   * exatamente assim que a divergência nascia — alguém ajustava uma cópia.
   *
   * ⚠️ O grep TIRA OS COMENTÁRIOS antes de procurar: já aconteceu duas vezes
   * neste projeto um teste acusar o comentário que documenta a proibição.
   */
  it('nenhum arquivo volta a ter curva própria', () => {
    const semComentario = (txt: string) => txt
      .split('\n')
      .filter((l) => !/^\s*(\/\/|\*|\/\*)/.test(l))
      .join('\n')

    const alvos: Array<[string, string]> = [
      ['app/sinastriaPorArea', join(__dirname, '..', 'sinastriaPorArea.ts')],
      ['backend/match', join(RAIZ, 'lib', 'discovery', 'match.js')],
      ['backend/sinastria-combinada', join(RAIZ, 'lib', 'status', 'sinastria-combinada.js')],
    ]
    for (const [nome, caminho] of alvos) {
      if (!existsSync(caminho)) continue
      const fonte = semComentario(readFileSync(caminho, 'utf8'))
      expect(fonte, `${nome}: voltou a somar×5 por conta própria`).not.toMatch(/soma\s*\*\s*5|sum\s*\*\s*5/)
      expect(fonte, `${nome}: voltou a ter a tabela de peso do tom`).not.toMatch(/PESO_DO_TOM\s*=|TONE_BASE\s*=/)
      expect(fonte, `${nome}: deveria chamar o marcador único`).toMatch(/pontuarContatos/)
    }
  })
})
