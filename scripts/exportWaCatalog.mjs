// Exporta o catálogo curado pt-BR para JSON consumido pelo agente WhatsApp (backend).
// Rodar da pasta frontend/: npx tsx scripts/exportWaCatalog.mjs
// Regenerar sempre que os catálogos mudarem; o JSON é commitado no backend.

import { writeFileSync, mkdirSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import { PLANET_IN_SIGN_PTBR_OVERRIDES } from '../src/data/planetInSignOverridesPtBR.ts'
import { NATAL_PLANET_IN_HOUSE_PTBR_OVERRIDES } from '../src/data/natalPlanetInHouseOverridesPtBR.ts'
import { SIGN_IN_HOUSE_PTBR_OVERRIDES } from '../src/data/signInHouseOverridesPtBR.ts'
import { SIGN_IN_MIDHEAVEN_PTBR_OVERRIDES } from '../src/data/signInMidheavenOverridesPtBR.ts'
import { TRANSIT_CATALOG_PTBR } from '../src/data/transitCatalogPtBR.ts'
import { TRANSIT_CATALOG_PTBR_OVERRIDES } from '../src/data/transitCatalogOverridesPtBR.ts'
import { TRANSIT_CATALOG_BLOCKED_KEYS } from '../src/data/transitCatalogBlockedKeys.ts'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Trânsitos: base auto-gerada (menos chaves bloqueadas por qualidade) + overrides curados por cima
const blocked = new Set(TRANSIT_CATALOG_BLOCKED_KEYS)
const transits = {}
for (const [key, entry] of Object.entries(TRANSIT_CATALOG_PTBR)) {
  if (blocked.has(key)) continue
  const text = typeof entry === 'string' ? entry : entry?.text
  if (text) transits[key] = text
}
for (const [key, text] of Object.entries(TRANSIT_CATALOG_PTBR_OVERRIDES)) {
  if (text) transits[key] = text
}

const catalog = {
  generatedAt: new Date().toISOString(),
  source: 'frontend/src/data (pt-BR overrides)',
  planetInSign: PLANET_IN_SIGN_PTBR_OVERRIDES,
  planetInHouse: NATAL_PLANET_IN_HOUSE_PTBR_OVERRIDES,
  signInHouse: SIGN_IN_HOUSE_PTBR_OVERRIDES,
  signInMidheaven: SIGN_IN_MIDHEAVEN_PTBR_OVERRIDES,
  transits,
}

const outPath = resolve(__dirname, '../../backend/lib/whatsapp/catalog-ptbr.json')
mkdirSync(dirname(outPath), { recursive: true })
writeFileSync(outPath, JSON.stringify(catalog, null, 1), 'utf8')

const counts = Object.fromEntries(
  Object.entries(catalog)
    .filter(([, v]) => typeof v === 'object')
    .map(([k, v]) => [k, Object.keys(v).length])
)
console.log('catalog-ptbr.json gerado em', outPath)
console.log('entradas:', counts)
