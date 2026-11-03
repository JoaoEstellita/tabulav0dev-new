# Estudo Astrológico — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Entregar, dentro da aba Mapa, uma área de estudo com uma trilha de 12 lições e uma biblioteca de verbetes, em 4 idiomas, com o encaixe da personalização já pronto e inerte.

**Architecture:** Conteúdo como dado tipado (`Unidade` com `Bloco[]`), não markdown — um catálogo em `src/data/estudo/` montado por um `index.ts` que valida integridade. A aba Mapa ganha um alternador de dois (`Mapas | Estudo`) acima do alternador de sistemas existente. O progresso mora no AsyncStorage, como as outras preferências de leitura do app.

**Tech Stack:** React Native (Expo, RN 0.79.6) · TypeScript strict · Vitest · AsyncStorage

**Spec:** `docs/superpowers/specs/2026-11-02-estudo-astrologico-design.md`

## Global Constraints

- **4 idiomas obrigatórios** em toda string exibida: `pt-BR`, `en-US`, `es-ES`, `it-IT`. Nenhum pode ficar vazio.
- **es-ES sem tildes nem `ñ`**; **it-IT sem acentos**. Regra do projeto, verificada por teste.
- **en-US sem "will"** (regra de redação do projeto para catálogos).
- **Hermes não suporta regex `\p{...}`** — usar `/[̀-ͯ]/g` para remover acentos.
- **TypeScript strict, sem `any` implícito.** Comentários em pt-BR.
- **Arquivos em camelCase, componentes em PascalCase.**
- **`noUnusedLocals` está OFF** no projeto — não confie nele para pegar import morto.
- **Quíron NÃO entra** em nenhum verbete: o motor não o calcula.
- Rodar testes: `cd frontend && npx vitest run <caminho>`.

---

## File Structure

| arquivo | responsabilidade |
|---|---|
| `src/data/estudo/tipos.ts` | `T`, `Bloco`, `Unidade`, `GanchoChave`, `CategoriaVerbete` |
| `src/data/estudo/index.ts` | monta `CATALOGO`, `LICOES`, `VERBETES`; helpers de busca |
| `src/data/estudo/trilha-ato0.ts` … `trilha-ato4.ts` | as 12 lições, uma por ato |
| `src/data/estudo/verbetes-planetas.ts` | 10 planetas (+ 3 sincronicidades) |
| `src/data/estudo/verbetes-signos.ts` | 12 signos |
| `src/data/estudo/verbetes-casas.ts` | 12 casas |
| `src/data/estudo/verbetes-aspectos.ts` | ~7 aspectos |
| `src/data/estudo/verbetes-conceitos.ts` | ~12 conceitos |
| `src/data/estudo/__tests__/integridade.spec.ts` | paridade, ortografia, ids, links, contiguidade |
| `src/hooks/useProgressoDoEstudo.ts` | lidos + último aberto, no AsyncStorage |
| `src/components/estudo/BlocoDoEstudo.tsx` | renderiza um `Bloco` por tipo |
| `src/components/estudo/CardDaUnidade.tsx` | card da trilha e da biblioteca |
| `src/screens/estudo/EstudoScreen.tsx` | progresso, busca, trilha, biblioteca |
| `src/screens/estudo/LicaoScreen.tsx` | tela cheia de uma unidade |
| `src/screens/cosmos/CosmosScreen.tsx` | **modificar**: alternador `Mapas \| Estudo` |

Um arquivo por ato e por categoria: dois verbetes podem ser escritos em paralelo sem conflito, e nenhum arquivo cresce demais.

---

### Task 1: Tipos e a rede de proteção, antes de qualquer conteúdo

O risco dominante desta feature não é código quebrado — é **texto faltando que cai em fallback e ninguém vê**. Foi assim que o título curado de ASC/MC passou meses invisível neste app. Por isso os testes de integridade vêm **antes** do conteúdo: toda lição escrita depois já nasce guardada.

**Files:**
- Create: `src/data/estudo/tipos.ts`
- Create: `src/data/estudo/index.ts`
- Create: `src/data/estudo/verbetes-conceitos.ts`
- Test: `src/data/estudo/__tests__/integridade.spec.ts`

**Interfaces:**
- Consumes: `GLOSSARIO` de `src/data/glossarioAstrologico.ts` (`Record<string, TermoGlossario>`)
- Produces: `CATALOGO: Unidade[]`, `LICOES: Unidade[]`, `VERBETES: Unidade[]`, `porId(id): Unidade | null`, e os tipos `T`, `Bloco`, `Unidade`, `GanchoChave`, `CategoriaVerbete`

- [ ] **Step 1: Escrever o teste de integridade (vai falhar — nada existe ainda)**

```ts
// src/data/estudo/__tests__/integridade.spec.ts
import { describe, it, expect } from 'vitest'
import { CATALOGO, LICOES, VERBETES, porId } from '../index'
import type { Bloco, T } from '../tipos'
import { GLOSSARIO } from '../../glossarioAstrologico'

const IDIOMAS = ['pt-BR', 'en-US', 'es-ES', 'it-IT'] as const

/** Todo campo `T` de uma unidade, com um rótulo que diz onde ele está. */
function camposDeTexto(u: { id: string; titulo: T; resumo: T; blocos: Bloco[] }) {
  const out: Array<{ onde: string; t: T }> = [
    { onde: `${u.id}.titulo`, t: u.titulo },
    { onde: `${u.id}.resumo`, t: u.resumo },
  ]
  u.blocos.forEach((b, i) => {
    if (b.tipo === 'ganchoPessoal') return
    if (b.tipo === 'sincronicidade') {
      out.push({ onde: `${u.id}.bloco${i}.descoberta`, t: b.descoberta })
      out.push({ onde: `${u.id}.bloco${i}.noMundo`, t: b.noMundo })
      out.push({ onde: `${u.id}.bloco${i}.leitura`, t: b.leitura })
      return
    }
    out.push({ onde: `${u.id}.bloco${i}.texto`, t: b.texto })
  })
  return out
}

describe('integridade do catálogo de estudo', () => {
  it('todo texto existe nos 4 idiomas, não vazio', () => {
    const faltando: string[] = []
    for (const u of CATALOGO) {
      for (const { onde, t } of camposDeTexto(u)) {
        for (const lang of IDIOMAS) {
          if (!t[lang] || !t[lang].trim()) faltando.push(`${onde} [${lang}]`)
        }
      }
    }
    expect(faltando.slice(0, 10), 'texto faltando cai em fallback e some da tela').toEqual([])
  })

  it('es-ES sem tildes nem ñ, it-IT sem acentos', () => {
    const erros: string[] = []
    for (const u of CATALOGO) {
      for (const { onde, t } of camposDeTexto(u)) {
        if (/[áéíóúñ]/i.test(t['es-ES'])) erros.push(`${onde} [es-ES]`)
        if (/[àèéìòù]/i.test(t['it-IT'])) erros.push(`${onde} [it-IT]`)
      }
    }
    expect(erros.slice(0, 10), 'regra de ortografia do projeto').toEqual([])
  })

  it('ids são únicos', () => {
    const ids = CATALOGO.map((u) => u.id)
    expect(new Set(ids).size, `id repetido em: ${ids.filter((x, i) => ids.indexOf(x) !== i)}`)
      .toBe(ids.length)
  })

  it('verTambem aponta para id que existe', () => {
    const mortos: string[] = []
    for (const u of CATALOGO) {
      for (const alvo of u.verTambem) if (!porId(alvo)) mortos.push(`${u.id} -> ${alvo}`)
    }
    expect(mortos, 'link morto é um beco invisível').toEqual([])
  })

  it('termos declarados existem no glossário', () => {
    const fantasmas: string[] = []
    for (const u of CATALOGO) {
      for (const termo of u.termos) if (!GLOSSARIO[termo]) fantasmas.push(`${u.id} -> ${termo}`)
    }
    expect(fantasmas, 'chave que não casa + fallback = bug invisível').toEqual([])
  })

  it('minutos batem com o tamanho do texto', () => {
    const mentiras: string[] = []
    for (const u of CATALOGO) {
      const palavras = camposDeTexto(u)
        .reduce((n, { t }) => n + t['pt-BR'].split(/\s+/).length, 0)
      // 180 palavras/min é leitura confortável em celular.
      const esperado = Math.max(1, Math.round(palavras / 180))
      if (Math.abs(u.minutos - esperado) > 2) {
        mentiras.push(`${u.id}: diz ${u.minutos} min, tem ${palavras} palavras (~${esperado})`)
      }
    }
    expect(mentiras, 'tempo de leitura tem de ser honesto').toEqual([])
  })

  it('a trilha é contígua de 1 a 12, sem buraco nem repetição', () => {
    const ordens = LICOES.map((l) => l.ordem).sort((a, b) => (a! - b!))
    expect(ordens).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
    for (const l of LICOES) {
      expect([0, 1, 2, 3, 4], `${l.id}: ato fora da faixa`).toContain(l.ato)
    }
  })

  it('Quíron não aparece — o motor não o calcula', () => {
    const cita = CATALOGO.filter((u) => camposDeTexto(u)
      .some(({ t }) => /qu[ií]ron|chiron/i.test(t['pt-BR'])))
    expect(cita.map((u) => u.id), 'verbete prometeria algo que o mapa não mostra').toEqual([])
  })
})
```

