/**
 * O que dizem, e o que o mapa diz.
 *
 * ── DE ONDE VEIO ───────────────────────────────────────────────────────────
 *
 * O João apontou o realastrology.ai: 1.237 seguidores, proposta quase idêntica
 * à dele (astrologia tradicional mais IA, mapa completo e gratuito, planetas,
 * casas, aspectos e dignidades) e um diferencial que não é o produto. É o
 * REGISTRO: meme, o clichê contra a leitura de verdade.
 *
 * ── POR QUE ISTO NÃO É A VOZ DA CAMPANHA ───────────────────────────────────
 *
 * A voz sóbria das peças de leitura foi escolhida e medida, e continua valendo
 * onde vale. O meme é outro formato, com outra régua, e misturar os dois no
 * mesmo texto estraga os dois: leitura com piada perde autoridade, e piada com
 * ressalva perde a graça.
 *
 * Por isso os pares moram aqui e não em `textosConceito.mjs`, e por isso
 * `linguagem.spec` não roda sobre eles. A régua deste arquivo é outra, e está
 * escrita abaixo.
 *
 * ── A RÉGUA DO MEME ────────────────────────────────────────────────────────
 *
 * 1. O clichê é o que REALMENTE se lê por aí, não um espantalho. Se ninguém
 *    reconhecer a primeira metade, a segunda não tem contra o que bater.
 * 2. A segunda metade é técnica e verificável. A piada é a precisão, não o
 *    deboche — rir do leitor afasta o leitor.
 * 3. Nunca ridicularizar o signo. Quem lê tem aquele signo.
 * 4. Sem emoji e sem gíria. O contraste já é o humor.
 *
 * ── DE ONDE SAI O CONTEÚDO ─────────────────────────────────────────────────
 *
 * Das dignidades, quase de graça. `dignidade()` em `interpretacao.mjs` já sabe
 * que Vênus está em queda em Virgem e que Marte está em queda em Câncer, e o
 * clichê de cada signo é conhecido. O par se escreve sozinho.
 */

export const MEME = {
  venusVirgem: {
    chave: 'venus|Virgem',
    dizem: 'Vênus em Virgem é fria e não sabe amar.',
    mapa: 'Vênus está em queda em Virgem: a tradição diz que ali ela tem menos ' +
      'força para agir como de costume. Não é ausência de amor. É amor que se ' +
      'demonstra conferindo, consertando e lembrando do detalhe, em vez de ' +
      'declarar.',
  },

  marteCancer: {
    chave: 'mars|Câncer',
    dizem: 'Marte em Câncer é passivo-agressivo.',
    mapa: 'Marte está em queda em Câncer. A vontade não some, ela deixa de ir ' +
      'em linha reta: luta pelos seus antes de lutar por si, e demora a admitir ' +
      'raiva. O que parece rodeio é uma estratégia diferente, não a falta de uma.',
  },

  solLibra: {
    chave: 'sun|Libra',
    dizem: 'Libra é indeciso.',
    mapa: 'O Sol está em queda em Libra, no signo oposto ao que ele governa. A ' +
      'identidade se forma no encontro, não sozinha. Não é falta de opinião. É ' +
      'que a opinião passa pelo outro antes de existir, e isso leva tempo.',
  },

  saturnoAries: {
    chave: 'saturn|Áries',
    dizem: 'Saturno é o planeta do castigo.',
    mapa: 'Saturno é o planeta do tempo e do limite. Em Áries ele está em ' +
      'queda, porque Áries não espera e Saturno só sabe esperar. O resultado é ' +
      'quem aprende a começar tropeçando na própria pressa, e amadurece de uma ' +
      'vez, tarde.',
  },

  mercurioPeixes: {
    chave: 'mercury|Peixes',
    dizem: 'Mercúrio em Peixes é desatento.',
    mapa: 'Mercúrio está duas vezes desconfortável em Peixes, em exílio e em ' +
      'queda. Ele separa, Peixes mistura. O que sai disso não é falta de ' +
      'atenção: é uma cabeça que entende pelo clima e trava no prazo, no nome ' +
      'e no número.',
  },

  luaEscorpiao: {
    chave: 'moon|Escorpião',
    dizem: 'Lua em Escorpião é vingativa.',
    mapa: 'A Lua está em queda em Escorpião, o signo onde nada dela pode ser ' +
      'mostrado sem risco. O sentimento não diminui, ele se esconde e ' +
      'aprofunda. O que parece rancor costuma ser memória afetiva que ninguém ' +
      'ajudou a processar.',
  },

  jupiterVirgem: {
    chave: 'jupiter|Virgem',
    dizem: 'Júpiter é o planeta da sorte.',
    mapa: 'Júpiter é o planeta do que cresce, e crescer nem sempre é sorte. Em ' +
      'Virgem ele está em exílio, porque Virgem reduz ao que funciona e Júpiter ' +
      'quer ampliar. Ali o crescimento vem pelo detalhe, não pelo salto.',
  },

  ascendente: {
    chave: 'ascendente',
    dizem: 'Ascendente é a máscara social.',
    mapa: 'O ascendente é o grau que subia no horizonte leste no minuto do ' +
      'nascimento. Ele define onde começa a primeira casa, e por isso decide a ' +
      'posição das outras onze. Não é acessório do mapa. É o que organiza o ' +
      'mapa inteiro.',
  },
}

export const CHAVES_DE_MEME = Object.keys(MEME)

/** Um par, pelo id. Erro explícito quando o id não existe. */
export function memePorId(id) {
  if (!MEME[id]) {
    throw new Error(`meme "${id}" não existe. Há: ${CHAVES_DE_MEME.join(', ')}`)
  }
  return { id, ...MEME[id] }
}
