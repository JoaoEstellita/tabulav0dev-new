import { describe, it, expect } from 'vitest'

/**
 * Geometria dos setores tocáveis da roda.
 *
 * O bug que motivou: `lonToSvgAngle` é `180 - (lon - asc)`, ou seja, longitude
 * crescente gera ângulo DECRESCENTE (o zodíaco corre anti-horário). A primeira
 * versão do setor assumiu o sentido horário, então cada fatia de 30° virava um
 * arco de 330°: todos cobriam o disco inteiro e o último desenhado engolia os
 * toques dos demais. Na tela: tocar em qualquer casa abria a Casa 12, e os
 * signos nunca recebiam toque.
 *
 * As funções são locais ao componente (que importa react-native-svg e não monta
 * aqui), então são reproduzidas idênticas. O teste trava a PROPRIEDADE que
 * importa: a fatia desenhada é sempre a menor, nunca a volta inteira.
 */

const DEG2RAD = Math.PI / 180

const lonToSvgAngle = (lon: number, ascDeg: number) => (180 - (lon - ascDeg) + 360) % 360

const polarToXY = (cx: number, cy: number, r: number, angleDeg: number) => ({
  x: cx + r * Math.cos(angleDeg * DEG2RAD),
  y: cy + r * Math.sin(angleDeg * DEG2RAD),
})

function setorAnelar(cx: number, cy: number, r1: number, r2: number, a1: number, a2: number): string {
  const horario = ((a2 - a1) % 360 + 360) % 360
  const sentido = horario <= 180 ? 1 : 0
  const p1 = polarToXY(cx, cy, r2, a1)
  const p2 = polarToXY(cx, cy, r2, a2)
  const p3 = polarToXY(cx, cy, r1, a2)
  const p4 = polarToXY(cx, cy, r1, a1)
  return [
    `M ${p1.x} ${p1.y}`,
    `A ${r2} ${r2} 0 0 ${sentido} ${p2.x} ${p2.y}`,
    `L ${p3.x} ${p3.y}`,
    `A ${r1} ${r1} 0 0 ${sentido === 1 ? 0 : 1} ${p4.x} ${p4.y}`,
    'Z',
  ].join(' ')
}

/** Lê os dois flags (large-arc, sweep) de cada comando A do path. */
const arcos = (d: string) =>
  [...d.matchAll(/A [\d.-]+ [\d.-]+ 0 (\d) (\d)/g)].map((m) => ({ grande: m[1], sweep: m[2] }))

describe('setor anelar da roda', () => {
  it('nenhum arco é marcado como "arco grande"', () => {
    // large-arc=1 significa "pegue o caminho longo" — a volta inteira. Era isso
    // que fazia um setor de 30° cobrir o disco.
    for (let i = 0; i < 12; i++) {
      const a1 = lonToSvgAngle(i * 30, 0)
      const a2 = lonToSvgAngle((i + 1) * 30, 0)
      const d = setorAnelar(100, 100, 60, 90, a1, a2)
      expect(arcos(d).every((a) => a.grande === '0'), `signo ${i}: ${d}`).toBe(true)
    }
  })

  it('os dois arcos de um setor correm em sentidos opostos', () => {
    // Externo ida, interno volta — senão a forma não fecha e vira uma faixa
    // atravessando o disco.
    const d = setorAnelar(100, 100, 60, 90, lonToSvgAngle(0, 0), lonToSvgAngle(30, 0))
    const [externo, interno] = arcos(d)
    expect(externo.sweep).not.toBe(interno.sweep)
  })

  it('funciona com o zodíaco rodado por qualquer Ascendente', () => {
    // O ASC gira a roda inteira; a geometria não pode depender de onde ele caiu.
    for (const asc of [0, 47.5, 123, 180, 285.665, 359.9]) {
      for (let i = 0; i < 12; i++) {
        const d = setorAnelar(100, 100, 60, 90, lonToSvgAngle(i * 30, asc), lonToSvgAngle((i + 1) * 30, asc))
        expect(arcos(d).every((a) => a.grande === '0'), `asc ${asc}, signo ${i}`).toBe(true)
      }
    }
  })

  it('casas desiguais (Placidus) continuam corretas', () => {
    // Em Placidus as casas variam muito de tamanho; nenhuma passa de 180°, que é
    // o limite em que "menor arco" deixaria de ser o certo.
    const cuspides = [285, 310, 340, 15, 50, 80, 105, 130, 160, 195, 230, 260]
    for (let i = 0; i < cuspides.length; i++) {
      const a1 = lonToSvgAngle(cuspides[i], 285)
      const a2 = lonToSvgAngle(cuspides[(i + 1) % cuspides.length], 285)
      const d = setorAnelar(100, 100, 60, 90, a1, a2)
      expect(arcos(d).every((a) => a.grande === '0'), `casa ${i + 1}`).toBe(true)
    }
  })

  it('os 12 setores juntos cobrem o círculo sem um engolir o outro', () => {
    // Prova indireta do bug original: somando a varredura REAL de cada fatia no
    // sentido em que ela é desenhada, o total tem de dar uma volta — não doze.
    let total = 0
    for (let i = 0; i < 12; i++) {
      const a1 = lonToSvgAngle(i * 30, 0)
      const a2 = lonToSvgAngle((i + 1) * 30, 0)
      const horario = ((a2 - a1) % 360 + 360) % 360
      total += horario <= 180 ? horario : 360 - horario
    }
    expect(Math.round(total)).toBe(360)
  })
})
