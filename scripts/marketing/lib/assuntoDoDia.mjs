/**
 * O assunto de hoje, um só, já filtrado.
 *
 * Existe porque a produção passou a ser diária. Enquanto saía peça só em dia
 * forte, escolher era pegar `eventosDoDia(...)[0]`. Com peça todo dia, dois
 * problemas aparecem, e os dois foram medidos sobre efeméride real antes de
 * virarem código:
 *
 * 1. A lua fora de curso de 13/08/2026 dura 42,3h, e `eventosDoDia` a devolve
 *    nos dias 13, 14 e 15, porque `emCurso` é verdadeiro nos três. Três posts
 *    idênticos.
 *
 * 2. Plutão sextil Netuno sairia SEIS vezes em trinta dias. Dois planetas
 *    lentos ficam com orbe fechado por semanas, e é exatamente por isso que
 *    `opcoesDoDia` tem a regra "o aspecto nunca encabeça uma peça".
 *
 * Com as duas regras, sessenta dias dão 52 assuntos distintos e 8 dias de
 * conceito. Sem elas, dão repetição.
 *
 * ── A CASCATA ──────────────────────────────────────────────────────────────
 *
 *   1  evento do céu        eclipse, lunação, ingresso, retrogradação
 *   2  lua fora de curso    todas, uma peça por período
 *   3  aspecto pessoal      só com Sol, Lua, Mercúrio, Vênus ou Marte
 *   4  planeta no signo     catálogo do app, com âncora
 *   5  conceito             quando o céu não deu assunto
 */
import { eventosDoDia, ingressosProximos } from './eventos.mjs'
import { temaEducativo, chaveAspectoNatal, ROTULO_ASPECTO, falaComQuemLe } from './educativo.mjs'
import { conceitoDoDia } from './textosConceito.mjs'

/**
 * Corpos cujo aspecto vira assunto.
 *
 * Mesma lista de `educativo.mjs`, e pelo mesmo motivo: um aspecto entre dois
 * planetas lentos não é notícia de um dia, é paisagem do semestre.
 */
const CORPOS_PESSOAIS = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars']

/**
 * A identidade de um assunto, para o histórico.
 *
 * O que precisa ser estável entre dias diferentes: a lua vazia é a MESMA
 * enquanto for o mesmo período, mesmo aparecendo em três datas; o aspecto é o
 * mesmo par no mesmo ângulo, mesmo com o orbe mudando de hora em hora.
 */
export function chaveDoAssunto(assunto) {
  if (!assunto) return ''
  switch (assunto.tipo) {
    case 'lua_fora_de_curso':
      return `luav:${assunto.inicio.toISOString()}`
    case 'aspecto':
      return `asp:${assunto.aspecto.agente}:${assunto.aspecto.aspecto}:${assunto.aspecto.alvo}`
    case 'eclipse':
      return `eclipse:${assunto.luminar}:${assunto.quando.toISOString().slice(0, 10)}`
    case 'fase':
      return `fase:${assunto.fase}:${assunto.signo}`
    case 'ingresso':
    case 'retrogrado':
    case 'direto':
      return `${assunto.tipo}:${assunto.corpo}:${assunto.signo}`
    case 'planeta_no_signo':
    case 'aspecto_natal':
      return `educativo:${assunto.chave}`
    case 'conceito':
      return `conceito:${assunto.chave}`
    default:
      return `${assunto.tipo}:${assunto.signo || ''}`
  }
}

/**
 * O assunto do dia.
 *
 * @param {Date} data
 * @param {object} deps `{ mapa, catalogos, iso, usadas }`
 *   `usadas` é o conjunto de `chavesRecentes`, da janela de catorze dias.
 * @returns {object} sempre devolve algo: no pior caso, um conceito
 */
export function assuntoDoDia(data, { mapa, catalogos = {}, iso, usadas = new Set() }) {
  const naJanela = (a) => a && !usadas.has(chaveDoAssunto(a))

  const doCeu = eventosDoDia(data, mapa.aspectos, { antecedencia: 0 })

  // 1 e 2: evento do céu e lua fora de curso, na ordem de peso que já existe
  for (const ev of doCeu) {
    if (ev.tipo === 'aspecto') continue
    if (naJanela(ev)) return ev
  }

  /**
   * 3: aspecto, com corpo pessoal e COM TEXTO.
   *
   * O aspecto vem de `eventosDoDia` sem leitura nenhuma: só o par, o ângulo e o
   * orbe. Quem tem a leitura é o catálogo de aspectos natais do app. Sem texto
   * no catálogo, o aspecto não vira peça, senão a peça sai com o dado e nenhuma
   * interpretação, que é o defeito de origem de tudo isto.
   */
  for (const ev of doCeu) {
    if (ev.tipo !== 'aspecto') continue
    const a = ev.aspecto
    if (!CORPOS_PESSOAIS.includes(a.agente) && !CORPOS_PESSOAIS.includes(a.alvo)) continue

    const texto = catalogos.aspectoNatal?.[chaveAspectoNatal(a.agente, a.alvo, a.aspecto)]
    if (!texto || falaComQuemLe(texto)) continue
    if (!naJanela(ev)) continue

    return {
      ...ev,
      texto,
      // o rótulo do catálogo vem capitalizado ("Sextil"), e no meio da frase
      // isso sai como erro de digitação: "Vênus Sextil Mercúrio"
      titulo: `${a.agentePt} ${(ROTULO_ASPECTO[a.aspecto] || a.aspecto).toLowerCase()} ${a.alvoPt}`,
      // a âncora é o que separa "isto é o que essa configuração significa" de
      // "hoje vai acontecer com você"
      ancora: `${a.agentePt} e ${a.alvoPt} estão nesse ângulo hoje, com ${a.orbeFormatado} de orbe.`,
    }
  }

  /**
   * 4 e 5: educativo e conceito, alternados.
   *
   * A primeira versão punha o educativo na frente, e o resultado da simulação
   * foi que em sessenta dias NENHUM conceito saiu: o catálogo sempre tem um
   * planeta em signo disponível, então os quinze textos escritos nunca veriam
   * uma peça. O João pediu os dois.
   *
   * A alternância é pelo dia do mês, o que a mantém determinística: regerar o
   * mesmo dia devolve a mesma escolha. Se o preferido do dia estiver repetido
   * na janela, o outro assume.
   */
  const diaDoMes = Number(String(iso).slice(8, 10)) || 1
  const educativoPrimeiro = diaDoMes % 2 === 0

  const pegarEducativo = () => {
    if (!catalogos.planetaNoSigno && !catalogos.aspectoNatal) return null
    const chavesUsadas = new Set(
      [...usadas].filter((c) => c.startsWith('educativo:')).map((c) => c.slice(10))
    )
    const tema = temaEducativo(mapa, catalogos, chavesUsadas, {
      ingressos: ingressosProximos(data, 40),
      data,
    })
    return tema && !tema.repetido ? tema : null
  }

  const pegarConceito = () => {
    const c = { tipo: 'conceito', ...conceitoDoDia(iso, usadas) }
    return usadas.has(chaveDoAssunto(c)) ? null : c
  }

  const primeiro = educativoPrimeiro ? pegarEducativo() : pegarConceito()
  if (primeiro) return primeiro

  const segundo = educativoPrimeiro ? pegarConceito() : pegarEducativo()
  if (segundo) return segundo

  // nunca devolver vazio: um dia sem peça é pior que um conceito repetido
  return { tipo: 'conceito', ...conceitoDoDia(iso, new Set()) }
}
