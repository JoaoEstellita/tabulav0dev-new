# 🔧 VARIÁVEIS QUE FALTAM NO VERCEL BACKEND

## ✅ JÁ CONFIGURADAS:
- FIREBASE_PROJECT_ID ✅
- FIREBASE_CLIENT_EMAIL ✅
- FIREBASE_PRIVATE_KEY ✅
- FIREBASE_STORAGE_BUCKET ✅
- ALLOWED_ORIGINS ✅

## ❌ FALTAM ESTAS VARIÁVEIS:

### 1. WEB PUSH (para Group Notify funcionar)
```
VAPID_PUBLIC_KEY=BOLOXfFeZnSCZpQ0XJRwbibE0Cjwd70UIRObllu6c18RpX6_IJfHGsSsQ-517uG0Wjp53O3Lici8fvnTuu9Obks
VAPID_PRIVATE_KEY=AjC4Gr1Pyx6Iif1PHoMJBISPsHM03-qtPy_Biy15gBKRGxJHQN6Tk-Gq3nIHCDYtF
```

### 2. MERCADO PAGO (para Create Payment funcionar)
```
MERCADO_PAGO_ACCESS_TOKEN=[SEU_TOKEN_AQUI]
```

### 3. CRON (para Daily Notifications funcionar)
```
CRON_SECRET_TOKEN=tabula-estelar-cron-2025
```

## 🚀 COMO ADICIONAR NO VERCEL:

1. Acesse: https://vercel.com/dashboard
2. Selecione o projeto **tabulav0dev-backend**
3. Vá em "Settings" > "Environment Variables"
4. Adicione cada variável acima
5. Faça redeploy (pode ser automático)

## 📊 STATUS ATUAL DOS ENDPOINTS:

✅ **FUNCIONANDO (8/12):**
- Start Trial ✅
- **Subscription Status ✅ (CORRIGIDO!)**
- Astro Positions ✅
- Profile Photo Upload ✅
- Webpush Subscribe ✅
- Notification Preferences ✅
- Timezone ✅
- Mercado Pago Webhook ✅
- Cron Daily Notifications ✅ (corrigido)

❌ **FALTAM (3/12):**
- Cancel Subscription (agora deve funcionar)
- Group Notify (precisa VAPID keys)
- Create Payment (precisa MERCADO_PAGO token)

Depois de adicionar essas 4 variáveis, o backend estará **100% funcional**! 🎉
