/**
 * O app desenhado: moldura de celular e as telas por dentro.
 *
 * ── A DECISÃO E O RISCO ────────────────────────────────────────────────────
 *
 * Levantei que um mockup divergente vira promessa que a tela real não cumpre, e
 * o João decidiu assim mesmo, para não depender de mandar prints. O que dá para
 * fazer é tirar a divergência do campo da minha memória:
 *
 *   · as cores saem do código: gradiente `#0F0F23 → #1A1A3A` da HomeScreen,
 *     dourado `#FFD700`, cartão `rgba(255,255,255,0.06)` com borda `.1`
 *   · as oito áreas e suas cores saem de `src/constants/lifeAreas.ts`
 *   · as faixas do score saem de `src/constants/statusThresholds.ts`
 *   · os nomes das abas saem de `src/i18n/appI18n.ts`: Perfil, Mapa Natal,
 *     Grupos, Previsões, Assinatura, Configurações
 *   · as posições dos planetas saem de `mapaDoCeu`, o mesmo cálculo do app
 *
 * E um teste lê esses `.ts` e quebra se o app mudar sem o desenho acompanhar.
 * É o que impede o mockup de envelhecer em silêncio.
 *
 * ── O QUE É EXEMPLO ────────────────────────────────────────────────────────
 *
 * Os scores por área são exemplo declarado: calculá-los de verdade exigiria o
 * motor do app, que é TypeScript e vive no aplicativo. Por isso nenhuma peça
 * diz "hoje seu score é X". A tela mostra COMO a informação aparece.
 */
import { LIFE_AREA_ORDER, LIFE_AREA_COLORS, NOME_DA_AREA } from './areasDoApp.mjs'
import { svgDaRoda } from './rodaDoCeu.mjs'

/** Gradiente de fundo da HomeScreen, linha 352. */
const FUNDO_APP = 'linear-gradient(160deg, #0F0F23 0%, #1A1A3A 100%)'
const DOURADO = '#FFD700'
const CARTAO = 'rgba(255,255,255,0.06)'
const BORDA = 'rgba(255,255,255,0.1)'

/**
 * A cor do score, exatamente como em HomeScreen.tsx:476.
 *
 * `score >= 65 ? verde : score >= 40 ? dourado : vermelho`. Não são os limiares
 * de `STATUS_THRESHOLDS` (35/62), que servem ao rótulo das ÁREAS: são dois
 * critérios diferentes no app, e o mockup copia cada um no seu lugar.
 */
export const corDoScore = (score) =>
  score >= 65 ? '#4CAF50' : score >= 40 ? DOURADO : '#FF6B6B'

/** Rótulo da área, como em LifeAreaCard: acima de 62 bom, abaixo de 35 crítico. */
export function faixaDaArea(valor, limiares) {
  if (valor >= limiares.positiveAbove) return 'Positivo'
  if (valor >= limiares.criticalBelow) return 'Moderado'
  return 'Crítico'
}

