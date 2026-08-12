/**
 * As oito áreas, como o app as define.
 *
 * ── POR QUE É CÓPIA, E POR QUE ISSO NÃO APODRECE ───────────────────────────
 *
 * A fonte é `src/constants/lifeAreas.ts` e `src/constants/statusThresholds.ts`.
 * O gerador de marketing é `.mjs` e não importa TypeScript; `lerLiterais` até
 * lê esses arquivos, mas só de forma assíncrona, e o CSS da tela precisa das
 * cores no momento em que a string é montada.
 *
 * Então isto é cópia declarada, com uma trava: `areasDoApp.spec.mjs` lê os `.ts`
 * de verdade e falha se qualquer coisa aqui divergir. Se alguém acrescentar uma
 * nona área ou mudar o rosa do Amor no app, o teste quebra antes de a peça sair
 * mostrando uma tela que não existe.
 */

/** Ordem em que as áreas aparecem na Home. */
export const LIFE_AREA_ORDER = [
  'amor',
  'saude',
  'familia',
  'comunicacao',
  'carreira',
  'financas',
  'espiritualidade',
  'transformacao',
]

/** O gradiente de cada card, de `LIFE_AREA_COLORS`. */
export const LIFE_AREA_COLORS = {
  amor: ['#FF6B9D', '#FF8E8E'],
  carreira: ['#4ECDC4', '#44A08D'],
  financas: ['#FFD93D', '#FF9F40'],
  saude: ['#96E6A1', '#7BC142'],
  familia: ['#FF9F40', '#FFD93D'],
  espiritualidade: ['#B19CD9', '#8B5CF6'],
  comunicacao: ['#60A5FA', '#3B82F6'],
  transformacao: ['#F472B6', '#EC4899'],
}

/** O rótulo em pt-BR, de `LIFE_AREA_LABELS`. */
export const NOME_DA_AREA = {
  amor: 'Amor',
  carreira: 'Carreira',
  financas: 'Finanças',
  saude: 'Saúde',
  familia: 'Família',
  espiritualidade: 'Espiritualidade',
  comunicacao: 'Comunicação',
  transformacao: 'Transformação',
}

/**
 * As faixas do rótulo de área, de `STATUS_THRESHOLDS`.
 *
 * São os limiares do RÓTULO ("Positivo", "Moderado", "Crítico"), não os da cor
 * do score do dia, que em `HomeScreen.tsx` usa 65 e 40. Dois critérios
 * diferentes no app, e o mockup copia cada um no seu lugar.
 */
export const STATUS_THRESHOLDS = {
  criticalBelow: 35,
  positiveAbove: 62,
}

/**
 * Um exemplo de dia, para a tela ter números.
 *
 * Declarado, e não calculado: o score real sai do motor do app, que é
 * TypeScript e roda no aplicativo. Por isso nenhuma peça diz "hoje seu score é
 * X" — a tela mostra COMO a informação aparece, não o dia de quem lê.
 *
 * Os valores cobrem as três faixas de propósito, para a peça mostrar o app
 * dizendo também o que está ruim. Tela de produto só com número alto é a que
 * ninguém acredita.
 */
export const DIA_DE_EXEMPLO = {
  score: 72,
  areas: {
    amor: 78,
    saude: 64,
    familia: 71,
    comunicacao: 83,
    carreira: 45,
    financas: 58,
    espiritualidade: 69,
    transformacao: 31,
  },
}
