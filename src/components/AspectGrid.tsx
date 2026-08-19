import React from "react"
import { ScrollView } from "react-native"
import Svg, { Rect, Line, Text as SvgText } from "react-native-svg"

/**
 * Grade de aspectos (aspectarian) — matriz triangular planeta×planeta com o glifo
 * do aspecto + orbe em cada célula. Estilo clássico (o 2º print do João). Só VIEW:
 * consome os aspectos que a roda já tem (aspectsNatalToNatal). Sem estado.
 */
type PlanetLike = { name: string; longitude?: number }
type AspectLike = { planet1: string; planet2: string; type: string; orb?: number }

const PLANET_SYMBOLS: Record<string, string> = {
  Sun: "☉", Moon: "☽", Mercury: "☿", Venus: "♀", Mars: "♂",
  Jupiter: "♃", Saturn: "♄", Uranus: "♅", Neptune: "♆", Pluto: "♇", Lilith: "⚸",
}
const PLANET_ORDER = ["Sun", "Moon", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto", "Lilith"]
const ASPECT_SYM: Record<string, string> = {
  conjunction: "☌", sextile: "⚹", square: "□", trine: "△", opposition: "☍", quincunx: "⚻",
}
const ASPECT_TONE: Record<string, string> = {
  conjunction: "#FFD700", sextile: "#22C55E", trine: "#4A90E2", square: "#EF4444", opposition: "#F59E0B", quincunx: "#B39DDB",
}

export default function AspectGrid({ planets, aspects }: { planets: PlanetLike[]; aspects: AspectLike[] }) {
  const names = PLANET_ORDER.filter((n) => planets.some((p) => p.name === n))
  if (names.length < 2) return null

  // Índice de aspecto por par (ordem-insensível).
  const key = (a: string, b: string) => [a, b].sort().join("|")
  const byPair = new Map<string, AspectLike>()
  for (const a of aspects || []) {
    if (a && a.planet1 && a.planet2) byPair.set(key(a.planet1, a.planet2), a)
  }

  const cell = 26
  const pad = 6
  const n = names.length
  // Triângulo inferior: linha i (planeta i) tem i colunas (pares com anteriores).
  const gridW = pad + cell + n * cell + pad
  const gridH = pad + cell + n * cell + pad

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator contentContainerStyle={{ paddingHorizontal: 8 }}>
      <Svg width={gridW} height={gridH}>
        {/* cabeçalho de colunas (glifos) — só as que têm célula (0..n-2) */}
        {names.slice(0, n - 1).map((nm, j) => (
          <SvgText key={`col${nm}`} x={pad + cell + j * cell + cell / 2} y={pad + cell / 2 + 4}
            fontSize={14} fill="#c9cfe0" textAnchor="middle">{PLANET_SYMBOLS[nm] || nm.slice(0, 2)}</SvgText>
        ))}
        {/* linhas */}
        {names.map((rowName, i) => {
          const y = pad + cell + i * cell
          return (
            <React.Fragment key={`row${rowName}`}>
              {/* glifo da linha */}
              <SvgText x={pad + cell / 2} y={y + cell / 2 + 4} fontSize={14} fill="#c9cfe0" textAnchor="middle">
                {PLANET_SYMBOLS[rowName] || rowName.slice(0, 2)}
              </SvgText>
              {/* células: colunas 0..i-1 */}
              {names.slice(0, i).map((colName, j) => {
                const x = pad + cell + j * cell
                const asp = byPair.get(key(rowName, colName))
                const t = asp ? String(asp.type || "").toLowerCase() : ""
                return (
                  <React.Fragment key={`c${i}-${j}`}>
                    <Rect x={x} y={y} width={cell} height={cell} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={0.5} />
                    {asp && ASPECT_SYM[t] ? (
                      <>
                        <SvgText x={x + cell / 2} y={y + cell / 2} fontSize={12} fill={ASPECT_TONE[t] || "#ccc"} textAnchor="middle" alignmentBaseline="middle">
                          {ASPECT_SYM[t]}
                        </SvgText>
                        {typeof asp.orb === "number" ? (
                          <SvgText x={x + cell / 2} y={y + cell - 3} fontSize={7} fill="#6a7288" textAnchor="middle">
                            {Math.round(asp.orb)}°
                          </SvgText>
                        ) : null}
                      </>
                    ) : null}
                  </React.Fragment>
                )
              })}
            </React.Fragment>
          )
        })}
      </Svg>
    </ScrollView>
  )
}
