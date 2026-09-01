# Tzolkin / Dreamspell Fase 1 — Plano de Implementação

**Goal:** Adicionar o perfil solo do Tzolkin Dreamspell (Kin natal + Kin do dia) como 3ª via no Mapa e badge na Home, com motor determinístico testado e textos curados ×4 idiomas.

**Arquitetura:** Motor puro em `src/astro/tzolkin/` (espelha `src/astro/vedic/`), sem React/Firebase/IA. Textos curados em `src/data/tzolkin/`. UI nova `TzolkinProfileContent.tsx` plugada no `CosmosScreen` via `mapMode +'tzolkin'`. Badge do Kin do dia em `MoonPhaseButton`. Tudo aditivo — zero mudança em Match/Sinastria/motor astro.

**Stack:** TypeScript, React Native (Expo), Vitest. Algoritmo já validado empiricamente (ver spec §13).

**Ref:** [spec](2026-09-01-tzolkin-dreamspell-fase1-design.md).

---

## Mapa de arquivos

**Criar:**
- `src/astro/tzolkin/types.ts` — interfaces (sem `any`)
- `src/astro/tzolkin/constants.ts` — 13 tons, 20 selos, cores, 20 ondas, 5 castelos, 5 famílias
- `src/astro/tzolkin/engine.ts` — matemática pura
- `src/astro/tzolkin/index.ts` — barrel
- `src/astro/tzolkin/__tests__/engine.spec.ts` — vetores + oráculo + bordas
- `src/data/tzolkin/tzolkinOverridesPtBR.ts` — leitura curada pt-BR
- `src/data/tzolkin/tzolkinOverridesI18n.ts` — en-US/es-ES/it-IT
- `src/screens/cosmos/TzolkinProfileContent.tsx` — UI do perfil

**Modificar:**
- `src/screens/cosmos/CosmosScreen.tsx` — union `mapMode` +`'tzolkin'`, 3º toggle, branch de render
- `src/components/MoonPhaseButton.tsx` — badge do Kin do dia

---

## Task 1: Types

**Arquivos:**
- Criar: `src/astro/tzolkin/types.ts`

- [ ] **Step 1: Escrever os types**

```ts
// Tzolkin Dreamspell — tipos. Dados matemáticos separados de traduções.
export type ColorKey = 'red' | 'white' | 'blue' | 'yellow'

export interface GalacticTone {
  number: number            // 1..13
  key: string               // 'magnetico' ...
  namePt: string
  nameEn: string
  essencePt: string; essenceEn: string
  powerPt: string; powerEn: string
  actionPt: string; actionEn: string
}

export interface TzolkinSeal {
  number: number            // 1..20
  key: string               // 'dragao' ...
  namePt: string; nameEn: string
  color: ColorKey
  powerPt: string; powerEn: string
  actionPt: string; actionEn: string
  essencePt: string; essenceEn: string
}

export interface OraclePosition { kin: number; seal: number; tone: number }
export interface FifthForceOracle {
  destiny: OraclePosition
  guide: OraclePosition
  analog: OraclePosition
  antipode: OraclePosition
  occult: OraclePosition
}

export interface Wavespell { index: number; position: number; rulingSeal: number; startKin: number }
export interface Castle { index: number; key: string; startKin: number; endKin: number }
export type EarthFamilyKey = 'portal' | 'polar' | 'cardinal' | 'core' | 'signal'

export interface TzolkinKin {
  kin: number               // 1..260
  seal: number              // 1..20
  tone: number              // 1..13
  colorIndex: number        // 0..3
  isHunabKuLeapDay: boolean
}

export interface TzolkinProfile extends TzolkinKin {
  oracle: FifthForceOracle
  wavespell: Wavespell
  castle: Castle
  earthFamily: EarthFamilyKey
}
```

- [ ] **Step 2: Commit**

```bash
git add src/astro/tzolkin/types.ts
git commit -m "feat(tzolkin): types do motor Dreamspell"
```

---

## Task 2: Engine — cálculo do Kin e Kin do dia (TDD)

**Arquivos:**
- Criar: `src/astro/tzolkin/engine.ts`
- Teste: `src/astro/tzolkin/__tests__/engine.spec.ts`

- [ ] **Step 1: Escrever o teste que falha**

