// Imagens dos 20 selos solares. Chave = número do selo (1..20).
// VAZIO por enquanto → a UI usa o placeholder (cor + número).
//
// Quando as imagens chegarem, coloque os arquivos em `src/assets/tzolkin/seals/`
// (ex.: 1.png ... 20.png) e preencha o mapa:
//
//   export const SEAL_GLYPHS: Record<number, any> = {
//     1: require('./seals/1.png'), 2: require('./seals/2.png'), ... 20: require('./seals/20.png'),
//   }
//
// Formato ideal: PNG quadrado com fundo transparente, ~256×256. Direitos de uso
// próprios/licenciados (não copiar de sites protegidos).
export const SEAL_GLYPHS: Record<number, any> = {}

export function hasGlyph(seal: number): boolean { return !!SEAL_GLYPHS[seal] }
