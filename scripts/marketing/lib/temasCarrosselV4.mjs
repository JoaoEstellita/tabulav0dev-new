/**
 * Os temas do carrossel v4 — textos DENSOS, escritos à mão (não fatiados).
 *
 * É o "banco do editor": cada tema é uma peça de conteúdo curada, no padrão que
 * o João aprovou. O gerador monta o visual; o texto vem daqui. Novos temas
 * entram um a um, escritos e aprovados — como os textos de trânsito, e pelo
 * mesmo motivo (texto de tabela sai genérico).
 *
 * Cada tema declara `cena` (o tipo que vira o prompt da imagem IA da capa) e a
 * lista de slides. Os slides de texto trazem a figura (roda/diagrama real).
 */
import { diagramaAspecto, diagramaAngulos, diagramaCasas } from './diagramaFato.mjs'

export const TEMAS_V4 = {
  aspectos_movimento: {
    cena: 'aspecto',
    slides: [
      {
        tipo: 'capa', olho: 'Técnica · Aspectos',
        titulo: 'Um aspecto *chegando* pesa mais que um *indo embora*.',
        corpo: 'Aspecto não é uma foto — é um movimento. A tradição sempre olhou se ele está se formando ou se desfazendo.',
      },
      {
        tipo: 'texto', olho: 'Aplicando',
        titulo: 'O que ainda vai *acontecer*.',
        corpo: 'Quando o planeta mais rápido do par se aproxima do grau exato, o aspecto está aplicando: em formação, ativo, apontando pra frente. É a promessa que ainda vai se cumprir, a força que cresce e quer acontecer.',
        figura: diagramaAspecto({ agente: 'Venus', alvo: 'Jupiter', angulo: 120, destaque: 'Venus' }),
      },
      {
        tipo: 'texto', olho: 'Separando',
        titulo: 'O que já *passou*.',
        corpo: 'Depois do grau exato, o planeta rápido se afasta: o aspecto está separando. Já aconteceu, agora só libera o que ficou. A tradição lê como passado, algo que se integra e vai esvaindo, perdendo pressão.',
        figura: diagramaAspecto({ agente: 'Venus', alvo: 'Jupiter', angulo: 120, destaque: 'Jupiter' }),
      },
      {
        tipo: 'texto', olho: 'Como saber',
        titulo: 'Quem decide é a *velocidade*.',
        corpo: 'Olhe o planeta mais veloz do par: a Lua vai à frente, depois Mercúrio, Vênus, o Sol. Se ele ainda caminha rumo ao grau exato, aplica; se já passou, separa. Retrogradação inverte o sentido, e por isso quem manda é a velocidade.',
        figura: diagramaAngulos(),
      },
      {
        tipo: 'cta', olho: 'Tábula Estelar',
        titulo: 'Quais aspectos do seu mapa estão se *formando*?',
        corpo: 'No Perfil, cada aspecto vem com a leitura, e diz se está aplicando ou separando.',
        cta: 'Veja seu mapa · link na bio',
      },
    ],
    legenda:
      'Um aspecto chegando vale mais que um aspecto indo embora. Parece detalhe, mas muda a leitura inteira: aspecto não é uma foto, é um movimento.\n\n' +
      'Aplicando: quando o planeta mais rápido do par se aproxima do grau exato, o aspecto está em formação, ativo, apontando pra frente. É a promessa que ainda vai se cumprir.\n\n' +
      'Separando: depois do grau exato, o planeta se afasta. Já aconteceu, agora só libera o que ficou. A tradição lê como passado.\n\n' +
      'Como saber qual é? Olhe o planeta veloz do par. Se ainda caminha em direção ao grau exato, aplica; se já passou, separa. Retrogradação inverte o sentido.\n\n' +
      'No seu mapa, um aspecto aplicando é central, em desenvolvimento; um separando é herança que se solta. Veja os seus no link da bio.',
  },

  casas_onde: {
    cena: 'conceito',
    slides: [
      {
        tipo: 'capa', olho: 'Astrologia · Casas',
        titulo: 'As casas dizem *onde*. Os signos dizem *como*.',
        corpo: 'Todo mundo aprende o signo. Quase ninguém aprende as casas — e é a casa que diz em que área da vida a coisa acontece.',
        figura: diagramaCasas(),
      },
      {
        tipo: 'texto', olho: 'As doze',
        titulo: 'Doze fatias de *vida*.',
        corpo: 'O mapa se divide em doze casas, e cada uma cuida de um pedaço da vida: corpo, dinheiro, família, trabalho, amor, saúde. O planeta no signo dá o tom; na casa, dá o palco onde ele age.',
        figura: diagramaCasas(),
      },
      {
        tipo: 'texto', olho: 'Mesmo céu, casas diferentes',
        titulo: 'Por que te afeta *diferente*.',
        corpo: 'É por isso que o mesmo eclipse mexe com a carreira de uma pessoa e com o casamento de outra. O céu é o mesmo para todos; as casas dependem da sua hora e do seu lugar de nascimento.',
        figura: diagramaCasas(),
      },
      {
        tipo: 'texto', olho: 'Onde começa',
        titulo: 'A hora *importa*.',
        corpo: 'A primeira casa começa no seu Ascendente, o grau que subia no horizonte quando você nasceu. Erra a hora e as doze casas giram: o mapa inteiro muda de endereço.',
        figura: diagramaCasas(),
      },
      {
        tipo: 'cta', olho: 'Tábula Estelar',
        titulo: 'Em que casa cada planeta seu *caiu*?',
        corpo: 'No Perfil, cada planeta vem com o signo e a casa, calculados da sua hora e do seu lugar.',
        cta: 'Veja seu mapa · link na bio',
      },
    ],
    legenda:
      'As casas dizem onde. Os signos dizem como. Todo mundo aprende o signo, quase ninguém aprende as casas — e é a casa que diz em qual área da vida a coisa acontece.\n\n' +
      'O mapa se divide em doze casas, cada uma cuidando de um pedaço da vida: corpo, dinheiro, família, trabalho, amor, saúde. O planeta no signo dá o tom; na casa, dá o palco.\n\n' +
      'É por isso que o mesmo eclipse mexe com a carreira de uma pessoa e com o casamento de outra. O céu é o mesmo para todos, mas as casas dependem da sua hora e do seu lugar de nascimento.\n\n' +
      'A primeira casa começa no seu Ascendente, o grau que subia no horizonte quando você nasceu. Por isso a hora importa: erra a hora e as doze casas giram.\n\n' +
      'No seu mapa, cada planeta vem com o signo e a casa. Veja o seu no link da bio.',
  },
}

/** Os slides prontos de um tema, com `n`/`total` preenchidos. */
export function slidesDoTema(chave) {
  const tema = TEMAS_V4[chave]
  if (!tema) return null
  const total = tema.slides.length
  return {
    cena: tema.cena,
    legenda: tema.legenda,
    slides: tema.slides.map((s, i) => ({ ...s, n: i + 1, total })),
  }
}
