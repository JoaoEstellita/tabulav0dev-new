# Estratégia de Marketing — Tábula Estelar

**Data:** 2026-08-05
**Contexto:** verba de mídia paga = R$ 0. Aquisição orgânica primeiro.
**Capacidade de execução:** ~4-5h/semana, sem aparecer em vídeo.
**Público:** quem usa astrologia como ferramenta de decisão, não como crença.

---

## 1. Posicionamento

### O buraco no mercado

O mercado brasileiro de astrologia está partido em dois extremos:

| Extremo | Quem | Força | Fraqueza |
|---|---|---|---|
| Místico e vago | Personare, perfis de meme astral | Alcance enorme | Credibilidade baixa |
| Técnico e frio | Astro.com, softwares de astrólogo | Precisão | Ilegível pra leigo |

Ninguém ocupa o meio: **rigor de cálculo com linguagem de decisão**. É onde o Tábula Estelar já está — a landing atual já diz *"Entenda seus ciclos com clareza. Cálculos coerentes e transparentes."* O trabalho não é reposicionar. É amplificar.

### A grande ideia

> ## Pare de ler seu signo. Leia seu mapa.

Funciona porque:

1. **Cria inimigo comum** — o horóscopo de signo, que fala igual pra 1/12 da humanidade. O público-alvo já acha isso bobo; a marca concorda com ele em público.
2. **Posiciona por contraste**, não por adjetivo. Não é "o melhor app de astrologia" — é *a coisa que o horóscopo não é*.
3. **É compartilhável** — funciona como frase solta, em print, sem contexto.
4. **É sustentável por prova** — Placidus real, efemérides Swiss, 8 áreas com score. A afirmação se comprova.

### Frase de marca (secundária, para bio e landing)

> **Astrologia não prevê o futuro. Ela mede o tempo.**

Esta é a permissão intelectual que o público cético procura. Reposiciona a categoria em sete palavras.

### Escada de mensagem

| Camada | Texto |
|---|---|
| Hook (topo) | Pare de ler seu signo. Leia seu mapa. |
| Promessa (meio) | O céu de hoje, calculado sobre o SEU mapa — em 8 áreas da vida. |
| Prova (fundo) | Efemérides Swiss. Casas Placidus reais. Sem texto genérico. |
| Ação | Mapa natal grátis em 1 minuto → tabulaestelar.com.br |

### Régua de copy

Toda peça passa por estes dois testes antes de publicar:

1. **Especificidade vence generalidade.** "Seu horóscopo foi escrito em março" > "horóscopos são genéricos".
2. **Admitir o limite vende mais que prometer tudo.** O cético acredita em quem aponta a própria fronteira antes dele apontar.

### O que nunca fazer

- Previsão de destino ("você vai encontrar o amor em…")
- Medo ("cuidado com Mercúrio retrógrado")
- Promessa de sorte
- Vagueza que serve pra qualquer pessoa

Todo concorrente faz isso. É exatamente o que o público-alvo despreza.

---

## 2. Pilares de conteúdo

| # | Pilar | Papel no funil | Volume |
|---|---|---|---|
| **P1** | **Desmonte** — ataca o horóscopo genérico com fato | Traz o cético de fora | 20% |
| **P2** | **Céu de hoje** — o trânsito real do dia | Cria hábito de retorno | 40% |
| **P3** | **Mecânica** — como o sistema funciona | Constrói autoridade, converte cético → usuário | 25% |
| **P4** | **Produto** — prova de que existe e funciona | Converte em cadastro/assinatura | 15% |

**P1 traz. P3 faz confiar. P4 vende. P2 segura.** Só o P2 é diário — e é justamente o automatizável.

---

## 3. Pipeline de produção

O ativo que nenhum concorrente tem: **o conteúdo já existe no código**.

```
frontend/src/data/transitTitlesPtBR.ts        → 87 títulos de trânsito
frontend/src/data/transitAphorismsPtBR.ts     → 87 aforismos
frontend/src/data/transitCatalogOverridesPtBR.ts → interpretações curadas
frontend/src/constants/lifeAreas.ts           → LIFE_AREA_ATTRIBUTION (8 áreas)
```

### Fluxo do gerador

