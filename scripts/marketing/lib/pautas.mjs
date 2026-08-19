/**
 * Os assuntos que um dia comporta.
 *
 * A editorial nasceu mostrando o mesmo evento repetido por ângulo — "Mercúrio
 * entra em Leão" na véspera e no dia, "Eclipse solar total" quatro vezes — e o
 * João disse o que era: aquilo não são opções. Eu tinha montado a lista pelo
 * eixo errado.
 *
 * Os assuntos alternativos já eram calculados; nunca chegavam à tela. Num dia
 * qualquer há de quatro a sete, entre evento do céu, Lua fora de curso e os
 * educativos ancorados nas posições de agora.
 *
 * Este módulo é compartilhado de propósito: o calendário e o gerador precisam
 * concordar no ID de cada assunto, senão a pauta salva ontem aponta para nada.
 */
import {
  eventosDoDia,
  ingressosProximos,
  ingressosDaLua,
  retrogradacoesVigentes,
  grausCriticos,
  eixoDosNodulos,
} from './eventos.mjs'
import { mapaDoCeu, aspectosDoCeu } from './ceu.mjs'
import { temaEducativo, falaComQuemLe } from './educativo.mjs'
import { ehEducativo } from './slidesEducativo.mjs'
import { escrever } from './vozes.mjs'
import { CONCEITO, CHAVES_DE_CONCEITO } from './textosConceito.mjs'
import { RECURSO, CHAVES_DE_RECURSO } from './textosRecurso.mjs'
import { TEMA, CHAVES_DE_TEMA } from './temasDeCarrossel.mjs'

/** Os catálogos usam o nome do signo em inglês, minúsculo. */
const SIGNO_EN = {
  'Áries': 'aries', 'Touro': 'taurus', 'Gêmeos': 'gemini', 'Câncer': 'cancer',
  'Leão': 'leo', 'Virgem': 'virgo', 'Libra': 'libra', 'Escorpião': 'scorpio',
  'Sagitário': 'sagittarius', 'Capricórnio': 'capricorn', 'Aquário': 'aquarius',
  'Peixes': 'pisces',
}

/**
 * Identidade estável de um assunto.
 *
 * Estável é a palavra: a pauta guarda o id e o gerador o procura no dia
 * seguinte. Se ele mudar entre uma chamada e outra — por depender de ordem, de
 * relógio ou de sorteio — a escolha do João some sem aviso.
 */
export function idDoAssunto(ev) {
  switch (ev.tipo) {
    case 'lua_fora_de_curso':
      return `vazia:${ev.inicio.toISOString()}`
    // o estado dura semanas: a identidade e o corpo mais a data de inicio, para
    // dois retrogrados do mesmo planeta em anos diferentes nao colidirem
    case 'retrogradacao':
      return `retro:${ev.corpo}:${ev.desde ? ev.desde.toISOString().slice(0, 10) : 'atual'}`
    case 'grau_critico':
      return `grau:${ev.corpo}:${ev.signo}:${ev.grau}`
    case 'nodulos':
      return `nodulos:${ev.norte.signo}`
    case 'eclipse':
      return `eclipse:${ev.luminar}:${ev.quando.toISOString().slice(0, 10)}`
    case 'ingresso':
      return `ingresso:${ev.corpo}:${ev.signo}`
    case 'fase':
      return `fase:${ev.fase}:${ev.signo}`
    case 'retrogrado':
    case 'direto':
      return `${ev.tipo}:${ev.corpo}`
    case 'educativo':
      return `educativo:${ev.chave}`
    case 'aspecto':
      return ev.aspecto?.chave || 'aspecto'
    default:
      return ev.tipo
  }
}

/**
 * ACONTECE hoje, ou é explicação de uma posição que já vale?
 *
 * O João olhou a editorial de um dia e viu "Vênus em Libra", "Marte em Câncer"
 * e "Júpiter em Leão", os três com o mesmo subtítulo, e perguntou o óbvio:
 * "preciso saber se nesse dia o planeta vai entrar no signo, ou se é só um post
 * explicativo". Os três eram explicativos. Nada na tela dizia isso.
 *
 * O selo vem antes do texto porque é a primeira coisa que decide se vale a pena
 * publicar naquele dia: evento tem data e passa; explicação vale o mês inteiro.
 */
