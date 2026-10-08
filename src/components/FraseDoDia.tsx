import React, { useMemo, useState } from 'react'
import { LayoutAnimation, Platform, Pressable, StyleSheet, Text, UIManager, View } from 'react-native'
import { useAppLanguage } from '../hooks/useAppLanguage'
import { buildUnifiedTransitNarrative } from '../utils/astroInterpretation'
import { areaLabelsForTransit } from '../utils/transitLifeAreas'
import { aspectNature } from '../utils/astro/pt'
import { buildTransitTitle } from '../utils/transitPresentation'
import TextoComGlossario from './TextoComGlossario'
import {
  temaDoTransito,
  primeiraFrase,
  costurar,
  enumerar,
  janelaEmPalavras,
  type IdiomaLeitura,
} from '../utils/leituraDoDia'

/**
 * A leitura do dia: um aviso curto, e o resto a um toque.
 *
 * Histórico curto das versões que não deram certo, porque cada uma marca um
 * limite: dizer o óbvio ("hoje o dinheiro pede cuidado"), nomear o aspecto
 * como se fosse conselho, tornar palavras tocáveis (duas tentativas — rolar a
 * tela e abrir modal; no aparelho os sublinhados leram como corretor
 * ortográfico), e por fim um resumo correto mas comprido demais, com template
 * genérico no fim.
 *
 * O formato agora é: UMA frase no topo e o detalhe dentro do "Ler mais". O
 * bloco mais nobre da Home não comporta cinco linhas — quem quer a passada
 * geral lê uma linha e segue; quem quer entender abre.
 *
 * No detalhe, cada trânsito traz o ASPECTO e o texto curado dele. Sem ação
 * prática: `buildActionHint` é um template de quatro variações e, repetido em
 * quatro cards, deixa claro que é molde — "observe sinais, registre decisões e
 * execute um próximo passo simples" não é conselho, é preenchimento.
 *
 * Fica em silêncio sem dado. Frase vaga ocupa o lugar mais nobre da tela sem
 * dizer nada que a pessoa não soubesse antes de abrir o app.
 */

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}

type TransitoRico = {
  transitPlanet?: string
  natalPlanet?: string
  type?: string
  strength?: number
  house?: number | null
  window?: { start?: string; exact?: string; end?: string } | null
}

interface Props {
  transitos?: TransitoRico[] | null
  /** Pares [chave, área] — mantido para compatibilidade; o status tem cards próprios. */
  areas?: ReadonlyArray<readonly [string, any]>
}

/** Quantos trânsitos o "Ler mais" detalha. Além disso vira lista, não leitura. */
const MAX_DETALHES = 4

const forca = (t: TransitoRico) => (typeof t.strength === 'number' ? t.strength : 0)

