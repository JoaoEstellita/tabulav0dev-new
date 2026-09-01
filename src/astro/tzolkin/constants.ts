import type { GalacticTone, TzolkinSeal, ColorKey } from './types'

// 13 Tons Galácticos (dados do material-fonte Dreamspell).
export const TONES: GalacticTone[] = [
  { number: 1, key: 'magnetico', namePt: 'Magnético', nameEn: 'Magnetic', essencePt: 'Propósito', essenceEn: 'Purpose', powerPt: 'Unificar', powerEn: 'Unify', actionPt: 'Atrair', actionEn: 'Attract' },
  { number: 2, key: 'lunar', namePt: 'Lunar', nameEn: 'Lunar', essencePt: 'Desafio', essenceEn: 'Challenge', powerPt: 'Polarizar', powerEn: 'Polarize', actionPt: 'Estabilizar', actionEn: 'Stabilize' },
  { number: 3, key: 'eletrico', namePt: 'Elétrico', nameEn: 'Electric', essencePt: 'Serviço', essenceEn: 'Service', powerPt: 'Ativar', powerEn: 'Activate', actionPt: 'Vincular', actionEn: 'Bond' },
  { number: 4, key: 'autoexistente', namePt: 'Autoexistente', nameEn: 'Self-Existing', essencePt: 'Forma', essenceEn: 'Form', powerPt: 'Definir', powerEn: 'Define', actionPt: 'Medir', actionEn: 'Measure' },
  { number: 5, key: 'entonado', namePt: 'Entonado', nameEn: 'Overtone', essencePt: 'Radiância', essenceEn: 'Radiance', powerPt: 'Potencializar', powerEn: 'Empower', actionPt: 'Comandar', actionEn: 'Command' },
  { number: 6, key: 'ritmico', namePt: 'Rítmico', nameEn: 'Rhythmic', essencePt: 'Igualdade', essenceEn: 'Equality', powerPt: 'Organizar', powerEn: 'Organize', actionPt: 'Equilibrar', actionEn: 'Balance' },
  { number: 7, key: 'ressonante', namePt: 'Ressonante', nameEn: 'Resonant', essencePt: 'Sintonia', essenceEn: 'Attunement', powerPt: 'Canalizar', powerEn: 'Channel', actionPt: 'Inspirar', actionEn: 'Inspire' },
  { number: 8, key: 'galactico', namePt: 'Galáctico', nameEn: 'Galactic', essencePt: 'Integridade', essenceEn: 'Integrity', powerPt: 'Harmonizar', powerEn: 'Harmonize', actionPt: 'Modelar', actionEn: 'Model' },
  { number: 9, key: 'solar', namePt: 'Solar', nameEn: 'Solar', essencePt: 'Intenção', essenceEn: 'Intention', powerPt: 'Pulsar', powerEn: 'Pulse', actionPt: 'Realizar', actionEn: 'Realize' },
  { number: 10, key: 'planetario', namePt: 'Planetário', nameEn: 'Planetary', essencePt: 'Manifestação', essenceEn: 'Manifestation', powerPt: 'Aperfeiçoar', powerEn: 'Perfect', actionPt: 'Produzir', actionEn: 'Produce' },
  { number: 11, key: 'espectral', namePt: 'Espectral', nameEn: 'Spectral', essencePt: 'Libertação', essenceEn: 'Liberation', powerPt: 'Dissolver', powerEn: 'Dissolve', actionPt: 'Liberar', actionEn: 'Release' },
  { number: 12, key: 'cristal', namePt: 'Cristal', nameEn: 'Crystal', essencePt: 'Cooperação', essenceEn: 'Cooperation', powerPt: 'Dedicar', powerEn: 'Dedicate', actionPt: 'Universalizar', actionEn: 'Universalize' },
  { number: 13, key: 'cosmico', namePt: 'Cósmico', nameEn: 'Cosmic', essencePt: 'Presença', essenceEn: 'Presence', powerPt: 'Perseverar', powerEn: 'Endure', actionPt: 'Transcender', actionEn: 'Transcend' },
]

