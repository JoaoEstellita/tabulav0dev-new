# Tzolkin / Dreamspell — Fase 1 ("Meu Kin", solo)

**Data:** 2026-09-01
**Status:** aprovado (aguardando review do spec)
**Escopo desta fase:** perfil individual (solo) do Tzolkin Dreamspell. SEM Match, SEM calendário de 13 Luas, SEM IA de par.

---

## 1. Objetivo e enquadramento

Adicionar ao app um módulo de **Tzolkin — Dreamspell / Sincronário das 13 Luas / 260 Kins**: o perfil pessoal do usuário (seu Kin natal) e o Kin do dia, como uma **terceira via** ao lado de Ocidental e Védico.

**Sistema:** DREAMSPELL / 260 KINS — inspirado no Tzolk'in maia, mas **não** apresentado como idêntico ao calendário maia tradicional.

**Rótulo na UI:** "Tzolkin — Dreamspell". Nota discreta: *"O sistema desta área é o Dreamspell/13 Luas, uma interpretação moderna do ciclo de 260 Kins inspirada no Tzolk'in maia tradicional."*

**Nunca afirmar:** que o Dreamspell é o calendário original maia; que Kins determinam cientificamente personalidade; que Kins garantem destino/união/separação. Linguagem sempre simbólica: "simboliza", "pode indicar", "convida a", "no sistema Dreamspell".

## 2. Princípio de arquitetura

**Cálculo NUNCA por IA.** Toda matemática vive em funções puras, determinísticas, testáveis e versionadas. A IA (fases futuras) só recebe o JSON já calculado para interpretar — nunca descobre o Kin a partir da data.

Fluxo: `birthDate → motor tzolkin determinístico → objeto estruturado → UI (textos curados)`.

Nesta fase os textos são **100% curados** (padrão Védico), compostos deterministicamente a partir de blocos (selo, tom, oráculo, onda, castelo, família) — **sem** 260 leituras bespoke.

## 3. Reuso (o Védico é o molde)

| Peça nova | Precedente a espelhar |
|---|---|
| `src/astro/tzolkin/` (motor puro) | `src/astro/vedic/` |
| `src/data/tzolkin/*Overrides{PtBR,I18n}.ts` | `src/data/vedic/nakshatraOverrides*` |
| 3ª aba no Mapa (`mapMode +'tzolkin'`) | `CosmosScreen.tsx:257` `mapMode: 'western'\|'vedic'` |
| `TzolkinProfileContent.tsx` | `src/screens/cosmos/VedicProfileContent.tsx` |
| Badge do Kin na Home | `MoonPhaseButton.tsx` (já mostra Nakshatra védico multi-sistema) |

Regra de ouro: **tudo aditivo.** Não reestruturar Match/Sinastria/motor astro. As únicas edições em arquivos existentes são: 1 valor no union `mapMode` + 1 branch de render em `CosmosScreen`, e 1 badge em `MoonPhaseButton`.

## 4. Motor determinístico — `src/astro/tzolkin/`

### 4.1 Cálculo do Kin (convenção Dreamspell)
- `BASE_DATE = 1987-07-26`, `BASE_KIN = 34` (Mago Galáctico Branco).
- Ciclo de 260 posições.
- Para uma data D: contar dias válidos entre BASE_DATE e D **ignorando todo 29/02**; aplicar módulo 260; suportar datas anteriores (módulo negativo).
- `mod(a,n) = ((a % n) + n) % n`; `kin = mod((BASE_KIN-1) + offset, 260) + 1`.
- **Não** usar `Date` em horário local para a matemática (timezone/DST desloca). Tratar data civil como `YYYY-MM-DD` (contagem de dias em UTC).

### 4.2 Regra do 29 de fevereiro (Hunab Ku)
29/02 é `0.0 Hunab Ku`, não um Kin do ciclo. Guardar `isHunabKuLeapDay: boolean`. Nascimento em 29/02:
- antes de 12:00 local → associar assinatura ao lado de 28/02 (se precisar assinatura pessoal);
- depois de 12:00 → lado de 01/03;
- exatamente 12:00 ou horário desconhecido → estado especial "0.0 Hunab Ku" + explicação antes de atribuir assinatura.
Nunca transformar 29/02 silenciosamente em Kin comum.

### 4.3 Tom, selo, cor
- `toneNumber = ((kin-1) % 13) + 1`
- `sealNumber = ((kin-1) % 20) + 1`
- `colorIndex = ((sealNumber-1) % 4)` → 0 vermelho, 1 branco, 2 azul, 3 amarelo (inicia/refina/transforma/amadurece).

