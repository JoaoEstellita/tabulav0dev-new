/**
 * De assunto a peça: título, olho, texto e o que vai na legenda.
 *
 * Fica fora de `gerarEvento.mjs` porque é a parte que precisa de teste e a que
 * não precisa de Chrome. Enquanto vivia lá dentro, o único jeito de conferir
 * uma peça era renderizar um PNG e olhar.
 *
 * ── O QUE ESTE ARQUIVO IMPEDE ──────────────────────────────────────────────
 *
 * O título vinha de uma cadeia de ternários com um fallback
 * `${evento.corpoPt} em ${evento.signo}`, e a lua fora de curso não tem
 * `corpoPt`: a peça sairia com "undefined em Virgem" no dia em que a produção
 * virasse diária. Nunca apareceu porque o step só rodava em dia forte.
 *
 * Aqui cada tipo tem seu ramo, e o que sobra é um erro explícito.
 */
import { textoDoEvento } from './textosEvento.mjs'
import { POR_SIGNO as ECLIPSE_POR_SIGNO, ABERTURA } from './textosEclipse.mjs'
import { textoDaLuaVazia, REGRA_DA_TRADICAO } from './textosLuaVazia.mjs'
import { dignidade, textoEmSigno, primeirasFrases, semTravessao } from './interpretacao.mjs'

const TZ = 'America/Sao_Paulo'

const diaMes = (d) =>
  new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'long', timeZone: TZ }).format(d)

const horaMinuto = (d) =>
  new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: TZ })
    .format(d).replace(':', 'h')

const diaDaSemana = (d) =>
  new Intl.DateTimeFormat('pt-BR', { weekday: 'long', timeZone: TZ }).format(d)

/** O sujeito da frase da dignidade quando o evento não traz nome. */
const NOME_DO_CORPO = { Sun: 'O Sol', Moon: 'A Lua' }

/** O corpo que protagoniza o evento, para dignidade e catálogo. */
export function corpoDoAssunto(a) {
  if (a.corpo) return a.corpo
  if (a.tipo === 'eclipse') return a.luminar === 'solar' ? 'Sun' : 'Moon'
  if (a.tipo === 'fase') return a.fase === 'Lua Nova' ? 'Sun' : 'Moon'
  if (a.tipo === 'lua_fora_de_curso') return 'Moon'
  return null
}

/**
 * Doze signos em ordem, para dar fundo a quem não tem signo.
 *
 * O conceito não acontece em lugar nenhum do zodíaco, mas a foto é escolhida
 * pelo elemento do signo. Sem isto, todo conceito sairia com a mesma imagem.
 */
const ORDEM = ['Áries', 'Touro', 'Gêmeos', 'Câncer', 'Leão', 'Virgem',
  'Libra', 'Escorpião', 'Sagitário', 'Capricórnio', 'Aquário', 'Peixes']

/**
 * A peça de um assunto.
 *
 * @param {object} assunto  o que `assuntoDoDia` devolveu
 * @param {object} deps `{ iso, catalogos }`
 * @returns {{olho, titulo, texto, signo, casas: boolean, legendaAbre: string}}
 */
export function pecaDoAssunto(assunto, { iso, catalogos = null } = {}) {
  // `glifo: true` é o padrão; só o conceito o desliga, e ele diz isso no ramo
  const peca = { glifo: true, ...montar(assunto, { iso, catalogos }) }

  /**
   * O travessão morre aqui, e não em cada ramo.
   *
   * Os textos escritos à mão já saem sem ele, mas os do catálogo do app não:
   * "há uma tendência a se exigir muito — e exigir muito dos outros — em termos
   * de responsabilidade afetiva" chegou a uma peça pronta. O João foi explícito:
   * "nao use —". O catálogo continua como está, porque no app ele é lido em
   * outro contexto.
   */
  return {
    ...peca,
    titulo: semTravessao(peca.titulo),
    texto: semTravessao(peca.texto),
    legendaAbre: semTravessao(peca.legendaAbre || ''),
  }
}

