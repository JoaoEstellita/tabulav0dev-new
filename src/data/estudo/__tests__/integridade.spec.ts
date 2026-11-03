import { describe, it, expect } from 'vitest'
import { CATALOGO, LICOES, VERBETES, porId } from '../index'
import type { Bloco, T } from '../tipos'
import { GLOSSARIO } from '../../glossarioAstrologico'

/**
 * A INTEGRIDADE DO CATÁLOGO DE ESTUDO.
 *
 * ⚠️ ESTES TESTES VIERAM ANTES DO CONTEÚDO, de propósito. O risco dominante
 * desta área não é código quebrado — é TEXTO FALTANDO que cai em fallback e
 * some da tela sem erro nenhum. Foi exatamente assim que o título curado de
 * ASC/MC passou meses invisível neste app: a chave não casava, o fallback
 * cobria, e nada acusava.
 *
 * Com as travas escritas primeiro, toda lição e todo verbete adicionados
 * depois já nascem guardados.
 */

const IDIOMAS = ['pt-BR', 'en-US', 'es-ES', 'it-IT'] as const

/** Todo campo `T` de uma unidade, com um rótulo que diz onde ele está. */
function camposDeTexto(u: { id: string; titulo: T; resumo: T; blocos: Bloco[] }) {
  const out: Array<{ onde: string; t: T }> = [
    { onde: `${u.id}.titulo`, t: u.titulo },
    { onde: `${u.id}.resumo`, t: u.resumo },
  ]
  u.blocos.forEach((b, i) => {
    if (b.tipo === 'ganchoPessoal') return
    if (b.tipo === 'sincronicidade') {
      out.push({ onde: `${u.id}.bloco${i}.descoberta`, t: b.descoberta })
      out.push({ onde: `${u.id}.bloco${i}.noMundo`, t: b.noMundo })
      out.push({ onde: `${u.id}.bloco${i}.leitura`, t: b.leitura })
      return
    }
    out.push({ onde: `${u.id}.bloco${i}.texto`, t: b.texto })
  })
  return out
}

