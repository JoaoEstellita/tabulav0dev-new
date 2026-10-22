import React, { useMemo } from 'react'
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native'
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg'
import { emocoesDoDia, type TransitoParaEmocao, type ChaveEmocao } from '../utils/emocoesDoDia'

/**
 * O CLIMA EMOCIONAL do dia, em seis anéis.
 *
 * ⚠️ Estes números NÃO medem a emoção de ninguém — o app não tem nenhum dado
 * sobre o estado emocional real da pessoa. São leitura do CÉU: quanto o dia
 * carrega o tipo de tensão ou de alívio que a tradição associa a cada palavra.
 *
 * Por isso o rodapé existe e não é enfeite. Um "Tristeza 45" sozinho é lido
 * como afirmação sobre quem está olhando, e seria uma afirmação que o dado não
 * sustenta. A linha embaixo é o que transforma o número de diagnóstico em
 * previsão do tempo.
 */

type Props = {
  transitos: ReadonlyArray<TransitoParaEmocao> | null | undefined
  idioma?: string
}

/**
 * Cor por emoção, e não por faixa de valor.
 *
 * ⚠️ Diferente da roda de status, aqui a cor identifica QUAL emoção é, não
 * quão alta ela está — "Alegria 20" continua sendo alegria. Pintar pelo valor
 * faria alegria baixa ficar vermelha, dizendo o contrário do que o rótulo diz.
 */
const COR: Record<ChaveEmocao, [string, string]> = {
  ansiedade: ['#F59E0B', '#FBBF24'],
  stress:    ['#EF4444', '#F87171'],
  raiva:     ['#DC2626', '#EF4444'],
  alegria:   ['#10B981', '#34D399'],
  tristeza:  ['#6366F1', '#818CF8'],
  otimismo:  ['#06B6D4', '#22D3EE'],
}

const ROTULO: Record<ChaveEmocao, [string, string, string, string]> = {
  ansiedade: ['Ansiedade', 'Anxiety', 'Ansiedad', 'Ansia'],
  stress:    ['Estresse', 'Stress', 'Estres', 'Stress'],
  raiva:     ['Raiva', 'Anger', 'Ira', 'Rabbia'],
  alegria:   ['Alegria', 'Joy', 'Alegria', 'Gioia'],
  tristeza:  ['Tristeza', 'Sadness', 'Tristeza', 'Tristezza'],
  otimismo:  ['Otimismo', 'Optimism', 'Optimismo', 'Ottimismo'],
}

const TINTA = '#8892a4'
const TRILHO = '#232B3D'

export default function ClimaEmocional({ transitos, idioma }: Props) {
  const { width } = useWindowDimensions()
  const l = String(idioma || 'pt-BR')
  const tl = (pt: string, en: string, es: string, it: string) =>
    l.startsWith('en') ? en : l.startsWith('es') ? es : l.startsWith('it') ? it : pt

  const emocoes = useMemo(() => emocoesDoDia(transitos), [transitos])

  // ⚠️ `null` quando não há trânsito: a seção inteira some. Mostrar seis zeros
  // afirmaria "hoje você não sente nada", quando o certo é não dizer nada.
  if (!emocoes) return null

  // Três por linha, como na referência. O anel encolhe junto com a tela para
  // três nunca virarem duas e meia.
  const porLinha = 3
  const larguraUtil = Math.min(360, width - 40)
  const celula = larguraUtil / porLinha
  const tamanho = Math.max(64, Math.min(92, celula - 18))
  const traco = Math.max(6, Math.round(tamanho * 0.1))
  const raio = (tamanho - traco) / 2
  const perimetro = 2 * Math.PI * raio

  return (
    <View style={s.bloco}>
      <Text style={s.titulo}>
        {tl('O clima de hoje', "Today's climate", 'El clima de hoy', 'Il clima di oggi')}
      </Text>

      <View style={s.grade}>
        {emocoes.map((e) => {
          const [escuro, claro] = COR[e.chave]
          // O arco preenchido é o perímetro menos a fatia que falta.
          const preenchido = (Math.max(0, Math.min(100, e.valor)) / 100) * perimetro
          return (
            <View key={e.chave} style={[s.item, { width: celula }]}>
              <Svg width={tamanho} height={tamanho}>
                <Defs>
                  <LinearGradient id={`g-${e.chave}`} x1="0" y1="0" x2="1" y2="1">
                    <Stop offset="0%" stopColor={claro} />
                    <Stop offset="100%" stopColor={escuro} />
                  </LinearGradient>
                </Defs>
                {/* Trilho: mostra o quanto FALTA. Sem ele, um anel de 20% vira
                    um risco solto e perde a referência de escala. */}
                <Circle
                  cx={tamanho / 2}
                  cy={tamanho / 2}
                  r={raio}
                  stroke={TRILHO}
                  strokeWidth={traco}
                  fill="none"
                />
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
              </Svg>
              {/* O número POR CIMA do anel, centralizado: o arco dá a sensação,
                  o número dá o valor — e nenhum depende de cor para ser lido. */}
              <View style={[StyleSheet.absoluteFillObject, s.centro, { height: tamanho }]}>
                <Text style={[s.valor, { fontSize: Math.round(tamanho * 0.26) }]}>{e.valor}</Text>
              </View>
              <Text style={s.rotulo} numberOfLines={1}>
                {tl(...ROTULO[e.chave])}
              </Text>
            </View>
          )
        })}
      </View>

      {/* ⚠️ ESTA LINHA NÃO É ENFEITE. Sem ela, "Tristeza 45" é lido como um
          dado sobre a pessoa, e o app não tem nenhum dado sobre a emoção de
          ninguém — só sobre o céu. */}
      <Text style={s.nota}>
        {tl(
          'Leitura do céu de hoje, não do seu estado — o que o dia tende a mexer.',
          "A reading of today's sky, not of your state — what the day tends to stir.",
          'Lectura del cielo de hoy, no de tu estado — lo que el dia tiende a mover.',
          'Lettura del cielo di oggi, non del tuo stato — cio che il giorno tende a muovere.',
        )}
      </Text>
    </View>
  )
}

const s = StyleSheet.create({
  bloco: { paddingVertical: 10, marginBottom: 4 },
  titulo: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    color: TINTA,
    textAlign: 'center',
    marginBottom: 10,
  },
  grade: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  item: { alignItems: 'center', marginBottom: 12 },
  centro: { alignItems: 'center', justifyContent: 'center' },
  valor: { color: '#F2F5FA', fontWeight: '800' },
  rotulo: { fontSize: 11, color: TINTA, marginTop: 5 },
  nota: { fontSize: 10, color: '#5c6477', textAlign: 'center', marginTop: 2, paddingHorizontal: 12 },
})
