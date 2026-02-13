import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Pressable, Modal, ScrollView, useWindowDimensions, Image, Platform } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import type { PlanetComparison, ChartSummary } from '../services/astrology/RealAstrologyEngine'
import { decodeUnicodeEscapes, translatePlanet } from '../utils/astro/pt'
import { normalizeKey } from '../utils/astro/normalizeKey'
import { getPlanetImageUri, type PlanetKey } from '../config/planetImageSource'
import useTransits from '../hooks/useTransits'
import { useUserSettings } from '../hooks/useUserSettings'
import { useAppLanguage } from '../hooks/useAppLanguage'
import { normalizeHouseSystem, formatHouseSystemLabel } from '../astro/houseSystem'
import type { HouseSystem } from '../astro/houseSystem'
import ReadingDetailModal from './ReadingDetailModal'
import ReadingOpenIcon from './ReadingOpenIcon'

interface TransitComparisonCardProps {
  planetComparisons: PlanetComparison[]
  chartSummary: ChartSummary
  ascendant?: number
  midheaven?: number
  natalAscendant?: number
  natalMidheaven?: number
  housesCusps?: number[]
  natalHousesCusps?: number[]
  lifeAreas?: Record<string, any>
  lifeAreasDebug?: Record<string, any>
  personalWindows?: Array<{
    transitPlanet: string
    natalPlanet: string
    type: string
    window?: { start?: string; exact?: string; end?: string; days?: number }
  }>
  showOverviewHeader?: boolean
}
const ELEMENT_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  fire: 'flame',
  earth: 'leaf',
  air: 'cloud',
  water: 'water',
  fogo: 'flame',
  terra: 'leaf',
  ar: 'cloud',
  agua: 'water',
  '­ƒöÑ': 'flame',
  '­ƒîì': 'leaf',
  '­ƒîÄ': 'leaf',
  '­ƒîÅ': 'leaf',
  '­ƒÆ¿': 'cloud',
  '­ƒÆº': 'water',
  '­ƒÆª': 'water'
}

const MODALITY_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  cardinal: 'flash',
  fixed: 'square',
  mutable: 'repeat',
  cardeal: 'flash',
  fixo: 'square',
  mutavel: 'repeat',
  'ÔÜí': 'flash',
  '­ƒöÆ': 'square',
  '­ƒöü': 'repeat'
}

const FALLBACK_ICON: keyof typeof Ionicons.glyphMap = 'help-circle'

const ASPECT_ICONS = {
  conjuncao: '\u260C',
  sextil: '\u2736',
  quadratura: '\u25A1',
  trigono: '\u25B3',
  oposicao: '\u260D',
  quincuncio: '\u26BB'
} as const

const ASPECT_COLORS = {
  conjuncao: '#FFD700',
  sextil: '#10B981',
  quadratura: '#EF4444',
  trigono: '#3B82F6',
  oposicao: '#F59E0B',
  quincuncio: '#8B5CF6'
} as const

const PLANET_ICONS: Record<string, string> = {
  Sun: '\u2609',
  Moon: '\u263D',
  Mercury: '\u263F',
  Venus: '\u2640',
  Mars: '\u2642',
  Jupiter: '\u2643',
  Saturn: '\u2644',
  Uranus: '\u2645',
  Neptune: '\u2646',
  Pluto: '\u2647'
}

const PLANETS_WITH_LIGHT_BG_IMAGES = new Set(['Mars', 'Jupiter', 'Saturn', 'Pluto'])

const PLANET_TOKEN = /\b(Sun|Moon|Mercury|Venus|Mars|Jupiter|Saturn|Uranus|Neptune|Pluto)\b/gi

const ELEMENT_KEYS = ['fire', 'earth', 'air', 'water'] as const
const MODALITY_KEYS = ['cardinal', 'fixed', 'mutable'] as const
const SIGN_WEIGHT = 0.6
const HOUSE_WEIGHT = 0.4

const toCanonicalElementKey = (value: string): 'fire' | 'earth' | 'air' | 'water' | null => {
  const normalized = normalizeKey(String(value || ''))
  const map: Record<string, 'fire' | 'earth' | 'air' | 'water'> = {
    fire: 'fire',
    fogo: 'fire',
    earth: 'earth',
    terra: 'earth',
    air: 'air',
    ar: 'air',
    water: 'water',
    agua: 'water'
  }
  return map[normalized] || null
}

const toCanonicalModalityKey = (value: string): 'cardinal' | 'fixed' | 'mutable' | null => {
  const normalized = normalizeKey(String(value || ''))
  const map: Record<string, 'cardinal' | 'fixed' | 'mutable'> = {
    cardinal: 'cardinal',
    cardeal: 'cardinal',
    fixed: 'fixed',
    fixo: 'fixed',
    mutable: 'mutable',
    mutavel: 'mutable'
  }
  return map[normalized] || null
}

const normalizeElementKey = (value: string): string =>
  normalizeKey(
    decodeUnicodeEscapes(String(value || ''))
      .replace(/\u{1F525}/gu, 'Fogo')
      .replace(/\u{1F30D}/gu, 'Terra')
      .replace(/\u{1F4A8}/gu, 'Ar')
      .replace(/\u{1F4A7}/gu, '\u00C1gua')
      .replace(/[\u{1F300}-\u{1FAFF}]/gu, '')
      .replace(/[\u0000-\u001F\u007F]/g, '')
      .replace(/\s{2,}/g, ' ')
      .trim()
  )

const normalizeModalityKey = (value: string): string =>
  normalizeKey(
    decodeUnicodeEscapes(String(value || ''))
      .replace(/\u{26A1}/gu, 'Cardeal')
      .replace(/\u{1F512}/gu, 'Fixo')
      .replace(/\u{1F504}/gu, 'Mut\u00E1vel')
      .replace(/[\u{1F300}-\u{1FAFF}]/gu, '')
      .replace(/[\u0000-\u001F\u007F]/g, '')
      .replace(/\s{2,}/g, ' ')
      .trim()
  )

