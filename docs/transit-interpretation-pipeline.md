# Transit Interpretation Pipeline (V2)

## Objetivo
Garantir que o mesmo trânsito use a mesma base semântica em qualquer superfície (Modal, Tábula, Forecast, Grupos), mudando apenas formatação/densidade.

## Fluxo atual
1. Fonte bruta: `Txt/*.txt`
2. Curadoria:
   - `Txt/tools/extract-catalog.js`
   - `Txt/tools/build-app-candidates.js`
3. Export para frontend:
   - `Txt/tools/export-frontend-transit-catalog.js`
   - saída: `frontend/src/data/transitCatalogPtBR.ts`
4. Resolução no app:
   - `buildUnifiedTransitNarrative` consulta catálogo canônico por chave `transit:{planeta}|{aspecto}|{alvo}`
   - fallback automático para gerador narrativo atual quando não houver chave no catálogo

## Chave canônica usada no catálogo
- Exemplo: `transit:jupiter|conjuncao|meio_do_ceu`
- Mapeada a partir de:
  - planeta de trânsito
  - aspecto normalizado
  - alvo (planeta natal ou ângulo como `ascendente` / `meio_do_ceu`)

## Compatibilidade
- Sem quebra de contrato no retorno de `buildUnifiedTransitNarrative`.
- `shortText`, `modalIntro`, `modalBody` continuam disponíveis.
- `interpretationV2` segue opcional por feature flag já existente.

## Testes
- `src/utils/__tests__/transitInterpretationV2.spec.ts`
- `src/utils/__tests__/astroInterpretationCatalog.spec.ts`

## Próxima fase recomendada
1. Expandir catálogo para `planetas nas casas` e chaves numéricas relevantes.
2. Criar versões canônicas `en-US`, `es-ES`, `it-IT` por `transitKey`.
3. Unificar backend de notificações para consumir a mesma semântica-base por chave canônica.
