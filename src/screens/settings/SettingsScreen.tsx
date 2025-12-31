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
  Platform,
  ToastAndroid,
  TextInput,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { useAuth } from '../../hooks/useAuth';
import { useNotificationPreferences } from '../../hooks/useNotificationPreferences';
import { useUserSettings } from '../../hooks/useUserSettings';
import { MercadoPagoService } from '../../services/payment/MercadoPagoService';
import FAQ from '../../components/FAQ';
import SubscriptionPlansModal from '../../components/SubscriptionPlansModal';
// Removidos itens de preview e comparativos da Configura├º├úo (foram para Home)
import { subscribeWebPush } from '../../webpush/subscribe';
import UserService from '../../services/firebase/UserService';
import type { HouseSystem } from '../../astro/houseSystem';
import { HOUSE_SYSTEMS, normalizeHouseSystem, formatHouseSystemLabel } from '../../astro/houseSystem';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';

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
  const [houseSystem, setHouseSystem] = useState<HouseSystem>('placidus');
  const [profileName, setProfileName] = useState('');
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profilePrivacy, setProfilePrivacy] = useState({
    showStatusToGroups: true,
    allowGroupInvites: true,
  });

  const [settingsSections, setSettingsSections] = useState<SettingsSection[]>([
    {
      title: '­ƒöö Notifica├º├Áes',
      items: [
        {
          id: 'daily_notifications',
          title: 'Notifica├º├Áes Di├írias',
          subtitle: 'Receba insights astrol├│gicos di├írios',
          icon: 'notifications',
          type: 'toggle',
          value: preferences?.dailyNotifications ?? true,
          onToggle: (value) => updatePreferences({ dailyNotifications: value }),
        },
        {
          id: 'register_webpush',
          title: 'Registrar Web Push',
          subtitle: 'Ativar notifica├º├Áes no navegador',
          icon: 'notifications-outline',
          type: 'button',
          onPress: async () => {
            if (!user?.uid) return Alert.alert('Erro', 'Fa├ºa login para registrar')
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
          title: 'Alertas Cr├¡ticos',
          subtitle: 'Aspectos importantes e oportunidades',
          icon: 'warning',
          type: 'toggle',
          value: preferences?.criticalAlerts ?? true,
          onToggle: (value) => updatePreferences({ criticalAlerts: value }),
        },
        {
          id: 'group_notifications',
          title: 'Notifica├º├Áes de Grupos',
          subtitle: 'Atividades e mensagens dos grupos',
          icon: 'people',
          type: 'toggle',
          value: preferences?.groupNotifications ?? true,
          onToggle: (value) => updatePreferences({ groupNotifications: value }),
        },
        {
          id: 'quiet_hours',
          title: 'Hor├írio Silencioso',
          subtitle: 'N├úo perturbe das 22h ├ás 8h',
          icon: 'moon',
          type: 'toggle',
          value: preferences?.quietHours ?? false,
          onToggle: (value) => updatePreferences({ quietHours: value }),
        },
      ],
    },
    {
      title: '­ƒÆÄ Assinatura',
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
          title: 'Informa├º├Áes de Pagamento',
          subtitle: 'Ver hist├│rico e faturas',
          icon: 'card',
          type: 'button',
          onPress: () => openBillingInfo(),
        },
      ],
    },
    {
      title: '­ƒöÆ Privacidade e Seguran├ºa',
      items: [
        {
          id: 'data_sync',
          title: 'Sincroniza├º├úo de Dados',
          subtitle: 'Backup autom├ítico na nuvem',
          icon: 'cloud',
          type: 'toggle',
          value: userSettings?.dataSync ?? true,
          onToggle: (value) => updateSettings({ dataSync: value }),
        },
        {
          id: 'analytics',
          title: 'Analytics An├┤nimos',
          subtitle: 'Ajudar a melhorar o app',
          icon: 'analytics',
          type: 'toggle',
          value: userSettings?.analytics ?? true,
          onToggle: (value) => updateSettings({ analytics: value }),
        },
        {
          id: 'location_sharing',
          title: 'Compartilhar Localiza├º├úo',
          subtitle: 'Para c├ílculos astrol├│gicos precisos',
          icon: 'location',
          type: 'toggle',
          value: userSettings?.locationSharing ?? true,
          onToggle: (value) => updateSettings({ locationSharing: value }),
        },
      ],
    },
    {
      title: '­ƒô▒ Aplicativo',
      items: [
        {
          id: 'app_version',
          title: 'Vers├úo do App',
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
          title: 'Pol├¡tica de Privacidade',
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
          subtitle: 'Sua opini├úo ├® importante',
          icon: 'chatbubble-ellipses',
          type: 'button',
          onPress: () => openFeedback(),
        },
      ],
    },
    {
      title: '­ƒæñ Conta',
      items: [
        {
          id: 'export_data',
          title: 'Exportar Dados',
          subtitle: 'Baixar seus dados astrol├│gicos',
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
    loadProfile();
  }, []);

  useEffect(() => {
    if (userSettings?.houseSystem) {
      setHouseSystem(normalizeHouseSystem(userSettings.houseSystem));
    }
  }, [userSettings?.houseSystem]);

  // (Removido) Overrides de ASC ÔÇô agora c├ílculo ├® sempre autom├ítico

  const loadSettings = async () => {
    try {
      // Carregar configura├º├Áes salvas
      // TODO: Implementar carregamento de configura├º├Áes do backend
    } catch (error) {
      console.error('Erro ao carregar configura├º├Áes:', error);
    }
  };
  const loadProfile = async () => {
    if (!user?.uid) return;
    try {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists()) return;
      const data = userDoc.data() || {};
      setProfileName(data.displayName || data.fullName || user.email?.split("@")[0] || "");
      setProfilePhoto(data.profilePhoto || null);
      setProfilePrivacy({
        showStatusToGroups: data.preferences?.privacy?.showStatusToGroups !== false,
        allowGroupInvites: data.preferences?.privacy?.allowGroupInvites !== false,
      });
    } catch (error) {
      console.warn("Erro ao carregar perfil:", error);
    }
  };

  const uploadProfilePhoto = async (userId: string, dataUrl: string): Promise<string | null> => {
    try {
      const base = (process.env.EXPO_PUBLIC_BACKEND_URL || "").replace(/\/$/, "");
      if (!base) return null;
      const response = await fetch(base + "/api/upload/profile-photo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, dataUrl }),
      });
      if (!response.ok) return null;
      const payload = await response.json();
      return payload?.url || null;
    } catch (error) {
      console.warn("Falha ao enviar foto:", error);
      return null;
    }
  };

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("PermissÒo Necessßria", "Precisamos de acesso Ó galeria para selecionar sua foto.");
      return false;
    }
    return true;
  };

  const pickImage = async (source: "gallery" | "camera") => {
    if (!user?.uid) return;
    try {
      let result;
      if (source === "camera") {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("PermissÒo Necessßria", "Precisamos de acesso Ó cÔmera.");
          return;
        }
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });
      } else {
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });
      }

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        const manipulatedImage = await ImageManipulator.manipulateAsync(
          asset.uri,
          [{ resize: { width: 600, height: 600 } }],
          { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG, base64: true }
        );
        const dataUrl = manipulatedImage.base64
          ? "data:image/jpeg;base64," + manipulatedImage.base64
          : manipulatedImage.uri;
        setProfilePhoto(dataUrl);
      }
    } catch (error) {
      console.error("Erro ao selecionar foto:", error);
      Alert.alert("Erro", "NÒo foi possÝvel selecionar a foto. Tente novamente.");
    }
  };

  const selectPhoto = async () => {
    if (typeof window !== "undefined") {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = async (event: any) => {
        const file = event.target.files[0];
        if (!file) return;

        const compressToDataUrl = async (file: File): Promise<string> => {
          const img = document.createElement("img");
          const objectUrl = URL.createObjectURL(file);
          await new Promise((res) => {
            img.onload = () => res(null as any);
            img.src = objectUrl;
          });
          const canvas = document.createElement("canvas");
          const maxSize = 600;
          const scale = Math.min(maxSize / img.width, maxSize / img.height, 1);
          canvas.width = Math.round(img.width * scale);
          canvas.height = Math.round(img.height * scale);
          const ctx = canvas.getContext("2d")!;
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          URL.revokeObjectURL(objectUrl);
          return canvas.toDataURL("image/jpeg", 0.82);
        };

        const dataUrl = await compressToDataUrl(file);
        setProfilePhoto(dataUrl);
      };
      input.click();
      return;
    }

    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    Alert.alert("Escolher Foto", "Como vocÛ gostaria de adicionar sua foto?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Galeria", onPress: () => pickImage("gallery") },
      { text: "CÔmera", onPress: () => pickImage("camera") },
    ]);
  };

  const saveProfile = async () => {
    if (!user?.uid) return;
    try {
      setSavingProfile(true);
      let updatedPhoto = profilePhoto;
      if (updatedPhoto && updatedPhoto.startsWith("data:")) {
        const uploaded = await uploadProfilePhoto(user.uid, updatedPhoto);
        updatedPhoto = uploaded || updatedPhoto;
      }

      const payload = {
        displayName: profileName || user.email?.split("@")[0] || "Usuario",
        profilePhoto: updatedPhoto || null,
      };

      await updateDoc(doc(db, "users", user.uid), payload);
      await setDoc(doc(db, "userPublicProfiles", user.uid), {
        ...payload,
        updatedAt: serverTimestamp(),
      }, { merge: true });
      Alert.alert("Sucesso", "Perfil atualizado!");
    } catch (error) {
      console.error("Erro ao salvar perfil:", error);
      Alert.alert("Erro", "NÒo foi possÝvel salvar seu perfil agora.");
    } finally {
      setSavingProfile(false);
    }
  };

  const updatePrivacyPreference = async (
    key: "showStatusToGroups" | "allowGroupInvites",
    value: boolean
  ) => {
    if (!user?.uid) return;
    setProfilePrivacy((prev) => ({ ...prev, [key]: value }));
    try {
      await updateDoc(doc(db, "users", user.uid), {
        [`preferences.privacy.${key}`]: value,
      });
    } catch (error) {
      console.error("Erro ao atualizar privacidade:", error);
    }
  };

  // Reprocessar Casas Natais removido desta tela conforme solicitado

  const handleHouseSystemChange = async (system: HouseSystem) => {
    const normalized = normalizeHouseSystem(system);
    setHouseSystem(normalized);
    await updateSettings({ houseSystem: normalized });
    if (user?.uid) {
      try { await UserService.setHouseSystem(user.uid, normalized); } catch {}
    }
  };

  const checkSubscriptionStatus = async () => {
    try {
      setIsLoading(true);
      
      if (!user?.uid) {
        Alert.alert('Erro', 'Usu├írio n├úo identificado.');
        return;
      }

      const status = await MercadoPagoService.getSubscriptionStatus(user.uid);
      
      if (status.isActive) {
        const plan = MercadoPagoService.getPlanById(status.planId || '');
        const planName = plan?.name || 'Premium';
        const expiresAt = status.expiresAt ? 
          new Date(status.expiresAt).toLocaleDateString('pt-BR') : 'N/A';
        
        Alert.alert(
          'Ô£à Assinatura Ativa',
          `Plano: ${planName}\nExpira em: ${expiresAt}\n\nDeseja gerenciar sua assinatura?`,
          [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Gerenciar', onPress: () => openSubscriptionManagement() }
          ]
        );
      } else if (MercadoPagoService.isInTrial(status)) {
        const daysRemaining = MercadoPagoService.getTrialDaysRemaining(status);
        Alert.alert(
          '­ƒåô Per├¡odo de Teste',
          `Voc├¬ est├í no per├¡odo de teste gratuito!\nDias restantes: ${daysRemaining}\n\nDeseja assinar um plano?`,
          [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Ver Planos', onPress: () => openSubscriptionPlans() }
          ]
        );
      } else {
        Alert.alert(
          '­ƒÆÄ Assinatura Premium',
          'Desbloqueie recursos exclusivos como IA conversacional, matching de casais e an├ílises avan├ºadas!',
          [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Ver Planos', onPress: () => openSubscriptionPlans() }
          ]
        );
      }
    } catch (error) {
      console.error('Erro ao verificar assinatura:', error);
      Alert.alert('Erro', 'N├úo foi poss├¡vel verificar o status da assinatura.');
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

  // Fun├º├Áes removidas pois agora usam os hooks


  const exportData = () => {
    Alert.alert(
      'Exportar Dados',
      'Seus dados astrol├│gicos ser├úo exportados em formato JSON. Deseja continuar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Exportar', onPress: () => {
          // TODO: Implementar exporta├º├úo de dados
          Alert.alert('Sucesso', 'Dados exportados com sucesso!');
        }}
      ]
    );
  };

  const deleteAccount = () => {
    Alert.alert(
      'ÔÜá´©Å Excluir Conta',
      'Tem certeza que deseja excluir sua conta? Esta a├º├úo n├úo pode ser desfeita e todos os seus dados ser├úo perdidos permanentemente.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: async () => {
          try {
            setIsLoading(true);
            await deleteUserAccount();
            Alert.alert('Ô£à Conta Exclu├¡da', 'Sua conta foi exclu├¡da com sucesso.');
          } catch (error) {
            console.error('Erro ao excluir conta:', error);
            Alert.alert('ÔØî Erro', 'N├úo foi poss├¡vel excluir a conta. Tente novamente.');
          } finally {
            setIsLoading(false);
          }
        }}
      ]
    );
  };

  const handleSignOut = () => {
    console.log('­ƒöì handleSignOut chamado')
    console.log('­ƒæñ Usu├írio atual:', user?.uid)
    console.log('­ƒöº Fun├º├úo logout dispon├¡vel:', !!logout)
    
    if (Platform.OS === 'web') {
      try {
        // window.confirm retorna true/false no Web
        // eslint-disable-next-line no-restricted-globals
        const ok = typeof window !== 'undefined' ? window.confirm('Tem certeza que deseja sair?') : true
        if (!ok) return
        setIsLoading(true)
        logout()
          .then(() => console.log('Ô£à Logout (web) realizado com sucesso'))
          .catch((error) => console.error('ÔØî Erro no logout (web):', error))
          .finally(() => setIsLoading(false))
      } catch (error) {
        console.error('ÔØî Erro no fluxo de logout (web):', error)
      }
      return
    }

    Alert.alert(
      'Sair da Conta',
      'Tem certeza que deseja sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sair', style: 'destructive', onPress: async () => {
          try {
            console.log('­ƒÜ¬ Iniciando processo de logout...')
            setIsLoading(true);
            await logout();
            console.log('Ô£à Logout realizado com sucesso');
            Alert.alert('Ô£à Sucesso', 'Logout realizado com sucesso!');
          } catch (error) {
            console.error('ÔØî Erro no logout:', error);
            Alert.alert('ÔØî Erro', 'N├úo foi poss├¡vel fazer logout. Tente novamente.');
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

    // Executar a├º├úo espec├¡fica
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
            <Text style={styles.title}>ÔÜÖ´©Å Configura├º├Áes</Text>
            <Text style={styles.subtitle}>
              Personalize sua experi├¬ncia no T├íbula Estelar
            </Text>
          </View>

          {/* Perfil (ediþÒo rßpida) */}
          <View style={styles.userInfo}>
            <TouchableOpacity style={styles.avatarContainer} onPress={selectPhoto} disabled={savingProfile}>
              {profilePhoto ? (
                <Image source={{ uri: profilePhoto }} style={styles.avatarImage} />
              ) : (
                <Text style={styles.avatarText}>
                  {profileName?.charAt(0) || user?.email?.charAt(0) || "U"}
                </Text>
              )}
              <View style={styles.avatarEditBadge}>
                <Ionicons name="camera" size={14} color="#000" />
              </View>
            </TouchableOpacity>
            <View style={styles.userDetails}>
              <TextInput
                style={styles.nameInput}
                placeholder="Seu nome"
                placeholderTextColor="#888"
                value={profileName}
                onChangeText={setProfileName}
              />
              <Text style={styles.userEmail}>
                {user?.email || "usuario@email.com"}
              </Text>
              <TouchableOpacity style={styles.saveProfileButton} onPress={saveProfile} disabled={savingProfile}>
                <Text style={styles.saveProfileText}>
                  {savingProfile ? "Salvando..." : "Salvar perfil"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Sistema de Casas */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sistema de Casas</Text>
            <Text style={styles.sectionNote}>
              Afeta mapas e analises; sistemas diferentes mudam as casas e os significados.
            </Text>
            <View style={styles.sectionContent}>
              {HOUSE_SYSTEMS.map((system) => {
                const active = houseSystem === system;
                return (
                  <TouchableOpacity
                    key={system}
                    style={styles.settingsItem}
                    onPress={() => handleHouseSystemChange(system)}
                  >
                    <View style={styles.itemLeft}>
                      <View style={styles.iconContainer}>
                        <Ionicons name="home" size={20} color="#FFD700" />
                      </View>
                      <View style={styles.itemText}>
                        <Text style={styles.itemTitle}>{formatHouseSystemLabel(system)}</Text>
                        <Text style={styles.itemSubtitle}>Aplicar ao mapa natal e transitos</Text>
                      </View>
                    </View>
                    <View style={styles.itemRight}>
                      <Ionicons name={active ? 'checkmark-circle' : 'ellipse-outline'} size={20} color={active ? '#22C55E' : '#b0b0b0'} />
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
          {/* Privacidade nos Grupos */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Privacidade nos Grupos</Text>
            <View style={styles.sectionContent}>
              <View style={styles.settingsItem}>
                <View style={styles.itemLeft}>
                  <View style={styles.iconContainer}>
                    <Ionicons name="eye" size={20} color="#FFD700" />
                  </View>
                  <View style={styles.itemText}>
                    <Text style={styles.itemTitle}>Compartilhar status</Text>
                    <Text style={styles.itemSubtitle}>Permitir que membros vejam seu status</Text>
                  </View>
                </View>
                <View style={styles.itemRight}>
                  <Switch
                    value={profilePrivacy.showStatusToGroups}
                    onValueChange={(value) => updatePrivacyPreference("showStatusToGroups", value)}
                    trackColor={{ false: "#3C3C3E", true: "#FFD700" }}
                    thumbColor={profilePrivacy.showStatusToGroups ? "#0a0e27" : "#f4f3f4"}
                  />
                </View>
              </View>
              <View style={styles.settingsItem}>
                <View style={styles.itemLeft}>
                  <View style={styles.iconContainer}>
                    <Ionicons name="mail" size={20} color="#FFD700" />
                  </View>
                  <View style={styles.itemText}>
                    <Text style={styles.itemTitle}>Permitir convites</Text>
                    <Text style={styles.itemSubtitle}>Receber convites para grupos</Text>
                  </View>
                </View>
                <View style={styles.itemRight}>
                  <Switch
                    value={profilePrivacy.allowGroupInvites}
                    onValueChange={(value) => updatePrivacyPreference("allowGroupInvites", value)}
                    trackColor={{ false: "#3C3C3E", true: "#FFD700" }}
                    thumbColor={profilePrivacy.allowGroupInvites ? "#0a0e27" : "#f4f3f4"}
                  />
                </View>
              </View>
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

          {/* Se├º├úo de Casas removida */}

          {/* App Info */}
          <View style={styles.appInfo}>
            <Text style={styles.appInfoText}>
              T├íbula Estelar v1.0.0
            </Text>
            <Text style={styles.appInfoSubtext}>
              Desenvolvido com ÔØñ´©Å para sua jornada astrol├│gica
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
  avatarImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  avatarEditBadge: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FFD700',
    alignItems: 'center',
    justifyContent: 'center',
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
  nameInput: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFD700",
    marginBottom: 6,
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  userEmail: {
    fontSize: 14,
    color: '#b0b0b0',
  },
  saveProfileButton: {
    marginTop: 10,
    backgroundColor: '#2C2C2E',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  saveProfileText: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: '600',
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
  sectionNote: {
    fontSize: 12,
    color: '#b0b0b0',
    marginBottom: 10,
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
  inputLabel: {
    color: '#e0e0e0',
    marginBottom: 6,
    fontWeight: '600'
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    color: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
  },
  helperText: {
    color: '#9aa0b1',
    fontSize: 12,
    marginTop: 6,
  },
  primaryButton: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
  },
  primaryButtonText: {
    color: '#0a0e27',
    fontWeight: '700'
  },
  secondaryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)'
  },
  secondaryButtonText: {
    color: '#e0e0e0',
    fontWeight: '600'
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
