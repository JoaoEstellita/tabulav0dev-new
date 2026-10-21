import React, { useMemo } from 'react'
import { View, Text, StyleSheet, Pressable, useWindowDimensions } from 'react-native'
import Svg, { Polygon, Line, Circle, Defs, RadialGradient, LinearGradient, Stop } from 'react-native-svg'
import { STATUS_THRESHOLDS } from '../constants/statusThresholds'
import {
  poligonoDosValores,
  anelDeReferencia,
  pontoNoEixo,
  rotuloDoEixo,
  fracaoDoValor,
  paraPoints,
  corDoValor,
  melhorGiro,
  type EixoDaRoda,
} from '../utils/geometriaDaRoda'

/**
 * A roda de status: as oito áreas da vida num octógono, como ficha de atributos.
 *
 * ⚠️ Escolha de PRODUTO, não de legibilidade. Para comparar magnitudes uma barra
 * lê melhor — num radar a área cresce com o QUADRADO do valor e o ângulo
 * distorce a comparação. O que o radar dá e a barra não é identidade: uma figura
 * que a pessoa reconhece como "eu hoje". Para valer sem enganar, três regras:
 *
 *  1. A ÁREA NUNCA CARREGA A MENSAGEM — o número vai escrito em cada eixo.
 *  2. A ORDEM DOS EIXOS É FIXA e nunca ordenada por valor: ordenar mudaria a
 *     silhueta todo dia e a figura de hoje deixaria de se comparar com a de
 *     ontem. (O GIRO do conjunto é outra coisa e é livre — ver `melhorGiro`.)
 *  3. A ESCALA É 0–100 FIXA. Auto-escalar pelo próprio mínimo e máximo ficaria
 *     mais dramático e seria mentira: quem tem tudo entre 28 e 49 veria a mesma
 *     figura de quem tem tudo entre 60 e 90.
 *
 * Medido no banco: a amplitude entre áreas tem mediana de 30 pontos e mínimo de
 * 8, e os valores vivem entre ~26 e ~77 — num eixo 0–100 cheio o polígono fica
 * quase circular. Daí os ANÉIS DE REFERÊNCIA nos limiares que o app já usa (35 e
 * 62): a leitura deixa de ser "que forma é essa" e vira "o que furou o anel".
 */

type Props = {
  eixos: EixoDaRoda[]
  /** Abre a leitura daquela área. Sem isto, a roda é só enfeite. */
  aoTocarEixo?: (chave: string) => void
}

// ⚠️ As MESMAS cores dos cards de área. Uma terceira régua de cor na mesma tela
// faria o verde da roda e o verde do card parecerem coisas diferentes.
//
// O validador de paleta mediu verde↔âmbar em ΔE 8.9 sob protanopia: passa no
// piso, mas por pouco. Daí o número em cada eixo — cor nunca anda sozinha.
const CORES = {
  critico: '#EF4444',
  moderado: '#F59E0B',
  bom: '#10B981',
  vazio: '#4B5563',
} as const

const TRILHO = '#232B3D'
const TINTA = '#8892a4'
const TINTA_FORTE = '#F2F5FA'
const ACENTO = '#9BB4E8'

const FONTE_ROTULO = 10
/**
 * ⚠️ Medida APROXIMADA do texto, porque em React Native não dá para medir antes
 * de renderizar. O fator 0.55 da largura por caractere é conservador para a
 * fonte do sistema; errar para mais só encolhe um pouco a roda, enquanto errar
 * para menos cortaria o nome — então o erro aceitável tem lado.
 */
/**
 * ⚠️ O PADDING DO CHIP ENTRA NA MEDIDA.
 *
 * Cada área é um botão, e o que a faz parecer botão é o chip em volta. Se a
 * busca do raio medisse só o texto, os chips estourariam para fora do desenho —
 * o mesmo erro que já custou duas versões deste componente.
 *
 * A folga caiu de 12 para 6 junto: o padding do chip cumpre o papel de afastar
 * o rótulo da borda que a folga cumpria antes. Medido, o par custa pouco —
 * diâmetro de 224 para 212 numa tela de 390pt.
 */