### 4.4 Oráculo da Quinta Força
- **Análogo:** `analogSeal = mod(18 - sealNumber, 20) + 1`, mesmo tom. (Terra 17→Vento 2; Guerreiro 16→Noite 3; Espelho 18→Dragão 1; Tormenta 19→Sol 20.)
- **Antípoda:** `antipodeSeal = mod((sealNumber-1) + 10, 20) + 1`, mesmo tom. (Guerreiro 16→Enlaçador 6.)
- **Oculto:** `occultKin = 261 - kin` (o tom NÃO é necessariamente o mesmo); `occultSeal = 21 - sealNumber` deve coincidir. (137→124; 96→165; 1→260.)
- **Guia:** depende do tom (mantém tom e cor do destino). Deslocamento de selo por tom: {1,6,11}→0; {2,7,12}→+12; {3,8,13}→+4; {4,9}→−4; {5,10}→+8 (mód 20). Achar o Kin 1..260 com `tone==originalTone` e `seal==guideSeal`.
- Para análogo/antípoda/guia: localizar o Kin 1..260 com (tom, selo) alvo.

### 4.5 Onda Encantada (Wavespell)
- `wavespellIndex = floor((kin-1)/13) + 1`; `positionInWavespell = ((kin-1) % 13) + 1`.
- 20 ondas (Kin 1–13 Dragão, 14–26 Mago, … 248–260 Estrela). Selo regente = selo do 1º Kin da onda.
- Fase 1 mostra: nome da onda, Kin inicial, posição 1..13, significado do tom naquela posição. (Leitura dos 13 Kins da onda inteira = expansível depois.)

### 4.6 Castelos
5 castelos de 52 Kins: 1–52 Vermelho/Leste (Nascimento); 53–104 Branco/Norte (Travessia); 105–156 Azul/Oeste (Queima); 157–208 Amarelo/Sul (Doação); 209–260 Verde/Central (Encantamento).

### 4.7 Famílias Terrestres — `getEarthFamily(sealNumber)`
Portal: Lua 9, Mago 14, Tormenta 19, Semente 4. Polar: Serpente 5, Cachorro 10, Águia 15, Sol 20. Cardinal: Dragão 1, Enlaçador 6, Macaco 11, Guerreiro 16. Núcleo: Terra 17, Vento 2, Mão 7, Humano 12. Sinal: Caminhante 13, Espelho 18, Noite 3, Estrela 8. **Não** usar família como indicador simplista de compatibilidade.

### 4.8 Helpers
- `calculateKin(birthDateISO)` → `{ kin, seal, tone, colorIndex, isHunabKuLeapDay }`
- `getKinForDate(dateISO)` (Kin do dia)
- `getKinDisplayName(kin, locale)` → ex. "Terra Ressonante Vermelha" (ordem conceitual: cor+tom+selo)
- `getOracle(kin)`, `getWavespell(kin)`, `getCastle(kin)`, `getEarthFamily(seal)`

O módulo funciona sem React/Firebase/IA.

## 5. Constantes e dados — `src/astro/tzolkin/constants.ts`

Estruturas (não espalhar strings): **13 tons** (número, essência, poder, ação, pt/en) e **20 selos** (number, key, namePt, nameEn, color, power, action, essence, shortMeaning, longMeaning). Dados de referência conforme o material-fonte (seção 7 e 8 do prompt original). Ondas, castelos e famílias também estruturados e internacionalizáveis.

## 6. Conteúdo curado — `src/data/tzolkin/`

`tzolkinOverridesPtBR.ts` + `tzolkinOverridesI18n.ts` (en-US/es-ES/it-IT). Blocos: selo, tom, composição selo+tom, oráculo (significado de cada posição), onda, castelo, família. Compostos deterministicamente na UI. Regras i18n do projeto: en-US sem "will"; es-ES sem tildes; it-IT sem acentos. Textos longos nunca como fato objetivo — "simboliza/pode indicar/no sistema Dreamspell".

## 7. Types — `src/astro/tzolkin/types.ts`
`TzolkinKin`, `TzolkinSeal`, `GalacticTone`, `FifthForceOracle`, `Wavespell`, `Castle`, `EarthFamily`, `TzolkinProfile`. Sem `any`.

## 8. UI — aba Tzolkin

`CosmosScreen.tsx`: union `mapMode: 'western' | 'vedic'` → **`| 'tzolkin'`**; adicionar 3º toggle "Tzolkin" + branch de render. Tour/holofote: adicionar passo (opcional nesta fase).

Novo `src/screens/cosmos/TzolkinProfileContent.tsx` (espelha `VedicProfileContent`), **progressive disclosure** (cards expansíveis), sem blocos gigantes:
1. Cabeçalho — KIN nº, nome completo, glifo-placeholder (cor+número), tom + símbolo do tom, 3 palavras do selo, 3 conceitos do tom
2. Sua essência (selo)
3. Seu Tom Galáctico
4. Selo + Tom juntos (composição)
5. Potenciais / Desafios (sombra)
6. **Oráculo da Quinta Força** — diagrama (Guia em cima, Antípoda–Destino–Análogo no meio, Oculto embaixo); cada posição clicável → Kin, selo, tom, relação, explicação. Antípoda = desafio/fortalecimento (nunca "incompatibilidade").
7. Sua Onda Encantada (posição 1..13 + selo regente)
8. Seu Castelo
9. Família Terrestre
10. Kin de hoje (relação calculada com o Kin natal)

