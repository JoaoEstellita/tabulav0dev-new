/**
 * A peça nova: foto de céu real, e o texto por cima.
 *
 * O João olhou as peças e disse que a imagem estava confusa — e estava. O card
 * carregava roda do céu, tabela com dez posições, legenda de harmônico e tenso,
 * título, texto, eventos secundários e rodapé. Sete blocos disputando o mesmo
 * quadro, e o texto — que é o que ele quer que as pessoas leiam — no meio deles.
 *
 * Aqui há dois elementos: a foto e o texto. Nada mais.
 *
 * ── SOBRE AS FOTOS ─────────────────────────────────────────────────────────
 *
 * Vêm de `assets/ceu/`, do acervo público da NASA — material produzido pela
 * agência é domínio público nos EUA, com uso comercial permitido e sem crédito
 * obrigatório. A origem de cada arquivo está em `assets/ceu/CREDITOS.md`.
 *
 * A escolha é determinística pelo elemento do signo: a mesma peça regerada
 * devolve a mesma imagem, que é a mesma regra do campo estelar e do texto.
 */
import { readFileSync, readdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { SANS, MONO, SERIF, fontesEmbutidas, SANS_ESCOLHIDA } from './fontes.mjs'
import { primeirasFrases } from './interpretacao.mjs'
import { NOITE, OURO, CREME, assinatura, CSS_ASSINATURA } from './marca.mjs'

const AQUI = path.dirname(fileURLToPath(import.meta.url))
const PASTA_CEU = path.resolve(AQUI, '../assets/ceu')

/**
 * A paleta vem da logo, e não mais de escolhas soltas.
 *
 * `marca.mjs` guarda o azul da noite, o dourado da estrela e o creme de
 * "TÁBULA". Os nomes antigos continuam aqui como apelidos para o CSS abaixo não
 * ter que mudar linha por linha.
 */
const VOID = NOITE
const VELLUM = CREME
const BRONZE = OURO

/** Elemento de cada signo — decide a família visual do fundo. */
const ELEMENTO = {
  'Áries': 'fogo', 'Leão': 'fogo', 'Sagitário': 'fogo',
  'Touro': 'terra', 'Virgem': 'terra', 'Capricórnio': 'terra',
  'Gêmeos': 'ar', 'Libra': 'ar', 'Aquário': 'ar',
  'Câncer': 'agua', 'Escorpião': 'agua', 'Peixes': 'agua',
}

/** As fotos disponíveis, lidas uma vez. */
let acervo = null
function lerAcervo() {
  if (!acervo) {
    acervo = readdirSync(PASTA_CEU)
      .filter((f) => f.endsWith('.jpg'))
      .sort()
  }
  return acervo
}

/**
 * A foto do fundo, embutida em `data:` URI.
 *
 * Embutida, e não referenciada por caminho: o Chrome renderiza o HTML a partir
 * de um arquivo temporário que pode estar em qualquer lugar, e caminho relativo
 * quebrava silenciosamente — a peça saía com fundo preto e ninguém notava até
 * olhar o PNG.
 *
 * ── A PEÇA DA LUA NÃO USA FOTO DO SOL ──────────────────────────────────────
 *
 * As quatro imagens da família `fogo` são solar flares, e o João viu o
 * resultado: uma peça de Lua fora de curso, em Leão, com o Sol ocupando o
 * quadro inteiro. "Não tem nada a ver", e não tem mesmo.
 *
 * A escolha do elemento pelo signo continua valendo; o que muda é que, quando
 * quem protagoniza é a Lua, a família do Sol sai da lista.
 *
 * @param {string} signo   de onde sai o elemento
 * @param {number} variacao  para dois slides do mesmo elemento não repetirem
 * @param {string} corpo  o protagonista, quando há um: `'Moon'` evita o Sol
 */
export function fundoDeCeu(signo, variacao = 0, corpo = '') {
  const todas = lerAcervo()

  /**
   * A Lua tem família própria.
   *
   * A primeira correção só EXCLUÍA a família do Sol, e a peça da Lua acabava
   * com uma nebulosa emprestada, porque não havia foto de Lua no acervo. Agora
   * há quatro, e elas vêm primeiro: uma peça sobre a Lua com a Lua atrás
   * dispensa qualquer explicação.
   */
  if (corpo === 'Moon') {
    const daLua = todas.filter((f) => f.startsWith('lua'))
    if (daLua.length) {
      const escolhidaLua = daLua[Math.abs(variacao) % daLua.length]
      return comoDataUri(escolhidaLua)
    }
  }

  const familia = ELEMENTO[signo] || 'ar'

  // a família `lua` é reservada: só entra quando a Lua protagoniza
  const permitidas = todas.filter((f) => !f.startsWith('lua'))

  const doElemento = permitidas.filter((f) => f.startsWith(familia))
  const lista = doElemento.length ? doElemento : permitidas
  return comoDataUri(lista[Math.abs(variacao) % lista.length])
}

/** O arquivo embutido, do jeito que o Chrome consegue ler de qualquer lugar. */
function comoDataUri(arquivo) {
  const bytes = readFileSync(path.join(PASTA_CEU, arquivo))
  return {
    arquivo,
    dataUri: `data:image/jpeg;base64,${bytes.toString('base64')}`,
  }
}

/**
 * Uma peça: foto ao fundo, véu, e o texto.
 *
 * @param {object} peca
 *   `{ olho, titulo, texto, rodape, signo, variacao, formato }`
 *   formato: 'feed' (1080×1350) ou 'story' (1080×1920)
 */
export function montarFoto(peca) {
  const story = peca.formato === 'story'
  const largura = 1080
  const altura = story ? 1920 : 1350

  // `corpo` vem da peça: quando é a Lua, o fundo não pode ser uma foto do Sol
  const fundo = fundoDeCeu(peca.signo, peca.variacao || 0, peca.corpo || '')

  /**
   * O STORY NÃO É O POST ESTICADO.
   *
   * Era: a única diferença entre os dois formatos era a altura, 1920 em vez de
   * 1350. Mesmo texto, mesmo corpo, mesmo bloco. Um story se lê em cinco
   * segundos, passando o dedo; um post se lê parado. Texto de 400 caracteres em
   * corpo pequeno é o que faz alguém pular.
   *
   * No story entram as duas primeiras frases, em corpo grande. O texto inteiro
   * continua no post e na legenda, que é onde há tempo para ele.
   */
  const textoInteiro = String(peca.texto || '')
  const texto = story ? primeirasFrases(textoInteiro, 2) : textoInteiro

  /**
   * O corpo do texto acompanha o tamanho.
   *
   * Mesmo problema da carta e do slide: os textos vão de 120 a 400 caracteres, e
   * corpo fixo empurra o rodapé para fora em uns e deixa buraco em outros.
   */
  const n = texto.length
  const corpo = story
    ? (n <= 150 ? 5.6 : n <= 240 ? 5.0 : 4.4)
    : (n <= 160 ? 4.6 : n <= 260 ? 4.0 : n <= 360 ? 3.5 : 3.1)

  /**
   * Onde a foto é cortada, conforme o número do slide.
   *
   * Passeio suave pela imagem: começa no alto à esquerda e desce para a direita.
   * Sem isto, ampliar a foto mostraria sempre o mesmo centro.
   */
  const posicaoDoFoco = (foco) => {
    if (!foco && foco !== 0) return 'center'
    const passos = [
      '20% 20%', '50% 15%', '80% 25%', '15% 45%', '50% 50%', '85% 50%',
      '25% 70%', '55% 75%', '80% 80%', '35% 30%', '65% 40%', '45% 85%', '70% 60%',
    ]
    return passos[Math.abs(foco) % passos.length]
  }

  const escapar = (s) =>
    String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

  return `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8">
<style>
  ${fontesEmbutidas(SANS_ESCOLHIDA)}
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: ${largura}px; height: ${altura}px; overflow: hidden; background: ${VOID}; }

  .peca {
    position: relative; width: ${largura}px; height: ${altura}px;
    container-type: size; overflow: hidden;
  }

  /**
   * A foto, enquadrada.
   *
   * No carrossel os treze slides usam a MESMA imagem — doze fotos diferentes
   * viram bagunça ao arrastar, e a peça é sobre um evento só. O que muda é o
   * enquadramento: cada slide mostra um pedaço, e o conjunto lê como uma
   * sequência em vez de treze posts colados.
   */
  .foto {
    position: absolute; inset: 0;
    background-image: url('${fundo.dataUri}');
    background-size: ${peca.foco ? '135%' : 'cover'};
    background-position: ${posicaoDoFoco(peca.foco)};
  }

  /**
   * O véu.
   *
   * Sem ele o texto some sobre as partes claras da nebulosa. É gradiente e não
   * cor sólida: o topo fica quase limpo, para a foto aparecer, e escurece onde o
   * texto vive.
   */
  .veu {
    position: absolute; inset: 0;
    background: linear-gradient(180deg,
      rgba(7,10,24,0.30) 0%,
      rgba(7,10,24,0.55) 38%,
      rgba(7,10,24,0.88) 72%,
      rgba(7,10,24,0.96) 100%);
  }

  /**
   * No story sobra uma faixa embaixo.
   *
   * O adesivo de enquete é colado por cima, dentro do app do Instagram, na hora
   * de postar. Sem essa faixa ele cobre o rodapé e a assinatura. O template
   * antigo já reservava o espaço, e a linguagem de foto tinha perdido isso.
   */
  .conteudo {
    position: absolute; inset: 0; z-index: 2;
    padding: ${story ? '8cqw 7.5cqw 26cqw' : '8cqw 7.5cqw 7cqw'};
    display: flex; flex-direction: column; justify-content: flex-end;
  }

  /**
   * O glifo do signo, grande, atrás do texto.
   *
   * O João pediu imagem por signo: ao arrastar treze slides, a pessoa precisa
   * reconhecer o dela sem ler. O símbolo faz isso em meio segundo — e é o mesmo
   * desenho que ela vê no app, o que amarra as duas pontas.
   *
   * Semitransparente e no alto: identifica sem competir com a leitura, que foi
   * o problema de todas as versões anteriores desta peça.
   */
  .glifo {
    position: absolute; z-index: 1;
    top: 5cqw; right: 6cqw;
    width: 26cqw; height: 26cqw;
    color: ${VELLUM}; opacity: 0.22;
  }
  .glifo svg { width: 100%; height: 100%; display: block; }

  .olho {
    font-family: ${MONO}; font-size: 2.3cqw;
    letter-spacing: 0.22em; text-transform: uppercase; color: ${BRONZE};
    margin-bottom: 2.4cqw;
  }

  /* O título na serif do logotipo. O corpo do texto continua na sans:
     Cinzel tem altura de x pequena e vira decoração ilegível em parágrafo. */
  .titulo {
    font-family: ${SERIF}; font-weight: 600; color: ${VELLUM};
    font-size: ${story ? 8.6 : 7.2}cqw; line-height: 1.12; letter-spacing: 0.005em;
    text-wrap: balance; white-space: pre-line;
    text-shadow: 0 0.4cqw 3cqw rgba(7,10,24,0.9);
  }

  .texto {
    font-family: ${SANS}; color: #E8E2D6;
    font-size: ${corpo}cqw; line-height: 1.44;
    margin-top: 3.4cqw; white-space: pre-line;
    text-shadow: 0 0.3cqw 2cqw rgba(7,10,24,0.8);
  }

  .rodape {
    margin-top: 4.5cqw; padding-top: 3cqw;
    border-top: 0.12cqw solid rgba(237,230,216,0.22);
    font-family: ${MONO}; font-size: 2.2cqw; letter-spacing: 0.12em;
    color: rgba(237,230,216,0.55);
    display: flex; justify-content: space-between; align-items: center;
  }
  ${CSS_ASSINATURA}
</style></head>
<body>
  <div class="peca">
    <div class="foto"></div>
    <div class="veu"></div>
    ${peca.simbolo ? `<div class="glifo">${peca.simbolo}</div>` : ''}
    <div class="conteudo">
      ${peca.olho ? `<div class="olho">${escapar(peca.olho)}</div>` : ''}
      <h1 class="titulo">${escapar(peca.titulo)}</h1>
      ${texto ? `<p class="texto">${escapar(texto)}</p>` : ''}
      <div class="rodape">
        <span>${escapar(peca.rodape || '')}</span>
        ${assinatura(26)}
      </div>
    </div>
  </div>
</body></html>`
}
