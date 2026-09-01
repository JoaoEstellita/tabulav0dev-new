// Glifos Tzolkin (SVG). Os dados (XML) vêm de glyphData.ts (gerado dos arquivos
// em seals/). Renderizar com <SvgXml xml={SEAL_SVG[n]} /> (react-native-svg).
export { SEAL_SVG, TONE_SVG } from './glyphData'
import { SEAL_SVG, TONE_SVG } from './glyphData'

export function hasSealGlyph(seal: number): boolean { return !!SEAL_SVG[seal] }
export function hasToneGlyph(tone: number): boolean { return !!TONE_SVG[tone] }
