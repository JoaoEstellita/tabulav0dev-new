import React from 'react'
import { StyleSheet, View } from 'react-native'
import Svg, { Circle, Defs, G, Line, LinearGradient, Path, Polygon, Stop, Text as SvgText } from 'react-native-svg'
import type { ChaveDaFigura, IdiomaEstudo } from '../../data/estudo'

/**
 * OS DIAGRAMAS DO ESTUDO — desenhados, não carregados.
 *
 * ⚠️ SVG EM CÓDIGO, NÃO PNG. Os assets do app já somam 9 MB e cada OTA
 * carrega o que mudou: dez ilustrações em densidade de retina engordariam
 * todo update para sempre. SVG pesa alguns KB de texto, fica nítido em
 * qualquer tela, acompanha o tema e — o que imagem nenhuma faz — troca de
 * idioma junto com a lição.
 *
 * ⚠️ CADA FIGURA MOSTRA UM MECANISMO QUE O TEXTO AFIRMA. A ladeira contra o
 * trilho não é enfeite: é a tese da lição 2 numa olhada. Desenho que não
 * ensina nada só disputa atenção com o parágrafo ao lado, e por isso aqui não
 * entra nenhum.
 */

const OURO = '#FFD700'
const ROXO = '#C4B5FD'
const AGUA = '#4ECDC4'
const CLARO = '#D7DCE8'
const FRACO = '#6B7490'
const LINHA = 'rgba(255,255,255,0.18)'

type Tl = (pt: string, en: string, es: string, it: string) => string

/** Rótulo dentro do SVG: pequeno, nunca competindo com o texto da lição. */
function Rotulo({ x, y, children, cor = FRACO, tam = 9, meio = true, peso = '600' }: {
  x: number; y: number; children: string; cor?: string; tam?: number; meio?: boolean; peso?: string
}) {
  return (
    <SvgText x={x} y={y} fill={cor} fontSize={tam} fontWeight={peso} textAnchor={meio ? 'middle' : 'start'}>
      {children}
    </SvgText>
  )
}

/** Um bonequinho. Simples de propósito: o assunto é o chão, não ele. */
function Pessoa({ x, y, cor = CLARO }: { x: number; y: number; cor?: string }) {
  return (
    <G>
      <Circle cx={x} cy={y - 9} r={3.2} fill={cor} />
      <Line x1={x} y1={y - 6} x2={x} y2={y - 1} stroke={cor} strokeWidth={1.6} strokeLinecap="round" />
      <Line x1={x - 2.6} y1={y + 3} x2={x} y2={y - 1} stroke={cor} strokeWidth={1.6} strokeLinecap="round" />
      <Line x1={x + 2.6} y1={y + 3} x2={x} y2={y - 1} stroke={cor} strokeWidth={1.6} strokeLinecap="round" />
    </G>
  )
}

/** Seta reta, com ponta. */
function Seta({ x1, y1, x2, y2, cor, tracejada }: { x1: number; y1: number; x2: number; y2: number; cor: string; tracejada?: boolean }) {
  const ang = Math.atan2(y2 - y1, x2 - x1)
  const p = (d: number, giro: number) => `${x2 - d * Math.cos(ang - giro)},${y2 - d * Math.sin(ang - giro)}`
  return (
    <G>
      <Line
        x1={x1} y1={y1} x2={x2} y2={y2} stroke={cor} strokeWidth={1.4}
        strokeLinecap="round" strokeDasharray={tracejada ? '3 3' : undefined}
      />
      <Polygon points={`${x2},${y2} ${p(5, 0.42)} ${p(5, -0.42)}`} fill={cor} />
    </G>
  )
}

// ─────────────────────────────────────────────────────────────────────────────

/**
 * LADEIRA × TRILHO — a tese da lição 2.
 *
 * ⚠️ O QUE A FIGURA TEM DE PROVAR É A DIFERENÇA ENTRE AS DUAS, não o declive.
 * Por isso a inclinação é a MESMA nos dois lados: o peso existe igual; o que
 * muda é haver ou não escolha de direção. Desenhar o trilho plano diria que
 * destino é leve, que é o oposto do que a lição afirma.
 */
