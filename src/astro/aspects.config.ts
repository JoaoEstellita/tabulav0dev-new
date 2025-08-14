import { AspectsConfig } from './aspects.types'

// Config conforme solicitado: orbes por planeta e aspecto
const aspectsConfig: AspectsConfig = {
  aspects: [
    { name: 'conjunção', angle: 0, baseOrb: 9 },
    { name: 'oposição', angle: 180, baseOrb: 9 },
    { name: 'trígono', angle: 120, baseOrb: 8 },
    { name: 'quadratura', angle: 90, baseOrb: 6 },
    { name: 'sextil', angle: 60, baseOrb: 5 },
    { name: 'quincúncio', angle: 150, baseOrb: 5 },
    { name: 'semissextil', angle: 30, baseOrb: 3 },
    { name: 'semiquadratura', angle: 45, baseOrb: 2 },
    { name: 'sesquiquadratura', angle: 135, baseOrb: 2 },
  ],
  maxOrbCap: 12,
  // Orbes específicos por planeta e aspecto (graus)
  // Se um planeta não estiver listado, usa baseOrb
  planetAspectOrbs: {
    // 1) Sol e Lua (luminares)
    Sun:   { 0: 9, 180: 9, 120: 8, 90: 6, 60: 5, 150: 5, 30: 3 },
    Moon:  { 0: 9, 180: 9, 120: 8, 90: 6, 60: 5, 150: 5, 30: 3 },
    // 2) Mercúrio, Vênus e Júpiter (7/9 dos luminares → arredondado conforme pedido)
    Mercury: { 0: 7, 180: 7, 120: 6.2222, 90: 4.6667, 60: 3.8889, 150: 3.8889, 30: 2.3333 },
    Venus:   { 0: 7, 180: 7, 120: 6.2222, 90: 4.6667, 60: 3.8889, 150: 3.8889, 30: 2.3333 },
    Jupiter: { 0: 7, 180: 7, 120: 6.2222, 90: 4.6667, 60: 3.8889, 150: 3.8889, 30: 2.3333 },
    // 3) Marte e Saturno (6/9 dos luminares)
    Mars:   { 0: 6, 180: 6, 120: 5.3333, 90: 4, 60: 3.3333, 150: 3.3333, 30: 2 },
    Saturn: { 0: 6, 180: 6, 120: 5.3333, 90: 4, 60: 3.3333, 150: 3.3333, 30: 2 },
    // 4) Urano, Netuno e Plutão (transpessoais)
    Uranus:  { 0: 5, 180: 5, 120: 4, 90: 3, 60: 2, 150: 2, 30: 1, 45: 1, 135: 1 },
    Neptune: { 0: 5, 180: 5, 120: 4, 90: 3, 60: 2, 150: 2, 30: 1, 45: 1, 135: 1 },
    Pluto:   { 0: 5, 180: 5, 120: 4, 90: 3, 60: 2, 150: 2, 30: 1, 45: 1, 135: 1 },
    // 5) Nodo Norte: adota o orbe do outro planeta do par (tratado no engine)
    // 6) Aspectos com casas: 0.5 grau (aplicado no RealAstrologyEngine)
  },
}

export default aspectsConfig


