import { DEFAULT_PREFERENCES, type NotificationPreferences } from './notificationDefaults'

/**
 * Os três perfis de notificação da tela de Configurações.
 *
 * ⚠️ Por que num arquivo só: os perfis viviam escritos à mão dentro da tela,
 * com cada chave repetida três vezes, e um deles — "Equilibrado" — dizia ser o
 * mesmo que o estado inicial do app sem ser. O padrão tinha
 * `push.weekly_digest: false` e o perfil ligava. Então escolher "Equilibrado"
 * dava um resultado diferente de nunca ter tocado em nada, embora os dois se
 * chamassem a mesma coisa.
 *
 * Agora EQUILIBRADO É O PADRÃO, literalmente: ele deriva de
 * `DEFAULT_PREFERENCES`. Os dois não têm como divergir de novo porque são o
 * mesmo objeto. Os outros dois perfis são descritos como DIFERENÇA em relação a
 * ele, que é como a pessoa pensa ("quero menos que o normal").
 */
export type PerfilDeNotificacao = 'essencial' | 'equilibrado' | 'silencioso'

/**
 * O ritmo do push, consumido pelo backend em `getPushLimitsForType` e
 * `resolveFrequencyMinInterval`: `focus` espaça 5 min, `balanced` 15, `quiet`
 * 45, e multiplica o throttle por 0,7 / 1 / 2.
 *
 * Serve também para saber qual perfil está ativo — é 1 para 1 com eles.
 */
export const RITMO_DO_PERFIL: Record<PerfilDeNotificacao, 'focus' | 'balanced' | 'quiet'> = {
  essencial: 'focus',
  equilibrado: 'balanced',
  silencioso: 'quiet',
}

export function perfilDoRitmo(ritmo?: string | null): PerfilDeNotificacao {
  if (ritmo === 'focus') return 'essencial'
  if (ritmo === 'quiet') return 'silencioso'
  return 'equilibrado'
}

type Patch = Partial<NotificationPreferences>

/**
 * Copia rasa de um campo do padrao, exigindo que ele exista.
 *
 * ⚠️ Os campos sao opcionais na interface, entao espalhar `DEFAULT_PREFERENCES.x`
 * direto produz um objeto todo opcional e o TypeScript recusa. Silenciar com `!`
 * resolveria o compilador e esconderia o caso real: se alguem remover um campo
 * do padrao, os perfis passariam a gravar `undefined` e o merge do servidor
 * devolveria o padrao de volta — a pessoa tocaria no botao e nada mudaria, sem
 * erro nenhum. Aqui isso estoura na hora.
 */
const doPadrao = <T,>(valor: T | undefined, campo: string): T => {
  if (valor === undefined || valor === null) {
    throw new Error(`notificationPresets: DEFAULT_PREFERENCES.${campo} nao existe`)
  }
  return (typeof valor === 'object' ? { ...(valor as object) } : valor) as T
}

const tipos = <T extends Record<string, boolean | undefined>>(base: T, mudancas: Partial<T>): T =>
  ({ ...base, ...mudancas })

/**
 * UM EIXO SÓ: quanto disso chega ao CELULAR.
 *
 * ⚠️ Os três perfis mexiam em coisas diferentes e se contradiziam. O antigo
 * "Essencial" ligava `user_status_positive` e `astro_event_personal` — que o
 * padrão tem APAGADOS — então o perfil que promete o mínimo entregava mais push
 * que o equilibrado. O teste pegou: 5 tipos contra 3.
 *
 * Agora os três são o mesmo eixo, e só o push varia:
 *
 *   Essencial   só o crítico vibra
 *   Equilibrado o padrão
 *   Silencioso  nada vibra
 *
 * ⚠️ O INBOX NUNCA É PODADO, em nenhum perfil. Ele não interrompe ninguém — é
 * um card que espera no app. Reduzir o que chega ao celular não deveria apagar
 * o histórico de quem depois abre o app para ver o que perdeu. Isso também
 * torna os perfis explicáveis numa frase, que é o que faltava.
 */

/** ESSENCIAL: no celular, só o que não dá para perder. */
const ESSENCIAL = (): Patch => ({
  pushEnabled: true,
  push: {
    ...DEFAULT_PREFERENCES.push,
    // `focus` espaça 5 min em vez de 15: são poucos avisos, e segurar um alerta
    // crítico por 45 minutos não serviria para nada.
    frequencyProfile: 'focus',
    types: tipos(DEFAULT_PREFERENCES.push.types, {
      user_status_critical: true,
      member_status_critical: true,
      user_status_critical_recovered: false,
      user_status_highlight: false,
      member_status_positive: false,
      user_status_positive: false,
      // ⚠️ Mensagem de grupo SAI aqui. O padrão já é enxuto — liga só três
      // tipos — e repetir os três faria do "Essencial" um clone do
      // "Equilibrado" com outro nome. Conversa de grupo é a mais tagarela das
      // três; crítico é o que ninguém pode perder. Essencial = só o crítico.
      group_message: false,
      astro_event_personal: false,
      astro_event_collective: false,
      weekly_digest: false,
      daily_summary: false,
    }),
  },
})

/**
 * EQUILIBRADO: exatamente o estado inicial do app.
 *
 * Nada escrito à mão aqui de propósito — qualquer item solto voltaria a criar a
 * divergência que este arquivo existe para impedir.
 */
const EQUILIBRADO = (): Patch => ({
  pushEnabled: DEFAULT_PREFERENCES.pushEnabled,
  astroEventsPersonalEnabled: DEFAULT_PREFERENCES.astroEventsPersonalEnabled,
  astroEventsCollectiveEnabled: DEFAULT_PREFERENCES.astroEventsCollectiveEnabled,
  groupFilters: doPadrao(DEFAULT_PREFERENCES.groupFilters, 'groupFilters'),
  forecastFilters: doPadrao(DEFAULT_PREFERENCES.forecastFilters, 'forecastFilters'),
  push: { ...DEFAULT_PREFERENCES.push, types: doPadrao(DEFAULT_PREFERENCES.push.types, 'push.types') },
  inApp: { ...DEFAULT_PREFERENCES.inApp, types: doPadrao(DEFAULT_PREFERENCES.inApp.types, 'inApp.types') },
})

/** SILENCIOSO: nada vibra. O inbox segue completo. */
const SILENCIOSO = (): Patch => ({
  pushEnabled: false,
  push: {
    ...DEFAULT_PREFERENCES.push,
    frequencyProfile: 'quiet',
    types: Object.keys(DEFAULT_PREFERENCES.push.types).reduce(
      (acc, chave) => ({ ...acc, [chave]: false }),
      {} as NotificationPreferences['push']['types'],
    ),
  },
})

export const PRESETS: Record<PerfilDeNotificacao, () => Patch> = {
  essencial: ESSENCIAL,
  equilibrado: EQUILIBRADO,
  silencioso: SILENCIOSO,
}