- [ ] **Step 2: Rodar o teste e confirmar que falha**

Run: `cd frontend && npx vitest run src/data/estudo/__tests__/integridade.spec.ts`
Expected: FAIL — `Cannot find module '../index'`

- [ ] **Step 3: Escrever os tipos**

```ts
// src/data/estudo/tipos.ts

/** Os 4 idiomas do app. Toda string exibida existe nos quatro. */
export type IdiomaEstudo = 'pt-BR' | 'en-US' | 'es-ES' | 'it-IT'
export type T = Record<IdiomaEstudo, string>

/**
 * O que a fase 2 vai ler do mapa da pessoa.
 *
 * ⚠️ EXISTE DESDE AGORA, INERTE. Na fase 1 o renderizador pula o bloco. A
 * condição acordada foi que a personalização não exigisse reescrever o
 * conteúdo já publicado — por isso o encaixe nasce junto.
 */
export type GanchoChave =
  | 'planeta-na-casa'
  | 'planeta-no-signo'
  | 'aspecto-mais-exato'
  | 'casa-do-ano'
  | 'transito-de-hoje'

export type CategoriaVerbete = 'planeta' | 'signo' | 'casa' | 'aspecto' | 'conceito'

export type Bloco =
  | { tipo: 'paragrafo'; texto: T }
  /** A frase que o leitor deveria levar embora. */
  | { tipo: 'destaque'; texto: T }
  /**
   * ⚠️ SEPARA FATO DE LEITURA NA ESTRUTURA. `ano` e `descoberta` são
   * verificáveis; `leitura` é interpretação da tradição. O texto não pode
   * apresentar a segunda como demonstrada — é o que protege a credibilidade
   * em vez de gastá-la.
   */
  | { tipo: 'sincronicidade'; ano: number; descoberta: T; noMundo: T; leitura: T }
  | { tipo: 'exemplo'; texto: T }
  /** O que a astrologia NÃO afirma. Nota discreta, nunca alarme. */
  | { tipo: 'cuidado'; texto: T }
  | { tipo: 'ganchoPessoal'; chave: GanchoChave }

export interface Unidade {
  id: string
  tipo: 'licao' | 'verbete'
  /** Só lição: 0 a 4. */
  ato?: 0 | 1 | 2 | 3 | 4
  /** Só lição: 1 a 12. */
  ordem?: number
  /** Só verbete. */
  categoria?: CategoriaVerbete
  titulo: T
  /** ⚠️ UMA frase. Serve o card da trilha E o toque no glossário — duas
   *  fontes divergiriam no primeiro ajuste. */
  resumo: T
  blocos: Bloco[]
  /**
   * Chaves de `GLOSSARIO` que esta unidade cobre.
   *
   * ⚠️ SÓ O VERBETE É DESTINO DO "VER A FUNDO". Numa LIÇÃO este campo serve
   * só à busca — se lição e verbete disputassem o mesmo termo, o popup do
   * glossário não saberia para onde mandar. O teste da Task 9 cobra isso.
   */
  termos: string[]
  /** Ids de outras unidades. */
  verTambem: string[]
  minutos: number
}
```

- [ ] **Step 4: Escrever o índice e um verbete semente**

```ts
// src/data/estudo/verbetes-conceitos.ts
import type { Unidade } from './tipos'

export const VERBETES_CONCEITOS: Unidade[] = [
  {
    id: 'conceito-orbe',
    tipo: 'verbete',
    categoria: 'conceito',
    titulo: {
      'pt-BR': 'Orbe', 'en-US': 'Orb', 'es-ES': 'Orbe', 'it-IT': 'Orbe',
    },
    resumo: {
      'pt-BR': 'A distância que ainda conta como encontro entre dois planetas.',
      'en-US': 'The distance that still counts as a meeting between two planets.',
      'es-ES': 'La distancia que todavia cuenta como encuentro entre dos planetas.',
      'it-IT': 'La distanza che conta ancora come incontro tra due pianeti.',
    },
    blocos: [
      {
        tipo: 'paragrafo',
        texto: {
          'pt-BR': 'Dois planetas quase nunca estão no ângulo exato. A orbe é a folga que a tradição aceita: quanto mais perto do exato, mais o encontro pesa.',
          'en-US': 'Two planets are almost never at the exact angle. The orb is the slack tradition accepts: the closer to exact, the more the meeting weighs.',
          'es-ES': 'Dos planetas casi nunca estan en el angulo exacto. El orbe es la holgura que la tradicion acepta: cuanto mas cerca del exacto, mas pesa el encuentro.',
          'it-IT': 'Due pianeti non sono quasi mai all angolo esatto. L orbe e la tolleranza che la tradizione accetta: piu e vicino all esatto, piu l incontro pesa.',
        },
      },
      {
        tipo: 'destaque',
        texto: {
          'pt-BR': 'Orbe pequena, efeito nítido. Orbe larga, efeito de fundo.',
          'en-US': 'Small orb, sharp effect. Wide orb, background effect.',
          'es-ES': 'Orbe pequeno, efecto nitido. Orbe amplio, efecto de fondo.',
          'it-IT': 'Orbe stretto, effetto netto. Orbe ampio, effetto di sfondo.',
        },
      },
    ],
    termos: ['orbe'],
    verTambem: [],
    minutos: 1,
  },
]
```

