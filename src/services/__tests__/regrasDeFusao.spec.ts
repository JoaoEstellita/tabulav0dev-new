import { describe, expect, it } from 'vitest'
import { temMapaCompleto, deveFundir, type PerfilPendente } from '../regrasDeFusao'

/**
 * A REGRA DE DESEMPATE, QUE É ONDE SE PERDE O MAPA DE ALGUÉM.
 *
 * O quiz roda antes do login, numa conta anônima. Quando a pessoa entra com um
 * Google que já tem conta, o Firebase recusa o link e alguém tem de decidir
 * qual mapa fica. Errar para o lado errado apaga a carta que a pessoa já tinha
 * — e mapa apagado não volta, porque `birthTime` e `birthLocation` vieram de
 * uma conversa que não se repete.
 *
 * A regra é a mesma do backend (`claim-wa-onboarding.js`, `mergeIntoUser`): na
 * dúvida, o antigo ganha.
 */

const completo: PerfilPendente = {
  fullName: 'João',
  birthDate: '1992-03-14',
  birthTime: '07:20',
  birthLocation: { city: 'Niterói', latitude: -22.88, longitude: -43.10 },
  birthDataComplete: true,
}

describe('o que conta como mapa pronto', () => {
  it('precisa da marca, da data e do lugar', () => {
    expect(temMapaCompleto(completo)).toBe(true)
  })

  /**
   * `birthDataComplete: true` sem lugar já apareceu em produção, e o cálculo de
   * casas depende do lugar. A flag sozinha não é prova.
   */
  it('a flag sozinha não basta: sem lugar não há casas', () => {
    expect(temMapaCompleto({ ...completo, birthLocation: undefined })).toBe(false)
  })

  it('nem sem data', () => {
    expect(temMapaCompleto({ ...completo, birthDate: undefined })).toBe(false)
  })

  it('nem com a flag desligada', () => {
    expect(temMapaCompleto({ ...completo, birthDataComplete: false })).toBe(false)
  })

  it('vazio e ausente não quebram', () => {
    expect(temMapaCompleto(null)).toBe(false)
    expect(temMapaCompleto(undefined)).toBe(false)
    expect(temMapaCompleto({})).toBe(false)
  })
})

describe('quando fundir o mapa do quiz na conta que já existia', () => {
  it('funde quando a conta antiga não tem mapa', () => {
    expect(deveFundir(completo, null)).toBe(true)
    expect(deveFundir(completo, { birthDataComplete: false })).toBe(true)
  })

  /**
   * O caso caro. A pessoa tem conta desde março, com o mapa certo, e responde o
   * quiz no celular chutando a hora. Sobrescrever trocaria o ascendente dela.
   */
  it('NUNCA sobrescreve mapa que já existe', () => {
    const antigo: PerfilPendente = { ...completo, birthTime: '15:40' }
    expect(deveFundir(completo, antigo)).toBe(false)
  })

  it('não funde nada quando o quiz ficou pela metade', () => {
    expect(deveFundir({ birthDate: '1992-03-14' }, null)).toBe(false)
    expect(deveFundir(null, null)).toBe(false)
  })

  /**
   * Só o mapa viaja. Assinatura, trial e histórico ficam onde estão: fundir
   * `trialStart` daria trial novo a cada quiz respondido, que é uma porta
   * aberta para uso grátis sem fim.
   */
  it('a decisão olha só o mapa, e não a assinatura', () => {
    const comAssinatura = { ...completo, planId: 'pro_monthly' } as PerfilPendente
    expect(deveFundir(completo, comAssinatura)).toBe(false)
  })
})
