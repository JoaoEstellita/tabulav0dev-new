import React, { useMemo } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useAppLanguage } from '../hooks/useAppLanguage'
import { buildUnifiedTransitNarrative } from '../utils/astroInterpretation'
import { areaLabelsForTransit, areasAffectedByTransit } from '../utils/transitLifeAreas'
import { getLifeAreaLabel } from '../constants/lifeAreas'
import { aspectNature } from '../utils/astro/pt'
import { transitCellId } from '../astro/transitCellId'
import { palavraDeSentido } from '../utils/palavraDeSentido'
import { indiceDePalavras, fatiarComAncoras, type Pedaco } from '../utils/ancorasDoTexto'

/**
 * A leitura do dia: o que fazer, não o que está no céu.
 *
 * Três versões ficaram pelo caminho e vale saber por quê. A primeira olhava duas
 * barras de área ("hoje o dinheiro pede cuidado") — dizia o óbvio sem explicar
 * de onde vinha. A segunda nomeava o aspecto ("Saturno com Sol") e tornava ESSE
 * nome tocável — mas quem não estuda astrologia não procura "Saturno com Sol";
 * procura o que fazer com o dia. A terceira acertou a palavra, mas tocar nela
 * ROLAVA a tela até a lista: tirava do lugar o texto que a pessoa estava lendo e
 * a largava num card que ela ainda não sabia ler.
 *
 * Agora tocar abre a INTERPRETAÇÃO daquele trânsito, ali mesmo. E as âncoras não
 * são mais só duas: toda palavra do texto que seja palavra-chave de algum
 * trânsito ativo vira porta para ele (`utils/ancorasDoTexto`). Quem quiser a
 * lista chega por ela pelo modal do planeta, que tem o link próprio.
 *
 * A síntese cruza duas fontes: os trânsitos (o que o céu move) e o status das
 * áreas (onde isso pega na vida). Nenhuma das duas sozinha dá um conselho — e o
 * resumo do status agora entra no texto, não só na escolha do foco.
 *
 * Fica em silêncio sem dado. Frase vaga ocupa o lugar mais nobre da tela sem
 * dizer nada que a pessoa não soubesse antes de abrir o app.
 */

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
  /**
   * Abre a interpretação do trânsito (modal), que é o que uma palavra tocada
   * deve fazer. NÃO rola a tela: ver `onSelectTransitAspect` da roda para isso.
   */
  onAbrirTransito?: (cellId: string) => void
}

const forca = (t: TransitoRico) => (typeof t.strength === 'number' ? t.strength : 0)

const idDe = (t: TransitoRico) =>
  transitCellId(String(t.transitPlanet || ''), String(t.type || ''), String(t.natalPlanet || ''))

function ePicoHoje(t: TransitoRico): boolean {
  const exato = t.window?.exact
  if (!exato) return false
  const d = new Date(exato)
  if (!Number.isFinite(d.getTime())) return false
  return d.toISOString().slice(0, 10) === new Date().toISOString().slice(0, 10)
}

