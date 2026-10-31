import React, { useMemo, useState } from 'react'
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { statusNatal, CHAVES_NATAIS, AREAS_NATAIS, type AspectoNatalBruto, type PlanetaComCasa } from '../utils/statusNatal'
import { getLifeAreaLabelI18n, LIFE_AREA_COLORS } from '../constants/lifeAreas'
import { STATUS_THRESHOLDS } from '../constants/statusThresholds'

/**
 * O STATUS NATAL — quanto o MAPA sustenta cada área da vida.
 *
 * O status do dia responde "como está essa área hoje". Este responde "o que o
 * seu mapa já traz nela", e é a comparação entre os dois que diz se o dia está
 * mexendo num ponto naturalmente forte ou num que já pede cuidado.
 *
 * ⚠️ COMPONENTE PRÓPRIO, e não um `modo` do card de área como fiz com as
 * emoções. O `LifeAreaCard` carrega sugestões, trânsitos ativos e janelas —
 * tudo do DIA. Reusá-lo exigiria passar metade da estrutura vazia, e um card
 * com metade dos campos vazios parece quebrado, não enxuto.
 *
 * ⚠️ FALA DO MAPA, NUNCA DE DESTINO. "Amor 38 no mapa" quer dizer que os
 * planetas ligados ao tema recebem mais aspecto duro que macio — não que a
 * pessoa terá uma vida afetiva difícil. Aqui a fronteira é mais fácil de
 * atravessar do que nas emoções, porque o natal parece falar do que está
 * escrito.
 */

type Props = {
  /** Planetas natais com a casa que ocupam. */
  planetasNatais?: ReadonlyArray<PlanetaComCasa> | null
  /** Os aspectos que o motor já calculou (`aspectsNatalToNatal`). */
  aspectosNatais?: ReadonlyArray<AspectoNatalBruto> | null
  /**
   * As doze cúspides — de onde saem os regentes das casas.
   *
   * ⚠️ Sem elas a perna da REGÊNCIA some da tríade, e o número fica mais pobre
   * sem nada acusar. O app não recebe `houseRulers` pronto de lugar nenhum:
   * eles são derivados do signo na cúspide.
   */
  cuspides?: ReadonlyArray<unknown> | null
  /**
   * O status de HOJE de cada área, se disponível — para a comparação.
   *
   * ⚠️ As duas pontuações usam o MESMO marcador, então são comparáveis pela
   * mesma curva. Medido em 424 pares: o natal fica acima do dia em 56% deles,
   * diferença mediana de 5 pontos.
   */
  statusDeHoje?: Record<string, { percentage?: number }> | null
  idioma?: string
}

const TINTA_ROTULO = '#C7D2E8'

/** A mesma régua de cor do resto do app — não inventar uma terceira. */
function corDoValor(v: number): string {
  if (v >= STATUS_THRESHOLDS.positiveAbove) return '#10B981'
  if (v >= STATUS_THRESHOLDS.criticalBelow) return '#F59E0B'
  return '#EF4444'
}

/** O papel de cada planeta, em palavras. */
const PAPEL = {
  ocupacao: ['mora na casa', 'lives in the house', 'vive en la casa', 'abita nella casa'],
  regencia: ['rege a casa', 'rules the house', 'rige la casa', 'governa la casa'],
  significador: ['rege o tema', 'rules the theme', 'rige el tema', 'governa il tema'],
} as const

