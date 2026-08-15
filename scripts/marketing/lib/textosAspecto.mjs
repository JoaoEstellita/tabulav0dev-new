/**
 * Aspecto natal, escrito aqui, na voz da campanha.
 *
 * ── O TERCEIRO CAMINHO ─────────────────────────────────────────────────────
 *
 * `textosPosicao.mjs` cobriu planeta em signo. Faltava este, que é o mesmo
 * defeito com outro nome: `pecaDoAssunto.mjs` resolve `aspecto` e
 * `aspecto_natal` puxando do catálogo natal do app, e a primeira peça que gerei
 * para testar caiu justamente aqui. Saiu "Há uma fluência natural entre
 * sentimentos e palavras, tornando a comunicação afetiva e inteligível ao mesmo
 * tempo" — texto do produto, correto e fora de lugar numa peça.
 *
 * ── POR QUE 36 ─────────────────────────────────────────────────────────────
 *
 * Rodei a efeméride em 120 dias e contei os aspectos que FECHAM EXATO com ao
 * menos um corpo pessoal no par. Deram 36. Os 225 do catálogo do app cobrem
 * todas as combinações possíveis num mapa; a peça só precisa das que o céu
 * entrega neste ano.
 *
 * Fora dessas, `textoDoAspecto` devolve `null` e o catálogo do app atende, com
 * aviso no console.
 *
 * ── A CHAVE ────────────────────────────────────────────────────────────────
 *
 * A mesma de `chaveAspectoNatal`: `natal:{p1}|{aspecto}|{p2}`, com os corpos na
 * ordem tradicional (Sol, Lua, Mercúrio, Vênus, Marte, Júpiter, Saturno, Urano,
 * Netuno, Plutão), não na alfabética. Procurar na ordem errada devolve
 * `undefined` sem erro nenhum, e a peça sairia sem texto.
 *
 * ── A RÉGUA ────────────────────────────────────────────────────────────────
 *
 * A de `linguagem.spec.mjs`, que roda sobre estes textos. E uma a mais, que
 * vale só aqui: os nomes dos ângulos não aparecem. "Sextil", "trígono" e
 * "quadratura" já eram jargão barrado, e num texto sobre aspectos a tentação de
 * usá-los é máxima. O que o ângulo faz se diz em português.
 *
 * Descrevem quem NASCEU com a configuração, não o que hoje reserva.
 */

