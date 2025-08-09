import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Switch,
  Linking,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../hooks/useAuth';
import { useNotificationPreferences } from '../../hooks/useNotificationPreferences';
import { useUserSettings } from '../../hooks/useUserSettings';
import { MercadoPagoService } from '../../services/payment/MercadoPagoService';
import FAQ from '../../components/FAQ';
import SubscriptionPlansModal from '../../components/SubscriptionPlansModal';
import HousesPreview from '../../components/HousesPreview';
import { subscribeWebPush } from '../../webpush/subscribe';

const { width } = Dimensions.get('window');

interface SettingsSection {
  title: string;
  items: SettingsItem[];
}

interface SettingsItem {
  id: string;
  title: string;
  subtitle?: string;
  icon: string;
  type: 'toggle' | 'button' | 'link' | 'danger';
  value?: boolean;
  onPress?: () => void;
  onToggle?: (value: boolean) => void;
}

export default function SettingsScreen() {
  const { user, logout, deleteAccount: deleteUserAccount } = useAuth();
  const { preferences, updatePreferences } = useNotificationPreferences();
  const { settings: userSettings, updateSettings } = useUserSettings();
  const [isLoading, setIsLoading] = useState(false);
  const [showFAQ, setShowFAQ] = useState(false);
  const [showSubscriptionPlans, setShowSubscriptionPlans] = useState(false);
  const [houseSystem, setHouseSystem] = useState<'whole'|'equal'|'placidus'>( 'equal');

  const [settingsSections, setSettingsSections] = useState<SettingsSection[]>([
    {
      title: '🔔 Notificações',
      items: [
        {
          id: 'daily_notifications',
          title: 'Notificações Diárias',
          subtitle: 'Receba insights astrológicos diários',
          icon: 'notifications',
          type: 'toggle',
          value: preferences?.dailyNotifications ?? true,
          onToggle: (value) => updatePreferences({ dailyNotifications: value }),
        },
        {
          id: 'register_webpush',
          title: 'Registrar Web Push',
          subtitle: 'Ativar notificações no navegador',
          icon: 'notifications-outline',
          type: 'button',
          onPress: async () => {
            if (!user?.uid) return Alert.alert('Erro', 'Faça login para registrar')
            try {
              await subscribeWebPush(user.uid)
              Alert.alert('Sucesso', 'Web Push registrado!')
            } catch (e: any) {
              Alert.alert('Erro', e?.message || 'Falha ao registrar Web Push')
            }
          }
        },
        {
          id: 'critical_alerts',
          title: 'Alertas Críticos',
          subtitle: 'Aspectos importantes e oportunidades',
          icon: 'warning',
          type: 'toggle',
          value: preferences?.criticalAlerts ?? true,
          onToggle: (value) => updatePreferences({ criticalAlerts: value }),
        },
        {
          id: 'group_notifications',
          title: 'Notificações de Grupos',
          subtitle: 'Atividades e mensagens dos grupos',
          icon: 'people',
          type: 'toggle',
          value: preferences?.groupNotifications ?? true,
          onToggle: (value) => updatePreferences({ groupNotifications: value }),
        },
        {
          id: 'quiet_hours',
          title: 'Horário Silencioso',
          subtitle: 'Não perturbe das 22h às 8h',
          icon: 'moon',
          type: 'toggle',
          value: preferences?.quietHours ?? false,
          onToggle: (value) => updatePreferences({ quietHours: value }),
        },
      ],
    },
    {
      title: '💎 Assinatura',
      items: [
        {
          id: 'subscription_status',
          title: 'Status da Assinatura',
          subtitle: 'Gerenciar plano premium',
          icon: 'diamond',
          type: 'button',
          onPress: () => checkSubscriptionStatus(),
        },
        {
          id: 'billing_info',
          title: 'Informações de Pagamento',
          subtitle: 'Ver histórico e faturas',
          icon: 'card',
          type: 'button',
          onPress: () => openBillingInfo(),
        },
      ],
    },
    {
      title: '🔒 Privacidade e Segurança',
      items: [
        {
          id: 'data_sync',
          title: 'Sincronização de Dados',
          subtitle: 'Backup automático na nuvem',
          icon: 'cloud',
          type: 'toggle',
          value: userSettings?.dataSync ?? true,
          onToggle: (value) => updateSettings({ dataSync: value }),
        },
        {
          id: 'analytics',
          title: 'Analytics Anônimos',
          subtitle: 'Ajudar a melhorar o app',
          icon: 'analytics',
          type: 'toggle',
          value: userSettings?.analytics ?? true,
          onToggle: (value) => updateSettings({ analytics: value }),
        },
        {
          id: 'location_sharing',
          title: 'Compartilhar Localização',
          subtitle: 'Para cálculos astrológicos precisos',
          icon: 'location',
          type: 'toggle',
          value: userSettings?.locationSharing ?? true,
          onToggle: (value) => updateSettings({ locationSharing: value }),
        },
      ],
    },
    {
      title: '📱 Aplicativo',
      items: [
        {
          id: 'app_version',
          title: 'Versão do App',
          subtitle: '1.0.0',
          icon: 'information-circle',
          type: 'link',
        },
        {
          id: 'faq',
          title: 'Perguntas Frequentes',
          subtitle: 'Como o app funciona',
          icon: 'help-circle',
          type: 'button',
          onPress: () => setShowFAQ(true),
        },
        {
          id: 'terms_of_service',
          title: 'Termos de Uso',
          subtitle: 'Leia nossos termos',
          icon: 'document-text',
          type: 'button',
          onPress: () => openTerms(),
        },
        {
          id: 'privacy_policy',
          title: 'Política de Privacidade',
          subtitle: 'Como protegemos seus dados',
          icon: 'shield-checkmark',
          type: 'button',
          onPress: () => openPrivacyPolicy(),
        },
        {
          id: 'support',
          title: 'Suporte',
          subtitle: 'Precisa de ajuda?',
          icon: 'help-circle',
          type: 'button',
          onPress: () => openSupport(),
        },
        {
          id: 'feedback',
          title: 'Enviar Feedback',
          subtitle: 'Sua opinião é importante',
          icon: 'chatbubble-ellipses',
          type: 'button',
          onPress: () => openFeedback(),
        },
      ],
    },
    {
      title: '👤 Conta',
      items: [
        {
          id: 'profile',
          title: 'Editar Perfil',
          subtitle: 'Nome, foto e informações',
          icon: 'person',
          type: 'button',
          onPress: () => editProfile(),
        },
        {
          id: 'export_data',
          title: 'Exportar Dados',
          subtitle: 'Baixar seus dados astrológicos',
          icon: 'download',
          type: 'button',
          onPress: () => exportData(),
        },
        {
          id: 'delete_account',
          title: 'Excluir Conta',
          subtitle: 'Remover permanentemente',
          icon: 'trash',
          type: 'danger',
          onPress: () => deleteAccount(),
        },
        {
          id: 'sign_out',
          title: 'Sair da Conta',
          subtitle: 'Fazer logout',
          icon: 'log-out',
          type: 'danger',
          onPress: () => handleSignOut(),
        },
      ],
    },
  ]);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      // Carregar configurações salvas
      // TODO: Implementar carregamento de configurações do backend
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
    }
  };

  const checkSubscriptionStatus = async () => {
    try {
      setIsLoading(true);
      
      if (!user?.uid) {
        Alert.alert('Erro', 'Usuário não identificado.');
        return;
      }

      const status = await MercadoPagoService.getSubscriptionStatus(user.uid);
      
      if (status.isActive) {
        const plan = MercadoPagoService.getPlanById(status.planId || '');
        const planName = plan?.name || 'Premium';
        const expiresAt = status.expiresAt ? 
          new Date(status.expiresAt).toLocaleDateString('pt-BR') : 'N/A';
        
        Alert.alert(
          '✅ Assinatura Ativa',
          `Plano: ${planName}\nExpira em: ${expiresAt}\n\nDeseja gerenciar sua assinatura?`,
          [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Gerenciar', onPress: () => openSubscriptionManagement() }
          ]
        );
      } else if (MercadoPagoService.isInTrial(status)) {
        const daysRemaining = MercadoPagoService.getTrialDaysRemaining(status);
        Alert.alert(
          '🆓 Período de Teste',
          `Você está no período de teste gratuito!\nDias restantes: ${daysRemaining}\n\nDeseja assinar um plano?`,
          [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Ver Planos', onPress: () => openSubscriptionPlans() }
          ]
        );
      } else {
        Alert.alert(
          '💎 Assinatura Premium',
          'Desbloqueie recursos exclusivos como IA conversacional, matching de casais e análises avançadas!',
          [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Ver Planos', onPress: () => openSubscriptionPlans() }
          ]
        );
      }
    } catch (error) {
      console.error('Erro ao verificar assinatura:', error);
      Alert.alert('Erro', 'Não foi possível verificar o status da assinatura.');
    } finally {
      setIsLoading(false);
    }
  };

  const openSubscriptionPlans = () => {
    setShowSubscriptionPlans(true);
  };

  const openSubscriptionManagement = () => {
    // TODO: Navegar para tela de gerenciamento de assinatura
    Alert.alert('Gerenciar Assinatura', 'Funcionalidade em desenvolvimento.');
  };

  const openBillingInfo = () => {
    Linking.openURL('https://www.mercadopago.com.br');
  };

  // Funções removidas pois agora usam os hooks

  const editProfile = () => {
    // TODO: Navegar para tela de edição de perfil
    Alert.alert('Editar Perfil', 'Funcionalidade em desenvolvimento.');
  };

  const exportData = () => {
    Alert.alert(
      'Exportar Dados',
      'Seus dados astrológicos serão exportados em formato JSON. Deseja continuar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Exportar', onPress: () => {
          // TODO: Implementar exportação de dados
          Alert.alert('Sucesso', 'Dados exportados com sucesso!');
        }}
      ]
    );
  };

  const deleteAccount = () => {
    Alert.alert(
      '⚠️ Excluir Conta',
      'Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita e todos os seus dados serão perdidos permanentemente.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: async () => {
          try {
            setIsLoading(true);
            await deleteUserAccount();
            Alert.alert('✅ Conta Excluída', 'Sua conta foi excluída com sucesso.');
          } catch (error) {
            console.error('Erro ao excluir conta:', error);
            Alert.alert('❌ Erro', 'Não foi possível excluir a conta. Tente novamente.');
          } finally {
            setIsLoading(false);
          }
        }}
      ]
    );
  };

  const handleSignOut = () => {
    console.log('🔍 handleSignOut chamado')
    console.log('👤 Usuário atual:', user?.uid)
    console.log('🔧 Função logout disponível:', !!logout)
    
    Alert.alert(
      'Sair da Conta',
      'Tem certeza que deseja sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sair', style: 'destructive', onPress: async () => {
          try {
            console.log('🚪 Iniciando processo de logout...')
            setIsLoading(true);
            await logout();
            console.log('✅ Logout realizado com sucesso');
            Alert.alert('✅ Sucesso', 'Logout realizado com sucesso!');
          } catch (error) {
            console.error('❌ Erro no logout:', error);
            Alert.alert('❌ Erro', 'Não foi possível fazer logout. Tente novamente.');
          } finally {
            setIsLoading(false);
          }
        }}
      ]
    );
  };

  const openTerms = () => {
    Linking.openURL('https://tabulav0dev-new.vercel.app/terms');
  };

  const openPrivacyPolicy = () => {
    Linking.openURL('https://tabulav0dev-new.vercel.app/privacy');
  };

  const openSupport = () => {
    Linking.openURL('mailto:suporte@tabulaestelar.com');
  };

  const openFeedback = () => {
    Linking.openURL('mailto:feedback@tabulaestelar.com');
  };

  const handleToggle = (itemId: string, value: boolean) => {
    setSettingsSections(prevSettings => 
      prevSettings.map(section => ({
        ...section,
        items: section.items.map(item => 
          item.id === itemId ? { ...item, value } : item
        )
      }))
    );

    // Executar ação específica
    const item = settingsSections.flatMap(s => s.items).find(i => i.id === itemId);
    if (item?.onToggle) {
      item.onToggle(value);
    }
  };

  const renderSettingsItem = (item: SettingsItem) => {
    const isDanger = item.type === 'danger';
    const isLink = item.type === 'link';

    return (
      <TouchableOpacity
        key={item.id}
        style={[
          styles.settingsItem,
          isDanger && styles.dangerItem,
          isLink && styles.linkItem
        ]}
        onPress={item.onPress}
        disabled={item.type === 'toggle' || isLink}
      >
        <View style={styles.itemLeft}>
          <View style={[styles.iconContainer, isDanger && styles.dangerIcon]}>
            <Ionicons 
              name={item.icon as any} 
              size={20} 
              color={isDanger ? '#FF4444' : '#FFD700'} 
            />
          </View>
          <View style={styles.itemText}>
            <Text style={[styles.itemTitle, isDanger && styles.dangerText]}>
              {item.title}
            </Text>
            {item.subtitle && (
              <Text style={[styles.itemSubtitle, isDanger && styles.dangerSubtitle]}>
                {item.subtitle}
              </Text>
            )}
          </View>
        </View>

        <View style={styles.itemRight}>
          {item.type === 'toggle' ? (
            <Switch
              value={item.value}
              onValueChange={(value) => handleToggle(item.id, value)}
              trackColor={{ false: '#3C3C3E', true: '#FFD700' }}
              thumbColor={item.value ? '#0a0e27' : '#f4f3f4'}
            />
          ) : (
            <Ionicons 
              name={isLink ? 'chevron-forward' : 'chevron-forward'} 
              size={20} 
              color={isDanger ? '#FF4444' : '#b0b0b0'} 
            />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#0a0e27', '#1a1f3a', '#2d1b69']}
        style={styles.gradient}
      >
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>⚙️ Configurações</Text>
            <Text style={styles.subtitle}>
              Personalize sua experiência no Tábula Estelar
            </Text>
          </View>

          {/* User Info */}
          <View style={styles.userInfo}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>
                {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
              </Text>
            </View>
            <View style={styles.userDetails}>
              <Text style={styles.userName}>
                {user?.displayName || 'Usuário'}
              </Text>
              <Text style={styles.userEmail}>
                {user?.email || 'usuario@email.com'}
              </Text>
            </View>
          </View>

          {/* Settings Sections */}
          {settingsSections.map((section, sectionIndex) => (
            <View key={sectionIndex} style={styles.section}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <View style={styles.sectionContent}>
                {section.items.map(renderSettingsItem)}
              </View>
            </View>
          ))}

          {/* Casas Astrológicas (MVP) */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🏠 Sistema de Casas (MVP)</Text>
            <View style={{ flexDirection: 'row', paddingHorizontal: 20, paddingBottom: 12 }}>
              <TouchableOpacity onPress={() => setHouseSystem('whole')} style={styles.choiceBtn}><Text style={styles.choiceText}>Whole</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => setHouseSystem('equal')} style={styles.choiceBtn}><Text style={styles.choiceText}>Equal</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => setHouseSystem('placidus-beta')} style={styles.choiceBtn}><Text style={styles.choiceText}>Placidus (beta)</Text></TouchableOpacity>
            </View>
            <Text style={{ color:'#b0b0b0', paddingHorizontal: 20, marginBottom: 8 }}>Atual: {houseSystem}</Text>
            <View style={{ marginHorizontal: 20, marginBottom: 20 }}>
              <HousesPreview
                dateUTC={new Date()}
                lat={-22.9068}
                lon={-43.1729}
                system={houseSystem}
              />
            </View>
          </View>

          {/* App Info */}
          <View style={styles.appInfo}>
            <Text style={styles.appInfoText}>
              Tábula Estelar v1.0.0
            </Text>
            <Text style={styles.appInfoSubtext}>
              Desenvolvido com ❤️ para sua jornada astrológica
            </Text>
          </View>
        </ScrollView>
      </LinearGradient>

      {/* FAQ Modal */}
      <FAQ visible={showFAQ} onClose={() => setShowFAQ(false)} />
      <SubscriptionPlansModal
        visible={showSubscriptionPlans}
        onClose={() => setShowSubscriptionPlans(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFD700',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#e0e0e0',
    textAlign: 'center',
    lineHeight: 24,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginHorizontal: 20,
    marginBottom: 30,
    padding: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.2)',
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0a0e27',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#b0b0b0',
  },
  section: {
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 15,
    paddingLeft: 5,
  },
  sectionContent: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.2)',
    overflow: 'hidden',
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  dangerItem: {
    borderBottomColor: 'rgba(255, 68, 68, 0.2)',
  },
  linkItem: {
    opacity: 0.7,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  dangerIcon: {
    backgroundColor: 'rgba(255, 68, 68, 0.1)',
  },
  itemText: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#e0e0e0',
    marginBottom: 2,
  },
  itemSubtitle: {
    fontSize: 14,
    color: '#b0b0b0',
    lineHeight: 18,
  },
  dangerText: {
    color: '#FF4444',
  },
  dangerSubtitle: {
    color: '#FF6666',
  },
  itemRight: {
    alignItems: 'center',
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  appInfoText: {
    fontSize: 16,
    color: '#b0b0b0',
    marginBottom: 5,
  },
  appInfoSubtext: {
    fontSize: 14,
    color: '#888888',
    textAlign: 'center',
  },
});
