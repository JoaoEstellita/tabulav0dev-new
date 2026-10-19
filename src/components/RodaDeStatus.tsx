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
  titulo?: string
  legenda?: string
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

const FONTE_ROTULO = 11
/**
 * ⚠️ Medida APROXIMADA do texto, porque em React Native não dá para medir antes
 * de renderizar. O fator 0.55 da largura por caractere é conservador para a
 * fonte do sistema; errar para mais só encolhe um pouco a roda, enquanto errar
 * para menos cortaria o nome — então o erro aceitável tem lado.
 */
const medirRotulo = (texto: string) => texto.length * FONTE_ROTULO * 0.55 + 2
const FOLGA_ROTULO = 12

export default function RodaDeStatus({ eixos, aoTocarEixo, titulo, legenda }: Props) {
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
      meio: paraPoints(anelDeReferencia(0.5, total, raio, centro, giro)),
      critico: paraPoints(anelDeReferencia(limiares.criticalBelow / 100, total, raio, centro, giro)),
      bom: paraPoints(anelDeReferencia(limiares.positiveAbove / 100, total, raio, centro, giro)),
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eixos, raio, giro, lado, total, limiares.criticalBelow, limiares.positiveAbove])

  // Sem eixo não há roda — e um octógono vazio na tela parece defeito.
  if (!total || !geo) return null

  return (
    <View style={s.bloco}>
      {titulo ? <Text style={s.titulo}>{titulo}</Text> : null}

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
              />
            )
          })}

          {/* ⚠️ Os anéis são POLÍGONOS, não círculos: num radar o valor mora no
              vértice, e um anel circular passaria por dentro das arestas — um
              valor que encosta no limiar pareceria estar abaixo dele. */}
          <Polygon points={geo.borda} fill="none" stroke={TRILHO} strokeWidth={1} />
          <Polygon points={geo.meio} fill="none" stroke={TRILHO} strokeWidth={1} strokeOpacity={0.6} />
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

          {/* O polígono dos valores: ele dá a silhueta; quem informa é o número. */}
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
                <Circle cx={p.x} cy={p.y} r={9} fill={cor} fillOpacity={0.18} />
                <Circle cx={p.x} cy={p.y} r={5.5} fill="#12142A" />
                <Circle cx={p.x} cy={p.y} r={4} fill={cor} />
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
          const largura = Math.ceil(medirRotulo(e.rotulo))
          const esquerda =
            r.ancora === 'start' ? r.x : r.ancora === 'end' ? r.x - largura : r.x - largura / 2
          const alinhamento = r.ancora === 'start' ? 'left' : r.ancora === 'end' ? 'right' : 'center'
          const temValor = e.valor !== null && e.valor !== undefined
          const Caixa: any = aoTocarEixo ? Pressable : View
          return (
            <Caixa
              key={`rotulo-${e.chave}`}
              onPress={aoTocarEixo ? () => aoTocarEixo(e.chave) : undefined}
              accessibilityRole={aoTocarEixo ? 'button' : undefined}
              accessibilityLabel={`${e.rotulo}: ${temValor ? Math.round(Number(e.valor)) : 'sem dado'}`}
              style={{
                position: 'absolute',
                left: esquerda,
                top: r.y - 17,
                width: largura,
                alignItems:
                  alinhamento === 'left' ? 'flex-start' : alinhamento === 'right' ? 'flex-end' : 'center',
              }}
            >
              <Text style={[s.rotulo, { textAlign: alinhamento }]} numberOfLines={1}>
                {e.rotulo}
              </Text>
              {/* ⚠️ O NÚMERO, sempre. É ele que faz a roda não depender nem da
                  área (que engana) nem da cor (verde e âmbar quase se encostam
                  sob protanopia). */}
              <Text style={[s.valor, { color: temValor ? TINTA_FORTE : CORES.vazio }]}>
                {temValor ? Math.round(Number(e.valor)) : '—'}
              </Text>
            </Caixa>
          )
        })}
      </View>

      {/* O que os anéis tracejados significam. Sem isto são dois contornos
          decorativos e a escala perde a referência. */}
      <View style={s.faixas}>
        <View style={s.faixaItem}>
          <View style={[s.tracinho, { backgroundColor: CORES.critico }]} />
          <Text style={s.faixaTexto}>{limiares.criticalBelow}</Text>
        </View>
        <View style={s.faixaItem}>
          <View style={[s.tracinho, { backgroundColor: CORES.bom }]} />
          <Text style={s.faixaTexto}>{limiares.positiveAbove}</Text>
        </View>
        {legenda ? <Text style={s.rodape}>{legenda}</Text> : null}
      </View>
    </View>
  )
}

const s = StyleSheet.create({
  bloco: {
    backgroundColor: '#13162B',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#242B40',
    paddingTop: 14,
    paddingBottom: 10,
    paddingHorizontal: 8,
    marginBottom: 12,
  },
  titulo: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    color: TINTA,
    textAlign: 'center',
    marginBottom: 2,
  },
  rotulo: { fontSize: FONTE_ROTULO, color: TINTA, lineHeight: 13 },
  valor: { fontSize: 15, fontWeight: '800', lineHeight: 18 },
  faixas: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' },
  faixaItem: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 7 },
  tracinho: { width: 10, height: 2, borderRadius: 1, marginRight: 4, opacity: 0.7 },
  faixaTexto: { fontSize: 10, color: '#5c6477' },
  rodape: { fontSize: 10, color: '#5c6477', marginLeft: 10 },
})