function LadeiraOuTrilho({ tl }: { tl: Tl }) {
  return (
    <Svg width="100%" height={132} viewBox="0 0 300 132">
      <Line x1={150} y1={16} x2={150} y2={120} stroke={LINHA} strokeWidth={1} strokeDasharray="4 4" />

      {/* Ladeira: o peso existe, e ainda assim há para onde ir. */}
      <Rotulo x={72} y={16} cor={OURO} tam={10.5}>{tl('LADEIRA', 'SLOPE', 'CUESTA', 'SALITA')}</Rotulo>
      <Line x1={18} y1={96} x2={126} y2={52} stroke={OURO} strokeWidth={2} strokeLinecap="round" />
      <Pessoa x={66} y={76} cor={OURO} />
      <Seta x1={74} y1={66} x2={104} y2={52} cor={CLARO} />
      <Seta x1={74} y1={70} x2={106} y2={74} cor={CLARO} tracejada />
      <Seta x1={60} y1={70} x2={32} y2={66} cor={CLARO} tracejada />
      <Rotulo x={72} y={117} cor={CLARO} tam={9.5}>{tl('sente o peso, e escolhe', 'feels the weight, and chooses', 'siente el peso, y elige', 'sente il peso, e sceglie')}</Rotulo>

      {/* Trilho: mesma inclinação, uma direção só. */}
      <Rotulo x={226} y={16} cor={FRACO} tam={10.5}>{tl('TRILHO', 'RAIL', 'RIEL', 'BINARIO')}</Rotulo>
      <Line x1={174} y1={99} x2={282} y2={55} stroke={FRACO} strokeWidth={1.6} strokeLinecap="round" />
      <Line x1={174} y1={92} x2={282} y2={48} stroke={FRACO} strokeWidth={1.6} strokeLinecap="round" />
      {[0, 1, 2, 3, 4].map((i) => (
        <Line
          key={i}
          x1={178 + i * 26} y1={97.5 - i * 10.6} x2={178 + i * 26} y2={90.5 - i * 10.6}
          stroke={FRACO} strokeWidth={1}
        />
      ))}
      <Pessoa x={222} y={76} cor={FRACO} />
      <Seta x1={230} y1={68} x2={262} y2={55} cor={FRACO} />
      <Rotulo x={226} y={117} cor={FRACO} tam={9.5}>{tl('uma direção só', 'one direction only', 'una sola direccion', 'una sola direzione')}</Rotulo>
    </Svg>
  )
}

/**
 * TERRENO E VIAJANTE — a lição 3 numa olhada.
 *
 * ⚠️ O VIAJANTE FICA FORA DO RELEVO, de propósito: a lição diz que o mapa
 * descreve o terreno e NÃO descreve quem atravessa. Desenhá-lo como parte da
 * linha do terreno afirmaria graficamente o contrário do texto.
 */
function TerrenoEViajante({ tl }: { tl: Tl }) {
  const terreno = 'M 14 96 L 54 96 L 92 56 L 124 92 L 166 92 L 196 64 L 228 100 L 286 100'
  return (
    <Svg width="100%" height={126} viewBox="0 0 300 126">
      <Defs>
        <LinearGradient id="chao" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={ROXO} stopOpacity="0.22" />
          <Stop offset="1" stopColor={ROXO} stopOpacity="0.02" />
        </LinearGradient>
      </Defs>
      <Path d={`${terreno} L 286 112 L 14 112 Z`} fill="url(#chao)" />
      <Path d={terreno} stroke={ROXO} strokeWidth={2} fill="none" strokeLinejoin="round" strokeLinecap="round" />

      <Rotulo x={92} y={46} cor={FRACO}>{tl('subida', 'climb', 'subida', 'salita')}</Rotulo>
      <Rotulo x={145} y={106} cor={FRACO}>{tl('planície', 'flat', 'llanura', 'pianura')}</Rotulo>
      <Rotulo x={228} y={114} cor={FRACO}>{tl('o chão cede', 'floor gives way', 'el suelo cede', 'il suolo cede')}</Rotulo>

      <Pessoa x={124} y={88} cor={OURO} />
      <Seta x1={124} y1={30} x2={124} y2={66} cor={OURO} tracejada />
      <Rotulo x={124} y={22} cor={OURO} tam={10}>{tl('quem atravessa', 'who crosses', 'quien atraviesa', 'chi attraversa')}</Rotulo>
      <Rotulo x={38} y={114} cor={ROXO} tam={9.5}>{tl('o mapa', 'the chart', 'la carta', 'la carta')}</Rotulo>
    </Svg>
  )
}

