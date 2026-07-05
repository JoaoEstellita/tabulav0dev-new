// Catálogo pt-BR: Planeta no Signo Natal
// Fonte: tradição psicológica/moderna (linha Rudhyar/Arroyo/Sasportas) — reescrita original
// 120 entradas: 10 planetas × 12 signos
// Chave: natal:{planet}_in_{sign}
// Regras: presente simples, não-determinístico, mínimo 3 frases, mínimo 50 chars

export const PLANET_IN_SIGN_PTBR_OVERRIDES: Record<string, string> = {

  // ─── Sol ─────────────────────────────────────────────────────────────────

  'natal:sun_in_aries':
    'A identidade se constrói pela ação direta, pela iniciativa e pelo impulso de ser o primeiro. Há um espírito pioneiro que valoriza a autonomia acima da segurança e tende a agir antes de refletir. O senso de si mesmo se fortalece quando há desafios reais para superar e resultados concretos para conquistar.',

  'natal:sun_in_taurus':
    'A identidade se ancora na constância, na estabilidade material e no prazer sensorial. O senso de valor próprio cresce pelo que foi construído com esforço e paciência, não pelo que foi herdado ou conseguido de forma repentina. Mudanças bruscas provocam resistência, mas a determinação diante dos obstáculos é uma das maiores forças desse posicionamento.',

  'natal:sun_in_gemini':
    'A identidade se expressa pela curiosidade intelectual e pela capacidade de comunicar ideias com fluência e versatilidade. Há uma necessidade genuína de variedade e estímulo mental que pode tornar a constância num desafio real. O contato com diferentes pessoas e perspectivas alimenta continuamente o senso de si mesmo.',

  'natal:sun_in_cancer':
    'A identidade está profundamente entrelaçada com as raízes, a memória afetiva e o senso de pertencimento. A intuição emocional é aguda e serve de bússola nas decisões mais importantes da vida. A necessidade de segurança interior é o eixo em torno do qual toda a personalidade se organiza e se expressa.',

  'natal:sun_in_leo':
    'A identidade se manifesta pela expressão criativa, pelo calor humano e pelo desejo genuíno de ser reconhecido. A generosidade natural é real, mas há uma sensibilidade significativa ao julgamento e à indiferença alheios. O senso de propósito se fortalece quando há espaço para brilhar sem precisar competir pela atenção.',

  'natal:sun_in_virgo':
    'A identidade se constrói pela utilidade, pela análise cuidadosa e pelo cuidado com os detalhes. O perfeccionismo pode ser tanto uma força quanto uma fonte de autocrítica excessiva aplicada a si mesmo e aos outros. O senso de valor próprio se aprofunda quando o trabalho realizado contribui de forma concreta para algo maior.',

  'natal:sun_in_libra':
    'A identidade se define em relação ao outro — o senso de si mesmo emerge no espelho das relações e das trocas. O instinto para a equidade e a harmonia é genuíno, mas pode tornar a tomada de decisões solitárias um processo lento. O gosto estético apurado é uma expressão direta e consistente da personalidade.',

  'natal:sun_in_scorpio':
    'A identidade é marcada pela profundidade emocional, pela intensidade e pela necessidade de autenticidade nas relações. A superficialidade não tem apelo; o que importa é o que está oculto, verdadeiro e duradouro. A capacidade de se regenerar após períodos de crise é uma das marcas mais fortes desse posicionamento.',

  'natal:sun_in_sagittarius':
    'A identidade se orienta pela busca de sentido, pela expansão e pela liberdade de explorar horizontes. Há um entusiasmo natural que abre portas e inspira outros, mas o comprometimento com um único caminho pode ser um desafio interno. A filosofia de vida é levada a sério e tende a evoluir com as experiências acumuladas.',

  'natal:sun_in_capricorn':
    'A identidade se constrói pela conquista gradual, pela disciplina e pelo respeito conquistado ao longo do tempo. A autoridade vem do que foi provado na prática, não do prestígio imediato ou do título herdado. O amadurecimento geralmente traz mais abertura e leveza do que os anos de formação sugerem.',

  'natal:sun_in_aquarius':
    'A identidade se expressa pela originalidade, pelo pensamento independente e pelo senso de pertencimento a algo coletivo e maior do que o eu. A necessidade de liberdade intelectual é inegociável e qualquer imposição é sentida como violação. Por trás da aparente frieza emocional há um comprometimento genuíno com ideais e causas.',

  'natal:sun_in_pisces':
    'A identidade é porosa, empática e capaz de absorver profundamente o ambiente ao redor. A imaginação e a sensibilidade espiritual são forças reais, mas podem tornar difusa a fronteira entre o eu e o outro. O caminho de autoconhecimento passa por aprender a distinguir o que é próprio do que é projeção ou fusão com o entorno.',

  // ─── Lua ─────────────────────────────────────────────────────────────────

  'natal:moon_in_aries':
    'As necessidades emocionais se expressam de forma rápida, direta e com pouca mediação entre o sentimento e a resposta. A reatividade emocional é intensa, mas as emoções passam com velocidade semelhante à da sua chegada. A sensação de agir e de ter iniciativa confere segurança emocional; a inércia prolongada é sentida como desconforto real.',

  'natal:moon_in_taurus':
    'As necessidades emocionais se centram na estabilidade, no conforto físico e na previsibilidade dos vínculos. Há uma lealdade profunda às pessoas e ambientes queridos, junto com resistência natural às mudanças emocionais bruscas. O contato com a natureza, os rituais cotidianos e os prazeres sensoriais alimentam consistentemente o equilíbrio interior.',

  'natal:moon_in_gemini':
    'As necessidades emocionais se expressam pela troca verbal, pela socialização e pela estimulação intelectual constante. O processamento emocional passa pelo diálogo; falar sobre o que se sente ajuda a compreender e organizar as emoções internas. A variedade emocional é natural e não indica superficialidade, mas sim uma forma particular de manter o vínculo com o mundo.',

  'natal:moon_in_cancer':
    'As necessidades emocionais são profundas, instintivas e fortemente ligadas ao núcleo familiar e ao senso de pertencimento. A memória afetiva é poderosa e as emoções do passado continuam ativas e influentes no presente. O cuidado com os outros é uma forma natural de expressão emocional e fonte de nutrição mútua.',

  'natal:moon_in_leo':
    'As necessidades emocionais incluem reconhecimento, apreciação genuína e espaço para se expressar com autenticidade. A generosidade emocional é real, mas também há sensibilidade significativa ao desinteresse ou à indiferença dos outros. O orgulho serve como escudo — a vulnerabilidade é compartilhada apenas quando há confiança suficientemente estabelecida.',

  'natal:moon_in_virgo':
    'As necessidades emocionais se organizam em torno da ordem, da utilidade e da sensação de competência. O cuidado com os outros se expressa em gestos práticos e atenção aos detalhes mais do que em demonstrações afetivas abertas. A autocrítica emocional pode ser intensa; aprender a tratar os próprios sentimentos com a mesma gentileza dedicada aos outros é um caminho de amadurecimento.',

  'natal:moon_in_libra':
    'As necessidades emocionais se realizam na harmonia relacional e na ausência de conflito aberto. O instinto para o equilíbrio é forte, mas pode levar à supressão das próprias necessidades em nome da paz. Ambientes esteticamente agradáveis e relações baseadas em reciprocidade genuína alimentam o bem-estar emocional.',

  'natal:moon_in_scorpio':
    'As necessidades emocionais são intensas, exigentes e difíceis de satisfazer pela superfície das interações. A entrega emocional é total quando há confiança estabelecida, mas a traição ou a decepção pode deixar marcas duradouras. A capacidade de mergulhar nas profundezas da própria psique é uma força que, quando usada conscientemente, gera transformação real.',

  'natal:moon_in_sagittarius':
    'As necessidades emocionais se expressam pela liberdade, pelo movimento e pela busca de sentido nas experiências vividas. O confinamento emocional é sentido como sufocante; espaço para explorar é uma necessidade real, não um capricho passageiro. O otimismo natural serve como proteção emocional e fonte de resiliência diante das adversidades.',

  'natal:moon_in_capricorn':
    'As necessidades emocionais são contidas, discretas e raramente expressas de forma espontânea ou aberta. A responsabilidade e a autossuficiência são valorizadas, mas podem mascarar uma necessidade profunda de validação que raramente é verbalizada. O amadurecimento emocional costuma trazer mais abertura para a vulnerabilidade ao longo do tempo.',

  'natal:moon_in_aquarius':
    'As necessidades emocionais se expressam de forma não convencional, com ênfase na amizade, na liberdade e no senso de pertencimento a grupos. A frieza emocional percebida pelos outros é frequentemente uma forma de manter independência, não ausência de sentimento. A intensidade emocional aparece com força quando valores profundos ou ideais são ameaçados.',

  'natal:moon_in_pisces':
    'As necessidades emocionais são difusas, empáticas e permeáveis à experiência alheia de forma intensa. A sensibilidade é extraordinária, o que pode ser tanto um dom quanto uma vulnerabilidade a ambientes emocionalmente pesados. O recolhimento periódico, a criatividade e a espiritualidade são formas naturais e necessárias de recarregar o equilíbrio interno.',

  // ─── Mercúrio ─────────────────────────────────────────────────────────────

  'natal:mercury_in_aries':
    'O pensamento é rápido, direto e orientado para a ação imediata. Há pouca tolerância para rodeios — a comunicação vai direto ao ponto, às vezes sem os filtros que suavizariam o impacto. A agilidade mental é uma força real, mas a impaciência com raciocínios lentos pode cortar ideias antes de amadurecerem completamente.',

  'natal:mercury_in_taurus':
    'O pensamento é metódico, concreto e orientado para aplicações práticas e duradouras. Antes de expressar uma ideia, há uma tendência natural de processá-la internamente por um tempo considerável. Uma vez que uma conclusão é formada, muda com dificuldade — a consistência intelectual é mais valorizada do que a novidade.',

  'natal:mercury_in_gemini':
    'O pensamento é ágil, associativo e capaz de transitar entre múltiplos temas com facilidade e prazer. A comunicação é um prazer natural e o contato com diferentes pontos de vista alimenta a própria elaboração mental. A mente pode se dispersar quando falta estímulo suficiente para mantê-la engajada e em movimento.',

  'natal:mercury_in_cancer':
    'O pensamento é intuitivo, orientado pela memória e fortemente colorido pelas emoções do momento. As ideias nascem frequentemente de impressões subjetivas e de uma sensibilidade aguda ao clima emocional do ambiente. A imaginação é fértil, mas a objetividade pode ser prejudicada quando há forte envolvimento afetivo com o tema.',

  'natal:mercury_in_leo':
    'O pensamento é dramático, criativo e voltado para comunicar com impacto e presença. Há um senso natural de narrativa — as ideias são apresentadas de forma que captura a atenção do interlocutor. A vaidade intelectual pode surgir quando as próprias ideias são questionadas, mas a capacidade de inspirar com palavras é genuína.',

  'natal:mercury_in_virgo':
    'O pensamento é analítico, preciso e orientado para distinguir o essencial do supérfluo com clareza. Há uma capacidade natural de identificar inconsistências e de organizar informações complexas de forma acessível e clara. A autocrítica aplicada ao próprio raciocínio pode ser intensa, gerando dificuldade em aceitar a imperfeição como parte natural do processo.',

  'natal:mercury_in_libra':
    'O pensamento se desenvolve melhor quando há diálogo — a troca de ideias é parte central do processo de elaboração mental. Há um instinto natural para ver todos os lados de uma questão, resultando em análises equilibradas, mas também em dificuldade para chegar a conclusões definitivas. A comunicação é diplomática por natureza e considerada no tom.',

  'natal:mercury_in_scorpio':
    'O pensamento é investigativo, penetrante e pouco satisfeito com respostas superficiais ou convencionais. Há uma capacidade natural de identificar motivações ocultas e de ler nas entrelinhas das situações com precisão. A comunicação pode ser direta ao ponto da brutalidade ou estrategicamente reservada — raramente ocupa o meio-termo.',

  'natal:mercury_in_sagittarius':
    'O pensamento é expansivo, filosófico e orientado para o quadro geral mais do que para os detalhes concretos. Há entusiasmo genuíno na troca de ideias e uma tendência a generalizar com base em padrões amplos de experiência. O cuidado com os detalhes pode ser um ponto de desenvolvimento, especialmente quando a precisão é necessária.',

  'natal:mercury_in_capricorn':
    'O pensamento é estruturado, pragmático e orientado para resultados concretos e verificáveis. A comunicação é econômica — diz-se o necessário, sem excessos ou ornamentos desnecessários. A profundidade intelectual vem da paciência para construir raciocínios sólidos e da capacidade de manter o foco em objetivos de longo prazo.',

  'natal:mercury_in_aquarius':
    'O pensamento é original, não linear e orientado para conexões inesperadas entre campos distantes. Há um prazer genuíno em questionar premissas estabelecidas e em explorar ideias que desafiam o senso comum. A comunicação pode ser brilhante e estimulante, mas pode prescindir de uma dimensão emocional que facilite a conexão com quem ouve.',

  'natal:mercury_in_pisces':
    'O pensamento é simbólico, intuitivo e frequentemente organizado em imagens e metáforas antes de palavras conceituais. A distinção entre fato e imaginação pode ser fluida, o que alimenta a criatividade mas exige atenção à precisão quando ela é necessária. A comunicação é empática e poeticamente sensível ao estado emocional do interlocutor.',

  // ─── Vênus ────────────────────────────────────────────────────────────────

  'natal:venus_in_aries':
    'O afeto se expressa de forma direta, entusiasmada e sem rodeios prolongados. A atração tende a ser imediata e intensa, com pouca tolerância para jogos ou ambiguidades relacionais que se estendem. A espontaneidade e a honestidade são altamente valorizadas — o que fascina não se entrega sem algum grau de desafio genuíno.',

  'natal:venus_in_taurus':
    'Os valores relacionais se ancoram na lealdade, no conforto sensorial e na confiança construída ao longo do tempo. Há um prazer genuíno nas experiências que envolvem os cinco sentidos — gastronomia, música, toque, beleza natural. A possessividade pode surgir quando o vínculo é sentido como ameaçado ou inseguro.',

  'natal:venus_in_gemini':
    'Os valores relacionais incluem o estímulo intelectual, a leveza e a liberdade para explorar diferentes formas de conexão. A conversa é central — sem troca verbal de qualidade, o afeto esfria naturalmente com o tempo. A versatilidade no amor pode ser confundida com superficialidade, mas reflete uma curiosidade genuína pelo outro.',

  'natal:venus_in_cancer':
    'Os valores relacionais se organizam em torno da proteção, do cuidado mútuo e da intimidade emocional profunda. O afeto se expressa por gestos de cuidado concretos — nutrição, presença constante, memória dos detalhes importantes para o outro. A sensibilidade às rejeições é alta, o que pode gerar retraimento quando não há segurança emocional suficiente.',

  'natal:venus_in_leo':
    'Os valores relacionais incluem admiração genuína, demonstrações afetivas abertas e a sensação de ser especial e único para quem se ama. A generosidade no amor é real, mas há uma expectativa implícita de reciprocidade e reconhecimento consistente. O drama relacional pode surgir quando a atenção é dividida ou o orgulho é ferido de alguma forma.',

  'natal:venus_in_virgo':
    'Os valores relacionais se expressam por atos de serviço, atenção aos detalhes e disposição genuína para melhorar a vida do outro. O afeto raramente é declarado com grandiosidade — manifesta-se em gestos práticos e consistentes ao longo do tempo. A crítica pode surgir como forma de cuidado, mas precisa de moderação para não ser sentida como rejeição.',

  'natal:venus_in_libra':
    'Os valores relacionais se centram na reciprocidade, na harmonia e na beleza da conexão entre duas pessoas. Há uma sensibilidade estética apurada que se estende à escolha de parceiros e ambientes de convivência. O conflito aberto é evitado com destreza, mas o custo pode ser a dificuldade em expressar necessidades pessoais de forma direta.',

  'natal:venus_in_scorpio':
    'Os valores relacionais exigem profundidade, intensidade e uma entrega que vai além da superfície das interações cotidianas. A atração é frequentemente intensa e magnética, mas a confiança é concedida com cautela e testada ao longo do tempo. A possessividade e o ciúme surgem quando há investimento emocional alto; a lealdade esperada é do mesmo nível da oferecida.',

  'natal:venus_in_sagittarius':
    'Os valores relacionais incluem liberdade, aventura compartilhada e espaço para crescer de forma independente dentro do vínculo. A atração tende a se direcionar para pessoas que expandem horizontes e trazem novidade de perspectiva e de mundo. O comprometimento é possível, mas exige que a parceria não aprisione nem limite a exploração pessoal.',

  'natal:venus_in_capricorn':
    'Os valores relacionais se expressam por meio do compromisso sério, da construção gradual e da confiabilidade demonstrada em ações. O afeto pode parecer frio à primeira vista — não porque está ausente, mas porque é demonstrado por atos concretos e presença consistente. A lealdade é profunda, assim como as expectativas de seriedade do parceiro.',

  'natal:venus_in_aquarius':
    'Os valores relacionais incluem amizade intelectual, respeito genuíno pela individualidade de cada um e espaço para o que é incomum. As relações convencionais podem não satisfazer plenamente; há atração por conexões que desafiem os moldes habituais do que uma relação deve ser. A frieza emocional pode ser percebida onde existe, na realidade, uma forma não convencional de amar.',

  'natal:venus_in_pisces':
    'Os valores relacionais são marcados pela compaixão, pela entrega romântica e por uma sensibilidade à beleza espiritual e emocional do outro. A propensão à idealização pode criar expectativas difíceis de sustentar na realidade cotidiana dos vínculos. A capacidade de amar incondicionalmente é real, mas requer discernimento para não se perder inteiramente no outro.',

  // ─── Marte ────────────────────────────────────────────────────────────────

  'natal:mars_in_aries':
    'A energia de ação é direta, intensa e imediata — o corpo age antes de a mente terminar de processar a situação. A assertividade vem naturalmente e não há espaço para a indecisão quando o impulso é forte. A impaciência com obstáculos pode levar a conflitos desnecessários, mas a coragem de iniciar raramente falta.',

  'natal:mars_in_taurus':
    'A energia de ação é lenta para começar, mas extraordinariamente persistente e resistente uma vez iniciada. A motivação está ligada a objetivos tangíveis e duradouros, não à adrenalina da novidade ou do imprevisto. O conflito é evitado sempre que possível, mas quando o limite é atingido, a reação é firme e difícil de reverter.',

  'natal:mars_in_gemini':
    'A energia de ação é versátil, curiosa e distribuída por múltiplos projetos e frentes simultaneamente. A motivação vem da estimulação intelectual e do dinamismo — tarefas monótonas drenam rapidamente o entusiasmo. A palavra é um instrumento de ação poderoso; a argumentação e a persuasão são habilidades naturais e eficazes.',

  'natal:mars_in_cancer':
    'A energia de ação está profundamente conectada ao estado emocional do momento presente. Quando há segurança e motivação afetiva, a capacidade de cuidar e proteger é extraordinária e sustentada. Nos conflitos, o comportamento pode oscilar entre a retirada defensiva e reações indiretas que expressam mais do que parecem à superfície.',

  'natal:mars_in_leo':
    'A energia de ação é teatral, generosa e orientada para deixar uma marca visível e duradoura. Há um prazer genuíno em liderar e em realizar feitos que gerem admiração e reconhecimento. O ego pode inflamar os conflitos — a necessidade de ter razão e de não ser desrespeitado pode transformar desentendimentos pequenos em questões de honra.',

  'natal:mars_in_virgo':
    'A energia de ação é meticulosa, orientada para a eficiência e aplicada com discernimento cuidadoso. Há uma capacidade natural de identificar o gargalo de qualquer sistema e de agir diretamente sobre ele. O perfeccionismo pode retardar a execução, mas o que é feito com esse posicionamento tende a ser sólido e bem acabado.',

  'natal:mars_in_libra':
    'A energia de ação se ativa mais facilmente em parceria do que de forma solitária e independente. Há uma tendência a adiar decisões e ações até que o caminho mais justo e equilibrado seja claramente identificado. O conflito direto é desconfortável por natureza — a estratégia preferida é a negociação e o encontro de termos razoáveis.',

  'natal:mars_in_scorpio':
    'A energia de ação é concentrada, estratégica e orientada por uma determinação que raramente se rende antes de atingir o objetivo proposto. A intensidade é uma marca constante — não há meio-termo quando Marte está em Escorpião. O conflito é levado a sério, com longa memória tanto para alianças quanto para traições.',

  'natal:mars_in_sagittarius':
    'A energia de ação é entusiasta, expansiva e pouco interessada em restrições ou limites impostos externamente. A motivação vem de uma visão ampla de onde se quer chegar, não dos passos concretos e imediatos que separam do objetivo. A impulsividade pode gerar começos brilhantes seguidos de declínios de interesse antes da conclusão.',

  'natal:mars_in_capricorn':
    'A energia de ação é contida, estratégica e orientada pelo longo prazo de forma consistente. Cada passo é calculado em função do objetivo final — a impulsividade não tem espaço nesse posicionamento. A ambição é real e duradoura; o que se decide alcançar raramente é abandonado antes de conquistado.',

  'natal:mars_in_aquarius':
    'A energia de ação é ativada por causas coletivas, por inovações e por contextos que desafiem o status quo estabelecido. Há resistência instintiva a qualquer forma de autoridade que não tenha sido legitimada pela razão ou pelo consenso. A rebeldia pode ser construtiva quando canalizada para transformações genuínas e sustentáveis.',

  'natal:mars_in_pisces':
    'A energia de ação é difusa, instintiva e guiada mais por impulsos internos do que por planos racionais e estruturados. A motivação se sustenta melhor quando há uma dimensão de serviço ou de propósito espiritual envolvida. A agressividade direta é rara — o conflito tende a ser evitado ou sublimado em atividade criativa.',

  // ─── Júpiter ─────────────────────────────────────────────────────────────

  'natal:jupiter_in_aries':
    'A expansão ocorre por meio da iniciativa, do pioneirismo e da capacidade de agir antes dos outros. Há uma aptidão natural para enxergar oportunidades onde outros veem obstáculos e de agir sobre elas com confiança. O excesso pode vir da impulsividade ou da superestimação das próprias forças antes de avaliar os recursos disponíveis.',

  'natal:jupiter_in_taurus':
    'A expansão ocorre por meio da consistência, da acumulação gradual e da conexão profunda com os recursos materiais e naturais. Há um talento natural para identificar o que tem valor duradouro e investir nele com paciência e discernimento. O excesso pode aparecer como acumulação além do necessário ou resistência a deixar ir o que já não serve.',

  'natal:jupiter_in_gemini':
    'A expansão ocorre por meio do conhecimento, da comunicação e da multiplicação de conexões e perspectivas. Há uma capacidade natural de absorver informações de fontes diversas e de sintetizá-las de forma acessível e inspiradora. O desafio está em aprofundar ao invés de apenas ampliar — o excesso pode se manifestar como dispersão intelectual.',

  'natal:jupiter_in_cancer':
    'A expansão ocorre por meio do cuidado, da família e da conexão emocional com raízes e pertencimento. Há uma generosidade natural que se expressa no acolhimento do outro e na criação de ambientes nutritivos e seguros. O excesso pode surgir como protecionismo exagerado ou dificuldade em permitir o crescimento autônomo de quem se ama.',

  'natal:jupiter_in_leo':
    'A expansão ocorre por meio da expressão criativa, da liderança natural e do impacto genuíno que se gera nos outros. Há um magnetismo natural que atrai reconhecimento e colaboradores dispostos a embarcar em projetos ambiciosos. O excesso pode aparecer como arrogância ou necessidade exagerada de admiração e centralidade.',

  'natal:jupiter_in_virgo':
    'A expansão ocorre por meio do serviço, da melhoria contínua dos sistemas e da aplicação prática do conhecimento. Há uma capacidade natural de identificar onde os sistemas podem ser mais eficientes e de implementar melhorias de forma metódica. O excesso pode se manifestar como perfeccionismo que impede o avanço ou crítica excessiva do que poderia ser diferente.',

  'natal:jupiter_in_libra':
    'A expansão ocorre por meio das relações, das parcerias estratégicas e da capacidade de criar pontes entre diferentes partes. Há uma aptidão natural para a diplomacia e para encontrar soluções que satisfaçam diferentes interesses ao mesmo tempo. O excesso pode surgir como dependência de validação externa ou dificuldade em tomar posições claras.',

  'natal:jupiter_in_scorpio':
    'A expansão ocorre por meio da profundidade, da transformação e da capacidade de tocar o que está oculto nos processos e nas pessoas. Há uma aptidão natural para investigação, para lidar com crises e para encontrar recursos onde outros não enxergam possibilidades. O excesso pode se manifestar como obsessão por controle ou dificuldade em confiar nos processos naturais.',

  'natal:jupiter_in_sagittarius':
    'A expansão ocorre de forma natural e abundante — este é um dos posicionamentos de maior afinidade para Júpiter. Há um otimismo genuíno, uma abertura para o mundo e uma capacidade de transformar experiências em sabedoria aplicável. O excesso pode aparecer como promessas maiores do que a capacidade de cumprir ou fuga das consequências imediatas.',

  'natal:jupiter_in_capricorn':
    'A expansão ocorre por meio da disciplina, da reputação construída com o tempo e do investimento estratégico no longo prazo. O crescimento raramente é rápido, mas tende a ser sólido, resistente e respeitado. O excesso pode aparecer como um conservadorismo que impede o aproveitamento de oportunidades fora dos caminhos conhecidos.',

  'natal:jupiter_in_aquarius':
    'A expansão ocorre por meio da inovação, da colaboração em rede e do comprometimento com ideias que beneficiem coletividades. Há uma capacidade natural de enxergar além do paradigma vigente e de inspirar mudanças de grande escala nas estruturas sociais. O excesso pode aparecer como distanciamento das necessidades individuais em nome de causas abstratas.',

  'natal:jupiter_in_pisces':
    'A expansão ocorre por meio da compaixão, da espiritualidade e da abertura genuína para o mistério da existência. Há uma generosidade natural que vai além dos limites do ego, com uma capacidade de conexão com algo maior e mais abrangente. O excesso pode aparecer como escapismo, limites frouxos ou dificuldade em distinguir fé genuína de autoengano.',

  // ─── Saturno ─────────────────────────────────────────────────────────────

  'natal:saturn_in_aries':
    'A disciplina precisa ser desenvolvida na área da ação autônoma e da assertividade pessoal. O desafio desta geração é aprender a liderar sem atropelar e a agir com consistência sem depender da adrenalina do momento. A maturidade traz uma capacidade de iniciativa mais consciente, planejada e sustentada.',

  'natal:saturn_in_taurus':
    'A disciplina é desenvolvida na área dos recursos, do valor próprio e da segurança material. Esta geração tende a carregar crenças limitantes sobre escassez ou indignidade que precisam ser questionadas e transformadas. Com o tempo, constrói-se uma relação madura com os bens materiais e com o reconhecimento do próprio valor.',

  'natal:saturn_in_gemini':
    'A disciplina é desenvolvida na área da comunicação, do aprendizado e do pensamento estruturado. Esta geração pode enfrentar insegurança intelectual ou dificuldade em comunicar ideias com clareza nos primeiros anos. Com a prática consistente, desenvolve-se uma mente capaz de sustentar raciocínios complexos e comunicá-los com precisão.',

  'natal:saturn_in_cancer':
    'A disciplina é desenvolvida na área das emoções, da família e dos cuidados com o outro e consigo mesmo. Esta geração pode ter aprendido que demonstrar vulnerabilidade é arriscado, criando padrões de contenção emocional difíceis de aliviar. O amadurecimento passa por aprender a nutrir a si próprio com a mesma responsabilidade dedicada ao mundo exterior.',

  'natal:saturn_in_leo':
    'A disciplina é desenvolvida na área da autoexpressão, da criatividade e da liderança autêntica. Esta geração pode sentir bloqueios na capacidade de brilhar ou de ocupar o centro das atenções, muitas vezes por medo de julgamento externo. Com o tempo, desenvolve-se uma autoridade genuína que não depende da validação constante dos outros.',

  'natal:saturn_in_virgo':
    'A disciplina é desenvolvida na área do serviço, da saúde e do aperfeiçoamento contínuo de si mesmo e dos sistemas. Esta geração pode carregar exigências extremamente altas consigo mesma e com os outros ao redor. O amadurecimento traz a compreensão de que a perfeição é um processo, não um estado final, e que o cuidado com o corpo é também cuidado com a alma.',

  'natal:saturn_in_libra':
    'A disciplina é desenvolvida na área das relações, da justiça e do equilíbrio entre dar e receber. Esta geração enfrenta o desafio de construir parcerias baseadas em reciprocidade real, não apenas em aparência de harmonia. Com o tempo, aprende-se a negociar de forma justa e a manter os próprios limites dentro dos vínculos significativos.',

  'natal:saturn_in_scorpio':
    'A disciplina é desenvolvida na área do poder, da transformação e da intimidade emocional profunda. Esta geração pode carregar medos ligados à perda de controle, à traição ou às crises de renovação psíquica. Com o tempo, desenvolve-se uma capacidade extraordinária de atravessar crises sem se destruir no processo.',

  'natal:saturn_in_sagittarius':
    'A disciplina é desenvolvida na área das crenças, da filosofia pessoal e da busca por significado autêntico. Esta geração questiona profundamente as estruturas religiosas ou filosóficas herdadas, precisando construir uma visão de mundo própria. Com o tempo, desenvolve-se uma sabedoria que alia liberdade de pensamento com responsabilidade real.',

  'natal:saturn_in_capricorn':
    'A disciplina é desenvolvida no próprio domínio de Saturno, tornando esse posicionamento particularmente exigente quanto a resultados concretos e ao senso de dever. Esta geração tende a ter uma relação séria com autoridade, responsabilidade e conquista ao longo do tempo. Com o amadurecimento, o rigor pode se transformar em sabedoria prática genuína e consistente.',

  'natal:saturn_in_aquarius':
    'A disciplina é desenvolvida na área das estruturas coletivas, da inovação responsável e da liberdade dentro de sistemas. Esta geração enfrenta a tensão entre a necessidade de transformar o estabelecido e o risco de caos pela mudança irresponsável. Com o tempo, aprende-se a reformar sem destruir e a inovar sem negligenciar os que dependem da estrutura.',

  'natal:saturn_in_pisces':
    'A disciplina é desenvolvida na área da espiritualidade, da compaixão com limites e da estrutura da vida interior. Esta geração pode sentir dificuldade em estruturar a vida espiritual ou em distinguir responsabilidade genuína de culpa difusa. Com o amadurecimento, desenvolve-se uma espiritualidade madura que convive com a realidade sem se dissolver nela.',

  // ─── Urano ────────────────────────────────────────────────────────────────

  'natal:uranus_in_aries':
    'A geração com Urano em Áries traz um impulso coletivo por libertação radical da autoridade e pelo pioneirismo a qualquer custo. A necessidade individual de liberdade de ação é intensa e a resistência a qualquer forma de controle externo é marcante. A inovação se dá pela força da individualidade e pela coragem de inaugurar o que ainda não existe.',

  'natal:uranus_in_taurus':
    'A geração com Urano em Touro questiona as estruturas estabelecidas de valor, propriedade e relação com os recursos naturais. Individualmente, pode haver tensão entre o desejo de estabilidade e a necessidade de mudança nos fundamentos materiais da vida. A inovação se dá de forma lenta, mas radical — transforma o que parecia imutável nas bases econômicas e naturais.',

  'natal:uranus_in_gemini':
    'A geração com Urano em Gêmeos traz uma ruptura nos modelos de comunicação, educação e troca de informação. O pensamento desta geração é marcado por um inconformismo com as narrativas dominantes e por uma curiosidade que não aceita respostas prontas. A inovação se dá pela linguagem e pela multiplicação acelerada das formas de expressão e conexão.',

  'natal:uranus_in_cancer':
    'A geração com Urano em Câncer questiona as estruturas familiares tradicionais e as formas convencionais de pertencimento. Individualmente, pode haver oscilações entre a necessidade de raízes e o impulso de redefinir o que é lar e família. A inovação se dá nas bases afetivas e nos modelos coletivos de cuidado e proteção.',

  'natal:uranus_in_leo':
    'A geração com Urano em Leão traz uma ruptura nos modelos de liderança, criatividade e autoexpressão. Há um impulso por autenticidade que não aceita papéis impostos e por uma expressão criativa que desafia convenções estéticas e culturais. A inovação se dá pela originalidade radical da autoexpressão e pela recusa ao conformismo criativo.',

  'natal:uranus_in_virgo':
    'A geração com Urano em Virgem traz uma ruptura nos modelos de trabalho, saúde e serviço coletivo. Há uma tendência a questionar sistemas estabelecidos de saúde e a buscar abordagens alternativas de eficiência e cuidado. A inovação se dá pelos detalhes e pelas transformações nos processos e nas práticas cotidianas.',

  'natal:uranus_in_libra':
    'A geração com Urano em Libra questiona as estruturas do casamento, das parcerias legais e dos acordos sociais. Há uma necessidade de relações que respeitem a individualidade de cada um e resistência a vínculos baseados em papéis tradicionais rígidos. A inovação se dá nas formas de associação, de justiça e nos contratos que regulam a convivência.',

  'natal:uranus_in_scorpio':
    'A geração com Urano em Escorpião traz uma ruptura nas estruturas de poder, sexualidade e transformação coletiva profunda. Há uma intensidade particular na busca de autenticidade emocional e uma resistência às formas convencionais de controle e dominação. A inovação se dá nas profundezas — onde outros não ousam olhar ou questionar.',

  'natal:uranus_in_sagittarius':
    'A geração com Urano em Sagitário questiona as estruturas religiosas, filosóficas e educacionais estabelecidas por séculos. Há um impulso forte por liberdade de crença e por filosofias de vida que desafiem as fronteiras do convencional. A inovação se dá na expansão dos horizontes do que é possível acreditar, explorar e experienciar coletivamente.',

  'natal:uranus_in_capricorn':
    'A geração com Urano em Capricórnio traz uma ruptura nas estruturas institucionais, governamentais e corporativas. Há uma tensão entre a ambição pelo estabelecido e o impulso de transformar as estruturas de poder de dentro para fora. A inovação se dá pela reorganização das hierarquias e das formas de autoridade e responsabilidade coletiva.',

  'natal:uranus_in_aquarius':
    'Urano em Aquário habita seu domínio natural, intensificando a busca por liberdade coletiva, inovação tecnológica e transformação social profunda. O inconformismo com qualquer forma de limitação ao pensamento livre é marcante nesta geração. A inovação se dá pela visão do futuro e pela capacidade de criar redes que transformem estruturas sociais e políticas.',

  'natal:uranus_in_pisces':
    'A geração com Urano em Peixes traz uma ruptura nas estruturas espirituais e na relação coletiva com o invisível e o transcendente. Há uma abertura a formas não convencionais de espiritualidade e uma sensibilidade aguçada às mudanças nas correntes coletivas do inconsciente. A inovação se dá pela dissolução das fronteiras entre o sagrado e o cotidiano.',

  // ─── Netuno ────────────────────────────────────────────────────────────────

  'natal:neptune_in_aries':
    'A geração com Netuno em Áries carrega uma espiritualidade ligada à ação, ao heroísmo e ao ideal do guerreiro que age pelo bem coletivo. Os sonhos coletivos desta geração passam pela luta por um mundo mais autêntico e pela crença no poder do indivíduo de mudar o curso das coisas. A tentação é o fanatismo — a idealização excessiva da própria causa como superior às demais.',

  'natal:neptune_in_taurus':
    'A geração com Netuno em Touro carrega uma espiritualidade ligada à terra, à beleza material e à crença de que a abundância é sagrada. Os sonhos coletivos desta geração passam pela busca de uma relação mais harmoniosa com os recursos naturais e pelo ideal de uma prosperidade que genuinamente nutre. A tentação é a materialização do espiritual ou a espiritualização excessiva do material.',

  'natal:neptune_in_gemini':
    'A geração com Netuno em Gêmeos carrega uma espiritualidade ligada à linguagem, às ideias e à multiplicidade de perspectivas e narrativas. Os sonhos coletivos desta geração passam pela comunicação universal e pela crença no poder das palavras de transformar a realidade coletiva. A tentação é a confusão entre mito e realidade ou a proliferação de narrativas sem ancoragem no concreto.',

  'natal:neptune_in_cancer':
    'A geração com Netuno em Câncer carrega uma espiritualidade ligada ao lar, à nação e aos laços de sangue e afeto. Os sonhos coletivos desta geração passam por um ideal de proteção e pertencimento, com uma nostalgia pelo passado como paraíso perdido. A tentação é o nacionalismo emocional ou a dissolução dos limites do eu nas necessidades da família e do grupo.',

  'natal:neptune_in_leo':
    'A geração com Netuno em Leão carrega uma espiritualidade ligada à criatividade, ao carisma e ao ideal do herói que inspira massas. Os sonhos coletivos desta geração passam pelo glamour, pelo espetáculo e pela crença no poder transformador da expressão artística e pessoal. A tentação é a ilusão de grandeza ou a confusão entre fama e transcendência real.',

  'natal:neptune_in_virgo':
    'A geração com Netuno em Virgem carrega uma espiritualidade ligada ao serviço, à saúde coletiva e à busca de perfeição. Os sonhos coletivos desta geração passam por um ideal de cura e de aperfeiçoamento do tecido social. A tentação é o perfeccionismo que paralisa ou a dissolução da identidade no serviço incansável aos outros.',

  'natal:neptune_in_libra':
    'A geração com Netuno em Libra carrega uma espiritualidade ligada à harmonia, à justiça e ao ideal do amor universal. Os sonhos coletivos desta geração passam por um mundo mais equilibrado e pela crença no poder da diplomacia, da arte e da mediação. A tentação é a ilusão relacional ou a dissolução dos limites pessoais em nome da harmonia superficial.',

  'natal:neptune_in_scorpio':
    'A geração com Netuno em Escorpião carrega uma espiritualidade ligada à transformação, ao ocultismo e à dissolução de tabus coletivos. Os sonhos coletivos desta geração passam pela exploração dos territórios sombrios da psique e pela crença no poder da crise como caminho de renovação profunda. A tentação é o escapismo pelas substâncias ou pela fascinação com o abismo.',

  'natal:neptune_in_sagittarius':
    'A geração com Netuno em Sagitário carrega uma espiritualidade ligada à busca de sentido, ao ecumenismo e à abertura para espiritualidades do mundo inteiro. Os sonhos coletivos desta geração passam pela crença de que todas as tradições espirituais apontam para uma verdade maior e universal. A tentação é o sincretismo sem profundidade ou a fuga da realidade pelo ideal espiritual.',

  'natal:neptune_in_capricorn':
    'A geração com Netuno em Capricórnio carrega uma espiritualidade ligada às estruturas de poder e ao ideal de uma autoridade que genuinamente serve ao bem coletivo. Os sonhos coletivos desta geração passam pela reforma das estruturas existentes a partir de dentro, com responsabilidade e visão. A tentação é a diluição das fronteiras éticas em nome da eficiência ou da ambição.',

  'natal:neptune_in_aquarius':
    'A geração com Netuno em Aquário carrega uma espiritualidade ligada à tecnologia, às redes e ao ideal de uma humanidade profundamente interconectada. Os sonhos coletivos desta geração passam pela crença no potencial transformador da informação compartilhada livremente entre todos. A tentação é a dissolução da identidade individual nas narrativas coletivas ou a confusão entre virtualidade e realidade.',

  'natal:neptune_in_pisces':
    'Netuno em Peixes habita seu domínio natural, intensificando a dissolução de fronteiras coletivas e a busca por transcendência. Os sonhos desta geração passam pela compaixão universal, pela crise das estruturas que fragmentam a humanidade e pelo anseio por uma espiritualidade encarnada e genuína. A tentação é o colapso da distinção entre empatia e fusão ou entre fé autêntica e ilusão confortável.',

  // ─── Plutão ────────────────────────────────────────────────────────────────

  'natal:pluto_in_aries':
    'A geração com Plutão em Áries trouxe transformações profundas nos conceitos de individualidade, liderança e poder pessoal. A força do eu foi tanto o motor quanto o campo de batalha das transformações coletivas desta era histórica. Como arquétipo geracional, carrega o impulso de regeneração pela ação radical e pelo confronto com as estruturas que limitam a autonomia.',

  'natal:pluto_in_taurus':
    'A geração com Plutão em Touro testemunhou e gerou transformações profundas nas estruturas econômicas e na relação com a terra e os recursos naturais. O poder e a riqueza foram concentrados, questionados e redistribuídos de formas que redesenharam o mapa social e produtivo. Como arquétipo, carrega a tensão essencial entre acumulação e renovação dos recursos fundamentais.',

  'natal:pluto_in_gemini':
    'A geração com Plutão em Gêmeos transformou profundamente as estruturas de comunicação, informação e transporte coletivo. A proliferação de novas linguagens, mídias e ideologias caracterizou e definiu essa era de forma marcante. Como arquétipo, carrega o poder transformador das ideias e o risco da propaganda e da fragmentação do discurso coletivo.',

  'natal:pluto_in_cancer':
    'A geração com Plutão em Câncer viveu transformações profundas nos conceitos de nação, família e pertencimento coletivo. Guerras mundiais e deslocamentos em massa redesenharam as fronteiras do lar e da identidade coletiva de forma irreversível. Como arquétipo, carrega a intensidade do apego às raízes e o poder destruidor e regenerador das forças afetivas e nacionais.',

  'natal:pluto_in_leo':
    'A geração com Plutão em Leão transformou profundamente as estruturas de poder, liderança e expressão individual em escala global. O culto à personalidade, o surgimento das estrelas de massa e as guerras de ego caracterizaram essa era de formas até então desconhecidas. Como arquétipo, carrega o impulso de afirmar o eu além de qualquer limite e o risco do narcisismo coletivo.',

  'natal:pluto_in_virgo':
    'A geração com Plutão em Virgem transformou profundamente as estruturas de saúde, trabalho e serviço à coletividade. A revolução nos serviços de saúde, o questionamento das condições de trabalho e a emergência da consciência ecológica marcaram essa geração de forma definitiva. Como arquétipo, carrega o impulso de aperfeiçoamento sistêmico e a tensão entre servir e se destruir no serviço.',

  'natal:pluto_in_libra':
    'A geração com Plutão em Libra transformou profundamente as estruturas do casamento, da justiça e das parcerias em todas as dimensões. O aumento das separações, o surgimento de novos modelos de relação e as transformações no direito de família marcaram essa era de forma visível e duradoura. Como arquétipo, carrega a tensão entre o ideal de harmonia e a necessidade de honrar os próprios limites.',

  'natal:pluto_in_scorpio':
    'A geração com Plutão em Escorpião cresceu em meio a transformações radicais nos temas de morte, sexualidade e poder em escala coletiva. A epidemia de HIV/AIDS, a revolução sexual e as crises de poder político definiram o pano de fundo desta geração de forma intensa. Como arquétipo, carrega uma intimidade com a transformação e uma capacidade de olhar para o abismo sem desviar o olhar.',

  'natal:pluto_in_sagittarius':
    'A geração com Plutão em Sagitário cresceu em meio a transformações profundas nas estruturas religiosas, filosóficas e nas fronteiras geopolíticas do mundo. A globalização acelerada, o fundamentalismo religioso e o choque de civilizações marcaram essa era com força e urgência. Como arquétipo, carrega tanto o impulso de transcender fronteiras quanto o risco do fanatismo ideológico.',

  'natal:pluto_in_capricorn':
    'A geração com Plutão em Capricórnio testemunha a transformação profunda das estruturas institucionais — governos, corporações, sistemas financeiros e hierarquias estabelecidas. A crise de confiança nas instituições e a concentração de poder que precede a inevitável reestruturação definem essa era em andamento. Como arquétipo, carrega tanto o peso do colapso quanto o potencial de reconstrução sobre bases mais sólidas e justas.',

  'natal:pluto_in_aquarius':
    'A geração com Plutão em Aquário atravessa a transformação profunda das estruturas coletivas, da tecnologia e dos sistemas de rede que organizam a humanidade. A inteligência artificial, as mudanças no contrato social e a redistribuição do poder entre indivíduos e coletivos definem esta era em curso com velocidade crescente. Como arquétipo, carrega o potencial de uma liberdade coletiva sem precedentes e o risco de uma vigilância igualmente sem precedentes.',

  'natal:pluto_in_pisces':
    'Como arquétipo prospectivo, Plutão em Peixes promete uma transformação profunda nas estruturas espirituais e na relação coletiva com o inconsciente e o transcendente. A dissolução das fronteiras que separam as formas de vida e de consciência pode ser tanto a maior conquista quanto o maior risco desta era por vir. O convite desta era será integrar a profundidade espiritual com a responsabilidade coletiva pelo mundo compartilhado.',
}
