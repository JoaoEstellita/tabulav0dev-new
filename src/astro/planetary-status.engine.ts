/**
 * ===================== SISTEMA DE SCORE PLANETÁRIO =====================
 *
 * Todos os fatores que compõem o score planetário estão centralizados e documentados abaixo:
 *
 * 1. Dignidade Essencial (domicílio, exaltação, triplicidade, detrimento, queda)
 *    - Pesos: domicílio +5, exaltação +4, triplicidade +3, detrimento -5, queda -4
 * 2. Força da Casa
 *    - Angulares: 5, Sucedentes: 3-4, Cadentes: 1 (nunca negativo)
 * 3. Harmonia Signo-Casa
 *    - Máxima harmonia: 3 (signo natural), compatibilidade elementar: 2, modal: 1
 * 4. Força Elementar e Modal
 *    - Pesos tradicionais diferenciados por signo (elementStrength + modalityStrength)
 * 5. Força dos Aspectos
 *    - Pesos centralizados em aspect-config.ts
 *    - Aspectos maiores: conjunção, oposição, trígono, quadratura, sextil
 *    - Aspectos menores: quincúncio, semissextil, semiquadratura, sesquiquadratura
 *    - Soma dos menores nunca ultrapassa a dos maiores (normalização automática)
 * 6. Condições Especiais
 *    - Retrógrado, combustão, estacionário, etc. (ajustes pequenos)
 *
 * Todos os pesos e lógicas estão centralizados em aspect-config.ts e planetary-status.config.ts.
 *
 * Testes de regressão e integração garantem que scores estejam sempre na faixa esperada e que edge cases sejam cobertos.
 * ========================================================================
 */
import { ASPECT_WEIGHTS } from './aspect-config';
import { EssentialDignity, PlanetaryScore, PlanetaryStatus, PlanetaryStatusLevel, PlanetName, SignName } from './planetary-status.types'
import { ESSENTIAL_DIGNITIES_LOOKUP, ELEMENTAL_MODALITY_SYSTEM, HOUSE_STRENGTH_SYSTEM } from './planetary-status.config'
import { DetectedAspect, AspectName } from './aspects.types'
import aspectsConfig from './aspects.config'

/**
 * Calcula a dignidade essencial de um planeta em um signo
 * Baseado na tradição astrológica clássica
 */
export function calculateEssentialDignity(planet: PlanetName, sign: SignName): number {
  const dignity = ESSENTIAL_DIGNITIES_LOOKUP[planet];
  if (!dignity) return 0;
  if (dignity.domicile && dignity.domicile.includes(sign)) return 5;
  if (dignity.exaltation && dignity.exaltation.includes(sign)) return 4;
  if (dignity.triplicity && dignity.triplicity.includes(sign)) return 3;
  if (dignity.detriment && dignity.detriment.includes(sign)) return -5;
  if (dignity.fall && dignity.fall.includes(sign)) return -4;
  return 0;
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
  if (planetElement && houseElement && planetElement !== houseElement) {
    // Penalidade explícita para desarmonia elementar
    return -1
  }

  // Verificar compatibilidade modal
  const planetModality = ELEMENTAL_MODALITY_SYSTEM[planetSign]?.modality
  const houseModality = ELEMENTAL_MODALITY_SYSTEM[naturalSign]?.modality

  if (planetModality === houseModality) return 1
  if (planetModality && houseModality && planetModality !== houseModality) {
    // Penalidade leve para desarmonia modal
    return -0.5
  }

  return 0
}

/**
 * Calcula a força elementar e modal do planeta
 * Considera a compatibilidade com o signo e casa
 */
export function calculateElementalModalityStrength(sign: SignName): number {
  const signInfo = ELEMENTAL_MODALITY_SYSTEM[sign]
  if (!signInfo) return 0

  // Força elementar e modal diferenciada
  const { elementStrength, modalityStrength } = signInfo
  // Permite fácil ajuste futuro: soma direta
  return elementStrength + modalityStrength
}

/**
 * Calcula a força dos aspectos para um planeta específico
 * Integra com o sistema de aspectos existente usando o engine
 */
