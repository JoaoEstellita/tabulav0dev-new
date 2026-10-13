/**
 * O TIPO e o PADRÃO das preferências de notificação.
 *
 * ⚠️ Vivem FORA do hook de propósito. Enquanto moravam em
 * `hooks/useNotificationPreferences.ts`, nenhum teste conseguia olhar para eles:
 * aquele arquivo importa `firebase` e cadeia acima puxa `react-native`, que o
 * vitest não parseia (Flow). Foi exatamente o que aconteceu com a tabela de
 * símbolos da grade de aspectos, no mesmo dia.
 *
 * ⚠️ GÊMEO de `backend/lib/_lib/notification-prefs.js`. Os dois precisam dizer
 * a mesma coisa, senão a tela mostra um estado e o servidor age por outro — foi
 * assim que a previsão semanal ficou ligada no app e barrada no cron.
 */

export type NotificationPreferences = {
  pushEnabled: boolean
  pushIncludeMemberName: boolean
  astroEventsPersonalEnabled?: boolean
  astroEventsCollectiveEnabled?: boolean
  astroEventsPersonalFilters?: {
    aspects: boolean
    transits: boolean
    combos: boolean
  }
  astroEventsCollectiveFilters?: {
    aspects: boolean
    transits: boolean
    combos: boolean
  }
  groupFilters?: {
    critical: boolean
    positive: boolean
    messages: boolean
  }
  forecastFilters?: {
    weekly: boolean
  }
  quietHours?: {
    enabled: boolean
    start: string
    end: string
  }
  push: {
    frequencyProfile?: 'focus' | 'balanced' | 'quiet'
    types: {
      member_status_critical: boolean
      user_status_critical: boolean
      user_status_critical_recovered?: boolean
      user_status_highlight?: boolean
      member_status_positive?: boolean
      user_status_positive?: boolean
      group_message: boolean
      astro_event_personal?: boolean
      astro_event_collective?: boolean
      weekly_digest?: boolean
      daily_summary?: boolean
    }
    limits?: {
      member_status_critical?: { dailyLimit: number; throttleMinutes: number }
      user_status_critical?: { dailyLimit: number; throttleMinutes: number }
      user_status_critical_recovered?: { dailyLimit: number; throttleMinutes: number }
      member_status_positive?: { dailyLimit: number; throttleMinutes: number }
      user_status_positive?: { dailyLimit: number; throttleMinutes: number }
      user_status_highlight?: { dailyLimit: number; throttleMinutes: number }
      group_message?: { dailyLimit: number; throttleMinutes: number; burstWindowMinutes?: number }
      astro_event_personal?: { dailyLimit: number; throttleMinutes: number }
      astro_event_collective?: { dailyLimit: number; throttleMinutes: number }
      weekly_digest?: { dailyLimit: number; throttleMinutes: number }
      daily_summary?: { dailyLimit: number; throttleMinutes: number }
    }
  }
  inApp: {
    types: {
      member_status_critical: boolean
      user_status_critical: boolean
      user_status_critical_recovered?: boolean
      user_status_highlight?: boolean
      member_status_positive?: boolean
      user_status_positive?: boolean
      group_message: boolean
      astro_event_personal?: boolean
      astro_event_collective?: boolean
      weekly_digest?: boolean
      daily_summary?: boolean
    }
  }
}

export const DEFAULT_PREFERENCES: NotificationPreferences = {
  pushEnabled: true,
  pushIncludeMemberName: true,
  astroEventsPersonalEnabled: false,
  astroEventsCollectiveEnabled: false,
  astroEventsPersonalFilters: {
    aspects: true,
    transits: true,
    combos: true,
  },
  astroEventsCollectiveFilters: {
    aspects: true,
    transits: true,
    combos: true,
  },
  groupFilters: {
    critical: true,
    positive: false,
    messages: true,
  },
  // ⚠️ LIGADO por padrão, e GÊMEO do `notification-prefs.js` do backend — mudar
  // só um faz a tela mostrar desligado enquanto o servidor trata como ligado.
  //
  // Esta funcionalidade tinha TRÊS portas fechadas (`forecastFilters.weekly`,
  // `inApp.types.weekly_digest`, `push.types.weekly_digest`) e os gates do cron
  // são sequenciais, então era preciso passar por todas. Isso não é opt-in: é
  // indistinguível de algo que nunca foi lançado.
  //
  // A prova: a conta do João tinha `forecastFilters.weekly: true` — ele achou o
  // toggle em Configurações e ligou — e mesmo assim não recebia nada, porque
  // `inApp.weekly` seguia false.
  //
  // Agora UM interruptor decide: este.
  forecastFilters: {
    weekly: true,
  },
  quietHours: {
    enabled: false,
    start: '22:00',
    end: '08:00',
  },
  push: {
    frequencyProfile: 'balanced',
    types: {
      member_status_critical: true,
      user_status_critical: true,
      user_status_critical_recovered: false,
      user_status_highlight: false,
      member_status_positive: false,
      user_status_positive: false,
      group_message: true,
      astro_event_personal: false,
      astro_event_collective: false,
      weekly_digest: false,
      daily_summary: false,
    },
    limits: {
      member_status_critical: { dailyLimit: 0, throttleMinutes: 60 },
      user_status_critical: { dailyLimit: 0, throttleMinutes: 60 },
      user_status_critical_recovered: { dailyLimit: 2, throttleMinutes: 120 },
      user_status_highlight: { dailyLimit: 1, throttleMinutes: 240 },
      member_status_positive: { dailyLimit: 2, throttleMinutes: 120 },
      user_status_positive: { dailyLimit: 2, throttleMinutes: 120 },
      group_message: { dailyLimit: 20, throttleMinutes: 1, burstWindowMinutes: 1 },
      astro_event_personal: { dailyLimit: 3, throttleMinutes: 180 },
      astro_event_collective: { dailyLimit: 2, throttleMinutes: 240 },
      weekly_digest: { dailyLimit: 1, throttleMinutes: 1440 },
      daily_summary: { dailyLimit: 1, throttleMinutes: 720 },
    },
  },
  inApp: {
    types: {
      member_status_critical: true,
      user_status_critical: true,
      user_status_critical_recovered: false,
      user_status_highlight: false,
      member_status_positive: false,
      user_status_positive: false,
      group_message: true,
      astro_event_personal: false,
      astro_event_collective: false,
      // Segue `forecastFilters.weekly`. In-app é PASSIVO — um card no inbox,
      // visto quando a pessoa abre o app. O push continua false: digest semanal
      // que vibra o celular é o tipo de notificação que faz gente desligar todas.
      weekly_digest: true,
      daily_summary: false,
    },
  },
}

