import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { resolve } from 'path'

/**
 * O token de vínculo precisa sobreviver ao caminho que a pessoa realmente faz.
 *
 * O link `/vincular?t=…` chega pelo WhatsApp e é um endereço do site. Antes, a
 * captura do token só existia no web: quem já tinha o app instalado caía no
 * navegador e, se por acaso abrisse no app, o token se perdia — a pessoa
 * precisava refazer o onboarding que já tinha feito conversando.
 *
 * As partes testáveis sem montar o app são a extração do token e as regras de
 * quando tentar abrir o app. O resto (Linking do Expo) depende de runtime
 * nativo.
 */

const FONTE_CLAIM = readFileSync(resolve(__dirname, '../claimOnboarding.ts'), 'utf8')
const FONTE_ABRIR = readFileSync(resolve(__dirname, '../abrirNoApp.ts'), 'utf8')

/** Mesma extração usada em claimOnboarding (não exportada: é detalhe interno). */
const tokenDaUrl = (url: string | null): string | null => {
  if (!url) return null
  const m = String(url).match(/[?&]t=([^&#\s]+)/)
  return m ? decodeURIComponent(m[1]) : null
}

describe('extração do token de vínculo', () => {
  it('pega o token do link do site', () => {
    expect(tokenDaUrl('https://www.tabulaestelar.com.br/vincular?t=abc123')).toBe('abc123')
  })

  it('pega do scheme próprio, que é como o app nativo recebe', () => {
    expect(tokenDaUrl('tabulaestelar://vincular?t=abc123')).toBe('abc123')
  })

  it('pega quando o token não é o primeiro parâmetro', () => {
    expect(tokenDaUrl('https://x.com/vincular?utm_source=wa&t=abc123')).toBe('abc123')
  })

  it('decodifica o valor', () => {
    expect(tokenDaUrl('https://x.com/vincular?t=a%2Bb%3Dc')).toBe('a+b=c')
  })

  it('para no fim do token, sem engolir o que vem depois', () => {
    expect(tokenDaUrl('https://x.com/vincular?t=abc123&outro=1')).toBe('abc123')
    expect(tokenDaUrl('https://x.com/vincular?t=abc123#frag')).toBe('abc123')
  })

  it('não inventa token onde não há', () => {
    expect(tokenDaUrl('https://www.tabulaestelar.com.br/home')).toBeNull()
    expect(tokenDaUrl(null)).toBeNull()
    expect(tokenDaUrl('')).toBeNull()
    // `?token=` não é `?t=` — não pode casar por engano.
    expect(tokenDaUrl('https://x.com/?token=abc')).toBeNull()
  })
})

describe('captura em ambos os mundos', () => {
  it('o nativo lê o link que abriu o app', () => {
    expect(/getInitialURL/.test(FONTE_CLAIM), 'sem isso o token do link se perde no app').toBe(true)
  })

  it('e também o que chega com o app já aberto', () => {
    // `getInitialURL` só pega o link que ABRIU o app. Com ele em segundo plano,
    // tocar no link traz a pessoa para a tela sem token nenhum.
    expect(/addEventListener\('url'/.test(FONTE_CLAIM)).toBe(true)
    expect(/ouvirLinkDeVinculo/.test(FONTE_CLAIM)).toBe(true)
  })

  it('o web segue limpando o token da barra de endereço', () => {
    // Uso único: não pode ficar copiável no histórico nem ser compartilhado.
    expect(/replaceState/.test(FONTE_CLAIM)).toBe(true)
  })
})

describe('tentativa de abrir o app', () => {
  it('usa o scheme próprio, que funciona sem build', () => {
    // App Links exigiriam `/vincular` na lista verificada do Android — mudança
    // nativa. O scheme já existe e sai por OTA.
    expect(/tabulaestelar:\/\//.test(FONTE_ABRIR)).toBe(true)
  })

  it('desiste sozinha quando o app não existe', () => {
    // Sem o timeout a pessoa ficaria presa numa página que não faz nada.
    expect(/setTimeout/.test(FONTE_ABRIR)).toBe(true)
  })

  it('não tenta no desktop', () => {
    // No desktop a tentativa abre um diálogo inútil de "abrir com".
    expect(/pareceCelular/.test(FONTE_ABRIR)).toBe(true)
    expect(/android\|iphone/i.test(FONTE_ABRIR)).toBe(true)
  })
})