export function naturezaDoAssunto(ev) {
  /**
   * A lua fora de curso saiu daqui.
   *
   * Ela acontece no céu e tem hora marcada, então por muito tempo ficou nesta
   * lista. O João foi explícito ao contrário: "quando for lua fora de curso tem
   * que ser educativo, mas pode ser em formato de Storie". A peça não anuncia
   * um acontecimento, ela explica um intervalo — e o selo na agenda precisa
   * dizer isso, porque é por ele que ele escolhe o que publicar.
   */
  const DO_CEU = ['eclipse', 'fase', 'ingresso', 'retrogrado', 'direto']
  return DO_CEU.includes(ev?.tipo) ? 'evento' : 'explicativo'
}

const HORA = (d) => new Intl.DateTimeFormat('pt-BR', {
  hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo',
}).format(d).replace(':', 'h')

const DIA_CURTO = (d) => new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit', month: '2-digit', timeZone: 'America/Sao_Paulo',
}).format(d)

/**
 * A linha que diz o que aquilo é, com o dado concreto.
 *
 * Dizia "O que significa num mapa natal" para todo educativo e "É hoje" para
 * todo evento. Agora traz a hora do ingresso, a janela da lua vazia e até
 * quando a posição do educativo ainda vale: é com isso que se escolhe.
 */
export function anguloDoAssunto(ev) {
  if (ev.tipo === 'educativo') {
    const d = ev.diasRestantes
    if (Number.isFinite(d) && d > 0 && d < 400) {
      const dias = Math.round(d)
      // "por mais N dias", e não uma data: `diasRestantes` é contado a partir
      // do dia daquela opção, e virar data absoluta erraria nos dias futuros
      return `Explicativo — a posição ainda vale por ${dias} dia${dias > 1 ? 's' : ''}`
    }
    /**
     * "Sem data para acabar" seria mentira.
     *
     * `diasRestantes` é `Infinity` quando a saída do signo cai fora da janela
     * de quarenta dias que `ingressosProximos` varre. Marte sai de Câncer, sim;
     * só não sai tão cedo. A frase diz o que se sabe.
     */
    return 'Explicativo — a posição vale por mais de um mês'
  }

  if (ev.tipo === 'lua_fora_de_curso') {
    if (!ev.inicio || !ev.fim) return 'Acontece hoje — dura horas'
    /**
     * A janela atravessa a meia-noite com frequência.
     *
     * Um período dura de poucos minutos a mais de quarenta horas, então a linha
     * "das 17h00 às 11h19" lia como se começasse e terminasse no mesmo dia, e às
     * vezes ao contrário do que acontece. Dizer de que dia é cada ponta custa
     * duas palavras e evita o João marcar a peça para o dia errado.
     */
    const abreOntem = !mesmoDiaLocal(ev.inicio, ev.fim)
    const de = abreOntem ? `${HORA(ev.inicio)} de ontem` : HORA(ev.inicio)
    return `Acontece hoje — das ${de} às ${HORA(ev.fim)}`
  }

  if (ev.tipo === 'retrogradacao') {
    const d = ev.diasRestantes ? Math.round(ev.diasRestantes) : null
    return d ? `Em curso — faltam ${d} dias para acabar` : 'Em curso — sem data para acabar'
  }

  if (ev.tipo === 'grau_critico') {
    return ev.extremo === 'saida'
      ? 'Explicativo — último grau, a tradição chama de anarético'
      : 'Explicativo — primeiro grau, começo cru'
  }

  if (ev.tipo === 'nodulos') return 'Explicativo — o eixo que quase ninguém explica'

  const falta = ev.diasFalta ?? 0
  const quando = ev.quando ? ` às ${HORA(ev.quando)}` : ''

  if (falta === 0) {
    if (ev.tipo === 'ingresso') return `Acontece hoje${quando} — entra no signo`
    if (ev.tipo === 'eclipse') return `Acontece hoje${quando} — e leva carrossel dos doze`
    if (ev.tipo === 'fase') return `Acontece hoje${quando}`
    if (ev.tipo === 'retrogrado') return `Acontece hoje${quando} — começa a andar para trás`
    if (ev.tipo === 'direto') return `Acontece hoje${quando} — volta a andar para a frente`
    return `Acontece hoje${quando}`
  }

  if (falta === 1) return `Acontece amanhã${quando}`
  return `Acontece em ${falta} dias — ${DIA_CURTO(ev.quando || new Date())}`
}