export default function StatusNatalDoMapa({
  planetasNatais, aspectosNatais, cuspides, statusDeHoje, idioma,
}: Props) {
  const [aberta, setAberta] = useState<string | null>(null)
  const l = String(idioma || 'pt-BR')
  const i = l.startsWith('en') ? 1 : l.startsWith('es') ? 2 : l.startsWith('it') ? 3 : 0
  const tl = (pt: string, en: string, es: string, it: string) => [pt, en, es, it][i]

  const areas = useMemo(
    () => statusNatal({ planetasNatais, aspectosNatais, cuspides }),
    [planetasNatais, aspectosNatais, cuspides],
  )

  // ⚠️ `null` quando não há como calcular: oito percentuais sobre nada diriam
  // que o mapa não sustenta área nenhuma, que é diferente de não haver mapa.
  if (!areas) return null

  const ordenadas = CHAVES_NATAIS.filter((k) => areas[k])
  if (!ordenadas.length) return null

  const detalhe = aberta && areas[aberta] ? areas[aberta] : null
  const hojeDaAberta = aberta ? Number(statusDeHoje?.[aberta]?.percentage) : NaN

  return (
    <View style={s.bloco}>
      <Text style={s.titulo}>{tl('O seu mapa nas áreas', 'Your chart across areas', 'Tu carta en las areas', 'La tua carta nelle aree')}</Text>

      <View style={s.grade}>
        {ordenadas.map((chave) => {
          const v = areas[chave].percentage
          const cor = corDoValor(v)
          const [c1] = LIFE_AREA_COLORS[chave] || ['#8B5CF6']
          return (
            <Pressable
              key={chave}
              onPress={() => setAberta(chave)}
              accessibilityRole="button"
              accessibilityLabel={`${getLifeAreaLabelI18n(chave, l)}: ${v}`}
              style={({ pressed }) => [s.ficha, { borderColor: `${c1}55` }, pressed && { opacity: 0.6 }]}
            >
              <Text style={[s.fichaValor, { color: cor }]}>{v}</Text>
              <Text style={s.fichaRotulo} numberOfLines={1}>{getLifeAreaLabelI18n(chave, l)}</Text>
            </Pressable>
          )
        })}
      </View>

      <Text style={s.nota}>
        {tl(
          'Leitura do seu mapa · toque para ver de onde vem',
          'A reading of your chart · tap to see where it comes from',
          'Lectura de tu carta · toca para ver de donde viene',
          'Lettura della tua carta · tocca per vedere da dove viene',
        )}
      </Text>

      {detalhe ? (
        <Modal visible transparent animationType="fade" onRequestClose={() => setAberta(null)}>
          <Pressable style={s.fundo} onPress={() => setAberta(null)}>
            <Pressable style={s.caixa} onPress={() => {}}>
              <View style={s.cabecalho}>
                <Text style={s.caixaTitulo}>{getLifeAreaLabelI18n(aberta!, l)}</Text>
                <Text style={[s.caixaValor, { color: corDoValor(detalhe.percentage) }]}>{detalhe.percentage}</Text>
              </View>

              {/* ⚠️ A COMPARAÇÃO só aparece quando há o número de hoje. As duas
                  pontuações usam o MESMO marcador, então pô-las lado a lado é
                  legítimo — foi medido. Sem o de hoje, nada de inventar. */}
              {Number.isFinite(hojeDaAberta) ? (
                <Text style={s.comparacao}>
                  {tl(
                    `Hoje esta área está em ${Math.round(hojeDaAberta)}.`,
                    `Today this area is at ${Math.round(hojeDaAberta)}.`,
                    `Hoy esta area esta en ${Math.round(hojeDaAberta)}.`,
                    `Oggi quest'area e a ${Math.round(hojeDaAberta)}.`,
                  )}
                </Text>
              ) : null}

              <Text style={s.explica}>
                {tl(
                  'Quanto o seu mapa sustenta este tema: os planetas que moram nas casas da área, os que as regem e os que regem o assunto — pesados pelos aspectos que recebem.',
                  'How much your chart supports this theme: the planets living in the area\'s houses, the ones ruling them, and the ones ruling the subject — weighed by the aspects they receive.',
                  'Cuanto tu carta sostiene este tema: los planetas que viven en las casas del area, los que las rigen y los que rigen el asunto, pesados por los aspectos que reciben.',
                  'Quanto la tua carta sostiene questo tema: i pianeti che abitano le case dell area, quelli che le governano e quelli che governano il tema, pesati dagli aspetti che ricevono.',
                )}
              </Text>

              <Text style={s.casas}>
                {tl('Casas', 'Houses', 'Casas', 'Case')} {AREAS_NATAIS[aberta!].houses.join(' e ')}
              </Text>

              <ScrollView style={{ maxHeight: 260 }}>
                {detalhe.porque.map((p, k) => (
                  <View key={`${p.planeta}-${p.papel}-${k}`} style={s.linha}>
                    <Text style={s.linhaTexto}>
                      <Text style={s.linhaPlaneta}>{p.planeta}</Text>
                      <Text style={s.linhaPapel}>
                        {'  '}{(PAPEL[p.papel as keyof typeof PAPEL] || PAPEL.significador)[i]}
                        {p.casa ? ` ${p.casa}` : ''}
                      </Text>
                    </Text>
                    <Text style={s.linhaPeso}>
                      {p.apoio > 0 ? <Text style={{ color: '#10B981' }}>+{p.apoio.toFixed(1)}</Text> : null}
                      {p.apoio > 0 && p.pressao > 0 ? '  ' : ''}
                      {p.pressao > 0 ? <Text style={{ color: '#EF4444' }}>−{p.pressao.toFixed(1)}</Text> : null}
                    </Text>
                  </View>
                ))}
              </ScrollView>

              {/* ⚠️ A ressalva, com o sujeito certo: o natal parece falar de
                  destino, e é justamente por isso que ela precisa estar aqui. */}
              <Text style={s.aviso}>
                {tl(
                  'Leitura do seu mapa, não previsão de como a sua vida vai ser.',
                  'A reading of your chart, not a forecast of how your life will go.',
                  'Lectura de tu carta, no prediccion de como sera tu vida.',
                  'Lettura della tua carta, non previsione di come andra la tua vita.',
                )}
              </Text>
              <Text style={s.fechar}>{tl('Tocar para fechar', 'Tap to close', 'Toca para cerrar', 'Tocca per chiudere')}</Text>
            </Pressable>
          </Pressable>
        </Modal>
      ) : null}
    </View>
  )
}

