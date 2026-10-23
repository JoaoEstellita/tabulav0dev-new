import React, { useMemo, useState } from 'react'
import { View, Text, StyleSheet, Pressable, Modal, ScrollView, useWindowDimensions } from 'react-native'
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg'
import { translatePlanet } from '../utils/astro/pt'
import { rotuloDeAspecto } from '../utils/transitPresentation'
import { emocoesDoDia, type TransitoParaEmocao, type ChaveEmocao, type EmocaoDoDia } from '../utils/emocoesDoDia'

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
  idioma?: string
}

/**
 * Cor por emoção, e não por faixa de valor.
 *
 * ⚠️ Diferente da roda de status, aqui a cor identifica QUAL emoção é, não quão
 * alta ela está — "Afeto 20" continua sendo afeto. Pintar pelo valor faria
 * afeto baixo ficar vermelho, dizendo o contrário do rótulo.
 *
 * ⚠️ Oito matizes DISTINTOS, um por anel, e não dois grupos (quente = tensão,
 * frio = alívio). Com cinco tons de vermelho lado a lado, nenhum deles
 * identifica mais nada — o olho só vê "vermelho" e precisa ler o rótulo de
 * novo. Desânimo é o cinza-azulado de propósito: é o anel apagado.
 */
const COR: Record<ChaveEmocao, [string, string]> = {
  ansiedade: ['#F59E0B', '#FBBF24'],
  irritacao: ['#EF4444', '#FB7185'],
  pressao:   ['#A855F7', '#C084FC'],
  confusao:  ['#6366F1', '#818CF8'],
  desanimo:  ['#64748B', '#94A3B8'],
  calma:     ['#14B8A6', '#2DD4BF'],
  animo:     ['#22C55E', '#4ADE80'],
  afeto:     ['#EC4899', '#F472B6'],
}

/**
 * ⚠️ Rótulo CURTO em todos os idiomas: a célula tem ~87px com quatro por linha,
 * o que cabe ~14 caracteres em 10px. "Low mood" em vez de "Discouragement" não
 * é preguiça de tradução — é o que caberia sem reticências.
 */
const ROTULO: Record<ChaveEmocao, [string, string, string, string]> = {
  ansiedade: ['Ansiedade', 'Anxiety', 'Ansiedad', 'Ansia'],
  irritacao: ['Irritação', 'Irritation', 'Irritacion', 'Irritazione'],
  pressao:   ['Pressão', 'Pressure', 'Presion', 'Pressione'],
  confusao:  ['Confusão', 'Confusion', 'Confusion', 'Confusione'],
  desanimo:  ['Desânimo', 'Low mood', 'Desanimo', 'Sconforto'],
  calma:     ['Calma', 'Calm', 'Calma', 'Calma'],
  animo:     ['Ânimo', 'Drive', 'Animo', 'Slancio'],
  afeto:     ['Afeto', 'Affection', 'Afecto', 'Affetto'],
}

const TINTA = '#8892a4'
const TRILHO = '#232B3D'

