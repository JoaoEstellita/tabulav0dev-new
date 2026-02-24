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
}
