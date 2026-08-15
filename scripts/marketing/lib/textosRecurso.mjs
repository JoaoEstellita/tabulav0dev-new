/**
 * Os recursos do app, um a um.
 *
 * ── O QUE ESTES TEXTOS SÃO ─────────────────────────────────────────────────
 *
 * Todo o resto do fluxo fala do céu. Estes falam do produto: o que cada recurso
 * faz, que problema ele resolve e onde ele fica. É o único lugar em que pedir o
 * download é o assunto da peça, e não um apêndice na última linha.
 *
 * ── AS REGRAS ──────────────────────────────────────────────────────────────
 *
 * Sem superlativo e sem defender o app. "O único aplicativo que calcula de
 * verdade" é o mesmo erro que "a casa é calculada, não é chute": quem está
 * lendo não perguntou, e a frase planta a dúvida que não existia. O que
 * convence é dizer o que a tela faz.
 *
 * `onde` usa o nome REAL da aba, de `src/i18n/appI18n.ts`: Perfil, Mapa Natal,
 * Grupos, Previsões, Assinatura, Configurações. Peça que manda a pessoa para
 * uma aba que não existe é pior que peça nenhuma.
 *
 * `ponte` é o fecho da legenda, específico do recurso.
 *
 * Sem travessão.
 */