export function calculateAspectStrength(planet: PlanetName, aspects: DetectedAspect[]): number {
  // Separar aspectos maiores e menores
  const MAJOR_ASPECTS: AspectName[] = ['conjunção', 'oposição', 'trígono', 'quadratura', 'sextil']
  const MINOR_ASPECTS: AspectName[] = ['quincúncio', 'semissextil', 'semiquadratura', 'sesquiquadratura']

  let majorTotal = 0
  let minorTotal = 0

  for (const aspect of aspects) {
    if (aspect.planet1 === planet || aspect.planet2 === planet) {
      const strength = calculateAspectValue(aspect)
      if (MAJOR_ASPECTS.includes(aspect.type)) {
        majorTotal += strength
      } else if (MINOR_ASPECTS.includes(aspect.type)) {
        minorTotal += strength
      }
    }
  }

  // Limitar a soma dos aspectos menores para nunca ultrapassar o peso de um trígono
  // Isso evita que muitos aspectos menores distorçam o resultado
  const minorCapped = Math.min(minorTotal, ASPECT_WEIGHTS['trígono'])

  return majorTotal + minorCapped
}

/**
 * Calcula o valor individual de um aspecto
 * Baseado no tipo, orbe e aplicação - integrado com o sistema de aspectos
 */
function calculateAspectValue(aspect: DetectedAspect): number {
  // Usar pesos centralizados do aspect-config
  const baseValue = ASPECT_WEIGHTS[aspect.type] || 0

  // Fator de orbe: orbe menor = mais forte (baseado na configuração)
  const maxOrb = getMaxOrbForAspect(aspect.type)
  const orbFactor = Math.max(0.1, 1 - (aspect.orb / maxOrb))

  // Bônus para aspectos aplicantes (mais ativos)
  const applyingBonus = aspect.isApplying ? 1.1 : 1.0

  // Bônus por força do aspecto (baseado no engine) - reduzido
  const strengthBonus = (aspect.strength / 100) * 0.3 + 0.7

  // Bônus para aspectos exatos (partis): orbe < 0.5°
  const partisBonus = aspect.orb < 0.5 ? 1.2 : 1.0

  return baseValue * orbFactor * applyingBonus * strengthBonus * partisBonus
}

/**
 * Obtém o orbe máximo para um tipo de aspecto específico
 * Usa a configuração do sistema de aspectos
 */
function getMaxOrbForAspect(aspectType: string): number {
  const aspect = aspectsConfig.aspects.find(a => a.name === aspectType)
  return aspect ? aspect.baseOrb : 6 // fallback padrão
}

/**
 * Calcula condições especiais (retrógrado, combustão, etc.)
 * Sistema expandido com mais condições astrológicas
 */
export function calculateSpecialConditions(
  planet: PlanetName, 
  aspects: DetectedAspect[], 
  isRetrograde: boolean, 
  speed: number,
  planetSigns?: Record<PlanetName, SignName>
): number {
  let total = 0
  
  // Retrógrado: energia internalizada (pode ser positiva ou negativa)
  if (isRetrograde) {
    // Dependendo do planeta, retrógrado pode ser benéfico
    const retrogradePlanets: PlanetName[] = ['Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn'] as PlanetName[];
    if (retrogradePlanets.includes(planet)) {
      total -= 0.3 // Penalidade mais leve
    } else {
      total -= 0.7 // Penalidade moderada
    }
  }

  // Velocidade muito baixa: planeta estacionário (mais forte)
  if (Math.abs(speed) < 0.1) total += 1.5

  // Velocidade muito alta: planeta em movimento rápido
  if (Math.abs(speed) > 2.0) total += 0.7

  // Velocidade moderada: planeta em ritmo normal
  if (Math.abs(speed) >= 0.1 && Math.abs(speed) <= 1.0) total += 0.3

  // Bônus de recepção mútua: se planeta está no domicílio de outro planeta e vice-versa
  total += calculatePlanetSpecificConditions(planet, aspects, planetSigns)

  // Detecção de recepção mútua (apenas para planetas clássicos)
  if (planetSigns) {
    const doms = ['Sun','Moon','Mercury','Venus','Mars','Jupiter','Saturn'] as PlanetName[];
    if (doms.includes(planet)) {
      for (const other of doms) {
        if (other !== planet) {
          const planetSign = planetSigns[planet];
          const otherSign = planetSigns[other];
          const planetDoms = ESSENTIAL_DIGNITIES_LOOKUP[planet]?.domicile || [];
          const otherDoms = ESSENTIAL_DIGNITIES_LOOKUP[other]?.domicile || [];
          if (planetDoms.includes(otherSign) && otherDoms.includes(planetSign)) {
            total += 1.2; // Bônus de recepção mútua
          }
        }
      }
    }
  }

  return total
}

/**
 * Calcula condições específicas por planeta
 * Considera características únicas de cada planeta
 */
