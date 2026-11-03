import React from 'react'
import { StyleSheet, View } from 'react-native'
import Svg, { Circle, Defs, G, Line, LinearGradient, Path, Polygon, Rect, Stop, Text as SvgText } from 'react-native-svg'
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


/**
 * A VELOCIDADE SEPARA O PESSOAL DO GERACIONAL.
 *
 * ⚠️ A ESCALA É LOGARÍTMICA, e isso está escrito na figura. Plutão leva 248
 * anos e a Lua 28 dias: em escala linear a Lua viraria um pixel e a figura
 * provaria nada. O log mantém as nove barras legíveis e preserva a ordem, que
 * é o que a lição afirma.
 */
function VelocidadeDosPlanetas({ tl }: { tl: Tl }) {
  /** Período orbital aparente, em dias. */
  const corpos: Array<[string, number, string]> = [
    ['Lua', 27.3, AGUA], ['Merc.', 88, AGUA], ['Vênus', 225, AGUA],
    ['Sol', 365, AGUA], ['Marte', 687, AGUA],
    ['Júpiter', 4333, OURO], ['Saturno', 10759, OURO],
    ['Urano', 30687, ROXO], ['Netuno', 60190, ROXO],
  ]
  const min = Math.log(27.3)
  const max = Math.log(60190)
  const larg = (d: number) => 14 + ((Math.log(d) - min) / (max - min)) * 214
  return (
    <Svg width="100%" height={178} viewBox="0 0 300 178">
      {corpos.map(([nome, dias, cor], i) => {
        const y = 20 + i * 16
        return (
          <G key={nome}>
            <Rotulo x={46} y={y + 3.5} cor={FRACO} tam={8.5} meio={false}>{nome}</Rotulo>
            <Rect x={50} y={y - 3.5} width={larg(dias)} height={7} rx={3.5} fill={cor} opacity={0.75} />
          </G>
        )
      })}
      <Line x1={46} y1={12} x2={46} y2={158} stroke={LINHA} strokeWidth={1} />
      <Rotulo x={8} y={56} cor={AGUA} tam={8} meio={false}>{tl('pessoais', 'personal', 'personales', 'personali')}</Rotulo>
      <Rotulo x={8} y={116} cor={OURO} tam={8} meio={false}>{tl('sociais', 'social', 'sociales', 'sociali')}</Rotulo>
      <Rotulo x={8} y={150} cor={ROXO} tam={8} meio={false}>{tl('geração', 'generation', 'generacion', 'generazione')}</Rotulo>
      <Rotulo x={150} y={173} cor={CLARO} tam={9}>
        {tl('tempo de uma volta (escala log)', 'time for one lap (log scale)', 'tiempo de una vuelta (escala log)', 'tempo di un giro (scala log)')}
      </Rotulo>
    </Svg>
  )
}

/**
 * OS DOZE SIGNOS NA MATRIZ 4 × 3.
 *
 * ⚠️ A GRADE É O CONTEÚDO. Listar os doze em fila não mostraria nada; posta
 * em quatro elementos por três modalidades, a tabela revela que cada
 * combinação acontece UMA vez só — que é a razão de os doze serem doze.
 */
