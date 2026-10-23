import { useCallback, useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

/**
 * A GRADE DE ASPECTOS aberta ou recolhida.
 *
 * A grade é uma tabela de até cem símbolos — a parte mais densa do app e a mais
 * hostil para quem não estuda astrologia. Quem lê, lê; quem não lê, rola por
 * cima dela toda vez para chegar no que vem depois.
 *
 * Padrão é ABERTA: é o comportamento que já existia, e esconder conteúdo por
 * decisão nossa sem a pessoa pedir é pior do que mostrar demais. Quem quiser a
 * tela curta recolhe em um toque e a escolha fica guardada.
 *
 * ⚠️ Recolher NÃO desmonta o resto: o cabeçalho com o título continua lá, então
 * a grade some sem deixar um buraco, e o alvo para trazer de volta fica no
 * mesmo lugar de onde ela sumiu.
 *
 * Guardado só no aparelho (AsyncStorage): é preferência de leitura, não dado de
 * conta — não justifica uma escrita no Firestore a cada toque.
 */

const CHAVE = '@tabula_estelar:grade_aberta'

// Estado compartilhado em memória, igual aos outros controles de leitura: a
// tela tem duas grades (trânsito e natal) e as duas têm de reagir juntas.
let abertaAtual = true
let carregado = false
const ouvintes = new Set<(v: boolean) => void>()

function publicar(nova: boolean) {
  abertaAtual = nova
  ouvintes.forEach((fn) => fn(nova))
}

export function useGradeRetraida() {
  const [aberta, setAberta] = useState<boolean>(abertaAtual)

  useEffect(() => {
    ouvintes.add(setAberta)
    if (!carregado) {
      AsyncStorage.getItem(CHAVE)
        .then((v) => {
          carregado = true
          // Só '0' recolhe. Chave ausente ou corrompida mantém o padrão aberto.
          if (v === '0') publicar(false)
        })
        .catch(() => { carregado = true })
    }
    return () => { ouvintes.delete(setAberta) }
  }, [])

  const alternar = useCallback(() => {
    const nova = !abertaAtual
    publicar(nova)
    AsyncStorage.setItem(CHAVE, nova ? '1' : '0').catch(() => {})
  }, [])

  return { aberta, alternar }
}
