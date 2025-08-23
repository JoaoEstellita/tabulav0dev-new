// Memoização simples para funções puras de aspecto
const aspectMemoCache = new Map<string, any>();
function memoizeAspect<T extends (...args: any[]) => any>(fn: T): T {
  return function(...args: any[]) {
    // Memoizar apenas para argumentos primitivos (ex: nomes, números)
    const key = JSON.stringify(args);
    if (aspectMemoCache.has(key)) return aspectMemoCache.get(key);
    const result = fn(...args);
    aspectMemoCache.set(key, result);
    return result;
  } as T;
}
import { normalizePlanet, normalizeSign, normalizeHouse } from './normalize';
// src/astro/aspect-engine.ts

// Centralizador de funções de cálculo de aspectos e trânsitos
// Recomendação: para máxima precisão, utilize sempre a configuração de aspects.config.ts

import { AspectInputBody, AspectName, AspectsConfig } from './aspects.types';
import { ASPECT_ORBS, ASPECT_WEIGHTS } from './aspect-config';

// Configuração padrão de orbes e pesos (será expandida no item 2)

// Deprecated: use ASPECT_ORBS from aspect-config.ts
export const DEFAULT_ORBS = ASPECT_ORBS;

// Deprecated: use ASPECT_WEIGHTS from aspect-config.ts
export const DEFAULT_WEIGHTS = ASPECT_WEIGHTS;

// Função para calcular aspecto entre dois planetas
// Se fornecido aspectsConfig, usa orbes e ângulos avançados
export const calculateAspect = memoizeAspect(function calculateAspect(
  pos1: AspectInputBody,
  pos2: AspectInputBody,
  orbs: Record<AspectName, number> = ASPECT_ORBS,
  aspectsConfig?: AspectsConfig
): { type: AspectName; orb: number; isApplying: boolean } | null {
  const diff = Math.abs(pos1.longitude - pos2.longitude) % 360;
  let aspects: { type: AspectName; angle: number; orb: number }[];
  if (aspectsConfig) {
    aspects = aspectsConfig.aspects.map(a => ({ type: a.name, angle: a.angle, orb: a.baseOrb }));
  } else {
    aspects = [
      { type: 'conjunção', angle: 0, orb: orbs['conjunção'] },
      { type: 'oposição', angle: 180, orb: orbs['oposição'] },
      { type: 'trígono', angle: 120, orb: orbs['trígono'] },
      { type: 'quadratura', angle: 90, orb: orbs['quadratura'] },
      { type: 'sextil', angle: 60, orb: orbs['sextil'] },
      { type: 'quincúncio', angle: 150, orb: orbs['quincúncio'] },
      { type: 'semissextil', angle: 30, orb: orbs['semissextil'] },
      { type: 'semiquadratura', angle: 45, orb: orbs['semiquadratura'] },
      { type: 'sesquiquadratura', angle: 135, orb: orbs['sesquiquadratura'] },
    ];
  }
  for (const asp of aspects) {
    const orb = Math.abs(diff - asp.angle);
    if (orb <= (asp.orb || 0)) {
      // isApplying: se pos1 está se aproximando de pos2
      const isApplying = (pos1.speed ?? 0) > 0 && diff < asp.angle;
      return { type: asp.type, orb, isApplying };
    }
  }
  return null;
});

// Função para calcular todos os aspectos entre listas de planetas
export function calculateAllAspects(
  planets1: AspectInputBody[],
  planets2: AspectInputBody[],
  orbs: Record<AspectName, number> = ASPECT_ORBS,
  aspectsConfig?: AspectsConfig
) {
  const results = [];
  for (const p1 of planets1) {
    for (const p2 of planets2) {
      const aspect = calculateAspect(p1, p2, orbs, aspectsConfig);
      if (aspect) {
  results.push({ planet1: normalizePlanet(p1.name), planet2: normalizePlanet(p2.name), ...aspect });
      }
    }
  }
  return results;
}

// Função para calcular trânsitos (apenas estrutura, lógica realista pode ser expandida)
export function calculateTransits(
  natalPositions: AspectInputBody[],
  transitPositions: AspectInputBody[],
  orbs: Record<AspectName, number> = ASPECT_ORBS,
  aspectsConfig?: AspectsConfig
) {
  return calculateAllAspects(transitPositions, natalPositions, orbs, aspectsConfig);
}

// ...outros utilitários podem ser adicionados conforme necessário...
