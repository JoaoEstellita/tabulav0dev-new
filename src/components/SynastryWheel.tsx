import React from 'react'
import { View, Text } from 'react-native'
import Svg, { Circle, Line, G, Text as SvgText, Path } from 'react-native-svg'

/**
 * Roda de sinastria (bi-wheel): anel externo = "você", anel interno = o outro.
 * As linhas do centro são os aspectos entre os dois mapas, coloridas pelo tom.
 * Só VIEW — consome longitudes já calculadas ({ planetEn, longitude }). Reusada
 * no card do Match e na leitura de dupla dos Grupos.
 */
export type WheelPos = { planetEn: string; longitude: number }
export type WheelAspect = { mine: string; theirs: string; labelPt?: string; type?: string; orb?: number }

const GLYPH: Record<string, string> = {
  sun: '☉', moon: '☽', mercury: '☿', venus: '♀', mars: '♂',
  jupiter: '♃', saturn: '♄', uranus: '♅', neptune: '♆', pluto: '♇',
  lilith: '⚸', northnode: '☊', southnode: '☋', chiron: '⚷',
}
const SIGN_GLYPH = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓']
const norm = (s: string) => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
const TONE: Record<string, string> = {
  conjuncao: '#FFD700', conjunction: '#FFD700',
  sextil: '#22C55E', sextile: '#22C55E', trigono: '#4A90E2', trine: '#4A90E2',
  quadratura: '#EF4444', square: '#EF4444', oposicao: '#F59E0B', opposition: '#F59E0B',
}

// Longitude eclíptica → ângulo de tela. 0° Áries à esquerda, crescendo anti-horário.
const rad = (lon: number) => ((180 - lon) * Math.PI) / 180
const px = (cx: number, cy: number, r: number, lon: number) => ({ x: cx + r * Math.cos(rad(lon)), y: cy - r * Math.sin(rad(lon)) })

// Espalha glifos que caem quase na mesma longitude (evita sobreposição).
function spread(list: WheelPos[]): (WheelPos & { r: number })[] {
  const sorted = [...list].filter((p) => Number.isFinite(p.longitude)).sort((a, b) => a.longitude - b.longitude)
  return sorted.map((p, i) => {
    const prev = sorted[i - 1]
    const near = prev && Math.abs(p.longitude - prev.longitude) < 8
    return { ...p, r: near ? 1 : 0 }
  })
}

export default function SynastryWheel({
  outer, inner, aspects = [], size = 280, outerLabel, innerLabel,
}: { outer: WheelPos[]; inner: WheelPos[]; aspects?: WheelAspect[]; size?: number; outerLabel?: string; innerLabel?: string }) {
  const cx = size / 2
  const cy = size / 2
  const rZodiac = size / 2 - 4
  const rInnerZodiac = rZodiac - 20
  const rOuterGlyph = rZodiac - 34   // "você"
  const rInnerGlyph = rInnerZodiac - 30 // o outro
  const rAspOuter = rInnerGlyph - 14
  const rAspInner = rAspOuter

  const outerS = spread(outer)
  const innerS = spread(inner)
  const byKey = (arr: WheelPos[], k: string) => arr.find((p) => p.planetEn === k)

  return (
    <View style={{ alignItems: 'center' }}>
      <Svg width={size} height={size}>
        {/* anéis do zodíaco */}
        <Circle cx={cx} cy={cy} r={rZodiac} stroke="rgba(255,255,255,0.16)" strokeWidth={1} fill="none" />
        <Circle cx={cx} cy={cy} r={rInnerZodiac} stroke="rgba(255,255,255,0.12)" strokeWidth={1} fill="none" />
        <Circle cx={cx} cy={cy} r={rAspOuter} stroke="rgba(255,255,255,0.06)" strokeWidth={1} fill="none" />
        {/* 12 divisões + glifo do signo */}
        {Array.from({ length: 12 }).map((_, i) => {
          const a = px(cx, cy, rZodiac, i * 30)
          const b = px(cx, cy, rInnerZodiac, i * 30)
          const g = px(cx, cy, (rZodiac + rInnerZodiac) / 2, i * 30 + 15)
          return (
            <G key={'z' + i}>
              <Line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="rgba(255,255,255,0.14)" strokeWidth={1} />
              <SvgText x={g.x} y={g.y + 4} fontSize={11} fill="#8892a4" textAnchor="middle">{SIGN_GLYPH[i]}</SvgText>
            </G>
          )
        })}
        {/* linhas de aspecto (centro) */}
        {aspects.map((asp, i) => {
          const pa = byKey(outer, asp.mine)
          const pb = byKey(inner, asp.theirs)
          if (!pa || !pb) return null
          const t = norm(asp.labelPt || asp.type || '')
          const color = TONE[t]
          if (!color) return null
          const A = px(cx, cy, rAspOuter, pa.longitude)
          const B = px(cx, cy, rAspInner, pb.longitude)
          return <Line key={'a' + i} x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke={color} strokeWidth={1.1} opacity={0.72} />
        })}
        {/* planetas externos (você, magenta) */}
        {outerS.map((p, i) => {
          const pos = px(cx, cy, rOuterGlyph - p.r * 15, p.longitude)
          return <SvgText key={'o' + i} x={pos.x} y={pos.y + 5} fontSize={14} fill="#d6409f" textAnchor="middle">{GLYPH[p.planetEn] || '·'}</SvgText>
        })}
        {/* planetas internos (o outro, dourado) */}
        {innerS.map((p, i) => {
          const pos = px(cx, cy, rInnerGlyph - p.r * 15, p.longitude)
          return <SvgText key={'i' + i} x={pos.x} y={pos.y + 5} fontSize={14} fill="#e8b84b" textAnchor="middle">{GLYPH[p.planetEn] || '·'}</SvgText>
        })}
      </Svg>
      <View style={{ flexDirection: 'row', gap: 16, marginTop: 4 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
          <View style={{ width: 9, height: 9, borderRadius: 5, backgroundColor: '#d6409f' }} />
          <Text style={{ color: '#8892a4', fontSize: 11 }}>{outerLabel || 'Você'}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
          <View style={{ width: 9, height: 9, borderRadius: 5, backgroundColor: '#e8b84b' }} />
          <Text style={{ color: '#8892a4', fontSize: 11 }}>{innerLabel || ''}</Text>
        </View>
      </View>
    </View>
  )
}