export default function ClimaEmocional({ transitos, idioma }: Props) {
  const { width } = useWindowDimensions()
  const [aberta, setAberta] = useState<EmocaoDoDia | null>(null)

  const l = String(idioma || 'pt-BR')
  const tl = (pt: string, en: string, es: string, it: string) =>
    l.startsWith('en') ? en : l.startsWith('es') ? es : l.startsWith('it') ? it : pt

  const emocoes = useMemo(() => emocoesDoDia(transitos), [transitos])

  // ⚠️ `null` quando não há trânsito: a seção inteira some. Seis zeros
  // afirmariam "hoje você não sente nada", quando o certo é não dizer nada.
  if (!emocoes) return null

  // ⚠️ QUATRO por linha, e os anéis menores por consequência. A Home já carrega
  // a frase do dia, a roda de status e a roda natal; anéis grandes no meio
  // disso empurravam o mapa para longe do alcance do polegar. Oito em 4×2
  // ocupam a mesma altura que seis em 3×2 ocupavam.
  //
  // A área de toque NÃO encolheu com o anel: o Pressable ocupa a célula inteira
  // (~87×76), bem acima dos 44pt mínimos.
  const porLinha = 4
  const celula = Math.min(380, width - 32) / porLinha
  const tamanho = Math.max(44, Math.min(58, celula - 24))
  const traco = Math.max(5, Math.round(tamanho * 0.11))
  const raio = (tamanho - traco) / 2
  const perimetro = 2 * Math.PI * raio

  return (
    <View style={s.bloco}>
      <Text style={s.titulo}>
        {tl('Tendência emocional hoje', 'Emotional tendency today', 'Tendencia emocional hoy', 'Tendenza emotiva oggi')}
      </Text>

      <View style={s.grade}>
        {emocoes.map((e) => {
          const [escuro, claro] = COR[e.chave]
          const preenchido = (Math.max(0, Math.min(100, e.valor)) / 100) * perimetro
          return (
            <Pressable
              key={e.chave}
              onPress={() => setAberta(e)}
              accessibilityRole="button"
              accessibilityLabel={`${tl(...ROTULO[e.chave])}: ${e.valor}`}
              style={({ pressed }) => [s.item, { width: celula, opacity: pressed ? 0.6 : 1 }]}
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
                </Svg>
                {/* O número POR CIMA do anel: o arco dá a sensação, o número dá
                    o valor — e nenhum depende de cor para ser lido. */}
                <View style={[StyleSheet.absoluteFillObject, s.centro]}>
                  <Text style={[s.valor, { fontSize: Math.round(tamanho * 0.3) }]}>{e.valor}</Text>
                </View>
              </View>
              <Text style={s.rotulo} numberOfLines={1}>{tl(...ROTULO[e.chave])}</Text>
            </Pressable>
          )
        })}
      </View>

      <Text style={s.nota}>
        {tl('Toque para ver de onde vem', 'Tap to see where it comes from', 'Toca para ver de donde viene', 'Tocca per vedere da dove viene')}
      </Text>

      <DetalheDaEmocao emocao={aberta} aoFechar={() => setAberta(null)} tl={tl} idioma={l} />
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
function DetalheDaEmocao({
  emocao,
  aoFechar,
  tl,
  idioma,
}: {
  emocao: EmocaoDoDia | null
  aoFechar: () => void
  tl: (pt: string, en: string, es: string, it: string) => string
  idioma: string
}) {
  if (!emocao) return null
  const [escuro] = COR[emocao.chave]
  const nome = tl(...ROTULO[emocao.chave])

  // ⚠️ O filtro por `> 0` fica, mesmo sem nenhum peso negativo na tabela hoje:
  // o alívio virou anel próprio (Calma), mas se algum peso voltar a ser
  // negativo, uma linha com "-0,3" no meio de positivos leria como erro.
  const pesam = emocao.porque.filter((c) => c.valor > 0)
  const aliviam = emocao.porque.filter((c) => c.valor < 0)
  const total = emocao.porque.reduce((a, c) => a + Math.abs(c.valor), 0) || 1

  const linha = (c: typeof emocao.porque[number], k: number) => (
    <View key={`${c.planeta}-${c.aspecto}-${c.alvo}-${k}`} style={s.linha}>
      <View style={[s.barra, { width: `${Math.min(100, (Math.abs(c.valor) / total) * 100)}%`, backgroundColor: escuro }]} />
      <Text style={s.linhaTexto}>
        {/* ⚠️ O aspecto PASSA pelo rótulo: o motor grava `quincuncio`,
            `oposicao` — sem acento — e às vezes em inglês. */}
        {translatePlanet(c.planeta, idioma as any)}{' '}
        <Text style={s.linhaAspecto}>{rotuloDeAspecto(c.aspecto, idioma as any).toLowerCase()}</Text>{' '}
        {translatePlanet(c.alvo, idioma as any)}
      </Text>
    </View>
  )

  return (
    <Modal visible transparent animationType="fade" onRequestClose={aoFechar}>
      <Pressable style={s.fundo} onPress={aoFechar}>
        <Pressable style={s.caixa} onPress={() => {}}>
          <View style={s.cabecalho}>
            <Text style={[s.caixaTitulo, { color: escuro }]}>{nome}</Text>
            <Text style={[s.caixaValor, { color: escuro }]}>{emocao.valor}</Text>
          </View>

          <ScrollView style={{ maxHeight: 320 }}>
            {pesam.length ? (
              <>
                <Text style={s.secao}>
                  {emocao.pesa
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

            {!pesam.length && !aliviam.length ? (
              <Text style={s.vazio}>
                {tl('Nenhum trânsito de hoje mexe nisso.', 'No transit today stirs this.', 'Ningun transito de hoy mueve esto.', 'Nessun transito di oggi muove questo.')}
              </Text>
            ) : null}
          </ScrollView>

          {/* ⚠️ A moldura fica AQUI, onde a pessoa está olhando a conta — e não
              só numa linha solta embaixo dos anéis, fácil de não ler. */}
          <Text style={s.aviso}>
            {tl(
              'Tendência do céu de hoje, não medida do seu estado.',
              "Today's sky tendency, not a measure of your state.",
              'Tendencia del cielo de hoy, no medida de tu estado.',
              'Tendenza del cielo di oggi, non misura del tuo stato.',
            )}
          </Text>
          <Text style={s.fechar}>{tl('Tocar para fechar', 'Tap to close', 'Toca para cerrar', 'Tocca per chiudere')}</Text>
        </Pressable>
      </Pressable>
    </Modal>
  )
}

const s = StyleSheet.create({
  bloco: { paddingVertical: 8, marginBottom: 4 },
  titulo: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    color: TINTA,
    textAlign: 'center',
    marginBottom: 8,
  },
  grade: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  item: { alignItems: 'center', marginBottom: 10 },
  centro: { alignItems: 'center', justifyContent: 'center' },
  valor: { color: '#F2F5FA', fontWeight: '800' },
  rotulo: { fontSize: 10, color: TINTA, marginTop: 4, textAlign: 'center' },
  nota: { fontSize: 10, color: '#5c6477', textAlign: 'center', marginTop: 0 },

  fundo: { flex: 1, backgroundColor: 'rgba(5,7,18,0.82)', alignItems: 'center', justifyContent: 'center', padding: 24 },
  caixa: { width: '100%', maxWidth: 380, backgroundColor: '#13162B', borderRadius: 16, borderWidth: 1, borderColor: '#242B40', padding: 16 },
  cabecalho: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 10 },
  caixaTitulo: { fontSize: 16, fontWeight: '800' },
  caixaValor: { fontSize: 22, fontWeight: '800' },
  secao: { fontSize: 10, color: TINTA, textTransform: 'uppercase', letterSpacing: 1, marginTop: 8, marginBottom: 4 },
  linha: { paddingVertical: 5, justifyContent: 'center' },
  // A barra fica ATRÁS do texto: ela dá o peso relativo sem roubar uma coluna.
  barra: { position: 'absolute', left: 0, top: 2, bottom: 2, borderRadius: 4, opacity: 0.16 },
  linhaTexto: { fontSize: 12, color: '#E8ECF5', paddingHorizontal: 8 },
  linhaAspecto: { color: TINTA },
  vazio: { fontSize: 12, color: TINTA, paddingVertical: 10 },
  aviso: { fontSize: 10, color: '#5c6477', marginTop: 12, lineHeight: 14 },
  fechar: { fontSize: 10, color: '#5c6477', textAlign: 'center', marginTop: 8 },
})
