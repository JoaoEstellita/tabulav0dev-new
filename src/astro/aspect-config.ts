// src/astro/aspect-config.ts
// ===================== SISTEMA DE ASPECTOS ASTROLÓGICOS =====================
// Todos os pesos e orbes dos aspectos estão centralizados aqui.
//
// Aspectos Maiores: conjunção, oposição, trígono, quadratura, sextil
// Aspectos Menores: quincúncio, semissextil, semiquadratura, sesquiquadratura
//
// Pesos: conjunção 1.0, oposição 0.9, trígono/quadratura 0.7, sextil 0.5, menores <= 0.3
// Orbes: definidos por tradição, ajustados por planeta e aspecto
//
// Normalização: soma dos menores nunca ultrapassa a dos maiores (ver planetary-status.engine.ts)
// ============================================================================

import { AspectName, AspectsConfig } from './aspects.types';

// Definições dos aspectos (nome, ângulo, orbe base)
export interface AspectDefinition {
  name: AspectName;
  angle: number;
  baseOrb: number;
}
export const ASPECT_DEFINITIONS: AspectDefinition[] = [
  { name: 'conjunção', angle: 0, baseOrb: 9 },
  { name: 'oposição', angle: 180, baseOrb: 9 },
  { name: 'trígono', angle: 120, baseOrb: 8 },
  { name: 'quadratura', angle: 90, baseOrb: 6 },
  { name: 'sextil', angle: 60, baseOrb: 5 },
  { name: 'quincúncio', angle: 150, baseOrb: 5 },
  { name: 'semissextil', angle: 30, baseOrb: 3 },
  { name: 'semiquadratura', angle: 45, baseOrb: 2 },
  { name: 'sesquiquadratura', angle: 135, baseOrb: 2 },
];

// Orbes base por planeta (fallback/moieties)
export const PLANET_ORBS: Record<string, number> = {
  Sun: 15,
  Moon: 12,
  Mercury: 7,
  Venus: 7,
  Mars: 8,
  Jupiter: 9,
  Saturn: 9,
  Uranus: 6,
  Neptune: 6,
  Pluto: 5,
};

// Orbes específicos por planeta e aspecto (graus)
export const PLANET_ASPECT_ORBS: Record<string, Record<number, number>> = {
  Sun:   { 0: 9, 180: 9, 120: 8, 90: 6, 60: 5, 150: 5, 30: 3 },
  Moon:  { 0: 9, 180: 9, 120: 8, 90: 6, 60: 5, 150: 5, 30: 3 },
  Mercury: { 0: 7, 180: 7, 120: 6.2222, 90: 4.6667, 60: 3.8889, 150: 3.8889, 30: 2.3333 },
  Venus:   { 0: 7, 180: 7, 120: 6.2222, 90: 4.6667, 60: 3.8889, 150: 3.8889, 30: 2.3333 },
  Jupiter: { 0: 7, 180: 7, 120: 6.2222, 90: 4.6667, 60: 3.8889, 150: 3.8889, 30: 2.3333 },
  Mars:   { 0: 6, 180: 6, 120: 5.3333, 90: 4, 60: 3.3333, 150: 3.3333, 30: 2 },
  Saturn: { 0: 6, 180: 6, 120: 5.3333, 90: 4, 60: 3.3333, 150: 3.3333, 30: 2 },
  Uranus:  { 0: 5, 180: 5, 120: 4, 90: 3, 60: 2, 150: 2, 30: 1, 45: 1, 135: 1 },
  Neptune: { 0: 5, 180: 5, 120: 4, 90: 3, 60: 2, 150: 2, 30: 1, 45: 1, 135: 1 },
  Pluto:   { 0: 5, 180: 5, 120: 4, 90: 3, 60: 2, 150: 2, 30: 1, 45: 1, 135: 1 },
};

// Pesos dos aspectos
export const ASPECT_WEIGHTS: Record<AspectName, number> = {
  'conjunção': 1.0,
  'oposição': 0.9,
  'trígono': 0.7,
  'quadratura': 0.7,
  'sextil': 0.5,
  'quincúncio': 0.3,
  'semissextil': 0.2,
  'semiquadratura': 0.2,
  'sesquiquadratura': 0.2,
};

// Orbes por nome de aspecto
export const ASPECT_ORBS: Record<AspectName, number> = Object.fromEntries(
  ASPECT_DEFINITIONS.map(a => [a.name, a.baseOrb])
) as Record<AspectName, number>;

// Configuração unificada para uso na engine
export const ASPECTS_CONFIG: AspectsConfig = {
  aspects: ASPECT_DEFINITIONS,
  maxOrbCap: 12,
  planetOrbs: PLANET_ORBS,
  planetAspectOrbs: PLANET_ASPECT_ORBS,
};