```ts
import { describe, it, expect } from 'vitest'
import { calculateKin, kinOfDate } from '../engine'

describe('tzolkin kin', () => {
  it('data de referência 26/07/1987 = Kin 34', () => {
    expect(calculateKin('1987-07-26').kin).toBe(34)
  })
  it('01/01/1990 = Kin 143', () => { expect(calculateKin('1990-01-01').kin).toBe(143) })
  it('10/04/1989 = Kin 137 (selo 17, tom 7)', () => {
    const k = calculateKin('1989-04-10')
    expect(k.kin).toBe(137); expect(k.seal).toBe(17); expect(k.tone).toBe(7)
  })
  it('29/05/2003 = Kin 96 (selo 16, tom 5)', () => {
    const k = calculateKin('2003-05-29')
    expect(k.kin).toBe(96); expect(k.seal).toBe(16); expect(k.tone).toBe(5)
  })
  it('dia anterior à referência 25/07/1987 = Kin 33', () => {
    expect(calculateKin('1987-07-25').kin).toBe(33)
  })
  it('bordas: kin 1 e 260 pela transição', () => {
    // 25/07/1987=33 → recuar 32 dias cai em 1; avançar cobre 260→1
    expect(calculateKin('1987-07-26').kin).toBe(34)
  })
  it('29/02 = Hunab Ku (não avança kin, flag ligada)', () => {
    const leap = calculateKin('2004-02-29')
    expect(leap.isHunabKuLeapDay).toBe(true)
    // 28/02/2004 e 01/03/2004 devem ter o MESMO kin (29/02 não conta)
    expect(calculateKin('2004-02-28').kin).toBe(calculateKin('2004-03-01').kin - 1 + 1 === calculateKin('2004-03-01').kin ? calculateKin('2004-03-01').kin - 0 : calculateKin('2004-02-28').kin)
  })
  it('kinOfDate retorna 1..260', () => {
    const k = kinOfDate('2026-09-01'); expect(k).toBeGreaterThanOrEqual(1); expect(k).toBeLessThanOrEqual(260)
  })
})
```

- [ ] **Step 2: Rodar e confirmar falha**

Comando: `npx vitest run src/astro/tzolkin/__tests__/engine.spec.ts`
Esperado: FAIL ("calculateKin is not a function").

- [ ] **Step 3: Implementar engine.ts (parte 1)**

```ts
import type { TzolkinKin } from './types'

const BASE_YEAR = 1987, BASE_MONTH = 7, BASE_DAY = 26, BASE_KIN = 34

export function mod(a: number, n: number): number { return ((a % n) + n) % n }
function isLeap(y: number): boolean { return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0 }
function leapsBefore(y: number): number { const n = y - 1; return Math.floor(n / 4) - Math.floor(n / 100) + Math.floor(n / 400) }
function feb29OnOrBefore(y: number, m: number, d: number): number {
  let c = leapsBefore(y)
  if (isLeap(y) && (m > 2 || (m === 2 && d === 29))) c += 1
  return c
}
// Ordinal Dreamspell: dias civis (UTC) menos os 29/02 já passados. Feb 29 não avança o kin.
function ordinal(y: number, m: number, d: number): number {
  return Math.round(Date.UTC(y, m - 1, d) / 86400000) - feb29OnOrBefore(y, m, d)
}
function parseISO(iso: string): { y: number, m: number, d: number } {
  const [y, m, d] = iso.slice(0, 10).split('-').map(Number)
  return { y, m, d }
}

const BASE_ORD = ordinal(BASE_YEAR, BASE_MONTH, BASE_DAY)

export function kinOfDate(iso: string): number {
  const { y, m, d } = parseISO(iso)
  return mod((BASE_KIN - 1) + (ordinal(y, m, d) - BASE_ORD), 260) + 1
}

export function sealOf(kin: number): number { return ((kin - 1) % 20) + 1 }
export function toneOf(kin: number): number { return ((kin - 1) % 13) + 1 }
export function colorIndexOf(seal: number): number { return (seal - 1) % 4 }

export function calculateKin(iso: string): TzolkinKin {
  const { y, m, d } = parseISO(iso)
  const isHunabKuLeapDay = m === 2 && d === 29
  const kin = kinOfDate(iso)
  return { kin, seal: sealOf(kin), tone: toneOf(kin), colorIndex: colorIndexOf(sealOf(kin)), isHunabKuLeapDay }
}
```

- [ ] **Step 4: Rodar e confirmar que passa**

Comando: `npx vitest run src/astro/tzolkin/__tests__/engine.spec.ts`
Esperado: PASS em todos os casos deste arquivo.

- [ ] **Step 5: Commit**

```bash
git add src/astro/tzolkin/engine.ts src/astro/tzolkin/__tests__/engine.spec.ts
git commit -m "feat(tzolkin): calculateKin/kinOfDate + selo/tom/cor (validado por vetores)"
```

---

## Task 3: Engine — Oráculo da Quinta Força (TDD)

**Arquivos:**
- Modificar: `src/astro/tzolkin/engine.ts`
- Teste: `src/astro/tzolkin/__tests__/engine.spec.ts`

- [ ] **Step 1: Adicionar o teste que falha**

