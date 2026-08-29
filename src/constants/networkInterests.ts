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
  { slug: 'aventura', emoji: '⛰️', label: L('Aventura', 'Adventure', 'Aventura', 'Avventura') },
  { slug: 'teatro', emoji: '🎭', label: L('Teatro', 'Theater', 'Teatro', 'Teatro') },
  { slug: 'historia', emoji: '📜', label: L('História', 'History', 'Historia', 'Storia') },
  { slug: 'ciencia', emoji: '🔬', label: L('Ciência', 'Science', 'Ciencia', 'Scienza') },
  { slug: 'empreender', emoji: '💼', label: L('Empreender', 'Entrepreneurship', 'Emprender', 'Impresa') },
  { slug: 'humor', emoji: '😂', label: L('Humor', 'Comedy', 'Humor', 'Umorismo') },
  { slug: 'plantas', emoji: '🪴', label: L('Plantas', 'Plants', 'Plantas', 'Piante') },
  { slug: 'corrida', emoji: '🏃', label: L('Corrida', 'Running', 'Correr', 'Corsa') },
  { slug: 'academia', emoji: '🏋️', label: L('Academia', 'Gym', 'Gimnasio', 'Palestra') },
  { slug: 'trilha', emoji: '🥾', label: L('Trilha', 'Hiking', 'Senderismo', 'Trekking') },
  { slug: 'mar', emoji: '🌊', label: L('Mar', 'Sea', 'Mar', 'Mare') },
  { slug: 'sustentabilidade', emoji: '♻️', label: L('Sustentabilidade', 'Sustainability', 'Sostenibilidad', 'Sostenibilita') },
  { slug: 'idiomas', emoji: '🗣️', label: L('Idiomas', 'Languages', 'Idiomas', 'Lingue') },
  { slug: 'escrita', emoji: '✍️', label: L('Escrita', 'Writing', 'Escritura', 'Scrittura') },
  { slug: 'podcast', emoji: '🎙️', label: L('Podcast', 'Podcast', 'Podcast', 'Podcast') },
  { slug: 'anime', emoji: '🍥', label: L('Anime', 'Anime', 'Anime', 'Anime') },
  { slug: 'boardgames', emoji: '🎲', label: L('Jogos de mesa', 'Board games', 'Juegos de mesa', 'Giochi da tavolo') },
  { slug: 'moto', emoji: '🏍️', label: L('Moto', 'Motorcycles', 'Moto', 'Moto') },
  { slug: 'carros', emoji: '🚗', label: L('Carros', 'Cars', 'Autos', 'Auto') },
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

// ─── Favoritos preenchíveis (prompts estilo "Filme favorito: qual?") ─────────
export type ProfilePrompt = {
  key: string
  emoji: string
  label: Record<NetworkLang, string>
  placeholder: Record<NetworkLang, string>
}

export const PROFILE_PROMPTS: ProfilePrompt[] = [
  { key: 'filme', emoji: '🎬', label: L('Filme favorito', 'Favorite movie', 'Pelicula favorita', 'Film preferito'), placeholder: L('Qual?', 'Which one?', 'Cual?', 'Quale?') },
  { key: 'serie', emoji: '📺', label: L('Série favorita', 'Favorite series', 'Serie favorita', 'Serie preferita'), placeholder: L('Qual?', 'Which one?', 'Cual?', 'Quale?') },
  { key: 'musica', emoji: '🎧', label: L('Música ou artista', 'Song or artist', 'Cancion o artista', 'Canzone o artista'), placeholder: L('Quem você ouve?', 'Who do you listen to?', 'A quien escuchas?', 'Chi ascolti?') },
  { key: 'livro', emoji: '📖', label: L('Livro favorito', 'Favorite book', 'Libro favorito', 'Libro preferito'), placeholder: L('Qual?', 'Which one?', 'Cual?', 'Quale?') },
  { key: 'prato', emoji: '🍲', label: L('Prato favorito', 'Favorite dish', 'Plato favorito', 'Piatto preferito'), placeholder: L('O que você ama comer?', 'What do you love to eat?', 'Que amas comer?', 'Cosa ami mangiare?') },
  { key: 'viagem', emoji: '🌍', label: L('Viagem dos sonhos', 'Dream trip', 'Viaje sonado', 'Viaggio dei sogni'), placeholder: L('Para onde?', 'Where to?', 'A donde?', 'Dove?') },
  { key: 'domingo', emoji: '☕', label: L('Domingo perfeito', 'Perfect Sunday', 'Domingo perfecto', 'Domenica perfetta'), placeholder: L('Como é?', 'How is it?', 'Como es?', 'Com e?') },
  { key: 'naovivosem', emoji: '✨', label: L('Não vivo sem', 'Can\'t live without', 'No vivo sin', 'Non vivo senza'), placeholder: L('O quê?', 'What?', 'Que?', 'Cosa?') },
  { key: 'busco', emoji: '💫', label: L('O que busco aqui', 'What I look for here', 'Lo que busco aqui', 'Cosa cerco qui'), placeholder: L('Algo sério, amizade…', 'Something serious, friendship…', 'Algo serio, amistad…', 'Qualcosa di serio, amicizia…') },
  { key: 'signoideal', emoji: '♊', label: L('Combino com o signo', 'I match the sign', 'Combino con el signo', 'Combino col segno'), placeholder: L('Qual? (ou "surpreenda")', 'Which? (or "surprise me")', 'Cual? (o "sorprendeme")', 'Quale? (o "sorprendimi")') },
]

const PROMPT_BY_KEY = new Map(PROFILE_PROMPTS.map((p) => [p.key, p]))
export function promptLabel(key: string, lang: NetworkLang): string {
  const p = PROMPT_BY_KEY.get(key)
  return p ? (p.label[lang] || p.label['pt-BR']) : key
}
export function promptEmoji(key: string): string {
  return PROMPT_BY_KEY.get(key)?.emoji || '•'
}
