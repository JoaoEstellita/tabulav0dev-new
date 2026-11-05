import React, { useEffect, useRef, useState } from 'react'
import {
  Modal, NativeScrollEvent, NativeSyntheticEvent, Pressable,
  ScrollView, StyleSheet, Text, View,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import BlocoDoEstudo from '../../components/estudo/BlocoDoEstudo'
import { porId, type IdiomaEstudo, type Unidade } from '../../data/estudo'

/**
 * Uma unidade do Estudo em tela cheia — lição ou verbete.
 *
 * ⚠️ TELA CHEIA, NÃO FOLHA DE 92%. A faixa de fundo visível por cima pedia
 * atenção e não servia a nada: ler uma lição é a tarefa inteira enquanto dura,
 * não um detalhe sobre a tela anterior. A saída continua a um toque.
 *
 * ⚠️ MARCA COMO LIDA AO ABRIR, não ao rolar até o fim. Detectar o fim da
 * rolagem erra para texto curto (que cabe na tela e nunca dispara o evento) e
 * para quem lê em duas sentadas. Abrir já é a intenção; cobrar a rolagem
 * transformaria a marca num troféu, e a trilha não é um jogo de completar.
 *
 * ⚠️ A ROLAGEM MOVE A BARRA DE PROGRESSO, e NADA ALÉM DISSO. A barra é
 * informação visual — quanto falta — e precisa saber onde a leitura está. Ela
 * não pode virar, em nenhuma hipótese, a condição de marcar como lido.
 */
export default function LicaoScreen({
  unidade, idioma, aoFechar, aoAbrirOutra, marcarLido, tl, contexto, vizinhas, naoLida,
}: {
  unidade: Unidade
  idioma: IdiomaEstudo
  aoFechar: () => void
  aoAbrirOutra: (id: string) => void
  marcarLido: (id: string) => void
  tl: (pt: string, en: string, es: string, it: string) => string
  /** "Ato 1 · Lição 4 de 12", já traduzido. Verbete recebe a categoria. */
  contexto?: string | null
  /** O que vem antes e depois na ordem do curso. */
  vizinhas?: { anterior: Unidade | null; proxima: Unidade | null }
  /**
   * A primeira unidade ainda NÃO LIDA adiante.
   *
   * ⚠️ NÃO É A MESMA COISA QUE `proxima`. Quem já leu até a lição 5 e reabre
   * a 2 para consultar recebe a 3 no rodapé — que já leu. Seguir dali é
   * recomeçar um trecho conhecido com a sensação de estar avançando.
   */
  naoLida?: Unidade | null
}) {
  const insets = useSafeAreaInsets()
  const [lido, setLido] = useState(0)
  const rolagem = useRef<ScrollView>(null)

  useEffect(() => { marcarLido(unidade.id) }, [unidade.id, marcarLido])

  // ⚠️ Volta ao topo ao TROCAR de unidade: sem isto, abrir a próxima pelo
  // rodapé começava na metade do texto, no ponto onde a anterior parou.
  useEffect(() => { rolagem.current?.scrollTo({ y: 0, animated: false }); setLido(0) }, [unidade.id])

  const aoRolar = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent
    const rolavel = contentSize.height - layoutMeasurement.height
    // Texto que cabe na tela já está lido por inteiro: barra cheia, e não zero.
    setLido(rolavel <= 0 ? 1 : Math.max(0, Math.min(1, contentOffset.y / rolavel)))
  }

  const anterior = vizinhas?.anterior ?? null
  const proxima = vizinhas?.proxima ?? null

  /**
   * O salto para o não lido só aparece quando LEVA A OUTRO LUGAR.
   *
   * ⚠️ IGUAL À PRÓXIMA = NÃO MOSTRA. Quem está lendo em ordem já tem o botão
   * de que precisa; um segundo botão para o mesmo destino seria ruído em todo
   * passo do caminho. Ele é um atalho para quem saiu da ordem, e só aparece
   * quando ela de fato foi quebrada.
   */
  const saltar = naoLida && naoLida.id !== proxima?.id && naoLida.id !== unidade.id
    ? naoLida
    : null

  /**
   * "Continue por aqui" é o aprofundamento LATERAL, e nada mais.
   *
   * ⚠️ A PRÓXIMA LIÇÃO APARECIA DUAS VEZES, e fora de ordem. Toda lição
   * declara a seguinte no `verTambem` — isso existia antes de haver rodapé —
   * então, com o rodapé de anterior/próxima, a mesma lição passou a ser
   * oferecida no meio do texto E embaixo. Pior: no `verTambem` ela vinha
   * misturada com verbetes e nem sempre primeiro (na lição 8 o verbete da
   * orbe vinha ANTES da lição 9), o que fazia a trilha parecer embaralhada.
   *
   * Filtrar aqui, e não limpar os `verTambem`, é de propósito: o dado continua
   * dizendo a verdade sobre o que se liga a quê — útil para busca e para
   * qualquer tela futura — e é a APRESENTAÇÃO que decide não repetir.
   *
   * ⚠️ E O TÍTULO DEIXOU DE SER "CONTINUE POR AQUI". Essa lista aponta para os
   * lados e muitas vezes para trás — do signo de Áries para Marte, da casa 5
   * para o Sol — e chamá-la de continuação prometia avanço onde havia
   * revisita. Quem continua é o rodapé, que segue a ordem do curso. Aqui é
   * "Relacionado", que é o que sempre foi.
   */
  const jaNoRodape = new Set([anterior?.id, proxima?.id].filter(Boolean))
  const ligados = unidade.verTambem
    .map(porId)
    .filter((u): u is Unidade => !!u && !jaNoRodape.has(u.id))

  return (
    <Modal visible transparent={false} animationType="slide" onRequestClose={aoFechar} statusBarTranslucent>
      <View style={[s.raiz, { paddingTop: insets.top }]}>
        {/* ── Progresso da leitura ────────────────────────────────────── */}
        <View style={s.trilho}>
          <View style={[s.trilhoCheio, { width: `${Math.round(lido * 100)}%` }]} />
        </View>

        <View style={s.cabecalho}>
          <View style={{ flex: 1, minWidth: 0 }}>
            {contexto ? <Text style={s.contexto} numberOfLines={1}>{contexto}</Text> : null}
            <Text style={s.titulo}>{unidade.titulo[idioma]}</Text>
            <Text style={s.minutos}>
              {`${unidade.minutos} ${tl('min de leitura', 'min read', 'min de lectura', 'min di lettura')}`}
            </Text>
          </View>
          <Pressable
            onPress={aoFechar}
            accessibilityRole="button"
            accessibilityLabel={tl('Fechar', 'Close', 'Cerrar', 'Chiudi')}
            hitSlop={14}
            style={({ pressed }) => [s.fechar, pressed && { opacity: 0.6 }]}
          >
            <Ionicons name="close" size={22} color="#C7D2E8" />
          </Pressable>
        </View>

        {/* ⚠️ `flex: 1` no ScrollView: sem ele não rola no web. */}
        <ScrollView
          ref={rolagem}
          style={{ flex: 1 }}
          contentContainerStyle={[s.corpo, { paddingBottom: 28 + insets.bottom }]}
          showsVerticalScrollIndicator={false}
          onScroll={aoRolar}
          scrollEventThrottle={32}
        >
          {unidade.blocos.map((b, i) => (
            <BlocoDoEstudo key={`${unidade.id}-b${i}`} bloco={b} idioma={idioma} />
          ))}

          {ligados.length ? (
            <View style={s.ligados}>
              <Text style={s.secao}>
                {tl('Relacionado', 'Related', 'Relacionado', 'Correlato')}
              </Text>
              {ligados.map((u) => (
                <Pressable
                  key={u.id}
                  onPress={() => aoAbrirOutra(u.id)}
                  accessibilityRole="button"
                  style={({ pressed }) => [s.ligado, pressed && { opacity: 0.6 }]}
                >
                  <Text style={s.ligadoTexto} numberOfLines={1}>{u.titulo[idioma]}</Text>
                  <Ionicons name="chevron-forward" size={16} color="#8D96AC" />
                </Pressable>
              ))}
            </View>
          ) : null}
        </ScrollView>

        {/* ── A trilha continua, sem voltar para a lista ──────────────────
            ⚠️ SÓ PARA LIÇÃO. Verbete não tem anterior nem seguinte: a
            biblioteca não tem ordem, e inventar uma no rodapé prometeria um
            percurso que não existe. */}
        {/* ── Retomar o progresso ──────────────────────────────────────
            ⚠️ ACIMA DO RODAPÉ, e não dentro dele: o rodapé é a sequência, e
            isto é um salto para fora dela. Misturar os dois na mesma linha
            faria três botões competindo, e nenhum deles leria como o passo
            natural. */}
        {saltar ? (
          <Pressable
            onPress={() => aoAbrirOutra(saltar.id)}
            accessibilityRole="button"
            style={({ pressed }) => [s.retomar, pressed && { opacity: 0.65 }]}
          >
            <Ionicons name="bookmark-outline" size={14} color="#4ECDC4" />
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text style={s.retomarRotulo}>
                {tl('RETOMAR DE ONDE PAROU', 'PICK UP WHERE YOU LEFT OFF',
                  'RETOMAR DONDE LO DEJASTE', 'RIPRENDI DA DOVE ERI')}
              </Text>
              <Text style={s.retomarTitulo} numberOfLines={1}>{saltar.titulo[idioma]}</Text>
            </View>
            <Ionicons name="arrow-forward" size={15} color="#4ECDC4" />
          </Pressable>
        ) : null}

        {anterior || proxima ? (
          <View style={[s.rodape, { paddingBottom: 10 + insets.bottom }]}>
            {anterior ? (
              <Pressable
                onPress={() => aoAbrirOutra(anterior.id)}
                accessibilityRole="button"
                style={({ pressed }) => [s.passo, pressed && { opacity: 0.6 }]}
              >
                <Ionicons name="chevron-back" size={15} color="#8D96AC" />
                <Text style={s.passoTexto} numberOfLines={1}>{anterior.titulo[idioma]}</Text>
              </Pressable>
            ) : <View style={{ flex: 1 }} />}

            {proxima ? (
              <Pressable
                onPress={() => aoAbrirOutra(proxima.id)}
                accessibilityRole="button"
                style={({ pressed }) => [s.passo, s.passoProxima, pressed && { opacity: 0.6 }]}
              >
                <View style={{ flex: 1, minWidth: 0 }}>
                  {/* ⚠️ AVISA QUANDO A NATUREZA MUDA. Depois da última lição a
                      continuação é a BIBLIOTECA, e um botão que só dissesse
                      "Sol" faria parecer que ainda há trilha pela frente. */}
                  {proxima.tipo === 'verbete' ? (
                    <Text style={s.passoRotulo}>
                      {tl('A BIBLIOTECA', 'THE LIBRARY', 'LA BIBLIOTECA', 'LA BIBLIOTECA')}
                    </Text>
                  ) : null}
                  <Text style={[s.passoTexto, s.passoTextoProxima]} numberOfLines={1}>
                    {proxima.titulo[idioma]}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={15} color="#FFD700" />
              </Pressable>
            ) : <View style={{ flex: 1 }} />}
          </View>
        ) : null}
      </View>
    </Modal>
  )
}

