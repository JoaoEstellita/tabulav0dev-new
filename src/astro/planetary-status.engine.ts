import { EssentialDignity, PlanetaryScore, PlanetaryStatus, PlanetaryStatusLevel, PlanetName, SignName } from './planetary-status.types'
import { ESSENTIAL_DIGNITIES, ELEMENTAL_MODALITY_SYSTEM, HOUSE_STRENGTH_SYSTEM } from './planetary-status.config'
import { DetectedAspect } from './aspects.types'

/**
 * Calcula a dignidade essencial de um planeta em um signo
 * Baseado na tradição astrológica clássica
 */
export function calculateEssentialDignity(planet: PlanetName, sign: SignName): number {
  const dignity = ESSENTIAL_DIGNITIES.find(d => d.planet === planet)
  if (!dignity) return 0
  
  // Domicílio: máxima força
  if (dignity.domicile.includes(sign)) return 5
  
  // Exaltação: alta força
  if (dignity.exaltation.includes(sign)) return 4
  
  // Triplicidade: força moderada
  if (dignity.triplicity.includes(sign)) return 3
  
  // Detrimento: máxima fraqueza
  if (dignity.detriment.includes(sign)) return -5
  
  // Queda: alta fraqueza
  if (dignity.fall.includes(sign)) return -4
  
  // Neutro: sem dignidade especial
  return 0
}

/**
 * Calcula a força da casa onde o planeta está posicionado
 * Baseado no sistema tradicional de classificação das casas
 */
export function calculateHouseStrength(house: number): number {
  const houseInfo = HOUSE_STRENGTH_SYSTEM[house as keyof typeof HOUSE_STRENGTH_SYSTEM]
  return houseInfo ? houseInfo.strength : 0
}

/**
 * Calcula a harmonia entre o signo do planeta e o signo natural da casa
 * Considera compatibilidade elementar e modal
 */
export function calculateSignHouseHarmony(planetSign: SignName, houseNumber: number): number {
  const naturalRuler = HOUSE_STRENGTH_SYSTEM[houseNumber as keyof typeof HOUSE_STRENGTH_SYSTEM]
  if (!naturalRuler) return 0
  
  // Determinar o signo natural da casa (baseado na ordem natural)
  const naturalSigns = ['Áries', 'Touro', 'Gêmeos', 'Câncer', 'Leão', 'Virgem', 'Libra', 'Escorpião', 'Sagitário', 'Capricórnio', 'Aquário', 'Peixes']
  const naturalSign = naturalSigns[houseNumber - 1] as SignName
  
  // Planeta no signo natural da casa = máxima harmonia
  if (planetSign === naturalSign) return 3
  
  // Verificar compatibilidade elementar
  const planetElement = ELEMENTAL_MODALITY_SYSTEM[planetSign]?.element
  const houseElement = ELEMENTAL_MODALITY_SYSTEM[naturalSign]?.element
  
  if (planetElement === houseElement) return 2
  
  // Verificar compatibilidade modal
  const planetModality = ELEMENTAL_MODALITY_SYSTEM[planetSign]?.modality
  const houseModality = ELEMENTAL_MODALITY_SYSTEM[naturalSign]?.modality
  
  if (planetModality === houseModality) return 1
  
  return 0
}

/**
 * Calcula a força elementar e modal do planeta
 * Considera a compatibilidade com o signo e casa
 */
export function calculateElementalModalityStrength(sign: SignName): number {
  const signInfo = ELEMENTAL_MODALITY_SYSTEM[sign]
  if (!signInfo) return 0
  
  // Base elementar
  let strength = signInfo.strength
  
  // Bônus por modalidade
  if (signInfo.modality === 'Cardinal') strength += 1
  if (signInfo.modality === 'Fixo') strength += 1
  if (signInfo.modality === 'Mutável') strength += 1
  
  return strength
}

/**
 * Calcula a força dos aspectos para um planeta específico
 * Integra com o sistema de aspectos existente
 */
export function calculateAspectStrength(planet: PlanetName, aspects: DetectedAspect[]): number {
  let total = 0
  
  for (const aspect of aspects) {
    if (aspect.planet1 === planet || aspect.planet2 === planet) {
      const strength = calculateAspectValue(aspect)
      total += strength
    }
  }
  
  return total
}

/**
 * Calcula o valor individual de um aspecto
 * Baseado no tipo e orbe
 */
