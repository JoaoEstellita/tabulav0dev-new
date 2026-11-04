import React, { useMemo, useRef, useState } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useAppLanguage } from '../../hooks/useAppLanguage'
import { useProgressoDoEstudo } from '../../hooks/useProgressoDoEstudo'
import CardDaUnidade from '../../components/estudo/CardDaUnidade'
import LicaoScreen from './LicaoScreen'
import {
  CATALOGO, LICOES, VERBETES, porId,
  type CategoriaVerbete, type IdiomaEstudo, type Unidade,
} from '../../data/estudo'
import { CAPITULOS, ESTANTES } from '../../data/estudo/capitulos'

/**
 * O ESTUDO ASTROLÓGICO — trilha e biblioteca.
 *
 * ⚠️ NADA É TRAVADO. Quem quiser pular para a lição 9 pula; a trilha
 * RECOMENDA a próxima com uma borda, não a impõe. Travar pune o curioso, e o
 * curioso é exatamente quem esta área existe para servir.
 */
export default function EstudoScreen() {
  const { language } = useAppLanguage()
  const idioma: IdiomaEstudo = language === 'en-US' ? 'en-US'
    : language === 'es-ES' ? 'es-ES'
      : language === 'it-IT' ? 'it-IT' : 'pt-BR'
  const i = idioma === 'en-US' ? 1 : idioma === 'es-ES' ? 2 : idioma === 'it-IT' ? 3 : 0
  const tl = (pt: string, en: string, es: string, it: string) => [pt, en, es, it][i]

  const { lidos, marcarLido, proximaLicao } = useProgressoDoEstudo()
  const [busca, setBusca] = useState('')
  const [aberta, setAberta] = useState<string | null>(null)

  /**
   * O ÍNDICE: onde cada ato começa na rolagem.
   *
   * ⚠️ MEDIDO POR `onLayout`, não calculado. A altura de um ato depende de
   * quantas lições tem, de quantas linhas cada título ocupa no idioma e no
   * tamanho de fonte do aparelho — estimar daria um salto sempre um pouco
   * errado, e errado para baixo some com o cabeçalho do capítulo.
   */
  const rolagem = useRef<ScrollView>(null)
  const posicaoDoAto = useRef<Record<number, number>>({})
  /**
   * ⚠️ A BIBLIOTECA ENTRA NO ÍNDICE TAMBÉM. Ele cobria só os cinco capítulos,
   * e as cinco estantes — 41 verbetes, a maior parte do conteúdo — ficavam
   * fora: para chegar a "Casas" era preciso rolar a trilha inteira. Índice que
   * não alcança o conteúdo todo é um atalho que mente sobre o tamanho do que
   * existe.
   */
  const posicaoDaEstante = useRef<Record<string, number>>({})
  const rolarAte = (y: number | undefined) => {
    if (typeof y === 'number') rolagem.current?.scrollTo({ y: Math.max(0, y - 8), animated: true })
  }
  const irParaAto = (ato: number) => rolarAte(posicaoDoAto.current[ato])
  const irParaEstante = (chave: string) => rolarAte(posicaoDaEstante.current[chave])

  const proxima = proximaLicao()

  /**
   * ⚠️ A BUSCA COBRE AS DUAS CAMADAS. Quem digita "plutão" pode querer o
   * verbete ou a lição que o menciona — separar as buscas obrigaria a adivinhar
   * em qual aba procurar.
   */
  const achados = useMemo(() => {
    const q = busca.trim().toLowerCase()
    if (q.length < 2) return null
    return CATALOGO.filter((u) => (
      u.titulo[idioma].toLowerCase().includes(q)
      || u.resumo[idioma].toLowerCase().includes(q)
    ))
  }, [busca, idioma])

  const unidadeAberta: Unidade | null = aberta ? porId(aberta) : null

  /**
   * "ATO 1 · LIÇÃO 4 DE 12" no topo da lição aberta.
   *
   * ⚠️ MONTADO AQUI, não dentro do modal: os nomes dos atos já vivem nesta
   * tela, e duplicá-los lá seria a segunda cópia de uma lista que muda junto.
   */
  const contextoDe = (u: Unidade): string | null => {
    if (u.tipo === 'verbete') {
      const cat = ESTANTES.find((c) => c.chave === u.categoria)
      return cat ? cat.nome[idioma] : null
    }
    const ato = CAPITULOS.find((a) => a.ato === u.ato)
    const pos = tl(
      `Lição ${u.ordem} de ${LICOES.length}`,
      `Lesson ${u.ordem} of ${LICOES.length}`,
      `Leccion ${u.ordem} de ${LICOES.length}`,
      `Lezione ${u.ordem} di ${LICOES.length}`,
    )
    return ato ? `${ato.nome[idioma]} · ${pos}` : pos
  }

  /**
   * A lição anterior e a seguinte, para continuar sem voltar à lista.
   *
   * ⚠️ SÓ PARA LIÇÃO. A biblioteca não tem ordem; inventar uma no rodapé do
   * verbete prometeria um percurso que não existe.
   */
  const vizinhasDe = (u: Unidade) => {
    if (u.tipo !== 'licao') return { anterior: null, proxima: null }
    const k = LICOES.findIndex((l) => l.id === u.id)
    const ultima = k === LICOES.length - 1
    return {
      anterior: k > 0 ? LICOES[k - 1] : null,
      // ⚠️ A TRILHA NÃO TERMINA NUM BECO. Na última lição o rodapé sumia
      // inteiro e quem acabava de ler ficava sem saída a não ser fechar o
      // modal — depois de doze lições, a pior hora para a tela parar de
      // sugerir o que vem. A biblioteca é a continuação natural, e o primeiro
      // planeta é a porta dela: a lição 12 manda abrir o próprio mapa, e o
      // primeiro passo de ler um mapa é saber de quem é cada símbolo.
      proxima: ultima
        ? (VERBETES.find((v) => v.id === 'planeta-sol') ?? VERBETES[0] ?? null)
        : (k > -1 ? LICOES[k + 1] : null),
    }
  }
  const rotuloMin = tl('min', 'min', 'min', 'min')

  /** Quantas lições de um ato já foram lidas — o número do chip do índice. */
  const lidasDoAto = (ato: number) => {
    const doAto = LICOES.filter((l) => l.ato === ato)
    return { lidas: doAto.filter((l) => lidos.includes(l.id)).length, total: doAto.length }
  }

  const cardDe = (u: Unidade, recomendado = false) => (
    <CardDaUnidade
      key={u.id}
      unidade={u}
      idioma={idioma}
      lido={lidos.includes(u.id)}
      recomendado={recomendado}
      aoAbrir={setAberta}
      rotuloMinutos={rotuloMin}
    />
  )

  return (
    <View style={s.raiz}>
      {/* ── Continuar de onde parou ────────────────────────────────────
          ⚠️ UM CARTÃO TOCÁVEL, não uma linha de texto. A pergunta número um
          de quem volta é "onde eu estava", e antes a resposta era uma frase
          cinza que não levava a lugar nenhum: a pessoa tinha de procurar a
          lição na lista. */}
      <View style={s.progresso}>
        {LICOES.length === 0 ? (
          <Text style={s.progressoTexto}>
            {tl('O curso está sendo escrito', 'The course is being written',
              'El curso se esta escribiendo', 'Il corso e in scrittura')}
          </Text>
        ) : proxima ? (
          <Pressable
            onPress={() => setAberta(proxima.id)}
            accessibilityRole="button"
            style={({ pressed }) => [s.continuar, pressed && { opacity: 0.75 }]}
          >
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text style={s.continuarRotulo}>
                {lidos.length === 0
                  ? tl('COMEÇAR', 'START', 'EMPEZAR', 'INIZIARE')
                  : tl('CONTINUAR', 'CONTINUE', 'CONTINUAR', 'CONTINUA')}
                {`  ·  ${proxima.ordem}/${LICOES.length}`}
              </Text>
              <Text style={s.continuarTitulo} numberOfLines={2}>{proxima.titulo[idioma]}</Text>
            </View>
            <Ionicons name="play-circle" size={30} color="#FFD700" />
          </Pressable>
        ) : (
          <Text style={s.progressoTexto}>
            {tl('Trilha concluída', 'Path complete', 'Camino completado', 'Percorso completato')}
          </Text>
        )}
        <View style={s.barra}>
          <View
            style={[
              s.barraCheia,
              // Sem lição nenhuma a barra fica vazia em vez de dividir por zero.
              { width: LICOES.length ? `${Math.round((lidos.filter((id) => porId(id)?.tipo === 'licao').length / LICOES.length) * 100)}%` : '0%' },
            ]}
          />
        </View>
      </View>

      <TextInput
        value={busca}
        onChangeText={setBusca}
        placeholder={tl('Buscar lição ou termo', 'Search lesson or term', 'Buscar leccion o termino', 'Cerca lezione o termine')}
        placeholderTextColor="#6B7490"
        style={s.busca}
        accessibilityLabel={tl('Buscar no estudo', 'Search the study area', 'Buscar en el estudio', 'Cerca nello studio')}
      />

      {/* ── Índice dos capítulos ───────────────────────────────────────
          ⚠️ SÓ APARECE FORA DA BUSCA. Durante uma busca a lista já não está
          agrupada por ato, e um índice que rola para lugar nenhum seria pior
          que índice nenhum.

          ⚠️ O NÚMERO NO CHIP É PROGRESSO, não quantidade. "2/3" diz o que
          falta naquele capítulo — é a informação que faz o índice valer mais
          que a rolagem. */}
      {!achados && LICOES.length ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={s.indice}
          contentContainerStyle={s.indiceConteudo}
        >
          {CAPITULOS.map(({ ato, nome }) => {
            const { lidas, total } = lidasDoAto(ato)
            if (!total) return null
            const completo = lidas === total
            return (
              <Pressable
                key={`ix-${ato}`}
                onPress={() => irParaAto(ato)}
                accessibilityRole="button"
                accessibilityLabel={`${nome[idioma]}, ${lidas} de ${total}`}
                style={({ pressed }) => [s.chip, completo && s.chipFeito, pressed && { opacity: 0.6 }]}
              >
                <Text style={[s.chipTexto, completo && s.chipTextoFeito]} numberOfLines={1}>
                  {nome[idioma]}
                </Text>
                <Text style={[s.chipConta, completo && s.chipTextoFeito]}>{`${lidas}/${total}`}</Text>
              </Pressable>
            )
          })}

          {/* ⚠️ UM SEPARADOR, E NÃO OUTRA LINHA DE CHIPS. A biblioteca é outra
              natureza de conteúdo — consulta, não percurso — mas vive na mesma
              rolagem, então o índice dela tem de estar no mesmo lugar. */}
          {VERBETES.length ? <View style={s.chipDivisor} /> : null}

          {ESTANTES.map(({ chave, nome }) => {
            const quantos = VERBETES.filter((v) => v.categoria === chave).length
            if (!quantos) return null
            return (
              <Pressable
                key={`ix-${chave}`}
                onPress={() => irParaEstante(chave)}
                accessibilityRole="button"
                accessibilityLabel={`${nome[idioma]}, ${quantos}`}
                style={({ pressed }) => [s.chip, s.chipEstante, pressed && { opacity: 0.6 }]}
              >
                <Text style={s.chipTexto} numberOfLines={1}>{nome[idioma]}</Text>
                <Text style={s.chipConta}>{String(quantos)}</Text>
              </Pressable>
            )
          })}
        </ScrollView>
      ) : null}

      {/* ⚠️ `flex: 1` no ScrollView: sem ele não rola no web. */}
      <ScrollView ref={rolagem} style={{ flex: 1 }} contentContainerStyle={s.corpo} showsVerticalScrollIndicator={false}>
        {achados ? (
          <>
            <Text style={s.secao}>
              {tl(`${achados.length} resultado(s)`, `${achados.length} result(s)`,
                `${achados.length} resultado(s)`, `${achados.length} risultato(i)`)}
            </Text>
            {achados.map((u) => cardDe(u))}
            {achados.length === 0 ? (
              <Text style={s.vazio}>
                {tl('Nada com esse nome ainda.', 'Nothing by that name yet.',
                  'Nada con ese nombre todavia.', 'Nulla con quel nome, per ora.')}
              </Text>
            ) : null}
          </>
        ) : (
          <>
            {/* ── A trilha, por ato ────────────────────────────────── */}
            {CAPITULOS.map(({ ato, nome, abertura }) => {
              const doAto = LICOES.filter((l) => l.ato === ato)
              if (!doAto.length) return null
              const { lidas, total } = lidasDoAto(ato)
              return (
                <View
                  key={`ato-${ato}`}
                  style={s.grupo}
                  onLayout={(e) => { posicaoDoAto.current[ato] = e.nativeEvent.layout.y }}
                >
                  <View style={s.capitulo}>
                    <Text style={s.capituloNumero}>
                      {tl(`Capítulo ${ato + 1}`, `Chapter ${ato + 1}`, `Capitulo ${ato + 1}`, `Capitolo ${ato + 1}`)}
                    </Text>
                    <Text style={s.capituloConta}>{`${lidas}/${total}`}</Text>
                  </View>
                  <Text style={s.secao}>{nome[idioma]}</Text>
                  {/* ⚠️ A ABERTURA DIZ POR QUE O CAPÍTULO EXISTE, não o que
                      ele contém: a lista logo abaixo já diz o conteúdo. */}
                  <Text style={s.abertura}>{abertura[idioma]}</Text>
                  {doAto.map((l) => cardDe(l, l.id === proxima?.id))}
                </View>
              )
            })}

            {/* ── A biblioteca, por categoria ──────────────────────── */}
            {VERBETES.length ? (
              <View onLayout={(e) => { posicaoDaEstante.current.biblioteca = e.nativeEvent.layout.y }}>
                <Text style={[s.secao, s.secaoBiblioteca]}>
                  {tl('Biblioteca', 'Library', 'Biblioteca', 'Biblioteca')}
                </Text>
              </View>
            ) : null}
            {ESTANTES.map(({ chave, nome }) => {
              const daCat = VERBETES.filter((v) => v.categoria === chave)
              if (!daCat.length) return null
              return (
                <View
                  key={`cat-${chave}`}
                  style={s.grupo}
                  onLayout={(e) => { posicaoDaEstante.current[chave] = e.nativeEvent.layout.y }}
                >
                  <Text style={s.subsecao}>{`${nome[idioma]} · ${daCat.length}`}</Text>
                  {daCat.map((v) => cardDe(v))}
                </View>
              )
            })}
          </>
        )}
      </ScrollView>

      {unidadeAberta ? (
        <LicaoScreen
          unidade={unidadeAberta}
          idioma={idioma}
          aoFechar={() => setAberta(null)}
          aoAbrirOutra={setAberta}
          marcarLido={marcarLido}
          tl={tl}
          contexto={contextoDe(unidadeAberta)}
          vizinhas={vizinhasDe(unidadeAberta)}
        />
      ) : null}
    </View>
  )
}

