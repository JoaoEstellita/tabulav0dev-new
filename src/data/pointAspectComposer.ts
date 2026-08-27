// Composer de aspectos de PONTOS NOMEADOS (nódulos + ASC/MC) a planetas natais.
// Em vez de catálogo par-a-par, compõe: significado do ponto + domínio do planeta
// (reusa SR_PLANET_YEAR_DOMAIN) + dinâmica do aspecto. Cobre nódulo/ASC/MC × 10
// planetas × 6 aspectos, ×4 idiomas. Fallback: null (o chamador ignora).
// Regras i18n: en-US sem "will"; es-ES sem tildes; it-IT sem acentos.

// Significado do ponto nomeado (o lado "especial" do aspecto). Chave normalizada:
// northnode, southnode, ascendant, midheaven.
export const POINT_MEANING: Record<string, Record<string, string>> = {
  'pt-BR': {
    northnode: 'Seu caminho de crescimento e propósito de vida',
    southnode: 'A sua bagagem e zona de conforto (o que você já domina e tende a repetir)',
    ascendant: 'A sua autoimagem e o jeito de se apresentar ao mundo',
    midheaven: 'A sua vocação, carreira e imagem pública',
  },
  'en-US': {
    northnode: 'Your path of growth and life purpose',
    southnode: 'Your baggage and comfort zone (what you already master and tend to repeat)',
    ascendant: 'Your self-image and the way you present to the world',
    midheaven: 'Your vocation, career and public image',
  },
  'es-ES': {
    northnode: 'Tu camino de crecimiento y proposito de vida',
    southnode: 'Tu bagaje y zona de confort (lo que ya dominas y tiendes a repetir)',
    ascendant: 'Tu autoimagen y la forma de presentarte al mundo',
    midheaven: 'Tu vocacion, carrera e imagen publica',
  },
  'it-IT': {
    northnode: 'Il tuo cammino di crescita e scopo di vita',
    southnode: 'Il tuo bagaglio e la zona di conforto (cio che gia padroneggi e tendi a ripetere)',
    ascendant: 'La tua immagine di te e il modo di presentarti al mondo',
    midheaven: 'La tua vocazione, carriera e immagine pubblica',
  },
}

type Dyn = { verb: string; advice: string }

// Dinâmica do aspecto (tom NATAL, atemporal). Chave: conjuncao, sextil, quadratura,
// trigono, oposicao, quincuncio.
export const POINT_ASPECT_DYNAMIC: Record<string, Record<string, Dyn>> = {
  'pt-BR': {
    conjuncao: { verb: 'se funde com', advice: 'As duas forças agem como uma só — intensas e inseparáveis nesse tema.' },
    sextil: { verb: 'encontra facilidade com', advice: 'Há um apoio natural que rende quando você o aciona.' },
    quadratura: { verb: 'entra em tensão com', advice: 'Um atrito que pede trabalho consciente — o desafio faz crescer.' },
    trigono: { verb: 'flui em harmonia com', advice: 'Um talento natural; vale usá-lo com intenção para não desperdiçar.' },
    oposicao: { verb: 'se opõe a', advice: 'Dois polos que pedem equilíbrio, sem anular nenhum dos lados.' },
    quincuncio: { verb: 'precisa se ajustar a', advice: 'Áreas que não combinam de imediato e pedem adaptação contínua.' },
  },
  'en-US': {
    conjuncao: { verb: 'merges with', advice: 'The two forces act as one — intense and inseparable in this theme.' },
    sextil: { verb: 'finds ease with', advice: 'A natural support that pays off when you activate it.' },
    quadratura: { verb: 'enters tension with', advice: 'A friction that asks for conscious work — the challenge makes you grow.' },
    trigono: { verb: 'flows in harmony with', advice: 'A natural talent; worth using with intention so it is not wasted.' },
    oposicao: { verb: 'opposes', advice: 'Two poles that ask for balance, without canceling either side.' },
    quincuncio: { verb: 'needs to adjust to', advice: 'Areas that do not match at first and ask for constant adaptation.' },
  },
  'es-ES': {
    conjuncao: { verb: 'se funde con', advice: 'Las dos fuerzas actuan como una sola, intensas e inseparables en este tema.' },
    sextil: { verb: 'encuentra facilidad con', advice: 'Un apoyo natural que rinde cuando lo activas.' },
    quadratura: { verb: 'entra en tension con', advice: 'Un roce que pide trabajo consciente; el desafio hace crecer.' },
    trigono: { verb: 'fluye en armonia con', advice: 'Un talento natural; conviene usarlo con intencion para no desperdiciarlo.' },
    oposicao: { verb: 'se opone a', advice: 'Dos polos que piden equilibrio, sin anular ninguno de los lados.' },
    quincuncio: { verb: 'necesita ajustarse a', advice: 'Areas que no combinan de inmediato y piden adaptacion continua.' },
  },
  'it-IT': {
    conjuncao: { verb: 'si fonde con', advice: 'Le due forze agiscono come una sola, intense e inseparabili in questo tema.' },
    sextil: { verb: 'trova facilita con', advice: 'Un supporto naturale che rende quando lo attivi.' },
    quadratura: { verb: 'entra in tensione con', advice: 'Un attrito che chiede lavoro consapevole; la sfida fa crescere.' },
    trigono: { verb: 'scorre in armonia con', advice: 'Un talento naturale; vale usarlo con intenzione per non sprecarlo.' },
    oposicao: { verb: 'si oppone a', advice: 'Due poli che chiedono equilibrio, senza annullare nessuno dei lati.' },
    quincuncio: { verb: 'deve adattarsi a', advice: 'Aree che non combaciano subito e chiedono adattamento continuo.' },
  },
}
