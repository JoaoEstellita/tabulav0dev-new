# Gerador do card diário — "Céu de hoje"

Gera os posts diários do Instagram a partir do catálogo de interpretações que já
existe no app. Sem dependência nova: renderiza com o Chrome instalado.

## Uso

```bash
cd frontend

node scripts/marketing/gerarCard.mjs                  # hoje
node scripts/marketing/gerarCard.mjs --dias=9         # enche a grade 3×3
node scripts/marketing/gerarCard.mjs --data=2026-08-12
node scripts/marketing/gerarCard.mjs --dias=9 --upload   # e manda para o Estúdio
node scripts/marketing/gerarCard.mjs --saida=D:/outro/lugar
```

`--upload` exige `MONITORING_PASSWORD` no ambiente (a mesma senha do painel
`/monitoramento`). Falha de rede não aborta os outros dias: o card já está no
disco de qualquer forma.

Saída padrão: `<monorepo>/marketing/out/AAAA-MM-DD/` — **fora dos repositórios
git**, para não versionar binários.

```
marketing/out/2026-08-07/
  feed.png      1080 × 1350
  story.png     1080 × 1920
  legenda.txt   texto + hashtags, pronto para colar
```

Se o Chrome não estiver num caminho padrão, aponte com `CHROME_PATH`.

## Editorial — escolher a pauta

Antes o robô decidia sozinho e o que saía era o que saía. Agora cada dia oferece
de quatro a sete **assuntos distintos** no Estúdio, você marca qual vira post, e
o Actions obedece.

A primeira versão listava o mesmo evento repetido por ângulo de publicação —
"Mercúrio entra em Leão" na véspera e no dia, "Eclipse solar" quatro vezes. Não
eram opções; era a mesma coisa várias vezes. A lista agora é por assunto:

```
12/08  Eclipse solar total em Leão      [card reel carrossel]
       Lua fora de curso                [card]
       Vênus em Libra                   [card]   educativo
       Marte em Câncer                  [card]   educativo
       Júpiter em Leão                  [card]   educativo
```

**Um assunto por dia.** Os que você não escolher não entram em fila — somem. Se
isso incomodar (ver o mesmo educativo disponível todo dia e nunca sair), o
caminho é uma fila, não vários posts por dia.

```
calendario.mjs --upload  →  marketing/AAAA-MM-DD/calendario.json
        ↓
Estúdio                  →  escolhe o assunto e os formatos do dia
        ↓
POST                     →  marketing/AAAA-MM-DD/pauta.json
        ↓
Actions às 6h            →  lê a pauta do dia
```

**Sem pauta, sem rede ou com JSON quebrado, a automação gera tudo como sempre.**
Ela nunca para porque uma pauta faltou — é a única regra inegociável aqui.

Dia marcado com nenhum formato também é decisão: grava lista vazia, e o Actions
entende que o silêncio foi escolhido.

## Peça do mês

```bash
node scripts/marketing/gerarMensal.mjs                  # mês corrente
node scripts/marketing/gerarMensal.mjs --mes=2026-08
node scripts/marketing/gerarMensal.mjs --separados      # 12 peças avulsas
```

Capa mais um slide por signo. Cada slide traz duas leituras da mesma efeméride:

- **Por signo, no condicional** — *"Se o seu Sol, Lua ou ascendente está em
  Peixes, é este eixo que recebe o mês."* Não afirma nada sobre a vida de quem
  lê, e ainda dá o gancho de identificação.
- **Por ascendente, com número exato** — *"Com ascendente em Peixes, em casas
  inteiras: o eclipse de 28/08 cai na sua casa 1."*

A segunda linha é o que nos separa das contas que fazem isto. Em casas inteiras
a casa é aritmética, `((signo do evento − signo do ascendente + 12) mod 12) + 1`
— a mesma conta de `src/astro/houses.math.ts:83`. Em Placidus as cúspides
deslocam e deixaria de ser exato, **por isso o sistema é declarado na peça**.

Sai em `mensal/00.png … 12.png` dentro de uma pasta `AAAA-MM`.

## Carrossel

```bash
node scripts/marketing/gerarCarrossel.mjs                    # hoje, roteiro automático
node scripts/marketing/gerarCarrossel.mjs --data=2026-08-12
node scripts/marketing/gerarCarrossel.mjs --roteiro=eixo
```

