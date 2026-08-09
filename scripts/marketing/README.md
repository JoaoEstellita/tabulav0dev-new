# Gerador do vídeo diário — "Céu de hoje"

O que sai, e quando:

| quando | peça |
|---|---|
| todo dia | o **vídeo** do céu de hoje — Reel e Story, mesmo arquivo (9:16) |
| dia forte | mais o **card estático** — eclipse, lunação, ingresso de peso |
| segunda | mais o **carrossel dos doze signos**, com a casa de cada um |

Tudo sai do `astronomy-engine` que o app já usa e renderiza com o Chrome
instalado; o MP4 é montado por ffmpeg.

```bash
cd frontend

node scripts/marketing/gerarVideo.mjs                       # hoje
node scripts/marketing/gerarVideo.mjs --data=2026-08-12
node scripts/marketing/gerarVideo.mjs --assunto=<id>        # obedece à pauta
node scripts/marketing/gerarVideo.mjs --upload              # manda para o Estúdio
node scripts/marketing/gerarVideo.mjs --segundos=20 --fps=30
```

Saída em `<monorepo>/marketing/out/AAAA-MM-DD/` — **fora dos repositórios git**:

```
reel.mp4      1080 × 1920, 20s
legenda.txt   o texto do post, pronto para colar
```

`--upload` exige `MONITORING_PASSWORD` no ambiente (a mesma senha do painel
`/monitoramento`). Se o Chrome não estiver num caminho padrão, aponte com
`CHROME_PATH`.

## A voz

Está em [`lib/vozReel.mjs`](lib/vozReel.mjs), e existe porque a anterior não
servia. Ela descrevia o fenômeno — *"eclipse solar é Lua Nova em cima do eixo dos
nódulos"* — e fechava com um bordão repetido em toda peça. O João olhou aquilo e
disse que estava quase desistindo de fazer conteúdo: **"as informações são
genéricas demais"**. Um texto que serve para qualquer eclipse não serve para
nenhum.

**As regras:**

1. Frase curta. Se dá para cortar uma palavra, corta.
2. Fala com a pessoa. "A gente", "você" — sem cerimônia e sem locução.
3. Nenhum termo técnico sem tradução **na mesma frase**. "Retrógrado" só aparece
   junto de "anda para trás".
4. Um fato calculado por peça, no mínimo.
5. Nunca prometer, nunca mandar fazer, nunca dizer o que vai acontecer com a vida
   de alguém.
6. Nada de bordão de encerramento. A peça acaba no fato.

**Os quatro tempos:** o que acontece hoje e a que horas · o contraste concreto ·
o fato que faz parar · o gancho do próximo evento.

```
Daqui a 3 dias, em 12 de agosto, a Lua passa na frente do Sol.
Acontece a 20° de Leão. Do Brasil não dá para ver nada — a sombra passa longe.
Hoje a Lua anda 15° e troca de signo: começa em Gêmeos e termina em Câncer.
Ainda hoje: Mercúrio muda de signo.
```

**O repertório de fatos** ([`lib/fatos.mjs`](lib/fatos.mjs)) é todo de efeméride:
tempo no signo contra a média, velocidade de hoje, iluminação e distância da Lua,
percurso do dia, a faixa de grau que recebe ângulo exato, e as doze casas por
ascendente — que vão na legenda do post, porque é o formato que faz alguém salvar
para conferir o próprio.

⚠️ **Só entra o que o código calcula.** Escrever "a faixa de totalidade passa pela
Islândia" é a tentação, e é exatamente o erro que a conta existe para não cometer:
as contas grandes chutam esse tipo de coisa. Há teste travando afirmação sem
cálculo — *"é assim pouco antes de mudar de direção"* só sai se `estacaoProxima`
confirmar.

## O vídeo é do dia

A janela da animação cobre **00h → 24h de Brasília**, e só. Antes eram cinco dias
de aproximação até o evento, e o João assistiu e disse o que estava errado: *"a
lua anda 2 signos"*. Andava — 74,7° na janela, contra 7,3° do planeta que a
manchete anunciava. Num dia a Lua anda uns 14° e os planetas quase não saem do
lugar, que é o que o céu faz num dia.

**O protagonista aparece como protagonista:** anel, nome, e os demais corpos a
25% de opacidade. Sem hierarquia o olho segue a Lua, que se move dez vezes mais
que o assunto.

**O quadro tem o mapa, a legenda queimada e as dez posições no rodapé.** Saíram
"Carta do céu", a data do canto, a legenda de harmônico/tenso, o bloco de título
e a assinatura — cada um disputava atenção com o mapa sem informar nada que a
legenda já não diga.

## Editorial — escolher a pauta

