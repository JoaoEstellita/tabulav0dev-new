import React, { useMemo, useState } from 'react'
import { LayoutAnimation, Platform, Pressable, StyleSheet, Text, UIManager, View } from 'react-native'
import { useAppLanguage } from '../hooks/useAppLanguage'
import { buildUnifiedTransitNarrative } from '../utils/astroInterpretation'
import { areaLabelsForTransit } from '../utils/transitLifeAreas'
import { getLifeAreaLabel } from '../constants/lifeAreas'
import { aspectNature, getTransitState, formatPeakETA } from '../utils/astro/pt'
import TextoComGlossario from './TextoComGlossario'
import {
  temaDoTransito,
  primeiraFrase,
  semAPrimeiraFrase,
  costurar,
  enumerar,
} from '../utils/leituraDoDia'

/**
 * A leitura do dia.
 *
 * Cinco versões ficaram pelo caminho e cada uma ensinou uma coisa. As duas
 * primeiras diziam o óbvio ou nomeavam o aspecto; a terceira e a quarta
 * tentaram tornar palavras tocáveis — a terceira rolava a tela, a quarta abria
 * modais, e no aparelho os sublinhados pontilhados leram como corretor
 * ortográfico. A frase voltou a ser texto.
 *
 * O problema que sobrou era o pior: ela era GENÉRICA. Montava a abertura com
 * uma palavra-chave solta ("o dia pede foco") e fechava com `buildActionHint`,
 * um template de quatro variações — e, como recebia `areaLabel` nulo, caía no
 * ramo mais vago de todos: "observe sinais, registre decisões e execute um
 * próximo passo simples em área de vida". Uma frase que serve para qualquer
 * pessoa em qualquer dia, que é outra forma de dizer que não serve.
 *
 * O material específico já existia e não estava sendo usado:
 *  - os títulos temáticos curados ("Prova de maturidade");
 *  - o texto curado do catálogo de interpretações, por par de planetas;
 *  - a janela real do trânsito (pico em 3 dias, se afastando);
 *  - a área de vida concreta, que agora é passada ao catálogo em vez de null.
 *
 * E a leitura passou a ter dois níveis: o resumo dá a passada geral e o "Ler
 * mais" abre o detalhe de cada trânsito. O expandido NÃO repete a abertura já
 * lida — mostra o resto do texto do principal e os trânsitos seguintes
 * inteiros.
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
  /** Pares [chave, área] — o status de hoje, que diz ONDE o trânsito pega. */
  areas?: ReadonlyArray<readonly [string, any]>
}

/** Quantos trânsitos o "Ler mais" detalha. Além disso vira lista, não leitura. */
const MAX_DETALHES = 4

const forca = (t: TransitoRico) => (typeof t.strength === 'number' ? t.strength : 0)

