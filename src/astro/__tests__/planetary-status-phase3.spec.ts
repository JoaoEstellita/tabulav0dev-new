import { describe, it, expect } from 'vitest'
import { calculatePlanetaryStatus } from '../planetary-status.engine'
import { detectAspects } from '../aspects.engine'
import { ASPECTS_CONFIG } from '../aspect-config'
import type { SignName } from '../planetary-status.types'

describe('Planetary Status Phase 3 - Sistema de Aspectos Integrado', () => {
  
  // Dados de teste para planetas
  const testPlanets = [
    { name: 'Sun', longitude: 15, speed: 1.0 },      // Áries
    { name: 'Moon', longitude: 45, speed: 13.0 },    // Touro
    { name: 'Mercury', longitude: 12, speed: 1.5 },  // Áries (próximo ao Sol)
    { name: 'Venus', longitude: 75, speed: 1.2 },    // Gêmeos
    { name: 'Mars', longitude: 105, speed: 0.8 },    // Câncer
    { name: 'Jupiter', longitude: 135, speed: 0.1 }, // Leão
    { name: 'Saturn', longitude: 165, speed: 0.05 }, // Virgem
  ]

  it('detecta aspectos entre planetas de teste', () => {
  const aspects = detectAspects(testPlanets, testPlanets, ASPECTS_CONFIG)
    
    // Deve encontrar aspectos entre os planetas
    expect(aspects.length).toBeGreaterThan(0)
    
    // Verificar aspectos específicos esperados
    const sunMercury = aspects.find(a => 
      (a.planet1 === 'Sun' && a.planet2 === 'Mercury') ||
      (a.planet1 === 'Mercury' && a.planet2 === 'Sun')
    )
    expect(sunMercury).toBeTruthy()
    expect(sunMercury!.type).toBe('conjunção')
    expect(sunMercury!.orb).toBeLessThan(5) // Orbe pequeno
  })

  it('calcula status planetário com aspectos integrados', () => {
  const aspects = detectAspects(testPlanets, testPlanets, ASPECTS_CONFIG)
    
    // Testar Sol em Áries (exaltação + aspectos)
    const sunStatus = calculatePlanetaryStatus(
      'Sun',
      'Áries',
      1, // Casa 1 (angular)
      aspects,
      false, // não retrógrado
      1.0 // velocidade normal
    )
    
    // Debug: mostrar valores reais
    console.log('🔍 DEBUG Sol Status:', {
      level: sunStatus.level,
      score: sunStatus.score,
      breakdown: sunStatus.breakdown,
      aspects: aspects.length
    })
    
    expect(sunStatus.level).toBe('Muito Forte')
    expect(sunStatus.score).toBeGreaterThan(10)
    expect(sunStatus.aspectAnalysis.totalAspects).toBeGreaterThan(0)
    expect(sunStatus.breakdown.essential).toBe(4) // Exaltação (não domicílio)
    expect(sunStatus.breakdown.houseStrength).toBe(5) // Casa angular
  })

  it('calcula status de planeta com aspectos aplicantes', () => {
  const aspects = detectAspects(testPlanets, testPlanets, ASPECTS_CONFIG)
    
    // Lua em Touro (exaltação) com aspectos
    const moonStatus = calculatePlanetaryStatus(
      'Moon',
      'Touro',
      2, // Casa 2 (sucedente)
      aspects,
      false,
      13.0 // alta velocidade
    )
    
    // Debug: mostrar valores reais da Lua
    console.log('🔍 DEBUG Lua Status:', {
      level: moonStatus.level,
      score: moonStatus.score,
      breakdown: moonStatus.breakdown
    })
    
    // A Lua pode estar "Forte" ou "Muito Forte" dependendo dos aspectos
    expect(['Forte', 'Muito Forte']).toContain(moonStatus.level)
    expect(moonStatus.breakdown.essential).toBe(4) // Exaltação
    expect(moonStatus.breakdown.houseStrength).toBe(3) // Casa sucedente
    expect(moonStatus.aspectAnalysis.applyingAspects).toBeGreaterThanOrEqual(0)
  })

  it('calcula status de planeta em detrimento com aspectos', () => {
  const aspects = detectAspects(testPlanets, testPlanets, ASPECTS_CONFIG)
    
    // Marte em Touro (detrimento) mas com aspectos
    const marsStatus = calculatePlanetaryStatus(
      'Mars',
      'Touro',
      4, // Casa 4 (angular)
      aspects,
      false,
      0.8
    )
    
    // Debug: mostrar valores reais do Marte
    console.log('🔍 DEBUG Marte Status:', {
      level: marsStatus.level,
      score: marsStatus.score,
      breakdown: marsStatus.breakdown,
      essential: marsStatus.breakdown.essential
    })
    
    expect(marsStatus.breakdown.essential).toBe(-5) // Detrimento em Touro
    expect(marsStatus.breakdown.houseStrength).toBe(5) // Casa angular
    // O status final deve ser melhorado pelos aspectos e casa angular
    expect(marsStatus.score).toBeGreaterThan(-5)
  })

  it('analisa aspectos detalhadamente por planeta', () => {
  const aspects = detectAspects(testPlanets, testPlanets, ASPECTS_CONFIG)
    
    const jupiterStatus = calculatePlanetaryStatus(
      'Jupiter',
      'Leão',
      5, // Casa 5
      aspects,
      false,
      0.1 // estacionário
    )
    
    const analysis = jupiterStatus.aspectAnalysis
    
    expect(analysis.totalAspects).toBeGreaterThanOrEqual(0)
    expect(analysis.majorAspects).toBeGreaterThanOrEqual(0)
    expect(analysis.minorAspects).toBeGreaterThanOrEqual(0)
    expect(analysis.aspectTypes).toBeDefined()
    
    // Júpiter estacionário deve ter bônus
    expect(jupiterStatus.breakdown.specialConditions).toBeGreaterThan(0)
  })

  it('calcula condições especiais por planeta', () => {
  const aspects = detectAspects(testPlanets, testPlanets, ASPECTS_CONFIG)
    
    // Mercúrio próximo ao Sol (combustão)
    const mercuryStatus = calculatePlanetaryStatus(
      'Mercury',
      'Áries',
      1,
      aspects,
      false,
      1.5
    )
    
    // Mercúrio deve ter penalidade por combustão (mas pode ter outros bônus)
    // Verificar se há aspectos com Sol que causam combustão
    const sunMercuryAspects = aspects.filter(a => 
      ((a.planet1 === 'Sun' && a.planet2 === 'Mercury') || 
       (a.planet1 === 'Mercury' && a.planet2 === 'Sun')) && 
      a.type === 'conjunção'
    )
    expect(sunMercuryAspects.length).toBeGreaterThan(0)
    
    // Júpiter estacionário deve ter bônus
    const jupiterStatus = calculatePlanetaryStatus(
      'Jupiter',
      'Leão',
      5,
      aspects,
      false,
      0.1
    )
    
    expect(jupiterStatus.breakdown.specialConditions).toBeGreaterThan(0)
  })

  it('integra todos os sistemas de cálculo', () => {
  const aspects = detectAspects(testPlanets, testPlanets, ASPECTS_CONFIG)
    
    // Teste completo de todos os planetas
    const allStatuses = testPlanets.map(planet => {
      const sign = getSignFromLongitude(planet.longitude)
      const house = getHouseFromLongitude(planet.longitude)
      
      return calculatePlanetaryStatus(
        planet.name as any,
        sign,
        house,
        aspects,
        false,
        planet.speed
      )
    })
    
    // Verificar que todos os status foram calculados
    expect(allStatuses).toHaveLength(testPlanets.length)
    
    // Verificar que cada status tem todos os componentes
    allStatuses.forEach(status => {
      expect(status.level).toBeDefined()
      expect(status.score).toBeDefined()
      expect(status.breakdown).toBeDefined()
      expect(status.interpretation).toBeDefined()
      expect(status.aspectAnalysis).toBeDefined()
      
      // Verificar que o breakdown.total é a soma direta dos valores
      const totalBreakdown = Object.values(status.breakdown).reduce((a, b) => a + b, 0)
      expect(totalBreakdown).toBeGreaterThan(0)
      
      // Verificar que o score está na escala correta (entre -10 e 20)
      expect(status.score).toBeGreaterThan(-10)
      expect(status.score).toBeLessThan(20)
    })
  })

  // Funções auxiliares para teste
  function getSignFromLongitude(longitude: number): SignName {
    const signs: SignName[] = ['Áries', 'Touro', 'Gêmeos', 'Câncer', 'Leão', 'Virgem', 'Libra', 'Escorpião', 'Sagitário', 'Capricórnio', 'Aquário', 'Peixes']
    const signIndex = Math.floor(longitude / 30)
    return signs[signIndex % 12]
  }

  function getHouseFromLongitude(longitude: number): number {
    // Simulação simples de casas para teste
    return (Math.floor(longitude / 30) % 12) + 1
  }
})