```
efemérides do dia (motor existente)
  → seleciona o trânsito mais relevante
  → título        (transitTitlesPtBR)
  → aforismo      (transitAphorismsPtBR)
  → área da vida  (LIFE_AREA_ATTRIBUTION)
  → renderiza card 1080×1350 (feed) + 1080×1920 (story)
  → salva em marketing/out/YYYY-MM-DD/
```

Custo diário de operação: **~2 minutos** (abrir a pasta, conferir, publicar).

### Regra inegociável

**Design antes de automação.** Automação sem sistema visual é amadorismo em escala — o mesmo problema, 30× por mês. O template do card é fechado *antes* de o gerador ser escrito.

Base visual disponível:
- paleta do app: `#0a0e27` (fundo), `#FFD700` (dourado)
- `LIFE_AREA_COLORS` — cor por área da vida
- `frontend/public/planets/` — imagens dos planetas

---

## 4. Grade semanal (cabe em 4-5h)

| Dia | Peça | Pilar | Tempo |
|---|---|---|---|
| Todo dia | Card "céu de hoje" (feed + story) | P2 | **0h** — gerado |
| Terça | Reel 30-40s | P1 | 1h |
| Quinta | Reel 40-50s | P3 | 1h |
| Sábado | Carrossel | P4 | 1h |
| Todo dia | Comentários e DM | — | 15min |

**Total: ~4h45.**

### Distribuição

Todo Reel produzido vai pros três canais no mesmo dia: **Instagram Reels, TikTok, YouTube Shorts**. Mesmo arquivo, custo marginal zero, três algoritmos testando em paralelo. TikTok é hoje o que mais entrega alcance orgânico a conta nova no Brasil.

---

## 5. Funil de conversão

```
Reel (P1/P3) → perfil → link na bio → landing
  → mapa natal grátis (1 min, sem cartão)
  → status do dia nas 8 áreas
  → vincula WhatsApp → agente responde 2 perguntas grátis
  → 3ª pergunta = paywall → PIX no chat → assinante
```

Todas as etapas já estão construídas. A campanha só enche o topo.

---

## 6. Conserto da base — @tabula_estelar

Estado em 2026-08-05: **2 posts, 219 seguidores, 651 seguindo.**

| Problema | Por que mata | Conserto |
|---|---|---|
| 651 seguindo / 219 seguidores | Ratio 3:1 invertido = sinal de conta follow-for-follow. Algoritmo desconfia; visitante cético percebe na hora. | Unfollow gradual até < 200. **Máx. 50/dia** (acima disso = bloqueio de ação). ~10 dias. |
| Bio lista features | "Status pessoais e em grupo" é changelog, não promessa. Ninguém segue por feature. | Bio nova (abaixo) |
| Categoria "Criador de conteúdo digital" | Default vazio, não ajuda busca nem posicionamento | Trocar para **Aplicativo móvel** |
| 2 posts | Grade vazia = produto abandonado. Quem vem do Reel não segue. | Encher com 9 cards **antes** do primeiro Reel |

### Bio nova

```
Nome:       Tábula Estelar | Astrologia calculada
Categoria:  Aplicativo móvel

Pare de ler seu signo. Leia seu mapa.
🌘 O céu de hoje sobre o SEU mapa — em 8 áreas da vida
🔭 Efemérides Swiss · casas Placidus reais
↓ Seu mapa natal grátis em 1 minuto

Link: tabulaestelar.com.br/?utm_source=instagram&utm_medium=bio
```

O campo **Nome** é indexado na busca do Instagram; o @ não é. "Astrologia calculada" ali gera descoberta orgânica.

### Ordem de execução (importa)

```
1. gerar os 9 cards novos
2. publicar os 9
3. SÓ ENTÃO arquivar os 2 antigos
```

**Arquivar, não deletar.** Arquivar é reversível e preserva histórico de engajamento — que o algoritmo lê. Deletar não traz ganho nenhum. Vale também para os destaques atuais ("app", "menções"), a serem refeitos com capas no padrão novo.

### Ponto de atenção (sem urgência)

A logo (três figuras + estrela) lê como Reis Magos / natividade. Iconografia religiosa cristã cria ruído num posicionamento racional-analítico. Não mexer agora — anotar como revisão futura.

---

## 7. Calendário — 30 dias

### Semana 0 — preparação

Uma tarde de trabalho, mais 10 dias de unfollow em segundo plano.