function ElementosEModalidades({ tl }: { tl: Tl }) {
  const elementos = [
    { nome: tl('fogo', 'fire', 'fuego', 'fuoco'), cor: '#F08A8A', signos: ['Áries', 'Leão', 'Sagit.'] },
    { nome: tl('terra', 'earth', 'tierra', 'terra'), cor: '#9BCF8A', signos: ['Touro', 'Virgem', 'Capric.'] },
    { nome: tl('ar', 'air', 'aire', 'aria'), cor: '#8AB6F0', signos: ['Gêmeos', 'Libra', 'Aquário'] },
    { nome: tl('água', 'water', 'agua', 'acqua'), cor: ROXO, signos: ['Câncer', 'Escorp.', 'Peixes'] },
  ]
  const modos = [
    tl('cardinal', 'cardinal', 'cardinal', 'cardinale'),
    tl('fixo', 'fixed', 'fijo', 'fisso'),
    tl('mutável', 'mutable', 'mutable', 'mobile'),
  ]
  return (
    <Svg width="100%" height={158} viewBox="0 0 300 158">
      {modos.map((m, c) => <Rotulo key={m} x={93 + c * 72} y={16} cor={CLARO} tam={9}>{m}</Rotulo>)}
      {elementos.map((e, r) => (
        <G key={e.nome}>
          <Rotulo x={30} y={44 + r * 32} cor={e.cor} tam={9.5} meio={false}>{e.nome}</Rotulo>
          {e.signos.map((sg, c) => (
            <G key={sg}>
              <Rect
                x={60 + c * 72} y={30 + r * 32} width={66} height={22} rx={6}
                fill={e.cor} opacity={0.14} stroke={e.cor} strokeOpacity={0.4} strokeWidth={0.8}
              />
              <Rotulo x={93 + c * 72} y={44 + r * 32} cor={CLARO} tam={8.5}>{sg}</Rotulo>
            </G>
          ))}
        </G>
      ))}
      <Rotulo x={150} y={152} cor={FRACO} tam={8.5}>
        {tl('4 matérias x 3 jeitos de agir = 12', '4 materials x 3 ways of acting = 12', '4 materias x 3 modos de actuar = 12', '4 materie x 3 modi di agire = 12')}
      </Rotulo>
    </Svg>
  )
}

/** AS DOZE CASAS — os setores da vida, na roda. */
function AsDozeCasas({ tl }: { tl: Tl }) {
  const cx = 150; const cy = 92; const r = 78
  const assuntos = [
    tl('eu', 'self', 'yo', 'io'), tl('ter', 'having', 'tener', 'avere'),
    tl('falar', 'speaking', 'hablar', 'parlare'), tl('casa', 'home', 'casa', 'casa'),
    tl('criar', 'creating', 'crear', 'creare'), tl('rotina', 'routine', 'rutina', 'routine'),
    tl('o outro', 'the other', 'el otro', 'l altro'), tl('crise', 'crisis', 'crisis', 'crisi'),
    tl('sentido', 'meaning', 'sentido', 'senso'), tl('obra', 'work', 'obra', 'opera'),
    tl('grupo', 'group', 'grupo', 'gruppo'), tl('recolher', 'retreat', 'recoger', 'ritiro'),
  ]
  const pt = (g: number, raio: number) => {
    const a = ((g - 180) * Math.PI) / 180
    return { x: cx + raio * Math.cos(a), y: cy + raio * Math.sin(a) }
  }
  return (
    <Svg width="100%" height={188} viewBox="0 0 300 188">
      <Circle cx={cx} cy={cy} r={r} fill="none" stroke={LINHA} strokeWidth={1.2} />
      <Circle cx={cx} cy={cy} r={r * 0.56} fill="none" stroke={LINHA} strokeWidth={0.8} />
      {/* A linha do horizonte: as casas 1 a 6 ficam abaixo dela. */}
      <Line x1={cx - r - 6} y1={cy} x2={cx + r + 6} y2={cy} stroke={CLARO} strokeWidth={1} strokeOpacity={0.5} />

      {assuntos.map((txt, i) => {
        const ini = pt(i * 30, r)
        const meio = pt(i * 30 + 15, r * 0.79)
        const num = pt(i * 30 + 15, r * 0.4)
        return (
          <G key={i}>
            <Line x1={cx} y1={cy} x2={ini.x} y2={ini.y} stroke={LINHA} strokeWidth={0.8} />
            <SvgText x={num.x} y={num.y + 3} fill={i === 0 ? OURO : FRACO} fontSize={9} fontWeight="700" textAnchor="middle">
              {String(i + 1)}
            </SvgText>
            <SvgText x={meio.x} y={meio.y + 2.5} fill={CLARO} fontSize={7.5} textAnchor="middle">{txt}</SvgText>
          </G>
        )
      })}
      <Rotulo x={cx - r - 4} y={cy - 6} cor={OURO} tam={8} meio={false}>ASC</Rotulo>
      <Rotulo x={150} y={184} cor={FRACO} tam={8.5}>
        {tl('a casa 1 começa no horizonte do seu nascimento', 'house 1 starts at the horizon of your birth', 'la casa 1 empieza en el horizonte de tu nacimiento', 'la casa 1 inizia all orizzonte della tua nascita')}
      </Rotulo>
    </Svg>
  )
}

