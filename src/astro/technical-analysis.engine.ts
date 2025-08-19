import type { 
  DualAnalysisView, 
  TechnicalTransitView, 
  TechnicalElementsView 
} from './dual-view.types'
import type { PlanetaryStatus, DetectedAspect } from './planetary-status.types'
import { AstrologicalTranslator } from './astrological-translator'

// Engine para análise técnica completa com todos os dados astrológicos
export class TechnicalAnalysisEngine {
  
  // === ANÁLISE DUAL COMPLETA ===
  static generateDualAnalysis(
    planetaryStatus: PlanetaryStatus,
    aspects: DetectedAspect[],
    natalData: any,
    currentData: any
  ): DualAnalysisView {
    const simplified = this.generateSimplifiedView(planetaryStatus, aspects)
    const technical = this.generateTechnicalView(planetaryStatus, aspects, natalData, currentData)
    
    return {
      simplified,
      technical
    }
  }

  private static generateSimplifiedView(planetaryStatus: PlanetaryStatus, aspects: DetectedAspect[]): any {
    const energyLevel = `Energia ${this.getEnergyLevel(planetaryStatus.score)} (${planetaryStatus.score.toFixed(1)} pontos)`
    const mainTheme = this.generateMainTheme(planetaryStatus, aspects)
    const timeFrame = this.calculateTimeFrame(aspects)
    const dailyMood = this.generateDailyMood(planetaryStatus, aspects)
    
    const practicalGuidance = this.generatePracticalGuidance(planetaryStatus, aspects)
    const timing = this.generateTiming(aspects, planetaryStatus)
    
    return {
      overview: {
        energyLevel,
        mainTheme,
        timeFrame,
        dailyMood
      },
      practicalGuidance,
      timing
    }
  }

  private static generateTechnicalView(
    planetaryStatus: PlanetaryStatus, 
    aspects: DetectedAspect[], 
    natalData: any, 
    currentData: any
  ): any {
    const aspectsAnalysis = this.analyzeAspectsCompletely(aspects)
    const transits = this.analyzeTransits(aspects, natalData, currentData)
    const elements = this.analyzeElements(natalData, currentData)
    const houses = this.analyzeHouses(natalData, currentData)
    
    return {
      planetaryStatus,
      aspects: aspectsAnalysis,
      transits,
      elements,
      houses
    }
  }

  // === ANÁLISE SIMPLIFICADA ===
  private static getEnergyLevel(score: number): string {
    if (score >= 10) return 'Excepcional'
    if (score >= 6) return 'Alta'
    if (score >= 2) return 'Moderada'
    if (score >= -2) return 'Equilibrada'
    if (score >= -6) return 'Baixa'
    return 'Muito Baixa'
  }

  private static generateMainTheme(planetaryStatus: PlanetaryStatus, aspects: DetectedAspect[]): string {
    const dignity = this.getDignityTheme(planetaryStatus.breakdown.essential)
    const house = this.getHouseTheme(planetaryStatus.breakdown.houseStrength)
    const aspectsTheme = this.getAspectsTheme(aspects)
    
    return `${dignity}, ${house}, ${aspectsTheme}`
  }

  private static getDignityTheme(score: number): string {
    if (score >= 4) return 'Força excepcional'
    if (score >= 3) return 'Força moderada'
    if (score >= 0) return 'Influência equilibrada'
    if (score >= -4) return 'Desafios para expressar'
    return 'Dificuldades significativas'
  }

  private static getHouseTheme(score: number): string {
    if (score >= 4) return 'Posição muito forte'
    if (score >= 2) return 'Posição favorável'
    if (score >= 0) return 'Posição neutra'
    if (score >= -2) return 'Posição desafiadora'
    return 'Posição muito desafiadora'
  }

  private static getAspectsTheme(aspects: DetectedAspect[]): string {
    if (aspects.length === 0) return 'Sem aspectos ativos'
    
    const majorAspects = aspects.filter(a => ['conjunção', 'oposição', 'trígono', 'quadratura'].includes(a.type))
    const minorAspects = aspects.filter(a => !['conjunção', 'oposição', 'trígono', 'quadratura'].includes(a.type))
    
    let theme = ''
    if (majorAspects.length > 0) {
      theme += `${majorAspects.length} aspectos principais`
    }
    if (minorAspects.length > 0) {
      if (theme) theme += ' e '
      theme += `${minorAspects.length} aspectos menores`
    }
    
    return theme
  }