function calculateAspectValue(aspect: DetectedAspect): number {
  const baseValues: Record<string, number> = {
    'conjunção': 3,
    'oposição': 2,
    'trígono': 3,
    'quadratura': 2,
    'sextil': 2,
    'quincúncio': 1,
    'semissextil': 1,
    'semiquadratura': 1,
    'sesquiquadratura': 1
  }
  
  const baseValue = baseValues[aspect.type] || 0
  
  // Fator de orbe: orbe menor = mais forte
  const orbFactor = Math.max(0.1, 1 - (aspect.orb / 10))
  
  // Bônus para aspectos aplicantes
  const applyingBonus = aspect.isApplying ? 1.1 : 1.0
  
  return baseValue * orbFactor * applyingBonus
}

/**
 * Calcula condições especiais (retrógrado, combustão, etc.)
 */
export function calculateSpecialConditions(
  planet: PlanetName, 
  aspects: DetectedAspect[], 
  isRetrograde: boolean, 
  speed: number
): number {
  let total = 0
  
  // Retrógrado: energia internalizada
  if (isRetrograde) total -= 1
  
  // Velocidade muito baixa: planeta estacionário (mais forte)
  if (Math.abs(speed) < 0.1) total += 2
  
  // Velocidade muito alta: planeta em movimento rápido
  if (Math.abs(speed) > 2.0) total += 1
  
  return total
}

/**
 * Função principal para calcular o status planetário completo
 * Integra todos os parâmetros de forma balanceada
 */
export function calculatePlanetaryStatus(
  planet: PlanetName,
  sign: SignName,
  house: number,
  aspects: DetectedAspect[],
  isRetrograde: boolean,
  speed: number
): PlanetaryStatus {
  
  // 1. Dignidades essenciais (base fundamental)
  const essential = calculateEssentialDignity(planet, sign)
  
  // 2. Força da casa (posição no mapa)
  const houseStrength = calculateHouseStrength(house)
  
  // 3. Harmonia signo-casa (compatibilidade)
  const signHouseHarmony = calculateSignHouseHarmony(sign, house)
  
  // 4. Força elementar e modal (natureza do planeta)
  const elementalStrength = calculateElementalModalityStrength(sign)
  
  // 5. Força dos aspectos (interações)
  const aspectStrength = calculateAspectStrength(planet, aspects)
  
  // 6. Condições especiais (estado do planeta)
  const specialConditions = calculateSpecialConditions(planet, aspects, isRetrograde, speed)
  
  // 7. Total ponderado (soma balanceada)
  const total = essential + houseStrength + signHouseHarmony + 
                elementalStrength + aspectStrength + specialConditions
  
  // 8. Classificação do status
  const level = classifyPlanetaryStatus(total)
  
  // 9. Interpretação baseada no status
  const interpretation = generatePlanetaryInterpretation(planet, level, sign, house, total)
  
  return {
    level,
    score: total,
    breakdown: {
      essential,
      houseStrength,
      signHouseHarmony,
      elementalStrength,
      aspectStrength,
      specialConditions,
      total
    },
    interpretation
  }
}

/**
 * Classifica o status planetário baseado na pontuação total
 * Sistema de 6 níveis para precisão
 */
function classifyPlanetaryStatus(score: number): PlanetaryStatusLevel {
  if (score >= 15) return 'Muito Forte'
  if (score >= 10) return 'Forte'
  if (score >= 5) return 'Moderado'
  if (score >= 0) return 'Neutro'
  if (score >= -5) return 'Fraco'
  return 'Muito Fraco'
}

/**
 * Gera interpretação baseada no status do planeta
 * Texto personalizado e informativo
 */
function generatePlanetaryInterpretation(
  planet: PlanetName, 
  level: PlanetaryStatusLevel, 
  sign: SignName, 
  house: number, 
  score: number
): string {
  const planetNames = {
    'Sun': 'Sol', 'Moon': 'Lua', 'Mercury': 'Mercúrio', 'Venus': 'Vênus',
    'Mars': 'Marte', 'Jupiter': 'Júpiter', 'Saturn': 'Saturno',
    'Uranus': 'Urano', 'Neptune': 'Netuno', 'Pluto': 'Plutão'
  }
  
  const planetName = planetNames[planet] || planet
  const signName = sign
  
  const levelDescriptions = {
    'Muito Forte': 'está em condição excepcional',
    'Forte': 'está bem posicionado',
    'Moderado': 'tem influência equilibrada',
    'Neutro': 'tem influência neutra',
    'Fraco': 'enfrenta alguns desafios',
    'Muito Fraco': 'enfrenta desafios significativos'
  }
  
  const levelDesc = levelDescriptions[level]
  
  return `${planetName} em ${signName} ${levelDesc} na Casa ${house}. Status: ${score} pontos.`
}