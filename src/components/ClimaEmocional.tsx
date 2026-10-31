import React, { useMemo, useState } from 'react'
import { View, Text, StyleSheet, Pressable, Modal, ScrollView, useWindowDimensions } from 'react-native'
import Svg, { Circle, Defs, Line, LinearGradient, Stop } from 'react-native-svg'
import { translatePlanet } from '../utils/astro/pt'
import { rotuloDeAspecto } from '../utils/transitPresentation'
import { Ionicons } from '@expo/vector-icons'
import { buildUnifiedTransitNarrative } from '../utils/astroInterpretation'
import { GLOSSARIO_EMOCOES, indiceIdioma } from '../data/emocoesGlossario'
import {
  emocoesDoDia,
  EMOCOES,
  EMOCAO_PESA,
  REFERENCIA_POR_ANEL,
  baseDaPessoa,
  emocoesDoNatal,
  type AspectoNatal,
  type DiaDeMemoria,
  type TransitoParaEmocao,
  type ChaveEmocao,
  type EmocaoDoDia,
  type Contribuicao,
} from '../utils/emocoesDoDia'

/**
 * A TENDÊNCIA EMOCIONAL do dia, em seis anéis.
 *
 * ⚠️ Estes números NÃO medem a emoção de ninguém — o app não tem nenhum dado
 * sobre o estado emocional real da pessoa. São leitura do CÉU: quanto o dia
 * carrega o tipo de tensão ou de alívio que a tradição associa a cada palavra.
 *
 * É por isso que a seção se chama TENDÊNCIA e cada anel abre a conta. Um número
 * fechado soa veredicto; o mesmo número com "veio daqui" vira leitura.
 */

type Props = {
  transitos: ReadonlyArray<TransitoParaEmocao> | null | undefined
  /**
   * Os valores que o BACKEND já calculou e gravou (`currentTransits.emocoes`).
   *
   * ⚠️ Quando vierem, MANDAM — o cálculo local é reserva. Os dois usam a mesma
   * matemática (há teste de paridade dos dois lados), mas não a mesma ENTRADA:
   * o backend calcula sobre `transitosRicos`, o app sobre `personalTodayRich`,
   * e as duas listas são montadas por caminhos diferentes. Preferindo o
   * gravado, a pessoa vê o mesmo número no app, no WhatsApp e no grupo.
   *
   * O cálculo local existe para quando o status não chegou — o app funciona
   * sem backend, com motor próprio, e uma seção que some offline seria pior
   * que uma que mostra um número ligeiramente diferente.
   */
  /**
   * `currentTransits.transitosRicos` — A LISTA QUE O BACKEND USOU para calcular
   * os valores gravados.
   *
   * ⚠️ ELA É A CORREÇÃO DE UM BUG REAL. Antes, o número vinha do gravado e a
   * explicação do cálculo LOCAL (`personalTodayRich`), que é outra lista. Deu
   * na tela "Sensível 54" junto de "Nenhum trânsito de hoje mexe nisso" — os 54
   * vinham de dois trânsitos de Netuno (ao ASC e ao IC) que só existiam na
   * lista do backend. Número de uma fonte, explicação de outra.
   *
   * ⚠️ Recalculando daqui, o número e o "de onde vem" saem da MESMA lista, e o
   * resultado bate com o gravado por construção — o cálculo é o mesmo dos dois
   * lados, e há teste de paridade provando (`emocoesParidade.spec.ts`).
   */
  transitosDoBackend?: ReadonlyArray<TransitoParaEmocao> | null
  valoresGravados?: Record<string, number> | null
  /**
   * A REFERENCIA de cada anel — o ponto contra o qual o numero do dia se le.
   *
   * ⚠️ ELA EXISTE PORQUE OS ANEIS NAO ESTAO NA MESMA ESCALA, e a roda os mostra
   * lado a lado como se estivessem. Medido: 45 fica acima de 90% dos casos no
   * Afeto e acima de so 33% no Entusiasmo. Sem a marca, a pessoa compara dois
   * aneis iguais na tela e le coisas opostas como se fossem a mesma.
   *
   * ⚠️ E UM SLOT, de proposito. O padrao e a referencia do ANEL (quanto aquele
   * anel costuma marcar). Quando a tendencia NATAL existir, ela entra aqui no
   * lugar — e a marca passa a dizer "comparado a VOCE" sem mudar nada do resto.
   */
  referencia?: Record<string, number> | null
  /**
   * A MEMORIA desta pessoa (`currentTransits.emocoes.historico`), escrita pelo
   * backend um registro por dia.
   *
   * ⚠️ Quando ha dias suficientes, ela VIRA a referencia: "acima do SEU normal"
   * e uma leitura muito melhor que "acima do normal deste anel", porque o que
   * interessa e o desvio da pessoa, nao da media de todo mundo.
   *
   * ⚠️ Com memoria curta, `baseDaPessoa` devolve null e a referencia do anel
   * continua valendo. Prometer "o seu normal" com tres dias e pior do que nao
   * prometer.
   */
  historico?: ReadonlyArray<DiaDeMemoria> | null
  /**
   * A TENDENCIA EMOCIONAL DO NATAL (`currentTransits.emocoesNatais.valores`),
   * calculada e gravada pelo backend.
   *
   * ⚠️ E A MELHOR REFERENCIA das tres, e nao so por ser astrologicamente mais
   * funda: ela existe desde o PRIMEIRO acesso. A memoria precisa de sete dias e
   * a referencia do anel nao sabe nada sobre esta pessoa. O mapa nao muda.
   *
   * ⚠️ As escalas foram calibradas para serem comparaveis (K por anel no natal,
   * medido em 53 mapas). Sem isso, "hoje acima do seu natal" seria afirmacao
   * sobre a curva, nao sobre a pessoa.
   */
  natal?: Record<string, number> | null
  /**
   * MODO NATAL: mostra o temperamento do MAPA em vez do clima de hoje.
   *
   * ⚠️ E um modo e nao um componente novo porque os aneis, o modal, o toque e o
   * glossario sao os mesmos. Duplicar a tela daria duas versoes do mesmo
   * desenho para divergir — o padrao que esta frente passou a semana
   * consertando.
   *
   * No modo natal nao ha marca de referencia: o natal E a referencia, e marcar
   * nele "o normal deste anel" compararia a pessoa com a media de todo mundo
   * numa tela que fala justamente do que ela tem de proprio.
   */
  modo?: 'dia' | 'natal'
  /**
   * Os ASPECTOS NATAIS que o motor ja calculou (`aspectsNatalToNatal`) — os
   * MESMOS que a grade de aspectos desenha.
   *
   * ⚠️ E a unica forma de a aba Grupos funcionar: o mapa do membro e montado
   * LOCALMENTE (`computeNatalChart`), nao vem do status dele — e o status de
   * outra pessoa nem estaria acessivel ao app. Lendo do gravado, a tendencia
   * natal existiria so para o dono da conta.
   *
   * De quebra, na aba Mapa ela aparece na hora, sem esperar o cache de 6h.
   *
   * ⚠️ E vem do MOTOR, nao de deteccao propria. A primeira versao detectava
   * aqui, com os 5 aspectos maiores e orbe fixa 6, e deu "Ansiedade 0" num mapa
   * cujo Jupiter faz quincuncio EXATO com Urano — com a grade logo acima
   * mostrando o aspecto. Usar a lista do motor faz a tendencia e a grade
   * concordarem por construcao.
   */
  aspectosNatais?: ReadonlyArray<AspectoNatal> | null
  idioma?: string
  /**
   * Versão enxuta, para quando os anéis NÃO são o assunto da tela — dentro do
   * card de um membro do grupo, por exemplo, onde eles dividem espaço com
   * nome, foto, áreas e sinastria.
   *
   * Encolhe o anel e esconde a linha de rodapé. O rótulo e o número ficam:
   * são a informação, e abaixo de 12px o nome deixa de ser legível, que é a
   * queixa que trouxe a fonte para 12 em primeiro lugar.
   */
  compacto?: boolean
}

