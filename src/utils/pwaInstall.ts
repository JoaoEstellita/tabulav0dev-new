type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
}

export type PwaInstallState = {
  canInstall: boolean
  isInstalled: boolean
  isIos: boolean
  isMobile: boolean
  deferredPrompt: BeforeInstallPromptEvent | null
}

const listeners = new Set<(state: PwaInstallState) => void>()
let initialized = false

const state: PwaInstallState = {
  canInstall: false,
  isInstalled: false,
  isIos: false,
  isMobile: false,
  deferredPrompt: null,
}

const emit = () => {
  listeners.forEach((cb) => cb({ ...state }))
}

const computeStandalone = () => {
  if (typeof window === 'undefined') return false
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true
  )
}

const init = () => {
  if (initialized || typeof window === 'undefined') return
  initialized = true

  const ua = window.navigator.userAgent || ''
  state.isIos = /iphone|ipad|ipod/i.test(ua) && !(window as any).MSStream
  state.isMobile = /android|iphone|ipad|ipod/i.test(ua)
  state.isInstalled = computeStandalone()
  state.canInstall = false
  state.deferredPrompt = null
  emit()

  import('../services/analytics/PwaInstallTracker')
    .then(({ initPwaInstallTracking, trackPwaInstalled }) => {
      initPwaInstallTracking()
      if (state.isInstalled) {
        trackPwaInstalled('standalone-detected')
      }
    })
    .catch(() => {})

  const onBeforeInstallPrompt = (e: Event) => {
    e.preventDefault()
    state.deferredPrompt = e as BeforeInstallPromptEvent
    state.canInstall = true
    emit()
  }

  // O browser dispara `beforeinstallprompt` UMA vez, antes do React montar.
  // O index.html captura cedo e publica em window.__deferredPwaPrompt — sem
  // adotar aqui, o app nunca teria o prompt e o botão não faria nada.
  const adoptEarlyPrompt = () => {
    const early = (window as any).__deferredPwaPrompt
    if (early && !state.deferredPrompt && !state.isInstalled) {
      state.deferredPrompt = early as BeforeInstallPromptEvent
      state.canInstall = true
      emit()
    }
  }
  adoptEarlyPrompt()
  window.addEventListener('pwa-prompt-ready', adoptEarlyPrompt)

  const onAppInstalled = () => {
    state.deferredPrompt = null
    state.canInstall = false
    state.isInstalled = true
    emit()
    import('../services/analytics/PwaInstallTracker')
      .then(({ trackPwaInstalled }) => trackPwaInstalled('appinstalled'))
      .catch(() => {})
  }

  window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt)
  window.addEventListener('appinstalled', onAppInstalled)

  const mediaQuery = window.matchMedia('(display-mode: standalone)')
  const onDisplayModeChange = () => {
    const standalone = computeStandalone()
    if (standalone !== state.isInstalled) {
      state.isInstalled = standalone
      if (standalone) {
        state.deferredPrompt = null
        state.canInstall = false
      }
      emit()
    }
  }

  if (typeof mediaQuery.addEventListener === 'function') {
    mediaQuery.addEventListener('change', onDisplayModeChange)
  } else if (typeof (mediaQuery as any).addListener === 'function') {
    ;(mediaQuery as any).addListener(onDisplayModeChange)
  }
}

export const subscribePwaInstall = (cb: (state: PwaInstallState) => void) => {
  init()
  listeners.add(cb)
  cb({ ...state })
  return () => {
    listeners.delete(cb)
  }
}

export const getPwaState = () => ({ ...state })

export const promptInstall = async () => {
  if (!state.deferredPrompt) return null
  const promptEvent = state.deferredPrompt
  try {
    await promptEvent.prompt()
  } catch {
    // prompt() só pode ser chamado uma vez por evento; se já foi consumido,
    // limpa o estado para o botão não continuar prometendo o que não entrega.
    state.deferredPrompt = null
    state.canInstall = false
    if (typeof window !== 'undefined') delete (window as any).__deferredPwaPrompt
    emit()
    return null
  }
  const choice = await promptEvent.userChoice
  state.deferredPrompt = null
  state.canInstall = false
  if (typeof window !== 'undefined') delete (window as any).__deferredPwaPrompt
  emit()
  return choice
}

export const getPwaDebug = async () => {
  if (typeof window === 'undefined') {
    return {
      userAgent: '',
      isIOS: false,
      isStandalone: false,
      hasDeferredPrompt: false,
      hasServiceWorkerRegistration: false,
      manifestLinkFound: false,
      origin: '',
      isHttps: false,
    }
  }

  const regs = await window.navigator.serviceWorker?.getRegistrations?.()

  return {
    userAgent: window.navigator.userAgent || '',
    isIOS: state.isIos,
    isMobile: state.isMobile,
    isStandalone: computeStandalone(),
    hasDeferredPrompt: !!state.deferredPrompt,
    hasServiceWorkerRegistration: !!(regs && regs.length),
    manifestLinkFound: !!document.querySelector('link[rel="manifest"]'),
    origin: window.location.origin,
    isHttps: window.location.protocol === 'https:' || window.location.hostname === 'localhost',
  }
}