```ts
import { getOracle } from '../engine'

describe('oráculo da quinta força', () => {
  it('Kin 137', () => {
    const o = getOracle(137)
    expect(o.destiny.kin).toBe(137)
    expect(o.guide.kin).toBe(189)
    expect(o.analog.kin).toBe(202)
    expect(o.antipode.kin).toBe(7)
    expect(o.occult.kin).toBe(124)
  })
  it('Kin 96', () => {
    const o = getOracle(96)
    expect(o.guide.kin).toBe(44)
    expect(o.analog.kin).toBe(83)
    expect(o.antipode.kin).toBe(226)
    expect(o.occult.kin).toBe(165)
  })
  it('oculto 1↔260', () => { expect(getOracle(1).occult.kin).toBe(260); expect(getOracle(260).occult.kin).toBe(1) })
})
```

- [ ] **Step 2: Rodar e confirmar falha**

Comando: `npx vitest run src/astro/tzolkin/__tests__/engine.spec.ts -t oráculo`
Esperado: FAIL ("getOracle is not a function").

- [ ] **Step 3: Implementar getOracle em engine.ts**

```ts
import type { FifthForceOracle, OraclePosition } from './types'

function kinFromToneSeal(tone: number, seal: number): number {
  for (let k = 1; k <= 260; k++) if (toneOf(k) === tone && sealOf(k) === seal) return k
  return 0 // impossível: 13 e 20 coprimos → sempre existe
}
function pos(kin: number): OraclePosition { return { kin, seal: sealOf(kin), tone: toneOf(kin) } }
function guideOffset(tone: number): number {
  if (tone === 1 || tone === 6 || tone === 11) return 0
  if (tone === 2 || tone === 7 || tone === 12) return 12
  if (tone === 3 || tone === 8 || tone === 13) return 4
  if (tone === 4 || tone === 9) return -4
  return 8 // 5, 10
}

export function getOracle(kin: number): FifthForceOracle {
  const t = toneOf(kin), s = sealOf(kin)
  const analogSeal = mod(18 - s, 20) + 1
  const antipodeSeal = mod((s - 1) + 10, 20) + 1
  const guideSeal = mod((s - 1) + guideOffset(t), 20) + 1
  return {
    destiny: pos(kin),
    guide: pos(kinFromToneSeal(t, guideSeal)),
    analog: pos(kinFromToneSeal(t, analogSeal)),
    antipode: pos(kinFromToneSeal(t, antipodeSeal)),
    occult: pos(261 - kin),
  }
}
```

- [ ] **Step 4: Rodar e confirmar que passa**

Comando: `npx vitest run src/astro/tzolkin/__tests__/engine.spec.ts -t oráculo`
Esperado: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/astro/tzolkin/engine.ts src/astro/tzolkin/__tests__/engine.spec.ts
git commit -m "feat(tzolkin): oráculo da quinta força (guia/análogo/antípoda/oculto)"
```

---

## Task 4: Engine — Onda, Castelo, Família (TDD)

**Arquivos:**
- Modificar: `src/astro/tzolkin/engine.ts`
- Teste: `src/astro/tzolkin/__tests__/engine.spec.ts`

- [ ] **Step 1: Adicionar o teste que falha**

```ts
import { getWavespell, getCastle, getEarthFamily } from '../engine'

describe('onda/castelo/família', () => {
  it('onda do Kin 137 (Macaco, pos 7)', () => {
    const w = getWavespell(137)
    expect(w.index).toBe(11); expect(w.position).toBe(7); expect(w.startKin).toBe(131); expect(w.rulingSeal).toBe(11)
  })
  it('castelo do Kin 137 = Azul (105–156)', () => {
    const c = getCastle(137); expect(c.key).toBe('blue'); expect(c.startKin).toBe(105); expect(c.endKin).toBe(156)
  })
  it('família terrestre por selo', () => {
    expect(getEarthFamily(17)).toBe('core')     // Terra
    expect(getEarthFamily(16)).toBe('cardinal')  // Guerreiro
    expect(getEarthFamily(9)).toBe('portal')     // Lua
    expect(getEarthFamily(5)).toBe('polar')      // Serpente
    expect(getEarthFamily(13)).toBe('signal')    // Caminhante
  })
})
```

- [ ] **Step 2: Rodar e confirmar falha**

Comando: `npx vitest run src/astro/tzolkin/__tests__/engine.spec.ts -t "onda/castelo"`
Esperado: FAIL.

- [ ] **Step 3: Implementar em engine.ts**

```ts
import type { Wavespell, Castle, EarthFamilyKey } from './types'

export function getWavespell(kin: number): Wavespell {
  const index = Math.floor((kin - 1) / 13) + 1
  const position = ((kin - 1) % 13) + 1
  const startKin = (index - 1) * 13 + 1
  return { index, position, startKin, rulingSeal: sealOf(startKin) }
}

const CASTLES: Castle[] = [
  { index: 1, key: 'red', startKin: 1, endKin: 52 },
  { index: 2, key: 'white', startKin: 53, endKin: 104 },
  { index: 3, key: 'blue', startKin: 105, endKin: 156 },
  { index: 4, key: 'yellow', startKin: 157, endKin: 208 },
  { index: 5, key: 'green', startKin: 209, endKin: 260 },
]
export function getCastle(kin: number): Castle {
  return CASTLES.find(c => kin >= c.startKin && kin <= c.endKin) as Castle
}

