import type { 
  SimplifiedGreeting, 
  SimplifiedTabula, 
  SimplifiedLifeArea, 
  SimplifiedTransitView,
  SimplifiedElementsView 
} from './dual-view.types'
import type { PlanetaryStatus, DetectedAspect, PlanetName } from './planetary-status.types'
import { AstrologicalTranslator } from './astrological-translator'

// Engine para gerar insights simplificados baseados em dados astrológicos técnicos
export class SimplifiedInsightsEngine {
  
  // === GREETING SIMPLIFICADO ===
  static generateSimplifiedGreeting(
    userName: string,
    currentDate: string,
    lunarPhase: string,
    planetaryStatuses: PlanetaryStatus[]
  ): SimplifiedGreeting {
    const overallEnergy = this.calculateOverallEnergy(planetaryStatuses)
    const dailyTheme = this.generateDailyTheme(planetaryStatuses)
    const quickTip = this.generateQuickTip(planetaryStatuses)
    
    return {
      userName,
      currentDate,
      dailyEnergy: {
        level: overallEnergy,
        theme: dailyTheme,
        quickTip
      },
      lunarPhase: {
        phase: lunarPhase,
        influence: this.getLunarInfluence(lunarPhase)
      }
    }
  }

  private static calculateOverallEnergy(statuses: PlanetaryStatus[]): '🔥 Alta' | '⚡ Média' | '💧 Baixa' {
    const avgScore = statuses.reduce((sum, status) => sum + status.score, 0) / statuses.length
    
    if (avgScore >= 6) return '🔥 Alta'
    if (avgScore >= 2) return '⚡ Média'
    return '💧 Baixa'
  }

  private static generateDailyTheme(statuses: PlanetaryStatus[]): string {
    const strongPlanets = statuses.filter(s => s.score >= 6)
    const challengingPlanets = statuses.filter(s => s.score <= -2)
    
    if (strongPlanets.length >= 3) return 'Dia de expressão e conquistas'
    if (challengingPlanets.length >= 3) return 'Dia de ajustes e reflexão'
    if (strongPlanets.length >= 2) return 'Dia de oportunidades e crescimento'
    return 'Dia equilibrado para manutenção e planejamento'
  }

  private static generateQuickTip(statuses: PlanetaryStatus[]): string {
    const strongPlanets = statuses.filter(s => s.score >= 6)
    const weakPlanets = statuses.filter(s => s.score <= -2)
    
    if (strongPlanets.length > 0) {
      const planet = strongPlanets[0]
      return `Aproveite a força de ${this.getPlanetName(planet.planet)} para ${this.getPlanetAction(planet.planet)}`
    }
    
    if (weakPlanets.length > 0) {
      const planet = weakPlanets[0]
      return `Foque em desenvolver ${this.getPlanetName(planet.planet)} através de ${this.getPlanetDevelopment(planet.planet)}`
    }
    
    return 'Mantenha o equilíbrio e observe os sinais ao seu redor'
  }

  private static getLunarInfluence(phase: string): string {
    const influences: Record<string, string> = {
      'Nova': 'Momento ideal para novos começos e intenções',
      'Crescente': 'Energia crescente para desenvolvimento e crescimento',
      'Cheia': 'Clareza máxima para decisões e manifestações',
      'Minguante': 'Tempo para reflexão, limpeza e finalizações'
    }
    
    return influences[phase] || 'Fase lunar influencia seu ritmo interno'
  }

  // === TÁBULA SIMPLIFICADA ===
  static generateSimplifiedTabula(
    planetaryStatuses: PlanetaryStatus[],
    aspects: DetectedAspect[],
    collectiveTransits: any[]
  ): SimplifiedTabula {
    const periodStatus = this.analyzePeriodStatus(planetaryStatuses, aspects)
    const personalTransits = this.analyzePersonalTransits(aspects)
    const collectiveTransitsAnalysis = this.analyzeCollectiveTransits(collectiveTransits)
    
    return {
      periodStatus,
      personalTransits,
      collectiveTransits: collectiveTransitsAnalysis
    }
  }

  private static analyzePeriodStatus(statuses: PlanetaryStatus[], aspects: DetectedAspect[]): any {
    const avgScore = statuses.reduce((sum, status) => sum + status.score, 0) / statuses.length
    const aspectIntensity = aspects.length > 0 ? aspects.reduce((sum, a) => sum + a.strength, 0) / aspects.length : 0
    
    if (avgScore >= 6 && aspectIntensity >= 70) {
      return {
        status: 'Intenso',
        description: 'Período de alta energia e mudanças significativas',
        energy: '🔥'
      }
    }
    
    if (avgScore >= 2 && aspectIntensity >= 50) {
      return {
        status: 'Transformador',
        description: 'Período de mudanças graduais e crescimento',
        energy: '🌊'
      }
    }
    
    if (avgScore >= -2) {
      return {
        status: 'Equilibrado',
        description: 'Período estável para manutenção e planejamento',
        energy: '⚡'
      }
    }
    
    return {
      status: 'Tranquilo',
      description: 'Período calmo para reflexão e ajustes internos',
      energy: '💧'
    }
  }

