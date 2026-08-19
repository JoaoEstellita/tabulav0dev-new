/**
 * Meta Pixel (Facebook Pixel) — rastreio de conversão do funil.
 *
 * SÓ WEB/PWA e SÓ com `EXPO_PUBLIC_META_PIXEL_ID` setado (senão é no-op total —
 * nada carrega). Native não usa (pixel é web). Nunca quebra o app: toda falha é
 * engolida, igual ao `services/eventos`.
 *
 * Ligado ao funil existente via `registrar()` (eventos.ts): cada passo do funil
 * (conta_criada, paywall_visto, assinou…) vira um evento padrão do Meta, além de
 * um evento custom `te_<passo>` para granularidade.
 */
const PIXEL_ID = process.env.EXPO_PUBLIC_META_PIXEL_ID
let inited = false

function isWeb(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined'
}

/** Carrega o fbevents.js e dispara PageView. Idempotente. Chamar 1x no boot web. */
export function initMetaPixel(): void {
  if (inited || !isWeb() || !PIXEL_ID) return
  inited = true
  try {
    const w = window as any
    if (!w.fbq) {
      const n: any = (w.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments)
      })
      if (!w._fbq) w._fbq = n
      n.push = n
      n.loaded = true
      n.version = '2.0'
      n.queue = []
      const t = document.createElement('script')
      t.async = true
      t.src = 'https://connect.facebook.net/en_US/fbevents.js'
      const s = document.getElementsByTagName('script')[0]
      s?.parentNode?.insertBefore(t, s)
    }
    w.fbq('init', PIXEL_ID)
    w.fbq('track', 'PageView')
  } catch {
    /* nunca quebra */
  }
}

/** Dispara um evento. `standard=false` usa trackCustom (eventos próprios). */
export function metaPixelTrack(event: string, params?: Record<string, unknown>, standard = true): void {
  if (!isWeb() || !PIXEL_ID) return
  try {
    const w = window as any
    if (typeof w.fbq !== 'function') return
    w.fbq(standard ? 'track' : 'trackCustom', event, params || {})
  } catch {
    /* silencioso */
  }
}