Dois roteiros. **`explicador`** (5 slides) é escolhido sozinho quando o dia tem
eclipse: o que é, por que é raro, e se dá para ver do Brasil — este último com a
visibilidade calculada, que é o slide que ninguém mais consegue fazer sem errar.
**`eixo`** (6 slides) entra nos outros eventos de peso: um slide por signo da
cruz, com o ângulo que cada um recebe.

Sai em `carrossel/01.png … 06.png` na pasta do dia. O `gerarCard --upload` leva
os slides junto se já existirem, então gere o carrossel **antes** de enviar.

## Planejar a semana

```bash
node scripts/marketing/calendario.mjs                 # 21 dias a partir de hoje
node scripts/marketing/calendario.mjs --dias=45
node scripts/marketing/calendario.mjs --json          # o que o Estúdio consome
node scripts/marketing/calendario.mjs --upload        # publica para o Estúdio
```

Imprime, por dia, todos os assuntos que ele comporta e os formatos de cada um —
a mesma lista que aparece na editorial. Serve para planejar a semana no terminal
sem abrir o Estúdio.

## Automático — GitHub Actions

O card do dia é gerado e enviado sozinho, todo dia às **09:00 UTC (06:00 em
Brasília)**, sem PC ligado. O runner do GitHub já traz Chrome e Node.

**Pré-requisito, uma vez só:** cadastrar o secret no repositório.

> Settings → Secrets and variables → Actions → New repository secret
> Nome: `MONITORING_PASSWORD` · Valor: a senha do painel `/monitoramento`

Para rodar na hora, ou gerar vários dias: aba **Actions** → *Card diário* →
**Run workflow**, informando quantos dias e a data inicial.

O workflow instala `fonts-urw-base35` porque o card usa Palatino, que não existe
no Linux: o URW Palladio L (P052) é o equivalente livre, com as mesmas métricas.
Sem isso o card sairia com serif genérico. Cada execução guarda os PNGs como
artifact por 7 dias e publica um resumo com o trânsito escolhido.

## Estúdio — postar do celular

O gerador roda no PC (precisa do Chrome) e o Instagram se posta do celular.
Transferir arquivo todo dia é atrito, e atrito diário mata a consistência, que é
a única coisa que faz o orgânico funcionar.

### No domínio (recomendado)

```bash
export MONITORING_PASSWORD="..."      # Git Bash
# $env:MONITORING_PASSWORD="..."      # PowerShell

node scripts/marketing/gerarCard.mjs --dias=9 --upload
```

Depois abra **https://www.tabulaestelar.com.br/estudio** de qualquer lugar e
informe a mesma senha do painel `/monitoramento`.

Funciona longe de casa e com o PC desligado. Os arquivos vão para o Firebase
Storage em `marketing/AAAA-MM-DD/`, e a página os lê com URLs assinadas de 2h,
não com links públicos: card não publicado é material inédito.

Custo: fica inteiro dentro da cota gratuita. 1,4 MB por dia dá 512 MB no
primeiro ano, contra 5 GB grátis, e o download é só seu.

### Local, sem upload

```bash
node scripts/marketing/estudio.mjs
```

Sobe um servidor na rede local e imprime os endereços:

```
  neste PC     http://localhost:4173
  no celular   http://192.168.0.103:4173
```

Exige o celular no mesmo Wi-Fi e o PC ligado. Serve como alternativa quando não
se quer enviar nada para a nuvem.

### Nos dois casos

**Segure a imagem** para salvar no rolo da câmera; toque em **Copiar legenda**.

**Continua não sendo um CMS.** Não edita texto, não gera peça e não publica no
Instagram — quem publica é você, do celular. O único estado que ele guarda é a
pauta: qual assunto e quais formatos saem em que dia. Foi a linha que valeu a
pena cruzar, porque sem ela o robô escolhia o assunto sozinho.

Detalhe de implementação: a cópia usa `textarea` + `execCommand` como caminho
principal, não `navigator.clipboard`, porque a Clipboard API exige contexto
seguro e o visor local roda em HTTP.

## Reel animado