/**
 * A LINHA DAS DESCOBERTAS — Urano, Netuno e Plutão.
 *
 * ⚠️ DUAS FAIXAS SEPARADAS PELA LINHA DO TEMPO, e isso é a mesma regra do
 * bloco `sincronicidade`: em cima o planeta, embaixo o que o mundo descobria,
 * e nada ligando os dois além da data. Uma seta de causa entre as faixas
 * afirmaria o que o texto recusa afirmar.
 */
function LinhaDasDescobertas({ tl }: { tl: Tl }) {
  const marcos: Array<{ x: number; ano: string; planeta: string; mundo: string }> = [
    { x: 62, ano: '1781', planeta: tl('Urano', 'Uranus', 'Urano', 'Urano'), mundo: tl('eletricidade', 'electricity', 'electricidad', 'elettricita') },
    { x: 150, ano: '1846', planeta: tl('Netuno', 'Neptune', 'Neptuno', 'Nettuno'), mundo: tl('anestesia', 'anaesthesia', 'anestesia', 'anestesia') },
    { x: 240, ano: '1930', planeta: tl('Plutão', 'Pluto', 'Pluton', 'Plutone'), mundo: tl('fissão nuclear', 'nuclear fission', 'fision nuclear', 'fissione nucleare') },
  ]
  return (
    <Svg width="100%" height={148} viewBox="0 0 300 148">
      <Rotulo x={16} y={16} cor={ROXO} tam={9} meio={false}>{tl('NO CÉU', 'IN THE SKY', 'EN EL CIELO', 'IN CIELO')}</Rotulo>
      <Line x1={16} y1={76} x2={288} y2={76} stroke={LINHA} strokeWidth={1.5} />
      <Rotulo x={16} y={142} cor={OURO} tam={9} meio={false}>{tl('NO MUNDO', 'IN THE WORLD', 'EN EL MUNDO', 'NEL MONDO')}</Rotulo>

      {marcos.map((m) => (
        <G key={m.ano}>
          <Circle cx={m.x} cy={44} r={9} fill="none" stroke={ROXO} strokeWidth={1.6} />
          <Circle cx={m.x} cy={44} r={3} fill={ROXO} />
          <Rotulo x={m.x} y={32} cor={ROXO} tam={9.5}>{m.planeta}</Rotulo>
          <Line x1={m.x} y1={53} x2={m.x} y2={72} stroke={ROXO} strokeWidth={1} strokeDasharray="2 3" />

          <Circle cx={m.x} cy={76} r={3.6} fill={CLARO} />
          <Rotulo x={m.x} y={92} cor={CLARO} tam={10.5}>{m.ano}</Rotulo>

          <Line x1={m.x} y1={100} x2={m.x} y2={112} stroke={OURO} strokeWidth={1} strokeDasharray="2 3" />
          <Rotulo x={m.x} y={124} cor={OURO} tam={9.5}>{m.mundo}</Rotulo>
        </G>
      ))}
    </Svg>
  )
}

/**
 * MERCÚRIO NUNCA SE AFASTA DO SOL.
 *
 * ⚠️ O ÂNGULO É O ASSUNTO. A figura existe para mostrar por que a tradição o
 * chamou de mensageiro do Sol: ele não tem como sair de perto. Os ~28° são a
 * elongação máxima real, não um valor escolhido para caber no desenho.
 */
function ElongacaoDeMercurio({ tl }: { tl: Tl }) {
  const cx = 150; const cy = 74; const r = 46
  const g = (graus: number) => {
    const a = ((graus - 90) * Math.PI) / 180
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) }
  }
  const e = g(28); const o = g(-28)
  return (
    <Svg width="100%" height={136} viewBox="0 0 300 136">
      <Circle cx={cx} cy={cy} r={r} fill="none" stroke={LINHA} strokeWidth={1} strokeDasharray="3 4" />
      <Circle cx={cx} cy={cy} r={13} fill={OURO} opacity={0.9} />
      <Rotulo x={cx} y={cy + 30} cor={OURO} tam={10}>{tl('Sol', 'Sun', 'Sol', 'Sole')}</Rotulo>

      <Line x1={cx} y1={cy} x2={e.x} y2={e.y} stroke={AGUA} strokeWidth={1.2} />
      <Line x1={cx} y1={cy} x2={o.x} y2={o.y} stroke={AGUA} strokeWidth={1.2} />
      <Path d={`M ${o.x} ${o.y} A ${r} ${r} 0 0 1 ${e.x} ${e.y}`} stroke={AGUA} strokeWidth={2.4} fill="none" strokeLinecap="round" />
      <Circle cx={e.x} cy={e.y} r={4.5} fill={AGUA} />
      <Circle cx={o.x} cy={o.y} r={4.5} fill={AGUA} />

      <Rotulo x={cx} y={20} cor={AGUA} tam={10}>{tl('até ~28°, e nunca mais', 'up to ~28°, never more', 'hasta ~28°, y nunca mas', 'fino a ~28°, mai oltre')}</Rotulo>
      <Rotulo x={cx} y={128} cor={FRACO} tam={9.5}>
        {tl('por isso só aparece ao amanhecer ou ao anoitecer', 'which is why it only shows at dawn or dusk', 'por eso solo aparece al alba o al anochecer', 'per questo appare solo all alba o al tramonto')}
      </Rotulo>
    </Svg>
  )
}

