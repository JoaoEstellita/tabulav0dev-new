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
}
