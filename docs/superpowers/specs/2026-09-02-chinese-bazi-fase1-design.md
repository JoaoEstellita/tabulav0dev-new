# Astrologia Chinesa (BaZi) — Fase 1 (Motor)

**Data:** 2026-09-02
**Decisões:** motor próprio (Swiss/analítico, sem lib) · textos curados ×4 · codar agora.
**Escopo F1:** motor determinístico dos 4 Pilares + Day Master + 5 Elementos + 10 Deuses + Hidden Stems + interações. Sem UI/Match (fases 2/3).

## Princípio
Cálculo determinístico; IA nunca calcula pilar/stem/branch. Fluxo: birthData → motor → JSON BaZi → (UI curada). Separar zodíaco popular (Ano-Novo Lunar) de BaZi (Lì Chūn).

## Motor — `src/astro/chinese/`
- **`sun.ts`** — longitude eclíptica do Sol **analítica** (Meeus low-precision, síncrona, sem WASM) + `solarTermInstant(year, targetLongitude)` por bisseção + `equationOfTime`. Os 12 Jie mensais nas longitudes 315°(Lì Chūn/寅), 345°(卯), 15°(辰), 45°(巳), 75°(午), 105°(未), 135°(申), 165°(酉), 195°(戌), 225°(亥), 255°(子), 285°(丑).
- **`constants.ts`** — 10 Troncos (甲..癸: elemento+polaridade, hanzi, pinyin, pt/en), 12 Ramos (子..亥: animal, elemento, polaridade, hora, hiddenStems), tabela Hidden Stems, ciclos gerador/controlador Wu Xing, regras 10 Deuses, Cinco Tigres (stem do mês) e Cinco Ratos (stem da hora).
- **`bazi.ts`**:
  - Pilar do Dia: `dayIndex = (JDN + 49) % 60` (validado 1989-04-10 → 庚子). Modo late-Zi configurável (default civil).
  - Pilar do Ano: BaZi year = ano civil se depois de Lì Chūn (senão −1); ganzhi = `(baziYear − 1984) % 60` (1984 = 甲子). 1989 → 己巳.
  - Pilar do Mês: Jie do instante (longitude do Sol) → ramo; stem por Cinco Tigres a partir do stem do ano. Abril/1989 (Sol 20°) → 辰; 己→戊辰.
  - Pilar da Hora: tempo solar verdadeiro (longitude local + Equation of Time) → ramo; stem por Cinco Ratos a partir do stem do dia. Se hora ausente → 3 pilares, `confidence`.
  - `dayMaster` = stem do Pilar do Dia (1989 → 庚 Metal Yang).
  - `fiveElements` = presença estrutural (stems visíveis + branches + hidden stems). NÃO afirmar "elemento favorável" (sem metodologia Yong Shen validada).
  - `tenGods` = relação de cada stem ao Day Master (10 regras).
  - `interactions` = Six Harmonies/Clashes, Three Harmonies, Harms, Punishments (tabelas; sem assumir transformação automática).
- **`types.ts`**, **`index.ts`**, **`__tests__/bazi.spec.ts`**.

## Separação (armazenar os dois)
`chineseZodiac { animal, lunarYear, element, polarity }` (ano lunar popular) e `bazi { yearPillar, monthPillar, dayPillar, hourPillar, methodology }`. Mostrar divergência quando ocorrer.

## Versionamento/cache
`engineVersion`, `methodologyVersion` (boundaries/true-solar/pesos podem mudar entre escolas). Cache derivado de birthDate/time/location; invalida se mudar.

## Testes F1 (obrigatórios)
- **10/04/1989 → 己巳 / 戊辰 / 庚子, Day Master 庚 (Metal Yang), animal Serpente.** (validado no protótipo)
- Boundary: minutos antes/depois de Lì Chūn e de cada Jie; 22:59/23:00, 23:59/00:00, cada troca das 12 horas; **10/04/1989 06:59 Rio** (troca 卯→辰 pela correção solar); DST histórico; leap years.
- 60-Jiazi: continuidade, index 0(甲子)/59(癸亥).
- Ten Gods: relação correta ao Day Master.

## Fora da F1
UI (Visão Geral/BaZi/Dinâmica/Ciclos) → F2. Match chinês + combinedScore → F3. Da Yun/Liu Nian (precisa direção/gênero) → F4.

## Aceitação
10/04/1989 pilares corretos; zodíaco ≠ BaZi separados; Lì Chūn no ano; Jie no mês; hora por tempo solar; Ten Gods por Day Master; nenhum LLM calcula; testes/typecheck verdes; nada quebrado.
