// Significado das linhas do Astro Map por planeta × ângulo (MC = carreira/imagem
// pública; IC = raízes/lar/vida íntima), nos 4 idiomas. Leitura orientativa.
type Lang = 'pt-BR' | 'en-US' | 'es-ES' | 'it-IT'
type L = Record<Lang, string>
type PlanetMeaning = { essence: L; mc: L; ic: L }

const M = (pt: string, en: string, es: string, it: string): L => ({ 'pt-BR': pt, 'en-US': en, 'es-ES': es, 'it-IT': it })

export const ASTRO_MEANING: Record<string, PlanetMeaning> = {
  sun: {
    essence: M('vitalidade e identidade', 'vitality and identity', 'vitalidad e identidad', 'vitalita e identita'),
    mc: M('Você brilha e é visto — reconhecimento, autoridade e presença pública.', 'You shine and get seen — recognition, authority and public presence.', 'Brillas y te ven — reconocimiento, autoridad y presencia publica.', 'Brilli e sei visto — riconoscimento, autorita e presenza pubblica.'),
    ic: M('Sensação de pertencer — raízes fortes, lar e identidade enraizada.', 'A sense of belonging — strong roots, home and grounded identity.', 'Sensacion de pertenecer — raices fuertes, hogar e identidad.', 'Senso di appartenenza — radici forti, casa e identita.'),
  },
  moon: {
    essence: M('emoções e cuidado', 'emotions and care', 'emociones y cuidado', 'emozioni e cura'),
    mc: M('Sua sensibilidade fica visível — cuidar/acolher vira parte da sua imagem.', 'Your sensitivity becomes visible — nurturing becomes part of your image.', 'Tu sensibilidad se hace visible — cuidar es parte de tu imagen.', 'La tua sensibilita diventa visibile — accudire fa parte della tua immagine.'),
    ic: M('Aconchego e segurança emocional — uma das linhas mais fortes para morar.', 'Comfort and emotional safety — one of the strongest lines to live on.', 'Comodidad y seguridad emocional — una de las lineas mas fuertes para vivir.', 'Conforto e sicurezza emotiva — una delle linee piu forti per vivere.'),
  },
  mercury: {
    essence: M('comunicação e mente', 'communication and mind', 'comunicacion y mente', 'comunicazione e mente'),
    mc: M('Ideias, negócios e comunicação em destaque — bom para estudar e trabalhar com a mente.', 'Ideas, business and communication stand out — good to study and work with your mind.', 'Ideas, negocios y comunicacion destacan — bueno para estudiar y trabajar con la mente.', 'Idee, affari e comunicazione emergono — buono per studiare e lavorare con la mente.'),
    ic: M('Conversas e aprendizado no lar — mente ativa nas raízes.', 'Talk and learning at home — an active mind at your roots.', 'Conversaciones y aprendizaje en el hogar — mente activa en las raices.', 'Dialogo e apprendimento in casa — mente attiva nelle radici.'),
  },
  venus: {
    essence: M('amor, beleza e prazer', 'love, beauty and pleasure', 'amor, belleza y placer', 'amore, bellezza e piacere'),
    mc: M('Charme social — sucesso pelas relações, arte e beleza; você atrai.', 'Social charm — success through relationships, art and beauty; you attract.', 'Encanto social — exito por las relaciones, arte y belleza; atraes.', 'Fascino sociale — successo tramite relazioni, arte e bellezza; attrai.'),
    ic: M('Amor e harmonia no lar — uma das linhas mais doces para o coração.', 'Love and harmony at home — one of the sweetest lines for the heart.', 'Amor y armonia en el hogar — una de las lineas mas dulces para el corazon.', 'Amore e armonia in casa — una delle linee piu dolci per il cuore.'),
  },
  mars: {
    essence: M('energia, desejo e ação', 'energy, desire and action', 'energia, deseo y accion', 'energia, desiderio e azione'),
    mc: M('Ambição e coragem na carreira — você age e compete; cuidado com o excesso.', 'Ambition and courage in career — you act and compete; watch for overdrive.', 'Ambicion y coraje en la carrera — actuas y compites; cuida el exceso.', 'Ambizione e coraggio nella carriera — agisci e competi; attenzione agli eccessi.'),
    ic: M('Energia intensa em casa — impulso para construir, mas pode gerar atrito.', 'Intense energy at home — drive to build, but can spark friction.', 'Energia intensa en casa — impulso para construir, pero puede generar friccion.', 'Energia intensa in casa — spinta a costruire, ma puo creare attrito.'),
  },
  jupiter: {
    essence: M('sorte, expansão e sentido', 'luck, expansion and meaning', 'suerte, expansion y sentido', 'fortuna, espansione e senso'),
    mc: M('Expansão e sorte na vida pública — oportunidades, crescimento e reconhecimento.', 'Expansion and luck in public life — opportunity, growth and recognition.', 'Expansion y suerte en la vida publica — oportunidades, crecimiento y reconocimiento.', 'Espansione e fortuna nella vita pubblica — opportunita, crescita e riconoscimento.'),
    ic: M('Abundância e otimismo no lar — boa base para prosperar e crescer.', 'Abundance and optimism at home — a good base to thrive and grow.', 'Abundancia y optimismo en el hogar — buena base para prosperar.', 'Abbondanza e ottimismo in casa — buona base per prosperare.'),
  },
  saturn: {
    essence: M('estrutura, esforço e tempo', 'structure, effort and time', 'estructura, esfuerzo y tiempo', 'struttura, impegno e tempo'),
    mc: M('Carreira construída com esforço — sólida e duradoura, mas exige responsabilidade.', 'A career built with effort — solid and lasting, but demands responsibility.', 'Carrera construida con esfuerzo — solida y duradera, pide responsabilidad.', 'Carriera costruita con impegno — solida e duratura, chiede responsabilita.'),
    ic: M('Peso e maturidade nas raízes — lições de família; estrutura, não leveza.', 'Weight and maturity at your roots — family lessons; structure, not lightness.', 'Peso y madurez en las raices — lecciones de familia; estructura, no ligereza.', 'Peso e maturita nelle radici — lezioni di famiglia; struttura, non leggerezza.'),
  },
  uranus: {
    essence: M('liberdade e ruptura', 'freedom and disruption', 'libertad y ruptura', 'liberta e rottura'),
    mc: M('Caminhos originais e mudanças bruscas na carreira — inovação, imprevisto.', 'Original paths and sudden career shifts — innovation, the unexpected.', 'Caminos originales y cambios bruscos en la carrera — innovacion, lo inesperado.', 'Percorsi originali e svolte improvvise nella carriera — innovazione, imprevisto.'),
    ic: M('Lar instável ou libertador — vida fora do padrão, muda com frequência.', 'An unstable or freeing home — an unconventional life that shifts often.', 'Hogar inestable o liberador — vida fuera de lo comun, cambia seguido.', 'Casa instabile o liberatoria — vita fuori dagli schemi, cambia spesso.'),
  },
  neptune: {
    essence: M('sonho, arte e espírito', 'dreams, art and spirit', 'sueno, arte y espiritu', 'sogno, arte e spirito'),
    mc: M('Inspiração e imagem mágica — ótimo para arte; cuidado com ilusão e névoa.', 'Inspiration and a magical image — great for art; watch for illusion and fog.', 'Inspiracion e imagen magica — genial para el arte; cuida la ilusion.', 'Ispirazione e immagine magica — ottimo per l arte; attenzione all illusione.'),
    ic: M('Sensibilidade e espiritualidade no lar — pode faltar clareza/limites.', 'Sensitivity and spirituality at home — clarity and boundaries can blur.', 'Sensibilidad y espiritualidad en el hogar — pueden faltar limites.', 'Sensibilita e spiritualita in casa — chiarezza e confini possono sfumare.'),
  },
  pluto: {
    essence: M('poder e transformação', 'power and transformation', 'poder y transformacion', 'potere e trasformazione'),
    mc: M('Poder e transformação profunda na carreira — intenso, você renasce publicamente.', 'Power and deep transformation in career — intense; you get reborn publicly.', 'Poder y transformacion profunda en la carrera — intenso, renaces en publico.', 'Potere e trasformazione profonda nella carriera — intenso, rinasci in pubblico.'),
    ic: M('Transformações profundas nas raízes — família, controle e recomeços.', 'Deep transformation at your roots — family, control and rebirth.', 'Transformaciones profundas en las raices — familia, control y renacimiento.', 'Trasformazioni profonde nelle radici — famiglia, controllo e rinascita.'),
  },
}

export function astroMeaning(planetKey: string, angle: 'MC' | 'IC', language: string): { essence: string; text: string } | null {
  const lang: Lang = (['pt-BR', 'en-US', 'es-ES', 'it-IT'].includes(language) ? language : 'pt-BR') as Lang
  const p = ASTRO_MEANING[String(planetKey).toLowerCase()]
  if (!p) return null
  return { essence: p.essence[lang], text: (angle === 'MC' ? p.mc : p.ic)[lang] }
}
