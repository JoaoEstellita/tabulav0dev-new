// Dignidades clássicas por grau: Termos Egípcios e Faces (Decanatos)
// Assumimos signos nomeados em PT-BR: 'Áries', 'Touro', 'Gêmeos', 'Câncer', 'Leão', 'Virgem',
// 'Libra', 'Escorpião', 'Sagitário', 'Capricórnio', 'Aquário', 'Peixes'

export type SignName =
  | 'Áries' | 'Touro' | 'Gêmeos' | 'Câncer' | 'Leão' | 'Virgem'
  | 'Libra' | 'Escorpião' | 'Sagitário' | 'Capricórnio' | 'Aquário' | 'Peixes'

// Ordem tradicional dos senhores de faces (caldeus): Marte, Sol, Vênus, Mercúrio, Lua, Saturno, Júpiter (repetindo)
const CHALDEAN_SEQUENCE = ['Marte','Sol','Vênus','Mercúrio','Lua','Saturno','Júpiter']

// Faces por signo (cada face = 10°) – sequência caldeia, iniciando por signo
// A sequência começa em Marte para Áries e prossegue ao longo do zodíaco sem reiniciar por signo
const FACES_BY_SIGN: Record<SignName, string[]> = (() => {
  const signs: SignName[] = ['Áries','Touro','Gêmeos','Câncer','Leão','Virgem','Libra','Escorpião','Sagitário','Capricórnio','Aquário','Peixes']
  const faces: Record<SignName, string[]> = {} as any
  let idx = 0
  for (const s of signs) {
    faces[s] = [CHALDEAN_SEQUENCE[idx%7], CHALDEAN_SEQUENCE[(idx+1)%7], CHALDEAN_SEQUENCE[(idx+2)%7]]
    idx = (idx + 3) % 7
  }
  return faces
})()

// Termos Egípcios (bounds) por signo: pares [limiteSuperiorExclusivo, regente]
// Tabelas clássicas consolidadas em graus 0–30 por signo
// Fonte clássica (padrão egípcio tradicional). Simplificado em blocos cumulativos.
const EGYPTIAN_TERMS: Record<SignName, Array<{ end: number, ruler: string }>> = {
  'Áries': [ { end: 6, ruler:'Júpiter' }, { end: 14, ruler:'Vênus' }, { end: 21, ruler:'Mercúrio' }, { end: 26, ruler:'Marte' }, { end: 30, ruler:'Saturno' } ],
  'Touro': [ { end: 8, ruler:'Vênus' }, { end: 14, ruler:'Mercúrio' }, { end: 22, ruler:'Júpiter' }, { end: 27, ruler:'Saturno' }, { end: 30, ruler:'Marte' } ],
  'Gêmeos': [ { end: 7, ruler:'Mercúrio' }, { end: 13, ruler:'Júpiter' }, { end: 20, ruler:'Vênus' }, { end: 25, ruler:'Marte' }, { end: 30, ruler:'Saturno' } ],
  'Câncer': [ { end: 7, ruler:'Marte' }, { end: 13, ruler:'Vênus' }, { end: 19, ruler:'Mercúrio' }, { end: 25, ruler:'Júpiter' }, { end: 30, ruler:'Saturno' } ],
  'Leão': [ { end: 6, ruler:'Saturno' }, { end: 13, ruler:'Mercúrio' }, { end: 19, ruler:'Vênus' }, { end: 25, ruler:'Júpiter' }, { end: 30, ruler:'Marte' } ],
  'Virgem': [ { end: 7, ruler:'Mercúrio' }, { end: 13, ruler:'Vênus' }, { end: 17, ruler:'Júpiter' }, { end: 21, ruler:'Mercúrio' }, { end: 30, ruler:'Saturno' } ],
  'Libra': [ { end: 6, ruler:'Saturno' }, { end: 14, ruler:'Mercúrio' }, { end: 21, ruler:'Júpiter' }, { end: 28, ruler:'Vênus' }, { end: 30, ruler:'Marte' } ],
  'Escorpião': [ { end: 7, ruler:'Marte' }, { end: 11, ruler:'Vênus' }, { end: 19, ruler:'Mercúrio' }, { end: 24, ruler:'Júpiter' }, { end: 30, ruler:'Saturno' } ],
  'Sagitário': [ { end: 12, ruler:'Júpiter' }, { end: 17, ruler:'Vênus' }, { end: 21, ruler:'Mercúrio' }, { end: 26, ruler:'Saturno' }, { end: 30, ruler:'Marte' } ],
  'Capricórnio': [ { end: 7, ruler:'Mercúrio' }, { end: 13, ruler:'Júpiter' }, { end: 19, ruler:'Vênus' }, { end: 26, ruler:'Saturno' }, { end: 30, ruler:'Marte' } ],
  'Aquário': [ { end: 7, ruler:'Mercúrio' }, { end: 13, ruler:'Vênus' }, { end: 20, ruler:'Júpiter' }, { end: 25, ruler:'Marte' }, { end: 30, ruler:'Saturno' } ],
  'Peixes': [ { end: 12, ruler:'Vênus' }, { end: 19, ruler:'Júpiter' }, { end: 24, ruler:'Mercúrio' }, { end: 27, ruler:'Marte' }, { end: 30, ruler:'Saturno' } ],
}

export function getFaceRuler(sign: SignName, degreeInSign: number): string | undefined {
  try {
    const faces = FACES_BY_SIGN[sign]
    if (!faces) return undefined
    const idx = Math.min(2, Math.max(0, Math.floor(degreeInSign / 10)))
    return faces[idx]
  } catch { return undefined }
}

export function getTermRuler(sign: SignName, degreeInSign: number): string | undefined {
  try {
    const bounds = EGYPTIAN_TERMS[sign]
    if (!bounds) return undefined
    for (const b of bounds) {
      if (degreeInSign < b.end) return b.ruler
    }
    return bounds[bounds.length - 1]?.ruler
  } catch { return undefined }
}


