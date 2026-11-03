# Estudo Astrológico — design

**Data:** 2026-11-02
**Estado:** aprovado nas seções; aguardando revisão do spec
**Decisão pendente:** gating (ver "Questões abertas")

## O problema

O app fala a língua de quem já estuda astrologia. "Quadratura" aparece 142 vezes
na interface, "sextil" 135, "orbe" 29. Para quem nunca viu um mapa, cada um é
uma parede — e o trial dura 3 dias. O glossário de 16 termos ameniza o choque,
mas não ensina: ele traduz a palavra e para ali.

Falta o degrau de baixo. Quem quer entender *por que* o céu diria algo, *por que*
Plutão carrega o peso que carrega, ou simplesmente *como se lê um mapa*, hoje
sai do app para procurar em outro lugar.

## O que estamos construindo

Uma área de estudo dentro da aba Mapa, com duas camadas:

- **Uma trilha de 12 lições** que leva do zero até a pessoa ler o próprio mapa
  sozinha. Completa e fechada — tem fim.
- **Uma biblioteca de verbetes** (planetas, signos, casas, aspectos, conceitos)
  que cresce indefinidamente, um verbete por vez, cada um já útil sozinho.

O glossário existente vira a porta da biblioteca: tocar em "quadratura" em
qualquer tela do app passa a oferecer "ver a fundo".

### Por que trilha curta e biblioteca grande

A alternativa considerada foi um currículo completo de 38+ lições em 6 atos.
Rejeitada por causa de uma restrição que o próprio projeto impõe: **toda string
existe nos 4 idiomas**, e as regras de es-ES (sem tildes nem `ñ`) e it-IT (sem
acentos) tornam a revisão manual.

38 lições × 4 idiomas são 152 textos longos escritos antes de qualquer coisa
chegar ao usuário. 12 × 4 são 48, e colocam um curso **inteiro e utilizável** no
ar; a biblioteca cresce depois sem travar nada.

A diferença entre as duas abordagens é a **ordem de entrega**, não o destino: o
"completo" acontece na biblioteca, que não tem teto.

### O que esta fase NÃO faz

As lições são **genéricas**. Nenhuma lê o mapa de quem está lendo.

A personalização ("Plutão rege transformação — no seu mapa ele está na Casa 7")
é a fase 2, e o modelo de conteúdo já nasce com o encaixe para ela (ver
`ganchoPessoal`). A condição acordada foi explícita: a fase 2 não pode exigir
reescrita do conteúdo da fase 1.

## A trilha

Doze lições, cinco atos.

### Ato 0 · Por que o céu diz algo

O diferencial, e abre o curso. Não existe em curso genérico de astrologia — é a
voz do produto, e é o que justifica o app ensinar em vez de apontar para fora.

1. **O céu que olharam por cinco mil anos** — a observação, os ciclos, o
   calendário. Por que povos sem contato entre si chegaram a leituras parecidas.
2. **Gravidade, não destino** — o planeta não manda, ele puxa. A diferença entre
   sofrer a influência e transmutá-la em força.
3. **Quem atravessa a experiência** — somos espíritos; o mapa é o terreno, não a
   sentença. E o que a astrologia **não** afirma.

> A lição 3 carrega as ressalvas de propósito, e cedo. Dizer o que a leitura não
> promete é o que sustenta a credibilidade de tudo que vem depois — deixar isso
> para o fim seria pedir crédito antes de mostrar o limite.

### Ato 1 · As quatro perguntas de um mapa

4. **Planeta = o quê** — a função. Por que dez e não vinte.
5. **Signo = como** — o modo, não a coisa.
6. **Casa = onde** — o setor da vida. Por que o mesmo planeta muda de assunto
   conforme a casa.

> Aspecto fica para o ato 2 porque é *relação*: só faz sentido depois que os três
> primeiros existem.

### Ato 2 · O que liga

7. **Aspecto = a conversa entre dois planetas** — harmônico e tenso, e por que
   tenso não é ruim.
8. **Orbe e força** — por que o aspecto exato pesa mais, e o que é "aplicativo".

### Ato 3 · O tempo

9. **Trânsito** — o céu de hoje tocando o mapa de sempre. A diferença entre o que
   você *é* e o que está *acontecendo*.