/** Corpos cuja entrada em signo o público reconhece sem explicação. */
const CORPOS_DE_PESO = ['Sun', 'Venus', 'Mars', 'Mercury', 'Jupiter', 'Saturn']

/**
 * Que peças o assunto comporta.
 *
 * Devolvia `['reel']` fixo, resíduo da fase em que saía um vídeo por dia. Como
 * o Estúdio monta as caixinhas a partir deste array, sobrou uma opção só — e
 * era justamente o formato que saiu da produção. O João viu: "no editorial não
 * tem mais os carrosséis?".
 *
 * Eclipse leva os treze slides por ascendente. Ingresso e lunação dão post e
 * story. EDUCATIVO agora é CARROSSEL: o João reviu — "educativo são os
 * carrosséis, com mais conteúdo; post é para anunciar eventos". O texto curado
 * é fatiado em capa + frases + fecho (`slidesEducativo.mjs`), então qualquer
 * educativo sustenta o carrossel sem precisar de doze slides escritos à mão.
 *
 * O vídeo não aparece: saiu do automático enquanto o template é refeito.
 */
export function formatosDoAssunto(ev) {
  if (ev?.tipo === 'eclipse') return ['post', 'carrossel', 'story']
  if (ehEducativo(ev?.tipo) || ev?.natureza === 'educativo') return ['carrossel']
  if (ev?.tipo === 'fase') return ['post', 'story']
  if (ev?.tipo === 'ingresso' && CORPOS_DE_PESO.includes(ev.corpo)) return ['post', 'story']
  /**
   * A lua fora de curso sai em story.
   *
   * "Quando for lua fora de curso tem que ser educativo, mas pode ser em
   * formato de Storie." O fenômeno dura algumas horas e o story dura vinte e
   * quatro: o formato acompanha o assunto, e o feed não fica com um post que
   * envelhece na mesma tarde.
   */
  if (ev?.tipo === 'lua_fora_de_curso') return ['story']
  return ['post']
}

/** Quantos educativos oferecer por dia, além do que o céu já dá. */
const EDUCATIVOS_POR_DIA = 3

/**
 * Aspecto sem nenhum destes é paisagem de geração, não assunto de um dia.
 *
 * A mesma lista de `educativo.mjs` e `assuntoDoDia.mjs`, e pelo mesmo motivo.
 */
const CORPOS_PESSOAIS_NO_ASPECTO = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars']

/** O dia civil em São Paulo, que é onde o calendário do Estúdio vive. */
const diaLocal = (d) => new Intl.DateTimeFormat('en-CA', {
  year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'America/Sao_Paulo',
}).format(d)

const mesmoDiaLocal = (a, b) => diaLocal(a) === diaLocal(b)

/**
 * O instante em que o aspecto fecha exato hoje, ou `null`.
 *
 * `orbe` é absoluto e não distingue 1° antes de fechar de 1° depois. `desvio`
 * traz o sinal, e o instante exato é onde ele cruza zero: se o sinal no começo
 * do dia é diferente do sinal no fim, o cruzamento caiu no meio.
 *
 * É por isso que o aspecto pode voltar à agenda sem repetir. Antes ele era
 * excluído em bloco porque ficava dentro do orbe por semanas; o instante em que
 * fecha acontece uma vez só.
 *
 * A hora sai por interpolação entre as duas pontas, e não por busca. Em um dia
 * o desvio de um corpo pessoal é praticamente uma reta, e a agenda precisa da
 * hora para o João escolher, não para calcular efeméride — bissecionar custaria
 * vinte cálculos de céu por aspecto por dia e mudaria a resposta em minutos.
 *
 * O aspecto que fecha exatamente à meia-noite fica de fora, e não vale o código:
 * `desvio` seria zero numa das pontas e o sinal não viraria.
 */