```ts
// src/data/estudo/index.ts
import type { Unidade } from './tipos'
import { VERBETES_CONCEITOS } from './verbetes-conceitos'

export * from './tipos'

/**
 * O catálogo inteiro.
 *
 * ⚠️ A ORDEM DOS ARRAYS NÃO É A ORDEM DA TELA. A trilha ordena por `ordem` e a
 * biblioteca por categoria; juntar tudo aqui serve à busca e à validação.
 */
export const CATALOGO: Unidade[] = [
  ...VERBETES_CONCEITOS,
]

export const LICOES: Unidade[] = CATALOGO
  .filter((u) => u.tipo === 'licao')
  .sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0))

export const VERBETES: Unidade[] = CATALOGO.filter((u) => u.tipo === 'verbete')

const PORID = new Map(CATALOGO.map((u) => [u.id, u]))

export function porId(id: string): Unidade | null {
  return PORID.get(id) ?? null
}
```

- [ ] **Step 5: Rodar os testes**

Run: `cd frontend && npx vitest run src/data/estudo/__tests__/integridade.spec.ts`
Expected: o teste da trilha contígua FALHA (ainda não há lições); os outros 7 PASSAM.

- [ ] **Step 6: Deixar o teste da trilha tolerante ao catálogo vazio**

Substituir o corpo do teste `'a trilha é contígua de 1 a 12, sem buraco nem repetição'` por:

```ts
  it('a trilha é contígua de 1 a 12, sem buraco nem repetição', () => {
    // ⚠️ Tolera a trilha VAZIA de propósito: as lições entram na Task 2, e um
    // teste vermelho entre as duas tarefas treinaria a ignorar o vermelho.
    // Assim que a primeira lição existir, a contiguidade passa a ser cobrada.
    if (LICOES.length === 0) return
    const ordens = LICOES.map((l) => l.ordem).sort((a, b) => (a! - b!))
    expect(ordens).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
    for (const l of LICOES) {
      expect([0, 1, 2, 3, 4], `${l.id}: ato fora da faixa`).toContain(l.ato)
    }
  })
```

- [ ] **Step 7: Rodar e confirmar verde**

Run: `cd frontend && npx vitest run src/data/estudo/__tests__/integridade.spec.ts`
Expected: PASS (8 testes)

- [ ] **Step 8: Typecheck**

Run: `cd frontend && npx tsc --noEmit -p tsconfig.json`
Expected: sem erro

- [ ] **Step 9: Commit**

```bash
git add src/data/estudo frontend/docs 2>/dev/null; git add src/data/estudo
git commit -F - <<'MSG'
feat(estudo): tipos e a rede de proteção do catálogo

Os testes de integridade vêm ANTES do conteúdo, de propósito. O risco
dominante desta feature não é código quebrado: é texto faltando que cai
em fallback e some da tela sem erro — foi assim que o título curado de
ASC/MC passou meses invisível neste app.

Oito travas desde a primeira linha: paridade nos 4 idiomas campo a
campo, ortografia es-ES/it-IT, ids únicos, verTambem sem link morto,
termos casando com chave real do glossário, minutos honestos contra o
tamanho do texto, trilha contígua e a ausência de Quíron (o motor não o
calcula).

O bloco `sincronicidade` separa fato de leitura na própria estrutura:
`ano`/`descoberta` são verificáveis, `leitura` é tradição.

`ganchoPessoal` nasce inerte — a fase 2 não pode exigir reescrever o
conteúdo da fase 1.
MSG
```

---

## Nota de método para as tarefas de conteúdo (2 a 5)

Um plano não pode conter toda a prosa das 12 lições nos 4 idiomas — isso seria o
próprio conteúdo, não o plano dele. As tarefas de conteúdo especificam, por
unidade: **id, título nos 4 idiomas, os blocos exigidos, os termos que liga, o
`verTambem` e o `minutos` alvo** — e a Task 2 traz **uma lição escrita por
inteiro** como modelo de voz e densidade.

A completude é cobrada pelos testes da Task 1, que falham nomeando o campo e o
idioma faltante. Eles são a especificação executável de "pronto".

⚠️ **Escreva pt-BR primeiro, depois traduza.** Escrever direto em es-ES convida
a tilde e em it-IT a acento — os dois quebram o teste de ortografia.

---

### Task 2: Ato 0 — por que o céu diz algo (lições 1 a 3)

⚠️ **Este ato carrega a voz do João** (planetas como gravidade a transmutar, não
como destino). O que esta task produz é um **rascunho para ele revisar linha a
linha**, não texto final.

**Files:**
- Create: `src/data/estudo/trilha-ato0.ts`
- Modify: `src/data/estudo/index.ts`
- Modify: `src/data/estudo/__tests__/integridade.spec.ts`

**Interfaces:**
- Consumes: `Unidade`, `T` de `./tipos`
- Produces: `TRILHA_ATO0: Unidade[]` — ids `licao-01-ceu-observado`, `licao-02-gravidade-nao-destino`, `licao-03-quem-atravessa`

- [ ] **Step 1: Escrever a lição 1 por inteiro, como modelo**

```ts
// src/data/estudo/trilha-ato0.ts
import type { Unidade } from './tipos'

export const TRILHA_ATO0: Unidade[] = [
  {
    id: 'licao-01-ceu-observado',
    tipo: 'licao',
    ato: 0,
    ordem: 1,
    titulo: {
      'pt-BR': 'O céu que olharam por cinco mil anos',
      'en-US': 'The sky they watched for five thousand years',
      'es-ES': 'El cielo que miraron por cinco mil anos',
      'it-IT': 'Il cielo che hanno guardato per cinquemila anni',
    },
    resumo: {
      'pt-BR': 'Antes de significar qualquer coisa, a astrologia foi um registro do que se repetia.',
      'en-US': 'Before it meant anything, astrology was a record of what repeated.',
      'es-ES': 'Antes de significar algo, la astrologia fue un registro de lo que se repetia.',
      'it-IT': 'Prima di significare qualcosa, l astrologia fu un registro di cio che si ripeteva.',
    },
    blocos: [
      {
        tipo: 'paragrafo',
        texto: {
          'pt-BR': 'A astrologia começou como contabilidade. Povos que dependiam da cheia de um rio ou da chegada da chuva precisavam saber quando. O céu era o único relógio grande o bastante: as mesmas estrelas voltavam à mesma posição, e a enchente vinha junto.',
          'en-US': 'Astrology began as bookkeeping. Peoples who depended on a river flooding or the rains arriving needed to know when. The sky was the only clock large enough: the same stars returned to the same position, and the flood came with them.',
          'es-ES': 'La astrologia empezo como contabilidad. Pueblos que dependian de la crecida de un rio o de la llegada de la lluvia necesitaban saber cuando. El cielo era el unico reloj bastante grande: las mismas estrellas volvian a la misma posicion, y la crecida venia con ellas.',
          'it-IT': 'L astrologia nacque come contabilita. Popoli che dipendevano dalla piena di un fiume o dall arrivo della pioggia dovevano sapere quando. Il cielo era l unico orologio abbastanza grande: le stesse stelle tornavano alla stessa posizione, e la piena arrivava con loro.',
        },
      },
      {
        tipo: 'paragrafo',
        texto: {
          'pt-BR': 'O passo seguinte foi humano e inevitável: se o céu marca a cheia, marcaria também a colheita, a guerra, o nascimento de um rei. Mesopotâmia, Egito, Índia, China e Mesoamérica fizeram essa passagem separadamente, sem contato entre si.',
          'en-US': 'The next step was human and inevitable: if the sky marks the flood, it would also mark the harvest, the war, the birth of a king. Mesopotamia, Egypt, India, China and Mesoamerica made that leap separately, with no contact between them.',
          'es-ES': 'El paso siguiente fue humano e inevitable: si el cielo marca la crecida, marcaria tambien la cosecha, la guerra, el nacimiento de un rey. Mesopotamia, Egipto, India, China y Mesoamerica dieron ese paso por separado, sin contacto entre si.',
          'it-IT': 'Il passo seguente fu umano e inevitabile: se il cielo segna la piena, segnerebbe anche il raccolto, la guerra, la nascita di un re. Mesopotamia, Egitto, India, Cina e Mesoamerica fecero quel passaggio separatamente, senza contatto tra loro.',
        },
      },
      {
        tipo: 'destaque',
        texto: {
          'pt-BR': 'Cinco civilizações sem contato chegaram à mesma intuição: o que acontece em cima acompanha o que acontece embaixo.',
          'en-US': 'Five civilizations with no contact reached the same intuition: what happens above accompanies what happens below.',
          'es-ES': 'Cinco civilizaciones sin contacto llegaron a la misma intuicion: lo que pasa arriba acompana lo que pasa abajo.',
          'it-IT': 'Cinque civilta senza contatto giunsero alla stessa intuizione: cio che accade sopra accompagna cio che accade sotto.',
        },
      },
      {
        tipo: 'cuidado',
        texto: {
          'pt-BR': 'Convergência não é prova. Que povos distantes tenham chegado a leituras parecidas mostra que a pergunta é antiga e universal — não que a resposta esteja demonstrada.',
          'en-US': 'Convergence is not proof. That distant peoples reached similar readings shows the question is old and universal, not that the answer is demonstrated.',
          'es-ES': 'Convergencia no es prueba. Que pueblos distantes llegaran a lecturas parecidas muestra que la pregunta es antigua y universal, no que la respuesta este demostrada.',
          'it-IT': 'Convergenza non e prova. Che popoli distanti siano giunti a letture simili mostra che la domanda e antica e universale, non che la risposta sia dimostrata.',
        },
      },
    ],
    termos: [],
    verTambem: ['licao-02-gravidade-nao-destino'],
    minutos: 2,
  },
]
```

