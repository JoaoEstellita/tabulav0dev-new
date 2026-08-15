/**
 * Planeta em signo, escrito aqui, na voz da campanha.
 *
 * ── POR QUE ESTE ARQUIVO EXISTE ────────────────────────────────────────────
 *
 * O João publicou as primeiras peças, pedi a reescrita dos 99 textos e ele
 * abriu o Estúdio no dia seguinte com a mesma reclamação. Estava certo: a peça
 * daquele dia não usava nenhum dos 99. `pecaDoAssunto.mjs` resolve
 * `planeta_no_signo` e `aspecto_natal` puxando do CATÁLOGO NATAL DO APP, e são
 * dois dos sete caminhos que a reescrita não tocou. O que saiu foi "A energia
 * de ação está profundamente conectada ao estado emocional do momento
 * presente", que é texto de produto, escrito para outra finalidade.
 *
 * O catálogo do app continua certo onde ele vive: dentro do app, em quatro
 * idiomas, lido por quem já entrou. A peça é outra coisa, e precisa de texto
 * próprio pelo mesmo motivo que `textosEvento.mjs` precisou.
 *
 * ── POR QUE 17 E NÃO 72 ────────────────────────────────────────────────────
 *
 * `PLANETAS_DE_SIGNO` tem seis corpos, e o que vira peça é o signo em que cada
 * um ESTÁ. Rodei a efeméride em 120 dias a partir de 15/08/2026 e saíram 17
 * posições distintas. Escrever as 72 combinações seria encher tabela: a maioria
 * não vai ao ar neste ano, e texto escrito para preencher linha é exatamente o
 * que ele leu e chamou de genérico.
 *
 * Quando o céu trouxer uma posição que não está aqui, `textoDaPosicao` devolve
 * `null`, o console avisa e a peça cai no catálogo do app. Sai pior, mas sai.
 *
 * ── A DIGNIDADE ────────────────────────────────────────────────────────────
 *
 * Sete das dezessete têm dignidade, e é onde a leitura fica específica: Marte
 * em Câncer está em queda, Vênus em Libra está em casa. `dignidade()` já existe
 * em `interpretacao.mjs` e a peça já a exibe; o que faltava era o TEXTO saber
 * disso. Um planeta em queda não é um planeta ruim, e a frase precisa dizer o
 * que muda sem virar sentença.
 *
 * ── A RÉGUA ────────────────────────────────────────────────────────────────
 *
 * A mesma de `linguagem.spec.mjs`, e ela roda sobre estes textos: frase curta
 * para respirar, no máximo um dois-pontos, "costuma" no máximo uma vez, sem
 * travessão, sem jargão e sem misticismo. Terceira pessoa, sem falar "você".
 *
 * Descrevem quem NASCEU com a posição, não o que hoje reserva. É a tese da
 * campanha inteira, e `linhaDeHonestidade` a repete na peça.
 */