1. Bio, nome e categoria novos
2. Rodar o gerador com datas retroativas → **9 cards** → publicar de uma vez (grade 3×3 cheia)
3. Iniciar unfollow, 50/dia
4. Criar **conta de demonstração** no app — o print atual mostra *"Olá, João Estellita!"* e data de 12 de janeiro. Conteúdo de produto precisa de conta neutra e atual.
5. Abrir TikTok e YouTube com o mesmo @

### Semanas 1-4

| | Seg | Ter | Qua | Qui | Sex | Sáb | Dom |
|---|---|---|---|---|---|---|---|
| Feed | Card | **Reel P1** | Card | **Reel P3** | Card | **Carrossel P4** | Card |
| Story | Card do dia, todos os dias + 1 enquete/semana |

### Meta realista dos 30 dias (verba zero)

- 219 → **600-900 seguidores**
- **40-80 cadastros** no app
- **3-8 assinantes**

Orgânico compõe, não explode. Números maiores no primeiro mês seriam anomalia, não sucesso.

---

## 8. Roteiros

### Reel 1 — Estreia (P1, Desmonte)

**30-36s, vertical, sem rosto.** Texto grande na tela, fundo cósmico, telas do app. Música instrumental tensa, sem letra.

| Tempo | Na tela | Texto |
|---|---|---|
| 0-4s | Texto branco, fundo preto | **Seu horóscopo de hoje foi escrito em março.** |
| 4-9s | Mesmo estilo | Revista fecha edição com meses de antecedência. Aquele texto não olhou pro céu de hoje. Olhou pro calendário de fechamento. |
| 9-14s | Corte, fundo cósmico | Astrologia não funciona assim. |
| 14-22s | Roda do mapa girando | Ela olha onde os planetas estão **agora** — e cruza com onde estavam no minuto em que você nasceu. |
| 22-30s | Trânsitos se movendo | Isso muda todo dia. E muda diferente pra cada pessoa. |
| 30-36s | Tela das 8 áreas | **Não dá pra escrever isso com três meses de antecedência. Dá pra calcular.** |
| Fim | Card estático | Seu céu de hoje, calculado. Grátis no link da bio. |

**Legenda:**

> Horóscopo de revista é escrito com meses de antecedência. Ele não pode ter olhado pro céu de hoje — ele foi fechado antes de hoje existir.
>
> Trânsito é outra coisa: é onde os planetas estão agora, cruzado com onde estavam no instante exato do seu nascimento. Muda todo dia, e muda diferente pra cada mapa.
>
> A gente calcula com efemérides Swiss e casas Placidus reais. Sem texto pronto.
>
> Mapa natal grátis no link da bio. 🌘

**Hashtags:** `#astrologia #mapanatal #transitos #ascendente #astrologiareal #autoconhecimento #astrologiabrasil #cicloS`

---

### Reel 2 — Mecânica (P3)

O mais estratégico dos três: constrói autoridade **e** justifica o campo mais atritado do cadastro (hora exata de nascimento). Quem entende por que precisa, preenche.

**40-45s, vertical, sem rosto.**

| Tempo | Na tela | Texto |
|---|---|---|
| 0-5s | Texto grande | **Se você não sabe a hora que nasceu, 11 das 12 casas do seu mapa são chute.** |
| 5-11s | Roda com as casas destacando | A casa é o que diz **onde** o trânsito bate. Carreira, dinheiro, saúde, amor. |
| 11-18s | Horizonte + grau subindo | Quem define as casas é o Ascendente: o grau do zodíaco que estava subindo no horizonte no seu primeiro minuto de vida. |
| 18-26s | Relógio e roda girando juntos | Ele anda **um grau a cada quatro minutos**. Troca de signo a cada duas horas. |
| 26-33s | Dois mapas lado a lado | Vinte minutos de diferença, e metade do seu mapa muda de casa. |
| 33-40s | Tela de cadastro | **Por isso a gente insiste na hora exata. Ela está na sua certidão de nascimento.** |
| Fim | Card | Mapa completo, grátis. Link na bio. |

**Legenda:**

> Todo app que não pede sua hora de nascimento está te entregando meio mapa.
>
> O Ascendente muda de signo a cada ~2 horas. É ele que define onde começa cada uma das 12 casas — e é a casa que diz em que área da vida o trânsito vai bater. Sem hora, sem casas. Sem casas, sobra o signo solar. E signo solar sozinho é aquele horóscopo que fala com 700 milhões de pessoas ao mesmo tempo.
>
> Não sabe sua hora? Está na certidão de nascimento. Vale procurar.
>
> Placidus real, efemérides Swiss. Link na bio. 🌘

