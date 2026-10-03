import { Platform } from 'react-native'

/**
 * Entrega o link de vínculo ao app nativo quando ele já está instalado.
 *
 * O link do WhatsApp (`/vincular?t=…`) é um endereço do site, então no celular
 * ele abre o navegador — mesmo para quem já tem o app. A pessoa acaba logando
 * no PWA em vez do app que instalou.
 *
 * Os App Links resolveriam isso, mas a lista de caminhos verificados do Android
 * não inclui `/vincular`, e mexer nela exige build novo. O scheme próprio
 * (`tabulaestelar://`) já existe e funciona sem build.
 *
 * Como funciona: tenta navegar para o scheme. Se o app existe, o sistema troca
 * de aplicativo e a página fica em segundo plano — `visibilitychange` ou o
 * `pagehide` disparam, e cancelamos o resto. Se não existe, nada acontece e a
 * pessoa segue no PWA sem perceber a tentativa.
 *
 * Só no celular: no desktop a tentativa abriria um diálogo inútil de "abrir com".
 */

const ESPERA_MS = 1200

export function pareceCelular(): boolean {
  if (Platform.OS !== 'web' || typeof navigator === 'undefined') return false
  return /android|iphone|ipad|ipod/i.test(navigator.userAgent || '')
}

/**
 * @returns true se o app assumiu (a página foi para segundo plano).
 */
export function tentarAbrirNoApp(caminhoComQuery: string): Promise<boolean> {
  if (Platform.OS !== 'web' || typeof window === 'undefined' || !pareceCelular()) {
    return Promise.resolve(false)
  }

  return new Promise((resolve) => {
    let resolvido = false
    const concluir = (abriu: boolean) => {
      if (resolvido) return
      resolvido = true
      limpar()
      resolve(abriu)
    }

    const aoEsconder = () => { if (document.visibilityState === 'hidden') concluir(true) }
    const limpar = () => {
      document.removeEventListener('visibilitychange', aoEsconder)
      window.removeEventListener('pagehide', aoSair)
      clearTimeout(timer)
    }
    const aoSair = () => concluir(true)

    document.addEventListener('visibilitychange', aoEsconder)
    window.addEventListener('pagehide', aoSair)
    const timer = setTimeout(() => concluir(false), ESPERA_MS)

    try {
      // `location.href` em vez de iframe: iframe é bloqueado por navegadores
      // modernos para schemes próprios, e o href falha em silêncio quando o
      // app não existe — que é exatamente o comportamento desejado aqui.
      window.location.href = `tabulaestelar://${caminhoComQuery.replace(/^\/+/, '')}`
    } catch {
      concluir(false)
    }
  })
}