export const ASPECTO_NATAL = {
  // ── Sol ──────────────────────────────────────────────────────────────────
  'natal:sun|trigono|moon':
    'Vontade e sentimento puxam para o mesmo lado. Quem nasce assim raramente ' +
    'briga consigo mesmo na hora de decidir, e isso economiza uma energia que ' +
    'os outros gastam sem perceber. Há paz interna de fábrica. O risco é ' +
    'confundir a própria facilidade com regra para todo mundo.',

  'natal:sun|quadratura|moon':
    'O que se quer ser e o que se precisa sentir não combinam. Quem nasce assim ' +
    'cresce dividido entre duas exigências legítimas, quase sempre herdadas de ' +
    'dois adultos diferentes. A tensão não se resolve escolhendo um lado. Ela ' +
    'vira força quando os dois passam a caber no mesmo dia.',

  'natal:sun|sextil|mars':
    'A coragem chega quando é chamada. Quem nasce assim age sem precisar de ' +
    'discurso interno, e o corpo acompanha a decisão. Há competitividade ' +
    'saudável, do tipo que melhora quem está por perto. O ponto cego é achar ' +
    'que todo mundo consegue começar com a mesma facilidade.',

  'natal:sun|quadratura|mars':
    'A vontade vem com atrito embutido. Quem nasce assim age antes de calcular ' +
    'e depois briga com o resultado. Há coragem de sobra e paciência de menos. ' +
    'A raiva chega rápido e passa rápido, o que confunde quem levou a sério. ' +
    'Com os anos, vira capacidade de sustentar conflito sem desabar.',

  'natal:sun|sextil|jupiter':
    'Alguma coisa costuma dar certo, e não é sorte no sentido preguiçoso. Quem ' +
    'nasce assim confia antes de ter provas, e essa confiança abre porta. Há ' +
    'generosidade fácil. O que falta é freio, porque o otimismo raramente avisa ' +
    'quando passou do ponto.',

  'natal:sun|quadratura|jupiter':
    'O tamanho da ambição não bate com o tamanho do dia. Quem nasce assim ' +
    'promete grande, começa grande e descobre no meio que a conta era outra. ' +
    'Há fé genuína e excesso na mesma medida. O aprendizado é dimensionar sem ' +
    'perder a vontade de tentar coisa grande.',

  'natal:sun|trigono|saturn':
    'A responsabilidade não pesa, sustenta. Quem nasce assim constrói devagar e ' +
    'não perde o que construiu. Há seriedade natural, reconhecida cedo por ' +
    'quem manda. O custo é quase invisível: sobra pouco espaço para fazer ' +
    'alguma coisa só porque dá vontade.',

  'natal:sun|quadratura|uranus':
    'Não dá para seguir o roteiro. Quem nasce assim tropeça em autoridade sem ' +
    'querer, e o mesmo impulso que rompe um lugar ruim rompe um lugar bom. A ' +
    'liberdade aqui não é escolha, é necessidade. A vida adulta é achar onde ' +
    'ser diferente rende, em vez de custar.',

  'natal:sun|trigono|uranus':
    'A originalidade não custa briga. Quem nasce assim faz diferente e é aceito ' +
    'fazendo diferente, o que é raro. Há facilidade com o que ainda não tem ' +
    'nome. O risco é largar o que já funciona só porque parou de ser novidade.',

  'natal:sun|trigono|neptune':
    'A sensibilidade vem sem cobrança. Quem nasce assim capta o clima de um ' +
    'ambiente antes de alguém falar, e isso aparece em como cuida das pessoas. ' +
    'Há talento para imagem, som ou qualquer coisa que se sinta antes de ' +
    'entender. O ponto fraco é o contorno: dizer não custa.',

  'natal:sun|trigono|pluto':
    'Há força que não precisa aparecer. Quem nasce assim atravessa perda sem ' +
    'perder o rumo, e volta diferente todas as vezes. A intensidade é ' +
    'administrada, não contida. O que os outros chamam de sorte costuma ser ' +
    'insistência em lugar profundo.',

  'natal:sun|quadratura|pluto':
    'O poder é assunto desde cedo, e quase nunca por escolha. Quem nasce assim ' +
    'esbarra em gente que quer controlar, e aprende a resistir antes de ' +
    'aprender a confiar. As reviravoltas são grandes e reais. O que sobra ' +
    'delas é uma pessoa difícil de intimidar.',

  'natal:sun|sextil|pluto':
    'A transformação chega sem catástrofe. Quem nasce assim percebe o que está ' +
    'apodrecendo antes de estourar e mexe a tempo. Há capacidade de recomeçar ' +
    'que os outros acham sobre-humana. Só não é: é o hábito de olhar para o que ' +
    'incomoda em vez de desviar.',

  // ── Lua ──────────────────────────────────────────────────────────────────
  'natal:moon|trigono|mercury':
    'O que se sente encontra palavra. Quem nasce assim explica emoção sem ' +
    'dramatizar, e é isso que faz os outros procurarem para conversar. Há ' +
    'talento real para ensinar e para contar história. O cuidado é falar do ' +
    'sentimento em vez de vivê-lo.',

  'natal:moon|trigono|mars':
    'A emoção vira ação sem escala. Quem nasce assim reage rápido e reage ' +
    'certo, o que parece instinto e é coordenação. Há coragem afetiva: dizer o ' +
    'que sente não trava. O excesso é confundir pressa com urgência.',

  // ── Mercúrio ─────────────────────────────────────────────────────────────
  'natal:mercury|sextil|venus':
    'A palavra sai bonita sem esforço. Quem nasce assim negocia sem ferir e ' +
    'escreve melhor do que imagina. Há gosto por conversa que não precisa ' +
    'chegar a lugar nenhum. O que falta às vezes é aspereza, porque nem toda ' +
    'verdade cabe em frase elegante.',

  'natal:mercury|sextil|mars':
    'O raciocínio é rápido e vai direto. Quem nasce assim resolve discussão ' +
    'enquanto os outros ainda organizam o argumento. Há prazer em debater. O ' +
    'ponto cego é o tom, porque a frase certa dita com pressa chega como ' +
    'ataque.',

  'natal:mercury|quadratura|mars':
    'A cabeça e a vontade discutem em voz alta. Quem nasce assim fala antes de ' +
    'medir e passa a vida corrigindo o que disse com razão e sem jeito. Há ' +
    'inteligência afiada de verdade. Domar o tempo entre pensar e falar é o ' +
    'trabalho de uma vida inteira.',

  'natal:mercury|sextil|jupiter':
    'A cabeça amplia o que toca. Quem nasce assim aprende rápido e ensina ' +
    'melhor ainda, porque enxerga o desenho antes do detalhe. Há apetite ' +
    'genuíno por assunto novo. O deslize é a generalização confortável, que ' +
    'soa bem e não sustenta exame.',

  'natal:mercury|quadratura|jupiter':
    'A ideia sempre parece maior do que é. Quem nasce assim promete no meio da ' +
    'frase e descobre depois o tamanho do que prometeu. Há entusiasmo ' +
    'contagiante e pouca paciência com letra miúda. O ajuste é checar antes de ' +
    'anunciar.',

  'natal:mercury|trigono|saturn':
    'O pensamento tem estrutura. Quem nasce assim organiza o que os outros ' +
    'deixam solto e não se perde em texto longo. Há memória boa para o que ' +
    'importa. O peso é a autocrítica: a frase fica pronta e a pessoa continua ' +
    'achando que não está.',

  'natal:mercury|quadratura|uranus':
    'A cabeça anda mais rápido que a conversa. Quem nasce assim interrompe, ' +
    'muda de assunto e chega à conclusão por um caminho que ninguém acompanha. ' +
    'Há originalidade real. O custo é a impaciência com quem precisa do passo ' +
    'a passo.',

  'natal:mercury|trigono|uranus':
    'A intuição chega antes do raciocínio e costuma estar certa. Quem nasce ' +
    'assim resolve por atalho e sabe explicar o atalho depois. Há facilidade ' +
    'com tecnologia e com o que ainda está sendo inventado. O tédio é o ' +
    'inimigo, não a dificuldade.',

  'natal:mercury|trigono|neptune':
    'O pensamento anda por imagem. Quem nasce assim entende pelo clima, não ' +
    'pela lista, e traduz isso em palavra que fica. Há talento para ficção, ' +
    'música e para qualquer coisa que precise sugerir em vez de afirmar. O ' +
    'ponto fraco é o detalhe prático.',

  'natal:mercury|quadratura|pluto':
    'A cabeça vai fundo e não solta. Quem nasce assim desconfia da primeira ' +
    'versão e escava até achar o que estava embaixo. Há inteligência ' +
    'investigativa de verdade. O excesso é transformar conversa em ' +
    'interrogatório sem perceber.',

  'natal:mercury|trigono|pluto':
    'A percepção do que não foi dito é natural. Quem nasce assim lê a sala e ' +
    'raramente se engana sobre intenção. Há capacidade de pesquisa que rende ' +
    'em qualquer área. O cuidado é lembrar que nem todo silêncio esconde ' +
    'alguma coisa.',

  'natal:mercury|sextil|pluto':
    'A pergunta certa aparece sozinha. Quem nasce assim descobre muito ' +
    'perguntando pouco, e as pessoas contam o que não pretendiam. Há poder ' +
    'real nisso. Usá-lo bem é a diferença entre confiança e desconforto.',

  // ── Vênus ────────────────────────────────────────────────────────────────
  'natal:venus|sextil|mars':
    'Querer e agradar andam juntos. Quem nasce assim aproxima sem forçar e ' +
    'tem calor que os outros sentem de longe. Há apetite pela vida, no ' +
    'sentido largo. O risco é achar que tudo se resolve com charme.',

  'natal:venus|quadratura|mars':
    'Desejo e afeto puxam em direções diferentes. Quem nasce assim quer ' +
    'intensamente e depois quer distância, no mesmo vínculo. Há atração forte ' +
    'e atrito na mesma proporção. A maturidade é parar de escolher entre paz e ' +
    'tesão, e construir os dois no mesmo lugar.',

  'natal:venus|sextil|jupiter':
    'Gostar das coisas é fácil. Quem nasce assim tem generosidade que volta, e ' +
    'é bem recebido em lugar onde não conhece ninguém. Há gosto por conforto e ' +
    'por gente. O excesso é o mesmo movimento sem limite, no prato e na conta.',

  'natal:venus|quadratura|pluto':
    'Amar mexe com o fundo. Quem nasce assim não tem relação morna, e ' +
    'descobre cedo que perder alguém reorganiza a vida inteira. Há devoção ' +
    'real e ciúme na mesma raiz. O trabalho é distinguir o que é entrega do ' +
    'que é controle disfarçado.',

  // ── Marte ────────────────────────────────────────────────────────────────
  'natal:mars|quadratura|saturn':
    'O impulso encontra parede. Quem nasce assim quer avançar e trava, e a ' +
    'trava costuma ser interna antes de ser do mundo. Há frustração acumulada ' +
    'na juventude. Do outro lado dela nasce uma resistência que quase ninguém ' +
    'tem, porque foi construída contra o próprio freio.',

  'natal:mars|trigono|saturn':
    'A força tem direção. Quem nasce assim trabalha duro sem se machucar e ' +
    'termina o que começa, o que é mais raro do que parece. Há disciplina que ' +
    'não precisa ser cobrada. O que falta é espontaneidade, porque quase tudo ' +
    'passa pelo plano antes.',

  'natal:mars|sextil|uranus':
    'A reação é rápida e original. Quem nasce assim improvisa bem sob pressão ' +
    'e acha saída onde os outros veem parede. Há gosto por risco calculado. O ' +
    'ponto cego é a rotina, que sufoca sem que a pessoa saiba nomear.',

  'natal:mars|quadratura|uranus':
    'A vontade explode sem aviso. Quem nasce assim rompe de uma vez o que ' +
    'vinha incomodando devagar, e o rompimento surpreende até quem o fez. Há ' +
    'coragem física de verdade. O aprendizado é dar nome ao incômodo antes de ' +
    'ele virar decisão irreversível.',

  'natal:mars|quadratura|neptune':
    'A vontade perde o contorno. Quem nasce assim quer sem saber exatamente o ' +
    'quê, e a energia escoa por caminho que não escolheu. Há sensibilidade ' +
    'grande e dificuldade em brigar por si. Achar uma causa concreta é o que ' +
    'organiza tudo o mais.',

  'natal:mars|trigono|neptune':
    'A ação segue a intuição e acerta. Quem nasce assim age pelo que sente e ' +
    'raramente precisa justificar depois. Há talento para esporte, dança ou ' +
    'qualquer coisa em que o corpo pensa sozinho. O risco é adiar o confronto ' +
    'necessário em nome da paz.',

  // ── o resto do Sol ───────────────────────────────────────────────────────
  'natal:sun|conjuncao|mercury':
    'A identidade e a fala são a mesma coisa. Quem nasce assim pensa alto e se ' +
    'reconhece no que diz, então discordar do argumento parece discordar da ' +
    'pessoa. Há agilidade mental constante. O que falta é distância: ouvir a ' +
    'própria ideia como se fosse de outro.',

  'natal:sun|conjuncao|venus':
    'Agradar não é estratégia, é temperamento. Quem nasce assim tem charme que ' +
    'chega antes da apresentação, e um senso estético que aparece em coisa ' +
    'pequena. Há vaidade, e ela é funcional. O ponto cego é evitar o atrito ' +
    'que a situação estava pedindo.',

  'natal:sun|trigono|mars':
    'A vontade encontra o corpo sem atrito. Quem nasce assim decide e executa ' +
    'no mesmo movimento, e cansa menos que os outros fazendo o mesmo. Há ' +
    'liderança natural, do tipo que não precisa levantar a voz. O risco é ' +
    'impaciência com quem precisa pensar antes.',

  'natal:sun|oposicao|mars':
    'A vontade aparece pelo confronto. Quem nasce assim descobre o que quer ' +
    'quando alguém se opõe, e por isso atrai oposição sem procurar. Há ' +
    'coragem verdadeira. O trabalho de uma vida é aprender a querer sem ' +
    'precisar de um adversário para saber.',

  'natal:sun|trigono|jupiter':
    'A vida abre porta com frequência maior que a média. Quem nasce assim ' +
    'aposta em si e a aposta costuma pagar, o que constrói uma confiança ' +
    'difícil de abalar. Há generosidade de sobra. O que não se desenvolve ' +
    'sozinho é a disciplina, porque nunca foi obrigatória.',

  'natal:sun|oposicao|jupiter':
    'O tamanho de tudo vem do outro lado. Quem nasce assim exagera para fora, ' +
    'em promessa, em gasto, em expectativa, e é generoso pelo mesmo motivo. Há ' +
    'fé em gente. A conta chega quando o entusiasmo assinou algo que a agenda ' +
    'não sustenta.',

  'natal:sun|conjuncao|saturn':
    'A responsabilidade chegou cedo demais. Quem nasce assim foi adulto antes ' +
    'da hora, por escolha de outra pessoa, e leva isso no corpo. Há solidez ' +
    'que os outros procuram em momento difícil. O que custa é permitir-se ' +
    'errar sem transformar em julgamento.',

  'natal:sun|oposicao|saturn':
    'A limitação vem sempre de fora. Quem nasce assim encontra autoridade ' +
    'exigente onde quer que vá, e demora a perceber que reproduz a cobrança ' +
    'por dentro. Há capacidade de sustentar peso que ninguém sustenta. O ' +
    'alívio começa quando a régua deixa de ser emprestada.',

  'natal:sun|quadratura|saturn':
    'Nada vem fácil, e isso marca. Quem nasce assim duvida do próprio valor ' +
    'mesmo com prova em mãos, e trabalha o dobro por causa disso. A conquista ' +
    'chega, só chega tarde. E quando chega, fica.',

  'natal:sun|sextil|saturn':
    'A seriedade não pesa. Quem nasce assim assume compromisso sem drama e ' +
    'entrega no prazo, o que constrói reputação em silêncio. Há maturidade ' +
    'visível desde jovem. O cuidado é deixar espaço para o que não tem ' +
    'finalidade nenhuma.',

  'natal:sun|conjuncao|uranus':
    'Ser diferente não é escolha. Quem nasce assim já chega fora do molde e ' +
    'passa a infância explicando por quê. Há originalidade que abre caminho ' +
    'próprio. O custo é a instabilidade, porque o mesmo impulso muda tudo ' +
    'quando algo estava começando a dar certo.',

  'natal:sun|oposicao|uranus':
    'A ruptura chega pelos outros. Quem nasce assim atrai gente imprevisível ' +
    'e situação que vira do dia para a noite, e demora a ver a própria parte ' +
    'nisso. Há tolerância genuína ao diferente. A vida estabiliza quando a ' +
    'liberdade deixa de ser negociada com alguém.',

  'natal:sun|sextil|uranus':
    'A novidade encontra quem sabe usá-la. Quem nasce assim entende o que ' +
    'ainda está sendo inventado e aplica antes dos outros. Há independência ' +
    'sem briga. O único inimigo é a repetição, que apaga o interesse antes de ' +
    'o resultado aparecer.',

  'natal:sun|conjuncao|neptune':
    'O contorno da identidade é fraco de nascença. Quem nasce assim absorve o ' +
    'estado de quem está por perto e confunde com o próprio. Há sensibilidade ' +
    'artística rara e compaixão real. O trabalho da vida é saber onde a ' +
    'pessoa termina e o ambiente começa.',

  'natal:sun|oposicao|neptune':
    'A confusão vem de fora. Quem nasce assim idealiza quem tem pela frente e ' +
    'demora a enxergar a pessoa real embaixo da imagem. Há capacidade de ' +
    'entrega quase sem limite. O aprendizado é enxergar antes de se doar, e ' +
    'não depois.',

  'natal:sun|quadratura|neptune':
    'Saber o que se quer é a parte difícil. Quem nasce assim tem talento e ' +
    'dúvida na mesma medida, e adia decisão esperando uma clareza que não ' +
    'chega sozinha. Há sensibilidade grande. Ela organiza quando encontra ' +
    'forma concreta, e só então.',

  'natal:sun|sextil|neptune':
    'A intuição trabalha a favor. Quem nasce assim percebe o clima de uma sala ' +
    'e ajusta sem esforço, e isso aparece no cuidado com as pessoas. Há ' +
    'talento para o que se sente antes de entender. O limite é dizer não, que ' +
    'nunca sai natural.',

  'natal:sun|conjuncao|pluto':
    'A intensidade é a identidade. Quem nasce assim não passa despercebido nem ' +
    'quando tenta, e provoca reação forte sem fazer nada. Há capacidade de ' +
    'recomeçar do zero mais de uma vez. O risco é o controle, que aparece como ' +
    'cuidado e funciona como cerca.',

  'natal:sun|oposicao|pluto':
    'O poder está sempre do outro lado. Quem nasce assim esbarra em gente que ' +
    'domina e aprende cedo a medir força, e as relações mais importantes ' +
    'passam por essa disputa. Há resistência enorme. A virada é parar de ' +
    'precisar vencer para existir.',

  // ── o resto de Mercúrio ──────────────────────────────────────────────────
  'natal:mercury|conjuncao|venus':
    'A palavra sai bonita porque é assim que ela nasce. Quem tem isso escreve, ' +
    'canta ou negocia com facilidade que os outros treinam a vida inteira. Há ' +
    'diplomacia natural. O que falta é aspereza, e algumas conversas só ' +
    'funcionam com ela.',

  'natal:mercury|trigono|mars':
    'Pensar e agir acontecem juntos. Quem nasce assim decide rápido, explica ' +
    'depois e quase sempre acerta. Há energia mental que não cansa. O ponto ' +
    'cego é a pressa com quem precisa de tempo para chegar à mesma ideia.',

  'natal:mercury|oposicao|mars':
    'A discussão é o modo natural de pensar. Quem nasce assim afia o ' +
    'raciocínio contra alguém e por isso atrai debate onde não havia. Há ' +
    'inteligência combativa de verdade. Separar discordar de brigar é o ' +
    'aprendizado, e ele demora.',

  'natal:mercury|conjuncao|jupiter':
    'A cabeça pensa grande por padrão. Quem nasce assim junta assunto distante ' +
    'e enxerga o desenho antes dos outros, e ensina com naturalidade. Há ' +
    'otimismo intelectual. O deslize é a conclusão bonita que não passa por ' +
    'exame.',

  'natal:mercury|trigono|jupiter':
    'Aprender é fácil e dá prazer. Quem nasce assim atravessa assunto novo sem ' +
    'medo e explica bem o que acabou de entender. Há amplitude real de ' +
    'interesse. O que falta é profundidade, porque o próximo assunto sempre ' +
    'chama antes de o atual acabar.',

  'natal:mercury|oposicao|jupiter':
    'A ideia cresce quando encontra plateia. Quem nasce assim promete no meio ' +
    'da conversa e depois corre atrás do que prometeu. Há entusiasmo que ' +
    'convence. O ajuste é medir antes de anunciar, e não o contrário.',

  'natal:mercury|conjuncao|saturn':
    'O pensamento é lento e certo. Quem nasce assim demora a responder e ' +
    'responde melhor, e passa a juventude achando que isso é defeito. Há ' +
    'capacidade de estudo que sustenta carreira inteira. A autocrítica é o ' +
    'peso, não a inteligência.',

  'natal:mercury|oposicao|saturn':
    'A crítica vem de fora e gruda. Quem nasce assim encontra quem corrija a ' +
    'cada frase e passa a corrigir sozinho, antes de falar. Há rigor genuíno. ' +
    'O silêncio que parece timidez costuma ser uma revisão que nunca termina.',

  'natal:mercury|quadratura|saturn':
    'Falar custa. Quem nasce assim pensa bem e trava na hora de dizer, e o ' +
    'travamento não tem relação com o que sabe. Há profundidade real embaixo. ' +
    'O caminho é escrever antes de falar, e a confiança vem pelo texto.',

  'natal:mercury|sextil|saturn':
    'A cabeça organiza sem esforço. Quem nasce assim estrutura o que os outros ' +
    'deixam solto e é procurado exatamente por isso. Há memória confiável para ' +
    'o que importa. O limite é o improviso, que nunca sai tão bem quanto o ' +
    'planejado.',

  'natal:mercury|conjuncao|uranus':
    'A ideia chega inteira e do nada. Quem nasce assim tem insight de verdade ' +
    'e nenhuma paciência para o caminho que leva até ele. Há brilho evidente. ' +
    'O custo é a inconstância, porque o interesse acaba antes da execução.',

  'natal:mercury|oposicao|uranus':
    'A discordância é o modo de pensar. Quem nasce assim assume a posição ' +
    'contrária por reflexo e descobre depois se acredita nela. Há ' +
    'originalidade real. O trabalho é separar o que é convicção do que é só ' +
    'reação ao consenso.',

  'natal:mercury|sextil|uranus':
    'O atalho aparece sozinho. Quem nasce assim resolve por caminho que ' +
    'ninguém tinha visto e sabe explicar depois. Há facilidade com tecnologia ' +
    'e com o que ainda não tem manual. O inimigo é a rotina, não a ' +
    'dificuldade.',

  'natal:mercury|conjuncao|neptune':
    'O pensamento é feito de imagem. Quem nasce assim entende pelo clima e ' +
    'tem dificuldade real com prazo, número e nome próprio. Há talento ' +
    'poético evidente. O prático não vem sozinho, precisa de sistema ' +
    'emprestado.',

  'natal:mercury|oposicao|neptune':
    'O mal-entendido chega pelos outros. Quem nasce assim escuta uma coisa e ' +
    'entende outra, e a diferença só aparece tarde. Há sensibilidade grande ' +
    'para o que não foi dito. Confirmar o combinado por escrito resolve mais ' +
    'do que parece.',

  'natal:mercury|quadratura|neptune':
    'A ideia perde o contorno no caminho até a boca. Quem nasce assim sabe e ' +
    'não consegue formular, e se acusa de burrice quando é outra coisa. Há ' +
    'imaginação de sobra. Escrever devagar é o que transforma névoa em frase.',

  'natal:mercury|sextil|neptune':
    'A palavra encontra imagem sem esforço. Quem nasce assim explica ideia ' +
    'abstrata por comparação e a pessoa entende na hora. Há talento para ' +
    'ensinar, escrever ficção ou traduzir o que é difícil. O ponto fraco é o ' +
    'detalhe seco.',

  'natal:mercury|conjuncao|pluto':
    'A cabeça é investigativa por natureza. Quem nasce assim não aceita a ' +
    'primeira resposta e vai até achar o que estava embaixo, em assunto e em ' +
    'gente. Há poder na palavra. Usá-lo sem virar interrogatório é o ' +
    'aprendizado.',

  'natal:mercury|oposicao|pluto':
    'A conversa vira disputa de controle. Quem nasce assim encontra quem ' +
    'manipule pela palavra e aprende a ler intenção antes de ouvir conteúdo. ' +
    'Há percepção afiada. O risco é a desconfiança virar padrão mesmo onde não ' +
    'há motivo.',

  // ── o resto de Vênus ─────────────────────────────────────────────────────
  'natal:venus|trigono|mars':
    'Desejo e afeto puxam para o mesmo lado. Quem nasce assim aproxima com ' +
    'naturalidade e não precisa escolher entre querer e cuidar. Há calor que ' +
    'as pessoas sentem de longe. O ponto cego é achar que relação difícil é ' +
    'sempre culpa do outro.',

  'natal:venus|oposicao|mars':
    'A atração vem com faísca. Quem nasce assim se interessa por quem oferece ' +
    'resistência e perde o interesse quando a resistência acaba. Há química ' +
    'forte de verdade. A maturidade é descobrir que paz e desejo podem morar ' +
    'no mesmo lugar.',

  'natal:venus|trigono|jupiter':
    'Gostar da vida é fácil. Quem nasce assim tem sorte social, é bem ' +
    'recebido e retribui na mesma moeda. Há conforto e generosidade sem ' +
    'esforço. O excesso não avisa: no prato, na conta e na expectativa.',

  'natal:venus|quadratura|jupiter':
    'O apetite não tem freio. Quem nasce assim quer mais, oferece mais e gasta ' +
    'mais do que a conta permite, sempre por generosidade genuína. Há ' +
    'simpatia real. O aprendizado é dizer não a si antes que alguém diga.',

  'natal:venus|oposicao|jupiter':
    'A generosidade aparece na relação. Quem nasce assim dá demais e depois ' +
    'espera reciprocidade que não combinou com ninguém. Há calor humano ' +
    'verdadeiro. Combinar o que se espera evita a mágoa que costuma vir.',

  'natal:venus|conjuncao|saturn':
    'Amar é sério desde o começo. Quem nasce assim leva vínculo a peso de ' +
    'compromisso e sente falta de leveza sem saber pedir. Há lealdade que não ' +
    'se compra. O medo da rejeição costuma chegar antes da rejeição.',

  'natal:venus|oposicao|saturn':
    'A frieza vem do outro lado. Quem nasce assim escolhe quem está pouco ' +
    'disponível e chama isso de profundidade. Há capacidade de esperar que ' +
    'poucos têm. A virada é perceber que amor correspondido não precisa ser ' +
    'conquistado toda semana.',

  'natal:venus|quadratura|saturn':
    'O afeto encontra parede. Quem nasce assim quer perto e cria distância no ' +
    'mesmo gesto, e não entende por que a relação esfria. Há fidelidade real ' +
    'embaixo do muro. A vida adulta é aprender a pedir sem achar que pedir ' +
    'humilha.',

  'natal:venus|trigono|saturn':
    'O vínculo é construído para durar. Quem nasce assim escolhe devagar e ' +
    'raramente se arrepende, e as amizades atravessam décadas. Há lealdade ' +
    'discreta. O que falta é impulso, porque quase nada aqui começa por ' +
    'vontade repentina.',

  'natal:venus|sextil|saturn':
    'O gosto tem economia. Quem nasce assim escolhe pouco e escolhe bem, em ' +
    'objeto e em gente. Há confiabilidade que os outros procuram. O cuidado é ' +
    'não confundir prudência com falta de apetite.',

  'natal:venus|conjuncao|uranus':
    'Amar pede liberdade no mesmo pacote. Quem nasce assim se apaixona rápido ' +
    'e precisa de espaço logo em seguida, o que confunde quem chegou. Há ' +
    'magnetismo evidente. O trabalho é ficar sem sentir que está preso.',

  'natal:venus|trigono|uranus':
    'O gosto é próprio e não pede licença. Quem nasce assim gosta do que gosta ' +
    'sem se explicar, e é aceito assim, o que é raro. Há facilidade em amizade ' +
    'com gente muito diferente. O tédio é o único risco real.',

  'natal:venus|quadratura|uranus':
    'O afeto vem em arranco. Quem nasce assim quer intensamente e some, sem ' +
    'que a vontade tenha desaparecido de verdade. Há atração por quem não ' +
    'está disponível. A vida melhora quando liberdade deixa de ser sinônimo de ' +
    'fuga.',

  'natal:venus|oposicao|uranus':
    'A instabilidade vem pelo outro. Quem nasce assim atrai quem chega forte e ' +
    'desaparece, e demora a ver que escolheu isso. Há tolerância genuína ao ' +
    'diferente. A relação estabiliza quando a imprevisibilidade para de ser o ' +
    'atrativo.',

  'natal:venus|sextil|uranus':
    'O novo entra sem quebrar nada. Quem nasce assim mistura gente e gosto sem ' +
    'esforço e torna o ambiente mais leve. Há originalidade sem provocação. O ' +
    'único limite é a rotina afetiva, que apaga o interesse devagar.',

  'natal:venus|conjuncao|neptune':
    'O amor é ideal antes de ser real. Quem nasce assim vê na pessoa o que ' +
    'gostaria que ela fosse e sofre quando a diferença aparece. Há capacidade ' +
    'de entrega quase sem limite. Enxergar antes de idealizar é o trabalho de ' +
    'uma vida.',

  'natal:venus|trigono|neptune':
    'A ternura é natural. Quem nasce assim ama sem cobrar e percebe a dor do ' +
    'outro antes de ela ser dita. Há sensibilidade estética evidente, em som, ' +
    'imagem ou palavra. O limite é o próprio contorno, que se apaga fácil.',

  'natal:venus|quadratura|neptune':
    'O que se ama nunca é bem o que está ali. Quem nasce assim se decepciona ' +
    'com frequência e não aprende pela decepção, porque a próxima imagem já ' +
    'está pronta. Há romantismo verdadeiro. O remédio é ver a pessoa devagar.',

  'natal:venus|oposicao|neptune':
    'A idealização vem pelo parceiro. Quem nasce assim se encanta pela imagem ' +
    'que projetou e leva tempo para ver quem está de fato ali. Há entrega ' +
    'generosa e real. A desilusão que chega depois costuma ensinar mais sobre ' +
    'a própria fantasia do que sobre o outro.',

  'natal:venus|sextil|neptune':
    'A sensibilidade encontra forma. Quem nasce assim transforma o que sente ' +
    'em alguma coisa que os outros podem ver, e faz isso sem drama. Há gosto ' +
    'refinado sem esnobismo. O que custa é impor limite quando é preciso.',

  'natal:venus|conjuncao|pluto':
    'Amar é assunto de vida ou morte. Quem nasce assim não tem relação morna e ' +
    'descobre cedo que uma pessoa pode reorganizar tudo. Há devoção real. ' +
    'Ciúme e entrega nascem da mesma raiz, e separar os dois é o trabalho.',

  'natal:venus|trigono|pluto':
    'A intensidade é administrada. Quem nasce assim ama fundo sem se perder e ' +
    'atravessa fim de ciclo sem virar outra pessoa. Há magnetismo que não ' +
    'precisa de esforço. O cuidado é lembrar que nem todo vínculo precisa ser ' +
    'profundo.',

  'natal:venus|sextil|pluto':
    'A profundidade chega sem crise. Quem nasce assim percebe o que está ' +
    'apodrecendo num vínculo antes de estourar e conversa a tempo. Há poder de ' +
    'atração discreto e constante. Usá-lo bem é a diferença entre encanto e ' +
    'desconforto.',

  'natal:venus|oposicao|pluto':
    'A obsessão vem do outro lado. Quem nasce assim atrai quem quer possuir e ' +
    'confunde isso com paixão, pelo menos nas primeiras vezes. Há intensidade ' +
    'real na relação. A liberdade começa quando controle deixa de parecer ' +
    'prova de amor.',

  // ── o resto de Marte ─────────────────────────────────────────────────────
  'natal:mars|conjuncao|jupiter':
    'A ação vem com apetite. Quem nasce assim começa grande e acredita no que ' +
    'começou, e essa confiança arrasta gente junto. Há coragem e sorte na ' +
    'mesma dose. O excesso é o mesmo motor sem freio, que compra briga ' +
    'desnecessária.',

  'natal:mars|trigono|uranus':
    'A reação é rápida e criativa. Quem nasce assim improvisa sob pressão e ' +
    'sai melhor do que quem planejou. Há gosto por risco medido. O ponto cego ' +
    'é a rotina, que sufoca antes de a pessoa perceber.',

  'natal:mars|oposicao|neptune':
    'A força escapa pelo outro. Quem nasce assim luta por quem precisa e não ' +
    'por si, e depois não entende o cansaço. Há compaixão que move de ' +
    'verdade. Brigar pela própria causa é o que falta aprender.',

  'natal:mars|trigono|pluto':
    'A força tem fundo. Quem nasce assim sustenta esforço longo sem alarde e ' +
    'termina o que outros abandonaram no meio. Há resistência física e ' +
    'psíquica acima da média. O cuidado é não medir todo mundo por essa ' +
    'régua.',

  'natal:mars|oposicao|pluto':
    'A disputa de poder é o campo. Quem nasce assim encontra quem force a mão ' +
    'e responde na mesma moeda, e essas brigas marcam época. Há força enorme ' +
    'quando ela encontra causa. Sem causa, ela procura adversário.',
}

/**
 * O texto deste aspecto natal, ou `null` quando ninguém escreveu.
 *
 * Recebe a chave já montada por `chaveAspectoNatal`, para não duplicar aqui a
 * regra da ordem tradicional dos corpos.
 */
export function textoDoAspecto(chave) {
  return ASPECTO_NATAL[chave] || null
}

export const CHAVES_DE_ASPECTO = Object.keys(ASPECTO_NATAL)