- [ ] **Step 2: Escrever a lição 2 — "Gravidade, não destino"**

`id: licao-02-gravidade-nao-destino` · `ato: 0` · `ordem: 2` · `termos: ['transito']` · `verTambem: ['licao-03-quem-atravessa']` · `minutos: 3`

Títulos: pt `Gravidade, não destino` · en `Gravity, not destiny` · es `Gravedad, no destino` · it `Gravita, non destino`

Blocos, nesta ordem:
1. `paragrafo` — a diferença entre um astro **empurrar** e um astro **mandar**. O trânsito cria inclinação no terreno, não um trilho.
2. `paragrafo` — o que muda entre reagir à inclinação e usá-la: a mesma pressão de Saturno vira cobrança sofrida ou estrutura construída, e a diferença está em quem atravessa.
3. `destaque` — a tese do ato: **o planeta puxa; quem decide a direção é quem caminha.**
4. `exemplo` — Saturno sobre o Sol, lido das duas formas.
5. `cuidado` — não é promessa de que a vontade anula a dificuldade; é a recusa de ler o mapa como sentença.

- [ ] **Step 3: Escrever a lição 3 — "Quem atravessa a experiência"**

`id: licao-03-quem-atravessa` · `ato: 0` · `ordem: 3` · `termos: ['natal']` · `verTambem: ['licao-04-planeta-o-que']` · `minutos: 3`

Títulos: pt `Quem atravessa a experiência` · en `Who crosses the experience` · es `Quien atraviesa la experiencia` · it `Chi attraversa l esperienza`

Blocos:
1. `paragrafo` — o mapa descreve o terreno de uma travessia, não o viajante.
2. `paragrafo` — somos espíritos atravessando a experiência material; os planetas são a topografia percorrida, não a autoria do percurso.
3. `destaque` — o mapa é o terreno, não a sentença.
4. `cuidado` — ⚠️ **o bloco mais importante do curso.** O que a astrologia não afirma: não prevê acontecimento, não determina escolha, não substitui médico, advogado nem terapeuta.

- [ ] **Step 4: Somar ao catálogo**

```ts
// src/data/estudo/index.ts
import { TRILHA_ATO0 } from './trilha-ato0'

export const CATALOGO: Unidade[] = [
  ...TRILHA_ATO0,
  ...VERBETES_CONCEITOS,
]
```

- [ ] **Step 5: Rodar — a contiguidade vai falhar, é esperado**

Run: `cd frontend && npx vitest run src/data/estudo/__tests__/integridade.spec.ts`
Expected: FAIL só em "a trilha é contígua" (`[1,2,3]` vs `[1..12]`); os outros 7 passam.

- [ ] **Step 6: Cobrar ausência de BURACO em vez do total de 12**

Substituir, dentro desse teste, as duas linhas que comparam com `[1..12]` por:

```ts
    // ⚠️ Enquanto a trilha é escrita, cobra-se a ausência de BURACO, não o
    // total — senão o teste fica vermelho entre as tasks 2 e 4 e treina a
    // ignorar vermelho. Na Task 4 isto volta a exigir as 12.
    const ordens = LICOES.map((l) => l.ordem).sort((a, b) => (a! - b!))
    expect(ordens).toEqual(ordens.map((_, i) => i + 1))
```

- [ ] **Step 7: Rodar, typecheck e commitar**

Run: `cd frontend && npx vitest run src/data/estudo && npx tsc --noEmit -p tsconfig.json`

```bash
git add src/data/estudo
git commit -m "feat(estudo): Ato 0, por que o ceu diz algo (licoes 1 a 3)"
```

---

### Task 3: Atos 1 e 2 — as perguntas de um mapa (lições 4 a 8)

**Files:**
- Create: `src/data/estudo/trilha-ato1.ts`, `src/data/estudo/trilha-ato2.ts`
- Modify: `src/data/estudo/index.ts`

**Interfaces:**
- Produces: `TRILHA_ATO1` e `TRILHA_ATO2`

| id | ordem | título pt-BR | termos | min |
|---|---|---|---|---|
| `licao-04-planeta-o-que` | 4 | O planeta diz **o quê** | `[]` | 3 |
| `licao-05-signo-como` | 5 | O signo diz **como** | `[]` | 3 |
| `licao-06-casa-onde` | 6 | A casa diz **onde** | `['casa','cuspide']` | 3 |
| `licao-07-aspecto-conversa` | 7 | O aspecto é a conversa entre dois planetas | `['conjuncao','oposicao','quadratura','trigono','sextil']` | 4 |
| `licao-08-orbe-e-forca` | 8 | Orbe e força | `['orbe']` | 2 |

⚠️ **A lição 8 põe `conceito-orbe` no `verTambem`** — é o verbete que aprofunda
o que ela introduz, e o par lição→verbete é o movimento que a biblioteca
existe para permitir.

Cada lição: 3 a 5 blocos, ao menos um `destaque`, `verTambem` para a seguinte.

⚠️ **A lição 7 precisa de um `cuidado` dizendo que tenso não é ruim.** É a
confusão mais comum de iniciante, e sem desfazê-la o app inteiro assusta — a
tela mostra quadraturas o tempo todo.