/**
 * A ORBE E A FORÇA.
 *
 * ⚠️ A CURVA CAI, não é degrau. A lição diz que o peso diminui conforme se
 * afasta do exato; desenhar faixas chapadas diria que 1° e 5° pesam igual até
 * um corte, que é justamente o engano que a lição desfaz.
 */
function AOrbeEAForca({ tl }: { tl: Tl }) {
  const x0 = 34; const x1 = 278; const base = 118; const topo = 34
  const px = (g: number) => x0 + (g / 8) * (x1 - x0)
  const py = (g: number) => base - Math.exp(-0.36 * g) * (base - topo)
  const curva = Array.from({ length: 49 }, (_, i) => {
    const g = i / 6
    return `${i === 0 ? 'M' : 'L'} ${px(g).toFixed(1)} ${py(g).toFixed(1)}`
  }).join(' ')
  return (
    <Svg width="100%" height={152} viewBox="0 0 300 152">
      <Defs>
        <LinearGradient id="forca" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={OURO} stopOpacity="0.3" />
          <Stop offset="1" stopColor={OURO} stopOpacity="0.02" />
        </LinearGradient>
      </Defs>
      <Path d={`${curva} L ${x1} ${base} L ${x0} ${base} Z`} fill="url(#forca)" />
      <Path d={curva} stroke={OURO} strokeWidth={2} fill="none" />
      <Line x1={x0} y1={base} x2={x1} y2={base} stroke={LINHA} strokeWidth={1} />
      <Line x1={x0} y1={base} x2={x0} y2={topo - 6} stroke={LINHA} strokeWidth={1} />

      <Circle cx={px(0)} cy={py(0)} r={4} fill={OURO} />
      <Rotulo x={px(0) + 30} y={topo - 10} cor={OURO} tam={9} meio={false}>{tl('exato: pesa tudo', 'exact: full weight', 'exacto: pesa todo', 'esatto: pesa tutto')}</Rotulo>
      {[0, 2, 4, 6, 8].map((g) => (
        <G key={g}>
          <Line x1={px(g)} y1={base} x2={px(g)} y2={base + 4} stroke={LINHA} strokeWidth={1} />
          <Rotulo x={px(g)} y={base + 15} cor={FRACO} tam={8}>{`${g}°`}</Rotulo>
        </G>
      ))}
      <Rotulo x={px(6.1)} y={py(6) - 10} cor={FRACO} tam={8.5} meio={false}>{tl('de fundo', 'background', 'de fondo', 'di sfondo')}</Rotulo>
      <Rotulo x={150} y={146} cor={CLARO} tam={9}>
        {tl('distância do ângulo exato', 'distance from the exact angle', 'distancia del angulo exacto', 'distanza dall angolo esatto')}
      </Rotulo>
    </Svg>
  )
}

/**
 * NATAL E TRÂNSITO — a figura mais importante do curso para o uso diário.
 *
 * ⚠️ DUAS RODAS CONCÊNTRICAS, e a de dentro NÃO GIRA. É o que a lição 9
 * afirma: o natal é a foto de um instante e não muda nunca; o céu de hoje
 * passa por cima. Desenhar as duas girando apagaria a única distinção que a
 * lição existe para fazer — e é dela que depende todo número da Home deixar
 * de ler como julgamento permanente.
 */
