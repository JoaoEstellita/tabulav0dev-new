# Handoff Tecnico: Curadoria de Interpretacoes (Status Atual)

Data: 2026-02-21  
Workspace: `d:\tabulaestelar`  
Escopo principal desta fase: frontend (interpretacoes de transitos e i18n)

## 1) Objetivo desta etapa
Consolidar um catalogo de interpretacoes:
- consistente entre Modal / Tabula / Forecast / Groups
- sem frases redundantes ou ruido de encoding
- sem linguagem determinista
- com cobertura i18n (`pt-BR`, `en-US`, `es-ES`, `it-IT`) por chave canonica `transitKey`

## 2) O que foi concluido
### 2.1 Pipeline de limpeza e qualidade
- Sanitizacao para remover ruido textual recorrente (ex.: `foco recai em`, `a fase atual`, `sequencia pratica`).
- Fallback para narrativa limpa quando entrada do catalogo vier com ruido.
- Guardas de higiene global no catalogo renderizado.

Arquivos relevantes:
- `frontend/src/utils/astroInterpretation.ts`
- `frontend/src/utils/__tests__/transitCatalogTextSanitizer.spec.ts`
- `frontend/src/utils/__tests__/transitCatalogGlobalHygiene.spec.ts`

### 2.2 Curadoria e overrides
- Curadoria aplicada em `pt-BR` para chaves prioritarias.
- Cobertura i18n expandida para `en-US`, `es-ES`, `it-IT`.
- Paridade de chaves entre `pt-BR` e idiomas adicionais agora protegida por teste.

Arquivos relevantes:
- `frontend/src/data/transitCatalogOverridesPtBR.ts`
- `frontend/src/data/transitCatalogOverridesI18n.ts`
- `frontend/src/data/transitCatalogBlockedKeys.ts`
- `frontend/src/data/transitCatalogP1AutoOverrides.ts`

### 2.3 Testes e protecoes
- Testes de catalogo, cobertura, sanitizacao e consistencia narrativa passando.
- Novo teste de paridade i18n do keyset curado completo.

Arquivo atualizado recentemente:
- `frontend/src/utils/__tests__/transitCatalogCuratedCoverage.spec.ts`

## 3) Ultimos commits relevantes (frontend)
1. `f88f4eb` test(catalog): enforce full i18n parity with curated pt-BR keys
2. `95032a8` feat(interpretation): curate pending high-priority transit overrides
3. `d5c5307` chore(interpretation): regenerate curated transit catalog with cleaner text
4. `b382574` fix(interpretation): sanitize literal translation artifacts in transit narratives
5. `8973a89` test(interpretation): add global catalog narrative hygiene guard
6. `9e34495` fix(interpretation): reject noisy catalog entries and fallback to clean narrative
7. `8fa3c2d` fix(interpretation): strip repetitive boilerplate from transit narratives

## 4) Estado atual (check rapido)
- Repositorio `frontend`: limpo apos push do commit `f88f4eb`.
- Cobertura curada i18n: paridade de chaves com `pt-BR` validada em teste.
- Requisito do usuario aplicado nesta fase:
  - remover mencoes redundantes de status nas interpretacoes
  - reduzir repeticoes de boilerplate

## 5) Comandos de validacao (baseline)
Executar em `d:\tabulaestelar\frontend`:

```bash
npm run test -- src/utils/__tests__/astroInterpretationCatalog.spec.ts
npm run test -- src/utils/__tests__/transitCatalogCuratedCoverage.spec.ts
npm run test -- src/utils/__tests__/transitCatalogTextSanitizer.spec.ts
npm run test -- src/utils/__tests__/transitCatalogGlobalHygiene.spec.ts
npm run test -- src/utils/__tests__/transitNarrativeConsistency.spec.ts
```

Opcional (suite junta):
```bash
npm run test -- src/utils/__tests__/transitCatalogGlobalHygiene.spec.ts src/utils/__tests__/astroInterpretationCatalog.spec.ts src/utils/__tests__/transitCatalogP1AutoCoverage.spec.ts src/utils/__tests__/transitCatalogCuratedCoverage.spec.ts src/utils/__tests__/transitCatalogTextSanitizer.spec.ts src/utils/__tests__/transitNarrativeConsistency.spec.ts
```

## 6) Pendencias reais para fechar “curadoria 100%”
### P1 (prioridade alta)
1. Revisar manualmente os textos ainda auto-gerados em `transitCatalogP1AutoOverrides.ts` e migrar os melhores para overrides curados.
2. Verificar qualidade semantica por dominio:
   - aspectos planeta x planeta
   - aspectos com angulos (ASC/DSC/MC/IC)
   - ingressos em casas (planetas nas casas)
3. Garantir que keywords na Tabula estejam coerentes com a narrativa canonicamente escolhida.

### P2 (qualidade editorial)
1. Revisao editorial final para evitar redundancia residual.
2. Normalizacao de tom (imperativo suave, sem fatalismo, sem promessas).
3. Homogeneizar termos tecnicos entre idiomas (mesma semantica, nao traducao literal fraca).

### P3 (operacao)
1. Gerar relatorio final de cobertura por categoria de transito (nao apenas por chave).
2. Registrar changelog de interpretacoes para facilitar auditoria futura.

## 7) Plano recomendado para a proxima IA (execucao direta)
1. Rodar baseline de testes (secao 5).
2. Abrir e usar como fonte de priorizacao:
   - `Txt/curated/transit_catalog_quality_report.json`
   - `Txt/curated/catalog_summary.json`
3. Para cada lote pequeno:
   - selecionar `N` chaves
   - curar texto `pt-BR` em `transitCatalogOverridesPtBR.ts`
   - ajustar i18n correspondente em `transitCatalogOverridesI18n.ts`
   - rodar testes obrigatorios
   - commit pequeno + push
4. Ao fim do lote, atualizar este handoff e `IMPLEMENTATION_TODO_NEXT_STEPS.md`.

## 8) Regras de seguranca e consistencia (nao quebrar)
- Nao alterar contrato de dados do backend para status.
- Nao reintroduzir frases bloqueadas:
  - `foco recai em`
  - `a fase atual`
  - `sequencia pratica`
- Nao usar linguagem determinista:
  - `vai acontecer`, `com certeza`, `inevitavel`, `garantido`
- Nao remover fallback de sanitizacao.

## 9) Observacoes importantes
- String com escape estranho tipo `Circunst\"ncias` pode aparecer em artefato de relatorio (`Txt/curated/...`), mas isso nao deve entrar no catalogo runtime do app.
- A base curada ativa do app esta em `frontend/src/data/*`.
- Se houver divergencia visual no app, validar primeiro se o texto vem de:
  - override curado
  - auto override
  - fallback narrativo

## 10) Progresso estimado desta etapa (interpretacoes)
- Infra de curadoria/sanitizacao/testes: **100%**
- Cobertura i18n por chave curada: **100%**
- Curadoria editorial profunda de todos os trânsitos (qualidade “premium”): **~75-85%** (depende de rodada manual final por lote tematico)

---

Se outra IA retomar daqui, deve iniciar por `Secao 7`, mantendo commits pequenos e executando a suite da `Secao 5` em cada lote.
