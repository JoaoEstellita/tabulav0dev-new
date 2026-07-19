import {
  LIFE_AREA_ATTRIBUTION,
  LIFE_AREA_LABELS,
  LIFE_AREA_ORDER,
  type LifeAreaKey,
} from '../constants/lifeAreas'

/**
 * Quais das 8 áreas do status um trânsito toca.
 *
 * Usa exatamente o mesmo mapa que o motor usa para PONTUAR as áreas
 * (`LIFE_AREA_ATTRIBUTION`) — então o que o card diz aqui é o que de fato move o
 * número na Home. Se fosse um mapa paralelo, a tela poderia anunciar "afeta
 * Carreira" para um trânsito que não mexe em Carreira nenhuma.
 *
 * Uma área entra quando a casa impactada é dela OU quando o planeta em trânsito
 * ou o ponto natal tocado é regente temático dela — o mesmo OU que o motor aplica.
 */
export function areasAffectedByTransit(
  transitPlanet?: string | null,
  natalPlanet?: string | null,
  house?: number | string | null,
): LifeAreaKey[] {
  const casa = Number(house)
  const planetas = [transitPlanet, natalPlanet].map(normalize).filter(Boolean)

  return LIFE_AREA_ORDER.filter((area) => {
    const def = LIFE_AREA_ATTRIBUTION[area]
    if (Number.isFinite(casa) && def.houses.includes(casa)) return true
    return def.planets.some((p) => planetas.includes(normalize(p)))
  })
}

/** Rótulos prontos para exibir, na ordem canônica das áreas. */
export function areaLabelsForTransit(
  transitPlanet?: string | null,
  natalPlanet?: string | null,
  house?: number | string | null,
): string[] {
  return areasAffectedByTransit(transitPlanet, natalPlanet, house).map(
    (a) => LIFE_AREA_LABELS[a] || a,
  )
}

function normalize(v?: string | null): string {
  return String(v || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
}
