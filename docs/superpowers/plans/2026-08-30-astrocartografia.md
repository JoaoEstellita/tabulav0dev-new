# Astrocartografia (Astro Map) — plano

## Objetivo
Mapa-múndi com as **linhas planetárias** do mapa natal do usuário: onde cada planeta
fica angular (MC/IC na F1; ASC/DSC na F2). Responde "onde o céu te favorece pra amor,
carreira, prosperar". Premium. Reusa a efeméride no cliente (astronomy-engine).

## Base técnica (validada)
- Instante UTC do nascimento: `resolveBirthInstant` (espelha RealAstrologyEngine —
  TimezoneService + fallback por longitude). Crítico acertar o TZ.
- Linha MC de um planeta: meridiano vertical em `lon = norm180((RA − GAST)×15)`.
  IC = `lon+180`. RA via `Equator(body,t,obs,true,true)`; GAST via `SiderealTime(t)`.
  Smoke: Sol às 14:30 UTC → linha ~−38° (bate com meio-dia solar). ✓

## F1 (MVP) — linhas MC/IC + mapa SVG  ← ESTA ENTREGA
1. `src/astro/birthInstant.ts` — `resolveBirthInstant(date,time,lat,lon): Promise<Date>`.
2. `src/astro/astrocartography.ts` — `planetaryLines(dateUTC): AstroLine[]` (puro).
3. `src/data/worldCities.ts` — ~50 cidades (lat/lon) p/ ancorar geografia.
4. `src/data/astrocartographyMeaning.ts` — planeta × ângulo (MC/IC), 4 idiomas.
5. `src/screens/cosmos/AstroMapScreen.tsx` — SVG equiretangular (graticule + cidades +
   linhas verticais coloridas por planeta + glifo no topo) + toque na linha → modal de
   significado + marcador do local de nascimento. Gate Premium.
6. Rota `AstroMap` no AppNavigator + botão de entrada na aba Mapa.
7. Teste do cálculo (`astrocartography.spec.ts`) contra o caso validado.

## F2 — linhas ASC/DSC + "melhores lugares"
- Curvas ASC/DSC (fórmula do horizonte por latitude). Validar contra referência.
- "Melhores lugares para amor/carreira/prosperar": cruza a linha do planeta certo
  (Vênus/Júpiter/Sol…) com as cidades mais próximas.
- Continentes: adicionar mapa-múndi de fundo (asset PNG equiretangular OU path SVG
  simplificado) — F1 usa graticule + cidades (sem continentes) p/ não depender de asset.

## F3 — agente WhatsApp
- Tool `astro_map`: "melhor cidade pra mim pro amor?" → linha de Vênus mais próxima +
  cidades na faixa. Reusa `planetaryLines` (versão backend) + a lista de cidades.

## Fora de escopo
- Catálogo curado longo por planeta×cidade. O significado por planeta×ângulo já entrega.
