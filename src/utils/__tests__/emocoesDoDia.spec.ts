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
  contribuicoesPorEmocao,
  selecionarTransitos,
  COTA_LENTOS,
  COTA_RAPIDOS,
  type ChaveEmocao,
} from '../emocoesDoDia'

const T = (t: string, a: string, n = 'Sun', orb = 1, strength = 1) => ({ t, a, n, orb, strength })

describe('clima emocional do dia', () => {
  it('devolve as oito, sempre na mesma ordem e dentro de 0–100', () => {
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
    it('Urano em aspecto duro lidera a ANSIEDADE', () => {
      expect(pico([T('Uranus', 'oposicao', 'Mercury')])).toBe('ansiedade')
    })
    it('Marte em aspecto duro lidera o ESTRESSE', () => {
      expect(pico([T('Mars', 'quadratura', 'Mars')])).toBe('estresse')
    })
    it('Plutão em aspecto duro lidera a PRESSÃO', () => {
      expect(pico([T('Pluto', 'quadratura', 'Sun')])).toBe('pressao')
    })
    it('a Lua em aspecto macio lidera a SENSIBILIDADE', () => {
      expect(pico([T('Moon', 'trigono', 'Venus')])).toBe('sensibilidade')
    })
    it('Saturno em aspecto duro lidera o DESÂNIMO', () => {
      expect(pico([T('Saturn', 'quadratura', 'Moon')])).toBe('desanimo')
    })
    it('Vênus em aspecto macio lidera o AFETO', () => {
      expect(pico([T('Venus', 'trigono', 'Venus')])).toBe('afeto')
    })
    it('Júpiter em aspecto macio lidera o ENTUSIASMO', () => {
      expect(pico([T('Jupiter', 'trigono', 'Jupiter')])).toBe('entusiasmo')
    })
    it('Saturno em aspecto macio lidera a CALMA', () => {
      expect(pico([T('Saturn', 'trigono', 'Sun')])).toBe('calma')
    })

    /**
     * ⚠️ ASPECTO DURO NUNCA ACENDE UM ANEL BOM, e vice-versa.
     *
     * É o que mantém os dois lados da grade honestos: se um trigono pudesse
     * somar na ansiedade, a fileira de baixo deixaria de significar "o que o
     * dia cobra" e viraria ruído com nome de emoção.
     */
    it('duro só alimenta as difíceis; macio só alimenta as boas', () => {
      const duro = somasBrutas([T('Saturn', 'quadratura', 'Moon')])
      expect(duro.afeto + duro.entusiasmo + duro.calma).toBe(0)
      const macio = somasBrutas([T('Saturn', 'trigono', 'Moon')])
      expect(macio.ansiedade + macio.estresse + macio.desanimo).toBe(0)
    })

    /**
     * ⚠️ ESTE É O INVARIANTE DO DESENHO, não um teste de detalhe.
     *
     * Dois anéis só valem a tela se tiverem fontes diferentes. A versão anterior
     * tinha seis palavras e três pares que liam os mesmos planetas — stress não
     * tinha planeta nenhum só dele, era a soma de tudo que é duro, e andava
     * junto com raiva (r=+0,81) e com ansiedade (r=+0,75) nos usuários reais.
     *
     * Se alguém acrescentar uma emoção nova sem planeta dominante próprio, ou
     * fizer dois planetas liderarem o mesmo anel, isto reprova.
     */
    it('cada planeta lidera um anel DIFERENTE — nenhum anel repetido', () => {
      const lideres = [
        ['Mars', 'quadratura'], ['Saturn', 'quadratura'], ['Uranus', 'quadratura'],
        ['Pluto', 'quadratura'],
        ['Venus', 'trigono'], ['Jupiter', 'trigono'], ['Saturn', 'trigono'],
        ['Moon', 'trigono'],
      ].map(([p, a]) => pico([T(p, a, 'Sun')]))
      expect(new Set(lideres).size, `líderes: ${lideres.join(', ')}`).toBe(lideres.length)
      // E eles cobrem as oito: nenhuma emoção fica sem dono.
      expect([...lideres].sort()).toEqual([...EMOCOES].sort())
    })
  })

  // ⚠️ A conjunção não tem natureza própria — quem decide é o planeta. Tratar
  // as duas como iguais jogaria fora quase um quinto dos trânsitos reais.
  it('conjunção de Saturno PESA; conjunção de Vênus ALIVIA', () => {
    const saturno = somasBrutas([T('Saturn', 'conjuncao', 'Moon')])
    expect(saturno.desanimo).toBeGreaterThan(0)
    expect(saturno.afeto).toBe(0)

    const venus = somasBrutas([T('Venus', 'conjuncao', 'Venus')])
    expect(venus.afeto).toBeGreaterThan(0)
    expect(venus.desanimo).toBe(0)
  })

  // Os menores são tensos desde `b96acf8` e são 17 dos 120 trânsitos reais.
  it('os aspectos menores duros contam', () => {
    for (const asp of ['semiquadratura', 'sesquiquadratura', 'quincuncio']) {
      expect(somasBrutas([T('Mars', asp, 'Mars')]).estresse, asp).toBeGreaterThan(0)
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

  /**
   * ⚠️ AS CHAVES DOS ÂNGULOS SÃO CURTAS: `asc`, `mc`, `dsc`, `ic`.
   *
   * A tabela de amplificação dizia `ascendant` e `midheaven`, que é como
   * ninguém grava. As duas entradas nunca dispararam, e `dsc`/`ic` não tinham
   * entrada nenhuma — 31% dos trânsitos passavam sem amplificação. Não dava
   * erro, só não acontecia.
   */
  it('os quatro ângulos amplificam de verdade', () => {
    for (const [angulo, chave] of [
      ['ASC', 'ansiedade'], ['MC', 'pressao'], ['DSC', 'afeto'], ['IC', 'desanimo'],
    ] as [string, ChaveEmocao][]) {
      const planeta = chave === 'afeto' ? 'Venus' : chave === 'pressao' ? 'Pluto'
        : chave === 'desanimo' ? 'Saturn' : 'Uranus'
      const aspecto = chave === 'afeto' ? 'trigono' : 'quadratura'
      const noAngulo = somasBrutas([T(planeta, aspecto, angulo)])[chave]
      const neutro = somasBrutas([T(planeta, aspecto, 'Jupiter')])[chave]
      expect(noAngulo, `${angulo} deveria amplificar ${chave}`).toBeGreaterThan(neutro)
    }
  })

  it('o alvo amplifica o que é da área dele', () => {
    const naLua = somasBrutas([T('Saturn', 'quadratura', 'Moon')]).desanimo
    const emJupiter = somasBrutas([T('Saturn', 'quadratura', 'Jupiter')]).desanimo
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
   * O `K` é medido contra os usuários reais, não escolhido — e DEPENDE DE
   * QUANTOS ANÉIS EXISTEM: com mais anéis o mesmo dia reparte os pesos em mais
   * casas e cada número cai. Mudou a lista, remede.
   *
   * Este teste guarda a faixa nas duas direções — se a mediana subir, o número
   * passa a gritar todo dia e deixa de informar; se cair, o dia carregado fica
   * indistinguível do dia leve.
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
    expect(mediana, `mediana das que pesam: ${mediana}`).toBeGreaterThan(30)
  })

  /**
   * ⚠️ NENHUM ANEL PODE TER PISO ALTO, e isto é um teste separado porque o piso
   * é o jeito mais fácil de estragar esta tela sem ninguém notar.
   *
   * Já aconteceu duas vezes: o otimismo que nunca descia de 41 (dez planetas
   * alimentando um anel só), e a primeira tentativa de 3+3, em que ansiedade
   * não descia de 19. Nos dois casos o número continuava "funcionando" — só
   * tinha parado de informar. Acrescentar um peso cruzado pequeno parece
   * inofensivo e é exatamente o que mata a faixa de baixo.
   *
   * O teste NÃO exige zero: na base atual sete dos oito zeram, e o entusiasmo
   * fica em 14 porque Júpiter, Sol, Marte e Urano macios, juntos, cobrem as 21
   * contas. 14 lê como "quase nada" e é uma leitura honesta. 25 é a linha.
   */
  it('nenhum anel tem piso alto nos dados reais', () => {
    const minimo: Record<string, number> = {}
    for (const e of EMOCOES) minimo[e] = 100
    for (const u of fixtures as any[]) {
      for (const e of emocoesDoDia(u.transitos)!) {
        minimo[e.chave] = Math.min(minimo[e.chave], e.valor)
      }
    }
    for (const e of EMOCOES) {
      expect(minimo[e], `${e} nunca desceu de ${minimo[e]}`).toBeLessThan(25)
    }
    // E a maioria tem de conseguir apagar de vez — senão o conjunto inteiro
    // está inflado, mesmo que nenhum passe de 25 sozinho.
    const zeram = EMOCOES.filter((e) => minimo[e] === 0).length
    expect(zeram, `só ${zeram} de ${EMOCOES.length} zeram`).toBeGreaterThanOrEqual(6)
  })

  /**
   * ⚠️ NENHUM PAR DE ANÉIS PODE ANDAR JUNTO — medido, não argumentado.
   *
   * É o mesmo invariante do teste de liderança, mas visto pelo lado do usuário:
   * se dois anéis sobem e descem juntos em todos os dias reais, o segundo não
   * acrescenta informação à tela, só ocupa espaço e divide a atenção.
   *
   * Na primeira versão de seis: alegria×otimismo r=+0,81, stress×raiva r=+0,81,
   * ansiedade×stress r=+0,75. Numa de oito, +0,64. Nesta, +0,52.
   *
   * ⚠️ Afeto e entusiasmo já se chamaram alegria e ânimo e foram renomeados por
   * soarem iguais — mas medem r=-0,11, nenhuma relação. Nome parecido não é o
   * mesmo problema que fonte parecida, e só o segundo este teste pega.
   */
  it('nenhum par de emoções é redundante nos dados reais', () => {
    const porEmocao: Record<string, number[]> = {}
    for (const e of EMOCOES) porEmocao[e] = []
    for (const u of fixtures as any[]) {
      const r = emocoesDoDia(u.transitos)!
      for (const e of r) porEmocao[e.chave].push(e.valor)
    }
    const pearson = (a: number[], b: number[]) => {
      const n = a.length
      const ma = a.reduce((x, y) => x + y, 0) / n
      const mb = b.reduce((x, y) => x + y, 0) / n
      const va = Math.sqrt(a.reduce((s, x) => s + (x - ma) ** 2, 0))
      const vb = Math.sqrt(b.reduce((s, x) => s + (x - mb) ** 2, 0))
      if (va === 0 || vb === 0) return 0
      return a.reduce((s, x, i) => s + (x - ma) * (b[i] - mb), 0) / (va * vb)
    }
    let pior = { r: 0, par: '' }
    for (let i = 0; i < EMOCOES.length; i++) {
      for (let j = i + 1; j < EMOCOES.length; j++) {
        const r = pearson(porEmocao[EMOCOES[i]], porEmocao[EMOCOES[j]])
        if (r > pior.r) pior = { r, par: `${EMOCOES[i]}×${EMOCOES[j]}` }
      }
    }
    expect(pior.r, `pior par: ${pior.par} r=${pior.r.toFixed(2)}`).toBeLessThan(0.75)
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
    // ⚠️ QUATRO E QUATRO. A simetria é metade do que a seção comunica: com mais
    // anéis difíceis do que bons, a tela afirma que o dia tende a ser ruim
    // antes de calcular qualquer coisa.
    expect(r.filter((e) => e.pesa)).toHaveLength(4)
    expect(r.filter((e) => !e.pesa)).toHaveLength(4)
    // E os bons vêm primeiro: é onde o olho cai.
    expect(r.slice(0, 4).every((e) => !e.pesa)).toBe(true)
  })

  /**
   * ⚠️ AS COLUNAS SÃO PARES DE OPOSTOS, e isso depende da ORDEM.
   *
   * Com quatro por linha, os índices 0-4, 1-5, 2-6 e 3-7 caem um sobre o outro:
   *
   *     afeto      entusiasmo   calma       sensibilidade
   *     estresse   desânimo     ansiedade   pressão
   *
   * Vênus↔Marte, Júpiter↔Saturno, chão↔sobressalto, sentir↔apertar. É o que faz
   * a grade ser lida como quatro eixos em vez de oito números soltos. Reordenar a lista não
   * quebra nada — a tela continua funcionando e só para de significar isso.
   */
  it('cada coluna é um par de opostos', () => {
    expect([...EMOCOES]).toEqual([
      'afeto', 'entusiasmo', 'calma', 'sensibilidade',
      'estresse', 'desanimo', 'ansiedade', 'pressao',
    ])
    // O de cima e o de baixo de cada coluna estão em lados contrários.
    for (let i = 0; i < 4; i++) {
      expect(EMOCAO_PESA[EMOCOES[i]], EMOCOES[i]).toBe(false)
      expect(EMOCAO_PESA[EMOCOES[i + 4]], EMOCOES[i + 4]).toBe(true)
    }
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
      expect(r!.find((e) => e.chave === 'desanimo')!.valor).toBeGreaterThan(0)
    })

    // ⚠️ strength 0–100 multiplicado direto saturaria TUDO em 100: todos os
    // anéis cheios, todo dia, para todo mundo.
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
      expect(cheio.find((e) => e.chave === 'estresse')!.valor).toBeLessThan(100)
    })
  })

  /**
   * ⚠️ O PISO DE ÂNIMO, que era um defeito de modelo.
   *
   * A primeira tabela dava otimismo aos DEZ planetas. Como aspecto macio é
   * comum (73 de 168 trânsitos reais) e Saturno e Netuno estão entre os mais
   * frequentes nele, o número nunca descia de 41 para ninguém — e um indicador
   * que nunca desce não indica nada.
   *
   * O erro era astrológico antes de estatístico: Saturno em trígono é estrutura
   * que segura, não entusiasmo. Hoje ele acende a CALMA, que é um anel próprio.
   */
  describe('realismo do modelo', () => {
    it('Saturno em aspecto macio acende a CALMA, não o entusiasmo', () => {
      const s = somasBrutas([T('Saturn', 'trigono', 'Sun')])
      expect(s.calma).toBeGreaterThan(0)
      expect(s.entusiasmo).toBe(0)
      expect(s.afeto).toBe(0)
    })

    /**
     * ⚠️ A LUA É A DONA DA SENSIBILIDADE — correção do João, e ele estava certo:
     * a Lua é o planeta do humor na tradição. Eu tinha ancorado o anel em
     * Netuno por falta de dado, que é torcer a astrologia para caber num
     * artefato de amostragem. Netuno ficou como segundo, porque a Lua aparece
     * em poucas contas (os aspectos dela duram horas) e sozinha deixaria o anel
     * apagado na maioria dos dias.
     */
    it('a Lua lidera a sensibilidade; Netuno sustenta', () => {
      const lua = somasBrutas([T('Moon', 'trigono', 'Venus')])
      const netuno = somasBrutas([T('Neptune', 'trigono', 'Venus')])
      expect(lua.sensibilidade).toBeGreaterThan(netuno.sensibilidade)
      expect(netuno.sensibilidade).toBeGreaterThan(0)
    })

    /**
     * ⚠️ PLUTÃO NÃO ALIMENTA O ESTRESSE, e isso é medido, não opinião. Com
     * Plutão dando 0.30 ao estresse, estresse×pressão media r=+0,51 nos 21
     * usuários reais — os dois anéis subiam juntos e o segundo não acrescentava
     * nada. Sem, o pior par do conjunto cai para +0,43 e deixa de ser este.
     */
    it('Plutão duro vai para a PRESSÃO e não encosta no estresse', () => {
      const s = somasBrutas([T('Pluto', 'quadratura', 'Sun')])
      expect(s.pressao).toBeGreaterThan(0)
      expect(s.estresse).toBe(0)
    })

    it('o entusiasmo usa uma faixa ampla, sem piso que engane', () => {
      const vals = (fixtures as any[]).map(
        (u) => emocoesDoDia(u.transitos)!.find((e) => e.chave === 'entusiasmo')!.valor,
      )
      expect(Math.min(...vals), `min: ${Math.min(...vals)}`).toBeLessThan(25)
      // ⚠️ 50 e não 70: as que ALIVIAM não chegam tão alto quanto as que pesam
      // (72 contra 89 no topo), e isso é do céu — dia carregado acumula mais
      // aspecto duro simultâneo do que dia bom acumula macio. Cobrar 70 aqui
      // seria cobrar do código uma simetria que o dado não tem.
      expect(Math.max(...vals), `max: ${Math.max(...vals)}`).toBeGreaterThan(50)
    })

    it('um dia só de Saturno macio não inventa tensão NEM ânimo', () => {
      const r = emocoesDoDia([T('Saturn', 'trigono', 'Sun'), T('Saturn', 'sextil', 'Moon')])!
      const v = (k: string) => r.find((e) => e.chave === k)!.valor
      expect(v('ansiedade')).toBe(0)
      expect(v('desanimo')).toBe(0)
      expect(v('entusiasmo')).toBe(0)
      expect(v('afeto')).toBe(0)
      expect(v('calma')).toBeGreaterThan(0)
    })

    /**
     * ⚠️ O ALÍVIO VIROU ANEL, e isso é visível no resultado.
     *
     * Antes, Saturno macio subtraía da ansiedade: o alívio entrava na conta mas
     * não aparecia em lugar nenhum, e a pessoa lia um número já abatido sem
     * saber. Agora o mesmo trânsito acende a Calma e a ansiedade não se mexe —
     * dois trânsitos diferentes, dois fatos, nenhum escondido dentro do outro.
     */
    it('Saturno macio não mexe mais na ansiedade de um dia tenso', () => {
      const tenso = [T('Uranus', 'quadratura', 'Mercury')]
      const semAlivio = emocoesDoDia(tenso)!
      const comAlivio = emocoesDoDia([...tenso, T('Saturn', 'trigono', 'Sun')])!
      const ansiedade = (r: typeof semAlivio) => r.find((e) => e.chave === 'ansiedade')!.valor
      expect(ansiedade(comAlivio)).toBe(ansiedade(semAlivio))
      expect(comAlivio.find((e) => e.chave === 'calma')!.valor).toBeGreaterThan(0)
    })
  })

  /**
   * ⚠️ A EXPLICAÇÃO SAI DA MESMA CONTA QUE O NÚMERO.
   *
   * A tela mostra "de onde veio" ao tocar num anel. Se a explicação viesse de
   * uma segunda implementação da regra, um dia ela discordaria do número e
   * ninguém notaria — o usuário veria "Ansiedade 73" com uma lista que não
   * soma 73.
   */
  describe('a conta aberta', () => {
    it('as contribuições somam exatamente a soma bruta', () => {
      for (const u of (fixtures as any[]).slice(0, 8)) {
        const porEmocao = contribuicoesPorEmocao(u.transitos)
        const soma = somasBrutas(u.transitos)
        for (const e of EMOCOES) {
          const total = porEmocao[e].reduce((a, c) => a + c.valor, 0)
          expect(total, `${u.uid} ${e}`).toBeCloseTo(soma[e], 10)
        }
      }
    })

    it('cada emoção carrega o porquê, ordenado do que mais pesa', () => {
      const r = emocoesDoDia([
        T('Pluto', 'conjuncao', 'Midheaven'),
        T('Saturn', 'trigono', 'Sun'),
        T('Jupiter', 'trigono', 'Jupiter'),
      ])!
      for (const e of r) {
        expect(Array.isArray(e.porque), e.chave).toBe(true)
        for (let i = 1; i < e.porque.length; i++) {
          expect(e.porque[i - 1].valor, e.chave).toBeGreaterThanOrEqual(e.porque[i].valor)
        }
      }
      // A pressão vem de Plutão; a calma, do Saturno macio. Cada anel aponta
      // para o trânsito que é dele — e o estresse NÃO aponta para Plutão.
      const pressao = r.find((e) => e.chave === 'pressao')!
      expect(pressao.porque.some((c) => /pluto/i.test(c.planeta))).toBe(true)
      const estresse = r.find((e) => e.chave === 'estresse')!
      expect(estresse.porque.some((c) => /pluto/i.test(c.planeta))).toBe(false)
      const calma = r.find((e) => e.chave === 'calma')!
      expect(calma.porque.some((c) => /saturn/i.test(c.planeta))).toBe(true)
      // E o inverso: Júpiter não aparece explicando a calma deste dia.
      expect(calma.porque.some((c) => /jupiter/i.test(c.planeta))).toBe(false)
    })

    it('o porquê guarda os nomes CRUS, para a tela poder traduzir', () => {
      const r = emocoesDoDia([T('Mars', 'quadratura', 'Moon')])!
      const estresse = r.find((e) => e.chave === 'estresse')!
      expect(estresse.porque[0].planeta).toBe('Mars')
      expect(estresse.porque[0].alvo).toBe('Moon')
    })
  })

  /**
   * ⚠️ A COTA DE ENTRADA — o teste mais importante deste arquivo.
   *
   * O projeto tem duas listas de trânsito do dia com TAMANHOS diferentes:
   * `transitosRicos` vem do backend limitado a 8/dia, e `personalTodayRich` vem
   * do motor local sem teto nenhum. A calibração inteira foi feita contra a de
   * 8. Alimentar o cálculo com a lista completa não dá erro — só infla toda soma
   * e satura a curva, e aí os seis anéis mostram 90 e poucos todo dia.
   *
   * Medido contra a base multiplicada: uma lista 3× maior leva a mediana de 38
   * para 77, com 34% dos anéis acima de 90.
   */
  describe('a cota de entrada', () => {
    const muitos = (n: number) => {
      const planetas = ['Saturn', 'Pluto', 'Uranus', 'Neptune', 'Jupiter', 'Mars', 'Venus', 'Sun', 'Mercury', 'Moon']
      const aspectos = ['quadratura', 'trigono', 'oposicao', 'sextil', 'conjuncao']
      return Array.from({ length: n }, (_, i) => ({
        t: planetas[i % planetas.length],
        a: aspectos[i % aspectos.length],
        n: planetas[(i + 3) % planetas.length],
        orb: (i % 5) * 0.8,
        strength: 1 - (i % 10) * 0.05,
      }))
    }

    it('a lista fica do tamanho da cota, não do tamanho da entrada', () => {
      for (const n of [25, 60, 140]) {
        expect(selecionarTransitos(muitos(n)), `entrada de ${n}`)
          .toHaveLength(COTA_LENTOS + COTA_RAPIDOS)
      }
      // Entrada menor que a cota passa inteira: não há o que cortar.
      expect(selecionarTransitos(muitos(5))).toHaveLength(5)
    })

    /**
     * ⚠️ ESTE é o teste que reproduz o bug ao vivo.
     *
     * Não adianta cobrar que nenhum anel passe de 90 — um dia de verdade muito
     * carregado PODE passar, e deve. O que não pode é o número subir só porque
     * a lista veio maior. Aqui a base real de cada usuário recebe 50 trânsitos
     * fracos de enfeite, que é o que acontece quando o app passa a lista
     * completa em vez do top-8: sem a cota, a mediana vai de 41 para a casa dos
     * 90 e seis anéis quase cheios aparecem todo dia, sem erro nenhum.
     */
    it('encher a lista de trânsitos fracos NÃO infla o resultado', () => {
      const ruido = Array.from({ length: 50 }, (_, i) => ({
        t: 'Venus', a: 'sextil', n: 'Jupiter', orb: 7.9, strength: 0.02 + i * 0.0001,
      }))
      const limpos: number[] = []
      const sujos: number[] = []
      for (const u of fixtures as any[]) {
        for (const e of emocoesDoDia(u.transitos)!) if (e.pesa) limpos.push(e.valor)
        for (const e of emocoesDoDia([...u.transitos, ...ruido])!) if (e.pesa) sujos.push(e.valor)
      }
      const med = (a: number[]) => [...a].sort((x, y) => x - y)[Math.floor(a.length / 2)]
      expect(med(sujos), `mediana limpa ${med(limpos)} · com ruído ${med(sujos)}`)
        .toBe(med(limpos))
      expect(Math.max(...sujos)).toBe(Math.max(...limpos))
    })

    it('num dia sintético extremo o número sobe, mas sem estourar', () => {
      // 60 trânsitos todos no orbe exato e na força máxima — mais extremo que
      // qualquer dia da base real. A cota corta em 8; o resto é o céu mesmo.
      const r = emocoesDoDia(muitos(60))!
      for (const e of r) expect(e.valor, e.chave).toBeLessThanOrEqual(100)
      expect(r.some((e) => e.valor === 0), 'nem tudo acende nem no extremo').toBe(true)
    })

    it('entra o mais forte de cada velocidade, não os oito primeiros', () => {
      const fraco = { t: 'Saturn', a: 'quadratura', n: 'Sun', orb: 7, strength: 0.1 }
      const forte = { t: 'Saturn', a: 'quadratura', n: 'Moon', orb: 0.1, strength: 1 }
      const sel = selecionarTransitos([fraco, fraco, fraco, fraco, fraco, fraco, forte])
      expect(sel).toContain(forte)
    })

    it('garante vaga para trânsito RÁPIDO mesmo num dia cheio de lentos', () => {
      const lentos = Array.from({ length: 20 }, () => ({ t: 'Pluto', a: 'quadratura', n: 'Sun', orb: 0.2, strength: 1 }))
      const rapido = { t: 'Venus', a: 'trigono', n: 'Venus', orb: 4, strength: 0.4 }
      const sel = selecionarTransitos([...lentos, rapido])
      expect(sel, 'o rápido perderia no peso, mas tem vaga própria').toContain(rapido)
    })

    it('sem rápido nenhum, o lento ocupa as vagas que sobram', () => {
      const lentos = Array.from({ length: 20 }, (_, i) => ({ t: 'Saturn', a: 'quadratura', n: 'Sun', orb: i * 0.3, strength: 1 }))
      expect(selecionarTransitos(lentos)).toHaveLength(COTA_LENTOS + COTA_RAPIDOS)
    })

    /**
     * ⚠️ `personalTodayRich` não traz o campo `lento` — só `transitosRicos` traz.
     * Sem deduzir pelo nome do planeta, TODO trânsito do motor local cairia como
     * rápido, e a cota de lentos ficaria vazia justamente no caminho que o app
     * usa de verdade.
     */
    it('deduz o planeta lento pelo nome quando o campo não vem', () => {
      const semCampo = [
        ...Array.from({ length: 8 }, () => ({ transitPlanet: 'Venus', type: 'trigono', natalPlanet: 'Sun', strength: 90 })),
        { transitPlanet: 'Pluto', type: 'quadratura', natalPlanet: 'Sun', strength: 10 },
      ]
      const sel = selecionarTransitos(semCampo)
      expect(sel.some((t) => t.transitPlanet === 'Pluto'), 'Plutão é lento e tem vaga própria').toBe(true)
    })

    /**
     * ⚠️ A COTA DO APP TEM DE SER IGUAL À DO BACKEND.
     *
     * A base vem do `status-engine` com a cota dele (6 lentos + 6 rápidos = 12).
     * Se a cota daqui fosse menor, a calibração mediria uma lista e a tela
     * mostraria outra — que foi exatamente o estado anterior, com o backend
     * mandando 8 e o app alimentando o cálculo com a lista inteira.
     */
    it('a base de calibração passa inteira pela cota, sem perder trânsito', () => {
      expect(COTA_LENTOS + COTA_RAPIDOS).toBe(12)
      for (const u of fixtures as any[]) {
        expect(u.transitos.length, `${u.uid} veio do backend com`).toBe(12)
        expect(selecionarTransitos(u.transitos), u.uid).toHaveLength(12)
      }
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
