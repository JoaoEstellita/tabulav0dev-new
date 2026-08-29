import type { IntroSlide } from '../../components/IntroCarousel'

type Lang = 'pt-BR' | 'en-US' | 'es-ES' | 'it-IT'

/** Slides do guia de introdução ao Match. `gated` muda só o CTA do último slide. */
export function matchIntroSlides(lang: Lang, gated: boolean): IntroSlide[] {
  const pick = (pt: string, en: string, es: string, it: string) =>
    ({ 'pt-BR': pt, 'en-US': en, 'es-ES': es, 'it-IT': it }[lang] || pt)

  const slides: IntroSlide[] = [
    {
      emoji: '💫',
      title: pick('Descubra com quem você combina', 'Discover who matches you', 'Descubre con quien combinas', 'Scopri con chi combini'),
      text: pick('A astrologia acha as pessoas mais compatíveis com o seu mapa — não é aleatório.', 'Astrology finds the people most compatible with your chart — not random.', 'La astrologia encuentra a las personas mas compatibles con tu carta, no al azar.', 'L astrologia trova le persone piu compatibili con la tua carta, non a caso.'),
    },
    {
      emoji: '💘',
      title: pick('Curta ou passe', 'Like or pass', 'Dale like o pasa', 'Metti like o passa'),
      text: pick('Veja os cards: ❤️ para curtir, ✖️ para passar. Simples como deve ser.', 'See the cards: ❤️ to like, ✖️ to pass. Simple as it should be.', 'Mira las tarjetas: ❤️ para like, ✖️ para pasar. Simple.', 'Guarda le card: ❤️ per like, ✖️ per passare. Semplice.'),
    },
    {
      emoji: '🎉',
      title: pick('Deu Match!', 'It is a Match!', 'Hubo Match!', 'E Match!'),
      text: pick('Quando os dois se curtem, vocês combinam de verdade — e podem trocar o WhatsApp.', 'When you both like each other, you truly match — and can share WhatsApp.', 'Cuando ambos se dan like, combinan de verdad y pueden compartir WhatsApp.', 'Quando entrambi vi piacete, combinate davvero e potete scambiarvi WhatsApp.'),
    },
    {
      emoji: '✨',
      title: pick('Seu perfil, do seu jeito', 'Your profile, your way', 'Tu perfil, a tu manera', 'Il tuo profilo, a modo tuo'),
      text: pick('Fotos, seus interesses e uma bio. Perfis completos combinam mais.', 'Photos, your interests and a bio. Complete profiles match more.', 'Fotos, tus intereses y una bio. Los perfiles completos combinan mas.', 'Foto, i tuoi interessi e una bio. I profili completi combinano di piu.'),
    },
    {
      emoji: gated ? '🔓' : '🚀',
      title: gated
        ? pick('Assine para descobrir', 'Subscribe to discover', 'Suscribete para descubrir', 'Abbonati per scoprire')
        : pick('Comece agora', 'Start now', 'Empieza ahora', 'Inizia ora'),
      text: gated
        ? pick('O Match é para assinantes. Assine e encontre quem combina com você.', 'Match is for subscribers. Subscribe and find who matches you.', 'El Match es para suscriptores. Suscribete y encuentra con quien combinas.', 'Il Match e per abbonati. Abbonati e trova chi combina con te.')
        : pick('Monte seu perfil e comece a descobrir quem combina com você.', 'Set up your profile and start discovering who matches you.', 'Arma tu perfil y empieza a descubrir con quien combinas.', 'Crea il tuo profilo e inizia a scoprire chi combina con te.'),
    },
  ]
  return slides
}
