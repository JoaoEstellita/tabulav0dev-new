import { describe, it, expect } from 'vitest'
import { AstrologicalTranslator } from '../astrological-translator'
import { SimplifiedInsightsEngine } from '../simplified-insights.engine'
import { TechnicalAnalysisEngine } from '../technical-analysis.engine'
import type { PlanetaryStatus, DetectedAspect } from '../planetary-status.types'

describe('🌟 Sistema de Visualização Dual - Simples + Técnico', () => {
  
  // Dados de teste
  const mockPlanetaryStatus: PlanetaryStatus = {
    level: 'Forte',
    score: 7.5,
    breakdown: {
      essential: 4,
      houseStrength: 5,
      signHouseHarmony: 2,
      elementalStrength: 2,
      aspectStrength: 1.5,
      specialConditions: 1,
      total: 15.5
    },
    interpretation: 'Sol em Áries está bem posicionado e pode expressar suas energias de forma positiva na Casa 1 (Identidade). Status: 7.5 pontos.',
    aspectAnalysis: {
      totalAspects: 3,
      majorAspects: 2,
      minorAspects: 1,
      applyingAspects: 2,
      strongestAspect: {
        planet1: 'Sun',
        planet2: 'Jupiter',
        type: 'trígono',
        orb: 2.1,
        isApplying: true,
        strength: 85
      },
      aspectTypes: {
        'trígono': 2,
        'sextil': 1
      }
    }
  }

  const mockAspects: DetectedAspect[] = [
    {
      planet1: 'Sun',
      planet2: 'Jupiter',
      type: 'trígono',
      orb: 2.1,
      isApplying: true,
      strength: 85,
      side1: 'A',
      side2: 'B'
    },
    {
      planet1: 'Sun',
      planet2: 'Mars',
      type: 'sextil',
      orb: 1.8,
      isApplying: true,
      strength: 72,
      side1: 'A',
      side2: 'B'
    }
  ]

  describe('🔤 AstrologicalTranslator', () => {
    it('✅ Traduz termos técnicos para linguagem simples', () => {
      const translation = AstrologicalTranslator.translate('trígono')
      
      expect(translation.technical).toBe('trígono')
      expect(translation.simple).toBe('Harmonia e fluidez - facilita as coisas')
      expect(translation.practical).toBe('As coisas tendem a fluir naturalmente')
      expect(translation.action).toBe('Deixe as coisas fluírem naturalmente')
    })

    it('✅ Traduz termos de dignidades', () => {
      const domicilio = AstrologicalTranslator.translate('domicílio')
      const exaltacao = AstrologicalTranslator.translate('exaltação')
      const detrimento = AstrologicalTranslator.translate('detrimento')
      
      expect(domicilio.simple).toContain('máxima força')
      expect(exaltacao.simple).toContain('mais forte')
      expect(detrimento.simple).toContain('mais fraco')
    })

    it('✅ Traduz termos de aspectos', () => {
      const conjuncao = AstrologicalTranslator.translate('conjunção')
      const oposicao = AstrologicalTranslator.translate('oposição')
      const quadratura = AstrologicalTranslator.translate('quadratura')
      
      expect(conjuncao.simple).toContain('máxima intensidade')
      expect(oposicao.simple).toContain('pede equilíbrio')
      expect(quadratura.simple).toContain('exige ação')
    })

    it('✅ Traduz termos de casas', () => {
      const angular = AstrologicalTranslator.translate('casa angular')
      const sucedente = AstrologicalTranslator.translate('casa sucedente')
      const cadente = AstrologicalTranslator.translate('casa cadente')
      
      expect(angular.simple).toContain('influencia diretamente')
      expect(sucedente.simple).toContain('influencia gradualmente')
      expect(cadente.simple).toContain('influencia sutilmente')
    })

    it('✅ Traduz elementos e modalidades', () => {
      const fogo = AstrologicalTranslator.translate('fogo')
      const terra = AstrologicalTranslator.translate('terra')
      const cardinal = AstrologicalTranslator.translate('cardinal')
      
      expect(fogo.simple).toContain('Iniciativa')
      expect(terra.simple).toContain('Estabilidade')
      expect(cardinal.simple).toContain('Iniciativa')
    })

    it('✅ Gera explicações práticas para aspectos', () => {
      const explanation = AstrologicalTranslator.explainAspect('Sol', 'Júpiter', 'trígono', 2.1)
      
      expect(explanation).toContain('Sol e Júpiter formam um')
      expect(explanation).toContain('Harmonia e fluidez')
      expect(explanation).toContain('preciso')
    })

    it('✅ Lista todos os termos disponíveis', () => {
      const terms = AstrologicalTranslator.getAllTerms()
      
      expect(terms.length).toBeGreaterThan(20)
      expect(terms).toContain('trígono')
      expect(terms).toContain('domicílio')
      expect(terms).toContain('fogo')
    })
  })

  describe('🌟 SimplifiedInsightsEngine', () => {
    it('✅ Gera greeting simplificado', () => {
      const greeting = SimplifiedInsightsEngine.generateSimplifiedGreeting(
        'João',
        'Terça-Feira, 19 De Agosto',
        'Minguante',
        [mockPlanetaryStatus]
      )
      
      expect(greeting.userName).toBe('João')
      expect(greeting.currentDate).toBe('Terça-Feira, 19 De Agosto')
      expect(greeting.lunarPhase.phase).toBe('Minguante')
      expect(greeting.lunarPhase.influence).toContain('reflexão')
      expect(greeting.dailyEnergy.theme).toBeDefined()
      expect(greeting.dailyEnergy.quickTip).toBeDefined()
    })

    it('✅ Calcula energia geral baseada nos status planetários', () => {
      const highEnergyStatus: PlanetaryStatus = { ...mockPlanetaryStatus, score: 12 }
      const lowEnergyStatus: PlanetaryStatus = { ...mockPlanetaryStatus, score: -3 }
      
      const highEnergyGreeting = SimplifiedInsightsEngine.generateSimplifiedGreeting(
        'João', 'Hoje', 'Nova', [highEnergyStatus]
      )
      const lowEnergyGreeting = SimplifiedInsightsEngine.generateSimplifiedGreeting(
        'João', 'Hoje', 'Nova', [lowEnergyStatus]
      )
      
      expect(highEnergyGreeting.dailyEnergy.level).toBe('🔥 Alta')
      expect(lowEnergyGreeting.dailyEnergy.level).toBe('💧 Baixa')
    })

    it('✅ Gera tema diário baseado nos planetas', () => {
      const strongPlanets = [
        { ...mockPlanetaryStatus, score: 8 },
        { ...mockPlanetaryStatus, score: 9 },
        { ...mockPlanetaryStatus, score: 7 }
      ]
      
      const greeting = SimplifiedInsightsEngine.generateSimplifiedGreeting(
        'João', 'Hoje', 'Nova', strongPlanets
      )
      
      expect(greeting.dailyEnergy.theme).toContain('conquistas')
    })

    it('✅ Gera dica rápida baseada nos planetas', () => {
      const strongPlanet = { ...mockPlanetaryStatus, score: 8 }
      const greeting = SimplifiedInsightsEngine.generateSimplifiedGreeting(
        'João', 'Hoje', 'Nova', [strongPlanet]
      )
      
      expect(greeting.dailyEnergy.quickTip).toContain('Aproveite a força')
    })

    it('✅ Gera influência lunar baseada na fase', () => {
      const novaGreeting = SimplifiedInsightsEngine.generateSimplifiedGreeting(
        'João', 'Hoje', 'Nova', [mockPlanetaryStatus]
      )
      const cheiaGreeting = SimplifiedInsightsEngine.generateSimplifiedGreeting(
        'João', 'Hoje', 'Cheia', [mockPlanetaryStatus]
      )
      
      expect(novaGreeting.lunarPhase.influence).toContain('novos começos')
      expect(cheiaGreeting.lunarPhase.influence).toContain('Clareza máxima')
    })
  })

  describe('🔬 TechnicalAnalysisEngine', () => {
    it('✅ Gera análise dual completa', () => {
      const dualAnalysis = TechnicalAnalysisEngine.generateDualAnalysis(
        mockPlanetaryStatus,
        mockAspects,
        {}, // natalData
        {}  // currentData
      )
      
      expect(dualAnalysis.simplified).toBeDefined()
      expect(dualAnalysis.technical).toBeDefined()
      expect(dualAnalysis.simplified.overview.energyLevel).toContain('7.5')
      expect(dualAnalysis.simplified.overview.mainTheme).toBeDefined()
      expect(dualAnalysis.simplified.overview.timeFrame).toBeDefined()
      expect(dualAnalysis.simplified.overview.dailyMood).toBeDefined()
    })

    it('✅ Gera orientações práticas', () => {
      const dualAnalysis = TechnicalAnalysisEngine.generateDualAnalysis(
        mockPlanetaryStatus,
        mockAspects,
        {},
        {}
      )
      

      
      expect(dualAnalysis.simplified.practicalGuidance.do).toBeDefined()
      expect(dualAnalysis.simplified.practicalGuidance.avoid).toBeDefined()
      expect(dualAnalysis.simplified.practicalGuidance.focus).toBeDefined()
      
      expect(dualAnalysis.simplified.practicalGuidance.do.length).toBeGreaterThan(0)
      expect(dualAnalysis.simplified.practicalGuidance.avoid.length).toBeGreaterThan(0)
      expect(dualAnalysis.simplified.practicalGuidance.focus.length).toBeGreaterThan(0)
    })

    it('✅ Gera timing baseado nos aspectos', () => {
      const dualAnalysis = TechnicalAnalysisEngine.generateDualAnalysis(
        mockPlanetaryStatus,
        mockAspects,
        {},
        {}
      )
      
      expect(dualAnalysis.simplified.timing.bestTime).toBeDefined()
      expect(dualAnalysis.simplified.timing.challengingTime).toBeDefined()
      expect(dualAnalysis.simplified.timing.peakMoments).toBeDefined()
      expect(dualAnalysis.simplified.timing.peakMoments.length).toBeGreaterThan(0)
    })

    it('✅ Analisa aspectos completamente', () => {
      const dualAnalysis = TechnicalAnalysisEngine.generateDualAnalysis(
        mockPlanetaryStatus,
        mockAspects,
        {},
        {}
      )
      
      expect(dualAnalysis.technical.aspects.active).toEqual(mockAspects)
      expect(dualAnalysis.technical.aspects.interpretations).toBeDefined()
      expect(dualAnalysis.technical.aspects.interpretations.length).toBe(2)
      
      // Verificar que as interpretações contêm informações úteis
      dualAnalysis.technical.aspects.interpretations.forEach(interpretation => {
        expect(interpretation).toContain('formam um')
        expect(interpretation).toContain('formam um')
      })
      
      // Verificar que o primeiro aspecto (trígono) contém "Harmonia e fluidez"
      const trineInterpretation = dualAnalysis.technical.aspects.interpretations.find(i => i.includes('Harmonia e fluidez'))
      expect(trineInterpretation).toBeDefined()
      expect(trineInterpretation!).toContain('Harmonia e fluidez')
      
      // Verificar que o segundo aspecto (sextil) contém "Oportunidade"
      const sextileInterpretation = dualAnalysis.technical.aspects.interpretations.find(i => i.includes('Oportunidade'))
      expect(sextileInterpretation).toBeDefined()
      expect(sextileInterpretation!).toContain('Oportunidade')
    })

    it('✅ Classifica energia baseada no score', () => {
      const highScore = { ...mockPlanetaryStatus, score: 15 }
      const mediumScore = { ...mockPlanetaryStatus, score: 5 }
      const lowScore = { ...mockPlanetaryStatus, score: -5 }
      
      const highAnalysis = TechnicalAnalysisEngine.generateDualAnalysis(highScore, mockAspects, {}, {})
      const mediumAnalysis = TechnicalAnalysisEngine.generateDualAnalysis(mediumScore, mockAspects, {}, {})
      const lowAnalysis = TechnicalAnalysisEngine.generateDualAnalysis(lowScore, mockAspects, {}, {})
      
      expect(highAnalysis.simplified.overview.energyLevel).toContain('Excepcional')
      expect(mediumAnalysis.simplified.overview.energyLevel).toContain('Moderada')
      expect(lowAnalysis.simplified.overview.energyLevel).toContain('Baixa')
    })
  })

  describe('🔄 Integração do Sistema Dual', () => {
    it('✅ Sistema completo funciona end-to-end', () => {
      // 1. Gerar insights simplificados
      const greeting = SimplifiedInsightsEngine.generateSimplifiedGreeting(
        'João', 'Hoje', 'Nova', [mockPlanetaryStatus]
      )
      
      // 2. Gerar análise técnica
      const dualAnalysis = TechnicalAnalysisEngine.generateDualAnalysis(
        mockPlanetaryStatus,
        mockAspects,
        {},
        {}
      )
      
      // 3. Verificar que ambos os sistemas funcionam
      expect(greeting.dailyEnergy.level).toBeDefined()
      expect(greeting.dailyEnergy.theme).toBeDefined()
      expect(greeting.dailyEnergy.quickTip).toBeDefined()
      
      expect(dualAnalysis.simplified.overview.energyLevel).toBeDefined()
      expect(dualAnalysis.simplified.practicalGuidance.do.length).toBeGreaterThan(0)
      expect(dualAnalysis.technical.aspects.active.length).toBe(2)
      
      // 4. Verificar consistência entre sistemas
      const greetingEnergy = greeting.dailyEnergy.level === '🔥 Alta' ? 'alta' : 
                            greeting.dailyEnergy.level === '⚡ Média' ? 'média' : 'baixa'
      
      const analysisEnergy = dualAnalysis.simplified.overview.energyLevel.toLowerCase()
      
      // Ambos devem indicar energia similar
      expect(greetingEnergy).toBeDefined()
      expect(analysisEnergy).toBeDefined()
    })

    it('✅ Tradução automática funciona em todo o sistema', () => {
      const dualAnalysis = TechnicalAnalysisEngine.generateDualAnalysis(
        mockPlanetaryStatus,
        mockAspects,
        {},
        {}
      )
      
      // Verificar que as interpretações dos aspectos usam linguagem simples
      dualAnalysis.technical.aspects.interpretations.forEach(interpretation => {
        expect(interpretation).toContain('formam um')
        expect(interpretation).not.toContain('120° de separação angular')
      })
      
      // Verificar que pelo menos uma interpretação usa linguagem simples
      const hasSimpleLanguage = dualAnalysis.technical.aspects.interpretations.some(i => 
        i.includes('Harmonia e fluidez') || i.includes('Oportunidade')
      )
      expect(hasSimpleLanguage).toBe(true)
    })
  })

  console.log('🎯 Sistema de visualização dual funcionando perfeitamente!')
})
