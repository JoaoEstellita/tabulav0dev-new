/**
 * A imagem de capa, gerada FRESCA a cada peça pelo Higgsfield (Soul 2.0).
 *
 * ── POR QUE ─────────────────────────────────────────────────────────────────
 *
 * O João: "quero que gere imagens sempre, de forma autêntica e que não fique
 * repetitivo". Nada de acervo fixo — cada carrossel ganha uma capa nova, com o
 * prompt variando pelo assunto do dia e um toque aleatório. Soul custa 0,12
 * crédito por imagem, então gerar todo dia é trivial (~4 créditos/mês).
 *
 * ── FALLBACK ────────────────────────────────────────────────────────────────
 *
 * Se o Higgsfield não estiver disponível (sem login, sem rede, timeout), a
 * função devolve `null` e a peça cai no fundo procedural (roda/diagrama real).
 * A produção NUNCA quebra por causa da imagem.
 *
 * No cron, o CLI é autenticado recriando `~/.config/higgsfield/credentials.json`
 * a partir de um secret (o refresh_token renova o access sozinho).
 */
import { exec } from 'node:child_process'
import { promisify } from 'node:util'
import { writeFile } from 'node:fs/promises'

const execAsync = promisify(exec)

// No Windows o executável é `higgsfield.cmd`; no Linux (CI) é `higgsfield`. Como
// .cmd exige shell e shell não cita args com espaço, montamos o comando como
// string única e chamamos via `exec` — portável entre os dois.
const isWin = process.platform === 'win32'
const CLI = process.env.HIGGSFIELD_BIN || (isWin ? 'higgsfield.cmd' : 'higgsfield')
const MODELO = 'text2image_soul_v2'

// o prompt é montado aqui (controlado), mas some com aspas/atalhos de shell por
// segurança antes de entrar na linha de comando
const limpaPrompt = (p) => String(p).replace(/["'`$\\;|&<>]/g, ' ').replace(/\s+/g, ' ').trim()

/** Blocos de cena por tipo de assunto — o que a imagem MOSTRA. */
const CENA = {
  eclipse: 'a dramatic solar eclipse with a golden corona and rays over a starry sky',
  fase: 'a large luminous golden full moon over a calm dark sea at night',
  ingresso: 'a bright golden planet crossing a field of stars, celestial motion',
  retrogrado: 'a golden planet with a looping light trail among the stars',
  aspecto: 'golden constellation lines connecting bright stars across a deep cosmos',
  conceito: 'an ornate golden astrological wheel with zodiac glyphs glowing over the milky way',
  recurso: 'a serene celestial night sky with soft golden constellations and nebula',
}

// variações que impedem a repetição — composição, textura, luz
const VARIA = [
  'cinematic depth, soft nebula haze',
  'crisp starfield, subtle grain, luminous highlights',
  'dreamy atmospheric glow, deep shadows',
  'sharp gold linework, painterly cosmic background',
  'ethereal mist, scattered stardust, gentle bloom',
]

/**
 * O prompt da capa para este assunto — variado e não repetitivo.
 *
 * @param {object} assunto  `{ tipo, chave? }`
 * @param {number} semente  para escolher a variação de forma estável no dia
 */
export function promptDaCapa(assunto, semente = 0) {
  const cena = CENA[assunto?.tipo] || CENA.conceito
  const v = VARIA[Math.abs(semente) % VARIA.length]
  return `${cena}, luxurious deep navy blue and gold color palette, mystical elegant, ${v}, no text, no words, vertical composition`
}

/**
 * Gera a imagem e salva em `destino`. Devolve `destino` no sucesso, `null` se
 * qualquer coisa falhar (o chamador cai no procedural).
 *
 * @param {string} prompt
 * @param {string} destino  caminho do .png
 * @param {object} [opts]   `{ aspect = '3:4', timeoutMs = 240000 }`
 */
export async function gerarCapaIA(prompt, destino, { aspect = '3:4', timeoutMs = 240000 } = {}) {
  try {
    const cmd = `${CLI} generate create ${MODELO} --prompt "${limpaPrompt(prompt)}"` +
      ` --aspect_ratio ${aspect} --quality 2k --wait --wait-timeout 4m`
    const { stdout } = await execAsync(cmd, { timeout: timeoutMs, maxBuffer: 4 * 1024 * 1024 })
    const url = (stdout.match(/https:\/\/\S+\.png/) || [])[0]
    if (!url) return null

    const resp = await fetch(url)
    if (!resp.ok) return null
    const buf = Buffer.from(await resp.arrayBuffer())
    if (buf.length < 10000) return null // imagem vazia/erro
    await writeFile(destino, buf)
    return destino
  } catch {
    return null // sem login, sem rede, timeout — cai no procedural
  }
}