10. **Os ciclos que importam** — Saturno, Júpiter, os retornos. Por que certas
    idades doem igual para quase todo mundo.

### Ato 4 · Ler sozinho

11. **A ordem de leitura** — por onde começar, o que olhar primeiro, o que
    ignorar no início.
12. **Seu mapa, do começo ao fim** — passo a passo que termina com a pessoa
    lendo o próprio.

A lição 12 é onde o gancho pessoal nasce mais forte, e é a ponte natural para a
fase 2.

## A biblioteca

Aproximadamente 50 verbetes, nenhum bloqueando outro:

| categoria | quantidade |
|---|---|
| Planetas | 10 |
| Signos | 12 |
| Casas | 12 |
| Aspectos | ~7 |
| Conceitos (orbe, retrógrado, stellium, nódulos, ASC/MC…) | ~12 |

Os 16 termos do glossário atual mapeiam para um subconjunto destes.

### Sincronicidades de descoberta

Urano, Netuno e Plutão ganham um bloco `sincronicidade` — a coincidência entre a
descoberta do planeta e o que acontecia no mundo:

| planeta | descoberta | no mundo |
|---|---|---|
| Urano | 1781 | revoluções Americana (1776) e Francesa (1789); Galvani e os primeiros estudos de eletricidade |
| Netuno | 1846 | primeira demonstração pública de anestesia com éter, **no mesmo ano** |
| Plutão | 1930 | véspera da fissão nuclear (1938) e da psicologia das massas |

⚠️ **A data é fato; a correspondência é leitura da tradição.** O bloco separa as
duas coisas na própria estrutura (`descoberta`, `noMundo`, `leitura`) e o texto
não pode apresentar a interpretação como demonstrada. Isso protege a
credibilidade em vez de gastá-la — e é a mesma régua da lição 3.

⚠️ **Quíron fica de fora.** O motor não o calcula (`swisseph` não resolve, sem
fórmula analítica), e um verbete sobre ele prometeria algo que o mapa não mostra.

## O modelo de conteúdo

```ts
type Idioma = 'pt-BR' | 'en-US' | 'es-ES' | 'it-IT'
type T = Record<Idioma, string>

type Bloco =
  | { tipo: 'paragrafo';      texto: T }
  | { tipo: 'destaque';       texto: T }
  | { tipo: 'sincronicidade'; ano: number; descoberta: T; noMundo: T; leitura: T }
  | { tipo: 'exemplo';        texto: T }
  | { tipo: 'cuidado';        texto: T }
  | { tipo: 'ganchoPessoal';  chave: GanchoChave }

type Unidade = {
  id: string
  tipo: 'licao' | 'verbete'
  ato?: 0 | 1 | 2 | 3 | 4      // só lição
  ordem?: number               // só lição, 1..12
  titulo: T
  resumo: T
  blocos: Bloco[]
  termos: string[]             // chaves do glossário que este verbete explica a fundo
  verTambem: string[]          // ids de outras unidades
  minutos: number
}
```

### Decisões, e por quê

**Blocos tipados, não markdown.** O React Native não renderiza markdown
nativamente. Tipar permite que cada bloco ganhe tratamento visual próprio —
`sincronicidade` vira card com ano e linha do tempo, `cuidado` vira nota
discreta — e permite que o teste de paridade verifique **bloco a bloco** nos 4
idiomas, em vez de confiar num texto grande.

**`resumo` serve os dois usos.** A mesma frase aparece no card da trilha e no
toque do glossário. Duas fontes divergiriam no primeiro ajuste — é o padrão de
divergência silenciosa que já mordeu este projeto várias vezes (sínteses gêmeas,
limiares em cinco cópias, marcador de sinastria em três).

**`ganchoPessoal` existe desde agora, inerte.** A `chave` aponta para o que será
lido do mapa na fase 2 (`'planeta-na-casa'`, `'aspecto-mais-exato'`, …). Na fase
1 o renderizador pula o bloco. Zero reescrita depois — era a condição acordada.

**`termos` liga o glossário nos dois sentidos.** O verbete declara o que explica;
o toque no termo passa a oferecer "ver a fundo". Sem a declaração explícita, a
ligação dependeria de casar strings — exatamente a classe de falha que este
projeto já pagou (chave que não casa + fallback = bug invisível).

### Arquivos

