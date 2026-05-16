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
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import * as Notifications from 'expo-notifications';
import { useAuth } from '../../hooks/useAuth';
import { useUserSettings } from '../../hooks/useUserSettings';
import { useAppLanguage } from '../../hooks/useAppLanguage';
import { MercadoPagoService } from '../../services/payment/MercadoPagoService';
import FAQ from '../../components/FAQ';
// Removidos itens de preview e comparativos da Configuracao (foram para Home)
import { subscribeWebPush } from '../../webpush/subscribe';
import { registerDeviceToken } from '../../services/notifications/registerDeviceToken';
import UserService from '../../services/firebase/UserService';
import type { HouseSystem } from '../../astro/houseSystem';
import { HOUSE_SYSTEMS, normalizeHouseSystem, formatHouseSystemLabel } from '../../astro/houseSystem';
import { collection, doc, getDoc, getDocs, limit, query, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { backendFetch } from '../../services/backend/client';
import LocationService, { type LocationSuggestion } from '../../services/LocationService';

const { width } = Dimensions.get('window');
const BACKEND_URL = (process.env.EXPO_PUBLIC_BACKEND_URL || 'https://tabulav0dev-backend.vercel.app').replace(/\/$/, '');

interface SettingsSection {
  id: string;
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
  const { settings: userSettings, updateSettings } = useUserSettings();
  const { language, languages, setLanguage, t } = useAppLanguage();
  const tr = (key: string, fallback: string, vars?: Record<string, string | number>) => {
    const value = t(key, vars as any);
    return value === key ? fallback : value;
  };
  const [isLoading, setIsLoading] = useState(false);
  const [showFAQ, setShowFAQ] = useState(false);
  const [houseSystem, setHouseSystem] = useState<HouseSystem>('whole-sign');
  const [profileName, setProfileName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [whatsappPhone, setWhatsappPhone] = useState('');
  const [birthLocation, setBirthLocation] = useState<{
    city?: string;
    state?: string;
    country?: string;
    latitude?: number;
    longitude?: number;
    displayName?: string;
  } | null>(null);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [profilePhotoDirty, setProfilePhotoDirty] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [isAdminUser, setIsAdminUser] = useState(false);
  type PushPermission = 'granted' | 'denied' | 'default' | 'undetermined' | 'unknown' | 'unsupported';
  const [notificationPermission, setNotificationPermission] = useState<Notifications.PermissionStatus | 'unknown'>('unknown');
  const webPushScale = React.useRef(new Animated.Value(1)).current;
  const [pushStatus, setPushStatus] = useState({
    hasWebPush: false,
    hasFcmToken: false,
    permission: 'unknown' as PushPermission,
  });
  const [webPushDiagnostics, setWebPushDiagnostics] = useState({
    supported: false,
    permission: 'unknown' as PushPermission,
    serviceWorkerState: 'unknown' as 'unknown' | 'installing' | 'installed' | 'activating' | 'activated' | 'redundant',
    pushManagerSupported: false,
    subscriptionActive: false,
    subscriptionEndpoint: '',
    subscriptionExpiration: '' as string | '',
  });
  const [pushStatusLoading, setPushStatusLoading] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [locationQuery, setLocationQuery] = useState('');
  const [locationSuggestions, setLocationSuggestions] = useState<LocationSuggestion[]>([]);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [searchingLocation, setSearchingLocation] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<LocationSuggestion | null>(null);
  const [profileSnapshot, setProfileSnapshot] = useState<{
    name: string;
    birthDate: string;
    birthTime: string;
    whatsappPhone: string;
    birthLocation: typeof birthLocation;
    locationQuery: string;
    photo: string | null;
  } | null>(null);

  const navigation = useNavigation();

  const buildSettingsSections = React.useCallback((): SettingsSection[] => ([
    {
      id: 'notifications',
      title: t('settings.section.notifications'),
      items: [
        {
          id: 'notification_options',
          title: t('settings.item.notificationOptions.title'),
          subtitle: t('settings.item.notificationOptions.subtitle'),
          icon: 'options-outline',
          type: 'button',
          onPress: () => navigation.navigate('NotificationPreferences' as never),
        },
        {
          id: 'register_webpush',
          title: t('settings.item.registerWebpush.title'),
          subtitle: t('settings.item.registerWebpush.subtitle'),
          icon: 'notifications-outline',
          type: 'button',
          onPress: () => handleWebPushPress(),
        },
      ],
    },
    {
      id: 'subscription',
      title: t('settings.section.subscription'),
      items: [
        {
          id: 'subscription_status',
          title: t('settings.item.subscriptionStatus.title'),
          subtitle: t('settings.item.subscriptionStatus.subtitle'),
          icon: 'diamond',
          type: 'button',
          onPress: () => checkSubscriptionStatus(),
        },
        {
          id: 'billing_info',
          title: t('settings.item.billingInfo.title'),
          subtitle: t('settings.item.billingInfo.subtitle'),
          icon: 'card',
          type: 'button',
          onPress: () => openBillingInfo(),
        },
      ],
    },
    {
      id: 'app',
      title: t('settings.section.app'),
      items: [
        {
          id: 'app_version',
          title: t('settings.item.appVersion.title'),
          subtitle: '1.0.0',
          icon: 'information-circle',
          type: 'link',
        },
        {
          id: 'faq',
          title: t('settings.item.faq.title'),
          subtitle: t('settings.item.faq.subtitle'),
          icon: 'help-circle',
          type: 'button',
          onPress: () => setShowFAQ(true),
        },
        {
          id: 'terms_of_service',
          title: t('settings.item.terms.title'),
          subtitle: t('settings.item.terms.subtitle'),
          icon: 'document-text',
          type: 'button',
          onPress: () => openTerms(),
        },
        {
          id: 'privacy_policy',
          title: t('settings.item.privacy.title'),
          subtitle: t('settings.item.privacy.subtitle'),
          icon: 'shield-checkmark',
          type: 'button',
          onPress: () => openPrivacyPolicy(),
        },
        {
          id: 'support',
          title: t('settings.item.support.title'),
          subtitle: t('settings.item.support.subtitle'),
          icon: 'help-circle',
          type: 'button',
          onPress: () => openSupport(),
        },
        {
          id: 'feedback',
          title: t('settings.item.feedback.title'),
          subtitle: t('settings.item.feedback.subtitle'),
          icon: 'chatbubble-ellipses',
          type: 'button',
          onPress: () => openFeedback(),
        },
        ...(isAdminUser
          ? [{
            id: 'admin_diagnostics',
            title: tr('settings.item.adminDiagnostics.title', 'Painel Admin'),
            subtitle: tr('settings.item.adminDiagnostics.subtitle', 'Diagnóstico de status e notificações'),
            icon: 'analytics',
            type: 'button' as const,
            onPress: () => navigation.navigate('AdminDiagnostics' as never),
          }]
          : []),
      ],
    },
    {
      id: 'account',
      title: t('settings.section.account'),
      items: [
        {
          id: 'sign_out',
          title: t('settings.item.signOut.title'),
          subtitle: t('settings.item.signOut.subtitle'),
          icon: 'log-out',
          type: 'danger',
          onPress: () => handleSignOut(),
        },
      ],
    },
  ]), [navigation, t, isAdminUser]);

  const [settingsSections, setSettingsSections] = useState<SettingsSection[]>(() => buildSettingsSections());

  useEffect(() => {
    loadSettings();
    loadProfile();
    refreshNotificationPermission();
  }, []);

  useEffect(() => {
    setSettingsSections(buildSettingsSections());
  }, [buildSettingsSections, language]);

  useEffect(() => {
    if (!user?.uid) return;
    loadPushStatus();
  }, [user?.uid, notificationPermission]);

  useEffect(() => {
    if (userSettings?.houseSystem) {
      setHouseSystem(normalizeHouseSystem(userSettings.houseSystem));
    }
  }, [userSettings?.houseSystem]);

  useEffect(() => {
    if (Platform.OS === 'web') return;
    if (notificationPermission !== 'granted') {
      refreshNotificationPermission();
    }
  }, [notificationPermission]);

  // (Removido) Overrides de ASC - agora calculo e sempre automatico

  const loadSettings = async () => {
    // Configuracoes de sistema de casas ja sao carregadas via useUserSettings hook.
    // loadProfile() carrega dados do Firestore incluindo preferences no mesmo useEffect.
    // Esta funcao existe para futura expansao de configuracoes locais.
  };

  const refreshNotificationPermission = async () => {
    if (Platform.OS === 'web') return;
    try {
      const { status } = await Notifications.getPermissionsAsync();
      setNotificationPermission(status);
    } catch (error) {
      console.warn('Não foi possível verificar permissão de notificações', error);
      setNotificationPermission('unknown');
    }
  };

  const loadPushStatus = async () => {
    if (!user?.uid) return;
    setPushStatusLoading(true);
    let hasFcmToken = false;
    let hasWebPush = false;
    let permission: PushPermission = 'unknown';
    let webSupported = false;
    let serviceWorkerState: 'unknown' | 'installing' | 'installed' | 'activating' | 'activated' | 'redundant' = 'unknown';
    let pushManagerSupported = false;
    let subscriptionActive = false;
    let subscriptionEndpoint = '';
    let subscriptionExpiration = '';
    try {
      if (Platform.OS === 'web') {
        const webNotification = (globalThis as any).Notification;
        webSupported = !!webNotification;
        if (!webNotification) {
          permission = 'unsupported';
        } else {
          permission = webNotification.permission as PushPermission;
        }
        if ('serviceWorker' in navigator) {
          try {
            const registration = await navigator.serviceWorker.getRegistration();
            const active = registration?.active;
            const installing = registration?.installing;
            const waiting = registration?.waiting;
            serviceWorkerState =
              (active?.state as any) ||
              (installing?.state as any) ||
              (waiting?.state as any) ||
              'unknown';
            pushManagerSupported = !!registration?.pushManager;
            if (registration?.pushManager) {
              const sub = await registration.pushManager.getSubscription();
              hasWebPush = !!sub;
              subscriptionActive = !!sub;
              if (sub?.endpoint) {
                try {
                  const url = new URL(sub.endpoint);
                  subscriptionEndpoint = url.origin;
                } catch {
                  subscriptionEndpoint = sub.endpoint.slice(0, 42);
                }
              }
              if (sub?.expirationTime) {
                subscriptionExpiration = new Date(sub.expirationTime).toISOString();
              }
            }
          } catch (error) {
            console.warn('Falha ao ler subscription local de web push', error);
          }
        }
      } else {
        permission = (notificationPermission === 'undetermined' ? 'default' : notificationPermission) as PushPermission;
      }
      try {
        const userSnap = await getDoc(doc(db, 'users', user.uid));
        const userData = userSnap.exists() ? userSnap.data() : null;
        const expoToken = userData?.notificationTokens?.expo;
        if (typeof expoToken === 'string') {
          hasFcmToken = expoToken.length > 0;
        } else if (Array.isArray(expoToken)) {
          hasFcmToken = expoToken.some((entry) => !!entry?.token);
        }
      } catch (error) {
        console.warn('Não foi possível carregar tokens expo', error);
      }
      try {
        if (!hasFcmToken) {
          const fcmSnap = await getDocs(
            query(collection(db, 'users', user.uid, 'fcmTokens'), limit(1))
          );
          hasFcmToken = fcmSnap.size > 0;
        }
      } catch (error) {
        console.warn('Não foi possível carregar tokens mobile', error);
      }
      try {
        const webPushSnap = await getDocs(
          query(collection(db, 'users', user.uid, 'webPushSubscriptions'), limit(1))
        );
        hasWebPush = hasWebPush || webPushSnap.size > 0;
      } catch (error) {
        console.warn('Não foi possível carregar subscriptions web push', error);
      }
      setPushStatus({
        hasWebPush,
        hasFcmToken,
        permission,
      });
      if (Platform.OS === 'web') {
        setWebPushDiagnostics({
          supported: webSupported,
          permission,
          serviceWorkerState,
          pushManagerSupported,
          subscriptionActive,
          subscriptionEndpoint,
          subscriptionExpiration,
        });
      }
    } finally {
      setPushStatusLoading(false);
    }
  };

  const handleNotificationPermissionPress = async () => {
    if (Platform.OS === 'web') return;
    try {
      const { status } = await Notifications.getPermissionsAsync();
      if (status === 'granted') {
        setNotificationPermission(status);
        if (user?.uid) {
          await registerDeviceToken(user.uid);
          loadPushStatus();
        }
        return;
      }

      if (status === 'denied') {
        Alert.alert(
          tr('settings.alert.notificationsBlocked.title', 'Ativar notificações'),
          tr('settings.alert.notificationsBlocked.body', 'As notificações estão bloqueadas. Abra os ajustes do sistema para permitir.'),
          [
            { text: tr('common.cancel', 'Cancelar'), style: 'cancel' },
            { text: tr('settings.alert.openSettings', 'Abrir ajustes'), onPress: () => Linking.openSettings() },
          ]
        );
        return;
      }

      const request = await Notifications.requestPermissionsAsync();
      setNotificationPermission(request.status);
      if (request.status !== 'granted') {
        Alert.alert(
          tr('settings.alert.permissionDenied.title', 'Permissão não concedida'),
          tr('settings.alert.permissionDenied.body', 'Se quiser ativar depois, use os ajustes do sistema.'),
          [
            { text: tr('common.ok', 'OK'), style: 'default' },
            { text: tr('settings.alert.openSettings', 'Abrir ajustes'), onPress: () => Linking.openSettings() },
          ]
        );
      } else if (user?.uid) {
        await registerDeviceToken(user.uid);
        loadPushStatus();
      }
    } catch (error) {
      console.error('Erro ao solicitar permissão de notificações', error);
      Alert.alert(tr('common.error', 'Erro'), tr('settings.alert.notificationPermissionFailed', 'Não foi possível solicitar permissão de notificações.'));
    }
  };

  function isNotificationsActive() {
    if (Platform.OS === 'web') {
      const webNotification = (globalThis as any).Notification;
      if (!webNotification) return false;
      return webNotification.permission === 'granted';
    }
    return notificationPermission === 'granted';
  }

  function bounceWebPushButton() {
    webPushScale.setValue(1);
    Animated.sequence([
      Animated.timing(webPushScale, { toValue: 1.06, duration: 120, useNativeDriver: true }),
      Animated.timing(webPushScale, { toValue: 0.98, duration: 120, useNativeDriver: true }),
      Animated.timing(webPushScale, { toValue: 1, duration: 120, useNativeDriver: true }),
    ]).start();
  }

  async function handleWebPushPress() {
    if (!isNotificationsActive()) {
      bounceWebPushButton();
    }
    if (!user?.uid) return Alert.alert(tr('common.error', 'Erro'), tr('settings.alert.loginToRegister', 'Faça login para registrar'));
    try {
      if (Platform.OS === 'web') {
        const webNotification = (globalThis as any).Notification;
        if (!webNotification) {
          window.alert(tr('settings.alert.webPushUnsupported', 'Notificações não suportadas neste navegador.'));
          return;
        }
        if (webNotification.permission !== 'granted') {
          const permission = await webNotification.requestPermission();
          if (permission !== 'granted') {
            window.alert(tr('settings.alert.webPushPermissionDenied', 'Permissão de notificação não concedida.'));
            loadPushStatus();
            return;
          }
        }
        await subscribeWebPush(user.uid);
        window.alert(tr('settings.alert.webPushRegistered', 'Web Push registrado!'));
      } else {
        const result = await registerDeviceToken(user.uid);
        if (result?.error) {
          Alert.alert(tr('common.error', 'Erro'), result.error);
        } else {
          Alert.alert(tr('common.success', 'Sucesso'), tr('settings.alert.mobileNotificationsEnabled', 'Notificações do celular ativadas!'));
        }
      }
      loadPushStatus();
      refreshNotificationPermission();
    } catch (e: any) {
      const message = e?.message || tr('settings.alert.webPushRegisterFailed', 'Falha ao registrar notificação');
      if (Platform.OS === 'web') {
        window.alert(message);
      } else {
        Alert.alert(tr('common.error', 'Erro'), message);
      }
    }
  }

  const houseSystemDescriptions: Record<string, string> = {
    placidus: t('settings.houses.desc.placidus'),
    'whole-sign': t('settings.houses.desc.wholeSign'),
    'psychological-shift': t('settings.houses.desc.psychologicalShift'),
    equal: t('settings.houses.desc.equal'),
    porphyry: t('settings.houses.desc.porphyry'),
    regiomontanus: t('settings.houses.desc.regiomontanus'),
    koch: t('settings.houses.desc.koch'),
    campanus: t('settings.houses.desc.campanus'),
    topocentric: t('settings.houses.desc.topocentric'),
  };

  const forceBackendStatusRefresh = async (uid: string, reason: string) => {
    if (!BACKEND_URL) return;
    try {
      await backendFetch('/api/status-refresh', {
        method: 'POST',
        auth: true,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: uid, force: true, reason }),
      });
    } catch (error) {
      console.warn('Falha ao forcar refresh de status no backend:', error);
    }
  };

  const loadProfile = async () => {
    if (!user?.uid) return;
    try {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists()) return;
      const data = userDoc.data() || {};
      const adminFlag = data?.isAdmin === true || data?.role === 'admin' || data?.roles?.admin === true;
      setIsAdminUser(adminFlag);
      setProfileName(data.displayName || data.fullName || user.email?.split("@")[0] || "");
      setBirthDate(data.birthDate || "");
      setBirthTime(data.birthTime || "");
      setWhatsappPhone(data.whatsappPhone || "");
      setBirthLocation(data.birthLocation || null);
      if (data.birthLocation?.city) {
        const display = data.birthLocation.state
          ? `${data.birthLocation.city}, ${data.birthLocation.state}`
          : `${data.birthLocation.city}, ${data.birthLocation.country || ""}`.trim();
        setLocationQuery(display);
      }
      setProfilePhoto(data.profilePhoto || null);
      setProfilePhotoDirty(false);
    } catch (error) {
      console.warn("Erro ao carregar perfil:", error);
    }
  };

  const uploadProfilePhoto = async (userId: string, dataUrl: string): Promise<string | null> => {
    try {
      const response = await backendFetch('/api/upload/profile-photo', {
        method: "POST",
        auth: true,
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
      Alert.alert(tr('settings.alert.permissionRequired', 'Permissão necessária'), tr('settings.alert.galleryPermission', 'Precisamos de acesso à galeria para selecionar sua foto.'));
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
          Alert.alert(tr('settings.alert.permissionRequired', 'Permissão necessária'), tr('settings.alert.cameraPermission', 'Precisamos de acesso à câmera.'));
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
        setProfilePhotoDirty(true);
      }
    } catch (error) {
      console.error("Erro ao selecionar foto:", error);
      Alert.alert(tr('common.error', 'Erro'), tr('settings.alert.selectPhotoFailed', 'Não foi possível selecionar a foto. Tente novamente.'));
    }
  };

  const selectPhoto = async () => {
    if (Platform.OS === 'web') {
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
        setProfilePhotoDirty(true);
      };
      input.click();
      return;
    }

    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    Alert.alert(tr('settings.alert.choosePhoto.title', 'Escolher foto'), tr('settings.alert.choosePhoto.body', 'Como você gostaria de adicionar sua foto?'), [
      { text: tr('common.cancel', 'Cancelar'), style: "cancel" },
      { text: tr('settings.alert.choosePhoto.gallery', 'Galeria'), onPress: () => pickImage("gallery") },
      { text: tr('settings.alert.choosePhoto.camera', 'Câmera'), onPress: () => pickImage("camera") },
    ]);
  };

  const saveProfile = async () => {
    if (!user?.uid) return;
    try {
      setSavingProfile(true);
      const normalizedBirthDate = normalizeBirthDateToIso(birthDate);
      if (birthDate && !normalizedBirthDate) {
        Alert.alert(
          tr('settings.alert.invalidBirthDate.title', 'Data inválida'),
          getInvalidBirthDateMessage()
        );
        return;
      }
      if (birthTime && !isValidBirthTime(birthTime)) {
        Alert.alert(tr('settings.alert.invalidBirthTime.title', 'Horário inválido'), tr('settings.alert.invalidBirthTime.body', 'Use o formato HH:MM.'));
        return;
      }
      if (isEditingProfile && locationQuery && !selectedLocation && !birthLocation) {
        Alert.alert(tr('settings.alert.birthLocation.title', 'Local de nascimento'), tr('settings.alert.birthLocation.body', 'Selecione uma cidade da lista.'));
        return;
      }
      let updatedPhoto = profilePhoto;
      if (updatedPhoto && updatedPhoto.startsWith("data:")) {
        const uploaded = await uploadProfilePhoto(user.uid, updatedPhoto);
        updatedPhoto = uploaded || updatedPhoto;
      }

      const payload: Record<string, any> = {
        displayName: profileName || user.email?.split("@")[0] || t('settings.profile.defaultUser'),
        profilePhoto: updatedPhoto || null,
      };
      if (whatsappPhone) {
        payload.whatsappPhone = whatsappPhone;
      }
      if (normalizedBirthDate) {
        payload.birthDate = normalizedBirthDate;
      }
      if (birthTime) {
        payload.birthTime = birthTime;
      }
      if (birthLocation) {
        payload.birthLocation = birthLocation;
      }
      if (normalizedBirthDate && birthTime && birthLocation?.latitude && birthLocation?.longitude) {
        payload.birthDataComplete = true;
        payload.lastBirthDataEdit = serverTimestamp();
      }

      await updateDoc(doc(db, "users", user.uid), payload);
      await setDoc(
        doc(db, "userPublicProfiles", user.uid),
        {
          ...payload,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
      await forceBackendStatusRefresh(user.uid, 'settings_profile_save');
      setIsEditingProfile(false);
      setProfileSnapshot(null);
      setShowLocationSuggestions(false);
      setProfilePhotoDirty(false);
      Alert.alert(tr('common.success', 'Sucesso'), tr('settings.alert.profileUpdated', 'Perfil atualizado!'));
    } catch (error) {
      console.error("Erro ao salvar perfil:", error);
      Alert.alert(tr('common.error', 'Erro'), tr('settings.alert.profileSaveFailed', 'Não foi possível salvar seu perfil agora.'));
    } finally {
      setSavingProfile(false);
    }
  };

  const isValidBirthDate = (value: string) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const [year, month, day] = value.split("-").map((part) => parseInt(part, 10));
    const date = new Date(Date.UTC(year, month - 1, day));
    return (
      date.getUTCFullYear() === year &&
      date.getUTCMonth() + 1 === month &&
      date.getUTCDate() === day
    );
  };

  const isValidBirthTime = (value: string) => {
    return /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
  };

  const formatBirthLocation = (location: typeof birthLocation) => {
    if (!location?.city) return "Não informado";
    if (location.state) return `${location.city}, ${location.state}`;
    if (location.country) return `${location.city}, ${location.country}`;
    return location.city;
  };

  const getDateOrderForDisplay = (): 'DMY' | 'MDY' => {
    const countryRaw = String(birthLocation?.country || '').trim().toLowerCase();
    const isUSCountry =
      countryRaw === 'us' ||
      countryRaw === 'usa' ||
      countryRaw.includes('united states') ||
      countryRaw.includes('estados unidos');
    if (isUSCountry) return 'MDY';
    if (language === 'en-US' && !countryRaw) return 'MDY';
    return 'DMY';
  };

  const getDayTokenForDisplay = () => (language === 'it-IT' ? 'GG' : 'DD');
  const getYearTokenForDisplay = () => (language === 'en-US' ? 'YYYY' : 'AAAA');

  const getBirthDateMaskForDisplay = () => {
    const order = getDateOrderForDisplay();
    const dayToken = getDayTokenForDisplay();
    const yearToken = getYearTokenForDisplay();
    return order === 'MDY' ? `MM/${dayToken}/${yearToken}` : `${dayToken}/MM/${yearToken}`;
  };

  const getInvalidBirthDateMessage = () => {
    const mask = getBirthDateMaskForDisplay();
    if (language === 'en-US') return `Use format ${mask}.`;
    if (language === 'es-ES') return `Usa el formato ${mask}.`;
    if (language === 'it-IT') return `Usa il formato ${mask}.`;
    return `Use o formato ${mask}.`;
  };

  const getBirthDateFormatHint = () => {
    const mask = getBirthDateMaskForDisplay();
    if (language === 'en-US') return `Use date format ${mask} and time HH:MM.`;
    if (language === 'es-ES') return `Usa fecha ${mask} y hora HH:MM.`;
    if (language === 'it-IT') return `Usa data ${mask} e ora HH:MM.`;
    return `Use data no formato ${mask} e horário HH:MM.`;
  };

  const normalizeBirthDateToIso = (value: string) => {
    const raw = String(value || '').trim();
    if (!raw) return '';
    if (isValidBirthDate(raw)) return raw;
    const digits = raw.replace(/\D/g, '');
    if (digits.length !== 8) return null;
    const order = getDateOrderForDisplay();
    const first = parseInt(digits.slice(0, 2), 10);
    const second = parseInt(digits.slice(2, 4), 10);
    const day = order === 'MDY' ? second : first;
    const month = order === 'MDY' ? first : second;
    const year = parseInt(digits.slice(4, 8), 10);
    if (Number.isNaN(day) || Number.isNaN(month) || Number.isNaN(year)) return null;
    if (year < 1900 || month < 1 || month > 12 || day < 1 || day > 31) return null;
    const check = new Date(Date.UTC(year, month - 1, day));
    if (check.getUTCFullYear() !== year || check.getUTCMonth() + 1 !== month || check.getUTCDate() !== day) return null;
    return `${year.toString().padStart(4, '0')}-${month.toString().padStart(2, '0')}-${day
      .toString()
      .padStart(2, '0')}`;
  };

  const formatBirthDateForDisplay = (value: string) => {
    if (!value) return t('settings.profile.notInformed');
    const isoMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
    if (!isoMatch) return value;
    const [, year, month, day] = isoMatch;
    return getDateOrderForDisplay() === 'MDY'
      ? `${month}/${day}/${year}`
      : `${day}/${month}/${year}`;
  };

  const handleEditProfile = async () => {
    if (isEditingProfile) {
      if (profileSnapshot) {
        setProfileName(profileSnapshot.name);
        setBirthDate(profileSnapshot.birthDate);
        setBirthTime(profileSnapshot.birthTime);
        setBirthLocation(profileSnapshot.birthLocation);
        setLocationQuery(profileSnapshot.locationQuery);
        setProfilePhoto(profileSnapshot.photo);
        setSelectedLocation(null);
      }
      setProfilePhotoDirty(false);
      setIsEditingProfile(false);
      return;
    }

    setProfileSnapshot({
      name: profileName,
      birthDate,
      birthTime,
      whatsappPhone,
      birthLocation,
      locationQuery,
      photo: profilePhoto,
    });
    setIsEditingProfile(true);

    if (locationSuggestions.length === 0) {
      const suggestions = await LocationService.searchLocations('');
      setLocationSuggestions(suggestions);
    }
  };

  const handleLocationQueryChange = async (text: string) => {
    setLocationQuery(text);
    setSelectedLocation(null);
    setSearchingLocation(true);
    try {
      const suggestions = await LocationService.searchLocations(text);
      setLocationSuggestions(suggestions);
      setShowLocationSuggestions(true);
    } catch (error) {
      console.warn("Erro ao buscar local:", error);
    } finally {
      setSearchingLocation(false);
    }
  };

  const handleLocationSelect = (location: LocationSuggestion) => {
    setSelectedLocation(location);
    setBirthLocation({
      city: location.city,
      state: location.state,
      country: location.country,
      latitude: location.latitude,
      longitude: location.longitude,
      displayName: location.displayName,
    });
    setLocationQuery(location.displayName);
    setShowLocationSuggestions(false);
  };

  // Reprocessar Casas Natais removido desta tela conforme solicitado

  const handleHouseSystemChange = async (system: HouseSystem) => {
    const normalized = normalizeHouseSystem(system);
    setHouseSystem(normalized);
    await updateSettings({ houseSystem: normalized });
    if (user?.uid) {
      try { await UserService.setHouseSystem(user.uid, normalized); } catch { }
      await forceBackendStatusRefresh(user.uid, 'settings_house_system_change');
    }
  };

  const checkSubscriptionStatus = async () => {
    try {
      setIsLoading(true);

      if (!user?.uid) {
        Alert.alert(tr('common.error', 'Erro'), tr('settings.alert.userNotIdentified', 'Usuário não identificado.'));
        return;
      }

      const status = await MercadoPagoService.getSubscriptionStatus(user.uid);

      if (status.isActive) {
        const plan = MercadoPagoService.getPlanById(status.planId || '');
        const planName = plan?.name || 'Premium';
        const expiresAt = status.expiresAt ?
          new Date(status.expiresAt).toLocaleDateString('pt-BR') : 'N/A';

        Alert.alert(
          tr('settings.alert.subscriptionActive.title', 'Assinatura Ativa'),
          tr('settings.alert.subscriptionActive.body', 'Plano: {plan}\nExpira em: {expiresAt}\n\nDeseja gerenciar sua assinatura?', { plan: planName, expiresAt }),
          [
            { text: tr('common.cancel', 'Cancelar'), style: 'cancel' },
            { text: tr('settings.alert.subscriptionActive.manage', 'Gerenciar'), onPress: () => openSubscriptionManagement() }
          ]
        );
      } else if (MercadoPagoService.isInTrial(status)) {
        const daysRemaining = MercadoPagoService.getTrialDaysRemaining(status);
        Alert.alert(
          tr('settings.alert.trial.title', 'Período de teste'),
          tr('settings.alert.trial.body', 'Você está no período de teste gratuito!\nDias restantes: {days}\n\nDeseja assinar um plano?', { days: daysRemaining }),
          [
            { text: tr('common.cancel', 'Cancelar'), style: 'cancel' },
            { text: tr('settings.alert.seePlans', 'Ver Planos'), onPress: () => openSubscriptionPlans() }
          ]
        );
      } else {
        Alert.alert(
          tr('settings.alert.premium.title', 'Assinatura Premium'),
          tr('settings.alert.premium.body', 'Desbloqueie recursos exclusivos como IA conversacional, matching de casais e análises avançadas!'),
          [
            { text: tr('common.cancel', 'Cancelar'), style: 'cancel' },
            { text: tr('settings.alert.seePlans', 'Ver Planos'), onPress: () => openSubscriptionPlans() }
          ]
        );
      }
    } catch (error) {
      console.error('Erro ao verificar assinatura:', error);
      Alert.alert(tr('common.error', 'Erro'), tr('settings.alert.subscriptionStatusFailed', 'Não foi possível verificar o status da assinatura.'));
    } finally {
      setIsLoading(false);
    }
  };

  const openSubscriptionPlans = () => {
    (navigation as any).navigate('Premium', { openTab: 'features' });
  };

  const openSubscriptionManagement = () => {
    (navigation as any).navigate('Premium', { openTab: 'features' });
  };

  const openBillingInfo = () => {
    (navigation as any).navigate('Premium', { openTab: 'features' });
  };

  // Funcoes removidas pois agora usam os hooks

  const deleteAccount = () => {
    Alert.alert(
      tr('settings.alert.deleteAccount.title', 'Excluir Conta'),
      tr('settings.alert.deleteAccount.body', 'Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita e todos os seus dados serão perdidos permanentemente.'),
      [
        { text: tr('common.cancel', 'Cancelar'), style: 'cancel' },
        {
          text: tr('settings.alert.deleteAccount.confirm', 'Excluir'), style: 'destructive', onPress: async () => {
            try {
              setIsLoading(true);
              await deleteUserAccount();
              Alert.alert(tr('settings.alert.deleteAccount.deletedTitle', 'Conta excluída'), tr('settings.alert.deleteAccount.deletedBody', 'Sua conta foi excluída com sucesso.'));
            } catch (error) {
              console.error('Erro ao excluir conta:', error);
              Alert.alert(tr('common.error', 'Erro'), tr('settings.alert.deleteAccount.failed', 'Não foi possível excluir a conta. Tente novamente.'));
            } finally {
              setIsLoading(false);
            }
          }
        }
      ]
    );
  };

  const handleSignOut = () => {
    if (Platform.OS === 'web') {
      try {
        // window.confirm retorna true/false no Web
        // eslint-disable-next-line no-restricted-globals
        const ok = typeof window !== 'undefined' ? window.confirm(tr('settings.alert.signOut.confirmBody', 'Tem certeza que deseja sair?')) : true
        if (!ok) return
        setIsLoading(true)
        logout()
          .catch((error) => console.error('Erro no logout (web):', error))
          .finally(() => setIsLoading(false))
      } catch (error) {
        console.error('Erro no fluxo de logout (web):', error)
      }
      return
    }

    Alert.alert(
      tr('settings.alert.signOut.title', 'Sair da Conta'),
      tr('settings.alert.signOut.confirmBody', 'Tem certeza que deseja sair?'),
      [
        { text: tr('common.cancel', 'Cancelar'), style: 'cancel' },
        {
          text: tr('settings.alert.signOut.confirm', 'Sair'), style: 'destructive', onPress: async () => {
            try {
              setIsLoading(true);
              await logout();
              Alert.alert(tr('common.success', 'Sucesso'), tr('settings.alert.signOut.success', 'Logout realizado com sucesso!'));
            } catch (error) {
              console.error('Erro no logout:', error);
              Alert.alert(tr('common.error', 'Erro'), tr('settings.alert.signOut.failed', 'Não foi possível fazer logout. Tente novamente.'));
            } finally {
              setIsLoading(false);
            }
          }
        }
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
    Alert.alert(tr('settings.alert.support.title', 'Suporte'), tr('settings.alert.support.body', 'Escolha como falar com a equipe:'), [
      { text: tr('common.cancel', 'Cancelar'), style: 'cancel' },
      { text: tr('settings.alert.support.whatsapp', 'WhatsApp'), onPress: () => Linking.openURL('https://w.app/tabulaestelar') },
      { text: tr('settings.alert.support.email', 'Email'), onPress: () => Linking.openURL('mailto:contato@tabulaestelar.com.br') },
    ]);
  };

  const openFeedback = () => {
    Linking.openURL('https://w.app/tabulaestelar_sugestao');
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

    // Executar acao especifica
    const item = settingsSections.flatMap(s => s.items).find(i => i.id === itemId);
    if (item?.onToggle) {
      item.onToggle(value);
    }
  };

  const renderSettingsItem = (item: SettingsItem) => {
    const isDanger = item.type === 'danger';
    const isLink = item.type === 'link';
    const isWebPush = item.id === 'register_webpush';
    const isPushRegistered = Platform.OS === 'web' ? pushStatus.hasWebPush : pushStatus.hasFcmToken;
    const notificationStatusLabel = isPushRegistered ? t('settings.push.statusRegistered') : t('settings.push.statusClickToRegister');
    const displayTitle = isWebPush
      ? (isPushRegistered ? t('settings.push.mobileTitle') : t('settings.push.registerMobileTitle'))
      : item.title;
    const displaySubtitle = isWebPush
      ? (isPushRegistered ? t('settings.push.statusRegistered') : t('settings.item.registerWebpush.subtitle'))
      : item.subtitle;

    const content = (
      <TouchableOpacity
        style={[
          styles.settingsItem,
          isDanger && styles.dangerItem,
          isLink && styles.linkItem
        ]}
        onPress={isWebPush ? (isPushRegistered ? loadPushStatus : handleWebPushPress) : item.onPress}
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
              {displayTitle}
            </Text>
            {displaySubtitle && (
              <Text style={[styles.itemSubtitle, isDanger && styles.dangerSubtitle]}>
                {displaySubtitle}
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

    if (!isWebPush) {
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
    }

    return (
      <Animated.View key={item.id} style={{ transform: [{ scale: webPushScale }] }}>
        {content}
        <View style={styles.pushStatusCard}>
          <View style={styles.pushStatusHeader}>
            <Text style={styles.pushStatusTitle}>{t('settings.push.statusTitle')}</Text>
            <TouchableOpacity style={styles.pushStatusRefresh} onPress={loadPushStatus}>
              <Ionicons name="refresh" size={14} color="#FFD700" />
              <Text style={styles.pushStatusRefreshText}>{t('settings.push.refresh')}</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.pushStatusRow}
            onPress={isPushRegistered ? undefined : handleWebPushPress}
            disabled={isPushRegistered}
          >
            <View style={[styles.pushStatusDot, isPushRegistered ? styles.pushStatusOk : styles.pushStatusWarn]} />
            <Text style={styles.pushStatusLabel}>{t('settings.push.mobileLabel')}</Text>
            <Text style={[styles.pushStatusValue, !isPushRegistered && styles.pushStatusCta]}>
              {notificationStatusLabel}
            </Text>
          </TouchableOpacity>
          {Platform.OS === 'web' && (
            <View style={styles.pushDiagnostics}>
              <Text style={styles.pushDiagnosticsTitle}>{t('settings.push.diagnosticsTitle')}</Text>
              <View style={styles.pushDiagnosticsRow}>
                <Text style={styles.pushDiagnosticsLabel}>{t('settings.push.permissionLabel')}</Text>
                <Text style={styles.pushDiagnosticsValue}>{webPushDiagnostics.permission}</Text>
              </View>
              <View style={styles.pushDiagnosticsRow}>
                <Text style={styles.pushDiagnosticsLabel}>{t('settings.push.serviceWorkerLabel')}</Text>
                <Text style={styles.pushDiagnosticsValue}>{webPushDiagnostics.serviceWorkerState}</Text>
              </View>
              <View style={styles.pushDiagnosticsRow}>
                <Text style={styles.pushDiagnosticsLabel}>{t('settings.push.pushManagerLabel')}</Text>
                <Text style={styles.pushDiagnosticsValue}>
                  {webPushDiagnostics.pushManagerSupported ? t('settings.push.supported') : t('settings.push.unsupported')}
                </Text>
              </View>
              <View style={styles.pushDiagnosticsRow}>
                <Text style={styles.pushDiagnosticsLabel}>{t('settings.push.subscriptionLabel')}</Text>
                <Text style={styles.pushDiagnosticsValue}>
                  {webPushDiagnostics.subscriptionActive ? t('settings.push.active') : t('settings.push.inactive')}
                </Text>
              </View>
              {webPushDiagnostics.subscriptionEndpoint ? (
                <View style={styles.pushDiagnosticsRow}>
                  <Text style={styles.pushDiagnosticsLabel}>{t('settings.push.endpointLabel')}</Text>
                  <Text style={styles.pushDiagnosticsValue}>{webPushDiagnostics.subscriptionEndpoint}</Text>
                </View>
              ) : null}
              {webPushDiagnostics.subscriptionExpiration ? (
                <View style={styles.pushDiagnosticsRow}>
                  <Text style={styles.pushDiagnosticsLabel}>{t('settings.push.expiresLabel')}</Text>
                  <Text style={styles.pushDiagnosticsValue}>{webPushDiagnostics.subscriptionExpiration}</Text>
                </View>
              ) : null}
            </View>
          )}
          {pushStatusLoading && (
            <Text style={styles.pushStatusLoading}>{t('settings.push.updating')}</Text>
          )}
        </View>
      </Animated.View>
    );
  };

  const notificationSection = settingsSections.find((section) => section.id === 'notifications');
  const otherSections = settingsSections.filter((section) => section.id !== 'notifications');

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
            <Text style={styles.title}>{t('nav.settings')}</Text>
            <Text style={styles.subtitle}>
              {t('settings.header.subtitle')}
            </Text>
          </View>

          {/* Perfil (edicao rapida) */}
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
              {isEditingProfile ? (
                <>
                  <TextInput
                    style={styles.nameInput}
                    placeholder={t('settings.profile.namePlaceholder')}
                    placeholderTextColor="#888"
                    value={profileName}
                    onChangeText={setProfileName}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder={getBirthDateMaskForDisplay()}
                    placeholderTextColor="#888"
                    value={birthDate}
                    onChangeText={setBirthDate}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder={t('settings.profile.birthTimePlaceholder')}
                    placeholderTextColor="#888"
                    value={birthTime}
                    onChangeText={setBirthTime}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder={t('settings.profile.whatsappPlaceholder')}
                    placeholderTextColor="#888"
                    value={whatsappPhone}
                    onChangeText={setWhatsappPhone}
                    keyboardType="phone-pad"
                  />
                  <TextInput
                    style={styles.input}
                    placeholder={t('settings.profile.birthLocationPlaceholder')}
                    placeholderTextColor="#888"
                    value={locationQuery}
                    onChangeText={handleLocationQueryChange}
                    onFocus={() => setShowLocationSuggestions(true)}
                  />
                  <Text style={styles.helperText}>{getBirthDateFormatHint()}</Text>
                  {showLocationSuggestions && locationSuggestions.length > 0 && (
                    <View style={styles.suggestionsContainer}>
                      {locationSuggestions.map((item, idx) => (
                        <TouchableOpacity
                          key={`${item.latitude}-${item.longitude}-${idx}`}
                          style={styles.suggestionItem}
                          onPress={() => handleLocationSelect(item)}
                        >
                          <Text style={styles.suggestionText}>{item.displayName}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </>
              ) : (
                <>
                  <Text style={styles.userName}>{profileName || t('settings.profile.defaultUser')}</Text>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>{t('settings.profile.labelDate')}</Text>
                    <Text style={styles.infoValue}>{formatBirthDateForDisplay(birthDate)}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>{t('settings.profile.labelTime')}</Text>
                    <Text style={styles.infoValue}>{birthTime || t('settings.profile.notInformed')}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>{t('settings.profile.labelWhatsapp')}</Text>
                    <Text style={styles.infoValue}>{whatsappPhone || t('settings.profile.notInformed')}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>{t('settings.profile.labelLocation')}</Text>
                    <Text style={styles.infoValue}>{formatBirthLocation(birthLocation)}</Text>
                  </View>
                </>
              )}

              <Text style={styles.userEmail}>
                {user?.email || t('settings.profile.defaultEmail')}
              </Text>
              <View style={styles.profileActions}>
                <TouchableOpacity
                  style={styles.editProfileButton}
                  onPress={handleEditProfile}
                  disabled={savingProfile}
                >
                  <Ionicons
                    name={isEditingProfile ? "close" : "pencil"}
                    size={14}
                    color="#0a0e27"
                  />
                  <Text style={styles.editProfileText}>
                    {isEditingProfile ? t('common.cancel') : t('settings.profile.edit')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.saveProfileButton,
                    !(isEditingProfile || profilePhotoDirty) && styles.saveProfileButtonDisabled,
                  ]}
                  onPress={saveProfile}
                  disabled={savingProfile || !(isEditingProfile || profilePhotoDirty)}
                >
                  <Ionicons name="checkmark" size={14} color="#0a0e27" />
                  <Text style={styles.saveProfileText}>
                    {savingProfile ? t('common.saving') : t('settings.profile.save')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('settings.language.title')}</Text>
            <View style={styles.languagePills}>
              {languages.map((item) => {
                const active = item.code === language
                return (
                  <TouchableOpacity
                    key={item.code}
                    style={[styles.languagePill, active && styles.languagePillActive]}
                    onPress={async () => {
                      await setLanguage(item.code)
                      Alert.alert(tr('common.ok', 'OK'), t('settings.language.changed', { language: item.nativeLabel }))
                    }}
                  >
                    <Text style={[styles.languagePillText, active && styles.languagePillTextActive]}>
                      {item.nativeLabel}
                    </Text>
                  </TouchableOpacity>
                )
              })}
            </View>
          </View>

          {notificationSection && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{notificationSection.title}</Text>
              <View style={styles.sectionContent}>
                {notificationSection.items.map(renderSettingsItem)}
              </View>
            </View>
          )}

          {/* Sistema de Casas */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('settings.houses.title')}</Text>
            <Text style={styles.sectionNote}>
              {t('settings.houses.subtitle')}
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
                        <Text style={styles.itemTitle}>{formatHouseSystemLabel(system, language)}</Text>
                        <Text style={styles.itemSubtitle}>
                          {houseSystemDescriptions[system] || t('settings.houses.applyFallback')}
                        </Text>
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
          {/* Settings Sections */}
          {otherSections.map((section, sectionIndex) => (
            <View key={sectionIndex} style={styles.section}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <View style={styles.sectionContent}>
                {section.items.map(renderSettingsItem)}
              </View>
            </View>
          ))}

          {/* Secao de Casas removida */}

          {/* App Info */}
          <View style={styles.appInfo}>
            <Text style={styles.appInfoText}>
              {tr('settings.appInfo.version', 'Tabula Estelar v1.0.0')}
            </Text>
            <Text style={styles.appInfoSubtext}>
              {tr('settings.appInfo.tagline', 'Desenvolvido com cuidado para sua jornada astrológica')}
            </Text>
          </View>
        </ScrollView>
      </LinearGradient>

      {/* FAQ Modal */}
      <FAQ visible={showFAQ} onClose={() => setShowFAQ(false)} />
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
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  infoLabel: {
    color: '#b0b0b0',
    fontSize: 12,
    width: 60,
  },
  infoValue: {
    color: '#e0e0e0',
    fontSize: 12,
    flex: 1,
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
  suggestionsContainer: {
    marginTop: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    maxHeight: 160,
  },
  suggestionItem: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  suggestionText: {
    color: '#e0e0e0',
    fontSize: 12,
  },
  profileActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 10,
  },
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFD700',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  editProfileText: {
    color: '#0a0e27',
    fontSize: 12,
    fontWeight: '600',
  },
  saveProfileButton: {
    backgroundColor: '#2C2C2E',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  saveProfileButtonDisabled: {
    opacity: 0.5,
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
  languagePills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  languagePill: {
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.25)',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  languagePillActive: {
    borderColor: '#FFD700',
    backgroundColor: 'rgba(255, 215, 0, 0.16)',
  },
  languagePillText: {
    color: '#E5E7EB',
    fontSize: 12,
    fontWeight: '600',
  },
  languagePillTextActive: {
    color: '#FFD700',
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
  pushStatusCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.18)',
  },
  pushStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  pushStatusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  pushStatusTitle: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: '700',
  },
  pushStatusRefresh: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pushStatusRefreshText: {
    color: '#FFD700',
    fontSize: 11,
    fontWeight: '600',
  },
  pushStatusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  pushStatusOk: {
    backgroundColor: '#4CD964',
  },
  pushStatusWarn: {
    backgroundColor: '#FFD700',
  },
  pushStatusLabel: {
    color: '#b0b0b0',
    fontSize: 12,
    marginRight: 6,
  },
  pushStatusValue: {
    color: '#e0e0e0',
    fontSize: 12,
    fontWeight: '600',
  },
  pushStatusCta: {
    color: '#FFD700',
    textDecorationLine: 'underline',
  },
  pushStatusLoading: {
    marginTop: 4,
    color: '#9aa0b1',
    fontSize: 11,
  },
  pushDiagnostics: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  pushDiagnosticsTitle: {
    color: '#FFD700',
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 6,
  },
  pushDiagnosticsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  pushDiagnosticsLabel: {
    color: '#9aa0b1',
    fontSize: 11,
    width: 110,
  },
  pushDiagnosticsValue: {
    color: '#e0e0e0',
    fontSize: 11,
    flex: 1,
  },
});




