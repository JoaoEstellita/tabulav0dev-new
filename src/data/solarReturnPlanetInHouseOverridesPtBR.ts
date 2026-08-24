// Catálogo de interpretações do RETORNO SOLAR: planeta na casa do RS (pt-BR base).
// Chave: sr:{planet}|house|{number}
// Planetas: sun, moon, mercury, venus, mars, jupiter, saturn, uranus, neptune, pluto
// Casas: 1–12  →  10 × 12 = 120 entradas
// Tom: o "ano astrológico" que começa no aniversário solar. Onde a energia se
// concentra durante os próximos doze meses. Sem linguagem determinística.

export const SOLAR_RETURN_PLANET_IN_HOUSE_PTBR_OVERRIDES: Record<string, string> = {
  // ── Sol ────────────────────────────────────────────────────────────────────
  'sr:sun|house|1':
    'Com o Sol na Casa 1 do seu Retorno Solar, o ano tende a girar em torno de você mesmo: identidade, corpo e a forma como você se apresenta ao mundo ganham destaque. É um período fértil para iniciativas próprias, reinvenção pessoal e afirmação da vontade. A energia vital fica alta — bom momento para começar aquilo que depende sobretudo de você.',
  'sr:sun|house|2':
    'O Sol na Casa 2 do Retorno Solar concentra o ano em recursos, dinheiro e senso de valor próprio. As questões materiais — ganhos, gastos, talentos que podem ser monetizados — pedem atenção e podem crescer. É um ciclo para consolidar segurança e reconhecer o que você realmente valoriza.',
  'sr:sun|house|3':
    'Com o Sol na Casa 3 do Retorno Solar, o ano se ilumina através da comunicação, do aprendizado e das trocas cotidianas. Estudos, escrita, cursos e o contato com irmãos, vizinhos e o entorno próximo ganham peso. A mente fica ativa e curiosa — um período propício para circular ideias e ampliar o repertório.',
  'sr:sun|house|4':
    'O Sol na Casa 4 do Retorno Solar volta o ano para o lar, a família e as raízes. Mudanças de casa, questões domésticas e o cuidado com a base emocional tendem a ocupar o centro. É um ciclo mais voltado à vida privada do que ao brilho externo — um bom momento para fortalecer o próprio alicerce.',
  'sr:sun|house|5':
    'Com o Sol na Casa 5 do Retorno Solar, o ano floresce na criatividade, no romance e no prazer de se expressar. Projetos artísticos, envolvimentos afetivos, filhos e tudo o que traz alegria ganham espaço. É um período para se mostrar com autenticidade e permitir que a espontaneidade guie.',
  'sr:sun|house|6':
    'O Sol na Casa 6 do Retorno Solar dirige o ano para o trabalho, a rotina e a saúde. A qualidade do dia a dia, os hábitos e a eficiência nas tarefas pedem foco e podem render bons resultados. É um ciclo para ajustar a máquina — corpo, rotina e serviço — e colher pela consistência.',
  'sr:sun|house|7':
    'Com o Sol na Casa 7 do Retorno Solar, o ano coloca as parcerias no centro: relacionamentos, casamento, sociedades e o contato um a um. O outro funciona como espelho e como via de crescimento durante estes doze meses. É um período para pactuar, equilibrar e aprender pela relação.',
  'sr:sun|house|8':
    'O Sol na Casa 8 do Retorno Solar mergulha o ano na transformação, na intimidade e nos recursos compartilhados. Temas profundos — heranças, dívidas, sexualidade, crises que renovam — tendem a emergir. É um ciclo para atravessar o que é intenso e sair mais forte do outro lado.',
  'sr:sun|house|9':
    'Com o Sol na Casa 9 do Retorno Solar, o ano se expande em horizontes: viagens, estudos superiores, filosofia e a busca por sentido. Há um convite a sair da rotina e olhar para o que é maior, distante ou diferente. É um período fértil para crescer através de novas visões de mundo.',
  'sr:sun|house|10':
    'O Sol na Casa 10 do Retorno Solar ilumina a carreira, a reputação e a vida pública. Conquistas visíveis, reconhecimento profissional e passos importantes de direção tendem a marcar o ano. É um dos posicionamentos mais promissores para colher resultados diante dos outros.',
  'sr:sun|house|11':
    'Com o Sol na Casa 11 do Retorno Solar, o ano se abre para amizades, grupos e projetos coletivos. Redes de contato, causas e objetivos de longo prazo ganham vitalidade e podem impulsionar você adiante. É um período para pertencer, colaborar e olhar para o futuro que se deseja construir.',
  'sr:sun|house|12':
    'O Sol na Casa 12 do Retorno Solar recolhe o ano para dentro: descanso, espiritualidade, encerramentos e a vida interior. É um ciclo mais silencioso, de bastidores, que prepara o terreno para um novo começo quando o Sol subir ao Ascendante. Vale honrar o recuo, cuidar do que precisa ser finalizado e reabastecer as energias.',

  // ── Lua ────────────────────────────────────────────────────────────────────
  'sr:moon|house|1':
    'Com a Lua na Casa 1 do Retorno Solar, o ano fica emocionalmente exposto: sentimentos, humor e sensibilidade transparecem na forma como você se apresenta. Há maior necessidade de acolhimento e de que o ambiente responda ao seu estado interno. É um período para se cuidar com gentileza e deixar a intuição guiar as iniciativas.',
  'sr:moon|house|2':
    'A Lua na Casa 2 do Retorno Solar liga as emoções à segurança material ao longo do ano. A estabilidade financeira e a sensação de ter uma base sólida tendem a afetar o humor mais do que o habitual. É um ciclo para construir conforto e reconhecer o que verdadeiramente nutre o senso de valor.',
  'sr:moon|house|3':
    'Com a Lua na Casa 3 do Retorno Solar, o ano flui pela comunicação afetiva e pelas trocas do cotidiano. Conversas, aprendizados e o vínculo com irmãos e vizinhos ganham tom emocional. É um período em que a mente e o coração andam juntos — bom para expressar o que se sente em palavras.',
  'sr:moon|house|4':
    'A Lua na Casa 4 do Retorno Solar traz o ano para casa, no sentido mais profundo: lar, família e o cuidado com as raízes. A vida doméstica e o pertencimento emocional ficam no centro e pedem atenção. É um dos ciclos mais férteis para nutrir a base íntima e sentir-se protegido.',
  'sr:moon|house|5':
    'Com a Lua na Casa 5 do Retorno Solar, o ano se colore de afeto, criatividade e prazer emocional. Romances, filhos e a expressão espontânea dos sentimentos ganham espaço e alegria. É um período para se permitir sentir com liberdade e brincar com o que dá vida ao coração.',
  'sr:moon|house|6':
    'A Lua na Casa 6 do Retorno Solar conecta o bem-estar emocional à rotina e à saúde. O humor tende a acompanhar de perto os hábitos diários e a qualidade do trabalho. É um ciclo para cuidar do corpo com carinho e organizar o cotidiano de um jeito que acolha as emoções.',
  'sr:moon|house|7':
    'Com a Lua na Casa 7 do Retorno Solar, o ano busca segurança emocional nas relações um a um. Parcerias afetivas e sociedades ganham profundidade e podem tornar-se um porto de acolhimento. É um período para cultivar reciprocidade e deixar o vínculo próximo nutrir o coração.',
  'sr:moon|house|8':
    'A Lua na Casa 8 do Retorno Solar aprofunda o ano em emoções intensas, intimidade e transformação. Sentimentos que estavam guardados podem vir à tona pedindo elaboração e cura. É um ciclo para se entregar ao que é profundo e permitir que a vulnerabilidade renove os laços.',
  'sr:moon|house|9':
    'Com a Lua na Casa 9 do Retorno Solar, o ano procura sentido emocional em horizontes amplos. Viagens, estudos e novas crenças podem tocar o coração e ampliar a visão de vida. É um período para se nutrir do diferente e deixar a fé, no sentido mais largo, guiar.',
  'sr:moon|house|10':
    'A Lua na Casa 10 do Retorno Solar liga as emoções à vida pública e à carreira durante o ano. O reconhecimento e a forma como você é visto afetam de perto o bem-estar interno. É um ciclo em que cuidar da própria imagem e encontrar sentido no trabalho tende a alimentar o coração.',
  'sr:moon|house|11':
    'Com a Lua na Casa 11 do Retorno Solar, o ano encontra acolhimento nos grupos e nas amizades. A sensação de pertencer a algo maior e ser sustentado por uma rede ganha importância emocional. É um período para se aproximar de quem compartilha os mesmos sonhos e sentir-se parte.',
  'sr:moon|house|12':
    'A Lua na Casa 12 do Retorno Solar recolhe as emoções para o silêncio e a vida interior durante o ano. Há necessidade de retiro, sonho e contato com o que é sutil, longe do barulho externo. É um ciclo para cuidar da alma, soltar o que pesa e reencontrar paz no recolhimento.',

  // ── Mercúrio ─────────────────────────────────────────────────────────────────
  'sr:mercury|house|1':
    'Com Mercúrio na Casa 1 do Retorno Solar, o ano estimula a mente e a expressão pessoal. Você tende a se comunicar mais, pensar sobre si mesmo e projetar uma imagem articulada e curiosa. É um período fértil para estudar, escrever e colocar as próprias ideias em circulação.',
  'sr:mercury|house|2':
    'Mercúrio na Casa 2 do Retorno Solar volta o raciocínio para dinheiro, recursos e valores durante o ano. É um bom ciclo para planejar finanças, negociar e pensar de forma prática sobre o que sustenta você. As ideias podem virar fonte de ganho quando bem organizadas.',
  'sr:mercury|house|3':
    'Com Mercúrio na Casa 3 do Retorno Solar, a mente entra no seu elemento: o ano favorece comunicação, aprendizado e trocas ágeis. Estudos, cursos, escrita e o contato com o entorno próximo fluem com facilidade. É um período rico para articular ideias e circular informação.',
  'sr:mercury|house|4':
    'Mercúrio na Casa 4 do Retorno Solar leva o pensamento para o lar e a família durante o ano. Conversas domésticas, decisões sobre a casa e a reflexão sobre as raízes ganham peso. É um bom ciclo para estudar em casa, organizar assuntos familiares e pensar a partir da base íntima.',
  'sr:mercury|house|5':
    'Com Mercúrio na Casa 5 do Retorno Solar, a mente se torna criativa e brincalhona ao longo do ano. Ideias ganham cor, e a comunicação se mistura ao romance, aos filhos e à expressão artística. É um período para pensar com liberdade e transformar imaginação em criação.',
  'sr:mercury|house|6':
    'Mercúrio na Casa 6 do Retorno Solar aplica o raciocínio ao trabalho e à rotina durante o ano. Organização, análise de tarefas e cuidados práticos com a saúde ficam em evidência. É um ciclo produtivo para aperfeiçoar métodos e resolver os detalhes do dia a dia.',
  'sr:mercury|house|7':
    'Com Mercúrio na Casa 7 do Retorno Solar, o ano dá voz às parcerias. Diálogo, acordos e negociações tornam-se centrais nas relações um a um. É um período para conversar com clareza, alinhar expectativas e construir entendimento com o outro.',
  'sr:mercury|house|8':
    'Mercúrio na Casa 8 do Retorno Solar leva a mente ao que é profundo durante o ano: investigação, mistérios e recursos compartilhados. Assuntos como finanças conjuntas, contratos e psicologia pedem análise cuidadosa. É um ciclo para pensar com profundidade e não temer o que exige olhar por baixo da superfície.',
  'sr:mercury|house|9':
    'Com Mercúrio na Casa 9 do Retorno Solar, o pensamento se expande em busca de sentido ao longo do ano. Estudos superiores, filosofia, viagens e novas ideias alimentam a mente. É um período fértil para aprender algo grande e ampliar a forma de enxergar o mundo.',
  'sr:mercury|house|10':
    'Mercúrio na Casa 10 do Retorno Solar coloca a comunicação a serviço da carreira durante o ano. Apresentações, projetos, negociações profissionais e a construção de reputação ganham destaque. É um bom ciclo para ser visto pela clareza das suas ideias.',
  'sr:mercury|house|11':
    'Com Mercúrio na Casa 11 do Retorno Solar, o ano conecta a mente às redes e aos grupos. Trocas com amigos, colaborações e o planejamento de objetivos coletivos fluem bem. É um período para pensar o futuro em conjunto e circular ideias dentro da comunidade.',
  'sr:mercury|house|12':
    'Mercúrio na Casa 12 do Retorno Solar interioriza o pensamento durante o ano. A mente trabalha nos bastidores, entre intuição, sonhos e reflexão silenciosa. É um ciclo para escrever para si, contemplar e deixar que ideias amadureçam longe do ruído.',

  // ── Vênus ────────────────────────────────────────────────────────────────────
  'sr:venus|house|1':
    'Com Vênus na Casa 1 do Retorno Solar, o ano realça o charme, a beleza e o poder de atração pessoal. Você tende a agradar com mais facilidade e a cuidar da própria imagem com prazer. É um período favorável ao afeto, à estética e a se apresentar de forma agradável ao mundo.',
  'sr:venus|house|2':
    'Vênus na Casa 2 do Retorno Solar favorece finanças e prazeres materiais durante o ano. Há inclinação para ganhos, conforto e para valorizar o que traz bem-estar. É um bom ciclo para atrair recursos e cultivar uma relação mais gentil com o próprio valor.',
  'sr:venus|house|3':
    'Com Vênus na Casa 3 do Retorno Solar, o ano adoça a comunicação e as trocas do cotidiano. Conversas agradáveis, vínculos afetuosos com irmãos e vizinhos e um jeito charmoso de se expressar ganham espaço. É um período para encantar com palavras e cultivar harmonia no dia a dia.',
  'sr:venus|house|4':
    'Vênus na Casa 4 do Retorno Solar traz beleza e afeto para o lar durante o ano. A casa tende a se tornar mais acolhedora, e as relações familiares ganham suavidade. É um ciclo para embelezar o espaço íntimo e nutrir o amor dentro de casa.',
  'sr:venus|house|5':
    'Com Vênus na Casa 5 do Retorno Solar, o ano se abre para o romance, o prazer e a criatividade. É um dos posicionamentos mais afetuosos: paixões, arte e alegria fluem com naturalidade. Um período para amar, criar e celebrar o que faz o coração vibrar.',
  'sr:venus|house|6':
    'Vênus na Casa 6 do Retorno Solar traz harmonia para o trabalho e a rotina durante o ano. O ambiente de serviço tende a ficar mais agradável, e o cuidado com o corpo ganha prazer. É um ciclo para tornar o dia a dia mais bonito e cultivar boas relações no cotidiano.',
  'sr:venus|house|7':
    'Com Vênus na Casa 7 do Retorno Solar, o ano favorece o amor e as parcerias. Relacionamentos podem florescer, e sociedades tendem a se firmar em bases harmoniosas. É um dos períodos mais promissores para compromissos afetivos e para encontrar equilíbrio com o outro.',
  'sr:venus|house|8':
    'Vênus na Casa 8 do Retorno Solar aprofunda o afeto e a intimidade durante o ano. O prazer ganha camadas mais intensas, e vínculos podem se tornar mais profundos e transformadores. É um ciclo para se entregar com confiança e permitir que o amor toque o que é essencial.',
  'sr:venus|house|9':
    'Com Vênus na Casa 9 do Retorno Solar, o ano encontra prazer no que expande. Viagens, culturas diferentes e romances à distância podem despertar o coração. É um período para amar o que é novo e buscar beleza em horizontes mais amplos.',
  'sr:venus|house|10':
    'Vênus na Casa 10 do Retorno Solar favorece a imagem pública e as relações profissionais durante o ano. A simpatia abre portas, e o reconhecimento pode vir acompanhado de boa reputação. É um ciclo em que ser querido ajuda a avançar na carreira.',
  'sr:venus|house|11':
    'Com Vênus na Casa 11 do Retorno Solar, o ano adoça as amizades e a vida em grupo. Novas afinidades, laços afetuosos e colaborações prazerosas ganham espaço. É um período para se aproximar de quem soma e cultivar carinho dentro da rede.',
  'sr:venus|house|12':
    'Vênus na Casa 12 do Retorno Solar recolhe o afeto para a intimidade e o silêncio durante o ano. Amores discretos, compaixão e um prazer mais sutil e interior podem marcar o ciclo. É um período para amar em segredo, se reconciliar e cultivar ternura consigo mesmo.',

  // ── Marte ────────────────────────────────────────────────────────────────────
  'sr:mars|house|1':
    'Com Marte na Casa 1 do Retorno Solar, o ano chega carregado de energia e iniciativa. Há coragem para agir, afirmar a vontade e tomar a frente das situações. É um período de força pessoal — vale canalizar o ímpeto com direção para não se dispersar em impaciência.',
  'sr:mars|house|2':
    'Marte na Casa 2 do Retorno Solar mobiliza esforço em torno de recursos durante o ano. A energia se volta para conquistar, ganhar e defender o que é seu. É um ciclo para trabalhar ativamente pela segurança material, cuidando para não gastar de forma impulsiva.',
  'sr:mars|house|3':
    'Com Marte na Casa 3 do Retorno Solar, a mente e a comunicação ganham garra durante o ano. As palavras podem ficar mais afiadas, e o ritmo de aprender e circular acelera. É um período para agir com assertividade nas trocas, evitando atritos desnecessários com o entorno.',
  'sr:mars|house|4':
    'Marte na Casa 4 do Retorno Solar leva energia para o lar e a família durante o ano. Reformas, mudanças e certa tensão doméstica podem pedir ação. É um ciclo para resolver o que estava parado na base, cuidando para não deixar o calor virar conflito em casa.',
  'sr:mars|house|5':
    'Com Marte na Casa 5 do Retorno Solar, o ano se energiza no prazer, na paixão e na criação. O desejo fica intenso, e há impulso para competir, seduzir e se expressar com ousadia. É um período para colocar força nos projetos criativos e viver o romance com entusiasmo.',
  'sr:mars|house|6':
    'Marte na Casa 6 do Retorno Solar dirige a energia para o trabalho e a rotina durante o ano. Há disposição para produzir, resolver tarefas e se dedicar com afinco. É um ciclo produtivo — vale cuidar do corpo e do descanso para o esforço não virar desgaste.',
  'sr:mars|house|7':
    'Com Marte na Casa 7 do Retorno Solar, o ano energiza as parcerias, para o melhor e para o mais tenso. Relações ganham intensidade, e conflitos ou paixões podem aflorar no um a um. É um período para agir com o outro de forma direta, transformando atrito em movimento conjunto.',
  'sr:mars|house|8':
    'Marte na Casa 8 do Retorno Solar mergulha a energia no que é profundo durante o ano. Desejo, poder, recursos compartilhados e transformações intensas entram em cena. É um ciclo para enfrentar o que exige coragem e usar a força para se renovar por dentro.',
  'sr:mars|house|9':
    'Com Marte na Casa 9 do Retorno Solar, o ímpeto se lança em busca de expansão durante o ano. Viagens, estudos e a defesa de ideias mobilizam energia e entusiasmo. É um período para agir por aquilo em que se acredita e avançar sobre novos horizontes.',
  'sr:mars|house|10':
    'Marte na Casa 10 do Retorno Solar impulsiona a carreira e a ambição durante o ano. Há força para conquistar espaço, assumir a liderança e avançar profissionalmente. É um ciclo para agir com determinação diante dos outros, cuidando para não atropelar no caminho.',
  'sr:mars|house|11':
    'Com Marte na Casa 11 do Retorno Solar, a energia se volta para grupos e objetivos coletivos durante o ano. Há disposição para lutar por causas e mobilizar a rede em torno de metas. É um período para agir junto, transformando ideais em movimento com os aliados certos.',
  'sr:mars|house|12':
    'Marte na Casa 12 do Retorno Solar move a energia nos bastidores durante o ano. A ação acontece de forma mais velada, e a raiva ou o desejo podem precisar de elaboração interna. É um ciclo para agir com discrição, cuidar do que se guarda por dentro e evitar o desgaste silencioso.',

  // ── Júpiter ──────────────────────────────────────────────────────────────────
  'sr:jupiter|house|1':
    'Com Júpiter na Casa 1 do Retorno Solar, o ano tende a favorecer você de forma ampla. Há mais confiança, otimismo e abertura para crescer, com a própria presença abrindo portas. É um dos posicionamentos mais promissores para começar algo grande e expandir a vida a partir de si.',
  'sr:jupiter|house|2':
    'Júpiter na Casa 2 do Retorno Solar favorece ganhos e crescimento material durante o ano. Recursos podem se expandir, e novas oportunidades financeiras tendem a surgir. É um ciclo generoso — vale aproveitar sem perder a medida entre abundância e excesso.',
  'sr:jupiter|house|3':
    'Com Júpiter na Casa 3 do Retorno Solar, o ano expande a mente e a comunicação. Estudos, escrita e trocas de ideias ganham fôlego e alcance. É um período fértil para aprender muito, ensinar e ampliar a rede de contatos próximos.',
  'sr:jupiter|house|4':
    'Júpiter na Casa 4 do Retorno Solar traz crescimento para o lar e a família durante o ano. Mudanças para melhor, mais espaço e uma base mais próspera tendem a se apresentar. É um ciclo para fortalecer as raízes e sentir a vida íntima se expandir.',
  'sr:jupiter|house|5':
    'Com Júpiter na Casa 5 do Retorno Solar, o ano se abre à alegria, à criação e ao romance com generosidade. Projetos artísticos, prazeres e novos amores podem florescer com entusiasmo. É um período fértil para se expressar amplamente e viver o que faz bem ao coração.',
  'sr:jupiter|house|6':
    'Júpiter na Casa 6 do Retorno Solar favorece o trabalho e a saúde durante o ano. Podem surgir boas oportunidades no cotidiano profissional e melhora no bem-estar. É um ciclo para crescer através do serviço e cuidar do corpo com uma atitude mais generosa.',
  'sr:jupiter|house|7':
    'Com Júpiter na Casa 7 do Retorno Solar, o ano expande as parcerias. Relacionamentos e sociedades podem crescer, prosperar ou trazer alguém importante. É um período favorável a compromissos e a colher benefícios através do outro.',
  'sr:jupiter|house|8':
    'Júpiter na Casa 8 do Retorno Solar traz crescimento através do que é profundo durante o ano. Recursos compartilhados, heranças, investimentos e transformações podem render bons frutos. É um ciclo para prosperar ao se aprofundar e confiar no que renova.',
  'sr:jupiter|house|9':
    'Com Júpiter na Casa 9 do Retorno Solar, o planeta está em casa: o ano se expande em viagens, estudos e sentido. Horizontes se ampliam, e há sede genuína de crescer através do que é maior. É um dos períodos mais férteis para aprender, viajar e ampliar a visão de mundo.',
  'sr:jupiter|house|10':
    'Júpiter na Casa 10 do Retorno Solar favorece a carreira e o reconhecimento durante o ano. Promoções, boas oportunidades profissionais e crescimento de reputação tendem a surgir. É um dos ciclos mais promissores para avançar publicamente e colher o que se semeou.',
  'sr:jupiter|house|11':
    'Com Júpiter na Casa 11 do Retorno Solar, o ano expande amizades, grupos e projetos futuros. Novas alianças, causas e redes generosas podem impulsionar você adiante. É um período para sonhar grande em conjunto e colher através da comunidade.',
  'sr:jupiter|house|12':
    'Júpiter na Casa 12 do Retorno Solar traz crescimento interior e proteção discreta durante o ano. A expansão acontece nos bastidores, na fé, no retiro e no cuidado com a alma. É um ciclo para se fortalecer por dentro e confiar em uma generosidade que age em silêncio.',

  // ── Saturno ──────────────────────────────────────────────────────────────────
  'sr:saturn|house|1':
    'Com Saturno na Casa 1 do Retorno Solar, o ano pede maturidade e responsabilidade sobre si mesmo. Pode haver mais peso, seriedade e a sensação de precisar se reestruturar. É um ciclo para se firmar com disciplina — o esforço agora constrói uma base pessoal mais sólida.',
  'sr:saturn|house|2':
    'Saturno na Casa 2 do Retorno Solar pede rigor com as finanças durante o ano. Recursos podem exigir cautela, planejamento e certo aperto antes de estabilizar. É um ciclo para construir segurança com paciência e rever o que sustenta o próprio valor.',
  'sr:saturn|house|3':
    'Com Saturno na Casa 3 do Retorno Solar, a mente e a comunicação ganham seriedade durante o ano. O pensamento fica mais concentrado, e estudos exigem disciplina e foco. É um período para aprender com profundidade e escolher as palavras com responsabilidade.',
  'sr:saturn|house|4':
    'Saturno na Casa 4 do Retorno Solar traz responsabilidades ao lar e à família durante o ano. Questões domésticas e emocionais podem pesar e pedir estruturação. É um ciclo para fortalecer as raízes com maturidade e assumir o cuidado com a própria base.',
  'sr:saturn|house|5':
    'Com Saturno na Casa 5 do Retorno Solar, o ano pede seriedade na criação e no afeto. Prazeres podem parecer mais contidos, e romances tendem a exigir compromisso e realismo. É um período para criar com disciplina e amadurecer a forma de se expressar e amar.',
  'sr:saturn|house|6':
    'Saturno na Casa 6 do Retorno Solar concentra o ano no trabalho e na saúde com rigor. A rotina pede disciplina, e o corpo pode cobrar cuidados mais consistentes. É um ciclo para estruturar hábitos sólidos e colher pela responsabilidade no dia a dia.',
  'sr:saturn|house|7':
    'Com Saturno na Casa 7 do Retorno Solar, o ano amadurece as parcerias. Relações são testadas quanto ao compromisso, e o que é sólido tende a se firmar. É um período para assumir responsabilidade no um a um e construir vínculos com bases realistas.',
  'sr:saturn|house|8':
    'Saturno na Casa 8 do Retorno Solar traz seriedade ao que é profundo durante o ano. Finanças compartilhadas, dívidas e processos de transformação pedem estrutura e paciência. É um ciclo para lidar com o intenso de forma madura e reconstruir sobre bases mais firmes.',
  'sr:saturn|house|9':
    'Com Saturno na Casa 9 do Retorno Solar, o ano amadurece as crenças e a visão de mundo. Estudos exigem comprometimento, e a fé passa por revisão e realismo. É um período para construir sentido com solidez e avançar com passos bem fundamentados.',
  'sr:saturn|house|10':
    'Saturno na Casa 10 do Retorno Solar coloca a carreira sob prova durante o ano. Há cobrança de responsabilidade e a chance de consolidar autoridade através do esforço. É um ciclo decisivo — o trabalho sério agora pode firmar uma posição duradoura.',
  'sr:saturn|house|11':
    'Com Saturno na Casa 11 do Retorno Solar, o ano amadurece as amizades e os projetos coletivos. Grupos podem ser filtrados, e objetivos de longo prazo pedem realismo. É um período para investir em laços sólidos e construir o futuro com paciência.',
  'sr:saturn|house|12':
    'Saturno na Casa 12 do Retorno Solar interioriza a responsabilidade durante o ano. Medos, limites e questões antigas podem pedir elaboração no silêncio. É um ciclo para encerrar com maturidade o que precisa terminar e se fortalecer por dentro antes de recomeçar.',

  // ── Urano ────────────────────────────────────────────────────────────────────
  'sr:uranus|house|1':
    'Com Urano na Casa 1 do Retorno Solar, o ano traz mudança e originalidade para a própria identidade. Há impulso de romper padrões, se reinventar e afirmar a liberdade de ser quem se é. É um período de novidade pessoal — vale acolher o inesperado sem se perder na inquietação.',
  'sr:uranus|house|2':
    'Urano na Casa 2 do Retorno Solar agita as finanças e os valores durante o ano. Recursos podem oscilar, e surgem formas novas ou inusitadas de ganhar. É um ciclo para se libertar de velhas amarras materiais e experimentar caminhos diferentes de sustento.',
  'sr:uranus|house|3':
    'Com Urano na Casa 3 do Retorno Solar, a mente busca liberdade e originalidade durante o ano. Ideias inovadoras, aprendizados súbitos e trocas fora do comum ganham espaço. É um período para pensar diferente e comunicar com uma faísca de independência.',
  'sr:uranus|house|4':
    'Urano na Casa 4 do Retorno Solar traz reviravoltas ao lar e à família durante o ano. Mudanças de casa, rupturas com o passado ou uma nova forma de viver as raízes podem surgir. É um ciclo para se libertar de padrões antigos e reinventar a própria base.',
  'sr:uranus|house|5':
    'Com Urano na Casa 5 do Retorno Solar, o ano eletriza a criatividade e os afetos. Paixões inesperadas, expressões originais e um desejo de liberdade no prazer aparecem. É um período para criar sem amarras e viver o romance de forma autêntica e surpreendente.',
  'sr:uranus|house|6':
    'Urano na Casa 6 do Retorno Solar altera a rotina e o trabalho durante o ano. Mudanças no cotidiano, novos métodos e certa instabilidade nos hábitos podem se apresentar. É um ciclo para inovar no dia a dia e encontrar formas mais livres de organizar a vida prática.',
  'sr:uranus|house|7':
    'Com Urano na Casa 7 do Retorno Solar, as parcerias passam por mudança durante o ano. Relações podem se transformar de repente, pedindo mais espaço e liberdade. É um período para renovar os vínculos e aceitar que o outro também busca autenticidade.',
  'sr:uranus|house|8':
    'Urano na Casa 8 do Retorno Solar traz reviravoltas ao que é profundo durante o ano. Finanças compartilhadas, intimidade e transformações podem tomar rumos inesperados. É um ciclo para se libertar do que aprisiona por dentro e renovar de forma radical.',
  'sr:uranus|house|9':
    'Com Urano na Casa 9 do Retorno Solar, o ano desperta novas visões de mundo. Ideias revolucionárias, viagens súbitas e mudanças de crença podem sacudir a mente. É um período para se abrir ao inesperado e ampliar horizontes de forma original.',
  'sr:uranus|house|10':
    'Urano na Casa 10 do Retorno Solar movimenta a carreira durante o ano. Mudanças profissionais, guinadas de rumo ou caminhos inovadores tendem a surgir. É um ciclo para inovar publicamente e ter coragem de seguir uma direção mais autêntica.',
  'sr:uranus|house|11':
    'Com Urano na Casa 11 do Retorno Solar, o planeta está à vontade: o ano renova amizades, grupos e projetos futuros. Novas redes, causas inovadoras e ideias coletivas ganham força. É um período fértil para se conectar com o diferente e reinventar os próprios sonhos.',
  'sr:uranus|house|12':
    'Urano na Casa 12 do Retorno Solar traz despertares sutis nos bastidores durante o ano. Insights repentinos, libertações internas e rupturas silenciosas podem ocorrer. É um ciclo para se soltar de amarras invisíveis e permitir que o novo nasça de dentro.',

  // ── Netuno ───────────────────────────────────────────────────────────────────
  'sr:neptune|house|1':
    'Com Netuno na Casa 1 do Retorno Solar, o ano suaviza e nebuliza a própria imagem. Há maior sensibilidade, inspiração e certa dificuldade em enxergar-se com nitidez. É um período para se conectar à intuição e cuidar dos limites pessoais em meio à entrega.',
  'sr:neptune|house|2':
    'Netuno na Casa 2 do Retorno Solar dissolve certezas materiais durante o ano. As finanças podem ficar confusas ou pedir mais fé do que controle. É um ciclo para alinhar dinheiro e valores a algo maior, com atenção redobrada para não se iludir.',
  'sr:neptune|house|3':
    'Com Netuno na Casa 3 do Retorno Solar, a mente se torna sonhadora e intuitiva durante o ano. A comunicação ganha poesia, mas pode faltar clareza nos detalhes. É um período para criar com imaginação e conferir com cuidado o que precisa ser objetivo.',
  'sr:neptune|house|4':
    'Netuno na Casa 4 do Retorno Solar suaviza e envolve o lar durante o ano. A vida doméstica pode ficar mais sensível, nebulosa ou espiritualizada. É um ciclo para cuidar da alma da casa e trazer luz ao que está difuso nas raízes.',
  'sr:neptune|house|5':
    'Com Netuno na Casa 5 do Retorno Solar, o ano inspira a criatividade e o romance. A arte flui, e o amor pode ganhar um tom idealizado e encantado. É um período para criar do coração, tomando cuidado com ilusões afetivas.',
  'sr:neptune|house|6':
    'Netuno na Casa 6 do Retorno Solar difunde a rotina e a saúde durante o ano. O cotidiano pode parecer confuso, e o corpo pede escuta sutil e cuidados suaves. É um ciclo para trazer sentido ao trabalho e não negligenciar sinais físicos discretos.',
  'sr:neptune|house|7':
    'Com Netuno na Casa 7 do Retorno Solar, as parcerias ganham idealização durante o ano. Relações podem inspirar profundamente ou trazer névoa e desilusão. É um período para amar com compaixão, mantendo os pés no chão diante do outro.',
  'sr:neptune|house|8':
    'Netuno na Casa 8 do Retorno Solar aprofunda o místico e o compartilhado durante o ano. Intimidade, finanças conjuntas e temas profundos ganham camada espiritual e nebulosa. É um ciclo para se entregar com sensibilidade e atenção ao que é sutil e não dito.',
  'sr:neptune|house|9':
    'Com Netuno na Casa 9 do Retorno Solar, o ano busca sentido no místico e no transcendente. Fé, espiritualidade e viagens interiores tocam a alma. É um período para se inspirar em algo maior, verificando o que é visão genuína e o que é fuga.',
  'sr:neptune|house|10':
    'Netuno na Casa 10 do Retorno Solar envolve a carreira em névoa e inspiração durante o ano. O rumo profissional pode ficar difuso ou ganhar um chamado mais espiritual. É um ciclo para seguir uma vocação sentida, com cuidado para não perder a direção prática.',
  'sr:neptune|house|11':
    'Com Netuno na Casa 11 do Retorno Solar, o ano idealiza amizades e sonhos coletivos. Grupos podem inspirar ou confundir, e as causas ganham tom compassivo. É um período para sonhar junto com generosidade, discernindo quem realmente soma.',
  'sr:neptune|house|12':
    'Netuno na Casa 12 do Retorno Solar aprofunda a vida espiritual e interior durante o ano. Sonhos, contemplação e uma sensibilidade sutil marcam o ciclo nos bastidores. É um período rico para meditar, se recolher e nutrir a conexão com o invisível.',

  // ── Plutão ───────────────────────────────────────────────────────────────────
  'sr:pluto|house|1':
    'Com Plutão na Casa 1 do Retorno Solar, o ano traz transformação profunda da própria identidade. Há um impulso de morrer e renascer, deixando para trás versões antigas de si. É um período intenso de empoderamento pessoal — vale usar essa força para se reconstruir com verdade.',
  'sr:pluto|house|2':
    'Plutão na Casa 2 do Retorno Solar transforma as finanças e os valores durante o ano. Recursos podem passar por reviravoltas profundas, revelando o que realmente sustenta. É um ciclo para se reinventar materialmente e recuperar poder sobre o próprio valor.',
  'sr:pluto|house|3':
    'Com Plutão na Casa 3 do Retorno Solar, a mente se aprofunda e se transforma durante o ano. Pensamentos ganham intensidade, e a comunicação pode se tornar investigativa e poderosa. É um período para mergulhar no que importa e usar as palavras com força consciente.',
  'sr:pluto|house|4':
    'Plutão na Casa 4 do Retorno Solar remexe as raízes durante o ano. Questões familiares profundas, o passado e a base emocional pedem transformação. É um ciclo para curar o que está na origem e reconstruir o próprio alicerce a partir da verdade.',
  'sr:pluto|house|5':
    'Com Plutão na Casa 5 do Retorno Solar, o ano intensifica a paixão e a criação. Desejos profundos, romances transformadores e uma expressão mais poderosa emergem. É um período para criar com intensidade e permitir que o afeto revele camadas ocultas.',
  'sr:pluto|house|6':
    'Plutão na Casa 6 do Retorno Solar transforma o trabalho e a saúde durante o ano. A rotina pode passar por reestruturação profunda, e o corpo pede escuta atenta. É um ciclo para renovar hábitos pela raiz e recuperar poder sobre o próprio cotidiano.',
  'sr:pluto|house|7':
    'Com Plutão na Casa 7 do Retorno Solar, as parcerias passam por transformação intensa durante o ano. Relações podem se aprofundar, revelar poder e controle, ou terminar para renascer. É um período para viver o um a um com verdade e deixar o vínculo transformar você.',
  'sr:pluto|house|8':
    'Plutão na Casa 8 do Retorno Solar está em seu terreno: o ano mergulha na transformação profunda. Intimidade, recursos compartilhados e crises regeneradoras ocupam o centro. É um ciclo intenso de morte e renascimento — atravessá-lo com coragem devolve poder e profundidade.',
  'sr:pluto|house|9':
    'Com Plutão na Casa 9 do Retorno Solar, o ano transforma crenças e visão de mundo. Verdades antigas podem ruir para dar lugar a um sentido mais profundo. É um período para reconstruir a própria filosofia de vida a partir do que é essencial.',
  'sr:pluto|house|10':
    'Plutão na Casa 10 do Retorno Solar transforma a carreira e a posição pública durante o ano. Pode haver reviravoltas profundas de rumo, poder e reputação. É um ciclo para se reinventar profissionalmente e assumir uma autoridade construída com verdade.',
  'sr:pluto|house|11':
    'Com Plutão na Casa 11 do Retorno Solar, o ano transforma amizades e projetos coletivos. Grupos podem passar por crises regeneradoras, e vínculos revelam sua real profundidade. É um período para se aliar ao que tem verdade e reinventar os próprios sonhos de futuro.',
  'sr:pluto|house|12':
    'Plutão na Casa 12 do Retorno Solar transforma o mundo interno durante o ano. Conteúdos profundos do inconsciente vêm à tona pedindo cura nos bastidores. É um ciclo para encarar sombras com coragem e renascer por dentro antes de um novo começo.',
}
