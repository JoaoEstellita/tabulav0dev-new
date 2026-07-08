// Catálogo pt-BR: Nódulos Lunares — eixo Nódulo Norte por signo
// Fonte temática: blog Hector Othon (astrothonodoslunares.blogspot.com) — reescrita original completa
// Tradição: evolutiva/kármica, adaptada à voz psicológica do app (não-determinista)
// 12 entradas: Nódulo Norte em cada signo (o Nódulo Sul é o signo oposto, tratado no mesmo texto)
// Chave: natal:nn_sign_{sign}
// Regras: presente simples, não-determinístico, mínimo 3 frases, mínimo 50 chars

export const LUNAR_NODE_SIGN_PTBR_OVERRIDES: Record<string, string> = {

  'natal:nn_sign_aries':
    'O Nódulo Norte em Áries convida a desenvolver autonomia, iniciativa e a coragem de agir em nome próprio. O Nódulo Sul em Libra indica uma zona de conforto nos relacionamentos: a tendência familiar é decidir pelos olhos do outro, adiar escolhas para preservar a harmonia e se definir pela parceria. O crescimento passa por descobrir o que você quer independentemente de agradar, sustentar posições próprias e aprender que o conflito saudável não destrói vínculos verdadeiros — fortalece a presença com que você chega neles.',

  'natal:nn_sign_taurus':
    'O Nódulo Norte em Touro convida a construir estabilidade, presença no corpo e uma relação serena com o próprio valor. O Nódulo Sul em Escorpião aponta familiaridade com a intensidade: crises, fusões emocionais profundas e a sensação de que só o que é dramático é real. O caminho de crescimento troca a montanha-russa pela constância — aprender a confiar, relaxar o controle, nutrir prazeres simples e deixar que a segurança nasça de dentro, sem precisar ser testada pelo abismo.',

  'natal:nn_sign_gemini':
    'O Nódulo Norte em Gêmeos convida a cultivar curiosidade genuína, escuta e troca com o ambiente imediato. O Nódulo Sul em Sagitário indica conforto nas grandes verdades prontas: a tendência é pregar em vez de perguntar, generalizar em vez de observar e se apegar a convicções que dispensam o contraditório. O crescimento acontece quando você se permite não saber, coleta perspectivas diferentes antes de concluir e descobre que a sabedoria também mora nas conversas pequenas e nos detalhes do cotidiano.',

  'natal:nn_sign_cancer':
    'O Nódulo Norte em Câncer convida a desenvolver intimidade emocional, cuidado e a coragem de sentir. O Nódulo Sul em Capricórnio aponta uma zona de conforto no controle e no desempenho: a tendência familiar é responder à vida com dever, estrutura e autossuficiência, mantendo as emoções sob gestão. O caminho de crescimento passa por permitir vulnerabilidade, receber cuidado além de provê-lo e reconhecer que pertencer a um lar interno importa tanto quanto qualquer conquista externa.',

  'natal:nn_sign_leo':
    'O Nódulo Norte em Leão convida a ocupar o centro da própria vida: expressar talentos com autoria, criar, liderar pelo coração e se permitir ser visto. O Nódulo Sul em Aquário indica conforto na neutralidade do grupo — observar de longe, servir à causa coletiva e evitar o risco de ser especial. O crescimento acontece quando você deixa de diluir o próprio brilho em nome do pertencimento e descobre que expressar quem você é, com generosidade, também é uma forma de servir.',

  'natal:nn_sign_virgo':
    'O Nódulo Norte em Virgem convida a encarnar: transformar inspiração em prática, visão em ofício, intenção em rotina que sustenta. O Nódulo Sul em Peixes aponta familiaridade com o difuso — sonhar, absorver emoções alheias, escapar do concreto quando ele pesa. O caminho de crescimento pede discernimento amoroso: separar o essencial do ilusório, cuidar do corpo e dos detalhes, e descobrir que o sagrado também se manifesta na tarefa bem-feita e no serviço cotidiano.',

  'natal:nn_sign_libra':
    'O Nódulo Norte em Libra convida a desenvolver a arte do encontro: cooperar, escutar e construir com o outro o que não se constrói sozinho. O Nódulo Sul em Áries indica uma zona de conforto na autossuficiência — resolver tudo por conta própria, competir e impor o próprio ritmo. O crescimento passa por perceber que vencer sozinho satisfaz menos do que parecia, valorizar o que o outro pensa e sente, e aprender que equilibrar interesses não é perder identidade — é ampliá-la.',

  'natal:nn_sign_scorpio':
    'O Nódulo Norte em Escorpião convida a mergulhar: intimidade real, transformação e a coragem de compartilhar recursos e vulnerabilidades. O Nódulo Sul em Touro aponta conforto no estável e no acumulado — apegar-se ao que é seguro, resistir a mudanças e confundir posse com segurança. O caminho de crescimento pede desapego do que já não serve, disposição para atravessar crises como portais de renovação e a descoberta de que a verdadeira solidez sobrevive às transformações.',

  'natal:nn_sign_sagittarius':
    'O Nódulo Norte em Sagitário convida a erguer os olhos: buscar sentido, confiar na intuição e viver a vida como travessia que expande a consciência. O Nódulo Sul em Gêmeos indica conforto na dispersão mental — colecionar informações, opinar sobre tudo e se perder em mil curiosidades sem síntese. O crescimento acontece quando você escolhe uma direção que vibra grande, transforma dados em compreensão vivida e aceita que algumas verdades só se revelam a quem caminha.',

  'natal:nn_sign_capricorn':
    'O Nódulo Norte em Capricórnio convida a assumir autoridade sobre a própria vida: definir metas, sustentar compromissos e construir algo que permaneça. O Nódulo Sul em Câncer aponta familiaridade com a dependência emocional — buscar amparo, reagir pela sensibilidade e usar o passado como refúgio. O caminho de crescimento passa por amadurecer sem endurecer: honrar as raízes sem morar nelas, transformar necessidade de proteção em capacidade de estruturar e descobrir o prazer de ser responsável pelo próprio destino.',

  'natal:nn_sign_aquarius':
    'O Nódulo Norte em Aquário convida a servir a algo maior que o próprio palco: causas, redes, visão de futuro e a liberdade que inclui todos. O Nódulo Sul em Leão indica conforto na centralidade — a necessidade familiar de aplauso, reconhecimento pessoal e drama como forma de existir. O crescimento acontece quando o brilho individual vira contribuição coletiva, quando você lidera sem precisar ser o centro e descobre que pertencer a uma visão compartilhada liberta mais do que qualquer plateia.',

  'natal:nn_sign_pisces':
    'O Nódulo Norte em Peixes convida a confiar no fluxo: desenvolver fé, compaixão e a capacidade de se render ao que não se controla. O Nódulo Sul em Virgem aponta conforto na análise e no aperfeiçoamento — a tendência familiar é gerenciar a vida pelos detalhes, criticar o imperfeito e acreditar que só o esforço meticuloso garante segurança. O caminho de crescimento pede soltar o excesso de controle, acolher o mistério e a imperfeição, e descobrir que existe uma ordem maior que trabalha a seu favor quando você para de supervisioná-la.',
}
