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
import { diagramaAspecto, diagramaAngulos, diagramaCasas, diagramaFase } from './diagramaFato.mjs'

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

  ascendente_porta: {
    cena: 'conceito',
    slides: [
      {
        tipo: 'capa', olho: 'Astrologia · Ascendente',
        titulo: 'Você não é só o seu *signo*.',
        corpo: 'O signo do Sol é o começo da conversa. O Ascendente é como você entra na sala — e muda tudo o que vem depois.',
        figura: diagramaCasas(),
      },
      {
        tipo: 'texto', olho: 'O que é',
        titulo: 'O que *subia* quando você nasceu.',
        corpo: 'O Ascendente é o signo que subia no horizonte leste na hora exata do seu nascimento. Ele troca a cada duas horas, mais ou menos: é o que separa duas pessoas nascidas no mesmo dia.',
        figura: diagramaCasas(),
      },
      {
        tipo: 'texto', olho: 'Por que pesa',
        titulo: 'Ele monta o *mapa* inteiro.',
        corpo: 'É por ele que começa a primeira casa, e a partir dela todas as outras. Dois mapas com o mesmo Sol e Ascendentes diferentes têm os planetas em casas diferentes: a mesma energia, palcos diferentes.',
        figura: diagramaCasas(),
      },
      {
        tipo: 'texto', olho: 'A hora',
        titulo: 'Sem a hora, é *chute*.',
        corpo: 'Por isso a hora de nascimento importa tanto. Sem ela, o Ascendente é palpite e o mapa fica sem endereço. Com ela, cada planeta encontra a sua casa.',
        figura: diagramaCasas(),
      },
      {
        tipo: 'cta', olho: 'Tábula Estelar',
        titulo: 'Qual é o seu *Ascendente*?',
        corpo: 'No app ele sai calculado da sua hora e cidade, junto com o mapa inteiro.',
        cta: 'Veja o seu · link na bio',
      },
    ],
    legenda:
      'Você não é só o seu signo solar. O Ascendente é o signo que subia no horizonte leste na hora exata em que você nasceu, e ele troca a cada duas horas.\n\n' +
      'É por ele que começa a primeira casa, e a partir dela todas as outras. Dois mapas com o mesmo Sol e Ascendentes diferentes têm os planetas em casas diferentes.\n\n' +
      'Por isso a hora de nascimento importa tanto: sem ela, o Ascendente é palpite e o mapa fica sem endereço.\n\n' +
      'No app, o seu Ascendente sai calculado da sua hora e cidade. Veja no link da bio.',
  },

  fases_ciclo: {
    cena: 'fase',
    slides: [
      {
        tipo: 'capa', olho: 'Astrologia · Lua',
        titulo: 'A Lua conta um ciclo em *quatro atos*.',
        corpo: 'A cada 29 dias a Lua repete a mesma história: começa, cresce, enche, mingua. Saber em que ato ela está é saber o tom do momento.',
        figura: diagramaFase({ fase: 'Lua Nova', luminar: 'Moon' }),
      },
      {
        tipo: 'texto', olho: 'Lua Nova',
        titulo: 'O começo no *escuro*.',
        corpo: 'Na Lua Nova ela se alinha ao Sol e o céu fica escuro: é o zero do ciclo, a hora de plantar uma intenção que ainda ninguém vê.',
        figura: diagramaFase({ fase: 'Lua Nova', luminar: 'Moon' }),
      },
      {
        tipo: 'texto', olho: 'Crescente e Cheia',
        titulo: 'A tensão vira *luz*.',
        corpo: 'No quarto crescente, a 90° do Sol, o que começou encontra a primeira resistência. Na Lua Cheia, a 180°, tudo aparece à luz — para o bem e para o incômodo.',
        figura: diagramaFase({ fase: 'Lua Cheia', luminar: 'Moon' }),
      },
      {
        tipo: 'texto', olho: 'Minguante',
        titulo: 'A hora de *soltar*.',
        corpo: 'No minguante a Lua se esvazia rumo à próxima Nova: é o tempo de revisar, terminar, deixar ir. O ciclo não para, só troca de fase.',
        figura: diagramaFase({ fase: 'Quarto Minguante', luminar: 'Moon' }),
      },
      {
        tipo: 'cta', olho: 'Tábula Estelar',
        titulo: 'Em que fase a Lua está *hoje*?',
        corpo: 'No app, o céu de hoje mostra a fase e o que ela toca no seu mapa.',
        cta: 'Veja o céu de hoje · link na bio',
      },
    ],
    legenda:
      'A Lua conta um ciclo em quatro atos, e ele se repete a cada 29 dias: começa, cresce, enche, mingua.\n\n' +
      'Na Lua Nova ela se alinha ao Sol e o céu fica escuro — é o zero do ciclo, a hora de plantar. No quarto crescente, a 90°, o começo encontra a primeira resistência.\n\n' +
      'Na Lua Cheia, a 180° do Sol, tudo aparece à luz. No minguante ela se esvazia rumo à próxima Nova: tempo de revisar, terminar, soltar.\n\n' +
      'No app, o céu de hoje mostra em que fase a Lua está e o que ela toca no seu mapa. Veja no link da bio.',
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