⚠️ **A lição 6 tem de explicar por que o mesmo planeta muda de assunto conforme
a casa.** É o que liga as três perguntas e faz o mapa parar de ser lista de
símbolos.

- [ ] **Step 1: Escrever `trilha-ato1.ts` (4 a 6)** no formato da Task 2
- [ ] **Step 2: Escrever `trilha-ato2.ts` (7 e 8)**
- [ ] **Step 3: Somar ao `CATALOGO`**
- [ ] **Step 4: Rodar** `npx vitest run src/data/estudo` — verde (1 a 8, sem buraco)
- [ ] **Step 5: Typecheck** `npx tsc --noEmit -p tsconfig.json`
- [ ] **Step 6: Commit** — `feat(estudo): Atos 1 e 2, planeta signo casa aspecto orbe`

---

### Task 4: Atos 3 e 4 — o tempo, e ler sozinho (lições 9 a 12)

**Files:**
- Create: `src/data/estudo/trilha-ato3.ts`, `src/data/estudo/trilha-ato4.ts`
- Modify: `src/data/estudo/index.ts`, `src/data/estudo/__tests__/integridade.spec.ts`

| id | ordem | título pt-BR | termos | min |
|---|---|---|---|---|
| `licao-09-transito` | 9 | Trânsito: o céu de hoje no mapa de sempre | `['transito','natal']` | 3 |
| `licao-10-ciclos` | 10 | Os ciclos que importam | `['transito','retrogrado']` | 4 |
| `licao-11-ordem-de-leitura` | 11 | A ordem de leitura | `['ascendente','stellium']` | 3 |
| `licao-12-seu-mapa` | 12 | Seu mapa, do começo ao fim | `['ascendente','casa','orbe']` | 5 |

⚠️ **A lição 9 é a mais importante para o uso diário:** separa o que a pessoa
**é** (natal, não muda) do que está **acontecendo** (trânsito, passa). Sem ela,
todo número da Home lê como julgamento permanente.

⚠️ **A lição 12 recebe os `ganchoPessoal`** — pelo menos três
(`'planeta-no-signo'`, `'planeta-na-casa'`, `'aspecto-mais-exato'`), inertes,
nos pontos onde a fase 2 vai aterrissar o mapa de quem lê.

- [ ] **Step 1: Escrever `trilha-ato3.ts` (9 e 10)**
- [ ] **Step 2: Escrever `trilha-ato4.ts` (11 e 12), com os 3 ganchos na 12**
- [ ] **Step 3: Somar ao `CATALOGO`**
- [ ] **Step 4: Voltar a exigir as 12 no teste**

```ts
    const ordens = LICOES.map((l) => l.ordem).sort((a, b) => (a! - b!))
    expect(ordens, 'a trilha tem 12 licoes e nenhuma pode faltar')
      .toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
```

- [ ] **Step 5: Acrescentar o teste do gancho inerte**

```ts
  it('a lição 12 traz os ganchos da fase 2, e eles não têm texto', () => {
    const l12 = LICOES.find((l) => l.ordem === 12)!
    const ganchos = l12.blocos.filter((b) => b.tipo === 'ganchoPessoal')
    expect(ganchos.length, 'a ponte para a fase 2 sumiu').toBeGreaterThanOrEqual(3)
    for (const g of ganchos) {
      expect(Object.keys(g).sort(), 'gancho com texto deixaria de ser inerte')
        .toEqual(['chave', 'tipo'])
    }
  })
```

- [ ] **Step 6: Rodar tudo e commitar**

Run: `cd frontend && npx vitest run src/data/estudo && npx tsc --noEmit -p tsconfig.json`
Commit: `feat(estudo): Atos 3 e 4, a trilha fecha em 12 licoes`

---

### Task 5: Verbetes dos planetas, com as sincronicidades de descoberta

**Files:**
- Create: `src/data/estudo/verbetes-planetas.ts`
- Modify: `src/data/estudo/index.ts`, `src/data/estudo/__tests__/integridade.spec.ts`

**Interfaces:**
- Produces: `VERBETES_PLANETAS: Unidade[]` — `planeta-sol`, `planeta-lua`, `planeta-mercurio`, `planeta-venus`, `planeta-marte`, `planeta-jupiter`, `planeta-saturno`, `planeta-urano`, `planeta-netuno`, `planeta-plutao`

Cada um: `categoria: 'planeta'`, 2 a 3 minutos, com `paragrafo` (a função),
`destaque` (**por que esse planeta carrega essa força** — o pedido explícito do
João) e `verTambem` para o signo que rege.

Os três transnetunianos ganham `sincronicidade`:

| id | ano | `descoberta` (fato) | `noMundo` (fato) |
|---|---|---|---|
| `planeta-urano` | 1781 | Herschel identifica o primeiro planeta achado com telescópio | Revolução Americana (1776) e Francesa (1789); Galvani publica sobre eletricidade animal em 1791 |
| `planeta-netuno` | 1846 | Le Verrier prevê a posição por cálculo e Galle o encontra | No mesmo ano, Morton demonstra publicamente a anestesia com éter |
| `planeta-plutao` | 1930 | Tombaugh o encontra | Oito anos antes da fissão nuclear; auge da psicanálise e da psicologia das massas |

⚠️ **`leitura` é onde entra a interpretação** — ruptura e eletricidade,
dissolução e anestesia, poder e transformação. A data é fato; a correspondência
é tradição, e o texto não pode apresentá-la como demonstrada.

- [ ] **Step 1: Escrever o teste da sincronicidade**

```ts
  it('só os transnetunianos têm sincronicidade, e com ano plausível', () => {
    const comSinc = CATALOGO.filter((u) => u.blocos.some((b) => b.tipo === 'sincronicidade'))
    expect(comSinc.map((u) => u.id).sort())
      .toEqual(['planeta-netuno', 'planeta-plutao', 'planeta-urano'])
    for (const u of comSinc) {
      for (const b of u.blocos) {
        if (b.tipo !== 'sincronicidade') continue
        expect(b.ano, `${u.id}: ano fora do plausível`).toBeGreaterThan(1700)
        expect(b.ano, `${u.id}: ano fora do plausível`).toBeLessThan(1950)
      }
    }
  })
```

- [ ] **Step 2: Rodar e ver falhar** — a lista vem vazia
- [ ] **Step 3: Escrever `verbetes-planetas.ts`** com os 10
- [ ] **Step 4: Somar ao `CATALOGO`**
- [ ] **Step 5: Rodar** `npx vitest run src/data/estudo` — verde
- [ ] **Step 6: Typecheck e commit** — `feat(estudo): verbetes dos 10 planetas e as sincronicidades`

⚠️ Signos, casas, aspectos e os demais conceitos ficam **fora deste plano**: a
biblioteca cresce um verbete por vez depois que a tela existir, e cada um já é
útil sozinho. Prendê-los aqui atrasaria a entrega sem ganho.

---

### Task 6: O progresso, e a aba `Mapas | Estudo`

**Files:**
- Create: `src/hooks/useProgressoDoEstudo.ts`
- Create: `src/hooks/__tests__/progressoDoEstudo.spec.ts`
- Modify: `src/screens/cosmos/CosmosScreen.tsx`
- Create: `src/screens/cosmos/__tests__/abaDoEstudo.spec.ts`

**Interfaces:**
- Consumes: `LICOES` de `src/data/estudo`
- Produces: `useProgressoDoEstudo()` devolvendo `{ lidos: string[]; ultimo: string | null; marcarLido(id): void; proximaLicao(): Unidade | null; carregado: boolean }`, e `normalizarProgresso(bruto): { lidos: string[]; ultimo: string | null }`