export default function FraseDoDia({ transitos, areas, onAbrirTransito }: Props) {
  const { language } = useAppLanguage()
  const tl = (pt: string, en: string, es: string, it: string) =>
    language === 'en-US' ? en : language === 'es-ES' ? es : language === 'it-IT' ? it : pt

  const pedacos = useMemo<Pedaco[] | null>(() => {
    const lista = (transitos || []).filter((t) => t?.transitPlanet && t?.natalPlanet && t?.type)
    if (!lista.length) return null

    const ordenados = [...lista].sort((a, b) => forca(b) - forca(a))
    const principal = ordenados[0]

    // Contraponto de natureza OPOSTA: um dia de pressão com um apoio em algum
    // lugar é mais verdadeiro — e mais útil — que os dois trânsitos mais fortes,
    // que em geral dizem a mesma coisa.
    const natureza = aspectNature(String(principal.type))
    const oposta = natureza === 'desafiador' ? 'harmonico' : 'desafiador'
    const contraponto = ordenados.slice(1).find((t) => aspectNature(String(t.type)) === oposta) || null

    const narrativa = (t: TransitoRico) => buildUnifiedTransitNarrative(t as any, null, language)

    /**
     * O modal vai abrir mesmo?
     *
     * Quem abre a interpretacao reconstroi a narrativa a partir do id da celula,
     * com apenas os tres nomes — sem casa, sem forca, sem janela. Entao pode
     * haver texto aqui (onde o transito vem completo) e NAO haver la. Se a
     * palavra ficar tocavel nesse caso, o toque nao faz nada: um link morto no
     * meio do texto e pior que palavra sem link, porque a pessoa conclui que o
     * app travou.
     *
     * A checagem espelha exatamente a chamada do modal.
     */
    const abreDeVerdade = (t: TransitoRico): boolean => {
      const comoNoModal = buildUnifiedTransitNarrative(
        {
          transitPlanet: t.transitPlanet,
          natalPlanet: t.natalPlanet,
          type: t.type,
          aspectName: t.type,
        } as any,
        null,
        language,
      )
      return !!String(comoNoModal?.modalBody || comoNoModal?.shortText || '').trim()
    }

    const ler = (t: TransitoRico) => {
      const n = narrativa(t)
      return {
        sentido: palavraDeSentido(n?.keywords || [], String(t.transitPlanet), String(t.natalPlanet), String(t.type)),
        acao: String(n?.actionText || '').trim(),
        curto: String(n?.shortText || '').trim(),
      }
    }

    const a = ler(principal)
    const b = contraponto ? ler(contraponto) : null

    // Índice de âncoras: toda palavra-chave de todo trânsito ativo vira porta
    // para ele. Ordem = do mais forte para o mais fraco, então a palavra
    // disputada cai no trânsito que mais pesa hoje.
    //
    // Nomes de planeta e de aspecto ficam de fora: a frase existe justamente
    // para não depender deles. Marcá-los devolveria o jargão pela porta dos
    // fundos.
    const proibidas: string[] = []
    for (const t of ordenados) {
      proibidas.push(String(t.transitPlanet || ''), String(t.natalPlanet || ''), String(t.type || ''))
    }
    const indice = indiceDePalavras(
      ordenados
        .slice(0, 8)
        .filter(abreDeVerdade)
        .map((t) => ({ id: idDe(t), keywords: narrativa(t)?.keywords || [] })),
      proibidas,
    )
    const usadas = new Set<string>()

    const out: Pedaco[] = []
    /** Texto corrido: as palavras do índice que aparecerem viram âncoras. */
    const escrever = (texto: string) => {
      if (texto) out.push(...fatiarComAncoras(texto, indice, usadas))
    }
    /** Âncora explícita: esta palavra abre ESTE trânsito, sem passar pelo índice. */
    const ancorar = (texto: string, t: TransitoRico) => {
      if (!texto) return
      // Sem leitura do outro lado, a palavra entra como texto comum.
      if (!abreDeVerdade(t)) { escrever(texto); return }
      out.push({ texto, id: idDe(t) })
      usadas.add(texto.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''))
    }

    // 1) Abertura prática. O pico muda o tom porque muda o quanto se sente.
    escrever(ePicoHoje(principal)
      ? tl('Hoje chega no ponto: o dia pede ', 'It peaks today: the day asks for ', 'Hoy llega al punto: el dia pide ', 'Oggi arriva al punto: la giornata chiede ')
      : tl('O dia pede ', 'The day asks for ', 'El dia pide ', 'La giornata chiede '))
    ancorar(a.sentido || tl('atenção', 'attention', 'atencion', 'attenzione'), principal)

    // 2) Onde pega — pelas áreas do próprio trânsito.
    const doTransito = areaLabelsForTransit(principal.transitPlanet, principal.natalPlanet, principal.house)
    if (doTransito.length) {
      const foco = doTransito.slice(0, 2)
      escrever(tl(
        ` — principalmente em ${foco.join(' e ')}.`,
        ` — mostly in ${foco.join(' and ')}.`,
        ` — sobre todo en ${foco.join(' y ')}.`,
        ` — soprattutto in ${foco.join(' e ')}.`,
      ))
    } else escrever('.')

    // 3) O resumo do status, com as duas pontas tocáveis.
    //
    // O status é a outra metade da leitura: diz onde a pessoa está hoje, não só
    // o que o céu faz. Antes ele só escolhia o foco quando o trânsito não dizia
    // nada — ficava invisível no texto. Agora aparece, e cada área leva ao
    // trânsito que de fato a move (mesmo mapa que o motor usa para pontuar).
    const porStatus = (areas || [])
      .map(([chave, v]) => ({
        chave: String(chave),
        pct: typeof v?.percentage === 'number' ? v.percentage : (typeof v?.status === 'number' ? v.status : NaN),
      }))
      .filter((x) => Number.isFinite(x.pct))
      .sort((x, y) => x.pct - y.pct)

    /** O trânsito mais forte que mexe nesta área, ou o principal. */
    const transitoDaArea = (chave: string): TransitoRico => {
      const alvo = ordenados.find((t) =>
        areasAffectedByTransit(t.transitPlanet, t.natalPlanet, t.house)
          .some((k) => String(k) === chave),
      )
      return alvo || principal
    }

    if (porStatus.length >= 2) {
      const pior = porStatus[0]
      const melhor = porStatus[porStatus.length - 1]
      escrever(tl(
        ' Nos seus números de hoje, quem mais pede cuidado é ',
        ' In your numbers today, the one asking for most care is ',
        ' En tus numeros de hoy, quien mas pide cuidado es ',
        ' Nei tuoi numeri di oggi, chi chiede piu cura e ',
      ))
      ancorar(getLifeAreaLabel(pior.chave), transitoDaArea(pior.chave))
      escrever(tl(', e onde há folga é ', ', and where there is room is ', ', y donde hay holgura es ', ', e dove c e respiro e '))
      ancorar(getLifeAreaLabel(melhor.chave), transitoDaArea(melhor.chave))
      escrever('.')
    }

    // 4) O contraponto, com a própria âncora.
    if (b && contraponto) {
      escrever(natureza === 'desafiador'
        ? tl(' Em compensação, há ', ' In return, there is ', ' En compensacion, hay ', ' In compenso, c e ')
        : tl(' Fique de olho em ', ' Keep an eye on ', ' Mantente atento a ', ' Tieni d occhio '))
      ancorar(b.sentido || tl('abertura', 'an opening', 'apertura', 'apertura'), contraponto)
      escrever(tl(' para apoiar o que pesa.', ' to lean on.', ' para apoyar lo que pesa.', ' su cui appoggiarsi.'))
    }

    // 5) O que fazer — sem isto a frase descreve e não serve para nada. Aqui o
    //    índice costuma render as âncoras mais úteis, porque é o trecho escrito
    //    em verbo.
    if (a.acao) escrever(` ${a.acao}`)
    else if (a.curto) escrever(` ${a.curto.replace(/\s+/g, ' ')}`)

    return out
  }, [transitos, areas, language])

  if (!pedacos?.length) return null

  return (
    <View style={s.caixa}>
      <Text style={s.rotulo}>{tl('O seu dia', 'Your day', 'Tu dia', 'La tua giornata')}</Text>
      <Text style={s.texto}>
        {pedacos.map((p, i) =>
          p.id && onAbrirTransito ? (
            <Text key={i} style={s.link} onPress={() => onAbrirTransito(p.id!)} suppressHighlighting>
              {p.texto}
            </Text>
          ) : (
            <Text key={i}>{p.texto}</Text>
          ),
        )}
      </Text>
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
  // Mesmo dourado pontilhado do glossário: a pessoa já aprendeu que isso abre algo.
  link: {
    color: '#FFD700',
    fontWeight: '600',
    textDecorationLine: 'underline',
    textDecorationStyle: 'dotted',
  },
})