const EARTH_FAMILY: Record<number, EarthFamilyKey> = {
  9: 'portal', 14: 'portal', 19: 'portal', 4: 'portal',
  5: 'polar', 10: 'polar', 15: 'polar', 20: 'polar',
  1: 'cardinal', 6: 'cardinal', 11: 'cardinal', 16: 'cardinal',
  17: 'core', 2: 'core', 7: 'core', 12: 'core',
  13: 'signal', 18: 'signal', 3: 'signal', 8: 'signal',
}
export function getEarthFamily(seal: number): EarthFamilyKey { return EARTH_FAMILY[seal] }
```

- [ ] **Step 4: Rodar e confirmar que passa**

Comando: `npx vitest run src/astro/tzolkin/__tests__/engine.spec.ts -t "onda/castelo"`
Esperado: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/astro/tzolkin/engine.ts src/astro/tzolkin/__tests__/engine.spec.ts
git commit -m "feat(tzolkin): onda encantada, castelo e família terrestre"
```

---

## Task 5: Constantes (13 tons + 20 selos + ondas)

**Arquivos:**
- Criar: `src/astro/tzolkin/constants.ts`
- Teste: `src/astro/tzolkin/__tests__/engine.spec.ts` (checagem de integridade)

- [ ] **Step 1: Adicionar teste de integridade**

```ts
import { TONES, SEALS } from '../constants'
describe('constantes', () => {
  it('13 tons e 20 selos completos', () => {
    expect(TONES).toHaveLength(13); expect(SEALS).toHaveLength(20)
    expect(TONES.every(t => t.namePt && t.essencePt)).toBe(true)
    expect(SEALS.every(s => s.namePt && s.color)).toBe(true)
  })
  it('selos com cor correta (colorIndex)', () => {
    expect(SEALS[16].color).toBe('red')    // selo 17 Terra → vermelho
    expect(SEALS[15].color).toBe('yellow') // selo 16 Guerreiro → amarelo
  })
})
```

- [ ] **Step 2: Implementar constants.ts — transcrever os 13 tons e 20 selos do spec §4/prompt**

Estrutura exata (transcrever TODOS os 13 tons e 20 selos com os campos do material-fonte; abaixo o formato + 2 exemplos de cada — completar a lista inteira):

```ts
import type { GalacticTone, TzolkinSeal } from './types'

export const TONES: GalacticTone[] = [
  { number: 1, key: 'magnetico', namePt: 'Magnético', nameEn: 'Magnetic', essencePt: 'Propósito', essenceEn: 'Purpose', powerPt: 'Unificar', powerEn: 'Unify', actionPt: 'Atrair', actionEn: 'Attract' },
  { number: 2, key: 'lunar', namePt: 'Lunar', nameEn: 'Lunar', essencePt: 'Desafio', essenceEn: 'Challenge', powerPt: 'Polarizar', powerEn: 'Polarize', actionPt: 'Estabilizar', actionEn: 'Stabilize' },
  // ... 3 Elétrico, 4 Autoexistente, 5 Entonado, 6 Rítmico, 7 Ressonante, 8 Galáctico,
  // 9 Solar, 10 Planetário, 11 Espectral, 12 Cristal, 13 Cósmico (do prompt §7)
]

// cores por selo: (selo-1)%4 → 0 red,1 white,2 blue,3 yellow
export const SEALS: TzolkinSeal[] = [
  { number: 1, key: 'dragao', namePt: 'Dragão', nameEn: 'Dragon', color: 'red', powerPt: 'Nascimento', powerEn: 'Birth', actionPt: 'Nutrir', actionEn: 'Nurture', essencePt: 'Ser', essenceEn: 'Being' },
  { number: 2, key: 'vento', namePt: 'Vento', nameEn: 'Wind', color: 'white', powerPt: 'Espírito', powerEn: 'Spirit', actionPt: 'Comunicar', actionEn: 'Communicate', essencePt: 'Respiração', essenceEn: 'Breath' },
  // ... 3 Noite(blue) ... 20 Sol(yellow) — transcrever os 20 do prompt §8, cor = (n-1)%4
]

export const COLOR_LABELS: Record<string, { pt: string; en: string; hex: string }> = {
  red: { pt: 'Vermelho', en: 'Red', hex: '#E4572E' },
  white: { pt: 'Branco', en: 'White', hex: '#E8E8EA' },
  blue: { pt: 'Azul', en: 'Blue', hex: '#2E5EAA' },
  yellow: { pt: 'Amarelo', en: 'Yellow', hex: '#F2C14E' },
}
```

> Nota: os dados dos 13 tons e 20 selos vêm INTEGRALMENTE do prompt-fonte (§7 e §8). Não inventar — transcrever com acentuação pt-BR correta. Cor de cada selo = `(number-1)%4`.

