/**
 * Conteúdo curado do Guna Milan (pt-BR). Explica cada um dos 8 kutas, a leitura
 * por faixa de pontos, as bandas do total (/36) e os doshas (Nadi/Bhakoot).
 * Registro psicológico: compatibilidade é tendência, NÃO veredito.
 */
export interface KutaContent {
  nome: string
  oQueMede: string
  alta: string // pontuação alta (perto do máximo)
  media: string
  baixa: string // pontuação baixa / zero
}

// Chaves = key dos kutas em gunaMilan.ts
export const KUTA_PTBR: Record<string, KutaContent> = {
  varna: {
    nome: 'Varna',
    oQueMede: 'afinidade de propósito e de temperamento espiritual — o "nível de trabalho interior" de cada um.',
    alta: 'Os caminhos de crescimento se reconhecem; há respeito natural pelo modo de viver do outro.',
    media: '—',
    baixa: 'Prioridades internas diferentes; exige respeitar o ritmo espiritual de cada um sem querer nivelar.',
  },
  vashya: {
    nome: 'Vashya',
    oQueMede: 'a atração e a influência mútua — o magnetismo e como cada um "puxa" o outro.',
    alta: 'Atração fácil e influência equilibrada; um cede ao outro sem perder a si.',
    media: 'Atração presente, mas a dança de poder pede consciência.',
    baixa: 'Magnetismo desigual; cuidado pra que a influência não vire controle.',
  },
  tara: {
    nome: 'Tara',
    oQueMede: 'a compatibilidade de destino e bem-estar — como as estrelas de nascimento se sustentam mutuamente.',
    alta: 'As trajetórias se protegem; a relação tende a trazer sorte e estabilidade um pro outro.',
    media: 'Sustentação parcial — uma direção flui melhor que a outra.',
    baixa: 'Os ciclos nem sempre se apoiam; atenção a fases em que um drena o outro.',
  },
  yoni: {
    nome: 'Yoni',
    oQueMede: 'a compatibilidade instintiva e sexual — a química física e a linguagem do corpo (simbolizada por animais).',
    alta: 'Química instintiva forte; os corpos e os impulsos se entendem sem esforço.',
    media: 'Atração instintiva razoável; ritmos diferentes que se acomodam com tempo.',
    baixa: 'Instintos em chaves distintas; a intimidade pede paciência e diálogo.',
  },
  graha_maitri: {
    nome: 'Graha Maitri',
    oQueMede: 'a amizade mental e psicológica — se as mentes (regentes dos signos lunares) são amigas.',
    alta: 'Sintonia mental e afetiva; conversa fácil e apoio emocional natural.',
    media: 'Mentes neutras — se entendem, mas o vínculo intelectual precisa de cultivo.',
    baixa: 'Modos de pensar e sentir bem diferentes; a amizade se constrói com esforço consciente.',
  },
  gana: {
    nome: 'Gana',
    oQueMede: 'o temperamento e a natureza de cada um (divina, humana ou intensa/rakshasa).',
    alta: 'Temperamentos que combinam; o jeito de reagir ao mundo se encaixa.',
    media: 'Naturezas diferentes que se complementam com respeito.',
    baixa: 'Temperamentos contrastantes (ex.: sereno × intenso); harmonia exige aceitar o modo do outro.',
  },
  bhakoot: {
    nome: 'Bhakoot',
    oQueMede: 'a harmonia emocional e do dia a dia a dois — a relação entre os signos lunares.',
    alta: 'Vida em comum flui; prosperidade e bem-estar tendem a crescer juntos.',
    media: '—',
    baixa: 'Bhakoot dosha: os signos lunares estão em ângulo tenso (2/12, 5/9 ou 6/8). Pede ajuste de expectativas no cotidiano — atenuado quando Graha Maitri e Nadi estão bem.',
  },
  nadi: {
    nome: 'Nadi',
    oQueMede: 'a vitalidade, a saúde e o vínculo profundo do casal — o kuta de maior peso.',
    alta: 'Nadi diferente: vitalidades que se complementam. Tradicionalmente o melhor sinal do mapa a dois.',
    media: '—',
    baixa: 'Nadi dosha (mesma nadi): tradição pede atenção à vitalidade/saúde do vínculo. É mitigável e NÃO é veredito — muitos casais fortes convivem com ele.',
  },
}

export interface BandContent { faixa: string; texto: string }
export const GUNA_BANDS_PTBR: Record<string, BandContent> = {
  baixo: { faixa: 'abaixo de 18/36', texto: 'Compatibilidade tradicional baixa neste sistema — o que NÃO condena a relação. Guna Milan é uma lente entre várias; olhe também o Nadi (o mais importante) e a sinastria ocidental.' },
  medio: { faixa: '18–23/36', texto: 'Compatibilidade média — base suficiente, com pontos que pedem consciência. Vale ler kuta a kuta o que flui e o que atrita.' },
  bom: { faixa: '24–31/36', texto: 'Boa compatibilidade — os fundamentos se apoiam bem. Relação com terreno fértil.' },
  excelente: { faixa: '32–36/36', texto: 'Compatibilidade excelente pela tradição — forte sintonia nos oito fatores.' },
}

// Nota fixa exibida junto ao placar.
export const GUNA_DISCLAIMER_PTBR = 'Guna Milan é a compatibilidade védica clássica (uma lente entre muitas). Placar baixo não é veredito, e alto não garante nada — a relação real é feita no dia a dia. O Nadi é o fator de maior peso.'
