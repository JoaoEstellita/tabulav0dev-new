# 🔔 **GUIA COMPLETO: CONFIGURAÇÃO FIREBASE PUSH NOTIFICATIONS**

## 📋 **ÍNDICE**
1. [Configuração Firebase Console](#1-configuração-firebase-console)
2. [Download dos Arquivos de Configuração](#2-download-dos-arquivos)
3. [Configuração Android](#3-configuração-android)
4. [Configuração iOS](#4-configuração-ios)
5. [Configuração Backend (Vercel)](#5-configuração-backend)
6. [Teste das Notificações](#6-teste-das-notificações)
7. [Configuração do Cron Job](#7-configuração-do-cron-job)

---

## **1. CONFIGURAÇÃO FIREBASE CONSOLE**

### **1.1 - Acessar Firebase Console**
1. Acesse: https://console.firebase.google.com
2. Selecione seu projeto **Tabula Estelar**
3. Vá em **Project Settings** (⚙️ no canto superior esquerdo)

### **1.2 - Configurar Cloud Messaging**
1. Clique na aba **Cloud Messaging**
2. **COPIE** o **Server Key** (você precisará dele no backend)
3. **ANOTE** o **Sender ID**

### **1.3 - Adicionar Apps (se ainda não fez)**
1. Na aba **General**, clique em **Add app**
2. **Android**: Package name = `com.joaoestellita.tabulaestelarnew`
3. **iOS**: Bundle ID = `com.joaoestellita.tabulaestelarnew`

---

## **2. DOWNLOAD DOS ARQUIVOS**

### **2.1 - Android**
1. Na configuração do app Android, clique **Download google-services.json**
2. **MOVA** o arquivo para: `D:\Tabulaestelarv0dev\tabula-estelar-new\google-services.json`

### **2.2 - iOS**
1. Na configuração do app iOS, clique **Download GoogleService-Info.plist**
2. **MOVA** o arquivo para: `D:\Tabulaestelarv0dev\tabula-estelar-new\GoogleService-Info.plist`

---

## **3. CONFIGURAÇÃO ANDROID**

### **3.1 - Verificar app.json**
✅ **JÁ CONFIGURADO!** O arquivo `app.json` já tem:
```json
"android": {
  "googleServicesFile": "./google-services.json"
}
```

### **3.2 - Instalar Dependências**
```bash
npx expo install expo-notifications expo-device expo-constants
npx expo install @react-native-community/datetimepicker
```

### **3.3 - Configurar Firebase no Android**
No Firebase Console → Project Settings → Cloud Messaging:
- **Server Key**: Copie e guarde (usaremos no backend)
- **Sender ID**: Anote também

---

## **4. CONFIGURAÇÃO iOS**

### **4.1 - Verificar app.json**
✅ **JÁ CONFIGURADO!** O arquivo `app.json` já tem:
```json
"ios": {
  "googleServicesFile": "./GoogleService-Info.plist"
}
```

### **4.2 - Configurar APNs (Apple Push Notification)**
1. No Firebase Console → Project Settings → Cloud Messaging
2. Na seção **iOS app configuration**:
   - Upload do **APNs Authentication Key** (se tiver)
   - OU upload do **APNs Certificate** (se tiver)
   
*Nota: Para desenvolvimento com Expo Go, isso não é necessário*

---

## **5. CONFIGURAÇÃO BACKEND (VERCEL)**

### **5.1 - Variáveis de Ambiente**
No painel da Vercel (https://vercel.com), adicione estas variáveis:

```env
FIREBASE_PROJECT_ID=seu-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@seu-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nSua chave privada aqui\n-----END PRIVATE KEY-----"
FIREBASE_SERVER_KEY=sua-server-key-do-cloud-messaging
CRON_SECRET_TOKEN=um-token-secreto-qualquer-para-seguranca
```

### **5.2 - Como Obter as Credenciais**
1. **Firebase Console** → Project Settings → **Service Accounts**
2. Clique em **Generate new private key**
3. Baixe o arquivo JSON
4. Use os valores do JSON nas variáveis de ambiente:
   - `project_id` → `FIREBASE_PROJECT_ID`
   - `client_email` → `FIREBASE_CLIENT_EMAIL`
   - `private_key` → `FIREBASE_PRIVATE_KEY`

### **5.3 - Server Key**
1. **Firebase Console** → Project Settings → **Cloud Messaging**
2. Copie o **Server Key** → `FIREBASE_SERVER_KEY`

---

## **6. TESTE DAS NOTIFICAÇÕES**

### **6.1 - Teste Manual no App**
1. Execute o app: `npx expo start`
2. Faça login
3. Vá em **Configurações** → **Notificações** → **Avançado**
4. Configure suas preferências
5. O app deve solicitar permissão de notificação

### **6.2 - Teste do Backend**
Teste o endpoint de notificações:
```bash
curl -X POST https://seu-backend.vercel.app/api/daily-notifications \
  -H "Authorization: Bearer seu-cron-secret-token" \
  -H "Content-Type: application/json"
```

### **6.3 - Teste Manual via Firebase Console**
1. **Firebase Console** → **Cloud Messaging**
2. Clique em **Send your first message**
3. Título: "Teste"
4. Texto: "Funcionando!"
5. Selecione o app e envie

---

## **7. CONFIGURAÇÃO DO CRON JOB**

### **7.1 - Usando Vercel Cron**
Crie o arquivo `vercel.json` na pasta backend:
```json
{
  "functions": {
    "api/daily-notifications.js": {
      "maxDuration": 300
    }
  },
  "crons": [
    {
      "path": "/api/daily-notifications",
      "schedule": "0 8 * * *"
    }
  ]
}
```

### **7.2 - Usando Serviço Externo (Alternativa)**
Se o Vercel Cron não funcionar, use:
- **cron-job.org** (gratuito)
- **EasyCron** (gratuito)
- **GitHub Actions** (gratuito)

Configure para chamar:
```
POST https://seu-backend.vercel.app/api/daily-notifications
Header: Authorization: Bearer seu-cron-secret-token
```

---

## **8. FUNCIONALIDADES IMPLEMENTADAS**

### **8.1 - Notificações Personalizadas**
✅ **Configuração por estado crítico**: Usuário escolhe quais áreas quer ser alertado
✅ **Frase pessoal**: Mensagem personalizada enviada para grupos
✅ **Horário customizado**: Usuário define quando receber
✅ **Tipos de alerta**: Visão geral, críticos, favoráveis, desafios

### **8.2 - Sistema Inteligente**
✅ **Cache de 12h**: Evita spam de notificações
✅ **Processamento em lotes**: Performance otimizada
✅ **Fallback robusto**: Sistema de retry automático
✅ **Logs detalhados**: Monitoramento completo

### **8.3 - Integração com Grupos**
✅ **Notificações de grupo**: Com frase pessoal do usuário
✅ **Alertas críticos**: Quando membro está em situação delicada
✅ **Mensagens personalizadas**: Baseadas nos cálculos astrológicos

---

## **9. COMANDOS RÁPIDOS**

### **Instalar Dependências**
```bash
cd D:\Tabulaestelarv0dev\tabula-estelar-new
npm install
npx expo install expo-notifications expo-device expo-constants @react-native-community/datetimepicker
```

### **Testar App**
```bash
npx expo start -c
```

### **Deploy Backend**
```bash
cd backend
git add .
git commit -m "Configuração Firebase FCM"
git push
```

---

## **10. TROUBLESHOOTING**

### **Problema: Notificações não chegam**
1. Verifique se `google-services.json` está na raiz do projeto
2. Confirme se as variáveis de ambiente estão corretas no Vercel
3. Teste se o token FCM está sendo gerado (veja logs do app)

### **Problema: Erro 500 no backend**
1. Verifique se `FIREBASE_PRIVATE_KEY` tem `\n` corretos
2. Confirme se o Service Account tem permissões
3. Veja logs no painel da Vercel

### **Problema: Permissão negada**
1. Usuário precisa aceitar permissões no primeiro uso
2. Em configurações do celular, verifique se notificações estão habilitadas
3. No iOS, pode precisar de certificado APNs

---

## **✅ CHECKLIST FINAL**

- [ ] `google-services.json` na raiz do projeto
- [ ] `GoogleService-Info.plist` na raiz do projeto  
- [ ] Variáveis de ambiente configuradas no Vercel
- [ ] Backend deployado e funcionando
- [ ] App solicita permissão de notificação
- [ ] Teste manual funcionando
- [ ] Cron job configurado
- [ ] Notificações chegando no horário

**🎉 PRONTO! Seu sistema de notificações está 100% funcional!**