import type { AspectName } from './aspects.types'

const SYMBOLS: Record<AspectName, string> = {
  'conjunção': '☌',
  'oposição': '☍',
  'quadratura': '□',
  'trígono': '△',
  'sextil': '✶',
  'quincúncio': '⚻',
  'semissextil': '∿',
  'semiquadratura': '∠',
  'sesquiquadratura': '∡',
}

const DESCRIPTIONS: Record<AspectName, string> = {
  'conjunção': 'União de forças. Amplifica o tema dos planetas envolvidos (pode ser harmônico ou tenso conforme os planetas).',
  'oposição': 'Polaridade e confronto. Pedidos de equilíbrio e negociação entre dois polos; eventos externos são comuns.',
  'quadratura': 'Tensão dinâmica. Atritos que exigem ação e ajuste; grande potencial de mudança pela pressão.',
  'trígono': 'Fluidez e facilidade. As coisas tendem a fluir, abrindo caminhos naturais e suporte entre áreas.',
  'sextil': 'Oportunidade e cooperação. Portas que se abrem mediante iniciativa; favorece aprendizados e acordos.',
  'quincúncio': 'Ajustes e reorientações. Incompatibilidades sutis pedem reorganização; sensação de desalinho que pede calibragem.',
  'semissextil': 'Transição sutil. Temas adjacentes se tocam com leve estímulo; pede atenção a detalhes e conexões.',
  'semiquadratura': 'Atrito leve. Pequenas fricções ou incômodos recorrentes que pedem correções pontuais.',
  'sesquiquadratura': 'Tensão acumulada. Desalinhamentos medianos que pressionam mudanças gradativas e persistentes.',
}

function normalizeType(t: string): AspectName | any {
  const map: Record<string, AspectName> = {
    'conjuncao': 'conjunção', 'conjuncao': 'conjunção', 'conjunção': 'conjunção',
    'oposicao': 'oposição', 'oposição': 'oposição',
    'trigono': 'trígono', 'trígono': 'trígono',
    'quadratura': 'quadratura',
    'sextil': 'sextil',
    'quincuncio': 'quincúncio', 'quincúncio': 'quincúncio',
    'semissextil': 'semissextil',
    'semiquadratura': 'semiquadratura',
    'sesquiquadratura': 'sesquiquadratura',
  }
  const k = t.normalize('NFD').replace(/\p{Diacritic}/gu,'').toLowerCase()
  return map[k] || t
}

export function getAspectSymbol(type: AspectName | string): string {
  const t = normalizeType(type as string) as AspectName
  const sym = SYMBOLS[t]
  // Fallback para quincúncio se fonte não suportar
  if (t === 'quincúncio' && !sym) return '150°'
  return sym || '•'
}

export function getAspectDescription(type: AspectName | string): string {
  const t = normalizeType(type as string) as AspectName
  return DESCRIPTIONS[t] || 'Aspecto ativo.'
}

