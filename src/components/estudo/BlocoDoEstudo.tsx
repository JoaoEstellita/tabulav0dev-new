import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import TextoComGlossario from '../TextoComGlossario'
import FiguraDoEstudo from './FiguraDoEstudo'
import type { Bloco, IdiomaEstudo } from '../../data/estudo'

/**
 * Um bloco de conteúdo do Estudo.
 *
 * ⚠️ CADA TIPO TEM TRATAMENTO PRÓPRIO, e é exatamente por isso que o conteúdo
 * é dado tipado em vez de markdown: uma `sincronicidade` precisa do ano em
 * destaque e de duas camadas separadas (o fato e a leitura), um `cuidado`
 * precisa ser discreto sem sumir. Markdown renderizaria tudo igual.
 */
export default function BlocoDoEstudo({ bloco, idioma }: { bloco: Bloco; idioma: IdiomaEstudo }) {
  // ⚠️ INERTE NA FASE 1. O gancho da personalização existe no conteúdo desde
  // já para que a fase 2 só precise preenchê-lo — mas enquanto não há mapa
  // ligado, ele não pode desenhar nem um espaço: um buraco visual faria a
  // fase 2 ter de "consertar" em vez de só completar.
  if (bloco.tipo === 'ganchoPessoal') return null

  // ⚠️ ANTES DE `const texto = bloco.texto`: a figura nao tem `texto`, tem
  // `descricao` (o alternativo do leitor de tela).
  if (bloco.tipo === 'figura') {
    return <FiguraDoEstudo chave={bloco.chave} foco={bloco.foco} descricao={bloco.descricao[idioma]} idioma={idioma} />
  }

  if (bloco.tipo === 'sincronicidade') {
    return (
      <View style={s.sinc}>
        <Text style={s.sincAno}>{bloco.ano}</Text>
        <Text style={s.sincFato}>{bloco.descoberta[idioma]}</Text>
        <Text style={s.sincFato}>{bloco.noMundo[idioma]}</Text>
        {/* ⚠️ A LEITURA VEM SEPARADA POR UMA LINHA. As duas acima são
            verificáveis; esta é interpretação da tradição. Emendá-las
            apresentaria a terceira como demonstrada — e é justamente a
            credibilidade que esta área existe para construir. */}
        <View style={s.sincDivisor} />
        <Text style={s.sincLeitura}>{bloco.leitura[idioma]}</Text>
      </View>
    )
  }

  const texto = bloco.texto[idioma]

  if (bloco.tipo === 'destaque') return <Text style={s.destaque}>{texto}</Text>
  if (bloco.tipo === 'cuidado') return <Text style={s.cuidado}>{texto}</Text>

  if (bloco.tipo === 'exemplo') {
    return (
      <View style={s.exemplo}>
        <TextoComGlossario style={s.exemploTexto} simples>{texto}</TextoComGlossario>
      </View>
    )
  }

  // ⚠️ `simples` DESLIGA a troca do modo Explicado. Fora do Estudo ele troca
  // "quadratura" pela palavra comum; aqui o termo técnico É o assunto da
  // lição, e trocá-lo esvaziaria o que se foi aprender. O toque no termo
  // continua abrindo a explicação.
  if (bloco.tipo === 'paragrafo') {
    return <TextoComGlossario style={s.paragrafo} simples>{texto}</TextoComGlossario>
  }

  // ⚠️ SEM RAMO PADRÃO, de propósito. Na primeira versão o parágrafo era o
  // `else` de tudo — e aí um tipo de bloco NOVO viraria parágrafo em silêncio,
  // sem erro e sem aviso, que é o padrão de fallback mudo que este projeto já
  // pagou caro. O `never` abaixo faz o TypeScript recusar a compilação se
  // alguém acrescentar um tipo e esquecer de tratá-lo aqui.
  const naoTratado: never = bloco
  void naoTratado
  return null
}

const s = StyleSheet.create({
  paragrafo: { color: '#D7DCE8', fontSize: 15, lineHeight: 23, marginBottom: 14 },
  destaque: { color: '#FFD700', fontSize: 16, fontWeight: '700', lineHeight: 24, marginBottom: 16 },
  cuidado: { color: '#9AA3BA', fontSize: 13, lineHeight: 19, fontStyle: 'italic', marginBottom: 14 },
  exemplo: {
    borderLeftWidth: 2,
    borderLeftColor: 'rgba(255,215,0,0.4)',
    paddingLeft: 12,
    marginBottom: 14,
  },
  exemploTexto: { color: '#C7D2E8', fontSize: 14, lineHeight: 21 },
  sinc: {
    backgroundColor: 'rgba(167,139,250,0.10)',
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
  },
  sincAno: { color: '#C4B5FD', fontSize: 22, fontWeight: '800', marginBottom: 6 },
  sincFato: { color: '#D7DCE8', fontSize: 14, lineHeight: 21, marginBottom: 4 },
  sincDivisor: { height: 1, backgroundColor: 'rgba(255,255,255,0.12)', marginVertical: 10 },
  sincLeitura: { color: '#C7D2E8', fontSize: 14, lineHeight: 21, fontStyle: 'italic' },
})
