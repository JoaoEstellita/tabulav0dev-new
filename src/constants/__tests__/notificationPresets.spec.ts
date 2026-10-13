import { describe, it, expect } from 'vitest'
import { PRESETS, RITMO_DO_PERFIL, perfilDoRitmo } from '../notificationPresets'
import { DEFAULT_PREFERENCES } from '../../constants/notificationDefaults'

/**
 * ⚠️ "Equilibrado" dizia ser o estado inicial do app e não era.
 *
 * O padrão trazia `push.types.weekly_digest: false`; o perfil ligava. Escolher
 * "Equilibrado" dava um resultado diferente de nunca ter tocado em nada, com o
 * mesmo nome na tela. E os três perfis eram escritos à mão, cada chave repetida
 * três vezes — então qualquer mudança no padrão precisava ser lembrada em mais
 * três lugares, e não foi.
 */
describe('perfis de notificação', () => {
  it('EQUILIBRADO é, campo a campo, o estado inicial do app', () => {
    const p = PRESETS.equilibrado()
    expect(p.pushEnabled).toBe(DEFAULT_PREFERENCES.pushEnabled)
    expect(p.astroEventsPersonalEnabled).toBe(DEFAULT_PREFERENCES.astroEventsPersonalEnabled)
    expect(p.astroEventsCollectiveEnabled).toBe(DEFAULT_PREFERENCES.astroEventsCollectiveEnabled)
    expect(p.groupFilters).toEqual(DEFAULT_PREFERENCES.groupFilters)
    expect(p.forecastFilters).toEqual(DEFAULT_PREFERENCES.forecastFilters)
    expect(p.push?.types).toEqual(DEFAULT_PREFERENCES.push.types)
    expect(p.inApp?.types).toEqual(DEFAULT_PREFERENCES.inApp.types)
    expect(p.push?.frequencyProfile).toBe(DEFAULT_PREFERENCES.push.frequencyProfile)
  })

  // Derivar do padrão não pode significar compartilhar a referência: a tela
  // manda o patch para o servidor, e mutar um objeto no caminho corromperia o
  // padrão do app inteiro em memória.
  it('o perfil devolve CÓPIA, não o próprio objeto do padrão', () => {
    const p = PRESETS.equilibrado()
    expect(p.push?.types).not.toBe(DEFAULT_PREFERENCES.push.types)
    expect(p.groupFilters).not.toBe(DEFAULT_PREFERENCES.groupFilters)
    // `group_message` é true no padrão — mutar uma chave que já fosse false
    // não provaria nada, e foi o que a primeira versão deste teste fez.
    ;(p.push!.types as Record<string, boolean>).group_message = false
    expect(DEFAULT_PREFERENCES.push.types.group_message).toBe(true)
  })

  // ⚠️ Foi este teste que pegou a incoerência: o "Essencial" antigo ligava
  // `user_status_positive` e `astro_event_personal`, que o padrão tem apagados,
  // e entregava 5 tipos de push contra 3 do equilibrado. O perfil que promete o
  // mínimo mandava mais.
  it('ESSENCIAL entrega menos push que EQUILIBRADO, nunca mais', () => {
    const ess = PRESETS.essencial()
    const eq = PRESETS.equilibrado()
    const ligados = (t?: Record<string, boolean | undefined>) =>
      Object.values(t || {}).filter((v) => v !== false).length
    expect(ligados(ess.push?.types)).toBeLessThan(ligados(eq.push?.types))
    // Nenhum tipo pode estar LIGADO no essencial e apagado no equilibrado.
    for (const [tipo, valor] of Object.entries(ess.push?.types || {})) {
      if (valor !== false) {
        expect((eq.push?.types as any)?.[tipo], `${tipo} liga no essencial e nao no equilibrado`).not.toBe(false)
      }
    }
  })

  // ⚠️ O inbox nunca é podado: ele não interrompe ninguém, e reduzir o que chega
  // ao celular não deveria apagar o histórico de quem abre o app depois.
  it('nenhum perfil mexe no inbox, exceto o equilibrado que o restaura', () => {
    expect(PRESETS.essencial().inApp).toBeUndefined()
    expect(PRESETS.silencioso().inApp).toBeUndefined()
    expect(PRESETS.equilibrado().inApp?.types).toEqual(DEFAULT_PREFERENCES.inApp.types)
  })

  // ⚠️ Silenciar o CELULAR não é apagar o histórico: o in-app não interrompe
  // ninguém e continua ligado, para quem abre o app depois ver o que perdeu.
  it('SILENCIOSO desliga o push e NÃO mexe no inbox', () => {
    const s = PRESETS.silencioso()
    expect(s.pushEnabled).toBe(false)
    expect(Object.values(s.push?.types || {}).every((v) => v === false)).toBe(true)
    expect(s.inApp).toBeUndefined()
  })

  // O ritmo é o que diz qual perfil está marcado na tela. Se dois perfis
  // caíssem no mesmo ritmo, o destaque apontaria para o botão errado.
  it('cada perfil tem um ritmo próprio, e dá para voltar dele', () => {
    const ritmos = Object.values(RITMO_DO_PERFIL)
    expect(new Set(ritmos).size).toBe(ritmos.length)
    for (const [perfil, ritmo] of Object.entries(RITMO_DO_PERFIL)) {
      expect(perfilDoRitmo(ritmo), ritmo).toBe(perfil)
      expect(PRESETS[perfil as keyof typeof PRESETS]().push?.frequencyProfile, perfil).toBe(ritmo)
    }
    // Sem valor salvo, a tela precisa marcar algo — e o algo é o padrão.
    expect(perfilDoRitmo(null)).toBe('equilibrado')
    expect(perfilDoRitmo('valor_estranho')).toBe('equilibrado')
  })
})
