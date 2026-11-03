import React, { useMemo, useState } from 'react'
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import { useAppLanguage } from '../../hooks/useAppLanguage'
import { useProgressoDoEstudo } from '../../hooks/useProgressoDoEstudo'
import CardDaUnidade from '../../components/estudo/CardDaUnidade'
import LicaoScreen from './LicaoScreen'
import {
  CATALOGO, LICOES, VERBETES, porId,
  type CategoriaVerbete, type IdiomaEstudo, type Unidade,
} from '../../data/estudo'

const ATOS: Array<{ ato: 0 | 1 | 2 | 3 | 4; nome: [string, string, string, string] }> = [
  { ato: 0, nome: ['Por que o céu diz algo', 'Why the sky says anything', 'Por que el cielo dice algo', 'Perche il cielo dice qualcosa'] },
  { ato: 1, nome: ['As perguntas de um mapa', 'The questions a chart answers', 'Las preguntas de una carta', 'Le domande di una carta'] },
  { ato: 2, nome: ['O que liga', 'What connects', 'Lo que conecta', 'Cio che collega'] },
  { ato: 3, nome: ['O tempo', 'Time', 'El tiempo', 'Il tempo'] },
  { ato: 4, nome: ['Ler sozinho', 'Reading on your own', 'Leer por tu cuenta', 'Leggere da soli'] },
]

const CATEGORIAS: Array<{ chave: CategoriaVerbete; nome: [string, string, string, string] }> = [
  { chave: 'planeta', nome: ['Planetas', 'Planets', 'Planetas', 'Pianeti'] },
  { chave: 'signo', nome: ['Signos', 'Signs', 'Signos', 'Segni'] },
  { chave: 'casa', nome: ['Casas', 'Houses', 'Casas', 'Case'] },
  { chave: 'aspecto', nome: ['Aspectos', 'Aspects', 'Aspectos', 'Aspetti'] },
  { chave: 'conceito', nome: ['Conceitos', 'Concepts', 'Conceptos', 'Concetti'] },
]

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
  const rotuloMin = tl('min', 'min', 'min', 'min')

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
      {/* ── Onde você está ─────────────────────────────────────────── */}
      <View style={s.progresso}>
        <Text style={s.progressoTexto}>
          {LICOES.length === 0
            ? tl('O curso está sendo escrito', 'The course is being written',
              'El curso se esta escribiendo', 'Il corso e in scrittura')
            : proxima
              ? tl(
                `Lição ${proxima.ordem} de ${LICOES.length}`,
                `Lesson ${proxima.ordem} of ${LICOES.length}`,
                `Leccion ${proxima.ordem} de ${LICOES.length}`,
                `Lezione ${proxima.ordem} di ${LICOES.length}`,
              )
              : tl('Trilha concluída', 'Path complete', 'Camino completado', 'Percorso completato')}
        </Text>
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

      {/* ⚠️ `flex: 1` no ScrollView: sem ele não rola no web. */}
      <ScrollView style={{ flex: 1 }} contentContainerStyle={s.corpo} showsVerticalScrollIndicator={false}>
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
            {ATOS.map(({ ato, nome }) => {
              const doAto = LICOES.filter((l) => l.ato === ato)
              if (!doAto.length) return null
              return (
                <View key={`ato-${ato}`} style={s.grupo}>
                  <Text style={s.secao}>{nome[i]}</Text>
                  {doAto.map((l) => cardDe(l, l.id === proxima?.id))}
                </View>
              )
            })}

            {/* ── A biblioteca, por categoria ──────────────────────── */}
            {VERBETES.length ? (
              <Text style={[s.secao, s.secaoBiblioteca]}>
                {tl('Biblioteca', 'Library', 'Biblioteca', 'Biblioteca')}
              </Text>
            ) : null}
            {CATEGORIAS.map(({ chave, nome }) => {
              const daCat = VERBETES.filter((v) => v.categoria === chave)
              if (!daCat.length) return null
              return (
                <View key={`cat-${chave}`} style={s.grupo}>
                  <Text style={s.subsecao}>{`${nome[i]} · ${daCat.length}`}</Text>
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
        />
      ) : null}
    </View>
  )
}

const s = StyleSheet.create({
  // `minHeight: 0` na cadeia flex: sem ele a rolagem trava no PWA.
  raiz: { flex: 1, minHeight: 0 },
  progresso: { marginBottom: 12 },
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
