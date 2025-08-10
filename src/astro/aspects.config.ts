import { AspectsConfig } from './aspects.types'

// Configuração única de aspectos e orbes
// Orbes base inspiradas em prática comum: conj/oposição 8°, quadratura/trígono 6–8°, sextil 4–6°
const aspectsConfig: AspectsConfig = {
  aspects: [
    { name: 'conjunção', angle: 0, baseOrb: 10 },
    { name: 'oposição', angle: 180, baseOrb: 10 },
    { name: 'quadratura', angle: 90, baseOrb: 8 },
    { name: 'trígono', angle: 120, baseOrb: 8 },
    { name: 'sextil', angle: 60, baseOrb: 6 },
    { name: 'quincúncio', angle: 150, baseOrb: 3 },
  ],
  overrides: {
    Sun: { Moon: 10, Mercury: 9, Venus: 9 },
    Moon: { Sun: 10 },
    Jupiter: { Sun: 9, Moon: 9 },
  },
  maxOrbCap: 12,
  planetOrbs: {
    Sun: 12, Moon: 12,
    Mercury: 9, Venus: 9, Mars: 9,
    Jupiter: 8, Saturn: 8,
    Uranus: 6, Neptune: 6, Pluto: 6,
    Node: 5, Chiron: 5, Lilith: 3,
  },
}

export default aspectsConfig