  private static calculateTimeFrame(aspects: DetectedAspect[]): string {
    if (aspects.length === 0) return 'Sem influências temporais'
    
    const applyingAspects = aspects.filter(a => a.isApplying)
    const separatingAspects = aspects.filter(a => !a.isApplying)
    
    if (applyingAspects.length > 0) {
      return `Próximos ${Math.min(7, applyingAspects.length * 2)} dias - aspectos se fortalecendo`
    }
    
    if (separatingAspects.length > 0) {
      return 'Integrando lições dos aspectos recentes'
    }
    
    return 'Momento de estabilização'
  }

  private static generateDailyMood(planetaryStatus: PlanetaryStatus, aspects: DetectedAspect[]): string {
    const score = planetaryStatus.score
    const aspectCount = aspects.length
    
    if (score >= 8 && aspectCount >= 3) return 'Dia de alta energia e múltiplas oportunidades'
    if (score >= 6 && aspectCount >= 2) return 'Dia favorável para projetos e conexões'
    if (score >= 4) return 'Dia equilibrado para desenvolvimento e crescimento'
    if (score >= 0) return 'Dia de manutenção e ajustes graduais'
    if (score >= -4) return 'Dia de reflexão e trabalho interno'
    return 'Dia de desafios que pedem paciência e sabedoria'
  }

  private static generatePracticalGuidance(planetaryStatus: PlanetaryStatus, aspects: DetectedAspect[]): any {
    const doActions = this.generateDoActions(planetaryStatus, aspects)
    const avoidActions = this.generateAvoidActions(planetaryStatus, aspects)
    const focusAreas = this.generateFocusAreas(planetaryStatus, aspects)
    
    return {
      do: doActions,
      avoid: avoidActions,
      focus: focusAreas
    }
  }

  private static generateDoActions(planetaryStatus: PlanetaryStatus, aspects: DetectedAspect[]): string[] {
    const actions: string[] = []
    const score = planetaryStatus.score
    
    if (score >= 6) {
      actions.push('Iniciar projetos importantes')
      actions.push('Tomar decisões significativas')
      actions.push('Conectar com pessoas influentes')
    } else if (score >= 2) {
      actions.push('Desenvolver habilidades')
      actions.push('Fazer networking')
      actions.push('Planejar próximos passos')
    } else if (score >= -2) {
      actions.push('Manter rotinas estáveis')
      actions.push('Fazer ajustes graduais')
      actions.push('Observar padrões')
    } else {
      actions.push('Trabalhar internamente')
      actions.push('Buscar apoio quando necessário')
      actions.push('Praticar paciência')
    }
    
    // Adicionar ações baseadas nos aspectos
    const applyingAspects = aspects.filter(a => a.isApplying)
    if (applyingAspects.length > 0) {
      actions.push('Aproveitar momento de ação (aspectos aplicantes)')
    }
    
    return actions
  }

  private static generateAvoidActions(planetaryStatus: PlanetaryStatus, aspects: DetectedAspect[]): string[] {
    const actions: string[] = []
    const score = planetaryStatus.score
    
    if (score <= -4) {
      actions.push('Evitar decisões importantes')
      actions.push('Evitar confrontos')
      actions.push('Evitar mudanças bruscas')
    } else if (score <= 0) {
      actions.push('Evitar excessos')
      actions.push('Evitar pressa')
      actions.push('Evitar expectativas irreais')
    } else if (score <= 4) {
      actions.push('Evitar procrastinação')
      actions.push('Evitar dispersão')
    } else {
      // Para scores altos, adicionar avisos de moderação
      actions.push('Evitar excesso de confiança')
      actions.push('Evitar impaciência com outros')
      actions.push('Evitar negligenciar detalhes')
    }
    
    // Adicionar avisos baseados nos aspectos
    const challengingAspects = aspects.filter(a => ['oposição', 'quadratura'].includes(a.type))
    if (challengingAspects.length > 0) {
      actions.push('Evitar tensões desnecessárias')
    }
    
    // Sempre retornar pelo menos uma ação
    if (actions.length === 0) {
      actions.push('Manter equilíbrio e moderação')
    }
    
    return actions
  }

