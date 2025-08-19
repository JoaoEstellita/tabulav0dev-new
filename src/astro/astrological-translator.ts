import type { AstrologicalTranslation, TechnicalTooltip } from './dual-view.types'

// Sistema de tradução astrológica - converte termos técnicos em linguagem simples
export class AstrologicalTranslator {
  private static tooltips: Record<string, TechnicalTooltip> = {
    // === DIGNIDADES ===
    'domicílio': {
      term: 'domicílio',
      simple: 'Casa natural do planeta - máxima força',
      technical: 'Planeta em seu signo regente tradicional',
      example: 'Sol em Leão está em domicílio',
      significance: 'Planeta expressa suas qualidades naturais com máxima potência'
    },
    'exaltação': {
      term: 'exaltação',
      simple: 'Signo onde o planeta é mais forte',
      technical: 'Planeta em signo de exaltação tradicional',
      example: 'Sol em Áries está em exaltação',
      significance: 'Planeta tem força excepcional e expressão elevada'
    },
    'detrimento': {
      term: 'detrimento',
      simple: 'Signo onde o planeta é mais fraco',
      technical: 'Planeta em signo oposto ao seu domicílio',
      example: 'Sol em Aquário está em detrimento',
      significance: 'Planeta enfrenta desafios para expressar suas qualidades'
    },
    'queda': {
      term: 'queda',
      simple: 'Signo onde o planeta perde força',
      technical: 'Planeta em signo oposto à sua exaltação',
      example: 'Sol em Libra está em queda',
      significance: 'Planeta tem dificuldade para manifestar suas energias'
    },

    // === ASPECTOS ===
    'conjunção': {
      term: 'conjunção',
      simple: 'União de energias - máxima intensidade',
      technical: 'Planetas a 0° de separação angular',
      example: 'Sol ☌ Lua = união de identidade e emoções',
      significance: 'Amplifica o tema dos planetas envolvidos'
    },
    'oposição': {
      term: 'oposição',
      simple: 'Polaridade e confronto - pede equilíbrio',
      technical: 'Planetas a 180° de separação angular',
      example: 'Sol ☍ Lua = conflito entre vontade e sentimentos',
      significance: 'Exige negociação entre dois polos opostos'
    },
    'trígono': {
      term: 'trígono',
      simple: 'Harmonia e fluidez - facilita as coisas',
      technical: 'Planetas a 120° de separação angular',
      example: 'Sol △ Júpiter = expansão e otimismo fluem',
      significance: 'As coisas tendem a fluir naturalmente'
    },
    'quadratura': {
      term: 'quadratura',
      simple: 'Tensão dinâmica - exige ação',
      technical: 'Planetas a 90° de separação angular',
      example: 'Sol □ Saturno = responsabilidades pressionam',
      significance: 'Cria atritos que exigem ajustes e mudanças'
    },
    'sextil': {
      term: 'sextil',
      simple: 'Oportunidade e cooperação - portas se abrem',
      technical: 'Planetas a 60° de separação angular',
      example: 'Sol ✶ Vênus = relacionamentos favorecidos',
      significance: 'Favorece acordos e aprendizados'
    },
    'quincúncio': {
      term: 'quincúncio',
      simple: 'Ajustes e reorientações - pede calibragem',
      technical: 'Planetas a 150° de separação angular',
      example: 'Sol ⚻ Urano = inovação requer ajustes',
      significance: 'Incompatibilidades sutis pedem reorganização'
    },
    'semissextil': {
      term: 'semissextil',
      simple: 'Transição sutil - pequenos estímulos',
      technical: 'Planetas a 30° de separação angular',
      example: 'Sol ∿ Mercúrio = comunicação suave',
      significance: 'Temas adjacentes se tocam com leve estímulo'
    },
    'semiquadratura': {
      term: 'semiquadratura',
      simple: 'Atrito leve - pequenas fricções',
      technical: 'Planetas a 45° de separação angular',
      example: 'Sol ∠ Marte = pequenas tensões',
      significance: 'Pequenas fricções recorrentes que pedem correções'
    },
    'sesquiquadratura': {
      term: 'sesquiquadratura',
      simple: 'Tensão acumulada - pressão persistente',
      technical: 'Planetas a 135° de separação angular',
      example: 'Sol ∡ Plutão = transformação gradual',
      significance: 'Desalinhamentos que pressionam mudanças persistentes'
    },

    // === CASAS ===
    'casa angular': {
      term: 'casa angular',
      simple: 'Máxima força - influencia diretamente',
      technical: 'Casas 1, 4, 7, 10 - pontos cardeais do mapa',
      example: 'Casa 1 = identidade e iniciativa',
      significance: 'Planeta tem impacto direto e visível na vida'
    },
    'casa sucedente': {
      term: 'casa sucedente',
      simple: 'Força média - influencia gradualmente',
      technical: 'Casas 2, 5, 8, 11 - seguem as angulares',
      example: 'Casa 2 = valores e recursos',
      significance: 'Planeta tem influência estável e sustentada'
    },
    'casa cadente': {
      term: 'casa cadente',
      simple: 'Força reduzida - influencia sutilmente',
      technical: 'Casas 3, 6, 9, 12 - seguem as sucedentes',
      example: 'Casa 3 = comunicação e aprendizado',
      significance: 'Planeta tem influência mais sutil e interna'
    },

    // === ELEMENTOS ===
    'fogo': {
      term: 'fogo',
      simple: 'Iniciativa, criatividade e entusiasmo',
      technical: 'Elemento cardinal de energia yang',
      example: 'Áries, Leão, Sagitário',
      significance: 'Representa ação, vontade e expressão criativa'
    },
    'terra': {
      term: 'terra',
      simple: 'Estabilidade, praticidade e materialidade',
      technical: 'Elemento fixo de energia yin',
      example: 'Touro, Virgem, Capricórnio',
      significance: 'Representa construção, organização e resultados'
    },
    'ar': {
      term: 'ar',
      simple: 'Comunicação, intelecto e socialização',
      technical: 'Elemento mutável de energia yang',
      example: 'Gêmeos, Libra, Aquário',
      significance: 'Representa pensamento, relacionamentos e ideias'
    },
    'água': {
      term: 'água',
      simple: 'Emoção, intuição e sensibilidade',
      technical: 'Elemento cardinal de energia yin',
      example: 'Câncer, Escorpião, Peixes',
      significance: 'Representa sentimentos, intuição e profundidade'
    },

    // === MODALIDADES ===
    'cardinal': {
      term: 'cardinal',
      simple: 'Iniciativa e liderança - começa coisas',
      technical: 'Signos que iniciam as estações',
      example: 'Áries, Câncer, Libra, Capricórnio',
      significance: 'Representa impulso para agir e liderar'
    },
    'fixo': {
      term: 'fixo',
      simple: 'Estabilidade e persistência - mantém coisas',
      technical: 'Signos do meio das estações',
      example: 'Touro, Leão, Escorpião, Aquário',
      significance: 'Representa constância e determinação'
    },
    'mutável': {
      term: 'mutável',
      simple: 'Adaptabilidade e flexibilidade - ajusta coisas',
      technical: 'Signos que terminam as estações',
      example: 'Gêmeos, Virgem, Sagitário, Peixes',
      significance: 'Representa adaptação e mudança'
    },

    // === TERMOS TÉCNICOS ===
    'orb': {
      term: 'orb',
      simple: 'Precisão do aspecto - quanto menor, mais forte',
      technical: 'Desvio angular do aspecto exato em graus',
      example: 'Orb 1.1° = aspecto muito preciso e forte',
      significance: 'Orbe menor indica aspecto mais ativo e influente'
    },
    'aplicante': {
      term: 'aplicante',
      simple: 'Aspecto se tornando mais forte',
      technical: 'Planetas se aproximando do aspecto exato',
      example: 'Aspecto aplicante = influência crescente',
      significance: 'Indica momento de ação e manifestação'
    },
    'separando': {
      term: 'separando',
      simple: 'Aspecto se tornando mais fraco',
      technical: 'Planetas se afastando do aspecto exato',
      example: 'Aspecto separando = influência diminuindo',
      significance: 'Indica momento de integração e reflexão'
    },
    'retrógrado': {
      term: 'retrógrado',
      simple: 'Energia internalizada - momento de revisão',
      technical: 'Planeta aparentemente se movendo para trás',
      example: 'Mercúrio retrógrado = revisar comunicações',
      significance: 'Favorece reflexão e reavaliação'
    },
    'estacionário': {
      term: 'estacionário',
      simple: 'Planeta pausado - momento de decisão',
      technical: 'Velocidade aparente próxima a zero',
      example: 'Marte estacionário = pausa para escolher direção',
      significance: 'Momento de clareza e escolhas importantes'
    }
  }

