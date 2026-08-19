import React from "react"
import { ScrollView, View, Text } from "react-native"
import Svg, { Rect, Text as SvgText } from "react-native-svg"

/**
 * Grade de aspectos (aspectarian) — matriz triangular planeta×planeta. Layout
 * clássico: o glifo do planeta fica na DIAGONAL e cada célula à esquerda traz o
 * aspecto entre a linha e a coluna. Só VIEW: consome os aspectos que a roda já
 * calculou. Sem estado.
 *
 * Decisões (feedback do João "incompleta e fora"):
 * - Só entram planetas que participam de ≥1 aspecto → sem linhas/colunas vazias.
 * - Centralização MANUAL do texto (react-native-svg ignora alignmentBaseline no
 *   web → antes o glifo subia pro topo da célula).
 * - Legenda embaixo com os aspectos presentes → o usuário entende os símbolos.
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

export default function AspectGrid({ planets, aspects }: { planets: PlanetLike[]; aspects: AspectLike[] }) {
  const list = aspects || []
  const key = (a: string, b: string) => [a, b].sort().join("|")

  // Índice de aspecto por par + conjunto de planetas realmente envolvidos.
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

  const cell = 30
  const pad = 2
  const n = names.length
  const W = pad * 2 + n * cell
  const H = pad * 2 + n * cell

  // Aspectos presentes (pra legenda), na ordem canônica.
  const presentSet = new Set(list.map((a) => norm(a.type)).filter((t) => ASPECT_SYM[t]))
  const present = ["conjuncao", "sextil", "quadratura", "trigono", "oposicao", "quincuncio"].filter((t) => presentSet.has(t))

  return (
    <View>
      <ScrollView horizontal showsHorizontalScrollIndicator contentContainerStyle={{ paddingHorizontal: 8 }}>
        <Svg width={W} height={H}>
          {names.map((rowName, i) => {
            const top = pad + i * cell
            return (
              <React.Fragment key={`row-${rowName}`}>
                {/* células de aspecto: colunas 0..i-1 (à esquerda da diagonal) */}
                {names.slice(0, i).map((colName, j) => {
                  const left = pad + j * cell
                  const asp = byPair.get(key(rowName, colName))
                  const t = asp ? norm(asp.type) : ""
                  const sym = asp ? ASPECT_SYM[t] : ""
                  const hasOrb = asp && typeof asp.orb === "number"
                  return (
                    <React.Fragment key={`c-${i}-${j}`}>
                      <Rect x={left} y={top} width={cell} height={cell} fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.10)" strokeWidth={0.5} />
                      {sym ? (
                        <SvgText
                          x={left + cell / 2}
                          y={top + (hasOrb ? 14 : 19)}
                          fontSize={14}
                          fill={ASPECT_TONE[t] || "#ccc"}
                          textAnchor="middle"
                        >
                          {sym}
                        </SvgText>
                      ) : null}
                      {hasOrb ? (
                        <SvgText x={left + cell / 2} y={top + 25} fontSize={8} fill="#6a7288" textAnchor="middle">
                          {Math.round(asp!.orb as number)}°
                        </SvgText>
                      ) : null}
                    </React.Fragment>
                  )
                })}
                {/* diagonal: glifo do planeta (destaque dourado) */}
                <Rect x={pad + i * cell} y={top} width={cell} height={cell} fill="rgba(255,215,0,0.10)" stroke="rgba(255,215,0,0.30)" strokeWidth={0.6} />
                <SvgText x={pad + i * cell + cell / 2} y={top + 20} fontSize={15} fill="#FFD700" textAnchor="middle">
                  {PLANET_SYMBOLS[rowName] || rowName.slice(0, 2)}
                </SvgText>
              </React.Fragment>
            )
          })}
        </Svg>
      </ScrollView>

      {/* Legenda dos aspectos presentes */}
      {present.length > 0 ? (
        <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center", paddingHorizontal: 12, paddingTop: 10, columnGap: 12, rowGap: 6 }}>
          {present.map((t) => (
            <View key={`lg-${t}`} style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
              <Text style={{ color: ASPECT_TONE[t] || "#ccc", fontSize: 13 }}>{ASPECT_SYM[t]}</Text>
              <Text style={{ color: "#9aa2b8", fontSize: 11 }}>{ASPECT_LABEL[t] || t}</Text>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  )
}