```
src/data/estudo/
  tipos.ts                 Unidade, Bloco, T, GanchoChave
  trilha-ato0.ts … ato4.ts
  verbetes-planetas.ts
  verbetes-signos.ts
  verbetes-casas.ts
  verbetes-aspectos.ts
  verbetes-conceitos.ts
  index.ts                 monta o catálogo; valida ids únicos em runtime
```

Um arquivo por ato e por categoria. Nenhum cresce demais, e dois verbetes podem
ser escritos em paralelo sem conflito.

## A tela

### Onde entra

A aba Mapa ganha um alternador de **dois** no nível de cima:

```
┌─────────────┬─────────────┐
│   Mapas     │   Estudo    │
└─────────────┴─────────────┘
  Ocidental · Védico · Tzolkin · Chinês    ← alternador atual, agora DENTRO de "Mapas"
```

⚠️ **Estudo não entra como quinto botão do alternador de sistemas.** Dois
motivos: cinco botões não cabem numa linha de celular (hoje são quatro a ~70px),
e Estudo não é um sistema de mapa — é outra natureza de conteúdo. Pô-lo como par
de "Védico" mentiria sobre o que ele é.

### A tela do Estudo, de cima para baixo

1. **Onde você está** — "Lição 4 de 12 · Ato 2" com barra fina de progresso.
   Quem nunca entrou vê "comece do zero · 12 lições".
2. **Busca** — um campo só, procurando em lições e verbetes juntos.
3. **A trilha** — 12 cards agrupados por ato. O atual destacado, os lidos com
   marca.
4. **A biblioteca** — grade por categoria, com a contagem de verbetes prontos.

⚠️ **Nada é travado.** Quem quiser pular para a lição 9 pula; a trilha
*recomenda* a próxima, não a impõe. Travar pune o curioso, e o curioso é
exatamente quem esta área existe para servir.

### A lição

Tela cheia. Renderiza os blocos em ordem, cada tipo com seu tratamento. Termina
com "próxima lição" e os `verTambem`. Marca como lida ao chegar ao fim.

### Progresso

AsyncStorage, no aparelho — o mesmo padrão de `useOrdemDaHome` e
`useModoLeitura`. É preferência de leitura, não dado de conta: não justifica uma
escrita no Firestore a cada toque.

Formato: conjunto de ids lidos + último id aberto.

### Modo Explicado

⚠️ **Desligado dentro do Estudo.** Fora dele, o modo troca "quadratura" pela
palavra comum. Aqui o termo técnico é *o assunto da lição* — trocá-lo esvaziaria
o que se foi aprender.

## Testes

Com 4 idiomas, o risco dominante não é código quebrado: é **texto faltando que
cai em fallback e ninguém vê**. Foi assim que o título curado de ASC/MC passou
meses sem aparecer neste app.

1. **Paridade bloco a bloco** — todo campo `T` tem os 4 idiomas, não vazios.
   Falha nomeando a unidade e o bloco.
2. **Ortografia** — es-ES sem tildes nem `ñ`; it-IT sem acentos.
3. **`verTambem` aponta para id existente** — link morto é beco invisível.
4. **`termos` casa com chave real do glossário**, e o inverso: todo termo com
   verbete oferece "ver a fundo".
5. **A trilha é contígua** — ordem 1..12, sem buraco nem repetição; todo ato
   entre 0 e 4.
6. **`minutos` bate com o tamanho do texto** — "2 min" sobre 900 palavras é
   mentira.
7. **`ganchoPessoal` não renderiza nada na fase 1** — guarda o encaixe inerte.
8. **Ids únicos** em todo o catálogo.

## Questões abertas

**Gating — grátis ou pago?** Decisão do João, não tomada.

Recomendação: **grátis**. A memória do projeto registra que o gargalo é conversão,
não produto (62 usuários, trial→pago 7,1%). Conteúdo que ensina dá motivo para
alguém ficar antes de pagar. E a fase 2 — cada lição aterrissando no mapa da
pessoa — é o upgrade pago natural, com uma história honesta: *o curso é seu; ler
no seu mapa é do plano*.

## Fora de escopo

- Personalização por mapa (fase 2)
- Qualquer conteúdo em vídeo ou áudio
- Quíron (o motor não o calcula)
- Edição de conteúdo pelo painel (decidido: conteúdo versionado no app)
