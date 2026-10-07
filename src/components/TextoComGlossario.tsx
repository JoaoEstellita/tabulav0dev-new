import React, { useMemo, useState } from 'react'
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native'
import { useAppLanguage } from '../hooks/useAppLanguage'
import { useModoLeitura } from '../hooks/useModoLeitura'
import {
  GLOSSARIO,
  TERMOS_ORDENADOS,
  chaveTermo,
  type IdiomaGlossario,
} from '../data/glossarioAstrologico'

/**
 * Texto que transforma termo técnico em palavra tocável.
 *
 * "Quadratura" aparece 142 vezes na interface, "sextil" 135. Para quem nunca
 * estudou astrologia cada uma é um ponto de desistência; tocando, vira uma frase
 * de duas linhas que explica o que a pessoa SENTE — e o termo deixa de ser
 * obstáculo e vira aprendizado.
 *
 * Só destaca o que está no glossário, e só a primeira ocorrência de cada termo
 * no mesmo bloco: sublinhar a mesma palavra cinco vezes no parágrafo vira ruído
 * visual e cansa mais do que ajuda.
 */

interface Props {
  children: string
  style?: any
  /** Desliga o realce (texto puro) sem precisar trocar de componente. */
  simples?: boolean
  selectable?: boolean
  numberOfLines?: number
}

type Pedaco = { texto: string; termo?: string }

/** No modo explicado o rótulo vira a palavra comum; o termo técnico aparece no toque. */
function rotulo(bruto: string, chave: string, explicado: boolean, idioma: IdiomaGlossario): string {
  if (!explicado) return bruto
  const comum = GLOSSARIO[chave]?.simples?.[idioma]
  if (!comum) return bruto
  // Preserva a caixa: "Quadratura" no início da frase não vira "atrito".
  return bruto[0] === bruto[0]?.toUpperCase() ? comum.charAt(0).toUpperCase() + comum.slice(1) : comum
}

/** Quebra o texto em pedaços, marcando a 1ª ocorrência de cada termo do glossário. */
function fatiar(texto: string): Pedaco[] {
  const alvos = TERMOS_ORDENADOS.filter(Boolean)
  if (!alvos.length) return [{ texto }]

  // Uma alternância só, do termo mais longo para o mais curto, para "meio do céu"
  // ganhar de "céu". \p{...} não existe no Hermes, então as bordas são manuais.
  const padrao = new RegExp(`(^|[^\\wÀ-ÿ])(${alvos.map(escaparRegex).join('|')})(?=$|[^\\wÀ-ÿ])`, 'gi')

  const saida: Pedaco[] = []
  const jaUsados = new Set<string>()
  let ultimo = 0

  for (const m of texto.matchAll(padrao)) {
    const inicioPalavra = (m.index ?? 0) + m[1].length
    const bruto = m[2]
    const chave = chaveTermo(bruto)
    if (jaUsados.has(chave) || !GLOSSARIO[chave]) continue
    jaUsados.add(chave)

    if (inicioPalavra > ultimo) saida.push({ texto: texto.slice(ultimo, inicioPalavra) })
    saida.push({ texto: bruto, termo: chave })
    ultimo = inicioPalavra + bruto.length
  }

  if (ultimo < texto.length) saida.push({ texto: texto.slice(ultimo) })
  return saida.length ? saida : [{ texto }]
}

function escaparRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export default function TextoComGlossario({ children, style, simples, selectable, numberOfLines }: Props) {
  const { language } = useAppLanguage()
  const { explicado } = useModoLeitura()
  const idioma = (language as IdiomaGlossario) || 'pt-BR'
  const [aberto, setAberto] = useState<string | null>(null)

  const pedacos = useMemo(
    () => (simples || typeof children !== 'string' ? null : fatiar(children)),
    [children, simples],
  )

  if (!pedacos || pedacos.length === 1) {
    return <Text style={style} selectable={selectable} numberOfLines={numberOfLines}>{children}</Text>
  }

  const entrada = aberto ? GLOSSARIO[aberto] : null
  const tl = (pt: string, en: string, es: string, it: string) =>
    idioma === 'en-US' ? en : idioma === 'es-ES' ? es : idioma === 'it-IT' ? it : pt

  return (
    <>
      <Text style={style} selectable={selectable} numberOfLines={numberOfLines}>
        {pedacos.map((p, i) =>
          p.termo ? (
            <Text key={i} style={s.termo} onPress={() => setAberto(p.termo!)} suppressHighlighting>
              {rotulo(p.texto, p.termo, explicado, idioma)}
            </Text>
          ) : (
            <Text key={i}>{p.texto}</Text>
          ),
        )}
      </Text>

      <Modal visible={!!entrada} transparent animationType="fade" onRequestClose={() => setAberto(null)}>
        <Pressable style={s.fundo} onPress={() => setAberto(null)}>
          <Pressable style={s.card} onPress={(e) => e.stopPropagation()}>
            <Text style={s.cardTermo}>
              {aberto ? aberto.charAt(0).toUpperCase() + aberto.slice(1) : ''}
            </Text>
            <Text style={s.cardTexto}>
              {entrada ? entrada.explicacao[idioma] || entrada.explicacao['pt-BR'] : ''}
            </Text>
            {/* Em modo explicado a pessoa leu a palavra comum; dizer o nome técnico
                aqui ensina o vocabulário em vez de escondê-lo dela para sempre. */}
            {explicado && aberto && GLOSSARIO[aberto]?.simples ? (
              <Text style={s.cardTecnico}>
                {tl('Nome técnico: ', 'Technical name: ', 'Nombre tecnico: ', 'Nome tecnico: ')}
                {aberto.charAt(0).toUpperCase() + aberto.slice(1)}
              </Text>
            ) : null}
            <Text style={s.fechar} onPress={() => setAberto(null)}>
              {tl('Entendi', 'Got it', 'Entendido', 'Capito')}
            </Text>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  )
}

const s = StyleSheet.create({
  // Pontilhado em vez de sublinhado cheio: sinaliza "tem mais aqui" sem gritar
  // nem transformar o parágrafo numa sopa de links.
  termo: {
    color: '#FFD700',
    textDecorationLine: 'underline',
    textDecorationStyle: 'dotted',
  },
  fundo: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#161a22',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#2a3142',
    padding: 18,
  },
  cardTermo: { color: '#FFD700', fontSize: 17.5, fontWeight: '700', marginBottom: 8 },
  cardTexto: { color: '#e2e6f0', fontSize: 16, lineHeight: 24 },
  cardTecnico: { color: '#8d94a8', fontSize: 12.5, marginTop: 10, fontStyle: 'italic' },
  fechar: { color: '#FFD700', fontSize: 14, fontWeight: '700', textAlign: 'right', marginTop: 16 },
})
