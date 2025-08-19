import { EssentialDignity, PlanetName, SignName } from './planetary-status.types'

// Tabela completa de dignidades essenciais baseada na tradição astrológica
export const ESSENTIAL_DIGNITIES: EssentialDignity[] = [
  {
    planet: 'Sun',
    domicile: ['Leão'],
    exaltation: ['Áries'],
    detriment: ['Aquário'],
    fall: ['Libra'],
    triplicity: ['Áries', 'Leão', 'Sagitário'] // Fogo
  },
  {
    planet: 'Moon',
    domicile: ['Câncer'],
    exaltation: ['Touro'],
    detriment: ['Capricórnio'],
    fall: ['Escorpião'],
    triplicity: ['Câncer', 'Escorpião', 'Peixes'] // Água
  },
  {
    planet: 'Mercury',
    domicile: ['Gêmeos', 'Virgem'],
    exaltation: ['Virgem'],
    detriment: ['Sagitário', 'Peixes'],
    fall: ['Peixes'],
    triplicity: ['Gêmeos', 'Virgem', 'Capricórnio'] // Terra
  },
  {
    planet: 'Venus',
    domicile: ['Touro', 'Libra'],
    exaltation: ['Peixes'],
    detriment: ['Áries', 'Escorpião'],
    fall: ['Virgem'],
    triplicity: ['Touro', 'Virgem', 'Capricórnio'] // Terra
  },
  {
    planet: 'Mars',
    domicile: ['Áries', 'Escorpião'],
    exaltation: ['Capricórnio'],
    detriment: ['Touro', 'Libra'],
    fall: ['Câncer'],
    triplicity: ['Áries', 'Leão', 'Sagitário'] // Fogo
  },
  {
    planet: 'Jupiter',
    domicile: ['Sagitário', 'Peixes'],
    exaltation: ['Câncer'],
    detriment: ['Gêmeos', 'Virgem'],
    fall: ['Capricórnio'],
    triplicity: ['Sagitário', 'Áries', 'Leão'] // Fogo
  },
  {
    planet: 'Saturn',
    domicile: ['Capricórnio', 'Aquário'],
    exaltation: ['Libra'],
    detriment: ['Câncer', 'Leão'],
    fall: ['Áries'],
    triplicity: ['Capricórnio', 'Touro', 'Virgem'] // Terra
  },
  {
    planet: 'Uranus',
    domicile: ['Aquário'],
    exaltation: ['Escorpião'],
    detriment: ['Leão'],
    fall: ['Touro'],
    triplicity: ['Aquário', 'Gêmeos', 'Libra'] // Ar
  },
  {
    planet: 'Neptune',
    domicile: ['Peixes'],
    exaltation: ['Câncer'],
    detriment: ['Virgem'],
    fall: ['Capricórnio'],
    triplicity: ['Peixes', 'Câncer', 'Escorpião'] // Água
  },
  {
    planet: 'Pluto',
    domicile: ['Escorpião'],
    exaltation: ['Capricórnio'],
    detriment: ['Touro'],
    fall: ['Câncer'],
    triplicity: ['Escorpião', 'Peixes', 'Câncer'] // Água
  }
]

// Sistema de elementos e modalidades
export const ELEMENTAL_MODALITY_SYSTEM: Record<SignName, { element: string, modality: string, strength: number }> = {
  'Áries': { element: 'Fogo', modality: 'Cardinal', strength: 1 },
  'Touro': { element: 'Terra', modality: 'Fixo', strength: 1 },
  'Gêmeos': { element: 'Ar', modality: 'Mutável', strength: 1 },
  'Câncer': { element: 'Água', modality: 'Cardinal', strength: 1 },
  'Leão': { element: 'Fogo', modality: 'Fixo', strength: 1 },
  'Virgem': { element: 'Terra', modality: 'Mutável', strength: 1 },
  'Libra': { element: 'Ar', modality: 'Cardinal', strength: 1 },
  'Escorpião': { element: 'Água', modality: 'Fixo', strength: 1 },
  'Sagitário': { element: 'Fogo', modality: 'Mutável', strength: 1 },
  'Capricórnio': { element: 'Terra', modality: 'Cardinal', strength: 1 },
  'Aquário': { element: 'Ar', modality: 'Fixo', strength: 1 },
  'Peixes': { element: 'Água', modality: 'Mutável', strength: 1 }
}

// Sistema de força das casas
export const HOUSE_STRENGTH_SYSTEM = {
  // Casas Angulares (máxima força)
  1: { strength: 5, category: 'angular', description: 'Identidade e iniciativa' },
  4: { strength: 5, category: 'angular', description: 'Raízes e lar' },
  7: { strength: 4, category: 'angular', description: 'Relacionamentos e parcerias' },
  10: { strength: 5, category: 'angular', description: 'Carreira e status social' },
  
  // Casas Sucedentes (força média)
  2: { strength: 3, category: 'succedent', description: 'Valores e recursos' },
  5: { strength: 3, category: 'succedent', description: 'Criatividade e autoexpressão' },
  8: { strength: 2, category: 'succedent', description: 'Transformação e recursos compartilhados' },
  11: { strength: 4, category: 'succedent', description: 'Amizades e aspirações' },
  
  // Casas Cadentes (força reduzida)
  3: { strength: 1, category: 'cadent', description: 'Comunicação e aprendizado' },
  6: { strength: -2, category: 'cadent', description: 'Trabalho e saúde' },
  9: { strength: 2, category: 'cadent', description: 'Expansão e filosofia' },
  12: { strength: -5, category: 'cadent', description: 'Subconsciente e espiritualidade' }
}