function NatalETransito({ tl }: { tl: Tl }) {
  const cx = 150; const cy = 88; const ri = 42; const ro = 72
  const pt = (g: number, r: number) => {
    const a = ((g - 90) * Math.PI) / 180
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) }
  }
  const seta1 = pt(-28, ro + 11)
  const seta2 = pt(22, ro + 11)
  return (
    <Svg width="100%" height={176} viewBox="0 0 300 176">
      <Circle cx={cx} cy={cy} r={ro} fill="none" stroke={ROXO} strokeWidth={1.6} strokeDasharray="5 4" />
      <Circle cx={cx} cy={cy} r={ri} fill="none" stroke={OURO} strokeWidth={2} />

      {[20, 95, 160, 250, 310].map((g) => {
        const p = pt(g, ri)
        return <Circle key={`n${g}`} cx={p.x} cy={p.y} r={4} fill={OURO} />
      })}
      <Rotulo x={cx} y={cy + 1} cor={OURO} tam={9}>{tl('seu mapa', 'your chart', 'tu carta', 'la tua carta')}</Rotulo>
      <Rotulo x={cx} y={cy + 14} cor={FRACO} tam={7.5}>{tl('não muda', 'never changes', 'no cambia', 'non cambia')}</Rotulo>

      {[55, 140, 225].map((g) => {
        const p = pt(g, ro)
        return <Circle key={`t${g}`} cx={p.x} cy={p.y} r={4.5} fill={ROXO} />
      })}
      <Path
        d={`M ${seta1.x} ${seta1.y} A ${ro + 11} ${ro + 11} 0 0 1 ${seta2.x} ${seta2.y}`}
        stroke={ROXO} strokeWidth={1.4} fill="none"
      />
      <Polygon
        points={`${pt(26, ro + 11).x},${pt(26, ro + 11).y} ${pt(19, ro + 15).x},${pt(19, ro + 15).y} ${pt(19, ro + 7).x},${pt(19, ro + 7).y}`}
        fill={ROXO}
      />
      <Rotulo x={cx} y={12} cor={ROXO} tam={9.5}>{tl('o céu de hoje gira por cima', 'today sky turns above it', 'el cielo de hoy gira encima', 'il cielo di oggi gira sopra')}</Rotulo>

      {/* O contato: quando um ponto de fora encosta num de dentro. */}
      <Line x1={pt(140, ro).x} y1={pt(140, ro).y} x2={pt(160, ri).x} y2={pt(160, ri).y} stroke={AGUA} strokeWidth={1.6} />
      <Circle cx={30} cy={152} r={3} fill={AGUA} />
      <Rotulo x={38} y={155} cor={AGUA} tam={8.5} meio={false}>{tl('o encontro é o trânsito', 'the meeting is the transit', 'el encuentro es el transito', 'l incontro e il transito')}</Rotulo>
      <Rotulo x={150} y={172} cor={FRACO} tam={8.5}>
        {tl('o que você É, e o que está ACONTECENDO', 'what you ARE, and what is HAPPENING', 'lo que ERES, y lo que esta PASANDO', 'cio che SEI, e cio che sta ACCADENDO')}
      </Rotulo>
    </Svg>
  )
}

/** QUANTO DURA CADA VOLTA — e por isso quais ciclos cabem numa vida. */
function DuracaoDosCiclos({ tl }: { tl: Tl }) {
  const ciclos: Array<[string, string, number, string]> = [
    [tl('Lua', 'Moon', 'Luna', 'Luna'), tl('28 dias', '28 days', '28 dias', '28 giorni'), 0.08, AGUA],
    [tl('Sol', 'Sun', 'Sol', 'Sole'), tl('1 ano', '1 year', '1 ano', '1 anno'), 1, AGUA],
    [tl('Júpiter', 'Jupiter', 'Jupiter', 'Giove'), tl('12 anos', '12 years', '12 anos', '12 anni'), 12, OURO],
    [tl('Saturno', 'Saturn', 'Saturno', 'Saturno'), tl('29 anos', '29 years', '29 anos', '29 anni'), 29, OURO],
    [tl('Urano', 'Uranus', 'Urano', 'Urano'), tl('84 anos', '84 years', '84 anos', '84 anni'), 84, ROXO],
  ]
  const x0 = 70; const x1 = 268
  const px = (anos: number) => x0 + Math.min(1, anos / 84) * (x1 - x0)
  return (
    <Svg width="100%" height={152} viewBox="0 0 300 152">
      {/* A régua de uma vida, para o leitor ver o que cabe nela. */}
      <Line x1={x0} y1={126} x2={x1} y2={126} stroke={LINHA} strokeWidth={1} />
      {[0, 29, 58, 84].map((a) => (
        <G key={a}>
          <Line x1={px(a)} y1={122} x2={px(a)} y2={130} stroke={LINHA} strokeWidth={1} />
          <Rotulo x={px(a)} y={140} cor={FRACO} tam={8}>{a === 0 ? tl('nasc.', 'birth', 'nac.', 'nasc.') : String(a)}</Rotulo>
        </G>
      ))}
      {ciclos.map(([nome, dur, anos, cor], i) => {
        const y = 22 + i * 19
        return (
          <G key={nome}>
            <Rotulo x={64} y={y + 3} cor={cor} tam={8.5} meio={false}>{nome}</Rotulo>
            <Rect x={x0} y={y - 3} width={Math.max(4, px(anos) - x0)} height={6} rx={3} fill={cor} opacity={0.8} />
            <Rotulo x={Math.min(272, px(anos) + 6)} y={y + 3} cor={FRACO} tam={7.5} meio={false}>{dur}</Rotulo>
          </G>
        )
      })}
      <Rotulo x={26} y={129} cor={CLARO} tam={8} meio={false}>{tl('idade', 'age', 'edad', 'eta')}</Rotulo>
    </Svg>
  )
}

