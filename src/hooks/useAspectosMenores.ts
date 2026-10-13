import { useCallback, useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

/**
 * Mostrar ou esconder os ASPECTOS MENORES na aba Mapa.
 *
 * Um mapa completo lista todos os aspectos de cada planeta, e os menores
 * (quincúncio, semiquadratura, sesquiquadratura, semissextil) costumam ser
 * maioria. Eles são reais e agora têm interpretação — mas num planeta com oito
 * aspectos, os três que de fato pesam ficam enterrados no meio dos outros.
 *
 * Padrão é MOSTRAR: é o comportamento que já existia, e esconder conteúdo por
 * decisão nossa sem a pessoa pedir é pior do que mostrar demais. Quem quiser a
 * leitura enxuta desliga em um toque, e a escolha fica guardada.
 *
 * Guardado só no aparelho (AsyncStorage): é preferência de leitura, não dado de
 * conta — não justifica uma escrita no Firestore a cada toque.
 */

const CHAVE = '@tabula_estelar:aspectos_menores'

// Estado compartilhado em memória: o hook é consumido pela tela e pelos modais
// ao mesmo tempo, e todos precisam reagir juntos sem cada um reler o disco.
let mostrarAtual = true
let carregado = false
const ouvintes = new Set<(v: boolean) => void>()

function publicar(novo: boolean) {
  mostrarAtual = novo
  ouvintes.forEach((fn) => fn(novo))
}

export function useAspectosMenores() {
  const [mostrar, setMostrar] = useState<boolean>(mostrarAtual)

  useEffect(() => {
    ouvintes.add(setMostrar)
    if (!carregado) {
      AsyncStorage.getItem(CHAVE)
        .then((v) => {
          // Só '0' esconde. Qualquer outra coisa (inclusive null) mantém o padrão:
          // nunca sumir com conteúdo por causa de leitura estranha do disco.
          if (v === '0') publicar(false)
          carregado = true
        })
        .catch(() => { carregado = true })
    }
    return () => { ouvintes.delete(setMostrar) }
  }, [])

  const alternar = useCallback(() => {
    const novo = !mostrarAtual
    publicar(novo)
    AsyncStorage.setItem(CHAVE, novo ? '1' : '0').catch(() => {})
  }, [])

  return { mostrarMenores: mostrar, alternar }
}