- [ ] **Step 3: Rodar e confirmar que passa**

Comando: `npx vitest run src/astro/tzolkin/__tests__/engine.spec.ts -t constantes`
Esperado: PASS.

- [ ] **Step 4: Commit**

```bash
git add src/astro/tzolkin/constants.ts src/astro/tzolkin/__tests__/engine.spec.ts
git commit -m "feat(tzolkin): constantes — 13 tons, 20 selos, cores"
```

---

## Task 6: getKinDisplayName + buildProfile + barrel (TDD)

**Arquivos:**
- Modificar: `src/astro/tzolkin/engine.ts`
- Criar: `src/astro/tzolkin/index.ts`
- Teste: `src/astro/tzolkin/__tests__/engine.spec.ts`

- [ ] **Step 1: Adicionar o teste que falha**

```ts
import { getKinDisplayName, buildProfile } from '../engine'
describe('display + profile', () => {
  it('nome do Kin 137 = Terra Ressonante Vermelha', () => {
    expect(getKinDisplayName(137, 'pt-BR')).toBe('Terra Ressonante Vermelha')
  })
  it('nome do Kin 96 = Guerreiro Entonado Amarelo', () => {
    expect(getKinDisplayName(96, 'pt-BR')).toBe('Guerreiro Entonado Amarelo')
  })
  it('buildProfile agrega tudo', () => {
    const p = buildProfile('1989-04-10')
    expect(p.kin).toBe(137); expect(p.oracle.guide.kin).toBe(189)
    expect(p.wavespell.index).toBe(11); expect(p.castle.key).toBe('blue'); expect(p.earthFamily).toBe('core')
  })
})
```

- [ ] **Step 2: Rodar e confirmar falha**

Comando: `npx vitest run src/astro/tzolkin/__tests__/engine.spec.ts -t "display + profile"`
Esperado: FAIL.

- [ ] **Step 3: Implementar em engine.ts**

```ts
import type { TzolkinProfile } from './types'
import { SEALS, TONES, COLOR_LABELS } from './constants'

// Nome de exibição: Selo + Tom + Cor. Concordância pt-BR: cor no feminino quando o selo é
// feminino (Terra, Lua, Noite, Serpente, Semente, Estrela, Mão, Águia, Tormenta). Mapa explícito.
const FEMININE_SEALS = new Set([9, 3, 5, 4, 8, 7, 15, 17, 19]) // Lua, Noite, Serpente, Semente, Estrela, Mão, Águia, Terra, Tormenta
function colorWord(seal: number, locale: string): string {
  const c = SEALS[seal - 1].color
  const base = locale.startsWith('pt') ? COLOR_LABELS[c].pt : COLOR_LABELS[c].en
  if (!locale.startsWith('pt')) return base
  if (FEMININE_SEALS.has(seal)) return base.replace(/o$/, 'a') // Vermelho→Vermelha, Branco→Branca, Amarelo→Amarela; Azul invariável
  return base
}
export function getKinDisplayName(kin: number, locale = 'pt-BR'): string {
  const s = SEALS[sealOf(kin) - 1], t = TONES[toneOf(kin) - 1]
  const sealName = locale.startsWith('pt') ? s.namePt : s.nameEn
  const toneName = locale.startsWith('pt') ? t.namePt : t.nameEn
  return `${sealName} ${toneName} ${colorWord(sealOf(kin), locale)}`
}

export function buildProfile(iso: string): TzolkinProfile {
  const base = calculateKin(iso)
  return { ...base, oracle: getOracle(base.kin), wavespell: getWavespell(base.kin), castle: getCastle(base.kin), earthFamily: getEarthFamily(base.seal) }
}
```

- [ ] **Step 4: Criar barrel index.ts**

```ts
export * from './types'
export * from './constants'
export {
  calculateKin, kinOfDate, buildProfile, getOracle, getWavespell, getCastle,
  getEarthFamily, getKinDisplayName, sealOf, toneOf, colorIndexOf, mod,
} from './engine'
```

- [ ] **Step 5: Rodar e confirmar que passa**

Comando: `npx vitest run src/astro/tzolkin/__tests__/engine.spec.ts`
Esperado: PASS (arquivo inteiro verde).

- [ ] **Step 6: Commit**

```bash
git add src/astro/tzolkin/engine.ts src/astro/tzolkin/index.ts src/astro/tzolkin/__tests__/engine.spec.ts
git commit -m "feat(tzolkin): display name (concordância pt-BR) + buildProfile + barrel"
```

---

## Task 7: Textos curados pt-BR

**Arquivos:**
- Criar: `src/data/tzolkin/tzolkinOverridesPtBR.ts`

- [ ] **Step 1: Implementar blocos curados pt-BR**

Formato (blocos compostos deterministicamente na UI — SEM 260 bespoke). Transcrever/curar leitura simbólica para os 20 selos, 13 tons, 5 famílias, 5 castelos, e os 4 papéis do oráculo. Linguagem: "simboliza/pode indicar/no sistema Dreamspell".

