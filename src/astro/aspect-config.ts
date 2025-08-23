// src/astro/aspect-config.ts
// Configuração global de orbes e pesos dos aspectos
import { AspectName } from './aspects.types';

export const ASPECT_ORBS: Record<AspectName, number> = {
  'conjunção': 8,
  'oposição': 8,
  'trígono': 6,
  'quadratura': 6,
  'sextil': 4,
  'quincúncio': 3,
  'semissextil': 2,
  'semiquadratura': 2,
  'sesquiquadratura': 2,
};

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