Antes o robô decidia sozinho e o que saía era o que saía. Agora cada dia oferece
de quatro a sete **assuntos distintos** no Estúdio, você marca qual vira post, e
o Actions obedece.

A primeira versão listava o mesmo evento repetido por ângulo de publicação —
"Mercúrio entra em Leão" na véspera e no dia, "Eclipse solar" quatro vezes. Não
eram opções; era a mesma coisa várias vezes. A lista agora é por assunto:

```
12/08  Eclipse solar total em Leão      ← já vem marcado
       Lua fora de curso
       Vênus em Libra                   educativo
       Marte em Câncer                  educativo
       Júpiter em Leão                  educativo
```

**Um assunto por dia.** Os que você não escolher não entram em fila — somem. Se
isso incomodar (ver o mesmo educativo disponível todo dia e nunca sair), o
caminho é uma fila, não vários posts por dia.

**O formato é um só: o vídeo.** A editorial ficou com uma decisão apenas —
escolher o assunto do dia. O primeiro de cada dia já vem marcado, e a sugestão
não repete a do dia anterior.

**O mesmo assunto marcado em dois dias avisa nos dois.** Não bloqueia — véspera
mais dia é decisão editorial defensável —, mas o texto muda por faixa de
distância, não por dia, então dois dias na mesma faixa saem parecidos.

```
calendario.mjs --upload  →  marketing/AAAA-MM-DD/calendario.json
        ↓
Estúdio                  →  escolhe o assunto do dia
        ↓
POST                     →  marketing/AAAA-MM-DD/pauta.json
        ↓
Actions às 6h            →  lê a pauta do dia
```

**Sem pauta, sem rede ou com JSON quebrado, o vídeo sai com o assunto de maior
peso.** A automação nunca para porque uma pauta faltou — é a única regra
inegociável aqui.

## A semana em doze signos

```bash
node scripts/marketing/gerarSemanal.mjs                 # a semana de hoje
node scripts/marketing/gerarSemanal.mjs --data=2026-08-10
node scripts/marketing/gerarSemanal.mjs --upload
```

Capa mais um slide por signo, publicado às **segundas** — o workflow diário
detecta o dia e roda sozinho. É o formato que gera salvamento: a pessoa volta ao
post para conferir o próprio ascendente.

O que faz cada slide ser diferente dos outros onze é a **casa**:

```
Marte entra em Câncer na terça.
Com ascendente em Leão, isso cai na sua casa 12 —
o que fica nos bastidores, o descanso, o que precisa acabar.
```

Doze ascendentes, doze contas, doze textos. Sem isso seria a mesma frase doze
vezes trocando o nome do signo, que é o que quase toda conta faz. A conta é
`((signo do evento − ascendente + 12) mod 12) + 1`, em casas inteiras — a mesma
de `src/astro/houses.math.ts:83`, e **o sistema é declarado na peça**.

Os doze significados de casa estão em `lib/vozSemana.mjs`, escritos em linguagem
de conversa: *"a casa, a família e o que te dá base"*, não *"o setor do lar"*.

Sai em `AAAA-MM-DD/semanal/01.png … 13.png` mais a `legenda.txt`. São treze
slides — o backend aceita até vinte, e subiu de dez por causa desta peça.

## Peça do mês

> Fora da produção diária: roda por comando.

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

> Fora da produção diária desde 08/08/2026: roda por comando, quando fizer falta.

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

O vídeo do dia é gerado e enviado sozinho, todo dia às **09:00 UTC (06:00 em
Brasília)**, sem PC ligado. O runner traz Chrome e Node, e o ffmpeg vem por apt.

**Pré-requisito, uma vez só:** cadastrar o secret no repositório.

> Settings → Secrets and variables → Actions → New repository secret
> Nome: `MONITORING_PASSWORD` · Valor: a senha do painel `/monitoramento`

Para rodar na hora: aba **Actions** → *Vídeo diário* → **Run workflow**,
opcionalmente com outra data.

O workflow não instala fonte nenhuma: elas viajam embutidas no HTML (ver
**Tipografia**). Cada execução guarda o MP4 como artifact por 7 dias.

Sem pauta salva, o assunto é o de maior peso do dia — a automação nunca para
porque uma pauta faltou.

## Estúdio — postar do celular

O gerador roda no PC (precisa do Chrome) e o Instagram se posta do celular.
Transferir arquivo todo dia é atrito, e atrito diário mata a consistência, que é
a única coisa que faz o orgânico funcionar.

### No domínio (recomendado)