const PADDING_CHIP = 6
/**
 * ⚠️ O fator era 0.55 e CORTAVA "Amor" — virava "Am…".
 *
 * A média por caractere subestima palavra curta com letra larga: "Amor" tem A
 * maiúsculo e m, bem acima da média. Como a largura do chip vinha daqui, o chip
 * nascia estreito demais e o texto era elidido.
 *
 * Duas defesas agora: o fator subiu para 0.62, folgado para o pior caso, e o
 * chip passou a se DIMENSIONAR PELO CONTEÚDO em vez de receber largura fixa —
 * então esta medida só governa o espaçamento, e uma estimativa um pouco errada
 * não corta mais nenhum nome.
 */
const medirRotulo = (texto: string) => texto.length * FONTE_ROTULO * 0.62 + 2 + PADDING_CHIP * 2
const FOLGA_ROTULO = 6

export default function RodaDeStatus({ eixos, aoTocarEixo }: Props) {
  const { width } = useWindowDimensions()

  // O teto evita que num tablet a roda vire pôster; o piso evita que num
  // aparelho estreito ela encolha até o polígono virar um ponto.
  const lado = Math.min(360, Math.max(270, width - 40))
  const centro = { x: lado / 2, y: lado / 2 }
  const total = eixos.length

  const limiares = {
    criticalBelow: STATUS_THRESHOLDS.criticalBelow,
    positiveAbove: STATUS_THRESHOLDS.positiveAbove,
  }

  /**
   * ⚠️ O giro e o raio saem de uma BUSCA, não de números escolhidos a dedo.
   *
   * Com os nomes por extenso, "Espiritualidade" caía na lateral esquerda — a
   * posição mais apertada — e sozinha limitava o diâmetro a 140px; numa tela de
   * 320pt não cabia nada. Girando o conjunto, os nomes longos vão para topo e
   * base, onde o rótulo centraliza e dispõe da largura toda, e o diâmetro vai a
   * 224px. Como os rótulos mudam de tamanho por idioma, isso é calculado em
   * runtime em vez de ficar fixo.
   */
  const { giro, raio } = useMemo(
    () => melhorGiro(eixos.map((e) => e.rotulo), lado, medirRotulo, FOLGA_ROTULO),
    [eixos, lado],
  )

  const geo = useMemo(() => {
    if (!total || raio <= 0) return null
    return {
      valores: paraPoints(poligonoDosValores(eixos, raio, centro, giro)),
      borda: paraPoints(anelDeReferencia(1, total, raio, centro, giro)),
      teias: [0.25, 0.5, 0.75].map((f) => paraPoints(anelDeReferencia(f, total, raio, centro, giro))),
      critico: paraPoints(anelDeReferencia(limiares.criticalBelow / 100, total, raio, centro, giro)),
      bom: paraPoints(anelDeReferencia(limiares.positiveAbove / 100, total, raio, centro, giro)),
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eixos, raio, giro, lado, total, limiares.criticalBelow, limiares.positiveAbove])

  // Sem eixo não há roda — e um octógono vazio na tela parece defeito.
  if (!total || !geo) return null

  return (
    <View style={s.bloco}>
      <View style={{ width: lado, height: lado, alignSelf: 'center' }}>
        <Svg width={lado} height={lado}>
          <Defs>
            {/* Brilho suave no miolo: dá profundidade sem desenhar nada por
                cima dos dados. */}
            <RadialGradient id="miolo" cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor={ACENTO} stopOpacity={0.14} />
              <Stop offset="100%" stopColor={ACENTO} stopOpacity={0} />
            </RadialGradient>
            {/* O preenchimento do polígono desce de cima para baixo: a figura
                ganha volume e deixa de parecer um adesivo chapado. */}
            <LinearGradient id="area" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="#A9C2F2" stopOpacity={0.42} />
              <Stop offset="100%" stopColor="#6E8BC4" stopOpacity={0.16} />
            </LinearGradient>
          </Defs>

          <Polygon points={geo.borda} fill="url(#miolo)" />

          {/* Raios: dão a direção de cada eixo sem competir com o polígono. */}
          {eixos.map((e, i) => {
            const p = pontoNoEixo(i, total, 1, raio, centro, giro)
            return (
              <Line
                key={`raio-${e.chave}`}
                x1={centro.x}
                y1={centro.y}
                x2={p.x}
                y2={p.y}
                stroke={TRILHO}
                strokeWidth={1}
                strokeOpacity={0.55}
              />
            )
          })}

          {/* ⚠️ Os anéis são POLÍGONOS, não círculos: num radar o valor mora no
              vértice, e um anel circular passaria por dentro das arestas — um
              valor que encosta no limiar pareceria estar abaixo dele.
              Três teias fracas em vez de uma: dão noção de escala sem pedir
              atenção, como o papel milimetrado atrás de um gráfico. */}
          {geo.teias.map((pts, k) => (
            <Polygon
              key={`teia-${k}`}
              points={pts}
              fill="none"
              stroke={TRILHO}
              strokeWidth={1}
              strokeOpacity={0.45}
            />
          ))}
          <Polygon points={geo.borda} fill="none" stroke={TRILHO} strokeWidth={1} />
          <Polygon
            points={geo.critico}
            fill="none"
            stroke={CORES.critico}
            strokeWidth={1}
            strokeOpacity={0.45}
            strokeDasharray="2 5"
          />
          <Polygon
            points={geo.bom}
            fill="none"
            stroke={CORES.bom}
            strokeWidth={1}
            strokeOpacity={0.45}
            strokeDasharray="2 5"
          />

          {/* O polígono dos valores: ele dá a silhueta; quem informa é o número.
              O traço vai em DUAS camadas — uma larga e quase transparente por
              baixo faz as vezes de brilho, que o SVG do React Native não tem
              como sombra. */}
          <Polygon
            points={geo.valores}
            fill="none"
            stroke={ACENTO}
            strokeWidth={7}
            strokeOpacity={0.14}
            strokeLinejoin="round"
          />
          <Polygon
            points={geo.valores}
            fill="url(#area)"
            stroke={ACENTO}
            strokeWidth={2.5}
            strokeLinejoin="round"
          />

          {eixos.map((e, i) => {
            const p = pontoNoEixo(i, total, fracaoDoValor(e.valor), raio, centro, giro)
            const cor = corDoValor(e.valor, limiares, CORES)
            return (
              <React.Fragment key={`ponto-${e.chave}`}>
                {/* Halo + anel escuro: sem eles, um vértice sobre a linha do
                    polígono some dentro do próprio traço. */}
                <Circle cx={p.x} cy={p.y} r={10} fill={cor} fillOpacity={0.16} />
                {/* O anel escuro acompanha o FUNDO DO APP (o degrade vai de
                    #0F0F23 a #1A1A3A), nao mais o fundo de um card. */}
                <Circle cx={p.x} cy={p.y} r={6} fill="#141731" />
                <Circle cx={p.x} cy={p.y} r={4.5} fill={cor} />
                {/* Ponto claro no centro: o vértice deixa de ser um disco chapado
                    e passa a ter brilho, como uma conta de vidro. */}
                <Circle cx={p.x - 1} cy={p.y - 1} r={1.4} fill="#FFFFFF" fillOpacity={0.75} />
              </React.Fragment>
            )
          })}
        </Svg>

        {/* Nome + número + alvo de toque na mesma caixa.
            ⚠️ Juntos de propósito: o ponto do vértice tem 4px e ninguém acerta
            nele. Com o nome sendo o alvo, o toque fica do tamanho de uma
            palavra — e fica óbvio o que é tocável. */}
        {eixos.map((e, i) => {
          const r = rotuloDoEixo(i, total, raio, centro, FOLGA_ROTULO, giro)
          /**
           * ⚠️ Sem `width`: o chip se ajusta ao próprio texto.
           *
           * Antes ele recebia a largura ESTIMADA, e quando a estimativa errava
           * para menos o nome era cortado — foi o que aconteceu com "Amor".
           * Agora a caixa é presa pelo lado que importa e solta do outro, então
           * ela cresce o quanto o texto precisar e NUNCA passa da borda:
           *
           *   direita  left: x,  right: 0        cresce para a direita, até a borda
           *   esquerda left: 0,  right: lado-x   cresce para a esquerda, até a borda
           *   topo/base left: 0, right: 0        centraliza, que é onde o eixo está
           */
          const prende =
            r.ancora === 'start'
              ? { left: r.x, right: 0, alignItems: 'flex-start' as const }
              : r.ancora === 'end'
              ? { left: 0, right: lado - r.x, alignItems: 'flex-end' as const }
              : { left: 0, right: 0, alignItems: 'center' as const }
          // Dentro do chip o texto sempre centraliza; quem muda com o lado da
          // roda e a POSICAO do chip, nao o alinhamento do conteudo.
          const alinhamento = 'center' as const
          const temValor = e.valor !== null && e.valor !== undefined
          const cor = corDoValor(e.valor, limiares, CORES)
          // ⚠️ O chip É o sinal de que dá para tocar. Sem ele, oito textos
          // soltos ao redor de um desenho não se parecem com botões, e a leitura
          // completa de cada área ficava escondida atrás de um toque que ninguém
          // adivinha. A borda leva a COR DA FAIXA, então o chip também repete o
          // status sem gastar mais espaço.
          const caixa = { position: 'absolute' as const, top: r.y - 19, ...prende }
          const estilo = (pressed: boolean) => [
            s.chip,
            {
              borderColor: pressed ? cor : `${cor}55`,
              backgroundColor: pressed ? 'rgba(155,180,232,0.20)' : 'rgba(18,22,44,0.72)',
            },
          ]
          const conteudo = (
            <>
              <Text style={[s.rotulo, { textAlign: alinhamento }]} numberOfLines={1}>
                {e.rotulo}
              </Text>
              {/* ⚠️ O NÚMERO, sempre. É ele que faz a roda não depender nem da
                  área (que engana) nem da cor (verde e âmbar quase se encostam
                  sob protanopia). */}
              {/* O número na COR DA FAIXA: o numeral continua sendo o canal que
                  não depende de cor, então pintá-lo não tira acessibilidade —
                  e amarra o chip ao ponto correspondente na roda. */}
              <Text style={[s.valor, { color: temValor ? cor : CORES.vazio }]}>
                {temValor ? Math.round(Number(e.valor)) : '—'}
              </Text>
            </>
          )

          // ⚠️ `View` NÃO aceita `style` como função — só `Pressable` aceita.
          // Trocar o componente por uma variável `any` e passar a função nos dois
          // casos compila (o `any` engole) e quebra em runtime quando a roda é
          // montada sem `aoTocarEixo`.
          if (!aoTocarEixo) {
            return (
              <View key={`rotulo-${e.chave}`} style={caixa}>
                <View style={estilo(false)}>{conteudo}</View>
              </View>
            )
          }

          return (
            <View key={`rotulo-${e.chave}`} style={caixa}>
              <Pressable
                onPress={() => aoTocarEixo(e.chave)}
                accessibilityRole="button"
                accessibilityLabel={`${e.rotulo}: ${temValor ? Math.round(Number(e.valor)) : 'sem dado'}`}
                android_ripple={{ color: 'rgba(155,180,232,0.25)', borderless: false }}
                hitSlop={8}
                style={({ pressed }) => estilo(pressed)}
              >
                {conteudo}
              </Pressable>
            </View>
          )
        })}
      </View>

    </View>
  )
}

const s = StyleSheet.create({
  // ⚠️ SEM moldura: a roda assenta direto no fundo do app, sem card em volta.
  // Por isso nada de `backgroundColor` nem `borderWidth` aqui — qualquer um dos
  // dois recortaria um retangulo sobre o degrade da tela.
  bloco: {
    paddingVertical: 8,
    marginBottom: 4,
  },
  chip: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: PADDING_CHIP + 2,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  rotulo: { fontSize: FONTE_ROTULO, color: TINTA, lineHeight: 13 },
  valor: { fontSize: 15, fontWeight: '800', lineHeight: 18 },
})
