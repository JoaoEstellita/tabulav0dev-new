import type { AppLanguage } from './astro/pt'

/**
 * O que acontece quando um trânsito toca um ponto do mapa.
 *
 * Existe porque a síntese estava dizendo coisas como "o Sol em atrito e a Lua
 * em fluxo", e depois comentando o próprio texto: "o dia fica dividido entre os
 * dois — e isso é informação, não contradição". Meta-comentário não informa
 * nada; só ocupa espaço parecendo inteligente.
 *
 * "Em atrito" também não informa: diz a GEOMETRIA, não o efeito. O que a pessoa
 * precisa saber é o que fica difícil e o que fica fácil. Aqui cada ponto tem
 * uma frase para quando é pressionado e outra para quando é favorecido —
 * concretas, no presente, sem promessa.
 *
 * Regra de escrita: oração curta, sujeito concreto, verbo no presente. Nada de
 * "pode ser que", "tende a" ou "é hora de".
 */

type Par = Record<AppLanguage, string>
interface EfeitoDoPonto {
  /** Como o ponto é chamado numa frase ("a sua imaginação"). */
  nome: Par
  /** Quando recebe aspecto tenso. */
  tenso: Par
  /** Quando recebe aspecto harmônico. */
  facil: Par
}

const E = (pt: string, en: string, es: string, it: string): Par =>
  ({ 'pt-BR': pt, 'en-US': en, 'es-ES': es, 'it-IT': it })

