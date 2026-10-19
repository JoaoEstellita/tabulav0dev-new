import React, { useMemo } from 'react'
import { View, Text, StyleSheet, Pressable, useWindowDimensions } from 'react-native'
import Svg, { Polygon, Line, Circle } from 'react-native-svg'
import { STATUS_THRESHOLDS } from '../constants/statusThresholds'
import {
  poligonoDosValores,
  anelDeReferencia,
  pontoNoEixo,
  rotuloDoEixo,
  fracaoDoValor,
  paraPoints,
  corDoValor,
  type EixoDaRoda,
} from '../utils/geometriaDaRoda'

/**
 * A roda de status: as oito áreas da vida num octógono, como ficha de atributos.
 *
 * ⚠️ Escolha de PRODUTO, não de legibilidade. Para comparar magnitudes uma barra
 * lê melhor — num radar a área cresce com o QUADRADO do valor e o ângulo
 * distorce a comparação. O que o radar dá e a barra não é identidade: uma figura
 * que a pessoa reconhece como "eu hoje". Para isso valer sem enganar, três
 * regras:
 *
 *  1. A ÁREA NUNCA CARREGA A MENSAGEM — o número vai escrito em cada eixo.
 *  2. A ORDEM DOS EIXOS É FIXA (a mesma dos cards abaixo) e nunca ordenada por
 *     valor: ordenar mudaria a silhueta todo dia e a figura de hoje deixaria de
 *     se comparar com a de ontem.
 *  3. A ESCALA É 0–100 FIXA. Auto-escalar pelo próprio mínimo e máximo ficaria
 *     mais dramático e seria mentira: quem tem tudo entre 28 e 49 veria a mesma
 *     figura de quem tem tudo entre 60 e 90.
 *
 * Medido no banco: a amplitude entre áreas tem mediana de 30 pontos e mínimo de
 * 8, e os valores vivem entre ~26 e ~77 — num eixo 0–100 cheio o polígono fica
 * quase circular. Daí os dois ANÉIS DE REFERÊNCIA nos limiares que o app já usa
 * (35 e 62): a leitura deixa de ser "que forma é essa" e vira "o que furou o
 * anel de baixo".
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

const TRILHO = '#2A3142'
const TINTA = '#8892a4'
const TINTA_FORTE = '#E8ECF5'

/**
 * ⚠️ No eixo vai uma MARCA CURTA; o nome inteiro vive na legenda abaixo.
 *
 * O nome completo ao redor da roda não cabe, e isso foi medido, não achado.
 * Primeiro como `<SvgText>`: texto em SVG não quebra linha nem é medido, e nas
 * telas reais (360/390/430pt) "Comunicação" estourava 35px para fora do
 * desenho. Depois como `<Text>` nativo numa caixa larga o bastante para o nome
 * inteiro: aí a roda encolhia para 110–138px de diâmetro, e numa tela de 320pt
 * colapsava para 70px COM 4 colisões entre rótulos. E "Espiritualidade" é uma
 * palavra só — não tem onde quebrar, então caixa estreita a corta com
 * reticências.
 *
 * Oito nomes longos em português ao redor de um radar de celular é um conflito
 * real de layout, e pior em espanhol e italiano. A saída é a mesma da ficha de
 * atributos que inspirou isto: marca curta no eixo, nome por extenso embaixo.
 * Com 34px de caixa, o desenho vai a 176–244px e dá ZERO estouro e ZERO colisão
 * em todas as telas.
 *
 * A marca são as 3 primeiras letras do próprio rótulo — não um vocabulário
 * novo, só uma chave visual que a legenda resolve. Assim nada precisa ser
 * traduzido duas vezes.
 */
const LARGURA_ROTULO = 34