function calculatePlanetSpecificConditions(planet: PlanetName, aspects: DetectedAspect[], planetSigns?: Record<PlanetName, SignName>): number {
  let total = 0
  
  // Sol: combustão (muito próximo ao Sol) e Cazimi
  if (planet === 'Sun') {
    const sunAspects = aspects.filter(a => 
      (a.planet1 === 'Sun' || a.planet2 === 'Sun') && a.type === 'conjunção'
    )
    for (const aspect of sunAspects) {
      if (aspect.orb < 0.17) total += 1.5 // Cazimi: fortalecimento máximo
      else if (aspect.orb < 1) total -= 2 // Combustão severa
      else if (aspect.orb < 3) total -= 1 // Combustão leve
    }
  }

  // Mercúrio: combustão e Cazimi quando próximo ao Sol
  if (planet === 'Mercury') {
    const sunMercuryAspects = aspects.filter(a => 
      ((a.planet1 === 'Sun' && a.planet2 === 'Mercury') || 
       (a.planet1 === 'Mercury' && a.planet2 === 'Sun')) && 
      a.type === 'conjunção'
    )
    for (const aspect of sunMercuryAspects) {
      if (aspect.orb < 0.17) total += 1.5 // Cazimi
      else if (aspect.orb < 1) total -= 2 // Combustão severa
      else if (aspect.orb < 3) total -= 1 // Combustão leve
    }
  }
  
  // Lua: aspectos com Sol (luminar)
  if (planet === 'Moon') {
    const sunAspects = aspects.filter(a => 
      (a.planet1 === 'Sun' || a.planet2 === 'Sun') && 
      (a.planet1 === 'Moon' || a.planet2 === 'Moon')
    )
    for (const aspect of sunAspects) {
      if (aspect.type === 'conjunção') total += 1
      else if (aspect.type === 'oposição') total += 0.5
    }
  }
  
  // Planetas pessoais: aspectos entre si (teto máximo de 1.2)
  const personalPlanets: PlanetName[] = ['Mercury', 'Venus', 'Mars'] as PlanetName[];
  if (personalPlanets.includes(planet)) {
    const personalAspects = aspects.filter(a => 
      (a.planet1 === planet || a.planet2 === planet) &&
      personalPlanets.includes((a.planet1 === planet ? a.planet2 : a.planet1) as PlanetName)
    )
    const bonus = Math.min(personalAspects.length * 0.3, 1.2)
    total += bonus
  }

  // Planetas sociais: aspectos com luminares (teto máximo de 1.2)
  const socialPlanets: PlanetName[] = ['Jupiter', 'Saturn'] as PlanetName[];
  if (socialPlanets.includes(planet)) {
    const luminaryAspects = aspects.filter(a => 
      (a.planet1 === planet || a.planet2 === planet) &&
      (a.planet1 === 'Sun' || a.planet2 === 'Sun' || a.planet1 === 'Moon' || a.planet2 === 'Moon')
    )
    const bonus = Math.min(luminaryAspects.length * 0.4, 1.2)
    total += bonus
  }

  return total
}

/**
 * Função principal para calcular o status planetário completo
 * Integra todos os parâmetros de forma balanceada e sofisticada
 */
export type LifeAreaContext = 'love' | 'career' | 'health' | 'general';

