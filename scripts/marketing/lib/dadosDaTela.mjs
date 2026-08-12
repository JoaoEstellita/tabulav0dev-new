/**
 * O que cada tela desenhada mostra.
 *
 * A regra que separa este arquivo de uma invenção: **o que dá para calcular é
 * calculado**. As posições dos planetas na roda vêm de `mapaDoCeu`, o mesmo
 * cálculo que alimenta o aplicativo; os eventos da previsão vêm de
 * `eventosProximos`. Só é declarado o que exigiria o motor do app, que é
 * TypeScript e roda no aplicativo: os scores.
 *
 * Por isso nenhuma peça diz "hoje seu score é 72". Ela mostra COMO a
 * informação aparece na tela.
 */
import { DIA_DE_EXEMPLO } from './areasDoApp.mjs'
import { eventosDoDia } from './eventos.mjs'

/** Nomes de exemplo para a tela de grupos, sem sobrenome e sem parecer real. */
const MEMBROS_DE_EXEMPLO = [
  { nome: 'Ana', nota: 'Ascendente Virgem', score: 81 },
  { nome: 'Rafa', nota: 'Ascendente Escorpião', score: 64 },
  { nome: 'Dedé', nota: 'Ascendente Touro', score: 38 },
]

const diaCurto = (d) =>
  new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', timeZone: 'America/Sao_Paulo' })
    .format(d).replace('.', '')

/**
 * @param {string} tela  qual desenho
 * @param {object} deps `{ mapa, limiares, data }`
 */
export function dadosDaTela(tela, { mapa, limiares, data = new Date() } = {}) {
  const corpos = mapa?.corpos || []

  switch (tela) {
    case 'mapa':
      return {
        corpos,
        // o ascendente depende da hora e do lugar de quem nasceu, e a peça não
        // tem dono: fica de fora em vez de inventar um
        ascendente: '',
      }

    case 'transitos': {
      /**
       * Trânsitos reais do dia, com casa de exemplo.
       *
       * O trânsito e a data são calculados; a CASA depende do ascendente de
       * quem está lendo, que a peça não tem. As casas aqui ilustram o formato.
       */
      const eventos = eventosDoDia(data, mapa?.aspectos || [], { antecedencia: 6 })
      const itens = eventos.slice(0, 4).map((e, i) => ({
        titulo: e.corpoPt
          ? `${e.corpoPt} em ${e.signo}`
          : e.fase
            ? `${e.fase} em ${e.signo}`
            : `Céu em ${e.signo || ''}`,
        casa: [10, 4, 7, 1][i % 4],
        quando: e.diasFalta === 0 ? 'hoje' : `em ${e.diasFalta} dia${e.diasFalta > 1 ? 's' : ''}`,
      }))
      return { itens: itens.length ? itens : [{ titulo: 'Sol em Leão', casa: 10, quando: 'hoje' }] }
    }

    case 'previsao': {
      const eventos = eventosDoDia(data, mapa?.aspectos || [], { antecedencia: 20 })
      const itens = eventos.slice(0, 4).map((e) => ({
        dia: diaCurto(e.quando || data),
        titulo: e.corpoPt
          ? `${e.corpoPt} entra em ${e.signo}`
          : e.fase
            ? `${e.fase} em ${e.signo}`
            : e.tipo === 'eclipse'
              ? `Eclipse em ${e.signo}`
              : `${e.signo || ''}`,
        nota: e.diasFalta === 0 ? 'hoje' : `faltam ${e.diasFalta} dias`,
      }))
      return { itens }
    }

    case 'grupos':
      return { membros: MEMBROS_DE_EXEMPLO, limiares }

    case 'inicio':
    case 'perfil':
    default:
      return { ...DIA_DE_EXEMPLO, limiares }
  }
}
