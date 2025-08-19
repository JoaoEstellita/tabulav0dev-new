export { computeHousesUTC } from './houses'
export { degToSign } from './houses.math'
export type { Planet } from './planets'

// Novas exportações para status planetários
export { calculatePlanetaryStatus } from './planetary-status.engine'
export type { PlanetaryStatus, PlanetaryScore, PlanetaryStatusLevel } from './planetary-status.types'

// Sistema de visualização dual (simples + técnico)
export { AstrologicalTranslator } from './astrological-translator'
export { SimplifiedInsightsEngine } from './simplified-insights.engine'
export { TechnicalAnalysisEngine } from './technical-analysis.engine'
export type { 
  ViewMode, 
  UserLevel, 
  SimplifiedGreeting, 
  SimplifiedTabula, 
  SimplifiedLifeArea,
  SimplifiedTransitView,
  SimplifiedElementsView,
  DualAnalysisView,
  ViewModeConfig,
  TechnicalTooltip,
  AstrologicalTranslation
} from './dual-view.types'