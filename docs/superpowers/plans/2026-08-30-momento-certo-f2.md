# Momento Certo — F2 (spec)

Pré-requisito: **F1 validada em device** (timing do endpoint + as janelas fazem sentido). F1 = granularidade de DIA, reusa a favorabilidade da área via `calculateUserStatus`. F2 adiciona precisão + ação.

## Objetivos F2
1. **Precisão de HORA** — cada janela vira `dia + faixa (hh–hh)`.
2. **Regras clássicas** — Lua fora de vazio (void-of-course), horas planetárias, penalidade forte de retrógrado do significador.
3. **Ação** — tela de detalhe da janela + "Adicionar ao calendário" + "Compartilhar".
4. **Push** — "janela forte de [intenção] abre amanhã".

## 1. Precisão de hora (backend)
- Hoje o motor amostra POR DIA. Pra faixa de hora, no melhor dia amostrar **por hora** (ou 2h) e pontuar cada slot com o significador da intenção:
  - aspecto do significador (trânsito) ao natal (usar posições eclípticas por hora via `astronomy-engine`, como em `lib/astro/positions.js`: `Ecliptic(GeoVector(body, AstroTime(date), false)).elon`),
  - Lua rápida → recalcular por hora (aspectos + void).
- `rankWindows` já é puro; adicionar `bestHourRange(dayISO, intention, natal)` puro (recebe posições por hora) → devolve `{from, to}`. **Testar** com fixtures.
- Custo: só o DIA-topo é sub-amostrado por hora (não o horizonte todo) → barato. Cache continua `momentoCerto/{uid}`.

## 2. Regras clássicas (backend, `lib/status/momento-certo-rules.js`, PURO + testes)
- **Void-of-course Moon:** Lua sem novo aspecto maior antes de mudar de signo → penaliza (bandeira `moonVoid`).
- **Hora planetária:** bônus quando a hora é regida pelo planeta da intenção (precisa nascer/pôr do sol na localização → `astronomy-engine SearchRiseSet`).
- **Retrógrado:** penalidade forte se o significador principal está retrógrado (ex.: contrato + Mercúrio retro). F1 já tem `slowPlanet`/valência; F2 usa `retrograde` real por dia.
- Cada regra devolve `{delta, code}` → entra no score + vira `caution`/`reason` no card.

## 3. Detalhe da janela + ação (frontend)
- Tocar numa janela em `MomentoCertoView` → `MomentoWindowScreen` (rota RootStack): faixa de hora, porquês completos (texto curado), o que evitar, e:
  - **Adicionar ao calendário** (`expo-calendar` ou link `.ics`/intent),
  - **Compartilhar** (`Share` + card, reusar padrão de compartilhar).
- Empty/edge: se nenhuma janela ≥ limiar, mostrar "sem janela forte; a menos ruim é X".

## 4. Push "janela abrindo" (backend cron)
- Cron diário (ou reusar `cron-status-broadcast`) que, pra assinantes com opt-in, verifica se **abre amanhã** uma janela ≥ limiar nas intenções que a pessoa marcou como interesse (novo campo `momentoIntents` no user) → HSM/push.
- Dedupe por (uid, intenção, dia).

## 5. Intenções extras (F2)
Viagem (casas 3/9 · evitar Mercúrio retro), Saúde/Tratamento (Lua+casa 6), Lançar/Começar (Lua crescente + regente/ASC), Contrato (Mercúrio direto — regra forte). Mapear intenção→área ou intenção→significadores diretos (quando não há área 1:1).

## Fases internas sugeridas
- F2a: regras clássicas + faixa de hora (backend, testes) → card mostra hora.
- F2b: detalhe + calendário + compartilhar.
- F2c: push + intenções extras.

## F3 (depois)
- Integração com o **agente WhatsApp** (mesmo motor: "qual o melhor momento pra pedir aumento?").
- **"Momento Certo pra vocês dois"** — eletiva de sinastria com uma conexão/grupo (janelas boas para o PAR).
