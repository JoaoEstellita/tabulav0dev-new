type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
}

export type PwaInstallState = {
  canInstall: boolean
  isInstalled: boolean
  isIos: boolean
  deferredPrompt: BeforeInstallPromptEvent | null
}

const listeners = new Set<(state: PwaInstallState) => void>()
let initialized = false

const state: PwaInstallState = {
  canInstall: false,
  isInstalled: false,
  isIos: false,
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
  state.isInstalled = computeStandalone()
  state.canInstall = false
  state.deferredPrompt = null
  emit()

  const onBeforeInstallPrompt = (e: Event) => {
    e.preventDefault()
    state.deferredPrompt = e as BeforeInstallPromptEvent
    state.canInstall = true
    emit()
  }

  const onAppInstalled = () => {
    state.deferredPrompt = null
    state.canInstall = false
    state.isInstalled = true
    emit()
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
  return () => listeners.delete(cb)
}

export const getPwaState = () => ({ ...state })

export const promptInstall = async () => {
  if (!state.deferredPrompt) return null
  const promptEvent = state.deferredPrompt
  await promptEvent.prompt()
  const choice = await promptEvent.userChoice
  state.deferredPrompt = null
  state.canInstall = false
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
    isStandalone: computeStandalone(),
    hasDeferredPrompt: !!state.deferredPrompt,
    hasServiceWorkerRegistration: !!(regs && regs.length),
    manifestLinkFound: !!document.querySelector('link[rel="manifest"]'),
    origin: window.location.origin,
    isHttps: window.location.protocol === 'https:' || window.location.hostname === 'localhost',
  }
}
