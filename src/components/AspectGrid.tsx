import React from "react"
import { ScrollView, View, Text } from "react-native"
import Svg, { Rect, Text as SvgText } from "react-native-svg"

/**
 * Grade de aspectos (aspectarian). Dois modos:
 *
 * - NATAL (default): matriz triangular planeta×planeta com o glifo do planeta na
 *   DIAGONAL e o aspecto natal↔natal em cada célula à esquerda.
 * - CROSS (trânsitos): matriz RETANGULAR — linhas = planetas em trânsito,
 *   colunas = planetas natais, cada célula = aspecto trânsito→natal.
 *
 * Só VIEW: consome os aspectos que a roda já calculou. Sem estado. O conteúdo é
 * centralizado (feedback "grade ficou fora"); só planetas com ≥1 aspecto entram
 * (sem linhas/colunas vazias); texto centralizado à mão (rn-svg ignora
 * alignmentBaseline no web).
 */
type PlanetLike = { name: string; longitude?: number }
type AspectLike = { planet1: string; planet2: string; type: string; orb?: number }

const PLANET_SYMBOLS: Record<string, string> = {
  Sun: "☉", Moon: "☽", Mercury: "☿", Venus: "♀", Mars: "♂",
  Jupiter: "♃", Saturn: "♄", Uranus: "♅", Neptune: "♆", Pluto: "♇", Lilith: "⚸",
}
const PLANET_ORDER = ["Sun", "Moon", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto", "Lilith"]

// type vem em PT ("conjunção", "trígono"…) OU EN — normaliza e cobre ambos.
const norm = (s: string) => String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
const ASPECT_SYM: Record<string, string> = {
  conjuncao: "☌", conjunction: "☌",
  sextil: "⚹", sextile: "⚹",
  quadratura: "□", square: "□",
  trigono: "△", trine: "△",
  oposicao: "☍", opposition: "☍",
  quincuncio: "⚻", quincunx: "⚻",
}
const ASPECT_TONE: Record<string, string> = {
  conjuncao: "#FFD700", conjunction: "#FFD700",
  sextil: "#22C55E", sextile: "#22C55E",
  trigono: "#4A90E2", trine: "#4A90E2",
  quadratura: "#EF4444", square: "#EF4444",
  oposicao: "#F59E0B", opposition: "#F59E0B",
  quincuncio: "#B39DDB", quincunx: "#B39DDB",
}
const ASPECT_LABEL: Record<string, string> = {
  conjuncao: "Conjunção", sextil: "Sextil", quadratura: "Quadratura",
  trigono: "Trígono", oposicao: "Oposição", quincuncio: "Quincúncio",
}

const CELL = 30

const glyphOf = (name: string) => PLANET_SYMBOLS[name] || name.slice(0, 2)

// ScrollView horizontal que centraliza quando cabe e rola quando não cabe.
const centeredScroll = { flexGrow: 1, justifyContent: "center" as const, alignItems: "center" as const, paddingHorizontal: 8 }

function AspectLegend({ present, extra }: { present: string[]; extra?: React.ReactNode }) {
  if (present.length === 0 && !extra) return null
  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center", alignItems: "center", paddingHorizontal: 12, paddingTop: 10, columnGap: 12, rowGap: 6 }}>
      {present.map((t) => (
        <View key={`lg-${t}`} style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <Text style={{ color: ASPECT_TONE[t] || "#ccc", fontSize: 13 }}>{ASPECT_SYM[t]}</Text>
          <Text style={{ color: "#9aa2b8", fontSize: 11 }}>{ASPECT_LABEL[t] || t}</Text>
        </View>
      ))}
      {extra}
    </View>
  )
}

function presentAspects(list: AspectLike[]): string[] {
  const set = new Set(list.map((a) => norm(a.type)).filter((t) => ASPECT_SYM[t]))
  return ["conjuncao", "sextil", "quadratura", "trigono", "oposicao", "quincuncio"].filter((t) => set.has(t))
}

