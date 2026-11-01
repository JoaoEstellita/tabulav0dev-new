import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { emocoesDoDia, EMOCOES } from '../emocoesDoDia'
import { REFERENCIA_POR_AREA, desvioDaArea, referenciaDaArea, textoDoDesvio } from '../../constants/referenciaPorArea'

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

describe('a referência das áreas da vida', () => {
  /**
   * ⚠️ A CHAVE TEM DE CASAR COM O QUE A TELA PASSA. O modal recebe
   * `areaData.name`, que é a CHAVE crua do objeto `lifeAreas` (`amor`,
   * `saude`…), não um rótulo traduzido. Se não casar, `desvioDaArea` devolve
   * null e a linha do normal simplesmente não aparece — sem erro, sem aviso.
   * É o padrão "chave que não casa + fallback = bug invisível" que este
   * projeto já pagou.
   */
  it('casa com as chaves que a tela realmente passa', () => {
    const doMotor = ['amor', 'carreira', 'comunicacao', 'espiritualidade', 'familia', 'financas', 'saude', 'transformacao']
    for (const chave of doMotor) {
      expect(referenciaDaArea(chave), `a chave "${chave}" não tem referência`).not.toBeNull()
    }
    expect(Object.keys(REFERENCIA_POR_AREA).sort()).toEqual(doMotor.sort())
  })

  it('aguenta acento e caixa', () => {
    expect(referenciaDaArea('Saúde')).toBe(REFERENCIA_POR_AREA.saude)
    expect(referenciaDaArea('  COMUNICAÇÃO ')).toBe(REFERENCIA_POR_AREA.comunicacao)
    expect(referenciaDaArea('Transformação')).toBe(REFERENCIA_POR_AREA.transformacao)
  })

  /**
   * ⚠️ `Number(null)` É 0, E 0 PASSA EM `isFinite` — a armadilha que já mordeu
   * este projeto quatro vezes. Valor ausente não pode virar "bem abaixo do
   * normal", que é a leitura mais alarmante que existe.
   */
  it('valor ausente não vira alarme', () => {
    for (const v of [null, undefined, '', NaN]) {
      expect(desvioDaArea('carreira', v as never), `${String(v)} virou leitura`).toBeNull()
    }
  })

  it('o próprio normal lê "dentro"', () => {
    for (const [area, ref] of Object.entries(REFERENCIA_POR_AREA)) {
      expect(desvioDaArea(area, ref), `${area}: o próprio normal não leu "dentro"`).toBe('dentro')
    }
  })

  /**
   * ⚠️ O PONTO DA REFERÊNCIA: 36 em Carreira e 45 em Comunicação são a MESMA
   * leitura. Antes a roda punha os dois lado a lado e aparentava nove pontos de
   * diferença que, de fato, são zero.
   */
  it('o normal de cada área lê igual, mesmo com números diferentes', () => {
    expect(desvioDaArea('carreira', 36)).toBe('dentro')
    expect(desvioDaArea('comunicacao', 45)).toBe('dentro')
    expect(REFERENCIA_POR_AREA.comunicacao - REFERENCIA_POR_AREA.carreira)
      .toBeGreaterThanOrEqual(5)
  })

  it('a frase existe nos 4 idiomas e segue as regras de i18n', () => {
    const d = desvioDaArea('carreira', 60)
    const pt = textoDoDesvio(d, 'pt-BR')
    expect(pt, 'frase vazia em pt-BR').toBeTruthy()
    for (const lang of ['en-US', 'es-ES', 'it-IT']) {
      const txt = textoDoDesvio(d, lang)
      expect(txt, `${lang}: frase vazia`).toBeTruthy()
      expect(txt, `${lang}: devolveu o texto em português`).not.toBe(pt)
    }
    // Regra do projeto: es-ES sem tildes nem ñ; it-IT sem acentos.
    expect(textoDoDesvio(d, 'es-ES')!, 'es-ES com tilde ou ñ').not.toMatch(/[áéíóúñ]/i)
    expect(textoDoDesvio(d, 'it-IT')!, 'it-IT com acento').not.toMatch(/[àèéìòù]/i)
    expect(textoDoDesvio(null, 'pt-BR'), 'desvio nulo deveria dar frase nula').toBeNull()
  })

  it('o modal da área mostra a linha do normal', () => {
    const fonte = readFileSync(join(__dirname, '..', '..', 'components', 'LifeAreaDetailModal.tsx'), 'utf8')
    const semComentario = fonte.split('\n').filter((l) => !/^\s*(\/\/|\*|\/\*)/.test(l)).join('\n')
    expect(semComentario, 'o modal parou de calcular a leitura do normal').toMatch(/desvioDaArea\(/)
    expect(semComentario, 'o modal parou de desenhar a linha').toMatch(/leituraDoNormal/)
    // ⚠️ `LifeArea` só tem `name` — não existe `key`. Usar `.key` devolveria
    // undefined e a linha nunca apareceria, calada.
    expect(semComentario, 'voltou a ler uma chave que o tipo não tem')
      .not.toMatch(/areaData\?\.key/)
  })
})
