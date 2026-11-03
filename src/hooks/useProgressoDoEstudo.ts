import { useCallback, useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { LICOES, porId, type Unidade } from '../data/estudo'

/**
 * ONDE A PESSOA PAROU no Estudo.
 *
 * ⚠️ NO APARELHO, não no Firestore. É preferência de leitura, igual a
 * `useOrdemDaHome` e `useModoLeitura` — não justifica uma escrita de banco a
 * cada lição aberta, e o app já tem esse padrão.
 */
const CHAVE = '@tabula_estelar:progresso_estudo'

export interface Progresso {
  lidos: string[]
  ultimo: string | null
}

/**
 * Valida o que veio do disco.
 *
 * ⚠️ O QUE ESTÁ GRAVADO NÃO É CONFIÁVEL. Uma versão futura pode renomear
 * lições, e a marca antiga ficaria apontando para um id que não existe mais —
 * a trilha mostraria "lido" no card errado, ou quebraria ao abrir. Id órfão é
 * descartado em silêncio: perder uma marca é melhor que mostrar a errada.
 */
export function normalizarProgresso(bruto: unknown): Progresso {
  const obj = (bruto && typeof bruto === 'object' && !Array.isArray(bruto))
    ? bruto as Record<string, unknown>
    : {}
  const crus = Array.isArray(obj.lidos) ? obj.lidos.map(String) : []
  const lidos = [...new Set(crus)].filter((id) => !!porId(id))
  const u = typeof obj.ultimo === 'string' ? obj.ultimo : null
  return { lidos, ultimo: u && porId(u) ? u : null }
}

export function useProgressoDoEstudo() {
  const [progresso, setProgresso] = useState<Progresso>({ lidos: [], ultimo: null })
  const [carregado, setCarregado] = useState(false)

  useEffect(() => {
    let vivo = true
    AsyncStorage.getItem(CHAVE)
      .then((txt) => {
        if (!vivo) return
        let bruto: unknown = null
        // ⚠️ `JSON.parse` de lixo LANÇA. Sem este try, a aba inteira não abre
        // por causa de uma gravação pela metade.
        try { bruto = txt ? JSON.parse(txt) : null } catch { bruto = null }
        setProgresso(normalizarProgresso(bruto))
      })
      .catch(() => { if (vivo) setProgresso({ lidos: [], ultimo: null }) })
      .finally(() => { if (vivo) setCarregado(true) })
    return () => { vivo = false }
  }, [])

  const marcarLido = useCallback((id: string) => {
    setProgresso((p) => {
      if (!porId(id)) return p
      const novo: Progresso = { lidos: [...new Set([...p.lidos, id])], ultimo: id }
      // Gravação best-effort: falhar ao salvar não pode travar a leitura.
      AsyncStorage.setItem(CHAVE, JSON.stringify(novo)).catch(() => {})
      return novo
    })
  }, [])

  /** A primeira lição ainda não lida, em ordem. `null` quando acabou. */
  const proximaLicao = useCallback((): Unidade | null => (
    LICOES.find((l) => !progresso.lidos.includes(l.id)) ?? null
  ), [progresso.lidos])

  return { ...progresso, carregado, marcarLido, proximaLicao }
}