// Texto do aspecto (glifo + orbe) centralizado numa célula.
function AspectCell({ left, top, asp }: { left: number; top: number; asp: AspectLike | undefined }) {
  if (!asp) return null
  const t = norm(asp.type)
  const sym = ASPECT_SYM[t]
  if (!sym) return null
  const hasOrb = typeof asp.orb === "number"
  return (
    <>
      <SvgText x={left + CELL / 2} y={top + (hasOrb ? 14 : 19)} fontSize={14} fill={ASPECT_TONE[t] || "#ccc"} textAnchor="middle">
        {sym}
      </SvgText>
      {hasOrb ? (
        <SvgText x={left + CELL / 2} y={top + 25} fontSize={8} fill="#6a7288" textAnchor="middle">
          {Math.round(asp.orb as number)}°
        </SvgText>
      ) : null}
    </>
  )
}

// -------------------------------------------------------------------------
// NATAL — triangular (glifo na diagonal)
// -------------------------------------------------------------------------
function TriGrid({ planets, aspects }: { planets: PlanetLike[]; aspects: AspectLike[] }) {
  const list = aspects || []
  const key = (a: string, b: string) => [a, b].sort().join("|")
  const byPair = new Map<string, AspectLike>()
  const involved = new Set<string>()
  for (const a of list) {
    if (a && a.planet1 && a.planet2 && ASPECT_SYM[norm(a.type)]) {
      byPair.set(key(a.planet1, a.planet2), a)
      involved.add(a.planet1)
      involved.add(a.planet2)
    }
  }
  const names = PLANET_ORDER.filter((n) => planets.some((p) => p.name === n) && involved.has(n))
  if (names.length < 2) return null

  const pad = 2
  const n = names.length
  const W = pad * 2 + n * CELL
  const H = pad * 2 + n * CELL

  return (
    <View>
      <ScrollView horizontal showsHorizontalScrollIndicator contentContainerStyle={centeredScroll}>
        <Svg width={W} height={H}>
          {names.map((rowName, i) => {
            const top = pad + i * CELL
            return (
              <React.Fragment key={`row-${rowName}`}>
                {names.slice(0, i).map((colName, j) => {
                  const left = pad + j * CELL
                  const asp = byPair.get(key(rowName, colName))
                  return (
                    <React.Fragment key={`c-${i}-${j}`}>
                      <Rect x={left} y={top} width={CELL} height={CELL} fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.10)" strokeWidth={0.5} />
                      <AspectCell left={left} top={top} asp={asp} />
                    </React.Fragment>
                  )
                })}
                {/* diagonal: glifo do planeta (destaque dourado) */}
                <Rect x={pad + i * CELL} y={top} width={CELL} height={CELL} fill="rgba(255,215,0,0.10)" stroke="rgba(255,215,0,0.30)" strokeWidth={0.6} />
                <SvgText x={pad + i * CELL + CELL / 2} y={top + 20} fontSize={15} fill="#FFD700" textAnchor="middle">
                  {glyphOf(rowName)}
                </SvgText>
              </React.Fragment>
            )
          })}
        </Svg>
      </ScrollView>
      <AspectLegend present={presentAspects(list)} />
    </View>
  )
}

// -------------------------------------------------------------------------
// TRÂNSITOS — retangular (linha = trânsito, coluna = natal)
// -------------------------------------------------------------------------
const ROW_TONE = "#67E8F9" // trânsito (ciano)
const COL_TONE = "#FFD700" // natal (dourado)

