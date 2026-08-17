import { defineConfig } from 'vitest/config'

/**
 * O limite padrão de 5s não serve para esta suíte.
 *
 * ── POR QUE ESTE ARQUIVO PASSOU A EXISTIR ──────────────────────────────────
 *
 * O projeto rodava sem config nenhuma, no padrão do Vitest. Isso funcionou
 * enquanto os testes eram de função pura. Os testes de marketing não são: eles
 * calculam o céu de verdade, com `astronomy-engine`, por trinta a sessenta dias
 * seguidos — é essa varredura que garante que nenhum assunto se repete no mês e
 * que nenhuma fala sai sem número calculado.
 *
 * Sessenta dias de efeméride não cabem em cinco segundos, e o resultado era
 * falha intermitente: `vozReel.spec` estourava numa execução, passava na
 * seguinte, e `assuntoDoDia.spec` estourava na terceira. Falha que muda
 * conforme a carga da máquina é a pior espécie — some quando se investiga e
 * volta no CI.
 *
 * Trinta segundos não é esconder lentidão: é reconhecer que o cálculo demora
 * mesmo. O que corrige lentidão de verdade é memoizar a efeméride dentro do
 * teste, como `vozReel.spec` passou a fazer (25s → 8s).
 *
 * Nada mais é configurado de propósito. `include`, `environment` e o resto
 * continuam no padrão, que é o que a suíte sempre usou.
 */
export default defineConfig({
  test: {
    testTimeout: 30_000,
    hookTimeout: 30_000,
  },
})
