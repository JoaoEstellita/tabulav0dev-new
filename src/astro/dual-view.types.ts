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

export interface SimplifiedTransitView {
  summary: string
  mainTheme: string
  intensity: 'Baixa' | 'Média' | 'Alta'
  action: string
}

export interface SimplifiedElementsView {
  summary: string
  dominantElement?: string
  dominantModality?: string
}

export interface SimplifiedTabula {
  periodStatus: {
    status: 'Intenso' | 'Transformador' | 'Equilibrado' | 'Tranquilo'
    description: string
    energy: string
  }
  personalTransits: SimplifiedTransitView
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