- [ ] **Step 1: Escrever o teste do progresso**

```ts
// src/hooks/__tests__/progressoDoEstudo.spec.ts
import { describe, it, expect } from 'vitest'
import { normalizarProgresso } from '../useProgressoDoEstudo'

describe('progresso do estudo', () => {
  /**
   * ⚠️ O QUE VEM DO DISCO NÃO É CONFIÁVEL. Versão antiga, escrita parcial ou
   * JSON corrompido não podem derrubar a aba inteira — a tela tem de abrir no
   * começo em vez de quebrar.
   */
  it('lixo no disco vira começo do zero, não exceção', () => {
    for (const bruto of [null, undefined, '', 'nao-json', 42, [], { lidos: 'x' }]) {
      expect(normalizarProgresso(bruto)).toEqual({ lidos: [], ultimo: null })
    }
  })

  it('descarta id que não existe mais no catálogo', () => {
    const r = normalizarProgresso({ lidos: ['licao-01-ceu-observado', 'licao-removida'], ultimo: 'licao-removida' })
    expect(r.lidos, 'id órfão de uma versão antiga').toEqual(['licao-01-ceu-observado'])
    expect(r.ultimo, 'último apontando para id morto deveria zerar').toBeNull()
  })

  it('não repete id lido duas vezes', () => {
    const r = normalizarProgresso({ lidos: ['licao-01-ceu-observado', 'licao-01-ceu-observado'], ultimo: null })
    expect(r.lidos).toEqual(['licao-01-ceu-observado'])
  })
})
```

- [ ] **Step 2: Rodar e ver falhar** — `Cannot find module '../useProgressoDoEstudo'`

- [ ] **Step 3: Escrever o hook**

```ts
// src/hooks/useProgressoDoEstudo.ts
import { useCallback, useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { LICOES, porId, type Unidade } from '../data/estudo'

/**
 * ONDE A PESSOA PAROU no Estudo.
 *
 * ⚠️ NO APARELHO, não no Firestore. É preferência de leitura, igual a
 * `useOrdemDaHome` e `useModoLeitura` — não justifica uma escrita de banco a
 * cada lição aberta, e o app já tem esse padrão.
 */
const CHAVE = '@tabula_estelar:progresso_estudo'

export interface Progresso {
  lidos: string[]
  ultimo: string | null
}

/**
 * ⚠️ VALIDA O QUE VEIO DO DISCO. Uma versão futura pode renomear lições, e a
 * marca antiga ficaria apontando para id que não existe — a trilha mostraria
 * "lido" num card que não é aquele, ou quebraria ao abrir. Id órfão é
 * descartado em silêncio; perder uma marca é melhor que mostrar a errada.
 */
export function normalizarProgresso(bruto: unknown): Progresso {
  const obj = (bruto && typeof bruto === 'object' && !Array.isArray(bruto))
    ? bruto as Record<string, unknown>
    : {}
  const crus = Array.isArray(obj.lidos) ? obj.lidos.map(String) : []
  const lidos = [...new Set(crus)].filter((id) => !!porId(id))
  const u = typeof obj.ultimo === 'string' ? obj.ultimo : null
  return { lidos, ultimo: u && porId(u) ? u : null }
}

export function useProgressoDoEstudo() {
  const [progresso, setProgresso] = useState<Progresso>({ lidos: [], ultimo: null })
  const [carregado, setCarregado] = useState(false)

  useEffect(() => {
    let vivo = true
    AsyncStorage.getItem(CHAVE)
      .then((txt) => {
        if (!vivo) return
        let bruto: unknown = null
        // ⚠️ `JSON.parse` de lixo LANÇA. Sem o try, a aba inteira não abre.
        try { bruto = txt ? JSON.parse(txt) : null } catch { bruto = null }
        setProgresso(normalizarProgresso(bruto))
      })
      .catch(() => { if (vivo) setProgresso({ lidos: [], ultimo: null }) })
      .finally(() => { if (vivo) setCarregado(true) })
    return () => { vivo = false }
  }, [])

  const marcarLido = useCallback((id: string) => {
    setProgresso((p) => {
      if (!porId(id)) return p
      const novo: Progresso = { lidos: [...new Set([...p.lidos, id])], ultimo: id }
      AsyncStorage.setItem(CHAVE, JSON.stringify(novo)).catch(() => {})
      return novo
    })
  }, [])

  /** A primeira lição ainda não lida, em ordem. `null` quando acabou. */
  const proximaLicao = useCallback((): Unidade | null => (
    LICOES.find((l) => !progresso.lidos.includes(l.id)) ?? null
  ), [progresso.lidos])

  return { ...progresso, carregado, marcarLido, proximaLicao }
}
```

- [ ] **Step 4: Rodar o teste** — `npx vitest run src/hooks/__tests__/progressoDoEstudo.spec.ts` — PASS

- [ ] **Step 5: Escrever o teste da aba**

```ts
// src/screens/cosmos/__tests__/abaDoEstudo.spec.ts
import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const FONTE = readFileSync(join(__dirname, '..', 'CosmosScreen.tsx'), 'utf8')
const LF = String.fromCharCode(10)
const limpo = FONTE.split(LF).filter((l) => !/^\s*(\/\/|\*|\/\*)/.test(l)).join(LF)

describe('a aba Estudo dentro de Mapa', () => {
  /**
   * ⚠️ ESTUDO NÃO É UM QUINTO SISTEMA DE MAPA. Pô-lo como par de "Védico"
   * mentiria sobre o que ele é, e cinco botões não cabem na linha do celular
   * (hoje são quatro a ~70px). Ele é um nível ACIMA.
   */
  it('não entra no alternador de sistemas', () => {
    expect(limpo, 'Estudo virou um quinto mapMode').not.toMatch(/mapMode === 'estudo'/)
    expect(limpo, 'o alternador de sistemas ganhou um quinto botão')
      .not.toMatch(/setMapMode\(['"]estudo['"]\)/)
  })

  it('existe um alternador de topo com duas faces', () => {
    expect(limpo, 'o alternador Mapas|Estudo sumiu').toMatch(/setAbaDoMapa\(/)
    expect(limpo, 'o estado da aba de topo sumiu').toMatch(/abaDoMapa/)
  })

  /** O alternador de sistemas tem de ficar DENTRO de "Mapas". */
  it('o alternador de sistemas só aparece na face Mapas', () => {
    expect(limpo, 'o alternador de sistemas ficou fora da condição da aba')
      .toMatch(/abaDoMapa === 'mapas'/)
  })
})
```

- [ ] **Step 6: Rodar e ver falhar**

- [ ] **Step 7: Acrescentar o alternador no `CosmosScreen.tsx`**

Junto dos outros `useState` do topo do componente (perto de `const [mapMode, setMapMode] = useState(...)`, linha ~270):

```tsx
  /**
   * ⚠️ UM NÍVEL ACIMA do alternador de sistemas. Estudo não é um sistema de
   * mapa — pô-lo como quinto botão ao lado de "Védico" mentiria sobre o que
   * ele é, e cinco botões não cabem na linha do celular.
   */
  const [abaDoMapa, setAbaDoMapa] = useState<'mapas' | 'estudo'>('mapas')
```

Imediatamente ANTES do bloco `{/* Toggle Ocidental ↔ Védico ... */}` (linha ~653):

