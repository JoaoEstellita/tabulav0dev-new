# Conexões Astrológicas — Design (spec)

> Criado: 2026-08-22 · Projeto: TabulaEstelar · Status: aprovado para planejamento

## 1. Visão e posicionamento

**O produto NÃO é "uma rede social".** É **"descubra com quem você mais combina — e fale com essas pessoas"**. O match astrológico (sinastria) é o centro e o diferencial; busca por nome, seguir e perfil são commodity e ficam em segundo plano.

O sistema **nasce dos grupos que já existem** (não de uma busca global vazia), evitando o cold-start clássico de rede social. A primeira "descoberta" são pessoas com quem o usuário já divide um grupo — e a matriz de compatibilidade dessas duplas **já existe no código** (`GroupsScreen` + `src/astro/synastry.ts`).

### O job-to-be-done
"Achei quem combina comigo (no grupo) → guardei o contato dela → e quero descobrir mais gente assim." A conexão só agrega valor **além do grupo** por dois motivos: **trocar WhatsApp** e **manter o vínculo depois que o grupo acaba** (a conexão persiste; o grupo é efêmero).

## 2. Travas de privacidade (fundação, valem em todas as fases)

Rede com **data de nascimento** (dado sensível, LGPD) + **WhatsApp** exige consentimento desenhado desde o início:

1. **Data/hora/local exatos de nascimento NUNCA são públicos** nem trafegam pra outro usuário. Só os **signos derivados** (Sol/Lua/Ascendente) e a sinastria **computada** (resultado, não os dados brutos).
2. **Ser encontrável é opt-in explícito** (Fase 2): default desligado; a pessoa liga "quero ser encontrado".
3. **WhatsApp só com duplo consentimento**: estar conectado não revela o número; cada lado libera o próprio, e o contato só aparece quando **ambos** liberaram.
4. **Conexão é pedido + aceite** (nunca unilateral).
5. **Bloquear/denunciar** desde a Fase 1 (junto com conexões).

## 3. Arquitetura de dados

### `connections/{connectionId}` (Fase 1)
Um doc por par de pessoas.
```
{
  participants: [uidA, uidB],        // ordenado (menor primeiro) → id determinístico
  requestedBy: uid,                  // quem enviou o pedido
  status: 'pending' | 'accepted' | 'blocked',
  originGroupId: string | null,      // grupo onde se conheceram (contexto)
  whatsappSharedBy: [uid...],        // quem liberou o próprio WhatsApp
  createdAt, acceptedAt
}
```
- `connectionId` = `${uidA}_${uidB}` (participantes ordenados) → evita pedidos duplicados.
- Query da lista: `where('participants', 'array-contains', meuUid)`.
- **Regras Firestore:** ler/escrever só se `request.auth.uid in participants`; `blocked` esconde de ambos.
- O **WhatsApp do outro** só é resolvido (lido de `users/{uid}.whatsappPhone`) quando `whatsappSharedBy` contém os **dois** — feito no backend, nunca exposto cru no doc.

### `userPublicProfiles/{uid}` (Fase 2 — já existe parcialmente)
A "vitrine" pública. `displayName`, `photoURL`, `sunSign/moonSign/ascSign`, `city` (aproximada), `discoverable` (bool), `nameTokens` (prefixos do nome em minúsculo p/ busca). **Nunca** aqui: nascimento exato, WhatsApp. Regra: leitura pública **só se `discoverable == true`**; escrita só do dono.

### `preferences.privacy.discoverable` (Fase 2)
Toggle "quero ser encontrado" (default `false`). Espelha o padrão já existente `preferences.privacy.showStatusToGroups`.

## 4. Roadmap (uma coisa por vez)

| Fase | Entrega | Custo/risco | Reusa |
|------|---------|-------------|-------|
| **1 — Conexões (MVP)** | botão "conectar" na matriz de sinastria dos grupos → pedido+aceite; troca de WhatsApp (duplo consentimento) no mesmo fluxo; lista "Minhas conexões" persistente; bloquear/denunciar | baixo | matriz de sinastria dos grupos, `synastry.ts`, whatsapp linking |
| **2 — Vitrine + Busca global** | opt-in "quero ser encontrado"; perfil público (nome/foto/trio/cidade); busca por nome (prefixo) + filtros cidade/signo; conectar fora do grupo | médio (busca Firestore) | `userPublicProfiles`, `preferences.privacy` |
| **3 — Match global (pago)** | "quem mais combina com você" fora dos grupos (ranking por afinidade); Pro/Premium + créditos; leitura detalhada | alto (escala do match) | `synastryScore`, `compatibility-score.js`, `credits.js`, `quota.js` |

