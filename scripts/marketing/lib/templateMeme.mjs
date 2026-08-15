/**
 * O card de duas metades: o clichê em cima, a leitura embaixo.
 *
 * ── POR QUE UM TEMPLATE PRÓPRIO ────────────────────────────────────────────
 *
 * O card de céu e os slides do carrossel têm a mesma estrutura: um assunto, um
 * texto, um rodapé. Aqui a estrutura É o conteúdo — a peça só funciona se as
 * duas metades forem lidas uma contra a outra, e isso precisa estar no desenho,
 * não no texto.
 *
 * A metade de cima é riscada e apagada, a de baixo é dourada e cheia. Quem
 * passa o dedo entende antes de ler.
 *
 * ── O QUE ELE NÃO TEM ──────────────────────────────────────────────────────
 *
 * Campo estelar e foto de nebulosa ficaram de fora. As peças de leitura são
 * bonitas porque o assunto é o céu; aqui o assunto é uma correção, e fundo
 * decorado disputa atenção com a única coisa que importa, que é o contraste.
 *
 * Mantém a paleta e a assinatura para a peça continuar sendo da mesma conta.
 */
import { SANS, MONO, SERIF, fontesEmbutidas, SANS_ESCOLHIDA } from './fontes.mjs'
import { NOITE, NOITE_2, OURO, CREME } from './marca.mjs'

const escapar = (s) => String(s ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/**
 * O corpo da leitura acompanha o tamanho dela.
 *
 * Em degraus e não por fórmula: dois memes de tamanho parecido precisam sair
 * com o mesmo corpo, senão a variação lê como descuido no feed.
 */
function corpoDaLeitura(texto) {
  const n = String(texto || '').length
  if (n <= 180) return 4.8
  if (n <= 240) return 4.4
  if (n <= 300) return 4.1
  return 3.8
}

export function montarMeme(meme) {
  const largura = 1080
  const altura = 1350

  return `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8">
<style>
  ${fontesEmbutidas(SANS_ESCOLHIDA)}
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: ${largura}px; height: ${altura}px; overflow: hidden; background: ${NOITE}; }
  .peca {
    position: relative; width: ${largura}px; height: ${altura}px;
    container-type: size; overflow: hidden;
    display: flex; flex-direction: column;
  }

  /* ── metade de cima: o que dizem ────────────────────────────────────────
     Fundo mais claro e texto apagado. A metade errada não pode ser a mais
     bonita, ou a peça vende o clichê que veio desmentir. */
  .dizem {
    flex: 0 0 34%;
    background: ${NOITE_2};
    padding: 7cqw 7.5cqw 5cqw;
    display: flex; flex-direction: column; justify-content: center;
    border-bottom: 0.15cqw solid rgba(242,231,206,0.14);
  }
  .rot {
    font-family: ${MONO}; font-size: 2.4cqw; letter-spacing: 0.2em;
    text-transform: uppercase; color: rgba(242,231,206,0.42);
    margin-bottom: 2.6cqw;
  }
  .clichê {
    font-family: ${SANS}; font-weight: 400;
    font-size: 5.4cqw; line-height: 1.24; text-wrap: balance;
    color: rgba(242,231,206,0.50);
    /* riscado: diz "isto está errado" sem precisar da palavra */
    text-decoration: line-through;
    text-decoration-color: rgba(232,179,60,0.55);
    text-decoration-thickness: 0.35cqw;
  }

  /* ── metade de baixo: o que o mapa diz ──────────────────────────────── */
  .mapa {
    flex: 1;
    padding: 7cqw 7.5cqw 6cqw;
    display: flex; flex-direction: column;
    position: relative;
  }
  .brilho {
    position: absolute; left: 50%; top: -14cqw; width: 100cqw; height: 54cqw;
    transform: translateX(-50%); pointer-events: none;
    background: radial-gradient(ellipse at 50% 50%, rgba(232,179,60,0.14) 0%, rgba(232,179,60,0.04) 45%, rgba(11,14,34,0) 74%);
  }
  /**
   * O bloco de baixo flutua entre o topo e o rodapé.
   *
   * Sem isto a leitura colava no alto e sobrava um vão morto de quase um terço
   * da peça, porque o texto é bem mais curto que o espaço que ele tem. Centrar
   * é o que faz as duas metades parecerem desenhadas juntas.
   */
  .centro { margin-top: auto; margin-bottom: auto; position: relative; z-index: 2; }
  .rot-ouro {
    font-family: ${MONO}; font-size: 2.4cqw; letter-spacing: 0.2em;
    text-transform: uppercase; color: ${OURO}; margin-bottom: 3.4cqw;
    position: relative; z-index: 2;
  }
  .leitura {
    font-family: ${SANS}; color: ${CREME};
    font-size: ${corpoDaLeitura(meme.mapa)}cqw; line-height: 1.44;
    max-width: 96%; position: relative; z-index: 2;
  }
  .rodape {
    margin-top: auto; padding-top: 4cqw;
    border-top: 0.12cqw solid rgba(242,231,206,0.16);
    display: flex; justify-content: space-between; align-items: baseline;
    font-family: ${MONO}; font-size: 2.3cqw; letter-spacing: 0.12em;
    color: rgba(242,231,206,0.55); position: relative; z-index: 2;
  }
  .assina { color: ${OURO}; font-family: ${SERIF}; letter-spacing: 0.06em; }
</style></head>
<body>
  <div class="peca">
    <div class="dizem">
      <div class="rot">o que dizem</div>
      <div class="clichê">${escapar(meme.dizem)}</div>
    </div>
    <div class="mapa">
      <div class="brilho"></div>
      <div class="centro">
        <div class="rot-ouro">o que o mapa diz</div>
        <p class="leitura">${escapar(meme.mapa)}</p>
      </div>
      <div class="rodape">
        <span>astrologia calculada</span>
        <span class="assina">@tabula_estelar</span>
      </div>
    </div>
  </div>
</body></html>`
}