// 20 Selos Solares. Cor = (number-1) % 4 → 0 red, 1 white, 2 blue, 3 yellow.
export const SEALS: TzolkinSeal[] = [
  { number: 1, key: 'dragao', namePt: 'Dragão', nameEn: 'Dragon', color: 'red', powerPt: 'Nascimento', powerEn: 'Birth', actionPt: 'Nutrir', actionEn: 'Nurture', essencePt: 'Ser', essenceEn: 'Being' },
  { number: 2, key: 'vento', namePt: 'Vento', nameEn: 'Wind', color: 'white', powerPt: 'Espírito', powerEn: 'Spirit', actionPt: 'Comunicar', actionEn: 'Communicate', essencePt: 'Respiração', essenceEn: 'Breath' },
  { number: 3, key: 'noite', namePt: 'Noite', nameEn: 'Night', color: 'blue', powerPt: 'Abundância', powerEn: 'Abundance', actionPt: 'Sonhar', actionEn: 'Dream', essencePt: 'Intuição', essenceEn: 'Intuition' },
  { number: 4, key: 'semente', namePt: 'Semente', nameEn: 'Seed', color: 'yellow', powerPt: 'Florescimento', powerEn: 'Flowering', actionPt: 'Focalizar', actionEn: 'Focus', essencePt: 'Consciência', essenceEn: 'Awareness' },
  { number: 5, key: 'serpente', namePt: 'Serpente', nameEn: 'Serpent', color: 'red', powerPt: 'Força Vital', powerEn: 'Life Force', actionPt: 'Sobreviver', actionEn: 'Survive', essencePt: 'Instinto', essenceEn: 'Instinct' },
  { number: 6, key: 'enlacador', namePt: 'Enlaçador de Mundos', nameEn: 'Worldbridger', color: 'white', powerPt: 'Morte', powerEn: 'Death', actionPt: 'Equalizar', actionEn: 'Equalize', essencePt: 'Oportunidade', essenceEn: 'Opportunity' },
  { number: 7, key: 'mao', namePt: 'Mão', nameEn: 'Hand', color: 'blue', powerPt: 'Realização', powerEn: 'Accomplishment', actionPt: 'Conhecer', actionEn: 'Know', essencePt: 'Cura', essenceEn: 'Healing' },
  { number: 8, key: 'estrela', namePt: 'Estrela', nameEn: 'Star', color: 'yellow', powerPt: 'Elegância', powerEn: 'Elegance', actionPt: 'Embelezar', actionEn: 'Beautify', essencePt: 'Arte', essenceEn: 'Art' },
  { number: 9, key: 'lua', namePt: 'Lua', nameEn: 'Moon', color: 'red', powerPt: 'Água Universal', powerEn: 'Universal Water', actionPt: 'Purificar', actionEn: 'Purify', essencePt: 'Fluxo', essenceEn: 'Flow' },
  { number: 10, key: 'cachorro', namePt: 'Cachorro', nameEn: 'Dog', color: 'white', powerPt: 'Coração', powerEn: 'Heart', actionPt: 'Amar', actionEn: 'Love', essencePt: 'Lealdade', essenceEn: 'Loyalty' },
  { number: 11, key: 'macaco', namePt: 'Macaco', nameEn: 'Monkey', color: 'blue', powerPt: 'Magia', powerEn: 'Magic', actionPt: 'Brincar', actionEn: 'Play', essencePt: 'Ilusão', essenceEn: 'Illusion' },
  { number: 12, key: 'humano', namePt: 'Humano', nameEn: 'Human', color: 'yellow', powerPt: 'Livre-Arbítrio', powerEn: 'Free Will', actionPt: 'Influenciar', actionEn: 'Influence', essencePt: 'Sabedoria', essenceEn: 'Wisdom' },
  { number: 13, key: 'caminhante', namePt: 'Caminhante do Céu', nameEn: 'Skywalker', color: 'red', powerPt: 'Espaço', powerEn: 'Space', actionPt: 'Explorar', actionEn: 'Explore', essencePt: 'Vigilância', essenceEn: 'Wakefulness' },
  { number: 14, key: 'mago', namePt: 'Mago', nameEn: 'Wizard', color: 'white', powerPt: 'Atemporalidade', powerEn: 'Timelessness', actionPt: 'Encantar', actionEn: 'Enchant', essencePt: 'Receptividade', essenceEn: 'Receptivity' },
  { number: 15, key: 'aguia', namePt: 'Águia', nameEn: 'Eagle', color: 'blue', powerPt: 'Visão', powerEn: 'Vision', actionPt: 'Criar', actionEn: 'Create', essencePt: 'Mente', essenceEn: 'Mind' },
  { number: 16, key: 'guerreiro', namePt: 'Guerreiro', nameEn: 'Warrior', color: 'yellow', powerPt: 'Inteligência', powerEn: 'Intelligence', actionPt: 'Questionar', actionEn: 'Question', essencePt: 'Destemor', essenceEn: 'Fearlessness' },
  { number: 17, key: 'terra', namePt: 'Terra', nameEn: 'Earth', color: 'red', powerPt: 'Navegação', powerEn: 'Navigation', actionPt: 'Evoluir', actionEn: 'Evolve', essencePt: 'Sincronicidade', essenceEn: 'Synchronicity' },
  { number: 18, key: 'espelho', namePt: 'Espelho', nameEn: 'Mirror', color: 'white', powerPt: 'Sem-Fim', powerEn: 'Endlessness', actionPt: 'Refletir', actionEn: 'Reflect', essencePt: 'Ordem', essenceEn: 'Order' },
  { number: 19, key: 'tormenta', namePt: 'Tormenta', nameEn: 'Storm', color: 'blue', powerPt: 'Autogeração', powerEn: 'Self-Generation', actionPt: 'Catalisar', actionEn: 'Catalyze', essencePt: 'Energia', essenceEn: 'Energy' },
  { number: 20, key: 'sol', namePt: 'Sol', nameEn: 'Sun', color: 'yellow', powerPt: 'Fogo Universal', powerEn: 'Universal Fire', actionPt: 'Iluminar', actionEn: 'Enlighten', essencePt: 'Vida', essenceEn: 'Life' },
]

export const COLOR_LABELS: Record<ColorKey, { pt: string; en: string; hex: string }> = {
  red: { pt: 'Vermelho', en: 'Red', hex: '#E4572E' },
  white: { pt: 'Branco', en: 'White', hex: '#D8D8DE' },
  blue: { pt: 'Azul', en: 'Blue', hex: '#3D6FD1' },
  yellow: { pt: 'Amarelo', en: 'Yellow', hex: '#F2C14E' },
}
