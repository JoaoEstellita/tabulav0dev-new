import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { resolve } from 'path'

/**
 * A atualização precisa chegar sem exigir duas aberturas.
 *
 * O padrão do expo-updates baixa em segundo plano e só aplica na abertura
 * SEGUINTE. Na prática a pessoa abre, nada mudou, e conclui que a correção não
 * funcionou — foi o que aconteceu na caça ao bug do Mapa, com um fix publicado
 * que parecia não ter efeito.
 *
 * O hook depende de AppState e do módulo nativo de updates, então a guarda é
 * estática e cobre as decisões que não podem regredir.
 */

const FONTE = readFileSync(resolve(__dirname, '../useAtualizacaoAutomatica.ts'), 'utf8')
const APP = readFileSync(resolve(__dirname, '../../../App.tsx'), 'utf8')

describe('atualização automática', () => {
  it('está ligada na raiz do app', () => {
    // Hook sem call site não faz nada — já aconteceu nesta mesma sessão.
    expect(/useAtualizacaoAutomatica\(\)/.test(APP)).toBe(true)
    expect(/import \{ useAtualizacaoAutomatica \}/.test(APP)).toBe(true)
  })

  it('verifica ao voltar do segundo plano, não no meio do uso', () => {
    // Recarregar enquanto a pessoa usa o app a jogaria para fora da tela atual.
    expect(/AppState\.addEventListener\('change'/.test(FONTE)).toBe(true)
    expect(/estado === 'active'/.test(FONTE)).toBe(true)
  })

  it('só recarrega depois de baixar', () => {
    // Reiniciar com o download incompleto traria o bundle antigo de volta e o
    // app "piscaria" sem motivo.
    const posFetch = FONTE.indexOf('fetchUpdateAsync')
    const posReload = FONTE.indexOf('reloadAsync')
    expect(posFetch).toBeGreaterThan(-1)
    expect(posReload).toBeGreaterThan(posFetch)
  })

  it('não roda em desenvolvimento', () => {
    // Sem a guarda, tentaria recarregar o bundle do Metro.
    expect(/if \(!Updates\.isEnabled\) return/.test(FONTE)).toBe(true)
  })

  it('não consulta a rede a cada alternância de app', () => {
    expect(/INTERVALO_MIN_MS/.test(FONTE)).toBe(true)
    expect(/ocupado/.test(FONTE), 'duas verificações simultâneas desperdiçam rede').toBe(true)
  })

  it('falha em silêncio', () => {
    // Rede ruim ou servidor fora não pode quebrar a abertura do app.
    expect(/catch \{/.test(FONTE)).toBe(true)
  })

  it('remove o listener ao desmontar', () => {
    expect(/return \(\) => sub\.remove\(\)/.test(FONTE)).toBe(true)
  })
})
