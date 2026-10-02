import { describe, it, expect, afterAll, vi } from 'vitest'

/**
 * O resolver de catálogo não pode depender de `String.prototype.normalize`.
 *
 * Contexto: toda chave de catálogo passa por `.normalize('NFD')` para tirar
 * acento. O Hermes só implementa `normalize` quando compilado com Intl, e este
 * app não carrega polyfill nenhum — se a decomposição não acontecer, o acento
 * fica e a chave não casa. Esse é exatamente o formato do bug que já mordeu o
 * projeto uma vez (`/\p{Diacritic}/gu` → grade e interpretações vazias no APK,
 * funcionando no PWA).
 *
 * Hoje o resolver é imune porque os catálogos indexam as duas grafias e
 * `normalizeSign` mapeia pt-BR→EN antes da busca. Este teste trava essa
 * propriedade: uma entrada nova indexada SÓ com acento volta a quebrar o APK
 * sem quebrar o navegador — e falharia aqui antes de virar build.
 */

const CASOS: Array<{ nome: string; rodar: (m: any) => string | null }> = [
  { nome: 'planeta em signo (Gêmeos)', rodar: (m) => m.resolvePlanetInSignText('Sun', 'Gêmeos', 'pt-BR') },
  { nome: 'planeta em signo (Câncer)', rodar: (m) => m.resolvePlanetInSignText('Moon', 'Câncer', 'pt-BR') },
  { nome: 'planeta em signo (Leão)', rodar: (m) => m.resolvePlanetInSignText('Mars', 'Leão', 'pt-BR') },
  { nome: 'planeta em signo (Escorpião)', rodar: (m) => m.resolvePlanetInSignText('Venus', 'Escorpião', 'pt-BR') },
  { nome: 'signo na casa (Áries)', rodar: (m) => m.resolveSignInHouseText('Áries', 1, 'pt-BR') },
  { nome: 'signo no MC (Capricórnio)', rodar: (m) => m.resolveSignInMidheavenText('Capricórnio', 'pt-BR') },
]

describe('resolver de catálogo — independente de normalize', () => {
  const original = String.prototype.normalize

  afterAll(() => {
    // eslint-disable-next-line no-extend-native
    String.prototype.normalize = original
    vi.resetModules()
  })

  it('acha o texto com normalize nativo (controle: V8/navegador)', async () => {
    vi.resetModules()
    const m = await import('../natalInterpretation')
    const faltando = CASOS.filter(({ rodar }) => !rodar(m)).map((c) => c.nome)
    expect(faltando, 'sem isto o teste abaixo não prova nada').toEqual([])
  })

  it('acha o MESMO texto com normalize no-op (Hermes sem Intl)', async () => {
    // Pior caso realista: `normalize` existe mas não decompõe. Os mapas do
    // catálogo são montados NA IMPORTAÇÃO, então o módulo tem de ser reavaliado
    // já sob o normalize quebrado — é o que acontece no APK.
    // eslint-disable-next-line no-extend-native
    String.prototype.normalize = function (this: string) { return String(this) } as any
    vi.resetModules()
    const m = await import('../natalInterpretation')

    const perdidos = CASOS.filter(({ rodar }) => !rodar(m)).map((c) => c.nome)
    expect(
      perdidos,
      'estes resolvers só acham texto quando normalize decompõe — no APK sairiam VAZIOS',
    ).toEqual([])
  })
})
