/**
 * O que já foi publicado, para não sair duas vezes.
 *
 * Vivia dentro de `gerarCard.mjs`, onde nasceu. Saiu para cá quando a produção
 * passou a ser diária: `gerarEvento.mjs` precisa da mesma janela, e por um
 * motivo que a medição deixou claro — a lua fora de curso de 13/08 dura 42,3h e
 * `eventosDoDia` a devolve nos dias 13, 14 e 15, porque `emCurso` é verdadeiro
 * nos três. Sem isto, três posts iguais.
 *
 * Um JSON ao lado das imagens, não um banco: apagar a pasta de saída zera o
 * histórico junto, que é o comportamento esperado. No runner ele sobrevive pelo
 * cache do Actions.
 */
import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

/** Duas semanas: o bastante para ninguém notar, curto para não travar o pool. */
export const JANELA_SEM_REPETIR = 14

const ARQUIVO = '.historico.json'

/**
 * A chave do histórico é `AAAA-MM-DD` ou `AAAA-MM-DD#2`.
 *
 * O sufixo é o slot da peça. Passou a existir quando o dia deixou de ter uma
 * peça só: sem ele, a segunda peça do dia sobrescrevia a entrada da primeira, e
 * as duas acabavam podendo falar do mesmo assunto.
 */
const soAData = (chave) => String(chave).split('#')[0]

/** `AAAA-MM-DD` → meio-dia UTC, longe das bordas de fuso. */
const meioDiaUTC = (iso) => new Date(`${soAData(iso)}T12:00:00Z`)

/** A entrada de um dia e slot: `2026-08-13` ou `2026-08-13#3`. */
export const entradaDoDia = (iso, slot = 1) => (slot > 1 ? `${iso}#${slot}` : iso)

/** O histórico gravado, ou `{}` na primeira vez. */
export async function lerHistorico(raizSaida) {
  try {
    return JSON.parse(await readFile(path.join(raizSaida, ARQUIVO), 'utf8'))
  } catch {
    return {}
  }
}

export async function salvarHistorico(raizSaida, historico) {
  // mantém a janela enxuta: entradas antigas não influenciam mais nada
  const corte = new Date(Date.now() - JANELA_SEM_REPETIR * 3 * 86_400_000)
  const podado = Object.fromEntries(
    Object.entries(historico).filter(([iso]) => meioDiaUTC(iso) >= corte)
  )
  await writeFile(path.join(raizSaida, ARQUIVO), JSON.stringify(podado, null, 2), 'utf8')
}

/**
 * Chaves usadas na janela que precede `iso`.
 *
 * A entrada DESTA peça fica de fora, e isso importa: sem a exclusão, regerar
 * uma peça já publicada encontraria a própria chave no histórico, escolheria
 * outro assunto, e a peça no Estúdio deixaria de bater com a que o João baixou.
 *
 * As OUTRAS peças do mesmo dia continuam contando, e é o que impede a peça 2 de
 * falar do mesmo assunto que a peça 1 acabou de publicar.
 *
 * @param {number} slot  qual peça do dia está sendo gerada
 */
export function chavesRecentes(historico, iso, slot = 1) {
  const fim = meioDiaUTC(iso).getTime()
  const inicio = fim - JANELA_SEM_REPETIR * 86_400_000
  const propria = entradaDoDia(iso, slot)

  const usadas = new Set()
  for (const [entrada, chave] of Object.entries(historico)) {
    if (entrada === propria) continue
    const t = meioDiaUTC(entrada).getTime()
    if (t >= inicio && t <= fim) usadas.add(chave)
  }
  return usadas
}