export default function FraseDoDia({ transitos }: Props) {
  const { language } = useAppLanguage()
  const [aberto, setAberto] = useState(false)
  const tl = (pt: string, en: string, es: string, it: string) =>
    language === 'en-US' ? en : language === 'es-ES' ? es : language === 'it-IT' ? it : pt

  const leitura = useMemo(() => {
    const lista = (transitos || []).filter((t) => t?.transitPlanet && t?.natalPlanet && t?.type)
    if (!lista.length) return null

    const ordenados = [...lista].sort((a, b) => forca(b) - forca(a))
    const principal = ordenados[0]
    const idioma = (language as IdiomaLeitura) || 'pt-BR'

    const areasDe = (t: TransitoRico) => areaLabelsForTransit(t.transitPlanet, t.natalPlanet, t.house)

    /**
     * A narrativa do catálogo, com a ÁREA REAL.
     *
     * Passar null aqui fazia o catálogo cair no ramo genérico e escrever
     * literalmente "em área de vida".
     */
    const narrar = (t: TransitoRico) =>
      buildUnifiedTransitNarrative(t as any, areasDe(t)[0] || null, language)

    // ── O AVISO: uma frase ─────────────────────────────────────────────────
    const tema = temaDoTransito(
      String(principal.transitPlanet), String(principal.type), String(principal.natalPlanet), language,
    )
    const focos = areasDe(principal).slice(0, 2)
    const ondePega = focos.length
      ? costurar(tl('mexe em', 'it stirs', 'mueve', 'muove'), enumerar(focos, tl('e', 'and', 'y', 'e')))
      : ''

    // Com tema (pt-BR) a frase é curta e concreta. Sem tema, a primeira frase
    // do texto curado faz o papel — nunca um molde.
    const nPrincipal = narrar(principal)
    const curado = String(nPrincipal?.modalBody || nPrincipal?.shortText || '').trim()

    const aviso = tema
      ? costurar(
          tl('Hoje o que mais pesa é', 'What weighs most today is', 'Lo que mas pesa hoy es', 'Cio che pesa di piu oggi e'),
          ondePega ? `${tema} — ${ondePega}.` : `${tema}.`,
        )
      : costurar(primeiraFrase(curado), ondePega ? `${ondePega.charAt(0).toUpperCase()}${ondePega.slice(1)}.` : '')

    if (!aviso) return null

    // ── O DETALHE: aspecto e texto, nada mais ──────────────────────────────
    const detalhes = ordenados.slice(0, MAX_DETALHES).map((t) => {
      const n = narrar(t)
      const corpo = String(n?.modalBody || n?.shortText || '').trim()
      return {
        chave: `${t.transitPlanet}|${t.type}|${t.natalPlanet}`,
        // O ASPECTO em si — é o que identifica o trânsito sem rodeio.
        aspecto: buildTransitTitle(
          { transitPlanet: t.transitPlanet, aspectLabel: t.type, targetLabel: t.natalPlanet },
          language as any,
        ),
        quando: janelaEmPalavras(t.window, idioma),
        casa: typeof t.house === 'number' && t.house > 0 ? t.house : null,
        corpo,
        natureza: aspectNature(String(t.type)),
      }
    }).filter((d) => d.corpo)

    return { aviso, detalhes }
  }, [transitos, language])

  if (!leitura) return null

  const alternar = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    setAberto((v) => !v)
  }

  return (
    <View style={s.caixa}>
      <Text style={s.rotulo}>{tl('O seu dia', 'Your day', 'Tu dia', 'La tua giornata')}</Text>
      <TextoComGlossario style={s.texto}>{leitura.aviso}</TextoComGlossario>

      {aberto ? (
        <View style={s.detalhe}>
          {leitura.detalhes.map((d) => (
            <View key={d.chave} style={s.item}>
              <View style={s.itemTopo}>
                <View style={[s.pino, d.natureza === 'desafiador' ? s.pinoTenso : d.natureza === 'harmonico' ? s.pinoBom : s.pinoNeutro]} />
                <Text style={s.itemTitulo}>{d.aspecto}</Text>
              </View>

              {/* Quando chega ao ponto exato, em palavras. A forma compacta
                  ("pico ha 6d") cabe num chip, mas no meio do texto não se lê. */}
              {d.quando || d.casa ? (
                <Text style={s.itemMeta}>
                  {[d.quando, d.casa ? `${tl('Casa', 'House', 'Casa', 'Casa')} ${d.casa}` : '']
                    .filter(Boolean)
                    .join('  ·  ')}
                </Text>
              ) : null}

              <TextoComGlossario style={s.itemTexto}>{d.corpo}</TextoComGlossario>
            </View>
          ))}
        </View>
      ) : null}

      {leitura.detalhes.length ? (
        <Pressable onPress={alternar} style={s.botao} accessibilityRole="button">
          <Text style={s.botaoTexto}>
            {aberto
              ? tl('Mostrar menos', 'Show less', 'Mostrar menos', 'Mostra meno')
              : tl('Ler mais', 'Read more', 'Leer mas', 'Leggi di piu')}
            {aberto ? '  ▲' : '  ▼'}
          </Text>
        </Pressable>
      ) : null}
    </View>
  )
}

const s = StyleSheet.create({
  caixa: {
    marginHorizontal: 16,
    marginTop: 2,
    marginBottom: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255,215,0,0.05)',
    borderRadius: 14,
    borderLeftWidth: 3,
    borderLeftColor: '#FFD700',
  },
  rotulo: {
    color: '#8d94a8',
    fontSize: 11,
    letterSpacing: 1.1,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  texto: { color: '#edf0f6', fontSize: 16, lineHeight: 25 },

  detalhe: { marginTop: 14 },
  item: {
    marginBottom: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
  },
  itemTopo: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 3 },
  // Um ponto colorido diz a natureza sem gastar uma palavra com isso.
  pino: { width: 8, height: 8, borderRadius: 4 },
  pinoTenso: { backgroundColor: '#f87171' },
  pinoBom: { backgroundColor: '#4ade80' },
  pinoNeutro: { backgroundColor: '#fbbf24' },
  itemTitulo: { color: '#FFD700', fontSize: 15.5, fontWeight: '700', flex: 1 },
  itemMeta: { color: '#8d94a8', fontSize: 14, marginBottom: 7 },
  itemTexto: { color: '#dde2ee', fontSize: 15, lineHeight: 23 },

  botao: { marginTop: 4, paddingVertical: 10, alignItems: 'center' },
  botaoTexto: { color: '#FFD700', fontSize: 14.5, fontWeight: '700' },
})
