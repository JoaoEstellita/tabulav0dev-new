/**
 * Aspectos entre planetas no céu de uma data — sem mapa natal envolvido.
 *
 * O card diário é conteúdo público: quem vê não tem mapa cadastrado, então o
 * card fala do CÉU, não do mapa de ninguém. O texto vem do mesmo catálogo do
 * app (`transit:{agente}|{aspecto}|{alvo}`), que descreve o encontro entre os
 * dois corpos — o que continua verdadeiro no céu. O que muda no mapa de cada
 * um é a CASA onde isso cai, e é exatamente essa a isca para o app.
 *
 * Convenção astrológica: o corpo mais lento é o agente do encontro, o mais
 * rápido é o alvo — mesma ordem das chaves do catálogo.
 */
import { Body, GeoVector, Ecliptic } from 'astronomy-engine'

/** Do mais rápido ao mais lento. A ordem define quem é agente e quem é alvo. */
const POR_VELOCIDADE = [
  'Moon', 'Mercury', 'Venus', 'Sun', 'Mars',
  'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto',
]

const CORPOS = {
  Sun: Body.Sun, Moon: Body.Moon, Mercury: Body.Mercury, Venus: Body.Venus,
  Mars: Body.Mars, Jupiter: Body.Jupiter, Saturn: Body.Saturn,
  Uranus: Body.Uranus, Neptune: Body.Neptune, Pluto: Body.Pluto,
}

/** Aspectos maiores. `chave` é a forma sem acento usada no catálogo. */
export const ASPECTOS = [
  { chave: 'conjuncao', rotulo: 'Conjunção', angulo: 0, peso: 1.0 },
  { chave: 'oposicao', rotulo: 'Oposição', angulo: 180, peso: 0.9 },
  { chave: 'trigono', rotulo: 'Trígono', angulo: 120, peso: 0.7 },
  { chave: 'quadratura', rotulo: 'Quadratura', angulo: 90, peso: 0.7 },
  { chave: 'sextil', rotulo: 'Sextil', angulo: 60, peso: 0.5 },
]

export const NOMES_PT = {
  Sun: 'Sol', Moon: 'Lua', Mercury: 'Mercúrio', Venus: 'Vênus', Mars: 'Marte',
  Jupiter: 'Júpiter', Saturn: 'Saturno', Uranus: 'Urano', Neptune: 'Netuno',
  Pluto: 'Plutão',
}

export const SIGNOS = [
  'Áries', 'Touro', 'Gêmeos', 'Câncer', 'Leão', 'Virgem',
  'Libra', 'Escorpião', 'Sagitário', 'Capricórnio', 'Aquário', 'Peixes',
]

/**
 * Longitude eclíptica → grau dentro do signo.
 *
 * O card mostra isso sob cada planeta em vez de rótulos como "trânsito/natal":
 * num post público não existe mapa natal de quem vê, e a posição no signo é
 * verificável em qualquer efeméride — o que sustenta a alegação de cálculo.
 */
export function posicaoEmSigno(longitude) {
  const signo = SIGNOS[Math.floor(longitude / 30) % 12]
  const grau = Math.floor(longitude % 30)
  return { signo, grau, rotulo: `${grau}° ${signo}` }
}

/**
 * A Lua percorre o zodíaco em 27 dias e forma aspecto com quase tudo todo dia.
 * Sem esse freio, todo card do mês seria lunar.
 */
const FATOR_CORPO = { Moon: 0.35 }

/** Espelha `src/astro/planets.ts` — vetor geocêntrico convertido para eclíptica. */
function longitudeEcliptica(data, corpo) {
  const geo = GeoVector(corpo, data, false)
  const ecl = Ecliptic(geo)
  return ((ecl.elon % 360) + 360) % 360
}

/** Menor separação angular entre duas longitudes, em graus (0–180). */
function separacao(a, b) {
  const d = Math.abs(((a - b) % 360) + 360) % 360
  return d > 180 ? 360 - d : d
}

/** Formata graus decimais como `2°38'`. */
export function formatarOrbe(graus) {
  const g = Math.floor(graus)
  let m = Math.round((graus - g) * 60)
  if (m === 60) return `${g + 1}°00'`
  return `${g}°${String(m).padStart(2, '0')}'`
}

/**
 * Todos os aspectos maiores vigentes no céu de uma data.
 *
 * @param {Date} data instante UTC
 * @param {Record<string, Record<number, number>>} orbesPorPlaneta `PLANET_ASPECT_ORBS`
 * @returns {Array<object>} encontros, do mais forte ao mais fraco
 */