```tsx
        <View style={styles.abaTopo}>
          {([
            ['mapas', tl('Mapas', 'Charts', 'Mapas', 'Mappe')],
            ['estudo', tl('Estudo', 'Study', 'Estudio', 'Studio')],
          ] as const).map(([v, rotulo]) => (
            <TouchableOpacity
              key={v}
              style={[styles.abaTopoBtn, abaDoMapa === v && styles.abaTopoBtnAtiva]}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityState={{ selected: abaDoMapa === v }}
              onPress={() => setAbaDoMapa(v)}
            >
              <Text style={[styles.abaTopoTexto, abaDoMapa === v && styles.abaTopoTextoAtivo]}>
                {rotulo}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {abaDoMapa === 'estudo' ? <EstudoScreen /> : null}
```

Envolver o alternador de sistemas e todo o conteúdo de mapa existente em
`{abaDoMapa === 'mapas' ? ( ... ) : null}`.

Import no topo: `import EstudoScreen from '../estudo/EstudoScreen'`

Estilos, junto de `modeToggle`:

```ts
  abaTopo: { flexDirection: 'row', gap: 6, marginBottom: 12, padding: 3, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.06)' },
  abaTopoBtn: { flex: 1, paddingVertical: 9, borderRadius: 10, alignItems: 'center' },
  abaTopoBtnAtiva: { backgroundColor: 'rgba(255,215,0,0.16)' },
  abaTopoTexto: { color: '#9AA3BA', fontSize: 14, fontWeight: '600' },
  abaTopoTextoAtivo: { color: '#FFD700' },
```

- [ ] **Step 8: Rodar os dois testes e o typecheck**

Run: `cd frontend && npx vitest run src/hooks/__tests__/progressoDoEstudo.spec.ts src/screens/cosmos/__tests__/abaDoEstudo.spec.ts && npx tsc --noEmit -p tsconfig.json`

- [ ] **Step 9: Commit** — `feat(estudo): progresso no aparelho e a aba Mapas|Estudo`

---

### Task 7: O renderizador de blocos e a tela da lição

**Files:**
- Create: `src/components/estudo/BlocoDoEstudo.tsx`
- Create: `src/screens/estudo/LicaoScreen.tsx`
- Create: `src/components/estudo/__tests__/blocoDoEstudo.spec.ts`

**Interfaces:**
- Consumes: `Bloco`, `Unidade` de `src/data/estudo`; `useProgressoDoEstudo`
- Produces: `<BlocoDoEstudo bloco idioma />`, `<LicaoScreen unidade aoFechar aoAbrir />`

- [ ] **Step 1: Escrever o teste do renderizador**

```ts
// src/components/estudo/__tests__/blocoDoEstudo.spec.ts
import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const FONTE = readFileSync(join(__dirname, '..', 'BlocoDoEstudo.tsx'), 'utf8')
const LF = String.fromCharCode(10)
const limpo = FONTE.split(LF).filter((l) => !/^\s*(\/\/|\*|\/\*)/.test(l)).join(LF)

describe('o renderizador de blocos', () => {
  /**
   * ⚠️ O GANCHO É INERTE NA FASE 1. Se ele renderizar qualquer coisa — nem que
   * seja um espaço — a lição ganha um buraco visual que ninguém pediu, e a
   * fase 2 passa a ter de "consertar" em vez de só preencher.
   */
  it('ganchoPessoal não desenha nada', () => {
    expect(limpo, 'o gancho deixou de ser inerte')
      .toMatch(/ganchoPessoal'[\s\S]{0,120}?return null/)
  })

  /** Todo tipo tem tratamento: um tipo novo não pode sumir em silêncio. */
  it('cobre os seis tipos de bloco', () => {
    for (const t of ['paragrafo', 'destaque', 'sincronicidade', 'exemplo', 'cuidado', 'ganchoPessoal']) {
      expect(limpo, `o tipo "${t}" não é tratado`).toContain(`'${t}'`)
    }
  })

  /**
   * ⚠️ O TEXTO DA LIÇÃO PASSA PELO GLOSSÁRIO. É o que liga as duas camadas: o
   * termo técnico no meio da lição abre a explicação curta, e de lá a pessoa
   * pode ir ao verbete inteiro.
   */
  it('usa TextoComGlossario', () => {
    expect(limpo, 'a lição deixou de ligar os termos ao glossário')
      .toMatch(/TextoComGlossario/)
  })

  /**
   * ⚠️ O MODO EXPLICADO FICA DESLIGADO AQUI. Fora do Estudo ele troca
   * "quadratura" pela palavra comum; aqui o termo técnico É o assunto da
   * lição, e trocá-lo esvaziaria o que se foi aprender.
   */
  it('desliga o modo explicado dentro da lição', () => {
    expect(limpo, 'o modo explicado voltou a trocar o termo dentro do Estudo')
      .toMatch(/simples=\{true\}|simples$/m)
  })
})
```

- [ ] **Step 2: Rodar e ver falhar**

- [ ] **Step 3: Escrever `BlocoDoEstudo.tsx`**

```tsx
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import TextoComGlossario from '../TextoComGlossario'
import type { Bloco, IdiomaEstudo } from '../../data/estudo'

/**
 * Um bloco de conteúdo do Estudo.
 *
 * ⚠️ CADA TIPO TEM TRATAMENTO PRÓPRIO, e é por isso que o conteúdo é dado
 * tipado em vez de markdown: `sincronicidade` precisa de ano e de duas
 * camadas separadas (fato e leitura), `cuidado` precisa ser discreto sem
 * sumir. Markdown daria tudo igual.
 */
export default function BlocoDoEstudo({ bloco, idioma }: { bloco: Bloco; idioma: IdiomaEstudo }) {
  // ⚠️ INERTE NA FASE 1 — ver `GanchoChave` em `data/estudo/tipos.ts`.
  if (bloco.tipo === 'ganchoPessoal') return null

  if (bloco.tipo === 'sincronicidade') {
    return (
      <View style={s.sinc}>
        <Text style={s.sincAno}>{bloco.ano}</Text>
        <Text style={s.sincFato}>{bloco.descoberta[idioma]}</Text>
        <Text style={s.sincFato}>{bloco.noMundo[idioma]}</Text>
        {/* ⚠️ A LEITURA VEM SEPARADA E ROTULADA: as duas linhas acima são
            verificáveis; esta é interpretação da tradição. Misturá-las
            apresentaria a segunda como demonstrada. */}
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
        {/* ⚠️ `simples` DESLIGA a troca do modo Explicado: aqui o termo
            técnico é o assunto da lição. */}
        <TextoComGlossario style={s.exemploTexto} simples>{texto}</TextoComGlossario>
      </View>
    )
  }
  return <TextoComGlossario style={s.paragrafo}>{texto}</TextoComGlossario>
}

const s = StyleSheet.create({
  paragrafo: { color: '#D7DCE8', fontSize: 15, lineHeight: 23, marginBottom: 14 },
  destaque: { color: '#FFD700', fontSize: 16, fontWeight: '700', lineHeight: 24, marginBottom: 16 },
  cuidado: { color: '#9AA3BA', fontSize: 13, lineHeight: 19, fontStyle: 'italic', marginBottom: 14 },
  exemplo: { borderLeftWidth: 2, borderLeftColor: 'rgba(255,215,0,0.4)', paddingLeft: 12, marginBottom: 14 },
  exemploTexto: { color: '#C7D2E8', fontSize: 14, lineHeight: 21 },
  sinc: { backgroundColor: 'rgba(167,139,250,0.10)', borderRadius: 14, padding: 14, marginBottom: 16 },
  sincAno: { color: '#C4B5FD', fontSize: 22, fontWeight: '800', marginBottom: 6 },
  sincFato: { color: '#D7DCE8', fontSize: 14, lineHeight: 21, marginBottom: 4 },
  sincDivisor: { height: 1, backgroundColor: 'rgba(255,255,255,0.12)', marginVertical: 10 },
  sincLeitura: { color: '#C7D2E8', fontSize: 14, lineHeight: 21, fontStyle: 'italic' },
})
```

