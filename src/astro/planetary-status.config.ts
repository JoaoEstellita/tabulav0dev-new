import { EssentialDignity, PlanetName, SignName } from './planetary-status.types'

// Tabela completa de dignidades essenciais baseada na tradição astrológica
// Para lookup rápido por planeta
export const ESSENTIAL_DIGNITIES: EssentialDignity[] = [

// Objeto de lookup para dignidades essenciais (para uso otimizado)
// (Removido duplicidade, exportação única ao final do arquivo)
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
];

// Objeto de lookup para dignidades essenciais (para uso otimizado)
export const ESSENTIAL_DIGNITIES_LOOKUP: Partial<Record<PlanetName, EssentialDignity>> = Object.fromEntries(
  ESSENTIAL_DIGNITIES.map(d => [d.planet, d])
);

// Sistema de elementos e modalidades
// Tabela tradicional de elementos e modalidades com pesos
export const ELEMENTAL_MODALITY_SYSTEM: Record<SignName, { element: string, modality: string, elementStrength: number, modalityStrength: number }> = {
  'Áries':       { element: 'Fogo',    modality: 'Cardinal', elementStrength: 2, modalityStrength: 2 },
  'Touro':       { element: 'Terra',   modality: 'Fixo',     elementStrength: 2, modalityStrength: 2 },
  'Gêmeos':      { element: 'Ar',      modality: 'Mutável',  elementStrength: 2, modalityStrength: 2 },
  'Câncer':      { element: 'Água',    modality: 'Cardinal', elementStrength: 2, modalityStrength: 2 },
  'Leão':        { element: 'Fogo',    modality: 'Fixo',     elementStrength: 3, modalityStrength: 3 },
  'Virgem':      { element: 'Terra',   modality: 'Mutável',  elementStrength: 2, modalityStrength: 2 },
  'Libra':       { element: 'Ar',      modality: 'Cardinal', elementStrength: 2, modalityStrength: 2 },
  'Escorpião':   { element: 'Água',    modality: 'Fixo',     elementStrength: 3, modalityStrength: 3 },
  'Sagitário':   { element: 'Fogo',    modality: 'Mutável',  elementStrength: 2, modalityStrength: 2 },
  'Capricórnio': { element: 'Terra',   modality: 'Cardinal', elementStrength: 2, modalityStrength: 2 },
  'Aquário':     { element: 'Ar',      modality: 'Fixo',     elementStrength: 2, modalityStrength: 2 },
  'Peixes':      { element: 'Água',    modality: 'Mutável',  elementStrength: 2, modalityStrength: 2 },
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
  
  // Casas Cadentes (força reduzida, mas nunca negativa)
  3: { strength: 1, category: 'cadent', description: 'Comunicação e aprendizado' },
  6: { strength: 1, category: 'cadent', description: 'Trabalho e saúde' },
  9: { strength: 2, category: 'cadent', description: 'Expansão e filosofia' },
  12: { strength: 1, category: 'cadent', description: 'Subconsciente e espiritualidade' }
}