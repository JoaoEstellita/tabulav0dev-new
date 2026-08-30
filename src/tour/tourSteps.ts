import type { TourStep, TourTab } from './TourProvider'

// Passos do tour guiado (holofote). Cada passo aponta uma âncora real (id) numa
// aba. Texto curto — o holofote mostra o recurso; o balão só explica.
type Lang = 'pt-BR' | 'en-US' | 'es-ES' | 'it-IT'
const pick = (lang: Lang, pt: string, en: string, es: string, it: string) =>
  ({ 'pt-BR': pt, 'en-US': en, 'es-ES': es, 'it-IT': it } as Record<Lang, string>)[lang] || pt

type Raw = { id: string; tab: TourTab; t: [string, string, string, string]; b: [string, string, string, string] }

const RAW: Raw[] = [
  {
    id: 'home.header', tab: 'Home',
    t: ['Seu cabeçalho', 'Your header', 'Tu encabezado', 'La tua intestazione'],
    b: ['Aqui ficam seu Sol, Lua e Ascendente (↑). Toque na foto para trocá-la.',
        'Here are your Sun, Moon and Ascendant (↑). Tap the photo to change it.',
        'Aqui estan tu Sol, Luna y Ascendente (↑). Toca la foto para cambiarla.',
        'Qui ci sono Sole, Luna e Ascendente (↑). Tocca la foto per cambiarla.'],
  },
  {
    id: 'home.areas', tab: 'Home',
    t: ['8 Áreas da vida', '8 Life areas', '8 Areas de la vida', '8 Aree della vita'],
    b: ['Cada card mostra como o céu de hoje mexe numa parte da sua vida. Toque para a leitura completa.',
        'Each card shows how today\'s sky affects a part of your life. Tap for the full reading.',
        'Cada tarjeta muestra como el cielo de hoy afecta una parte de tu vida. Toca para la lectura completa.',
        'Ogni card mostra come il cielo di oggi tocca una parte della tua vita. Tocca per la lettura completa.'],
  },
  {
    id: 'home.wheel', tab: 'Home',
    t: ['Céu de hoje', 'Today\'s sky', 'Cielo de hoy', 'Cielo di oggi'],
    b: ['A roda cruza seu mapa natal com os trânsitos de agora. Toque num aspecto para entender.',
        'The wheel overlays your natal chart with current transits. Tap an aspect to understand it.',
        'La rueda cruza tu carta natal con los transitos de ahora. Toca un aspecto para entender.',
        'La ruota incrocia la tua carta natale coi transiti attuali. Tocca un aspetto per capire.'],
  },
  {
    id: 'home.transits', tab: 'Home',
    t: ['Comparação de trânsitos', 'Transit comparison', 'Comparacion de transitos', 'Confronto transiti'],
    b: ['Planeta a planeta, o que cada trânsito de hoje ativa no seu mapa.',
        'Planet by planet, what each of today\'s transits activates in your chart.',
        'Planeta a planeta, que activa cada transito de hoy en tu carta.',
        'Pianeta per pianeta, cosa attiva ogni transito di oggi nella tua carta.'],
  },
  {
    id: 'cosmos.system', tab: 'Cosmos',
    t: ['Escolha o mapa', 'Choose the chart', 'Elige el mapa', 'Scegli la mappa'],
    b: ['Alterne Ocidental × Védico e entre Natal, Trânsitos, Retorno Solar e Lunar. Abaixo abre a roda: planetas, casas e aspectos — toque em cada um para interpretar.',
        'Switch Western vs Vedic and among Natal, Transits, Solar and Lunar Return. Below opens the wheel: planets, houses and aspects — tap any to interpret.',
        'Cambia Occidental vs Vedico y entre Natal, Transitos, Retorno Solar y Lunar. Abajo abre la rueda: planetas, casas y aspectos — toca cada uno para interpretar.',
        'Passa tra Occidentale e Vedico e tra Natale, Transiti, Ritorno Solare e Lunare. Sotto apre la ruota: pianeti, case e aspetti — tocca ognuno per interpretare.'],
  },
  {
    id: 'groups.tabs', tab: 'Groups',
    t: ['Seus grupos', 'Your groups', 'Tus grupos', 'I tuoi gruppi'],
    b: ['A barra lista seus grupos (toque para trocar, role para ver mais). No "+" você cria/entra, convida, cria perfil de monitoramento ou encontra usuários.',
        'The bar lists your groups (tap to switch, scroll for more). Under "+" you create/join, invite, create a managed profile or find users.',
        'La barra lista tus grupos (toca para cambiar, desliza para ver mas). En el "+" creas/entras, invitas, creas perfil de seguimiento o encuentras usuarios.',
        'La barra elenca i gruppi (tocca per cambiare, scorri per altri). Nel "+" crei/entri, inviti, crei un profilo monitorato o trovi utenti.'],
  },
  {
    id: 'groups.synastry', tab: 'Groups',
    t: ['Sinastria do grupo', 'Group synastry', 'Sinastria del grupo', 'Sinastria del gruppo'],
    b: ['A matriz cruza todas as duplas. Expanda para a roda, a grade de aspectos, o % de afinidade e o Guna Milan.',
        'The matrix crosses every pair. Expand for the wheel, aspect grid, affinity % and Guna Milan.',
        'La matriz cruza todas las parejas. Expande para la rueda, la grilla, el % de afinidad y el Guna Milan.',
        'La matrice incrocia tutte le coppie. Espandi per la ruota, la griglia, il % di affinita e il Guna Milan.'],
  },
]

export function buildTourSteps(lang: string): TourStep[] {
  const L = lang as Lang
  return RAW.map((r) => ({ id: r.id, tab: r.tab, title: pick(L, r.t[0], r.t[1], r.t[2], r.t[3]), body: pick(L, r.b[0], r.b[1], r.b[2], r.b[3]) }))
}
