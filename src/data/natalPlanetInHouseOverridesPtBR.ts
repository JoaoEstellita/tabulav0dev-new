// Catálogo de interpretações natais: planetas em casas
// Chave: natal:{planet}|house|{number}
// Planetas: sun, moon, mercury, venus, mars, jupiter, saturn, uranus, neptune, pluto
// Casas: 1–12
// Cobertura mínima: 10 × 12 = 120 entradas
// Regras: 3 frases, sem linguagem determinística, sem mojibake

export const NATAL_PLANET_IN_HOUSE_PTBR_OVERRIDES: Record<string, string> = {
  // ── Sol ────────────────────────────────────────────────────────────────────
  'natal:sun|house|1':
    'O Sol na Casa 1 coloca a identidade pessoal no centro da expressão de vida, tornando a autoimagem e a percepção do próprio corpo temas centrais. Há uma tendência natural para liderança, iniciativa e uma presença que chama atenção, com a vitalidade como recurso principal. O desafio e cultivar autoconsciência sem perder abertura para o que os outros e o ambiente refletem.',
  'natal:sun|house|2':
    'O Sol na Casa 2 orienta a energia vital para a construção de segurança material e o desenvolvimento de valores pessoais solidos. A autoestima tende a estar ligada ao que se produz, acumula ou sustenta com o próprio esforço. Trabalhar de forma consistente com recursos — finanças, talentos e tempo — e o caminho natural de autorrealização.',
  'natal:sun|house|3':
    'O Sol na Casa 3 direciona a expressão pessoal para a comunicação, o aprendizado e as trocas cotidianas com o ambiente próximo. Há uma curiosidade intelectual marcada, prazer em articular ideias e tendência a construir identidade através da palavra e do conhecimento. Irmaos, vizinhos e deslocamentos curtos tendem a desempenhar papel relevante na história pessoal.',
  'natal:sun|house|4':
    'O Sol na Casa 4 ancora a identidade na história familiar, no lar e na busca por raízes que oferecem segurança emocional. O sentido de quem se e tende a se desenvolver mais na vida privada do que em reconhecimentos externos, com o lar como espaco de centralização. A segunda metade da vida costuma trazer mais brilho e realização do que os primeiros anos.',
  'natal:sun|house|5':
    'O Sol na Casa 5 ilumina a expressão criativa, o prazer e a capacidade de mostrar-se de forma autêntica e magnética. Há um impulso natural para a criatividade, o romance e o envolvimento afetivo com o mundo — incluindo artes, entretenimento e relação com crianças. A autenticidade na expressão e o caminho mais direto para realização e reconhecimento.',
  'natal:sun|house|6':
    'O Sol na Casa 6 orienta a energia vital para o serviço, o trabalho diario e a busca por um funcionamento cotidiano eficiente. A identidade tende a se expressar através da qualidade do que se entrega, do cuidado com a saúde e da competência técnica. O risco e centralizar autoestima no desempenho, perdendo de vista o valor próprio alem das tarefas.',
  'natal:sun|house|7':
    'O Sol na Casa 7 coloca as parcerias significativas no centro do desenvolvimento da identidade e da realização pessoal. Relações um a um — amorosas, profissionais ou jurídicas — são o espelho principal através do qual a pessoa se conhece e cresce. O desafio e manter senso próprio dentro de uma identidade que naturalmente se fortalece no encontro com o outro.',
  'natal:sun|house|8':
    'O Sol na Casa 8 orienta a energia vital para a transformação profunda, a intimidade e os processos de renovação psicológica. Há uma tendência para lidar com o que e intenso, oculto ou compartilhado — recursos conjuntos, profundidade nas relações e os misterios da existência. O crescimento pessoal costuma vir de confrontar o que e desconfortavel e sair transformado.',
  'natal:sun|house|9':
    'O Sol na Casa 9 direciona a expressão vital para a busca de sentido, a expansão de horizontes e a construção de uma visão de mundo abrangente. Filosofia, religião, viagens longas e educação superior são arenas naturais de realização e brilho. A identidade se forma e se fortalece através do contato com o que e diferente, distante ou maior que o cotidiano imediato.',
  'natal:sun|house|10':
    'O Sol na Casa 10 coloca a carreira, a reputação e a direção pública como eixo central da expressão vital. Há uma orientação natural para autoridade, reconhecimento e a construção de um legado visivel na vida profissional e social. A realização pessoal tende a se traduzir em conquistas que outros podem ver e validar.',
  'natal:sun|house|11':
    'O Sol na Casa 11 orienta a identidade para o coletivo, os projetos de longo prazo e a participação em grupos com propósito compartilhado. Há satisfação em ser parte de algo maior que o individual, e a amizade e a colaboração costumam ser fontes genuínas de energia vital. O reconhecimento tende a chegar através de contribuições a ideais e causas que ultrapassam o interesse pessoal imediato.',
  'natal:sun|house|12':
    'O Sol na Casa 12 orienta a expressão vital para o recolhimento, o autoconhecimento profundo e o serviço discreto. Há uma tendência para uma vida interior rica, sensibilidade ao que esta nas sombras e conexão com dimensões sutis da experiência. O brilho pessoal costuma se manifestar em espacos de retiro, espiritualidade ou dedicação silenciosa a algo maior que o ego.',

  // ── Lua ────────────────────────────────────────────────────────────────────
  'natal:moon|house|1':
    'A Lua na Casa 1 torna as emoções, a sensibilidade e as reações instintivas parte visivel da presença pessoal. Há uma tendência natural para captar o estado emocional do ambiente e responder com empatia, o que atrai as pessoas mas pode gerar instabilidade de humor sem autocuidado consistente. A expressão do self e fluida, muda com o contexto e reflete as necessidades emocionais do momento.',
  'natal:moon|house|2':
    'A Lua na Casa 2 conecta a segurança emocional diretamente a estabilidade material, tornando finanças e posses temas de grande carga afetiva. Conforto, nutrição e o ato de cuidar do próprio ambiente são fontes naturais de bem-estar interno. A relação com dinheiro tende a ser ciclica, alternando entre acumulo e generosidade conforme o estado emocional.',
  'natal:moon|house|3':
    'A Lua na Casa 3 torna a comunicação um canal natural de expressão emocional, com tendência para falar, escrever e conectar-se através de palavras carregadas de sentimento. A mente e intuitiva e receptiva, captando nuances sutis do ambiente e das pessoas ao redor. Irmaos, vizinhança e deslocamentos curtos tendem a ter carga emocional significativa na história pessoal.',
  'natal:moon|house|4':
    'A Lua na Casa 4 ancora as necessidades emocionais no lar, na família e nas raízes, sendo uma das posições mais fortes para a Lua no mapa natal. Há uma vinculação afetiva intensa com a figura materna e com o sentido de pertencimento familiar, que se torna base para o equilibrio interno. O lar e muito mais que espaco físico — e o centro emocional da vida.',
  'natal:moon|house|5':
    'A Lua na Casa 5 traz uma emotividade criativa e expressiva, com forte necessidade de afeto, reconhecimento e envolvimento ludico com o mundo. Há uma conexão emocional intensa com crianças, artes e relacionamentos românticos, onde sentir e criar se entrancam. O prazer e a expressão genuína funcionam como nutrição emocional fundamental.',
  'natal:moon|house|6':
    'A Lua na Casa 6 conecta o bem-estar emocional a rotina, ao trabalho e ao ato de servir e cuidar dos detalhes. Nutrição física, higiene e organização do cotidiano tem peso emocional significativo, e o estado interno se reflete com frequência na saúde e no corpo. Quando a rotina esta em ordem, as emoções tendem a se estabilizar.',
  'natal:moon|house|7':
    'A Lua na Casa 7 orienta as necessidades emocionais para as relações íntimas e as parcerias, tornando o outro uma fonte central de nutrição afetiva. Há uma sensibilidade acentuada para o que o outro sente e precisa, o que favorece empatia mas pode gerar dependência emocional. O equilibrio entre dar e receber nos vinculos e um aprendizado continuo.',
  'natal:moon|house|8':
    'A Lua na Casa 8 mergulha as emoções em profundidades intensas, ligando a vida emocional a transformação, intimidade e o que esta oculto. Há uma intuição aguçada para o que esta por baixo da superficie, com atração natural por psicologia, misterios e as camadas mais densas da existência. O crescimento emocional vem de nomear e integrar o que estava escondido.',
  'natal:moon|house|9':
    'A Lua na Casa 9 conecta o mundo emocional a busca de sentido, fe e expansão de horizontes. Há uma fome emocional por aprendizado, viagens e contato com culturas diferentes, que funciona como nutrição interior. Crencas religiosas ou filosóficas podem ter forte carga afetiva e influenciar decisões que emergem do campo emocional.',
  'natal:moon|house|10':
    'A Lua na Casa 10 coloca a vida emocional em contato direto com a esfera pública e profissional, tornando a carreira um campo de expressão das necessidades afetivas. Há uma sensibilidade natural para o que o público ou o coletivo precisa, o que pode favorecer carreiras de cuidado, comunicação ou liderança empática. A relação com a figura materna costuma influenciar a construção da trajetoria profissional.',
  'natal:moon|house|11':
    'A Lua na Casa 11 orienta o mundo emocional para grupos, amizades e causas coletivas, tornando o senso de pertencer a algo maior uma necessidade afetiva real. Há satisfação emocional genuína em colaborar, apoiar redes e investir em amizades com profundidade. O humor e o bem-estar interno tendem a responder ao estado das relações coletivas e ao clima dos grupos frequentados.',
  'natal:moon|house|12':
    'A Lua na Casa 12 internaliza as emoções de forma profunda, criando uma vida interior rica, mas por vezes dificil de acessar ou comunicar. Há uma sensibilidade sutil ao sofrimento dos outros, intuição desenvolvida e conexão natural com o que esta alem do visivel. O trabalho de autoconhecimento e o contato com a própria vida emocional são caminhos fundamentais de nutrição interna.',

  // ── Mercúrio ────────────────────────────────────────────────────────────────
  'natal:mercury|house|1':
    'Mercúrio na Casa 1 faz da comunicação uma parte central da presença e da identidade pessoal, com a mente e a palavra funcionando como apresentação natural ao mundo. Há uma tendência para processar o entorno com rapidez e articulação, com curiosidade marcada e facilidade para se adaptar a diferentes contextos e interlocutores. O desafio e aprender a escutar com a mesma intensidade com que se fala.',
  'natal:mercury|house|2':
    'Mercúrio na Casa 2 orienta a mente para questões práticas de recursos, valor e sustento, tornando o pensamento uma ferramenta direta de construção material. Há uma aptidão natural para negociar, avaliar e articular propostas ligadas a finanças, negocios e o que tem valor concreto na vida. Ideias funcionam como capital — quanto melhor desenvolvidas, maior sua capacidade de gerar segurança e estabilidade.',
  'natal:mercury|house|3':
    'Mercúrio na Casa 3 e uma posição de grande conforto para o planeta da mente, favorecendo comunicação fluente, aprendizado rapido e trocas ricas com o ambiente próximo. Há uma curiosidade natural pelo cotidiano, pela linguagem e pelos fluxos de informação que movem o mundo ao redor — irmaos, vizinhos e deslocamentos curtos tendem a ser fontes de estimulo constante. A versatilidade mental e um recurso valioso, embora a profundidade possa exigir esforço adicional.',
  'natal:mercury|house|4':
    'Mercúrio na Casa 4 conecta a mente e a linguagem ao mundo privado, familiar e as raízes — as memórias da infância e a história do lar tendem a moldar os padrões de pensamento. Há uma capacidade intuitiva de processar o passado e de usar a comunicação como forma de nutrir ou organizar o ambiente doméstico. A escrita reflexiva, a terapia ou o diario pessoal podem ser canais importantes de processamento interno.',
  'natal:mercury|house|5':
    'Mercúrio na Casa 5 traz leveza, criatividade e prazer intelectual para a comunicação, favorecendo escrita expressiva, humor e a troca de ideias como forma de diversao. Há uma tendência para o pensamento original, o jogo com as palavras e a capacidade de ensinar ou comunicar com uma dose natural de entretenimento. A expressão criativa através da linguagem — seja na escrita, no palco ou no ensino — tende a ser uma fonte genuína de satisfação.',
  'natal:mercury|house|6':
    'Mercúrio na Casa 6 direciona a mente para a analise, o detalhamento e a busca por eficiência nos processos cotidianos. Há uma aptidão natural para organizar informações, identificar falhas e aprimorar métodos de trabalho — o pensamento funciona bem quando orientado por tarefas concretas e práticas. A conexão entre mente e corpo e pronunciada, com o estado mental refletindo diretamente na saúde e na disposição física.',
  'natal:mercury|house|7':
    'Mercúrio na Casa 7 coloca a comunicação no centro das relações significativas, tornando o dialogo, a negociação e o entendimento mutuo ferramentas essenciais nos vinculos. Há uma tendência para atrair parceiros intelectualmente estimulantes e para construir relações baseadas em trocas verbais e mentais. O desafio e usar a mente para aprofundar os vinculos em vez de apenas analisar ou racionalizar o que sente.',
  'natal:mercury|house|8':
    'Mercúrio na Casa 8 desenvolve uma mente investigativa, atraida pelo que esta oculto, pelos mecanismos psicológicos e pelas camadas mais profundas da realidade. Há um talento natural para pesquisa, reconhecimento de padrões ocultos e para lidar com informações sensiveis ou complexas. A comunicação tende a ser cuidadosa e precisa — este Mercúrio prefere dizer pouco e dizer bem.',
  'natal:mercury|house|9':
    'Mercúrio na Casa 9 expande a mente para alem do cotidiano, com interesse genuíno em filosofia, ensino, escrita de longo alcance e o contato com formas de pensar diferentes das próprias. Há uma aptidão para comunicar conceitos amplos, articular visões de mundo e aprender através de viagens, culturas e sistemas de crenca. A escrita academica, a docência e a públicação são canais naturais de expressão para esse posicionamento.',
  'natal:mercury|house|10':
    'Mercúrio na Casa 10 orienta as habilidades de comunicação para a vida pública e profissional, tornando a palavra um recurso central na construção de reputação e autoridade. Há uma tendência para carreiras que envolvem escrita, fala, ensino ou gerenciamento de informações em posições de visibilidade. A credibilidade tende a se construir através da qualidade das ideias e da clareza com que são comunicadas.',
  'natal:mercury|house|11':
    'Mercúrio na Casa 11 conecta a mente ao coletivo, tornando a troca de ideias em grupos, redes e movimentos uma fonte natural de estimulo intelectual. Há prazer genuíno em debater, colaborar em projetos de grande alcance e comunicar ideias que beneficiem um público amplo. A inteligência coletiva funciona melhor do que o pensamento solitario — este Mercúrio prospera no contato com mentes diversas.',
  'natal:mercury|house|12':
    'Mercúrio na Casa 12 internaliza os processos mentais, criando uma vida intelectual mais intuitiva, reflexiva e menos orientada para a expressão pública. Há uma tendência para o pensamento simbólico, os sonhos e as conexões que emergem do inconsciente, tornando a introspecção um modo natural de processamento. A escrita privada, a meditação e o trabalho com a mente em espacos de silencio tendem a ser mais produtivos do que ambientes de troca intensa.',

  // ── Vênus ───────────────────────────────────────────────────────────────────
  'natal:venus|house|1':
    'Vênus na Casa 1 coloca os valores estéticos e o charme no centro da expressão pessoal, tornando a aparência, os modos e a qualidade do primeiro contato temas centrais. Há uma tendência natural para atrair pessoas através do calor e da elegância na forma de se apresentar, com um senso refinado de gosto que e perceptivel desde o inicio. O desafio e cultivar substância interior com a mesma atenção dedicada a imagem externa.',
  'natal:venus|house|2':
    'Vênus na Casa 2 conecta os valores estéticos ao mundo material, criando uma apreciação natural pela beleza nas posses e pelo conforto financeiro. Há prazer em construir um ambiente agradavel e com gosto, e a autoestima tende a se vincular ao que se valoriza e cultiva. Recursos fluem com mais facilidade quando alinhados ao prazer genuíno e ao refinamento pessoal.',
  'natal:venus|house|3':
    'Vênus na Casa 3 traz charme e calor para a comunicação, tornando a conversa e a troca de ideias uma arena natural de prazer e conexão. Há um dom para expressar afeto através das palavras e uma apreciação genuína por inteligência, humor e expressão articulada. Vinculos com irmaos, vizinhos e o ambiente próximo tendem a ter dimensões harmônicas e estéticas significativas.',
  'natal:venus|house|4':
    'Vênus na Casa 4 traz apreciação pelo lar, pelas raízes e pela família como fontes de beleza e nutrição emocional. Há uma tendência para criar ambientes domésticos aconchegantes e esteticamente agradaveis, encontrando conforto genuíno na vida privada e nas conexões ancestrais. A segurança emocional e sustentada por ambientes que se sintam harmônicos e carregados de sentido pessoal.',
  'natal:venus|house|5':
    'Vênus na Casa 5 traz um amor natural pela criatividade, pelo romance e pela auto-expressão através das artes e do prazer. Há um gosto genuíno pelas dimensões dramáticas e alegres da vida — na criação artística, nos encontros românticos e no deleite com crianças e entretenimento. O amor tende a ser expressivo, generoso e caluroso, com a beleza funcionando como meio e mensagem.',
  'natal:venus|house|6':
    'Vênus na Casa 6 traz apreciação pelo cuidado, pelo artesanato e pela qualidade do trabalho cotidiano. Há prazer em tarefas bem executadas, em práticas orientadas a saúde e no serviço realizado com atenção e elegância. O ambiente de trabalho tende a ser importante para o bem-estar, e os vinculos formados através de rotinas compartilhadas costumam ter calor genuíno.',
  'natal:venus|house|7':
    'Vênus na Casa 7 e uma posição clássica para a harmonia relacional, colocando o amor, as parcerias e a graca social no centro da expressão pessoal. Há um talento natural para a diplomacia, uma apreciação genuína pelos outros e uma tendência a prosperar através de conexões íntimas um a um. A parceria — romântica, profissional ou criativa — tende a ser uma fonte central de realização e beleza.',
  'natal:venus|house|8':
    'Vênus na Casa 8 conecta o amor e os valores estéticos a profundidade, a transformação e a intimidade. Há uma atração pelo intenso e pelo oculto, com relações tendendo a envolver profundidade psicológica genuína ou recursos compartilhados. A beleza e o prazer são experimentados como forcas transformadoras, não como confortos superficiais.',
  'natal:venus|house|9':
    'Vênus na Casa 9 conecta o amor e a apreciação a horizontes amplos — filosofia, viagens, culturas diversas e a busca por sentido. Há prazer genuíno em aprender, em descobrir visões de mundo diferentes e em relações que expandem o senso do que e possivel. A beleza e encontrada nas ideias, nas longas jornadas e nas tradições de sabedoria de diversas culturas.',
  'natal:venus|house|10':
    'Vênus na Casa 10 conecta a estética, a diplomacia e os dons relacionais a vida profissional e a reputação pública. Há uma habilidade natural para criar relações de trabalho harmônicas e para construir uma carreira em torno da beleza, das artes ou do serviço. O reconhecimento público tende a chegar por qualidades de graca, gosto ou capacidade de unir pessoas.',
  'natal:venus|house|11':
    'Vênus na Casa 11 orienta o amor e a apreciação para a comunidade, projetos coletivos e ideais de longo prazo. Há prazer genuíno na amizade, em empreendimentos colaborativos e em contribuir para causas que beneficiam muitos. Os circulos sociais tendem a ser calorosos e intelectual ou esteticamente estimulantes.',
  'natal:venus|house|12':
    'Vênus na Casa 12 internaliza o amor e a beleza, criando uma vida interior rica em compaixão, apreciação espiritual e serviço discreto. Há uma sensibilidade ao sofrimento e uma tendência a expressar afeto em privado, nos bastidores ou através de gestos de gentileza que passam despercebidos. As fontes mais profundas de prazer tendem a ser solitarias, místicas ou ligadas a trabalho criativo feito em recolhimento.',

  // ── Marte ───────────────────────────────────────────────────────────────────
  'natal:mars|house|1':
    'Marte na Casa 1 imprime energia, assertividade e um impulso direto para a ação na presença pessoal, tornando o indivíduo reconhecivel por sua iniciativa e vitalidade. Há uma tendência para agir primeiro e refletir depois, com o corpo e a expressão física funcionando como canais primarios de afirmação de identidade. O desafio e canalizar esse impulso de forma que inspire ao inves de intimidar.',
  'natal:mars|house|2':
    'Marte na Casa 2 canaliza energia e determinação para a conquista de recursos materiais e a construção de segurança financeira própria. Há um impulso forte para produzir, possuir e construir sobre o que aparece como oportunidade, com a produtividade funcionando como uma fonte natural de motivação. A relação com dinheiro e posses tende a ser ativa e direta, com preferência por ganhar através do esforço próprio.',
  'natal:mars|house|3':
    'Marte na Casa 3 direciona a energia para a comunicação, a pesquisa e a busca incessante por conhecimento. Há um impulso marcado para investigar, questionar e chegar as conclusoes lógicas das coisas — a mente funciona de forma rapida, direta e incansavel. A escrita, o debate e a comunicação em todas as suas formas podem ser canais de expressão e realização.',
  'natal:mars|house|4':
    'Marte na Casa 4 impulsiona a energia para a construção de raízes, a busca por segurança e o estabelecimento de bases solidas. Há uma motivação forte relacionada ao lar e a família — o ambiente doméstico pode ser um espaco de grande atividade, seja de construção literal ou de dinâmicas familiares intensas. O sentido de segurança interna e conquistado, não herdado passivamente.',
  'natal:mars|house|5':
    'Marte na Casa 5 canaliza a energia para a auto-expressão física e criativa, com impulso marcado para se destacar em qualquer arena que permita autenticidade e presença. Há um gosto pela ação, pelos esportes, pelas artes e por qualquer forma de expressão que leve ao limite. O romance tende a ser apaixonado e intenso, e a criatividade funciona como uma descarga de energia vital.',
  'natal:mars|house|6':
    'Marte na Casa 6 direciona a energia para o serviço, os cuidados e a atenção meticulosa aos detalhes do cotidiano. Há uma motivação forte para resolver problemas práticos, cuidar do que precisa de manutenção e separar o que e essencial do superfluo. A saúde tende a se beneficiar de rotinas ativas, e o trabalho funciona melhor quando há desafio concreto para superar.',
  'natal:mars|house|7':
    'Marte na Casa 7 direciona a energia para as relações significativas, com uma motivação forte para conectar, negociar e alcancar a unidade através da interação. Há um impulso para se elevar acima das personalidades em conflito e encontrar o denominador comum nos vinculos. Parcerias tendem a ser dinâmicas e por vezes competitivas — o outro funciona como espelho que ativa a ação.',
  'natal:mars|house|8':
    'Marte na Casa 8 imprime um impulso profundo para investigar, transformar e ir alem das aparências em busca do essencial. Há uma energia concentrada e determinada que não se satisfaz com o superficial, atraindo o indivíduo para temas de psicologia, poder, recursos compartilhados e as camadas mais densas da existência. Mudanças intensas são catalisadoras de crescimento real.',
  'natal:mars|house|9':
    'Marte na Casa 9 direciona a energia para a busca da verdade, a expansão de horizontes e o aprofundamento em filosofia e temas essenciais e duradouros. Há um impulso forte para explorar, viajar e encontrar o cerne de cada pergunta importante — a superficialidade não prende a atenção por muito tempo. Ideais movem a ação de forma mais consistente do que incentivos imediatos.',
  'natal:mars|house|10':
    'Marte na Casa 10 imprime um impulso marcado para gerenciar, organizar e construir uma trajetoria profissional com determinação. Há uma orientação natural para a liderança prática, a tomada de decisões e a supervisao de processos — a carreira funciona como um campo de ação primario. O impulso para o reconhecimento profissional e consistente e pode se tornar uma forca motriz central.',
  'natal:mars|house|11':
    'Marte na Casa 11 canaliza a energia para o trabalho em grupo, as causas coletivas e a realização de projetos de longo alcance com impacto humanitario. Há um espírito de comunidade genuíno, com motivação para unir esforcos com outros em direção a objetivos compartilhados. Ideais altruistas funcionam como combustivel para a ação de forma mais duradoura do que interesses puramente pessoais.',
  'natal:mars|house|12':
    'Marte na Casa 12 direciona a energia para o interior, o serviço silencioso e o sacrificio pessoal em nome de algo maior. Há uma motivação profunda ligada a compaixão, a psicologia e ao cuidado com o que esta nos bastidores da vida social. A expressão direta de raiva ou desejo pode ser complexa — canalizar a energia de forma estruturada e um aprendizado continuo.',

  // ── Júpiter ─────────────────────────────────────────────────────────────────
  'natal:jupiter|house|1':
    'Júpiter na Casa 1 expande a presença, a personalidade e o impacto sobre os outros, tornando o indivíduo naturalmente magnético, confiante e capaz de fascinar os que estao ao redor. Há uma orientação para a liderança espontânea e para a abertura de caminhos que outros podem seguir, com a vitalidade e o otimismo como recursos visiveis. O desafio e equilibrar a expansão pessoal com a escuta e o reconhecimento do que os outros trazem.',
  'natal:jupiter|house|2':
    'Júpiter na Casa 2 expande a relação com recursos materiais, talentos e valores pessoais, criando uma tendência para atrair oportunidades de prosperidade ao longo do tempo. Há uma resposta otimista ao que a vida oferece como possibilidade de crescimento, com o mundo dos negocios podendo se beneficiar dessa capacidade de reagir e construir. A generosidade com o que se possui tende a circular de volta de formas inesperadas.',
  'natal:jupiter|house|3':
    'Júpiter na Casa 3 expande a mente curiosa, a capacidade de pesquisa e as conexões com o ambiente imediato, criando um impulso natural de investigar, questionar e levar as coisas a conclusoes significativas. Há prazer genuíno na comunicação, no aprendizado e na troca de ideias, com a carreira podendo se desenvolver em torno dessas qualidades. Vinculos com irmaos e vizinhos tendem a ter dimensões de crescimento ou oportunidade.',
  'natal:jupiter|house|4':
    'Júpiter na Casa 4 expande o sentido de raízes, lar e segurança, criando uma tendência para encontrar recursos e suporte na esfera privada e familiar. Há uma orientação para o crescimento através do que e interno — a história familiar, as raízes culturais e o lar como espaco de abundância. Uma vocação que possa se desenvolver a partir do que e pessoal e privado tende a ser natural.',
  'natal:jupiter|house|5':
    'Júpiter na Casa 5 expande a criatividade, a auto-expressão e o prazer, tornando as artes, o entretenimento, os esportes e o relacionamento com crianças arenas naturais de crescimento e realização. Há uma generosidade expressiva e uma capacidade de inspirar outros através da autenticidade e da exuberância criativa. O romance tende a ser entusiástico e as oportunidades de destaque chegam quando a pessoa se permite expressar genuinamente.',
  'natal:jupiter|house|6':
    'Júpiter na Casa 6 expande a orientação para o serviço, o cuidado com a saúde e a busca por eficiência nos processos cotidianos. Há uma tendência para encontrar crescimento e realização em ocupações que envolvam cuidar dos outros, preservar e restaurar — saúde, nutrição e atenção aos detalhes são áreas de possivel vocação. O bem-estar tende a se expandir quando as rotinas diarias são tratadas com intencionalidade.',
  'natal:jupiter|house|7':
    'Júpiter na Casa 7 expande a vida relacional, tornando as parcerias — amorosas, profissionais ou jurídicas — arenas de crescimento, oportunidade e expansão de horizonte. Há uma generosidade nas relações e uma tendência para atrair parceiros que abrem caminhos ou ampliam perspectivas. O crescimento pessoal tende a ocorrer com mais intensidade através do encontro com o outro.',
  'natal:jupiter|house|8':
    'Júpiter na Casa 8 expande a capacidade de investigar, transformar e ir alem das aparências para chegar ao essencial. Há uma facilidade para lidar com o que esta oculto — recursos compartilhados, psicologia profunda, ocultismo — com uma orientação natural para desmascarar o que e real em qualquer situação. Negocios que envolvem recursos coletivos ou transformação podem ser áreas de crescimento natural.',
  'natal:jupiter|house|9':
    'Júpiter na Casa 9 e uma das posições de maior conforto para esse planeta, expandindo a devoção pela verdade, a busca de significado e o contato com o que e amplo e essencial. Há uma orientação natural para filosofia, religião, ensinamento e viagens longas como arenas de realização. A carreira pode depender da capacidade de alcancar o cerne de cada pergunta importante e de transmitir isso aos outros.',
  'natal:jupiter|house|10':
    'Júpiter na Casa 10 expande a orientação prática, as habilidades de gestão e o impulso para construir uma carreira visivel e significativa. Há uma tendência natural para a liderança, para colocar habilidades organizacionais a serviço de objetivos maiores e para se sentir em casa nas decisões que envolvem supervisao. O reconhecimento público tende a chegar através da competência prática e da capacidade de inspirar.',
  'natal:jupiter|house|11':
    'Júpiter na Casa 11 expande o envolvimento com grupos, comunidades e ideais coletivos de longo alcance. Há uma orientação natural para o trabalho humanitario, para a construção de redes de colaboração e para manter a visão do que e melhor para todos como guia de ação. A realização tende a se ampliar quando o indivíduo contribui para algo maior do que o interesse pessoal.',
  'natal:jupiter|house|12':
    'Júpiter na Casa 12 expande a vida interior, a compaixão e a orientação para o serviço silencioso e o auto-sacrificio. Há uma tendência para encontrar crescimento em espacos de recolhimento — psicologia, conselhamento, espiritualidade e trabalho com populações vulneraveis. O brilho pessoal tende a se manifestar nos bastidores, onde o foco esta em aliviar o sofrimento alheio.',

  // ── Saturno ─────────────────────────────────────────────────────────────────
  'natal:saturn|house|1':
    'Saturno na Casa 1 confere seriedade, reserva e disciplina a presença pessoal, tornando a abordagem ao mundo cuidadosa, deliberada e por vezes formalmente contida. Há uma tendência para não desperdicar gestos ou palavras — o que e expresso carrega peso e intenção. A construção da identidade e um processo lento e consistente, com a maturidade tendendo a trazer mais confiança e reconhecimento do que a juventude.',
  'natal:saturn|house|2':
    'Saturno na Casa 2 imprime frugalidade e criterio rigoroso na relação com recursos materiais e posses. Há uma tendência para limitar aquisições ao essencial e para valorizar o que tem durabilidade — tanto em objetos quanto em pessoas. A construção de segurança financeira tende a ser lenta, deliberada e baseada em esforço consistente, com colheitas possiveis no longo prazo.',
  'natal:saturn|house|3':
    'Saturno na Casa 3 torna a comunicação precisa, contida e orientada ao essencial, sem floreados ou superficialidades. Há uma determinação marcada quando se trata de trabalho mental e pesquisa, com uma capacidade de concentração que pode favorecer carreiras cientificas ou academicas. O aprendizado tende a ser sistemático e profundo, mesmo que mais lento do que o de mentes mais ageis.',
  'natal:saturn|house|4':
    'Saturno na Casa 4 pode tornar as raízes e o ambiente familiar uma fonte de responsabilidade ou limitação percebida, com o senso de segurança sendo algo a construir, não dado. Há uma tendência para necessidades simples no que diz respeito ao lar, com emoções e sentimentos por vezes experienciados de forma mais seca ou contida. A maturidade tende a trazer uma base mais solida e a resolver o que parecia escasso na infância.',
  'natal:saturn|house|5':
    'Saturno na Casa 5 torna a auto-expressão mais comedida, com uma tendência para ser rigido consigo mesmo nas áreas de criatividade, romance e expressão de sentimentos. Há uma seriedade na abordagem ao prazer que pode gerar inibição ou dificuldade de soltar. Com o tempo, a expressão criativa tende a se tornar mais consistente e duradoura exatamente por não ser impulsiva ou efemera.',
  'natal:saturn|house|6':
    'Saturno na Casa 6 torna as capacidades críticas e analiticas severas, com uma tendência para ser implacavel na avaliação da qualidade — do próprio trabalho e dos outros. Há rigor no cuidado com a saúde, a alimentação e os processos de manutenção, podendo gerar tanto disciplina salutar quanto exigência excessiva. Trabalhar com outros pode ser mais desafiador do que trabalhar de forma independente.',
  'natal:saturn|house|7':
    'Saturno na Casa 7 torna as relações um campo de responsabilidade, compromisso e por vezes exigência elevada. Há uma tendência para levar parcerias a serio, com pouca tolerância a superficialidade e um desejo de construir vinculos duradouros. O desafio e equilibrar o senso de dever dentro das relações com abertura para a fluidez e o calor que a convivência tambem exige.',
  'natal:saturn|house|8':
    'Saturno na Casa 8 desenvolve uma exigência profunda em relação ao que e essencial, central e genuíno em qualquer situação. Há uma capacidade marcada para identificar o nucleo de uma questão e para exercer controle de qualidade em áreas que envolvem profundidade, recursos compartilhados ou responsabilidade. Negocios, gestão de heranças e psicologia profunda são áreas de possivel competência.',
  'natal:saturn|house|9':
    'Saturno na Casa 9 torna a busca por verdade, filosofia e valores religiosos uma questão de seriedade e rigor intelectual. Há um cuidado meticuloso para separar o que e solido e duradouro do que e efemero nas ideias e crencas. Para outros, essa postura pode parecer demasiado formal ou pessimista, mas tende a gerar uma visão de mundo consistente e fundamentada.',
  'natal:saturn|house|10':
    'Saturno na Casa 10 e uma das posições clássicas de orientação para a carreira com disciplina, persistência e compromisso com a própria reputação. Há uma orientação marcada para a praticidade, a organização e a construção deliberada de uma trajetoria profissional solida. A reputação e tratada com seriedade — e o trabalho ao longo do tempo, mais do que o talento espontâneo, que tende a definir o legado.',
  'natal:saturn|house|11':
    'Saturno na Casa 11 orienta o esforço para a realização de sonhos e ideais coletivos de forma persistente e disciplinada. Há uma seriedade no trabalho com grupos e comunidades, com pouca tendência a objetivos superficiais ou de curto prazo. Os ideais humanitarios são centrais, mas o caminho para realiza-los costuma exigir tempo, consistência e tolerância a resultados lentos.',
  'natal:saturn|house|12':
    'Saturno na Casa 12 orienta a seriedade e a responsabilidade para o mundo interno, o sacrificio pessoal e o serviço silencioso aos outros. Há um compromisso profundo com o autoconhecimento, com a psicologia e com as dimensões místicas da existência. O cuidado com o outro e feito de forma meticulosa e deliberada, mesmo que raramente em evidência.',

  // ── Urano ───────────────────────────────────────────────────────────────────
  'natal:uranus|house|1':
    'Urano na Casa 1 confere excentricidade, originalidade e uma presença que frequentemente se destaca como diferente ou imprevisivel. Há uma tendência para a espontaneidade, para a ruptura com convenções e para uma abordagem da vida que rompe com o esperado de forma criativa ou provocativa. A identidade e construida de forma não-linear, através de experimentação e autonomia radical.',
  'natal:uranus|house|2':
    'Urano na Casa 2 cria formas incomuns de se relacionar com recursos materiais e de sustentar a própria vida. Há uma tendência para um estilo econômico individualista, pouco convencional em relação aos padrões do grupo, com oscilações possiveis entre periodos de abundância e escassez. Novas formas de gerar sustento e de definir valor tendem a ser mais naturais do que seguir trilhas estabelecidas.',
  'natal:uranus|house|3':
    'Urano na Casa 3 confere originalidade e perspicacia ao processamento mental, com uma abordagem independente para resolução de problemas que tende a chegar a conexões inesperadas. Há um discernimento agucado quando se trata de investigação, estudo e comunicação — a mente opera de forma não-convencional e costuma surpreender. O pensamento não-linear pode ser um recurso criativo de alto valor.',
  'natal:uranus|house|4':
    'Urano na Casa 4 cria um sentido de lar e família que se afasta dos modelos convencionais, com uma tendência para ambientes domésticos incomuns ou arranjos familiares que diferem do padrão. Há uma independência marcada no que diz respeito a segurança pessoal, com resistência a restrições emocionais ou familiares. O sentimento de pertencimento tende a ser construido de forma não-tradicional.',
  'natal:uranus|house|5':
    'Urano na Casa 5 traz originalidade e imprevisibilidade para a auto-expressão, o romance e o envolvimento criativo. Há uma tendência para formas não-convencionais de recreação, expressão artística e relacionamento romântico, com uma necessidade de liberdade que pode complicar vinculos mais tradicionais. A criatividade tende a ser mais inventiva do que clássica.',
  'natal:uranus|house|6':
    'Urano na Casa 6 traz inovação para as práticas de auto-cuidado, saúde e trabalho cotidiano, com uma tendência para abordagens não-convencionais que subvertem o status quo. Há uma disposição para enxergar novas formas de fazer uso do que existe, especialmente em contextos de saúde, alimentação e serviço. Situações de trabalho muito hierárquicas ou rigidas tendem a ser mal toleradas.',
  'natal:uranus|house|7':
    'Urano na Casa 7 traz originalidade e impulso por liberdade para o campo das relações significativas. Há uma tendência para parcerias que fogem do padrão convencional, com resistência a relacionamentos que limitem a autonomia individual. O ideal de vinculo tende a incluir espaco, independência mutua e abertura para o novo — mesmo que isso torne a estabilidade mais dificil de manter.',
  'natal:uranus|house|8':
    'Urano na Casa 8 traz insight rapido e não-convencional para as camadas mais profundas da realidade — o que e essencial em uma situação tende a se tornar visivel de forma subita. Há uma perspicacia particular para separar o que tem valor real do que e ilusão, especialmente em questões de recursos compartilhados ou dinâmicas ocultas de poder. A transformação pessoal tende a ocorrer através de mudanças abruptas e inesperadas.',
  'natal:uranus|house|9':
    'Urano na Casa 9 cria uma abordagem não-convencional a filosofia, a religião e as grandes questões de verdade e significado. Há uma tendência para chegar a insights originais sobre o que e realmente importante, fora das trilhas estabelecidas pelas instituições ou tradições. Essa independência intelectual pode tornar o indivíduo solitario em suas crencas, mas tambem profundamente autêntico.',
  'natal:uranus|house|10':
    'Urano na Casa 10 traz originalidade e não-convencionalidade para a carreira e a reputação pública. Há uma perspicacia particular em questões práticas e de organização, com uma tendência para abordagens de trabalho que fogem da estrutura hierárquica tradicional. A reputação pode incluir a de ser diferente — o que pode funcionar como diferencial em áreas de inovação.',
  'natal:uranus|house|11':
    'Urano na Casa 11 favorece amizades e grupos com um perfil não-convencional, humanitario ou vanguardista. Há ideias muito originais quando se trata de comunidade e de como tornar visões coletivas em realidade. O sentido de pertencimento tende a vir de grupos que valorizam a individualidade, a diversidade e a ruptura com o que esta estabelecido.',
  'natal:uranus|house|12':
    'Urano na Casa 12 traz originalidade e não-convencionalidade para a vida interior, a psicologia e tudo que e místico ou espiritual. Há uma tendência para formas inusitadas de autoconhecimento e para ajudar os outros de maneiras que escapam das categorias estabelecidas. A vida subjetiva pode incluir insights repentinos, experiências incomuns e uma percepção que funciona de formas não-lineares.',

  // ── Netuno ──────────────────────────────────────────────────────────────────
  'natal:neptune|house|1':
    'Netuno na Casa 1 torna a presença pessoal fluida, magnética e por vezes dificil de definir ou categorizar. Há um charme místico e uma capacidade de encantar os outros com uma sensibilidade quasi-mediúnica, criando uma impressão que pode ser inspiradora mas tambem nebulosa. O desafio e desenvolver clareza de identidade em um self que naturalmente se dissolve nas percepções e projeções dos outros.',
  'natal:neptune|house|2':
    'Netuno na Casa 2 torna a relação com o mundo material idealizante, com uma tendência para responder de forma elevada ao que a vida oferece, nem sempre de forma prática. Há idealismos marcados em relação a finanças, posses e ao modo de se sustentar, o que pode levar a decepções quando a realidade não acompanha a visão. Clareza nos limites financeiros e um aprendizado importante.',
  'natal:neptune|house|3':
    'Netuno na Casa 3 torna a mente imaginativa e pouco preocupada com fatos e numeros — o territorio natural são as ideias, a escrita místico-poética e a pesquisa de assuntos espirituais ou religiosos. Há uma sensibilidade agucada para as nuances da linguagem e para o que esta nas entrelinhas da comunicação. A intuição e frequentemente mais confiavel do que o raciocinio exclusivamente lógico.',
  'natal:neptune|house|4':
    'Netuno na Casa 4 cria um ideal de lar e família que tende ao romântico, ao espiritual ou ao comunitario. Há uma criatividade latente para o ambiente doméstico e um sentido de unidade que permeia a vida familiar. A relação com a origem pode envolver idealização ou alguma confusão — trabalhar a clareza sobre o passado familiar pode ser um processo de longa maturação.',
  'natal:neptune|house|5':
    'Netuno na Casa 5 traz uma imaginação criativa expansiva, um forte senso dramático e uma habilidade para expressar ideias de sabor místico ou transcendente. Há prazer genuíno em encantar — crianças e adultos — com histórias, musica, arte e experiências que tocam algo alem do cotidiano. O romance tende a ser idealizado, com uma busca de algo que transcenda o ordinario.',
  'natal:neptune|house|6':
    'Netuno na Casa 6 traz criatividade e idealismo para as práticas de saúde, alimentação e rotina de cuidado. Há uma receptividade a abordagens holísticas e uma tendência para perceber os beneficios sutis do que alimenta corpo e mente. O cuidado com os outros pode ser uma vocação natural, desde que equilibrado para evitar auto-negligência ou sacrificio excessivo.',
  'natal:neptune|house|7':
    'Netuno na Casa 7 torna os ideais de parceria e relacionamento elevados, com uma busca por vinculos que transcendam o ordinario. Há uma imaginação ativa em relação ao que o outro representa, o que pode enriquecer ou idealizar excessivamente as relações. A clareza sobre quem o parceiro realmente e — e não quem se projeta nele — e um trabalho continuo.',
  'natal:neptune|house|8':
    'Netuno na Casa 8 torna a visão do que e essencial em qualquer situação nebulosa e ao mesmo tempo espiritualizada. Há uma confiança e um idealismo pronunciados ao lidar com o que esta oculto, com o que e compartilhado e com as camadas mais profundas da existência. O misticismo, a iniciação e os processos de transformação interior tendem a se tornar gradualmente mais nitidos ao longo do tempo.',
  'natal:neptune|house|9':
    'Netuno na Casa 9 conecta os sonhos e ideais a busca pelo que e puro, verdadeiro e transcendente. Há um refugio emocional e intelectual na filosofia, na religião e nas grandes questões existenciais, com uma imaginação quasi-mística que fornece visões de unidade e interconexao. O senso de que o mundo e uma grande comunidade permeia a abordagem etica e espiritual.',
  'natal:neptune|house|10':
    'Netuno na Casa 10 conecta as habilidades práticas a uma visão interior de natureza quasi-mística, permitindo manifestar ideais e sonhos de forma organizada na vida pública. Há uma aptidão para dar ao público um sentido do ideal — através de cinema, publicidade, trabalho espiritual ou qualquer área que una o concreto e o transcendente. A carreira pode ser dificil de definir claramente, mas tende a se revelar com o tempo.',
  'natal:neptune|house|11':
    'Netuno na Casa 11 alimenta o sonho de um mundo de unidade, harmonia e entendimento coletivo. Há uma imaginação voltada para objetivos altruistas e uma tendência para se envolver em trabalho comunitario ou de grupo com ideais elevados. A visão interior do que e possivel para a humanidade pode funcionar como motivação profunda, mesmo quando a realidade prática e mais complexa.',
  'natal:neptune|house|12':
    'Netuno na Casa 12 traz ideais muito elevados, uma visão de unidade e uma tendência profunda para a abnegação e a compreensão compassiva. Há uma conexão natural com as dimensões subjetivas, místicas e psicológicas da experiência, com um interesse genuíno pelo que esta alem do visivel. O cuidado dos outros e feito com sensibilidade fina e uma consciência de que os sofrimentos alheios são parte de uma teia maior.',

  // ── Plutão ──────────────────────────────────────────────────────────────────
  'natal:pluto|house|1':
    'Plutão na Casa 1 imprime intensidade, profundidade e um impulso para ir alem das aparências na expressão pessoal e na abordagem da vida. Há uma presença que e percebida pelos outros antes mesmo de qualquer palavra ser dita — magnética, concentrada e por vezes intimidante. A identidade e construida através de processos de transformação profunda, com mortes simbólicas e renascimentos sendo parte da narrativa pessoal.',
  'natal:pluto|house|2':
    'Plutão na Casa 2 cria uma relação com o mundo material marcada por transformações, crises e aprofundamentos que ensinam o verdadeiro valor das coisas. Há uma habilidade para superar o superficial e identificar o que tem valor real em qualquer situação de negocios ou posses. A trajetoria com recursos financeiros tende a incluir perdas e ganhos significativos que moldam uma sabedoria financeira profunda.',
  'natal:pluto|house|3':
    'Plutão na Casa 3 desenvolve uma mente investigativa que não se contenta com o superficial, sempre pesquisando, questionando e indo atras de informações mais profundas. Há uma paixão pelo inquerito e pela comunicação de ideias com peso e substância. A escrita, a pesquisa e o debate tendem a ser canais de expressão de um pensamento que naturalmente vai fundo nas coisas.',
  'natal:pluto|house|4':
    'Plutão na Casa 4 torna o lar, a história familiar e o senso de segurança temas de transformação profunda e aprendizado real. Há uma sensibilidade acentuada nessa área, com mudanças que afetam o sentido de pertencimento sendo catalisadoras de crescimento interior. Trabalhar a relação com as raízes e com o passado familiar tende a ser um processo continuo de ressignificação.',
  'natal:pluto|house|5':
    'Plutão na Casa 5 cria uma sensibilidade intensa na expressão criativa, no romance e na relação com crianças. Há periodos de criatividade intensa que permitem atravessar mudanças e crescimento interior profundo — a arte, a musica e a escrita podem funcionar como canais de transformação. O romance tende a ser intenso, transformador e pouco superficial.',
  'natal:pluto|house|6':
    'Plutão na Casa 6 cria uma tendência para abordagens radicais de auto-analise, saúde e rotina de cuidado. Servir e cuidar de si mesmo e dos outros são fontes primarias de crescimento interior — e tambem de crises que revelam o que precisa ser transformado. Há uma sensibilidade a crítica que, quando trabalhada, se transforma em discernimento agucado.',
  'natal:pluto|house|7':
    'Plutão na Casa 7 torna as relações significativas arenas de transformação, intensidade e crescimento interior profundo. Casamento, parcerias e vinculos próximos tendem a ser intensos, não-superficiais e capazes de revelar camadas que estavam ocultas. A mudança e o crescimento interior chegam com mais frequência através do encontro transformador com o outro do que em solitario.',
  'natal:pluto|house|8':
    'Plutão na Casa 8 cria uma atração intensa pelo oculto, pela psicologia profunda, pela iniciação e pelo misticismo. Há um impulso para ir alem das aparências em busca da essência — do que e real em qualquer situação, independentemente do desconforto que isso gere. Mudanças pessoais intensas e crescimento interior profundo são habitos que se repetem ao longo de toda a vida.',
  'natal:pluto|house|9':
    'Plutão na Casa 9 cria uma paixão intensa pela busca da verdade e da essência, com uma abordagem analítica que vai fundo nos sistemas de crenca, na filosofia e nos fundamentos do que se acredita. Há uma dificuldade de tolerar o efemero ou o superficial em qualquer discussão de ideias ou valores. Essa profundidade pode não ser facilmente compreendida pelos outros, mas gera insights de longo alcance.',
  'natal:pluto|house|10':
    'Plutão na Casa 10 traz um senso prático enorme — capaz de atravessar toda a burocracia e identificar as decisões corretas — aliado a uma capacidade de organizar e transformar o que e vulneravel na esfera pública e profissional. Há uma tendência para posições de poder transformador, onde o indivíduo lida com as camadas mais sensiveis das estruturas sociais ou organizacionais. O legado profissional tende a ser profundo e duradouro.',
  'natal:pluto|house|11':
    'Plutão na Casa 11 alimenta um ardente zelo pelo mundo ideal e uma necessidade de fazer parte de um grupo de almas afins orientadas para algo maior. Há uma aprendizagem real através dos esforcos de colaboração e de tornar a visão interior em realidade coletiva. Grupos e movimentos sociais podem ser tanto fontes de poder quanto arenas de conflito que revelam dinâmicas ocultas.',
  'natal:pluto|house|12':
    'Plutão na Casa 12 cria uma aptidão natural para a psicologia profunda, para cavar abaixo da superficie da psique humana e compreender suas vulnerabilidades. Há uma paixão pelo auto-sacrificio e pela doação genuína em nome do que se acredita, com uma compreensão rara da complexidade humana. O trabalho de autoconhecimento e frequentemente a via de acesso a um poder pessoal que so se revela nas profundezas.',
}
