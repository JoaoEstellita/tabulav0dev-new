/**
 * Conteúdo BESPOKE védico — Planeta em Rashi (signo sideral). COMPLETO: 108
 * (9 grahas × 12 rashis). Tom Jyotish: karaka (significador) + natureza do signo
 * + dignidade (exaltado/domicílio/debilitado) onde se aplica.
 * Chave: `${planeta}_in_${rashi}` (planeta lowercase EN; rashi = key de RASHIS).
 * pt-BR base. i18n entra depois (fallback do resolver cobre não-pt até lá).
 */
export const PLANET_IN_RASHI_PTBR: Record<string, string> = {
  // ── SOL (alma, pai, autoridade, vitalidade) ──
  sun_in_mesha: 'Sol em Áries (exaltado): identidade forte, corajosa e pioneira. Autoridade natural, vontade de liderar e iniciar. Ego vigoroso — brilha na ação, cuidado com a arrogância.',
  sun_in_vrishabha: 'Sol em Touro: identidade estável, sensual e voltada ao valor. Autoridade paciente, ligada a recursos e beleza; brilha construindo o que dura.',
  sun_in_mithuna: 'Sol em Gêmeos: identidade curiosa, comunicativa e versátil. Brilha pela palavra e pelo intelecto; autoridade que informa e conecta.',
  sun_in_karka: 'Sol em Câncer: identidade sensível e protetora. A alma se expressa cuidando; autoridade emocional. Brilha no lar e no acolhimento.',
  sun_in_simha: 'Sol em Leão (domicílio): identidade régia, calorosa e criativa. Autoridade generosa e natural; brilha sendo visto e liderando com o coração. Posição forte.',
  sun_in_kanya: 'Sol em Virgem: identidade analítica, prestativa e meticulosa. Brilha servindo e aperfeiçoando; autoridade discreta, ligada ao trabalho.',
  sun_in_tula: 'Sol em Libra (debilitado): identidade que se define pela relação e pela harmonia. Autoridade diplomática; a força vem de equilibrar sem se anular no outro.',
  sun_in_vrishchika: 'Sol em Escorpião: identidade intensa, profunda e reservada. Autoridade que transforma; brilha no oculto, na pesquisa, no poder controlado.',
  sun_in_dhanu: 'Sol em Sagitário: identidade otimista, ética e expansiva. Autoridade de mestre; brilha ensinando, viajando, buscando sentido.',
  sun_in_makara: 'Sol em Capricórnio: identidade ambiciosa, disciplinada e prática. Autoridade construída no esforço; brilha pela carreira e pela responsabilidade.',
  sun_in_kumbha: 'Sol em Aquário: identidade original, coletiva e independente. Autoridade humanitária; brilha em causas, redes e ideias à frente.',
  sun_in_meena: 'Sol em Peixes: a identidade se expressa pela sensibilidade e pela fé. Alma voltada ao invisível e à compaixão; autoridade suave. Brilha servindo e inspirando.',

  // ── LUA (mente, mãe, emoções, cuidado) ──
  moon_in_mesha: 'Lua em Áries: mente rápida, impulsiva e corajosa. Emoções diretas e passageiras; acalma-se agindo.',
  moon_in_vrishabha: 'Lua em Touro (exaltada): a mente encontra paz na estabilidade, no conforto e na beleza. Emoções constantes, sensuais e leais. Uma das melhores posições da Lua — nutre e é nutrido com solidez.',
  moon_in_mithuna: 'Lua em Gêmeos: mente inquieta, curiosa e comunicativa. Emoções variáveis, racionalizadas; acalma-se conversando e aprendendo.',
  moon_in_karka: 'Lua em Câncer (domicílio): mente profundamente emocional e maternal. Sensibilidade forte, memória e apego ao lar. Posição poderosa da Lua.',
  moon_in_simha: 'Lua em Leão: mente orgulhosa, calorosa e dramática. Emoções generosas; precisa de reconhecimento e brilho afetivo.',
  moon_in_kanya: 'Lua em Virgem: mente analítica e prestativa. Emoções contidas, voltadas ao cuidado prático; tende a se preocupar.',
  moon_in_tula: 'Lua em Libra: mente que busca harmonia e relação. Emoções equilibradas e sociáveis; sofre com o conflito, precisa do par.',
  moon_in_vrishchika: 'Lua em Escorpião (debilitada): mente intensa, profunda e secreta. Emoções extremas e transformadoras; o desafio é não se afogar na própria intensidade.',
  moon_in_dhanu: 'Lua em Sagitário: mente otimista, livre e filosófica. Emoções expansivas; acalma-se com liberdade, viagem e sentido.',
  moon_in_makara: 'Lua em Capricórnio: mente séria, controlada e ambiciosa. Emoções contidas por dever; aquece devagar, sente com responsabilidade.',
  moon_in_kumbha: 'Lua em Aquário: mente independente, mental e humanitária. Emoções filtradas pela razão; nutre-se de causas e amizades.',
  moon_in_meena: 'Lua em Peixes: mente sonhadora, compassiva e intuitiva. Emoções oceânicas e empáticas; precisa de âncora para não se dispersar.',

  // ── MARTE (energia, coragem, ação, irmãos) ──
  mars_in_mesha: 'Marte em Áries (domicílio): energia direta, corajosa e pioneira. Ação imediata e potente; ótimo para iniciar e lutar. Posição forte.',
  mars_in_vrishabha: 'Marte em Touro: energia paciente e persistente. Começa devagar mas não para; determinação sensual e prática. Teimoso quando contrariado.',
  mars_in_mithuna: 'Marte em Gêmeos: energia mental e verbal. Age pela palavra e pela ideia; muitas frentes, dispersa se não focar.',
  mars_in_karka: 'Marte em Câncer (debilitado): energia emocional e indireta. Age pelo afeto e pela defesa do lar; a força vacila sob o humor — canaliza no cuidado.',
  mars_in_simha: 'Marte em Leão: energia dramática, corajosa e orgulhosa. Age para liderar e brilhar; nobre no combate, precisa de causa à altura.',
  mars_in_kanya: 'Marte em Virgem: energia meticulosa e técnica. Age com precisão e método; ótimo executor, crítico do erro.',
  mars_in_tula: 'Marte em Libra: energia diplomática, canalizada na relação. Age em parceria e pela justiça; hesita no confronto direto.',
  mars_in_vrishchika: 'Marte em Escorpião (domicílio): energia intensa, estratégica e penetrante. Ação controlada e profunda; grande poder de transformação. Posição forte.',
  mars_in_dhanu: 'Marte em Sagitário: energia expansiva e idealista. Age por convicção e causa; combate por princípios, ama a liberdade.',
  mars_in_makara: 'Marte em Capricórnio (exaltado): energia disciplinada, ambiciosa e imparável. Ação estratégica e resistente; a melhor posição de Marte para realizar.',
  mars_in_kumbha: 'Marte em Aquário: energia inventiva e coletiva. Age por ideais e grupos; luta pelo futuro, de modo desapegado.',
  mars_in_meena: 'Marte em Peixes: energia sensível e indireta. Age pela compaixão e pela imaginação; força difusa, ótima na arte e na cura.',

  // ── MERCÚRIO (intelecto, comunicação, comércio) ──
  mercury_in_mesha: 'Mercúrio em Áries: intelecto rápido, direto e corajoso. Pensa e decide na hora, às vezes impaciente; comunicação assertiva.',
  mercury_in_vrishabha: 'Mercúrio em Touro: intelecto prático, constante e sensorial. Pensa devagar mas com solidez; boa mente para valor e beleza.',
  mercury_in_mithuna: 'Mercúrio em Gêmeos (domicílio): intelecto ágil, curioso e versátil. Comunicação brilhante; aprende e conecta com facilidade. Posição forte.',
  mercury_in_karka: 'Mercúrio em Câncer: intelecto emocional e intuitivo. Pensa com o coração, boa memória; comunicação afetiva.',
  mercury_in_simha: 'Mercúrio em Leão: intelecto confiante, dramático e expressivo. Comunica com autoridade e brilho; pensa em grande.',
  mercury_in_kanya: 'Mercúrio em Virgem (domicílio e exaltado): intelecto analítico, preciso e discernente. A melhor mente do zodíaco para detalhe e método. Posição poderosa.',
  mercury_in_tula: 'Mercúrio em Libra: intelecto equilibrado, diplomático e estético. Pensa em relação e justiça; comunicação harmoniosa.',
  mercury_in_vrishchika: 'Mercúrio em Escorpião: intelecto penetrante, investigativo e secreto. Enxerga o oculto; comunicação intensa e estratégica.',
  mercury_in_dhanu: 'Mercúrio em Sagitário: intelecto amplo, filosófico e otimista. Pensa em grandes ideias; inspirador, menos no detalhe.',
  mercury_in_makara: 'Mercúrio em Capricórnio: intelecto prático, estruturado e ambicioso. Pensa com método e objetivo; comunicação séria e útil.',
  mercury_in_kumbha: 'Mercúrio em Aquário: intelecto original, lógico e coletivo. Pensa à frente; comunicação inventiva e humanitária.',
  mercury_in_meena: 'Mercúrio em Peixes (debilitado): intelecto intuitivo e difuso. Pensa por imagens e sentimentos; a razão se dilui na imaginação — força na arte, desafio no foco.',

  // ── JÚPITER (sabedoria, fé, fortuna, filhos) ──
  jupiter_in_mesha: 'Júpiter em Áries: sabedoria corajosa e pioneira. Fé na ação; expande iniciando, lidera com princípios.',
  jupiter_in_vrishabha: 'Júpiter em Touro: sabedoria aplicada ao conforto, à prosperidade e aos valores. Generosidade fértil e concreta; crescimento por estabilidade.',
  jupiter_in_mithuna: 'Júpiter em Gêmeos: sabedoria curiosa e versátil. Expande pelo conhecimento e pela palavra; muitas ideias, foco é o desafio.',
  jupiter_in_karka: 'Júpiter em Câncer (exaltado): sabedoria nutridora e devocional. Fé no lar, na mãe, no cuidado; máxima generosidade e proteção. Melhor posição de Júpiter.',
  jupiter_in_simha: 'Júpiter em Leão: sabedoria régia e generosa. Fé no próprio brilho; expande liderando e inspirando com o coração.',
  jupiter_in_kanya: 'Júpiter em Virgem: sabedoria prática e servil. Fé no trabalho e no detalhe; expande aperfeiçoando, com humildade.',
  jupiter_in_tula: 'Júpiter em Libra: sabedoria diplomática e justa. Fé na relação e na harmonia; expande pela parceria e pela ética.',
  jupiter_in_vrishchika: 'Júpiter em Escorpião: sabedoria profunda e oculta. Fé na transformação; expande pelo mistério, pela pesquisa, pela intensidade.',
  jupiter_in_dhanu: 'Júpiter em Sagitário (domicílio): sabedoria expansiva, ética e filosófica. Fé natural; mestre e viajante do sentido. Posição poderosa.',
  jupiter_in_makara: 'Júpiter em Capricórnio (debilitado): sabedoria contida pelo pragmatismo. Fé testada pela realidade; expande com esforço, aprende a valorizar o concreto.',
  jupiter_in_kumbha: 'Júpiter em Aquário: sabedoria humanitária e original. Fé no coletivo e no futuro; expande por causas e ideias amplas.',
  jupiter_in_meena: 'Júpiter em Peixes (domicílio): sabedoria compassiva e mística. Fé devocional; expande pela espiritualidade e pela entrega. Posição poderosa.',

  // ── VÊNUS (amor, prazer, arte, afeto) ──
  venus_in_mesha: 'Vênus em Áries: amor impulsivo, ardente e direto. Paixão rápida; conquista com iniciativa, precisa de novidade.',
  venus_in_vrishabha: 'Vênus em Touro (domicílio): amor sensual, leal e constante. Prazer nos sentidos, na beleza e no conforto. Posição forte e fértil.',
  venus_in_mithuna: 'Vênus em Gêmeos: amor mental, comunicativo e leve. Encanta pela palavra e pela variedade; precisa de estímulo intelectual.',
  venus_in_karka: 'Vênus em Câncer: amor terno, protetor e nutridor. Afeto profundo e caseiro; ama cuidando e sendo cuidado.',
  venus_in_simha: 'Vênus em Leão: amor caloroso, dramático e generoso. Romance grandioso; ama brilhar e ser adorado.',
  venus_in_kanya: 'Vênus em Virgem (debilitada): amor tímido, prestativo e criterioso. Demonstra afeto servindo; o desafio é não sufocar o prazer na crítica.',
  venus_in_tula: 'Vênus em Libra (domicílio): amor harmonioso, estético e relacional. Prazer no par e na beleza; charme e diplomacia. Posição forte.',
  venus_in_vrishchika: 'Vênus em Escorpião: amor intenso, possessivo e transformador. Paixão profunda e magnética; tudo ou nada.',
  venus_in_dhanu: 'Vênus em Sagitário: amor livre, otimista e aventureiro. Ama a liberdade e o crescimento a dois; afeto expansivo.',
  venus_in_makara: 'Vênus em Capricórnio: amor sério, comprometido e prático. Demonstra afeto com lealdade e provisão; aquece devagar.',
  venus_in_kumbha: 'Vênus em Aquário: amor independente, amistoso e incomum. Prazer na liberdade e na amizade; ama sem prender.',
  venus_in_meena: 'Vênus em Peixes (exaltada): o amor no seu grau mais elevado — devocional, romântico e transcendente. Arte, compaixão e entrega. Uma das posições mais doces de Vênus.',

  // ── SATURNO (disciplina, karma, tempo, estrutura) ──
  saturn_in_mesha: 'Saturno em Áries (debilitado): disciplina em tensão com o impulso. Age contra a própria pressa; a maturidade vem de aprender paciência na ação.',
  saturn_in_vrishabha: 'Saturno em Touro: disciplina paciente e material. Constrói recursos e segurança com o tempo; solidez que dura.',
  saturn_in_mithuna: 'Saturno em Gêmeos: disciplina mental e comunicativa. Estrutura o pensamento e a palavra; aprende com seriedade.',
  saturn_in_karka: 'Saturno em Câncer: disciplina emocional. Estrutura o afeto e o lar com dever; frieza aparente que esconde cuidado.',
  saturn_in_simha: 'Saturno em Leão: disciplina da autoridade e do ego. Aprende humildade no poder; lidera com responsabilidade, não com vaidade.',
  saturn_in_kanya: 'Saturno em Virgem: disciplina do detalhe e do serviço. Trabalho meticuloso e constante; perfeccionismo maduro.',
  saturn_in_tula: 'Saturno em Libra (exaltado): disciplina da justiça e da relação. Estrutura parcerias com equidade; a melhor posição de Saturno — compromisso maduro.',
  saturn_in_vrishchika: 'Saturno em Escorpião: disciplina da transformação. Estrutura o poder e o oculto; aprende pela crise, com profundidade.',
  saturn_in_dhanu: 'Saturno em Sagitário: disciplina aplicada à filosofia, à fé e ao sentido. Estrutura crenças com seriedade; ética firme, mestre exigente de si.',
  saturn_in_makara: 'Saturno em Capricórnio (domicílio): disciplina ambiciosa e estrutural. Constrói carreira e legado com paciência; mestre do tempo. Posição forte.',
  saturn_in_kumbha: 'Saturno em Aquário (domicílio): disciplina coletiva e original. Estrutura causas e sistemas; trabalha pelo futuro com desapego. Posição forte.',
  saturn_in_meena: 'Saturno em Peixes: disciplina da compaixão e da fé. Estrutura o sonho e o espírito; aprende a dar forma ao intangível.',

  // ── RAHU (desejo, ambição, o inédito) ──
  rahu_in_mesha: 'Rahu em Áries: desejo de liderar, iniciar e conquistar. Ambição impulsiva; fome de ser o primeiro.',
  rahu_in_vrishabha: 'Rahu em Touro: desejo de posse, prazer e status material. Fome de segurança e beleza; risco de excesso.',
  rahu_in_mithuna: 'Rahu em Gêmeos: desejo de informação, conexão e palavra. Ambição intelectual; fome de aprender e circular.',
  rahu_in_karka: 'Rahu em Câncer: desejo emocional e de pertencer. Fome de raiz, lar e cuidado; intensidade afetiva.',
  rahu_in_simha: 'Rahu em Leão: desejo de brilho, poder e reconhecimento. Ambição do ego; fome de ser visto.',
  rahu_in_kanya: 'Rahu em Virgem: desejo de perfeição, utilidade e controle. Ambição meticulosa; fome de aperfeiçoar.',
  rahu_in_tula: 'Rahu em Libra: desejo de relação, beleza e harmonia. Fome de parceria e status social.',
  rahu_in_vrishchika: 'Rahu em Escorpião: desejo de poder oculto e transformação. Fome do profundo, do intenso, do proibido.',
  rahu_in_dhanu: 'Rahu em Sagitário: desejo de expansão, sentido e mestre. Ambição filosófica; fome de verdade e horizonte.',
  rahu_in_makara: 'Rahu em Capricórnio: desejo de status, poder e realização mundana. Ambição fria e estratégica.',
  rahu_in_kumbha: 'Rahu em Aquário: desejo de futuro, rede e singularidade. Fome do inédito e do coletivo.',
  rahu_in_meena: 'Rahu em Peixes: desejo de transcendência e fuga. Fome espiritual — ou de escapismo e ilusão.',

  // ── KETU (desapego, espiritualidade, o que já foi) ──
  ketu_in_mesha: 'Ketu em Áries: desapego da ação e do ego; a coragem já foi dominada, agora volta-se ao interior.',
  ketu_in_vrishabha: 'Ketu em Touro: desapego do prazer e da posse; solta o material, busca o essencial.',
  ketu_in_mithuna: 'Ketu em Gêmeos: desapego da palavra e da lógica; sabedoria intuitiva além do intelecto.',
  ketu_in_karka: 'Ketu em Câncer: desapego emocional e do lar; solta o apego afetivo, ancora dentro.',
  ketu_in_simha: 'Ketu em Leão: desapego do ego e do brilho; poder já vivido, agora humilde.',
  ketu_in_kanya: 'Ketu em Virgem: desapego da perfeição e do controle; solta a crítica, aceita o imperfeito.',
  ketu_in_tula: 'Ketu em Libra: desapego da relação e da aprovação; encontra o equilíbrio sozinho.',
  ketu_in_vrishchika: 'Ketu em Escorpião: desapego do poder e do oculto; a intensidade já foi vivida, agora é rendição.',
  ketu_in_dhanu: 'Ketu em Sagitário: desapego do dogma; a fé vira experiência direta, sem muletas.',
  ketu_in_makara: 'Ketu em Capricórnio: desapego do status e da ambição; solta a máscara mundana.',
  ketu_in_kumbha: 'Ketu em Aquário: desapego do coletivo e da ideia; singularidade que não precisa de grupo.',
  ketu_in_meena: 'Ketu em Peixes: posição de moksha — desapego do próprio desapego, dissolução espiritual.',
}
