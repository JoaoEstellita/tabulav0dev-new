/**
 * O céu se movendo, quadro a quadro.
 *
 * Nasceu de uma incoerência que o João viu antes de mim: o Reel de 07/08/2026
 * anunciava "Mercúrio entra em Leão · faltam 2 dias" e a carta mostrava Mercúrio
 * parado a 26° de Câncer. O rótulo de véspera não mentia, mas a imagem
 * contradizia o título — e foi a antecipação que eu introduzi que criou isso.
 *
 * A correção e a animação que faltava são a MESMA coisa. Em vez de mostrar um
 * céu congelado sob um título que fala do futuro, o vídeo percorre a janela até
 * o evento, e o planeta cruza a divisa do signo à vista de quem assiste.
 *
 * Medido antes de construir — deslocamento em sete dias, em arco na roda:
 *
 *   Lua      100,3°   588px      Sol       6,7°   39px
 *   Mercúrio  10,0°    59px      Vênus     7,0°   41px
 *   Marte      4,7°    27px      Júpiter   1,5°    9px  (parado)
 *
 * Os pessoais andam o suficiente para o movimento ser lido; os lentos ficam
 * parados, e é assim mesmo que o céu se comporta.
 *
 * Tudo é calculado em Node e embutido na página: 360 quadros × 10 corpos sai
 * rápido, e o vídeo continua determinístico — nenhuma astronomia roda no
 * navegador, que é o que garante que o mesmo dia produza o mesmo arquivo.
 */
import { mapaDoCeu } from './ceu.mjs'

/**
 * A janela que o vídeo percorre: o PRÓPRIO DIA, das 00h às 24h de Brasília.
 *
 * Antes eram cinco dias de aproximação até o evento, e o João assistiu e disse o
 * que estava errado: "a lua anda 2 signos". Andava — 74,7° na janela de cinco
 * dias, contra 7,3° do planeta que a manchete anunciava. Quem assiste segue o
 * que se move, e o que se movia não era o assunto.
 *
 * Num dia a Lua anda uns 13°, quase meio signo, e os outros quase não saem do
 * lugar. É pouco movimento — e é exatamente o que o céu faz num dia. A peça
 * passa a ser um retrato do dia que respira, não uma viagem no tempo.
 *
 * 03:00 UTC é meia-noite em Brasília (UTC−3), que é o público da conta.
 *
 * @returns {{inicio: Date, fim: Date, comEvento: boolean}}
 */
export function janelaDaAnimacao(data, evento) {
  const inicio = new Date(Date.UTC(
    data.getUTCFullYear(), data.getUTCMonth(), data.getUTCDate(), 3
  ))
  return {
    inicio,
    fim: new Date(inicio.getTime() + 86_400_000),
    comEvento: Boolean(evento?.quando),
  }
}

/**
 * Longitudes de cada corpo em cada quadro.
 *
 * @returns {{quadros: number[][], nomes: string[], janela: object}}
 *   `quadros[i][j]` é a longitude do corpo `nomes[j]` no quadro `i`.
 */
export function efemerideAnimada(data, evento, orbes, totalQuadros = 360) {
  const janela = janelaDaAnimacao(data, evento)
  const passo = (janela.fim - janela.inicio) / Math.max(1, totalQuadros - 1)

  const primeiro = mapaDoCeu(janela.inicio, orbes)
  const nomes = primeiro.corpos.map((c) => c.nome)

  const quadros = []
  for (let i = 0; i < totalQuadros; i++) {
    const t = new Date(janela.inicio.getTime() + i * passo)
    const mapa = i === 0 ? primeiro : mapaDoCeu(t, orbes)
    quadros.push(mapa.corpos.map((c) => Number(c.longitude.toFixed(3))))
  }

  return { quadros, nomes, janela }
}

/**
 * Quanto o protagonista anda na janela, em graus.
 *
 * Serve de trava: se o movimento não passar de alguns graus, a animação não
 * comunica nada e é melhor não prometer movimento nenhum.
 */
export function deslocamentoDoProtagonista(efemeride, nomeDoCorpo) {
  const j = efemeride.nomes.indexOf(nomeDoCorpo)
  if (j < 0) return 0
  const a = efemeride.quadros[0][j]
  const b = efemeride.quadros[efemeride.quadros.length - 1][j]
  let d = b - a
  if (d > 180) d -= 360
  if (d < -180) d += 360
  return Math.abs(d)
}
