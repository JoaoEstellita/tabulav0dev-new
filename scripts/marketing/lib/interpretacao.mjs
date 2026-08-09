/**
 * A interpretação astrológica que já existe no app, trazida para as peças.
 *
 * O João olhou o material duas vezes e disse a mesma coisa de jeitos
 * diferentes: primeiro "as informações são genéricas demais", depois "quem se
 * importa quantos graus ela anda um dia — quero profundidade de interpretação
 * astrológica". Na segunda vez ficou claro o que eu tinha feito: troquei jargão
 * vazio por TRIVIA ASTRONÔMICA. "A Lua anda 15° e troca de signo" é verdade,
 * é calculado, e não é leitura de nada.
 *
 * Enquanto isso, o app tem centenas de textos curados que ninguém nunca viu num
 * post:
 *
 *   natal:{planet}_in_{sign}      120  planeta no signo
 *   natal:{planet}|house|{n}      120  planeta na casa
 *   natal:{p1}|{aspecto}|{p2}     224  aspecto entre dois corpos
 *   transit:{p}|{aspecto}|{alvo}  704  trânsito sobre ponto natal
 *
 * "Marte na Casa 4 impulsiona a energia para a construção de raízes... o
 * ambiente doméstico pode ser um espaço de grande atividade, seja de construção
 * literal ou de dinâmicas familiares intensas." Isso é o que ele quer, estava
 * pronto, e eu estava escrevendo sobre graus por dia ao lado.
 *
 * Aqui os catálogos são lidos direto dos `.ts` (via `lerLiterais`) — os mesmos
 * arquivos que o app usa, sem cópia. Curadoria feita uma vez vale nos dois
 * lugares.
 */
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { lerLiterais } from './catalogo.mjs'

const AQUI = path.dirname(fileURLToPath(import.meta.url))
const FRONTEND = path.resolve(AQUI, '../../..')

/** As chaves usam o nome em inglês, minúsculo. */
const CHAVE_CORPO = {
  Sun: 'sun', Moon: 'moon', Mercury: 'mercury', Venus: 'venus', Mars: 'mars',
  Jupiter: 'jupiter', Saturn: 'saturn', Uranus: 'uranus', Neptune: 'neptune', Pluto: 'pluto',
}

const CHAVE_SIGNO = {
  'Áries': 'aries', 'Touro': 'taurus', 'Gêmeos': 'gemini', 'Câncer': 'cancer',
  'Leão': 'leo', 'Virgem': 'virgo', 'Libra': 'libra', 'Escorpião': 'scorpio',
  'Sagitário': 'sagittarius', 'Capricórnio': 'capricorn', 'Aquário': 'aquarius',
  'Peixes': 'pisces',
}

/**
 * Dignidades essenciais, na tabela clássica.
 *
 * É o que dá peso à mesma notícia: "Marte entra em Câncer" e "Marte entra em
 * Escorpião" são eventos de tamanhos diferentes, e a diferença é tradição
 * astrológica de dois mil anos, não opinião. Espelha
 * `src/astro/planetary-status.config.ts`.
 */
const DIGNIDADES = {
  Sun: { domicilio: ['Leão'], exaltacao: ['Áries'], exilio: ['Aquário'], queda: ['Libra'] },
  Moon: { domicilio: ['Câncer'], exaltacao: ['Touro'], exilio: ['Capricórnio'], queda: ['Escorpião'] },
  Mercury: { domicilio: ['Gêmeos', 'Virgem'], exaltacao: ['Virgem'], exilio: ['Sagitário', 'Peixes'], queda: ['Peixes'] },
  Venus: { domicilio: ['Touro', 'Libra'], exaltacao: ['Peixes'], exilio: ['Áries', 'Escorpião'], queda: ['Virgem'] },
  Mars: { domicilio: ['Áries', 'Escorpião'], exaltacao: ['Capricórnio'], exilio: ['Libra', 'Touro'], queda: ['Câncer'] },
  Jupiter: { domicilio: ['Sagitário', 'Peixes'], exaltacao: ['Câncer'], exilio: ['Gêmeos', 'Virgem'], queda: ['Capricórnio'] },
  Saturn: { domicilio: ['Capricórnio', 'Aquário'], exaltacao: ['Libra'], exilio: ['Câncer', 'Leão'], queda: ['Áries'] },
}