const PONTOS: Record<string, EfeitoDoPonto> = {
  sun: {
    nome: E('a sua vitalidade', 'your vitality', 'tu vitalidad', 'la tua vitalita'),
    tenso: E('a vontade encontra resistência', 'your drive meets resistance', 'la voluntad encuentra resistencia', 'la volonta incontra resistenza'),
    facil: E('a vontade encontra caminho', 'your drive finds a way', 'la voluntad encuentra camino', 'la volonta trova strada'),
  },
  moon: {
    nome: E('o seu humor', 'your mood', 'tu animo', 'il tuo umore'),
    tenso: E('o humor oscila e cansa', 'your mood swings and tires', 'el animo oscila y cansa', 'l umore oscilla e stanca'),
    facil: E('o humor acompanha o que você faz', 'your mood follows what you do', 'el animo acompana lo que haces', 'l umore accompagna cio che fai'),
  },
  mercury: {
    nome: E('a sua comunicação', 'your communication', 'tu comunicacion', 'la tua comunicazione'),
    tenso: E('conversa e raciocínio travam', 'talk and thinking get stuck', 'conversacion y razonamiento se traban', 'parola e ragionamento si bloccano'),
    facil: E('as ideias saem com clareza', 'ideas come out clearly', 'las ideas salen con claridad', 'le idee escono con chiarezza'),
  },
  venus: {
    nome: E('os seus afetos', 'your affections', 'tus afectos', 'i tuoi affetti'),
    tenso: E('o afeto cobra mais do que dá', 'affection asks more than it gives', 'el afecto cobra mas de lo que da', 'l affetto chiede piu di quanto da'),
    facil: E('o afeto corre sem esforço', 'affection flows without effort', 'el afecto corre sin esfuerzo', 'l affetto scorre senza sforzo'),
  },
  mars: {
    nome: E('a sua ação', 'your drive to act', 'tu accion', 'la tua azione'),
    tenso: E('a ação esbarra e irrita', 'action bumps and irritates', 'la accion tropieza e irrita', 'l azione urta e irrita'),
    facil: E('a ação rende', 'action pays off', 'la accion rinde', 'l azione rende'),
  },
  jupiter: {
    nome: E('a sua expansão', 'your sense of expansion', 'tu expansion', 'la tua espansione'),
    tenso: E('o excesso cobra a conta', 'excess sends the bill', 'el exceso pasa la cuenta', 'l eccesso presenta il conto'),
    facil: E('as portas abrem com facilidade', 'doors open easily', 'las puertas abren con facilidad', 'le porte si aprono facilmente'),
  },
  saturn: {
    nome: E('a sua estrutura', 'your structure', 'tu estructura', 'la tua struttura'),
    tenso: E('a estrutura pesa e limita', 'structure weighs and limits', 'la estructura pesa y limita', 'la struttura pesa e limita'),
    facil: E('a estrutura sustenta o que você constrói', 'structure holds what you build', 'la estructura sostiene lo que construyes', 'la struttura sostiene cio che costruisci'),
  },
  uranus: {
    nome: E('a sua inquietação', 'your restlessness', 'tu inquietud', 'la tua inquietudine'),
    tenso: E('o imprevisto desorganiza a rotina', 'the unexpected disrupts routine', 'lo imprevisto desorganiza la rutina', 'l imprevisto disorganizza la routine'),
    facil: E('a mudança vem sem susto', 'change comes without a scare', 'el cambio viene sin susto', 'il cambiamento arriva senza spavento'),
  },
  neptune: {
    nome: E('a sua imaginação', 'your imagination', 'tu imaginacion', 'la tua immaginazione'),
    tenso: E('a clareza se perde e o cansaço vem', 'clarity blurs and tiredness comes', 'la claridad se pierde y llega el cansancio', 'la chiarezza si perde e arriva la stanchezza'),
    facil: E('a intuição fica afiada', 'intuition gets sharp', 'la intuicion se afina', 'l intuito si affina'),
  },
  pluto: {
    nome: E('o seu poder pessoal', 'your personal power', 'tu poder personal', 'il tuo potere personale'),
    tenso: E('o controle vira disputa', 'control turns into a dispute', 'el control se vuelve disputa', 'il controllo diventa disputa'),
    facil: E('a força se concentra onde importa', 'strength gathers where it matters', 'la fuerza se concentra donde importa', 'la forza si concentra dove conta'),
  },
  meio_do_ceu: {
    nome: E('a sua carreira', 'your career', 'tu carrera', 'la tua carriera'),
    tenso: E('a carreira cobra e expõe', 'career demands and exposes', 'la carrera cobra y expone', 'la carriera chiede ed espone'),
    facil: E('a carreira anda', 'career moves', 'la carrera avanza', 'la carriera avanza'),
  },
  ascendente: {
    nome: E('a sua presença', 'your presence', 'tu presencia', 'la tua presenza'),
    tenso: E('a imagem que você passa incomoda', 'the image you project grates', 'la imagen que das incomoda', 'l immagine che dai infastidisce'),
    facil: E('a presença abre portas', 'your presence opens doors', 'la presencia abre puertas', 'la presenza apre porte'),
  },
  northnode: {
    nome: E('a sua direção', 'your direction', 'tu direccion', 'la tua direzione'),
    tenso: E('o rumo fica confuso', 'the path gets confusing', 'el rumbo se vuelve confuso', 'la rotta diventa confusa'),
    facil: E('o rumo fica claro', 'the path gets clear', 'el rumbo se aclara', 'la rotta si chiarisce'),
  },
}

const chave = (alvo: string): string =>
  String(alvo || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z]/g, '')

/** Aceita as grafias que chegam do motor e do catálogo. */
const ALIAS: Record<string, string> = {
  meiodoceu: 'meio_do_ceu', midheaven: 'meio_do_ceu', mc: 'meio_do_ceu',
  ascendant: 'ascendente', asc: 'ascendente',
  nodonorte: 'northnode', northnode: 'northnode', nortenode: 'northnode',
}

function achar(alvo: string): EfeitoDoPonto | null {
  const k = chave(alvo)
  return PONTOS[ALIAS[k] || k] || null
}

/** "a sua imaginação" — como o ponto entra numa frase. */
export function nomeDoPonto(alvo: string, idioma: AppLanguage = 'pt-BR'): string | null {
  return achar(alvo)?.nome[idioma] || null
}

/**
 * O efeito concreto, no presente.
 *
 * `natureza` vem do aspecto: tenso pressiona, harmônico facilita. A conjunção
 * não tem natureza própria — quem decide é o planeta que transita, e isso é
 * resolvido antes de chegar aqui.
 */
export function efeitoNoPonto(
  alvo: string,
  natureza: 'tenso' | 'facil',
  idioma: AppLanguage = 'pt-BR',
): string | null {
  const p = achar(alvo)
  if (!p) return null
  return (natureza === 'tenso' ? p.tenso : p.facil)[idioma] || null
}