### Monetização (alinha custo ↔ valor)
- **Grátis:** compatibilidade com gente dos **seus grupos** (já roda; custo zero) — a isca.
- **Pago (Pro/Premium):** **descoberta global por afinidade** (o ranking + alcance fora dos grupos) — exatamente o que custa infra e é o "wow".

## 5. Fase 1 (MVP) — detalhe do que construir primeiro

### Fluxo do usuário
1. Em **Grupos**, na matriz de duplas que já existe, cada membro (fora o viewer) ganha um botão **"Conectar"**.
2. "Conectar" abre um pedido: *"Conectar com {nome}? Compartilhar seu WhatsApp com ela?"* (compartilhar é opcional, marcável no ato).
3. O outro recebe (push + espelho no agente WhatsApp) e **aceita/recusa** — no aceite, também escolhe compartilhar ou não o próprio WhatsApp.
4. Aceito → viram **conexão**; se ambos compartilharam, cada um vê o WhatsApp do outro.
5. **Minhas conexões** — nova seção (dentro de Grupos, aba renomeável p/ "Pessoas") lista as conexões, com: nome, foto, trio, compatibilidade, e o WhatsApp **se** ambos liberaram. Persiste mesmo saindo do grupo.
6. Em cada conexão: **bloquear** (esconde de ambos) e **denunciar**.

### Backend (Fase 1)
- Endpoints (mesmo padrão dos handlers existentes) OU escrita direta via Firestore rules — decidir no plano. Ações: `criar pedido`, `responder (aceitar/recusar/compartilhar-wa)`, `listar conexões`, `bloquear/denunciar`.
- Resolver o WhatsApp do outro **server-side** só quando ambos liberaram.
- Notificação do pedido reusa o pipeline de push + o espelho do agente WhatsApp.

### Frontend (Fase 1)
- `GroupsScreen`: botão "Conectar" por membro na matriz (reusa `computeSynastryAspects`/`synastryScore` já presentes).
- Nova tela/seção **Conexões** (lista + estados pending/accepted/blocked).
- Fluxo de pedido/resposta (modais), estados de UI (pendente enviado/recebido).

### Fora de escopo da Fase 1 (YAGNI)
Busca global, perfil público, opt-in de descoberta, ranking pago, bio/texto livre, feed, mensagens dentro do app (a conversa acontece no WhatsApp). Tudo isso é fase posterior.

## 6. Desafio técnico a resolver na Fase 3 (sinalizado agora)
"Quem mais combina comigo" globalmente = sinastria contra **todos** = O(N) cálculos, caro em escala. Saída: **pré-filtrar antes do cálculo fino** — indexar uma "assinatura astrológica" leve (elementos/modalidades/posições-chave) + cidade + faixa, rodar a sinastria completa só nos ~top candidatos, cachear. Desenhar isso no plano da Fase 3, não antes.

## 7. Riscos e mitigações
- **Privacidade/LGPD:** seção 2 (opt-in, nascimento nunca público, WhatsApp duplo consentimento, bloquear/denunciar).
- **Custo Firestore:** Fase 1 lê só as conexões do usuário (poucos docs) + a matriz já carregada; busca global (Fase 2) por prefixo + paginação; match global (Fase 3) com pré-filtro.
- **Abuso/assédio:** conexão só por aceite; bloquear/denunciar na v1; sem texto livre (sem moderação na v1); WhatsApp nunca sem duplo consentimento.
- **Redundância com grupos:** a conexão agrega o WhatsApp + persistência fora do grupo — valor claro além do que o grupo dá.

## 8. Métrica de sucesso
Fase 1: % de duplas de grupo que viram conexão; nº de WhatsApp trocados. Fase 3: conversão Pro/Premium atribuída ao match global.
