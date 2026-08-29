// Catálogo curado de interesses da Rede/Match. Slugs estáveis (batem com o
// backend sanitizado); labels nos 4 idiomas (es-ES sem tildes, it-IT sem acentos).

export type NetworkLang = 'pt-BR' | 'en-US' | 'es-ES' | 'it-IT'

export type NetworkInterest = {
  slug: string
  emoji: string
  label: Record<NetworkLang, string>
}

const L = (pt: string, en: string, es: string, it: string): Record<NetworkLang, string> =>
  ({ 'pt-BR': pt, 'en-US': en, 'es-ES': es, 'it-IT': it })

export const NETWORK_INTERESTS: NetworkInterest[] = [
  { slug: 'musica', emoji: '🎵', label: L('Música', 'Music', 'Musica', 'Musica') },
  { slug: 'viagem', emoji: '✈️', label: L('Viagem', 'Travel', 'Viajar', 'Viaggi') },
  { slug: 'cinema', emoji: '🎬', label: L('Cinema', 'Movies', 'Cine', 'Cinema') },
  { slug: 'arte', emoji: '🎨', label: L('Arte', 'Art', 'Arte', 'Arte') },
  { slug: 'espiritualidade', emoji: '🔮', label: L('Espiritualidade', 'Spirituality', 'Espiritualidad', 'Spiritualita') },
  { slug: 'esportes', emoji: '⚽', label: L('Esportes', 'Sports', 'Deportes', 'Sport') },
  { slug: 'gastronomia', emoji: '🍽️', label: L('Gastronomia', 'Food', 'Gastronomia', 'Cucina') },
  { slug: 'natureza', emoji: '🌿', label: L('Natureza', 'Nature', 'Naturaleza', 'Natura') },
  { slug: 'leitura', emoji: '📚', label: L('Leitura', 'Reading', 'Lectura', 'Lettura') },
  { slug: 'games', emoji: '🎮', label: L('Games', 'Gaming', 'Videojuegos', 'Videogiochi') },
  { slug: 'danca', emoji: '💃', label: L('Dança', 'Dancing', 'Baile', 'Ballo') },
  { slug: 'fotografia', emoji: '📷', label: L('Fotografia', 'Photography', 'Fotografia', 'Fotografia') },
  { slug: 'yoga', emoji: '🧘', label: L('Yoga', 'Yoga', 'Yoga', 'Yoga') },
  { slug: 'meditacao', emoji: '🕉️', label: L('Meditação', 'Meditation', 'Meditacion', 'Meditazione') },
  { slug: 'animais', emoji: '🐾', label: L('Animais', 'Animals', 'Animales', 'Animali') },
  { slug: 'tecnologia', emoji: '💻', label: L('Tecnologia', 'Tech', 'Tecnologia', 'Tecnologia') },
  { slug: 'moda', emoji: '👗', label: L('Moda', 'Fashion', 'Moda', 'Moda') },
  { slug: 'praia', emoji: '🏖️', label: L('Praia', 'Beach', 'Playa', 'Spiaggia') },
  { slug: 'cafe', emoji: '☕', label: L('Café', 'Coffee', 'Cafe', 'Caffe') },
  { slug: 'vinho', emoji: '🍷', label: L('Vinho', 'Wine', 'Vino', 'Vino') },
  { slug: 'astrologia', emoji: '♈', label: L('Astrologia', 'Astrology', 'Astrologia', 'Astrologia') },
  { slug: 'terapia', emoji: '🌱', label: L('Terapia', 'Therapy', 'Terapia', 'Terapia') },
  { slug: 'voluntariado', emoji: '🤝', label: L('Voluntariado', 'Volunteering', 'Voluntariado', 'Volontariato') },
  { slug: 'festas', emoji: '🎉', label: L('Festas', 'Parties', 'Fiestas', 'Feste') },
]

const BY_SLUG = new Map(NETWORK_INTERESTS.map((t) => [t.slug, t]))

/** Rótulo de um interesse no idioma dado (fallback pt-BR, depois o próprio slug). */
export function interestLabel(slug: string, lang: NetworkLang): string {
  const t = BY_SLUG.get(slug)
  if (!t) return slug
  return t.label[lang] || t.label['pt-BR'] || slug
}

export function interestEmoji(slug: string): string {
  return BY_SLUG.get(slug)?.emoji || '•'
}
