// Leitura curada pt-BR do Tzolkin Dreamspell. Linguagem simbólica ("simboliza",
// "pode indicar"), nunca fato objetivo. Palavras de selo/tom vêm das constants;
// aqui ficam os textos de papel do oráculo, família, castelo e o disclaimer.

export const TZOLKIN_ORACLE_ROLE_PT: Record<'guide' | 'analog' | 'antipode' | 'occult', { title: string; text: string }> = {
  guide: { title: 'Guia', text: 'O Guia é a energia que orienta e conduz o seu Kin — o poder superior que aponta o caminho e amplia o propósito. Ele mantém o mesmo tom e a mesma cor do Destino, como um farol que caminha à frente. Sintonizar com o Guia é confiar na direção que a vida sinaliza e deixar-se conduzir pelo que já está maduro em você.' },
  analog: { title: 'Análogo', text: 'O Análogo é o apoio e a complementaridade — a força parceira que caminha ao lado, facilitando, sustentando e equilibrando. Simboliza afinidades naturais, alianças e o que flui sem esforço. É o ombro amigo do seu Kin: onde há Análogo, há troca fértil e descanso.' },
  antipode: { title: 'Antípoda', text: 'A Antípoda é o desafio que fortalece — a polaridade que estica, provoca e desenvolve. NÃO é incompatibilidade nem inimigo: é o atrito necessário para crescer, o espelho que mostra o que falta integrar. Onde há Antípoda, há a maior chance de transformação, desde que você acolha a tensão como mestra.' },
  occult: { title: 'Oculto', text: 'O Oculto é o poder escondido — a complementaridade interna que se revela com o tempo. Some os números do seu Kin com ele em 21 e guarda um tesouro que não se vê à primeira vista. Simboliza o potencial adormecido, a força secreta que amadurece por dentro e se torna aliada quando você menos espera.' },
}

export const TZOLKIN_FAMILY_PT: Record<string, { title: string; text: string }> = {
  portal: { title: 'Família Portal', text: 'A Família Portal (Gateway) canaliza energia entre dimensões — abre passagens, ativa e conecta o visível ao invisível. Simboliza a ponte entre mundos: pessoas que transportam energia, sonhos e possibilidades de um plano a outro. Seu dom é abrir caminhos onde antes havia parede.' },
  polar: { title: 'Família Polar', text: 'A Família Polar estabiliza os polos — sustenta o equilíbrio entre opostos e mantém a corrente fluindo. Pode indicar firmeza, constância e a capacidade de segurar a tensão sem quebrar. É a força que ancora os extremos e permite que a vida pulse com ritmo.' },
  cardinal: { title: 'Família Cardinal', text: 'A Família Cardinal abre direções — inicia o movimento, aponta rumos e dá o primeiro passo. Simboliza o impulso que orienta e inaugura ciclos, a energia pioneira que rompe a inércia. Seu dom é começar e mostrar por onde seguir.' },
  core: { title: 'Família Núcleo', text: 'A Família Núcleo (Core) sustenta o centro — mantém a coerência, a essência e o coração da matriz. Pode indicar profundidade, ancoragem e a serenidade de quem não se dispersa. É o eixo silencioso ao redor do qual tudo se organiza.' },
  signal: { title: 'Família Sinal', text: 'A Família Sinal comunica e revela — traduz, transmite e torna visível o que estava oculto. Simboliza a mensagem que se faz forma, a ponte entre a percepção e a expressão. Seu dom é dar sinal, mostrar e decodificar o mistério.' },
}

export const TZOLKIN_CASTLE_PT: Record<string, { title: string; text: string }> = {
  red: { title: 'Castelo Vermelho do Leste', text: 'A Torre do Nascimento (Kins 1–52) — onde tudo começa. É a corte da iniciação, do impulso primordial e da semeadura. Tema: iniciar. Aqui se planta a intenção que percorrerá toda a matriz.' },
  white: { title: 'Castelo Branco do Norte', text: 'A Torre da Travessia (Kins 53–104) — refinamento, morte simbólica e passagem. É a corte do aperfeiçoamento e da purificação. Tema: atravessar. Aqui se cruza o limiar que separa o velho do novo.' },
  blue: { title: 'Castelo Azul do Oeste', text: 'A Torre da Magia (Kins 105–156) — transformação, queima e alquimia. É a corte da mudança e da experiência que transmuta. Tema: transformar. Aqui o que foi iniciado se dissolve e renasce em outra forma.' },
  yellow: { title: 'Castelo Amarelo do Sul', text: 'A Torre da Doação (Kins 157–208) — amadurecimento, inteligência e colheita. É a corte do florescimento e da entrega dos frutos. Tema: florescer. Aqui o que se transformou dá em abundância e sabedoria.' },
  green: { title: 'Castelo Verde Central', text: 'A Torre do Encantamento (Kins 209–260) — sincronização e a matriz do centro. É a corte que unifica todas as cores e sela o ciclo. Tema: harmonizar. Aqui a jornada inteira se integra num só encantamento.' },
}

export const TZOLKIN_DISCLAIMER_PT =
  'O sistema desta área é o Dreamspell / Sincronário das 13 Luas, uma interpretação moderna do ciclo de 260 Kins inspirada no Tzolk\'in maia tradicional. As leituras são simbólicas — não determinam personalidade nem destino.'
