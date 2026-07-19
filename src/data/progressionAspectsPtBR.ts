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
 * COBERTURA PARCIAL POR DESIGN. Sem texto, o card mostra só o nome do aspecto e
 * a orbe (como já fazia). O primeiro lote cobre a **Lua progredida**, que é a
 * única que se move o bastante para a leitura mudar (~1°/mês, volta completa em
 * ~27 anos) — os demais mudam de aspecto a cada muitos anos.
 */
export const PROGRESSION_ASPECTS_PTBR: Record<string, string> = {
  // ─── Lua progredida × Sol natal ───────────────────────────────────────────
  'prog:moon|conjuncao|sun': 'Um ciclo interno recomeça e a vontade se realinha com o que o coração pede. Costuma ser fase de plantar, não de colher: o que se inicia agora tende a se desdobrar pelos anos seguintes.',
  'prog:moon|sextil|sun': 'Há acordo entre o que você sente e o que você quer, o que costuma facilitar decisões que antes pareciam custosas. Fase boa para movimentos que dependem de estar inteiro no que se escolhe.',
  'prog:moon|quadratura|sun': 'Aparece um atrito entre necessidade emocional e direção escolhida — parte de você pede abrigo enquanto outra parte quer avançar. O incômodo costuma indicar um ajuste de rota que já estava atrasado.',
  'prog:moon|trigono|sun': 'Sentir e querer caminham juntos, e isso costuma se traduzir em naturalidade nas escolhas. Momento de baixa fricção interna, favorável a consolidar o que já vinha sendo construído.',
  'prog:moon|oposicao|sun': 'Meio de um ciclo longo: o que foi semeado anos atrás fica visível e pede avaliação honesta. Tende a ser fase de tomar consciência mais do que de iniciar.',

  // ─── Lua progredida × Lua natal ───────────────────────────────────────────
  'prog:moon|conjuncao|moon': 'Retorno lunar progredido — a volta completa de um ciclo de cerca de 27 anos. Costuma marcar recomeço emocional e mudança na forma de buscar segurança.',
  'prog:moon|sextil|moon': 'O clima emocional favorece adaptação sem grandes rupturas. Fase de ajuste fino, boa para cuidar do cotidiano e das bases.',
  'prog:moon|quadratura|moon': 'Tensão entre o que você precisa hoje e o padrão emocional antigo. Costuma pedir revisão de hábitos de cuidado que já não servem.',
  'prog:moon|trigono|moon': 'Compreensão que gera adaptabilidade: as circunstâncias parecem mais legíveis e a reação vem com menos sobressalto.',
  'prog:moon|oposicao|moon': 'O ciclo emocional chega ao ponto de maior contraste e o que estava só sentido tende a ficar explícito. Fase de enxergar o próprio padrão de fora.',

  // ─── Lua progredida × Mercúrio natal ──────────────────────────────────────
  'prog:moon|conjuncao|mercury': 'Sentimento e pensamento se aproximam: fica mais fácil nomear o que se sente e mais difícil manter distância analítica.',
  'prog:moon|sextil|mercury': 'Boa fase para conversas que vinham sendo adiadas — o que se sente encontra palavra com menos esforço.',
  'prog:moon|quadratura|mercury': 'A razão e a emoção puxam para lados diferentes, e a comunicação tende a sair mais reativa do que se pretende.',
  'prog:moon|trigono|mercury': 'Clareza afetiva: dá para falar do que importa sem endurecer nem se perder.',
  'prog:moon|oposicao|mercury': 'O que se sente e o que se argumenta parecem incompatíveis; costuma ser fase de ouvir mais do que concluir.',

  // ─── Lua progredida × Vênus natal ─────────────────────────────────────────
  'prog:moon|conjuncao|venus': 'Fase de maior sensibilidade ao afeto e à beleza, com necessidade real de aconchego e de vínculos que confortem.',
  'prog:moon|sextil|venus': 'Clima favorável a encontros e reconciliações — o afeto circula com menos esforço.',
  'prog:moon|quadratura|venus': 'Os perigos do apego e da indolência: o desejo de conforto pode adiar o que precisa ser encarado.',
  'prog:moon|trigono|venus': 'Período de bem-estar afetivo, bom para cultivar o que já funciona em vez de buscar novidade.',
  'prog:moon|oposicao|venus': 'Descompasso entre o que se quer receber e o que se está disposto a oferecer. Costuma pedir honestidade sobre a própria expectativa.',

  // ─── Lua progredida × Marte natal ─────────────────────────────────────────
  'prog:moon|conjuncao|mars': 'Vivificação do humor: emoção e impulso se somam, e a reação tende a vir antes da reflexão.',
  'prog:moon|sextil|mars': 'Boa disposição para agir a partir do que se sente — fase produtiva quando há um alvo claro.',
  'prog:moon|quadratura|mars': 'Irritabilidade mais à flor da pele; pequenos atritos ganham tamanho desproporcional.',
  'prog:moon|trigono|mars': 'Coragem emocional disponível: dá para encarar o que vinha sendo evitado sem dramatizar.',
  'prog:moon|oposicao|mars': 'O impulso encontra resistência, muitas vezes na forma de outra pessoa. Fase de negociar em vez de forçar.',

  // ─── Lua progredida × sociais e lentos ────────────────────────────────────
  'prog:moon|conjuncao|jupiter': 'Ampliação do clima interno — otimismo mais acessível, com risco de superestimar o que se aguenta.',
  'prog:moon|quadratura|jupiter': 'A vontade de mais esbarra no que a rotina comporta; excesso costuma cobrar depois.',
  'prog:moon|trigono|jupiter': 'Fase de generosidade e amplitude, boa para se expor ao que amplia horizonte.',
  'prog:moon|conjuncao|saturn': 'Período de recolhimento e seriedade emocional. Costuma pesar, mas é também quando se constrói base afetiva sólida.',
  'prog:moon|quadratura|saturn': 'Sensação de solidão ou de insuficiência afetiva. Tende a passar, e o que fica é mais estrutura do que ferida.',
  'prog:moon|trigono|saturn': 'Maturidade emocional disponível: dá para sustentar o que antes parecia pesado demais.',
  'prog:moon|oposicao|saturn': 'O limite aparece nítido e cobra revisão do que se prometeu a si mesmo.',
  'prog:moon|conjuncao|uranus': 'Inquietação emocional e necessidade de espaço. Fase em que o previsível incomoda mais do que o de costume.',
  'prog:moon|conjuncao|neptune': 'Sensibilidade ampliada e contornos menos nítidos. Bom para o que é criativo ou contemplativo, arriscado para decisões que exigem clareza.',
  'prog:moon|conjuncao|pluto': 'Mergulho emocional profundo, com o que estava enterrado voltando à superfície. Fase intensa, mas de recomposição real.',
}
