# Tzolkin / Dreamspell — Fase 2 (Match / Sinastria)

**Data:** 2026-09-01
**Status:** aprovado (escopo "Ambos" + incluir no cálculo do Match)
**Depende de:** Fase 1 (motor solo). Ver [spec Fase 1](2026-09-01-tzolkin-dreamspell-fase1-design.md).

## Objetivo
Camada "Tzolkin Match" entre 2 pessoas: relações diretas, cruzamento de oráculos, Kin da relação e um `TzolkinMatchScore` (modelo do app). Exibir na **grade de sinastria dos grupos** e no **Match/Conexões**, e **incluir no cálculo** do ranking do Match via `combinedScore` configurável — sem destruir o algoritmo astrológico atual.

## Ético
"Tzolkin Match = modelo do app construído sobre relações Dreamspell." NUNCA "porcentagem maia", "compatibilidade oficial", "probabilidade de dar certo". Antípoda = desafio/fortalecimento, nunca "incompatibilidade".

## Motor — `src/astro/tzolkin/match.ts` (puro)
`getTzolkinMatch(isoA, isoB)` retorna:
- `a, b`: TzolkinProfile (buildProfile)
- `directRelations: { aToB: string[]; bToA: string[] }` — keys: `same-kin`, `same-seal`, `same-tone`, `guide`, `analog`, `antipode`, `occult` (Guia NÃO é simétrico → aToB ≠ bToA)
- `crossConnections: TzolkinMatchConnection[]` — selos/tons compartilhados nos 2 oráculos, selos consecutivos, onda compartilhada, selo-regente-da-onda na família do outro, castelo compartilhado, família compartilhada. Cada um `{ type, canonical, importance, aElement, bElement }`
- `relationshipKin: number` — soma nominal: `sealSum=sealA+sealB (>20→-20)`, `toneSum=toneA+toneB (>13→-13)`, `kinBySealTone`. (137×96→233.)
- `scores: { overall, support, growth, communication, rhythm, intensity }` (0..100)
- `tags: string[]`

**Pesos:** `TZOLKIN_MATCH_WEIGHTS` (config central, não hardcoded em componentes).

**Regressão obrigatória (§28 do prompt) — 137×96:**
não análogo/antípoda/oculto diretos; selos 16,17 consecutivos; **Semente** no oráculo de ambos (oculto de A=124 e guia de B=44 são Semente); regente da onda de A (Macaco) na família Cardinal de B; regente da onda de B (Humano) na família Núcleo de A; `relationshipKin=233`; scores em [0,100].

## Textos curados ×4
Papéis de relação, rótulos de tags, disclaimer de par. Composição determinística (padrão Fase 1).

## UI
- `src/screens/cosmos/TzolkinMatchView.tsx` — 2 Kins + dinâmica + scores (dimensões) + relações diretas + cruzamento + Kin da relação. Separado do score astrológico (mostra os dois).
- **Grade de sinastria dos grupos:** Kin de cada membro; toque na célula → TzolkinMatchView da dupla (junto do modal de sinastria astrológica atual).
- **Match/Conexões:** badge do Kin + Tzolkin Match % + acesso à dinâmica.

## Cálculo no ranking (combinedScore)
- Backend: porta mínima do motor Tzolkin (math pura) → `tzolkinMatchScore(dateA,dateB)`.
- `combinedScore = astrologyWeight*astroScore + tzolkinWeight*tzolkinScore`, com `TZOLKIN_MATCH_WEIGHT` (env, default conservador, ex. 0.15; `0` desliga). Astro continua base.
- Não substituir `matchScore` atual; adicionar componente e ordenar pelo combinado só quando o peso > 0.

## Fora da Fase 2
IA de leitura de par no agente WA (recebe JSON calculado) → Fase 2c.

## Aceitação
- 137×96 produz as conexões do §28 e `relationshipKin=233`; testes verdes.
- Tzolkin Match visível na grade dos grupos e no Match.
- combinedScore configurável; com peso 0, ranking idêntico ao atual.
- Nada de Match/Sinastria astrológico quebrado.