export function aspectosDoCeu(data, orbesPorPlaneta) {
  const longitudes = {}
  for (const nome of POR_VELOCIDADE) {
    longitudes[nome] = longitudeEcliptica(data, CORPOS[nome])
  }

  const encontros = []

  for (let i = 0; i < POR_VELOCIDADE.length; i++) {
    for (let j = i + 1; j < POR_VELOCIDADE.length; j++) {
      const alvo = POR_VELOCIDADE[i] // mais rápido
      const agente = POR_VELOCIDADE[j] // mais lento
      const sep = separacao(longitudes[agente], longitudes[alvo])

      for (const aspecto of ASPECTOS) {
        const orbe = Math.abs(sep - aspecto.angulo)

        // moiety: metade do orbe de cada corpo, somadas
        const orbeAgente = orbesPorPlaneta[agente]?.[aspecto.angulo]
        const orbeAlvo = orbesPorPlaneta[alvo]?.[aspecto.angulo]
        if (orbeAgente == null || orbeAlvo == null) continue
        const orbeMax = (orbeAgente + orbeAlvo) / 2

        if (orbe > orbeMax) continue

        // exatidão domina: um aspecto quase exato é a notícia do dia
        const exatidao = 1 - orbe / orbeMax
        const fator = (FATOR_CORPO[agente] ?? 1) * (FATOR_CORPO[alvo] ?? 1)
        const forca = aspecto.peso * exatidao * exatidao * fator

        encontros.push({
          chave: `transit:${agente.toLowerCase()}|${aspecto.chave}|${alvo.toLowerCase()}`,
          agente,
          alvo,
          agentePt: NOMES_PT[agente],
          alvoPt: NOMES_PT[alvo],
          agentePos: posicaoEmSigno(longitudes[agente]),
          alvoPos: posicaoEmSigno(longitudes[alvo]),
          aspecto: aspecto.chave,
          aspectoRotulo: aspecto.rotulo,
          angulo: aspecto.angulo,
          orbe,
          orbeFormatado: formatarOrbe(orbe),
          orbeMax,
          exato: orbe < 0.5,
          forca,
        })
      }
    }
  }

  return encontros.sort((a, b) => b.forca - a.forca)
}

/**
 * O encontro do dia: o mais forte que tenha título E aforismo no catálogo.
 *
 * Sem texto curado não há card — publicar o nome técnico ("Saturno quadratura
 * Sol") sem leitura seria pior que não publicar.
 *
 * `evitar` existe porque aspecto de planeta lento dura dias: Saturno trígono
 * Sol fica no topo da lista por uma semana, e a grade sairia com o mesmo texto
 * quatro vezes. Quando a chave mais forte já foi publicada na janela recente,
 * descemos para a seguinte — que é igualmente verdadeira, só menos exata.
 *
 * Se todas estiverem na lista de evitar, repetimos a mais forte: um card
 * repetido é melhor que nenhum card.
 *
 * @param {Set<string>} [evitar] chaves publicadas recentemente
 * @returns {object|null} encontro escolhido, ou null se nenhum tem texto
 */
export function encontroDoDia(data, orbesPorPlaneta, titulos, aforismos, evitar) {
  const encontros = aspectosDoCeu(data, orbesPorPlaneta)
  const comTexto = encontros.filter((e) => titulos[e.chave] && aforismos[e.chave])
  if (comTexto.length === 0) return null

  const inedito = evitar ? comTexto.find((e) => !evitar.has(e.chave)) : comTexto[0]
  const escolhido = inedito || comTexto[0]

  return {
    ...escolhido,
    titulo: titulos[escolhido.chave],
    aforismo: aforismos[escolhido.chave],
    repetido: !inedito,
  }
}

/**
 * Área da vida do encontro.
 *
 * Prefere a área que os dois corpos compartilham — é o encontro que dá o tema.
 * Sem interseção, vale a do agente, que é quem move a cena.
 */
export function areaDoEncontro(encontro, atribuicao) {
  const areasDe = (planeta) =>
    Object.keys(atribuicao).filter((area) => atribuicao[area].planets.includes(planeta))

  const doAgente = areasDe(encontro.agente)
  const doAlvo = areasDe(encontro.alvo)

  const comum = doAgente.filter((a) => doAlvo.includes(a))
  return comum[0] || doAgente[0] || doAlvo[0] || 'transformacao'
}
