import { Platform } from 'react-native'
import * as Linking from 'expo-linking'
import { tentarAbrirNoApp } from './abrirNoApp'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { backendFetch } from './backend/client'

/**
 * Fase 2 do onboarding pelo WhatsApp.
 *
 * A pessoa preenche nome/data/hora/local conversando com o agente e recebe
 * https://www.tabulaestelar.com.br/vincular?t=<token>. Ao abrir o app e logar
 * com o Google, capturamos o token e o backend funde o perfil pendente na conta
 * — pulando o onboarding in-app.
 */
const CLAIM_TOKEN_KEY = 'wa_claim_token'

/** Extrai o `?t=` de uma URL qualquer, sem depender de `window`. */
function tokenDaUrl(url: string | null): string | null {
  if (!url) return null
  const m = String(url).match(/[?&]t=([^&#\s]+)/)
  return m ? decodeURIComponent(m[1]) : null
}

/**
 * Captura o `?t=` do link de vínculo e guarda, para sobreviver ao login.
 *
 * Funciona nos DOIS mundos:
 *  - web/PWA: lê da barra de endereço e limpa o parâmetro depois (o token é de
 *    uso único e não deve ficar copiável no histórico);
 *  - app nativo: lê do deep link, tanto o que ABRIU o app (`getInitialURL`)
 *    quanto um que chegue com ele já aberto (listener).
 *
 * O nativo estava de fora: `captureClaimTokenFromUrl` retornava cedo quando não
 * era web, então quem já tinha o app instalado e tocava no link do WhatsApp caía
 * no navegador — e, se abrisse no app, o token simplesmente se perdia.
 */
export async function captureClaimTokenFromUrl(): Promise<void> {
  if (Platform.OS === 'web') {
    if (typeof window === 'undefined') return
    try {
      const params = new URLSearchParams(window.location.search)
      const token = params.get('t')
      if (!token) return
      await AsyncStorage.setItem(CLAIM_TOKEN_KEY, token)
      // Quem já tem o app instalado deve terminar o vínculo NELE, não no PWA —
      // o link é um endereço do site, então sem isto o celular abre o navegador.
      // Falha em silêncio quando o app não existe.
      tentarAbrirNoApp(`vincular?t=${encodeURIComponent(token)}`).catch(() => {})
      // Remove só o parâmetro `t`, preservando o resto da rota.
      params.delete('t')
      const qs = params.toString()
      const url = window.location.pathname + (qs ? `?${qs}` : '') + window.location.hash
      window.history.replaceState({}, '', url)
    } catch {
      /* captura é best-effort */
    }
    return
  }

  try {
    const inicial = tokenDaUrl(await Linking.getInitialURL())
    if (inicial) await AsyncStorage.setItem(CLAIM_TOKEN_KEY, inicial)
  } catch {
    /* idem */
  }
}

/**
 * Escuta links que chegam com o app JÁ aberto (o `getInitialURL` só pega o que
 * abriu). Devolve a função de limpeza. Sem isto, tocar no link do WhatsApp com o
 * app em segundo plano traz a pessoa para a tela, mas sem o token.
 */
export function ouvirLinkDeVinculo(): () => void {
  if (Platform.OS === 'web') return () => {}
  try {
    const sub = Linking.addEventListener('url', ({ url }) => {
      const token = tokenDaUrl(url)
      if (token) AsyncStorage.setItem(CLAIM_TOKEN_KEY, token).catch(() => {})
    })
    return () => { try { sub.remove() } catch { /* noop */ } }
  } catch {
    return () => {}
  }
}

/**
 * Consome o token guardado: chama o backend para fundir o perfil pendente na
 * conta logada. Requer usuário autenticado (o backendFetch anexa o ID token).
 * @returns true se o merge aconteceu (perfil ficou pronto).
 */
export async function consumePendingClaim(): Promise<boolean> {
  let token: string | null = null
  try { token = await AsyncStorage.getItem(CLAIM_TOKEN_KEY) } catch { token = null }
  if (!token) return false
  try {
    const resp = await backendFetch('/api/claim-wa-onboarding', {
      method: 'POST',
      auth: true,
      timeoutMs: 15000,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'claim_token', token }),
    })
    if (resp.ok) {
      await AsyncStorage.removeItem(CLAIM_TOKEN_KEY)
      return true
    }
    // Token morto (inválido/expirado/já usado): descarta para não repetir.
    if ([404, 409, 410].includes(resp.status)) {
      await AsyncStorage.removeItem(CLAIM_TOKEN_KEY)
    }
    return false
  } catch {
    // Erro de rede/servidor: mantém o token para tentar de novo depois.
    return false
  }
}

export async function hasPendingClaim(): Promise<boolean> {
  try { return !!(await AsyncStorage.getItem(CLAIM_TOKEN_KEY)) } catch { return false }
}