**Glifos:** placeholder vetorial próprio (número/cor/nome); sistema preparado para receber SVGs licenciados depois. Não copiar imagens protegidas.

## 9. Home — badge do Kin do dia

`MoonPhaseButton.tsx` (já multi-sistema): ao lado do símbolo do signo da Lua, **badge do Kin do dia** (selo+tom+cor). Expandir → Kin do dia + relação com o Kin natal do usuário (ex.: "Hoje o Kin 7 ocupa a posição de Antípoda do seu Kin natal") — sempre **calculada**, nunca inventada.

## 10. Dados / cache / privacidade

Kin natal derivado **on-demand** de `birthDate` (fonte de verdade). Cache versionado **opcional** no perfil (como o Védico guarda natal): `tzolkin: { system:'dreamspell', engineVersion:1, kin, calculatedFromBirthDate, calculatedAt }`. Se o nascimento mudar → invalidar/recalcular. Não enviar `birthDate` a serviços externos nesta fase (não há IA aqui). Seguir as políticas de privacidade já existentes.

## 11. Feature flag

Env `EXPO_PUBLIC_TZOLKIN_ENABLED` (padrão de env flags do projeto, ex. `ANNUAL_ENABLED`) para rollout seguro. Sem infraestrutura nova.

## 12. Observabilidade

Distinguir erro de cálculo de erro de UI: logar `tzolkin_engine_error` sem dados pessoais desnecessários.

## 13. Testes (Vitest, obrigatórios)

> **Algoritmo validado empiricamente (2026-09-01)** — protótipo em node confirmou TODOS os vetores abaixo antes da implementação: datas→Kin (34/143/137/96), selo/tom (137→17/7, 96→16/5), oráculo completo de 137 e 96, relação 137×96→233, e bordas (dia anterior→33, kin 1/260). As fórmulas da seção 4 são a fonte de verdade.


Vetores de referência: `26/07/1987→Kin 34` (Mago Galáctico Branco); `01/01/1990→Kin 143`; `10/04/1989→Kin 137` (Terra Ressonante Vermelha, selo 17, tom 7); `29/05/2003→Kin 96` (Guerreiro Entonado Amarelo, selo 16, tom 5). Bordas: dia anterior à referência, Kin 1, Kin 260, transição 260→1, anos bissextos, 28/02, 29/02 (Hunab Ku), 01/03, datas pré-1987, pós-2100, módulo negativo.

Oráculo (regressão):
- Kin 137 → Guia 189, Análogo 202, Antípoda 7, Oculto 124.
- Kin 96 → Guia 44, Análogo 83, Antípoda 226, Oculto 165.

Onda/castelo/família/cor/display-name também testados. Integrar ao CI sem quebrar. Não declarar sucesso com teste essencial falhando.

## 14. Fora de escopo (fases futuras)

- **Fase 2 — Tzolkin Match:** camada separada do score astrológico; relações diretas entre 2 Kins; cruzamento dos 2 oráculos; Kin simbólico da relação (convenção soma nominal: 137×96→Kin 233); `TzolkinMatchScore` (modelo do app, pesos em `TZOLKIN_MATCH_WEIGHTS` config); IA de leitura de par (recebe JSON calculado). Integração com o Match existente só depois, com `combinedScore` configurável.
- **Fase 1.5 — Calendário 13 Luas:** motor próprio (lua 1–13, dia 1–28, plasmas) na Home ao clicar na Lua. Distinto dos 260 Kins.
- **Depois:** leitura completa dos 13 Kins de cada Onda; glifos SVG oficiais/licenciados; Tzolk'in maia tradicional (`system:'traditional_tzolkin'`, outro engine, nunca misturar objetos).

## 15. Arquivos

**Criados:**
- `src/astro/tzolkin/constants.ts`, `engine.ts`, `types.ts`, `index.ts`
- `src/astro/tzolkin/__tests__/engine.spec.ts` (vetores + oráculo + bordas)
- `src/data/tzolkin/tzolkinOverridesPtBR.ts`, `tzolkinOverridesI18n.ts`
- `src/screens/cosmos/TzolkinProfileContent.tsx`

**Alterados (mínimo, aditivo):**
- `src/screens/cosmos/CosmosScreen.tsx` — union `mapMode` +`'tzolkin'`, 3º toggle, branch de render
- `src/components/MoonPhaseButton.tsx` — badge do Kin do dia
- (opcional) perfil/userProfile — cache versionado do kin natal

## 16. Critérios de aceitação (Fase 1)

- `10/04/1989→Kin 137` e `29/05/2003→Kin 96`; oráculos de 137 e 96 corretos.
- Aba Tzolkin exibe o perfil solo completo; Home mostra o Kin do dia ao lado da Lua.
- Nenhum cálculo feito por LLM.
- Diferença Dreamspell × maia tradicional explicada; linguagem simbólica.
- Testes passam; build passa; **nada** de astrologia/sinastria existente quebrado.
