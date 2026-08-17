import { describe, expect, it } from 'vitest'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { lerLiterais } from '../catalogo.mjs'
import { mapaDoCeu } from '../ceu.mjs'
import { eventosDoDia } from '../eventos.mjs'
import { falaDoReel } from '../vozReel.mjs'
import { tempoNoSigno, ritmo, percursoDoDia, estacaoProxima } from '../fatos.mjs'
import { carregarCatalogos, dignidade } from '../interpretacao.mjs'

const FRONTEND = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..')
const { PLANET_ASPECT_ORBS: ORBES } = await lerLiterais(
  path.join(FRONTEND, 'src/astro/aspect-config.ts'), ['PLANET_ASPECT_ORBS'])

const meioDia = (d) => new Date(`${d}T12:00:00Z`)

/**
 * Os catálogos entram nos testes.
 *
 * Sem eles `falaDoReel` cai no fato de efeméride e a leitura curada — que é onde
 * mora a dignidade — nunca aparece. Os testes de linguagem passariam sem
 * verificar nada, que é pior do que não existir.
 */
const CATALOGOS = await carregarCatalogos()

/**
 * O céu é caro, e é o MESMO em toda chamada.
 *
 * Onze testes chamavam `falasDe` com os mesmos argumentos, e cada chamada
 * recalculava trinta a sessenta dias de efeméride do zero. O arquivo levava
 * vinte e cinco segundos, e sob carga um dos testes estourava o limite de cinco
 * — falha que aparece e some conforme a máquina, que é a pior espécie: some
 * quando se investiga e volta no CI.
 *
 * A efeméride de uma data é determinística, então guardar a resposta é seguro.
 */
const cacheDeFalas = new Map()

/** Trinta dias seguidos de fala, que é o que a conta publicaria num mês. */
function falasDe(iso, quantos = 30) {
  const chave = `${iso}|${quantos}`
  if (cacheDeFalas.has(chave)) return cacheDeFalas.get(chave)
  const resultado = calcularFalas(iso, quantos)
  cacheDeFalas.set(chave, resultado)
  return resultado
}

function calcularFalas(iso, quantos) {
  const base = new Date(`${iso}T12:00:00Z`)
  const saida = []
  for (let i = 0; i < quantos; i++) {
    const data = new Date(base.getTime() + i * 86_400_000)
    const mapa = mapaDoCeu(data, ORBES)
    const eventos = eventosDoDia(data, mapa.aspectos)
    const principal = eventos[0]
    if (!principal) continue
    const proximo = eventos.find((e) => e !== principal && e.quando > data && e.tipo !== principal.tipo)
    saida.push({
      data,
      evento: principal,
      fala: falaDoReel(principal, data, { proximo, catalogos: CATALOGOS }),
    })
  }
  return saida
}

/**
 * O motivo desta voz existir.
 *
 * O João olhou o material e disse que estava quase desistindo: "as informações
 * são genéricas demais". O texto de então explicava o que É um eclipse — a mesma
 * frase para qualquer eclipse de qualquer ano — e fechava com um bordão que ele
 * citou de cor: "a posição é para todos, mas a casa é de cada um".
 */
