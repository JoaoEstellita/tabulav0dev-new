// src/astro/normalize.ts
// Utilitários para normalização de nomes de planetas, signos e casas

const PLANET_MAP: Record<string, string> = {
  'sol': 'Sun', 'sun': 'Sun',
  'lua': 'Moon', 'moon': 'Moon',
  'mercurio': 'Mercury', 'mercury': 'Mercury',
  'venus': 'Venus',
  'marte': 'Mars', 'mars': 'Mars',
  'jupiter': 'Jupiter',
  'saturno': 'Saturn', 'saturn': 'Saturn',
  'urano': 'Uranus', 'uranus': 'Uranus',
  'netuno': 'Neptune', 'neptune': 'Neptune',
  'plutao': 'Pluto', 'pluto': 'Pluto',
  'nodo norte': 'North Node', 'north node': 'North Node',
  'nodo sul': 'South Node', 'south node': 'South Node',
};

const SIGN_MAP: Record<string, string> = {
  'aries': 'Aries', 'áries': 'Aries',
  'touro': 'Taurus', 'taurus': 'Taurus',
  'gemeos': 'Gemini', 'gêmeos': 'Gemini', 'gemini': 'Gemini',
  'cancer': 'Cancer', 'câncer': 'Cancer',
  'leao': 'Leo', 'leão': 'Leo', 'leo': 'Leo',
  'virgem': 'Virgo', 'virgo': 'Virgo',
  'libra': 'Libra',
  'escorpiao': 'Scorpio', 'escorpião': 'Scorpio', 'scorpio': 'Scorpio',
  'sagitario': 'Sagittarius', 'sagitário': 'Sagittarius', 'sagittarius': 'Sagittarius',
  'capricornio': 'Capricorn', 'capricórnio': 'Capricorn', 'capricorn': 'Capricorn',
  'aquario': 'Aquarius', 'aquário': 'Aquarius', 'aquarius': 'Aquarius',
  'peixes': 'Pisces', 'pisces': 'Pisces',
};

const HOUSE_MAP: Record<string, string> = {
  'casa 1': 'House 1', 'house 1': 'House 1', 'ascendente': 'House 1',
  'casa 2': 'House 2', 'house 2': 'House 2',
  'casa 3': 'House 3', 'house 3': 'House 3',
  'casa 4': 'House 4', 'house 4': 'House 4', 'fundo do céu': 'House 4',
  'casa 5': 'House 5', 'house 5': 'House 5',
  'casa 6': 'House 6', 'house 6': 'House 6',
  'casa 7': 'House 7', 'house 7': 'House 7', 'descendente': 'House 7',
  'casa 8': 'House 8', 'house 8': 'House 8',
  'casa 9': 'House 9', 'house 9': 'House 9',
  'casa 10': 'House 10', 'house 10': 'House 10', 'meio do céu': 'House 10',
  'casa 11': 'House 11', 'house 11': 'House 11',
  'casa 12': 'House 12', 'house 12': 'House 12',
};

export function normalizePlanet(name: string): string {
  // ̀-ͯ = combining diacritical marks (o que o NFD gera). NÃO usar
  // /\p{Diacritic}/gu: Unicode property escapes não funcionam no Hermes (RN
  // nativo) — o acento não era removido e a chave não casava (grade/
  // interpretações vazias no APK, ok no PWA/V8).
  const k = name.normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase();
  return PLANET_MAP[k] || name;
}

export function normalizeSign(name: string): string {
  // ̀-ͯ = combining diacritical marks (o que o NFD gera). NÃO usar
  // /\p{Diacritic}/gu: Unicode property escapes não funcionam no Hermes (RN
  // nativo) — o acento não era removido e a chave não casava (grade/
  // interpretações vazias no APK, ok no PWA/V8).
  const k = name.normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase();
  return SIGN_MAP[k] || name;
}

export function normalizeHouse(name: string): string {
  // ̀-ͯ = combining diacritical marks (o que o NFD gera). NÃO usar
  // /\p{Diacritic}/gu: Unicode property escapes não funcionam no Hermes (RN
  // nativo) — o acento não era removido e a chave não casava (grade/
  // interpretações vazias no APK, ok no PWA/V8).
  const k = name.normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase();
  return HOUSE_MAP[k] || name;
}