/**
 * JÚPITER É MAIOR QUE TODOS OS OUTROS SOMADOS.
 *
 * ⚠️ OS RAIOS SÃO PROPORCIONAIS AOS DIÂMETROS REAIS. Desenhar "grande e
 * pequenos" no olho faria a figura ilustrar a frase em vez de demonstrá-la —
 * e a frase é justamente uma afirmação de medida.
 */
function TamanhoDeJupiter({ tl }: { tl: Tl }) {
  // Diâmetros equatoriais em km, escalados para caber.
  const outros: Array<[string, number]> = [
    ['Saturno', 116460], ['Urano', 50724], ['Netuno', 49244],
    ['Terra', 12756], ['Vênus', 12104], ['Marte', 6792], ['Merc.', 4879],
  ]
  const k = 42 / 139820 // raio de Júpiter no desenho ÷ diâmetro real
  let x = 128
  return (
    <Svg width="100%" height={126} viewBox="0 0 300 126">
      <Circle cx={62} cy={62} r={42} fill={OURO} opacity={0.85} />
      <Rotulo x={62} y={118} cor={OURO} tam={11}>{tl('Júpiter', 'Jupiter', 'Jupiter', 'Giove')}</Rotulo>

      {outros.map(([nome, d]) => {
        const r = Math.max(2.2, d * k)
        x += r + 5
        const meu = x
        x += r
        return (
          <G key={nome}>
            <Circle cx={meu} cy={62} r={r} fill={CLARO} opacity={0.55} />
            {r >= 9 ? <Rotulo x={meu} y={62 + r + 11} cor={FRACO} tam={7.5}>{nome}</Rotulo> : null}
          </G>
        )
      })}
      <Rotulo x={212} y={24} cor={FRACO} tam={9.5}>{tl('todos os outros, juntos', 'all the others, together', 'todos los demas, juntos', 'tutti gli altri, insieme')}</Rotulo>
    </Svg>
  )
}

/**
 * A VOLTA DE SATURNO — 29 anos, e o que isso marca numa vida.
 */
function VoltaDeSaturno({ tl }: { tl: Tl }) {
  const cx = 150; const cy = 66; const r = 44
  const ponto = (frac: number) => {
    const a = (frac * 2 * Math.PI) - Math.PI / 2
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) }
  }
  return (
    <Svg width="100%" height={132} viewBox="0 0 300 132">
      <Circle cx={cx} cy={cy} r={r} fill="none" stroke={LINHA} strokeWidth={1.2} />
      <Circle cx={cx} cy={cy} r={10} fill={OURO} opacity={0.85} />
      <Rotulo x={cx} y={cy + 4} cor="#0F1426" tam={8} peso="800">{tl('nasc.', 'birth', 'nac.', 'nasc.')}</Rotulo>

      {/* O arco percorrido: uma volta inteira = 29 anos. */}
      <Path
        d={`M ${ponto(0).x} ${ponto(0).y} A ${r} ${r} 0 1 1 ${ponto(0.74).x} ${ponto(0.74).y}`}
        stroke={ROXO} strokeWidth={2.6} fill="none" strokeLinecap="round"
      />
      {[['0', 0], ['≈7', 0.25], ['≈15', 0.5], ['≈22', 0.75]].map(([rot, f]) => {
        const p = ponto(Number(f))
        return (
          <G key={String(rot)}>
            <Circle cx={p.x} cy={p.y} r={3.4} fill={ROXO} />
            <Rotulo x={p.x} y={p.y - 8} cor={FRACO} tam={8}>{String(rot)}</Rotulo>
          </G>
        )
      })}
      <Rotulo x={cx} y={18} cor={ROXO} tam={10.5}>{tl('uma volta = 29 anos', 'one lap = 29 years', 'una vuelta = 29 anos', 'un giro = 29 anni')}</Rotulo>
      <Rotulo x={cx} y={126} cor={CLARO} tam={9.5}>
        {tl('o retorno cai na saída da juventude', 'the return lands as youth ends', 'el retorno cae al salir de la juventud', 'il ritorno cade all uscita dalla giovinezza')}
      </Rotulo>
    </Svg>
  )
}

