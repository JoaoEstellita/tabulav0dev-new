import React, { useMemo } from 'react'
import { View, Text, StyleSheet, Pressable, useWindowDimensions } from 'react-native'
import Svg, { Polygon, Line, Circle, Defs, RadialGradient, LinearGradient, Stop } from 'react-native-svg'
import { STATUS_THRESHOLDS } from '../constants/statusThresholds'
import {
  poligonoDosValores,
  pontoDoMovimento,
  anelDeReferencia,
  pontoNoEixo,
  rotuloDoEixo,
  fracaoDoValor,
  paraPoints,
  corDoValor,
  melhorGiro,
  type EixoDaRoda,
} from '../utils/geometriaDaRoda'

/**
 * A roda de status: as oito áreas da vida num octógono, como ficha de atributos.
 *
 * ⚠️ Escolha de PRODUTO, não de legibilidade. Para comparar magnitudes uma barra
 * lê melhor — num radar a área cresce com o QUADRADO do valor e o ângulo
 * distorce a comparação. O que o radar dá e a barra não é identidade: uma figura
 * que a pessoa reconhece como "eu hoje". Para valer sem enganar, três regras:
 *
 *  1. A ÁREA NUNCA CARREGA A MENSAGEM — o número vai escrito em cada eixo.
 *  2. A ORDEM DOS EIXOS É FIXA e nunca ordenada por valor: ordenar mudaria a
 *     silhueta todo dia e a figura de hoje deixaria de se comparar com a de
 *     ontem. (O GIRO do conjunto é outra coisa e é livre — ver `melhorGiro`.)
 *  3. A ESCALA É 0–100 FIXA. Auto-escalar pelo próprio mínimo e máximo ficaria
 *     mais dramático e seria mentira: quem tem tudo entre 28 e 49 veria a mesma
 *     figura de quem tem tudo entre 60 e 90.
 *
 * Medido no banco: a amplitude entre áreas tem mediana de 30 pontos e mínimo de
 * 8, e os valores vivem entre ~26 e ~77 — num eixo 0–100 cheio o polígono fica
 * quase circular. Daí os ANÉIS DE REFERÊNCIA nos limiares que o app já usa (35 e
 * 62): a leitura deixa de ser "que forma é essa" e vira "o que furou o anel".
 */

type Props = {
  eixos: EixoDaRoda[]
  /** Abre a leitura daquela área. Sem isto, a roda é só enfeite. */
  aoTocarEixo?: (chave: string) => void
  /**
   * Teto de largura, em pixels. Serve para a MESMA roda caber em contextos
   * diferentes: na Home ela é o assunto da tela e usa a largura toda; dentro
   * do card de um membro do grupo, ela divide espaço com nome, foto, sinastria
   * e as áreas dos outros, e um pôster ali empurra todo o resto para baixo.
   *
   * ⚠️ Mexe no RAIO, não numa escala: o raio sai de uma busca que depende da
   * largura disponível (ver `melhorGiro`), então encolher a caixa recalcula os
   * rótulos em vez de espremer um desenho pronto e deixar o texto ilegível.
   */
  larguraMaxima?: number
}

// ⚠️ As MESMAS cores dos cards de área. Uma terceira régua de cor na mesma tela
// faria o verde da roda e o verde do card parecerem coisas diferentes.
//
// O validador de paleta mediu verde↔âmbar em ΔE 8.9 sob protanopia: passa no
// piso, mas por pouco. Daí o número em cada eixo — cor nunca anda sozinha.
const CORES = {
  critico: '#EF4444',
  moderado: '#F59E0B',
  bom: '#10B981',
  vazio: '#4B5563',
} as const

const TRILHO = '#232B3D'
const TINTA = '#8892a4'
const TINTA_FORTE = '#F2F5FA'
const ACENTO = '#9BB4E8'
/**
 * A cor da SOMBRA DO MOVIMENTO.
 *
 * ⚠️ Precisa ser outro matiz, não o azul do polígono com opacidade — duas
 * formas da mesma cor, uma dentro da outra, leem como uma só. E não pode ser
 * vermelho, âmbar nem verde: esses três já significam faixa de status nos
 * chips, e repeti-los aqui faria a sombra parecer um julgamento da área.
 * Violeta está livre no desenho inteiro.
 */
const MOVIMENTO = '#C4B5FD'