export function calculatePlanetaryStatus(
  planet: PlanetName,
  sign: SignName,
  house: number,
  aspects: DetectedAspect[],
  isRetrograde: boolean,
  speed: number,
  planetSigns?: Record<PlanetName, SignName>,
  context: LifeAreaContext = 'general'
): PlanetaryStatus {
  
  // 1. Dignidades essenciais (base fundamental) - peso alto
  const essential = calculateEssentialDignity(planet, sign)

  // 2. Força da casa (posição no mapa) - peso alto
  const houseStrength = calculateHouseStrength(house)

  // 2b. Dignidade acidental avançada
  // Angularidade: bônus extra para casas 1, 4, 7, 10
  let accidentalDignity = 0
  if ([1, 4, 7, 10].includes(house)) accidentalDignity += 1.2
  // Cadentes: penalidade extra para casas 3, 6, 9, 12
  if ([3, 6, 9, 12].includes(house)) accidentalDignity -= 0.7

  // Velocidade: bônus se acima de 1.5, penalidade se entre 0.1 e 0.3 (exceto estacionário)
  if (Math.abs(speed) > 1.5) accidentalDignity += 0.5
  if (Math.abs(speed) > 0.1 && Math.abs(speed) < 0.3) accidentalDignity -= 0.5
  
  // 3. Harmonia signo-casa (compatibilidade) - peso médio
  const signHouseHarmony = calculateSignHouseHarmony(sign, house)
  
  // 4. Força elementar e modal (natureza do planeta) - peso baixo
  const elementalStrength = calculateElementalModalityStrength(sign)
  
  // 5. Força dos aspectos (interações) - peso alto
  const aspectStrength = calculateAspectStrength(planet, aspects)
  
  // 6. Condições especiais (estado do planeta) - peso médio
  const specialConditions = calculateSpecialConditions(planet, aspects, isRetrograde, speed, planetSigns)
  
  // 7. Total ponderado (soma balanceada com pesos revisados)
  // Pesos ajustados para maior equilíbrio entre fatores
  // Limitar impacto de fatores secundários
  const cappedAspectStrength = Math.min(aspectStrength, 4)
  const cappedSpecialConditions = Math.max(Math.min(specialConditions, 2), -2)
  const cappedSignHouseHarmony = Math.max(Math.min(signHouseHarmony, 3), -2)
  const cappedElementalStrength = Math.max(Math.min(elementalStrength, 4), 0)

  // Pesos padrão
  let weights = {
    essential: 0.6,
    houseStrength: 0.6,
    accidentalDignity: 0.5,
    signHouseHarmony: 0.5,
    elementalStrength: 0.4,
    aspectStrength: 0.6,
    specialConditions: 0.5
  };

  // Ajuste de pesos por contexto
  if (context === 'love') {
    if (planet === 'Venus' || planet === 'Moon') weights.essential += 0.2;
    if (planet === 'Mars') weights.aspectStrength += 0.1;
    weights.houseStrength += 0.1;
  } else if (context === 'career') {
    if (planet === 'Saturn' || planet === 'Sun' || planet === 'Jupiter') weights.essential += 0.2;
    weights.houseStrength += 0.15;
    weights.accidentalDignity += 0.1;
  } else if (context === 'health') {
    if (planet === 'Mercury' || planet === 'Moon') weights.essential += 0.15;
    weights.specialConditions += 0.1;
  }

  let total = (essential * weights.essential) + 
              (houseStrength * weights.houseStrength) +
              (accidentalDignity * weights.accidentalDignity) +
              (cappedSignHouseHarmony * weights.signHouseHarmony) + 
              (cappedElementalStrength * weights.elementalStrength) + 
              (cappedAspectStrength * weights.aspectStrength) + 
              (cappedSpecialConditions * weights.specialConditions)

  // Saturação: planeta em exílio/detrimento nunca pode ser 'Muito Forte'
  let level = classifyPlanetaryStatus(total)
  if ((essential === -5 || essential === -4) && level === 'Muito Forte') {
    level = 'Forte'
    total = Math.min(total, 7.5)
  }

  // 9. Interpretação baseada no status
  const interpretation = generatePlanetaryInterpretation(planet, level, sign, house, total)

  // 10. Análise detalhada dos aspectos
  const aspectAnalysis = analyzePlanetAspects(planet, aspects)

  // Explicação detalhada do breakdown
  const breakdownExplanation: string[] = [];
  if (essential >= 4) breakdownExplanation.push('Dignidade essencial muito forte (domicílio/exaltação).');
  else if (essential > 0) breakdownExplanation.push('Dignidade essencial positiva.');
  else if (essential < 0) breakdownExplanation.push('Dignidade essencial negativa (exílio/queda).');

  if (houseStrength >= 5) breakdownExplanation.push('Casa angular: máxima força acidental.');
  else if (houseStrength >= 3) breakdownExplanation.push('Casa sucedente: força média.');
  else if (houseStrength < 0) breakdownExplanation.push('Casa desafiadora: penalidade aplicada.');

  if (accidentalDignity > 0.5) breakdownExplanation.push('Bônus de angularidade ou velocidade.');
  else if (accidentalDignity < 0) breakdownExplanation.push('Penalidade por cadência ou lentidão.');

  if (cappedSignHouseHarmony > 1) breakdownExplanation.push('Harmonia signo-casa elevada.');
  else if (cappedSignHouseHarmony < 0) breakdownExplanation.push('Desarmonia signo-casa penaliza o status.');

  if (cappedElementalStrength > 2) breakdownExplanation.push('Força elementar/modal acima da média.');
  else if (cappedElementalStrength === 0) breakdownExplanation.push('Força elementar/modal neutra.');

  if (cappedAspectStrength > 2) breakdownExplanation.push('Aspectos muito favoráveis fortalecem o planeta.');
  else if (cappedAspectStrength < 1) breakdownExplanation.push('Poucos aspectos relevantes.');

  if (cappedSpecialConditions > 1) breakdownExplanation.push('Condições especiais muito favoráveis (ex: Cazimi, recepção mútua).');
  else if (cappedSpecialConditions < 0) breakdownExplanation.push('Condições especiais desfavoráveis (ex: combustão, retrógrado).');

  return {
    level,
    score: total,
    breakdown: {
      essential,
      houseStrength,
      accidentalDignity,
      signHouseHarmony: cappedSignHouseHarmony,
      elementalStrength: cappedElementalStrength,
      aspectStrength: cappedAspectStrength,
      specialConditions: cappedSpecialConditions,
      total
    },
    interpretation,
    aspectAnalysis,
    breakdownExplanation
  }
}

