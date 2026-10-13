// Composer de aspectos de PONTOS NOMEADOS (nódulos + ASC/MC) a planetas natais.
// Em vez de catálogo par-a-par, compõe: significado do ponto + domínio do planeta
// (reusa SR_PLANET_YEAR_DOMAIN) + dinâmica do aspecto. Cobre nódulo/ASC/MC × 10
// planetas × 6 aspectos, ×4 idiomas. Fallback: null (o chamador ignora).
// Regras i18n: en-US sem "will"; es-ES sem tildes; it-IT sem acentos.

// Significado do ponto nomeado (o lado "especial" do aspecto). Chave normalizada:
// northnode, southnode, ascendant, midheaven.
/**
 * ⚠️ DESCENDENTE e FUNDO DO CÉU faltavam, e com eles metade dos eixos.
 *
 * Medido: das 400 combinações de ponto × planeta × aspecto, 220 não tinham
 * texto — e 160 delas eram esses dois. Um aspecto ao Descendente abria o modal
 * sem leitura nenhuma.
 *
 * Eles não são "o oposto" do Ascendente e do Meio do Céu em sentido fraco: são
 * o outro lado do mesmo eixo, e o que dizem é diferente. O Ascendente é como
 * você chega; o Descendente, quem você atrai e o que procura no outro. O Meio
 * do Céu é a carreira à vista; o Fundo do Céu, a raiz de onde ela sai.
 */
export const POINT_MEANING: Record<string, Record<string, string>> = {
  'pt-BR': {
    northnode: 'Seu caminho de crescimento e propósito de vida',
    southnode: 'A sua bagagem e zona de conforto (o que você já domina e tende a repetir)',
    ascendant: 'A sua autoimagem e o jeito de se apresentar ao mundo',
    midheaven: 'A sua vocação, carreira e imagem pública',
    descendant: 'As suas relações: quem você atrai e o que busca no outro',
    imumcoeli: 'A sua raiz, família de origem e vida privada',
  },
  'en-US': {
    northnode: 'Your path of growth and life purpose',
    southnode: 'Your baggage and comfort zone (what you already master and tend to repeat)',
    ascendant: 'Your self-image and the way you present to the world',
    midheaven: 'Your vocation, career and public image',
    descendant: 'Your relationships: who you attract and what you seek in others',
    imumcoeli: 'Your roots, family of origin and private life',
  },
  'es-ES': {
    northnode: 'Tu camino de crecimiento y proposito de vida',
    southnode: 'Tu bagaje y zona de confort (lo que ya dominas y tiendes a repetir)',
    ascendant: 'Tu autoimagen y la forma de presentarte al mundo',
    midheaven: 'Tu vocacion, carrera e imagen publica',
    descendant: 'Tus relaciones: a quien atraes y que buscas en el otro',
    imumcoeli: 'Tu raiz, familia de origen y vida privada',
  },
  'it-IT': {
    northnode: 'Il tuo cammino di crescita e scopo di vita',
    southnode: 'Il tuo bagaglio e la zona di conforto (cio che gia padroneggi e tendi a ripetere)',
    ascendant: 'La tua immagine di te e il modo di presentarti al mondo',
    midheaven: 'La tua vocazione, carriera e immagine pubblica',
    descendant: 'Le tue relazioni: chi attiri e cosa cerchi nell altro',
    imumcoeli: 'La tua radice, famiglia d origine e vita privata',
  },
}

type Dyn = { verb: string; advice: string }

// Dinâmica do aspecto (tom NATAL, atemporal). Chave: conjuncao, sextil, quadratura,
// trigono, oposicao, quincuncio.
/**
 * ⚠️ SEMIQUADRATURA e SESQUIQUADRATURA ficavam de fora, e isso são 100 das 400
 * combinações sem texto.
 *
 * Elas são aspectos DUROS menores: pressionam como a quadratura, mas de um
 * jeito que incomoda em vez de bloquear — atrito de fundo, daqueles que a
 * pessoa sente sem saber nomear. O motor já as classifica como tensas (o
 * `getAspectType` do backend foi corrigido para isso); faltava o texto.
 *
 * Sem elas, tocar num desses aspectos abria o modal vazio — pior que não
 * mostrar o aspecto, porque promete leitura e não entrega.
 */
