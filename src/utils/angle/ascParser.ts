export function parseAscInputToDegrees(input: string): number | null {
	if (!input) return null
	const trimmed = input.trim()
	// Tenta número decimal direto
	const asNumber = Number(trimmed.replace(',', '.'))
	if (Number.isFinite(asNumber)) {
		if (asNumber >= 0 && asNumber < 360) return asNumber
		// Permite normalizar valores fora do range
		return ((asNumber % 360) + 360) % 360
	}

	// Aceita formatos com signo e D°M'S" (variações de acento)
	const signMap: Record<string, number> = {
		'ar': 0, 'aries': 0, 'áries': 0,
		'to': 30, 'touro': 30,
		'ge': 60, 'gemeos': 60, 'gêmeos': 60,
		'ca': 90, 'cancer': 90, 'câncer': 90,
		'le': 120, 'leao': 120, 'leão': 120,
		'vi': 150, 'virgem': 150,
		'li': 180, 'libra': 180,
		'es': 210, 'escorpiao': 210, 'escorpião': 210,
		'sa': 240, 'sagitario': 240, 'sagitário': 240,
		'cp': 270, 'capricornio': 270, 'capricórnio': 270,
		'aq': 300, 'aquario': 300, 'aquário': 300,
		'pe': 330, 'peixes': 330,
	}

	const normalized = trimmed
		.toLowerCase()
		.replace(/º|°/g, '°')
		.replace(/\s+/g, ' ')
		.replace(/'\"/g, '"')
		.trim()

	// Extrai o signo por palavra inicial
	const signKey = Object.keys(signMap).find(k => normalized.startsWith(k))
	if (!signKey) return null
	const base = signMap[signKey]
	const rest = normalized.slice(signKey.length).trim()

	// Padrões: 29°51'58" | 29 51 58 | 29°51 | 29
	const dmspattern = /(?:(\d{1,2})\s*°\s*)?(?:(\d{1,2})\s*'?\s*)?(?:(\d{1,2})\s*"?)?/;
	const m = rest.match(dmspattern)
	if (!m) return null
	const deg = Number(m[1] ?? 0)
	const min = Number(m[2] ?? 0)
	const sec = Number(m[3] ?? 0)
	if (!Number.isFinite(deg) || !Number.isFinite(min) || !Number.isFinite(sec)) return null
	const total = base + deg + (min / 60) + (sec / 3600)
	return ((total % 360) + 360) % 360
}

export function degreesToSignString(deg: number): string {
	const signs = ['Áries','Touro','Gêmeos','Câncer','Leão','Virgem','Libra','Escorpião','Sagitário','Capricórnio','Aquário','Peixes']
	const norm = ((deg % 360) + 360) % 360
	const signIndex = Math.floor(norm / 30)
	const base = signIndex * 30
	const d = Math.floor(norm - base)
	const mFloat = (norm - base - d) * 60
	const m = Math.floor(mFloat)
	const s = Math.round((mFloat - m) * 60)
	const pad = (n: number, w = 2) => n.toString().padStart(w, '0')
	return `${signs[signIndex]} ${pad(d)}°${pad(m)}'${pad(s)}"`
}