  // Traduz termo técnico para linguagem simples
  static translate(technicalTerm: string): AstrologicalTranslation {
    const tooltip = this.tooltips[technicalTerm.toLowerCase()]
    
    if (!tooltip) {
      return {
        technical: technicalTerm,
        simple: 'Termo astrológico técnico',
        practical: 'Consulte um astrólogo para detalhes',
        action: 'Continue observando seus padrões'
      }
    }

    return {
      technical: tooltip.term,
      simple: tooltip.simple,
      practical: tooltip.significance,
      action: this.generateAction(tooltip)
    }
  }

  // Gera ação prática baseada no termo
  private static generateAction(tooltip: TechnicalTooltip): string {
    const actions: Record<string, string> = {
      'domicílio': 'Aproveite sua força natural e confie em suas qualidades',
      'exaltação': 'Use sua energia elevada para inspirar outros',
      'detrimento': 'Trabalhe conscientemente para superar os desafios',
      'queda': 'Foque em desenvolver suas qualidades de forma diferente',
      'conjunção': 'Integre as energias dos planetas envolvidos',
      'oposição': 'Busque equilíbrio entre os dois polos',
      'trígono': 'Deixe as coisas fluírem naturalmente',
      'quadratura': 'Tome ação para resolver as tensões',
      'sextil': 'Inicie conversas e aproveite as oportunidades',
      'quincúncio': 'Faça ajustes finos em sua abordagem',
      'semissextil': 'Presta atenção aos detalhes sutis',
      'semiquadratura': 'Corrija pequenos problemas antes que cresçam',
      'sesquiquadratura': 'Mantenha persistência nos ajustes necessários',
      'casa angular': 'Use sua influência direta para fazer mudanças',
      'casa sucedente': 'Construa gradualmente suas conquistas',
      'casa cadente': 'Trabalhe internamente para desenvolver suas qualidades',
      'fogo': 'Use sua energia para iniciar projetos e inspirar outros',
      'terra': 'Foque em resultados práticos e construção sólida',
      'ar': 'Conecte-se com outros e compartilhe suas ideias',
      'água': 'Conecte-se com suas emoções e intuição',
      'cardinal': 'Tome iniciativa e lidere as mudanças',
      'fixo': 'Mantenha-se firme em seus objetivos',
      'mutável': 'Adapte-se às mudanças e seja flexível',
      'orb': 'Quanto menor o orbe, mais forte o aspecto - aja com confiança',
      'aplicante': 'Momento ideal para agir - o aspecto está se fortalecendo',
      'separando': 'Integre as lições do aspecto - momento de reflexão',
      'retrógrado': 'Use este tempo para revisar e reavaliar',
      'estacionário': 'Momento de clareza - tome decisões importantes'
    }

    return actions[tooltip.term] || 'Observe como este aspecto se manifesta em sua vida'
  }

  // Obtém tooltip para um termo específico
  static getTooltip(term: string): TechnicalTooltip | undefined {
    return this.tooltips[term.toLowerCase()]
  }

  // Lista todos os termos disponíveis
  static getAllTerms(): string[] {
    return Object.keys(this.tooltips)
  }

  // Traduz frase técnica completa
  static translatePhrase(phrase: string): string {
    const words = phrase.split(' ')
    return words.map(word => {
      const translation = this.translate(word)
      return translation.simple
    }).join(' ')
  }

  // Gera explicação prática para aspecto
  static explainAspect(planet1: string, planet2: string, type: string, orb: number): string {
    const aspectInfo = this.translate(type)
    const orbInfo = orb < 1 ? 'muito preciso' : orb < 3 ? 'preciso' : 'amplo'
    
    return `${planet1} e ${planet2} formam um ${aspectInfo.simple} (${orbInfo}). ${aspectInfo.practical}`
  }
}
