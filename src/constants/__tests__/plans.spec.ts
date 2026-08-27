import { describe, it, expect } from 'vitest'
import {
  PLAN_DEFINITIONS,
  getPlanById,
  getPlansByPeriod,
  getMonthlyEquivalent,
  getYearlyCounterpart,
} from '../plans'

describe('planos anuais', () => {
  it('define pro_yearly e premium_yearly com 12 meses', () => {
    const pro = getPlanById('pro_yearly')
    const premium = getPlanById('premium_yearly')
    expect(pro).toBeTruthy()
    expect(premium).toBeTruthy()
    expect(pro!.months).toBe(12)
    expect(premium!.months).toBe(12)
    expect(pro!.billingPeriod).toBe('yearly')
    expect(premium!.billingPeriod).toBe('yearly')
  })

  it('preço anual = 10x o mensal (2 meses grátis)', () => {
    const proM = getPlanById('pro_monthly')!
    const proY = getPlanById('pro_yearly')!
    const premM = getPlanById('premium_monthly')!
    const premY = getPlanById('premium_yearly')!
    expect(proY.price).toBeCloseTo(proM.price * 10, 2)
    expect(premY.price).toBeCloseTo(premM.price * 10, 2)
  })

  it('herda as features do tier (créditos e forecast iguais ao mensal)', () => {
    const proM = getPlanById('pro_monthly')!
    const proY = getPlanById('pro_yearly')!
    expect(proY.creditsPerMonth).toBe(proM.creditsPerMonth)
    expect(proY.forecastMaxDays).toBe(proM.forecastMaxDays)
    const premM = getPlanById('premium_monthly')!
    const premY = getPlanById('premium_yearly')!
    expect(premY.creditsPerMonth).toBe(premM.creditsPerMonth)
    expect(premY.forecastMaxDays).toBe(premM.forecastMaxDays)
  })

  it('não cria Essential anual (só Pro e Premium)', () => {
    expect(getPlanById('essential_yearly' as any)).toBeNull()
    const yearly = getPlansByPeriod('yearly')
    expect(yearly.map((p) => p.id).sort()).toEqual(['premium_yearly', 'pro_yearly'])
  })

  it('getPlansByPeriod separa mensal e anual', () => {
    const monthly = getPlansByPeriod('monthly')
    expect(monthly.every((p) => p.billingPeriod === 'monthly')).toBe(true)
    expect(monthly.some((p) => p.id === 'essential_monthly')).toBe(true)
    expect(getPlansByPeriod('yearly').every((p) => p.billingPeriod === 'yearly')).toBe(true)
  })

  it('getMonthlyEquivalent = preço/12 no anual, preço no mensal', () => {
    const proY = getPlanById('pro_yearly')!
    expect(getMonthlyEquivalent(proY)).toBeCloseTo(proY.price / 12, 4)
    const proM = getPlanById('pro_monthly')!
    expect(getMonthlyEquivalent(proM)).toBe(proM.price)
  })

  it('getYearlyCounterpart acha o anual do mesmo tier', () => {
    expect(getYearlyCounterpart('pro_monthly')?.id).toBe('pro_yearly')
    expect(getYearlyCounterpart('premium_monthly')?.id).toBe('premium_yearly')
    // Essential não tem anual
    expect(getYearlyCounterpart('essential_monthly')).toBeNull()
  })

  it('todo plano tem months >= 1 e price > 0 (exceto se gratuito por design)', () => {
    for (const p of PLAN_DEFINITIONS) {
      expect(p.months).toBeGreaterThanOrEqual(1)
      expect(p.price).toBeGreaterThan(0)
    }
  })
})