export default function FraseDoDia({ transitos, areas }: Props) {
  const { language } = useAppLanguage()
  const [aberto, setAberto] = useState(false)
  const tl = (pt: string, en: string, es: string, it: string) =>
    language === 'en-US' ? en : language === 'es-ES' ? es : language === 'it-IT' ? it : pt

  const leitura = useMemo(() => {
    const lista = (transitos || []).filter((t) => t?.transitPlanet && t?.natalPlanet && t?.type)
    if (!lista.length) return null

    const ordenados = [...lista].sort((a, b) => forca(b) - forca(a))
    const principal = ordenados[0]

    /** Áreas de vida que o trânsito toca, em rótulo legível. */
    const areasDe = (t: TransitoRico) => areaLabelsForTransit(t.transitPlanet, t.natalPlanet, t.house)

    /**
     * A narrativa do catálogo, com a ÁREA REAL.
     *
     * Passar null aqui era o que fazia o texto de ação cair no ramo genérico e
     * escrever literalmente "em área de vida".
     */
    const narrar = (t: TransitoRico) =>
      buildUnifiedTransitNarrative(t as any, areasDe(t)[0] || null, language)

    /** "pico em 3 dias", "agora", "se afastando" — o quando, que é específico. */
    const quando = (t: TransitoRico): string => {
      const estado = getTransitState(t.window || undefined)
      const eta = formatPeakETA(t.window || undefined)
      if (estado === 'agora') return tl('no pico agora', 'peaking now', 'en el pico ahora', 'al picco ora')
      return eta || ''
    }

    const nPrincipal = narrar(principal)
    const temaPrincipal = temaDoTransito(
      String(principal.transitPlanet), String(principal.type), String(principal.natalPlanet), language,
    )
    const curadoPrincipal = String(nPrincipal?.modalBody || nPrincipal?.shortText || '').trim()

    // ── RESUMO: a passada geral ────────────────────────────────────────────
    const partes: string[] = []

    // 1) O que pesa hoje, com nome próprio e tempo. O tema curado é o que troca
    //    "o dia pede foco" por "Prova de maturidade".
    const q = quando(principal)
    if (temaPrincipal) {
      partes.push(costurar(
        tl('Hoje o que mais pesa é', 'What weighs most today is', 'Lo que mas pesa hoy es', 'Cio che pesa di piu oggi e'),
        `${temaPrincipal}${q ? ` — ${q}` : ''}.`,
      ))
    }

    // 2) O que isso significa — primeira frase do texto curado daquele par.
    //    Fora do pt-BR não há tema, então esta vira a abertura.
    const abertura = primeiraFrase(curadoPrincipal)
    if (abertura) partes.push(abertura)

    // 3) Onde pega.
    const focos = areasDe(principal).slice(0, 2)
    if (focos.length) {
      partes.push(costurar(
        tl('Pega mais em', 'It lands mostly on', 'Toca sobre todo', 'Tocca soprattutto'),
        `${enumerar(focos, tl('e', 'and', 'y', 'e'))}.`,
      ))
    }

    // 4) O status: a outra metade da leitura. Diz onde a pessoa está hoje, não
    //    só o que o céu faz.
    const porStatus = (areas || [])
      .map(([chave, v]) => ({
        chave: String(chave),
        pct: typeof v?.percentage === 'number' ? v.percentage : (typeof v?.status === 'number' ? v.status : NaN),
      }))
      .filter((x) => Number.isFinite(x.pct))
      .sort((x, y) => x.pct - y.pct)

    if (porStatus.length >= 2) {
      const pior = getLifeAreaLabel(porStatus[0].chave)
      const melhor = getLifeAreaLabel(porStatus[porStatus.length - 1].chave)
      // Só vale dizer se forem áreas diferentes do foco — senão repete.
      partes.push(costurar(
        tl('Nos seus números,', 'In your numbers,', 'En tus numeros,', 'Nei tuoi numeri,'),
        tl(`${pior} é a que mais pede cuidado e ${melhor} é onde há folga.`,
           `${pior} asks for most care and ${melhor} is where there is room.`,
           `${pior} es la que mas pide cuidado y ${melhor} es donde hay holgura.`,
           `${pior} e quella che chiede piu cura e ${melhor} e dove c e respiro.`),
      ))
    }

    const resumo = costurar(...partes)
    if (!resumo) return null

    // ── DETALHE: o "Ler mais" ──────────────────────────────────────────────
    //
    // O principal entra SEM a frase já lida no resumo; os seguintes, inteiros.
    // Repetir a abertura logo abaixo faz o bloco expandido parecer que não
    // acrescenta nada.
    const detalhes = ordenados.slice(0, MAX_DETALHES).map((t, i) => {
      const n = narrar(t)
      const completo = String(n?.modalBody || n?.shortText || '').trim()
      const corpo = i === 0 ? semAPrimeiraFrase(completo) : completo
      const tema = temaDoTransito(String(t.transitPlanet), String(t.type), String(t.natalPlanet), language)
      const area = areasDe(t).slice(0, 3)
      return {
        chave: `${t.transitPlanet}|${t.type}|${t.natalPlanet}`,
        tema,
        quando: quando(t),
        forca: typeof t.strength === 'number' ? Math.round(t.strength) : null,
        casa: typeof t.house === 'number' && t.house > 0 ? t.house : null,
        areas: area,
        corpo,
        acao: i === 0 ? String(n?.actionText || '').trim() : '',
        natureza: aspectNature(String(t.type)),
      }
    }).filter((d) => d.corpo || d.tema)

    return { resumo, detalhes }
  }, [transitos, areas, language])

  if (!leitura) return null

  const alternar = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    setAberto((v) => !v)
  }

  const temDetalhe = leitura.detalhes.length > 0

  return (
    <View style={s.caixa}>
      <Text style={s.rotulo}>{tl('O seu dia', 'Your day', 'Tu dia', 'La tua giornata')}</Text>
      <TextoComGlossario style={s.texto}>{leitura.resumo}</TextoComGlossario>

      {aberto ? (
        <View style={s.detalhe}>
          {leitura.detalhes.map((d) => (
            <View key={d.chave} style={s.item}>
              <View style={s.itemTopo}>
                <View style={[s.pino, d.natureza === 'desafiador' ? s.pinoTenso : d.natureza === 'harmonico' ? s.pinoBom : s.pinoNeutro]} />
                <Text style={s.itemTitulo}>{d.tema || ''}</Text>
              </View>

              {/* A linha técnica fica pequena e abaixo do tema: quem só quer a
                  leitura ignora, quem estuda procura exatamente isto. */}
              <Text style={s.itemMeta}>
                {[
                  d.quando,
                  d.casa ? `${tl('Casa', 'House', 'Casa', 'Casa')} ${d.casa}` : '',
                  d.forca != null ? `${tl('impacto', 'impact', 'impacto', 'impatto')} ${d.forca}%` : '',
                ].filter(Boolean).join('  ·  ')}
              </Text>

              {d.corpo ? <TextoComGlossario style={s.itemTexto}>{d.corpo}</TextoComGlossario> : null}

              {d.areas.length ? (
                <Text style={s.itemAreas}>
                  {tl('Afeta', 'Affects', 'Afecta', 'Tocca')}: {d.areas.join(' · ')}
                </Text>
              ) : null}

              {d.acao ? <Text style={s.itemAcao}>{d.acao}</Text> : null}
            </View>
          ))}
        </View>
      ) : null}

      {temDetalhe ? (
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

  detalhe: { marginTop: 16 },
  item: {
    marginBottom: 18,
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
  itemAreas: { color: '#9aa2bb', fontSize: 14, marginTop: 7 },
  itemAcao: { color: '#c9cfe2', fontSize: 15, lineHeight: 22, marginTop: 8, fontStyle: 'italic' },

  botao: {
    marginTop: 4,
    paddingVertical: 10,
    alignItems: 'center',
  },
  botaoTexto: { color: '#FFD700', fontSize: 14.5, fontWeight: '700' },
})
