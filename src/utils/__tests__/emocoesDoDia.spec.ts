import { describe, it, expect } from 'vitest'
import fixtures from './fixtures_transitos.json'
import {
  emocoesDoDia,
  somasBrutas,
  paraEscala,
  pesoDoOrbe,
  EMOCOES,
  EMOCAO_PESA,
  K_CURVA,
  forcaNormalizada,
  type ChaveEmocao,
} from '../emocoesDoDia'

const T = (t: string, a: string, n = 'Sun', orb = 1, strength = 1) => ({ t, a, n, orb, strength })

describe('clima emocional do dia', () => {
  it('devolve as seis, sempre na mesma ordem e dentro de 0–100', () => {
    const r = emocoesDoDia([T('Mars', 'quadratura', 'Moon')])!
    expect(r.map((e) => e.chave)).toEqual([...EMOCOES])
    for (const e of r) {
      expect(e.valor, e.chave).toBeGreaterThanOrEqual(0)
      expect(e.valor, e.chave).toBeLessThanOrEqual(100)
      expect(Number.isInteger(e.valor), e.chave).toBe(true)
    }
  })

  // ⚠️ Sem trânsito o retorno é NULL, não seis zeros. Zerar diria "hoje você
  // não sente nada"; o certo é "hoje não sabemos", e a tela some em vez de
  // afirmar algo falso.
  it('sem trânsito devolve null, não zeros', () => {
    expect(emocoesDoDia([])).toBeNull()
    expect(emocoesDoDia(null)).toBeNull()
    expect(emocoesDoDia(undefined)).toBeNull()
    expect(emocoesDoDia([{ orb: 1 } as any])).toBeNull()
  })

  it('o mesmo dia dá sempre o mesmo número — nada de aleatório', () => {
    const dia = (fixtures as any[])[0].transitos
    const a = emocoesDoDia(dia)!
    for (let i = 0; i < 5; i++) expect(emocoesDoDia(dia)).toEqual(a)
  })

  describe('o símbolo chega na emoção certa', () => {
    const pico = (ts: any[]): ChaveEmocao => {
      const s = somasBrutas(ts)
      return EMOCOES.reduce((m, e) => (s[e] > s[m] ? e : m), EMOCOES[0])
    }
    it('Marte em aspecto duro lidera a RAIVA', () => {
      expect(pico([T('Mars', 'quadratura', 'Mars')])).toBe('raiva')
    })
    it('Urano em aspecto duro lidera a ANSIEDADE', () => {
      expect(pico([T('Uranus', 'oposicao', 'Mercury')])).toBe('ansiedade')
    })
    it('Saturno em aspecto duro lidera a TRISTEZA', () => {
      expect(pico([T('Saturn', 'quadratura', 'Moon')])).toBe('tristeza')
    })
    it('Júpiter em aspecto macio lidera o OTIMISMO', () => {
      expect(pico([T('Jupiter', 'trigono', 'Jupiter')])).toBe('otimismo')
    })
    it('Vênus em aspecto macio lidera a ALEGRIA', () => {
      expect(pico([T('Venus', 'trigono', 'Venus')])).toBe('alegria')
    })
  })

  // ⚠️ A conjunção não tem natureza própria — quem decide é o planeta. Tratar
  // as duas como iguais jogaria fora quase um quinto dos trânsitos reais.
  it('conjunção de Saturno PESA; conjunção de Vênus ALIVIA', () => {
    const saturno = somasBrutas([T('Saturn', 'conjuncao', 'Moon')])
    expect(saturno.tristeza).toBeGreaterThan(0)
    expect(saturno.alegria).toBe(0)

    const venus = somasBrutas([T('Venus', 'conjuncao', 'Venus')])
    expect(venus.alegria).toBeGreaterThan(0)
    expect(venus.tristeza).toBe(0)
  })

  // Os menores são tensos desde `b96acf8` e são 17 dos 120 trânsitos reais.
  it('os aspectos menores duros contam', () => {
    for (const asp of ['semiquadratura', 'sesquiquadratura', 'quincuncio']) {
      expect(somasBrutas([T('Mars', asp, 'Mars')]).raiva, asp).toBeGreaterThan(0)
    }
  })

  it('mais perto do exato pesa mais, e nunca chega a zero', () => {
    expect(pesoDoOrbe(0)).toBeGreaterThan(pesoDoOrbe(3))
    expect(pesoDoOrbe(3)).toBeGreaterThan(pesoDoOrbe(7))
    expect(pesoDoOrbe(99)).toBeGreaterThan(0)
    // Orbe ausente não zera o trânsito — ele existe mesmo sem o campo.
    expect(pesoDoOrbe(undefined)).toBeGreaterThan(0)
    expect(pesoDoOrbe('abc')).toBeGreaterThan(0)
  })

  it('o alvo amplifica o que é da área dele', () => {
    const naLua = somasBrutas([T('Saturn', 'quadratura', 'Moon')]).tristeza
    const emJupiter = somasBrutas([T('Saturn', 'quadratura', 'Jupiter')]).tristeza
    expect(naLua).toBeGreaterThan(emJupiter)
  })

  // ⚠️ A curva precisa SATURAR: sem isso um dia de muitos trânsitos estouraria
  // de 100 e todos os dias carregados ficariam indistinguíveis no teto.
  it('a escala satura — cresce sempre, nunca passa de 100', () => {
    expect(paraEscala(0)).toBe(0)

    // Na FAIXA USAVEL (onde os dias reais caem) tem de crescer de verdade:
    // se nao crescer, dois dias diferentes mostram o mesmo numero.
    let anterior = -1
    for (const soma of [0.5, 1, 2, 4, 8]) {
      const v = paraEscala(soma)
      expect(v, `soma ${soma}`).toBeGreaterThan(anterior)
      anterior = v
    }

    // Alem dela ACHATA, e e esse o ponto da curva: nunca estoura de 100.
    // ⚠️ A primeira versao deste teste exigia crescimento estrito ate soma=100
    // e reprovava — cobrando do codigo o oposto do que a curva existe para
    // fazer. O erro era meu, nao dele.
    for (const soma of [20, 100, 1000]) {
      expect(paraEscala(soma), `soma ${soma}`).toBeLessThanOrEqual(100)
      expect(paraEscala(soma), `soma ${soma}`).toBeGreaterThanOrEqual(anterior)
    }
    expect(paraEscala(-5)).toBe(0)
    expect(paraEscala(NaN)).toBe(0)
  })

  /**
   * ⚠️ A CALIBRAÇÃO TRAVADA.
   *
   * O `K` foi escolhido medindo 15 usuários reais: com 0.55 a mediana das
   * emoções que pesam dava 50, e um alarme que toca todo dia deixa de ser
   * alarme. Este teste guarda a faixa — se alguém mexer no K ou nos pesos e a
   * mediana subir, o número volta a gritar sem motivo.
   */
  it('num dia comum, o que pesa fica ABAIXO da metade', () => {
    const valores: number[] = []
    for (const u of fixtures as any[]) {
      const r = emocoesDoDia(u.transitos)!
      valores.push(...r.filter((e) => e.pesa).map((e) => e.valor))
    }
    valores.sort((a, b) => a - b)
    const mediana = valores[Math.floor(valores.length / 2)]
    expect(K_CURVA).toBe(0.45)
    expect(mediana, `mediana das que pesam: ${mediana}`).toBeLessThan(50)
    expect(mediana).toBeGreaterThan(30)
  })

  it('a faixa usada é ampla — nem tudo colado, nem tudo no teto', () => {
    const todos: number[] = []
    for (const u of fixtures as any[]) todos.push(...emocoesDoDia(u.transitos)!.map((e) => e.valor))
    expect(Math.max(...todos)).toBeGreaterThan(70)
    expect(Math.min(...todos)).toBeLessThan(30)
    // Nenhum usuário real deve bater no teto: 100 significaria "o máximo
    // possível", e a curva existe justamente para isso não acontecer.
    expect(Math.max(...todos)).toBeLessThan(100)
  })

  it('as que pesam e as que aliviam estão marcadas', () => {
    const r = emocoesDoDia((fixtures as any[])[0].transitos)!
    for (const e of r) expect(e.pesa, e.chave).toBe(EMOCAO_PESA[e.chave])
    expect(r.filter((e) => e.pesa)).toHaveLength(4)
    expect(r.filter((e) => !e.pesa)).toHaveLength(2)
  })

  /**
   * ⚠️ AS DUAS FORMAS TÊM DE CONCORDAR.
   *
   * O projeto tem dois formatos para o mesmo trânsito: `transitosRicos` do
   * backend (`{t, a, n, orb}`, strength 1) e `personalTodayRich` do motor local
   * (`{transitPlanet, type, natalPlanet}`, SEM orbe, strength 0–100). Ligar a
   * tela numa esperando a outra NÃO dá erro — os campos vêm undefined, tudo é
   * filtrado e a seção some sem nada acusar. Foi o que quase aconteceu aqui.
   */
  describe('as duas formas de trânsito do projeto', () => {
    it('o mesmo dia nas duas formas dá o mesmo resultado', () => {
      const backend = [
        { t: 'Mars', a: 'quadratura', n: 'Moon', strength: 1 },
        { t: 'Jupiter', a: 'trigono', n: 'Sun', strength: 1 },
      ]
      const local = [
        { transitPlanet: 'Mars', type: 'quadratura', natalPlanet: 'Moon', strength: 100 },
        { transitPlanet: 'Jupiter', type: 'trigono', natalPlanet: 'Sun', strength: 100 },
      ]
      expect(emocoesDoDia(local)).toEqual(emocoesDoDia(backend))
    })

    it('a forma do motor local NÃO devolve null', () => {
      // Este é o caso exato que teria sumido em silêncio.
      const r = emocoesDoDia([
        { transitPlanet: 'Saturn', type: 'quadratura', natalPlanet: 'Moon', strength: 80 },
      ])
      expect(r).not.toBeNull()
      expect(r!.find((e) => e.chave === 'tristeza')!.valor).toBeGreaterThan(0)
    })

    // ⚠️ strength 0–100 multiplicado direto saturaria TUDO em 100: seis anéis
    // cheios, todo dia, para todo mundo.
    it('a escala do strength é normalizada, venha 0–1 ou 0–100', () => {
      expect(forcaNormalizada(1)).toBe(1)
      expect(forcaNormalizada(100)).toBe(1)
      expect(forcaNormalizada(50)).toBeCloseTo(0.5, 5)
      expect(forcaNormalizada(0.5)).toBeCloseTo(0.5, 5)
      // Ausente vale 1: o trânsito existe mesmo sem o campo preenchido.
      expect(forcaNormalizada(undefined)).toBe(1)
      expect(forcaNormalizada(null)).toBe(1)
      expect(forcaNormalizada('abc')).toBe(1)
      expect(forcaNormalizada(0)).toBe(1)

      const cheio = emocoesDoDia([{ transitPlanet: 'Mars', type: 'quadratura', natalPlanet: 'Mars', strength: 100 }])!
      expect(cheio.find((e) => e.chave === 'raiva')!.valor).toBeLessThan(100)
    })
  })

  it('lixo na entrada não vira NaN nem quebra', () => {
    const r = emocoesDoDia([
      T('Mars', 'quadratura'),
      { t: 'Planeta9', a: 'quadratura' } as any,
      { t: 'Mars', a: 'aspecto_inexistente' } as any,
      { t: 'Mars', a: 'quadratura', orb: 'abc' } as any,
      { t: 'Mars', a: 'quadratura', strength: null } as any,
    ])!
    for (const e of r) expect(Number.isFinite(e.valor), e.chave).toBe(true)
  })
})
