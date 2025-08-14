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
}

export function getPairNote(p1: string, p2: string, type: AspectName): string | undefined {
  const key1 = `${p1}|${p2}|${type}`
  const key2 = `${p2}|${p1}|${type}`
  return PAIR_NOTES[key1] || PAIR_NOTES[key2]
}