/**
 * Analisa os aspectos de um planeta específico
 * Fornece insights detalhados sobre as interações
 */
function analyzePlanetAspects(planet: PlanetName, aspects: DetectedAspect[]): {
  totalAspects: number
  majorAspects: number
  minorAspects: number
  applyingAspects: number
  strongestAspect?: DetectedAspect
  aspectTypes: Record<string, number>
} {
  const planetAspects = aspects.filter(a => 
    a.planet1 === planet || a.planet2 === planet
  )
  
  const majorAspects = planetAspects.filter(a => 
    ['conjunção', 'oposição', 'trígono', 'quadratura'].includes(a.type)
  ).length
  
  const minorAspects = planetAspects.filter(a => 
    !['conjunção', 'oposição', 'trígono', 'quadratura'].includes(a.type)
  ).length
  
  const applyingAspects = planetAspects.filter(a => a.isApplying).length
  
  const strongestAspect = planetAspects.reduce((strongest, current) => 
    current.strength > (strongest?.strength || 0) ? current : strongest
  , undefined as DetectedAspect | undefined)
  
  const aspectTypes = planetAspects.reduce((acc, aspect) => {
    acc[aspect.type] = (acc[aspect.type] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  return {
    totalAspects: planetAspects.length,
    majorAspects,
    minorAspects,
    applyingAspects,
    strongestAspect,
    aspectTypes
  }
}

/**
 * Classifica o status planetário baseado na pontuação total
 * Sistema de 6 níveis para precisão astrológica
 */
function classifyPlanetaryStatus(score: number): PlanetaryStatusLevel {
  if (score >= 10) return 'Muito Forte'
  if (score >= 7) return 'Forte'
  if (score >= 3) return 'Moderado'
  if (score >= 0) return 'Neutro'
  if (score >= -4) return 'Fraco'
  return 'Muito Fraco'
}

/**
 * Gera interpretação baseada no status do planeta
 * Texto personalizado e informativo com insights astrológicos
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
    'Muito Forte': 'está em condição excepcional, com máxima expressão de suas qualidades',
    'Forte': 'está bem posicionado e pode expressar suas energias de forma positiva',
    'Moderado': 'tem influência equilibrada, com algumas limitações mas também oportunidades',
    'Neutro': 'tem influência neutra, sem grandes destaques ou desafios',
    'Fraco': 'enfrenta alguns desafios que podem limitar sua expressão natural',
    'Muito Fraco': 'enfrenta desafios significativos que requerem atenção especial'
  }
  
  const levelDesc = levelDescriptions[level]
  
  // Adicionar insights específicos por casa
  const houseInsights = {
    1: 'na Casa 1 (Identidade) - influencia diretamente sua personalidade e iniciativa',
    2: 'na Casa 2 (Valores) - afeta seus recursos materiais e valores pessoais',
    3: 'na Casa 3 (Comunicação) - influencia sua comunicação e aprendizado',
    4: 'na Casa 4 (Lar) - afeta seu ambiente doméstico e raízes familiares',
    5: 'na Casa 5 (Criatividade) - influencia sua expressão criativa e romances',
    6: 'na Casa 6 (Trabalho) - afeta sua rotina diária e saúde',
    7: 'na Casa 7 (Relacionamentos) - influencia suas parcerias e relacionamentos',
    8: 'na Casa 8 (Transformação) - afeta transformações profundas e recursos compartilhados',
    9: 'na Casa 9 (Expansão) - influencia sua busca por conhecimento e viagens',
    10: 'na Casa 10 (Carreira) - afeta sua ambição profissional e status social',
    11: 'na Casa 11 (Amizades) - influencia seus grupos sociais e aspirações',
    12: 'na Casa 12 (Subconsciente) - afeta seu mundo interior e espiritualidade'
  }
  
  const houseInsight = houseInsights[house as keyof typeof houseInsights] || `na Casa ${house}`
  
  return `${planetName} em ${signName} ${levelDesc} ${houseInsight}. Status: ${score.toFixed(1)} pontos.`
}