```bash
node scripts/marketing/gerarVideo.mjs                      # hoje, 12s a 30fps
node scripts/marketing/gerarVideo.mjs --segundos=15 --fps=24
node scripts/marketing/gerarVideo.mjs --upload             # e manda pro Estúdio
node scripts/marketing/gerarVideo.mjs --manter-frames      # guarda os PNGs
```

Sai um `reel.mp4` em 1080×1920: o zodíaco se desenha, os corpos entram do mais
lento ao mais rápido, os aspectos se traçam entre eles e a leitura do dia
aparece. Pronto para narrar por cima.

**Precisa de ffmpeg.** Sem ele o script para nos quadros e diz onde ficaram, para
você montar no editor. O runner do GitHub já tem ffmpeg, então na automação isso
não é problema.

**Precisa de `puppeteer-core`:**

```bash
npm install puppeteer-core --no-save
```

Não baixa navegador: usa o Chrome que já existe. Sem ele, cada quadro custaria os
2 a 3 segundos de lançar o Chrome por linha de comando, e um vídeo levaria 15
minutos em vez de 40 segundos.

### Por que não usar IA de vídeo

Runway, Kling, Luma e afins alucinam sobre texto pequeno e linhas finas, que é
exatamente o que a carta tem: `14° Leão`, `orbe 0°35'`, aspectos em posições
calculadas. Image-to-video transformaria os graus em rabiscos e derreteria os
planetas, destruindo a precisão que diferencia o produto.

Se quiser IA em algum momento, o caminho é em camadas: IA gera só o fundo
(nebulosa em movimento, onde alucinação não atrapalha) e a carta vetorial fica
por cima, nítida.

## Depois de mexer no design

```bash
node scripts/marketing/provaGeometria.mjs
```

Gera `marketing/out/_prova/geometria.png` com os **5 aspectos maiores lado a
lado**. O card do dia mostra só um aspecto — o do dia — então um ajuste pode
acertar o trígono e quebrar a conjunção sem ninguém ver por semanas. Rodar isto
fecha o buraco.

Conferir na folha: rótulo fora da roda, raio parando na borda do disco, arco e
valor legíveis, nada estourando o quadro.

## Como funciona

```
efemérides do dia (astronomy-engine)
  → aspectos maiores entre os 10 corpos
  → força = peso do aspecto × exatidão² × freio da Lua
  → primeiro que tenha título E aforismo no catálogo, e que não tenha
    saído nos últimos 14 dias
  → título   · src/data/transitTitlesPtBR.ts
  → aforismo · src/data/transitAphorismsPtBR.ts
  → área     · src/constants/lifeAreas.ts (LIFE_AREA_ATTRIBUTION)
  → cor      · src/constants/lifeAreas.ts (LIFE_AREA_COLORS)
  → orbes    · src/astro/aspect-config.ts (PLANET_ASPECT_ORBS)
  → HTML → Chrome --screenshot → PNG
```

O gerador **não cria conteúdo**. Todo texto vem do catálogo curado; ele só
escolhe e desenha.

## Decisões que não são óbvias

**O card fala do céu, não do mapa de ninguém.** Post de Instagram é público:
quem vê não tem mapa cadastrado. Rotular um planeta como "natal" seria falso.
Por isso o card mostra a posição real de cada corpo (`14° Áries`) — verificável
em qualquer efeméride — e o CTA é justamente a diferença: *o céu é de todos, a
casa é sua*.

**Freio da Lua.** A Lua percorre o zodíaco em 27 dias e forma aspecto com quase
tudo, todo dia. Sem o fator de 0.35 em `lib/ceu.mjs`, todo card do mês seria
lunar.

**Janela de 14 dias sem repetir.** Aspecto de planeta lento dura dias: Saturno
trígono Sol fica no topo da lista por uma semana e a grade sairia com o mesmo
texto quatro vezes. Quando a chave mais forte já saiu na janela, o gerador desce
para a seguinte — igualmente verdadeira, só menos exata. O histórico fica em
`marketing/out/.historico.json`; apagar a pasta de saída zera junto.

**Campo estelar determinístico.** A semente vem da data, então regerar um card
já publicado produz exatamente a mesma imagem.

