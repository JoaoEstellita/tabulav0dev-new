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

export function getAspectSymbol(type: AspectName): string {
  return SYMBOLS[type] || '•'
}

export function getAspectDescription(type: AspectName): string {
  return DESCRIPTIONS[type] || 'Aspecto ativo.'
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
  'Sun|Moon|oposição': 'Conflito interno/externo entre vontade e necessidades emocionais.',
  'Mercury|Venus|trígono': 'Linguagem afetuosa e estética; bom para acordos e arte.',
  'Mercury|Venus|quadratura': 'Dizer/sentir em descompasso; atenção a diplomacia.',
  'Mars|Jupiter|trígono': 'Ânimo e iniciativa para crescer; coragem com visão.',
  'Mars|Jupiter|quadratura': 'Excesso de confiança/ímpeto; cuide da imprudência.',
  'Saturn|Uranus|quadratura': 'Tensão entre tradição e inovação; ajustes estruturais.',
  'Saturn|Uranus|trígono': 'Mudanças com base sólida; inovação disciplinada.',
  'Jupiter|Saturn|conjunção': 'Consolidação de crescimento; novos ciclos socioeconômicos.',
  'Venus|Mars|trígono': 'Paixão e atração fluem; energia criativa elevada.',
  'Venus|Mars|quadratura': 'Tensão afetivo‑desejo; ciúmes ou impulsividade afetiva.',
  'Sun|Uranus|oposição': 'Imprevisibilidade e necessidade de autenticidade; libertação.',
  'Moon|Neptune|trígono': 'Intuição e imaginação; sensibilidade artística e onírica.',
  'Mercury|Mars|quadratura': 'Fala afiada; risco de discussões e impulsividade mental.',
  'Mercury|Saturn|oposição': 'Rigor e críticas; comunicação mais austera/exigente.',
  'Venus|Saturn|quadratura': 'Provas em vínculos/valores; comprometimento é chave.',
  'Mars|Neptune|oposição': 'Drenagem de energia/rumo; clareza e limites ajudam.',
  'Jupiter|Uranus|trígono': 'Inovações e oportunidades súbitas; expansão libertadora.',
  'Saturn|Neptune|quadratura': 'Limites difusos; concretizar o sutil exige método.',
  'Neptune|Pluto|sextil': 'Transformações silenciosas e profundas no coletivo.',
}

export function getPairNote(p1: string, p2: string, type: AspectName): string | undefined {
  const key1 = `${p1}|${p2}|${type}`
  const key2 = `${p2}|${p1}|${type}`
  return PAIR_NOTES[key1] || PAIR_NOTES[key2]
}


