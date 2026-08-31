// Significado das linhas do Astro Map por planeta × ângulo, nos 4 idiomas.
// MC = carreira/imagem pública · IC = raízes/lar · ASC = como você se mostra /
// vitalidade · DSC = relacionamentos / o que você atrai. Leitura orientativa.
type Lang = 'pt-BR' | 'en-US' | 'es-ES' | 'it-IT'
type L = Record<Lang, string>
type PlanetMeaning = { essence: L; mc: L; ic: L; asc: L; dsc: L }

const M = (pt: string, en: string, es: string, it: string): L => ({ 'pt-BR': pt, 'en-US': en, 'es-ES': es, 'it-IT': it })

export const ASTRO_MEANING: Record<string, PlanetMeaning> = {
  sun: {
    essence: M('vitalidade e identidade', 'vitality and identity', 'vitalidad e identidad', 'vitalita e identita'),
    mc: M('Você brilha e é visto — reconhecimento, autoridade e presença pública.', 'You shine and get seen — recognition, authority and public presence.', 'Brillas y te ven — reconocimiento, autoridad y presencia publica.', 'Brilli e sei visto — riconoscimento, autorita e presenza pubblica.'),
    ic: M('Sensação de pertencer — raízes fortes, lar e identidade enraizada.', 'A sense of belonging — strong roots, home and grounded identity.', 'Sensacion de pertenecer — raices fuertes, hogar e identidad.', 'Senso di appartenenza — radici forti, casa e identita.'),
    asc: M('Você irradia — mais vitalidade, presença e confiança pessoal.', 'You radiate — more vitality, presence and self-confidence.', 'Irradias — mas vitalidad, presencia y confianza.', 'Irradi — piu vitalita, presenza e fiducia.'),
    dsc: M('Parcerias que te dão brilho e propósito; atrai gente luminosa.', 'Partnerships that add shine and purpose; you attract bright people.', 'Parejas que dan brillo y proposito; atraes gente luminosa.', 'Relazioni che danno luce e scopo; attrai persone luminose.'),
  },
  moon: {
    essence: M('emoções e cuidado', 'emotions and care', 'emociones y cuidado', 'emozioni e cura'),
    mc: M('Sua sensibilidade fica visível — cuidar/acolher vira parte da sua imagem.', 'Your sensitivity becomes visible — nurturing becomes part of your image.', 'Tu sensibilidad se hace visible — cuidar es parte de tu imagen.', 'La tua sensibilita diventa visibile — accudire fa parte della tua immagine.'),
    ic: M('Aconchego e segurança emocional — uma das linhas mais fortes para morar.', 'Comfort and emotional safety — one of the strongest lines to live on.', 'Comodidad y seguridad emocional — una de las lineas mas fuertes para vivir.', 'Conforto e sicurezza emotiva — una delle linee piu forti per vivere.'),
    asc: M('Emoções à flor da pele — mais sensível, intuitivo e acolhedor.', 'Emotions on the surface — more sensitive, intuitive and caring.', 'Emociones a flor de piel — mas sensible, intuitivo y acogedor.', 'Emozioni in superficie — piu sensibile, intuitivo e accogliente.'),
    dsc: M('Vínculos afetivos fortes — atrai (e busca) quem cuida.', 'Strong emotional bonds — you attract (and seek) nurturing people.', 'Vinculos afectivos fuertes — atraes a quien cuida.', 'Legami affettivi forti — attrai chi accudisce.'),
  },
  mercury: {
    essence: M('comunicação e mente', 'communication and mind', 'comunicacion y mente', 'comunicazione e mente'),
    mc: M('Ideias, negócios e comunicação em destaque — bom para estudar e trabalhar com a mente.', 'Ideas, business and communication stand out — good to study and work with your mind.', 'Ideas, negocios y comunicacion destacan — bueno para estudiar y trabajar con la mente.', 'Idee, affari e comunicazione emergono — buono per studiare e lavorare con la mente.'),
    ic: M('Conversas e aprendizado no lar — mente ativa nas raízes.', 'Talk and learning at home — an active mind at your roots.', 'Conversaciones y aprendizaje en el hogar — mente activa en las raices.', 'Dialogo e apprendimento in casa — mente attiva nelle radici.'),
    asc: M('Mente ágil e curiosa — você fala, escreve e se conecta com facilidade.', 'A quick, curious mind — you speak, write and connect easily.', 'Mente agil y curiosa — hablas, escribes y conectas facil.', 'Mente agile e curiosa — parli, scrivi e ti connetti con facilita.'),
    dsc: M('Parcerias mentais — trocas, conversa e negócios com o outro.', 'Mental partnerships — exchange, talk and deals with others.', 'Parejas mentales — intercambio, conversacion y negocios.', 'Relazioni mentali — scambio, dialogo e affari.'),
  },
  venus: {
    essence: M('amor, beleza e prazer', 'love, beauty and pleasure', 'amor, belleza y placer', 'amore, bellezza e piacere'),
    mc: M('Charme social — sucesso pelas relações, arte e beleza; você atrai.', 'Social charm — success through relationships, art and beauty; you attract.', 'Encanto social — exito por las relaciones, arte y belleza; atraes.', 'Fascino sociale — successo tramite relazioni, arte e bellezza; attrai.'),
    ic: M('Amor e harmonia no lar — uma das linhas mais doces para o coração.', 'Love and harmony at home — one of the sweetest lines for the heart.', 'Amor y armonia en el hogar — una de las lineas mas dulces para el corazon.', 'Amore e armonia in casa — una delle linee piu dolci per il cuore.'),
    asc: M('Charme e magnetismo pessoal — você fica mais bonito e atraente.', 'Charm and personal magnetism — you feel more beautiful and attractive.', 'Encanto y magnetismo — te sientes mas bello y atractivo.', 'Fascino e magnetismo — ti senti piu bello e attraente.'),
    dsc: M('Amor e atração — a linha clássica dos relacionamentos; encontros doces.', 'Love and attraction — the classic relationship line; sweet encounters.', 'Amor y atraccion — la linea clasica de las relaciones; encuentros dulces.', 'Amore e attrazione — la classica linea delle relazioni; incontri dolci.'),
  },
  mars: {
    essence: M('energia, desejo e ação', 'energy, desire and action', 'energia, deseo y accion', 'energia, desiderio e azione'),
    mc: M('Ambição e coragem na carreira — você age e compete; cuidado com o excesso.', 'Ambition and courage in career — you act and compete; watch for overdrive.', 'Ambicion y coraje en la carrera — actuas y compites; cuida el exceso.', 'Ambizione e coraggio nella carriera — agisci e competi; attenzione agli eccessi.'),
    ic: M('Energia intensa em casa — impulso para construir, mas pode gerar atrito.', 'Intense energy at home — drive to build, but can spark friction.', 'Energia intensa en casa — impulso para construir, pero puede generar friccion.', 'Energia intensa in casa — spinta a costruire, ma puo creare attrito.'),
    asc: M('Mais energia e iniciativa — você age rápido; cuidado com impaciência.', 'More energy and drive — you act fast; watch for impatience.', 'Mas energia e iniciativa — actuas rapido; cuida la impaciencia.', 'Piu energia e iniziativa — agisci in fretta; attenzione all impazienza.'),
    dsc: M('Paixão e atrito nas parcerias — desejo forte, encontros intensos.', 'Passion and friction in partnerships — strong desire, intense encounters.', 'Pasion y friccion en las parejas — deseo fuerte, encuentros intensos.', 'Passione e attrito nelle relazioni — desiderio forte, incontri intensi.'),
  },
  jupiter: {
    essence: M('sorte, expansão e sentido', 'luck, expansion and meaning', 'suerte, expansion y sentido', 'fortuna, espansione e senso'),
    mc: M('Expansão e sorte na vida pública — oportunidades, crescimento e reconhecimento.', 'Expansion and luck in public life — opportunity, growth and recognition.', 'Expansion y suerte en la vida publica — oportunidades, crecimiento y reconocimiento.', 'Espansione e fortuna nella vita pubblica — opportunita, crescita e riconoscimento.'),
    ic: M('Abundância e otimismo no lar — boa base para prosperar e crescer.', 'Abundance and optimism at home — a good base to thrive and grow.', 'Abundancia y optimismo en el hogar — buena base para prosperar.', 'Abbondanza e ottimismo in casa — buona base per prosperare.'),
    asc: M('Otimismo e sorte pessoal — você cresce, confia e se abre ao mundo.', 'Optimism and personal luck — you grow, trust and open to the world.', 'Optimismo y suerte personal — creces, confias y te abres.', 'Ottimismo e fortuna personale — cresci, ti fidi e ti apri.'),
    dsc: M('Parcerias que expandem e abençoam — encontros generosos e de sorte.', 'Partnerships that expand and bless — generous, lucky encounters.', 'Parejas que expanden y bendicen — encuentros generosos y con suerte.', 'Relazioni che espandono e benedicono — incontri generosi e fortunati.'),
  },
  saturn: {
    essence: M('estrutura, esforço e tempo', 'structure, effort and time', 'estructura, esfuerzo y tiempo', 'struttura, impegno e tempo'),
    mc: M('Carreira construída com esforço — sólida e duradoura, mas exige responsabilidade.', 'A career built with effort — solid and lasting, but demands responsibility.', 'Carrera construida con esfuerzo — solida y duradera, pide responsabilidad.', 'Carriera costruita con impegno — solida e duratura, chiede responsabilita.'),
    ic: M('Peso e maturidade nas raízes — lições de família; estrutura, não leveza.', 'Weight and maturity at your roots — family lessons; structure, not lightness.', 'Peso y madurez en las raices — lecciones de familia; estructura, no ligereza.', 'Peso e maturita nelle radici — lezioni di famiglia; struttura, non leggerezza.'),
    asc: M('Mais sério e contido — maturidade e responsabilidade; leveza custa.', 'More serious and reserved — maturity and duty; lightness takes work.', 'Mas serio y contenido — madurez y responsabilidad.', 'Piu serio e riservato — maturita e responsabilita.'),
    dsc: M('Compromisso e responsabilidade nas relações — vínculos sérios e duradouros.', 'Commitment and duty in relationships — serious, lasting bonds.', 'Compromiso y responsabilidad en las relaciones — vinculos serios.', 'Impegno e responsabilita nelle relazioni — legami seri e duraturi.'),
  },
  uranus: {
    essence: M('liberdade e ruptura', 'freedom and disruption', 'libertad y ruptura', 'liberta e rottura'),
    mc: M('Caminhos originais e mudanças bruscas na carreira — inovação, imprevisto.', 'Original paths and sudden career shifts — innovation, the unexpected.', 'Caminos originales y cambios bruscos en la carrera — innovacion, lo inesperado.', 'Percorsi originali e svolte improvvise nella carriera — innovazione, imprevisto.'),
    ic: M('Lar instável ou libertador — vida fora do padrão, muda com frequência.', 'An unstable or freeing home — an unconventional life that shifts often.', 'Hogar inestable o liberador — vida fuera de lo comun, cambia seguido.', 'Casa instabile o liberatoria — vita fuori dagli schemi, cambia spesso.'),
    asc: M('Original e imprevisível — você se sente livre, autêntico e diferente.', 'Original and unpredictable — you feel free, authentic and different.', 'Original e impredecible — te sientes libre y autentico.', 'Originale e imprevedibile — ti senti libero e autentico.'),
    dsc: M('Encontros súbitos e relações fora do padrão — liberdade acima de tudo.', 'Sudden meetings and unconventional bonds — freedom above all.', 'Encuentros subitos y relaciones atipicas — libertad ante todo.', 'Incontri improvvisi e relazioni atipiche — liberta sopra tutto.'),
  },
  neptune: {
    essence: M('sonho, arte e espírito', 'dreams, art and spirit', 'sueno, arte y espiritu', 'sogno, arte e spirito'),
    mc: M('Inspiração e imagem mágica — ótimo para arte; cuidado com ilusão e névoa.', 'Inspiration and a magical image — great for art; watch for illusion and fog.', 'Inspiracion e imagen magica — genial para el arte; cuida la ilusion.', 'Ispirazione e immagine magica — ottimo per l arte; attenzione all illusione.'),
    ic: M('Sensibilidade e espiritualidade no lar — pode faltar clareza/limites.', 'Sensitivity and spirituality at home — clarity and boundaries can blur.', 'Sensibilidad y espiritualidad en el hogar — pueden faltar limites.', 'Sensibilita e spiritualita in casa — chiarezza e confini possono sfumare.'),
    asc: M('Sensível e artístico — inspirado, porém um tanto difuso; sonhador.', 'Sensitive and artistic — inspired, but a bit blurry; dreamy.', 'Sensible y artistico — inspirado, algo difuso; sonador.', 'Sensibile e artistico — ispirato, un po sfumato; sognatore.'),
    dsc: M('Amor idealizado — encontros mágicos ou ilusórios; cuidado com miragens.', 'Idealized love — magical or illusory encounters; beware of mirages.', 'Amor idealizado — encuentros magicos o ilusorios; cuida los espejismos.', 'Amore idealizzato — incontri magici o illusori; attenzione ai miraggi.'),
  },
  pluto: {
    essence: M('poder e transformação', 'power and transformation', 'poder y transformacion', 'potere e trasformazione'),
    mc: M('Poder e transformação profunda na carreira — intenso, você renasce publicamente.', 'Power and deep transformation in career — intense; you get reborn publicly.', 'Poder y transformacion profunda en la carrera — intenso, renaces en publico.', 'Potere e trasformazione profonda nella carriera — intenso, rinasci in pubblico.'),
    ic: M('Transformações profundas nas raízes — família, controle e recomeços.', 'Deep transformation at your roots — family, control and rebirth.', 'Transformaciones profundas en las raices — familia, control y renacimiento.', 'Trasformazioni profonde nelle radici — famiglia, controllo e rinascita.'),
    asc: M('Intenso e magnético — você transforma e é transformado; presença densa.', 'Intense and magnetic — you transform and are transformed; dense presence.', 'Intenso y magnetico — transformas y te transformas.', 'Intenso e magnetico — trasformi e sei trasformato.'),
    dsc: M('Relações intensas de poder e profundidade — paixão que revira tudo.', 'Intense relationships of power and depth — passion that upends everything.', 'Relaciones intensas de poder y profundidad — pasion que lo remueve todo.', 'Relazioni intense di potere e profondita — passione che sconvolge tutto.'),
  },
}

export function astroMeaning(planetKey: string, angle: 'MC' | 'IC' | 'ASC' | 'DSC', language: string): { essence: string; text: string } | null {
  const lang: Lang = (['pt-BR', 'en-US', 'es-ES', 'it-IT'].includes(language) ? language : 'pt-BR') as Lang
  const p = ASTRO_MEANING[String(planetKey).toLowerCase()]
  if (!p) return null
  const map = { MC: p.mc, IC: p.ic, ASC: p.asc, DSC: p.dsc }
  return { essence: p.essence[lang], text: (map[angle] || p.mc)[lang] }
}