const s = StyleSheet.create({
  bloco: { marginTop: 18, marginBottom: 6 },
  titulo: { color: '#E8ECF7', fontSize: 15, fontWeight: '700', marginBottom: 10 },
  grade: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  ficha: {
    flexGrow: 1, flexBasis: '22%', alignItems: 'center',
    paddingVertical: 10, borderRadius: 14, borderWidth: 1,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  fichaValor: { fontSize: 20, fontWeight: '800' },
  // 14px é o piso de legibilidade do projeto; rótulo aqui é texto para ler.
  fichaRotulo: { color: TINTA_ROTULO, fontSize: 14, marginTop: 2 },
  nota: { color: '#9AA3B8', fontSize: 14, marginTop: 10, textAlign: 'center' },

  fundo: { flex: 1, backgroundColor: 'rgba(5,7,18,0.82)', alignItems: 'center', justifyContent: 'center', padding: 20 },
  caixa: { width: '100%', maxWidth: 420, backgroundColor: '#141A2E', borderRadius: 18, padding: 18 },
  cabecalho: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 },
  caixaTitulo: { color: '#F2F5FF', fontSize: 19, fontWeight: '800' },
  caixaValor: { fontSize: 24, fontWeight: '800' },
  comparacao: { color: TINTA_ROTULO, fontSize: 14, marginBottom: 10 },
  explica: { color: '#D7DEEF', fontSize: 15, lineHeight: 22, marginTop: 6 },
  casas: { color: '#8D96AC', fontSize: 13, marginTop: 10, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.6 },
  linha: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 7, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: '#2a3148',
  },
  linhaTexto: { flex: 1, paddingRight: 10 },
  linhaPlaneta: { color: '#E8ECF7', fontSize: 15, fontWeight: '600' },
  linhaPapel: { color: '#9AA3B8', fontSize: 14 },
  linhaPeso: { fontSize: 14, fontWeight: '700' },
  aviso: { color: '#8D96AC', fontSize: 13, marginTop: 12, lineHeight: 18 },
  fechar: { color: '#6E7691', fontSize: 13, textAlign: 'center', marginTop: 10 },
})