/** Chave: `{corpo}|{signo}`, com o corpo em inglês, como o resto do pipeline. */
export const POSICAO = {
  'Sun|Leão':
    'Sol em casa. Leão é o signo que ele governa, e aqui nada nele precisa ser ' +
    'traduzido. Quem nasce assim ocupa espaço sem ensaiar. Há calor, e há uma ' +
    'necessidade real de ser visto fazendo o que faz. O custo aparece quando o ' +
    'reconhecimento demora: sem plateia, a vontade esfria antes da hora.',

  'Mercury|Leão':
    'A cabeça pensa em voz alta e em cena. Quem nasce com Mercúrio em Leão ' +
    'convence contando, não listando. A ideia vem inteira, com começo e ' +
    'desfecho, e sai melhor falada do que escrita. O ponto cego é mudar de ' +
    'opinião depois de ter defendido a primeira com brilho.',

  'Venus|Libra':
    'Vênus em Libra é Vênus em casa. Governa este signo, e o gosto aqui não ' +
    'precisa de esforço nenhum. Quem nasce assim percebe desequilíbrio antes de ' +
    'saber nomeá-lo, e ajusta o ambiente sem avisar. A conta chega na decisão: ' +
    'ver os dois lados com clareza é o que torna difícil ficar de um só.',

  'Mars|Câncer':
    'Marte em Câncer chega em queda, o signo onde a tradição diz que ele tem ' +
    'menos força para agir como de costume. A vontade não some. Ela deixa de ir ' +
    'em linha reta. Quem nasce assim luta pelos seus, não por si, e leva tempo ' +
    'para admitir raiva. Quando ela sai, sai por um assunto antigo.',

  'Jupiter|Leão':
    'Júpiter amplia o que encontra, e em Leão encontra vontade de aparecer. ' +
    'Quem nasce assim tem generosidade larga e um jeito de fazer os outros ' +
    'acreditarem no que ainda não existe. O excesso é o mesmo movimento sem ' +
    'freio. Prometer grande é fácil quando prometer já é metade do prazer.',

  'Saturn|Áries':
    'Saturno em Áries chega em queda: a tradição diz que é onde ele tem menos ' +
    'força para agir como de costume. Saturno pede paciência, Áries não tem ' +
    'nenhuma. Quem nasce assim aprende a começar do jeito difícil, tropeçando na ' +
    'pressa. A maturidade aqui é tardia e vem inteira, de uma vez.',

  'Sun|Virgem':
    'A identidade se organiza pelo que funciona. Quem nasce com Sol em Virgem ' +
    'repara no detalhe que ninguém viu e conserta antes de alguém pedir. Há ' +
    'orgulho no trabalho bem-feito, e ele raramente é dito em voz alta. O ' +
    'desgaste vem de aplicar em si a régua que se aplica ao trabalho.',

  'Mercury|Virgem':
    'Mercúrio em Virgem está duas vezes em casa. É o signo que ele governa e ' +
    'onde chega exaltado, e a tradição diz que é aqui que ele funciona melhor. ' +
    'A cabeça separa o que importa do que enfeita. Quem nasce assim explica bem ' +
    'e revisa demais. O risco é o texto nunca ficar pronto.',

  'Venus|Escorpião':
    'Vênus em Escorpião chega em exílio, longe do signo que governa, e tem de ' +
    'trabalhar mais para conseguir o que quer. Aqui nada é morno. Quem nasce ' +
    'assim ama por inteiro e desconfia do fácil. A intensidade é real e cobra ' +
    'caro. Ciúme e devoção nascem do mesmo lugar.',

  'Mercury|Libra':
    'O pensamento pesa os dois lados antes de escolher um. Quem nasce com ' +
    'Mercúrio em Libra ouve de verdade, e é raro. A conversa fica mais justa e ' +
    'mais lenta. O que trava é a decisão: com todos os argumentos na mesa, ' +
    'escolher passa a parecer injustiça com o lado que perdeu.',

  'Sun|Libra':
    'Sol em Libra chega em queda, o signo oposto ao que ele governa. A ' +
    'identidade se forma no encontro, não sozinha. Quem nasce assim se conhece ' +
    'pela relação e demora a saber o que quer quando não há ninguém por perto. ' +
    'A vida adulta aqui é aprender a discordar sem sentir que está rompendo.',

  'Mars|Leão':
    'A ação quer assinatura. Quem nasce com Marte em Leão faz com estilo e não ' +
    'esconde que fez. Há coragem de verdade, do tipo que aparece na hora certa. ' +
    'E há teimosia, porque recuar em público custa mais do que insistir errado.',

  'Mercury|Escorpião':
    'A cabeça vai atrás do que não foi dito. Quem nasce com Mercúrio em ' +
    'Escorpião desconfia da primeira versão e costuma ter razão. Pergunta pouco ' +
    'e descobre muito. O preço é guardar o que descobriu por tempo demais, até ' +
    'a informação virar arma em vez de conversa.',

  'Sun|Escorpião':
    'A identidade se forma no que quase quebrou. Quem nasce com Sol em ' +
    'Escorpião chega ao fundo de qualquer assunto e não se assusta com o que ' +
    'acha lá. Há força para atravessar o que os outros evitam. E há dificuldade ' +
    'em soltar, porque soltar parece perder.',

  'Sun|Sagitário':
    'A identidade precisa de horizonte. Quem nasce com Sol em Sagitário fica ' +
    'inquieto quando a vida encolhe, e sai atrás de mais mundo sem plano ' +
    'nenhum. O otimismo é sincero e contagia. O que falta é acabamento, porque ' +
    'a próxima coisa é sempre mais interessante que a atual.',

  'Mars|Virgem':
    'A ação vem em pequenas doses e acerta. Quem nasce com Marte em Virgem não ' +
    'ataca de frente, corrige por dentro. O esforço é constante e quase ' +
    'invisível, e é assim que o trabalho fica de pé. A irritação aparece pelo ' +
    'detalhe errado, e quase nunca pelo assunto grande.',

  'Mercury|Sagitário':
    'Mercúrio em Sagitário chega em exílio, longe do signo que governa, e tem ' +
    'de trabalhar mais para conseguir o que quer. Ele lida com detalhe, ' +
    'Sagitário lida com sentido. Quem nasce assim enxerga o todo antes do ' +
    'passo, e erra na letra miúda. A convicção vem antes da prova.',

  // ── o resto do ano ───────────────────────────────────────────────────────
  'Sun|Capricórnio':
    'A identidade se prova pelo que constrói. Quem nasce assim leva a vida a ' +
    'sério cedo demais e colhe tarde, o que assusta na juventude e compensa ' +
    'depois. Há ambição real, e ela é discreta. O desgaste vem de medir o ' +
    'próprio valor pelo que ainda falta.',

  'Sun|Aquário':
    'Sol em Aquário chega em exílio, no signo oposto ao que ele governa, e tem ' +
    'de trabalhar mais para brilhar. Quem nasce assim não quer o palco, quer o ' +
    'grupo. A identidade se forma na diferença, e destoar é confortável. O ' +
    'custo é a distância afetiva, que protege e isola na mesma medida.',

  'Sun|Peixes':
    'A identidade não tem borda dura. Quem nasce assim absorve o clima de quem ' +
    'está por perto e leva tempo para saber o que é seu. Há compaixão que não ' +
    'se ensina e talento para o que se sente antes de entender. Dizer não é o ' +
    'aprendizado da vida inteira.',

  'Sun|Áries':
    'Sol em Áries chega exaltado, e a tradição diz que é aqui que ele funciona ' +
    'melhor. Quem nasce assim começa. Começa antes de saber como, e essa ' +
    'coragem abre caminho que planejamento não abriria. O que falta é ' +
    'acabamento, porque a próxima coisa é sempre mais interessante.',

  'Sun|Touro':
    'A identidade se firma no que dura. Quem nasce assim demora a mudar e não ' +
    'volta atrás depois de mudar, o que os outros leem como teimosia e é ' +
    'outra coisa. Há prazer legítimo no concreto. O risco é confundir ' +
    'segurança com imobilidade.',

  'Sun|Gêmeos':
    'A identidade é feita de curiosidade. Quem nasce assim é várias pessoas em ' +
    'contextos diferentes, e todas verdadeiras. Há agilidade que encanta. O ' +
    'que custa é a profundidade, porque parar num assunto só parece perder os ' +
    'outros onze.',

  'Sun|Câncer':
    'A identidade se ancora no vínculo. Quem nasce assim se define por quem ' +
    'cuida e sente falta de si quando não tem ninguém para cuidar. Há memória ' +
    'afetiva longa. O ponto cego é esperar que os outros percebam a ' +
    'necessidade sem ela ser dita.',

  // Mercúrio
  'Mercury|Capricórnio':
    'O pensamento é prático e sem enfeite. Quem nasce assim fala pouco e o que ' +
    'fala se sustenta, e por isso é levado a sério cedo. Há capacidade de ' +
    'planejar longo. O limite é o humor, que raramente aparece na primeira ' +
    'conversa.',

  'Mercury|Aquário':
    'A cabeça pensa de fora. Quem nasce assim enxerga o sistema inteiro e o ' +
    'que está errado nele, e diz isso sem calcular quem vai se incomodar. Há ' +
    'originalidade genuína. O ponto cego é a impaciência com quem raciocina ' +
    'devagar.',

  'Mercury|Peixes':
    'Mercúrio em Peixes chega em exílio, longe do signo que governa, e tem de ' +
    'trabalhar mais. Ele quer separar, Peixes mistura. Quem nasce assim ' +
    'entende pelo clima e trava no detalhe, no prazo, no nome próprio. A ' +
    'imaginação é grande. O prático precisa de sistema emprestado.',

  'Mercury|Áries':
    'O pensamento sai antes de ser revisado. Quem nasce assim decide rápido e ' +
    'diz na hora, e acerta mais do que o método sugeriria. Há franqueza que ' +
    'poupa tempo de todo mundo. O custo é a frase certa dita no tom errado.',

  'Mercury|Touro':
    'A cabeça vai devagar e não escorrega. Quem nasce assim demora a formar ' +
    'opinião e não a solta depois, e aprende melhor tocando do que lendo. Há ' +
    'senso prático confiável. O que falta é agilidade em discussão rápida.',

  'Mercury|Gêmeos':
    'Mercúrio em Gêmeos está em casa, no signo que ele governa, e aqui nada ' +
    'nele precisa de esforço. Quem nasce assim liga assunto a assunto sem ' +
    'perder o fio e aprende por conversa. Há inquietação constante. O risco é ' +
    'saber um pouco de tudo e não sustentar nenhum.',

  'Mercury|Câncer':
    'O pensamento passa pelo afeto antes de sair. Quem nasce assim lembra do ' +
    'que sentiu, não do que foi dito, e por isso guarda conversa por anos. Há ' +
    'intuição sobre gente que raramente erra. A objetividade é o que custa.',

  // Vênus
  'Venus|Sagitário':
    'O gosto pede espaço. Quem nasce assim se apaixona por quem traz mundo ' +
    'junto e esfria quando a relação vira rotina fechada. Há generosidade ' +
    'larga e sinceridade que às vezes machuca. O compromisso funciona quando ' +
    'não parece cerca.',

  'Venus|Capricórnio':
    'O afeto se prova com tempo. Quem nasce assim demora a se abrir e não ' +
    'abandona depois de aberto, e escolhe por critério, não por impulso. Há ' +
    'lealdade que não se compra. O que falta é leveza, e ela precisa ser ' +
    'aprendida de propósito.',

  'Venus|Aquário':
    'Amar sem perder a liberdade é a condição. Quem nasce assim tem afeto ' +
    'largo, que cabe em muita gente, e desconfia de exclusividade cobrada. Há ' +
    'amizade profunda dentro do amor. A distância aparece quando a intimidade ' +
    'aperta.',

  'Venus|Peixes':
    'Vênus em Peixes chega exaltada, e a tradição diz que é aqui que ela ' +
    'funciona melhor. Quem nasce assim ama sem cobrar e percebe a dor do ' +
    'outro antes de ela ser dita. Há capacidade de entrega quase sem limite. ' +
    'O contorno é o que falta, e sem ele a doação vira desaparecimento.',

  'Venus|Áries':
    'Vênus em Áries chega em exílio, longe do signo que governa, e tem de ' +
    'trabalhar mais para conseguir o que quer. Ela quer harmonia, Áries quer ' +
    'agora. Quem nasce assim conquista rápido e se entedia rápido. A paixão é ' +
    'verdadeira nas duas pontas, e é isso que confunde.',

  'Venus|Touro':
    'Vênus em Touro está em casa, no signo que ela governa. O prazer aqui é ' +
    'físico e sem culpa: comida, toque, tecido, som. Quem nasce assim ama ' +
    'devagar e ama por muito tempo. O risco é a acomodação, que se instala ' +
    'sem que ninguém perceba.',

  'Venus|Gêmeos':
    'O afeto passa pela conversa. Quem nasce assim se apaixona por quem ' +
    'diverte a cabeça e perde o interesse quando o assunto acaba. Há leveza ' +
    'que faz bem a quem está por perto. A dificuldade é a profundidade, que ' +
    'pede silêncio.',

  'Venus|Câncer':
    'Amar é cuidar. Quem nasce assim demonstra afeto pela comida, pelo abrigo, ' +
    'pela lembrança de um detalhe antigo. Há fidelidade que dura décadas. O ' +
    'ponto cego é a mágoa guardada, que cresce em silêncio e sai de uma vez.',

  'Venus|Leão':
    'O afeto quer ser visto. Quem nasce assim ama com gesto grande e precisa ' +
    'de retorno à altura, o que é justo e raramente é dito. Há lealdade e ' +
    'calor de sobra. O que fere é a indiferença, muito mais que a recusa.',

  // Marte e Júpiter
  'Mars|Libra':
    'Marte em Libra chega em exílio, longe do signo que governa, e tem de ' +
    'trabalhar mais para agir. Ele quer avançar, Libra quer acordo. Quem nasce ' +
    'assim adia o confronto e depois briga pelo assunto errado. A força aqui ' +
    'aparece quando existe uma causa que envolva outra pessoa.',

  'Jupiter|Virgem':
    'Júpiter em Virgem chega em exílio, longe do signo que governa, e tem de ' +
    'trabalhar mais. Ele amplia, Virgem reduz ao que funciona. Quem nasce ' +
    'assim cresce pelo detalhe, não pelo salto, e desconfia de promessa ' +
    'grande. A generosidade é prática e chega em forma de ajuda concreta.',
}

/**
 * O texto desta posição, ou `null` quando ninguém escreveu.
 *
 * `null` é resposta legítima: significa que o céu trouxe uma posição fora das
 * dezessete, e quem chama decide se cai no catálogo do app ou pula o assunto.
 */
export function textoDaPosicao(corpo, signo) {
  return POSICAO[`${corpo}|${signo}`] || null
}

export const CHAVES_DE_POSICAO = Object.keys(POSICAO)