**A legenda do Reel é queimada, não estática.** A maioria assiste sem som, e o
bloco fixo embaixo do gráfico dependia de alguém parar para ler. Agora a leitura
entra em pedaços de ~7 palavras, com piso de 0,9 segundo por pedaço — legenda
queimada se lê a umas três palavras por segundo, e o reparto proporcional puro
dava 0,58s, tempo de piscar. O bloco fixo guarda só a identificação: título e
data. Ter os dois com o mesmo texto deixava o quadro dizendo tudo duas vezes.

**A roda é achatada, não rotacionada.** `ACHATAMENTO` em `lib/templateCarta.mjs`
comprime o Y dentro de `ponto()`, e todo elemento cai sozinho na elipse. Não é
`transform: rotateX()` porque transformar o SVG esmagaria os rótulos junto, e
contra-rotacionar texto dentro de um plano 3D não funciona em motor nenhum. Em
0,86 o que era legível em miniatura continua legível — os rótulos de signo
dentro da roda já não eram, com ou sem achatamento, porque têm ~6px a 320px.

**`` não funciona com acento em JavaScript.** A regra "sem segunda pessoa"
sempre existiu, e a verificação que a sustentava era `/você/` — que **nunca
casa**, porque `` só reconhece `[A-Za-z0-9_]` como caractere de palavra e `ê`
não é um deles. A auditoria dava zero e o card publicava "quando você lidera"
com naturalidade, por um dia inteiro em produção.

Auditado com o regex certo: 4 dos 120 textos de planeta-em-signo, 20 dos 225 de
aspecto natal e **6 dos 12** de nódulo falam com quem lê. Agora o candidato é
descartado na origem (`falaComQuemLe`, em `lib/educativo.mjs`). Custou dois dias
de encadeamento sem repetir — de 14 para 12 — e vale.

**Assuntos de ritmo próprio.** Planeta-em-signo fica disponível o mês inteiro, e
por isso "Vênus em Libra" aparecia como opção todo dia. Três fontes rodam mais
rápido: **retrogradação em curso** (semanas, com data de fim — a pergunta mais
feita do nicho, e o único assunto que a gente não cobria), **grau crítico**
(0° e 29°, troca toda semana) e o **eixo dos nódulos**.

Só Mercúrio, Vênus e Marte contam como retrógrado: Urano, Netuno e Plutão passam
cinco meses por ano assim e virariam ruído permanente, igual ao aspecto entre
dois lentos.

⚠️ **`SearchMoonNode` devolve ora o ascendente ora o descendente.** Sem olhar o
`kind`, o Nódulo Norte parecia pular de Leão para Aquário sem nada ter se movido.

**Dia sem notícia vira card educativo.** Em 60 dias, treze não têm evento forte,
e vêm em blocos de três e quatro seguidos. Antes, os três dias de um mesmo
período de Lua fora de curso saíam com título, janela e texto IDÊNTICOS. Agora,
quando não há nada com peso ≥ 90 nem período de Lua vazia inédito, a peça troca
de assunto: explica o que uma posição significa num mapa natal, usando os 345
textos curados que nunca tinham saído do app (`planetInSignOverridesPtBR` e
`natalPlanetAspectOverridesPtBR`).

O assunto **nunca é sorteado** — sai do céu daquele dia. Se o card fala de Vênus
em Libra, é porque Vênus está em Libra. E a peça carrega obrigatoriamente a linha
que separa trânsito de mapa natal, sem a qual viraria horóscopo.

Duas exclusões deliberadas: aspecto entre dois planetas lentos (Plutão sextil
Netuno descreve todo mundo nascido numa década — é o vício do signo solar com
outro nome) e `signInHouseOverridesPtBR`, que fala "você".

**Aspecto nunca encabeça.** Ele entra como evento secundário, mas como manchete
reproduz o problema que o `eventos.mjs` existe para resolver: fica exato por
semanas e sai repetido.

**Eclipse tem peso próprio.** Todo eclipse é uma lunação, então sem tratamento
específico o eclipse solar total de 12/08/2026 sairia como "Lua Nova em Leão" —
o maior evento astronômico do ano anunciado como fase comum. A hierarquia é
`eclipse solar total 130 > eclipse 118 > ingresso 100 > estação 95 > fase 90 >
Lua fora de curso 85 > aspecto 80`, e a lunação do mesmo instante é removida
para o dia não aparecer duas vezes.