  private static generateFocusAreas(planetaryStatus: PlanetaryStatus, aspects: DetectedAspect[]): string[] {
    const areas: string[] = []
    const score = planetaryStatus.score
    
    if (score >= 6) {
      areas.push('Desenvolvimento de liderança')
      areas.push('Expansão de influência')
      areas.push('Manifestação de objetivos')
    } else if (score >= 2) {
      areas.push('Crescimento pessoal')
      areas.push('Construção de relacionamentos')
      areas.push('Desenvolvimento de habilidades')
    } else if (score >= -2) {
      areas.push('Estabilidade emocional')
      areas.push('Organização pessoal')
      areas.push('Reflexão e autoconhecimento')
    } else {
      areas.push('Cura e transformação')
      areas.push('Desenvolvimento de resiliência')
      areas.push('Busca de apoio e orientação')
    }
    
    return areas
  }

  private static generateTiming(aspects: DetectedAspect[], planetaryStatus: PlanetaryStatus): any {
    const bestTime = this.calculateBestTime(aspects, planetaryStatus)
    const challengingTime = this.calculateChallengingTime(aspects, planetaryStatus)
    const peakMoments = this.calculatePeakMoments(aspects)
    
    return {
      bestTime,
      challengingTime,
      peakMoments
    }
  }

  private static calculateBestTime(aspects: DetectedAspect[], planetaryStatus: PlanetaryStatus): string {
    const applyingAspects = aspects.filter(a => a.isApplying)
    
    if (applyingAspects.length > 0) {
      return 'Manhã: momento ideal para ação e decisões'
    }
    
    if (planetaryStatus.score >= 4) {
      return 'Tarde: energia favorável para projetos'
    }
    
    return 'Manhã: momento de clareza e planejamento'
  }

  private static calculateChallengingTime(aspects: DetectedAspect[], planetaryStatus: PlanetaryStatus): string {
    const challengingAspects = aspects.filter(a => ['oposição', 'quadratura'].includes(a.type))
    
    if (challengingAspects.length > 0) {
      return 'Tarde: evite discussões e decisões importantes'
    }
    
    if (planetaryStatus.score <= 0) {
      return 'Tarde: momento de menor energia'
    }
    
    return 'Tarde: momento de integração e reflexão'
  }

  private static calculatePeakMoments(aspects: DetectedAspect[]): string[] {
    const moments: string[] = []
    
    if (aspects.length > 0) {
      moments.push('9h - Comunicação e conexões')
      moments.push('15h - Reflexão e planejamento')
      moments.push('18h - Integração e fechamento')
    } else {
      moments.push('Manhã - Foco e produtividade')
      moments.push('Tarde - Desenvolvimento pessoal')
    }
    
    return moments
  }

  // === ANÁLISE TÉCNICA COMPLETA ===
  private static analyzeAspectsCompletely(aspects: DetectedAspect[]): any {
    const interpretations = aspects.map(aspect => 
      AstrologicalTranslator.explainAspect(aspect.planet1, aspect.planet2, aspect.type, aspect.orb)
    )
    
    return {
      active: aspects,
      analysis: this.generateAspectAnalysis(aspects),
      interpretations
    }
  }

  private static generateAspectAnalysis(aspects: DetectedAspect[]): any {
    const byType = aspects.reduce((acc, aspect) => {
      acc[aspect.type] = (acc[aspect.type] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    const byStrength = aspects.reduce((acc, aspect) => {
      if (aspect.strength >= 80) acc.veryStrong = (acc.veryStrong || 0) + 1
      else if (aspect.strength >= 60) acc.strong = (acc.strong || 0) + 1
      else if (aspect.strength >= 40) acc.moderate = (acc.moderate || 0) + 1
      else acc.weak = (acc.weak || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    const applying = aspects.filter(a => a.isApplying).length
    const separating = aspects.filter(a => !a.isApplying).length
    
    return {
      byType,
      byStrength,
      applying,
      separating,
      total: aspects.length
    }
  }

  private static analyzeTransits(aspects: DetectedAspect[], natalData: any, currentData: any): any {
    // Implementar análise completa de trânsitos
    return {
      personal: aspects,
      collective: [],
      timing: []
    }
  }

  private static analyzeElements(natalData: any, currentData: any): any {
    // Implementar análise completa de elementos
    return {
      natal: {},
      current: {},
      changes: []
    }
  }

  private static analyzeHouses(natalData: any, currentData: any): any {
    // Implementar análise completa de casas
    return {
      natal: {},
      current: {},
      progressions: []
    }
  }
}
