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
 *
 * ⚠️ E nada de VEREDICTO. A primeira versão decretava resultados sobre a
 * pessoa — "a imagem que você passa incomoda", "o controle vira disputa", "a
 * ação esbarra e irrita". Relatado na tela: ficou forte demais. Lidas todo dia,
 * uma depois da outra, essas frases fazem o app soar como quem repreende.
 *
 * O ajuste não é suavizar com "pode ser que" — isso tira a assertividade sem
 * devolver informação. É dizer O QUE MUDA E EM RELAÇÃO A QUÊ: "encontra mais
 * resistência que o normal" afirma com a mesma firmeza, descreve o mecanismo em
 * vez de julgar quem lê, e situa o dia contra a linha de base da pessoa — que é
 * justamente o que um trânsito significa.
 *
 * Vale para os dois lados: o `facil` prometia demais ("as portas abrem com
 * facilidade"). Promessa que não se cumpre custa confiança igual.
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
    tenso: E('o que você quer fazer encontra mais resistência que o normal', 'what you want to do meets more resistance than usual', 'lo que quieres hacer encuentra mas resistencia que lo normal', 'cio che vuoi fare incontra piu resistenza del solito'),
    facil: E('o que você quer fazer encontra menos atrito que o normal', 'what you want to do meets less friction than usual', 'lo que quieres hacer encuentra menos roce que lo normal', 'cio che vuoi fare incontra meno attrito del solito'),
  },
  moon: {
    nome: E('o seu humor', 'your mood', 'tu animo', 'il tuo umore'),
    tenso: E('o humor muda mais rápido do que você consegue acompanhar', 'your mood shifts faster than you can keep up with', 'el animo cambia mas rapido de lo que puedes seguir', 'l umore cambia piu in fretta di quanto riesci a seguire'),
    facil: E('o humor acompanha o que você faz, sem puxar para outro lado', 'your mood follows what you do, without pulling elsewhere', 'el animo acompana lo que haces, sin tirar para otro lado', 'l umore accompagna cio che fai, senza tirare altrove'),
  },
  mercury: {
    nome: E('a sua comunicação', 'your communication', 'tu comunicacion', 'la tua comunicazione'),
    tenso: E('conversas e raciocínio pedem mais atenção que o normal', 'talking and thinking need more care than usual', 'conversar y razonar piden mas atencion que lo normal', 'parlare e ragionare chiedono piu attenzione del solito'),
    facil: E('as ideias saem mais claras do que de costume', 'ideas come out clearer than usual', 'las ideas salen mas claras que de costumbre', 'le idee escono piu chiare del solito'),
  },
  venus: {
    nome: E('os seus afetos', 'your affections', 'tus afectos', 'i tuoi affetti'),
    tenso: E('as trocas afetivas exigem mais esforço que o normal', 'affectionate exchanges take more effort than usual', 'los intercambios afectivos exigen mas esfuerzo que lo normal', 'gli scambi affettivi richiedono piu sforzo del solito'),
    facil: E('as trocas afetivas acontecem com menos esforço', 'affectionate exchanges happen with less effort', 'los intercambios afectivos ocurren con menos esfuerzo', 'gli scambi affettivi avvengono con meno sforzo'),
  },
  mars: {
    nome: E('a sua ação', 'your drive to act', 'tu accion', 'la tua azione'),
    tenso: E('agir encontra mais obstáculo do que de costume', 'acting meets more obstacles than usual', 'actuar encuentra mas obstaculos que de costumbre', 'agire incontra piu ostacoli del solito'),
    facil: E('agir encontra menos obstáculo do que de costume', 'acting meets fewer obstacles than usual', 'actuar encuentra menos obstaculos que de costumbre', 'agire incontra meno ostacoli del solito'),
  },
  jupiter: {
    nome: E('a sua expansão', 'your sense of expansion', 'tu expansion', 'la tua espansione'),
    tenso: E('o impulso de ampliar pede mais critério que o normal', 'the urge to expand needs more judgement than usual', 'el impulso de ampliar pide mas criterio que lo normal', 'la spinta ad ampliare chiede piu criterio del solito'),
    facil: E('ampliar custa menos esforço do que de costume', 'expanding takes less effort than usual', 'ampliar cuesta menos esfuerzo que de costumbre', 'ampliare costa meno sforzo del solito'),
  },
  saturn: {
    nome: E('a sua estrutura', 'your structure', 'tu estructura', 'la tua struttura'),
    tenso: E('compromissos e limites pesam mais que o normal', 'commitments and limits weigh more than usual', 'compromisos y limites pesan mas que lo normal', 'impegni e limiti pesano piu del solito'),
    facil: E('o que você constrói se sustenta com menos esforço', 'what you build holds up with less effort', 'lo que construyes se sostiene con menos esfuerzo', 'cio che costruisci si regge con meno sforzo'),
  },
  uranus: {
    nome: E('a sua inquietação', 'your restlessness', 'tu inquietud', 'la tua inquietudine'),
    tenso: E('o imprevisto desorganiza a rotina mais que o normal', 'the unexpected disrupts routine more than usual', 'lo imprevisto desorganiza la rutina mas que lo normal', 'l imprevisto disorganizza la routine piu del solito'),
    facil: E('mudanças acontecem com menos sobressalto que o normal', 'changes happen with less of a jolt than usual', 'los cambios ocurren con menos sobresalto que lo normal', 'i cambiamenti avvengono con meno scossa del solito'),
  },
  neptune: {
    nome: E('a sua imaginação', 'your imagination', 'tu imaginacion', 'la tua immaginazione'),
    tenso: E('a clareza custa mais e o cansaço aparece antes', 'clarity costs more and tiredness shows up earlier', 'la claridad cuesta mas y el cansancio aparece antes', 'la chiarezza costa di piu e la stanchezza arriva prima'),
    facil: E('a intuição fica mais afiada que o normal', 'intuition gets sharper than usual', 'la intuicion se afina mas que lo normal', 'l intuito si affina piu del solito'),
  },
  pluto: {
    nome: E('o seu poder pessoal', 'your personal power', 'tu poder personal', 'il tuo potere personale'),
    tenso: E('questões de controle aparecem mais que o normal', 'control issues come up more than usual', 'los temas de control aparecen mas que lo normal', 'le questioni di controllo emergono piu del solito'),
    facil: E('a sua força se concentra melhor onde importa', 'your strength gathers better where it matters', 'tu fuerza se concentra mejor donde importa', 'la tua forza si concentra meglio dove conta'),
  },
  meio_do_ceu: {
    nome: E('a sua carreira', 'your career', 'tu carrera', 'la tua carriera'),
    tenso: E('a carreira exige e expõe mais que o normal', 'career demands and exposes more than usual', 'la carrera exige y expone mas que lo normal', 'la carriera chiede ed espone piu del solito'),
    facil: E('a carreira anda com menos atrito que o normal', 'career moves with less friction than usual', 'la carrera avanza con menos roce que lo normal', 'la carriera avanza con meno attrito del solito'),
  },
  ascendente: {
    nome: E('a sua presença', 'your presence', 'tu presencia', 'la tua presenza'),
    tenso: E('o jeito como você aparece encontra mais resistência que o normal', 'the way you come across meets more resistance than usual', 'la forma en que apareces encuentra mas resistencia que lo normal', 'il modo in cui ti presenti incontra piu resistenza del solito'),
    facil: E('o jeito como você aparece abre caminho com mais facilidade', 'the way you come across opens doors more easily', 'la forma en que apareces abre camino con mas facilidad', 'il modo in cui ti presenti apre strada piu facilmente'),
  },
  northnode: {
    nome: E('a sua direção', 'your direction', 'tu direccion', 'la tua direzione'),
    tenso: E('o rumo fica menos nítido que o normal', 'the path gets less clear than usual', 'el rumbo queda menos nitido que lo normal', 'la rotta risulta meno nitida del solito'),
    facil: E('o rumo fica mais nítido que o normal', 'the path gets clearer than usual', 'el rumbo queda mas nitido que lo normal', 'la rotta risulta piu nitida del solito'),
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
