import { Platform } from 'react-native'
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

/**
 * Captura o `?t=` da URL (PWA) e guarda, para sobreviver ao redirect do Google.
 * Limpa o token da barra de endereço depois (não deve ser reutilizado/copiado).
 */
export async function captureClaimTokenFromUrl(): Promise<void> {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return
  try {
    const params = new URLSearchParams(window.location.search)
    const token = params.get('t')
    if (!token) return
    await AsyncStorage.setItem(CLAIM_TOKEN_KEY, token)
    // Remove só o parâmetro `t`, preservando o resto da rota.
    params.delete('t')
    const qs = params.toString()
    const url = window.location.pathname + (qs ? `?${qs}` : '') + window.location.hash
    window.history.replaceState({}, '', url)
  } catch {
    /* captura é best-effort */
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
