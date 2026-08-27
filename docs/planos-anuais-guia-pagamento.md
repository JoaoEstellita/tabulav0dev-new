# Planos Anuais — Guia de Ativação do Meio de Pagamento

**Status:** código 100% implementado e testado. Os planos anuais **NÃO aparecem** pro
usuário ainda — estão atrás da flag `ANNUAL_ENABLED = false` em
`frontend/src/constants/plans.ts`. Este guia é a **sua parte**: preparar o meio de
pagamento. Quando terminar e me avisar, eu ligo a flag e deixo à mostra.

---

## O que já está pronto (minha parte, feito)

- **Planos:** `pro_yearly` (R$ 479,00/ano) e `premium_yearly` (R$ 799,00/ano) — 2 meses grátis (paga 10, leva 12). Só Pro e Premium têm anual; Essential fica só mensal.
- **Cobrança recorrente (cartão):** o backend cria a assinatura MP com `frequency: 12 meses` — cobra o ano de uma vez e renova a cada 12 meses.
- **Cobrança à vista (PIX):** PIX de 12 meses — ativa 12 meses e **não** renova sozinho.
- **Ativação automática:** o webhook do MP já concede 12 meses de acesso pro anual (`expiresAt` +12).
- **Renovação:** o cron de lembrete avisa ~antes do vencimento do PIX anual (o recorrente renova sozinho, não precisa de aviso).
- **UI:** toggle **Mensal / Anual** na tela de planos, selo "2 meses grátis", preço/ano + equivalente mensal, nos 4 idiomas.
- **Regra Google Play:** igual ao mensal — o anual só aparece no **PWA/site**, nunca no APK Android (política anti-steering). No app Android o usuário só usa o que já assinou.

---

## Decisão: Mercado Pago ou Stripe?

**Recomendo Mercado Pago** para o anual. Motivos:
- O código do anual (recorrente 12 meses + PIX à vista) já está escrito **pro Mercado Pago**.
- É o meio que o público **pt-BR** já usa; PIX à vista é forte pra plano anual no Brasil.
- Stripe anual exigiria criar *Prices* anuais no painel Stripe **+** código novo (o fluxo Stripe atual é só mensal em USD). Fica pra depois, se você quiser vender anual pro público internacional.

O resto deste guia assume **Mercado Pago**.

---

## Sua parte — passo a passo no Mercado Pago

> **Boa notícia:** se a assinatura **mensal recorrente** já funciona hoje, o anual usa
> exatamente a mesma conta, o mesmo token e o mesmo webhook. A assinatura é criada de
> forma **dinâmica** (não precisa cadastrar "plano" no painel do MP). Então na prática
> os passos abaixo são de **conferência + teste**, não de criação.

### 1. Confirmar a conta e as credenciais
- Entre em https://www.mercadopago.com.br/developers → **Suas integrações** → sua aplicação.
- Confirme que está usando as credenciais de **Produção** (Access Token de produção), as mesmas que já rodam o mensal. O token vive no backend como `MERCADO_PAGO_ACCESS_TOKEN` — **se não vai trocar, não precisa me mandar nada**. Só me avise se gerar um token novo.
- Confirme que **Assinaturas (preapproval)** está habilitado na conta (se o mensal recorrente já cobra, está habilitado).

### 2. Conferir o Webhook
- Em **Suas integrações → Webhooks / Notificações**, confirme a URL:
  `https://tabulav0dev-backend.vercel.app/api/mercado-pago/webhook`
- Eventos: **Pagamentos** e **Assinaturas (preapproval)**. (Já deve estar assim pro mensal.)

### 3. Testar em Sandbox (recomendado antes de ir ao ar)
Peça que eu te gere um link de teste, ou faça pelo painel com **usuários de teste** do MP:
- **Pro anual recorrente:** assine com cartão de teste → deve cobrar **R$ 479,00** e ativar por **12 meses**.
- **Premium anual PIX:** gere o PIX de 12 meses → pague no sandbox → o plano deve liberar sozinho por **12 meses**.
- Confira no painel `/monitoramento` (ou no Firestore `subscriptions/{uid}`) que `expiresAt` ficou ~12 meses à frente e o `planId` é `pro_yearly` / `premium_yearly`.

### 4. Me avisar
Quando estiver validado, me manda:
- ✅ "Testei o anual no MP e está ativando certo" **ou** "pode ativar, testa você em sandbox".
- ⚠️ Se trocou o Access Token, me passe o novo (ou coloque você mesmo em `MERCADO_PAGO_ACCESS_TOKEN` na Vercel do backend).

---

## Minha parte final (depois do seu OK)

1. Ligo a flag: `ANNUAL_ENABLED = true` em `frontend/src/constants/plans.ts`.
2. Commit + push → o frontend auto-deploya (~1-2 min).
3. O toggle **Mensal / Anual** aparece pra todo mundo no PWA/site.
4. **Reversível:** se der qualquer problema, volto a flag pra `false` e some na hora.

### Checklist de validação pós-ativação (faço com você)
- [ ] Toggle Mensal/Anual aparece na tela de planos (PWA)
- [ ] Anual mostra Pro R$ 479 e Premium R$ 799, com "≈ R$/mês" e selo "2 meses grátis"
- [ ] "Assinar anual" (cartão) abre o checkout MP com o valor do ano
- [ ] "Pagar 12 meses (PIX)" gera o QR e, ao pagar, ativa 12 meses
- [ ] Android (APK) continua **sem** vender (só PWA vende) — regra Play
- [ ] `subscriptions/{uid}.expiresAt` ~12 meses à frente após compra de teste

---

## Resumo dos preços

| Plano | Mensal | Anual (2 meses grátis) | Equivale a |
|-------|--------|------------------------|------------|
| Pro | R$ 47,90/mês | **R$ 479,00/ano** | R$ 39,92/mês |
| Premium | R$ 79,90/mês | **R$ 799,00/ano** | R$ 66,58/mês |
