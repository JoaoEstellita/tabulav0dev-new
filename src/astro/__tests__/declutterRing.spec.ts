import { describe, it, expect } from 'vitest'
import { declutterRing, lonToSvgAngle, angShort } from '../declutterRing'

/**
 * O glifo nunca pode sair da própria longitude.
 *
 * Bug real, relatado olhando a tela: "Júpiter parece estar na Casa 1, mas está
 * na 2". A anti-colisão abria os aglomerados em ÂNGULO quando o afastamento
 * radial batia no limite:
 *
 *     angulo[i + k] = trueAngle + (k - (n - 1) / 2) * (glyphDeg * 0.85)
 *
 * Com glyphDeg ~18,5°, cada posição andava ~15,7°; um grupo de três espalhava
 * mais de 31° — mais que uma casa inteira. A roda passava a afirmar que um
 * planeta estava num signo e numa casa onde ele não está, e nada acusava:
 * o desenho fica até mais bonito, porque os glifos não se tocam.
 *
 * É a classe de bug mais cara do projeto — resposta errada, plausível, sem
 * erro. Por isso o ângulo é testado como invariante, não como detalhe.
 */

const planeta = (longitude: number) => ({ longitude })

/** Posição angular do glifo desenhado, a partir de x/y. */
const anguloDesenhado = (p: { sx: number; sy: number }, cx = 200, cy = 200) => {
  const g = (Math.atan2(p.sy - cy, p.sx - cx) * 180) / Math.PI
  return (g + 360) % 360
}

describe('anti-colisão: o ângulo é inviolável', () => {
  it('glifo é desenhado EXATAMENTE na longitude dele', () => {
    const r = declutterRing([planeta(10), planeta(120), planeta(250)], 0, 200, 200, 80, 40, 110, 10, 18)
    for (const p of r) {
      expect(anguloDesenhado(p)).toBeCloseTo(p.trueAngle, 6)
    }
  })

  it('AGLOMERADO apertado não desloca ninguém em ângulo', () => {
    // Três planetas a 2° um do outro: o caso que fazia a versão antiga abrir
    // em ângulo. A faixa radial é estreita de propósito para FORÇAR o clamp —
    // era exatamente aí que o deslocamento angular entrava.
    const longs = [100, 102, 104]
    const r = declutterRing(longs.map(planeta), 0, 200, 200, 80, 78, 82, 10, 18)
    for (const p of r) {
      expect(
        angShort(anguloDesenhado(p), p.trueAngle),
        `glifo saiu da própria longitude (long ${(p as any).longitude})`,
      ).toBeLessThan(0.001)
    }
  })

  it('nenhum glifo cruza o limite de uma casa (30°)', () => {
    // A prova direta do relato: com 10 planetas amontoados, nenhum pode
    // aparecer a mais de alguns minutos de arco da posição real.
    const longs = Array.from({ length: 10 }, (_, i) => 100 + i * 1.5)
    const r = declutterRing(longs.map(planeta), 0, 200, 200, 80, 76, 84, 8, 20)
    const desvios = r.map((p) => angShort(anguloDesenhado(p), p.trueAngle))
    expect(Math.max(...desvios), 'qualquer desvio angular é erro de casa em potencial').toBeLessThan(0.001)
  })

  it('o ângulo acompanha o Ascendente', () => {
    const asc = 123.4
    const r = declutterRing([planeta(10)], asc, 200, 200, 80, 40, 110, 10, 18)
    expect(r[0].trueAngle).toBeCloseTo(lonToSvgAngle(10, asc), 10)
  })
})

describe('anti-colisão: o raio é quem abre espaço', () => {
  it('planetas próximos ganham raios diferentes', () => {
    const r = declutterRing([planeta(100), planeta(102)], 0, 200, 200, 80, 40, 120, 10, 18)
    expect(r[0].radius).not.toBe(r[1].radius)
  })

  it('planetas distantes ficam todos no raio padrão', () => {
    const r = declutterRing([planeta(0), planeta(90), planeta(180)], 0, 200, 200, 80, 40, 120, 10, 18)
    for (const p of r) expect(p.radius).toBe(80)
  })

  it('o raio nunca sai da faixa — nem invade o zodíaco nem o miolo', () => {
    const longs = Array.from({ length: 8 }, (_, i) => 100 + i)
    const r = declutterRing(longs.map(planeta), 0, 200, 200, 80, 70, 90, 10, 20)
    for (const p of r) {
      expect(p.radius).toBeGreaterThanOrEqual(70)
      expect(p.radius).toBeLessThanOrEqual(90)
    }
  })

  it('o aglomerado fica centrado no raio padrão', () => {
    // Sem isso o grupo inteiro "desce" ou "sobe" e o anel perde o alinhamento.
    const r = declutterRing([planeta(100), planeta(101), planeta(102)], 0, 200, 200, 80, 40, 120, 10, 18)
    const raios = r.map((p) => p.radius).sort((a, b) => a - b)
    expect(raios).toEqual([70, 80, 90])
  })
})

describe('bordas', () => {
  it('lista vazia não quebra', () => {
    expect(declutterRing([], 0, 200, 200, 80, 40, 120, 10, 18)) .toEqual([])
  })

  it('preserva os campos do item original', () => {
    const r = declutterRing([{ longitude: 10, name: 'Sun' }], 0, 200, 200, 80, 40, 120, 10, 18)
    expect((r[0] as any).name).toBe('Sun')
  })

  it('a volta de 360° não separa vizinhos', () => {
    // 359° e 1° são vizinhos; tratá-los como distantes deixaria os glifos
    // sobrepostos justamente na borda.
    const r = declutterRing([planeta(359), planeta(1)], 0, 200, 200, 80, 40, 120, 10, 18)
    expect(r[0].radius).not.toBe(r[1].radius)
  })
})