export const POINT_ASPECT_DYNAMIC: Record<string, Record<string, Dyn>> = {
  'pt-BR': {
    semissextil: { verb: 'recebe um empurrao discreto de', advice: 'Apoio de fundo, que aparece no acumulado — rende quando voce vai atras.' },
    conjuncao: { verb: 'se funde com', advice: 'As duas forças agem como uma só — intensas e inseparáveis nesse tema.' },
    sextil: { verb: 'encontra facilidade com', advice: 'Há um apoio natural que rende quando você o aciona.' },
    quadratura: { verb: 'entra em tensão com', advice: 'Um atrito que pede trabalho consciente — o desafio faz crescer.' },
    trigono: { verb: 'flui em harmonia com', advice: 'Um talento natural; vale usá-lo com intenção para não desperdiçar.' },
    oposicao: { verb: 'se opõe a', advice: 'Dois polos que pedem equilíbrio, sem anular nenhum dos lados.' },
    quincuncio: { verb: 'precisa se ajustar a', advice: 'Áreas que não combinam de imediato e pedem adaptação contínua.' },
    semiquadratura: { verb: 'atrita de leve com', advice: 'Incômodo de fundo que não bloqueia, mas desgasta se ignorado por muito tempo.' },
    sesquiquadratura: { verb: 'força a barra com', advice: 'Pressão que aparece quando se insiste no mesmo jeito; cede ao mudar a abordagem.' },
  },
  'en-US': {
    semissextil: { verb: 'gets a quiet nudge from', advice: 'Background support that shows over time — it pays off when you go after it.' },
    conjuncao: { verb: 'merges with', advice: 'The two forces act as one — intense and inseparable in this theme.' },
    sextil: { verb: 'finds ease with', advice: 'A natural support that pays off when you activate it.' },
    quadratura: { verb: 'enters tension with', advice: 'A friction that asks for conscious work — the challenge makes you grow.' },
    trigono: { verb: 'flows in harmony with', advice: 'A natural talent; worth using with intention so it is not wasted.' },
    oposicao: { verb: 'opposes', advice: 'Two poles that ask for balance, without canceling either side.' },
    quincuncio: { verb: 'needs to adjust to', advice: 'Areas that do not match at first and ask for constant adaptation.' },
    semiquadratura: { verb: 'slightly grates against', advice: 'Background friction that does not block, but wears you down if ignored for long.' },
    sesquiquadratura: { verb: 'pushes hard against', advice: 'Pressure that shows up when you insist on the same approach; it eases when you change it.' },
  },
  'es-ES': {
    semissextil: { verb: 'recibe un empujon discreto de', advice: 'Apoyo de fondo, que se ve en el acumulado — rinde cuando lo buscas.' },
    conjuncao: { verb: 'se funde con', advice: 'Las dos fuerzas actuan como una sola, intensas e inseparables en este tema.' },
    sextil: { verb: 'encuentra facilidad con', advice: 'Un apoyo natural que rinde cuando lo activas.' },
    quadratura: { verb: 'entra en tension con', advice: 'Un roce que pide trabajo consciente; el desafio hace crecer.' },
    trigono: { verb: 'fluye en armonia con', advice: 'Un talento natural; conviene usarlo con intencion para no desperdiciarlo.' },
    oposicao: { verb: 'se opone a', advice: 'Dos polos que piden equilibrio, sin anular ninguno de los lados.' },
    quincuncio: { verb: 'necesita ajustarse a', advice: 'Areas que no combinan de inmediato y piden adaptacion continua.' },
    semiquadratura: { verb: 'roza levemente con', advice: 'Incomodidad de fondo que no bloquea, pero desgasta si se ignora mucho tiempo.' },
    sesquiquadratura: { verb: 'fuerza la mano con', advice: 'Presion que aparece al insistir en lo mismo; cede al cambiar el enfoque.' },
  },
  'it-IT': {
    semissextil: { verb: 'riceve una spinta discreta da', advice: 'Sostegno di fondo, che si vede nel lungo periodo — rende quando lo cerchi.' },
    conjuncao: { verb: 'si fonde con', advice: 'Le due forze agiscono come una sola, intense e inseparabili in questo tema.' },
    sextil: { verb: 'trova facilita con', advice: 'Un supporto naturale che rende quando lo attivi.' },
    quadratura: { verb: 'entra in tensione con', advice: 'Un attrito che chiede lavoro consapevole; la sfida fa crescere.' },
    trigono: { verb: 'scorre in armonia con', advice: 'Un talento naturale; vale usarlo con intenzione per non sprecarlo.' },
    oposicao: { verb: 'si oppone a', advice: 'Due poli che chiedono equilibrio, senza annullare nessuno dei lati.' },
    quincuncio: { verb: 'deve adattarsi a', advice: 'Aree che non combaciano subito e chiedono adattamento continuo.' },
    semiquadratura: { verb: 'sfrega leggermente con', advice: 'Attrito di fondo che non blocca, ma logora se ignorato a lungo.' },
    sesquiquadratura: { verb: 'forza la mano con', advice: 'Pressione che emerge insistendo allo stesso modo; cede cambiando approccio.' },
  },
}
