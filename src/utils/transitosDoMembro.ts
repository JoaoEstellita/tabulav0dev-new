/**
 * OS TRÂNSITOS DE UM MEMBRO DO GRUPO, em lista única.
 *
 * O grupo entrega os trânsitos de cada pessoa agrupados POR ÁREA DA VIDA
 * (`member.areaTransits`), porque é assim que a tela de grupo os usa: cada
 * ficha de área mostra os seus. Mas as emoções do dia precisam da lista do
 * dia INTEIRA, sem recorte por área.
 *
 * ⚠️ E AQUI MORA UMA ARMADILHA: o mesmo trânsito aparece em VÁRIAS áreas.
 * Saturno em quadratura com o Sol pode ser contado em carreira, saúde e
 * família ao mesmo tempo — são três entradas do mesmo evento astronômico.
 * Concatenar as listas sem deduplicar faria esse trânsito pesar três vezes na
 * conta das emoções, e os números sairiam inflados sem nada denunciar: nenhum
 * erro, nenhum campo faltando, só valores altos demais.
 *
 * A chave da deduplicação é o TRIO que define o aspecto — planeta que chega,
 * tipo e ponto natal tocado. Orbe e força são consequência dele, não parte da
 * identidade.
 */

export type TransitoDeArea = {
  transitPlanet?: string
  natalPlanet?: string
  type?: string
  orb?: number
  strength?: number
  durationClass?: 'curto' | 'medio' | 'longo'
}

const chave = (t: TransitoDeArea) =>
  [t?.transitPlanet, t?.type, t?.natalPlanet]
    .map((v) => String(v || '').toLowerCase().trim())
    .join('|')

/**
 * A lista do dia, sem repetição.
 *
 * Devolve `[]` — e não `null` — quando não há nada: quem chama decide o que
 * fazer com lista vazia, e `emocoesDoDia` já trata isso devolvendo `null`.
 */
export function transitosDoMembro(
  areaTransits: Record<string, ReadonlyArray<TransitoDeArea>> | null | undefined,
): TransitoDeArea[] {
  if (!areaTransits || typeof areaTransits !== 'object') return []

  const vistos = new Set<string>()
  const saida: TransitoDeArea[] = []
  for (const lista of Object.values(areaTransits)) {
    if (!Array.isArray(lista)) continue
    for (const t of lista) {
      if (!t?.transitPlanet || !t?.type) continue
      const k = chave(t)
      if (k === '||' || vistos.has(k)) continue
      vistos.add(k)
      saida.push(t)
    }
  }
  return saida
}

/**
 * Os trânsitos de UMA área, para a sombra de movimento da roda.
 *
 * Existe só para blindar a leitura: `areaTransits[area]` pode vir ausente, com
 * outro nome de chave ou não-array, e a roda não pode quebrar por causa disso.
 */
export function transitosDaArea(
  areaTransits: Record<string, ReadonlyArray<TransitoDeArea>> | null | undefined,
  area: string,
): TransitoDeArea[] {
  const lista = areaTransits?.[area]
  return Array.isArray(lista) ? lista.filter(Boolean) : []
}