function CrossGrid({ rowPlanets, colPlanets, aspects }: { rowPlanets: PlanetLike[]; colPlanets: PlanetLike[]; aspects: AspectLike[] }) {
  const list = aspects || []
  const byCell = new Map<string, AspectLike>() // chave `${transito}>${natal}`
  const rowInv = new Set<string>()
  const colInv = new Set<string>()
  for (const a of list) {
    if (a && a.planet1 && a.planet2 && ASPECT_SYM[norm(a.type)]) {
      byCell.set(`${a.planet1}>${a.planet2}`, a)
      rowInv.add(a.planet1)
      colInv.add(a.planet2)
    }
  }
  const rows = PLANET_ORDER.filter((n) => rowPlanets.some((p) => p.name === n) && rowInv.has(n))
  const cols = PLANET_ORDER.filter((n) => colPlanets.some((p) => p.name === n) && colInv.has(n))
  if (rows.length < 1 || cols.length < 1) return null

  const pad = 2
  const hdr = CELL // faixa de cabeçalho (linha superior + coluna esquerda)
  const W = pad * 2 + hdr + cols.length * CELL
  const H = pad * 2 + hdr + rows.length * CELL

  return (
    <View>
      <ScrollView horizontal showsHorizontalScrollIndicator contentContainerStyle={centeredScroll}>
        <Svg width={W} height={H}>
          {/* canto */}
          <Rect x={pad} y={pad} width={hdr} height={hdr} fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.08)" strokeWidth={0.5} />
          {/* cabeçalho de colunas (natal, dourado) */}
          {cols.map((c, j) => {
            const left = pad + hdr + j * CELL
            return (
              <React.Fragment key={`col-${c}`}>
                <Rect x={left} y={pad} width={CELL} height={hdr} fill="rgba(255,215,0,0.08)" stroke="rgba(255,215,0,0.25)" strokeWidth={0.5} />
                <SvgText x={left + CELL / 2} y={pad + 20} fontSize={15} fill={COL_TONE} textAnchor="middle">{glyphOf(c)}</SvgText>
              </React.Fragment>
            )
          })}
          {/* cabeçalho de linhas (trânsito, ciano) + corpo */}
          {rows.map((r, i) => {
            const top = pad + hdr + i * CELL
            return (
              <React.Fragment key={`row-${r}`}>
                <Rect x={pad} y={top} width={hdr} height={CELL} fill="rgba(103,232,249,0.08)" stroke="rgba(103,232,249,0.25)" strokeWidth={0.5} />
                <SvgText x={pad + hdr / 2} y={top + 20} fontSize={15} fill={ROW_TONE} textAnchor="middle">{glyphOf(r)}</SvgText>
                {cols.map((c, j) => {
                  const left = pad + hdr + j * CELL
                  const asp = byCell.get(`${r}>${c}`)
                  return (
                    <React.Fragment key={`x-${i}-${j}`}>
                      <Rect x={left} y={top} width={CELL} height={CELL} fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.10)" strokeWidth={0.5} />
                      <AspectCell left={left} top={top} asp={asp} />
                    </React.Fragment>
                  )
                })}
              </React.Fragment>
            )
          })}
        </Svg>
      </ScrollView>
      <AspectLegend
        present={presentAspects(list)}
        extra={
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginLeft: 4 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
              <Text style={{ color: ROW_TONE, fontSize: 13 }}>●</Text>
              <Text style={{ color: "#9aa2b8", fontSize: 11 }}>trânsito (linha)</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
              <Text style={{ color: COL_TONE, fontSize: 13 }}>●</Text>
              <Text style={{ color: "#9aa2b8", fontSize: 11 }}>natal (coluna)</Text>
            </View>
          </View>
        }
      />
    </View>
  )
}

// -------------------------------------------------------------------------
type AspectGridProps =
  | { cross?: false; planets: PlanetLike[]; aspects: AspectLike[]; rowPlanets?: undefined; colPlanets?: undefined }
  | { cross: true; rowPlanets: PlanetLike[]; colPlanets: PlanetLike[]; aspects: AspectLike[]; planets?: undefined }

export default function AspectGrid(props: AspectGridProps) {
  if (props.cross) {
    return <CrossGrid rowPlanets={props.rowPlanets} colPlanets={props.colPlanets} aspects={props.aspects} />
  }
  return <TriGrid planets={props.planets} aspects={props.aspects} />
}
