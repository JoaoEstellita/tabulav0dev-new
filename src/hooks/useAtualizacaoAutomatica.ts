import { useEffect, useRef } from 'react'
import { AppState, type AppStateStatus } from 'react-native'
import * as Updates from 'expo-updates'

/**
 * Aplica a atualização sozinho, sem exigir que a pessoa feche e abra duas vezes.
 *
 * O comportamento padrão do expo-updates (`fallbackToCacheTimeout: 0`) baixa em
 * segundo plano e só aplica na abertura SEGUINTE. Na prática: a pessoa abre,
 * nada mudou; fecha, abre de novo, aí sim. Quem não sabe disso conclui que a
 * correção não funcionou — foi exatamente o que aconteceu na caça ao bug do
 * Mapa, em que um fix publicado parecia não ter efeito.
 *
 * Aqui a verificação acontece quando o app VOLTA do segundo plano, e o reload
 * também. O momento importa: recarregar no meio do uso jogaria a pessoa fora da
 * tela em que está, possivelmente perdendo o que digitava. Quem acabou de voltar
 * para o app não está no meio de nada, então o reload passa despercebido.
 *
 * Tudo best-effort e silencioso: rede ruim, servidor fora, modo de
 * desenvolvimento — em qualquer falha o app segue com o que já tem.
 */

// Tempo mínimo entre verificações. Sem isso, alternar rápido entre apps
// dispararia uma consulta de rede a cada volta.
const INTERVALO_MIN_MS = 60_000

export function useAtualizacaoAutomatica() {
  const ultimaChecagem = useRef(0)
  const ocupado = useRef(false)

  useEffect(() => {
    // `isEnabled` é false em desenvolvimento e quando o módulo não está ativo.
    // Sem esta guarda o hook tentaria recarregar o bundle do Metro.
    if (!Updates.isEnabled) return

    const verificar = async () => {
      if (ocupado.current) return
      if (Date.now() - ultimaChecagem.current < INTERVALO_MIN_MS) return
      ocupado.current = true
      ultimaChecagem.current = Date.now()
      try {
        const { isAvailable } = await Updates.checkForUpdateAsync()
        if (!isAvailable) return
        await Updates.fetchUpdateAsync()
        // Só recarrega depois de BAIXAR: se a rede cair no meio do download,
        // reiniciar traria o bundle antigo de volta e a pessoa veria o app
        // "piscar" sem motivo nenhum.
        await Updates.reloadAsync()
      } catch {
        /* sem rede, sem servidor, sem update: segue com o bundle atual */
      } finally {
        ocupado.current = false
      }
    }

    const aoMudarEstado = (estado: AppStateStatus) => {
      if (estado === 'active') verificar()
    }

    const sub = AppState.addEventListener('change', aoMudarEstado)
    return () => sub.remove()
  }, [])
}