// Notas curtas por par de planetas (parcial, pode ser expandido)
const PAIR_NOTES: Record<string, string> = {
  'Mars|Saturn|quadratura': 'Esforço sob pressão; disciplina versus impulso.',
  'Mars|Saturn|oposição': 'Choque de freio e aceleração; testar limites com cautela.',
  'Sun|Saturn|quadratura': 'Responsabilidades e realidade pedem maturidade.',
  'Sun|Jupiter|trígono': 'Expansão e confiança favorecidas; oportunidades crescem.',
  'Venus|Uranus|oposição': 'Surpresas afetivas; busca por liberdade versus vínculo.',
  // Ampliadas
  'Sun|Moon|conjunção': 'Integração de identidade e emoções; foco subjetivo elevado.',
  'Sun|Moon|oposição': 'Conflito entre vontade consciente e necessidades emocionais; pede harmonização.',
  'Sun|Moon|trígono': 'Harmonia entre expressão pessoal e sentimentos; bem‑estar e fluidez emocional.',
  'Sun|Moon|quadratura': 'Choque entre desejos conscientes e emoções; desafios em decisões e equilíbrio.',
  'Sun|Moon|sextil': 'Oportunidade de integrar identidade e emoções de forma construtiva.',
  // Sol – Saturno
  'Sun|Saturn|conjunção': 'Foco, responsabilidade e realidade; testes de maturidade.',
  'Sun|Saturn|quadratura': 'Pressão de deveres; autocrítica e necessidade de estrutura.',
  'Sun|Saturn|oposição': 'Autoridade externa desafia a vontade; limites e paciência.',
  'Sun|Saturn|trígono': 'Construção paciente e sólida; reconhecimento por mérito.',
  'Sun|Saturn|sextil': 'Organização e constância facilitadas; bom para compromissos.',
  // Sol – Urano
  'Sun|Uranus|conjunção': 'Vontade de romper padrões; autenticidade e virada súbita.',
  'Sun|Uranus|quadratura': 'Rebeldia x estabilidade; mudanças bruscas pedem adaptação.',
  'Sun|Uranus|oposição': 'Imprevisibilidade nas relações/ambiente; liberdade em destaque.',
  'Sun|Uranus|trígono': 'Criatividade e inovação fluem; soluções originais.',
  'Sun|Uranus|sextil': 'Abertura para novidades e atualização de rotinas.',
  // Sol – Netuno
  'Sun|Neptune|conjunção': 'Visão, idealismo e sensibilidade; cuide de confusões.',
  'Sun|Neptune|quadratura': 'Neblina de objetivos; risco de dispersão ou idealização.',
  'Sun|Neptune|oposição': 'Projeções/ilusões externas; peça clareza e checagens.',
  'Sun|Neptune|trígono': 'Inspiração e empatia; favorece artes e espiritualidade.',
  'Sun|Neptune|sextil': 'Imaginação construtiva; intuição colaborativa.',
  // Sol – Plutão
  'Sun|Pluto|conjunção': 'Intensidade e poder pessoal; renovações profundas.',
  'Sun|Pluto|quadratura': 'Crises transformadoras; confrontos com controle/poder.',
  'Sun|Pluto|oposição': 'Jogos de força externos; negociar e regenerar.',
  'Sun|Pluto|trígono': 'Força de vontade regeneradora; reformas bem‑sucedidas.',
  'Sun|Pluto|sextil': 'Oportunidade de mudança estratégica e cura.',
  // Lua – Vênus
  'Moon|Venus|conjunção': 'Afeto, cuidado e harmonia; busca de conforto.',
  'Moon|Venus|quadratura': 'Excesso de agradar x necessidades próprias; carências.',
  'Moon|Venus|oposição': 'Afeto recíproco em ajuste; negociar expectativas.',
  'Moon|Venus|trígono': 'Afetividade fluida; social e estética favorecidas.',
  'Moon|Venus|sextil': 'Apoio emocional e conciliação fáceis.',
  // Lua – Marte
  'Moon|Mars|conjunção': 'Reatividade/empenho emocional altos; assertividade.',
  'Moon|Mars|quadratura': 'Irritabilidade/tensão; canalizar energia ajuda.',
  'Moon|Mars|oposição': 'Conflitos de humor/desejo; melhor negociar pausas.',
  'Moon|Mars|trígono': 'Coragem emocional; ação protetiva e dinâmica.',
  'Moon|Mars|sextil': 'Iniciativa suave; motivação para cuidar/agir.',
  // Lua – Júpiter
  'Moon|Jupiter|conjunção': 'Ânimo elevado e generosidade; confiança emocional.',
  'Moon|Jupiter|quadratura': 'Excessos no humor/apetite; moderação ajuda.',
  'Moon|Jupiter|oposição': 'Expectativas infladas; calibrar promessas e apoio.',
  'Moon|Jupiter|trígono': 'Proteção e otimismo; favorece sociabilidade e fé.',
  'Moon|Jupiter|sextil': 'Boa vontade e apoio emocional disponíveis.',
  // Lua – Saturno
  'Moon|Saturn|conjunção': 'Sobriedade e responsabilidade afetiva; contenção.',
  'Moon|Saturn|quadratura': 'Melancolia/pressões; cuidar de limites e autocuidado.',
  'Moon|Saturn|oposição': 'Demandas externas pesam no humor; pedir ajuda.',
  'Moon|Saturn|trígono': 'Estabilidade emocional; comprometimento e maturidade.',
  'Moon|Saturn|sextil': 'Rotina e suporte estruturado favorecem bem‑estar.',
  // Lua – Urano
  'Moon|Uranus|conjunção': 'Oscilações rápidas de humor; impulso por novidade.',
  'Moon|Uranus|quadratura': 'Impaciência/irritação; necessidade de mudar o ritmo.',
  'Moon|Uranus|oposição': 'Instabilidade no ambiente; flexibilidade emocional.',
  'Moon|Uranus|trígono': 'Liberdade afetiva; insights e frescor emocional.',
  'Moon|Uranus|sextil': 'Abertura a mudanças diárias leves; improviso positivo.',
  // Lua – Netuno
  'Moon|Neptune|conjunção': 'Hipersensibilidade e imaginação; sonhos vívidos.',
  'Moon|Neptune|quadratura': 'Confusão/absorção emocional; cuidar de limites.',
  'Moon|Neptune|oposição': 'Projeções e expectativas; buscar clareza e descanso.',
  'Moon|Neptune|trígono': 'Empatia e inspiração; bom para artes e recolhimento.',
  'Moon|Neptune|sextil': 'Intuição disponível; suavidade no trato afetivo.',
  // Lua – Plutão
  'Moon|Pluto|conjunção': 'Intensidade emocional; catarses e cura profunda.',
  'Moon|Pluto|quadratura': 'Controle/ciúmes; transformar padrões emocionais.',
  'Moon|Pluto|oposição': 'Jogos de poder no ambiente; praticar desapego.',
  'Moon|Pluto|trígono': 'Regeneração afetiva; força interior serena.',
  'Moon|Pluto|sextil': 'Oportunidades de limpeza emocional e renovação.',
  // Mercúrio – Vênus
  'Mercury|Venus|conjunção': 'Charme e diplomacia; comunicação afetiva.',
  'Mercury|Venus|trígono': 'Linguagem afetuosa e estética; bom para acordos e arte.',
  'Mercury|Venus|sextil': 'Trato agradável; mediações fáceis.',
  'Mercury|Venus|quadratura': 'Dizer/sentir em descompasso; atenção a diplomacia.',
  'Mercury|Venus|oposição': 'Expectativas distintas; alinhar valores e mensagem.',
  // Mercúrio – Júpiter
  'Mercury|Jupiter|conjunção': 'Expansão mental; visão ampla e aprendizado.',
  'Mercury|Jupiter|trígono': 'Síntese e comunicação inspirada; estudos fluem.',
  'Mercury|Jupiter|sextil': 'Oportunidades intelectuais; networking favorecido.',
  'Mercury|Jupiter|quadratura': 'Exageros/precipitações no discurso; calibrar fatos.',
  'Mercury|Jupiter|oposição': 'Opiniões em disputa; ouvir mais, afirmar melhor.',
  // Mercúrio – Saturno
  'Mercury|Saturn|conjunção': 'Foco e método; pensamento crítico e estruturado.',
  'Mercury|Saturn|trígono': 'Clareza e planejamento; bom para escrever/organizar.',
  'Mercury|Saturn|sextil': 'Estudo disciplinado; acordos realistas.',
  'Mercury|Saturn|quadratura': 'Rigidez/medo de erro; revisar sem paralisar.',
  'Mercury|Saturn|oposição': 'Cobranças e prazos; comunicar com objetividade.',
  // Vênus – Marte
  'Venus|Mars|conjunção': 'Magnetismo e desejo; impulso criativo/afetivo alto.',
  'Venus|Mars|trígono': 'Paixão harmoniosa; fertilidade criativa.',
  'Venus|Mars|sextil': 'Chama cooperativa; iniciativas afetivas.',
  'Venus|Mars|quadratura': 'Tensão entre desejo e afeto; ciúmes/impulsividade.',
  'Venus|Mars|oposição': 'Atração com diferenças; negociar ritmos.',
  // Marte – Júpiter
  'Mars|Jupiter|conjunção': 'Empreendedorismo e coragem; ampliar ações.',
  'Mars|Jupiter|trígono': 'Ânimo generoso; êxitos por iniciativa.',
  'Mars|Jupiter|sextil': 'Oportunidades de expansão via ação.',
  'Mars|Jupiter|quadratura': 'Imprudência/excessos; moderar ímpeto.',
  'Mars|Jupiter|oposição': 'Metas em disputa; alinhar esforço e direção.',
  // Marte – Netuno
  'Mars|Neptune|conjunção': 'Ação inspirada, porém difusa; foco ajuda.',
  'Mars|Neptune|trígono': 'Intuição operativa; arte e compaixão em ação.',
  'Mars|Neptune|sextil': 'Sutileza eficaz; agir com sensibilidade.',
  'Mars|Neptune|quadratura': 'Drenagem/autoengano; defina limites e prioridades.',
  'Mars|Neptune|oposição': 'Metas nebulosas; busque validações e descanso.',
  // Júpiter – Saturno
  'Jupiter|Saturn|conjunção': 'Ciclo de consolidação; expandir com responsabilidade.',
  'Jupiter|Saturn|trígono': 'Expansão sustentável; frutos do planejamento.',
  'Jupiter|Saturn|sextil': 'Acordos sólidos; oportunidades reguladas.',
  'Jupiter|Saturn|quadratura': 'Fricção entre crescimento e limites; calibrar ambição.',
  'Jupiter|Saturn|oposição': 'Pressões externas ao progresso; estratégia.',
  // Saturno – Urano
  'Saturn|Uranus|conjunção': 'Reformas estruturais; ruptura com base.',
  'Saturn|Uranus|trígono': 'Inovação com método; upgrades estáveis.',
  'Saturn|Uranus|sextil': 'Modernização gradual e segura.',
  'Saturn|Uranus|quadratura': 'Tradicional x novo; ajustes de regras.',
  'Saturn|Uranus|oposição': 'Choques de sistema; negociar liberdade e ordem.',
  // Urano – Netuno
  'Uranus|Neptune|conjunção': 'Intuições coletivas e mudanças sutis.',
  'Uranus|Neptune|trígono': 'Inspiração visionária; avanços humanitários.',
  'Uranus|Neptune|sextil': 'Sinais de tendências; sensibilidade à mudança.',
  'Uranus|Neptune|quadratura': 'Incertezas sistêmicas; adaptar percepções.',
  'Uranus|Neptune|oposição': 'Tensões entre ideal e ruptura; novos paradigmas.',
  // Netuno – Plutão
  'Neptune|Pluto|conjunção': 'Transformações espirituais profundas.',
  'Neptune|Pluto|trígono': 'Regeneração silenciosa; visão de longo prazo.',
  'Neptune|Pluto|sextil': 'Integração sutil de profundezas e ideais.',
  'Neptune|Pluto|quadratura': 'Crises de sentido; purgação e renascimento.',
  'Neptune|Pluto|oposição': 'Coletivo em catarse; foco em cura estrutural.',
}

export function getPairNote(p1: string, p2: string, type: AspectName): string | undefined {
  const key1 = `${p1}|${p2}|${type}`
  const key2 = `${p2}|${p1}|${type}`
  return PAIR_NOTES[key1] || PAIR_NOTES[key2]
}


