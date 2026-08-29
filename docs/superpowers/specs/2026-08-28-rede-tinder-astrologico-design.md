# Rede "Tinder Astrológico" — Design (spec)

> Criado: 2026-08-28 · Projeto: TabulaEstelar · Status: aprovado para planejamento
> Evolui: [2026-08-22-conexoes-astrologicas-design.md](./2026-08-22-conexoes-astrologicas-design.md) (Fases 1–3 no ar)

## 1. Visão e posicionamento

A Rede sai de **"descubra com quem combina e conecte"** (vitrine + ranking) para uma
experiência de **descoberta ativa estilo Tinder, com a sinastria como motor**: a pessoa
vê um baralho de cards, **curte (❤️) ou passa (✖️)**, e quando **os dois se curtem = Match**
— que libera a conversa por WhatsApp (duplo consentimento que já existe).

O diferencial permanece **astrológico**: o baralho não é aleatório — dentro dos filtros
escolhidos, vem **ordenado por compatibilidade de mapa** (sinastria), com o **porquê** no card.

Não é um app de namoro genérico enxertado: é a evolução natural do que já existe
(`discoveryProfiles` + engine de match `matchScore`/`aspectsOf`), com perfil mais rico e
um fluxo de intenção mútua.

## 2. Decisões travadas (brainstorming 2026-08-28)

| Tema | Decisão |
|------|---------|
| Match libera | **Revela WhatsApp** (reusa `connections` + `whatsappSharedBy` duplo consentimento). Sem chat in-app nesta entrega. |
| Baralho | **Híbrido**: filtros (cidade · signo/elemento · faixa etária · interesses em comum) e, dentro do filtro, **ordem por sinastria**. |
| Gate | Rede inteira exige **assinante ativo OU trial**; grátis (nunca assinou / trial expirado) vê **paywall/teaser**. |
| Sub-menu | 3 seções no topo da Rede: **Descobrir · Match · Perfil**. |
| Fotos | **1 capa + até 3 extras** (Firebase Storage). |
| Gostos | **Tags curadas + bio livre**. |
| Swipe | **Cards com botões ❤️/✖️** (não gesto de arrastar — mais estável/web-friendly). |
| Filtros | cidade/distância · signo solar/elemento · faixa etária (expõe **idade**, não a data) · interesses em comum. |
| Card mostra | foto, nome, **idade**, cidade, ☉☽ASC, **% compatibilidade + porquês**, **interesses em comum**. |
| Nome da aba | **"Rede" → "Match" 💘** (label nos 4 idiomas mantém "Match"; troca o ícone/emoji da aba). |
| Guia de onboarding | **carrossel de slides** introduzindo a seção Match; dispara no **1º acesso** à aba + **sempre reabrível** por um botão. |

## 3. Travas de privacidade (herdadas + novas)

Herdadas do spec de Conexões (inalteradas):
1. **Data/hora/local de nascimento NUNCA públicos** — só signos derivados e a sinastria computada.
2. **WhatsApp só com duplo consentimento** — resolvido server-side quando ambos liberam.
3. **Conexão/Match é mútuo** — nunca unilateral.
4. **Bloquear/denunciar** disponível.

Novas (desta entrega):
5. **Likes são privados** — quem você curtiu/passou NÃO é visível a ninguém; a coleção `swipes`
   cai no catch-all `if false` (só backend). O outro só sabe do like **quando vira Match**. Isso é
   o contrato central do Tinder (sem "quem me curtiu" exposto).
6. **Idade, não data** — o filtro de faixa etária usa a **idade** (inteiro) derivada de
   `users.birthDate` e publicada em `discoveryProfiles.age`; a data/mês/ano **não** vão pra vitrine.
   (Exceção consciente e mínima à trava #1: idade inteira ≪ data de nascimento; necessária pro
   filtro que o produto pede.)
7. **Fotos extras** seguem o mesmo dono-only do `profilePhoto` no Storage; URLs guardadas em
   `discoveryProfiles` (só backend lê/entrega).
8. **Gate de conteúdo** — perfis, baralho e match só para assinante ativo/trial (seção 7).

## 4. Arquitetura de dados