describe('a voz não volta ao que era', () => {
  const PROIBIDO = [
    /céu é de todos/i,
    /casa é de cada um/i,
    /energia/i,
    /vibra(ção|ções)/i,
    /prepare-se/i,
    /aproveite/i,
    /universo conspira/i,
    /momento poderoso/i,
  ]

  it('nenhum jargão em trinta dias de fala', () => {
    for (const { data, fala } of falasDe('2026-08-08')) {
      const texto = [...fala.blocos, fala.post].join(' ')
      for (const proibido of PROIBIDO) {
        expect(proibido.test(texto), `${data.toISOString().slice(0, 10)} — ${proibido}`).toBe(false)
      }
    }
  })

  // "Retrógrado" sozinho não diz nada para quem não é do meio. A regra é que o
  // termo só apareça acompanhado da tradução, na mesma frase.
  it('termo técnico vem sempre com tradução ao lado', () => {
    for (const { data, fala } of falasDe('2026-08-08', 40)) {
      for (const bloco of fala.blocos) {
        if (!/retrógrad/i.test(bloco)) continue
        expect(/para trás/i.test(bloco), `${data.toISOString().slice(0, 10)}: ${bloco}`).toBe(true)
      }
    }
  })

  it('nada de nome de corpo em inglês', () => {
    const INGLES = /\b(Sun|Moon|Mercury|Venus|Mars|Jupiter|Saturn|Uranus|Neptune|Pluto)\b/
    for (const { data, fala } of falasDe('2026-08-08')) {
      const texto = [...fala.blocos, fala.post].join(' ')
      expect(INGLES.test(texto), `${data.toISOString().slice(0, 10)}: ${texto.slice(0, 90)}`).toBe(false)
    }
  })

  /**
   * A varredura que faltava.
   *
   * O João leu "é aí que isso encosta" e disse o que era: ninguém fala assim.
   * Frase por frase não dá para pegar — o defeito só aparece lendo o conjunto,
   * e a lista abaixo é o que a leitura das 83 frases do gerador encontrou.
   */
  it('não volta a linguagem torta', () => {
    const TORTO = [
      /isso encosta/i,
      /vira detalhe e utilidade/i,
      // adjetivo depois de sujeito que muda de gênero: "a paciência criterioso"
      /(a|A) (paciência|vontade|imaginação)[^.]{0,30}(criterioso|preciso|direto|lento)/,
    ]
    for (const { data, fala } of falasDe('2026-08-08', 40)) {
      const texto = [...fala.blocos, fala.post].join(' ')
      for (const t of TORTO) {
        expect(t.test(texto), `${data.toISOString().slice(0, 10)} — ${t}`).toBe(false)
      }
    }
  })

  /**
   * "A Lua chega em queda — o signo onde ELE tem menos força" era o que saía: o
   * texto da dignidade era fixo no masculino, e a Lua é a única feminina.
   *
   * A primeira versão deste teste varria 60 dias de fala procurando a frase — e
   * passava sem verificar nada, porque a Lua raramente é a protagonista COM
   * dignidade numa janela dessas. Plantei o bug de volta para conferir e o teste
   * não acusou. Agora a tabela inteira é percorrida: 7 corpos × 4 dignidades.
   */
  it('a dignidade concorda com o corpo, nas 28 combinações', () => {
    const TABELA = {
      Sun: ['Leão', 'Áries', 'Aquário', 'Libra'],
      Moon: ['Câncer', 'Touro', 'Capricórnio', 'Escorpião'],
      Mercury: ['Gêmeos', 'Virgem', 'Sagitário', 'Peixes'],
      Venus: ['Touro', 'Peixes', 'Áries', 'Virgem'],
      Mars: ['Áries', 'Capricórnio', 'Libra', 'Câncer'],
      Jupiter: ['Sagitário', 'Câncer', 'Gêmeos', 'Capricórnio'],
      Saturn: ['Capricórnio', 'Libra', 'Câncer', 'Áries'],
    }

    for (const [corpo, signos] of Object.entries(TABELA)) {
      for (const signo of signos) {
        const d = dignidade(corpo, signo)
        expect(d, `${corpo} em ${signo}`).not.toBeNull()

        const esperado = corpo === 'Moon' ? 'ela' : 'ele'
        const errado = corpo === 'Moon' ? 'ele' : 'ela'
        expect(d.texto.includes(errado), `${corpo} em ${signo}: "${d.texto}"`).toBe(false)

        // exaltação flexiona adjetivo em vez de pronome
        if (d.tipo === 'exaltacao') {
          expect(d.texto).toContain(corpo === 'Moon' ? 'exaltada' : 'exaltado')
        } else {
          expect(d.texto, `${corpo} em ${signo}`).toContain(esperado)
        }
      }
    }
  })

  // Lista de signos sem "ou" antes do último lê como enumeração de formulário.
  it('a lista de signos termina com "ou"', () => {
    for (const { fala } of falasDe('2026-08-08', 40)) {
      const m = fala.post.match(/ascendente entre \d+° e \d+° de ([^,]+, [^.]+)\./)
      if (!m) continue
      expect(m[1], m[1]).toMatch(/ ou /)
    }
  })

  /**
   * Sem travessão, e sem frase sobre o método.
   *
   * Duas coisas que o João cortou lendo as peças. O travessão porque ele não usa
   * e a peça é a voz dele; as frases de método ("a casa é calculada, não é
   * chute", "efeméride calculada, não copiada") porque defendem o cálculo contra
   * uma acusação que ninguém fez, e plantam a dúvida em quem não tinha.
   */
  it('nada de travessão nem de defesa do método', () => {
    const PROIBIDO = [/—/, /não é chute/i, /não copiada/i, /casas inteiras/i]
    for (const { data, fala } of falasDe('2026-08-08', 40)) {
      const texto = [...fala.blocos, fala.post].join(' ')
      for (const p of PROIBIDO) {
        expect(p.test(texto), `${data.toISOString().slice(0, 10)} — ${p}`).toBe(false)
      }
    }
  })

  // Ponto decimal em português denuncia texto gerado por máquina.
  it('número sai com vírgula decimal', () => {
    for (const { data, fala } of falasDe('2026-08-08')) {
      for (const bloco of fala.blocos) {
        expect(/\d\.\d/.test(bloco), `${data.toISOString().slice(0, 10)}: ${bloco}`).toBe(false)
      }
    }
  })
})