const s = StyleSheet.create({
  // `minHeight: 0` na cadeia flex: sem ele a rolagem trava no PWA.
  raiz: { flex: 1, minHeight: 0, backgroundColor: '#0B0F1C' },
  trilho: { height: 2.5, backgroundColor: 'rgba(255,255,255,0.07)' },
  trilhoCheio: { height: 2.5, backgroundColor: '#FFD700' },
  cabecalho: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingTop: 16,
    paddingBottom: 16,
    paddingHorizontal: 20,
  },
  contexto: {
    color: '#8D96AC', fontSize: 11, fontWeight: '700',
    textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 7,
  },
  titulo: { color: '#F2F5FA', fontSize: 23, fontWeight: '800', lineHeight: 30, letterSpacing: -0.3 },
  minutos: { color: '#6B7490', fontSize: 12, marginTop: 6 },
  fechar: {
    width: 36, height: 36, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.07)',
  },
  corpo: { paddingHorizontal: 20 },
  ligados: { marginTop: 14, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.08)', paddingTop: 16 },
  secao: {
    color: '#8D96AC', fontSize: 12, fontWeight: '700',
    textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 9,
  },
  ligado: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingVertical: 12, paddingHorizontal: 13,
    backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 12, marginBottom: 8,
  },
  ligadoTexto: { flex: 1, color: '#D7DCE8', fontSize: 14 },
  retomar: {
    flexDirection: 'row', alignItems: 'center', gap: 9,
    marginHorizontal: 14, marginBottom: 2,
    paddingVertical: 9, paddingHorizontal: 12, borderRadius: 11,
    backgroundColor: 'rgba(78,205,196,0.10)',
    borderWidth: 1, borderColor: 'rgba(78,205,196,0.28)',
  },
  retomarRotulo: {
    color: 'rgba(78,205,196,0.8)', fontSize: 8.5, fontWeight: '800',
    letterSpacing: 0.9, marginBottom: 2,
  },
  retomarTitulo: { color: '#CFEDEA', fontSize: 12.5, fontWeight: '600' },
  rodape: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingTop: 10, paddingHorizontal: 14,
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.08)',
    backgroundColor: '#0B0F1C',
  },
  passo: {
    flex: 1, flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingVertical: 10, paddingHorizontal: 10, borderRadius: 11,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  passoProxima: {
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(255,215,0,0.09)',
    borderWidth: 1, borderColor: 'rgba(255,215,0,0.3)',
  },
  passoTexto: { flex: 1, color: '#9AA3BA', fontSize: 12.5 },
  passoTextoProxima: { color: '#FFD700', fontWeight: '700', textAlign: 'right' },
  passoRotulo: {
    color: 'rgba(255,215,0,0.65)', fontSize: 8.5, fontWeight: '800',
    letterSpacing: 1, textAlign: 'right', marginBottom: 3,
  },
})