/**
 * Cor por emoção, e não por faixa de valor.
 *
 * ⚠️ Diferente da roda de status, aqui a cor identifica QUAL emoção é, não quão
 * alta ela está — "Afeto 20" continua sendo afeto. Pintar pelo valor faria
 * afeto baixo ficar vermelho, dizendo o contrário do rótulo.
 *
 * ⚠️ A COR NÃO MARCA A COLUNA. As colunas são pares de opostos (afeto/estresse,
 * entusiasmo/desânimo, calma/ansiedade), mas dar a mesma cor aos dois de uma
 * coluna faria o anel de cima e o de baixo parecerem a mesma medida.
 *
 * ⚠️ Oito matizes DISTINTOS, um por anel, e não dois grupos (quente = tensão,
 * frio = alívio). Com cinco tons de vermelho lado a lado, nenhum deles
 * identifica mais nada — o olho só vê "vermelho" e precisa ler o rótulo de
 * novo. Desânimo é o cinza-azulado de propósito: é o anel apagado.
 */
const COR: Record<ChaveEmocao, [string, string]> = {
  afeto:         ['#EC4899', '#F472B6'],
  entusiasmo:    ['#22C55E', '#4ADE80'],
  calma:         ['#0EA5E9', '#38BDF8'],
  sensibilidade: ['#A78BFA', '#C4B5FD'],
  estresse:      ['#EF4444', '#FB7185'],
  desanimo:      ['#64748B', '#94A3B8'],
  ansiedade:     ['#F59E0B', '#FBBF24'],
  pressao:       ['#9333EA', '#A855F7'],
}

/**
 * ⚠️ Rótulo CURTO em todos os idiomas: com QUATRO por linha a célula fica em
 * ~89px, o que cabe ~11 caracteres em 12px. "Drive" em vez de "Enthusiasm" e
 * "Low mood" em vez de "Discouragement" não são preguiça de tradução — são o
 * que cabe sem reticências. "Sensível" em vez de "Sensibilidade" pela mesma
 * razão: o rótulo é o apelido do anel, o nome inteiro está no detalhe.
 */
const ROTULO: Record<ChaveEmocao, [string, string, string, string]> = {
  afeto:         ['Afeto', 'Affection', 'Afecto', 'Affetto'],
  entusiasmo:    ['Entusiasmo', 'Drive', 'Entusiasmo', 'Slancio'],
  calma:         ['Calma', 'Calm', 'Calma', 'Calma'],
  sensibilidade: ['Sensível', 'Sensitive', 'Sensible', 'Sensibile'],
  estresse:      ['Estresse', 'Stress', 'Estres', 'Stress'],
  desanimo:      ['Desânimo', 'Low mood', 'Desanimo', 'Sconforto'],
  ansiedade:     ['Ansiedade', 'Anxiety', 'Ansiedad', 'Ansia'],
  pressao:       ['Pressão', 'Pressure', 'Presion', 'Pressione'],
}

const TINTA = '#8892a4'
/**
 * O tom do NOME da tendência, embaixo do anel.
 *
 * ⚠️ Era `TINTA`, o mesmo cinza dos textos de apoio, e em 12px sobre o fundo
 * escuro não dava para ler. O nome é metade da informação — "45" sozinho não
 * diz 45 de quê —, então ele não pode ser a parte apagada do par.
 *
 * Aqui o peso também sobe para 600: a célula tem largura fixa, então o texto
 * mais grosso não rouba espaço de desenho nenhum. Na roda isso não foi feito
 * porque lá o chip se dimensiona pelo texto e a estimativa de largura não sabe
 * do peso.
 */
const TINTA_ROTULO = '#C7D2E8'
/**
 * A marca do normal de cada anel.
 *
 * Clara o bastante para ser vista sobre o trilho escuro e sobre o arco colorido
 * (ela cruza os dois), e NEUTRA de proposito: se levasse a cor da emocao,
 * competiria com o arco pela leitura e viraria mais um elemento colorido numa
 * roda que ja tem oito.
 */
const TINTA_MARCA = '#E6ECF8'
const TRILHO = '#232B3D'

