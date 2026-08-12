/**
 * A peça de recurso: o celular sobre o céu, e o texto embaixo.
 *
 * As peças de céu têm dois elementos, a foto e o texto. Esta tem três, e o
 * terceiro é o motivo de ela existir: a tela. O celular fica grande e cortado
 * pela borda inferior do texto, que é como post de produto se lê — a tela
 * aparece inteira o bastante para ser reconhecida e não disputa o rodapé.
 *
 * Reusa o fundo de `templateFoto.mjs` (as fotos da NASA) e as fontes embutidas,
 * para a peça de recurso pertencer visivelmente à mesma conta.
 */
import { fundoDeCeu } from './templateFoto.mjs'
import { SANS, MONO, SERIF, fontesEmbutidas, SANS_ESCOLHIDA } from './fontes.mjs'
import { NOITE, OURO, CREME, assinatura, CSS_ASSINATURA } from './marca.mjs'
import { molduraDeCelular, estiloDoApp } from './telaDoApp.mjs'

// mesma paleta da logo que `templateFoto` usa, pelos mesmos nomes
const VOID = NOITE
const VELLUM = CREME
const BRONZE = OURO

const escapar = (s) => String(s ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/**
 * @param {object} peca
 *   `{ olho, titulo, texto, onde, tela, dadosDaTela, signo, variacao, formato }`
 */
export function montarRecurso(peca) {
  const story = peca.formato === 'story'
  const largura = 1080
  const altura = story ? 1920 : 1350

  const fundo = fundoDeCeu(peca.signo || 'Aquário', peca.variacao || 0)

  /**
   * O celular ocupa o alto; o texto, o pé.
   *
   * No story sobra altura, então o aparelho aparece maior e inteiro. No feed
   * ele é cortado embaixo pelo bloco de texto, de propósito: cortar dá a
   * sensação de que a tela continua, e economiza a altura que o texto precisa.
   */
  const escala = story ? 1.0 : 0.78
  const n = String(peca.texto || '').length
  const corpo = n <= 220 ? 3.6 : n <= 320 ? 3.3 : 3.0

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

  .foto {
    position: absolute; inset: 0;
    background-image: url('${fundo.dataUri}');
    background-size: cover; background-position: center;
  }

  /* mais escuro que na peça de céu: aqui a foto é palco, não assunto */
  .veu {
    position: absolute; inset: 0;
    background: linear-gradient(180deg,
      rgba(7,10,24,0.55) 0%,
      rgba(7,10,24,0.62) 30%,
      rgba(7,10,24,0.92) 68%,
      rgba(7,10,24,0.98) 100%);
  }

  .conteudo {
    position: absolute; inset: 0; z-index: 2;
    padding: ${story ? '7cqw 7.5cqw 7cqw' : '5cqw 7.5cqw 6.5cqw'};
    display: flex; flex-direction: column; align-items: center;
  }

  /* O aparelho fica centrado no espaço que sobra: com margem inferior fixa ele
     colava no topo, e a tela de Grupos, que tem três linhas, deixava um vão de
     meio quadro entre o celular e o texto. (Sem crase aqui dentro: este bloco
     vive num template literal, e uma crase fecharia a string.) */
  .aparelho { flex: 0 0 auto; margin: auto 0 ${story ? '5cqw' : '3.2cqw'}; }

  ${estiloDoApp(escala)}

  .texto-bloco { width: 100%; margin-top: auto; }

  .olho {
    font-family: ${MONO}; font-size: 2.3cqw;
    letter-spacing: 0.22em; text-transform: uppercase; color: ${BRONZE};
    margin-bottom: 2cqw;
  }

  .titulo {
    font-family: ${SERIF}; font-weight: 600; color: ${VELLUM};
    font-size: 5.6cqw; line-height: 1.14; letter-spacing: 0.005em;
    white-space: pre-line;
    text-shadow: 0 0.4cqw 3cqw rgba(7,10,24,0.9);
  }

  .texto {
    font-family: ${SANS}; color: #E8E2D6;
    font-size: ${corpo}cqw; line-height: 1.44;
    margin-top: 2.6cqw; white-space: pre-line;
  }

  .rodape {
    margin-top: 3.4cqw; padding-top: 2.6cqw;
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
    <div class="conteudo">
      <div class="aparelho">${molduraDeCelular(peca.tela, peca.dadosDaTela || {})}</div>
      <div class="texto-bloco">
        ${peca.olho ? `<div class="olho">${escapar(peca.olho)}</div>` : ''}
        <h1 class="titulo">${escapar(peca.titulo)}</h1>
        ${peca.texto ? `<p class="texto">${escapar(peca.texto)}</p>` : ''}
        <div class="rodape">
          <span>${escapar(peca.onde || '')}</span>
          ${assinatura(24)}
        </div>
      </div>
    </div>
  </div>
</body></html>`
}
