#!/usr/bin/env node
/**
 * Folha de prova do diagrama: os 5 aspectos maiores lado a lado, com corpos de
 * tamanhos diferentes, num PNG só.
 *
 *   node scripts/marketing/provaGeometria.mjs
 *
 * Existe porque o card do dia mostra só um aspecto — o do dia. Um ajuste no
 * desenho pode acertar o trígono e quebrar a conjunção sem ninguém ver por
 * semanas. Rodar isto depois de mexer em `lib/template.mjs` fecha esse buraco.
 */
import { writeFile, mkdir, rm } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

import { montarCard } from './lib/template.mjs'

const execFileAsync = promisify(execFile)
const AQUI = path.dirname(fileURLToPath(import.meta.url))
const MONOREPO = path.resolve(AQUI, '../../..')

const CHROME = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  '/usr/bin/google-chrome',
].filter(Boolean).find((c) => existsSync(c))

/** Um caso por aspecto, variando o tamanho dos corpos de propósito. */
const CASOS = [
  {
    agente: 'Saturn', alvo: 'Venus', agentePt: 'Saturno', alvoPt: 'Vênus',
    agentePos: '14° Áries', alvoPos: '14° Áries',
    aspectoRotulo: 'Conjunção', angulo: 0, orbeFormatado: "0°22'", exato: true,
    titulo: 'Amor posto à prova do tempo', aforismo: 'Amor que dura não teme a prova do tempo.',
  },
  {
    agente: 'Jupiter', alvo: 'Mercury', agentePt: 'Júpiter', alvoPt: 'Mercúrio',
    agentePos: '8° Leão', alvoPos: '8° Libra',
    aspectoRotulo: 'Sextil', angulo: 60, orbeFormatado: "1°05'", exato: false,
    titulo: 'Ideia que encontra ouvido', aforismo: 'Palavra certa na hora certa vale por dez.',
  },
  {
    agente: 'Saturn', alvo: 'Sun', agentePt: 'Saturno', alvoPt: 'Sol',
    agentePos: '14° Áries', alvoPos: '14° Câncer',
    aspectoRotulo: 'Quadratura', angulo: 90, orbeFormatado: "0°14'", exato: true,
    titulo: 'Prova de maturidade', aforismo: 'Muro que resiste é muro que ensina onde é a porta.',
  },
  {
    agente: 'Pluto', alvo: 'Moon', agentePt: 'Plutão', alvoPt: 'Lua',
    agentePos: '4° Aquário', alvoPos: '4° Gêmeos',
    aspectoRotulo: 'Trígono', angulo: 120, orbeFormatado: "2°38'", exato: false,
    titulo: 'Fundo que vem à tona', aforismo: 'Água parada também guarda corrente.',
  },
  {
    agente: 'Neptune', alvo: 'Mars', agentePt: 'Netuno', alvoPt: 'Marte',
    agentePos: '4° Áries', alvoPos: '4° Libra',
    aspectoRotulo: 'Oposição', angulo: 180, orbeFormatado: "1°47'", exato: false,
    titulo: 'Força que se dissolve', aforismo: 'Quem luta contra a maré cansa antes da praia.',
  },
]

const BASE = {
  areaLabel: 'Carreira', cor: '#4ECDC4', dataRotulo: '05.08', semente: 20260805,
}

function extrairDiagrama(html) {
  const i = html.indexOf('<svg')
  const f = html.indexOf('</svg>') + 6
  return html.slice(i, f)
}

async function principal() {
  if (!CHROME) throw new Error('Chrome não encontrado. Defina CHROME_PATH.')

  const painéis = CASOS.map((caso) => {
    const svg = extrairDiagrama(montarCard({ ...BASE, ...caso }, 'feed'))
    return `
      <figure>
        <div class="tela">${svg}</div>
        <figcaption>
          <b>${caso.aspectoRotulo}</b> · ${caso.angulo}°<br>
          ${caso.agentePt} → ${caso.alvoPt}
        </figcaption>
      </figure>`
  }).join('')

  const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body { width:1500px; background:#070A18; color:#EDE6D8;
           font-family:ui-monospace,Consolas,monospace; padding:36px; }
    h1 { font-size:19px; letter-spacing:.18em; text-transform:uppercase;
         color:#C9A227; margin-bottom:6px; }
    .sub { font-size:13px; color:#4A5372; margin-bottom:30px; }
    .grade { display:grid; grid-template-columns:repeat(3,1fr); gap:26px; }
    figure { background:#0B1024; border:1px solid #1B2035; padding:14px; }
    .tela { background:#070A18; }
    svg { width:100%; height:auto; display:block; }
    figcaption { margin-top:10px; font-size:12.5px; line-height:1.6; color:#4A5372;
                 border-top:1px solid #1B2035; padding-top:10px; }
    figcaption b { color:#EDE6D8; }
  </style></head><body>
    <h1>Prova de geometria — diagrama do card</h1>
    <div class="sub">Os 5 aspectos maiores. Verificar: rótulo fora da roda, raio parando na borda do disco, arco e valor legíveis, nada estourando o quadro.</div>
    <div class="grade">${painéis}</div>
  </body></html>`

  const pasta = path.join(MONOREPO, 'marketing/out/_prova')
  await mkdir(pasta, { recursive: true })
  const temp = path.join(pasta, 'geometria.html')
  const png = path.join(pasta, 'geometria.png')
  await writeFile(temp, html, 'utf8')

  await execFileAsync(CHROME, [
    '--headless=new', '--disable-gpu', '--hide-scrollbars',
    '--force-device-scale-factor=1', '--window-size=1500,1150',
    '--virtual-time-budget=3000', `--screenshot=${png}`,
    `file:///${temp.replace(/\\/g, '/')}`,
  ], { timeout: 60_000 })

  await rm(temp, { force: true })
  console.log(png)
}

principal().catch((e) => { console.error('Falhou:', e.message); process.exit(1) })