  private static analyzePersonalTransits(aspects: DetectedAspect[]): any {
    const applyingAspects = aspects.filter(a => a.isApplying)
    const majorAspects = aspects.filter(a => ['conjunção', 'oposição', 'trígono', 'quadratura'].includes(a.type))
    
    let intensity: 'Baixa' | 'Média' | 'Alta' = 'Baixa'
    if (majorAspects.length >= 3) intensity = 'Alta'
    else if (majorAspects.length >= 1) intensity = 'Média'
    
    const mainTheme = this.generateTransitTheme(aspects)
    const action = this.generateTransitAction(aspects)
    
    return {
      summary: `${aspects.length} influências ativas`,
      mainTheme,
      intensity,
      action
    }
  }

  private static analyzeCollectiveTransits(transits: any[]): any {
    if (transits.length === 0) {
      return {
        summary: 'Sem influências coletivas relevantes',
        globalTheme: 'Foco em temas pessoais',
        personalImpact: 'Momento para desenvolvimento individual'
      }
    }
    
    const mainTransit = transits[0]
    const globalTheme = this.getCollectiveTheme(mainTransit)
    const personalImpact = this.getPersonalImpact(mainTransit)
    
    return {
      summary: `${transits.length} influências coletivas`,
      globalTheme,
      personalImpact
    }
  }

  // === CARDS DE ÁREAS DE VIDA SIMPLIFICADOS ===
  static generateSimplifiedLifeArea(
    area: string,
    planetaryStatus: PlanetaryStatus,
    aspects: DetectedAspect[]
  ): SimplifiedLifeArea {
    const energy = this.calculateAreaEnergy(planetaryStatus)
    const mainInfluence = this.identifyMainInfluence(planetaryStatus, aspects)
    const dailyGuidance = this.generateDailyGuidance(planetaryStatus, aspects)
    const technicalSummary = this.generateTechnicalSummary(planetaryStatus)
    
    return {
      area,
      energy,
      mainInfluence,
      dailyGuidance,
      technicalSummary
    }
  }

  private static calculateAreaEnergy(status: PlanetaryStatus): any {
    const percentage = Math.max(0, Math.min(100, ((status.score + 10) / 20) * 100))
    
    let level: 'Excelente' | 'Bom' | 'Moderado' | 'Desafiador'
    let color: 'success' | 'warning' | 'info' | 'danger'
    
    if (status.score >= 8) {
      level = 'Excelente'
      color = 'success'
    } else if (status.score >= 4) {
      level = 'Bom'
      color = 'info'
    } else if (status.score >= 0) {
      level = 'Moderado'
      color = 'warning'
    } else {
      level = 'Desafiador'
      color = 'danger'
    }
    
    return { percentage: Math.round(percentage), level, color }
  }

  private static identifyMainInfluence(status: PlanetaryStatus, aspects: DetectedAspect[]): any {
    const strongestAspect = status.aspectAnalysis.strongestAspect
    
    if (strongestAspect) {
      const planet1 = this.getPlanetName(strongestAspect.planet1 as PlanetName)
      const planet2 = this.getPlanetName(strongestAspect.planet2 as PlanetName)
      const aspectType = AstrologicalTranslator.translate(strongestAspect.type)

      return {
        planet: planet1,
        description: `${aspectType.simple} com ${planet2}`,
        impact: aspectType.practical
      }
    }

    const dignity = this.getDignityDescription(status.breakdown.essential)

    return {
      planet: this.getPlanetName(status.planet),
      description: dignity,
      impact: 'Influencia diretamente esta área da vida'
    }
  }

  private static generateDailyGuidance(status: PlanetaryStatus, aspects: DetectedAspect[]): any {
    const focus = this.generateFocusGuidance(status, aspects)
    const avoid = this.generateAvoidGuidance(status, aspects)
    const opportunity = this.generateOpportunityGuidance(status, aspects)
    
    return { focus, avoid, opportunity }
  }

  private static generateTechnicalSummary(status: PlanetaryStatus): any {
    const dignity = this.getDignityDescription(status.breakdown.essential)
    const house = `Casa ${status.breakdown.houseStrength > 0 ? 'forte' : 'desafiadora'}`
    const aspects = `${status.aspectAnalysis.totalAspects} aspectos ativos`
    
    return { dignities: dignity, house, aspects }
  }