```ts
// Leitura curada pt-BR do Tzolkin Dreamspell. Compor na UI: selo + tom + oráculo.
// Linguagem simbólica, nunca fato objetivo.
export const TZOLKIN_SEAL_READING_PT: Record<number, { essence: string; potential: string; shadow: string }> = {
  1: { essence: 'O Dragão simboliza o nascimento e a fonte primordial...', potential: 'Capacidade de iniciar e nutrir o novo...', shadow: 'Pode indicar dependência ou medo de começar...' },
  // ... 2..20 (curar cada um a partir de power/action/essence dos selos)
}
export const TZOLKIN_TONE_READING_PT: Record<number, { meaning: string }> = {
  1: { meaning: 'O tom Magnético convida a unificar em torno de um propósito...' },
  // ... 2..13
}
export const TZOLKIN_ORACLE_ROLE_PT: Record<'guide'|'analog'|'antipode'|'occult', { title: string; text: string }> = {
  guide: { title: 'Guia', text: 'Orientação e poder que conduz o Kin...' },
  analog: { title: 'Análogo', text: 'Apoio e complementaridade...' },
  antipode: { title: 'Antípoda', text: 'Desafio que fortalece — não incompatibilidade...' },
  occult: { title: 'Oculto', text: 'Potencial escondido, complementaridade interna...' },
}
export const TZOLKIN_FAMILY_READING_PT: Record<string, string> = {
  portal: 'Família Portal — canaliza energia entre dimensões...', polar: 'Família Polar — estabiliza polos...',
  cardinal: 'Família Cardinal — abre direções...', core: 'Família Núcleo — sustenta o centro...', signal: 'Família Sinal — comunica e revela...',
}
export const TZOLKIN_CASTLE_READING_PT: Record<string, string> = {
  red: 'Castelo Vermelho do Leste — tema Nascimento...', white: 'Castelo Branco do Norte — tema Travessia...',
  blue: 'Castelo Azul do Oeste — tema Transformação...', yellow: 'Castelo Amarelo do Sul — tema Amadurecimento...', green: 'Castelo Verde Central — tema Sincronização...',
}
export const TZOLKIN_DISCLAIMER_PT = 'O sistema desta área é o Dreamspell/13 Luas, uma interpretação moderna do ciclo de 260 Kins inspirada no Tzolk\'in maia tradicional. As leituras são simbólicas.'
```

- [ ] **Step 2: Commit**

```bash
git add src/data/tzolkin/tzolkinOverridesPtBR.ts
git commit -m "feat(tzolkin): textos curados pt-BR (selos/tons/oráculo/família/castelo)"
```

---

## Task 8: Textos i18n (en-US / es-ES / it-IT)

**Arquivos:**
- Criar: `src/data/tzolkin/tzolkinOverridesI18n.ts`

- [ ] **Step 1: Implementar traduções**

Mesma estrutura da Task 7 para `en-US`, `es-ES`, `it-IT`. Regras do projeto: en-US sem "will"; es-ES SEM tildes; it-IT SEM acentos.

```ts
type Lang = 'en-US' | 'es-ES' | 'it-IT'
export const TZOLKIN_SEAL_READING_I18N: Record<Lang, Record<number, { essence: string; potential: string; shadow: string }>> = {
  'en-US': { 1: { essence: 'The Dragon symbolizes birth...', potential: '...', shadow: '...' } /* 2..20 */ },
  'es-ES': { 1: { essence: 'El Dragon simboliza el nacimiento...', potential: '...', shadow: '...' } /* sin tildes */ },
  'it-IT': { 1: { essence: 'Il Dragone simboleggia la nascita...', potential: '...', shadow: '...' } /* senza accenti */ },
}
// idem TONE_READING, ORACLE_ROLE, FAMILY, CASTLE, DISCLAIMER por idioma.
export const TZOLKIN_DISCLAIMER_I18N: Record<Lang, string> = {
  'en-US': 'This area uses Dreamspell/13 Moons, a modern interpretation of the 260-Kin cycle inspired by the traditional Tzolkin. Readings are symbolic.',
  'es-ES': 'Esta area usa Dreamspell/13 Lunas, una interpretacion moderna del ciclo de 260 Kines inspirada en el Tzolkin tradicional. Las lecturas son simbolicas.',
  'it-IT': 'Questa area usa Dreamspell/13 Lune, una interpretazione moderna del ciclo di 260 Kin ispirata al Tzolkin tradizionale. Le letture sono simboliche.',
}
```

- [ ] **Step 2: Commit**

```bash
git add src/data/tzolkin/tzolkinOverridesI18n.ts
git commit -m "feat(tzolkin): traduções en/es/it (regras i18n do projeto)"
```

---

## Task 9: UI — TzolkinProfileContent (sub-abado)

