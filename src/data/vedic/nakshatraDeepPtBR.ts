/**
 * Leitura PROFUNDA de Nakshatra (estilo tradicional Jyotish): 5 seções — físico,
 * caráter, profissão, família, saúde — por GÊNERO (feminino/masculino) + nota de
 * PADA (navamsa) que recolore a leitura. Chave = key do nakshatra (NAKSHATRAS).
 *
 * Navamsa dos padas (ciclo Áries a cada 3 nakshatras):
 *   Krittika (3): Sagitário, Capricórnio, Aquário, Peixes.
 *   Mrigashira (5): Leão, Virgem, Libra, Escorpião.
 *
 * FASE: lote-prova (Krittika + Mrigashira). Os outros 25 entram por lote.
 * pt-BR base; i18n é fase futura (resolver cai no pt-BR até lá).
 */
export interface NakshatraGenderReading {
  fisico: string
  carater: string
  profissao: string
  familia: string
  saude: string
}
export interface NakshatraPadaReading {
  navamsa: string
  female: string
  male: string
}
export interface NakshatraDeep {
  female: NakshatraGenderReading
  male: NakshatraGenderReading
  padas: Record<number, NakshatraPadaReading>
}

export const NAKSHATRA_DEEP_PTBR: Record<string, NakshatraDeep> = {
  krittika: {
    female: {
      fisico: 'Presença marcante, traços firmes e olhar penetrante, brilhante e altivo — emana força, liderança e dignidade natural. Beleza imponente e magnética, energia vital contagiante e movimentos rápidos que revelam independência.',
      carater: 'Personalidade forte, determinada e independente. Coração amoroso, mas jamais se subjuga ao controle de terceiros: prefere romper laços a perder a liberdade. Direta, honesta e avessa à hipocrisia — sob tensão, orgulho rígido e temperamento impetuoso, com tendência a cortes drásticos para proteger a própria integridade.',
      profissao: 'Extremamente inteligente e obstinada, com grande capacidade administrativa e de liderança. Destaca-se em pesquisa, direito, gestão de crises, medicina (sobretudo cirurgia), engenharias ou cargos de comando. A renda costuma vir da própria iniciativa, de profissões autônomas ou da liderança de projetos — brilha ao assumir o controle total da carreira.',
      familia: 'Vida familiar marcada pela busca de autonomia; altos e baixos na vida conjugal por não tolerar subordinação e exigir um parceiro que caminhe ao seu lado. Protege ferozmente quem ama, mas pode se afastar de parentes por disputas de orgulho, preferindo o isolamento a abrir mão das convicções.',
      saude: 'Constituição forte e boa imunidade, mas saúde vulnerável ao excesso de calor interno (fogo/Agni). Comuns: enxaquecas crônicas, distúrbios de estresse e ansiedade, inflamações súbitas, problemas de visão e irregularidades sanguíneas ou reprodutivas sob alta tensão emocional.',
    },
    male: {
      fisico: 'Porte robusto e imponente, traços marcados e olhar intenso e penetrante. Tez frequentemente quente, cabelos fartos; postura de comando e movimentos decididos que transmitem coragem e vigor. Aparência que impõe respeito.',
      carater: 'Firme, corajoso e direto, com forte senso de honra e justiça. Líder nato que não recua diante do conflito e corta o que considera falso ou impuro. Generoso com os seus, mas de pavio curto sob provocação — o orgulho e a franqueza podem soar ríspidos.',
      profissao: 'Mente aguda e ambiciosa, ótima para comando e execução. Sobressai em forças armadas, cirurgia, engenharia, metalurgia, direito, gestão e qualquer campo que exija coragem e decisão. Prospera liderando e empreendendo; recusa subordinação prolongada.',
      familia: 'Provedor protetor e leal, porém exigente. Preza a honra da família e defende os seus com intensidade; atritos surgem quando o orgulho fala mais alto. Precisa de uma parceira que respeite sua independência e não o queira dominar.',
      saude: 'Vitalidade forte, mas propenso a excesso de fogo interno: febres, inflamações, problemas de pele, acidez e tensão arterial. Estresse e raiva contida cobram caro — pede disciplina, moderação no calor e canais para descarregar a intensidade.',
    },
    padas: {
      1: {
        navamsa: 'Sagitário',
        female: 'Pada 1 (Navamsa de Sagitário, regido por Júpiter): acrescenta fé, ética e amor à liberdade. A força ganha tom idealista e professoral; inclina ao ensino, à filosofia, ao direito ou a causas. O corte torna-se princípio, não só impulso.',
        male: 'Pada 1 (Navamsa de Sagitário, Júpiter): coragem a serviço de ideais e verdade. Vocação de mestre, líder ético ou aventureiro; expande horizontes e inspira. O otimismo suaviza o pavio curto de Krittika.',
      },
      2: {
        navamsa: 'Capricórnio',
        female: 'Pada 2 (Navamsa de Capricórnio, Saturno): disciplina e ambição estruturam a força. Grande capacidade de construir e administrar a longo prazo; sobe pelo mérito e pela persistência. O orgulho vira responsabilidade e resistência.',
        male: 'Pada 2 (Navamsa de Capricórnio, Saturno): o guerreiro vira estrategista paciente. Ambição fria e organizada, ótima para gestão, estado e grandes estruturas. Colhe tarde, mas sólido; controla o impulso com dever.',
      },
      3: {
        navamsa: 'Aquário',
        female: 'Pada 3 (Navamsa de Aquário, Saturno): a independência ganha causa coletiva e originalidade. Mente à frente do tempo, humanitária e reformadora; brilha em grupos, tecnologia e movimentos. Precisa de liberdade para pensar diferente.',
        male: 'Pada 3 (Navamsa de Aquário, Saturno): líder de causas e ideias, mais coletivo que pessoal. Inventivo e desapegado, luta por reformas e pelo bem comum. A força serve ao grupo, não só ao ego.',
      },
      4: {
        navamsa: 'Peixes',
        female: 'Pada 4 (Navamsa de Peixes, Júpiter): a dureza se abranda em compaixão e espiritualidade. Sensibilidade e intuição fortes; a força volta-se à cura, à arte ou à devoção. Cuidado com o excesso de entrega.',
        male: 'Pada 4 (Navamsa de Peixes, Júpiter): coragem com coração compassivo. Inclina à cura, à espiritualidade e à arte; luta por quem não pode se defender. O idealismo pede âncora para não se dispersar.',
      },
    },
  },

  mrigashira: {
    female: {
      fisico: 'Traços delicados e expressivos, olhar curioso, vivo e sonhador; pele suave e feição jovial. Corpo ágil e gracioso, movimentos leves e inquietos. Charme sutil e ar de eterna juventude.',
      carater: 'Curiosa, gentil e inquieta — sempre à procura de algo: uma ideia, um lugar, um sentido. Mente rápida, doçura e sensibilidade fina; sociável e afetuosa, mas independente e um tanto desconfiada. Precisa de estímulo e novidade para não se entediar; foge de rotinas e de controle.',
      profissao: 'Versátil e comunicativa, brilha em escrita, pesquisa, comunicação, design, viagens, ensino ou comércio. Aprende rápido e transita entre áreas; a renda floresce onde há liberdade e variedade. Talento para conectar pessoas e ideias.',
      familia: 'Afetuosa e dedicada, mas precisa de espaço e movimento; prende-se mal a rotinas domésticas rígidas. Busca um parceiro que seja também companheiro de conversa e aventura. Mãe carinhosa e estimulante, que incentiva a curiosidade dos filhos; valoriza o lar sem abrir mão da liberdade.',
      saude: 'Sensível no sistema nervoso: ansiedade, insônia, oscilações de energia e tensão respiratória ou digestiva quando a mente não descansa. A dispersão cansa; pede rotina leve, respiração, natureza e algo que aquiete o excesso mental.',
    },
    male: {
      fisico: 'Aparência marcante, traços faciais bem definidos e olhar alerta, brilhante e investigativo. Estrutura esguia, atlética e proporcional, com grande agilidade. Energia jovial e dinâmica que se mantém com os anos — costuma parecer mais jovem do que é.',
      carater: 'Eterno pesquisador e explorador, de mente aguçada, perspicaz e sintonizada com o ambiente. Temperamento pacífico, cortês e diplomático, mas com firmeza inflexível quando traça um objetivo. Sociável e ótimo conversador, porém naturalmente desconfiado — analisa as intenções alheias. A vida é uma busca contínua por conhecimento, verdade e novas experiências.',
      profissao: 'Inteligência superior e grande versatilidade; brilha onde há investigação, lógica ou comunicação. Renda ligada à tecnologia da informação, jornalismo, engenharia, consultoria, turismo ou comércio internacional. Forte magnetismo para liderança e gestão.',
      familia: 'Provedor dedicado e protetor, valoriza a estabilidade do lar; a mente inquieta e a tendência a analisar demais o cônjuge podem gerar atritos. Precisa de uma parceira que compartilhe o estímulo intelectual e respeite sua independência. Compreendido, é marido leal e pai inspirador, que incentiva conhecimento, autonomia e esporte, com respeito às tradições.',
      saude: 'Constituição robusta, mas propenso a distúrbios de esgotamento mental e excesso de atividade cerebral: insônia, dores de cabeça, tensão em ombros e braços, sensibilidade respiratória. Precisa de esporte e ar livre com regularidade para canalizar a energia mental e evitar a ansiedade.',
    },
    padas: {
      1: {
        navamsa: 'Leão',
        female: 'Pada 1 (Navamsa de Leão, Sol): a curiosidade ganha orgulho e brilho. Presença que lidera e encanta; ambição de destaque e reconhecimento. Criativa e generosa, quer um palco à altura da própria luz.',
        male: 'Pada 1 (Navamsa de Leão, regido pelo Sol): postura mais imponente e ambiciosa. Forte magnetismo para liderança e poder — destaca-se em alta gestão, política, empreendedorismo ou funcionalismo de alto escalão. A busca ganha brilho, autoridade e desejo de reconhecimento.',
      },
      2: {
        navamsa: 'Virgem',
        female: 'Pada 2 (Navamsa de Virgem, Mercúrio): curiosidade minuciosa e prática. Talento para análise, organização, cuidado e serviço; perfeccionista e atenta ao detalhe. Precisa não se perder na autocrítica.',
        male: 'Pada 2 (Navamsa de Virgem, Mercúrio): o pesquisador vira analista meticuloso. Mente afiada para detalhe, método e crítica; excelente em pesquisa técnica, dados, saúde e edição. A busca torna-se precisão e aperfeiçoamento.',
      },
      3: {
        navamsa: 'Libra',
        female: 'Pada 3 (Navamsa de Libra, Vênus): graça, sociabilidade e talento estético. Encanta e concilia; inclina à arte, ao design e às relações. Floresce na parceria e na beleza, evitando o conflito.',
        male: 'Pada 3 (Navamsa de Libra, Vênus): charme, diplomacia e senso estético entram em cena. Ótimo para relações, negociação, arte, design e parcerias. A busca vira busca de beleza, harmonia e do outro.',
      },
      4: {
        navamsa: 'Escorpião',
        female: 'Pada 4 (Navamsa de Escorpião, Marte): curiosidade que mergulha no profundo. Magnetismo intenso, intuição penetrante, interesse pelo mistério e pela transformação. Paixão e reserva convivem; renasce das crises.',
        male: 'Pada 4 (Navamsa de Escorpião, Marte): a busca ganha profundidade e intensidade. Interesse pelo oculto, pesquisa profunda e transformação; determinação obstinada. Emoções fortes sob a superfície diplomática.',
      },
    },
  },

  ashwini: {
    female: {
      fisico: 'Aparência jovem, vivaz e atlética, olhar brilhante e sorriso rápido. Beleza fresca e natural, movimentos ágeis e uma ponta de impaciência no corpo. Irradia vitalidade e um ar de eterna juventude.',
      carater: 'Pioneira, corajosa e independente, gosta de começar coisas e abrir caminhos. Impulsiva e sincera, age antes de pensar; generosa, com forte instinto de cura e ajuda. Detesta ser presa ou controlada — quer liberdade e movimento.',
      profissao: 'Ótima em medicina, terapias, emergências, esporte, transporte ou qualquer área que exija iniciativa e rapidez. Empreende com facilidade e brilha começando projetos. A renda vem da coragem de ser a primeira e da capacidade de curar ou resolver.',
      familia: 'Afetuosa e protetora, mas precisa de espaço; a impaciência pode gerar atritos no lar. Busca um parceiro que acompanhe seu ritmo e respeite sua independência. Mãe dedicada e enérgica, incentiva autonomia e coragem nos filhos.',
      saude: 'Vitalidade forte e recuperação rápida, mas propensa a acidentes por pressa, dores de cabeça, febres e tensão. Precisa canalizar o excesso de energia em atividade física e evitar a impulsividade que a machuca.',
    },
    male: {
      fisico: 'Porte atlético e ágil, feição jovem e olhar vivo e alerta. Energia inquieta, movimentos rápidos e ar esportivo; costuma parecer mais novo que a idade. Presença dinâmica e franca.',
      carater: 'Pioneiro nato, corajoso, direto e independente. Adora iniciar e competir; impaciente com demoras, age por impulso. Instinto de cura e socorro, generoso com quem precisa, mas avesso a amarras.',
      profissao: 'Brilha em medicina, cirurgia de emergência, esporte, forças de resgate, mecânica, transporte ou empreendedorismo. Abre negócios e projetos com facilidade; a renda vem da iniciativa e da velocidade de execução.',
      familia: 'Provedor enérgico e protetor, mas inquieto; precisa de movimento e liberdade. Atritos surgem da pressa e da dificuldade de parar. Pai presente e estimulante, ensina coragem, esporte e autossuficiência.',
      saude: 'Constituição robusta e cura rápida, porém sujeito a acidentes, cortes, dores de cabeça e febres por excesso de fogo e pressa. Esporte regular e paciência o protegem de si mesmo.',
    },
    padas: {
      1: { navamsa: 'Áries', female: 'Pada 1 (Navamsa de Áries, Marte): coragem e iniciativa em dobro. Pioneira ardente, competitiva e líder; age primeiro e pensa depois. Energia guerreira que abre caminho.', male: 'Pada 1 (Navamsa de Áries, Marte): o pioneiro no auge — impulso, coragem e liderança. Ótimo para esporte, comando e ação direta. Pressa a controlar.' },
      2: { navamsa: 'Touro', female: 'Pada 2 (Navamsa de Touro, Vênus): a pressa ganha estabilidade e prazer. Inclina à arte, ao conforto e à cura pelas mãos; mais sensual e persistente. Busca beleza e segurança.', male: 'Pada 2 (Navamsa de Touro, Vênus): a energia se assenta em construir e desfrutar. Talento para trabalho manual, arte e finanças; mais paciente e material.' },
      3: { navamsa: 'Gêmeos', female: 'Pada 3 (Navamsa de Gêmeos, Mercúrio): iniciativa mais mental e comunicativa. Curiosa, versátil e falante; cura pela palavra e pela informação. Muitos interesses.', male: 'Pada 3 (Navamsa de Gêmeos, Mercúrio): pioneiro das ideias e da comunicação. Ótimo para mídia, comércio e tecnologia; mente rápida e adaptável.' },
      4: { navamsa: 'Câncer', female: 'Pada 4 (Navamsa de Câncer, Lua): a coragem se abranda em cuidado e emoção. Curadora nata, protetora e sensível; instinto maternal forte. Age pelo coração.', male: 'Pada 4 (Navamsa de Câncer, Lua): a iniciativa serve ao cuidado e ao lar. Sensível sob a casca ativa; vocação de curar e proteger. A emoção guia a ação.' },
    },
  },

  bharani: {
    female: {
      fisico: 'Presença intensa e sensual, traços marcantes e olhar magnético. Beleza forte e carnal, corpo cheio de vitalidade; energia que atrai e impõe. Vigor físico e resistência notáveis.',
      carater: 'Intensa, determinada e apaixonada, vive os extremos com honestidade. Carrega peso e responsabilidade sem fugir; forte senso moral do certo e do errado. Suporta muito, mas cobra o que é justo; teimosa e leal, transforma dor em maturidade.',
      profissao: 'Ótima em áreas de transformação e gestão: saúde, obstetrícia, psicologia, direito, finanças, artes intensas ou negócios próprios. Grande capacidade de suportar pressão e conduzir processos difíceis. A renda vem da disciplina e da força de carregar o que os outros largam.',
      familia: 'Dedicada e protetora, assume responsabilidades pesadas na família. Sensual e leal na vida conjugal, mas exige compromisso e reciprocidade; ciúme e intensidade podem pesar. Mãe firme e devotada, forma os filhos com valores fortes.',
      saude: 'Vitalidade e resistência altas, mas sujeita a tensões reprodutivas, hormonais, excesso de calor e estresse por carregar demais. Precisa de descarga emocional e limites para não adoecer da própria intensidade.',
    },
    male: {
      fisico: 'Compleição forte e vigorosa, traços marcados e olhar intenso. Presença carnal e magnética, resistência física notável. Energia densa que transmite força e sensualidade.',
      carater: 'Intenso, determinado e moral, encara os extremos sem desviar. Disciplinado e responsável, carrega fardos pesados; leal, mas exigente e teimoso. Transforma provações em maturidade e força de caráter.',
      profissao: 'Sobressai em finanças, direito, medicina, gestão de crises, indústria, artes intensas ou empreendimentos próprios. Suporta pressão e conduz o que exige coragem e resistência. A renda vem da disciplina e de assumir o difícil.',
      familia: 'Provedor responsável e protetor, leva a sério o dever com a família. Sensual e leal, mas ciumento e possessivo; precisa de uma parceira à altura de sua intensidade. Pai firme, transmite valores e disciplina.',
      saude: 'Resistência forte, mas propenso a tensões por estresse, calor interno, excessos e questões da região pélvica. Pede moderação e válvulas de escape para a pressão que acumula.',
    },
    padas: {
      1: { navamsa: 'Leão', female: 'Pada 1 (Navamsa de Leão, Sol): a intensidade ganha orgulho e brilho. Líder apaixonada, dramática e generosa; quer reconhecimento e um palco. Autoridade natural.', male: 'Pada 1 (Navamsa de Leão, Sol): força com ambição de poder e destaque. Líder intenso, orgulhoso e magnético; brilha no comando.' },
      2: { navamsa: 'Virgem', female: 'Pada 2 (Navamsa de Virgem, Mercúrio): a intensidade vira método e serviço. Disciplinada, analítica e prestativa; ótima em saúde e detalhe. Cobra perfeição.', male: 'Pada 2 (Navamsa de Virgem, Mercúrio): força canalizada em precisão e trabalho. Analítico, técnico e crítico; excelente executor sob pressão.' },
      3: { navamsa: 'Libra', female: 'Pada 3 (Navamsa de Libra, Vênus): sensualidade e charme no auge. Magnética e diplomática, busca relação e beleza; arte e prazer marcam a vida.', male: 'Pada 3 (Navamsa de Libra, Vênus): intensidade suavizada por charme e diplomacia. Talento para relações, arte e negociação; sedutor.' },
      4: { navamsa: 'Escorpião', female: 'Pada 4 (Navamsa de Escorpião, Marte): intensidade máxima. Profunda, transformadora e obstinada; paixão e poder oculto. Renasce das crises, tudo ou nada.', male: 'Pada 4 (Navamsa de Escorpião, Marte): força bruta e profundidade. Investigativo, magnético e implacável; domina crises e transformações.' },
    },
  },

  rohini: {
    female: {
      fisico: 'Beleza marcante e sensual, feição harmoniosa e olhar sedutor. Corpo atraente e bem-feito, pele bonita, magnetismo natural. Presença que encanta sem esforço.',
      carater: 'Charmosa, sensível e determinada, ama o belo, o conforto e o prazer. Criativa e magnética, atrai pessoas e recursos; teimosa e apegada ao que ama. Busca estabilidade material e afetiva, com forte senso estético.',
      profissao: 'Brilha em arte, moda, beleza, música, gastronomia, agricultura, finanças ou negócios ligados ao prazer e ao luxo. Talento para fazer crescer e prosperar o que toca. A renda vem do charme, da criatividade e do faro para o valor.',
      familia: 'Amorosa, sensual e dedicada ao lar, valoriza conforto e beleza doméstica. Ciumenta e possessiva no amor; quer segurança e fidelidade. Mãe carinhosa e nutridora, cria um ninho acolhedor e farto.',
      saude: 'Boa vitalidade, mas tende a reter peso, oscilar hormônios e sofrer com garganta, seios ou sistema reprodutivo. O excesso de conforto e de doces cobra; pede moderação e movimento.',
    },
    male: {
      fisico: 'Aparência agradável e magnética, traços harmoniosos e olhar sedutor. Corpo bem-feito, presença sensual e charmosa. Aura calma e atraente.',
      carater: 'Charmoso, sensível e persistente, aprecia beleza, conforto e prazer. Criativo e sociável, atrai recursos e afeto; teimoso e apegado. Busca estabilidade e sabe desfrutar a vida.',
      profissao: 'Destaca-se em arte, música, negócios, finanças, agricultura, gastronomia, luxo ou entretenimento. Faz prosperar o que administra; faro para valor e prazer. A renda vem do charme e da habilidade de cultivar riqueza.',
      familia: 'Provedor afetuoso e caseiro, gosta de conforto e de uma família bem cuidada. Sensual e leal, mas ciumento; quer segurança no amor. Pai carinhoso e presente, oferece fartura e aconchego.',
      saude: 'Vitalidade boa, mas propenso a peso, garganta, sinusite e excessos com comida e bebida. O conforto em demasia adoece; pede disciplina e atividade.',
    },
    padas: {
      1: { navamsa: 'Áries', female: 'Pada 1 (Navamsa de Áries, Marte): a beleza ganha fogo e iniciativa. Sensual e ousada, corre atrás do que deseja; paixão e impaciência.', male: 'Pada 1 (Navamsa de Áries, Marte): charme com coragem e impulso. Conquistador e competitivo; deseja e age rápido.' },
      2: { navamsa: 'Touro', female: 'Pada 2 (Navamsa de Touro, Vênus): Rohini no ápice — beleza, sensualidade e prazer plenos. Magnetismo, arte e conforto; riquíssima em charme.', male: 'Pada 2 (Navamsa de Touro, Vênus): sensualidade e faro material no máximo. Prospera, desfruta e atrai; talento para arte e finanças.' },
      3: { navamsa: 'Gêmeos', female: 'Pada 3 (Navamsa de Gêmeos, Mercúrio): charme mais mental e comunicativo. Encanta pela palavra, versátil e sociável; arte e comércio.', male: 'Pada 3 (Navamsa de Gêmeos, Mercúrio): beleza com inteligência e conversa. Talento para mídia, negócios e relações; sedutor verbal.' },
      4: { navamsa: 'Câncer', female: 'Pada 4 (Navamsa de Câncer, Lua): sensibilidade e ternura no auge. Maternal, nutridora e emotiva; apego ao lar e à família. Beleza suave.', male: 'Pada 4 (Navamsa de Câncer, Lua): charme afetuoso e caseiro. Emotivo e protetor; ama nutrir e ser nutrido. Coração doméstico.' },
    },
  },

  ardra: {
    female: {
      fisico: 'Presença intensa e incomum, olhar profundo e penetrante que revela tempestade interior. Expressão mutável, ora sombria ora radiante; magnetismo perturbador. Feição marcante, difícil de esquecer.',
      carater: 'Mente afiada, questionadora e intensa; atravessa crises que assustariam muitos e sai renovada. Emoções profundas e voláteis, curiosidade quase científica; destrói o velho para reconstruir. Rebelde, empática com a dor alheia, transforma sofrimento em sabedoria.',
      profissao: 'Ótima em pesquisa, ciência, tecnologia, psicologia, medicina, engenharia, ativismo ou áreas de crise e reconstrução. Enxerga o que está quebrado e conserta; brilha sob pressão e no caos. A renda vem da mente analítica e da coragem de encarar o difícil.',
      familia: 'Intensa e leal, mas a vida afetiva passa por tempestades e recomeços. Precisa de um parceiro que suporte sua profundidade e mudança. Mãe dedicada e protetora, ensina os filhos a pensar e a resistir às adversidades.',
      saude: 'Sistema nervoso sensível: ansiedade, insônia, tensões e crises psicossomáticas; propensa a alergias e problemas respiratórios. As tempestades emocionais cobram do corpo; pede aterramento, respiração e descarga.',
    },
    male: {
      fisico: 'Aparência intensa e marcante, olhar penetrante e inquiridor. Expressão séria e mutável, magnetismo denso. Feição forte que transmite profundidade.',
      carater: 'Mente brilhante, crítica e investigativa, movido a entender o fundo das coisas. Atravessa crises e se reinventa; emocionalmente intenso, por vezes sombrio. Questiona tudo, rompe o obsoleto, transforma dor em conhecimento.',
      profissao: 'Sobressai em ciência, pesquisa, tecnologia, engenharia, medicina, análise de dados ou gestão de crises. Resolve o que os outros temem; genial sob pressão. A renda vem do intelecto penetrante e da capacidade de reconstruir.',
      familia: 'Leal e protetor, mas a vida conjugal enfrenta turbulências e recomeços. Precisa de compreensão e espaço para sua intensidade. Pai que estimula a mente crítica e a resiliência dos filhos.',
      saude: 'Sistema nervoso e respiratório sensíveis: estresse, insônia, alergias e tensões. O excesso mental e emocional adoece; pede rotina, natureza e formas de descarregar a tempestade.',
    },
    padas: {
      1: { navamsa: 'Sagitário', female: 'Pada 1 (Navamsa de Sagitário, Júpiter): a tempestade ganha sentido e fé. Filosófica e idealista, busca verdade nas crises; inclina ao ensino e à expansão.', male: 'Pada 1 (Navamsa de Sagitário, Júpiter): a mente crítica vira filosófica e ética. Busca significado; ótimo para pesquisa, ensino e causas.' },
      2: { navamsa: 'Capricórnio', female: 'Pada 2 (Navamsa de Capricórnio, Saturno): intensidade estruturada e ambiciosa. Disciplina para transformar com método; sobe pela resistência. Fria sob pressão.', male: 'Pada 2 (Navamsa de Capricórnio, Saturno): a crise vira estratégia e construção. Ambicioso e resiliente; gestão, engenharia, poder.' },
      3: { navamsa: 'Aquário', female: 'Pada 3 (Navamsa de Aquário, Saturno): mente reformadora e original. Ciência, tecnologia e causas coletivas; à frente do tempo, humanitária.', male: 'Pada 3 (Navamsa de Aquário, Saturno): gênio inventivo e coletivo. Tecnologia, reforma, ativismo; pensa o futuro, desapegado.' },
      4: { navamsa: 'Peixes', female: 'Pada 4 (Navamsa de Peixes, Júpiter): a tempestade se dissolve em compaixão. Intuitiva e espiritual, cura pela sensibilidade; arte e transcendência.', male: 'Pada 4 (Navamsa de Peixes, Júpiter): profundidade com alma compassiva. Cura, espiritualidade e arte; transforma dor em entrega.' },
    },
  },

  punarvasu: {
    female: {
      fisico: 'Feição serena e agradável, olhar gentil e acolhedor, sorriso tranquilo. Aparência saudável e maternal, simplicidade que transmite paz. Beleza suave, sem afetação.',
      carater: 'Otimista, generosa e adaptável, cai e se levanta com leveza. Valoriza o lar, a simplicidade e as segundas chances; espírito acolhedor que traz calma e esperança. Sábia e tolerante, mas pode se dispersar entre muitos interesses.',
      profissao: 'Boa em ensino, aconselhamento, filosofia, escrita, hotelaria, comércio ou áreas de cuidado e acolhimento. Recomeça com facilidade e prospera de forma sustentável. A renda vem da sabedoria, da confiança que inspira e da capacidade de renovar.',
      familia: 'Amorosa e caseira, o lar é o centro de sua vida; nutre e acolhe a família com generosidade. Parceira leal e conciliadora, valoriza harmonia e raízes. Mãe protetora e sábia, cria filhos com valores e liberdade.',
      saude: 'Constituição equilibrada e boa recuperação, mas propensa a excessos, retenção de líquidos, fígado e digestão. A tendência a se acomodar pede movimento e moderação.',
    },
    male: {
      fisico: 'Aparência amável e tranquila, olhar gentil e sábio, porte sereno. Feição saudável e acolhedora, com ar de bondade natural. Presença que inspira confiança.',
      carater: 'Otimista, generoso e resiliente, sabe recomeçar após quedas. Valoriza a família, a simplicidade e a ética; conselheiro nato, traz calma e esperança. Filosófico e tolerante, às vezes acomodado ou disperso.',
      profissao: 'Destaca-se em ensino, direito, filosofia, escrita, comércio, hotelaria ou aconselhamento. Constrói de forma estável e sabe reerguer-se. A renda vem da sabedoria, da confiança e da renovação constante.',
      familia: 'Provedor dedicado e caseiro, o lar é seu porto; protege e acolhe os seus. Marido leal e conciliador, preza harmonia e tradição. Pai sábio e presente, transmite valores e otimismo.',
      saude: 'Vitalidade equilibrada, mas propenso a fígado, digestão, peso e excessos de conforto. A acomodação adoece; pede disciplina, exercício e moderação.',
    },
    padas: {
      1: { navamsa: 'Áries', female: 'Pada 1 (Navamsa de Áries, Marte): otimismo com iniciativa e coragem. Recomeça com energia e ousadia; mais ativa e pioneira.', male: 'Pada 1 (Navamsa de Áries, Marte): sabedoria com impulso e liderança. Age e reergue-se rápido; empreendedor.' },
      2: { navamsa: 'Touro', female: 'Pada 2 (Navamsa de Touro, Vênus): renovação com prazer e estabilidade. Ama conforto, beleza e segurança; constrói com paciência.', male: 'Pada 2 (Navamsa de Touro, Vênus): otimismo material e sensual. Prospera, desfruta e assenta; faro para valor.' },
      3: { navamsa: 'Gêmeos', female: 'Pada 3 (Navamsa de Gêmeos, Mercúrio): mente ágil e comunicativa. Curiosa, versátil e falante; ensino, escrita, comércio.', male: 'Pada 3 (Navamsa de Gêmeos, Mercúrio): sabedoria comunicativa e versátil. Ótimo para mídia, ensino, negócios; muitos interesses.' },
      4: { navamsa: 'Câncer', female: 'Pada 4 (Navamsa de Câncer, Lua): Punarvasu em casa — máximo acolhimento e emoção. Maternal, nutridora, ligada ao lar. Sensibilidade profunda.', male: 'Pada 4 (Navamsa de Câncer, Lua): sabedoria afetuosa e caseira. Protetor e emotivo; o lar é tudo. Coração nutridor.' },
    },
  },

  pushya: {
    female: {
      fisico: 'Feição doce e maternal, olhar calmo e protetor, presença acolhedora. Aparência saudável e estável, aura de bondade e serenidade. Beleza tranquila e confiável.',
      carater: 'Protetora, generosa e estável, cuida dos outros como ninguém e inspira confiança. Forte senso de dever, espiritualidade natural e coração que nutre. Conservadora e leal, às vezes se anula pelo bem-estar alheio.',
      profissao: 'Ótima em cuidado, saúde, nutrição, ensino, serviço público, religião, alimentação ou funções de amparo. Constrói bases sólidas e duradouras. A renda vem da confiança, do serviço dedicado e da estabilidade que oferece.',
      familia: 'O coração da família, dedica-se ao lar e aos seus com devoção total. Parceira fiel e protetora, valoriza segurança e tradição. Mãe nutridora e presente, forma filhos com amor e valores sólidos.',
      saude: 'Constituição estável, mas propensa a peso, retenção, estômago, seios e sistema linfático. O excesso de doçura e o hábito de se sacrificar pedem limites e autocuidado.',
    },
    male: {
      fisico: 'Porte sólido e acolhedor, feição bondosa e olhar sereno. Aparência estável e confiável, aura de proteção. Presença que tranquiliza.',
      carater: 'Protetor, responsável e generoso, ampara os seus com dever e devoção. Espiritualidade natural, valores firmes e coração nutridor. Conservador e leal, tende a carregar o peso dos outros.',
      profissao: 'Destaca-se em saúde, ensino, serviço público, religião, alimentação, gestão de cuidado ou funções de base. Constrói o que dura e inspira confiança. A renda vem do serviço, da responsabilidade e da estabilidade.',
      familia: 'Provedor devotado e protetor, o bem-estar da família vem primeiro. Marido fiel e responsável, valoriza tradição e segurança. Pai presente e amoroso, transmite valores e amparo.',
      saude: 'Vitalidade estável, mas propenso a estômago, peso, fleuma e sistema linfático. O sedentarismo e o excesso de comida cobram; pede movimento e moderação.',
    },
    padas: {
      1: { navamsa: 'Leão', female: 'Pada 1 (Navamsa de Leão, Sol): o cuidado ganha dignidade e liderança. Protetora generosa que brilha amparando; autoridade calorosa.', male: 'Pada 1 (Navamsa de Leão, Sol): nutrir com autoridade e nobreza. Líder protetor, generoso e respeitado.' },
      2: { navamsa: 'Virgem', female: 'Pada 2 (Navamsa de Virgem, Mercúrio): cuidado prático e meticuloso. Serviço, saúde e detalhe; organiza e aperfeiçoa com dedicação.', male: 'Pada 2 (Navamsa de Virgem, Mercúrio): dever com método e precisão. Excelente em saúde, serviço e gestão minuciosa.' },
      3: { navamsa: 'Libra', female: 'Pada 3 (Navamsa de Libra, Vênus): nutrir com beleza e harmonia. Acolhedora e diplomática, cria ambientes agradáveis; arte e relação.', male: 'Pada 3 (Navamsa de Libra, Vênus): cuidado gentil e sociável. Talento para relações, estética e conciliação.' },
      4: { navamsa: 'Escorpião', female: 'Pada 4 (Navamsa de Escorpião, Marte): cuidado intenso e transformador. Protetora feroz e profunda; ampara nas crises. Emoção forte.', male: 'Pada 4 (Navamsa de Escorpião, Marte): dever com intensidade e proteção. Ampara no difícil; guardião das crises.' },
    },
  },

  ashlesha: {
    female: {
      fisico: 'Olhar magnético e hipnótico, feição sinuosa e expressiva, sensualidade felina. Movimentos suaves e envolventes, presença que fascina e inquieta. Beleza misteriosa e penetrante.',
      carater: 'Intuitiva, perspicaz e profunda, lê as pessoas sob a superfície e guarda segredos. Magnética e sedutora, com dom para curar e para envolver; astuta, sabe se proteger. Emocionalmente intensa e reservada, capaz de grande lealdade ou de picada certeira.',
      profissao: 'Ótima em psicologia, medicina, terapias, ocultismo, investigação, farmácia, negociação ou áreas que exijam ler pessoas e ver o oculto. Persuasiva e estratégica. A renda vem da intuição, do magnetismo e da capacidade de penetrar o que os outros não veem.',
      familia: 'Intensa e protetora, mas reservada; a vida afetiva mistura paixão, ciúme e profundidade. Precisa de um parceiro que respeite seus mistérios e sua independência emocional. Mãe protetora e intuitiva, ligada aos filhos de forma quase telepática.',
      saude: 'Sistema nervoso e digestivo sensíveis: ansiedade, tensões, toxinas, questões intestinais e psicossomáticas. A emoção retida vira veneno interno; pede desintoxicação, respiração e liberação.',
    },
    male: {
      fisico: 'Olhar penetrante e magnético, feição expressiva e enigmática, presença sinuosa. Movimentos calculados, aura hipnótica. Aparência que atrai e intriga.',
      carater: 'Intuitivo, astuto e profundo, enxerga intenções ocultas e guarda segredos. Magnético e persuasivo, com dom de cura e de manipulação; estratégico e autoprotetor. Intenso e reservado, leal com os seus, perigoso quando traído.',
      profissao: 'Sobressai em psicologia, medicina, pesquisa, ocultismo, política, negociação, farmácia ou investigação. Lê pessoas e situações com maestria; persuasivo e tático. A renda vem da intuição, da estratégia e do poder de penetrar o oculto.',
      familia: 'Protetor e intenso, mas reservado e ciumento; a vida conjugal é profunda e passional. Precisa de uma parceira que aceite seus mistérios. Pai protetor e perspicaz, ligado aos filhos com intuição aguçada.',
      saude: 'Digestão e sistema nervoso sensíveis: intoxicação, ansiedade, tensões intestinais e psicossomáticas. A emoção guardada envenena; pede liberação, desintoxicação e calma.',
    },
    padas: {
      1: { navamsa: 'Sagitário', female: 'Pada 1 (Navamsa de Sagitário, Júpiter): a intuição ganha fé e sentido. Sábia e filosófica, usa o dom para curar e ensinar; menos venenosa, mais elevada.', male: 'Pada 1 (Navamsa de Sagitário, Júpiter): astúcia com ética e visão. Persuasão a serviço da verdade; conselheiro profundo.' },
      2: { navamsa: 'Capricórnio', female: 'Pada 2 (Navamsa de Capricórnio, Saturno): magnetismo com estratégia e ambição. Fria e calculista, sobe pelo controle; poder discreto.', male: 'Pada 2 (Navamsa de Capricórnio, Saturno): astúcia disciplinada e ambiciosa. Estrategista de longo prazo; poder e método.' },
      3: { navamsa: 'Aquário', female: 'Pada 3 (Navamsa de Aquário, Saturno): intuição original e coletiva. Enxerga sistemas e massas; reformadora, à frente do tempo.', male: 'Pada 3 (Navamsa de Aquário, Saturno): mente penetrante e inventiva. Vê padrões ocultos; tecnologia, causas, estratégia social.' },
      4: { navamsa: 'Peixes', female: 'Pada 4 (Navamsa de Peixes, Júpiter): intuição mística e compassiva. Sensibilidade psíquica forte; cura, espiritualidade, arte. Dissolve o veneno em entrega.', male: 'Pada 4 (Navamsa de Peixes, Júpiter): profundidade psíquica e compassiva. Dom de cura e visão; a espiritualidade transforma a astúcia.' },
    },
  },

  magha: {
    female: {
      fisico: 'Presença régia e digna, porte altivo e olhar nobre. Feição marcante, com ar de autoridade natural e movimentos solenes. Beleza imponente que impõe respeito.',
      carater: 'Orgulhosa, digna e tradicional, carrega presença de líder e senso de legado. Honra os ancestrais e quer deixar sua marca; leal aos seus, generosa no comando. O respeito importa muito — feri-lo desperta reação firme.',
      profissao: 'Ótima em liderança, política, gestão, direito, tradição, história, cerimônia ou posições de autoridade e prestígio. Comanda com dignidade e inspira respeito. A renda vem da posição, do nome e da capacidade de liderar com honra.',
      familia: 'Ligada às raízes e à linhagem, valoriza tradição, ancestrais e o nome da família. Protetora e leal, exige respeito e reciprocidade. Mãe digna e presente, transmite valores, história e senso de honra.',
      saude: 'Vitalidade forte, mas propensa a coração, coluna e tensões ligadas ao orgulho e à pressão de liderar. O peso das responsabilidades e do ego cobra; pede humildade e descanso.',
    },
    male: {
      fisico: 'Porte majestoso e digno, olhar nobre e autoritário, presença de comando. Feição forte e solene, aura de realeza. Aparência que impõe respeito.',
      carater: 'Orgulhoso, generoso e tradicional, líder nato com senso de legado e honra. Reverencia os ancestrais e busca deixar marca; leal e protetor, mas suscetível ao orgulho. Comanda com dignidade e espera reconhecimento.',
      profissao: 'Destaca-se em liderança, política, gestão, direito, forças armadas, tradição ou cargos de prestígio. Autoridade natural que inspira respeito e lealdade. A renda vem da posição, do nome e do comando digno.',
      familia: 'Guardião da linhagem e das tradições, valoriza o nome e os ancestrais. Protetor e leal, chefe de família respeitado. Pai digno e presente, transmite honra, valores e senso de legado.',
      saude: 'Vitalidade robusta, mas propenso a coração, coluna e pressão por excesso de responsabilidade e orgulho. O peso de liderar cobra; pede descanso e humildade.',
    },
    padas: {
      1: { navamsa: 'Áries', female: 'Pada 1 (Navamsa de Áries, Marte): autoridade com coragem e iniciativa. Líder ardente e pioneira; comanda na frente.', male: 'Pada 1 (Navamsa de Áries, Marte): realeza guerreira. Líder corajoso e combativo; poder pela ação.' },
      2: { navamsa: 'Touro', female: 'Pada 2 (Navamsa de Touro, Vênus): dignidade com beleza e riqueza. Ama luxo e estabilidade; poder ligado a recursos e prazer.', male: 'Pada 2 (Navamsa de Touro, Vênus): autoridade material e refinada. Constrói riqueza e status; aprecia o luxo.' },
      3: { navamsa: 'Gêmeos', female: 'Pada 3 (Navamsa de Gêmeos, Mercúrio): liderança comunicativa e intelectual. Comanda pela palavra e pela mente; diplomacia e estratégia.', male: 'Pada 3 (Navamsa de Gêmeos, Mercúrio): poder pela inteligência e comunicação. Líder articulado; política, mídia, negócios.' },
      4: { navamsa: 'Câncer', female: 'Pada 4 (Navamsa de Câncer, Lua): autoridade com coração e cuidado. Líder maternal, protetora da tribo; poder emocional.', male: 'Pada 4 (Navamsa de Câncer, Lua): realeza afetuosa e protetora. Comanda cuidando; ligado às raízes e à família.' },
    },
  },

  purva_phalguni: {
    female: {
      fisico: 'Beleza charmosa e sensual, feição harmoniosa e sorriso cativante. Corpo atraente e bem cuidado, ar relaxado e magnético. Presença que encanta e transmite prazer de viver.',
      carater: 'Charmosa, criativa e sociável, sabe desfrutar a vida, o amor e o descanso. Generosa e calorosa, gosta de conforto, festa e beleza; carisma que atrai. Precisa de prazer e afeto, podendo ser preguiçosa ou vaidosa quando acomodada.',
      profissao: 'Brilha em arte, música, entretenimento, moda, beleza, hospitalidade, eventos ou áreas ligadas ao prazer e à criatividade. Talento para encantar e criar experiências agradáveis. A renda vem do charme, da arte e da capacidade de gerar bem-estar.',
      familia: 'Amorosa, sensual e afetuosa, valoriza romance, conforto e vida social. Parceira calorosa, mas quer atenção e prazer na relação. Mãe carinhosa e generosa, cria um lar acolhedor e alegre.',
      saude: 'Boa vitalidade, mas propensa a excessos, peso, questões reprodutivas e de rins. O gosto por prazer e conforto cobra; pede moderação e movimento.',
    },
    male: {
      fisico: 'Aparência agradável e charmosa, feição relaxada e olhar caloroso. Corpo bem cuidado, presença sedutora e sociável. Ar de quem aprecia a boa vida.',
      carater: 'Charmoso, generoso e sociável, ama prazer, arte e descanso. Caloroso e criativo, atrai amizades e afeto; carismático e otimista. Gosta de conforto e reconhecimento, com tendência à indulgência.',
      profissao: 'Destaca-se em arte, música, entretenimento, hospitalidade, moda, relações públicas ou negócios ligados ao prazer. Encanta e cria bem-estar. A renda vem do charme, da criatividade e do talento social.',
      familia: 'Provedor afetuoso e caloroso, valoriza romance, conforto e vida social. Marido carinhoso, mas quer prazer e liberdade. Pai generoso e presente, cria um lar alegre e acolhedor.',
      saude: 'Vitalidade boa, mas propenso a excessos, peso, fígado e rins. A indulgência adoece; pede disciplina e atividade física.',
    },
    padas: {
      1: { navamsa: 'Leão', female: 'Pada 1 (Navamsa de Leão, Sol): charme com brilho e orgulho. Criativa e generosa, quer palco e reconhecimento; presença que lidera.', male: 'Pada 1 (Navamsa de Leão, Sol): prazer com nobreza e destaque. Líder caloroso e magnético; ama brilhar.' },
      2: { navamsa: 'Virgem', female: 'Pada 2 (Navamsa de Virgem, Mercúrio): criatividade prática e detalhista. Talento refinado e senso crítico; arte com técnica.', male: 'Pada 2 (Navamsa de Virgem, Mercúrio): charme com método e habilidade. Prazer canalizado em ofício e precisão.' },
      3: { navamsa: 'Libra', female: 'Pada 3 (Navamsa de Libra, Vênus): Purva Phalguni no auge do charme. Arte, relação e beleza plenos; magnetismo e diplomacia.', male: 'Pada 3 (Navamsa de Libra, Vênus): prazer, estética e sociabilidade no máximo. Talento para arte e parceria; sedutor.' },
      4: { navamsa: 'Escorpião', female: 'Pada 4 (Navamsa de Escorpião, Marte): charme com intensidade e paixão. Sensualidade profunda e magnetismo forte; tudo ou nada no amor.', male: 'Pada 4 (Navamsa de Escorpião, Marte): prazer com profundidade e desejo. Paixão intensa; charme magnético e obstinado.' },
    },
  },

  uttara_phalguni: {
    female: {
      fisico: 'Feição nobre e agradável, olhar caloroso e confiável, porte equilibrado. Aparência saudável e digna, aura de lealdade. Beleza serena e generosa.',
      carater: 'Leal, prestativa e generosa, ótima amiga e parceira que cumpre a palavra. Equilibra prazer e responsabilidade; ajuda sem esperar retorno. Independente e ética, valoriza compromisso e gratidão, mas pode se cansar de dar demais.',
      profissao: 'Ótima em serviço, gestão, aconselhamento, contratos, ONGs, saúde, ensino ou áreas de ajuda e parceria. Confiável e organizada, constrói relações duradouras. A renda vem da lealdade, do trabalho firme e das boas alianças.',
      familia: 'Parceira leal e dedicada, valoriza casamento, compromisso e amizade dentro do lar. Equilibra afeto e dever; generosa com a família. Mãe responsável e amorosa, ensina valores, gratidão e independência.',
      saude: 'Vitalidade estável, mas propensa a fadiga por excesso de doação, intestino e fígado. Dar demais esgota; pede reciprocidade e descanso.',
    },
    male: {
      fisico: 'Porte digno e agradável, olhar confiável e caloroso. Aparência saudável e nobre, aura de integridade. Presença que transmite lealdade.',
      carater: 'Leal, generoso e íntegro, amigo e parceiro de palavra. Equilibra prazer e dever; ajuda o próximo com constância. Independente e ético, valoriza compromisso, mas pode se sobrecarregar ajudando.',
      profissao: 'Destaca-se em gestão, serviço, direito, contratos, ensino, saúde ou áreas de parceria e ajuda. Confiável e trabalhador, constrói alianças sólidas. A renda vem da lealdade, do esforço firme e das boas relações.',
      familia: 'Provedor leal e responsável, valoriza casamento, compromisso e amizade. Marido dedicado e generoso; equilibra afeto e dever. Pai íntegro e presente, transmite valores e senso de responsabilidade.',
      saude: 'Vitalidade estável, mas propenso a fadiga, fígado e intestino por excesso de trabalho e doação. Pede reciprocidade, limites e descanso.',
    },
    padas: {
      1: { navamsa: 'Sagitário', female: 'Pada 1 (Navamsa de Sagitário, Júpiter): lealdade com fé e sabedoria. Generosa e ética; ensino, filosofia, causas. Amiga sábia.', male: 'Pada 1 (Navamsa de Sagitário, Júpiter): integridade com visão e ética. Conselheiro generoso; expande e inspira.' },
      2: { navamsa: 'Capricórnio', female: 'Pada 2 (Navamsa de Capricórnio, Saturno): compromisso com disciplina e ambição. Trabalhadora firme, sobe pelo mérito; responsabilidade sólida.', male: 'Pada 2 (Navamsa de Capricórnio, Saturno): dever com estrutura e persistência. Gestão e construção de longo prazo; sério e leal.' },
      3: { navamsa: 'Aquário', female: 'Pada 3 (Navamsa de Aquário, Saturno): lealdade voltada ao coletivo. Causas, grupos e reforma; ajuda em escala. Humanitária.', male: 'Pada 3 (Navamsa de Aquário, Saturno): serviço coletivo e original. Trabalha pelo bem comum; redes e causas.' },
      4: { navamsa: 'Peixes', female: 'Pada 4 (Navamsa de Peixes, Júpiter): generosidade compassiva. Ajuda com o coração; espiritualidade, cura, entrega. Sensível.', male: 'Pada 4 (Navamsa de Peixes, Júpiter): lealdade com alma compassiva. Serve por amor; espiritual e caridoso.' },
    },
  },

  hasta: {
    female: {
      fisico: 'Feição expressiva e ágil, olhar esperto e mãos hábeis e bonitas. Corpo proporcional e dinâmico, gestos precisos. Beleza viva, com charme prático e jovial.',
      carater: 'Habilidosa, esperta e prática, faz acontecer com as próprias mãos e resolve o que trava. Bom humor, mente ágil e senso de oportunidade; encanta e persuade. Detalhista e controladora, pode ser ansiosa ou manipuladora quando insegura.',
      profissao: 'Ótima em artesanato, artes manuais, cirurgia, terapias, comércio, comunicação, tecnologia ou ofícios que exijam destreza e engenho. Talento para criar e consertar. A renda vem da habilidade, da esperteza e da capacidade de realizar.',
      familia: 'Dedicada e prática, cuida do lar com engenho e mãos ativas. Parceira companheira e espirituosa, mas quer controle e ordem. Mãe atenta e habilidosa, ensina os filhos a fazer, criar e se virar.',
      saude: 'Sistema nervoso sensível: ansiedade, tensões nas mãos e braços, digestão e agitação. O excesso de controle e de atividade mental cobra; pede relaxamento e ritmo.',
    },
    male: {
      fisico: 'Aparência ágil e esperta, olhar vivo e mãos habilidosas. Corpo dinâmico e proporcional, gestos precisos. Ar jovial e prático.',
      carater: 'Hábil, engenhoso e prático, realiza com as mãos e resolve problemas. Bom humor, mente rápida e faro para oportunidade; persuasivo. Detalhista e controlador, por vezes ansioso ou astuto demais.',
      profissao: 'Sobressai em artesanato, cirurgia, engenharia, tecnologia, comércio, comunicação ou ofícios manuais e técnicos. Cria e conserta com maestria. A renda vem da destreza, do engenho e do talento de executar.',
      familia: 'Provedor prático e dedicado, mantém o lar funcionando com engenho. Marido companheiro e espirituoso, mas quer ordem e controle. Pai atento e habilidoso, ensina os filhos a criar e se virar.',
      saude: 'Sistema nervoso sensível: ansiedade, tensão em mãos e braços, digestão e insônia. O excesso mental e o controle cobram; pede pausa e relaxamento.',
    },
    padas: {
      1: { navamsa: 'Áries', female: 'Pada 1 (Navamsa de Áries, Marte): habilidade com energia e iniciativa. Mãos rápidas e ousadas; empreende e executa com força.', male: 'Pada 1 (Navamsa de Áries, Marte): destreza com coragem e impulso. Ótimo para ofícios técnicos e ação rápida.' },
      2: { navamsa: 'Touro', female: 'Pada 2 (Navamsa de Touro, Vênus): mãos para a arte e o prazer. Talento estético e sensorial; artesanato, beleza, gastronomia.', male: 'Pada 2 (Navamsa de Touro, Vênus): habilidade com arte e valor. Cria beleza e prospera; ofícios refinados.' },
      3: { navamsa: 'Gêmeos', female: 'Pada 3 (Navamsa de Gêmeos, Mercúrio): Hasta afiada — esperteza e comunicação no auge. Comércio, escrita, tecnologia; mente veloz.', male: 'Pada 3 (Navamsa de Gêmeos, Mercúrio): engenho e comunicação máximos. Negócios, mídia, tecnologia; astuto e ágil.' },
      4: { navamsa: 'Câncer', female: 'Pada 4 (Navamsa de Câncer, Lua): habilidade com sensibilidade e cuidado. Mãos que curam e nutrem; ligada ao lar e à emoção.', male: 'Pada 4 (Navamsa de Câncer, Lua): destreza a serviço do cuidado. Cura pelas mãos; protetor e emotivo.' },
    },
  },

  chitra: {
    female: {
      fisico: 'Beleza deslumbrante e brilhante, feição marcante e olhar magnético. Corpo bem-feito e elegante, estilo próprio que chama atenção. Presença que reluz e impressiona.',
      carater: 'Magnética, criativa e meticulosa, tem olho para beleza e forma; cria coisas que impressionam. Gosta de brilhar e de fazer bem-feito, com estilo próprio. Charmosa e ambiciosa, pode ser vaidosa ou apegada à imagem.',
      profissao: 'Brilha em design, arquitetura, moda, artes visuais, joalheria, engenharia, estética ou áreas que unam beleza e técnica. Cria com brilho e precisão. A renda vem do talento estético, do estilo e da capacidade de impressionar.',
      familia: 'Charmosa e cuidadosa com a imagem do lar, valoriza beleza e harmonia. Parceira magnética, mas quer admiração e cuidado com a aparência. Mãe estimulante e estética, incentiva talento e brilho nos filhos.',
      saude: 'Vitalidade boa, mas propensa a questões de pele, rins, tensão e à pressão de manter a imagem. O perfeccionismo estético cobra; pede autoaceitação e descanso.',
    },
    male: {
      fisico: 'Aparência marcante e magnética, feição bem definida e estilo próprio. Corpo elegante e bem cuidado, presença que impressiona. Ar de brilho e distinção.',
      carater: 'Criativo, meticuloso e magnético, tem olho para forma e beleza; faz o que impressiona. Ambicioso e caprichoso, gosta de brilhar com competência. Charmoso e perfeccionista, por vezes vaidoso ou preso à imagem.',
      profissao: 'Destaca-se em design, arquitetura, engenharia, artes, moda, joalheria ou estética. Une criatividade e precisão; cria com brilho. A renda vem do talento, do estilo e da capacidade de impressionar.',
      familia: 'Provedor caprichoso, valoriza um lar bonito e harmonioso. Marido magnético, mas exigente com aparência e cuidado. Pai estimulante, incentiva talento, estética e excelência nos filhos.',
      saude: 'Vitalidade boa, mas propenso a pele, rins e tensão pela pressão de perfeição e imagem. Pede autoaceitação, equilíbrio e descanso.',
    },
    padas: {
      1: { navamsa: 'Leão', female: 'Pada 1 (Navamsa de Leão, Sol): beleza com brilho e orgulho. Reluz e lidera; quer palco e reconhecimento pela criação.', male: 'Pada 1 (Navamsa de Leão, Sol): talento com nobreza e destaque. Criador magnético; brilha no que faz.' },
      2: { navamsa: 'Virgem', female: 'Pada 2 (Navamsa de Virgem, Mercúrio): estética com precisão e técnica. Design detalhista e ofício apurado; perfeccionismo produtivo.', male: 'Pada 2 (Navamsa de Virgem, Mercúrio): arte com método e minúcia. Engenharia e design técnicos; mestre do detalhe.' },
      3: { navamsa: 'Libra', female: 'Pada 3 (Navamsa de Libra, Vênus): Chitra no auge estético. Beleza, harmonia e charme plenos; arte, moda, relações.', male: 'Pada 3 (Navamsa de Libra, Vênus): estética e diplomacia máximas. Design, arte e parcerias; refinado e sedutor.' },
      4: { navamsa: 'Escorpião', female: 'Pada 4 (Navamsa de Escorpião, Marte): beleza intensa e magnética. Estilo profundo e transformador; arte com paixão e mistério.', male: 'Pada 4 (Navamsa de Escorpião, Marte): talento intenso e obstinado. Cria com força e profundidade; magnetismo poderoso.' },
    },
  },

  swati: {
    female: {
      fisico: 'Feição delicada e graciosa, olhar gentil e independente, porte leve. Movimentos suaves e flexíveis, ar de autossuficiência. Beleza discreta e charmosa, que respira liberdade.',
      carater: 'Independente, adaptável e diplomática, preza a própria liberdade acima de tudo. Move-se com leveza, negocia bem e equilibra os opostos; sociável, mas guarda autonomia. Autossuficiente e curiosa, pode ser indecisa ou distante quando se sente presa.',
      profissao: 'Ótima em comércio, negociação, diplomacia, direito, artes, viagens ou negócios próprios que exijam flexibilidade e independência. Prospera por conta própria e sabe se adaptar. A renda vem da autonomia, da habilidade social e do faro para oportunidade.',
      familia: 'Afetuosa, mas ciosa de sua liberdade; a vida conjugal pede espaço e igualdade. Busca um parceiro que respeite sua independência e não a queira controlar. Mãe amorosa e liberal, incentiva autonomia e pensamento próprio nos filhos.',
      saude: 'Sistema nervoso e digestivo sensíveis: ansiedade, gases, tensão e oscilações por excesso de movimento. A inquietação e a indecisão cansam; pede aterramento e rotina leve.',
    },
    male: {
      fisico: 'Aparência leve e ágil, olhar gentil e independente, porte flexível. Movimentos soltos, ar de autossuficiência. Presença discreta e simpática.',
      carater: 'Independente, diplomático e adaptável, valoriza a liberdade e a autonomia. Negociador hábil, equilibra interesses e circula com leveza; sociável, mas reservado no íntimo. Autossuficiente, por vezes indeciso ou avesso a compromissos que prendem.',
      profissao: 'Destaca-se em comércio, negócios, diplomacia, direito, viagens, tecnologia ou empreendimentos próprios. Sabe se adaptar e prosperar sozinho. A renda vem da independência, da habilidade de negociar e do faro comercial.',
      familia: 'Afetuoso, mas apegado à liberdade; a vida conjugal pede espaço e parceria de iguais. Precisa de uma companheira que respeite sua autonomia. Pai liberal e presente, incentiva independência e mente própria nos filhos.',
      saude: 'Sistema nervoso e digestivo sensíveis: ansiedade, gases, tensão e inquietação. O excesso de movimento e a indecisão cansam; pede rotina, respiração e aterramento.',
    },
    padas: {
      1: { navamsa: 'Sagitário', female: 'Pada 1 (Navamsa de Sagitário, Júpiter): independência com fé e visão. Filosófica e ética, busca liberdade com sentido; ensino, viagens.', male: 'Pada 1 (Navamsa de Sagitário, Júpiter): autonomia com ideais. Empreendedor ético, expande horizontes; conselheiro livre.' },
      2: { navamsa: 'Capricórnio', female: 'Pada 2 (Navamsa de Capricórnio, Saturno): flexibilidade com disciplina e ambição. Negocia com estratégia e constrói sozinha; foco no longo prazo.', male: 'Pada 2 (Navamsa de Capricórnio, Saturno): independência estruturada. Estrategista paciente; negócios sólidos e ambiciosos.' },
      3: { navamsa: 'Aquário', female: 'Pada 3 (Navamsa de Aquário, Saturno): Swati no elemento — liberdade e originalidade plenas. Humanitária e inventiva; causas e redes.', male: 'Pada 3 (Navamsa de Aquário, Saturno): autonomia coletiva e original. Reforma, tecnologia, ideias à frente; desapegado.' },
      4: { navamsa: 'Peixes', female: 'Pada 4 (Navamsa de Peixes, Júpiter): independência com sensibilidade e compaixão. Intuitiva e espiritual; liberdade que serve ao todo.', male: 'Pada 4 (Navamsa de Peixes, Júpiter): autonomia com alma. Espiritual e compassivo; livre e sonhador.' },
    },
  },

  vishakha: {
    female: {
      fisico: 'Presença determinada e magnética, olhar focado e intenso, porte firme. Feição marcante, energia concentrada; movimentos com propósito. Beleza forte e ambiciosa.',
      carater: 'Determinada, ambiciosa e focada, persegue metas com paixão e não desiste fácil. Vive uma dualidade fértil entre desejos; quando alinha o foco, é imparável. Competitiva e estratégica, pode ser impaciente ou obcecada pelo objetivo.',
      profissao: 'Ótima em liderança, política, negócios, pesquisa, esporte, vendas ou áreas que exijam foco e ambição. Alcança o que mira e inspira metas. A renda vem da determinação, da estratégia e da energia de conquista.',
      familia: 'Intensa e leal, mas a ambição pode competir com a vida a dois; busca um parceiro que compartilhe metas. Dedicada quando comprometida, exige reciprocidade. Mãe motivadora e exigente, impulsiona os filhos a conquistar.',
      saude: 'Vitalidade forte, mas propensa a estresse, tensão, calor interno e esgotamento pela obsessão com metas. O excesso de foco e competição cobra; pede pausa e equilíbrio.',
    },
    male: {
      fisico: 'Porte firme e determinado, olhar focado e penetrante. Energia concentrada, movimentos decididos. Presença ambiciosa e magnética.',
      carater: 'Ambicioso, determinado e focado, busca objetivos com paixão e persistência. Dualidade entre desejos que, alinhada, o torna imbatível. Estratégico e competitivo, por vezes impaciente ou obsessivo com a meta.',
      profissao: 'Sobressai em liderança, política, negócios, pesquisa, vendas, esporte ou empreendimentos ambiciosos. Conquista o que almeja e mobiliza. A renda vem do foco, da estratégia e da energia de realização.',
      familia: 'Leal e dedicado, mas a ambição disputa com a vida conjugal; quer uma parceira que caminhe junto rumo a metas. Comprometido, exige reciprocidade. Pai motivador e exigente, impulsiona conquista e disciplina nos filhos.',
      saude: 'Vitalidade forte, mas propenso a estresse, tensão, calor interno e esgotamento pela obsessão por metas. Pede pausa, equilíbrio e descarga.',
    },
    padas: {
      1: { navamsa: 'Áries', female: 'Pada 1 (Navamsa de Áries, Marte): foco com coragem e impulso. Guerreira de metas; conquista na frente, com energia.', male: 'Pada 1 (Navamsa de Áries, Marte): ambição ardente e pioneira. Líder combativo; foco e ação direta.' },
      2: { navamsa: 'Touro', female: 'Pada 2 (Navamsa de Touro, Vênus): determinação com prazer e valor. Foca em riqueza, beleza e estabilidade; persistente e sensual.', male: 'Pada 2 (Navamsa de Touro, Vênus): ambição material e paciente. Constrói riqueza; foco em segurança e conforto.' },
      3: { navamsa: 'Gêmeos', female: 'Pada 3 (Navamsa de Gêmeos, Mercúrio): foco mental e comunicativo. Estrategista das ideias; negócios, mídia, persuasão.', male: 'Pada 3 (Navamsa de Gêmeos, Mercúrio): ambição intelectual e ágil. Vendas, comunicação, comércio; mente veloz.' },
      4: { navamsa: 'Câncer', female: 'Pada 4 (Navamsa de Câncer, Lua): determinação com emoção e cuidado. Foco na família e no pertencer; ambição afetiva.', male: 'Pada 4 (Navamsa de Câncer, Lua): ambição a serviço do lar e dos seus. Foco protetor; conquista pela família.' },
    },
  },

  anuradha: {
    female: {
      fisico: 'Feição amável e magnética, olhar caloroso e devotado, sorriso acolhedor. Aparência harmoniosa e simpática, aura de afeto. Beleza doce que atrai amizades.',
      carater: 'Leal, cooperativa e devotada, faz amigos onde chega e prospera longe de casa. Equilibra ambição e afeto, trabalha em grupo com o coração; disciplinada no amor e na meta. Devota e persistente, pode sofrer por dedicação excessiva ou por saudade.',
      profissao: 'Ótima em relações, diplomacia, trabalho em equipe, negócios internacionais, organizações ou causas que unam pessoas. Constrói alianças e prospera fora do lugar de origem. A renda vem da cooperação, da lealdade e da rede de amizades.',
      familia: 'Devotada e leal, ama profundamente e valoriza amizade dentro da relação. Dedica-se ao parceiro e à família com disciplina afetiva; pode se distanciar da origem. Mãe amorosa e presente, ensina amizade, devoção e cooperação.',
      saude: 'Constituição estável, mas propensa a digestão, circulação, garganta e à melancolia por saudade ou dedicação excessiva. Pede vínculos recíprocos e cuidado emocional.',
    },
    male: {
      fisico: 'Feição simpática e magnética, olhar caloroso e leal, porte harmonioso. Aparência agradável, aura de amizade. Presença que aproxima.',
      carater: 'Leal, cooperativo e devotado, faz amigos com facilidade e prospera longe de casa. Equilibra ambição e afeto; trabalha em grupo com dedicação e disciplina. Persistente e amável, pode sofrer por excesso de doação ou saudade.',
      profissao: 'Destaca-se em relações, diplomacia, negócios internacionais, equipes, organizações ou causas coletivas. Constrói alianças sólidas e brilha fora da origem. A renda vem da cooperação, da lealdade e das redes.',
      familia: 'Devotado e leal, ama com profundidade e valoriza amizade na relação. Dedicado ao lar, mas pode viver longe das raízes. Pai amoroso e presente, ensina amizade, devoção e trabalho em grupo.',
      saude: 'Vitalidade estável, mas propenso a digestão, circulação e melancolia por saudade ou dedicação excessiva. Pede reciprocidade e cuidado emocional.',
    },
    padas: {
      1: { navamsa: 'Leão', female: 'Pada 1 (Navamsa de Leão, Sol): devoção com brilho e liderança. Amiga generosa que lidera; carisma caloroso.', male: 'Pada 1 (Navamsa de Leão, Sol): lealdade com autoridade. Líder amável e respeitado; agrega e comanda.' },
      2: { navamsa: 'Virgem', female: 'Pada 2 (Navamsa de Virgem, Mercúrio): cooperação prática e detalhista. Serviço, organização e método; amiga prestativa.', male: 'Pada 2 (Navamsa de Virgem, Mercúrio): devoção com precisão. Trabalho em equipe técnico; útil e meticuloso.' },
      3: { navamsa: 'Libra', female: 'Pada 3 (Navamsa de Libra, Vênus): Anuradha no auge afetivo. Relações, diplomacia e beleza plenas; encanta e concilia.', male: 'Pada 3 (Navamsa de Libra, Vênus): amizade e diplomacia máximas. Talento para relações, arte e alianças; charmoso.' },
      4: { navamsa: 'Escorpião', female: 'Pada 4 (Navamsa de Escorpião, Marte): devoção intensa e profunda. Lealdade apaixonada e transformadora; tudo ou nada nos vínculos.', male: 'Pada 4 (Navamsa de Escorpião, Marte): lealdade com intensidade. Vínculos profundos e magnéticos; devoção obstinada.' },
    },
  },

  jyeshtha: {
    female: {
      fisico: 'Presença imponente e séria, olhar penetrante e autoritário, porte de comando. Feição marcante e madura, aura de senioridade. Beleza forte, um tanto reservada.',
      carater: 'Responsável, protetora e capaz, assume o comando e carrega os outros. Detém poder e senso de dever; brilha quando a responsabilidade é grande. Reservada e orgulhosa, pode ser controladora ou se sentir sobrecarregada e incompreendida.',
      profissao: 'Ótima em gestão, liderança, administração, segurança, ocultismo, pesquisa, medicina ou cargos de responsabilidade e comando. Assume o difícil e protege os seus. A renda vem da competência, da autoridade e da capacidade de carregar peso.',
      familia: 'Protetora e responsável, é o pilar da família, mas carrega demais e pode se isolar. Leal e séria na relação, exige respeito e reciprocidade. Mãe firme e protetora, forma filhos com responsabilidade e força.',
      saude: 'Vitalidade forte, mas propensa a estresse, tensão, questões respiratórias e ao esgotamento por carregar responsabilidades. O peso e o orgulho cobram; pede apoio e descanso.',
    },
    male: {
      fisico: 'Porte imponente e sério, olhar penetrante e autoritário. Feição madura e marcante, aura de comando. Presença que impõe respeito.',
      carater: 'Responsável, protetor e capaz, toma o comando e ampara os outros. Detém poder oculto e senso de dever; brilha sob grande responsabilidade. Orgulhoso e reservado, pode ser controlador ou se sentir sobrecarregado e incompreendido.',
      profissao: 'Sobressai em gestão, liderança, segurança, administração, ocultismo, pesquisa ou funções de comando e responsabilidade. Assume o difícil e protege. A renda vem da competência, da autoridade e de carregar o que pesa.',
      familia: 'Pilar da família, protetor e responsável, mas carrega demais e tende a se isolar. Leal e sério, exige respeito. Pai firme e protetor, forma filhos com responsabilidade e senso de dever.',
      saude: 'Vitalidade forte, mas propenso a estresse, tensão e questões respiratórias por sobrecarga. O peso e o orgulho cobram; pede apoio e descanso.',
    },
    padas: {
      1: { navamsa: 'Sagitário', female: 'Pada 1 (Navamsa de Sagitário, Júpiter): autoridade com fé e ética. Líder justa e sábia; ensino, lei, causas. Comando com princípios.', male: 'Pada 1 (Navamsa de Sagitário, Júpiter): responsabilidade com visão e ética. Líder-mestre; justiça e expansão.' },
      2: { navamsa: 'Capricórnio', female: 'Pada 2 (Navamsa de Capricórnio, Saturno): comando com disciplina e ambição. Gestora firme, sobe pelo mérito; poder estruturado.', male: 'Pada 2 (Navamsa de Capricórnio, Saturno): autoridade sólida e estratégica. Gestão, estado, grandes estruturas; resiliente.' },
      3: { navamsa: 'Aquário', female: 'Pada 3 (Navamsa de Aquário, Saturno): liderança coletiva e reformadora. Poder a serviço de causas e sistemas; à frente do tempo.', male: 'Pada 3 (Navamsa de Aquário, Saturno): comando coletivo e original. Reforma e organização social; desapegado.' },
      4: { navamsa: 'Peixes', female: 'Pada 4 (Navamsa de Peixes, Júpiter): autoridade com compaixão. Protege com o coração; espiritualidade e cura no comando.', male: 'Pada 4 (Navamsa de Peixes, Júpiter): responsabilidade com alma. Ampara com compaixão; poder espiritualizado.' },
    },
  },

  mula: {
    female: {
      fisico: 'Olhar intenso e inquiridor, feição marcante e magnética, presença que revela profundidade. Expressão séria e penetrante; movimentos decididos. Beleza forte, um tanto enigmática.',
      carater: 'Investigativa, intensa e filosófica, não aceita a superfície: vai à raiz mesmo que doa. Atravessa desconstruções que renovam; questionadora e radical, busca a verdade última. Apaixonada e obstinada, pode ser destrutiva ou extremista quando ferida.',
      profissao: 'Ótima em pesquisa, filosofia, psicologia, medicina, ocultismo, investigação ou ciências que cavem o fundo das coisas. Enxerga raízes e reconstrói do zero. A renda vem da mente investigativa e da coragem de encarar o oculto e o difícil.',
      familia: 'Intensa e leal, mas a vida afetiva passa por rupturas e recomeços profundos. Precisa de um parceiro que suporte sua busca e intensidade. Mãe dedicada e protetora, ensina os filhos a questionar e a ir ao fundo das coisas.',
      saude: 'Sistema nervoso e quadril/pelve sensíveis: tensões, ciática, ansiedade e crises ligadas a rupturas. As desconstruções cobram do corpo; pede aterramento, raiz e cuidado emocional.',
    },
    male: {
      fisico: 'Olhar penetrante e sério, feição marcante e intensa. Presença densa e magnética, movimentos firmes. Aparência que transmite profundidade.',
      carater: 'Investigativo, radical e filosófico, cava até a raiz e não se contenta com o óbvio. Passa por desconstruções que o renovam; questiona tudo, busca a verdade última. Intenso e obstinado, por vezes destrutivo ou extremo.',
      profissao: 'Sobressai em pesquisa, ciência, filosofia, psicologia, medicina, ocultismo ou investigação. Vai ao fundo e reconstrói; genial no que exige profundidade. A renda vem do intelecto investigativo e da coragem de encarar o oculto.',
      familia: 'Leal e intenso, mas a vida conjugal enfrenta rupturas e recomeços. Precisa de compreensão para sua busca radical. Pai que estimula o pensamento crítico e a profundidade nos filhos.',
      saude: 'Quadril, pelve e sistema nervoso sensíveis: ciática, tensões, ansiedade e crises de ruptura. Pede aterramento, raiz e formas de processar a intensidade.',
    },
    padas: {
      1: { navamsa: 'Áries', female: 'Pada 1 (Navamsa de Áries, Marte): a busca ganha coragem e fogo. Radical e pioneira, encara o fundo com ousadia; ação direta.', male: 'Pada 1 (Navamsa de Áries, Marte): investigação com impulso e coragem. Vai à raiz com energia; combativo.' },
      2: { navamsa: 'Touro', female: 'Pada 2 (Navamsa de Touro, Vênus): profundidade com estabilidade e prazer. Busca a raiz do valor e da beleza; mais assentada.', male: 'Pada 2 (Navamsa de Touro, Vênus): intensidade material e sensorial. Cava o concreto; faro para recursos e arte.' },
      3: { navamsa: 'Gêmeos', female: 'Pada 3 (Navamsa de Gêmeos, Mercúrio): investigação mental e comunicativa. Escreve, pesquisa e questiona; mente veloz e curiosa.', male: 'Pada 3 (Navamsa de Gêmeos, Mercúrio): mente investigativa e ágil. Pesquisa, escrita, análise; intelecto afiado.' },
      4: { navamsa: 'Câncer', female: 'Pada 4 (Navamsa de Câncer, Lua): busca com emoção e raiz. Cava o fundo dos sentimentos e das origens; intuitiva e protetora.', male: 'Pada 4 (Navamsa de Câncer, Lua): profundidade emocional e intuitiva. Investiga a alma e as raízes; sensível sob a intensidade.' },
    },
  },

  purva_ashadha: {
    female: {
      fisico: 'Feição forte e expressiva, olhar convicto e magnético, sorriso persuasivo. Presença que contagia, energia otimista e vibrante. Beleza cativante, cheia de vida.',
      carater: 'Convicta, influente e otimista, tem fé inabalável em si e em suas ideias; convence e inspira. Purifica o ambiente com entusiasmo e vontade; carismática e ambiciosa. Persuasiva e orgulhosa, pode ser arrogante ou teimosa em suas certezas.',
      profissao: 'Ótima em oratória, política, direito, ensino, artes, marketing ou liderança que exija persuasão e convicção. Mobiliza e inspira multidões. A renda vem do carisma, da influência e da força de convencer.',
      familia: 'Calorosa e leal, mas quer admiração e liderança na relação; a convicção pode virar teimosia. Busca um parceiro que respeite sua força. Mãe inspiradora e protetora, incentiva coragem, fé e ambição nos filhos.',
      saude: 'Vitalidade forte, mas propensa a excessos, pulmões, retenção e tensão pela intensidade. O orgulho e o entusiasmo em excesso cobram; pede humildade e equilíbrio.',
    },
    male: {
      fisico: 'Porte forte e vibrante, olhar convicto e magnético. Presença contagiante, energia otimista. Aparência que inspira confiança.',
      carater: 'Convicto, influente e otimista, acredita em si e nas próprias ideias; convence e inspira. Entusiasta e ambicioso, purifica o ambiente com vontade; carismático. Persuasivo e orgulhoso, por vezes arrogante ou teimoso.',
      profissao: 'Destaca-se em oratória, política, direito, ensino, marketing, liderança ou artes de convencimento. Mobiliza e inspira. A renda vem do carisma, da influência e da força de persuasão.',
      familia: 'Caloroso e leal, mas quer liderança e admiração; a convicção vira teimosia. Precisa de uma parceira que respeite sua força. Pai inspirador e protetor, incentiva coragem, fé e ambição.',
      saude: 'Vitalidade forte, mas propenso a excessos, pulmões e tensão pela intensidade. O orgulho e o entusiasmo em demasia cobram; pede humildade e equilíbrio.',
    },
    padas: {
      1: { navamsa: 'Leão', female: 'Pada 1 (Navamsa de Leão, Sol): convicção com brilho e liderança. Inspira e comanda; carisma radiante, quer palco.', male: 'Pada 1 (Navamsa de Leão, Sol): influência com autoridade. Líder magnético e persuasivo; poder pela fé em si.' },
      2: { navamsa: 'Virgem', female: 'Pada 2 (Navamsa de Virgem, Mercúrio): convicção com método e detalhe. Persuade com argumento e precisão; foco no útil.', male: 'Pada 2 (Navamsa de Virgem, Mercúrio): influência técnica e articulada. Convence com lógica; análise e serviço.' },
      3: { navamsa: 'Libra', female: 'Pada 3 (Navamsa de Libra, Vênus): persuasão com charme e diplomacia. Encanta e concilia; arte, relações, negociação.', male: 'Pada 3 (Navamsa de Libra, Vênus): influência sedutora e diplomática. Convence pelo charme; talento social e estético.' },
      4: { navamsa: 'Escorpião', female: 'Pada 4 (Navamsa de Escorpião, Marte): convicção intensa e transformadora. Persuasão profunda e magnética; obstinada, tudo ou nada.', male: 'Pada 4 (Navamsa de Escorpião, Marte): influência intensa e obstinada. Convence com força e profundidade; magnético.' },
    },
  },

  uttara_ashadha: {
    female: {
      fisico: 'Feição digna e serena, olhar firme e honesto, porte reto. Aparência sólida e confiável, aura de integridade. Beleza nobre e persistente.',
      carater: 'Íntegra, persistente e responsável, não busca o triunfo fácil, mas o que dura. Líder justa, leal aos valores, capaz de esforços longos e nobres. Ética e determinada, pode ser rígida ou lenta demais, mas sua vitória é sólida.',
      profissao: 'Ótima em liderança, gestão, direito, política, pesquisa, causas ou funções públicas que exijam integridade e persistência. Constrói vitórias duradouras. A renda vem da retidão, do esforço firme e da liderança confiável.',
      familia: 'Leal e responsável, valoriza compromisso sólido e valores firmes no lar. Parceira íntegra e dedicada, constrói relações duradouras. Mãe justa e presente, transmite ética, persistência e senso de dever.',
      saude: 'Vitalidade estável, mas propensa a rigidez, quadris, estômago e desgaste por excesso de esforço. A teimosia e o excesso de responsabilidade cobram; pede flexibilidade e descanso.',
    },
    male: {
      fisico: 'Porte reto e digno, olhar firme e honesto. Aparência sólida e confiável, aura de integridade. Presença que inspira respeito.',
      carater: 'Íntegro, persistente e responsável, prefere a vitória que dura à fácil. Líder justo e leal aos valores, capaz de longos esforços nobres. Ético e determinado, por vezes rígido ou lento, mas sólido e confiável.',
      profissao: 'Destaca-se em liderança, gestão, direito, política, causas ou funções públicas que exijam integridade e persistência. Constrói o que permanece. A renda vem da retidão, do esforço firme e da confiança que inspira.',
      familia: 'Leal e responsável, valoriza compromisso sólido e valores firmes. Marido íntegro e dedicado, constrói para durar. Pai justo e presente, transmite ética, persistência e dever.',
      saude: 'Vitalidade estável, mas propenso a rigidez, quadris, estômago e desgaste por excesso de esforço. Pede flexibilidade, equilíbrio e descanso.',
    },
    padas: {
      1: { navamsa: 'Sagitário', female: 'Pada 1 (Navamsa de Sagitário, Júpiter): integridade com fé e visão. Líder ética e sábia; expande com princípios.', male: 'Pada 1 (Navamsa de Sagitário, Júpiter): retidão com ideais. Mestre justo; ensino, lei, filosofia.' },
      2: { navamsa: 'Capricórnio', female: 'Pada 2 (Navamsa de Capricórnio, Saturno): Uttara Ashadha no elemento — persistência e ambição máximas. Constrói vitórias sólidas.', male: 'Pada 2 (Navamsa de Capricórnio, Saturno): persistência e estrutura no auge. Líder resiliente; poder que dura.' },
      3: { navamsa: 'Aquário', female: 'Pada 3 (Navamsa de Aquário, Saturno): integridade coletiva e reformadora. Vitória a serviço de causas; humanitária.', male: 'Pada 3 (Navamsa de Aquário, Saturno): retidão coletiva e original. Reforma justa; trabalha pelo bem comum.' },
      4: { navamsa: 'Peixes', female: 'Pada 4 (Navamsa de Peixes, Júpiter): integridade com compaixão. Liderança generosa e espiritual; vence servindo.', male: 'Pada 4 (Navamsa de Peixes, Júpiter): retidão com alma. Justiça compassiva; espiritual e caridoso.' },
    },
  },

  shravana: {
    female: {
      fisico: 'Feição atenta e serena, olhar receptivo e sábio, presença tranquila. Aparência harmoniosa e confiável, ouvidos e voz marcantes. Beleza discreta e inteligente.',
      carater: 'Atenta, sábia e conectada, aprende ouvindo e liga as pessoas entre si. Boa reputação, memória e senso de tradição; conselheira nata, sabe escutar. Fiel e prudente, pode ser fofoqueira ou dependente da opinião alheia.',
      profissao: 'Ótima em ensino, aconselhamento, comunicação, música, mídia, direito ou pesquisa que exija escuta, memória e conexão. Aprende e transmite com sabedoria. A renda vem do conhecimento, da reputação e da habilidade de conectar.',
      familia: 'Fiel, atenta e conselheira, o lar é lugar de escuta e tradição. Parceira leal e prudente, valoriza confiança e comunicação. Mãe sábia e presente, ensina valores, cultura e a arte de ouvir.',
      saude: 'Constituição estável, mas propensa a ouvidos, garganta, rigidez e ansiedade por absorver demais dos outros. Escutar tudo cansa; pede silêncio, limites e descanso mental.',
    },
    male: {
      fisico: 'Feição serena e atenta, olhar receptivo e sábio, porte tranquilo. Aparência confiável e harmoniosa. Presença que inspira confiança e escuta.',
      carater: 'Atento, sábio e conectado, aprende ouvindo e une as pessoas. Boa reputação, memória e respeito à tradição; conselheiro nato. Fiel e prudente, por vezes dependente de aprovação ou dado à fofoca.',
      profissao: 'Destaca-se em ensino, comunicação, música, mídia, direito, aconselhamento ou pesquisa. Aprende e transmite com sabedoria; conecta pessoas. A renda vem do conhecimento, da reputação e das conexões.',
      familia: 'Fiel e atento, o lar é lugar de escuta, cultura e tradição. Marido leal e prudente, valoriza confiança. Pai sábio e presente, ensina valores, conhecimento e a arte de ouvir.',
      saude: 'Vitalidade estável, mas propenso a ouvidos, garganta, rigidez e ansiedade por absorver demais. Pede silêncio, limites e descanso mental.',
    },
    padas: {
      1: { navamsa: 'Áries', female: 'Pada 1 (Navamsa de Áries, Marte): escuta com iniciativa e coragem. Aprende e age; conselheira ativa e direta.', male: 'Pada 1 (Navamsa de Áries, Marte): sabedoria com impulso. Aprende e lidera; comunica com energia.' },
      2: { navamsa: 'Touro', female: 'Pada 2 (Navamsa de Touro, Vênus): escuta com prazer e estabilidade. Música, arte e voz; sabedoria sensorial e serena.', male: 'Pada 2 (Navamsa de Touro, Vênus): conhecimento com valor e beleza. Música, finanças, comunicação estável.' },
      3: { navamsa: 'Gêmeos', female: 'Pada 3 (Navamsa de Gêmeos, Mercúrio): Shravana afiada — comunicação e aprendizado no auge. Mídia, escrita, ensino.', male: 'Pada 3 (Navamsa de Gêmeos, Mercúrio): sabedoria comunicativa máxima. Mídia, ensino, negócios; mente veloz.' },
      4: { navamsa: 'Câncer', female: 'Pada 4 (Navamsa de Câncer, Lua): escuta com emoção e cuidado. Conselheira maternal, ligada ao lar e à tradição; muito sensível.', male: 'Pada 4 (Navamsa de Câncer, Lua): sabedoria afetuosa e caseira. Escuta com o coração; protetor e emotivo.' },
    },
  },

  dhanishta: {
    female: {
      fisico: 'Presença vibrante e magnética, olhar vivo e ritmado, porte elegante. Corpo dinâmico e atraente, energia contagiante. Beleza radiante, com senso natural de estilo.',
      carater: 'Rítmica, generosa e ambiciosa, tem senso de tempo e de música; brilha em grupo e atrai reconhecimento. Sabe prosperar e compartilhar o que ganha; sociável e enérgica. Talentosa e otimista, pode ser vaidosa, inquieta ou fria por excesso de ambição.',
      profissao: 'Ótima em música, dança, arte, negócios, esporte, gestão, imóveis ou áreas que unam ritmo, timing e ambição. Prospera e ganha fama pelo talento. A renda vem da habilidade, do carisma e do faro para oportunidade e riqueza.',
      familia: 'Generosa e enérgica, gosta de um lar próspero e vibrante; a ambição pode competir com o tempo em família. Parceira leal, mas independente. Mãe estimulante e generosa, incentiva talento, disciplina e sucesso nos filhos.',
      saude: 'Vitalidade forte, mas propensa a tensão, questões circulatórias, audição e ao estresse por excesso de atividade. O ritmo acelerado cobra; pede pausa, música e relaxamento.',
    },
    male: {
      fisico: 'Porte elegante e vibrante, olhar vivo e magnético. Corpo dinâmico e atlético, energia ritmada. Presença radiante e ambiciosa.',
      carater: 'Rítmico, generoso e ambicioso, com senso de timing e talento musical; brilha em grupo e busca reconhecimento. Prospera e compartilha; sociável e enérgico. Otimista e talentoso, por vezes vaidoso, inquieto ou frio pela ambição.',
      profissao: 'Sobressai em música, negócios, esporte, gestão, imóveis, engenharia ou áreas que unam ritmo e ambição. Ganha fama e riqueza pelo talento. A renda vem da habilidade, do carisma e do faro para oportunidade.',
      familia: 'Generoso e enérgico, gosta de um lar próspero; a ambição disputa com o tempo em casa. Marido leal, mas independente. Pai estimulante e generoso, incentiva talento, disciplina e sucesso.',
      saude: 'Vitalidade forte, mas propenso a tensão, circulação, audição e estresse por excesso de atividade. Pede pausa, música e relaxamento.',
    },
    padas: {
      1: { navamsa: 'Leão', female: 'Pada 1 (Navamsa de Leão, Sol): ritmo com brilho e liderança. Talento que reluz; quer palco e reconhecimento.', male: 'Pada 1 (Navamsa de Leão, Sol): ambição com autoridade e destaque. Líder magnético; fama e comando.' },
      2: { navamsa: 'Virgem', female: 'Pada 2 (Navamsa de Virgem, Mercúrio): talento com técnica e método. Precisão musical ou de negócios; detalhista.', male: 'Pada 2 (Navamsa de Virgem, Mercúrio): ambição analítica e prática. Habilidade técnica; gestão minuciosa.' },
      3: { navamsa: 'Libra', female: 'Pada 3 (Navamsa de Libra, Vênus): ritmo com charme e arte. Música, dança e relações; beleza e diplomacia.', male: 'Pada 3 (Navamsa de Libra, Vênus): talento estético e social. Arte, negócios e parcerias; refinado.' },
      4: { navamsa: 'Escorpião', female: 'Pada 4 (Navamsa de Escorpião, Marte): ambição intensa e magnética. Ritmo profundo e obstinado; poder e transformação.', male: 'Pada 4 (Navamsa de Escorpião, Marte): talento intenso e implacável. Ambição profunda; magnetismo forte.' },
    },
  },

  shatabhisha: {
    female: {
      fisico: 'Feição incomum e enigmática, olhar profundo e distante, presença reservada. Aparência marcante, com ar de mistério; movimentos discretos. Beleza singular e independente.',
      carater: 'Reservada, curiosa e independente, ama o mistério, a pesquisa e o próprio espaço. Dom para curar e visão à frente do tempo; secreta, porém profunda. Original e teimosa, pode ser solitária, distante ou obstinada em seus segredos.',
      profissao: 'Ótima em medicina, cura, ciência, tecnologia, astrologia, pesquisa, psicologia ou áreas que unam mistério e inovação. Enxerga o que os outros não veem. A renda vem do conhecimento oculto, da visão e da capacidade de curar e inovar.',
      familia: 'Independente e reservada, precisa de espaço e privacidade no relacionamento. Leal, mas guarda segredos; busca um parceiro que respeite seu mundo interior. Mãe atenta, mas discreta, incentiva independência e mente própria nos filhos.',
      saude: 'Sistema nervoso e circulatório sensíveis: ansiedade, questões elétricas do corpo, tornozelos e distúrbios ligados ao isolamento. O excesso de reclusão cobra; pede conexão e cuidado.',
    },
    male: {
      fisico: 'Feição enigmática e marcante, olhar profundo e distante, porte reservado. Aparência singular, aura de mistério. Presença discreta e intrigante.',
      carater: 'Reservado, curioso e independente, ama mistério, pesquisa e solidão produtiva. Dom de cura e visão adiantada; secreto e profundo. Original e teimoso, por vezes isolado, distante ou obstinado.',
      profissao: 'Destaca-se em medicina, ciência, tecnologia, astrologia, pesquisa, cura ou áreas que unam mistério e inovação. Vê o oculto e inova. A renda vem do conhecimento raro, da visão e da capacidade de curar.',
      familia: 'Independente e reservado, precisa de espaço e privacidade. Leal, mas guarda segredos; quer uma parceira que respeite seu mundo. Pai discreto e presente, incentiva autonomia e pensamento próprio.',
      saude: 'Sistema nervoso e circulatório sensíveis: ansiedade, tornozelos, distúrbios elétricos e questões ligadas ao isolamento. Pede conexão, movimento e cuidado.',
    },
    padas: {
      1: { navamsa: 'Sagitário', female: 'Pada 1 (Navamsa de Sagitário, Júpiter): mistério com fé e visão. Cura e ensino; filosófica e adiantada. Menos isolada.', male: 'Pada 1 (Navamsa de Sagitário, Júpiter): pesquisa com ética e sentido. Cura, ensino, filosofia; visão ampla.' },
      2: { navamsa: 'Capricórnio', female: 'Pada 2 (Navamsa de Capricórnio, Saturno): reclusão com disciplina e ambição. Pesquisa estruturada, poder discreto; foco.', male: 'Pada 2 (Navamsa de Capricórnio, Saturno): mistério com estrutura. Ciência e método; estrategista solitário.' },
      3: { navamsa: 'Aquário', female: 'Pada 3 (Navamsa de Aquário, Saturno): Shatabhisha no elemento — visão e originalidade máximas. Tecnologia, causas, futuro.', male: 'Pada 3 (Navamsa de Aquário, Saturno): gênio inventivo e visionário. Tecnologia e reforma; à frente do tempo.' },
      4: { navamsa: 'Peixes', female: 'Pada 4 (Navamsa de Peixes, Júpiter): mistério com compaixão e psiquismo. Cura espiritual, intuição forte; sensível.', male: 'Pada 4 (Navamsa de Peixes, Júpiter): visão mística e compassiva. Cura profunda; espiritual e intuitivo.' },
    },
  },

  purva_bhadrapada: {
    female: {
      fisico: 'Presença intensa e séria, olhar penetrante e idealista, porte marcante. Feição forte, energia ardente; movimentos decididos. Beleza incomum, com ar de profundidade.',
      carater: 'Intensa, idealista e visionária, vive por causas e ideais elevados, às vezes ao ponto do sacrifício. Enxerga o outro lado das coisas; profunda e inquieta, mistura espiritualidade e radicalismo. Apaixonada e ardente, pode ser extremista ou ansiosa.',
      profissao: 'Ótima em pesquisa, espiritualidade, ativismo, ocultismo, filosofia, ciências ou escrita de ideias radicais. Vê além e transforma. A renda vem da visão, da intensidade e da coragem de defender ideais.',
      familia: 'Intensa e leal, mas a vida afetiva mistura idealismo e turbulência; precisa de sentido e profundidade na relação. Busca um parceiro que compartilhe sua visão. Mãe dedicada e intensa, ensina ideais, coragem e espiritualidade.',
      saude: 'Sistema nervoso e circulatório sensíveis: ansiedade, insônia, tensões, pés e problemas ligados a excesso mental e emocional. O radicalismo interno cobra; pede aterramento e paz.',
    },
    male: {
      fisico: 'Porte intenso e sério, olhar penetrante e idealista. Feição marcante, energia ardente. Presença profunda e incomum.',
      carater: 'Intenso, idealista e visionário, vive por ideais e causas, às vezes ao ponto do sacrifício. Vê o outro lado das coisas; profundo e inquieto, une espiritualidade e radicalismo. Ardente e apaixonado, por vezes extremista ou ansioso.',
      profissao: 'Sobressai em pesquisa, espiritualidade, ativismo, ocultismo, filosofia, ciências ou escrita de ideias radicais. Vê além e transforma. A renda vem da visão, da intensidade e da defesa de ideais.',
      familia: 'Intenso e leal, mas a vida conjugal mistura idealismo e turbulência; precisa de sentido e profundidade. Busca uma parceira que compartilhe sua visão. Pai dedicado e intenso, ensina ideais, coragem e espiritualidade.',
      saude: 'Sistema nervoso e circulatório sensíveis: ansiedade, insônia, tensões e problemas nos pés por excesso mental e emocional. Pede aterramento, paz e descanso.',
    },
    padas: {
      1: { navamsa: 'Áries', female: 'Pada 1 (Navamsa de Áries, Marte): ideal com fogo e coragem. Ativista ardente; defende causas na frente.', male: 'Pada 1 (Navamsa de Áries, Marte): visão com impulso e combate. Luta por ideais; radical e corajoso.' },
      2: { navamsa: 'Touro', female: 'Pada 2 (Navamsa de Touro, Vênus): idealismo com valor e prazer. Ancora a visão no concreto e no belo; mais estável.', male: 'Pada 2 (Navamsa de Touro, Vênus): ideal com raiz material. Transforma com paciência; arte e recursos.' },
      3: { navamsa: 'Gêmeos', female: 'Pada 3 (Navamsa de Gêmeos, Mercúrio): visão comunicativa e mental. Escreve, ensina, difunde ideias; intelecto ágil.', male: 'Pada 3 (Navamsa de Gêmeos, Mercúrio): ideal articulado e veloz. Comunica a visão; mídia, escrita, debate.' },
      4: { navamsa: 'Câncer', female: 'Pada 4 (Navamsa de Câncer, Lua): idealismo com emoção e cuidado. Visão nutridora e sensível; luta pelos seus.', male: 'Pada 4 (Navamsa de Câncer, Lua): ideal a serviço do afeto. Sensível e protetor; visão emocional.' },
    },
  },

  uttara_bhadrapada: {
    female: {
      fisico: 'Feição serena e profunda, olhar calmo e sábio, porte tranquilo. Aparência estável e acolhedora, aura de paz. Beleza suave, com força silenciosa.',
      carater: 'Profunda, serena e sábia, traz paz e o conselho de quem já viu muito. Paciente, compassiva e estável; força quieta que sustenta os outros. Reservada e prudente, pode ser passiva ou reprimir a própria intensidade sob a calma.',
      profissao: 'Ótima em aconselhamento, espiritualidade, ensino, pesquisa profunda, psicologia ou direito que exija sabedoria e paciência. Estabiliza e orienta. A renda vem da profundidade, da confiança que inspira e do equilíbrio que oferece.',
      familia: 'Serena e leal, é âncora de paz no lar; equilibra e sustenta a família. Parceira profunda e paciente, valoriza estabilidade e confiança. Mãe sábia e calma, transmite paz, valores e profundidade aos filhos.',
      saude: 'Constituição estável, mas propensa a questões de pés, circulação, retenção e à melancolia por reprimir emoções. A calma que engole a intensidade cobra; pede expressão e movimento.',
    },
    male: {
      fisico: 'Porte tranquilo e sólido, olhar calmo e sábio. Aparência estável e acolhedora, aura de paz. Presença que sustenta e serena.',
      carater: 'Profundo, sereno e sábio, traz calma e o conselho da experiência. Paciente e compassivo; força quieta que ampara. Reservado e prudente, por vezes passivo ou reprime a própria intensidade sob a serenidade.',
      profissao: 'Destaca-se em aconselhamento, espiritualidade, ensino, pesquisa, psicologia ou direito que exija sabedoria e paciência. Estabiliza e orienta. A renda vem da profundidade, da confiança e do equilíbrio.',
      familia: 'Sereno e leal, é âncora de paz no lar; equilibra e sustenta os seus. Marido profundo e paciente, valoriza estabilidade. Pai sábio e calmo, transmite paz, valores e profundidade.',
      saude: 'Vitalidade estável, mas propenso a pés, circulação, retenção e melancolia por reprimir emoções. Pede expressão, movimento e descarga.',
    },
    padas: {
      1: { navamsa: 'Leão', female: 'Pada 1 (Navamsa de Leão, Sol): sabedoria com dignidade e brilho. Conselho que lidera; força serena e nobre.', male: 'Pada 1 (Navamsa de Leão, Sol): profundidade com autoridade. Sábio respeitado; calma que comanda.' },
      2: { navamsa: 'Virgem', female: 'Pada 2 (Navamsa de Virgem, Mercúrio): sabedoria prática e detalhista. Serviço, análise e cuidado; profundidade útil.', male: 'Pada 2 (Navamsa de Virgem, Mercúrio): serenidade com método. Pesquisa e serviço minuciosos; sábio prático.' },
      3: { navamsa: 'Libra', female: 'Pada 3 (Navamsa de Libra, Vênus): profundidade com harmonia e beleza. Conciliadora e estética; paz nas relações.', male: 'Pada 3 (Navamsa de Libra, Vênus): sabedoria diplomática e gentil. Equilíbrio e arte; conselheiro sereno.' },
      4: { navamsa: 'Escorpião', female: 'Pada 4 (Navamsa de Escorpião, Marte): calma sobre profundezas intensas. Força silenciosa e transformadora; intuição forte.', male: 'Pada 4 (Navamsa de Escorpião, Marte): serenidade que guarda intensidade. Profundo e magnético; transforma em silêncio.' },
    },
  },

  revati: {
    female: {
      fisico: 'Feição doce e luminosa, olhar gentil e compassivo, sorriso acolhedor. Aparência suave e graciosa, aura de bondade. Beleza terna, que transmite paz e proteção.',
      carater: 'Compassiva, protetora e gentil, cuida de quem está em trânsito e ajuda a chegar. Fecha ciclos com graça, com senso de inteireza e coração generoso. Sensível e nutridora, pode ser ingênua, dispersa ou magoada por dar demais.',
      profissao: 'Ótima em cuidado, saúde, ensino, arte, espiritualidade, viagens ou hospitalidade e orientação. Guia, protege e nutre. A renda vem da compaixão, do talento artístico ou terapêutico e da confiança que inspira.',
      familia: 'Amorosa e devotada, o lar é ninho de afeto e proteção; cuida de todos com ternura. Parceira gentil e leal, valoriza harmonia e acolhimento. Mãe carinhosa e protetora, guia os filhos com amor, arte e valores.',
      saude: 'Constituição sensível, propensa a pés, circulação, imunidade e a absorver as emoções alheias. Dar demais e não se proteger adoece; pede limites, descanso e autocuidado.',
    },
    male: {
      fisico: 'Feição amável e luminosa, olhar gentil e compassivo, porte suave. Aparência acolhedora, aura de bondade. Presença que tranquiliza e protege.',
      carater: 'Compassivo, protetor e gentil, cuida dos que estão em jornada e ajuda a chegar. Fecha ciclos com graça e generosidade; sensível e nutridor. Bondoso e sonhador, por vezes ingênuo, disperso ou magoado por dar demais.',
      profissao: 'Destaca-se em cuidado, saúde, ensino, arte, música, espiritualidade, viagens ou hospitalidade. Guia, protege e nutre. A renda vem da compaixão, do talento artístico ou terapêutico e da confiança que inspira.',
      familia: 'Amoroso e devotado, o lar é ninho de afeto; cuida dos seus com ternura. Marido gentil e leal, valoriza harmonia. Pai carinhoso e protetor, guia os filhos com amor, arte e valores.',
      saude: 'Constituição sensível: pés, circulação, imunidade e tendência a absorver emoções alheias. Dar demais adoece; pede limites, descanso e autocuidado.',
    },
    padas: {
      1: { navamsa: 'Sagitário', female: 'Pada 1 (Navamsa de Sagitário, Júpiter): compaixão com fé e sabedoria. Guia e ensina; generosa e otimista.', male: 'Pada 1 (Navamsa de Sagitário, Júpiter): bondade com visão e ética. Orienta e expande; mestre gentil.' },
      2: { navamsa: 'Capricórnio', female: 'Pada 2 (Navamsa de Capricórnio, Saturno): cuidado com estrutura e responsabilidade. Protege com dever; ampara com constância.', male: 'Pada 2 (Navamsa de Capricórnio, Saturno): compaixão disciplinada. Cuida com método e persistência; sólido.' },
      3: { navamsa: 'Aquário', female: 'Pada 3 (Navamsa de Aquário, Saturno): compaixão coletiva e humanitária. Cuida em escala; causas e comunidades.', male: 'Pada 3 (Navamsa de Aquário, Saturno): bondade coletiva e original. Serve ao bem comum; reforma gentil.' },
      4: { navamsa: 'Peixes', female: 'Pada 4 (Navamsa de Peixes, Júpiter): Revati no elemento — compaixão e espiritualidade plenas. Cura, arte, transcendência; alma generosa.', male: 'Pada 4 (Navamsa de Peixes, Júpiter): compaixão mística no auge. Cura profunda e entrega; espiritual e artístico.' },
    },
  },
}
