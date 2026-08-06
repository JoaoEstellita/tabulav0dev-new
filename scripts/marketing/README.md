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

**Não é um CMS, de propósito.** Não edita, não agenda, não guarda estado, não
publica. Só mostra o que o gerador já produziu.

Detalhe de implementação: a cópia usa `textarea` + `execCommand` como caminho
principal, não `navigator.clipboard`, porque a Clipboard API exige contexto
seguro e o visor local roda em HTTP.

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

**Leitura dos catálogos.** Node 20 não tem `--experimental-strip-types` e o
projeto não expõe esbuild. `lib/catalogo.mjs` extrai o objeto literal direto do
`.ts` (varredura balanceada, respeitando strings e comentários) em vez de
transpilar o arquivo — transpilar quebrava em `const` tipado sem `export`.
Duplicar os textos aqui faria o card divergir do app na primeira curadoria.

## Arquivos

| | |
|---|---|
| `gerarCard.mjs` | orquestrador e CLI |
| `estudio.mjs` | visor local para postar do celular |
| `provaGeometria.mjs` | folha de prova dos 5 aspectos |
| `lib/ceu.mjs` | aspectos do céu, força, área da vida |
| `lib/catalogo.mjs` | leitura dos catálogos `.ts` |
| `lib/template.mjs` | HTML/CSS do card e o diagrama SVG |

O design mora em `lib/template.mjs`, em HTML/CSS — ajustar o card é ajustar CSS,
não código de desenho.