// ⚠️ 12, não 10. Em 10 o nome da área ficava miúdo demais para ler de relance
// num celular — era a queixa. Subir a fonte encolhe o raio disponível (o chip
// cresce e `melhorGiro` tem menos espaço), e isso é aceitável: o número e o
// nome precisam ser legíveis antes de a silhueta ser grande.
const FONTE_ROTULO = 12
/**
 * ⚠️ Medida APROXIMADA do texto, porque em React Native não dá para medir antes
 * de renderizar. O fator 0.55 da largura por caractere é conservador para a
 * fonte do sistema; errar para mais só encolhe um pouco a roda, enquanto errar
 * para menos cortaria o nome — então o erro aceitável tem lado.
 */
/**
 * ⚠️ O PADDING DO CHIP ENTRA NA MEDIDA.
 *
 * Cada área é um botão, e o que a faz parecer botão é o chip em volta. Se a
 * busca do raio medisse só o texto, os chips estourariam para fora do desenho —
 * o mesmo erro que já custou duas versões deste componente.
 *
 * A folga caiu de 12 para 6 junto: o padding do chip cumpre o papel de afastar
 * o rótulo da borda que a folga cumpria antes. Medido, o par custa pouco —
 * diâmetro de 224 para 212 numa tela de 390pt.
 */
const PADDING_CHIP = 6
/**
 * ⚠️ O fator era 0.55 e CORTAVA "Amor" — virava "Am…".
 *
 * A média por caractere subestima palavra curta com letra larga: "Amor" tem A
 * maiúsculo e m, bem acima da média. Como a largura do chip vinha daqui, o chip
 * nascia estreito demais e o texto era elidido.
 *
 * Duas defesas agora: o fator subiu para 0.62, folgado para o pior caso, e o
 * chip passou a se DIMENSIONAR PELO CONTEÚDO em vez de receber largura fixa —
 * então esta medida só governa o espaçamento, e uma estimativa um pouco errada
 * não corta mais nenhum nome.
 */
const medirRotulo = (texto: string) => texto.length * FONTE_ROTULO * 0.62 + 2 + PADDING_CHIP * 2
const FOLGA_ROTULO = 6

/**
 * Quanto sobra acima e abaixo do polígono, para o chip do eixo do topo e o do
 * eixo da base caberem inteiros.
 *
 * A conta: o chip do eixo do topo tem o topo em `centro.y − raio − FOLGA − 22`
 * (22 é meia altura do chip), então a margem precisa ser ao menos 28. Fica 38,
 * com dez pixels de respiro — mais que isso é o vão que esta conta existe para
 * eliminar.
 */
const MARGEM_VERTICAL = 38

