// Script para inicializar estrutura do Firestore
// Execute uma vez após configurar as regras de segurança

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDPH1K_JQnyjGePrqYnEuTe5U-pJChUDrM",
  authDomain: "tabula-estelar-84fdc.firebaseapp.com",
  projectId: "tabula-estelar-84fdc",
  storageBucket: "tabula-estelar-84fdc.firebasestorage.app",
  messagingSenderId: "729037358278",
  appId: "1:729037358278:web:35bd0e39a865439a00c3c7",
  measurementId: "G-24LHB4BH9L",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function initializeFirestore() {
  try {
    console.log('🔥 Inicializando estrutura do Firestore...');

    // Criar documento de exemplo na coleção users (será removido automaticamente)
    await setDoc(doc(db, 'users', 'example'), {
      displayName: 'Usuário de Exemplo',
      birthDate: '1990-01-01',
      birthTime: '12:00',
      birthLocation: {
        city: 'São Paulo',
        country: 'Brasil',
        latitude: -23.5505,
        longitude: -46.6333,
      },
      zodiacSign: 'Capricórnio',
      preferences: {
        notifications: {
          criticalAlerts: true,
          groupUpdates: true,
          dailyHoroscope: true,
          weeklyForecast: false,
        },
        privacy: {
          showStatusToGroups: true,
          allowGroupInvites: true,
          shareLocation: false,
        },
        theme: 'dark',
      },
      stats: {
        groupsJoined: 0,
        alertsSent: 0,
        alertsReceived: 0,
        daysActive: 1,
      },
      createdAt: new Date(),
    });

    // Criar documento de exemplo na coleção groups
    await setDoc(doc(db, 'groups', 'example'), {
      name: 'Grupo de Exemplo',
      description: 'Grupo para testar funcionalidades',
      createdBy: 'example',
      members: ['example'],
      createdAt: new Date(),
      isPrivate: false,
      inviteCode: 'ABC123',
    });

    // Criar documento de exemplo na coleção notifications
    await setDoc(doc(db, 'notifications', 'example'), {
      userId: 'example',
      title: 'Bem-vindo ao Tábula Estelar!',
      body: 'Seu aplicativo está configurado e pronto para uso.',
      data: { type: 'welcome' },
      read: false,
      createdAt: new Date(),
    });

    // Criar documento de exemplo na coleção groupAlerts
    await setDoc(doc(db, 'groupAlerts', 'example'), {
      groupId: 'example',
      userId: 'example',
      userName: 'Usuário de Exemplo',
      status: 'high',
      message: 'Status astrológico crítico detectado!',
      createdAt: new Date(),
    });

    // Criar documento de exemplo na coleção fcmTokens
    await setDoc(doc(db, 'fcmTokens', 'example'), {
      userId: 'example',
      token: 'example_fcm_token',
      platform: 'web',
      lastUpdated: new Date(),
    });

    console.log('✅ Estrutura do Firestore criada com sucesso!');
    console.log('📋 Coleções criadas:');
    console.log('   - users (perfis de usuários)');
    console.log('   - groups (grupos astrológicos)');
    console.log('   - notifications (notificações)');
    console.log('   - groupAlerts (alertas de grupos)');
    console.log('   - fcmTokens (tokens de notificação)');
    console.log('');
    console.log('🔒 Configure as regras de segurança no Firebase Console!');
    
  } catch (error) {
    console.error('❌ Erro ao inicializar Firestore:', error);
  }
}

// Execute apenas se rodado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  initializeFirestore();
}

export default initializeFirestore;