function instanteDoAspecto(data, aspecto, orbes) {
  const dia = diaLocal(data)
  // 03:00 UTC é 00:00 em São Paulo; o fim do dia é 24h depois, menos um minuto
  const abre = new Date(`${dia}T03:00:00.000Z`)
  const duracao = 86_400_000 - 60_000
  const fecha = new Date(abre.getTime() + duracao)

  const acharDesvio = (quando) =>
    aspectosDoCeu(quando, orbes).find((a) => a.chave === aspecto.chave)?.desvio

  const antes = acharDesvio(abre)
  const depois = acharDesvio(fecha)

  // fora do orbe numa das pontas: o aspecto entrou ou saiu hoje, e entrar no
  // orbe não é o mesmo que fechar exato
  if (antes == null || depois == null) return null
  if (Math.sign(antes) === Math.sign(depois)) return null

  const fracao = Math.abs(antes) / (Math.abs(antes) + Math.abs(depois))
  return new Date(abre.getTime() + fracao * duracao)
}

/**
 * As opções de um dia, em ordem de peso.
 *
 * O aspecto fica de fora: por regra ele nunca encabeça uma peça — fica exato por
 * semanas e sai repetido — então oferecê-lo como assunto seria oferecer algo que
 * o gerador recusaria.
 *
 * ── SÓ O QUE ACONTECE NO DIA ───────────────────────────────────────────────
 *
 * Antes esta função devolvia tudo: o evento do céu E as posições vigentes. Como
 * "Marte em Câncer" vale seis semanas, ele aparecia em todos os dias da agenda.
 * Medido em 21 dias: 96 linhas para 27 assuntos distintos, com Marte em Câncer
 * 21 vezes, Júpiter em Leão 18 e Vênus em Libra 13.
 *
 * O João leu a agenda e disse o que ela devia ser: "poderia ter apenas para
 * quando tiver no dia". O resto foi para `bancoDeAssuntos`.
 *
 * @param {Date} data
 * @param {object} deps `{ catalogos, orbes }`
 * @returns {{id, tipo, titulo, angulo, natureza, formatos, evento}[]}
 */
export function opcoesDoDia(data, { catalogos, orbes }) {
  const mapa = mapaDoCeu(data, orbes)
  const opcoes = []

  /**
   * `antecedencia: 0` — o evento aparece no dia dele, e só.
   *
   * A editorial antecipava três dias, então o mesmo Quarto Crescente ocupava
   * quatro linhas: "Faltam 3 dias", "Faltam 2 dias", "Amanhã" e o dia. Medido
   * numa simulação de trinta dias: 12 assuntos distintos em 30 publicações.
   *
   * O João foi direto: "poderia ter apenas para quando tiver no dia".
   */
  const juntar = (ev) => {
    const v = escrever(ev)
    opcoes.push({
      id: idDoAssunto(ev),
      tipo: ev.tipo,
      titulo: v.titulo,
      angulo: anguloDoAssunto(ev),
      natureza: naturezaDoAssunto(ev),
      formatos: formatosDoAssunto(ev),
      evento: ev,
    })
  }

  for (const ev of eventosDoDia(data, mapa.aspectos, { antecedencia: 0 })) {
    /**
     * O ASPECTO ENTRA, MAS SÓ NO DIA EM QUE FECHA EXATO.
     *
     * Ele era excluído em bloco, e o motivo era bom: Plutão sextil Netuno fica
     * dentro do orbe por semanas e sairia seis vezes num mês. O que resolve não
     * é excluir, é exigir o instante — o aspecto perfaz uma vez, e nesse dia ele
     * é notícia como qualquer ingresso.
     *
     * `aspectoFechaHoje` confere o sinal do desvio no começo e no fim do dia; o
     * corpo pessoal continua obrigatório, porque um par de lentos fecha exato
     * uma vez por década e ainda assim descreve uma geração, não um dia.
     */
    if (ev.tipo === 'aspecto') {
      const a = ev.aspecto
      if (!a) continue
      if (!CORPOS_PESSOAIS_NO_ASPECTO.includes(a.agente) && !CORPOS_PESSOAIS_NO_ASPECTO.includes(a.alvo)) continue
      const instante = instanteDoAspecto(data, a, orbes)
      if (!instante) continue
      // o `quando` que vinha de `eventosDoDia` é o início da janela de busca, e
      // a agenda o exibia como se fosse a hora do aspecto: três aspectos
      // distintos saíam todos "às 09h00"
      juntar({ ...ev, quando: instante })
      continue
    }
    juntar(ev)
  }

  /**
   * A LUA ENTRANDO EM SIGNO.
   *
   * A agenda tinha sete dias com evento em trinta, e o João perguntou por quê.
   * A Lua sozinha traz treze por mês, todos datados e todos verdadeiros.
   *
   * Vem de `ingressosDaLua` e não de `eventosDoDia` porque aquela função devolve
   * o próximo ingresso de cada corpo, um por corpo, e da Lua o que interessa é a
   * série inteira. `INGRESSO_RELEVANTE` continua sem a Lua de propósito: ele
   * alimenta o cálculo de validade do educativo, e a Lua trocando a cada dois
   * dias e meio faria toda posição parecer expirar amanhã.
   */
  for (const ev of ingressosDaLua(data, 1)) {
    if (!mesmoDiaLocal(ev.quando, data)) continue
    juntar(ev)
  }

  return opcoes
}