### 4.1 `discoveryProfiles/{uid}` — ESTENDER (catch-all `if false`, só backend)
Campos atuais: `displayName, photoURL, sunSign, moonSign, ascSign, city, discoverable, nameTokens, matchPositions`.
Adicionar:
```
photos:    string[]        // [capa, extra1..3] — URLs do Storage; máx 4; photos[0] = capa
interests: string[]        // tags curadas (slugs), máx ~10
bio:       string          // texto livre curto, máx 300 chars, sanitizado
age:       number | null   // idade inteira derivada de users.birthDate (recalc no ensure-self)
element:   string | null   // fogo|terra|ar|agua do Sol — pra filtro por elemento (derivado do sunSign)
```
- `photos/interests/bio` vêm do **novo endpoint `set-profile`** (editados pelo usuário).
  `buildPublicProfile` (natal/nome/cidade/age/element) **NÃO os inclui** → o `merge:true` preserva.
- `age`/`element` derivam de dados já calculados; entram no `buildPublicProfile`.

### 4.2 `swipes/{fromUid}_{toUid}` — NOVA (catch-all `if false`, só backend)
Um doc por decisão direcional.
```
{ from: uid, to: uid, action: 'like' | 'pass', at: serverTimestamp }
```
- Id direcional `${from}_${to}` (não ordenado — importa quem curtiu quem) → idempotente.
- **Match** = existe `swipes/{A}_{B}` like **e** `swipes/{B}_{A}` like.
- Nunca lido pelo cliente (privacidade #5). O deck exclui quem o viewer já swipou.

### 4.3 `connections/{connectionId}` — REUSAR (sem mudança de schema)
No Match, o backend cria/atualiza a connection existente:
`participants:[A,B]`, `status:'accepted'`, `requestedBy: quem fechou o match`, `origin:'match'`,
`acceptedAt`. O WhatsApp continua saindo do `share-wa`/`whatsappSharedBy` (duplo consentimento).
Assim o Match aterrissa no mesmo fluxo de "conexão aceita" que a UI de Match/Conexões já entende.

### 4.4 Regras Firestore
**Nada a alterar.** `discoveryProfiles`, `swipes` e `connections` caem no
`match /{document=**} { allow read, write: if false }` → acesso só via backend (Admin SDK).
Confirma a regra do projeto: **não mexer em regras de segurança**.

### 4.5 Storage (fotos)
Reusa o caminho do `profilePhoto` (hoje via `UserService.setProfilePhoto`). Fotos extras em
`users/{uid}/network/{n}.jpg` (dono-only, padrão do avatar). Backend recebe as URLs no `set-profile`
e valida que pertencem ao bucket/prefixo do próprio uid.

## 5. Telas e navegação

### 5.1 Sub-menu (segmented control no topo da Rede) — `Descobrir · Match · Perfil`
Fica **acima** das abas atuais (Pessoas/Recebidos viram sub-conteúdo de "Descobrir"/"Match").

- **Descobrir** (o coração)
  - **Baralho**: card grande (foto capa, nome, idade, cidade, ☉☽ASC, **% compatibilidade + 2-3 porquês**,
    **interesses em comum**), botões **✖️ passar / ❤️ curtir**; ao curtir com like recíproco → animação de **Match**.
  - Barra de **filtros** (cidade · signo/elemento · faixa etária · interesses em comum) — abre um sheet.
  - Sub-aba **Lista**: a busca/lista atual (`list`/`search`) preservada (quem prefere navegar em vez de swipar).
  - Fim do baralho → empty state ("acabaram por agora; ajuste os filtros ou volte depois").

- **Match**
  - **Seus Matches**: quem deu match com você (connection `accepted` de origem match), com foto, %,
    e o WhatsApp **quando ambos liberaram** (senão CTA "liberar meu WhatsApp").
  - **Pedidos/Conexões**: o que a Rede já tinha (recebidos/enviados/aceitos) — reaproveita `MatchesScreen`/lista.

- **Perfil**
  - Editar o **seu** card: **fotos** (capa + até 3, adicionar/remover/reordenar), **interesses**
    (tags curadas tocáveis), **bio** (300 chars), toggle **"quero ser encontrado"** (`set-discoverable`),
    prévia de como seu card aparece pros outros.

### 5.2 Gate visual
Não-assinante (nem trial): a Rede mostra um **paywall rico** (preview de 1-2 cards borrados + "Assine para
descobrir quem combina com você") com CTA para o fluxo de assinatura já existente. Nada de dados reais vaza.

## 6. Backend — endpoints (estende `discovery.js`, mesmo handler)

| Ação | Faz | Gate |
|------|-----|------|
| `set-profile` | grava `photos[]`, `interests[]`, `bio` (validados/sanitizados) em `discoveryProfiles` | ativo/trial |
| `deck` | baralho paginado: descobríveis − já swipados − conectados/bloqueados − eu; aplica filtros; ordena por `matchScore` (reusa `aspectsOf`); devolve N cards com %+porquês+interesses comuns | ativo/trial |
| `swipe` | grava `swipes/{me}_{alvo}` (like/pass); se like recíproco → cria/atualiza `connection` accepted + notifica os dois ("Deu Match!") ; devolve `{ matched: bool }` | ativo/trial |
| `my-matches` | lista connections `accepted` origem match (foto, %, WhatsApp se mútuo) | ativo/trial |
| `interests-catalog` | devolve as tags curadas (i18n) — ou embutir no cliente (estático) | — |

Ajustes nos endpoints atuais:
- `list`/`search`/`match`/`synastry`/`ensure-self`/`get-profile`: passam a exigir **ativo/trial**
  (hoje `list`/`search` são abertos; `match`/`synastry` são `isSubscriber`). Unifica no gate da seção 7.
- `ensure-self` e `set-discoverable`: `buildPublicProfile` passa a preencher `age` e `element`.
- `get-profile`/`deck`/`my-matches`: `publicView` passa a devolver `photos`, `interests`, `bio`, `age`
  (nunca `matchPositions`, nunca dado de nascimento).

### 6.1 Custo (Firestore) — desenhar com cuidado
- `deck` é o ponto caro (varre descobríveis + calcula sinastria). Mitigações: **paginação** (baralho de
  ~10 por vez), **cap** (`limit` defensivo como o `match` de hoje usa 300), **pré-filtro barato** (cidade/
  signo/elemento/idade reduzem o pool ANTES do cálculo fino de sinastria), e **cache** do baralho por
  viewer (curta duração) pra o swipe consecutivo não re-varrer. Alinha com o item já sinalizado na Fase 3
  do spec antigo (§6 de lá).
- `swipe` = 1-2 reads (o swipe recíproco) + 1-2 writes. Barato.

## 7. Gate — assinante ativo OU trial

`entitlements(uid).isPremium` já = **admin OU assinatura ativa OU trial não-vencido** (ver
`lib/premium/entitlements.js`). É exatamente "ativo + trial". Usar `isPremium` como gate de TODA a Rede
(não `isSubscriber`, que exclui trial). Grátis → resposta `{ gated: true }` e paywall no cliente.

## 8. Design — rico e inovador

- Paleta existente da Rede (índigo profundo + dourado identidade + magenta match/sinastria) — manter coesão.
- Card de descoberta com **profundidade** (sombra/realce da capa), o **anel de compatibilidade** (arco %),
  chips de interesses em comum destacados, ☉☽ASC com os glifos.
- **Animação de Match** (overlay celebrando "vocês combinam", com as duas fotos e o %) — o momento "wow".
- Botões ❤️/✖️ com feedback tátil/haptics; transição suave de card.
- Empty states cuidados (fim do baralho, sem matches ainda, perfil incompleto → nudge pra completar).
- Acessível e web-friendly (sem depender de gesto de arrastar).

## 9. Fases de entrega (cada uma deployável)

| Fase | Entrega | Reusa |
|------|---------|-------|
| **1 — Perfil + gate + sub-menu** | sub-menu Descobrir/Match/Perfil; edição de perfil (fotos capa+3, tags, bio); `set-profile`; `age`/`element` no `buildPublicProfile`; gate `isPremium` em toda a Rede + paywall | `discoveryProfiles`, Storage do avatar, `entitlements` |
| **2 — Baralho + swipe + match** | `deck` (filtros + ordem astral + paginação/cache), UI do baralho e botões, `swipe`, detecção de match → `connection` accepted + notificação, tela **Match** (my-matches + WhatsApp mútuo) | engine `matchScore`/`aspectsOf`, `connections`, push/notify |
| **3 — Polish visual** | card rico (anel de %, chips), animação de Match, haptics, empty states, prévia do próprio card | design system da Rede |

## 10. Riscos e mitigações

- **Custo Firestore no `deck`** → pré-filtro barato + paginação + cap + cache por viewer (§6.1).
- **Privacidade** → likes privados (`swipes` if false), idade≪data, WhatsApp duplo consentimento, nascimento nunca público (§3).
- **Abuso/assédio** → match é mútuo; bloquear/denunciar (já existe); bio sanitizada (sem links/spam), sem chat in-app (sem superfície de moderação nesta entrega).
- **Fotos impróprias** → nesta entrega, denúncia + remoção manual (admin); moderação automática fica pra depois se o volume pedir.
- **Regressão** → tudo atrás do gate e das fases; a Rede antiga (lista/busca/ranking) continua funcionando durante a transição.

## 11. Testes

- **Puros (Vitest/node):** `buildPublicProfile` com os novos campos (`age`/`element` derivados; não sobrescreve photos/interests/bio); lógica de match recíproco (dado swipes A→B e B→A likes → matched); filtro do deck (pré-filtro reduz pool; ordena por score); sanitização da bio.
- **Backend (node unit):** `swipe` idempotente; `set-profile` valida limites (≤4 fotos, ≤10 tags, bio ≤300); gate `isPremium` bloqueia grátis nos endpoints.
- **i18n:** tags de interesse + textos da Rede nos 4 idiomas (es/it sem acento pela regra do projeto).

## 12. Renomear a aba: "Rede" → "Match" 💘

- Troca o **label** da aba (hoje "Rede") por **"Match"** — mantido igual nos 4 idiomas (nome universal).
- Troca o **ícone/emoji** da aba (hoje um Ionicon) por um de match (coração/💘 — no navigator usamos um
  Ionicon equivalente, ex.: `heart`/`heart-circle`, com 💘 como referência visual).
- Ponto único de mudança: a definição da tab no navigator + as chaves i18n do título. Sem impacto em rota
  (o `name` técnico da rota pode continuar; muda só o `title`/label e o ícone) — evita quebrar deep-links.

## 13. Guia de onboarding — carrossel de introdução ao Match

**Formato:** carrossel de slides (desliza horizontal), 3–5 telas, cada uma com ilustração + título curto +
1-2 linhas. Fecha com CTA "Começar". Coeso com a paleta da Rede (índigo/dourado/magenta).

**Conteúdo (rascunho dos slides):**
1. *Descubra com quem você combina* — a sinastria acha as pessoas mais compatíveis com o seu mapa.
2. *Curta ou passe* — veja os cards, ❤️ pra curtir, ✖️ pra passar. Simples como deve ser.
3. *Deu Match!* — quando os dois se curtem, vocês combinam de verdade — e podem trocar o WhatsApp.
4. *Seu perfil, do seu jeito* — fotos, seus interesses e uma bio. Perfis completos combinam mais.
5. *(se assinante)* Comece agora / *(se grátis)* Assine para descobrir — CTA contextual ao gate.

**Gatilho:**
- **1º acesso** à aba Match → abre automático (flag `onboarding.matchTourSeen` em `users/{uid}` ou AsyncStorage;
  preferir `users` pra persistir entre dispositivos).
- **Sempre reabrível** → botão discreto "como funciona" (ícone de ajuda) no topo da aba Match.

**i18n:** títulos e textos dos slides nos 4 idiomas (es/it sem acento pela regra do projeto).

**Escopo:** por ora **só a seção Match**. A arquitetura do carrossel fica **reutilizável** (um componente
`IntroCarousel` genérico com slides parametrizáveis) pra, depois, cobrir outras seções sem reescrever.

**Entrega:** entra junto da **Fase 1** (perfil + gate + sub-menu) — é a porta de entrada da seção nova.

## 14. Métrica de sucesso
% de sessões da Rede que resultam em ≥1 like; nº de Matches/semana; nº de WhatsApp trocados via match;
conversão grátis→assinante atribuída ao paywall da Rede.
