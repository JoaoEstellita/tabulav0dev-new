import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { emocoesDoDia, EMOCOES } from '../emocoesDoDia'
import { ANCORAS_POR_AREA, escalaDaArea, TIPICO, textoDoDesvio } from '../../constants/escalaDaArea'
import { desvioDaReferencia } from '../emocoesDoDia'
import { STATUS_THRESHOLDS } from '../../constants/statusThresholds'

/** Trânsito na forma que o motor entrega. */
const t = (planeta: string, aspecto: string, alvo: string, orb = 1) => ({
  t: planeta, a: aspecto, n: alvo, orb, strength: 70,
})

describe('anel sem material', () => {
  /**
   * ⚠️ ZERO É UMA AFIRMAÇÃO QUE O DADO NÃO FAZ. `paraEscala(0)` devolve 0
   * quando NENHUM trânsito toca o anel, e a roda desenhava esse 0 como número:
   * "Desânimo 0" lê como "você não tem desânimo nenhum hoje", quando significa
   * "o céu não mexeu nisso".
   *
   * ⚠️ E NÃO É RARO: reamostrando 8.000 dias do pool real, Calma e
   * Sensibilidade ficam sem material em pelo menos um quarto dos dias.
   */
  it('marca o anel que nenhum trânsito tocou', () => {
    // Um trânsito só, que toca poucos anéis — os demais ficam sem material.
    const r = emocoesDoDia([t('Venus', 'trigono', 'Moon')])
    expect(r, 'não devolveu anéis').not.toBeNull()
    const vazios = r!.filter((e) => e.semMaterial)
    expect(vazios.length, 'nenhum anel ficou marcado como vazio com um trânsito só')
      .toBeGreaterThan(0)
    // ⚠️ O VALOR SEGUE 0 — quem faz conta continua somando normalmente. O que
    // muda é só quem DESENHA. Trocar o valor por null quebraria toda média.
    for (const e of vazios) {
      expect(e.valor, `${e.chave}: anel vazio deveria valer 0 para quem calcula`).toBe(0)
      expect(e.porque.length, `${e.chave}: marcado vazio mas tem contribuição`).toBe(0)
    }
  })

  it('não marca como vazio o anel que foi tocado', () => {
    const r = emocoesDoDia([t('Venus', 'trigono', 'Moon'), t('Saturn', 'quadratura', 'Sun')])
    expect(r).not.toBeNull()
    for (const e of r!) {
      if (e.porque.length > 0) {
        expect(e.semMaterial, `${e.chave}: tem ${e.porque.length} contato e foi marcado vazio`).toBe(false)
      }
    }
  })

  it('todo anel traz a marca, sempre', () => {
    const r = emocoesDoDia([t('Mars', 'oposicao', 'Moon')])
    expect(r!.length).toBe(EMOCOES.length)
    for (const e of r!) {
      expect(typeof e.semMaterial, `${e.chave}: sem a marca, a roda volta a desenhar 0`).toBe('boolean')
    }
  })

  /**
   * ⚠️ NAS RESERVAS, `semMaterial` VEM DO VALOR E NÃO DA LISTA. Quando o
   * status antigo guardou o número sem o detalhe, `porque` está vazio porque o
   * detalhe não foi gravado — não porque nada tocou. Derivar da lista marcaria
   * TODOS os anéis como vazios e a roda viraria oito traços.
   */
  it('a reserva de valores gravados não vira oito traços', () => {
    const fonte = readFileSync(join(__dirname, '..', '..', 'components', 'ClimaEmocional.tsx'), 'utf8')
    const semComentario = fonte.split('\n').filter((l) => !/^\s*(\/\/|\*|\/\*)/.test(l)).join('\n')
    // Nas reservas a marca sai do valor...
    const porValor = (semComentario.match(/semMaterial:\s*valor\s*<=\s*0/g) || []).length
    expect(porValor, 'as reservas deixaram de derivar semMaterial do valor').toBe(2)
    // ...e nunca de uma lista que ali está vazia por outro motivo.
    expect(semComentario, 'uma reserva passou a derivar semMaterial da lista vazia')
      .not.toMatch(/semMaterial:\s*\(?\s*\[\]/)
  })

  it('a roda desenha traço, não zero', () => {
    const fonte = readFileSync(join(__dirname, '..', '..', 'components', 'ClimaEmocional.tsx'), 'utf8')
    const semComentario = fonte.split('\n').filter((l) => !/^\s*(\/\/|\*|\/\*)/.test(l)).join('\n')
    expect(semComentario, 'a roda voltou a desenhar o valor cru').toMatch(/e\.semMaterial \? '—' : e\.valor/)
    expect(semComentario, 'o modal voltou a mostrar 0').toMatch(/emocao\.semMaterial \? '—' : emocao\.valor/)
  })
})

describe('a escala exibida das áreas', () => {
  /**
   * ⚠️ 50 É O TÍPICO EM TODA ÁREA — é o ponto do remapeamento. Medido com o
   * motor real em 2400 leituras: no CRU a mediana era 41 e só 24% chegavam a
   * 50; depois do remap, mediana 50 e 51% acima. Sem isso o app dizia para
   * quase todo mundo, quase todo dia, que a vida está abaixo da média.
   */
  it('a mediana medida de cada área vai para 50', () => {
    for (const [area, anc] of Object.entries(ANCORAS_POR_AREA)) {
      expect(escalaDaArea(area, anc[2]), `${area}: a mediana não caiu em 50`).toBe(TIPICO)
    }
  })

  it('os decis viram 25 e 75', () => {
    for (const [area, anc] of Object.entries(ANCORAS_POR_AREA)) {
      expect(escalaDaArea(area, anc[1]), `${area}: p10 fora de 25`).toBe(25)
      expect(escalaDaArea(area, anc[3]), `${area}: p90 fora de 75`).toBe(75)
    }
  })

  /**
   * ⚠️ A ORDEM DENTRO DE CADA ÁREA NÃO PODE MUDAR. A transformação troca a
   * régua, não o julgamento: se um dia pior passasse à frente de um melhor, o
   * remap estaria inventando leitura em vez de centrar a escala.
   */
  it('preserva a ordem', () => {
    for (const area of Object.keys(ANCORAS_POR_AREA)) {
      let anterior = -1
      for (let bruto = 0; bruto <= 100; bruto++) {
        const v = escalaDaArea(area, bruto)!
        expect(v, `${area}: ${bruto} quebrou a ordem`).toBeGreaterThanOrEqual(anterior)
        anterior = v
      }
    }
  })

  /**
   * ⚠️ ESTE É O PONTO TODO: o mesmo número cru NÃO é o mesmo estado em áreas
   * diferentes. Carreira vive em 36, Comunicação em 45.
   */
  it('o mesmo cru lê diferente em áreas de patamar diferente', () => {
    expect(escalaDaArea('carreira', 36)).toBe(TIPICO)
    expect(escalaDaArea('comunicacao', 36)!).toBeLessThan(TIPICO)
    expect(escalaDaArea('comunicacao', 45)).toBe(TIPICO)
    expect(escalaDaArea('carreira', 45)!).toBeGreaterThan(TIPICO)
  })

  it('o teto absoluto não é alcançável', () => {
    for (const area of Object.keys(ANCORAS_POR_AREA)) {
      expect(escalaDaArea(area, 100)!).toBeLessThanOrEqual(98)
      expect(escalaDaArea(area, 0)!).toBeGreaterThanOrEqual(2)
    }
  })

  /**
   * ⚠️ `Number(null)` É 0, E 0 PASSA EM `isFinite` — a armadilha que já mordeu
   * este projeto cinco vezes. Aqui ela entraria como "o pior dia possível".
   */
  it('valor ausente não vira o pior dia', () => {
    for (const v of [null, undefined, '', NaN, 'abc']) {
      expect(escalaDaArea('carreira', v), `${String(v)} virou leitura`).toBeNull()
    }
    expect(escalaDaArea('area-que-nao-existe', 50), 'área sem âncora deveria dar null').toBeNull()
  })

  it('a frase existe nos 4 idiomas e segue as regras de i18n', () => {
    const d = desvioDaReferencia(70, TIPICO)
    const pt = textoDoDesvio(d, 'pt-BR')
    expect(pt, 'frase vazia em pt-BR').toBeTruthy()
    for (const lang of ['en-US', 'es-ES', 'it-IT']) {
      expect(textoDoDesvio(d, lang), `${lang}: frase vazia`).toBeTruthy()
      expect(textoDoDesvio(d, lang), `${lang}: devolveu português`).not.toBe(pt)
    }
    expect(textoDoDesvio(d, 'es-ES')!, 'es-ES com tilde ou ñ').not.toMatch(/[áéíóúñ]/i)
    expect(textoDoDesvio(d, 'it-IT')!, 'it-IT com acento').not.toMatch(/[àèéìòù]/i)
    expect(textoDoDesvio(null, 'pt-BR'), 'desvio nulo deveria dar frase nula').toBeNull()
  })

  /**
   * ⚠️ UM LUGAR SÓ APLICA O REMAP, por funil. Aplicar duas vezes achataria
   * tudo contra 50; não aplicar deixaria duas escalas no mesmo app.
   */
  it('o remap é aplicado uma vez por funil de exibição', () => {
    const limpa = (p: string) => readFileSync(join(__dirname, '..', '..', p), 'utf8')
      .split('\n')
      .filter((l) => !/^\s*(\/\/|\*|\/\*)/.test(l))
      .join('\n')
    const home = limpa('screens/home/HomeScreen.tsx')
    const grupos = limpa('screens/groups/GroupsScreen.tsx')
    expect((home.match(/escalaDaArea\(/g) || []).length, 'Home: remap fora do funil único').toBe(1)
    expect((grupos.match(/escalaDaArea\(/g) || []).length, 'Grupos: remap fora do funil único').toBe(1)
    // ⚠️ O "mais frágil" compara DIRETO: o valor já vem remapeado, e subtrair
    // uma referência ali corrigiria duas vezes.
    expect(grupos, 'o "mais frágil" voltou a subtrair uma referência')
      .not.toMatch(/referenciaDaArea/)
  })

  /**
   * ⚠️ OS ALERTAS AGORA COMPARAM NA ESCALA EXIBIDA. Este teste afirmava o
   * contrário — era a segunda decisão, tomada depois, com medição na frente.
   *
   * Os limiares vivem na escala em que 50 é o típico. Comparar o valor CRU
   * contra eles fazia Carreira disparar "crítico" em 43,7% das leituras e
   * Espiritualidade em 14,7%: três vezes mais alerta numa área que na outra,
   * por artefato de escala. Remapeado, fica entre 7,9% e 10,0% nas oito.
   */
  it('o caminho dos alertas compara na escala exibida', () => {
    const hook = readFileSync(join(__dirname, '..', '..', 'hooks', 'useLifeAreas.ts'), 'utf8')
    const limpo = hook.split(String.fromCharCode(10))
      .filter((l) => !/^\s*(\/\/|\*|\/\*)/.test(l))
      .join(String.fromCharCode(10))
    expect(limpo, 'o hook dos alertas voltou a comparar o valor cru').toMatch(/escalaDaArea/)
    expect(limpo, 'o limiar tem de ser lido do runtime, não fixado aqui')
      .toMatch(/STATUS_THRESHOLDS\.criticalBelow/)
  })

  /**
   * ⚠️ OS LIMIARES TÊM DE ESTAR NA ESCALA EXIBIDA. Se alguém devolver os
   * valores antigos (35/62), eles passam a significar 23% de "crítico" e 26%
   * de "favorável" sobre números já centrados — e nada acusa, porque os dois
   * continuam entre 0 e 100.
   */
  it('os limiares padrão são da escala exibida', () => {
    expect(STATUS_THRESHOLDS.criticalBelow, 'criticalBelow voltou para a escala crua').toBe(25)
    expect(STATUS_THRESHOLDS.positiveAbove, 'positiveAbove voltou para a escala crua').toBe(75)
    // ⚠️ SIMETRIA: raro dos dois lados e igualmente raro. Medido, 8,8% e 10,8%.
    // Um aviso de atenção que dispara três vezes mais que um de boa fase
    // ensina que o app só traz má notícia.
    const aoCritico = TIPICO - STATUS_THRESHOLDS.criticalBelow
    const aoPositivo = STATUS_THRESHOLDS.positiveAbove - TIPICO
    expect(Math.abs(aoCritico - aoPositivo), 'os dois extremos deixaram de ser simétricos')
      .toBeLessThanOrEqual(5)
  })
})
