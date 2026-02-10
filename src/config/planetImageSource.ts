export type PlanetKey =
  | 'Sun'
  | 'Moon'
  | 'Mercury'
  | 'Venus'
  | 'Mars'
  | 'Jupiter'
  | 'Saturn'
  | 'Uranus'
  | 'Neptune'
  | 'Pluto'

/**
 * CONFIGURACAO RAPIDA:
 * - Se usar CDN/pasta remota, preencha PLANET_IMAGES_BASE_URL.
 * - Se usar assets locais, altere USE_REMOTE_PLANET_IMAGES para false e
 *   preencha PLANET_IMAGE_LOCAL_PATHS para a sua estrutura.
 */
export const USE_REMOTE_PLANET_IMAGES = true

// Exemplo: 'https://cdn.seudominio.com/tabula/planets'
// Exemplo: 'https://raw.githubusercontent.com/SEU_USUARIO/SEU_REPO/main/planets'
export const PLANET_IMAGES_BASE_URL = '/planets'

// Tamanho preferencial no app (512 para desktop, 256 para listas leves)
export const PLANET_IMAGE_SIZE: '256' | '512' = '512'
export const PLANET_IMAGE_FORMAT: 'webp' | 'png' = 'png'

export const PLANET_IMAGE_BASENAME: Record<PlanetKey, string> = {
  Sun: 'Sun',
  Moon: 'Moon',
  Mercury: 'Mercury',
  Venus: 'Venus',
  Mars: 'Mars',
  Jupiter: 'Jupiter',
  Saturn: 'Saturn',
  Uranus: 'Uranus',
  Neptune: 'Neptune',
  Pluto: 'Pluto',
}

/**
 * Opcional para imagens locais (apenas quando USE_REMOTE_PLANET_IMAGES=false).
 * Preencha com require(...) ou paths locais que seu bundler aceita.
 */
export const PLANET_IMAGE_LOCAL_PATHS: Partial<Record<PlanetKey, string>> = {}

const buildFilename = (planet: PlanetKey): string =>
  `${PLANET_IMAGE_BASENAME[planet]}.${PLANET_IMAGE_FORMAT}`

export const getPlanetImageUri = (planet: PlanetKey): string | undefined => {
  if (!USE_REMOTE_PLANET_IMAGES) {
    return PLANET_IMAGE_LOCAL_PATHS[planet]
  }
  const base = PLANET_IMAGES_BASE_URL.replace(/\/+$/, '')
  if (!base) {
    return undefined
  }
  return `${base}/${buildFilename(planet)}`
}
