import { useCallback, useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

/**
 * Modo de leitura: "explicado" (padrão) ou "tecnico".
 *
 * O app nasceu falando a língua de quem já estuda astrologia. Quem chega sem
 * repertório encontra "quadratura", "sextil" e "orbe" sem tradução, e o trial
 * dura 3 dias — tempo curto para decifrar vocabulário antes de ver valor.
 *
 * O modo explicado troca o termo técnico pela palavra comum onde existe troca
 * honesta (ver `simples` no glossário). O técnico devolve a nomenclatura
 * original, que é o que quem estuda espera — e merece.
 *
 * Padrão é "explicado" de propósito: quem conhece os termos acha o botão e
 * troca em dois toques; quem não conhece não sabe nem que existe um botão.
 *
 * Guardado só no aparelho (AsyncStorage): é preferência de leitura, não dado de
 * conta — não justifica uma escrita no Firestore a cada toque.
 */

export type ModoLeitura = 'explicado' | 'tecnico'

const CHAVE = '@tabula_estelar:modo_leitura'

// Estado compartilhado em memória: o hook é consumido por várias telas ao mesmo
// tempo e todas precisam reagir juntas, sem cada uma reler o disco.
let modoAtual: ModoLeitura = 'explicado'
let carregado = false
const ouvintes = new Set<(m: ModoLeitura) => void>()

function publicar(novo: ModoLeitura) {
  modoAtual = novo
  ouvintes.forEach((fn) => fn(novo))
}

export function useModoLeitura() {
  const [modo, setModo] = useState<ModoLeitura>(modoAtual)
  const [pronto, setPronto] = useState(carregado)

  useEffect(() => {
    ouvintes.add(setModo)
    if (!carregado) {
      AsyncStorage.getItem(CHAVE)
        .then((v) => {
          if (v === 'tecnico' || v === 'explicado') publicar(v)
          carregado = true
          setPronto(true)
        })
        .catch(() => {
          // Sem preferência salva seguimos no padrão: nunca travar a leitura.
          carregado = true
          setPronto(true)
        })
    }
    return () => { ouvintes.delete(setModo) }
  }, [])

  const trocar = useCallback((novo: ModoLeitura) => {
    publicar(novo)
    AsyncStorage.setItem(CHAVE, novo).catch(() => {})
  }, [])

  const alternar = useCallback(() => {
    trocar(modoAtual === 'explicado' ? 'tecnico' : 'explicado')
  }, [trocar])

  return { modo, pronto, trocar, alternar, explicado: modo === 'explicado' }
}