const escapar = (s) => String(s ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/**
 * A barra de abas, com os nomes reais.
 *
 * `ativa` recebe a chave da aba que a tela pertence.
 */
function abas(ativa) {
  const itens = [
    ['perfil', 'Perfil'],
    ['mapa', 'Mapa'],
    ['grupos', 'Grupos'],
    ['previsoes', 'Previsões'],
    ['assinatura', 'Plano'],
  ]
  return `<div class="abas">${itens.map(([chave, rotulo]) => `
    <div class="aba ${chave === ativa ? 'on' : ''}">
      <div class="ponto"></div><span>${rotulo}</span>
    </div>`).join('')}</div>`
}

/** O cabeçalho da tela, com hora e a barra de status do sistema. */
function topo(titulo) {
  return `<div class="statusbar"><span>9:41</span><span class="sinal"></span></div>
  <div class="cabecalho">${escapar(titulo)}</div>`
}

/**
 * TELA: Perfil, o score do dia e as oito áreas.
 *
 * É a tela que o app abre e a que faz a pessoa voltar todo dia.
 */
function telaInicio({ score = 72, limiares, areas }) {
  const cor = corDoScore(score)

  const cards = LIFE_AREA_ORDER.map((chave, i) => {
    const valor = areas[chave]
    const [c1, c2] = LIFE_AREA_COLORS[chave] || ['#4B5563', '#6B7280']
    return `<div class="area" style="background:linear-gradient(135deg,${c1},${c2})">
      <div class="area-nome">${NOME_DA_AREA[chave]}</div>
      <div class="area-linha">
        <span class="area-valor">${valor}%</span>
        <span class="area-faixa">${faixaDaArea(valor, limiares)}</span>
      </div>
      <div class="area-trilho"><div class="area-fill" style="width:${valor}%"></div></div>
    </div>`
  }).join('')

  return `${topo('Perfil')}
  <div class="score">
    <div class="score-topo"><span>Seu dia</span><span class="seta">›</span></div>
    <div class="score-corpo">
      <span class="score-n" style="color:${cor}">${score}</span><span class="score-max">/100</span>
      <div class="score-info">
        <div class="score-faixa" style="color:${cor}">${faixaDaArea(score, limiares)}</div>
        <div class="score-transito">Lua em trígono com seu Sol</div>
      </div>
    </div>
  </div>
  <div class="areas">${cards}</div>
  ${abas('perfil')}`
}

/** TELA: Mapa Natal, com a roda. As posições são reais. */
function telaMapa({ corpos, ascendente = '' }) {
  const lista = (corpos || []).slice(0, 5).map((c) => `
    <div class="pos"><span class="pos-nome">${c.nomePt}</span><span class="pos-grau">${c.rotulo}</span></div>`).join('')

  return `${topo('Mapa Natal')}
  <div class="roda">${svgDaRoda(corpos, 300)}</div>
  ${ascendente ? `<div class="asc">Ascendente ${escapar(ascendente)}</div>` : ''}
  <div class="posicoes">${lista}</div>
  ${abas('mapa')}`
}

/** TELA: trânsitos sobre o mapa, com a casa que recebe. */
function telaTransitos({ itens = [] }) {
  const linhas = itens.slice(0, 5).map((t) => `
    <div class="transito">
      <div class="transito-cabeca"><span>${escapar(t.titulo)}</span><span class="casa">casa ${t.casa}</span></div>
      <div class="transito-pe">${escapar(t.quando)}</div>
    </div>`).join('')

  return `${topo('Trânsitos Pessoais')}<div class="lista">${linhas}</div>${abas('perfil')}`
}

/** TELA: Previsões, o que vem pela frente. */
function telaPrevisao({ itens = [] }) {
  const linhas = itens.slice(0, 5).map((t) => `
    <div class="evento">
      <div class="evento-dia">${escapar(t.dia)}</div>
      <div class="evento-corpo">
        <div class="evento-titulo">${escapar(t.titulo)}</div>
        <div class="evento-nota">${escapar(t.nota)}</div>
      </div>
    </div>`).join('')

  return `${topo('Previsões')}<div class="lista">${linhas}</div>${abas('previsoes')}`
}

/** TELA: Grupos, as pessoas que você acompanha. */
function telaGrupos({ membros = [], limiares }) {
  const linhas = membros.map((m) => {
    const cor = corDoScore(m.score)
    return `<div class="membro">
      <div class="avatar" style="border-color:${cor}">${escapar(m.nome.slice(0, 1))}</div>
      <div class="membro-info">
        <div class="membro-nome">${escapar(m.nome)}</div>
        <div class="membro-nota">${escapar(m.nota)}</div>
      </div>
      <div class="membro-score" style="color:${cor}">${m.score}</div>
    </div>`
  }).join('')

  return `${topo('Grupos')}<div class="lista">${linhas}</div>
  <div class="rodape-tela">Toque num membro para ver o mapa completo</div>
  ${abas('grupos')}`
}

const TELAS = {
  inicio: telaInicio,
  perfil: telaInicio,
  mapa: telaMapa,
  transitos: telaTransitos,
  previsao: telaPrevisao,
  grupos: telaGrupos,
}

/**
 * O celular, com a tela dentro.
 *
 * @param {string} qual  chave de `TELAS`
 * @param {object} dados o que a tela precisa
 */
export function molduraDeCelular(qual, dados = {}) {
  const montar = TELAS[qual] || TELAS.inicio
  return `<div class="celular"><div class="tela">${montar(dados)}</div></div>`
}

/** O CSS da moldura e das telas, para entrar no `<style>` da peça. */
export function estiloDoApp(escala = 1) {
  const px = (n) => `${(n * escala).toFixed(2)}px`
  return `
  /**
   * A altura vem do CONTEÚDO, não é fixa.
   *
   * Com 720px fixos, a tela do Perfil terminava as oito áreas na metade e
   * deixava um vão preto até a barra de abas, e o aparelho alto empurrava o
   * rodapé da peça para fora do quadro. Aqui o celular tem o tamanho do que ele
   * mostra, que é como um recorte de tela se parece.
   */
  .celular {
    width: ${px(360)}; height: auto;
    border-radius: ${px(38)}; padding: ${px(8)};
    background: linear-gradient(160deg, #2A2A3E, #14141F);
    box-shadow: 0 ${px(30)} ${px(70)} rgba(0,0,0,0.65), inset 0 0 0 ${px(1)} rgba(255,255,255,0.09);
  }
  .tela {
    width: 100%; border-radius: ${px(31)}; overflow: hidden;
    padding-bottom: ${px(4)};
    background: ${FUNDO_APP};
    display: flex; flex-direction: column;
    font-family: -apple-system, 'Segoe UI', system-ui, sans-serif;
    color: #FFFFFF;
  }

  .statusbar {
    display: flex; justify-content: space-between; align-items: center;
    padding: ${px(10)} ${px(18)} ${px(2)};
    font-size: ${px(12)}; color: rgba(255,255,255,0.75); font-weight: 600;
  }
  .sinal {
    width: ${px(26)}; height: ${px(10)}; border-radius: ${px(3)};
    background: rgba(255,255,255,0.55);
  }
  .cabecalho {
    padding: ${px(6)} ${px(18)} ${px(10)};
    font-size: ${px(20)}; font-weight: 700; letter-spacing: -0.01em;
  }

  /* o card do score: HomeScreen.tsx linha 715 */
  .score {
    margin: 0 ${px(16)} ${px(10)};
    padding: ${px(10)} ${px(14)};
    background: ${CARTAO}; border: ${px(1)} solid ${BORDA}; border-radius: ${px(12)};
  }
  .score-topo {
    display: flex; justify-content: space-between; align-items: center;
    font-size: ${px(11)}; color: rgba(255,255,255,0.6);
    text-transform: uppercase; letter-spacing: 0.06em;
  }
  .seta { color: #8888AA; }
  .score-corpo { display: flex; align-items: baseline; margin-top: ${px(6)}; }
  .score-n { font-size: ${px(30)}; font-weight: 700; line-height: 1; }
  .score-max { font-size: ${px(11)}; color: #888; margin-left: ${px(2)}; }
  .score-info { margin-left: ${px(12)}; }
  .score-faixa { font-size: ${px(13)}; font-weight: 600; }
  .score-transito { font-size: ${px(11)}; color: rgba(255,255,255,0.55); margin-top: ${px(2)}; }

  /* grid de duas colunas, como lifeAreasGrid + lifeAreaItem (50%) */
  .areas {
    display: grid; grid-template-columns: 1fr 1fr; gap: ${px(8)};
    padding: 0 ${px(16)};
  }
  .area { border-radius: ${px(14)}; padding: ${px(10)} ${px(11)}; }
  .area-nome { font-size: ${px(13)}; font-weight: 700; color: #fff; }
  .area-linha { display: flex; align-items: baseline; gap: ${px(6)}; margin-top: ${px(4)}; }
  .area-valor { font-size: ${px(18)}; font-weight: 700; color: #fff; }
  .area-faixa { font-size: ${px(10)}; color: rgba(255,255,255,0.85); }
  .area-trilho {
    height: ${px(4)}; border-radius: ${px(999)};
    background: rgba(255,255,255,0.16); margin-top: ${px(7)};
  }
  .area-fill { height: 100%; border-radius: ${px(999)}; background: rgba(255,255,255,0.9); }

  .roda { padding: ${px(6)} ${px(30)} 0; }
  .asc {
    text-align: center; font-size: ${px(13)}; color: ${DOURADO};
    font-weight: 600; margin-top: ${px(4)};
  }
  .posicoes { padding: ${px(10)} ${px(20)} 0; }
  .pos {
    display: flex; justify-content: space-between;
    font-size: ${px(12)}; padding: ${px(5)} 0;
    border-bottom: ${px(1)} solid rgba(255,255,255,0.06);
  }
  .pos-nome { color: rgba(255,255,255,0.8); }
  .pos-grau { color: rgba(255,255,255,0.55); }

  .lista { padding: 0 ${px(16)}; display: flex; flex-direction: column; gap: ${px(8)}; }
  .transito, .evento, .membro {
    background: ${CARTAO}; border: ${px(1)} solid ${BORDA}; border-radius: ${px(12)};
    padding: ${px(11)} ${px(13)};
  }
  .transito-cabeca {
    display: flex; justify-content: space-between; align-items: center;
    font-size: ${px(13)}; font-weight: 600;
  }
  .casa { color: ${DOURADO}; font-size: ${px(11)}; }
  .transito-pe { font-size: ${px(11)}; color: rgba(255,255,255,0.5); margin-top: ${px(3)}; }

  .evento { display: flex; align-items: center; gap: ${px(12)}; }
  .evento-dia {
    font-size: ${px(11)}; color: ${DOURADO}; font-weight: 700;
    min-width: ${px(42)}; text-transform: uppercase;
  }
  .evento-titulo { font-size: ${px(13)}; font-weight: 600; }
  .evento-nota { font-size: ${px(11)}; color: rgba(255,255,255,0.5); margin-top: ${px(2)}; }

  .membro { display: flex; align-items: center; gap: ${px(11)}; }
  .avatar {
    width: ${px(34)}; height: ${px(34)}; border-radius: ${px(17)};
    border: ${px(2)} solid; display: flex; align-items: center; justify-content: center;
    font-size: ${px(15)}; font-weight: 700;
  }
  .membro-info { flex: 1; }
  .membro-nome { font-size: ${px(13)}; font-weight: 600; }
  .membro-nota { font-size: ${px(11)}; color: rgba(255,255,255,0.5); }
  .membro-score { font-size: ${px(17)}; font-weight: 700; }
  .rodape-tela {
    text-align: center; font-size: ${px(11)};
    color: rgba(255,255,255,0.4); margin-top: ${px(10)};
  }

  .abas {
    margin-top: ${px(14)}; display: flex; justify-content: space-around;
    padding: ${px(9)} 0 ${px(12)};
    border-top: ${px(1)} solid rgba(255,255,255,0.07);
    background: rgba(15,15,35,0.6);
  }
  .aba {
    display: flex; flex-direction: column; align-items: center; gap: ${px(3)};
    font-size: ${px(9)}; color: rgba(255,255,255,0.4);
  }
  .aba .ponto {
    width: ${px(16)}; height: ${px(16)}; border-radius: ${px(5)};
    border: ${px(1.5)} solid rgba(255,255,255,0.35);
  }
  .aba.on { color: ${DOURADO}; }
  .aba.on .ponto { border-color: ${DOURADO}; background: rgba(255,215,0,0.16); }
  `
}

export { TELAS }