**A visibilidade é calculada, não presumida.** O eclipse solar de 12/08/2026 não
é visível do Brasil (o próximo em São Paulo é 06/02/2027, parcial); o lunar de
28/08 tem a Lua a 68° de altitude à 01h12 de Brasília. Mandar o público olhar
para o céu no dia errado custa a confiança inteira, então o texto só convida
quando `visivelBR` é verdadeiro.

**Antecipação.** O card publicava só no dia, e por isso nunca criava espera.
Agora eventos dentro de três dias entram com desconto de 8 pontos por dia — o
que faz um eclipse de amanhã (122) ganhar de um ingresso de hoje (100) — e a
peça se declara véspera no olho ("Está chegando") e na linha de dado ("Faltam 2
dias"). Sem isso o card de 9 de agosto traria "Eclipse solar total · 12 de
agosto" e quem batesse o olho leria que era naquele dia.

**Os quatro signos da cruz.** "3 signos", "4 signos" é o recurso que faz alguém
parar para ver se é ele, e quem usa normalmente chuta. Aqui é geometria: o
signo, as duas quadraturas e a oposição formam a cruz da modalidade, e são
sempre quatro. Entra só nos eventos de peso (`mereceEixo`) — se toda peça
recortasse signos, a conta viraria horóscopo.

**Toda busca parte da meia-noite.** As funções do `astronomy-engine` andam para
a frente a partir do instante dado. Ancoradas no meio-dia, eventos da manhã já
tinham passado e sumiam do próprio dia — Marte entrou em Câncer às 08h23 de
11/08/2026 e o card daquele dia não o mencionava.

**O quarto argumento de `A.Search` é um objeto.** Passar `1` não vira tolerância
de um segundo: vira `options.dt_tolerance_seconds === undefined`. Em função
íngreme como um ingresso passa despercebido; na velocidade de um planeta lento
perto da estação, onde a derivada vale 1e-5, a busca devolve `null` sem erro e o
código cai num fallback de dia inteiro.

**Leitura dos catálogos.** Node 20 não tem `--experimental-strip-types` e o
projeto não expõe esbuild. `lib/catalogo.mjs` extrai o objeto literal direto do
`.ts` (varredura balanceada, respeitando strings e comentários) em vez de
transpilar o arquivo — transpilar quebrava em `const` tipado sem `export`.
Duplicar os textos aqui faria o card divergir do app na primeira curadoria.

## Arquivos

| | |
|---|---|
| `gerarCard.mjs` | orquestrador e CLI |
| `gerarVideo.mjs` | Reel animado |
| `gerarCarrossel.mjs` | carrossel, roteiros `explicador` e `eixo` |
| `gerarMensal.mjs` | a peça do mês, por signo e por ascendente |
| `calendario.mjs` | pautas dos próximos dias; `--upload` alimenta a editorial |
| `estudio.mjs` | visor local para postar do celular |
| `provaGeometria.mjs` | folha de prova dos 5 aspectos |
| `lib/ceu.mjs` | aspectos do céu, força, área da vida |
| `lib/eventos.mjs` | ingresso, estação, fase, eclipse, Lua fora de curso |
| `lib/educativo.mjs` | assunto dos dias sem notícia, ancorado no céu |
| `lib/mensal.mjs` | eventos do mês por eixo e a casa pelo ascendente |
| `lib/roteiroLegenda.mjs` | tempo dos pedaços da legenda queimada |
| `lib/efemerideAnimada.mjs` | o céu quadro a quadro, para o Reel se mover |
| `lib/pautas.mjs` | os assuntos que cada dia comporta, com id estável |
| `lib/vozes.mjs` | léxico, regras de escrita, legendas e enquete |
| `lib/templateCarrossel.mjs` | HTML/CSS dos slides |
| `lib/catalogo.mjs` | leitura dos catálogos `.ts` |
| `lib/template.mjs` | HTML/CSS do card e os diagramas SVG |
| `lib/__tests__/eventos.spec.mjs` | golden de efeméride (roda no `npx vitest run`) |

O design mora em `lib/template.mjs`, em HTML/CSS — ajustar o card é ajustar CSS,
não código de desenho.