/** OS QUATRO PASSOS DE LEITURA, na ordem. */
function OrdemDeLeitura({ tl }: { tl: Tl }) {
  const passos: Array<[string, string, string]> = [
    [tl('1. o conjunto', '1. the whole', '1. el conjunto', '1. l insieme'), tl('que elemento pesa', 'which element weighs', 'que elemento pesa', 'quale elemento pesa'), OURO],
    [tl('2. os três', '2. the three', '2. los tres', '2. i tre'), tl('Sol, Lua, Ascendente', 'Sun, Moon, Ascendant', 'Sol, Luna, Ascendente', 'Sole, Luna, Ascendente'), OURO],
    [tl('3. o que grita', '3. what shouts', '3. lo que grita', '3. cio che grida'), tl('stellium, aspecto exato', 'stellium, exact aspect', 'stellium, aspecto exacto', 'stellium, aspetto esatto'), AGUA],
    [tl('4. o resto', '4. the rest', '4. el resto', '4. il resto'), tl('planeta a planeta', 'planet by planet', 'planeta a planeta', 'pianeta per pianeta'), FRACO],
  ]
  return (
    <Svg width="100%" height={158} viewBox="0 0 300 158">
      <Line x1={30} y1={26} x2={30} y2={128} stroke={LINHA} strokeWidth={1.4} />
      {passos.map(([tit, sub, cor], i) => {
        const y = 26 + i * 34
        return (
          <G key={tit}>
            <Circle cx={30} cy={y} r={6.5} fill="#0F1426" stroke={cor} strokeWidth={1.8} />
            <Circle cx={30} cy={y} r={2.6} fill={cor} />
            <Rotulo x={46} y={y - 1} cor={CLARO} tam={10} meio={false} peso="700">{tit}</Rotulo>
            <Rotulo x={46} y={y + 11} cor={FRACO} tam={8.5} meio={false} peso="400">{sub}</Rotulo>
          </G>
        )
      })}
      <Rotulo x={150} y={150} cor={FRACO} tam={8.5}>
        {tl('do todo para a parte, nunca o contrário', 'from whole to part, never the reverse', 'del todo a la parte, nunca al reves', 'dall insieme alla parte, mai il contrario')}
      </Rotulo>
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
      case 'velocidade-dos-planetas': return <VelocidadeDosPlanetas tl={tl} />
      case 'elementos-e-modalidades': return <ElementosEModalidades tl={tl} />
      case 'as-doze-casas': return <AsDozeCasas tl={tl} />
      case 'a-orbe-e-a-forca': return <AOrbeEAForca tl={tl} />
      case 'natal-e-transito': return <NatalETransito tl={tl} />
      case 'duracao-dos-ciclos': return <DuracaoDosCiclos tl={tl} />
      case 'ordem-de-leitura': return <OrdemDeLeitura tl={tl} />
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