export default function ClimaEmocional({ transitos, transitosDoBackend, valoresGravados, referencia, historico, natal, modo = 'dia', aspectosNatais, idioma, compacto }: Props) {
  const ehNatal = modo === 'natal'
  // ⚠️ ORDEM DAS REFERENCIAS, da melhor para a pior:
  //   1. a passada de fora (quem chama manda)
  //   2. o NATAL — o temperamento desta pessoa, disponivel desde o 1o acesso
  //   3. a MEMORIA — os ultimos dias dela, a partir de sete
  //   4. o ANEL — o normal geral daquele anel, que nao sabe nada dela
  //
  // Cada degrau abaixo e mais generico, e a leitura SEMPRE diz qual esta
  // usando: trocar a origem sem trocar o texto seria mentir sobre a
  // comparacao.
  const base = useMemo(() => baseDaPessoa(historico), [historico])
  // ⚠️ CALCULA DOS PLANETAS quando eles vierem, em vez de ler o gravado.
  //
  // Ler do status só funciona depois que o cache de 6h girar — e a aba Mapa
  // (que calcula) mostrava 45 enquanto a Home (que lia) mostrava 0 para o mesmo
  // anel, no mesmo aparelho, ao mesmo tempo. O cálculo é o mesmo dos dois
  // lados, então não há duas verdades: há uma que chega antes.
  const natalDoAnel = useMemo(() => {
    if (aspectosNatais?.length) {
      const r = emocoesDoNatal(aspectosNatais)
      if (r) return Object.fromEntries(r.map((e) => [e.chave, e.valor])) as Record<string, number>
    }
    return natal || null
  }, [aspectosNatais, natal])
  const temNatal = !!natalDoAnel && EMOCOES.some((k) => typeof natalDoAnel[k] === 'number' && Number.isFinite(natalDoAnel[k]))
  // ⚠️ No modo natal a marca SAI: o natal e a referencia, e marcar nele o
  // normal do anel compararia a pessoa com a media de todo mundo numa tela
  // que fala do que ela tem de proprio.
  const refs = ehNatal ? null : (referencia || (temNatal ? natalDoAnel : null) || base?.referencia || REFERENCIA_POR_ANEL)
  const origemDaRef: 'externa' | 'natal' | 'memoria' | 'anel' =
    referencia ? 'externa' : temNatal ? 'natal' : base ? 'memoria' : 'anel'
  const { width } = useWindowDimensions()
  const [aberta, setAberta] = useState<EmocaoDoDia | null>(null)

  const l = String(idioma || 'pt-BR')
  const tl = (pt: string, en: string, es: string, it: string) =>
    l.startsWith('en') ? en : l.startsWith('es') ? es : l.startsWith('it') ? it : pt

  const emocoes = useMemo(() => {
    // ⚠️ MODO NATAL: os valores vem do mapa, e o `porque` dos ASPECTOS NATAIS
    // gravados — a mesma lista que o backend usou para calcular, entao numero e
    // explicacao saem da mesma fonte, como no modo do dia.
    if (ehNatal) {
      // ⚠️ Calculado dos PLANETAS, nao lido do gravado: numero e explicacao
      // saem da mesma passagem, e funciona para o mapa de QUALQUER pessoa — o
      // do membro do grupo e montado localmente e nunca passou pelo backend.
      if (aspectosNatais?.length) return emocoesDoNatal(aspectosNatais)
      // Reserva: valores gravados sem os planetas (status antigo). Sem o
      // `porque`, porque inventa-lo de outra lista foi o bug do "Sensivel 54".
      if (!natal) return null
      const lista = EMOCOES.map((chave) => {
        const v = Number(natal[chave])
        return {
          chave,
          valor: Number.isFinite(v) ? Math.max(0, Math.min(100, Math.round(v))) : 0,
          pesa: EMOCAO_PESA[chave],
          porque: [] as Contribuicao[],
        }
      })
      return lista.some((e) => e.valor > 0) ? lista : null
    }

    // ⚠️ PRIMEIRA ESCOLHA: recalcular da lista do BACKEND.
    //
    // É o que faz o número e a explicação virem da MESMA fonte. Antes, o valor
    // vinha gravado e o `porque` do cálculo local, que roda sobre outra lista —
    // e a tela mostrou "Sensível 54" com "Nenhum trânsito de hoje mexe nisso".
    //
    // O resultado é idêntico ao gravado: mesmo cálculo, mesma entrada (há teste
    // de paridade dos dois lados). Então isto não é "outra conta", é a mesma
    // conta com o detalhe junto.
    if (transitosDoBackend?.length) {
      const doBackend = emocoesDoDia(transitosDoBackend)
      if (doBackend) return doBackend
    }

    const local = emocoesDoDia(transitos)
    if (!valoresGravados) return local

    // ⚠️ SEGUNDA ESCOLHA: valores gravados SEM a lista que os gerou (status de
    // uma versão anterior). O número é o certo, mas não há de onde tirar o
    // "de onde vem" — e inventar a explicação da lista local foi exatamente o
    // bug. Então `porque` fica VAZIO de propósito, e o modal diz que o detalhe
    // não está disponível em vez de afirmar que nenhum trânsito mexe nisso.
    const comGravado = EMOCOES.map((chave) => {
      const v = valoresGravados[chave]
      const doLocal = local?.find((e) => e.chave === chave)
      return {
        chave,
        valor: typeof v === 'number' && Number.isFinite(v) ? Math.max(0, Math.min(100, Math.round(v))) : (doLocal?.valor ?? 0),
        pesa: EMOCAO_PESA[chave],
        porque: [] as Contribuicao[],
      }
    })
    // Se o gravado veio vazio ou sem nenhuma chave conhecida, não vale nada:
    // oito zeros afirmariam "hoje você não sente nada".
    return comGravado.some((e) => e.valor > 0) ? comGravado : local
  }, [transitos, transitosDoBackend, valoresGravados, ehNatal, natal, aspectosNatais])

  // ⚠️ `null` quando não há trânsito: a seção inteira some. Seis zeros
  // afirmariam "hoje você não sente nada", quando o certo é não dizer nada.
  if (!emocoes) return null

  // ⚠️ Quatro por linha, duas linhas: as boas em cima, as difíceis embaixo.
  //
  // ⚠️ `porLinha` é 4 porque a ORDEM das emoções depende disso: com quatro por
  // linha cada coluna vira um par de opostos (ver EMOCOES em emocoesDoDia).
  // Mudar para 3 ou 5 não quebra nada — só desfaz o pareamento em silêncio.
  //
  // E 4 é o teto do telefone: a 5 colunas o anel cai para 48px e a 6 para 36px,
  // onde o número dentro dele deixa de ser legível.
  //
  // `largura` existe por causa de um bug real: a grade usa flex-wrap, que
  // quebra na largura do CONTAINER, não no número de colunas. Sem travar a
  // largura em `porLinha * celula`, numa tela mais larga cabiam cinco por
  // linha e a simetria 3+3 — que é metade do que a seção comunica — virava
  // 5+1. Era visível em tablet e no PWA, e não dava erro nenhum.
  const porLinha = 4
  const largura = Math.min(compacto ? 300 : 380, width - 24)
  const celula = largura / porLinha
  // ⚠️ O anel ficou MAIOR (era 46–60) porque a letra do rótulo subiu de 10 para
  // 12: em 10 o nome não se lia de relance num celular. Com a fonte maior o
  // rótulo precisa de mais largura, e um anel pequeno demais ao lado de um
  // texto legível fica desequilibrado.
  const tamanho = compacto
    ? Math.max(38, Math.min(46, celula - 24))
    : Math.max(52, Math.min(66, celula - 22))
  const traco = Math.max(5, Math.round(tamanho * 0.11))
  const raio = (tamanho - traco) / 2
  const perimetro = 2 * Math.PI * raio

  return (
    <View style={compacto ? s.blocoCompacto : s.bloco}>
      {/* ⚠️ SEM TÍTULO, a pedido — a Home acumulou cabeçalho demais e os oito
          rótulos já dizem o que cada anel é.

          A palavra "tendência" não se perdeu junto: ela desceu para a linha de
          baixo. Era ela que enquadrava os números como leitura do CÉU e não
          medida da pessoa, e sem nenhum enquadramento oito números de dois
          dígitos ao lado de "Ansiedade" e "Estresse" leem como diagnóstico. */}
      <View style={[s.grade, { width: largura }]}>
        {emocoes.map((e) => {
          const [escuro, claro] = COR[e.chave]
          const preenchido = (Math.max(0, Math.min(100, e.valor)) / 100) * perimetro
          // A marca do normal deste anel. `null` quando nao ha referencia — e
          // melhor nenhuma marca do que uma marca inventada.
          const ref = Number(refs?.[e.chave])
          const temRef = Number.isFinite(ref) && ref > 0 && ref < 100
          const anguloRef = temRef ? (ref / 100) * 360 - 90 : 0
          return (
            <Pressable
              key={e.chave}
              onPress={() => setAberta(e)}
              accessibilityRole="button"
              accessibilityLabel={
                temRef
                  ? `${tl(...ROTULO[e.chave])}: ${e.valor}, ${
                      e.valor > ref
                        ? tl('acima do normal', 'above normal', 'por encima de lo normal', 'sopra la norma')
                        : e.valor < ref
                          ? tl('abaixo do normal', 'below normal', 'por debajo de lo normal', 'sotto la norma')
                          : tl('no normal', 'at normal', 'en lo normal', 'nella norma')
                    }`
                  : `${tl(...ROTULO[e.chave])}: ${e.valor}`
              }
              style={({ pressed }) => [
                s.item,
                { width: celula, opacity: pressed ? 0.6 : 1 },
                compacto && { marginBottom: 6 },
              ]}
            >
              <View style={{ width: tamanho, height: tamanho }}>
                <Svg width={tamanho} height={tamanho}>
                  <Defs>
                    <LinearGradient id={`g-${e.chave}`} x1="0" y1="0" x2="1" y2="1">
                      <Stop offset="0%" stopColor={claro} />
                      <Stop offset="100%" stopColor={escuro} />
                    </LinearGradient>
                  </Defs>
                  {/* Trilho: mostra o quanto FALTA. Sem ele, um anel de 20% vira
                      um risco solto e perde a referência de escala. */}
                  <Circle cx={tamanho / 2} cy={tamanho / 2} r={raio} stroke={TRILHO} strokeWidth={traco} fill="none" />
                  <Circle
                    cx={tamanho / 2}
                    cy={tamanho / 2}
                    r={raio}
                    stroke={`url(#g-${e.chave})`}
                    strokeWidth={traco}
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${preenchido} ${perimetro}`}
                    // ⚠️ Começa no TOPO. Sem girar, o SVG começa na direita e o
                    // anel parece torto — o olho espera o zero às 12 horas.
                    transform={`rotate(-90 ${tamanho / 2} ${tamanho / 2})`}
                  />
                  {/* ⚠️ A MARCA DO NORMAL DESTE ANEL.
                      Um tracinho atravessando o anel no ponto de referencia: o
                      arco passando dele le "acima do normal", parando antes le
                      "abaixo". E o que torna dois aneis comparaveis sem mexer
                      no numero — que ja circula no WhatsApp e no agente.

                      Desenhada DEPOIS do arco: ordem de desenho decide quem
                      aparece em SVG, e este projeto ja perdeu uma camada
                      inteira por desenha-la antes do preenchimento. */}
                  {temRef ? (
                    <Line
                      x1={tamanho / 2 + (raio - traco / 2 - 1) * Math.cos((anguloRef * Math.PI) / 180)}
                      y1={tamanho / 2 + (raio - traco / 2 - 1) * Math.sin((anguloRef * Math.PI) / 180)}
                      x2={tamanho / 2 + (raio + traco / 2 + 1) * Math.cos((anguloRef * Math.PI) / 180)}
                      y2={tamanho / 2 + (raio + traco / 2 + 1) * Math.sin((anguloRef * Math.PI) / 180)}
                      stroke={TINTA_MARCA}
                      strokeWidth={1.5}
                      strokeLinecap="round"
                    />
                  ) : null}
                </Svg>
                {/* O número POR CIMA do anel: o arco dá a sensação, o número dá
                    o valor — e nenhum depende de cor para ser lido. */}
                <View style={[StyleSheet.absoluteFillObject, s.centro]}>
                  <Text style={[s.valor, { fontSize: Math.round(tamanho * 0.3) }]}>{e.valor}</Text>
                </View>
              </View>
              <Text style={compacto ? s.rotuloCompacto : s.rotulo} numberOfLines={1}>{tl(...ROTULO[e.chave])}</Text>
            </Pressable>
          )
        })}
      </View>

      {compacto ? null : (
      <Text style={s.nota}>
        {/* ⚠️ A legenda dizia "do DIA" embaixo dos anéis do MAPA. São as duas
            leituras que esta tela existe para distinguir — trocar o rótulo é
            trocar o significado dos oito números. */}
        {ehNatal
          ? tl(
              'Tendência do seu mapa · toque para ver de onde vem',
              'Your chart\'s tendency · tap to see where it comes from',
              'Tendencia de tu carta · toca para ver de donde viene',
              'Tendenza della tua carta · tocca per vedere da dove viene',
            )
          : tl(
              'Tendência do dia · toque para ver de onde vem',
              "The day's tendency · tap to see where it comes from",
              'Tendencia del dia · toca para ver de donde viene',
              'Tendenza del giorno · tocca per vedere da dove viene',
            )}
      </Text>
      )}

      <DetalheDaEmocao
        emocao={aberta}
        referencia={aberta ? refs?.[aberta.chave] : null}
        origemDaReferencia={ehNatal ? undefined : origemDaRef}
        ehNatal={ehNatal}
        diasDeMemoria={base?.dias ?? 0}
        natalDaEmocao={(() => {
          if (!aberta) return null
          const v = natalDoAnel?.[aberta.chave]
          return typeof v === 'number' && Number.isFinite(v) ? v : null
        })()}
        aoFechar={() => setAberta(null)}
        tl={tl}
        idioma={l}
      />
    </View>
  )
}

/**
 * A CONTA ABERTA: quais trânsitos produziram aquele número.
 *
 * ⚠️ É o que impede o indicador de ser um oráculo opaco. "Ansiedade 73" sozinho
 * não dá nada para a pessoa fazer; "veio de Plutão em conjunção com o seu Meio
 * do Céu" dá. E, como as contribuições saem da MESMA função que calcula o
 * total, a explicação nunca pode divergir do número.
 */
/**
 * A leitura de UM trânsito, montada na hora a partir do par.
 *
 * ⚠️ Usa `buildUnifiedTransitNarrative`, a MESMA função que a grade de
 * aspectos chama. Resolver o texto por outro caminho faria o mesmo trânsito
 * ser descrito de dois jeitos no mesmo app, dependendo de onde se toca.
 *
 * Devolve `null` quando não há texto — e aí o livrinho nem aparece, em vez de
 * abrir uma caixa vazia.
 */
function leituraDoAspecto(c: Contribuicao, idioma: string) {
  if (!c?.planeta || !c?.aspecto || !c?.alvo) return null
  const narrativa = buildUnifiedTransitNarrative(
    { transitPlanet: c.planeta, natalPlanet: c.alvo, type: c.aspecto, aspectName: c.aspecto } as any,
    null,
    idioma,
  )
  const corpo = String(narrativa?.modalBody || narrativa?.shortText || '').trim()
  return corpo || null
}

function DetalheDaEmocao({
  emocao,
  referencia,
  origemDaReferencia,
  diasDeMemoria,
  natalDaEmocao,
  ehNatal,
  aoFechar,
  tl,
  idioma,
}: {
  emocao: EmocaoDoDia | null
  /** O normal deste anel — a mesma referencia da marca na roda. */
  referencia?: number | null
  /**
   * DE ONDE vem a referencia acima.
   *
   * ⚠️ Muda o TEXTO, nao so o numero: "acima do seu natal" e uma afirmacao
   * sobre o temperamento da pessoa; "acima do normal deste anel", sobre a
   * escala. Trocar uma pela outra seria mentir sobre a origem da comparacao.
   */
  origemDaReferencia?: 'externa' | 'natal' | 'memoria' | 'anel'
  /** Quantos dias de memoria sustentam a base pessoal. */
  diasDeMemoria?: number
  /** O valor NATAL desta emocao, para aparecer explicito no detalhe. */
  natalDaEmocao?: number | null
  /** Quando o modal ja ESTA falando do natal: o verbete muda, e nao ha "hoje". */
  ehNatal?: boolean
  aoFechar: () => void
  tl: (pt: string, en: string, es: string, it: string) => string
  idioma: string
}) {
  // ⚠️ A LEITURA DO ASPECTO MORA AQUI, como estado do proprio detalhe.
  //
  // Antes era um <Modal> IRMAO, la fora. Relatado na tela: a interpretacao
  // abria ATRAS do modal do humor e o do humor nao fechava. Dois <Modal>
  // visiveis ao mesmo tempo no Android sao dois dialogos nativos, e alternar
  // `visible` num que ja esta montado nao o traz para a frente — irmaos sao
  // melhores que aninhados, mas nao resolvem isso.
  //
  // Como CAMADA dentro do mesmo modal, ela fica sempre por cima do conteudo e,
  // ao fechar, devolve a pessoa ao detalhe da emocao — que e para onde ela quer
  // voltar depois de ler o aspecto.
  const [leitura, setLeitura] = useState<{ titulo: string; corpo: string } | null>(null)
  if (!emocao) return null
  const [escuro] = COR[emocao.chave]

  // ⚠️ A MARGEM E PROPORCIONAL A REFERENCIA, nao um numero fixo — e esse e o
  // ponto da linha inteira. Um corte fixo ("acima de 60 e alto") repetiria
  // exatamente o erro que ela existe para corrigir: o normal do Afeto e 21 e o
  // da Ansiedade e 48, entao 10 pontos acima significam coisas diferentes nos
  // dois. Usar 20% da propria referencia mantem a leitura na escala do anel.
  //
  // O piso de 6 existe para os aneis de referencia baixa: 20% de 21 sao 4
  // pontos, e 4 pontos de diferenca nao sustentam a afirmacao "acima do
  // normal" num numero que se move dezenas de pontos por dia.
  const ref = Number(referencia)
  const comparacao = (() => {
    if (!Number.isFinite(ref) || ref <= 0) return null
    const d = emocao.valor - ref
    const margem = Math.max(6, Math.round(ref * 0.2))
    // ⚠️ O SUJEITO DA FRASE MUDA com a origem da referencia. Com memoria, a
    // comparacao e com a PESSOA e vale dizer isso — e citar quantos dias a
    // sustentam, para a afirmacao vir com o seu tamanho.
    const quanto = origemDaReferencia === 'memoria' && diasDeMemoria
      ? tl(` (${diasDeMemoria} dias de leitura)`, ` (${diasDeMemoria} days of readings)`, ` (${diasDeMemoria} dias de lectura)`, ` (${diasDeMemoria} giorni di letture)`)
      : ''
    const onde = origemDaReferencia === 'natal'
      ? tl('do seu mapa', 'your chart', 'de tu carta', 'della tua carta')
      : origemDaReferencia === 'memoria'
        ? tl('do seu normal', 'your normal', 'de tu normal', 'della tua norma')
        : tl('do normal deste anel', 'normal for this ring', 'de lo normal de este anillo', 'della norma di questo anello')
    if (d >= margem * 2) return tl(`Bem acima ${onde}.${quanto}`, `Well above ${onde}.${quanto}`, `Bastante por encima ${onde}.${quanto}`, `Ben sopra ${onde}.${quanto}`)
    if (d >= margem) return tl(`Acima ${onde}.${quanto}`, `Above ${onde}.${quanto}`, `Por encima ${onde}.${quanto}`, `Sopra ${onde}.${quanto}`)
    if (d <= -margem * 2) return tl(`Bem abaixo ${onde}.${quanto}`, `Well below ${onde}.${quanto}`, `Bastante por debajo ${onde}.${quanto}`, `Ben sotto ${onde}.${quanto}`)
    if (d <= -margem) return tl(`Abaixo ${onde}.${quanto}`, `Below ${onde}.${quanto}`, `Por debajo ${onde}.${quanto}`, `Sotto ${onde}.${quanto}`)
    // ⚠️ O caso "no normal" não aceita a mesma costura dos outros: capitalizar
    // `onde` produzia "Do seu normal, como de costume.", que não é português.
    if (origemDaReferencia === 'natal') return tl('Na mesma altura do seu mapa.', 'Level with your chart.', 'A la misma altura de tu carta.', 'Allo stesso livello della tua carta.')
    if (origemDaReferencia === 'memoria') return tl(`Dentro do seu normal.${quanto}`, `Within your normal.${quanto}`, `Dentro de tu normal.${quanto}`, `Dentro della tua norma.${quanto}`)
    return tl('Dentro do normal deste anel.', 'Within normal for this ring.', 'Dentro de lo normal de este anillo.', 'Dentro della norma di questo anello.')
  })()
  const nome = tl(...ROTULO[emocao.chave])
  // ⚠️ A EXPLICAÇÃO ANTES DA CONTA. "Ansiedade 73" sozinho é um oráculo: a
  // pessoa não sabe se é muito, se é dela, nem o que fazer. A definição diz o
  // que a palavra mede aqui, a leitura diz o que fazer com alto e com baixo, e
  // a fonte ensina quais planetas movem o anel — inclusive nos dias em que
  // nenhum deles aparece na lista logo abaixo.
  const verbete = GLOSSARIO_EMOCOES[emocao.chave]
  const i = indiceIdioma(idioma)

  // ⚠️ O filtro por `> 0` fica, mesmo sem nenhum peso negativo na tabela hoje:
  // o alívio virou anel próprio (Calma), mas se algum peso voltar a ser
  // negativo, uma linha com "-0,3" no meio de positivos leria como erro.
  const pesam = emocao.porque.filter((c) => c.valor > 0)
  const aliviam = emocao.porque.filter((c) => c.valor < 0)
  const total = emocao.porque.reduce((a, c) => a + Math.abs(c.valor), 0) || 1

  const linha = (c: typeof emocao.porque[number], k: number) => {
    const leitura = leituraDoAspecto(c, idioma)
    const texto = (
      <Text style={s.linhaTexto}>
        {/* ⚠️ O aspecto PASSA pelo rótulo: o motor grava `quincuncio`,
            `oposicao` — sem acento — e às vezes em inglês. */}
        {translatePlanet(c.planeta, idioma as any)}{' '}
        <Text style={s.linhaAspecto}>{rotuloDeAspecto(c.aspecto, idioma as any).toLowerCase()}</Text>{' '}
        {translatePlanet(c.alvo, idioma as any)}
      </Text>
    )
    return (
      <View key={`${c.planeta}-${c.aspecto}-${c.alvo}-${k}`} style={s.linha}>
        <View style={[s.barra, { width: `${Math.min(100, (Math.abs(c.valor) / total) * 100)}%`, backgroundColor: escuro }]} />
        {/* ⚠️ O livro só aparece quando HÁ leitura por trás. Um ícone que
            promete e não abre nada é pior do que ícone nenhum — e aqui dá para
            saber antes, porque o texto é resolvido na hora de desenhar.

            É o mesmo livro da grade de aspectos: um ícone que significa a
            mesma coisa em dois lugares ensina. */}
        {leitura ? (
          <Pressable
            onPress={() => setLeitura({ titulo:
              `${translatePlanet(c.planeta, idioma as any)} ${rotuloDeAspecto(c.aspecto, idioma as any).toLowerCase()} ${translatePlanet(c.alvo, idioma as any)}`,
              corpo: leitura })}
            accessibilityRole="button"
            accessibilityLabel={tl('Ler este aspecto', 'Read this aspect', 'Leer este aspecto', 'Leggi questo aspetto')}
            hitSlop={8}
            style={({ pressed }) => [s.linhaBotao, pressed && { opacity: 0.55 }]}
          >
            {texto}
            <Ionicons name="book-outline" size={14} color={escuro} style={s.livro} />
          </Pressable>
        ) : (
          texto
        )}
      </View>
    )
  }

  return (
    <Modal visible transparent animationType="fade" onRequestClose={aoFechar}>
      <Pressable style={s.fundo} onPress={aoFechar}>
        <Pressable style={s.caixa} onPress={() => {}}>
          <View style={s.cabecalho}>
            <Text style={[s.caixaTitulo, { color: escuro }]}>{nome}</Text>
            <Text style={[s.caixaValor, { color: escuro }]}>{emocao.valor}</Text>
          </View>

          {/* ⚠️ O NUMERO SOZINHO E UM ORACULO. "54" nao diz se e muito — e a
              comparacao com o anel do lado engana, porque as escalas sao
              diferentes (45 fica acima de 90% dos casos no Afeto e acima de so
              33% no Entusiasmo). Esta linha responde "54 de quanto?" contra o
              normal DAQUELE anel, que e o mesmo ponto da marca na roda.

              Some quando nao ha referencia: sem base, qualquer comparacao
              seria inventada. */}
          {comparacao ? <Text style={s.comparacao}>{comparacao}</Text> : null}

          <ScrollView style={{ maxHeight: 380 }}>
            <Text style={s.definicao}>{verbete.definicao[i]}</Text>
            {/* ⚠️ No natal, a leitura de "alto e baixo" do DIA nao serve: ela
                fala do que fazer hoje. A linha `natal` diz o que o valor
                significa como ESTRUTURA — e a distincao que ela carrega
                (estrutura x momento) e a leitura inteira desta tela. */}
            <Text style={s.leitura}>{ehNatal ? verbete.natal[i] : verbete.leitura[i]}</Text>
            <Text style={s.fonte}>{verbete.fonte[i]}</Text>

            {/* ⚠️ O NUMERO DO NATAL, explicito. E o que transforma o valor do
                dia em leitura: "Sensibilidade 56" nao diz nada; "56 hoje, 14 no
                seu mapa" diz que o ceu esta mexendo num ponto que normalmente e
                discreto nela.

                ⚠️ As duas escalas foram calibradas para serem comparaveis (K
                por anel no natal, medido em 53 mapas). Sem isso, poe-los lado a
                lado convidaria a uma subtracao que nao significa nada.

                ⚠️ "Mapa" e nao "voce": o numero diz quantos aspectos natais
                alimentam aquele anel, nao que a pessoa E assim. */}
            {/* ⚠️ `typeof === 'number'` ANTES do isFinite, e não `Number(x)`.
                `Number(null)` é 0 e 0 PASSA no isFinite — então "o natal não
                chegou" virava "o seu mapa marca zero aqui", que é uma
                afirmação, e falsa. Foi o que a tela mostrou: oito zeros na Home
                enquanto a aba Mapa exibia os valores certos.

                Este projeto já levou essa mordida em `scoreDeltaText`, onde
                "não existe score de ontem" virava "ontem foi zero". */}
            {!ehNatal && typeof natalDaEmocao === 'number' && Number.isFinite(natalDaEmocao) ? (
              <View style={s.natalLinha}>
                <Text style={s.natalRotulo}>
                  {tl('No seu mapa', 'In your chart', 'En tu carta', 'Nella tua carta')}
                </Text>
                <Text style={[s.natalValor, { color: escuro }]}>{Math.round(Number(natalDaEmocao))}</Text>
              </View>
            ) : null}

            {pesam.length ? (
              <>
                <Text style={s.secao}>
                  {ehNatal
                    ? tl('No mapa, vem de', 'In the chart, it comes from', 'En la carta, viene de', 'Nella carta, viene da')
                    : emocao.pesa
                      ? tl('O que puxa para cima', 'What pushes it up', 'Lo que lo sube', 'Cosa lo spinge su')
                      : tl('O que favorece', 'What favors it', 'Lo que favorece', 'Cosa lo favorisce')}
                </Text>
                {pesam.map(linha)}
              </>
            ) : null}

            {aliviam.length ? (
              <>
                <Text style={s.secao}>{tl('O que alivia', 'What eases it', 'Lo que alivia', 'Cosa lo allevia')}</Text>
                {aliviam.map(linha)}
              </>
            ) : null}

            {/* ⚠️ DUAS AUSÊNCIAS DIFERENTES, e confundi-las foi o bug.
                "Nenhum trânsito mexe nisso" é uma AFIRMAÇÃO — e ela só é
                verdadeira quando o número é zero. Com o anel marcando 54, a
                mesma frase vira contradição: a pessoa lê que não há nada
                movendo algo que claramente está alto, e passa a duvidar do
                número inteiro. Quando há valor mas não há lista, o honesto é
                dizer que o detalhe não veio. */}
            {!pesam.length && !aliviam.length ? (
              <Text style={s.vazio}>
                {emocao.valor > 0
                  ? tl(
                      'O detalhe de onde vem não carregou nesta leitura. O número está certo; abra de novo daqui a pouco.',
                      'The breakdown did not load for this reading. The number is right; try again shortly.',
                      'El detalle de donde viene no cargo en esta lectura. El numero esta correcto; abre de nuevo en un momento.',
                      'Il dettaglio di dove viene non e stato caricato. Il numero e corretto; riprova tra poco.',
                    )
                  : ehNatal
                    ? tl('Nenhum aspecto do seu mapa alimenta este anel.', 'No aspect in your chart feeds this ring.', 'Ningun aspecto de tu carta alimenta este anillo.', 'Nessun aspetto della tua carta alimenta questo anello.')
                    : tl('Nenhum trânsito de hoje mexe nisso.', 'No transit today stirs this.', 'Ningun transito de hoy mueve esto.', 'Nessun transito di oggi muove questo.')}
              </Text>
            ) : null}
          </ScrollView>

          {/* ⚠️ A moldura fica AQUI, onde a pessoa está olhando a conta — e não
              só numa linha solta embaixo dos anéis, fácil de não ler. */}
          {/* ⚠️ A RESSALVA TEM DE CASAR COM O QUE A TELA MOSTRA. No modo natal
              ela dizia "do céu de HOJE" sobre um MAPA — negando o que a pessoa
              está vendo. A fronteira que a frase protege é a mesma nos dois
              casos (leitura, não medida da pessoa), mas o sujeito muda. */}
          <Text style={s.aviso}>
            {ehNatal
              ? tl(
                  'Leitura do seu mapa, não medida de quem você é.',
                  'A reading of your chart, not a measure of who you are.',
                  'Lectura de tu carta, no medida de quien eres.',
                  'Lettura della tua carta, non misura di chi sei.',
                )
              : tl(
                  'Tendência do céu de hoje, não medida do seu estado.',
                  "Today's sky tendency, not a measure of your state.",
                  'Tendencia del cielo de hoy, no medida de tu estado.',
                  'Tendenza del cielo di oggi, non misura del tuo stato.',
                )}
          </Text>
          {/* ⚠️ PRESSABLE, nao Text. Ele vivia dentro do <Pressable> da caixa,
              que existe para ENGOLIR o toque e impedir que tocar no conteudo
              feche pelo fundo — entao o texto prometia uma acao e nao fazia
              nada. Relatado: "so fecha quando clico fora da janela". */}
          <Pressable
            onPress={aoFechar}
            accessibilityRole="button"
            hitSlop={10}
            style={({ pressed }) => pressed && { opacity: 0.6 }}
          >
            <Text style={s.fechar}>{tl('Tocar para fechar', 'Tap to close', 'Toca para cerrar', 'Tocca per chiudere')}</Text>
          </Pressable>

          {/* ⚠️ A LEITURA DO ASPECTO, COMO CAMADA e nao como outro Modal.
              Fica por cima do detalhe dentro do MESMO modal nativo, e fechar
              devolve a pessoa ao detalhe em vez de sair da emocao inteira. */}
          {leitura ? (
            <Pressable style={s.camada} onPress={() => setLeitura(null)}>
              <Pressable style={s.camadaCaixa} onPress={() => {}}>
                <Text style={s.leituraTitulo}>{leitura.titulo}</Text>
                <ScrollView style={{ maxHeight: 320 }}>
                  <Text style={s.leituraCorpo}>{leitura.corpo}</Text>
                </ScrollView>
                <Pressable
                  onPress={() => setLeitura(null)}
                  accessibilityRole="button"
                  hitSlop={10}
                  style={({ pressed }) => pressed && { opacity: 0.6 }}
                >
                  <Text style={s.fechar}>{tl('Voltar', 'Back', 'Volver', 'Indietro')}</Text>
                </Pressable>
              </Pressable>
            </Pressable>
          ) : null}
        </Pressable>
      </Pressable>
    </Modal>
  )
}

const s = StyleSheet.create({
  // Sem o título, o respiro de cima vem daqui — senão os anéis encostam no
  // bloco anterior.
  bloco: { paddingVertical: 12, marginBottom: 4 },
  blocoCompacto: { paddingVertical: 4, marginBottom: 0 },
  // ⚠️ `alignSelf: center` + largura fixa vinda do componente: é o que garante
  // três por linha. Sem isso o wrap segue a largura da tela.
  grade: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignSelf: 'center' },
  item: { alignItems: 'center', marginBottom: 10 },
  centro: { alignItems: 'center', justifyContent: 'center' },
  valor: { color: '#F2F5FA', fontWeight: '800' },
  // ⚠️ 12 e não 10: em 10 o nome da tendência ficava miúdo demais para ler de
  // relance. O rótulo é metade da informação — o número sem a palavra não diz
  // nada —, então ele não pode ser o primeiro a encolher.
  rotulo: { fontSize: 12, color: TINTA_ROTULO, fontWeight: '600', marginTop: 5, textAlign: 'center' },
  // No compacto o anel encolhe mas o rótulo NÃO: abaixo de 12px o nome deixa
  // de ser legível, e é o nome que diz o que o número significa.
  rotuloCompacto: { fontSize: 12, color: TINTA_ROTULO, fontWeight: '600', marginTop: 3, textAlign: 'center' },
  // ⚠️ Era #5c6477 — mais escuro ainda que o rótulo, e é a linha que diz que
  // estes números são leitura do céu e não medida da pessoa. A ressalva que
  // ninguém consegue ler não cumpre o papel de ressalva.
  nota: { fontSize: 11, color: '#8892a4', textAlign: 'center', marginTop: 2 },

  fundo: { flex: 1, backgroundColor: 'rgba(5,7,18,0.82)', alignItems: 'center', justifyContent: 'center', padding: 24 },
  caixa: { width: '100%', maxWidth: 380, backgroundColor: '#13162B', borderRadius: 16, borderWidth: 1, borderColor: '#242B40', padding: 16 },
  cabecalho: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 10 },
  caixaTitulo: { fontSize: 16, fontWeight: '800' },
  caixaValor: { fontSize: 22, fontWeight: '800' },
  // Discreta: e contexto para o numero grande acima, nao uma afirmacao nova.
  comparacao: {
    color: TINTA_ROTULO,
    fontSize: 14,
    marginTop: -2,
    marginBottom: 10,
  },
  // O natal ao lado do rotulo: e referencia, nao um segundo titulo.
  natalLinha: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 2,
    paddingTop: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#2a3148',
  },
  natalRotulo: { color: TINTA_ROTULO, fontSize: 14 },
  natalValor: { fontSize: 18, fontWeight: '700' },
  definicao: { fontSize: 13, color: '#E8ECF5', lineHeight: 19 },
  leitura: { fontSize: 12.5, color: TINTA, lineHeight: 18, marginTop: 8 },
  // A fonte fica em caixa alta e miúda: é referência, não leitura corrida.
  fonte: {
    fontSize: 9.5,
    color: '#5c6477',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#242B40',
  },
  secao: { fontSize: 10, color: TINTA, textTransform: 'uppercase', letterSpacing: 1, marginTop: 10, marginBottom: 4 },
  linha: { paddingVertical: 5, justifyContent: 'center' },
  // A barra fica ATRÁS do texto: ela dá o peso relativo sem roubar uma coluna.
  barra: { position: 'absolute', left: 0, top: 2, bottom: 2, borderRadius: 4, opacity: 0.16 },
  linhaTexto: { fontSize: 12, color: '#E8ECF5', paddingHorizontal: 8 },
  linhaAspecto: { color: TINTA },
  // O texto ocupa o que sobra e o livro fica na ponta direita, sempre na mesma
  // coluna — alinhado, ele vira uma affordance; desalinhado, vira enfeite.
  linhaBotao: { flexDirection: 'row', alignItems: 'center' },
  livro: { marginLeft: 'auto', paddingRight: 6 },
  // A camada cobre o modal inteiro, por dentro dele — nao e outro Modal.
  camada: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(5,7,18,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 18,
  },
  camadaCaixa: { width: '100%', backgroundColor: '#161D33', borderRadius: 16, padding: 16 },
  leituraTitulo: { fontSize: 16, fontWeight: '800', color: '#E8ECF5', marginBottom: 10 },
  leituraCorpo: { fontSize: 14, color: '#C7D2E8', lineHeight: 21 },
  vazio: { fontSize: 12, color: TINTA, paddingVertical: 10 },
  aviso: { fontSize: 10, color: '#5c6477', marginTop: 12, lineHeight: 14 },
  fechar: { fontSize: 10, color: '#5c6477', textAlign: 'center', marginTop: 8 },
})