/**
 * O CICLO DA LUA — o ciclo mais visível do céu, em oito passos.
 *
 * ⚠️ O RAIO DA ELIPSE VAI EM VALOR ABSOLUTO. Uma meia-lua é um semicírculo
 * colado numa semi-elipse, e a largura dessa elipse é `|2f − 1|`: quando a
 * fração iluminada passa de meia, o terminador inverte a curvatura. Deixar o
 * raio ficar negativo entregaria ao SVG um valor que a spec manda tratar como
 * absoluto — ou seja, a curva certa pelo motivo errado, e a direção do
 * recorte passaria a depender só do flag de sweep, que é onde isso quebra em
 * silêncio num renderizador diferente.
 */
function CicloDaLua({ tl }: { tl: Tl }) {
  /** Fração iluminada vista da Terra: 0 = nova, 1 = cheia. */
  const fases = [0, 0.25, 0.5, 0.75, 1, 0.75, 0.5, 0.25]
  return (
    <Svg width="100%" height={92} viewBox="0 0 300 92">
      {fases.map((f, i) => {
        const cx = 26 + i * 35
        const cy = 42
        const r = 13
        // Até a cheia a luz cresce pela direita; depois dela, pela esquerda.
        const crescendo = i <= 4
        const rxElipse = Math.abs(2 * f - 1) * r
        // O semicírculo sempre acompanha o lado iluminado...
        const sweepArco = crescendo ? 1 : 0
        // ...e o terminador inverte a curvatura quando passa de meia-lua.
        const sweepTerminador = f > 0.5 ? sweepArco : 1 - sweepArco
        return (
          <G key={i}>
            <Circle cx={cx} cy={cy} r={r} fill="none" stroke={LINHA} strokeWidth={1} />
            {f === 1 ? <Circle cx={cx} cy={cy} r={r} fill={CLARO} opacity={0.92} /> : null}
            {f > 0 && f < 1 ? (
              <Path
                d={`M ${cx} ${cy - r}`
                  + ` A ${r} ${r} 0 0 ${sweepArco} ${cx} ${cy + r}`
                  + ` A ${rxElipse} ${r} 0 0 ${sweepTerminador} ${cx} ${cy - r} Z`}
                fill={CLARO}
                opacity={0.92}
              />
            ) : null}
          </G>
        )
      })}
      <Rotulo x={26} y={74} cor={FRACO} tam={8.5}>{tl('nova', 'new', 'nueva', 'nuova')}</Rotulo>
      <Rotulo x={166} y={74} cor={OURO} tam={8.5}>{tl('cheia', 'full', 'llena', 'piena')}</Rotulo>
      <Rotulo x={150} y={16} cor={CLARO} tam={10}>{tl('28 dias, e recomeça', '28 days, then it restarts', '28 dias, y vuelve a empezar', '28 giorni, e ricomincia')}</Rotulo>
    </Svg>
  )
}

/**
 * OS CINCO ÂNGULOS MAIORES.
 *
 * ⚠️ O ÂNGULO É DESENHADO DE VERDADE (60° é 60° na figura). Um diagrama de
 * aspectos com ângulo aproximado ensinaria errado a única coisa que ele tem
 * para ensinar.
 */