/**
 * O que a dignidade significa, dita sem jargão de manual.
 *
 * A palavra técnica aparece — quem acompanha astrologia a reconhece e é sinal de
 * que a conta sabe do que fala —, mas nunca sozinha: vem sempre com o que ela
 * quer dizer na mesma frase.
 */
const SENTIDO_DA_DIGNIDADE = {
  domicilio: 'em casa — é o signo que ele rege, onde age do jeito mais direto que sabe',
  exaltacao: 'exaltado — é onde a tradição diz que ele funciona melhor do que em qualquer outro lugar',
  exilio: 'em exílio, no signo oposto ao que rege — o que ele faz de olhos fechados aqui custa esforço',
  queda: 'em queda — o signo onde a tradição diz que ele tem menos força para agir do jeito de sempre',
}

/**
 * Em que dignidade o corpo está neste signo.
 *
 * Só os sete corpos tradicionais: dignidade de Urano, Netuno e Plutão é invenção
 * moderna e não há acordo sobre ela. Devolve `null` quando não há nada a dizer,
 * que é o caso mais comum — a maioria das posições é neutra.
 */
export function dignidade(corpo, signo) {
  const t = DIGNIDADES[corpo]
  if (!t) return null
  for (const [nome, signos] of Object.entries(t)) {
    if (signos.includes(signo)) return { tipo: nome, texto: SENTIDO_DA_DIGNIDADE[nome] }
  }
  return null
}

/** Os catálogos, lidos uma vez por processo. */
let cache = null

export async function carregarCatalogos() {
  if (cache) return cache

  const [emSigno, emCasa, aspectos, transitos] = await Promise.all([
    lerLiterais(path.join(FRONTEND, 'src/data/planetInSignOverridesPtBR.ts'), [
      'PLANET_IN_SIGN_PTBR_OVERRIDES',
    ]),
    lerLiterais(path.join(FRONTEND, 'src/data/natalPlanetInHouseOverridesPtBR.ts'), [
      'NATAL_PLANET_IN_HOUSE_PTBR_OVERRIDES',
    ]),
    lerLiterais(path.join(FRONTEND, 'src/data/natalPlanetAspectOverridesPtBR.ts'), [
      'NATAL_PLANET_ASPECT_PTBR_OVERRIDES',
    ]),
    lerLiterais(path.join(FRONTEND, 'src/data/transitCatalogOverridesPtBR.ts'), [
      'TRANSIT_CATALOG_PTBR_OVERRIDES',
    ]),
  ])

  cache = {
    emSigno: emSigno.PLANET_IN_SIGN_PTBR_OVERRIDES || {},
    emCasa: emCasa.NATAL_PLANET_IN_HOUSE_PTBR_OVERRIDES || {},
    aspectos: aspectos.NATAL_PLANET_ASPECT_PTBR_OVERRIDES || {},
    transitos: transitos.TRANSIT_CATALOG_PTBR_OVERRIDES || {},
  }
  return cache
}

/**
 * O que significa este corpo neste signo — texto curado do app.
 *
 * É a leitura do ingresso: o que muda quando Marte sai de Gêmeos e entra em
 * Câncer não é a velocidade dele, é o modo de agir.
 */
export function textoEmSigno(catalogos, corpo, signo) {
  const chave = `natal:${CHAVE_CORPO[corpo]}_in_${CHAVE_SIGNO[signo]}`
  return catalogos.emSigno[chave] || null
}

/**
 * O que significa este corpo nesta casa — texto curado do app.
 *
 * É o que faz o carrossel dos doze signos ter conteúdo de verdade em cada
 * slide: a casa vem da conta, e a leitura da casa vem da curadoria.
 */
export function textoEmCasa(catalogos, corpo, casa) {
  const chave = `natal:${CHAVE_CORPO[corpo]}|house|${casa}`
  return catalogos.emCasa[chave] || null
}

/**
 * Primeiras frases de um texto curado.
 *
 * Os textos têm três a quatro frases e ~350 caracteres — escritos para a tela do
 * app, onde há rolagem. Numa legenda queimada de Reel isso é tempo demais.
 */
export function primeirasFrases(texto, quantas = 2) {
  if (!texto) return ''
  const frases = String(texto).match(/[^.!?]+[.!?]+/g)
  return frases ? frases.slice(0, quantas).join('').trim() : texto
}