const s = StyleSheet.create({
  // `minHeight: 0` na cadeia flex: sem ele a rolagem trava no PWA.
  raiz: { flex: 1, minHeight: 0 },
  progresso: { marginBottom: 12 },
  continuar: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: 'rgba(255,215,0,0.09)',
    borderWidth: 1, borderColor: 'rgba(255,215,0,0.32)',
    borderRadius: 14, paddingVertical: 13, paddingHorizontal: 15,
    marginBottom: 10,
  },
  continuarRotulo: {
    color: '#FFD700', fontSize: 10.5, fontWeight: '800',
    letterSpacing: 1, marginBottom: 4,
  },
  continuarTitulo: { color: '#F2F5FA', fontSize: 15, fontWeight: '700', lineHeight: 20 },
  indice: { flexGrow: 0, marginBottom: 14 },
  indiceConteudo: { gap: 7, paddingRight: 4 },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 7,
    paddingVertical: 7, paddingHorizontal: 12, borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.09)',
    maxWidth: 190,
  },
  chipEstante: { backgroundColor: 'rgba(196,181,253,0.10)', borderColor: 'rgba(196,181,253,0.26)' },
  chipDivisor: { width: 1, height: 18, backgroundColor: 'rgba(255,255,255,0.14)', alignSelf: 'center', marginHorizontal: 3 },
  abertura: { color: '#9AA3BA', fontSize: 13.5, lineHeight: 20, marginBottom: 12, marginTop: -3 },
  chipFeito: { backgroundColor: 'rgba(78,205,196,0.12)', borderColor: 'rgba(78,205,196,0.35)' },
  chipTexto: { color: '#C7D2E8', fontSize: 12, fontWeight: '600', flexShrink: 1 },
  chipTextoFeito: { color: '#4ECDC4' },
  chipConta: { color: '#6B7490', fontSize: 10.5, fontWeight: '700' },
  capitulo: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 5 },
  capituloNumero: {
    flex: 1, color: '#6B7490', fontSize: 10.5, fontWeight: '800',
    textTransform: 'uppercase', letterSpacing: 1,
  },
  capituloConta: { color: '#6B7490', fontSize: 10.5, fontWeight: '700' },
  progressoTexto: { color: '#C7D2E8', fontSize: 13, fontWeight: '600', marginBottom: 7 },
  barra: { height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.10)', overflow: 'hidden' },
  barraCheia: { height: 4, borderRadius: 2, backgroundColor: '#FFD700' },
  busca: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 11,
    paddingHorizontal: 13,
    paddingVertical: 10,
    color: '#F2F5FA',
    fontSize: 14,
    marginBottom: 14,
  },
  corpo: { paddingBottom: 28 },
  grupo: { marginBottom: 18 },
  secao: { color: '#F2F5FA', fontSize: 15, fontWeight: '800', marginBottom: 10 },
  secaoBiblioteca: { marginTop: 6, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.08)', paddingTop: 18 },
  subsecao: { color: '#8D96AC', fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 9 },
  vazio: { color: '#8D96AC', fontSize: 13, fontStyle: 'italic' },
})