```bash
export MONITORING_PASSWORD="..."      # Git Bash
# $env:MONITORING_PASSWORD="..."      # PowerShell

node scripts/marketing/gerarVideo.mjs --upload
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

## Reel animado — detalhes do render

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

## Tipografia

As fontes viajam DENTRO do HTML, em `data:` URI (`lib/fontes.mjs`). Antes o card
pedia `Palatino Linotype` (Windows) e o runner instalava `fonts-urw-base35` para
imitar: duas fontes diferentes desenhando a mesma peça, e nenhuma garantia de que
o aprovado era o publicado.

```
TE Sans   Inter variable, ou Space Grotesk    scripts/marketing/assets/fonts/
TE Mono   JetBrains Mono variable             (OFL, licenças na mesma pasta)
```

Para comparar as duas famílias sem editar código:

```bash
TABULA_SANS=grotesk node scripts/marketing/gerarCard.mjs --data=2026-08-09
```

**O corpo da leitura escala com o texto** (`tamanhoDaLeitura`, em
`templateCarta.mjs`): os textos vão de 118 a 258 caracteres conforme a faixa de
véspera, e o tamanho que cabia no dia do evento empurrava o rodapé 72px para fora
do quadro na antecipação de três dias.

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

**O protagonista precisa parecer o protagonista.** No Reel, quem não é o assunto
entra a 25% de opacidade, e o corpo do dia ganha anel e nome. Medido na janela de
um ingresso de Mercúrio: a Lua varre **74,7°** e Mercúrio anda **7,3°** — dez
vezes mais. Sem hierarquia o olho segue a Lua enquanto a manchete fala de outro.

**O Reel dura 20s, com no máximo quatro blocos de legenda.** Eram 12s: a janela
útil de 9,7s dividida por até oito blocos dava 1,2s cada, e legenda queimada se lê
a umas três palavras por segundo. O piso é 1,8s por bloco.

**Antecipação.** O card publicava só no dia, e por isso nunca criava espera.
Agora eventos dentro de três dias entram com desconto de 8 pontos por dia — o
que faz um eclipse de amanhã (122) ganhar de um ingresso de hoje (100) — e a
peça se declara véspera no olho ("Está chegando") e na linha de dado ("Faltam 2
dias"). Sem isso o card de 9 de agosto traria "Eclipse solar total · 12 de
agosto" e quem batesse o olho leria que era naquele dia. O `carta.png` ficou
fora disso por um tempo: dizia "Carta do céu" em qualquer distância, e é ele
que vai no post.

**O texto muda com a distância, senão a véspera é repetição.** A editorial
oferece o mesmo eclipse em quatro dias, e medido eles saíam com título, dado e
corpo idênticos — 9 das 12 linhas da legenda iguais, só o prefixo mudando.
`corpoDeVespera` (em `lib/vozes.mjs`) dá um assunto a cada faixa:

| distância | ângulo |
|---|---|
| 3 dias ou mais | o que o fenômeno **é** — a definição |
| 2 dias | a **medida**: quanto dura, de quanto em quanto vem, quanto anda |
| véspera | o que **muda** e o que não muda |
| no dia | o **dado** exato, que é o `escreverBase` de sempre |

A faixa dos 2 dias existe porque, com três, "faltam 3" e "faltam 2" caíam no
mesmo texto. **Cada variante cabe em duas frases** — o card mostra
`primeirasFrases(texto, 2)`, e a terceira frase sumia da imagem levando junto a
conclusão. Há teste para isso.

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
| `gerarVideo.mjs` | **a peça do dia** — vídeo, Reel e Story |
| `gerarCard.mjs` | card estático; fora do diário, roda por comando |
| `gerarCarrossel.mjs` | carrossel, roteiros `explicador` e `eixo`; fora do diário |
| `gerarMensal.mjs` | a peça do mês, por signo e por ascendente; fora do diário |
| `pautaDoDia.mjs` | o assunto de maior peso do dia, para o workflow |
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
| `lib/vozReel.mjs` | **a voz do vídeo** — conversa direta, os quatro tempos |
| `lib/fatos.mjs` | o fato calculado de cada dia: tempo no signo, ritmo, Lua, casas |
| `lib/vozes.mjs` | léxico e dados (título, hora, grau) das peças por comando |
| `lib/fontes.mjs` | as fontes embutidas em `data:` URI |
| `lib/templateCarrossel.mjs` | HTML/CSS dos slides |
| `lib/catalogo.mjs` | leitura dos catálogos `.ts` |
| `lib/template.mjs` | HTML/CSS do card e os diagramas SVG |
| `lib/__tests__/eventos.spec.mjs` | golden de efeméride (roda no `npx vitest run`) |

O design mora em `lib/template.mjs`, em HTML/CSS — ajustar o card é ajustar CSS,
não código de desenho.