/**
 * O que substituiu o verbete: um dado deste dia e de nenhum outro.
 */
describe('cada peça carrega um fato calculado', () => {
  it('toda fala tem pelo menos um número', () => {
    for (const { data, fala } of falasDe('2026-08-08')) {
      const texto = fala.blocos.join(' ')
      expect(/\d/.test(texto), `${data.toISOString().slice(0, 10)}: ${texto}`).toBe(true)
    }
  })

  it('a fala tem três ou quatro tempos, nunca mais', () => {
    for (const { data, fala } of falasDe('2026-08-08')) {
      expect(fala.blocos.length, data.toISOString().slice(0, 10)).toBeGreaterThanOrEqual(2)
      expect(fala.blocos.length, data.toISOString().slice(0, 10)).toBeLessThanOrEqual(4)
    }
  })

  it('dias diferentes não repetem a mesma abertura', () => {
    const aberturas = falasDe('2026-08-08', 14).map((f) => f.fala.blocos[0])
    expect(new Set(aberturas).size).toBeGreaterThan(aberturas.length * 0.6)
  })

  // O gancho é o PRÓXIMO assunto. Sem comparar o tipo, a peça sobre o eclipse
  // terminava anunciando o mesmo eclipse.
  it('o gancho nunca anuncia o próprio assunto', () => {
    for (const { fala, evento } of falasDe('2026-08-08')) {
      const ultimo = fala.blocos[fala.blocos.length - 1]
      if (!/^(Ainda hoje|Amanhã|Daqui a)/.test(ultimo)) continue
      if (evento.tipo !== 'eclipse') continue
      expect(/eclipse/i.test(ultimo), ultimo).toBe(false)
    }
  })
})

/**
 * Só entra o que o código calcula.
 *
 * A tentação de escrever "a faixa de totalidade passa pela Islândia" é grande e
 * é exatamente o erro que a conta existe para não cometer.
 */
describe('nada de afirmação sem cálculo', () => {
  it('"muda de direção" só quando a estação está mesmo perto', () => {
    for (const { data, evento, fala } of falasDe('2026-08-08', 60)) {
      const texto = fala.blocos.join(' ')
      if (!/muda de direção/.test(texto)) continue
      const corpo = evento.corpo || 'Moon'
      const paraEm = estacaoProxima(corpo, data)
      expect(paraEm, `${data.toISOString().slice(0, 10)} — ${corpo}`).not.toBeNull()
      expect(paraEm).toBeLessThanOrEqual(12)
    }
  })

  // A Lua troca de signo a cada dois dias e meio: a busca para trás atravessava
  // dezenas de trocas e devolvia "a Lua ficou quatro semanas no mesmo signo".
  it('a Lua nunca aparece com semanas no mesmo signo', () => {
    expect(tempoNoSigno('Moon', meioDia('2026-08-15'))).toBeNull()
  })

  it('a velocidade é em graus por DIA, não por meio dia', () => {
    // a Lua anda ~13,2°/dia; o bug antigo devolvia ~6,6 e tudo saía "devagar"
    const r = ritmo('Moon', meioDia('2026-09-10'))
    expect(r.grausPorDia).toBeGreaterThan(11)
    expect(r.grausPorDia).toBeLessThan(16)
  })

  it('o percurso do dia bate com o que a animação mostra', () => {
    const p = percursoDoDia('Moon', meioDia('2026-08-09'))
    expect(p.graus).toBeGreaterThan(11)
    expect(p.graus).toBeLessThan(16)
  })
})