export default function TransitComparisonCard({
  planetComparisons, 
  chartSummary,
  ascendant,
  midheaven,
  natalAscendant,
  natalMidheaven,
  housesCusps,
  natalHousesCusps,
  lifeAreas,
  lifeAreasDebug,
  personalWindows,
  showOverviewHeader = true
}: TransitComparisonCardProps) {
  const { width } = useWindowDimensions()
  const isNarrow = width < 900
  const { personal, statusPersonal } = useTransits(null)
  const { language, t } = useAppLanguage()
  const tr = React.useCallback((key: string, fallback: string, vars?: Record<string, string | number>) => {
    const value = t(key, vars as any)
    return value === key ? fallback : value
  }, [t])
  const tl = React.useCallback((pt: string, en: string, es: string, it: string) => {
    if (language === 'en-US') return en
    if (language === 'es-ES') return es
    if (language === 'it-IT') return it
    return pt
  }, [language])
  const { settings } = useUserSettings()
  const [houseSystem, setHouseSystem] = React.useState<HouseSystem>(
    normalizeHouseSystem(settings?.houseSystem || 'whole-sign')
  )
  const [failedPlanetImages, setFailedPlanetImages] = React.useState<Record<string, boolean>>({})

    // Sincronizar quando as configuracoes carregarem/alterarem
  React.useEffect(() => {
    if (settings?.houseSystem) {
      setHouseSystem(normalizeHouseSystem(settings.houseSystem))
    }
  }, [settings?.houseSystem])
  const showApprox = false // placeholder: card nao recebe props de housesApproximate aqui
  const personalByTransitPlanet = React.useMemo(() => {
    const map: Record<string, typeof personal> = {}
    for (const item of personal) {
      if (!map[item.transitPlanet]) map[item.transitPlanet] = []
      ;(map[item.transitPlanet] as any[]).push(item)
    }
    return map
  }, [personal])
  
  // Converter graus para 0-30 por signo
  const formatDegreeInSign = (longitude: number): string => {
    const degreeInSign = longitude % 30
    return `${degreeInSign.toFixed(1)}\u00B0`
  }

  const translatePlanetName = React.useCallback((planetName: string): string => translatePlanet(planetName, language), [language])
  const resolvePlanetImageUri = React.useCallback((planetName: string): string | undefined => {
    if (!(planetName in PLANET_ICONS)) return undefined
    return getPlanetImageUri(planetName as PlanetKey)
  }, [])

  const formatSignLine = React.useCallback((longitude: number, isRetrograde?: boolean): string => {
    const signName = getSignFromDegree(longitude)
    const signSymbol = getSignSymbol(signName)
    return `${formatDegreeInSign(longitude)} ${signSymbol ? `${signSymbol} ` : ''}${signName}${isRetrograde ? ' (Rx)' : ''}`
  }, [getSignFromDegree])

const translatePlanetTokens = React.useCallback((text: string): string =>
  decodeUnicodeEscapes(String(text || ''))
    .replace(PLANET_TOKEN, (match) => translatePlanet(match, language))
    .replace(/\bdeg\b/gi, '\u00B0')
  , [language])

const replaceEmojiTokens = (value: string): string => {
  return String(value || '')
    .replace(/\u{1F525}/gu, 'Fogo')
    .replace(/\u{1F30D}/gu, 'Terra')
    .replace(/\u{1F4A8}/gu, 'Ar')
    .replace(/\u{1F4A7}/gu, '\u00C1gua')
    .replace(/\u{26A1}/gu, 'Cardeal')
    .replace(/\u{1F512}/gu, 'Fixo')
    .replace(/\u{1F504}/gu, 'Mut\u00E1vel')
}

const sanitizeChangeText = (value: string): string => {
  return replaceEmojiTokens(decodeUnicodeEscapes(String(value || '')))
    .replace(/[\u{1F300}-\u{1FAFF}]/gu, '')
    .replace(/[\u0000-\u001F\u007F]/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim()
}


const translateElement = React.useCallback((element: string): string => {
  const cleaned = sanitizeChangeText(element)
  const key = normalizeKey(cleaned)
  const dictionaries: Record<string, Record<string, string>> = {
    'pt-BR': { fire: 'Fogo', earth: 'Terra', air: 'Ar', water: '\u00C1gua', fogo: 'Fogo', terra: 'Terra', ar: 'Ar', agua: '\u00C1gua' },
    'en-US': { fire: 'Fire', earth: 'Earth', air: 'Air', water: 'Water', fogo: 'Fire', terra: 'Earth', ar: 'Air', agua: 'Water' },
    'es-ES': { fire: 'Fuego', earth: 'Tierra', air: 'Aire', water: 'Agua', fogo: 'Fuego', terra: 'Tierra', ar: 'Aire', agua: 'Agua' },
    'it-IT': { fire: 'Fuoco', earth: 'Terra', air: 'Aria', water: 'Acqua', fogo: 'Fuoco', terra: 'Terra', ar: 'Aria', agua: 'Acqua' },
  }
  const dictionary = dictionaries[language] || dictionaries['pt-BR']
  return dictionary[key] || cleaned
}, [language])

const getElementIconName = (value: string): keyof typeof Ionicons.glyphMap =>
  ELEMENT_ICONS[normalizeElementKey(value)] || FALLBACK_ICON
const getModalityIconName = (value: string): keyof typeof Ionicons.glyphMap =>
  MODALITY_ICONS[normalizeModalityKey(value)] || FALLBACK_ICON

const translateModality = React.useCallback((modality: string): string => {
  const dictionaries: Record<string, Record<string, string>> = {
    'pt-BR': { cardinal: 'Cardeal', fixed: 'Fixo', mutable: 'Mut\u00E1vel', cardeal: 'Cardeal', fixo: 'Fixo', mutavel: 'Mut\u00E1vel' },
    'en-US': { cardinal: 'Cardinal', fixed: 'Fixed', mutable: 'Mutable', cardeal: 'Cardinal', fixo: 'Fixed', mutavel: 'Mutable' },
    'es-ES': { cardinal: 'Cardinal', fixed: 'Fijo', mutable: 'Mutable', cardeal: 'Cardinal', fixo: 'Fijo', mutavel: 'Mutable' },
    'it-IT': { cardinal: 'Cardinale', fixed: 'Fisso', mutable: 'Mutevole', cardeal: 'Cardinale', fixo: 'Fisso', mutavel: 'Mutevole' },
  }
  const decoded = decodeUnicodeEscapes(modality)
  const key = normalizeKey(decoded)
  const dictionary = dictionaries[language] || dictionaries['pt-BR']
  return dictionary[key] || decoded
}, [language])

const formatStatusLabel = React.useCallback((status: string | null) => {
  if (!status) return ''
  const map: Record<string, Record<string, string>> = {
    'pt-BR': { excelente: 'Excelente', good: 'Bom', bom: 'Bom', neutral: 'Neutro', neutro: 'Neutro', challenging: 'Desafiador', desafiador: 'Desafiador', critical: 'Cr\u00EDtico', critico: 'Cr\u00EDtico' },
    'en-US': { excelente: 'Excellent', good: 'Good', bom: 'Good', neutral: 'Neutral', neutro: 'Neutral', challenging: 'Challenging', desafiador: 'Challenging', critical: 'Critical', critico: 'Critical' },
    'es-ES': { excelente: 'Excelente', good: 'Bueno', bom: 'Bueno', neutral: 'Neutro', neutro: 'Neutro', challenging: 'Desafiante', desafiador: 'Desafiante', critical: 'Cr\u00EDtico', critico: 'Cr\u00EDtico' },
    'it-IT': { excelente: 'Eccellente', good: 'Buono', bom: 'Buono', neutral: 'Neutro', neutro: 'Neutro', challenging: 'Impegnativo', desafiador: 'Impegnativo', critical: 'Critico', critico: 'Critico' },
  }
  const key = String(status).toLowerCase()
  const dictionary = map[language] || map['pt-BR']
  return dictionary[key] || decodeUnicodeEscapes(status)
}, [language])

const formatAreaStatus = React.useCallback((value: string | number | null | undefined) => {
  if (typeof value === 'number') {
    if (value >= 70) return tl('Excelente', 'Excellent', 'Excelente', 'Eccellente')
    if (value >= 40) return tl('Moderado', 'Moderate', 'Moderado', 'Moderato')
    return tl('Crítico', 'Critical', 'Crítico', 'Critico')
  }
  return formatStatusLabel(value || null)
}, [formatStatusLabel, tl])

const getHouseFocus = React.useCallback((house?: number | null): string => {
  const fallback = tl('área de ajuste', 'adjustment area', 'área de ajuste', 'area di regolazione')
  if (!house) return fallback
  const map: Record<number, string> = {
    1: tl('identidade e presença', 'identity and presence', 'identidad y presencia', 'identità e presenza'),
    2: tl('recursos e estabilidade', 'resources and stability', 'recursos y estabilidad', 'risorse e stabilità'),
    3: tl('comunicação e aprendizado', 'communication and learning', 'comunicación y aprendizaje', 'comunicazione e apprendimento'),
    4: tl('base emocional e família', 'emotional base and family', 'base emocional y familia', 'base emotiva e famiglia'),
    5: tl('criatividade e expressão', 'creativity and expression', 'creatividad y expresión', 'creatività ed espressione'),
    6: tl('rotina e organização', 'routine and organization', 'rutina y organización', 'routine e organizzazione'),
    7: tl('parcerias e acordos', 'partnerships and agreements', 'alianzas y acuerdos', 'partnership e accordi'),
    8: tl('trocas profundas e desapego', 'deep exchanges and release', 'intercambios profundos y desapego', 'scambi profondi e distacco'),
    9: tl('sentido e expansão', 'meaning and expansion', 'sentido y expansión', 'senso ed espansione'),
    10: tl('carreira e reputação', 'career and reputation', 'carrera y reputación', 'carriera e reputazione'),
    11: tl('rede e projetos', 'network and projects', 'red y proyectos', 'rete e progetti'),
    12: tl('fechamentos e interiorização', 'closures and introspection', 'cierres e interiorización', 'chiusure e interiorizzazione'),
  }
  return map[house] || fallback
}, [tl])

const getPlanetKeyword = React.useCallback((planet: string): string => {
  const key = normalizeKey(planet)
  const map: Record<string, string> = {
    sun: tl('direção e identidade', 'direction and identity', 'dirección e identidad', 'direzione e identità'),
    moon: tl('emoções e segurança', 'emotions and security', 'emociones y seguridad', 'emozioni e sicurezza'),
    mercury: tl('mente e comunicação', 'mind and communication', 'mente y comunicación', 'mente e comunicazione'),
    venus: tl('vínculos e valores', 'bonds and values', 'vínculos y valores', 'legami e valori'),
    mars: tl('ação e iniciativa', 'action and initiative', 'acción e iniciativa', 'azione e iniziativa'),
    jupiter: tl('expansão e visão', 'expansion and vision', 'expansión y visión', 'espansione e visione'),
    saturn: tl('estrutura e responsabilidade', 'structure and responsibility', 'estructura y responsabilidad', 'struttura e responsabilità'),
    uranus: tl('mudança e liberdade', 'change and freedom', 'cambio y libertad', 'cambiamento e libertà'),
    neptune: tl('sensibilidade e imaginação', 'sensitivity and imagination', 'sensibilidad e imaginación', 'sensibilità e immaginazione'),
    pluto: tl('profundidade e transformação', 'depth and transformation', 'profundidad y transformación', 'profondità e trasformazione'),
  }
  return map[key] || tl('dinâmica central', 'core dynamic', 'dinámica central', 'dinamica centrale')
}, [tl])

const getSignFromDegree = React.useCallback((degree: number): string => {
  const signs =
    language === 'en-US'
      ? ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces']
      : language === 'es-ES'
      ? ['Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo', 'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis']
      : language === 'it-IT'
      ? ['Ariete', 'Toro', 'Gemelli', 'Cancro', 'Leone', 'Vergine', 'Bilancia', 'Scorpione', 'Sagittario', 'Capricorno', 'Acquario', 'Pesci']
      : ['\u00C1ries', 'Touro', 'G\u00EAmeos', 'C\u00E2ncer', 'Le\u00E3o', 'Virgem', 'Libra', 'Escorpi\u00E3o', 'Sagit\u00E1rio', 'Capric\u00F3rnio', 'Aqu\u00E1rio', 'Peixes']
  const signIndex = Math.floor(degree / 30) % 12
  return signs[signIndex]
}, [language])

const translateSignName = React.useCallback((value: string): string => {
  const decoded = decodeUnicodeEscapes(value)
  const key = normalizeKey(decoded)
  const dictionary: Record<string, Record<string, string>> = {
    'pt-BR': { aries: '\u00C1ries', taurus: 'Touro', touro: 'Touro', gemini: 'G\u00EAmeos', gemeos: 'G\u00EAmeos', cancer: 'C\u00E2ncer', leo: 'Le\u00E3o', virgo: 'Virgem', libra: 'Libra', scorpio: 'Escorpi\u00E3o', escorpiao: 'Escorpi\u00E3o', sagittarius: 'Sagit\u00E1rio', sagitario: 'Sagit\u00E1rio', capricorn: 'Capric\u00F3rnio', capricornio: 'Capric\u00F3rnio', aquarius: 'Aqu\u00E1rio', aquario: 'Aqu\u00E1rio', pisces: 'Peixes', peixes: 'Peixes' },
    'en-US': { aries: 'Aries', taurus: 'Taurus', touro: 'Taurus', gemini: 'Gemini', gemeos: 'Gemini', cancer: 'Cancer', leo: 'Leo', virgo: 'Virgo', libra: 'Libra', scorpio: 'Scorpio', escorpiao: 'Scorpio', sagittarius: 'Sagittarius', sagitario: 'Sagittarius', capricorn: 'Capricorn', capricornio: 'Capricorn', aquarius: 'Aquarius', aquario: 'Aquarius', pisces: 'Pisces', peixes: 'Pisces' },
    'es-ES': { aries: 'Aries', taurus: 'Tauro', touro: 'Tauro', gemini: 'Géminis', gemeos: 'Géminis', cancer: 'Cáncer', leo: 'Leo', virgo: 'Virgo', libra: 'Libra', scorpio: 'Escorpio', escorpiao: 'Escorpio', sagittarius: 'Sagitario', sagitario: 'Sagitario', capricorn: 'Capricornio', capricornio: 'Capricornio', aquarius: 'Acuario', aquario: 'Acuario', pisces: 'Piscis', peixes: 'Piscis' },
    'it-IT': { aries: 'Ariete', taurus: 'Toro', touro: 'Toro', gemini: 'Gemelli', gemeos: 'Gemelli', cancer: 'Cancro', leo: 'Leone', virgo: 'Vergine', libra: 'Bilancia', scorpio: 'Scorpione', escorpiao: 'Scorpione', sagittarius: 'Sagittario', sagitario: 'Sagittario', capricorn: 'Capricorno', capricornio: 'Capricorno', aquarius: 'Acquario', aquario: 'Acquario', pisces: 'Pesci', peixes: 'Pesci' },
  }
  const translations = dictionary[language] || dictionary['pt-BR']
  return translations[key] || decoded
}, [language])

const SIGN_SYMBOLS: Record<string, string> = {
  aries: '♈',
  ariete: '♈',
  touro: '♉',
  taurus: '♉',
  tauro: '♉',
  toro: '♉',
  gemeos: '♊',
  gemini: '♊',
  geminis: '♊',
  gemelli: '♊',
  cancer: '♋',
  cancro: '♋',
  leao: '♌',
  leo: '♌',
  leone: '♌',
  virgem: '♍',
  virgo: '♍',
  vergine: '♍',
  libra: '♎',
  escorpiao: '♏',
  scorpio: '♏',
  escorpio: '♏',
  scorpione: '♏',
  sagitario: '♐',
  sagittarius: '♐',
  sagittario: '♐',
  capricornio: '♑',
  capricorn: '♑',
  capricorno: '♑',
  aquario: '♒',
  aquarius: '♒',
  acuario: '♒',
  acquario: '♒',
  peixes: '♓',
  pisces: '♓',
  piscis: '♓',
  pesci: '♓',
}

const getSignSymbol = (signName: string): string => {
  return SIGN_SYMBOLS[normalizeKey(signName)] || ''
}

const SIGN_INFO_PT: Record<string, { element: string; modality: string }> = {
  'Áries': { element: 'Fogo', modality: 'Cardeal' },
  'Touro': { element: 'Terra', modality: 'Fixo' },
  'Gêmeos': { element: 'Ar', modality: 'Mutável' },
  'Câncer': { element: 'Água', modality: 'Cardeal' },
  'Leão': { element: 'Fogo', modality: 'Fixo' },
  'Virgem': { element: 'Terra', modality: 'Mutável' },
  'Libra': { element: 'Ar', modality: 'Cardeal' },
  'Escorpião': { element: 'Água', modality: 'Fixo' },
  'Sagitário': { element: 'Fogo', modality: 'Mutável' },
  'Capricórnio': { element: 'Terra', modality: 'Cardeal' },
  'Aquário': { element: 'Ar', modality: 'Fixo' },
  'Peixes': { element: 'Água', modality: 'Mutável' },
}

const NATURAL_HOUSE_SIGNS_PT = [
  'Áries',
  'Touro',
  'Gêmeos',
  'Câncer',
  'Leão',
  'Virgem',
  'Libra',
  'Escorpião',
  'Sagitário',
  'Capricórnio',
  'Aquário',
  'Peixes',
] as const

const translateAspectLabel = React.useCallback((type: string): string => {
  const key = normalizeKey(type)
  const map: Record<string, Record<string, string>> = {
    'pt-BR': { conjuncao: 'conjun\u00E7\u00E3o', conjunction: 'conjun\u00E7\u00E3o', sextil: 'sextil', sextile: 'sextil', quadratura: 'quadratura', square: 'quadratura', trigono: 'tr\u00EDgono', trine: 'tr\u00EDgono', oposicao: 'oposi\u00E7\u00E3o', opposition: 'oposi\u00E7\u00E3o', quincuncio: 'quinc\u00FAncio', quincunx: 'quinc\u00FAncio' },
    'en-US': { conjuncao: 'conjunction', conjunction: 'conjunction', sextil: 'sextile', sextile: 'sextile', quadratura: 'square', square: 'square', trigono: 'trine', trine: 'trine', oposicao: 'opposition', opposition: 'opposition', quincuncio: 'quincunx', quincunx: 'quincunx' },
    'es-ES': { conjuncao: 'conjunción', conjunction: 'conjunción', sextil: 'sextil', sextile: 'sextil', quadratura: 'cuadratura', square: 'cuadratura', trigono: 'trígono', trine: 'trígono', oposicao: 'oposici\u00F3n', opposition: 'oposici\u00F3n', quincuncio: 'quincuncio', quincunx: 'quincuncio' },
    'it-IT': { conjuncao: 'congiunzione', conjunction: 'congiunzione', sextil: 'sestile', sextile: 'sestile', quadratura: 'quadratura', square: 'quadratura', trigono: 'trigono', trine: 'trigono', oposicao: 'opposizione', opposition: 'opposizione', quincuncio: 'quinconce', quincunx: 'quinconce' },
  }
  const dictionary = map[language] || map['pt-BR']
  return dictionary[key] || decodeUnicodeEscapes(type)
}, [language])
const normalizeAspectKey = (aspect: string): keyof typeof ASPECT_COLORS => {
    const base = aspect
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
    return base as keyof typeof ASPECT_COLORS
  }

  const getAspectColor = (aspect: string): string => {
    return ASPECT_COLORS[normalizeAspectKey(aspect)] || '#6B7280'
  }

  const getAspectIcon = (aspect: string): string => {
    return ASPECT_ICONS[normalizeAspectKey(aspect)] || '\u2022'
  }

  const SIGN_INFO = React.useMemo<Record<string, { element: string; modality: string }>>(() => {
    if (language === 'en-US') {
      return {
        Aries: { element: 'Fire', modality: 'Cardinal' }, Taurus: { element: 'Earth', modality: 'Fixed' },
        Gemini: { element: 'Air', modality: 'Mutable' }, Cancer: { element: 'Water', modality: 'Cardinal' },
        Leo: { element: 'Fire', modality: 'Fixed' }, Virgo: { element: 'Earth', modality: 'Mutable' },
        Libra: { element: 'Air', modality: 'Cardinal' }, Scorpio: { element: 'Water', modality: 'Fixed' },
        Sagittarius: { element: 'Fire', modality: 'Mutable' }, Capricorn: { element: 'Earth', modality: 'Cardinal' },
        Aquarius: { element: 'Air', modality: 'Fixed' }, Pisces: { element: 'Water', modality: 'Mutable' },
      }
    }
    if (language === 'es-ES') {
      return {
        Aries: { element: 'Fuego', modality: 'Cardinal' }, Tauro: { element: 'Tierra', modality: 'Fijo' },
        Géminis: { element: 'Aire', modality: 'Mutable' }, Cáncer: { element: 'Agua', modality: 'Cardinal' },
        Leo: { element: 'Fuego', modality: 'Fijo' }, Virgo: { element: 'Tierra', modality: 'Mutable' },
        Libra: { element: 'Aire', modality: 'Cardinal' }, Escorpio: { element: 'Agua', modality: 'Fijo' },
        Sagitario: { element: 'Fuego', modality: 'Mutable' }, Capricornio: { element: 'Tierra', modality: 'Cardinal' },
        Acuario: { element: 'Aire', modality: 'Fijo' }, Piscis: { element: 'Agua', modality: 'Mutable' },
      }
    }
    if (language === 'it-IT') {
      return {
        Ariete: { element: 'Fuoco', modality: 'Cardinale' }, Toro: { element: 'Terra', modality: 'Fisso' },
        Gemelli: { element: 'Aria', modality: 'Mutevole' }, Cancro: { element: 'Acqua', modality: 'Cardinale' },
        Leone: { element: 'Fuoco', modality: 'Fisso' }, Vergine: { element: 'Terra', modality: 'Mutevole' },
        Bilancia: { element: 'Aria', modality: 'Cardinale' }, Scorpione: { element: 'Acqua', modality: 'Fisso' },
        Sagittario: { element: 'Fuoco', modality: 'Mutevole' }, Capricorno: { element: 'Terra', modality: 'Cardinale' },
        Acquario: { element: 'Aria', modality: 'Fisso' }, Pesci: { element: 'Acqua', modality: 'Mutevole' },
      }
    }
    return SIGN_INFO_PT
  }, [language])

  const NATURAL_HOUSE_SIGNS = React.useMemo(() => {
    if (language === 'en-US') return ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces']
    if (language === 'es-ES') return ['Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo', 'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis']
    if (language === 'it-IT') return ['Ariete', 'Toro', 'Gemelli', 'Cancro', 'Leone', 'Vergine', 'Bilancia', 'Scorpione', 'Sagittario', 'Capricorno', 'Acquario', 'Pesci']
    return [...NATURAL_HOUSE_SIGNS_PT]
  }, [language])

  const personalWindowMap = React.useMemo(() => {
    const map = new Map<string, { start?: string; exact?: string; end?: string; days?: number }>()
    if (!personalWindows?.length) return map
    for (const item of personalWindows) {
      const key = `${item.transitPlanet}|${item.type}|${item.natalPlanet}`
      if (item.window) map.set(key, item.window)
    }
    return map
  }, [personalWindows])

  const formatDate = (date: Date | null): string | null => {
    if (!date || Number.isNaN(date.getTime())) return null
    return date.toLocaleDateString(language === 'en-US' ? 'en-US' : language === 'es-ES' ? 'es-ES' : language === 'it-IT' ? 'it-IT' : 'pt-BR')
  }

  const resolveWindowInfo = (
    window: { start?: string; exact?: string; end?: string; days?: number } | undefined
  ): {
    days: number | null
    startLabel: string | null
    endLabel: string | null
    phaseLabel: string | null
    daysToPeak: number | null
    daysToEnd: number | null
  } | null => {
    if (!window) return null
    const startDate = window.start ? new Date(window.start) : null
    const exactDate = window.exact ? new Date(window.exact) : null
    const endDate = window.end ? new Date(window.end) : null
    if (!startDate && !exactDate && !endDate && !window.days) return null
    const now = new Date()
    const toDayStart = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate())
    const daysDiff = (from: Date, to: Date) => Math.max(0, Math.round((toDayStart(to).getTime() - toDayStart(from).getTime()) / 86400000))
    let phaseLabel: string | null = null
    let daysToPeak: number | null = null
    if (exactDate && !Number.isNaN(exactDate.getTime())) {
      const nowDay = toDayStart(now).getTime()
      const exactDay = toDayStart(exactDate).getTime()
      if (nowDay === exactDay) phaseLabel = 'Pico'
      else if (nowDay < exactDay) phaseLabel = 'Em aprox'
      else phaseLabel = 'Afastando'
      daysToPeak = daysDiff(now, exactDate)
    } else if (startDate && !Number.isNaN(startDate.getTime())) {
      phaseLabel = now.getTime() < startDate.getTime() ? 'Em aprox' : 'Afastando'
      daysToPeak = now.getTime() < startDate.getTime() ? daysDiff(now, startDate) : null
    }
    return {
      days: typeof window.days === 'number' ? window.days : null,
      startLabel: formatDate(startDate),
      endLabel: formatDate(endDate),
      phaseLabel,
      daysToPeak,
      daysToEnd: endDate && !Number.isNaN(endDate.getTime()) ? daysDiff(now, endDate) : null,
    }
  }

  const formatWindowInline = React.useCallback(
    (windowInfo: {
      days: number | null
      startLabel: string | null
      endLabel: string | null
      phaseLabel: string | null
      daysToPeak: number | null
      daysToEnd: number | null
    } | null) => {
      if (!windowInfo) return tl('Em curso', 'In progress', 'En curso', 'In corso')
      const parts: string[] = []
      if (windowInfo.phaseLabel === 'Em aprox') {
        const lead = typeof windowInfo.daysToPeak === 'number' ? windowInfo.daysToPeak : windowInfo.days
        parts.push(
          typeof lead === 'number'
            ? tl(`Em aprox (${lead}d)`, `Approaching (${lead}d)`, `En aprox (${lead}d)`, `In avvicinamento (${lead}d)`)
            : tl('Em aprox', 'Approaching', 'En aprox', 'In avvicinamento')
        )
      } else if (windowInfo.phaseLabel) {
        const mapped =
          windowInfo.phaseLabel === 'Pico'
            ? tl('Pico', 'Peak', 'Pico', 'Picco')
            : windowInfo.phaseLabel === 'Afastando'
            ? tl('Afastando', 'Moving away', 'Alejándose', 'In allontanamento')
            : windowInfo.phaseLabel
        parts.push(mapped)
      }
      if (windowInfo.startLabel) parts.push(`${tl('Início', 'Start', 'Inicio', 'Inizio')} ${windowInfo.startLabel}`)
      if (windowInfo.endLabel) {
        if (windowInfo.daysToEnd === 0) parts.push(tl('termina hoje', 'ends today', 'termina hoy', 'termina oggi'))
        else parts.push(`${tl('vai até dia', 'until', 'va hasta', 'fino al')} ${windowInfo.endLabel}`)
      }
      return parts.length ? parts.join(' • ') : tl('Em curso', 'In progress', 'En curso', 'In corso')
    },
    [tl]
  )


  // \u00F0\u0178\u008F\u00B7\u00EF\u00B8\u008F Dist\u00C3\u00A2ncia at\u00C3\u00A9 a c\u00C3\u00BAspide mais pr\u00C3\u00B3xima (casas ATUAIS)
  const nearestCuspInfo = React.useCallback((longitude: number): { house: number, distance: number } | null => {
    try {
      if (!housesCusps || housesCusps.length !== 12) return null
      const norm = (d: number) => ((d % 360) + 360) % 360
      const lon = norm(longitude)
      let best: { house: number, distance: number } | null = null
      for (let i = 0; i < 12; i++) {
        const cusp = norm(housesCusps[i])
        const diff = Math.abs(lon - cusp)
        const dist = Math.min(diff, 360 - diff)
        if (!best || dist < best.distance) best = { house: i + 1, distance: dist }
      }
      return best
    } catch {
      return null
    }
  }, [housesCusps])

  const getHouseFromCusps = React.useCallback((longitude: number, cusps?: number[] | null): number | null => {
    try {
      if (!cusps || cusps.length !== 12) return null
      const norm = (d: number) => ((d % 360) + 360) % 360
      const lon = norm(longitude)
      for (let i = 0; i < 12; i++) {
        const start = norm(cusps[i])
        const end = norm(cusps[(i + 1) % 12])
        const inHouse = start < end ? lon >= start && lon < end : lon >= start || lon < end
        if (inHouse) return i + 1
      }
      return 1
    } catch {
      return null
    }
  }, [])

  const getHouseSignInfo = React.useCallback((house: number | null, cusps?: number[] | null) => {
    if (!house || !cusps || cusps.length !== 12) return null
    const cuspDegree = Number(cusps[house - 1])
    if (!Number.isFinite(cuspDegree)) return null
    const sign = getSignFromDegree(cuspDegree)
    const info = SIGN_INFO[sign]
    if (!info) return null
    return { sign, ...info }
  }, [SIGN_INFO, getSignFromDegree])

  const getNaturalHouseInfo = React.useCallback((house: number | null) => {
    if (!house || house < 1 || house > 12) return null
    const sign = NATURAL_HOUSE_SIGNS[house - 1]
    const info = SIGN_INFO[sign]
    if (!info) return null
    return { sign, ...info }
  }, [NATURAL_HOUSE_SIGNS, SIGN_INFO])

  const getAreaInfluencesForPlanet = React.useCallback((planetName: string) => {
  if (!lifeAreasDebug || typeof lifeAreasDebug !== 'object') return []
  return Object.entries(lifeAreasDebug)
    .map(([areaKey, data]) => {
      const details = (data as any)?.planetDetails || []
      const planetDetail = details.find((entry: any) => entry.planet === planetName)
      if (!planetDetail) return null

      const statusValue = (lifeAreas as any)?.[areaKey]?.status ?? null
      const statusLabel = formatAreaStatus(statusValue)
      const signScore = Number(planetDetail.signScore || 0)
      const houseScore = Number(planetDetail.houseScore || 0)
      const houseLabel = planetDetail.house ? `${tl('Casa', 'House', 'Casa', 'Casa')} ${planetDetail.house}` : null
      const signLabel = planetDetail.sign ? `${tl('Signo', 'Sign', 'Signo', 'Segno')} ${translateSignName(planetDetail.sign)}` : null

      const houseImpact =
        houseScore >= 65 ? tl('relevante', 'relevant', 'relevante', 'rilevante') : houseScore <= 35 ? tl('pouco relevante', 'less relevant', 'poco relevante', 'poco rilevante') : tl('moderada', 'moderate', 'moderada', 'moderata')
      const signImpact =
        signScore >= 70 ? tl('dignidade', 'dignity', 'dignidad', 'dignità') : signScore <= 35 ? tl('debilidade', 'debilitated', 'debilidad', 'debolezza') : tl('neutro', 'neutral', 'neutro', 'neutro')

      const conditionTags = Array.isArray(planetDetail.conditions?.tags)
        ? planetDetail.conditions.tags
        : []
      const aspects = Array.isArray(planetDetail.aspects) ? planetDetail.aspects : []
      const isHarmonious = (type: string) => ['trigono', 'trine', 'sextil', 'sextile'].includes(normalizeKey(type))
      const isChallenging = (type: string) =>
        ['quadratura', 'square', 'oposicao', 'opposition', 'quincuncio', 'quincunx', 'semiquadratura', 'sesquiquadratura'].includes(normalizeKey(type))
      const isNeutral = (type: string) => ['conjuncao', 'conjunction'].includes(normalizeKey(type))

      const harmoniousCount = aspects.filter((a: any) => isHarmonious(a.type)).length
      const challengingCount = aspects.filter((a: any) => isChallenging(a.type)).length
      const neutralCount = aspects.filter((a: any) => isNeutral(a.type)).length

      const reasonLine = [
        houseLabel ? `${houseLabel} (${houseImpact})` : null,
        signLabel ? `${signLabel} (${signImpact})` : null
      ]
        .filter(Boolean)
        .join(' | ')

      const conditionLine = conditionTags.length
        ? `${tl('Condições', 'Conditions', 'Condiciones', 'Condizioni')}: ${conditionTags.join(', ')}`
        : null

      const aspectLine = `${tl('Aspectos', 'Aspects', 'Aspectos', 'Aspetti')}: ${harmoniousCount} ${tl('harmônicos', 'harmonic', 'armónicos', 'armonici')}, ${challengingCount} ${tl('desafiadores', 'challenging', 'desafiantes', 'impegnativi')}${
        neutralCount ? `, ${neutralCount} ${tl('neutros', 'neutral', 'neutros', 'neutri')}` : ''
      }`

      return {
        areaKey,
        statusLabel,
        totalScore: Number(planetDetail.total || 0),
        lines: [reasonLine, conditionLine, aspectLine].filter(Boolean)
      }
    })
    .filter(Boolean)
    .sort((a, b) => (b as any).totalScore - (a as any).totalScore)
    .slice(0, 2) as Array<{
      areaKey: string
      statusLabel: string
      totalScore: number
      lines: string[]
    }>
}, [formatAreaStatus, lifeAreas, lifeAreasDebug, tl, translateSignName])

  const confidenceValue = typeof statusPersonal?.confidence === 'number' && Number.isFinite(statusPersonal.confidence)
    ? formatMetricPercent(statusPersonal.confidence)
    : null
  const volatilityValue = typeof statusPersonal?.volatility === 'number' && Number.isFinite(statusPersonal.volatility)
    ? formatMetricPercent(statusPersonal.volatility)
    : null
  const statusMetaLine = [confidenceValue ? `${tl('Confiança', 'Confidence', 'Confianza', 'Confidenza')}: ${confidenceValue}` : null, volatilityValue ? `${tl('Volatilidade', 'Volatility', 'Volatilidad', 'Volatilità')}: ${volatilityValue}` : null]
    .filter(Boolean)
    .join(' • ')

  const [detailModalOpen, setDetailModalOpen] = React.useState(false)
  const [detailModalTitle, setDetailModalTitle] = React.useState('')
  const [detailModalSubtitle, setDetailModalSubtitle] = React.useState('')
  const [detailModalShort, setDetailModalShort] = React.useState('')
  const [detailModalLong, setDetailModalLong] = React.useState('')
  const [detailModalKeywords, setDetailModalKeywords] = React.useState<string[]>([])
  const [planetMeaningModalOpen, setPlanetMeaningModalOpen] = React.useState(false)
  const [planetMeaningPlanet, setPlanetMeaningPlanet] = React.useState<string | null>(null)

  React.useEffect(() => {
    try {
      if (typeof window === 'undefined') return
      if (!window.location.search.includes('debug=1')) return
      if (!planetComparisons?.length) return

      const rows = planetComparisons.map((comparison) => {
        const houseTransitOnNatal = getHouseFromCusps(comparison.current.longitude, natalHousesCusps)
        const houseOnCurrentCusps = getHouseFromCusps(comparison.current.longitude, housesCusps)
        return {
          planeta: translatePlanetName(comparison.name),
          longitudeAtual: Number(comparison.current.longitude?.toFixed?.(3) || comparison.current.longitude),
          casaComparativoNatal: houseTransitOnNatal ?? '-',
          casaColetivoViaComparacao: comparison.current.house ?? '-',
          casaColetivoRecalculada: houseOnCurrentCusps ?? '-',
          alinhadoColetivo:
            (comparison.current.house ?? null) === (houseOnCurrentCusps ?? null) ? 'sim' : 'nao',
        }
      })

      console.group('ASTRO DEBUG - Validacao casas (Transito c/Natal x Coletivo)')
      console.table(rows)
      console.groupEnd()
    } catch (error) {
      console.warn('ASTRO DEBUG - Falha ao validar casas por planeta', error)
    }
  }, [planetComparisons, housesCusps, natalHousesCusps, getHouseFromCusps])

  const openDetailModal = React.useCallback((params: {
    title: string
    subtitle?: string
    short: string
    long: string
    keywords?: string[]
  }) => {
    setDetailModalTitle(params.title)
    setDetailModalSubtitle(params.subtitle || '')
    setDetailModalShort(params.short)
    setDetailModalLong(params.long)
    setDetailModalKeywords(Array.isArray(params.keywords) ? params.keywords : [])
    setDetailModalOpen(true)
  }, [])

  const comparisonByPlanet = React.useMemo(() => {
    const map: Record<string, PlanetComparison> = {}
    for (const comparison of planetComparisons || []) {
      map[comparison.name] = comparison
    }
    return map
  }, [planetComparisons])

  const openPlanetMeaningModal = React.useCallback((planetName: string) => {
    setPlanetMeaningPlanet(planetName)
    setPlanetMeaningModalOpen(true)
  }, [])

  const planetMeaningData = React.useMemo(() => {
    if (!planetMeaningPlanet) return null
    const comparison = comparisonByPlanet[planetMeaningPlanet]
    if (!comparison) return null
    const content = {
      title: translatePlanetName(planetMeaningPlanet),
      essence: tl(
        'Força arquetípica em leitura aplicada.',
        'Archetypal force in applied reading.',
        'Fuerza arquetípica en lectura aplicada.',
        'Forza archetipica in lettura applicata.'
      ),
      inAspect: tl(
        'Nos aspectos, mostra como a energia encontra apoio, tensão e ajuste.',
        'In aspects, it shows how energy meets support, tension, and adjustment.',
        'En los aspectos, muestra cómo la energía encuentra apoyo, tensión y ajuste.',
        'Negli aspetti, mostra come l energia incontra supporto, tensione e regolazione.'
      ),
      inHouse: tl(
        'Na casa, indica o campo da vida mais ativado no momento.',
        'In the house, it indicates the life field most activated right now.',
        'En la casa, indica el campo de vida más activado en este momento.',
        'Nella casa, indica il campo della vita più attivato in questo momento.'
      ),
      keywords: [getPlanetKeyword(planetMeaningPlanet), tl('contexto', 'context', 'contexto', 'contesto'), tl('leitura', 'reading', 'lectura', 'lettura')],
    }
    const personalHouse = getHouseFromCusps(comparison.current.longitude, natalHousesCusps) || comparison.current.house
    const collectiveHouse = comparison.current.house
    const natalHouse = comparison.natal.house
    const personalFocus = getHouseFocus(personalHouse)
    const collectiveFocus = getHouseFocus(collectiveHouse)
    const natalFocus = getHouseFocus(natalHouse)
    const signLabel = getSignFromDegree(comparison.current.longitude)
    const personalAspectsCount = personalByTransitPlanet[planetMeaningPlanet]?.length || 0
    const collectiveAspectsCount = comparison.planetaryAspects.length
    const houseAspectsCount = comparison.houseAspects.length
    const totalActiveContacts = personalAspectsCount + collectiveAspectsCount + houseAspectsCount
    const forceLine =
      totalActiveContacts >= 6
        ? tl(
          'Força alta no período: múltiplos contatos simultâneos.',
          'High force in this period: multiple simultaneous contacts.',
          'Fuerza alta en este período: múltiples contactos simultáneos.',
          'Forza alta in questo periodo: contatti multipli simultanei.'
        )
        : totalActiveContacts >= 3
        ? tl(
          'Força moderada: energia consistente com pontos de ajuste.',
          'Moderate force: consistent energy with adjustment points.',
          'Fuerza moderada: energía consistente con puntos de ajuste.',
          'Forza moderata: energia coerente con punti di regolazione.'
        )
        : tl(
          'Força focal: atuação seletiva e pontual.',
          'Focused force: selective and specific action.',
          'Fuerza focal: actuación selectiva y puntual.',
          'Forza focalizzata: azione selettiva e puntuale.'
        )
    const practicalUse =
      totalActiveContacts >= 5
        ? tl(
          'Uso prático: priorize 1 objetivo central e corte dispersões.',
          'Practical use: prioritize 1 core objective and cut distractions.',
          'Uso práctico: prioriza 1 objetivo central y reduce la dispersión.',
          'Uso pratico: dai priorita a 1 obiettivo centrale e riduci le dispersioni.'
        )
        : tl(
          'Uso prático: mantenha cadência estável com revisão semanal.',
          'Practical use: keep a steady cadence with weekly review.',
          'Uso práctico: mantén una cadencia estable con revisión semanal.',
          'Uso pratico: mantieni una cadenza stabile con revisione settimanale.'
        )
    return {
      planetName: translatePlanetName(planetMeaningPlanet),
      title: content.title,
      imageUri: resolvePlanetImageUri(planetMeaningPlanet),
      fallbackIcon: PLANET_ICONS[planetMeaningPlanet] || '?',
      essence: content.essence,
      inAspect: content.inAspect,
      inHouse: content.inHouse,
      keywords: content.keywords,
      practical: tl(
        `Com ${translatePlanetName(planetMeaningPlanet)} em ${signLabel}, o foco atual é ${collectiveFocus}.`,
        `With ${translatePlanetName(planetMeaningPlanet)} in ${signLabel}, the current focus is ${collectiveFocus}.`,
        `Con ${translatePlanetName(planetMeaningPlanet)} en ${signLabel}, el foco actual es ${collectiveFocus}.`,
        `Con ${translatePlanetName(planetMeaningPlanet)} in ${signLabel}, il focus attuale è ${collectiveFocus}.`
      ),
      forceLine,
      practicalUse,
      personalLine: tl(
        `Trânsito pessoal (c/ natal) ativa Casa ${personalHouse || '-'}: ${personalFocus}.`,
        `Personal transit (with natal) activates House ${personalHouse || '-'}: ${personalFocus}.`,
        `Tránsito personal (con natal) activa Casa ${personalHouse || '-'}: ${personalFocus}.`,
        `Transito personale (con natale) attiva Casa ${personalHouse || '-'}: ${personalFocus}.`
      ),
      collectiveLine: tl(
        `Trânsito coletivo ativa Casa ${collectiveHouse || '-'}: ${collectiveFocus}.`,
        `Collective transit activates House ${collectiveHouse || '-'}: ${collectiveFocus}.`,
        `Tránsito colectivo activa Casa ${collectiveHouse || '-'}: ${collectiveFocus}.`,
        `Transito collettivo attiva Casa ${collectiveHouse || '-'}: ${collectiveFocus}.`
      ),
      natalLine: tl(
        `No natal, ${translatePlanetName(planetMeaningPlanet)} está na Casa ${natalHouse || '-'}: ${natalFocus}.`,
        `In natal, ${translatePlanetName(planetMeaningPlanet)} is in House ${natalHouse || '-'}: ${natalFocus}.`,
        `En la carta natal, ${translatePlanetName(planetMeaningPlanet)} está en Casa ${natalHouse || '-'}: ${natalFocus}.`,
        `Nel tema natale, ${translatePlanetName(planetMeaningPlanet)} è in Casa ${natalHouse || '-'}: ${natalFocus}.`
      ),
    }
  }, [planetMeaningPlanet, comparisonByPlanet, getHouseFocus, getPlanetKeyword, natalHousesCusps, personalByTransitPlanet, resolvePlanetImageUri, translatePlanetName, tl])

  const renderAttributeChips = React.useCallback((
    element?: string | null,
    modality?: string | null
  ) => {
    if (!element && !modality) return null
    return (
      <View style={styles.attributesRow}>
        {element ? (
          <View style={styles.attributeChip}>
            <Ionicons name={getElementIconName(element)} size={12} color="#FFD700" />
            <Text style={styles.attributeChipText}>{translateElement(element)}</Text>
          </View>
        ) : null}
        {modality ? (
          <View style={styles.attributeChip}>
            <Ionicons name={getModalityIconName(modality)} size={12} color="#FFD700" />
            <Text style={styles.attributeChipText}>{translateModality(modality)}</Text>
          </View>
        ) : null}
      </View>
    )
  }, [])

  const houseBasedCounts = React.useMemo(() => {
    const emptyElements = { fire: 0, earth: 0, air: 0, water: 0 }
    const emptyModalities = { cardinal: 0, fixed: 0, mutable: 0 }
    const result = {
      natal: { elements: { ...emptyElements }, modalities: { ...emptyModalities } },
      current: { elements: { ...emptyElements }, modalities: { ...emptyModalities } },
    }

    for (const comparison of planetComparisons || []) {
      const natalNatural = getNaturalHouseInfo(comparison.natal.house)
      const currentNatural = getNaturalHouseInfo(comparison.current.house)

      const natalElementKey = toCanonicalElementKey(natalNatural?.element || '')
      const natalModalityKey = toCanonicalModalityKey(natalNatural?.modality || '')
      const currentElementKey = toCanonicalElementKey(currentNatural?.element || '')
      const currentModalityKey = toCanonicalModalityKey(currentNatural?.modality || '')

      if (natalElementKey && natalElementKey in result.natal.elements) {
        ;(result.natal.elements as any)[natalElementKey] += 1
      }
      if (natalModalityKey && natalModalityKey in result.natal.modalities) {
        ;(result.natal.modalities as any)[natalModalityKey] += 1
      }
      if (currentElementKey && currentElementKey in result.current.elements) {
        ;(result.current.elements as any)[currentElementKey] += 1
      }
      if (currentModalityKey && currentModalityKey in result.current.modalities) {
        ;(result.current.modalities as any)[currentModalityKey] += 1
      }
    }

    return result
  }, [planetComparisons, getNaturalHouseInfo])

  const getSignCounts = React.useCallback(
    (
      source: Record<string, number>,
      kind: 'element' | 'modality'
    ): Record<string, number> => {
      const base: Record<string, number> =
        kind === 'element'
          ? { fire: 0, earth: 0, air: 0, water: 0 }
          : { cardinal: 0, fixed: 0, mutable: 0 }
      for (const [key, rawValue] of Object.entries(source || {})) {
        const canonical =
          kind === 'element'
            ? toCanonicalElementKey(key)
            : toCanonicalModalityKey(key)
        if (!canonical) continue
        ;(base as any)[canonical] += Number(rawValue) || 0
      }
      return base
    },
    []
  )

  const buildWeightedRows = React.useCallback(
    (
      signCounts: Record<string, number>,
      houseCounts: Record<string, number>,
      keys: readonly string[]
    ) => {
      return keys.map((key) => {
        const signs = Number((signCounts as any)[key] || 0)
        const houses = Number((houseCounts as any)[key] || 0)
        const weighted = signs * SIGN_WEIGHT + houses * HOUSE_WEIGHT
        return { key, signs, houses, weighted }
      })
    },
    []
  )

  const buildColumnInterpretation = React.useCallback((params: {
    planet: string
    contextLabel: string
    signLabel: string
    signElement: string
    signModality: string
    house: number | null
    houseByCusp?: { sign: string; element: string; modality: string } | null
    houseNatural?: { sign: string; element: string; modality: string } | null
  }) => {
    const houseLabel = params.house ? `${tl('Casa', 'House', 'Casa', 'Casa')} ${params.house}` : tl('Casa indefinida', 'Undefined house', 'Casa indefinida', 'Casa indefinita')
    const short = tl(
      `${params.planet} em ${params.signLabel} (${params.signElement}/${params.signModality}) atuando em ${houseLabel}.`,
      `${params.planet} in ${params.signLabel} (${params.signElement}/${params.signModality}) acting in ${houseLabel}.`,
      `${params.planet} en ${params.signLabel} (${params.signElement}/${params.signModality}) actuando en ${houseLabel}.`,
      `${params.planet} in ${params.signLabel} (${params.signElement}/${params.signModality}) attivo in ${houseLabel}.`
    )
    const long =
      tl(
        `${params.contextLabel} integra três camadas: planeta, signo e casa.\n\n`,
        `${params.contextLabel} integrates three layers: planet, sign and house.\n\n`,
        `${params.contextLabel} integra tres capas: planeta, signo y casa.\n\n`,
        `${params.contextLabel} integra tre livelli: pianeta, segno e casa.\n\n`
      ) +
      tl(
        `Planeta + signo: ${params.planet} em ${params.signLabel} indica expressão por ${params.signElement} e modo ${params.signModality}.\n\n`,
        `Planet + sign: ${params.planet} in ${params.signLabel} indicates expression through ${params.signElement} and ${params.signModality} mode.\n\n`,
        `Planeta + signo: ${params.planet} en ${params.signLabel} indica expresión por ${params.signElement} y modo ${params.signModality}.\n\n`,
        `Pianeta + segno: ${params.planet} in ${params.signLabel} indica espressione tramite ${params.signElement} e modalità ${params.signModality}.\n\n`
      ) +
      tl(`Casa ativada: ${houseLabel}.`, `Activated house: ${houseLabel}.`, `Casa activada: ${houseLabel}.`, `Casa attivata: ${houseLabel}.`) +
      `${params.houseByCusp ? tl(` Casa por cúspide (cálculo): ${params.houseByCusp.sign} (${params.houseByCusp.element}/${params.houseByCusp.modality}).`, ` House by cusp (calculation): ${params.houseByCusp.sign} (${params.houseByCusp.element}/${params.houseByCusp.modality}).`, ` Casa por cúspide (cálculo): ${params.houseByCusp.sign} (${params.houseByCusp.element}/${params.houseByCusp.modality}).`, ` Casa per cuspide (calcolo): ${params.houseByCusp.sign} (${params.houseByCusp.element}/${params.houseByCusp.modality}).`) : ''}` +
      `${params.houseNatural ? tl(` Casa natural (arquétipo): ${params.houseNatural.sign} (${params.houseNatural.element}/${params.houseNatural.modality}).\n\n`, ` Natural house (archetype): ${params.houseNatural.sign} (${params.houseNatural.element}/${params.houseNatural.modality}).\n\n`, ` Casa natural (arquetipo): ${params.houseNatural.sign} (${params.houseNatural.element}/${params.houseNatural.modality}).\n\n`, ` Casa naturale (archetipo): ${params.houseNatural.sign} (${params.houseNatural.element}/${params.houseNatural.modality}).\n\n`) : '\n\n'}` +
      tl(
        'Síntese prática: leia este ponto como junção de estilo (signo) + tema (casa) + função (planeta), priorizando decisões que combinem ritmo e contexto real do momento.',
        'Practical synthesis: read this point as a merge of style (sign) + theme (house) + function (planet), prioritizing decisions that match rhythm and real context.',
        'Síntesis práctica: lee este punto como unión de estilo (signo) + tema (casa) + función (planeta), priorizando decisiones con ritmo y contexto real.',
        'Sintesi pratica: leggi questo punto come unione di stile (segno) + tema (casa) + funzione (pianeta), privilegiando decisioni coerenti con ritmo e contesto reale.'
      )
    return { short, long }
  }, [tl])

  const buildAspectReading = React.useCallback((params: {
    planet: string
    aspectType: string
    targetLabel: string
    house?: number | null
    days?: number | null
    phase?: string | null
    scope: 'pessoal' | 'coletivo' | 'casa'
  }) => {
    const keyword = getPlanetKeyword(params.planet)
    const houseFocus = params.house ? getHouseFocus(params.house) || `${tl('temas da', 'themes of', 'temas de la', 'temi della')} ${tl('Casa', 'House', 'Casa', 'Casa')} ${params.house}` : tl('contexto atual', 'current context', 'contexto actual', 'contesto attuale')
    const aspectKey = normalizeAspectKey(params.aspectType)
    const constructive = aspectKey === 'trigono' || aspectKey === 'sextil'
    const intense = aspectKey === 'quadratura' || aspectKey === 'oposicao' || aspectKey === 'quincuncio'
    const tone = constructive
      ? tl('janela favorável para avanço com consistência', 'favorable window for consistent progress', 'ventana favorable para avanzar con consistencia', 'finestra favorevole per avanzare con costanza')
      : intense
      ? tl('tensão produtiva pedindo ajuste de rota', 'productive tension requiring route adjustment', 'tensión productiva que pide ajuste de rumbo', 'tensione produttiva che richiede un aggiustamento di rotta')
      : tl('movimento de recalibração gradual', 'gradual recalibration movement', 'movimiento de recalibración gradual', 'movimento di ricalibrazione graduale')
    const windowLabel = params.days ? tl(`em uma janela de cerca de ${params.days} dias`, `within a window of about ${params.days} days`, `en una ventana de unos ${params.days} días`, `in una finestra di circa ${params.days} giorni`) : tl('neste ciclo', 'in this cycle', 'en este ciclo', 'in questo ciclo')
    const phaseLabel = params.phase ? tl(` Fase atual: ${params.phase}.`, ` Current phase: ${params.phase}.`, ` Fase actual: ${params.phase}.`, ` Fase attuale: ${params.phase}.`) : ''
    const scopeLabel =
      params.scope === 'pessoal'
        ? tl('No plano pessoal,', 'On a personal level,', 'En el plano personal,', 'Nel piano personale,')
        : params.scope === 'coletivo'
        ? tl('No plano coletivo,', 'On a collective level,', 'En el plano colectivo,', 'Nel piano collettivo,')
        : tl('No eixo de casas,', 'In the house axis,', 'En el eje de casas,', 'Nell asse delle case,')

    return {
      short: tl(
        `${scopeLabel} ${params.planet} ativa ${keyword} em ${houseFocus}: ${tone}.`,
        `${scopeLabel} ${params.planet} activates ${keyword} in ${houseFocus}: ${tone}.`,
        `${scopeLabel} ${params.planet} activa ${keyword} en ${houseFocus}: ${tone}.`,
        `${scopeLabel} ${params.planet} attiva ${keyword} in ${houseFocus}: ${tone}.`
      ),
      long:
        tl(
          `${params.planet} em ${translateAspectLabel(params.aspectType)} com ${params.targetLabel} organiza foco em ${houseFocus}.`,
          `${params.planet} in ${translateAspectLabel(params.aspectType)} with ${params.targetLabel} organizes focus in ${houseFocus}.`,
          `${params.planet} en ${translateAspectLabel(params.aspectType)} con ${params.targetLabel} organiza el foco en ${houseFocus}.`,
          `${params.planet} in ${translateAspectLabel(params.aspectType)} con ${params.targetLabel} organizza il focus in ${houseFocus}.`
        ) +
        ` ${tone} ${windowLabel}.${phaseLabel} ` +
        tl(
          'Leitura prática: converta essa tendência em uma decisão pequena, clara e executável para evitar dispersão.',
          'Practical reading: convert this trend into a small, clear and executable decision to avoid dispersion.',
          'Lectura práctica: convierte esta tendencia en una decisión pequeña, clara y ejecutable para evitar dispersión.',
          'Lettura pratica: trasforma questa tendenza in una decisione piccola, chiara ed eseguibile per evitare dispersione.'
        )
    }
  }, [getHouseFocus, getPlanetKeyword, tl, translateAspectLabel])

  const elementSignCounts = React.useMemo(
    () => ({
      natal: getSignCounts(chartSummary.elemental.natal as unknown as Record<string, number>, 'element'),
      current: getSignCounts(chartSummary.elemental.current as unknown as Record<string, number>, 'element')
    }),
    [chartSummary.elemental.current, chartSummary.elemental.natal, getSignCounts]
  )

  const modalitySignCounts = React.useMemo(
    () => ({
      natal: getSignCounts(chartSummary.modality.natal as unknown as Record<string, number>, 'modality'),
      current: getSignCounts(chartSummary.modality.current as unknown as Record<string, number>, 'modality')
    }),
    [chartSummary.modality.current, chartSummary.modality.natal, getSignCounts]
  )

  const weightedElementRows = React.useMemo(
    () => ({
      natal: buildWeightedRows(elementSignCounts.natal, houseBasedCounts.natal.elements, ELEMENT_KEYS),
      current: buildWeightedRows(elementSignCounts.current, houseBasedCounts.current.elements, ELEMENT_KEYS)
    }),
    [buildWeightedRows, elementSignCounts.current, elementSignCounts.natal, houseBasedCounts.current.elements, houseBasedCounts.natal.elements]
  )

  const weightedModalityRows = React.useMemo(
    () => ({
      natal: buildWeightedRows(modalitySignCounts.natal, houseBasedCounts.natal.modalities, MODALITY_KEYS),
      current: buildWeightedRows(modalitySignCounts.current, houseBasedCounts.current.modalities, MODALITY_KEYS)
    }),
    [buildWeightedRows, modalitySignCounts.current, modalitySignCounts.natal, houseBasedCounts.current.modalities, houseBasedCounts.natal.modalities]
  )

  const renderBalanceColumns = React.useCallback((params: {
    periodLabel: string
    signRows: Array<{ key: string; signs: number; houses: number; weighted: number }>
    kind: 'element' | 'modality'
  }) => {
    const predominant = params.signRows.reduce((acc, item) => {
      if (!acc || item.weighted > acc.weighted) return item
      return acc
    }, null as null | { key: string; signs: number; houses: number; weighted: number })

    const labelFn = params.kind === 'element' ? translateElement : translateModality
    const iconFn =
      params.kind === 'element'
        ? (k: string) => getElementIconName(k)
        : (k: string) => getModalityIconName(k)

    return (
      <View style={styles.balanceCard}>
        <Text style={styles.comparisonLabel}>{params.periodLabel}</Text>
        <View style={styles.balanceColumns}>
          <View style={styles.balanceColumn}>
            <Text style={styles.balanceColumnTitle}>{tl('Signos', 'Signs', 'Signos', 'Segni')}</Text>
            {params.signRows.map((row) => (
              <View key={`${params.periodLabel}-sign-${row.key}`} style={styles.balanceRowItem}>
                <Ionicons name={iconFn(row.key)} size={12} color="#FFD700" />
                <Text style={styles.balanceRowText}>{labelFn(row.key)} {row.signs}</Text>
              </View>
            ))}
          </View>
          <View style={styles.balanceColumn}>
            <Text style={styles.balanceColumnTitle}>{tl('Casas', 'Houses', 'Casas', 'Case')}</Text>
            {params.signRows.map((row) => (
              <View key={`${params.periodLabel}-house-${row.key}`} style={styles.balanceRowItem}>
                <Ionicons name={iconFn(row.key)} size={12} color="#FFD700" />
                <Text style={styles.balanceRowText}>{labelFn(row.key)} {row.houses}</Text>
              </View>
            ))}
          </View>
          <View style={styles.balanceColumn}>
            <Text style={styles.balanceColumnTitle}>{tl('Balanço', 'Balance', 'Balance', 'Bilancio')}</Text>
            {params.signRows.map((row) => (
              <View key={`${params.periodLabel}-balance-${row.key}`} style={styles.balanceRowItem}>
                <Ionicons name={iconFn(row.key)} size={12} color={predominant?.key === row.key ? '#34D399' : '#FFD700'} />
                <Text style={[styles.balanceRowText, predominant?.key === row.key ? styles.balanceRowTextPredominant : null]}>
                  {labelFn(row.key)} {row.weighted.toFixed(1)}
                </Text>
              </View>
            ))}
            {predominant ? (
              <Text style={styles.balancePredominantText}>
                {tl('Predominante', 'Predominant', 'Predominante', 'Prevalente')}: {labelFn(predominant.key)}
              </Text>
            ) : null}
          </View>
        </View>
      </View>
    )
  }, [tl, translateElement, translateModality])

  return (
    <LinearGradient
      colors={['#1E1E2E', '#2A2A3E']}
      style={styles.container}
    >
      {showOverviewHeader ? (
        <>
          <View style={styles.cardHeader}>
            <Ionicons name="swap-horizontal" size={18} color="#FFD700" />
            <Text style={styles.cardTitle}>{tl('Visão geral do período', 'Period overview', 'Resumen del período', 'Panoramica del periodo')}</Text>
          </View>
          {statusPersonal ? (
            <View style={{ marginBottom: 8 }}>
              <Text style={{ color: '#fff', opacity: 0.9 }}>
                {tl('Status pessoal', 'Personal status', 'Estado personal', 'Stato personale')}: {formatStatusLabel(statusPersonal.level)} ({statusPersonal.score}%)
              </Text>
              {statusMetaLine ? (
                <Text style={{ color: '#fff', opacity: 0.72, fontSize: 12 }}>{statusMetaLine}</Text>
              ) : null}
            </View>
          ) : null}
        </>
      ) : null}

      {/* Compara\u00E7\u00F5es Planet\u00E1rias */}
      <View style={styles.planetsSection}>
        <View style={styles.sectionHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="planet" size={20} color="#FFD700" />
            <Text style={styles.sectionTitle}>Tábula Estelar</Text>
          </View>
          <View style={styles.systemBadge}>
            <Text style={styles.systemBadgeText}>{formatHouseSystemLabel(houseSystem, language)}</Text>
          </View>
        </View>

        {planetComparisons.map((comparison) => (
          <View key={comparison.name} nativeID={`tabula-planet-${comparison.name}`} style={styles.planetCard}>
            {(() => {
              const needsLightBgFix = PLANETS_WITH_LIGHT_BG_IMAGES.has(comparison.name)
              return resolvePlanetImageUri(comparison.name) && !failedPlanetImages[comparison.name] ? (
              <View pointerEvents="none" style={styles.planetArtworkWrap}>
                <Image
                  source={{ uri: resolvePlanetImageUri(comparison.name) }}
                  style={[
                    styles.planetArtwork,
                    needsLightBgFix && styles.planetArtworkWhiteBgFix,
                    Platform.OS === 'web' && needsLightBgFix ? ({ mixBlendMode: 'multiply' } as any) : null,
                  ]}
                  resizeMode="cover"
                  onError={() =>
                    setFailedPlanetImages((prev) => ({
                      ...prev,
                      [comparison.name]: true,
                    }))
                  }
                />
                <LinearGradient
                  colors={['rgba(42,42,62,0.18)', 'rgba(42,42,62,0.78)', 'rgba(42,42,62,0.96)']}
                  start={{ x: 0, y: 0.2 }}
                  end={{ x: 0.9, y: 0.5 }}
                  style={styles.planetArtworkFade}
                />
              </View>
            ) : null
            })()}
            <View style={styles.planetContent}>
            {/* Cabe\u00E7alho do Planeta */}
            <View style={styles.planetHeader}>
              <TouchableOpacity style={styles.planetHeaderRow} activeOpacity={0.88} onPress={() => openPlanetMeaningModal(comparison.name)}>
                <View style={styles.planetHeaderMain}>
                  {resolvePlanetImageUri(comparison.name) && !failedPlanetImages[comparison.name] ? (
                    <Image
                      source={{ uri: resolvePlanetImageUri(comparison.name) }}
                      style={[
                        styles.planetHeaderImage,
                        PLANETS_WITH_LIGHT_BG_IMAGES.has(comparison.name) && styles.planetHeaderImageWhiteBgFix,
                        Platform.OS === 'web' && PLANETS_WITH_LIGHT_BG_IMAGES.has(comparison.name)
                          ? ({ mixBlendMode: 'multiply' } as any)
                          : null,
                      ]}
                      resizeMode="cover"
                    />
                  ) : (
                    <Text style={styles.planetGlyphFallback}>{(PLANET_ICONS[comparison.name] || '?')}</Text>
                  )}
                  <Text style={styles.planetName}>{translatePlanetName(comparison.name)}</Text>
                </View>
                <ReadingOpenIcon style={styles.planetReadHintIcon} />
              </TouchableOpacity>
            </View>

            {/* Comparacao em 3 colunas: Natal | Transito c/ Natal | Posicao Atual */}
            <View style={styles.comparisonGrid}>
              {(() => {
                const natalHouseInfo = getHouseSignInfo(comparison.natal.house, natalHousesCusps)
                const currentHouseInfo = getHouseSignInfo(comparison.current.house, housesCusps)
                const transitOnNatalHouse = getHouseFromCusps(comparison.current.longitude, natalHousesCusps)
                const transitOnNatalInfo = getHouseSignInfo(transitOnNatalHouse, natalHousesCusps)
                const natalNaturalInfo = getNaturalHouseInfo(comparison.natal.house)
                const transitOnNatalNaturalInfo = getNaturalHouseInfo(transitOnNatalHouse)
                const currentNaturalInfo = getNaturalHouseInfo(comparison.current.house)
                return (
                  <>
                    <TouchableOpacity
                      activeOpacity={0.86}
                      style={styles.comparisonColumn}
                      onPress={() => {
                        const signLabel = getSignFromDegree(comparison.natal.longitude)
                        const interp = buildColumnInterpretation({
                          planet: translatePlanetName(comparison.name),
                          contextLabel: tl('Leitura Natal', 'Natal Reading', 'Lectura Natal', 'Lettura Natale'),
                          signLabel,
                          signElement: translateElement(comparison.natal.element),
                          signModality: translateModality(comparison.natal.modality),
                          house: comparison.natal.house,
                          houseByCusp: natalHouseInfo,
                          houseNatural: natalNaturalInfo,
                        })
                        openDetailModal({
                          title: `${translatePlanetName(comparison.name)} • ${tl('Natal', 'Natal', 'Natal', 'Natale')}`,
                          subtitle: `${signLabel} • ${tl('Casa', 'House', 'Casa', 'Casa')} ${comparison.natal.house}`,
                          short: interp.short,
                          long: interp.long,
                          keywords: [
                            tl('natal', 'natal', 'natal', 'natale'),
                            signLabel,
                            `${tl('Casa', 'House', 'Casa', 'Casa')} ${comparison.natal.house}`,
                            translateElement(comparison.natal.element),
                            translateModality(comparison.natal.modality),
                          ],
                        })
                      }}
                    >
                      <Text style={styles.columnTitle}>{tl('Natal', 'Natal', 'Natal', 'Natale')}</Text>
                      <Text style={styles.metricLineStrong}>
                        {formatSignLine(comparison.natal.longitude)}
                      </Text>
                      {renderAttributeChips(comparison.natal.element, comparison.natal.modality)}
                      <Text style={styles.metricLineStrong}>
                        {tl('Casa', 'House', 'Casa', 'Casa')} {comparison.natal.house}
                      </Text>
                      {renderAttributeChips(natalNaturalInfo?.element || null, natalNaturalInfo?.modality || null)}
                    </TouchableOpacity>

                    <TouchableOpacity
                      activeOpacity={0.86}
                      style={styles.comparisonColumn}
                      onPress={() => {
                        const signLabel = getSignFromDegree(comparison.current.longitude)
                        const interp = buildColumnInterpretation({
                          planet: translatePlanetName(comparison.name),
                          contextLabel: tl('Leitura Trânsito Pessoal', 'Personal Transit Reading', 'Lectura Tránsito Personal', 'Lettura Transito Personale'),
                          signLabel,
                          signElement: translateElement(comparison.current.element),
                          signModality: translateModality(comparison.current.modality),
                          house: transitOnNatalHouse,
                          houseByCusp: transitOnNatalInfo,
                          houseNatural: transitOnNatalNaturalInfo,
                        })
                        openDetailModal({
                          title: `${translatePlanetName(comparison.name)} • ${tl('Trânsito Pessoal', 'Personal Transit', 'Tránsito Personal', 'Transito Personale')}`,
                          subtitle: `${signLabel} • ${tl('Casa', 'House', 'Casa', 'Casa')} ${transitOnNatalHouse || '-'}`,
                          short: interp.short,
                          long: interp.long,
                          keywords: [
                            tl('trânsito pessoal', 'personal transit', 'tránsito personal', 'transito personale'),
                            signLabel,
                            `${tl('Casa', 'House', 'Casa', 'Casa')} ${transitOnNatalHouse || '-'}`,
                            translateElement(comparison.current.element),
                            translateModality(comparison.current.modality),
                          ],
                        })
                      }}
                    >
                      <Text style={styles.columnTitle}>{tl('Trânsito Pessoal', 'Personal Transit', 'Tránsito Personal', 'Transito Personale')}</Text>
                      <Text style={styles.metricLineStrong}>
                        {formatSignLine(comparison.current.longitude, comparison.current.isRetrograde)}
                      </Text>
                      {renderAttributeChips(comparison.current.element, comparison.current.modality)}
                      <Text style={styles.metricLineStrong}>
                        {tl('Casa', 'House', 'Casa', 'Casa')} {transitOnNatalHouse || '-'}
                      </Text>
                      {renderAttributeChips(transitOnNatalNaturalInfo?.element || null, transitOnNatalNaturalInfo?.modality || null)}
                    </TouchableOpacity>

                    <TouchableOpacity
                      activeOpacity={0.86}
                      style={styles.comparisonColumn}
                      onPress={() => {
                        const signLabel = getSignFromDegree(comparison.current.longitude)
                        const interp = buildColumnInterpretation({
                          planet: translatePlanetName(comparison.name),
                          contextLabel: tl('Leitura Trânsito Coletivo', 'Collective Transit Reading', 'Lectura Tránsito Colectivo', 'Lettura Transito Collettivo'),
                          signLabel,
                          signElement: translateElement(comparison.current.element),
                          signModality: translateModality(comparison.current.modality),
                          house: comparison.current.house,
                          houseByCusp: currentHouseInfo,
                          houseNatural: currentNaturalInfo,
                        })
                        openDetailModal({
                          title: `${translatePlanetName(comparison.name)} • ${tl('Trânsito Coletivo', 'Collective Transit', 'Tránsito Colectivo', 'Transito Collettivo')}`,
                          subtitle: `${tl('Casa', 'House', 'Casa', 'Casa')} ${comparison.current.house}`,
                          short: interp.short,
                          long: interp.long,
                          keywords: [
                            tl('trânsito coletivo', 'collective transit', 'tránsito colectivo', 'transito collettivo'),
                            signLabel,
                            `${tl('Casa', 'House', 'Casa', 'Casa')} ${comparison.current.house}`,
                            translateElement(comparison.current.element),
                            translateModality(comparison.current.modality),
                          ],
                        })
                      }}
                    >
                      <Text style={styles.columnTitle}>{tl('Trânsito Coletivo', 'Collective Transit', 'Tránsito Colectivo', 'Transito Collettivo')}</Text>
                      <Text style={styles.metricLineStrong}>
                        {formatSignLine(comparison.current.longitude, comparison.current.isRetrograde)}
                      </Text>
                      {renderAttributeChips(comparison.current.element, comparison.current.modality)}
                      <Text style={styles.metricLineStrong}>
                        {tl('Casa', 'House', 'Casa', 'Casa')} {comparison.current.house}
                      </Text>
                      {renderAttributeChips(currentNaturalInfo?.element || null, currentNaturalInfo?.modality || null)}
                      {(() => {
                        const info = nearestCuspInfo(comparison.current.longitude)
                        if (info && info.distance <= 0.5) {
                          return (
                            <Text style={styles.nearCuspChip}>{`${tl('próx. cúspide', 'next cusp', 'próx. cúspide', 'pross. cuspide')} ${info.house} (${info.distance.toFixed(2)}°)`}</Text>
                          )
                        }
                        return null
                      })()}
                    </TouchableOpacity>
                  </>
                )
              })()}
            </View>

                        {/* Transitos pessoais para este planeta em transito */}
            {(personalByTransitPlanet[comparison.name]?.length ?? 0) > 0 && (
              <View style={styles.aspectsSection}>
                <Text style={styles.aspectsTitle}>{tr('transits.personal.title', 'Personal transits')}:</Text>
                {personalByTransitPlanet[comparison.name].map((t, idx) => {
                  const key = `${t.transitPlanet}|${t.type}|${t.natalPlanet}`
                  const windowInfo = resolveWindowInfo((t as any).window || personalWindowMap.get(key))
                  const reading = buildAspectReading({
                    planet: t.transitPlanet,
                    aspectType: t.type,
                    targetLabel: translatePlanetName(t.natalPlanet),
                    house: comparison.current.house,
                    days: windowInfo?.days || null,
                    phase: windowInfo?.phaseLabel || null,
                    scope: 'pessoal'
                  })
                  return (
                    <View key={idx} style={styles.aspectItem}>
                      <Text style={[styles.aspectIcon, { color: getAspectColor(t.type) }]}>{getAspectIcon(t.type)}</Text>
                      <Pressable
                        style={({ hovered, pressed }: any) => [
                          styles.aspectBodyInteractive,
                          hovered && styles.aspectBodyInteractiveHovered,
                          pressed && styles.aspectBodyInteractivePressed
                        ]}
                        onPress={() =>
                          openDetailModal({
                            title: `${translatePlanetName(t.transitPlanet)} ${translateAspectLabel(t.type)} ${translatePlanetName(t.natalPlanet)}`,
                            subtitle: `${tl('Trânsito pessoal', 'Personal transit', 'Tránsito personal', 'Transito personale')} • ${translatePlanetName(comparison.name)}`,
                            short: reading.short,
                            long: reading.long,
                            keywords: [
                              tl('trânsito pessoal', 'personal transit', 'tránsito personal', 'transito personale'),
                              translatePlanetName(t.transitPlanet),
                              translateAspectLabel(t.type),
                              translatePlanetName(t.natalPlanet),
                              `${tl('Casa', 'House', 'Casa', 'Casa')} ${comparison.current.house}`,
                            ],
                          })
                        }
                      >
                        <View style={styles.aspectLine}>
                          <Text style={styles.aspectText}>
                            {translatePlanetName(t.transitPlanet)} {translateAspectLabel(t.type)} {translatePlanetName(t.natalPlanet)}
                          </Text>
                        </View>
                        <View style={styles.aspectActionsRow}>
                          <Text style={styles.aspectMetaInline}>{formatWindowInline(windowInfo)}</Text>
                          <ReadingOpenIcon />
                        </View>
                      </Pressable>
                    </View>
                  )
                })}
              </View>
            )}
            {/* Aspectos coletivos do momento para este planeta */}
            {comparison.planetaryAspects.length > 0 && (
              <View style={styles.aspectsSection}>
                <Text style={styles.aspectsTitle}>{tr('transits.collective.title', 'Collective aspects')}:</Text>
                {comparison.planetaryAspects.map((aspect, aspectIndex) => {
                  const windowInfo = resolveWindowInfo((aspect as any).window)
                  const reading = buildAspectReading({
                    planet: aspect.planet1,
                    aspectType: aspect.type,
                    targetLabel: translatePlanetName(aspect.planet2),
                    house: comparison.current.house,
                    days: windowInfo?.days || null,
                    phase: windowInfo?.phaseLabel || null,
                    scope: 'coletivo'
                  })
                  return (
                    <View key={aspectIndex} style={styles.aspectItem}>
                      <Text style={[styles.aspectIcon, { color: getAspectColor(aspect.type) }]}>{getAspectIcon(aspect.type)}</Text>
                      <Pressable
                        style={({ hovered, pressed }: any) => [
                          styles.aspectBodyInteractive,
                          hovered && styles.aspectBodyInteractiveHovered,
                          pressed && styles.aspectBodyInteractivePressed
                        ]}
                        onPress={() =>
                          openDetailModal({
                            title: `${translatePlanetName(aspect.planet1)} ${translateAspectLabel(aspect.type)} ${translatePlanetName(aspect.planet2)}`,
                            subtitle: `${tl('Aspecto coletivo', 'Collective aspect', 'Aspecto colectivo', 'Aspetto collettivo')} • ${translatePlanetName(comparison.name)}`,
                            short: reading.short,
                            long: reading.long,
                            keywords: [
                              tl('aspecto coletivo', 'collective aspect', 'aspecto colectivo', 'aspetto collettivo'),
                              translatePlanetName(aspect.planet1),
                              translateAspectLabel(aspect.type),
                              translatePlanetName(aspect.planet2),
                              `${tl('Casa', 'House', 'Casa', 'Casa')} ${comparison.current.house}`,
                            ],
                          })
                        }
                      >
                        <View style={styles.aspectLine}>
                          <Text style={styles.aspectText}>
                            {translatePlanetName(aspect.planet1)} {translateAspectLabel(aspect.type)} {translatePlanetName(aspect.planet2)}
                          </Text>
                        </View>
                        <View style={styles.aspectActionsRow}>
                          <Text style={styles.aspectMetaInline}>{formatWindowInline(windowInfo)}</Text>
                          <ReadingOpenIcon />
                        </View>
                      </Pressable>
                    </View>
                  )
                })}
              </View>
            )}
            {/* Aspectos com casas */}
            {comparison.houseAspects.length > 0 && (
              <View style={styles.aspectsSection}>
                <Text style={styles.aspectsTitle}>{tl('Aspectos com casas', 'House aspects', 'Aspectos con casas', 'Aspetti con case')}:</Text>
                {comparison.houseAspects.slice(0, 2).map((houseAspect, houseIndex) => {
                  const windowInfo = resolveWindowInfo((houseAspect as any).window)
                  const reading = buildAspectReading({
                    planet: comparison.name,
                    aspectType: houseAspect.aspect,
                    targetLabel: `${tl('Casa', 'House', 'Casa', 'Casa')} ${houseAspect.house} (${houseAspect.meaning})`,
                    house: houseAspect.house,
                    days: windowInfo?.days || null,
                    phase: windowInfo?.phaseLabel || null,
                    scope: 'casa'
                  })
                  return (
                    <View key={houseIndex} style={styles.aspectItem}>
                      <Text style={[styles.aspectIcon, { color: getAspectColor(houseAspect.aspect) }]}>{getAspectIcon(houseAspect.aspect)}</Text>
                      <Pressable
                        style={({ hovered, pressed }: any) => [
                          styles.aspectBodyInteractive,
                          hovered && styles.aspectBodyInteractiveHovered,
                          pressed && styles.aspectBodyInteractivePressed
                        ]}
                        onPress={() =>
                          openDetailModal({
                            title: `${tl('Casa', 'House', 'Casa', 'Casa')} ${houseAspect.house} • ${houseAspect.meaning}`,
                            subtitle: `${tl('Aspecto com casa', 'House aspect', 'Aspecto con casa', 'Aspetto con casa')} • ${translatePlanetName(comparison.name)}`,
                            short: reading.short,
                            long: reading.long,
                            keywords: [
                              tl('aspecto com casa', 'house aspect', 'aspecto con casa', 'aspetto con casa'),
                              translatePlanetName(comparison.name),
                              translateAspectLabel(houseAspect.aspect),
                              `${tl('Casa', 'House', 'Casa', 'Casa')} ${houseAspect.house}`,
                              houseAspect.meaning,
                            ],
                          })
                        }
                      >
                        <View style={styles.aspectLine}>
                          <Text style={styles.aspectText}>{tl('Casa', 'House', 'Casa', 'Casa')} {houseAspect.house} - {houseAspect.meaning}</Text>
                        </View>
                        <View style={styles.aspectActionsRow}>
                          <Text style={styles.aspectMetaInline}>{formatWindowInline(windowInfo)}</Text>
                          <ReadingOpenIcon />
                        </View>
                      </Pressable>
                    </View>
                  )
                })}
              </View>
            )}
            </View>
          </View>
        ))}
      </View>

      <ReadingDetailModal
        visible={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        title={detailModalTitle}
        subtitle={detailModalSubtitle || null}
        directText={detailModalShort}
        fullText={detailModalLong}
        keywords={detailModalKeywords}
      />

      <Modal
        visible={planetMeaningModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setPlanetMeaningModalOpen(false)}
      >
        <View style={styles.planetMeaningBackdrop}>
          <View style={[styles.planetMeaningCard, isNarrow ? styles.detailModalCardNarrow : styles.detailModalCardWide]}>
            <LinearGradient
              colors={['#101936', '#1C2A56']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.planetMeaningHero}
            >
              <View style={styles.planetMeaningHeroLeft}>
                {planetMeaningData?.imageUri && !failedPlanetImages[planetMeaningPlanet || ''] ? (
                  <Image source={{ uri: planetMeaningData.imageUri }} style={styles.planetMeaningHeroImage} resizeMode="cover" />
                ) : (
                  <Text style={styles.planetMeaningHeroFallback}>{planetMeaningData?.fallbackIcon || '?'}</Text>
                )}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.planetMeaningTitle}>{planetMeaningData?.planetName || ''}</Text>
                <Text style={styles.planetMeaningSubtitle}>
                  {tl(
                    'Força astrológica em leitura aplicada',
                    'Astrological strength in applied reading',
                    'Fuerza astrológica en lectura aplicada',
                    'Forza astrologica in lettura applicata'
                  )}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setPlanetMeaningModalOpen(false)} style={styles.detailCloseIcon}>
                <Ionicons name="close" size={20} color="#0A1633" />
              </TouchableOpacity>
            </LinearGradient>

            <ScrollView style={styles.planetMeaningScroll} showsVerticalScrollIndicator={false}>
              <View style={styles.planetMeaningTagsRow}>
                {(planetMeaningData?.keywords || []).slice(0, 3).map((keyword) => (
                  <View key={keyword} style={styles.planetMeaningTag}>
                    <Text style={styles.planetMeaningTagText}>{keyword}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.planetMeaningSectionCard}>
                <Text style={styles.planetMeaningSectionLabel}>{tl('Força do planeta', 'Planet strength', 'Fuerza del planeta', 'Forza del pianeta')}</Text>
                <Text style={styles.planetMeaningBody}>{planetMeaningData?.essence || ''}</Text>
                <Text style={styles.planetMeaningBody}>{planetMeaningData?.forceLine || ''}</Text>
              </View>

              <View style={styles.planetMeaningSectionCard}>
                <Text style={styles.planetMeaningSectionLabel}>{tl('Efeito em aspecto', 'Aspect effect', 'Efecto en aspecto', 'Effetto in aspetto')}</Text>
                <Text style={styles.planetMeaningBody}>{planetMeaningData?.inAspect || ''}</Text>
                <Text style={styles.planetMeaningBody}>{planetMeaningData?.personalLine || ''}</Text>
              </View>

              <View style={styles.planetMeaningSectionCard}>
                <Text style={styles.planetMeaningSectionLabel}>{tl('Efeito em casa', 'House effect', 'Efecto en casa', 'Effetto in casa')}</Text>
                <Text style={styles.planetMeaningBody}>{planetMeaningData?.inHouse || ''}</Text>
                <Text style={styles.planetMeaningBody}>{planetMeaningData?.natalLine || ''}</Text>
                <Text style={styles.planetMeaningBody}>{planetMeaningData?.collectiveLine || ''}</Text>
              </View>

              <View style={styles.planetMeaningSectionCard}>
                <Text style={styles.planetMeaningSectionLabel}>{tl('Uso prático', 'Practical use', 'Uso práctico', 'Uso pratico')}</Text>
                <Text style={styles.planetMeaningBody}>{planetMeaningData?.practical || ''}</Text>
                <Text style={styles.planetMeaningBody}>{planetMeaningData?.practicalUse || ''}</Text>
              </View>
            </ScrollView>

            <TouchableOpacity style={styles.detailModalButton} onPress={() => setPlanetMeaningModalOpen(false)}>
              <Text style={styles.detailModalButtonText}>{tr('common.close', 'Close')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Resumo da carta (após planetas) */}
      <View style={styles.summarySection}>
        <View style={styles.sectionHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="analytics" size={20} color="#FFD700" />
            <Text style={styles.sectionTitle}>{tl('Resumo da Carta', 'Chart Summary', 'Resumen de la Carta', 'Riepilogo del Tema')}</Text>
            {showApprox ? <Text style={{ color: '#FFD700', marginLeft: 8, fontSize: 12 }}>{tl('aprox', 'approx', 'aprox', 'appross')}</Text> : null}
          </View>
        </View>

        <View style={styles.analysisRow}>
          <View style={styles.weightMethodCard}>
            <Text style={styles.weightMethodTitle}>{tl('Método de peso do balanço', 'Balance weighting method', 'Metodo de peso del balance', 'Metodo di peso del bilancio')}</Text>
            <Text style={styles.weightMethodText}>
              {tl('Balanço', 'Balance', 'Balance', 'Bilancio')} = ({tl('Signos', 'Signs', 'Signos', 'Segni')} x {Math.round(SIGN_WEIGHT * 100)}%) + ({tl('Casas', 'Houses', 'Casas', 'Case')} x {Math.round(HOUSE_WEIGHT * 100)}%)
            </Text>
            <Text style={styles.weightMethodText}>
              {tl(
                'Signos mostram o estilo de expressão; casas mostram a área ativada no mapa.',
                'Signs show expression style; houses show the area activated in the chart.',
                'Los signos muestran el estilo de expresión; las casas muestran el área activada en la carta.',
                'I segni mostrano lo stile di espressione; le case mostrano l area attivata nel tema.'
              )}
            </Text>
          </View>
          <Text style={styles.analysisLabel}>{tl('Elementos (Signos | Casas | Balanço):', 'Elements (Signs | Houses | Balance):', 'Elementos (Signos | Casas | Balance):', 'Elementi (Segni | Case | Bilancio):')}</Text>
          <View style={styles.balanceGrid}>
            {renderBalanceColumns({
              periodLabel: tl('Natal', 'Natal', 'Natal', 'Natale'),
              signRows: weightedElementRows.natal,
              kind: 'element'
            })}
            {renderBalanceColumns({
              periodLabel: tl('Atual', 'Current', 'Actual', 'Attuale'),
              signRows: weightedElementRows.current,
              kind: 'element'
            })}
          </View>
        </View>

        <View style={styles.analysisRow}>
          <Text style={styles.analysisLabel}>{tl('Modalidades (Signos | Casas | Balanço):', 'Modalities (Signs | Houses | Balance):', 'Modalidades (Signos | Casas | Balance):', 'Modalita (Segni | Case | Bilancio):')}</Text>
          <View style={styles.balanceGrid}>
            {renderBalanceColumns({
              periodLabel: tl('Natal', 'Natal', 'Natal', 'Natale'),
              signRows: weightedModalityRows.natal,
              kind: 'modality'
            })}
            {renderBalanceColumns({
              periodLabel: tl('Atual', 'Current', 'Actual', 'Attuale'),
              signRows: weightedModalityRows.current,
              kind: 'modality'
            })}
          </View>
        </View>
      </View>
    </LinearGradient>
  )
}

function formatMetricPercent(value: number | null | undefined): string {
  if (typeof value !== 'number' || Number.isNaN(value)) return '--'
  return `${Math.round(value * 100)}%`
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  summarySection: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  analysisRow: {
    marginBottom: 12,
  },
  analysisLabel: {
    color: '#E2E8F0',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  weightMethodCard: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.25)',
    padding: 10,
    marginBottom: 8,
  },
  weightMethodTitle: {
    color: '#FFE58D',
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  weightMethodText: {
    color: '#E2E8F0',
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 2,
  },
  balanceGrid: {
    gap: 8,
  },
  balanceCard: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: 10,
  },
  balanceColumns: {
    flexDirection: 'row',
    gap: 8,
  },
  balanceColumn: {
    flex: 1,
    minWidth: 0,
  },
  balanceColumnTitle: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  balanceRowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  balanceRowText: {
    color: '#E2E8F0',
    fontSize: 11,
    marginLeft: 4,
  },
  balanceRowTextPredominant: {
    color: '#34D399',
    fontWeight: '700',
  },
  balancePredominantText: {
    color: '#34D399',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 4,
  },
  elementalGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  elementalComparison: {
    flex: 1,
    marginHorizontal: 4,
  },
  comparisonLabel: {
    color: '#A0A0A0',
    fontSize: 12,
    marginBottom: 4,
  },
  elementalRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  elementalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
    marginBottom: 2,
  },
  elementalItemText: {
    color: '#FFFFFF',
    fontSize: 12,
    marginLeft: 4,
  },
  elementalItemMeta: {
    color: '#94A3B8',
    fontSize: 10,
  },
  planetsSection: {
    flex: 1,
  },
  planetCard: {
    backgroundColor: 'rgba(42, 42, 62, 0.6)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#FFD700',
    overflow: 'hidden',
    position: 'relative',
  },
  planetArtworkWrap: {
    position: 'absolute',
    left: -52,
    top: -36,
    width: 250,
    height: 250,
    opacity: 0.5,
  },
  planetArtwork: {
    width: 250,
    height: 250,
    borderRadius: 125,
  },
  planetArtworkWhiteBgFix: {
    backgroundColor: 'rgba(8,12,30,0.92)',
  },
  planetArtworkFade: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 250,
    height: 250,
    borderRadius: 125,
  },
  planetContent: {
    position: 'relative',
    zIndex: 2,
  },
  planetHeader: {
    marginBottom: 12,
  },
  planetHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  planetHeaderMain: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 0,
    flexShrink: 1,
  },
  planetHeaderImage: {
    width: 34,
    height: 34,
    borderRadius: 17,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.45)',
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  planetHeaderImageWhiteBgFix: {
    backgroundColor: 'rgba(8,12,30,0.92)',
  },
  planetGlyphFallback: {
    color: '#F8FAFC',
    fontSize: 22,
    width: 28,
    marginRight: 10,
    textAlign: 'center',
  },
  planetName: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: 'bold',
  },
  planetReadHintIcon: {
    marginLeft: 10,
    opacity: 0.96,
  },
  comparisonGrid: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  comparisonColumn: {
    width: '31.5%',
    minWidth: 0,
    paddingHorizontal: 5,
    paddingVertical: 6,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    marginBottom: 8,
  },
  columnTitle: {
    color: '#A0A0A0',
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  metricLine: {
    color: '#E2E8F0',
    fontSize: 12,
    marginBottom: 6,
    lineHeight: 16,
  },
  metricLineStrong: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
  },
  metricHint: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 4,
  },
  positionText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  houseText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  speedText: {
    color: '#10B981',
    fontSize: 12,
    marginBottom: 8,
  },
  attributesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  attributeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 4,
    marginBottom: 2,
  },
  attributeChipText: {
    color: '#FFFFFF',
    fontSize: 10,
    marginLeft: 4,
  },
  aspectsSection: {
    marginTop: 12,
  },
  aspectsTitle: {
    color: '#FCD34D',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  influenceRow: {
    marginBottom: 8,
  },
  influenceArea: {
    color: '#FDE68A',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  influenceText: {
    color: '#E2E8F0',
    fontSize: 11,
    marginLeft: 2,
    marginBottom: 2,
  },
  systemBadge: {
    borderRadius: 8,
    backgroundColor: 'rgba(255,215,0,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  systemBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  nearCuspChip: {
    marginLeft: 8,
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    color: '#FFD700',
    fontSize: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  aspectItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  aspectIcon: {
    fontSize: 16,
    marginRight: 8,
    width: 20,
    textAlign: 'center',
  },
  aspectBody: {
    flex: 1,
  },
  aspectBodyInteractive: {
    flex: 1,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'transparent',
    backgroundColor: 'rgba(255,255,255,0.01)',
  },
  aspectBodyInteractiveHovered: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderColor: 'rgba(252, 211, 77, 0.35)',
  },
  aspectBodyInteractivePressed: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderColor: 'rgba(252, 211, 77, 0.55)',
  },
  aspectLine: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  aspectText: {
    color: '#FFFFFF',
    fontSize: 12,
    flex: 1,
  },
  aspectMetaInline: {
    color: '#94A3B8',
    fontSize: 11,
    marginRight: 8,
  },
  aspectActionsRow: {
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  readButtonText: {
    color: '#E2E8F0',
    fontSize: 12,
    fontWeight: '700',
  },
  detailModalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 14,
  },
  detailModalCard: {
    backgroundColor: '#ECE9E1',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D9C07A',
    maxHeight: '88%',
    width: '100%',
  },
  detailModalCardNarrow: {
    maxWidth: 620,
  },
  detailModalCardWide: {
    maxWidth: 840,
  },
  detailModalHeader: {
    backgroundColor: '#ECE9E1',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  detailCloseIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#EFF3FA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailModalTitle: {
    color: '#0A1633',
    fontSize: 24,
    fontWeight: '800',
  },
  detailModalSubtitle: {
    color: '#A85A12',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 4,
  },
  detailModalScroll: {
    backgroundColor: '#F6F7F9',
    borderTopWidth: 1,
    borderTopColor: '#D9C07A',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  detailSectionLabel: {
    color: '#A85A12',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 8,
    marginTop: 6,
  },
  detailBody: {
    color: '#1F334F',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 10,
  },
  detailModalButton: {
    margin: 16,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#081A45',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailModalButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
  },
  planetMeaningBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 14,
  },
  planetMeaningCard: {
    backgroundColor: '#0F1836',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    maxHeight: '90%',
    width: '100%',
    overflow: 'hidden',
  },
  planetMeaningHero: {
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.14)',
  },
  planetMeaningHeroLeft: {
    width: 64,
    height: 64,
    borderRadius: 32,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.24)',
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  planetMeaningHeroImage: {
    width: '100%',
    height: '100%',
  },
  planetMeaningHeroFallback: {
    color: '#FFF',
    fontSize: 30,
    fontWeight: '800',
  },
  planetMeaningTitle: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: '800',
  },
  planetMeaningSubtitle: {
    color: '#C9D6FF',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },
  planetMeaningScroll: {
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: '#151F42',
  },
  planetMeaningTagsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
    flexWrap: 'wrap',
  },
  planetMeaningTag: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: 'rgba(255, 215, 0, 0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.35)',
  },
  planetMeaningTagText: {
    color: '#FFE58D',
    fontSize: 12,
    fontWeight: '700',
  },
  planetMeaningSectionLabel: {
    color: '#FFD166',
    fontSize: 14,
    fontWeight: '800',
    marginTop: 8,
    marginBottom: 4,
  },
  planetMeaningBody: {
    color: '#E8EEFF',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 8,
  },
  planetMeaningSectionCard: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 10,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  // \u00F0\u0178\u017D\u00AF ESTILOS PARA ASCENDENTE E MEIO DO C\u00C3\u2030U
  anglesSection: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  angleCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  angleHeader: {
    marginBottom: 8,
  },
  angleName: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  angleComparison: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  angleColumn: {
    flex: 1,
    alignItems: 'center',
  },
  angleLabel: {
    color: '#CCCCCC',
    fontSize: 12,
    marginBottom: 4,
  },
  angleDegree: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  angleSign: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '600',
  },
  angleArrow: {
    color: '#FFD700',
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 16,
  },
  // \u00F0\u0178\u0152\u0152 Estilos das casas removidos (n\u00C3\u00A3o implementadas)
})






































