function AngulosDosAspectos({ tl }: { tl: Tl }) {
  const cx = 150; const cy = 72; const r = 52
  const p = (graus: number) => {
    const a = ((graus - 90) * Math.PI) / 180
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) }
  }
  const aspectos: Array<{ g: number; nome: string; cor: string }> = [
    { g: 60, nome: tl('sextil 60°', 'sextile 60°', 'sextil 60°', 'sestile 60°'), cor: AGUA },
    { g: 90, nome: tl('quadratura 90°', 'square 90°', 'cuadratura 90°', 'quadrato 90°'), cor: '#F08A8A' },
    { g: 120, nome: tl('trígono 120°', 'trine 120°', 'trigono 120°', 'trigono 120°'), cor: AGUA },
    { g: 180, nome: tl('oposição 180°', 'opposition 180°', 'oposicion 180°', 'opposizione 180°'), cor: '#F08A8A' },
  ]
  const origem = p(0)
  return (
    <Svg width="100%" height={168} viewBox="0 0 300 168">
      <Circle cx={cx} cy={cy} r={r} fill="none" stroke={LINHA} strokeWidth={1.2} />
      {aspectos.map((a) => {
        const q = p(a.g)
        return <Line key={a.g} x1={origem.x} y1={origem.y} x2={q.x} y2={q.y} stroke={a.cor} strokeWidth={1.6} opacity={0.85} />
      })}
      {aspectos.map((a) => {
        const q = p(a.g)
        return <Circle key={`d${a.g}`} cx={q.x} cy={q.y} r={4} fill={a.cor} />
      })}
      <Circle cx={origem.x} cy={origem.y} r={5.5} fill={OURO} />
      <Rotulo x={origem.x} y={origem.y - 10} cor={OURO} tam={9}>{tl('conjunção 0°', 'conjunction 0°', 'conjuncion 0°', 'congiunzione 0°')}</Rotulo>

      {aspectos.map((a, i) => (
        <G key={`l${a.g}`}>
          <Circle cx={22} cy={140 + (i % 2) * 14} r={3} fill={a.cor} />
          <Rotulo x={30} y={143 + (i % 2) * 14} cor={CLARO} tam={9} meio={false}>{a.nome}</Rotulo>
        </G>
      ))}
      <Rotulo x={214} y={143} cor={AGUA} tam={8.5} meio={false}>{tl('flui', 'flows', 'fluye', 'scorre')}</Rotulo>
      <Rotulo x={214} y={157} cor="#F08A8A" tam={8.5} meio={false}>{tl('atrita', 'grinds', 'roza', 'attrita')}</Rotulo>
    </Svg>
  )
}

// ─────────────────────────────────────────────────────────────────────────────

export default function FiguraDoEstudo({ chave, descricao, idioma }: {
  chave: ChaveDaFigura
  descricao: string
  idioma: IdiomaEstudo
}) {
  const i = idioma === 'en-US' ? 1 : idioma === 'es-ES' ? 2 : idioma === 'it-IT' ? 3 : 0
  const tl: Tl = (pt, en, es, it) => [pt, en, es, it][i]

  const desenho = (() => {
    switch (chave) {
      case 'ladeira-ou-trilho': return <LadeiraOuTrilho tl={tl} />
      case 'terreno-e-viajante': return <TerrenoEViajante tl={tl} />
      case 'linha-das-descobertas': return <LinhaDasDescobertas tl={tl} />
      case 'elongacao-de-mercurio': return <ElongacaoDeMercurio tl={tl} />
      case 'tamanho-de-jupiter': return <TamanhoDeJupiter tl={tl} />
      case 'volta-de-saturno': return <VoltaDeSaturno tl={tl} />
      case 'ciclo-da-lua': return <CicloDaLua tl={tl} />
      case 'angulos-dos-aspectos': return <AngulosDosAspectos tl={tl} />
      default: {
        // ⚠️ SEM RAMO PADRÃO DE VERDADE. Uma chave nova sem desenho sairia como
        // moldura vazia na lição, em silêncio — o mesmo fallback mudo que este
        // projeto já pagou caro. O `never` faz o TypeScript recusar a
        // compilação antes de isso chegar na tela.
        const naoDesenhada: never = chave
        void naoDesenhada
        return null
      }
    }
  })()

  if (!desenho) return null

  return (
    // ⚠️ A DESCRIÇÃO É O TEXTO ALTERNATIVO, não legenda: quem usa leitor de
    // tela recebe ela no lugar do desenho. O SVG inteiro vira um só nó
    // acessível para o leitor não soletrar cada rótulo solto.
    <View
      style={s.moldura}
      accessible
      accessibilityRole="image"
      accessibilityLabel={descricao}
    >
      {desenho}
    </View>
  )
}

const s = StyleSheet.create({
  moldura: {
    backgroundColor: 'rgba(255,255,255,0.035)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
})
