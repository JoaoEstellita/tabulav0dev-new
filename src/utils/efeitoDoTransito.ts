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
  /**
   * Quando recebe os DOIS ao mesmo tempo.
   *
   * ⚠️ Sem este terceiro texto, a frase colava `tenso` e `facil` com um "mas"
   * — e como os dois foram escritos como espelhos ("mais obstáculo que o
   * normal" / "menos obstáculo que o normal"), o resultado era absurdo:
   *
   *     "Agir encontra mais obstáculo do que de costume — mas agir
   *      encontra menos obstáculo do que de costume."
   *
   * Colar funcionava só por acaso, quando os dois lados falavam de sujeitos
   * diferentes ("a clareza custa mais… mas a intuição fica mais afiada").
   * Quando o sujeito era o mesmo, a frase se desdizia.
   *
   * A situação é real e comum — um trânsito pressiona o ponto enquanto outro
   * o favorece. Então ela merece texto próprio, que descreve a DIVISÃO em vez
   * de empilhar duas afirmações opostas.
   */
  misto: Par
}

const E = (pt: string, en: string, es: string, it: string): Par =>
  ({ 'pt-BR': pt, 'en-US': en, 'es-ES': es, 'it-IT': it })

const PONTOS: Record<string, EfeitoDoPonto> = {
  sun: {
    nome: E('a sua vitalidade', 'your vitality', 'tu vitalidad', 'la tua vitalita'),
    tenso: E('o que você quer fazer encontra mais resistência que o normal', 'what you want to do meets more resistance than usual', 'lo que quieres hacer encuentra mas resistencia que lo normal', 'cio che vuoi fare incontra piu resistenza del solito'),
    facil: E('o que você quer fazer encontra menos atrito que o normal', 'what you want to do meets less friction than usual', 'lo que quieres hacer encuentra menos roce que lo normal', 'cio che vuoi fare incontra meno attrito del solito'),
    misto: E('a vontade avança numa frente e trava em outra', 'your drive moves on one front and stalls on another', 'la voluntad avanza en un frente y se traba en otro', 'la volonta avanza su un fronte e si blocca su un altro'),
  },
  moon: {
    nome: E('o seu humor', 'your mood', 'tu animo', 'il tuo umore'),
    tenso: E('o humor muda mais rápido do que você consegue acompanhar', 'your mood shifts faster than you can keep up with', 'el animo cambia mas rapido de lo que puedes seguir', 'l umore cambia piu in fretta di quanto riesci a seguire'),
    facil: E('o humor acompanha o que você faz, sem puxar para outro lado', 'your mood follows what you do, without pulling elsewhere', 'el animo acompana lo que haces, sin tirar para otro lado', 'l umore accompagna cio che fai, senza tirare altrove'),
    misto: E('o humor oscila entre acompanhar e pesar', 'your mood swings between following along and weighing down', 'el animo oscila entre acompanar y pesar', 'l umore oscilla tra accompagnare e pesare'),
  },
  mercury: {
    nome: E('a sua comunicação', 'your communication', 'tu comunicacion', 'la tua comunicazione'),
    tenso: E('conversas e raciocínio pedem mais atenção que o normal', 'talking and thinking need more care than usual', 'conversar y razonar piden mas atencion que lo normal', 'parlare e ragionare chiedono piu attenzione del solito'),
    facil: E('as ideias saem mais claras do que de costume', 'ideas come out clearer than usual', 'las ideas salen mas claras que de costumbre', 'le idee escono piu chiare del solito'),
    misto: E('algumas conversas fluem e outras travam', 'some conversations flow and others get stuck', 'algunas conversaciones fluyen y otras se traban', 'alcune conversazioni scorrono e altre si bloccano'),
  },
  venus: {
    nome: E('os seus afetos', 'your affections', 'tus afectos', 'i tuoi affetti'),
    tenso: E('as trocas afetivas exigem mais esforço que o normal', 'affectionate exchanges take more effort than usual', 'los intercambios afectivos exigen mas esfuerzo que lo normal', 'gli scambi affettivi richiedono piu sforzo del solito'),
    facil: E('as trocas afetivas acontecem com menos esforço', 'affectionate exchanges happen with less effort', 'los intercambios afectivos ocurren con menos esfuerzo', 'gli scambi affettivi avvengono con meno sforzo'),
    misto: E('o afeto corre fácil de um lado e cobra do outro', 'affection flows easily on one side and asks a lot on the other', 'el afecto corre facil de un lado y cobra del otro', 'l affetto scorre facile da un lato e chiede molto dall altro'),
  },
  mars: {
    nome: E('a sua ação', 'your drive to act', 'tu accion', 'la tua azione'),
    tenso: E('agir encontra mais obstáculo do que de costume', 'acting meets more obstacles than usual', 'actuar encuentra mas obstaculos que de costumbre', 'agire incontra piu ostacoli del solito'),
    facil: E('agir encontra menos obstáculo do que de costume', 'acting meets fewer obstacles than usual', 'actuar encuentra menos obstaculos que de costumbre', 'agire incontra meno ostacoli del solito'),
    misto: E('a ação rende numa frente e esbarra em outra', 'action pays off on one front and bumps on another', 'la accion rinde en un frente y tropieza en otro', 'l azione rende su un fronte e urta su un altro'),
  },
  jupiter: {
    nome: E('a sua expansão', 'your sense of expansion', 'tu expansion', 'la tua espansione'),
    tenso: E('o impulso de ampliar pede mais critério que o normal', 'the urge to expand needs more judgement than usual', 'el impulso de ampliar pide mas criterio que lo normal', 'la spinta ad ampliare chiede piu criterio del solito'),
    facil: E('ampliar custa menos esforço do que de costume', 'expanding takes less effort than usual', 'ampliar cuesta menos esfuerzo que de costumbre', 'ampliare costa meno sforzo del solito'),
    misto: E('ampliar vem fácil, mas pede critério', 'expanding comes easily, but needs judgement', 'ampliar viene facil, pero pide criterio', 'ampliare viene facile, ma chiede criterio'),
  },
  saturn: {
    nome: E('a sua estrutura', 'your structure', 'tu estructura', 'la tua struttura'),
    tenso: E('compromissos e limites pesam mais que o normal', 'commitments and limits weigh more than usual', 'compromisos y limites pesan mas que lo normal', 'impegni e limiti pesano piu del solito'),
    facil: E('o que você constrói se sustenta com menos esforço', 'what you build holds up with less effort', 'lo que construyes se sostiene con menos esfuerzo', 'cio che costruisci si regge con meno sforzo'),
    misto: E('a estrutura sustenta e cobra ao mesmo tempo', 'structure holds and demands at the same time', 'la estructura sostiene y cobra al mismo tiempo', 'la struttura sostiene e chiede allo stesso tempo'),
  },
  uranus: {
    nome: E('a sua inquietação', 'your restlessness', 'tu inquietud', 'la tua inquietudine'),
    tenso: E('o imprevisto desorganiza a rotina mais que o normal', 'the unexpected disrupts routine more than usual', 'lo imprevisto desorganiza la rutina mas que lo normal', 'l imprevisto disorganizza la routine piu del solito'),
    facil: E('mudanças acontecem com menos sobressalto que o normal', 'changes happen with less of a jolt than usual', 'los cambios ocurren con menos sobresalto que lo normal', 'i cambiamenti avvengono con meno scossa del solito'),
    misto: E('a mudança abre tanto quanto desorganiza', 'change opens as much as it disrupts', 'el cambio abre tanto como desorganiza', 'il cambiamento apre quanto disorganizza'),
  },
  neptune: {
    nome: E('a sua imaginação', 'your imagination', 'tu imaginacion', 'la tua immaginazione'),
    tenso: E('a clareza custa mais e o cansaço aparece antes', 'clarity costs more and tiredness shows up earlier', 'la claridad cuesta mas y el cansancio aparece antes', 'la chiarezza costa di piu e la stanchezza arriva prima'),
    facil: E('a intuição fica mais afiada que o normal', 'intuition gets sharper than usual', 'la intuicion se afina mas que lo normal', 'l intuito si affina piu del solito'),
    misto: E('a intuição fica afiada enquanto a clareza se perde', 'intuition sharpens while clarity blurs', 'la intuicion se afina mientras la claridad se pierde', 'l intuito si affina mentre la chiarezza si perde'),
  },
  pluto: {
    nome: E('o seu poder pessoal', 'your personal power', 'tu poder personal', 'il tuo potere personale'),
    tenso: E('questões de controle aparecem mais que o normal', 'control issues come up more than usual', 'los temas de control aparecen mas que lo normal', 'le questioni di controllo emergono piu del solito'),
    facil: E('a sua força se concentra melhor onde importa', 'your strength gathers better where it matters', 'tu fuerza se concentra mejor donde importa', 'la tua forza si concentra meglio dove conta'),
    misto: E('a força se concentra onde importa e vira disputa onde não', 'strength gathers where it matters and turns into a dispute where it does not', 'la fuerza se concentra donde importa y se vuelve disputa donde no', 'la forza si concentra dove conta e diventa disputa dove no'),
  },
  meio_do_ceu: {
    nome: E('a sua carreira', 'your career', 'tu carrera', 'la tua carriera'),
    tenso: E('a carreira exige e expõe mais que o normal', 'career demands and exposes more than usual', 'la carrera exige y expone mas que lo normal', 'la carriera chiede ed espone piu del solito'),
    facil: E('a carreira anda com menos atrito que o normal', 'career moves with less friction than usual', 'la carrera avanza con menos roce que lo normal', 'la carriera avanza con meno attrito del solito'),
    misto: E('a carreira anda e cobra ao mesmo tempo', 'career moves and demands at the same time', 'la carrera avanza y cobra al mismo tiempo', 'la carriera avanza e chiede allo stesso tempo'),
  },
  ascendente: {
    nome: E('a sua presença', 'your presence', 'tu presencia', 'la tua presenza'),
    tenso: E('o jeito como você aparece encontra mais resistência que o normal', 'the way you come across meets more resistance than usual', 'la forma en que apareces encuentra mas resistencia que lo normal', 'il modo in cui ti presenti incontra piu resistenza del solito'),
    facil: E('o jeito como você aparece abre caminho com mais facilidade', 'the way you come across opens doors more easily', 'la forma en que apareces abre camino con mas facilidad', 'il modo in cui ti presenti apre strada piu facilmente'),
    misto: E('a sua presença abre portas com uns e incomoda outros', 'your presence opens doors with some and grates on others', 'tu presencia abre puertas con unos y incomoda a otros', 'la tua presenza apre porte con alcuni e infastidisce altri'),
  },
  northnode: {
    nome: E('a sua direção', 'your direction', 'tu direccion', 'la tua direzione'),
    tenso: E('o rumo fica menos nítido que o normal', 'the path gets less clear than usual', 'el rumbo queda menos nitido que lo normal', 'la rotta risulta meno nitida del solito'),
    facil: E('o rumo fica mais nítido que o normal', 'the path gets clearer than usual', 'el rumbo queda mas nitido que lo normal', 'la rotta risulta piu nitida del solito'),
    misto: E('o rumo clareia num ponto e confunde em outro', 'the path clears at one point and confuses at another', 'el rumbo se aclara en un punto y confunde en otro', 'la rotta si chiarisce in un punto e confonde in un altro'),
  },
  // ⚠️ DSC e IC faltavam, e o motor os EMITE: no dado de produção de 13/10, 3
  // dos 6 usuários tinham trânsito a IC e 3 a DSC. Sem entrada aqui,
  // `efeitoNoPonto` devolvia null e `sinteseDoDia` fazia `continue` — a frase
  // sumia do "Seu dia" sem deixar rastro. (No WhatsApp era pior: saía "Hoje
  // Mercúrio pressiona DSC", com a sigla crua e sem leitura.)
  //
  // Os quatro ângulos são dois EIXOS: quem mexe no Ascendente mexe no
  // Descendente, e quem mexe no Meio do Céu mexe no Fundo do Céu. Cada ponta
  // tem leitura própria porque o que a pessoa sente é diferente — a presença
  // dela x o encontro com o outro; o que aparece x o que sustenta.
  descendente: {
    nome: E('as suas relações', 'your relationships', 'tus relaciones', 'le tue relazioni'),
    tenso: E('lidar com o outro exige mais do que o normal', 'dealing with other people takes more than usual', 'tratar con el otro exige mas que lo normal', 'avere a che fare con l altro chiede piu del solito'),
    facil: E('o encontro com o outro acontece com menos esforço', 'meeting other people happens with less effort', 'el encuentro con el otro sucede con menos esfuerzo', 'l incontro con l altro avviene con meno sforzo'),
    misto: E('uma relação acolhe enquanto outra cobra', 'one relationship welcomes while another demands', 'una relacion acoge mientras otra cobra', 'una relazione accoglie mentre un altra chiede'),
  },
  fundo_do_ceu: {
    nome: E('a sua base', 'your foundation', 'tu base', 'la tua base'),
    tenso: E('o lado de casa e das raízes pesa mais que o normal', 'home and roots weigh more than usual', 'el lado de casa y de las raices pesa mas que lo normal', 'il lato di casa e delle radici pesa piu del solito'),
    facil: E('a vida em casa dá mais sustentação que de costume', 'life at home gives more support than usual', 'la vida en casa da mas sustento que de costumbre', 'la vita in casa da piu sostegno del solito'),
    misto: E('a base sustenta de um lado e cobra do outro', 'the foundation holds on one side and demands on the other', 'la base sostiene de un lado y cobra del otro', 'la base sostiene da un lato e chiede dall altro'),
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
  // O motor emite as siglas: no dado de produção vieram como 'DSC' e 'IC'.
  dsc: 'descendente', descendant: 'descendente', descendente: 'descendente',
  ic: 'fundo_do_ceu', imumcoeli: 'fundo_do_ceu', fundodoceu: 'fundo_do_ceu', fondocielo: 'fundo_do_ceu',
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
  natureza: 'tenso' | 'facil' | 'misto',
  idioma: AppLanguage = 'pt-BR',
): string | null {
  const p = achar(alvo)
  if (!p) return null
  const par = natureza === 'tenso' ? p.tenso : natureza === 'facil' ? p.facil : p.misto
  return par[idioma] || null
}