function montar(assunto, { iso, catalogos }) {
  const corpo = corpoDoAssunto(assunto)
  const dia = assunto.quando ? diaMes(assunto.quando) : ''

  switch (assunto.tipo) {
    case 'eclipse': {
      const solar = assunto.luminar === 'solar'
      return {
        olho: dia,
        titulo: `Eclipse ${solar ? 'solar' : 'lunar'}\nem ${assunto.signo}`,
        // sem dignidade: "O Sol chega em casa" antes de "este eclipse cai em
        // Leão" diz duas vezes o mesmo signo
        texto: ECLIPSE_POR_SIGNO[assunto.signo] || '',
        signo: assunto.signo,
        casas: true,
        legendaAbre: ABERTURA[solar ? 'solar' : 'lunar'],
      }
    }

    case 'fase':
      return {
        olho: dia,
        titulo: `${assunto.fase}\nem ${assunto.signo}`,
        texto: comDignidade(assunto, corpo, textoDoEvento(assunto), catalogos),
        signo: assunto.signo,
        casas: true,
        legendaAbre: '',
      }

    case 'ingresso':
      return {
        olho: dia,
        titulo: `${assunto.corpoPt} entra\nem ${assunto.signo}`,
        texto: comDignidade(assunto, corpo, textoDoEvento(assunto), catalogos),
        signo: assunto.signo,
        casas: true,
        legendaAbre: '',
      }

    case 'retrogrado':
    case 'direto':
      return {
        olho: dia,
        titulo: assunto.tipo === 'retrogrado'
          ? `${assunto.corpoPt}\nretrógrado`
          : `${assunto.corpoPt}\nvolta a andar`,
        texto: comDignidade(assunto, corpo, textoDoEvento(assunto), catalogos),
        signo: assunto.signo,
        casas: true,
        legendaAbre: '',
      }

    /**
     * A janela abre o texto, não o olho.
     *
     * Ela estava no olho e a primeira peça saiu com "13 DE AGOSTO, 17:00 A 15
     * DE AGOSTO, 11:19" atravessando a largura do quadro em caixa alta e
     * espaçado. O olho é para três ou quatro palavras.
     *
     * A janela em si é o dado que quase nenhuma conta publica, porque quase
     * nenhuma calcula: fica na primeira linha do texto, onde tem espaço.
     */
    case 'lua_fora_de_curso': {
      const mesmoDia = assunto.inicio.toDateString() === assunto.fim.toDateString()
      const janela = mesmoDia
        ? `Das ${horaMinuto(assunto.inicio)} às ${horaMinuto(assunto.fim)} de hoje.`
        : `Das ${horaMinuto(assunto.inicio)} de hoje às ${horaMinuto(assunto.fim)} de ${diaDaSemana(assunto.fim)}.`
      return {
        olho: dia,
        titulo: 'Lua fora\nde curso',
        texto: [janela, textoDaLuaVazia(assunto.signo) || ''].filter(Boolean).join('\n\n'),
        signo: assunto.signo,
        // não há casa: a Lua não entrou em lugar nenhum, ela está entre dois
        casas: false,
        legendaAbre: REGRA_DA_TRADICAO,
      }
    }

    /**
     * Aspecto e educativo trazem texto do catálogo natal do app.
     *
     * Aqui isso é legítimo, e a âncora é o que faz a diferença: a peça diz o
     * que a configuração significa e prova que ela existe hoje, em vez de
     * prometer o que vai acontecer com quem lê.
     */
    case 'aspecto':
      return {
        olho: 'o céu de hoje',
        titulo: quebrarTitulo(assunto.titulo),
        texto: [assunto.texto, assunto.ancora].filter(Boolean).join('\n\n'),
        signo: assunto.aspecto?.agentePos?.signo || assunto.signo || ORDEM[0],
        casas: false,
        legendaAbre: '',
      }

    case 'planeta_no_signo':
    case 'aspecto_natal':
      return {
        olho: 'o céu de hoje',
        titulo: quebrarTitulo(assunto.titulo),
        texto: [primeirasFrases(assunto.texto, 3), assunto.ancora].filter(Boolean).join('\n\n'),
        signo: assunto.signo || ORDEM[0],
        casas: false,
        legendaAbre: '',
      }

    case 'conceito':
      return {
        olho: 'astrologia por dentro',
        titulo: assunto.titulo,
        texto: assunto.texto,
        // sem signo próprio: a foto roda pelo dia para não repetir
        signo: ORDEM[(Number(String(iso || '').slice(8, 10)) || 1) % 12],
        // e sem glifo: o desenho de Câncer num post sobre o ascendente faz a
        // peça parecer sobre Câncer, que é o oposto do que ela diz
        glifo: false,
        casas: false,
        legendaAbre: '',
      }

    default:
      throw new Error(`pecaDoAssunto: tipo sem tratamento: ${assunto.tipo}`)
  }
}

/**
 * O texto do evento com a dignidade na frente, quando ela existe.
 *
 * A dignidade só sai com sujeito: `corpoPt` é vazio em fase e em lua vazia, e a
 * peça do eclipse já saiu uma vez começando por " chega em casa: é o signo que
 * ele rege", frase sem quem.
 */
function comDignidade(assunto, corpo, doEvento, catalogos) {
  const dig = corpo ? dignidade(corpo, assunto.signo) : null
  const sujeito = assunto.corpoPt || NOME_DO_CORPO[corpo] || ''

  const leitura = doEvento ||
    (catalogos && corpo ? primeirasFrases(textoEmSigno(catalogos, corpo, assunto.signo), 2) : '')

  return [dig && sujeito ? `${sujeito} ${dig.texto}.` : '', leitura]
    .filter(Boolean).join('\n\n')
}

/**
 * Uma quebra no título, para ele não sair numa linha só.
 *
 * "Vênus sextil Mercúrio" em corpo 8,4cqw estoura a largura do quadro.
 *
 * A quebra é pelo COMPRIMENTO, não pela contagem de palavras: dividir
 * "Saturno quadratura Lua" no meio das três palavras dava "Saturno
 * quadratura" e "Lua", uma linha longa e um toco. Aqui procura-se o corte que
 * deixa as duas linhas mais parecidas.
 */
function quebrarTitulo(titulo) {
  const palavras = String(titulo || '').trim().split(/\s+/)
  if (palavras.length < 2) return palavras.join('')

  const total = palavras.join(' ').length
  let melhor = 1
  let menorDiferenca = Infinity

  for (let i = 1; i < palavras.length; i++) {
    const esquerda = palavras.slice(0, i).join(' ').length
    const diferenca = Math.abs(esquerda - (total - esquerda))
    if (diferenca < menorDiferenca) {
      menorDiferenca = diferenca
      melhor = i
    }
  }

  return `${palavras.slice(0, melhor).join(' ')}\n${palavras.slice(melhor).join(' ')}`
}