  // === FUNÇÕES AUXILIARES ===
  private static getPlanetName(planet: PlanetName): string {
    const planetNames: Record<PlanetName, string> = {
      Sun: 'Sol',
      Moon: 'Lua',
      Mercury: 'Mercúrio',
      Venus: 'Vênus',
      Mars: 'Marte',
      Jupiter: 'Júpiter',
      Saturn: 'Saturno',
      Uranus: 'Urano',
      Neptune: 'Netuno',
      Pluto: 'Plutão',
    }
    return planetNames[planet] || 'Planeta'
  }

  private static getPlanetAction(planet: PlanetName): string {
    const actions: Record<PlanetName, string> = {
      Sun: 'expressar sua identidade e liderança',
      Moon: 'conectar com suas emoções e intuição',
      Mercury: 'comunicar suas ideias e aprender',
      Venus: 'criar harmonia e beleza',
      Mars: 'tomar ação e defender seus interesses',
      Jupiter: 'expandir seus horizontes e otimismo',
      Saturn: 'estruturar seus objetivos e responsabilidades',
      Uranus: 'inovação e quebra de padrões',
      Neptune: 'inspiração e espiritualidade',
      Pluto: 'transformação profunda e poder',
    }
    return actions[planet] || 'desenvolver suas qualidades'
  }

  private static getPlanetDevelopment(planet: PlanetName): string {
    const developments: Record<PlanetName, string> = {
      Sun: 'autoconhecimento e confiança',
      Moon: 'cuidado emocional e intuição',
      Mercury: 'estudo e comunicação clara',
      Venus: 'autoestima e relacionamentos',
      Mars: 'coragem e assertividade',
      Jupiter: 'fé e expansão de horizontes',
      Saturn: 'disciplina e responsabilidade',
      Uranus: 'originalidade e independência',
      Neptune: 'intuição e compaixão',
      Pluto: 'transformação e poder pessoal',
    }
    return developments[planet] || 'desenvolvimento pessoal'
  }

  private static getDignityDescription(score: number): string {
    if (score >= 4) return 'Exaltação - força excepcional'
    if (score >= 3) return 'Triplicidade - força moderada'
    if (score >= 0) return 'Neutro - influência equilibrada'
    if (score >= -4) return 'Queda - desafios para expressar'
    return 'Detrimento - dificuldades significativas'
  }

  private static generateTransitTheme(aspects: DetectedAspect[]): string {
    const themes = aspects.map(aspect => {
      const translation = AstrologicalTranslator.translate(aspect.type)
      return translation.simple
    })
    
    if (themes.length === 0) return 'Foco em desenvolvimento pessoal'
    if (themes.length === 1) return themes[0]
    
    return `${themes.slice(0, -1).join(', ')} e ${themes[themes.length - 1]}`
  }

  private static generateTransitAction(aspects: DetectedAspect[]): string {
    const applyingAspects = aspects.filter(a => a.isApplying)
    
    if (applyingAspects.length === 0) return 'Momento de integração e reflexão'
    
    const mainAspect = applyingAspects[0]
    const translation = AstrologicalTranslator.translate(mainAspect.type)
    
    return `Momento ideal para ${translation.action.toLowerCase()}`
  }

  private static generateFocusGuidance(status: PlanetaryStatus, aspects: DetectedAspect[]): string {
    if (status.score >= 6) return 'Aproveite sua força natural'
    if (status.score >= 2) return 'Desenvolva suas qualidades'
    if (status.score >= -2) return 'Mantenha o equilíbrio'
    return 'Trabalhe conscientemente nos desafios'
  }

  private static generateAvoidGuidance(status: PlanetaryStatus, aspects: DetectedAspect[]): string {
    if (status.score <= -2) return 'Evite decisões importantes'
    if (status.score <= 2) return 'Evite excessos e impulsividade'
    return 'Evite negligenciar suas responsabilidades'
  }

  private static generateOpportunityGuidance(status: PlanetaryStatus, aspects: DetectedAspect[]): string {
    if (status.score >= 6) return 'Momento ideal para grandes projetos'
    if (status.score >= 2) return 'Boa oportunidade para crescimento'
    if (status.score >= -2) return 'Oportunidade para ajustes'
    return 'Oportunidade para desenvolvimento interno'
  }

  private static getCollectiveTheme(transit: any): string {
    // Implementar lógica para temas coletivos
    return 'Mudanças no ambiente coletivo'
  }

  private static getPersonalImpact(transit: any): string {
    // Implementar lógica para impacto pessoal
    return 'Afeta sua rotina e relacionamentos'
  }
}
