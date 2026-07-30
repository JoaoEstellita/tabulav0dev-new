/**
 * Conteúdo curado das Mahadashas (Vimshottari) — pt-BR. O tema de vida de cada
 * período planetário. Chave = regente (lowercase). Duração vem do motor (dasha).
 * Registro psicológico: descreve a ENERGIA do período, não eventos garantidos.
 */
export interface DashaContent {
  nome: string
  anos: number
  tema: string
  palavrasChave: string[]
}

export const DASHA_PTBR: Record<string, DashaContent> = {
  ketu: {
    nome: 'Ketu', anos: 7,
    tema: 'Período de desapego e busca interior. Coisas se encerram para abrir espaço ao essencial; o foco vira sentido, espiritualidade e o que não se vê. Menos mundo, mais alma.',
    palavrasChave: ['desapego', 'espiritualidade', 'encerramentos', 'introspecção'],
  },
  venus: {
    nome: 'Vênus', anos: 20,
    tema: 'Longo ciclo de amor, beleza e prazer. Relacionamentos, arte, conforto e vida social ganham centralidade. Tende a ser um tempo fértil pra afeto, criação e desfrute.',
    palavrasChave: ['amor', 'beleza', 'prazer', 'relações', 'arte'],
  },
  sun: {
    nome: 'Sol', anos: 6,
    tema: 'Tempo de identidade e propósito. Vontade de brilhar, assumir autoridade e ser reconhecido pelo que se é. Temas de liderança, direção de vida e figura paterna.',
    palavrasChave: ['identidade', 'autoridade', 'propósito', 'reconhecimento'],
  },
  moon: {
    nome: 'Lua', anos: 10,
    tema: 'Ciclo emocional e de cuidado. Família, casa, sensibilidade e vida interior pesam mais. Bom pra nutrir vínculos e a si; pede atenção ao humor e ao descanso.',
    palavrasChave: ['emoções', 'família', 'cuidado', 'sensibilidade'],
  },
  mars: {
    nome: 'Marte', anos: 7,
    tema: 'Período de ação e coragem. Energia pra iniciar, disputar e realizar; o corpo pede movimento. Cuidado com pressa e conflito — a força bem dirigida constrói.',
    palavrasChave: ['ação', 'coragem', 'iniciativa', 'energia'],
  },
  rahu: {
    nome: 'Rahu', anos: 18,
    tema: 'Longo ciclo de ambição e expansão para o inédito. Fome de mundo, de crescer e de romper padrões; pode trazer reviravoltas e obsessões. Grande potência se houver direção.',
    palavrasChave: ['ambição', 'expansão', 'o inédito', 'ruptura'],
  },
  jupiter: {
    nome: 'Júpiter', anos: 16,
    tema: 'Tempo de sabedoria, fé e crescimento. Expansão de horizontes, ensino, prosperidade e sentido. Um dos ciclos mais generosos — abre portas e amplia a visão.',
    palavrasChave: ['sabedoria', 'expansão', 'fé', 'prosperidade'],
  },
  saturn: {
    nome: 'Saturno', anos: 19,
    tema: 'O ciclo mais longo: maturidade, trabalho e responsabilidade. Colheita lenta e sólida; limites e provas que amadurecem. Recompensa o que é construído com disciplina.',
    palavrasChave: ['disciplina', 'trabalho', 'maturidade', 'estrutura'],
  },
  mercury: {
    nome: 'Mercúrio', anos: 17,
    tema: 'Período de intelecto e comunicação. Aprendizado, negócios, versatilidade e conexões. Mente ágil e mãos em muitos projetos; ótimo pra estudar, escrever e negociar.',
    palavrasChave: ['intelecto', 'comunicação', 'negócios', 'aprendizado'],
  },
}