- [ ] **Step 4: Escrever `LicaoScreen.tsx`** — `ScrollView` com título, `minutos`, os blocos em ordem, e no fim os `verTambem` como cards tocáveis e um botão "próxima lição". Chama `marcarLido(unidade.id)` ao montar o rodapé.

⚠️ `<ScrollView>` precisa de `style={{ flex: 1 }}`, senão não rola no web — regra conhecida deste projeto.

- [ ] **Step 5: Rodar os testes e o typecheck**
- [ ] **Step 6: Commit** — `feat(estudo): renderizador de blocos e tela da licao`

---

### Task 8: A tela do Estudo — progresso, busca, trilha e biblioteca

**Files:**
- Create: `src/components/estudo/CardDaUnidade.tsx`
- Create: `src/screens/estudo/EstudoScreen.tsx`
- Create: `src/screens/estudo/__tests__/estudoScreen.spec.ts`

**Interfaces:**
- Consumes: `LICOES`, `VERBETES`, `useProgressoDoEstudo`, `LicaoScreen`, `CardDaUnidade`
- Produces: `<EstudoScreen />` (sem props — lê o catálogo e o progresso sozinha)

- [ ] **Step 1: Escrever o teste**

```ts
// src/screens/estudo/__tests__/estudoScreen.spec.ts
import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const FONTE = readFileSync(join(__dirname, '..', 'EstudoScreen.tsx'), 'utf8')
const LF = String.fromCharCode(10)
const limpo = FONTE.split(LF).filter((l) => !/^\s*(\/\/|\*|\/\*)/.test(l)).join(LF)

describe('a tela do Estudo', () => {
  /**
   * ⚠️ NADA É TRAVADO. Quem quiser pular para a lição 9 pula — a trilha
   * RECOMENDA a próxima, não a impõe. Travar pune o curioso, e o curioso é
   * exatamente quem esta área existe para servir.
   */
  it('não bloqueia lição por ordem', () => {
    expect(limpo, 'a trilha passou a travar lição').not.toMatch(/disabled=\{[^}]*ordem/)
    expect(limpo, 'apareceu cadeado na trilha').not.toMatch(/lock-closed/)
  })

  it('mostra onde a pessoa parou', () => {
    expect(limpo, 'o progresso sumiu do topo').toMatch(/proximaLicao|lidos\.length/)
  })

  it('a busca cobre lições E verbetes', () => {
    expect(limpo, 'a busca deixou de cobrir as duas camadas').toMatch(/CATALOGO/)
  })

  it('agrupa a trilha por ato e a biblioteca por categoria', () => {
    expect(limpo, 'o agrupamento por ato sumiu').toMatch(/\.ato/)
    expect(limpo, 'o agrupamento por categoria sumiu').toMatch(/categoria/)
  })
})
```

- [ ] **Step 2: Rodar e ver falhar**

- [ ] **Step 3: Escrever `CardDaUnidade.tsx`** — card tocável com título, `resumo`, `minutos` e marca de lido. Um componente só serve trilha e biblioteca; duas cópias divergiriam no primeiro ajuste.

- [ ] **Step 4: Escrever `EstudoScreen.tsx`** na ordem: cabeçalho de progresso, busca, trilha agrupada por ato, biblioteca agrupada por categoria. Abre `LicaoScreen` em `Modal` ao tocar num card.

- [ ] **Step 5: Rodar os testes e o typecheck**
- [ ] **Step 6: Commit** — `feat(estudo): tela com trilha, biblioteca, busca e progresso`

---

### Task 9: A ponte do glossário — "ver a fundo"

Fecha o laço: o termo técnico em qualquer tela do app passa a levar ao verbete.

**Files:**
- Modify: `src/components/TextoComGlossario.tsx`
- Modify: `src/data/estudo/__tests__/integridade.spec.ts`

**Interfaces:**
- Consumes: `VERBETES` de `src/data/estudo`
- Produces: o popup do glossário ganha rodapé quando o termo tem verbete

- [ ] **Step 1: Escrever o teste do laço nos dois sentidos**

```ts
  it('todo termo com verbete é alcançável, e todo verbete declara termo real', () => {
    const declarados = new Set(CATALOGO.flatMap((u) => u.termos))
    // Ida: o que o verbete declara existe no glossário (já coberto acima).
    // Volta: nenhum termo fica declarado por DOIS verbetes — o popup não
    // saberia para qual mandar.
    // ⚠️ SÓ VERBETES: a lição também declara termos, mas para a BUSCA — o
    // destino do "ver a fundo" é sempre o verbete. Contar os dois juntos
    // acusaria conflito onde não há.
    const contagem = new Map<string, string[]>()
    for (const u of VERBETES) {
      for (const t of u.termos) contagem.set(t, [...(contagem.get(t) ?? []), u.id])
    }
    const ambiguos = [...contagem].filter(([, ids]) => ids.length > 1)
    expect(ambiguos, 'termo em dois verbetes: o "ver a fundo" não saberia o destino')
      .toEqual([])
    expect(declarados.size, 'nenhum termo ligado ainda').toBeGreaterThan(0)
  })
```

- [ ] **Step 2: Rodar e ver falhar** (se houver termo duplicado, corrigir o conteúdo)

- [ ] **Step 3: Acrescentar o rodapé no popup do glossário**

No componente que mostra a explicação ao toque, acrescentar — só quando
`VERBETES.find((v) => v.termos.includes(chave))` existir:

```tsx
        {/* ⚠️ SÓ APARECE QUANDO HÁ VERBETE. Um "ver a fundo" que abre vazio é
            pior que não oferecer nada — e é a classe de falha que este projeto
            já pagou com o catálogo que caía em fallback. */}
        {verbete ? (
          <Pressable onPress={() => aoAbrirVerbete(verbete.id)} accessibilityRole="button">
            <Text style={s.verAFundo}>
              {tl('Ver a fundo', 'Go deeper', 'Ver a fondo', 'Approfondisci')}
            </Text>
          </Pressable>
        ) : null}
```

- [ ] **Step 4: Rodar a suíte inteira do app**

Run: `cd frontend && npx vitest run && npx tsc --noEmit -p tsconfig.json`
Expected: tudo verde, sem regressão nos 1326 testes existentes

- [ ] **Step 5: Commit** — `feat(estudo): o glossario leva ao verbete inteiro`

---

## Fora deste plano

- **Personalização (fase 2)** — os `ganchoPessoal` ficam inertes
- **Verbetes de signos, casas e aspectos** — a biblioteca cresce um por vez depois que a tela existir
- **Gating** — decisão do João, pendente; enquanto isso a aba é visível para todos
- **Vídeo, áudio, edição por painel** — fora de escopo por decisão no spec
