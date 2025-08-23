import { describe, it, expect, vi } from 'vitest';
import AstrologyCalculator from '../AstrologyCalculator';
import type { Aspect, AstrologyData } from '../AstrologyCalculator';

describe('Auditoria de Trânsitos - AstrologyCalculator', () => {
  it('inclui aspectos de trânsito no resultado', () => {
    const transitAspect: Aspect = {
      planet1: 'sun',
      planet2: 'moon',
      aspect: 'conjunção',
      orb: 1.2,
      exact: 0,
      applying: true,
      strength: 8
    };
    (transitAspect as any).isTransit = true;
    const data: AstrologyData = {
      planets: [],
      aspects: [transitAspect],
      houses: []
    };
    const result = AstrologyCalculator.calculateLifeAreaStatus('love', data);
    expect(result.factors.transitAspects).toBeDefined();
    expect(result.factors.transitAspects?.length).toBe(1);
    expect(result.factors.transitAspects?.[0].planet1).toBe('sun');
  });

  it('loga auditoria de aspectos de trânsito', () => {
    const spy = vi.spyOn(console, 'log');
    const transitAspect: Aspect = {
      planet1: 'sun',
      planet2: 'moon',
      aspect: 'conjunção',
      orb: 1.2,
      exact: 0,
      applying: true,
      strength: 8
    };
    (transitAspect as any).isTransit = true;
    const data: AstrologyData = {
      planets: [],
      aspects: [transitAspect],
      houses: []
    };
    AstrologyCalculator.calculateLifeAreaStatus('love', data);
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('[AUDIT] Aspectos de trânsito detectados: 1'));
    spy.mockRestore();
  });

  it('score de trânsitos é zero sem aspectos', () => {
    const spy = vi.spyOn(console, 'log');
    const data: AstrologyData = {
      planets: [],
      aspects: [],
      houses: []
    };
    const result = AstrologyCalculator.calculateLifeAreaStatus('love', data);
    expect(result.factors.transitScore).toBe(0);
    expect(spy).toHaveBeenCalledWith('[AUDIT] Nenhum aspecto de trânsito detectado para o cálculo.');
    spy.mockRestore();
  });
});
