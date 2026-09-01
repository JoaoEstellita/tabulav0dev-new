// Leitura curada pt-BR do Tzolkin Dreamspell. Linguagem simbólica ("simboliza",
// "pode indicar"), nunca fato objetivo. Palavras de selo/tom vêm das constants;
// aqui ficam os textos de papel do oráculo, família, castelo e o disclaimer.

export const TZOLKIN_ORACLE_ROLE_PT: Record<'guide' | 'analog' | 'antipode' | 'occult', { title: string; text: string }> = {
  guide: { title: 'Guia', text: 'A energia que orienta e conduz o Kin — o poder superior que aponta o caminho. Simboliza a direção que amplia o propósito.' },
  analog: { title: 'Análogo', text: 'O apoio e a complementaridade — a força que caminha ao lado, facilitando e sustentando. Pode indicar parcerias e afinidades naturais.' },
  antipode: { title: 'Antípoda', text: 'O desafio que fortalece — a polaridade que estica e desenvolve. NÃO é incompatibilidade: é o atrito que faz crescer.' },
  occult: { title: 'Oculto', text: 'O poder escondido — a complementaridade interna que se revela com o tempo. Simboliza o potencial que amadurece por dentro.' },
}

export const TZOLKIN_FAMILY_PT: Record<string, { title: string; text: string }> = {
  portal: { title: 'Família Portal', text: 'Canaliza energia entre dimensões — abre passagens e ativa. Simboliza a ponte entre mundos.' },
  polar: { title: 'Família Polar', text: 'Estabiliza os polos — sustenta o equilíbrio entre opostos. Pode indicar firmeza e constância.' },
  cardinal: { title: 'Família Cardinal', text: 'Abre direções — inicia movimento e aponta rumos. Simboliza o impulso que orienta.' },
  core: { title: 'Família Núcleo', text: 'Sustenta o centro — mantém a coerência e a essência. Pode indicar profundidade e ancoragem.' },
  signal: { title: 'Família Sinal', text: 'Comunica e revela — traduz e transmite. Simboliza a mensagem que se torna visível.' },
}

export const TZOLKIN_CASTLE_PT: Record<string, { title: string; text: string }> = {
  red: { title: 'Castelo Vermelho do Leste', text: 'A Torre do Nascimento — onde tudo começa. Tema: iniciar.' },
  white: { title: 'Castelo Branco do Norte', text: 'A Torre da Travessia — refinamento e passagem. Tema: atravessar.' },
  blue: { title: 'Castelo Azul do Oeste', text: 'A Torre da Magia — transformação e queima. Tema: transformar.' },
  yellow: { title: 'Castelo Amarelo do Sul', text: 'A Torre da Doação — amadurecimento e inteligência. Tema: florescer.' },
  green: { title: 'Castelo Verde Central', text: 'A Torre do Encantamento — sincronização e matriz. Tema: harmonizar.' },
}

export const TZOLKIN_DISCLAIMER_PT =
  'O sistema desta área é o Dreamspell / Sincronário das 13 Luas, uma interpretação moderna do ciclo de 260 Kins inspirada no Tzolk\'in maia tradicional. As leituras são simbólicas — não determinam personalidade nem destino.'
