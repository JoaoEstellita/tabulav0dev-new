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

import aspectsConfig from './aspects.config';

// Deriva ASPECT_ORBS da config principal para evitar duplicidade
export const ASPECT_ORBS: Record<AspectName, number> = Object.fromEntries(
  aspectsConfig.aspects.map(a => [a.name, a.baseOrb])
);

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