**Nota de execução:** a linha final ("está na certidão de nascimento") remove atrito real de cadastro. Manter em toda peça que peça hora de nascimento.

---

### Carrossel 3 — Produto (P4)

Carrossel converte melhor que Reel para produto: a pessoa controla o ritmo e o print fica legível.

**7 telas, prints reais do WhatsApp** — com a conta de demonstração, nunca a pessoal.

| # | Conteúdo |
|---|---|
| 1 | Capa: **"Perguntei pro meu app se eu devia pedir aumento essa semana. Ele mandou esperar 11 dias — e explicou por quê."** |
| 2 | Print: a pergunta enviada no WhatsApp |
| 3 | Print: resposta do agente citando o trânsito real — planeta, casa, período |
| 4 | Print: follow-up ("e depois do dia 20?") |
| 5 | Print: resposta com o horizonte de tempo |
| 6 | Texto: **"Não é chatbot genérico. Ele leu o meu mapa antes de responder."** |
| 7 | CTA: mapa grátis → vincula WhatsApp → 2 perguntas de graça |

**Por que esse carrossel importa:** nenhum concorrente relevante no Brasil tem astrólogo por WhatsApp com contexto do mapa do usuário. É o diferencial mais difícil de copiar — e hoje ninguém sabe que existe.

---

## 9. Métricas

Com verba zero, três números importam. Os outros são vaidade.

| Métrica | Onde | Por quê |
|---|---|---|
| **Alcance de contas NÃO-seguidoras** | Instagram Insights | Único número que diz se o algoritmo está distribuindo. Curtida não diz nada. |
| **Cliques no link da bio** | UTM + analytics da landing | Mede se o conteúdo gera intenção ou só entretém |
| **Cadastros → assinantes** | Firestore | O funil de verdade |

Registro semanal, toda segunda:

```
alcance não-seguidor → seguidores novos → cliques bio
    → cadastros → vincularam WhatsApp → assinaram
```

Em 4 semanas isso produz as taxas reais de cada etapa. **São elas que autorizam (ou não) gastar dinheiro em anúncio.**

---

## 10. Meta Ads — gatilho e estrutura

### Quando ligar

Não antes dos três:

1. ≥ 30 cadastros vindos do orgânico
2. ≥ 3 assinantes pagos, sendo ao menos 1 que não conhece o João
3. Taxa cadastro→assinante conhecida e ≥ 5%

Ligar antes é pagar pra descobrir que o funil vaza.

### A conta que muda a estratégia de anúncio

Estimativas, a validar com dados reais do projeto:

| | |
|---|---|
| Essential | R$ 19,90/mês |
| Churn típico de app de astrologia | 15-25%/mês |
| LTV bruto estimado | ~R$ 80 a 130 |
| Custo variável (LLM Sonnet + Firestore) | **a medir** — o agente não é barato |
| **CPA máximo saudável** (LTV ÷ 3) | **~R$ 27 a 43** |

Referência de mercado (BR): CPC de R$0,80-2,00 e conversão de landing de 2-5% colocam o custo por **assinante pago** facilmente acima de R$60-100 numa conta nova, sem histórico de pixel.

**Conclusão: com o Essential a R$19,90 e otimizando para compra, a matemática não fecha.** Duas saídas — adotar as duas:

**a) Otimizar o anúncio para cadastro grátis, não para compra.**
CPA de lead fica em R$3-8, viável. O funil de WhatsApp — já construído — faz a conversão depois, de graça. É o único jeito de anúncio fechar nesse ticket.

**b) Criar plano anual.**
Hoje só existe `*_monthly` em `frontend/src/constants/plans.ts`. Um anual a ~R$199 (dois meses de desconto) triplica o LTV no ato do pagamento e resolve o CAC de uma vez. **É a mudança de maior impacto financeiro desta lista inteira**, e é uma constante num arquivo.

### Estrutura de campanha

| Campanha | Objetivo | Público | Quando |
|---|---|---|---|
| 1 — Aquisição | Conversão → evento **Lead** | Amplo, BR, 25-45, Advantage+ | Na largada |
| 2 — Remarketing | Conversão → **Purchase** | Visitou a landing, não cadastrou (30d) | Junto com a 1 |
| 3 — Lookalike 1% | Conversão → Lead | Semelhante aos assinantes pagos | Só com 50+ assinantes; antes disso não há sinal estatístico |