> **Atualização (pedido do usuário):** a aba Tzolkin tem **sub-abas** próprias (espelha Ocidental Natal/Trânsitos/Solar/Lunar): **Kin** (assinatura), **Roda** (tabuleiro 13×20 + Oráculo clicável), **Onda** (onda encantada), **Interpretações** (leitura curada). Estado `subTab` interno; cada sub-aba é um sub-componente focado.

**Arquivos:**
- Criar: `src/screens/cosmos/TzolkinProfileContent.tsx` (container + sub-abas)
- Criar: `src/screens/cosmos/tzolkin/TzolkinBoard.tsx` (matriz 13×20)
- Criar: `src/screens/cosmos/tzolkin/TzolkinOracle.tsx` (cruz clicável)

- [ ] **Step 1: Ler o precedente**

Comando: abrir `src/screens/cosmos/VedicProfileContent.tsx` e replicar: props (`birthData`/`profile`), design tokens, `tl()` de i18n, cards expansíveis, ScrollView com `flex:1`.

- [ ] **Step 2: Implementar o componente**

```tsx
import React, { useMemo, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { useAppLanguage } from '../../hooks/useAppLanguage'
import { buildProfile, getKinDisplayName, kinOfDate, getOracle, SEALS, TONES, COLOR_LABELS } from '../../astro/tzolkin'
import { TZOLKIN_SEAL_READING_PT, TZOLKIN_TONE_READING_PT, TZOLKIN_ORACLE_ROLE_PT, TZOLKIN_FAMILY_READING_PT, TZOLKIN_CASTLE_READING_PT, TZOLKIN_DISCLAIMER_PT } from '../../data/tzolkin/tzolkinOverridesPtBR'

export default function TzolkinProfileContent({ birthDateISO }: { birthDateISO: string }) {
  const { language } = useAppLanguage()
  const profile = useMemo(() => buildProfile(birthDateISO), [birthDateISO])
  const todayKin = useMemo(() => kinOfDate(new Date().toISOString().slice(0, 10)), [])
  const [open, setOpen] = useState<string | null>('essence')
  const color = COLOR_LABELS[SEALS[profile.seal - 1].color]
  // Cabeçalho + cards: essência(selo), tom, selo+tom, potenciais/sombra, ORÁCULO (diagrama clicável),
  // onda, castelo, família, kin de hoje (relação com kin natal via getOracle/comparação).
  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={[s.header, { borderColor: color.hex }]}>
        <Text style={s.kinNum}>KIN {profile.kin}</Text>
        <Text style={[s.kinName, { color: color.hex }]}>{getKinDisplayName(profile.kin, language)}</Text>
      </View>
      {/* cards expansíveis reusando padrão do VedicProfileContent; Oráculo com 5 posições clicáveis */}
      <Text style={s.disclaimer}>{TZOLKIN_DISCLAIMER_PT}</Text>
    </ScrollView>
  )
}
const s = StyleSheet.create({
  header: { borderWidth: 1, borderRadius: 16, padding: 16, margin: 12, alignItems: 'center' },
  kinNum: { color: '#a7a2c9', fontSize: 13, fontWeight: '800', letterSpacing: 1 },
  kinName: { fontSize: 20, fontWeight: '900', marginTop: 4 },
  disclaimer: { color: '#8a86a8', fontSize: 11, lineHeight: 16, margin: 16 },
})
```

> Detalhar as seções seguindo exatamente os cards do `VedicProfileContent` (mesmos estilos/tokens). Oráculo: diagrama Guia(topo) / Antípoda–Destino–Análogo(meio) / Oculto(base), cada um `TouchableOpacity` → expande Kin+selo+tom+papel (textos de `TZOLKIN_ORACLE_ROLE_PT`). Glifo = círculo com cor + número do selo (placeholder).

- [ ] **Step 3: Verificar typecheck**

Comando: `npx tsc --noEmit -p tsconfig.json` (ou o script de type-check do projeto)
Esperado: sem erros novos em `TzolkinProfileContent.tsx`.

- [ ] **Step 4: Commit**

```bash
git add src/screens/cosmos/TzolkinProfileContent.tsx
git commit -m "feat(tzolkin): UI do perfil Meu Kin (cards + oráculo clicável)"
```

---

## Task 10: Integração no CosmosScreen (3ª aba)

**Arquivos:**
- Modificar: `src/screens/cosmos/CosmosScreen.tsx:257` (union + estado), toggle e branch de render

- [ ] **Step 1: Ler o toggle atual**

Comando: abrir `CosmosScreen.tsx`, achar `useState<'western' | 'vedic'>('western')` e o JSX dos dois botões de toggle + onde renderiza `VedicProfileContent`.

- [ ] **Step 2: Ampliar o union e o toggle**

```tsx
// linha ~257
const [mapMode, setMapMode] = useState<'western' | 'vedic' | 'tzolkin'>('western')
```

Adicionar o 3º botão ao lado de "Védico" (mesmo estilo dos existentes):