export const RECURSO = {
  mapaNatal: {
    titulo: 'Seu mapa,\ncalculado',
    tela: 'mapa',
    texto: 'Data, hora e cidade do nascimento, e o mapa sai pronto. Os dez ' +
      'planetas, as doze casas, o ascendente e o Meio do Céu, com as posições ' +
      'em grau. O cálculo usa a mesma efeméride que astrólogo profissional ' +
      'usa. E as casas saem em Placidus, não em divisão aproximada.',
    onde: 'Aba Mapa Natal',
    ponte: 'Seu mapa sai em três perguntas, de graça, no link da bio.',
  },

  perfilAstrologico: {
    titulo: 'O que o mapa\ndiz de você',
    tela: 'perfil',
    texto: 'A roda mostra onde os planetas estão. O Perfil Astrológico diz o que ' +
      'isso significa. Cada planeta no seu signo e na sua casa, os aspectos ' +
      'entre eles, o regente do mapa, os pontos angulares. São textos ' +
      'escritos e revisados um a um, não frases geradas na hora.',
    onde: 'Aba Perfil',
    ponte: 'O perfil completo abre junto com o mapa, no link da bio.',
  },

  statusDoDia: {
    titulo: 'O seu dia,\nem um número',
    tela: 'inicio',
    texto: 'O app compara o céu de hoje com o mapa de nascimento e resume o ' +
      'resultado num número, com a faixa em que ele cai. Não é sorte do dia. ' +
      'É a soma dos trânsitos que tocam pontos do mapa agora, com peso por ' +
      'proximidade. Abaixo do número vem o que puxou para cima e o que puxou ' +
      'para baixo.',
    onde: 'Aba Perfil, no topo',
    ponte: 'Seu dia calculado todo dia, no link da bio.',
  },

  oitoAreas: {
    titulo: 'Oito áreas,\noito respostas',
    tela: 'inicio',
    texto: 'Amor, saúde, família, comunicação, carreira, finanças, espiritualidade ' +
      'e transformação. Cada uma recebe a própria nota. O mesmo dia pode ' +
      'estar ótimo para conversar e péssimo para assinar contrato. A conta ' +
      'vem das casas e dos planetas que regem cada área.',
    onde: 'Aba Perfil',
    ponte: 'As oito áreas do seu dia, no link da bio.',
  },

  transitosPessoais: {
    titulo: 'O que o céu\nfaz no seu mapa',
    tela: 'transitos',
    // "com que orbe" saiu: numa peça de produto, quem lê não sabe o que é orbe,
    // e a informação que importa ali é o quanto falta, não o nome da medida
    texto: 'Trânsito é onde os planetas estão agora. O que importa é onde eles ' +
      'caem num mapa, e é isso que esta tela mostra. Qual planeta toca qual ' +
      'ponto, em que parte da vida isso cai, e por quantos dias ainda vale. É ' +
      'a diferença entre previsão para todo mundo e leitura de uma pessoa só.',
    onde: 'Aba Perfil, em Trânsitos Pessoais',
    ponte: 'Veja os trânsitos sobre o seu mapa, no link da bio.',
  },

  previsao: {
    titulo: 'O que vem\npela frente',
    tela: 'previsao',
    texto: 'Os eventos do céu nas próximas semanas, já filtrados pelo que toca o ' +
      'mapa. Lunações, ingressos, eclipses, viradas de retrógrado. Cada um ' +
      'com a data, a casa em que cai e o que costuma pedir. Serve para marcar ' +
      'o que importa antes de o mês começar.',
    onde: 'Aba Previsões',
    ponte: 'Sua agenda do céu, no link da bio.',
  },

  linhaDoTempo: {
    titulo: 'A linha do tempo\ndos planetas',
    tela: 'previsao',
    texto: 'Um planeta, e todo o caminho dele. Quando entra em cada signo, quando ' +
      'fica retrógrado, quando volta a andar, e em que casa isso acontece. ' +
      'Saturno leva dois anos e meio por signo. Ver esse período inteiro ' +
      'explica coisas que o dia de hoje sozinho não explica.',
    onde: 'Aba Previsões, em Linha do Tempo',
    ponte: 'A linha do tempo do seu mapa, no link da bio.',
  },

  grupos: {
    titulo: 'O céu\ndos seus',
    tela: 'grupos',
    texto: 'Um grupo reúne as pessoas que se acompanha e mostra o dia de cada uma ' +
      'lado a lado. Dá para abrir o mapa completo de quem compartilhou o ' +
      'nascimento. E dá para criar o perfil de quem não usa o app, como mãe, ' +
      'filho ou sócio, digitando os dados de nascimento.',
    onde: 'Aba Grupos',
    ponte: 'Crie seu grupo no link da bio.',
  },

  sinastria: {
    titulo: 'Dois mapas,\nsobrepostos',
    tela: 'grupos',
    texto: 'Sinastria é o que acontece quando um mapa encosta no outro. Onde os ' +
      'planetas de uma pessoa caem nas casas da outra, e que ângulos se ' +
      'formam entre os dois. Explica por que uma relação é fácil num assunto ' +
      'e trava sempre no mesmo outro.',
    onde: 'Aba Grupos, no card do membro',
    ponte: 'Compare dois mapas no link da bio.',
  },

  agenteWhatsApp: {
    titulo: 'Astrologia\nno WhatsApp',
    tela: 'inicio',
    texto: 'Assinante conversa com o app pelo WhatsApp e recebe o resumo do dia de ' +
      'manhã. As respostas usam o mapa da pessoa, os trânsitos de hoje e os ' +
      'mesmos textos revisados do aplicativo. Não é chute nem resposta ' +
      'genérica de robô.',
    onde: 'Configurações, em WhatsApp',
    ponte: 'Assine e converse pelo WhatsApp, no link da bio.',
  },
}

export const CHAVES_DE_RECURSO = Object.keys(RECURSO)

/**
 * Um recurso ainda não usado na janela.
 *
 * Determinístico pela data, como o conceito: regerar o mesmo dia devolve o
 * mesmo recurso.
 */
export function recursoDoDia(iso, usadas = new Set(), pedido = '') {
  if (pedido && pedido !== '*') {
    if (!RECURSO[pedido]) {
      throw new Error(`recurso "${pedido}" não existe. Há: ${CHAVES_DE_RECURSO.join(', ')}`)
    }
    return { chave: pedido, ...RECURSO[pedido] }
  }

  const semente = Number(String(iso).replace(/-/g, '')) || 0
  const total = CHAVES_DE_RECURSO.length

  for (let i = 0; i < total; i++) {
    const chave = CHAVES_DE_RECURSO[(semente + i) % total]
    if (!usadas.has(`recurso:${chave}`)) return { chave, ...RECURSO[chave] }
  }

  const chave = CHAVES_DE_RECURSO[semente % total]
  return { chave, ...RECURSO[chave] }
}
