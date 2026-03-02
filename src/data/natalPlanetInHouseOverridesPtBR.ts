// Catálogo de interpretações natais: planetas em casas
// Chave: natal:{planet}|house|{number}
// Planetas: sun, moon, mercury, venus, mars, jupiter, saturn, uranus, neptune, pluto
// Casas: 1–12
// Cobertura mínima: 10 × 12 = 120 entradas
// Regras: 3 frases, sem linguagem determinística, sem mojibake

export const NATAL_PLANET_IN_HOUSE_PTBR_OVERRIDES: Record<string, string> = {
  // ── Sol ────────────────────────────────────────────────────────────────────
  'natal:sun|house|1':
    'O Sol na Casa 1 coloca a identidade pessoal no centro da expressao de vida, tornando a autoimagem e a percepcao do proprio corpo temas centrais. Ha uma tendencia natural para lideranca, iniciativa e uma presenca que chama atencao, com a vitalidade como recurso principal. O desafio e cultivar autoconsciencia sem perder abertura para o que os outros e o ambiente refletem.',
  'natal:sun|house|2':
    'O Sol na Casa 2 orienta a energia vital para a construcao de seguranca material e o desenvolvimento de valores pessoais solidos. A autoestima tende a estar ligada ao que se produz, acumula ou sustenta com o proprio esforco. Trabalhar de forma consistente com recursos — financas, talentos e tempo — e o caminho natural de autorrealizacao.',
  'natal:sun|house|3':
    'O Sol na Casa 3 direciona a expressao pessoal para a comunicacao, o aprendizado e as trocas cotidianas com o ambiente proximo. Ha uma curiosidade intelectual marcada, prazer em articular ideias e tendencia a construir identidade atraves da palavra e do conhecimento. Irmaos, vizinhos e deslocamentos curtos tendem a desempenhar papel relevante na historia pessoal.',
  'natal:sun|house|4':
    'O Sol na Casa 4 ancora a identidade na historia familiar, no lar e na busca por raizes que oferecem seguranca emocional. O sentido de quem se e tende a se desenvolver mais na vida privada do que em reconhecimentos externos, com o lar como espaco de centralizacao. A segunda metade da vida costuma trazer mais brilho e realizacao do que os primeiros anos.',
  'natal:sun|house|5':
    'O Sol na Casa 5 ilumina a expressao criativa, o prazer e a capacidade de mostrar-se de forma autentica e magnetica. Ha um impulso natural para a criatividade, o romance e o envolvimento afetivo com o mundo — incluindo artes, entretenimento e relacao com criancas. A autenticidade na expressao e o caminho mais direto para realizacao e reconhecimento.',
  'natal:sun|house|6':
    'O Sol na Casa 6 orienta a energia vital para o servico, o trabalho diario e a busca por um funcionamento cotidiano eficiente. A identidade tende a se expressar atraves da qualidade do que se entrega, do cuidado com a saude e da competencia tecnica. O risco e centralizar autoestima no desempenho, perdendo de vista o valor proprio alem das tarefas.',
  'natal:sun|house|7':
    'O Sol na Casa 7 coloca as parcerias significativas no centro do desenvolvimento da identidade e da realizacao pessoal. Relacoes um a um — amorosas, profissionais ou juridicas — sao o espelho principal atraves do qual a pessoa se conhece e cresce. O desafio e manter senso proprio dentro de uma identidade que naturalmente se fortalece no encontro com o outro.',
  'natal:sun|house|8':
    'O Sol na Casa 8 orienta a energia vital para a transformacao profunda, a intimidade e os processos de renovacao psicologica. Ha uma tendencia para lidar com o que e intenso, oculto ou compartilhado — recursos conjuntos, profundidade nas relacoes e os misterios da existencia. O crescimento pessoal costuma vir de confrontar o que e desconfortavel e sair transformado.',
  'natal:sun|house|9':
    'O Sol na Casa 9 direciona a expressao vital para a busca de sentido, a expansao de horizontes e a construcao de uma visao de mundo abrangente. Filosofia, religiao, viagens longas e educacao superior sao arenas naturais de realizacao e brilho. A identidade se forma e se fortalece atraves do contato com o que e diferente, distante ou maior que o cotidiano imediato.',
  'natal:sun|house|10':
    'O Sol na Casa 10 coloca a carreira, a reputacao e a direcao publica como eixo central da expressao vital. Ha uma orientacao natural para autoridade, reconhecimento e a construcao de um legado visivel na vida profissional e social. A realizacao pessoal tende a se traduzir em conquistas que outros podem ver e validar.',
  'natal:sun|house|11':
    'O Sol na Casa 11 orienta a identidade para o coletivo, os projetos de longo prazo e a participacao em grupos com proposito compartilhado. Ha satisfacao em ser parte de algo maior que o individual, e a amizade e a colaboracao costumam ser fontes genuinas de energia vital. O reconhecimento tende a chegar atraves de contribuicoes a ideais e causas que ultrapassam o interesse pessoal imediato.',
  'natal:sun|house|12':
    'O Sol na Casa 12 orienta a expressao vital para o recolhimento, o autoconhecimento profundo e o servico discreto. Ha uma tendencia para uma vida interior rica, sensibilidade ao que esta nas sombras e conexao com dimensoes sutis da experiencia. O brilho pessoal costuma se manifestar em espacos de retiro, espiritualidade ou dedicacao silenciosa a algo maior que o ego.',

  // ── Lua ────────────────────────────────────────────────────────────────────
  'natal:moon|house|1':
    'A Lua na Casa 1 torna as emocoes, a sensibilidade e as reacoes instintivas parte visivel da presenca pessoal. Ha uma tendencia natural para captar o estado emocional do ambiente e responder com empatia, o que atrai as pessoas mas pode gerar instabilidade de humor sem autocuidado consistente. A expressao do self e fluida, muda com o contexto e reflete as necessidades emocionais do momento.',
  'natal:moon|house|2':
    'A Lua na Casa 2 conecta a seguranca emocional diretamente a estabilidade material, tornando financas e posses temas de grande carga afetiva. Conforto, nutricao e o ato de cuidar do proprio ambiente sao fontes naturais de bem-estar interno. A relacao com dinheiro tende a ser ciclica, alternando entre acumulo e generosidade conforme o estado emocional.',
  'natal:moon|house|3':
    'A Lua na Casa 3 torna a comunicacao um canal natural de expressao emocional, com tendencia para falar, escrever e conectar-se atraves de palavras carregadas de sentimento. A mente e intuitiva e receptiva, captando nuances sutis do ambiente e das pessoas ao redor. Irmaos, vizinhanca e deslocamentos curtos tendem a ter carga emocional significativa na historia pessoal.',
  'natal:moon|house|4':
    'A Lua na Casa 4 ancora as necessidades emocionais no lar, na familia e nas raizes, sendo uma das posicoes mais fortes para a Lua no mapa natal. Ha uma vinculacao afetiva intensa com a figura materna e com o sentido de pertencimento familiar, que se torna base para o equilibrio interno. O lar e muito mais que espaco fisico — e o centro emocional da vida.',
  'natal:moon|house|5':
    'A Lua na Casa 5 traz uma emotividade criativa e expressiva, com forte necessidade de afeto, reconhecimento e envolvimento ludico com o mundo. Ha uma conexao emocional intensa com criancas, artes e relacionamentos romanticos, onde sentir e criar se entrancam. O prazer e a expressao genuina funcionam como nutricao emocional fundamental.',
  'natal:moon|house|6':
    'A Lua na Casa 6 conecta o bem-estar emocional a rotina, ao trabalho e ao ato de servir e cuidar dos detalhes. Nutricao fisica, higiene e organizacao do cotidiano tem peso emocional significativo, e o estado interno se reflete com frequencia na saude e no corpo. Quando a rotina esta em ordem, as emocoes tendem a se estabilizar.',
  'natal:moon|house|7':
    'A Lua na Casa 7 orienta as necessidades emocionais para as relacoes intimas e as parcerias, tornando o outro uma fonte central de nutricao afetiva. Ha uma sensibilidade acentuada para o que o outro sente e precisa, o que favorece empatia mas pode gerar dependencia emocional. O equilibrio entre dar e receber nos vinculos e um aprendizado continuo.',
  'natal:moon|house|8':
    'A Lua na Casa 8 mergulha as emocoes em profundidades intensas, ligando a vida emocional a transformacao, intimidade e o que esta oculto. Ha uma intuicao aguçada para o que esta por baixo da superficie, com atracao natural por psicologia, misterios e as camadas mais densas da existencia. O crescimento emocional vem de nomear e integrar o que estava escondido.',
  'natal:moon|house|9':
    'A Lua na Casa 9 conecta o mundo emocional a busca de sentido, fe e expansao de horizontes. Ha uma fome emocional por aprendizado, viagens e contato com culturas diferentes, que funciona como nutricao interior. Crencas religiosas ou filosoficas podem ter forte carga afetiva e influenciar decisoes que emergem do campo emocional.',
  'natal:moon|house|10':
    'A Lua na Casa 10 coloca a vida emocional em contato direto com a esfera publica e profissional, tornando a carreira um campo de expressao das necessidades afetivas. Ha uma sensibilidade natural para o que o publico ou o coletivo precisa, o que pode favorecer carreiras de cuidado, comunicacao ou lideranca empatica. A relacao com a figura materna costuma influenciar a construcao da trajetoria profissional.',
  'natal:moon|house|11':
    'A Lua na Casa 11 orienta o mundo emocional para grupos, amizades e causas coletivas, tornando o senso de pertencer a algo maior uma necessidade afetiva real. Ha satisfacao emocional genuina em colaborar, apoiar redes e investir em amizades com profundidade. O humor e o bem-estar interno tendem a responder ao estado das relacoes coletivas e ao clima dos grupos frequentados.',
  'natal:moon|house|12':
    'A Lua na Casa 12 internaliza as emocoes de forma profunda, criando uma vida interior rica, mas por vezes dificil de acessar ou comunicar. Ha uma sensibilidade sutil ao sofrimento dos outros, intuicao desenvolvida e conexao natural com o que esta alem do visivel. O trabalho de autoconhecimento e o contato com a propria vida emocional sao caminhos fundamentais de nutricao interna.',

  // ── Mercúrio ────────────────────────────────────────────────────────────────
  'natal:mercury|house|1':
    'Mercurio na Casa 1 faz da comunicacao uma parte central da presenca e da identidade pessoal, com a mente e a palavra funcionando como apresentacao natural ao mundo. Ha uma tendencia para processar o entorno com rapidez e articulacao, com curiosidade marcada e facilidade para se adaptar a diferentes contextos e interlocutores. O desafio e aprender a escutar com a mesma intensidade com que se fala.',
  'natal:mercury|house|2':
    'Mercurio na Casa 2 orienta a mente para questoes praticas de recursos, valor e sustento, tornando o pensamento uma ferramenta direta de construcao material. Ha uma aptidao natural para negociar, avaliar e articular propostas ligadas a financas, negocios e o que tem valor concreto na vida. Ideias funcionam como capital — quanto melhor desenvolvidas, maior sua capacidade de gerar seguranca e estabilidade.',
  'natal:mercury|house|3':
    'Mercurio na Casa 3 e uma posicao de grande conforto para o planeta da mente, favorecendo comunicacao fluente, aprendizado rapido e trocas ricas com o ambiente proximo. Ha uma curiosidade natural pelo cotidiano, pela linguagem e pelos fluxos de informacao que movem o mundo ao redor — irmaos, vizinhos e deslocamentos curtos tendem a ser fontes de estimulo constante. A versatilidade mental e um recurso valioso, embora a profundidade possa exigir esforco adicional.',
  'natal:mercury|house|4':
    'Mercurio na Casa 4 conecta a mente e a linguagem ao mundo privado, familiar e as raizes — as memorias da infancia e a historia do lar tendem a moldar os padroes de pensamento. Ha uma capacidade intuitiva de processar o passado e de usar a comunicacao como forma de nutrir ou organizar o ambiente domestico. A escrita reflexiva, a terapia ou o diario pessoal podem ser canais importantes de processamento interno.',
  'natal:mercury|house|5':
    'Mercurio na Casa 5 traz leveza, criatividade e prazer intelectual para a comunicacao, favorecendo escrita expressiva, humor e a troca de ideias como forma de diversao. Ha uma tendencia para o pensamento original, o jogo com as palavras e a capacidade de ensinar ou comunicar com uma dose natural de entretenimento. A expressao criativa atraves da linguagem — seja na escrita, no palco ou no ensino — tende a ser uma fonte genuina de satisfacao.',
  'natal:mercury|house|6':
    'Mercurio na Casa 6 direciona a mente para a analise, o detalhamento e a busca por eficiencia nos processos cotidianos. Ha uma aptidao natural para organizar informacoes, identificar falhas e aprimorar metodos de trabalho — o pensamento funciona bem quando orientado por tarefas concretas e praticas. A conexao entre mente e corpo e pronunciada, com o estado mental refletindo diretamente na saude e na disposicao fisica.',
  'natal:mercury|house|7':
    'Mercurio na Casa 7 coloca a comunicacao no centro das relacoes significativas, tornando o dialogo, a negociacao e o entendimento mutuo ferramentas essenciais nos vinculos. Ha uma tendencia para atrair parceiros intelectualmente estimulantes e para construir relacoes baseadas em trocas verbais e mentais. O desafio e usar a mente para aprofundar os vinculos em vez de apenas analisar ou racionalizar o que sente.',
  'natal:mercury|house|8':
    'Mercurio na Casa 8 desenvolve uma mente investigativa, atraida pelo que esta oculto, pelos mecanismos psicologicos e pelas camadas mais profundas da realidade. Ha um talento natural para pesquisa, reconhecimento de padroes ocultos e para lidar com informacoes sensiveis ou complexas. A comunicacao tende a ser cuidadosa e precisa — este Mercurio prefere dizer pouco e dizer bem.',
  'natal:mercury|house|9':
    'Mercurio na Casa 9 expande a mente para alem do cotidiano, com interesse genuino em filosofia, ensino, escrita de longo alcance e o contato com formas de pensar diferentes das proprias. Ha uma aptidao para comunicar conceitos amplos, articular visoes de mundo e aprender atraves de viagens, culturas e sistemas de crenca. A escrita academica, a docencia e a publicacao sao canais naturais de expressao para esse posicionamento.',
  'natal:mercury|house|10':
    'Mercurio na Casa 10 orienta as habilidades de comunicacao para a vida publica e profissional, tornando a palavra um recurso central na construcao de reputacao e autoridade. Ha uma tendencia para carreiras que envolvem escrita, fala, ensino ou gerenciamento de informacoes em posicoes de visibilidade. A credibilidade tende a se construir atraves da qualidade das ideias e da clareza com que sao comunicadas.',
  'natal:mercury|house|11':
    'Mercurio na Casa 11 conecta a mente ao coletivo, tornando a troca de ideias em grupos, redes e movimentos uma fonte natural de estimulo intelectual. Ha prazer genuino em debater, colaborar em projetos de grande alcance e comunicar ideias que beneficiem um publico amplo. A inteligencia coletiva funciona melhor do que o pensamento solitario — este Mercurio prospera no contato com mentes diversas.',
  'natal:mercury|house|12':
    'Mercurio na Casa 12 internaliza os processos mentais, criando uma vida intelectual mais intuitiva, reflexiva e menos orientada para a expressao publica. Ha uma tendencia para o pensamento simbolico, os sonhos e as conexoes que emergem do inconsciente, tornando a introspeccao um modo natural de processamento. A escrita privada, a meditacao e o trabalho com a mente em espacos de silencio tendem a ser mais produtivos do que ambientes de troca intensa.',

  // ── Venus ───────────────────────────────────────────────────────────────────
  'natal:venus|house|1':
    'Venus na Casa 1 coloca os valores esteticos e o charme no centro da expressao pessoal, tornando a aparencia, os modos e a qualidade do primeiro contato temas centrais. Ha uma tendencia natural para atrair pessoas atraves do calor e da elegancia na forma de se apresentar, com um senso refinado de gosto que e perceptivel desde o inicio. O desafio e cultivar substancia interior com a mesma atencao dedicada a imagem externa.',
  'natal:venus|house|2':
    'Venus na Casa 2 conecta os valores esteticos ao mundo material, criando uma apreciacao natural pela beleza nas posses e pelo conforto financeiro. Ha prazer em construir um ambiente agradavel e com gosto, e a autoestima tende a se vincular ao que se valoriza e cultiva. Recursos fluem com mais facilidade quando alinhados ao prazer genuino e ao refinamento pessoal.',
  'natal:venus|house|3':
    'Venus na Casa 3 traz charme e calor para a comunicacao, tornando a conversa e a troca de ideias uma arena natural de prazer e conexao. Ha um dom para expressar afeto atraves das palavras e uma apreciacao genuina por inteligencia, humor e expressao articulada. Vinculos com irmaos, vizinhos e o ambiente proximo tendem a ter dimensoes harmonicas e esteticas significativas.',
  'natal:venus|house|4':
    'Venus na Casa 4 traz apreciacao pelo lar, pelas raizes e pela familia como fontes de beleza e nutricao emocional. Ha uma tendencia para criar ambientes domesticos aconchegantes e esteticamente agradaveis, encontrando conforto genuino na vida privada e nas conexoes ancestrais. A seguranca emocional e sustentada por ambientes que se sintam harmonicos e carregados de sentido pessoal.',
  'natal:venus|house|5':
    'Venus na Casa 5 traz um amor natural pela criatividade, pelo romance e pela auto-expressao atraves das artes e do prazer. Ha um gosto genuino pelas dimensoes dramaticas e alegres da vida — na criacao artistica, nos encontros romanticos e no deleite com criancas e entretenimento. O amor tende a ser expressivo, generoso e caluroso, com a beleza funcionando como meio e mensagem.',
  'natal:venus|house|6':
    'Venus na Casa 6 traz apreciacao pelo cuidado, pelo artesanato e pela qualidade do trabalho cotidiano. Ha prazer em tarefas bem executadas, em praticas orientadas a saude e no servico realizado com atencao e elegancia. O ambiente de trabalho tende a ser importante para o bem-estar, e os vinculos formados atraves de rotinas compartilhadas costumam ter calor genuino.',
  'natal:venus|house|7':
    'Venus na Casa 7 e uma posicao classica para a harmonia relacional, colocando o amor, as parcerias e a graca social no centro da expressao pessoal. Ha um talento natural para a diplomacia, uma apreciacao genuina pelos outros e uma tendencia a prosperar atraves de conexoes intimas um a um. A parceria — romantica, profissional ou criativa — tende a ser uma fonte central de realizacao e beleza.',
  'natal:venus|house|8':
    'Venus na Casa 8 conecta o amor e os valores esteticos a profundidade, a transformacao e a intimidade. Ha uma atracao pelo intenso e pelo oculto, com relacoes tendendo a envolver profundidade psicologica genuina ou recursos compartilhados. A beleza e o prazer sao experimentados como forcas transformadoras, nao como confortos superficiais.',
  'natal:venus|house|9':
    'Venus na Casa 9 conecta o amor e a apreciacao a horizontes amplos — filosofia, viagens, culturas diversas e a busca por sentido. Ha prazer genuino em aprender, em descobrir visoes de mundo diferentes e em relacoes que expandem o senso do que e possivel. A beleza e encontrada nas ideias, nas longas jornadas e nas tradicoes de sabedoria de diversas culturas.',
  'natal:venus|house|10':
    'Venus na Casa 10 conecta a estetica, a diplomacia e os dons relacionais a vida profissional e a reputacao publica. Ha uma habilidade natural para criar relacoes de trabalho harmonicas e para construir uma carreira em torno da beleza, das artes ou do servico. O reconhecimento publico tende a chegar por qualidades de graca, gosto ou capacidade de unir pessoas.',
  'natal:venus|house|11':
    'Venus na Casa 11 orienta o amor e a apreciacao para a comunidade, projetos coletivos e ideais de longo prazo. Ha prazer genuino na amizade, em empreendimentos colaborativos e em contribuir para causas que beneficiam muitos. Os circulos sociais tendem a ser calorosos e intelectual ou esteticamente estimulantes.',
  'natal:venus|house|12':
    'Venus na Casa 12 internaliza o amor e a beleza, criando uma vida interior rica em compaixao, apreciacao espiritual e servico discreto. Ha uma sensibilidade ao sofrimento e uma tendencia a expressar afeto em privado, nos bastidores ou atraves de gestos de gentileza que passam despercebidos. As fontes mais profundas de prazer tendem a ser solitarias, misticas ou ligadas a trabalho criativo feito em recolhimento.',

  // ── Marte ───────────────────────────────────────────────────────────────────
  'natal:mars|house|1':
    'Marte na Casa 1 imprime energia, assertividade e um impulso direto para a acao na presenca pessoal, tornando o individuo reconhecivel por sua iniciativa e vitalidade. Ha uma tendencia para agir primeiro e refletir depois, com o corpo e a expressao fisica funcionando como canais primarios de afirmacao de identidade. O desafio e canalizar esse impulso de forma que inspire ao inves de intimidar.',
  'natal:mars|house|2':
    'Marte na Casa 2 canaliza energia e determinacao para a conquista de recursos materiais e a construcao de seguranca financeira propria. Ha um impulso forte para produzir, possuir e construir sobre o que aparece como oportunidade, com a produtividade funcionando como uma fonte natural de motivacao. A relacao com dinheiro e posses tende a ser ativa e direta, com preferencia por ganhar atraves do esforco proprio.',
  'natal:mars|house|3':
    'Marte na Casa 3 direciona a energia para a comunicacao, a pesquisa e a busca incessante por conhecimento. Ha um impulso marcado para investigar, questionar e chegar as conclusoes logicas das coisas — a mente funciona de forma rapida, direta e incansavel. A escrita, o debate e a comunicacao em todas as suas formas podem ser canais de expressao e realizacao.',
  'natal:mars|house|4':
    'Marte na Casa 4 impulsiona a energia para a construcao de raizes, a busca por seguranca e o estabelecimento de bases solidas. Ha uma motivacao forte relacionada ao lar e a familia — o ambiente domestico pode ser um espaco de grande atividade, seja de construcao literal ou de dinamicas familiares intensas. O sentido de seguranca interna e conquistado, nao herdado passivamente.',
  'natal:mars|house|5':
    'Marte na Casa 5 canaliza a energia para a auto-expressao fisica e criativa, com impulso marcado para se destacar em qualquer arena que permita autenticidade e presenca. Ha um gosto pela acao, pelos esportes, pelas artes e por qualquer forma de expressao que leve ao limite. O romance tende a ser apaixonado e intenso, e a criatividade funciona como uma descarga de energia vital.',
  'natal:mars|house|6':
    'Marte na Casa 6 direciona a energia para o servico, os cuidados e a atencao meticulosa aos detalhes do cotidiano. Ha uma motivacao forte para resolver problemas praticos, cuidar do que precisa de manutencao e separar o que e essencial do superfluo. A saude tende a se beneficiar de rotinas ativas, e o trabalho funciona melhor quando ha desafio concreto para superar.',
  'natal:mars|house|7':
    'Marte na Casa 7 direciona a energia para as relacoes significativas, com uma motivacao forte para conectar, negociar e alcancar a unidade atraves da interacao. Ha um impulso para se elevar acima das personalidades em conflito e encontrar o denominador comum nos vinculos. Parcerias tendem a ser dinamicas e por vezes competitivas — o outro funciona como espelho que ativa a acao.',
  'natal:mars|house|8':
    'Marte na Casa 8 imprime um impulso profundo para investigar, transformar e ir alem das aparencias em busca do essencial. Ha uma energia concentrada e determinada que nao se satisfaz com o superficial, atraindo o individuo para temas de psicologia, poder, recursos compartilhados e as camadas mais densas da existencia. Mudancas intensas sao catalisadoras de crescimento real.',
  'natal:mars|house|9':
    'Marte na Casa 9 direciona a energia para a busca da verdade, a expansao de horizontes e o aprofundamento em filosofia e temas essenciais e duradouros. Ha um impulso forte para explorar, viajar e encontrar o cerne de cada pergunta importante — a superficialidade nao prende a atencao por muito tempo. Ideais movem a acao de forma mais consistente do que incentivos imediatos.',
  'natal:mars|house|10':
    'Marte na Casa 10 imprime um impulso marcado para gerenciar, organizar e construir uma trajetoria profissional com determinacao. Ha uma orientacao natural para a lideranca pratica, a tomada de decisoes e a supervisao de processos — a carreira funciona como um campo de acao primario. O impulso para o reconhecimento profissional e consistente e pode se tornar uma forca motriz central.',
  'natal:mars|house|11':
    'Marte na Casa 11 canaliza a energia para o trabalho em grupo, as causas coletivas e a realizacao de projetos de longo alcance com impacto humanitario. Ha um espirito de comunidade genuino, com motivacao para unir esforcos com outros em direcao a objetivos compartilhados. Ideais altruistas funcionam como combustivel para a acao de forma mais duradoura do que interesses puramente pessoais.',
  'natal:mars|house|12':
    'Marte na Casa 12 direciona a energia para o interior, o servico silencioso e o sacrificio pessoal em nome de algo maior. Ha uma motivacao profunda ligada a compaixao, a psicologia e ao cuidado com o que esta nos bastidores da vida social. A expressao direta de raiva ou desejo pode ser complexa — canalizar a energia de forma estruturada e um aprendizado continuo.',

  // ── Jupiter ─────────────────────────────────────────────────────────────────
  'natal:jupiter|house|1':
    'Jupiter na Casa 1 expande a presenca, a personalidade e o impacto sobre os outros, tornando o individuo naturalmente magnetico, confiante e capaz de fascinar os que estao ao redor. Ha uma orientacao para a lideranca espontanea e para a abertura de caminhos que outros podem seguir, com a vitalidade e o otimismo como recursos visiveis. O desafio e equilibrar a expansao pessoal com a escuta e o reconhecimento do que os outros trazem.',
  'natal:jupiter|house|2':
    'Jupiter na Casa 2 expande a relacao com recursos materiais, talentos e valores pessoais, criando uma tendencia para atrair oportunidades de prosperidade ao longo do tempo. Ha uma resposta otimista ao que a vida oferece como possibilidade de crescimento, com o mundo dos negocios podendo se beneficiar dessa capacidade de reagir e construir. A generosidade com o que se possui tende a circular de volta de formas inesperadas.',
  'natal:jupiter|house|3':
    'Jupiter na Casa 3 expande a mente curiosa, a capacidade de pesquisa e as conexoes com o ambiente imediato, criando um impulso natural de investigar, questionar e levar as coisas a conclusoes significativas. Ha prazer genuino na comunicacao, no aprendizado e na troca de ideias, com a carreira podendo se desenvolver em torno dessas qualidades. Vinculos com irmaos e vizinhos tendem a ter dimensoes de crescimento ou oportunidade.',
  'natal:jupiter|house|4':
    'Jupiter na Casa 4 expande o sentido de raizes, lar e seguranca, criando uma tendencia para encontrar recursos e suporte na esfera privada e familiar. Ha uma orientacao para o crescimento atraves do que e interno — a historia familiar, as raizes culturais e o lar como espaco de abundancia. Uma vocacao que possa se desenvolver a partir do que e pessoal e privado tende a ser natural.',
  'natal:jupiter|house|5':
    'Jupiter na Casa 5 expande a criatividade, a auto-expressao e o prazer, tornando as artes, o entretenimento, os esportes e o relacionamento com criancas arenas naturais de crescimento e realizacao. Ha uma generosidade expressiva e uma capacidade de inspirar outros atraves da autenticidade e da exuberancia criativa. O romance tende a ser entusiastico e as oportunidades de destaque chegam quando a pessoa se permite expressar genuinamente.',
  'natal:jupiter|house|6':
    'Jupiter na Casa 6 expande a orientacao para o servico, o cuidado com a saude e a busca por eficiencia nos processos cotidianos. Ha uma tendencia para encontrar crescimento e realizacao em ocupacoes que envolvam cuidar dos outros, preservar e restaurar — saude, nutricao e atencao aos detalhes sao areas de possivel vocacao. O bem-estar tende a se expandir quando as rotinas diarias sao tratadas com intencionalidade.',
  'natal:jupiter|house|7':
    'Jupiter na Casa 7 expande a vida relacional, tornando as parcerias — amorosas, profissionais ou juridicas — arenas de crescimento, oportunidade e expansao de horizonte. Ha uma generosidade nas relacoes e uma tendencia para atrair parceiros que abrem caminhos ou ampliam perspectivas. O crescimento pessoal tende a ocorrer com mais intensidade atraves do encontro com o outro.',
  'natal:jupiter|house|8':
    'Jupiter na Casa 8 expande a capacidade de investigar, transformar e ir alem das aparencias para chegar ao essencial. Ha uma facilidade para lidar com o que esta oculto — recursos compartilhados, psicologia profunda, ocultismo — com uma orientacao natural para desmascarar o que e real em qualquer situacao. Negocios que envolvem recursos coletivos ou transformacao podem ser areas de crescimento natural.',
  'natal:jupiter|house|9':
    'Jupiter na Casa 9 e uma das posicoes de maior conforto para esse planeta, expandindo a devocao pela verdade, a busca de significado e o contato com o que e amplo e essencial. Ha uma orientacao natural para filosofia, religiao, ensinamento e viagens longas como arenas de realizacao. A carreira pode depender da capacidade de alcancar o cerne de cada pergunta importante e de transmitir isso aos outros.',
  'natal:jupiter|house|10':
    'Jupiter na Casa 10 expande a orientacao pratica, as habilidades de gestao e o impulso para construir uma carreira visivel e significativa. Ha uma tendencia natural para a lideranca, para colocar habilidades organizacionais a servico de objetivos maiores e para se sentir em casa nas decisoes que envolvem supervisao. O reconhecimento publico tende a chegar atraves da competencia pratica e da capacidade de inspirar.',
  'natal:jupiter|house|11':
    'Jupiter na Casa 11 expande o envolvimento com grupos, comunidades e ideais coletivos de longo alcance. Ha uma orientacao natural para o trabalho humanitario, para a construcao de redes de colaboracao e para manter a visao do que e melhor para todos como guia de acao. A realizacao tende a se ampliar quando o individuo contribui para algo maior do que o interesse pessoal.',
  'natal:jupiter|house|12':
    'Jupiter na Casa 12 expande a vida interior, a compaixao e a orientacao para o servico silencioso e o auto-sacrificio. Ha uma tendencia para encontrar crescimento em espacos de recolhimento — psicologia, conselhamento, espiritualidade e trabalho com populacoes vulneraveis. O brilho pessoal tende a se manifestar nos bastidores, onde o foco esta em aliviar o sofrimento alheio.',

  // ── Saturno ─────────────────────────────────────────────────────────────────
  'natal:saturn|house|1':
    'Saturno na Casa 1 confere seriedade, reserva e disciplina a presenca pessoal, tornando a abordagem ao mundo cuidadosa, deliberada e por vezes formalmente contida. Ha uma tendencia para nao desperdicar gestos ou palavras — o que e expresso carrega peso e intencao. A construcao da identidade e um processo lento e consistente, com a maturidade tendendo a trazer mais confianca e reconhecimento do que a juventude.',
  'natal:saturn|house|2':
    'Saturno na Casa 2 imprime frugalidade e criterio rigoroso na relacao com recursos materiais e posses. Ha uma tendencia para limitar aquisicoes ao essencial e para valorizar o que tem durabilidade — tanto em objetos quanto em pessoas. A construcao de seguranca financeira tende a ser lenta, deliberada e baseada em esforco consistente, com colheitas possiveis no longo prazo.',
  'natal:saturn|house|3':
    'Saturno na Casa 3 torna a comunicacao precisa, contida e orientada ao essencial, sem floreados ou superficialidades. Ha uma determinacao marcada quando se trata de trabalho mental e pesquisa, com uma capacidade de concentracao que pode favorecer carreiras cientificas ou academicas. O aprendizado tende a ser sistematico e profundo, mesmo que mais lento do que o de mentes mais ageis.',
  'natal:saturn|house|4':
    'Saturno na Casa 4 pode tornar as raizes e o ambiente familiar uma fonte de responsabilidade ou limitacao percebida, com o senso de seguranca sendo algo a construir, nao dado. Ha uma tendencia para necessidades simples no que diz respeito ao lar, com emocoes e sentimentos por vezes experienciados de forma mais seca ou contida. A maturidade tende a trazer uma base mais solida e a resolver o que parecia escasso na infancia.',
  'natal:saturn|house|5':
    'Saturno na Casa 5 torna a auto-expressao mais comedida, com uma tendencia para ser rigido consigo mesmo nas areas de criatividade, romance e expressao de sentimentos. Ha uma seriedade na abordagem ao prazer que pode gerar inibicao ou dificuldade de soltar. Com o tempo, a expressao criativa tende a se tornar mais consistente e duradoura exatamente por nao ser impulsiva ou efemera.',
  'natal:saturn|house|6':
    'Saturno na Casa 6 torna as capacidades criticas e analiticas severas, com uma tendencia para ser implacavel na avaliacao da qualidade — do proprio trabalho e dos outros. Ha rigor no cuidado com a saude, a alimentacao e os processos de manutencao, podendo gerar tanto disciplina salutar quanto exigencia excessiva. Trabalhar com outros pode ser mais desafiador do que trabalhar de forma independente.',
  'natal:saturn|house|7':
    'Saturno na Casa 7 torna as relacoes um campo de responsabilidade, compromisso e por vezes exigencia elevada. Ha uma tendencia para levar parcerias a serio, com pouca tolerancia a superficialidade e um desejo de construir vinculos duradouros. O desafio e equilibrar o senso de dever dentro das relacoes com abertura para a fluidez e o calor que a convivencia tambem exige.',
  'natal:saturn|house|8':
    'Saturno na Casa 8 desenvolve uma exigencia profunda em relacao ao que e essencial, central e genuino em qualquer situacao. Ha uma capacidade marcada para identificar o nucleo de uma questao e para exercer controle de qualidade em areas que envolvem profundidade, recursos compartilhados ou responsabilidade. Negocios, gestao de herancas e psicologia profunda sao areas de possivel competencia.',
  'natal:saturn|house|9':
    'Saturno na Casa 9 torna a busca por verdade, filosofia e valores religiosos uma questao de seriedade e rigor intelectual. Ha um cuidado meticuloso para separar o que e solido e duradouro do que e efemero nas ideias e crencas. Para outros, essa postura pode parecer demasiado formal ou pessimista, mas tende a gerar uma visao de mundo consistente e fundamentada.',
  'natal:saturn|house|10':
    'Saturno na Casa 10 e uma das posicoes classicas de orientacao para a carreira com disciplina, persistencia e compromisso com a propria reputacao. Ha uma orientacao marcada para a praticidade, a organizacao e a construcao deliberada de uma trajetoria profissional solida. A reputacao e tratada com seriedade — e o trabalho ao longo do tempo, mais do que o talento espontaneo, que tende a definir o legado.',
  'natal:saturn|house|11':
    'Saturno na Casa 11 orienta o esforco para a realizacao de sonhos e ideais coletivos de forma persistente e disciplinada. Ha uma seriedade no trabalho com grupos e comunidades, com pouca tendencia a objetivos superficiais ou de curto prazo. Os ideais humanitarios sao centrais, mas o caminho para realiza-los costuma exigir tempo, consistencia e tolerancia a resultados lentos.',
  'natal:saturn|house|12':
    'Saturno na Casa 12 orienta a seriedade e a responsabilidade para o mundo interno, o sacrificio pessoal e o servico silencioso aos outros. Ha um compromisso profundo com o autoconhecimento, com a psicologia e com as dimensoes misticas da existencia. O cuidado com o outro e feito de forma meticulosa e deliberada, mesmo que raramente em evidencia.',

  // ── Urano ───────────────────────────────────────────────────────────────────
  'natal:uranus|house|1':
    'Urano na Casa 1 confere excentricidade, originalidade e uma presenca que frequentemente se destaca como diferente ou imprevisivel. Ha uma tendencia para a espontaneidade, para a ruptura com convencoes e para uma abordagem da vida que rompe com o esperado de forma criativa ou provocativa. A identidade e construida de forma nao-linear, atraves de experimentacao e autonomia radical.',
  'natal:uranus|house|2':
    'Urano na Casa 2 cria formas incomuns de se relacionar com recursos materiais e de sustentar a propria vida. Ha uma tendencia para um estilo economico individualista, pouco convencional em relacao aos padroes do grupo, com oscilacoes possiveis entre periodos de abundancia e escassez. Novas formas de gerar sustento e de definir valor tendem a ser mais naturais do que seguir trilhas estabelecidas.',
  'natal:uranus|house|3':
    'Urano na Casa 3 confere originalidade e perspicacia ao processamento mental, com uma abordagem independente para resolucao de problemas que tende a chegar a conexoes inesperadas. Ha um discernimento agucado quando se trata de investigacao, estudo e comunicacao — a mente opera de forma nao-convencional e costuma surpreender. O pensamento nao-linear pode ser um recurso criativo de alto valor.',
  'natal:uranus|house|4':
    'Urano na Casa 4 cria um sentido de lar e familia que se afasta dos modelos convencionais, com uma tendencia para ambientes domesticos incomuns ou arranjos familiares que diferem do padrao. Ha uma independencia marcada no que diz respeito a seguranca pessoal, com resistencia a restricoes emocionais ou familiares. O sentimento de pertencimento tende a ser construido de forma nao-tradicional.',
  'natal:uranus|house|5':
    'Urano na Casa 5 traz originalidade e imprevisibilidade para a auto-expressao, o romance e o envolvimento criativo. Ha uma tendencia para formas nao-convencionais de recreacao, expressao artistica e relacionamento romantico, com uma necessidade de liberdade que pode complicar vinculos mais tradicionais. A criatividade tende a ser mais inventiva do que classica.',
  'natal:uranus|house|6':
    'Urano na Casa 6 traz inovacao para as praticas de auto-cuidado, saude e trabalho cotidiano, com uma tendencia para abordagens nao-convencionais que subvertem o status quo. Ha uma disposicao para enxergar novas formas de fazer uso do que existe, especialmente em contextos de saude, alimentacao e servico. Situacoes de trabalho muito hierarquicas ou rigidas tendem a ser mal toleradas.',
  'natal:uranus|house|7':
    'Urano na Casa 7 traz originalidade e impulso por liberdade para o campo das relacoes significativas. Ha uma tendencia para parcerias que fogem do padrao convencional, com resistencia a relacionamentos que limitem a autonomia individual. O ideal de vinculo tende a incluir espaco, independencia mutua e abertura para o novo — mesmo que isso torne a estabilidade mais dificil de manter.',
  'natal:uranus|house|8':
    'Urano na Casa 8 traz insight rapido e nao-convencional para as camadas mais profundas da realidade — o que e essencial em uma situacao tende a se tornar visivel de forma subita. Ha uma perspicacia particular para separar o que tem valor real do que e ilusao, especialmente em questoes de recursos compartilhados ou dinamicas ocultas de poder. A transformacao pessoal tende a ocorrer atraves de mudancas abruptas e inesperadas.',
  'natal:uranus|house|9':
    'Urano na Casa 9 cria uma abordagem nao-convencional a filosofia, a religiao e as grandes questoes de verdade e significado. Ha uma tendencia para chegar a insights originais sobre o que e realmente importante, fora das trilhas estabelecidas pelas instituicoes ou tradicoes. Essa independencia intelectual pode tornar o individuo solitario em suas crencas, mas tambem profundamente autentico.',
  'natal:uranus|house|10':
    'Urano na Casa 10 traz originalidade e nao-convencionalidade para a carreira e a reputacao publica. Ha uma perspicacia particular em questoes praticas e de organizacao, com uma tendencia para abordagens de trabalho que fogem da estrutura hierarquica tradicional. A reputacao pode incluir a de ser diferente — o que pode funcionar como diferencial em areas de inovacao.',
  'natal:uranus|house|11':
    'Urano na Casa 11 favorece amizades e grupos com um perfil nao-convencional, humanitario ou vanguardista. Ha ideias muito originais quando se trata de comunidade e de como tornar visoes coletivas em realidade. O sentido de pertencimento tende a vir de grupos que valorizam a individualidade, a diversidade e a ruptura com o que esta estabelecido.',
  'natal:uranus|house|12':
    'Urano na Casa 12 traz originalidade e nao-convencionalidade para a vida interior, a psicologia e tudo que e mistico ou espiritual. Ha uma tendencia para formas inusitadas de autoconhecimento e para ajudar os outros de maneiras que escapam das categorias estabelecidas. A vida subjetiva pode incluir insights repentinos, experiencias incomuns e uma percepcao que funciona de formas nao-lineares.',

  // ── Netuno ──────────────────────────────────────────────────────────────────
  'natal:neptune|house|1':
    'Netuno na Casa 1 torna a presenca pessoal fluida, magnetica e por vezes dificil de definir ou categorizar. Ha um charme mistico e uma capacidade de encantar os outros com uma sensibilidade quasi-mediunica, criando uma impressao que pode ser inspiradora mas tambem nebulosa. O desafio e desenvolver clareza de identidade em um self que naturalmente se dissolve nas percepcoes e projecoes dos outros.',
  'natal:neptune|house|2':
    'Netuno na Casa 2 torna a relacao com o mundo material idealizante, com uma tendencia para responder de forma elevada ao que a vida oferece, nem sempre de forma pratica. Ha idealismos marcados em relacao a financas, posses e ao modo de se sustentar, o que pode levar a decepcoes quando a realidade nao acompanha a visao. Clareza nos limites financeiros e um aprendizado importante.',
  'natal:neptune|house|3':
    'Netuno na Casa 3 torna a mente imaginativa e pouco preocupada com fatos e numeros — o territorio natural sao as ideias, a escrita mistico-poetica e a pesquisa de assuntos espirituais ou religiosos. Ha uma sensibilidade agucada para as nuances da linguagem e para o que esta nas entrelinhas da comunicacao. A intuicao e frequentemente mais confiavel do que o raciocinio exclusivamente logico.',
  'natal:neptune|house|4':
    'Netuno na Casa 4 cria um ideal de lar e familia que tende ao romantico, ao espiritual ou ao comunitario. Ha uma criatividade latente para o ambiente domestico e um sentido de unidade que permeia a vida familiar. A relacao com a origem pode envolver idealizacao ou alguma confusao — trabalhar a clareza sobre o passado familiar pode ser um processo de longa maturacao.',
  'natal:neptune|house|5':
    'Netuno na Casa 5 traz uma imaginacao criativa expansiva, um forte senso dramatico e uma habilidade para expressar ideias de sabor mistico ou transcendente. Ha prazer genuino em encantar — criancas e adultos — com historias, musica, arte e experiencias que tocam algo alem do cotidiano. O romance tende a ser idealizado, com uma busca de algo que transcenda o ordinario.',
  'natal:neptune|house|6':
    'Netuno na Casa 6 traz criatividade e idealismo para as praticas de saude, alimentacao e rotina de cuidado. Ha uma receptividade a abordagens holisticas e uma tendencia para perceber os beneficios sutis do que alimenta corpo e mente. O cuidado com os outros pode ser uma vocacao natural, desde que equilibrado para evitar auto-negligencia ou sacrificio excessivo.',
  'natal:neptune|house|7':
    'Netuno na Casa 7 torna os ideais de parceria e relacionamento elevados, com uma busca por vinculos que transcendam o ordinario. Ha uma imaginacao ativa em relacao ao que o outro representa, o que pode enriquecer ou idealizar excessivamente as relacoes. A clareza sobre quem o parceiro realmente e — e nao quem se projeta nele — e um trabalho continuo.',
  'natal:neptune|house|8':
    'Netuno na Casa 8 torna a visao do que e essencial em qualquer situacao nebulosa e ao mesmo tempo espiritualizada. Ha uma confianca e um idealismo pronunciados ao lidar com o que esta oculto, com o que e compartilhado e com as camadas mais profundas da existencia. O misticismo, a iniciacao e os processos de transformacao interior tendem a se tornar gradualmente mais nitidos ao longo do tempo.',
  'natal:neptune|house|9':
    'Netuno na Casa 9 conecta os sonhos e ideais a busca pelo que e puro, verdadeiro e transcendente. Ha um refugio emocional e intelectual na filosofia, na religiao e nas grandes questoes existenciais, com uma imaginacao quasi-mistica que fornece visoes de unidade e interconexao. O senso de que o mundo e uma grande comunidade permeia a abordagem etica e espiritual.',
  'natal:neptune|house|10':
    'Netuno na Casa 10 conecta as habilidades praticas a uma visao interior de natureza quasi-mistica, permitindo manifestar ideais e sonhos de forma organizada na vida publica. Ha uma aptidao para dar ao publico um sentido do ideal — atraves de cinema, publicidade, trabalho espiritual ou qualquer area que una o concreto e o transcendente. A carreira pode ser dificil de definir claramente, mas tende a se revelar com o tempo.',
  'natal:neptune|house|11':
    'Netuno na Casa 11 alimenta o sonho de um mundo de unidade, harmonia e entendimento coletivo. Ha uma imaginacao voltada para objetivos altruistas e uma tendencia para se envolver em trabalho comunitario ou de grupo com ideais elevados. A visao interior do que e possivel para a humanidade pode funcionar como motivacao profunda, mesmo quando a realidade pratica e mais complexa.',
  'natal:neptune|house|12':
    'Netuno na Casa 12 traz ideais muito elevados, uma visao de unidade e uma tendencia profunda para a abnegacao e a compreensao compassiva. Ha uma conexao natural com as dimensoes subjetivas, misticas e psicologicas da experiencia, com um interesse genuino pelo que esta alem do visivel. O cuidado dos outros e feito com sensibilidade fina e uma consciencia de que os sofrimentos alheios sao parte de uma teia maior.',

  // ── Plutao ──────────────────────────────────────────────────────────────────
  'natal:pluto|house|1':
    'Plutao na Casa 1 imprime intensidade, profundidade e um impulso para ir alem das aparencias na expressao pessoal e na abordagem da vida. Ha uma presenca que e percebida pelos outros antes mesmo de qualquer palavra ser dita — magnetica, concentrada e por vezes intimidante. A identidade e construida atraves de processos de transformacao profunda, com mortes simbolicas e renascimentos sendo parte da narrativa pessoal.',
  'natal:pluto|house|2':
    'Plutao na Casa 2 cria uma relacao com o mundo material marcada por transformacoes, crises e aprofundamentos que ensinam o verdadeiro valor das coisas. Ha uma habilidade para superar o superficial e identificar o que tem valor real em qualquer situacao de negocios ou posses. A trajetoria com recursos financeiros tende a incluir perdas e ganhos significativos que moldam uma sabedoria financeira profunda.',
  'natal:pluto|house|3':
    'Plutao na Casa 3 desenvolve uma mente investigativa que nao se contenta com o superficial, sempre pesquisando, questionando e indo atras de informacoes mais profundas. Ha uma paixao pelo inquerito e pela comunicacao de ideias com peso e substancia. A escrita, a pesquisa e o debate tendem a ser canais de expressao de um pensamento que naturalmente vai fundo nas coisas.',
  'natal:pluto|house|4':
    'Plutao na Casa 4 torna o lar, a historia familiar e o senso de seguranca temas de transformacao profunda e aprendizado real. Ha uma sensibilidade acentuada nessa area, com mudancas que afetam o sentido de pertencimento sendo catalisadoras de crescimento interior. Trabalhar a relacao com as raizes e com o passado familiar tende a ser um processo continuo de ressignificacao.',
  'natal:pluto|house|5':
    'Plutao na Casa 5 cria uma sensibilidade intensa na expressao criativa, no romance e na relacao com criancas. Ha periodos de criatividade intensa que permitem atravessar mudancas e crescimento interior profundo — a arte, a musica e a escrita podem funcionar como canais de transformacao. O romance tende a ser intenso, transformador e pouco superficial.',
  'natal:pluto|house|6':
    'Plutao na Casa 6 cria uma tendencia para abordagens radicais de auto-analise, saude e rotina de cuidado. Servir e cuidar de si mesmo e dos outros sao fontes primarias de crescimento interior — e tambem de crises que revelam o que precisa ser transformado. Ha uma sensibilidade a critica que, quando trabalhada, se transforma em discernimento agucado.',
  'natal:pluto|house|7':
    'Plutao na Casa 7 torna as relacoes significativas arenas de transformacao, intensidade e crescimento interior profundo. Casamento, parcerias e vinculos proximos tendem a ser intensos, nao-superficiais e capazes de revelar camadas que estavam ocultas. A mudanca e o crescimento interior chegam com mais frequencia atraves do encontro transformador com o outro do que em solitario.',
  'natal:pluto|house|8':
    'Plutao na Casa 8 cria uma atracao intensa pelo oculto, pela psicologia profunda, pela iniciacao e pelo misticismo. Ha um impulso para ir alem das aparencias em busca da essencia — do que e real em qualquer situacao, independentemente do desconforto que isso gere. Mudancas pessoais intensas e crescimento interior profundo sao habitos que se repetem ao longo de toda a vida.',
  'natal:pluto|house|9':
    'Plutao na Casa 9 cria uma paixao intensa pela busca da verdade e da essencia, com uma abordagem analitica que vai fundo nos sistemas de crenca, na filosofia e nos fundamentos do que se acredita. Ha uma dificuldade de tolerar o efemero ou o superficial em qualquer discussao de ideias ou valores. Essa profundidade pode nao ser facilmente compreendida pelos outros, mas gera insights de longo alcance.',
  'natal:pluto|house|10':
    'Plutao na Casa 10 traz um senso pratico enorme — capaz de atravessar toda a burocracia e identificar as decisoes corretas — aliado a uma capacidade de organizar e transformar o que e vulneravel na esfera publica e profissional. Ha uma tendencia para posicoes de poder transformador, onde o individuo lida com as camadas mais sensiveis das estruturas sociais ou organizacionais. O legado profissional tende a ser profundo e duradouro.',
  'natal:pluto|house|11':
    'Plutao na Casa 11 alimenta um ardente zelo pelo mundo ideal e uma necessidade de fazer parte de um grupo de almas afins orientadas para algo maior. Ha uma aprendizagem real atraves dos esforcos de colaboracao e de tornar a visao interior em realidade coletiva. Grupos e movimentos sociais podem ser tanto fontes de poder quanto arenas de conflito que revelam dinamicas ocultas.',
  'natal:pluto|house|12':
    'Plutao na Casa 12 cria uma aptidao natural para a psicologia profunda, para cavar abaixo da superficie da psique humana e compreender suas vulnerabilidades. Ha uma paixao pelo auto-sacrificio e pela doacao genuina em nome do que se acredita, com uma compreensao rara da complexidade humana. O trabalho de autoconhecimento e frequentemente a via de acesso a um poder pessoal que so se revela nas profundezas.',
}