export default function RodaDeStatus({ eixos, aoTocarEixo, titulo, legenda }: Props) {
  const { width } = useWindowDimensions()

  // O teto evita que num tablet a roda vire pôster; o piso evita que num
  // aparelho estreito ela encolha até o polígono virar um ponto.
  const lado = Math.min(340, Math.max(260, width - 48))
  const centro = { x: lado / 2, y: lado / 2 }
  // Folga = caixa da marca + respiro. Medido: com isto não há estouro nem
  // colisão de 320 a 430pt de tela.
  const raio = lado / 2 - (LARGURA_ROTULO + 14)

  const total = eixos.length
  const limiares = {
    criticalBelow: STATUS_THRESHOLDS.criticalBelow,
    positiveAbove: STATUS_THRESHOLDS.positiveAbove,
  }

  const geo = useMemo(() => {
    if (!total) return null
    return {
      valores: paraPoints(poligonoDosValores(eixos, raio, centro)),
      borda: paraPoints(anelDeReferencia(1, total, raio, centro)),
      critico: paraPoints(anelDeReferencia(limiares.criticalBelow / 100, total, raio, centro)),
      bom: paraPoints(anelDeReferencia(limiares.positiveAbove / 100, total, raio, centro)),
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eixos, raio, lado, total, limiares.criticalBelow, limiares.positiveAbove])

  // Sem eixo não há roda — e um octógono vazio no topo da tela parece defeito.
  if (!total || !geo) return null

  return (
    <View style={s.bloco}>
      {titulo ? <Text style={s.titulo}>{titulo}</Text> : null}

      <View style={{ width: lado, height: lado, alignSelf: 'center' }}>
        <Svg width={lado} height={lado}>
          {/* Raios: dão a direção de cada eixo sem competir com o polígono. */}
          {eixos.map((e, i) => {
            const p = pontoNoEixo(i, total, 1, raio, centro)
            return (
              <Line key={`raio-${e.chave}`} x1={centro.x} y1={centro.y} x2={p.x} y2={p.y} stroke={TRILHO} strokeWidth={1} />
            )
          })}

          {/* ⚠️ Os anéis são POLÍGONOS, não círculos: num radar o valor mora no
              vértice, e um anel circular passaria por dentro das arestas — um
              valor que encosta no limiar pareceria estar abaixo dele. */}
          <Polygon points={geo.borda} fill="none" stroke={TRILHO} strokeWidth={1} />
          <Polygon points={geo.critico} fill="none" stroke={CORES.critico} strokeWidth={1} strokeOpacity={0.4} strokeDasharray="3 4" />
          <Polygon points={geo.bom} fill="none" stroke={CORES.bom} strokeWidth={1} strokeOpacity={0.4} strokeDasharray="3 4" />

          {/* O polígono dos valores: ele dá a silhueta; quem informa é o número. */}
          <Polygon
            points={geo.valores}
            fill="#7F9AC4"
            fillOpacity={0.22}
            stroke="#7F9AC4"
            strokeWidth={2}
            strokeLinejoin="round"
          />

          {eixos.map((e, i) => {
            const p = pontoNoEixo(i, total, fracaoDoValor(e.valor), raio, centro)
            return (
              <React.Fragment key={`ponto-${e.chave}`}>
                {/* Anel escuro em volta do ponto: sem ele, um vértice sobre a
                    linha do polígono some dentro do próprio traço. */}
                <Circle cx={p.x} cy={p.y} r={5.5} fill="#161728" />
                <Circle cx={p.x} cy={p.y} r={4} fill={corDoValor(e.valor, limiares, CORES)} />
              </React.Fragment>
            )
          })}
        </Svg>

        {/* Rótulo + número + alvo de toque, tudo na mesma caixa.
            ⚠️ Juntos de propósito: o ponto do vértice tem 4px e ninguém acerta
            nele. Com o rótulo sendo o alvo, o toque fica do tamanho de uma
            palavra — e fica óbvio o que é tocável. */}
        {eixos.map((e, i) => {
          const r = rotuloDoEixo(i, total, raio, centro, 10)
          const esquerda =
            r.ancora === 'start' ? r.x : r.ancora === 'end' ? r.x - LARGURA_ROTULO : r.x - LARGURA_ROTULO / 2
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
                top: r.y - 18,
                width: LARGURA_ROTULO,
                alignItems: alinhamento === 'left' ? 'flex-start' : alinhamento === 'right' ? 'flex-end' : 'center',
              }}
            >
              {/* A marca: 3 letras. O nome inteiro está na legenda abaixo. */}
              <Text style={[s.marca, { textAlign: alinhamento }]} numberOfLines={1}>
                {e.rotulo.slice(0, 3)}
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

      {/* ⚠️ A LEGENDA É PARTE DO GRÁFICO, não um apêndice: ela resolve a marca
          de 3 letras do eixo e carrega o nome por extenso, que não cabe lá.
          Também é um alvo de toque confortável — bem maior que o ponto de 4px
          do vértice. */}
      <View style={s.lista}>
        {eixos.map((e) => {
          const temValor = e.valor !== null && e.valor !== undefined
          const Caixa: any = aoTocarEixo ? Pressable : View
          return (
            <Caixa
              key={`lista-${e.chave}`}
              onPress={aoTocarEixo ? () => aoTocarEixo(e.chave) : undefined}
              accessibilityRole={aoTocarEixo ? 'button' : undefined}
              style={s.listaItem}
            >
              <View style={[s.bolinha, { backgroundColor: corDoValor(e.valor, limiares, CORES) }]} />
              <Text style={s.listaNome} numberOfLines={1}>{e.rotulo}</Text>
              <Text style={[s.listaValor, { color: temValor ? TINTA_FORTE : CORES.vazio }]}>
                {temValor ? Math.round(Number(e.valor)) : '—'}
              </Text>
            </Caixa>
          )
        })}
      </View>

      {/* O que os dois anéis tracejados querem dizer. Sem isto são dois
          contornos decorativos e a escala perde a referência. */}
      <Text style={s.faixas}>
        {`tracejado vermelho ${limiares.criticalBelow} · verde ${limiares.positiveAbove}`}
      </Text>

      {legenda ? <Text style={s.rodape}>{legenda}</Text> : null}
    </View>
  )
}

const s = StyleSheet.create({
  bloco: {
    backgroundColor: '#161728',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#252b38',
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  titulo: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: TINTA,
    marginBottom: 2,
  },
  marca: { fontSize: 10, color: TINTA, lineHeight: 12 },
  valor: { fontSize: 13, fontWeight: '700' },
  lista: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 4 },
  // Duas colunas: oito itens numa coluna só esticariam o card demais, e em
  // quatro o nome por extenso voltaria a nao caber.
  listaItem: { flexDirection: 'row', alignItems: 'center', width: '50%', paddingVertical: 4, paddingRight: 6 },
  bolinha: { width: 7, height: 7, borderRadius: 4, marginRight: 6 },
  listaNome: { flex: 1, fontSize: 12, color: TINTA },
  listaValor: { fontSize: 12, fontWeight: '700', marginLeft: 4 },
  faixas: { fontSize: 10, color: '#5c6477', textAlign: 'center', marginTop: 6 },
  rodape: { fontSize: 11, color: '#5c6477', textAlign: 'center', marginTop: 6 },
})
