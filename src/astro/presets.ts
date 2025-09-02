// src/astro/presets.ts
// Presets de configuração astrológica: moderna, tradicional, védica
import { AspectName } from './aspects.types';

export type AstroPresetName = 'moderna' | 'tradicional' | 'vedica';

export interface AstroPresetConfig {
  aspectOrbs: Record<AspectName, number>;
  aspectWeights: Record<AspectName, number>;
  factorWeights: {
    essential: number;
    houseStrength: number;
    signHouseHarmony: number;
    elementalStrength: number;
    aspectStrength: number;
    specialConditions: number;
  };
  thresholds: {
    veryStrong: number;
    strong: number;
    neutral: number;
    weak: number;
    veryWeak: number;
  };
}

export const ASTRO_PRESETS: Record<AstroPresetName, AstroPresetConfig> = {
  moderna: {
    aspectOrbs: {
      'conjunção': 8, 'oposição': 8, 'trígono': 6, 'quadratura': 6, 'sextil': 4,
      'quincúncio': 3, 'semissextil': 2, 'semiquadratura': 2, 'sesquiquadratura': 2
    },
    aspectWeights: {
      'conjunção': 1.0, 'oposição': 0.9, 'trígono': 0.7, 'quadratura': 0.7, 'sextil': 0.5,
      'quincúncio': 0.3, 'semissextil': 0.2, 'semiquadratura': 0.2, 'sesquiquadratura': 0.2
    },
    factorWeights: {
      essential: 0.6, houseStrength: 0.6, signHouseHarmony: 0.5, elementalStrength: 0.4, aspectStrength: 0.6, specialConditions: 0.5
    },
    thresholds: { veryStrong: 10, strong: 7, neutral: 3, weak: 0, veryWeak: -4 }
  },
  tradicional: {
    aspectOrbs: {
      'conjunção': 10, 'oposição': 8, 'trígono': 7, 'quadratura': 7, 'sextil': 5,
      'quincúncio': 2, 'semissextil': 1, 'semiquadratura': 1, 'sesquiquadratura': 1
    },
    aspectWeights: {
      'conjunção': 1.0, 'oposição': 0.8, 'trígono': 0.6, 'quadratura': 0.6, 'sextil': 0.4,
      'quincúncio': 0.1, 'semissextil': 0.05, 'semiquadratura': 0.05, 'sesquiquadratura': 0.05
    },
    factorWeights: {
      essential: 0.8, houseStrength: 0.7, signHouseHarmony: 0.3, elementalStrength: 0.2, aspectStrength: 0.5, specialConditions: 0.3
    },
    thresholds: { veryStrong: 12, strong: 8, neutral: 3, weak: -1, veryWeak: -6 }
  },
  vedica: {
    aspectOrbs: {
      'conjunção': 12, 'oposição': 10, 'trígono': 8, 'quadratura': 6, 'sextil': 4,
      'quincúncio': 2, 'semissextil': 1, 'semiquadratura': 1, 'sesquiquadratura': 1
    },
    aspectWeights: {
      'conjunção': 1.0, 'oposição': 0.7, 'trígono': 0.5, 'quadratura': 0.5, 'sextil': 0.3,
      'quincúncio': 0.1, 'semissextil': 0.05, 'semiquadratura': 0.05, 'sesquiquadratura': 0.05
    },
    factorWeights: {
      essential: 0.5, houseStrength: 0.8, signHouseHarmony: 0.2, elementalStrength: 0.2, aspectStrength: 0.4, specialConditions: 0.2
    },
    thresholds: { veryStrong: 14, strong: 10, neutral: 5, weak: 0, veryWeak: -5 }
  }
};
