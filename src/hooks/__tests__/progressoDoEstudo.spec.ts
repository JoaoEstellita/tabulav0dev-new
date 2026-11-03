import { describe, it, expect } from 'vitest'
import { normalizarProgresso } from '../useProgressoDoEstudo'
import { CATALOGO } from '../../data/estudo'

/** Um id que existe de verdade no catálogo, qualquer um. */
const ID_REAL = CATALOGO[0].id

describe('progresso do estudo', () => {
  /**
   * ⚠️ O QUE VEM DO DISCO NÃO É CONFIÁVEL. Versão antiga, gravação pela
   * metade ou JSON corrompido não podem derrubar a aba inteira — a tela tem
   * de abrir no começo em vez de quebrar.
   */
  it('lixo no disco vira começo do zero, não exceção', () => {
    for (const bruto of [null, undefined, '', 'nao-json', 42, [], { lidos: 'x' }, { lidos: null }]) {
      expect(normalizarProgresso(bruto), `entrada: ${JSON.stringify(bruto)}`)
        .toEqual({ lidos: [], ultimo: null })
    }
  })

  /**
   * ⚠️ ID ÓRFÃO É DESCARTADO. Uma versão futura pode renomear lições; manter a
   * marca faria a trilha mostrar "lido" no card errado. Perder a marca é
   * melhor que mostrar a errada.
   */
  it('descarta id que não existe mais no catálogo', () => {
    const r = normalizarProgresso({ lidos: [ID_REAL, 'unidade-removida'], ultimo: 'unidade-removida' })
    expect(r.lidos, 'id órfão de uma versão antiga').toEqual([ID_REAL])
    expect(r.ultimo, 'último apontando para id morto deveria zerar').toBeNull()
  })

  it('não repete id lido duas vezes', () => {
    const r = normalizarProgresso({ lidos: [ID_REAL, ID_REAL], ultimo: ID_REAL })
    expect(r.lidos).toEqual([ID_REAL])
    expect(r.ultimo).toBe(ID_REAL)
  })

  it('preserva o que é válido', () => {
    const r = normalizarProgresso({ lidos: [ID_REAL], ultimo: ID_REAL })
    expect(r).toEqual({ lidos: [ID_REAL], ultimo: ID_REAL })
  })
})