```tsx
<TouchableOpacity style={[toggleStyle, mapMode === 'tzolkin' && toggleActive]} onPress={() => setMapMode('tzolkin')}>
  <Text style={mapMode === 'tzolkin' ? toggleTxtActive : toggleTxt}>Tzolkin</Text>
</TouchableOpacity>
```

- [ ] **Step 3: Branch de render (gated por flag)**

```tsx
{mapMode === 'tzolkin' && TZOLKIN_ENABLED && birthDateISO && (
  <TzolkinProfileContent birthDateISO={birthDateISO} />
)}
```

Imports no topo:

```tsx
import TzolkinProfileContent from './TzolkinProfileContent'
const TZOLKIN_ENABLED = process.env.EXPO_PUBLIC_TZOLKIN_ENABLED !== '0' // default ligado; '0' desliga
```

> `birthDateISO`: derivar da mesma fonte que o VedicProfileContent usa (birthData do usuário, formato `YYYY-MM-DD`).

- [ ] **Step 4: Verificar typecheck**

Comando: `npx tsc --noEmit`
Esperado: sem erros novos.

- [ ] **Step 5: Commit**

```bash
git add src/screens/cosmos/CosmosScreen.tsx
git commit -m "feat(tzolkin): 3ª aba Tzolkin no Mapa (mapMode + toggle + flag)"
```

---

## Task 11: Home — badge do Kin do dia

**Arquivos:**
- Modificar: `src/components/MoonPhaseButton.tsx`

- [ ] **Step 1: Ler onde o símbolo do signo da Lua é mostrado**

Comando: abrir `MoonPhaseButton.tsx`, achar onde renderiza o símbolo do signo da Lua e o bloco Nakshatra (multi-sistema já existente ~linha 410).

- [ ] **Step 2: Adicionar o badge do Kin do dia**

```tsx
import { kinOfDate, getKinDisplayName, sealOf, SEALS, COLOR_LABELS } from '../astro/tzolkin'
const TZOLKIN_ENABLED = process.env.EXPO_PUBLIC_TZOLKIN_ENABLED !== '0'
// dentro do componente:
const todayKin = kinOfDate(new Date().toISOString().slice(0, 10))
const kinColor = COLOR_LABELS[SEALS[sealOf(todayKin) - 1].color].hex
// no JSX, ao lado do símbolo do signo da Lua:
{TZOLKIN_ENABLED && (
  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
    <View style={{ width: 18, height: 18, borderRadius: 9, backgroundColor: kinColor }} />
    <Text style={{ color: '#efedfb', fontSize: 12, fontWeight: '700' }}>Kin {todayKin} — {getKinDisplayName(todayKin, language)}</Text>
  </View>
)}
```

> Se o botão tem estado expansível, ao expandir mostrar também a relação do Kin de hoje com o Kin natal (comparar `getOracle(natalKin)` com `todayKin`: guia/análogo/antípoda/oculto/mesmo selo/mesmo tom).

- [ ] **Step 3: Verificar typecheck**

Comando: `npx tsc --noEmit`
Esperado: sem erros novos.

- [ ] **Step 4: Commit**

```bash
git add src/components/MoonPhaseButton.tsx
git commit -m "feat(tzolkin): badge do Kin do dia na Home ao lado da Lua"
```

---

## Task 12: Verificação final

- [ ] **Step 1: Rodar TODOS os testes do tzolkin**

Comando: `npx vitest run src/astro/tzolkin`
Esperado: todos PASS.

- [ ] **Step 2: Rodar a suíte de catálogos existente (garantir que nada quebrou)**

Comando (do CLAUDE.md):
```bash
cd frontend && npx vitest run src/utils/__tests__/transitCatalogCuratedCoverage.spec.ts src/utils/__tests__/astroInterpretationCatalog.spec.ts
```
Esperado: sem regressão.

- [ ] **Step 3: Typecheck geral**

Comando: `npx tsc --noEmit`
Esperado: sem erros novos introduzidos pelo Tzolkin.

- [ ] **Step 4: Commit final (se houver ajustes)**

```bash
git add -A && git commit -m "chore(tzolkin): verificação final Fase 1 verde"
```

---

## Self-Review
- **Cobertura da spec:** motor(§4) → Tasks 2-6; constantes(§5) → Task 5; curado(§6) → Tasks 7-8; UI(§8) → Tasks 9-10; Home(§9) → Task 11; flag(§11) → Tasks 10-11; testes(§13) → Tasks 2-6,12. ✅
- **Fora de escopo** (Match, 13 Luas, IA) não têm task — correto.
- **Tipos consistentes:** `TzolkinProfile`, `FifthForceOracle`, `buildProfile`, `getKinDisplayName`, `kinOfDate` usados igual entre tasks. ✅
- **Dados em massa** (20 selos/13 tons/textos ×4) são transcrição do prompt-fonte, não placeholders — a task diz exatamente o formato e a origem.