Verba mínima real: **R$ 50/dia**. Abaixo disso a campanha não sai da fase de aprendizado e o dinheiro vira ruído.

### Pré-requisito técnico — fazer agora, de graça

Meta Pixel e Conversions API **não estão instalados** na landing. Sem eles, o anúncio roda cego no dia 1. Instalando agora, quando a verba chegar já existe público de remarketing acumulado.

| Evento | Dispara em | Como |
|---|---|---|
| `PageView` | landing | Pixel (browser) |
| `Lead` | cadastro concluído | Pixel |
| `StartTrial` | vinculou WhatsApp | Pixel |
| `Purchase` | assinatura confirmada | **CAPI server-side** — o PIX confirma no webhook do MercadoPago, fora do browser. Pixel não captura. |

---

## 11. Riscos

| Risco | Impacto | Ação |
|---|---|---|
| **vc18 crasha no launch** (Play Store) | Instalação vira avaliação 1 estrela permanente na ficha | Tráfego **só para o PWA** até o vc19. Nenhum CTA para a Play Store. |
| ~~Billing GCP~~ | — | ✅ **Resolvido, verificado em 2026-08-05.** Ver abaixo. |
| Conteúdo bom, perfil vazio | Alcance sem conversão | Semana 0 antes de tudo |
| Cards gerados sem sistema visual | Amadorismo em escala | Template fechado antes do gerador |
| ~390 leituras Firestore por usuário-ativo/dia | Hoje custa centavos; a 10× o tráfego, multiplica | Investigar tela que relê coleção inteira **antes** de escalar |

### Billing GCP — verificação de 2026-08-05

`billingEnabled: true`, conta `011014-066BDD-2816EE` com `open: true` (BRL).

A prova decisiva é o consumo real: **58–70 mil leituras/dia contra um teto grátis
de 50 mil**. O projeto passa do teto todos os dias e não bloqueia — o que só
acontece com billing saudável. Em 12/07 o mesmo cenário derrubava a API com
`RESOURCE_EXHAUSTED`.

| Métrica | Por dia | Teto grátis |
|---|---|---|
| Leituras | 58.000–70.000 | 50.000 (estourado, vira cobrança) |
| Escritas | ~400 | 20.000 |
| Deleções | ~70 | — |

**Como reverificar** (Cloud Logging não serve: o backend roda no Vercel, não no
GCP, então não há logs de aplicação lá):

```bash
gcloud billing projects describe tabula-estelar-84fdc

TOK=$(gcloud auth print-access-token)
curl -sG "https://monitoring.googleapis.com/v3/projects/tabula-estelar-84fdc/timeSeries" \
  -H "Authorization: Bearer $TOK" \
  --data-urlencode 'filter=metric.type="firestore.googleapis.com/document/read_count"' \
  --data-urlencode "interval.startTime=$(date -u -d '3 days ago' +%Y-%m-%dT%H:%M:%SZ)" \
  --data-urlencode "interval.endTime=$(date -u +%Y-%m-%dT%H:%M:%SZ)" \
  --data-urlencode 'aggregation.alignmentPeriod=86400s' \
  --data-urlencode 'aggregation.perSeriesAligner=ALIGN_SUM' \
  --data-urlencode 'aggregation.crossSeriesReducer=REDUCE_SUM'
```

---

## 12. Ordem de execução

| # | Tarefa | Bloqueia |
|---|---|---|
| 1 | Confirmar billing GCP resolvido | Tudo |
| 2 | Fechar template visual do card | Gerador |
| 3 | Construir o gerador de cards | Semana 0 |
| 4 | Bio, nome, categoria novos | — |
| 5 | Gerar 9 cards → publicar → arquivar os 2 antigos | Primeiro Reel |
| 6 | Iniciar unfollow (50/dia) | — |
| 7 | Conta de demonstração no app | Carrossel P4 |
| 8 | Abrir TikTok e YouTube | Distribuição |
| 9 | Instalar Pixel + CAPI | Meta Ads (futuro) |
| 10 | Criar plano anual | Meta Ads (futuro) |
| 11 | Iniciar grade semanal | — |
