// Tipos para sistema de visualização dual (simples + técnico)
export type ViewMode = 'simple' | 'technical' | 'dual'
export type UserLevel = 'beginner' | 'intermediate' | 'expert'

// === INTERFACES SIMPLIFICADAS ===

export interface SimplifiedGreeting {
  userName: string
  currentDate: string
  dailyEnergy: {
    level: '🔥 Alta' | '⚡ Média' | '💧 Baixa'
    theme: string
    quickTip: string
  }
  lunarPhase: {
    phase: string
    influence: string
  }
}

export interface SimplifiedTabula {
  periodStatus: {
    status: 'Equilibrado' | 'Intenso' | 'Tranquilo' | 'Transformador'
    description: string
    energy: '🔥' | '⚡' | '💧' | '🌊'
  }
  personalTransits: {
    summary: string
    mainTheme: string
    intensity: 'Baixa' | 'Média' | 'Alta'
    action: string
  }
  collectiveTransits: {
    summary: string
    globalTheme: string
    personalImpact: string
  }
}

export interface SimplifiedLifeArea {
  area: string
  energy: {
    percentage: number
    level: 'Excelente' | 'Bom' | 'Moderado' | 'Desafiador'
    color: 'success' | 'warning' | 'info' | 'danger'
  }
  mainInfluence: {
    planet: string
    description: string
    impact: string
  }
  dailyGuidance: {
    focus: string
    avoid: string
    opportunity: string
  }
  technicalSummary: {
    dignities: string
    house: string
    aspects: string
  }
}

export interface SimplifiedTransitView {
  currentPeriod: {
    theme: string
    energy: string
    duration: string
  }
  personalImpact: {
    main: string
    secondary: string
    timing: string
  }
  recommendations: {
    focus: string
    avoid: string
    opportunity: string
  }
}

export interface SimplifiedElementsView {
  currentBalance: {
    fire: { level: string; influence: string }
    earth: { level: string; influence: string }
    air: { level: string; influence: string }
    water: { level: string; influence: string }
  }
  mainTheme: string
  recommendations: string[]
}

// === INTERFACES TÉCNICAS ===

export interface TechnicalTransitView {
  natalPositions: {
    planet: string
    sign: string
    degree: number
    house: number
    dignity: string
    elements: string[]
    modalities: string[]
  }
  currentPositions: {
    planet: string
    sign: string
    degree: number
    house: number
    transitType: string
    orb: number
    applying: boolean
  }
  transitDetails: {
    type: string
    orb: number
    applying: boolean
    strength: number
    houseImpact: number
    duration: string
    contacts: any[]
  }
  calculations: {
    essentialDignity: number
    houseStrength: number
    aspectStrength: number
    specialConditions: number
    totalScore: number
    interpretation: string
  }
}

export interface TechnicalElementsView {
  natal: {
    elements: Record<string, number>
    modalities: Record<string, number>
    balance: any
  }
  current: {
    elements: Record<string, number>
    modalities: Record<string, number>
    balance: any
  }
  changes: {
    elementChanges: any[]
    modalityChanges: any[]
    impact: string
  }
  calculations: {
    natalScore: number
    currentScore: number
    changeScore: number
    interpretation: string
  }
}

// === INTERFACE DUAL COMPLETA ===

export interface DualAnalysisView {
  simplified: {
    overview: {
      energyLevel: string
      mainTheme: string
      timeFrame: string
      dailyMood: string
    }
    practicalGuidance: {
      do: string[]
      avoid: string[]
      focus: string[]
    }
    timing: {
      bestTime: string
      challengingTime: string
      peakMoments: string[]
    }
  }
  technical: {
    planetaryStatus: any
    aspects: {
      active: any[]
      analysis: any
      interpretations: string[]
    }
    transits: {
      personal: any[]
      collective: any[]
      timing: any[]
    }
    elements: any
    houses: any
  }
}

// === SISTEMA DE TOGGLE ===

export interface ViewModeConfig {
  mode: ViewMode
  userPreference: UserLevel
  autoSwitch: boolean
}

export interface TechnicalTooltip {
  term: string
  simple: string
  technical: string
  example: string
  significance: string
}

export interface AstrologicalTranslation {
  technical: string
  simple: string
  practical: string
  action: string
}