export default function RodaDeStatus({ eixos, aoTocarEixo, larguraMaxima }: Props) {
  const { width } = useWindowDimensions()

  // ⚠️ QUEM LIMITA O TAMANHO DA RODA É A LARGURA DOS CHIPS, não a tela.
  //
  // O raio sai de `melhorGiro`, que só aceita um raio se o chip de cada eixo
  // couber entre o ponto dele e a borda. Num eixo lateral isso vira
  // `raio ≤ lado/2 − largura_do_chip`: com "Comunicação" em 12px (~96px de
  // chip) e `lado` travado em 360, o raio ficava em 86 e sobrava meia tela
  // vazia em volta de um octógono pequeno.
  //
  // Cada pixel de largura vira quase um pixel de raio, então o teto subiu e a
  // margem lateral caiu. O teto continua existindo para a roda não virar
  // pôster num tablet.
  const lado = Math.max(240, Math.min(width - 20, larguraMaxima ?? 460))
  const total = eixos.length

  const limiares = {
    criticalBelow: STATUS_THRESHOLDS.criticalBelow,
    positiveAbove: STATUS_THRESHOLDS.positiveAbove,
  }

  /**
   * ⚠️ O giro e o raio saem de uma BUSCA, não de números escolhidos a dedo.
   *
   * Com os nomes por extenso, "Espiritualidade" caía na lateral esquerda — a
   * posição mais apertada — e sozinha limitava o diâmetro a 140px; numa tela de
   * 320pt não cabia nada. Girando o conjunto, os nomes longos vão para topo e
   * base, onde o rótulo centraliza e dispõe da largura toda, e o diâmetro vai a
   * 224px. Como os rótulos mudam de tamanho por idioma, isso é calculado em
   * runtime em vez de ficar fixo.
   */
  const { giro, raio } = useMemo(
    () => melhorGiro(eixos.map((e) => e.rotulo), lado, medirRotulo, FOLGA_ROTULO),
    [eixos, lado],
  )

  /**
   * ⚠️ A CAIXA NÃO É QUADRADA, e é isso que tira o vão de cima e de baixo.
   *
   * `melhorGiro` raciocina num quadrado de `lado` porque o aperto é
   * horizontal — chip lateral precisa de largura. Na vertical o chip custa só
   * a própria altura, que é umas duas vezes menor. Mantendo a caixa quadrada,
   * tudo que a largura ganhava virava espaço morto em cima e embaixo.
   *
   * A geometria horizontal continua intacta (`centro.x` segue `lado / 2`, que
   * é o que a busca assumiu); só a altura encolhe para o que de fato se usa.
   */
  const altura = Math.round(2 * (raio + MARGEM_VERTICAL))
  const centro = { x: lado / 2, y: altura / 2 }

  const geo = useMemo(() => {
    if (!total || raio <= 0) return null
    return {
      valores: paraPoints(poligonoDosValores(eixos, raio, centro, giro)),
      borda: paraPoints(anelDeReferencia(1, total, raio, centro, giro)),
      critico: paraPoints(anelDeReferencia(limiares.criticalBelow / 100, total, raio, centro, giro)),
      // Cada eixo vira um RAIO: do centro ao valor, com a parte que se mexe
      // acesa por cima. Substitui o polígono de sombra — ver `pontoDoMovimento`.
      raios: eixos.map((e, i) => ({
        chave: e.chave,
        fim: pontoNoEixo(i, total, fracaoDoValor(e.valor), raio, centro, giro),
        movimento: pontoDoMovimento(e, i, total, raio, centro, giro),
        temMovimento: e.movimento !== null && e.movimento !== undefined,
      })),
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eixos, raio, giro, lado, total, limiares.criticalBelow, limiares.positiveAbove])

  // Sem eixo não há roda — e um octógono vazio na tela parece defeito.
  if (!total || !geo) return null

  return (
    <View style={s.bloco}>
      <View style={{ width: lado, height: altura, alignSelf: 'center' }}>
        <Svg width={lado} height={altura}>
          <Defs>
            {/* Brilho suave no miolo: dá profundidade sem desenhar nada por
                cima dos dados. */}
            <RadialGradient id="miolo" cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor={ACENTO} stopOpacity={0.14} />
              <Stop offset="100%" stopColor={ACENTO} stopOpacity={0} />
            </RadialGradient>
            {/* O preenchimento do polígono desce de cima para baixo: a figura
                ganha volume e deixa de parecer um adesivo chapado. */}
            <LinearGradient id="area" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="#A9C2F2" stopOpacity={0.42} />
              <Stop offset="100%" stopColor="#6E8BC4" stopOpacity={0.16} />
            </LinearGradient>
          </Defs>

          <Polygon points={geo.borda} fill="url(#miolo)" />

          {/* Raios: dão a direção de cada eixo sem competir com o polígono. */}
          {eixos.map((e, i) => {
            const p = pontoNoEixo(i, total, 1, raio, centro, giro)
            return (
              <Line
                key={`raio-${e.chave}`}
                x1={centro.x}
                y1={centro.y}
                x2={p.x}
                y2={p.y}
                stroke={TRILHO}
                strokeWidth={1}
                strokeOpacity={0.55}
              />
            )
          })}

          {/* ⚠️ O CRÍTICO É UMA ZONA, não um traço.
              Era um octógono tracejado em vermelho fraco — e linha não diz de
              que lado fica o ruim. Como mancha, a leitura dispensa legenda: o
              que AFUNDA no vermelho está mal, e isso se vê de longe.

              ⚠️ Os anéis são POLÍGONOS, não círculos: num radar o valor mora no
              vértice, e um anel circular passaria por dentro das arestas — um
              valor que encosta no limiar pareceria estar abaixo dele.

              ⚠️ SAÍRAM três teias (25/50/75) e o anel do BOM. Eram seis anéis
              concêntricos e nenhum dizia um número — a escala quem dá é o
              número no chip. E o anel do bom quase nunca era cruzado: medido em
              60 pessoas, só 7% dos valores passam de 62, contra 28% abaixo de
              35. Uma linha que ninguém toca não ensina nada, só polui. */}
          <Polygon points={geo.critico} fill={CORES.critico} fillOpacity={0.13} stroke="none" />
          <Polygon
            points={geo.critico}
            fill="none"
            stroke={CORES.critico}
            strokeWidth={1}
            strokeOpacity={0.5}
          />
          <Polygon points={geo.borda} fill="none" stroke={TRILHO} strokeWidth={1} />

          {/* O polígono dos valores: ele dá a silhueta; quem informa é o número.
              O traço vai em DUAS camadas — uma larga e quase transparente por
              baixo faz as vezes de brilho, que o SVG do React Native não tem
              como sombra. */}
          {/* Brilho do polígono: um traço largo e quase transparente por baixo
              faz as vezes de sombra, que o SVG do React Native não tem. */}
          <Polygon
            points={geo.valores}
            fill="none"
            stroke={ACENTO}
            strokeWidth={7}
            strokeOpacity={0.14}
            strokeLinejoin="round"
          />
          {/* O preenchimento do polígono, SEM traço — o contorno vem por
              último, depois da sombra, para fechar o desenho por cima. */}
          <Polygon points={geo.valores} fill="url(#area)" stroke="none" />

          {/* ⚠️ O MOVIMENTO VIRA RAIO ACESO, não uma segunda silhueta.
              Como polígono dentro do polígono, ele lia como DOIS gráficos — o
              olho comparava as duas formas em vez de ler uma. E antes disso
              nem aparecia: desenhado antes do preenchimento, o `fill` do
              principal pintava por cima, e o gráfico carregava uma informação
              com zero pixel para mostrá-la.

              Agora cada eixo tem um raio do centro ao valor, e o trecho que se
              MEXE vai aceso por cima dele. Duas áreas com a mesma nota podem
              ser situações opostas — uma acaba na sexta, a outra está ali há
              dois anos — e agora isso é comprimento de linha, não forma nova.

              ⚠️ A fonte do número é `movementScore`, que o motor já calcula
              por área. Houve uma versão que derivava movimento da duração dos
              trânsitos aqui no app: reinvenção de algo que já existia, e com
              regra diferente da do motor. */}
          {geo.raios.map((r) => (
            <React.Fragment key={`raio-${r.chave}`}>
              <Line
                x1={centro.x}
                y1={centro.y}
                x2={r.fim.x}
                y2={r.fim.y}
                stroke={ACENTO}
                strokeWidth={1}
                strokeOpacity={0.3}
              />
              {r.temMovimento ? (
                <Line
                  x1={centro.x}
                  y1={centro.y}
                  x2={r.movimento.x}
                  y2={r.movimento.y}
                  stroke={MOVIMENTO}
                  strokeWidth={3}
                  strokeOpacity={0.85}
                  strokeLinecap="round"
                />
              ) : null}
            </React.Fragment>
          ))}

          {/* O contorno do polígono principal fecha por cima de tudo. */}
          <Polygon
            points={geo.valores}
            fill="none"
            stroke={ACENTO}
            strokeWidth={2.5}
            strokeLinejoin="round"
          />

          {eixos.map((e, i) => {
            const p = pontoNoEixo(i, total, fracaoDoValor(e.valor), raio, centro, giro)
            const cor = corDoValor(e.valor, limiares, CORES)
            return (
              <React.Fragment key={`ponto-${e.chave}`}>
                {/* ⚠️ DOIS círculos, não quatro. Eram halo, anel escuro, disco e
                    brilho branco — trinta e dois círculos na tela para marcar
                    oito vértices, num desenho que já tinha camadas demais. O
                    anel escuro fica porque sem ele o ponto some dentro do
                    próprio traço do polígono; o resto era enfeite.

                    A COR é a faixa do valor, e é o único lugar do desenho onde
                    vermelho/âmbar/verde aparecem além da zona crítica. */}
                <Circle cx={p.x} cy={p.y} r={6} fill="#141731" />
                <Circle cx={p.x} cy={p.y} r={4.5} fill={cor} />
              </React.Fragment>
            )
          })}
        </Svg>

        {/* Nome + número + alvo de toque na mesma caixa.
            ⚠️ Juntos de propósito: o ponto do vértice tem 4px e ninguém acerta
            nele. Com o nome sendo o alvo, o toque fica do tamanho de uma
            palavra — e fica óbvio o que é tocável. */}
        {eixos.map((e, i) => {
          const r = rotuloDoEixo(i, total, raio, centro, FOLGA_ROTULO, giro)
          /**
           * ⚠️ Sem `width`: o chip se ajusta ao próprio texto.
           *
           * Antes ele recebia a largura ESTIMADA, e quando a estimativa errava
           * para menos o nome era cortado — foi o que aconteceu com "Amor".
           * Agora a caixa é presa pelo lado que importa e solta do outro, então
           * ela cresce o quanto o texto precisar e NUNCA passa da borda:
           *
           *   direita  left: x,  right: 0        cresce para a direita, até a borda
           *   esquerda left: 0,  right: lado-x   cresce para a esquerda, até a borda
           *   topo/base left: 0, right: 0        centraliza, que é onde o eixo está
           */
          const prende =
            r.ancora === 'start'
              ? { left: r.x, right: 0, alignItems: 'flex-start' as const }
              : r.ancora === 'end'
              ? { left: 0, right: lado - r.x, alignItems: 'flex-end' as const }
              : { left: 0, right: 0, alignItems: 'center' as const }
          // Dentro do chip o texto sempre centraliza; quem muda com o lado da
          // roda e a POSICAO do chip, nao o alinhamento do conteudo.
          const alinhamento = 'center' as const
          const temValor = e.valor !== null && e.valor !== undefined
          const cor = corDoValor(e.valor, limiares, CORES)
          // ⚠️ O chip É o sinal de que dá para tocar. Sem ele, oito textos
          // soltos ao redor de um desenho não se parecem com botões, e a leitura
          // completa de cada área ficava escondida atrás de um toque que ninguém
          // adivinha. A borda leva a COR DA FAIXA, então o chip também repete o
          // status sem gastar mais espaço.
          // ⚠️ O deslocamento acompanha a altura do chip: com a fonte maior o
          // chip cresceu, e manter -19 o deixaria desalinhado do ponto no eixo.
          const caixa = { position: 'absolute' as const, top: r.y - 22, ...prende }
          const estilo = (pressed: boolean) => [
            s.chip,
            {
              borderColor: pressed ? cor : `${cor}55`,
              backgroundColor: pressed ? 'rgba(155,180,232,0.20)' : 'rgba(18,22,44,0.72)',
            },
          ]
          const conteudo = (
            <>
              <Text style={[s.rotulo, { textAlign: alinhamento }]} numberOfLines={1}>
                {e.rotulo}
              </Text>
              {/* ⚠️ O NÚMERO, sempre. É ele que faz a roda não depender nem da
                  área (que engana) nem da cor (verde e âmbar quase se encostam
                  sob protanopia). */}
              {/* O número na COR DA FAIXA: o numeral continua sendo o canal que
                  não depende de cor, então pintá-lo não tira acessibilidade —
                  e amarra o chip ao ponto correspondente na roda. */}
              <Text style={[s.valor, { color: temValor ? cor : CORES.vazio }]}>
                {temValor ? Math.round(Number(e.valor)) : '—'}
              </Text>
            </>
          )

          // ⚠️ `View` NÃO aceita `style` como função — só `Pressable` aceita.
          // Trocar o componente por uma variável `any` e passar a função nos dois
          // casos compila (o `any` engole) e quebra em runtime quando a roda é
          // montada sem `aoTocarEixo`.
          if (!aoTocarEixo) {
            return (
              <View key={`rotulo-${e.chave}`} style={caixa}>
                <View style={estilo(false)}>{conteudo}</View>
              </View>
            )
          }

          return (
            <View key={`rotulo-${e.chave}`} style={caixa}>
              <Pressable
                onPress={() => aoTocarEixo(e.chave)}
                accessibilityRole="button"
                accessibilityLabel={`${e.rotulo}: ${temValor ? Math.round(Number(e.valor)) : 'sem dado'}`}
                android_ripple={{ color: 'rgba(155,180,232,0.25)', borderless: false }}
                hitSlop={8}
                style={({ pressed }) => estilo(pressed)}
              >
                {conteudo}
              </Pressable>
            </View>
          )
        })}
      </View>
    </View>
  )
}

const s = StyleSheet.create({
  // ⚠️ SEM moldura: a roda assenta direto no fundo do app, sem card em volta.
  // Por isso nada de `backgroundColor` nem `borderWidth` aqui — qualquer um dos
  // dois recortaria um retangulo sobre o degrade da tela.
  bloco: {
    paddingVertical: 8,
    marginBottom: 4,
  },
  chip: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: PADDING_CHIP + 2,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  rotulo: { fontSize: FONTE_ROTULO, color: TINTA, lineHeight: 15 },
  valor: { fontSize: 18, fontWeight: '800', lineHeight: 21 },
})
