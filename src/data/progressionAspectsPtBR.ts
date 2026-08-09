/**
 * Interpretações dos aspectos por progressão secundária.
 *
 * Registro diferente do trânsito: o trânsito é o céu real de hoje batendo no
 * mapa; a progressão é um movimento INTERNO, de amadurecimento, que colore como
 * a pessoa percebe tudo o mais. Os textos falam de clima psicológico e fase de
 * vida, não de evento externo.
 *
 * Chave: `prog:{planetaProgredido}|{aspecto}|{planetaNatal}` — minúsculo, sem acento.
 *
 * VOZ: a lente evolutiva de `docs/VISAO_ASTROLOGICA.md` — camada superfície.
 * Dificuldade é aprendizado ativo (não castigo), dom e dificuldade são o mesmo
 * combustível, nunca fatalismo nem prescrição de conduta. 2-3 frases por aspecto.
 *
 * COBERTURA PARCIAL POR DESIGN. Sem texto, o card mostra só o nome do aspecto, a
 * orbe e a janela. Este lote cobre a **Lua progredida** — a única que se move o
 * bastante para a leitura mudar (~1°/mês, volta completa em ~27 anos).
 */
export const PROGRESSION_ASPECTS_PTBR: Record<string, string> = {
  // ─── Lua progredida × Sol natal ───────────────────────────────────────────
  'prog:moon|conjuncao|sun': 'Um ciclo interno recomeça e a vontade volta a se alinhar com o que o coração pede. Costuma ser fase de plantar, não de colher — o que se inicia agora tende a se desdobrar pelos próximos anos. Vale escolher com cuidado o que recebe sua energia, porque é semente.',
  'prog:moon|sextil|sun': 'Sentir e querer entram em acordo, e decisões que antes custavam ficam mais leves. Agir a partir do que você é de verdade encontra menos resistência interna. É bom momento para movimentos que pedem você inteiro no que escolhe.',
  'prog:moon|quadratura|sun': 'Aparece um atrito entre o que você precisa sentir e a direção que escolheu: parte de você pede abrigo, outra quer avançar. Esse desconforto não é castigo — costuma apontar um ajuste de rota que já estava atrasado. O aprendizado é sustentar as duas verdades sem abandonar nenhuma.',
  'prog:moon|trigono|sun': 'Vontade e emoção caminham juntas, e as escolhas ganham naturalidade. É fase de baixa fricção interna, favorável a consolidar o que já vinha sendo construído. Deixar o que funciona criar raiz é o melhor uso desse período.',
  'prog:moon|oposicao|sun': 'Meio de um ciclo longo: o que foi semeado anos atrás fica visível e pede avaliação honesta. Tende a ser fase de tomar consciência mais do que de iniciar — você enxerga de fora o que vinha vivendo por dentro. O que se vê agora com clareza vira material para os próximos passos.',

  // ─── Lua progredida × Lua natal ───────────────────────────────────────────
  'prog:moon|conjuncao|moon': 'Retorno lunar progredido — a volta completa de um ciclo de cerca de 27 anos. Costuma marcar um recomeço emocional e uma mudança na forma como você busca segurança e aconchego. É um limiar: vale sentir o que se fecha para dar espaço ao que começa.',
  'prog:moon|sextil|moon': 'O clima emocional favorece adaptação sem grandes rupturas. É fase de ajuste fino, boa para cuidar do cotidiano e das bases que sustentam você. Pequenos cuidados agora rendem estabilidade adiante.',
  'prog:moon|quadratura|moon': 'Tensão entre o que você precisa hoje e um padrão emocional antigo que ainda pede as mesmas coisas. O incômodo costuma revelar hábitos de cuidado que já não servem. Rever esses automatismos, sem se cobrar, é o trabalho da fase.',
  'prog:moon|trigono|moon': 'As circunstâncias ficam mais legíveis e a reação vem com menos sobressalto. Há uma compreensão que gera adaptabilidade — você sente sem se afogar no que sente. Bom momento para lidar com o que exige jogo de cintura emocional.',
  'prog:moon|oposicao|moon': 'O ciclo emocional chega ao ponto de maior contraste, e o que estava apenas sentido tende a ficar explícito. Você enxerga o próprio padrão de fora, como quem finalmente vê o desenho inteiro. Essa lucidez, ainda que desconfortável, é o presente da fase.',

  // ─── Lua progredida × Mercúrio natal ──────────────────────────────────────
  'prog:moon|conjuncao|mercury': 'Sentimento e pensamento se aproximam: fica mais fácil nomear o que se sente e mais difícil manter distância analítica. É fase fértil para escrever, conversar e traduzir emoção em palavra. O cuidado é não tomar cada humor passageiro como conclusão definitiva.',
  'prog:moon|sextil|mercury': 'Boa fase para conversas que vinham sendo adiadas — o que se sente encontra palavra com menos esforço. A mente acompanha o coração em vez de atropelá-lo. Vale usar essa ponte para dizer o que importa.',
  'prog:moon|quadratura|mercury': 'Razão e emoção puxam para lados diferentes, e a comunicação tende a sair mais reativa do que se pretende. Não é falha de caráter — é o descompasso do momento pedindo uma pausa antes da resposta. Escutar antes de concluir desarma boa parte do ruído.',
  'prog:moon|trigono|mercury': 'Clareza afetiva: dá para falar do que importa sem endurecer nem se perder no assunto. Pensamento e sentimento cooperam, e isso costuma render entendimentos mais limpos. Fase boa para alinhar o que estava embaralhado.',
  'prog:moon|oposicao|mercury': 'O que se sente e o que se argumenta parecem incompatíveis, e a tentação é vencer a discussão em vez de se entender. Costuma ser fase de ouvir mais do que concluir. O aprendizado é deixar a emoção informar a razão sem sequestrá-la.',

  // ─── Lua progredida × Vênus natal ─────────────────────────────────────────
  'prog:moon|conjuncao|venus': 'Fase de maior sensibilidade ao afeto e à beleza, com uma necessidade real de aconchego e de vínculos que confortem. O prazer e a delicadeza pedem espaço, e negá-los custa mais do que o de costume. Acolher esse lado, sem se perder nele, nutre o período.',
  'prog:moon|sextil|venus': 'Clima favorável a encontros e reconciliações — o afeto circula com menos esforço. É bom momento para cultivar o que dá gosto e aproximar quem importa. A leveza aqui não é distração; é alimento.',
  'prog:moon|quadratura|venus': 'O desejo de conforto pode adiar o que precisa ser encarado — os perigos do apego e da indolência. Não se trata de negar o prazer, mas de perceber quando ele vira fuga. Ver essa diferença é o que a fase vem ensinar.',
  'prog:moon|trigono|venus': 'Período de bem-estar afetivo, bom para cultivar o que já funciona em vez de correr atrás de novidade. Os vínculos ganham uma camada de gentileza e a beleza cotidiana fica mais acessível. Vale desfrutar sem pressa.',
  'prog:moon|oposicao|venus': 'Descompasso entre o que se quer receber e o que se está disposto a oferecer, muitas vezes espelhado por outra pessoa. Não é sobre culpa — é sobre honestidade quanto à própria expectativa afetiva. Encarar isso costuma reequilibrar a sua relação com o afeto.',

  // ─── Lua progredida × Marte natal ─────────────────────────────────────────
  'prog:moon|conjuncao|mars': 'Emoção e impulso se somam, e a reação tende a vir antes da reflexão. Há mais coragem disponível, mas também mais estopim. Canalizar esse calor para o que importa, em vez de gastá-lo em atritos, é a arte da fase.',
  'prog:moon|sextil|mars': 'Boa disposição para agir a partir do que se sente — fase produtiva quando há um alvo claro. A energia emocional vira combustível em vez de ruído. Vale usá-la para destravar o que estava parado.',
  'prog:moon|quadratura|mars': 'Irritabilidade à flor da pele: pequenos atritos ganham tamanho desproporcional. O aprendizado não é engolir a raiva, mas perceber o que ela sinaliza antes de descarregá-la. Um respiro entre o estímulo e a resposta muda tudo aqui.',
  'prog:moon|trigono|mars': 'Coragem emocional disponível: dá para encarar o que vinha sendo evitado sem dramatizar. A ação flui a partir de um chão firme, sem precisar de briga para se mover. Momento bom para dar o passo que pedia coragem.',
  'prog:moon|oposicao|mars': 'O impulso encontra resistência, muitas vezes na forma de outra pessoa que reage ao seu movimento. Forçar tende a aumentar o atrito; negociar tende a abrir caminho. A fase pede firmeza sem guerra.',

  // ─── Lua progredida × sociais e lentos ────────────────────────────────────
  'prog:moon|conjuncao|jupiter': 'O clima interno se amplia — otimismo mais acessível e vontade de expandir. O risco é superestimar o que se aguenta e prometer além da conta. Aproveitar a generosidade da fase com um pé no real é o equilíbrio.',
  'prog:moon|quadratura|jupiter': 'A vontade de mais esbarra no que a rotina de fato comporta. O excesso costuma parecer inofensivo na hora e cobrar depois. Ver onde o entusiasmo vira demasia é o ajuste que a fase pede.',
  'prog:moon|trigono|jupiter': 'Fase de amplitude e generosidade, boa para se expor ao que alarga horizonte. A confiança vem mais fácil e o mundo parece caber mais. Vale investir no que faz você crescer, sem confundir expansão com dispersão.',
  'prog:moon|conjuncao|saturn': 'Período de recolhimento e seriedade emocional. Costuma pesar, mas é também quando se assenta uma base afetiva mais sólida. O que parece frieza aqui é, no fundo, maturação — vale respeitar o próprio ritmo mais lento.',
  'prog:moon|quadratura|saturn': 'Sensação de solidão ou de insuficiência afetiva, como se faltasse calor. Tende a passar, e o que fica é mais estrutura do que ferida. A fase ensina a se sustentar mesmo quando o apoio externo parece escasso.',
  'prog:moon|trigono|saturn': 'Maturidade emocional disponível: dá para sustentar o que antes parecia pesado demais. Há um chão interno mais firme, bom para assumir compromissos que exigem constância. O que se constrói agora com paciência tende a durar.',
  'prog:moon|oposicao|saturn': 'Um limite aparece nítido e cobra revisão do que você prometeu a si mesmo. Não é bloqueio gratuito — é a realidade pedindo que você separe o que virou peso desnecessário do que é compromisso real. Encarar o limite com honestidade costuma aliviar mais do que resistir.',
  'prog:moon|conjuncao|uranus': 'Inquietação emocional e necessidade de espaço: o previsível incomoda mais do que de costume. Há um chamado a arejar o que virou rotina engessada. Dar vazão a isso de forma consciente evita que a mudança venha no susto.',
  'prog:moon|conjuncao|neptune': 'Sensibilidade ampliada e contornos menos nítidos — o mundo fica mais poroso. Ótimo para o que é criativo, contemplativo ou espiritual; delicado para decisões que exigem clareza dura. Vale sonhar sem assinar embaixo do que ainda está nebuloso.',
  'prog:moon|conjuncao|pluto': 'Mergulho emocional profundo: o que estava enterrado volta à superfície pedindo olhar. É fase intensa, às vezes desconfortável, mas de recomposição real — o que se atravessa aqui costuma devolver força. Deixar o velho morrer é o que abre espaço para o novo.',
}