describe('integridade do catálogo de estudo', () => {
  it('todo texto existe nos 4 idiomas, não vazio', () => {
    const faltando: string[] = []
    for (const u of CATALOGO) {
      for (const { onde, t } of camposDeTexto(u)) {
        for (const lang of IDIOMAS) {
          if (!t[lang] || !t[lang].trim()) faltando.push(`${onde} [${lang}]`)
        }
      }
    }
    expect(faltando.slice(0, 10), 'texto faltando cai em fallback e some da tela').toEqual([])
  })

  /** Regra do projeto: es-ES sem tildes nem ñ; it-IT sem acentos. */
  it('es-ES sem tildes nem ñ, it-IT sem acentos', () => {
    const erros: string[] = []
    for (const u of CATALOGO) {
      for (const { onde, t } of camposDeTexto(u)) {
        if (/[áéíóúñ]/i.test(t['es-ES'])) erros.push(`${onde} [es-ES]`)
        if (/[àèéìòù]/i.test(t['it-IT'])) erros.push(`${onde} [it-IT]`)
      }
    }
    expect(erros.slice(0, 10), 'regra de ortografia do projeto').toEqual([])
  })

  it('ids são únicos', () => {
    const ids = CATALOGO.map((u) => u.id)
    const repetidos = ids.filter((x, i) => ids.indexOf(x) !== i)
    expect(new Set(ids).size, `id repetido: ${repetidos.join(', ')}`).toBe(ids.length)
  })

  it('verTambem aponta para id que existe', () => {
    const mortos: string[] = []
    for (const u of CATALOGO) {
      for (const alvo of u.verTambem) if (!porId(alvo)) mortos.push(`${u.id} -> ${alvo}`)
    }
    expect(mortos, 'link morto é um beco invisível').toEqual([])
  })

  /**
   * ⚠️ "Chave que não casa + fallback = bug invisível" é o padrão que este
   * projeto já pagou mais de uma vez. Aqui ele falha alto.
   */
  it('termos declarados existem no glossário', () => {
    const fantasmas: string[] = []
    for (const u of CATALOGO) {
      for (const termo of u.termos) if (!GLOSSARIO[termo]) fantasmas.push(`${u.id} -> ${termo}`)
    }
    expect(fantasmas, 'termo que não existe no glossário nunca vira link').toEqual([])
  })

  /**
   * ⚠️ SÓ O VERBETE É DESTINO DO "VER A FUNDO". A lição também declara termos,
   * mas para a BUSCA — se lição e verbete disputassem o mesmo termo, o popup
   * do glossário não saberia para onde mandar.
   */
  it('nenhum termo é reivindicado por dois verbetes', () => {
    const contagem = new Map<string, string[]>()
    for (const u of VERBETES) {
      for (const t of u.termos) contagem.set(t, [...(contagem.get(t) ?? []), u.id])
    }
    const ambiguos = [...contagem].filter(([, ids]) => ids.length > 1)
    expect(ambiguos, 'termo em dois verbetes: o "ver a fundo" não saberia o destino').toEqual([])
  })

  it('minutos batem com o tamanho do texto', () => {
    const mentiras: string[] = []
    for (const u of CATALOGO) {
      const palavras = camposDeTexto(u)
        .reduce((n, { t }) => n + t['pt-BR'].split(/\s+/).filter(Boolean).length, 0)
      // 180 palavras/min é leitura confortável num celular.
      const esperado = Math.max(1, Math.round(palavras / 180))
      if (Math.abs(u.minutos - esperado) > 2) {
        mentiras.push(`${u.id}: diz ${u.minutos} min, tem ${palavras} palavras (~${esperado})`)
      }
    }
    expect(mentiras, 'tempo de leitura tem de ser honesto').toEqual([])
  })

  it('a trilha não tem buraco nem repetição', () => {
    // ⚠️ Tolera a trilha VAZIA e cobra a ausência de BURACO, não o total de
    // 12 — a trilha é escrita em três tarefas, e um teste vermelho entre elas
    // treinaria a equipe a ignorar vermelho. Quando as 12 existirem, este
    // assert passa a exigi-las (ver o plano, Task 4).
    if (LICOES.length === 0) return
    const ordens = LICOES.map((l) => l.ordem).sort((a, b) => (a ?? 0) - (b ?? 0))
    expect(ordens).toEqual(ordens.map((_, i) => i + 1))
    for (const l of LICOES) {
      expect([0, 1, 2, 3, 4], `${l.id}: ato fora da faixa`).toContain(l.ato)
    }
  })

  /**
   * ⚠️ SÓ OS TRANSNETUNIANOS TÊM SINCRONICIDADE, e isso é uma regra de
   * honestidade, não de estilo. Urano, Netuno e Plutão foram descobertos com a
   * história já escrita em volta — dá para pôr a data de descoberta ao lado do
   * que acontecia no mundo e deixar o leitor ver. Os sete clássicos são
   * conhecidos desde antes de qualquer registro: inventar uma coincidência de
   * descoberta para eles seria fabricar o que esta área existe para não fazer.
   */
  it('só os transnetunianos têm sincronicidade, e com ano plausível', () => {
    const comSinc = CATALOGO.filter((u) => u.blocos.some((b) => b.tipo === 'sincronicidade'))
    expect(comSinc.map((u) => u.id).sort())
      .toEqual(['planeta-netuno', 'planeta-plutao', 'planeta-urano'])
    for (const u of comSinc) {
      for (const b of u.blocos) {
        if (b.tipo !== 'sincronicidade') continue
        expect(b.ano, `${u.id}: ano fora do plausível`).toBeGreaterThan(1700)
        expect(b.ano, `${u.id}: ano fora do plausível`).toBeLessThan(1950)
      }
    }
  })

  /**
   * ⚠️ A LEITURA NÃO PODE SE APRESENTAR COMO FATO. `descoberta` e `noMundo` são
   * verificáveis; `leitura` é interpretação da tradição. Se o texto da leitura
   * disser "prova", "porque" ou "comprova", ele atravessa essa linha — e é
   * justamente a credibilidade que esta área existe para construir.
   */
  it('a leitura da sincronicidade não se declara demonstrada', () => {
    const proibidas = /(prova|provam|comprova|comprovam|demonstra|demonstram|portanto|logo se v[êe])/i
    const infratores: string[] = []
    for (const u of CATALOGO) {
      for (const b of u.blocos) {
        if (b.tipo !== 'sincronicidade') continue
        for (const lang of IDIOMAS) {
          if (proibidas.test(b.leitura[lang])) infratores.push(`${u.id} [${lang}]`)
        }
      }
    }
    expect(infratores, 'a leitura se apresentou como demonstrada').toEqual([])
  })

  /** ⚠️ O motor não calcula Quíron — um verbete prometeria o que o mapa não mostra. */
  it('Quíron não aparece', () => {
    const cita = CATALOGO.filter((u) => camposDeTexto(u)
      .some(({ t }) => /qu[ií]ron|chiron/i.test(t['pt-BR'])))
    expect(cita.map((u) => u.id), 'o motor não o calcula').toEqual([])
  })
})