/**
 * O BANCO: o que é assunto sem ser de um dia.
 *
 * Posição de planeta, aspecto natal, retrogradação em curso, grau crítico, o
 * eixo dos nódulos, os conceitos escritos, os recursos do app e a lua fora de
 * curso. Nenhum deles tem dia certo: valem semanas, ou não dependem do céu.
 *
 * O João marca a ordem uma vez e a fila alimenta os dias sem evento. E são
 * muitos: em trinta dias, só sete têm evento datado.
 *
 * @returns {{id, tipo, titulo, angulo, natureza, formatos, validade}[]}
 */
export function bancoDeAssuntos(data, { catalogos, orbes }) {
  const mapa = mapaDoCeu(data, orbes)
  const itens = []

  /**
   * A lua fora de curso tem DUAS entradas, e são conteúdos diferentes.
   *
   * O AVISO é condicional: tem hora de começo e de fim, então publicá-lo num dia
   * qualquer anunciaria uma janela que não existe. O gerador usa a do dia em que
   * ele for sorteado, e pula se aquele dia não tiver. Sai em story, porque dura
   * horas como o próprio fenômeno.
   *
   * O EXPLICATIVO não tem data nenhuma: é o carrossel que o João escreveu, com
   * o que é, o que não engata e o que rende. Sai quando a fila chegar nele.
   */
  itens.push({
    id: 'luaVazia',
    tipo: 'lua_fora_de_curso',
    titulo: 'Lua fora de curso (aviso do dia)',
    angulo: 'Quando houver no dia, com a janela real, em story',
    natureza: 'educativo',
    formatos: ['story'],
    condicional: true,
  })

  /**
   * A leitura dos doze ascendentes, que era um step à parte no workflow.
   *
   * Rodava toda segunda por calendário, sem passar pela agenda nem pela fila, e
   * fazia a segunda ser o único dia sem peça própria. Como item do banco, ela
   * sai quando estiver no topo da fila, em qualquer dia.
   */
  itens.push({
    id: 'semanal',
    tipo: 'semanal',
    titulo: 'Os doze ascendentes, com a casa de cada um',
    angulo: 'Carrossel de 13 slides, com os eventos da semana em que sair',
    natureza: 'educativo',
    formatos: ['carrossel'],
  })

  /**
   * Os carrosséis de tema entram no banco.
   *
   * São peças de sequência, escritas à mão, e nunca apareciam na editorial:
   * saíam só por comando. No banco, o João marca e a fila publica.
   */
  for (const chave of CHAVES_DE_TEMA) {
    itens.push({
      id: `carrossel:${chave}`,
      tipo: 'carrossel',
      titulo: TEMA[chave].titulo.replace(/\n/g, ' '),
      angulo: `Carrossel de ${TEMA[chave].slides.length} slides, sem data`,
      natureza: 'educativo',
      formatos: ['carrossel'],
    })
  }

  // Estados e posições que não são "evento" mas são assunto. Rodam num ritmo
  // diferente do céu de eventos: a retrogradação dura semanas e é a pergunta
  // mais feita do nicho; o grau crítico troca toda semana; o eixo dos nódulos
  // fica dezoito meses, mas quase ninguém explica.
  const extras = [
    ...retrogradacoesVigentes(data),
    ...grausCriticos(data),
  ]

  const nodulos = eixoDosNodulos(data)
  if (nodulos) {
    // o texto do catálogo vem por signo do Nódulo Norte, e estava parado no app
    const chave = `natal:nn_sign_${SIGNO_EN[nodulos.norte.signo] || ''}`
    const texto = catalogos.noduloPorSigno?.[chave] || ''
    // Metade dos doze textos de nódulo fala com quem lê. Sem assunto é melhor
    // que com assunto errado: o eixo simplesmente não entra nesses signos.
    if (texto && !falaComQuemLe(texto)) {
      extras.push({ ...nodulos, texto, corpoPt: 'Nódulo Norte' })
    }
  }

  for (const ev of extras) {
    const v = escrever(ev)
    itens.push({
      id: idDoAssunto(ev),
      tipo: ev.tipo,
      titulo: v.titulo,
      angulo: anguloDoAssunto(ev),
      natureza: naturezaDoAssunto(ev),
      formatos: formatosDoAssunto(ev),
    })
  }

  // Os educativos são pedidos em sequência, cada um marcando o anterior como
  // usado — é assim que saem três assuntos distintos em vez do mesmo três vezes.
  const usadas = new Set()
  const ingressos = ingressosProximos(data, 40)
  /**
   * TODOS os educativos disponíveis, não só três.
   *
   * O limite de três existia porque eles disputavam espaço na agenda de cada
   * dia. No banco isso deixa de fazer sentido: é uma lista para escolher, e
   * cortar opções à toa esconde assunto bom.
   */
  for (let i = 0; i < 12; i++) {
    const tema = temaEducativo(mapa, catalogos, usadas, { ingressos, data })
    if (!tema || tema.repetido) break
    usadas.add(tema.chave)
    const ev = { ...tema, tipo: 'educativo' }
    itens.push({
      id: idDoAssunto(ev),
      tipo: 'educativo',
      titulo: tema.titulo,
      angulo: anguloDoAssunto(ev),
      natureza: naturezaDoAssunto(ev),
      formatos: formatosDoAssunto(ev),
    })
  }

  /**
   * Os conceitos e os recursos do app.
   *
   * Nunca apareceram na editorial: não dependem de efeméride nenhuma, então não
   * tinham dia para cair. O gerador os escolhia sozinho e o João descobria
   * depois de publicado. No banco, ele escolhe.
   */
  for (const chave of CHAVES_DE_CONCEITO) {
    itens.push({
      id: `conceito:${chave}`,
      tipo: 'conceito',
      titulo: CONCEITO[chave].titulo.replace(/\n/g, ' '),
      angulo: 'Explicativo — vale em qualquer dia',
      natureza: 'educativo',
      formatos: ['post'],
    })
  }

  for (const chave of CHAVES_DE_RECURSO) {
    itens.push({
      id: `recurso:${chave}`,
      tipo: 'recurso',
      titulo: RECURSO[chave].titulo.replace(/\n/g, ' '),
      angulo: `Sobre o app — ${RECURSO[chave].onde}`,
      natureza: 'produto',
      formatos: ['post'],
    })
  }

  return itens
}

/** Acha a opção que a pauta escolheu. `null` quando o id não existe mais. */
export function acharOpcao(opcoes, id) {
  if (!id) return null
  return opcoes.find((o) => o.id === id) || null
}
