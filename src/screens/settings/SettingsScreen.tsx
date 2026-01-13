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
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import * as Notifications from 'expo-notifications';
import { useAuth } from '../../hooks/useAuth';
import { useUserSettings } from '../../hooks/useUserSettings';
import { MercadoPagoService } from '../../services/payment/MercadoPagoService';
import FAQ from '../../components/FAQ';
import SubscriptionPlansModal from '../../components/SubscriptionPlansModal';
// Removidos itens de preview e comparativos da Configuracao (foram para Home)
import { subscribeWebPush } from '../../webpush/subscribe';
import UserService from '../../services/firebase/UserService';
import type { HouseSystem } from '../../astro/houseSystem';
import { HOUSE_SYSTEMS, normalizeHouseSystem, formatHouseSystemLabel } from '../../astro/houseSystem';
import { collection, doc, getDoc, getDocs, limit, query, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import LocationService, { type LocationSuggestion } from '../../services/LocationService';

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
  const { settings: userSettings, updateSettings } = useUserSettings();
  const [isLoading, setIsLoading] = useState(false);
  const [showFAQ, setShowFAQ] = useState(false);
  const [showSubscriptionPlans, setShowSubscriptionPlans] = useState(false);
  const [houseSystem, setHouseSystem] = useState<HouseSystem>('placidus');
  const [profileName, setProfileName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
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
  const [notificationPermission, setNotificationPermission] = useState<Notifications.PermissionStatus | 'unknown'>('unknown');
  const webPushScale = React.useRef(new Animated.Value(1)).current;
  const [pushStatus, setPushStatus] = useState({
    hasWebPush: false,
    hasFcmToken: false,
    permission: 'unknown' as Notifications.PermissionStatus | 'unknown',
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
    birthLocation: typeof birthLocation;
    locationQuery: string;
    photo: string | null;
  } | null>(null);

  const [settingsSections, setSettingsSections] = useState<SettingsSection[]>([
    {
      title: 'Notificacoes',
      items: [
        {
          id: 'register_webpush',
          title: 'Registrar Web Push',
          subtitle: 'Ativar notificacoes no navegador',
          icon: 'notifications-outline',
          type: 'button',
          onPress: () => handleWebPushPress(),
        },
      ],
    },
    {
      title: 'Assinatura',
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
          title: 'Informacoes de Pagamento',
          subtitle: 'Ver histrico e faturas',
          icon: 'card',
          type: 'button',
          onPress: () => openBillingInfo(),
        },
      ],
    },
    {
      title: 'Aplicativo',
      items: [
        {
          id: 'app_version',
          title: 'Versao do App',
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
          title: 'Politica de Privacidade',
          subtitle: 'Como protegemos seus dados',
          icon: 'shield-checkmark',
          type: 'button',
          onPress: () => openPrivacyPolicy(),
        },
        {
          id: 'support',
          title: 'Suporte',
          subtitle: 'WhatsApp e email de suporte',
          icon: 'help-circle',
          type: 'button',
          onPress: () => openSupport(),
        },
        {
          id: 'feedback',
          title: 'Enviar Feedback',
          subtitle: 'Sugestoes via WhatsApp',
          icon: 'chatbubble-ellipses',
          type: 'button',
          onPress: () => openFeedback(),
        },
      ],
    },
    {
      title: 'Conta',
      items: [
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
    refreshNotificationPermission();
  }, []);

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

    const shouldShowPermissionButton = notificationPermission !== 'granted';
    setSettingsSections(prevSettings =>
      prevSettings.map(section => {
        if (section.title !== 'Notificacoes') return section;

        const items = section.items.filter(item => item.id !== 'mobile_notifications_permission');
        if (shouldShowPermissionButton) {
          items.unshift({
            id: 'mobile_notifications_permission',
            title: 'Ativar notificacoes no celular',
            subtitle: 'Permitir alertas e lembretes do app',
            icon: 'notifications-outline',
            type: 'button',
            onPress: () => handleNotificationPermissionPress(),
          });
        }

        return { ...section, items };
      })
    );
  }, [notificationPermission]);

  // (Removido) Overrides de ASC - agora calculo e sempre automatico

  const loadSettings = async () => {
    try {
      // Carregar configuracoes salvas
      // TODO: Implementar carregamento de configuracoes do backend
    } catch (error) {
      console.error('Erro ao carregar configuracoes:', error);
    }
  };

  const refreshNotificationPermission = async () => {
    if (Platform.OS === 'web') return;
    try {
      const { status } = await Notifications.getPermissionsAsync();
      setNotificationPermission(status);
    } catch (error) {
      console.warn('Nao foi possivel verificar permissao de notificacoes', error);
      setNotificationPermission('unknown');
    }
  };

  const loadPushStatus = async () => {
    if (!user?.uid) return;
    setPushStatusLoading(true);
    try {
      const fcmSnap = await getDocs(
        query(collection(db, 'users', user.uid, 'fcmTokens'), limit(1))
      );
      const webPushSnap = await getDocs(
        query(collection(db, 'users', user.uid, 'webPushSubscriptions'), limit(1))
      );
      let permission: Notifications.PermissionStatus | 'unknown' = 'unknown';
      if (Platform.OS === 'web') {
        const webNotification = (globalThis as any).Notification;
        permission = webNotification ? webNotification.permission : 'unknown';
      } else {
        permission = notificationPermission;
      }
      setPushStatus({
        hasWebPush: webPushSnap.size > 0,
        hasFcmToken: fcmSnap.size > 0,
        permission,
      });
    } catch (error) {
      console.warn('Nao foi possivel verificar status de notificacoes', error);
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
        return;
      }

      if (status === 'denied') {
        Alert.alert(
          'Ativar notificacoes',
          'As notificacoes estao bloqueadas. Abra os ajustes do sistema para permitir.',
          [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Abrir ajustes', onPress: () => Linking.openSettings() },
          ]
        );
        return;
      }

      const request = await Notifications.requestPermissionsAsync();
      setNotificationPermission(request.status);
      if (request.status !== 'granted') {
        Alert.alert(
          'Permissao nao concedida',
          'Se quiser ativar depois, use os ajustes do sistema.',
          [
            { text: 'OK', style: 'default' },
            { text: 'Abrir ajustes', onPress: () => Linking.openSettings() },
          ]
        );
      }
    } catch (error) {
      console.error('Erro ao solicitar permissao de notificacoes', error);
      Alert.alert('Erro', 'Nao foi possivel solicitar permissao de notificacoes.');
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
    if (!user?.uid) return Alert.alert('Erro', 'Faca login para registrar');
    try {
      await subscribeWebPush(user.uid);
      Alert.alert('Sucesso', 'Web Push registrado!');
      loadPushStatus();
    } catch (e: any) {
      Alert.alert('Erro', e?.message || 'Falha ao registrar Web Push');
    }
  }

  const houseSystemDescriptions: Record<HouseSystem, string> = {
    placidus: 'Placidus (tempo/quadrantes): calcula as cúspides pelas divisões de tempo do “arco diurno” (o quanto um ponto leva para ir do horizonte ao Meio do Céu, etc.). Por isso, as casas podem ter tamanhos diferentes (desiguais) dependendo da latitude e do horário.',
    'whole-sign': 'Casas Inteiras: a Casa 1 é o signo inteiro que contém o Ascendente; o signo seguinte vira a Casa 2, e assim por diante. Resultado: cada casa = 1 signo inteiro (30°), com uma divisão bem “limpa” e constante.',
    'psychological-shift': 'Psicológico (Casas Naturais / Casa 1 = Áries): fixa a sequência Casa 1 = Áries, Casa 2 = Touro… (todas de 30°), como um modelo simbólico/interpretativo, sem depender do Ascendente para definir a Casa 1.',
    equal: 'Casas iguais de 30°; simples e direta.',
    porphyry: 'Divide entre Ascendente e MC; boa para iniciantes.',
    regiomontanus: 'Baseada na esfera celeste; tradicional.',
    koch: 'Foco na latitude e tempo; detalhada.',
    campanus: 'Divide o ceu em 12; visual e intuitiva.',
    topocentric: 'Variante moderna; busca precisao.',
  };
  const loadProfile = async () => {
    if (!user?.uid) return;
    try {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists()) return;
      const data = userDoc.data() || {};
      setProfileName(data.displayName || data.fullName || user.email?.split("@")[0] || "");
      setBirthDate(data.birthDate || "");
      setBirthTime(data.birthTime || "");
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
        Alert.alert("Permissao Necessaria", "Precisamos de acesso a galeria para selecionar sua foto.");
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
      Alert.alert("Permissao Necessaria", "Precisamos de acesso a camera.");
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
      Alert.alert("Erro", "Nao foi possivel selecionar a foto. Tente novamente.");
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
        setProfilePhotoDirty(true);
      };
      input.click();
      return;
    }

    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    Alert.alert("Escolher Foto", "Como voce gostaria de adicionar sua foto?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Galeria", onPress: () => pickImage("gallery") },
      { text: "Camera", onPress: () => pickImage("camera") },
    ]);
  };

  const saveProfile = async () => {
    if (!user?.uid) return;
    try {
      setSavingProfile(true);
      if (birthDate && !isValidBirthDate(birthDate)) {
        Alert.alert("Data invalida", "Use o formato AAAA-MM-DD.");
        return;
      }
      if (birthTime && !isValidBirthTime(birthTime)) {
        Alert.alert("Horario invalido", "Use o formato HH:MM.");
        return;
      }
      if (isEditingProfile && locationQuery && !selectedLocation && !birthLocation) {
        Alert.alert("Local de nascimento", "Selecione uma cidade da lista.");
        return;
      }
      let updatedPhoto = profilePhoto;
      if (updatedPhoto && updatedPhoto.startsWith("data:")) {
        const uploaded = await uploadProfilePhoto(user.uid, updatedPhoto);
        updatedPhoto = uploaded || updatedPhoto;
      }

      const payload: Record<string, any> = {
        displayName: profileName || user.email?.split("@")[0] || "Usuario",
        profilePhoto: updatedPhoto || null,
      };
      if (birthDate) {
        payload.birthDate = birthDate;
      }
      if (birthTime) {
        payload.birthTime = birthTime;
      }
      if (birthLocation) {
        payload.birthLocation = birthLocation;
      }
      if (birthDate && birthTime && birthLocation?.latitude && birthLocation?.longitude) {
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
      setIsEditingProfile(false);
      setProfileSnapshot(null);
      setShowLocationSuggestions(false);
      setProfilePhotoDirty(false);
      Alert.alert("Sucesso", "Perfil atualizado!");
    } catch (error) {
      console.error("Erro ao salvar perfil:", error);
      Alert.alert("Erro", "Nao foi possivel salvar seu perfil agora.");
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
    if (!location?.city) return "Nao informado";
    if (location.state) return `${location.city}, ${location.state}`;
    if (location.country) return `${location.city}, ${location.country}`;
    return location.city;
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
      try { await UserService.setHouseSystem(user.uid, normalized); } catch {}
    }
  };

  const checkSubscriptionStatus = async () => {
    try {
      setIsLoading(true);
      
      if (!user?.uid) {
        Alert.alert('Erro', 'Usuario nao identificado.');
        return;
      }

      const status = await MercadoPagoService.getSubscriptionStatus(user.uid);
      
      if (status.isActive) {
        const plan = MercadoPagoService.getPlanById(status.planId || '');
        const planName = plan?.name || 'Premium';
        const expiresAt = status.expiresAt ? 
          new Date(status.expiresAt).toLocaleDateString('pt-BR') : 'N/A';
        
        Alert.alert(
          'Assinatura Ativa',
          `Plano: ${planName}\nExpira em: ${expiresAt}\n\nDeseja gerenciar sua assinatura?`,
          [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Gerenciar', onPress: () => openSubscriptionManagement() }
          ]
        );
      } else if (MercadoPagoService.isInTrial(status)) {
        const daysRemaining = MercadoPagoService.getTrialDaysRemaining(status);
        Alert.alert(
          'Periodo de Teste',
          `Voce esta no periodo de teste gratuito!\nDias restantes: ${daysRemaining}\n\nDeseja assinar um plano?`,
          [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Ver Planos', onPress: () => openSubscriptionPlans() }
          ]
        );
      } else {
        Alert.alert(
          'Assinatura Premium',
          'Desbloqueie recursos exclusivos como IA conversacional, matching de casais e analises avancadas!',
          [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Ver Planos', onPress: () => openSubscriptionPlans() }
          ]
        );
      }
    } catch (error) {
      console.error('Erro ao verificar assinatura:', error);
      Alert.alert('Erro', 'Nao foi possivel verificar o status da assinatura.');
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

  // Funcoes removidas pois agora usam os hooks

  const deleteAccount = () => {
    Alert.alert(
      'Excluir Conta',
      'Tem certeza que deseja excluir sua conta? Esta acao nao pode ser desfeita e todos os seus dados serao perdidos permanentemente.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: async () => {
          try {
            setIsLoading(true);
            await deleteUserAccount();
            Alert.alert('Conta Excluida', 'Sua conta foi excluida com sucesso.');
          } catch (error) {
            console.error('Erro ao excluir conta:', error);
            Alert.alert('Erro', 'Nao foi possivel excluir a conta. Tente novamente.');
          } finally {
            setIsLoading(false);
          }
        }}
      ]
    );
  };

  const handleSignOut = () => {
    console.log('oi handleSignOut chamado')
    console.log('Usuario atual:', user?.uid)
    console.log('Funcao logout disponivel:', !!logout)
    
    if (Platform.OS === 'web') {
      try {
        // window.confirm retorna true/false no Web
        // eslint-disable-next-line no-restricted-globals
        const ok = typeof window !== 'undefined' ? window.confirm('Tem certeza que deseja sair?') : true
        if (!ok) return
        setIsLoading(true)
        logout()
          .then(() => console.log('Logout (web) realizado com sucesso'))
          .catch((error) => console.error('Erro no logout (web):', error))
          .finally(() => setIsLoading(false))
      } catch (error) {
        console.error('Erro no fluxo de logout (web):', error)
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
            console.log('Iniciando processo de logout...')
            setIsLoading(true);
            await logout();
            console.log('Logout realizado com sucesso');
            Alert.alert('Sucesso', 'Logout realizado com sucesso!');
          } catch (error) {
            console.error('Erro no logout:', error);
            Alert.alert('Erro', 'Nao foi possivel fazer logout. Tente novamente.');
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
    Alert.alert('Suporte', 'Escolha como falar com a equipe:', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'WhatsApp', onPress: () => Linking.openURL('https://w.app/tabulaestelar') },
      { text: 'Email', onPress: () => Linking.openURL('mailto:contato@tabulaestelar.com.br') },
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
    const permissionLabel = pushStatus.permission === 'granted'
      ? 'Permitido'
      : pushStatus.permission === 'denied'
        ? 'Bloqueado'
        : 'Nao definido';

    const content = (
      <TouchableOpacity
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
            <Text style={styles.pushStatusTitle}>Status de notificacoes</Text>
            <TouchableOpacity style={styles.pushStatusRefresh} onPress={loadPushStatus}>
              <Ionicons name="refresh" size={14} color="#FFD700" />
              <Text style={styles.pushStatusRefreshText}>Atualizar</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.pushStatusRow}>
            <View style={[styles.pushStatusDot, pushStatus.permission === 'granted' ? styles.pushStatusOk : styles.pushStatusWarn]} />
            <Text style={styles.pushStatusLabel}>Permissao:</Text>
            <Text style={styles.pushStatusValue}>{permissionLabel}</Text>
          </View>
          <View style={styles.pushStatusRow}>
            <View style={[styles.pushStatusDot, pushStatus.hasFcmToken ? styles.pushStatusOk : styles.pushStatusWarn]} />
            <Text style={styles.pushStatusLabel}>Token Mobile:</Text>
            <Text style={styles.pushStatusValue}>{pushStatus.hasFcmToken ? 'Registrado' : 'Ausente'}</Text>
          </View>
          <View style={styles.pushStatusRow}>
            <View style={[styles.pushStatusDot, pushStatus.hasWebPush ? styles.pushStatusOk : styles.pushStatusWarn]} />
            <Text style={styles.pushStatusLabel}>Web Push:</Text>
            <Text style={styles.pushStatusValue}>{pushStatus.hasWebPush ? 'Registrado' : 'Ausente'}</Text>
          </View>
          {pushStatusLoading && (
            <Text style={styles.pushStatusLoading}>Atualizando...</Text>
          )}
        </View>
      </Animated.View>
    );
  };

  const notificationSection = settingsSections.find((section) => section.title === 'Notificacoes');
  const otherSections = settingsSections.filter((section) => section.title !== 'Notificacoes');

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
            <Text style={styles.title}>Configuracoes</Text>
            <Text style={styles.subtitle}>
              Personalize sua experiencia no Tabula Estelar
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
                    placeholder="Seu nome"
                    placeholderTextColor="#888"
                    value={profileName}
                    onChangeText={setProfileName}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Data de nascimento (AAAA-MM-DD)"
                    placeholderTextColor="#888"
                    value={birthDate}
                    onChangeText={setBirthDate}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Horario de nascimento (HH:MM)"
                    placeholderTextColor="#888"
                    value={birthTime}
                    onChangeText={setBirthTime}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Local de nascimento"
                    placeholderTextColor="#888"
                    value={locationQuery}
                    onChangeText={handleLocationQueryChange}
                    onFocus={() => setShowLocationSuggestions(true)}
                  />
                  <Text style={styles.helperText}>Use o formato AAAA-MM-DD e HH:MM.</Text>
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
                  <Text style={styles.userName}>{profileName || "Usuario"}</Text>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Data:</Text>
                    <Text style={styles.infoValue}>{birthDate || "Nao informado"}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Horario:</Text>
                    <Text style={styles.infoValue}>{birthTime || "Nao informado"}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Local:</Text>
                    <Text style={styles.infoValue}>{formatBirthLocation(birthLocation)}</Text>
                  </View>
                </>
              )}

              <Text style={styles.userEmail}>
                {user?.email || "usuario@email.com"}
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
                    {isEditingProfile ? "Cancelar" : "Editar"}
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
                    {savingProfile ? "Salvando..." : "Salvar"}
                  </Text>
                </TouchableOpacity>
              </View>
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
                        <Text style={styles.itemSubtitle}>
                          {houseSystemDescriptions[system] || 'Aplicar ao mapa natal e transitos'}
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
              Tabula Estelar v1.0.0
            </Text>
            <Text style={styles.appInfoSubtext}>
              Desenvolvido com cuidado para sua jornada astrologica
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
  pushStatusLoading: {
    marginTop: 4,
    color: '#9aa0b1',
    fontSize: 11,
  },
});

