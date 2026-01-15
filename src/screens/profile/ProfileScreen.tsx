"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Switch, Image } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import * as ImagePicker from 'expo-image-picker'
import * as ImageManipulator from 'expo-image-manipulator'
import { useAuth } from "../../hooks/useAuth"
import { useNotificationStore } from "../../context/NotificationStore"
import { collection, doc, getDoc, setDoc, updateDoc, serverTimestamp, getDocs, query, where, limit } from "firebase/firestore"
import { db } from "../../config/firebase"
import FCMService from "../../services/firebase/FCMService"
import FAQ from "../../components/FAQ"
import { useSubscription } from "../../hooks/useSubscription"
import SubscriptionScreen from "../subscription/SubscriptionScreen"
// Removido reprocesso manual de casas natais deste fluxo

interface UserProfile {
  displayName: string
  profilePhoto?: string
  birthDate: string
  birthTime: string
  birthLocation: {
    city: string
    country: string
    latitude: number
    longitude: number
  }
  zodiacSign: string
  preferences: {
    notifications: {
      criticalAlerts: boolean
      groupUpdates: boolean
      dailyHoroscope: boolean
      weeklyForecast: boolean
      pushIncludeMemberName?: boolean
    }
    privacy: {
      showStatusToGroups: boolean
      allowGroupInvites: boolean
      shareTransitDurations: boolean
      shareLocation: boolean
    }
    theme: "dark" | "light" | "auto"
  }
  stats: {
    groupsJoined: number
    alertsSent: number
    alertsReceived: number
    daysActive: number
  }
}

export default function ProfileScreen() {
  const navigation = useNavigation()
  const { user, logout } = useAuth()
  const { unreadCount } = useNotificationStore()
  const { subscription, isInTrial, trialDaysRemaining } = useSubscription()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [showLocationModal, setShowLocationModal] = useState(false)
  const [showFAQ, setShowFAQ] = useState(false)
  const [showSubscription, setShowSubscription] = useState(false)
  const [savingPhoto, setSavingPhoto] = useState(false)

  const uploadProfilePhoto = async (userId: string, dataUrl: string): Promise<string | null> => {
    try {
      const base = (process.env.EXPO_PUBLIC_BACKEND_URL || '').replace(/\/$/, '')
      if (!base) return null
      const response = await fetch(`${base}/api/upload/profile-photo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, dataUrl }),
      })
      if (!response.ok) return null
      const payload = await response.json()
      return payload?.url || null
    } catch (error) {
      console.warn('Falha ao enviar foto:', error)
      return null
    }
  }

  useEffect(() => {
    if (user) {
      loadUserProfile()
    }
  }, [user])

  const loadUserProfile = async () => {
    try {
      setLoading(true)
      const userDoc = await getDoc(doc(db, "users", user!.uid))

      if (userDoc.exists()) {
        setProfile(userDoc.data() as UserProfile)
      } else {
        // Criar perfil padrão
        const defaultProfile: UserProfile = {
          displayName: user!.email?.split("@")[0] || "Usuário",
          birthDate: "",
          birthTime: "",
          birthLocation: {
            city: "",
            country: "",
            latitude: 0,
            longitude: 0,
          },
          zodiacSign: "",
          preferences: {
            notifications: {
              criticalAlerts: true,
              groupUpdates: true,
              dailyHoroscope: true,
              weeklyForecast: false,
              pushIncludeMemberName: false,
            },
            privacy: {
              showStatusToGroups: true,
              allowGroupInvites: true,
              shareTransitDurations: true,
              shareLocation: false,
            },
            theme: "dark",
          },
          stats: {
            groupsJoined: 0,
            alertsSent: 0,
            alertsReceived: 0,
            daysActive: 1,
          },
        }

        await setDoc(doc(db, "users", user!.uid), defaultProfile)
        setProfile(defaultProfile)
      }
    } catch (error) {
      console.error("Erro ao carregar perfil:", error)
      Alert.alert("Erro", "Não foi possível carregar o perfil")
    } finally {
      setLoading(false)
    }
  }

  const notificationBadgeCount = unreadCount

  const saveProfile = async () => {
    if (!profile) return

    try {
      let updatedPhoto = profile.profilePhoto || null
      if (user && updatedPhoto && updatedPhoto.startsWith('data:')) {
        setSavingPhoto(true)
        const uploaded = await uploadProfilePhoto(user.uid, updatedPhoto)
        updatedPhoto = uploaded || updatedPhoto
      }

      const payload = { ...profile, profilePhoto: updatedPhoto }
      await updateDoc(doc(db, "users", user!.uid), payload)
      await setDoc(
        doc(db, "userPublicProfiles", user!.uid),
        {
          displayName: profile.displayName || "Usuario",
          profilePhoto: updatedPhoto || null,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      )
      setEditing(false)
      Alert.alert("Sucesso", "Perfil atualizado com sucesso!")
    } catch (error) {
      console.error("Erro ao salvar perfil:", error)
      Alert.alert("Erro", "Não foi possível salvar o perfil")
    } finally {
      setSavingPhoto(false)
    }
  }

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== 'granted') {
      Alert.alert('Permissão Necessária', 'Precisamos de acesso à galeria para selecionar sua foto.')
      return false
    }
    return true
  }

  const selectPhoto = async () => {
    if (!profile || !user) return

    if (typeof window !== 'undefined') {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = 'image/*'
      input.onchange = async (event: any) => {
        const file = event.target.files[0]
        if (!file) return

        const compressToDataUrl = async (file: File): Promise<string> => {
          const img = document.createElement('img')
          const objectUrl = URL.createObjectURL(file)
          await new Promise((res) => {
            img.onload = () => res(null as any)
            img.src = objectUrl
          })
          const canvas = document.createElement('canvas')
          const maxSize = 600
          const scale = Math.min(maxSize / img.width, maxSize / img.height, 1)
          canvas.width = Math.round(img.width * scale)
          canvas.height = Math.round(img.height * scale)
          const ctx = canvas.getContext('2d')!
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
          URL.revokeObjectURL(objectUrl)
          return canvas.toDataURL('image/jpeg', 0.82)
        }

        const dataUrl = await compressToDataUrl(file)
        setProfile({ ...profile, profilePhoto: dataUrl })
      }
      input.click()
      return
    }

    const hasPermission = await requestPermissions()
    if (!hasPermission) return

    Alert.alert(
      'Escolher Foto',
      'Como você gostaria de adicionar sua foto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Galeria', onPress: () => pickImage('gallery') },
        { text: 'Câmera', onPress: () => pickImage('camera') },
      ]
    )
  }

  const pickImage = async (source: 'gallery' | 'camera') => {
    if (!profile) return

    try {
      let result

      if (source === 'camera') {
        const { status } = await ImagePicker.requestCameraPermissionsAsync()
        if (status !== 'granted') {
          Alert.alert('Permissão Necessária', 'Precisamos de acesso à câmera.')
          return
        }
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        })
      } else {
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        })
      }

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0]
        const manipulatedImage = await ImageManipulator.manipulateAsync(
          asset.uri,
          [{ resize: { width: 600, height: 600 } }],
          { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG, base64: true }
        )
        const dataUrl = manipulatedImage.base64
          ? `data:image/jpeg;base64,${manipulatedImage.base64}`
          : manipulatedImage.uri
        setProfile({ ...profile, profilePhoto: dataUrl })
      }
    } catch (error) {
      console.error('Erro ao selecionar foto:', error)
      Alert.alert('Erro', 'Não foi possível selecionar a foto. Tente novamente.')
    }
  }

  const handleLogout = async () => {
    // Web: usar confirm() para garantir fluxo sem modais nativos bloqueando estado
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line no-restricted-globals
      const ok = window.confirm('Tem certeza que deseja sair da sua conta?')
      if (!ok) return
      try {
        await FCMService.clearAllNotifications()
        await logout()
      } catch (error) {
        console.error('Erro ao fazer logout (web):', error)
      }
      return
    }

    Alert.alert("Sair", "Tem certeza que deseja sair da sua conta?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sair",
        style: "destructive",
        onPress: async () => {
          try {
            await FCMService.clearAllNotifications()
            await logout()
          } catch (error) {
            console.error("Erro ao fazer logout:", error)
          }
        },
      },
    ])
  }

  const updatePrivacyPreference = async (key: keyof UserProfile["preferences"]["privacy"], value: boolean) => {
    if (!profile) return

    const updatedProfile = {
      ...profile,
      preferences: {
        ...profile.preferences,
        privacy: {
          ...profile.preferences.privacy,
          [key]: value,
        },
      },
    }

    setProfile(updatedProfile)

    try {
      await updateDoc(doc(db, "users", user!.uid), updatedProfile)
    } catch (error) {
      console.error("Erro ao atualizar preferência:", error)
    }
  }


  if (loading) {
    return (
      <LinearGradient colors={["#0F0F23", "#1A1A3A"]} style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Carregando perfil...</Text>
        </View>
      </LinearGradient>
    )
  }

  if (!profile) {
    return (
      <LinearGradient colors={["#0F0F23", "#1A1A3A"]} style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Erro ao carregar perfil</Text>
        </View>
      </LinearGradient>
    )
  }

  return (
    <LinearGradient colors={["#0F0F23", "#1A1A3A"]} style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header do Perfil */}
        <View style={styles.profileHeader}>
          <View style={styles.profileHeaderTop}>
            <View style={styles.profileHeaderSpacer} />
            <TouchableOpacity style={styles.notificationBell} onPress={() => navigation.navigate("Notifications" as never)}>
              <Ionicons name="star-outline" size={22} color="#FFD700" />
              {notificationBadgeCount > 0 && (
                <View style={styles.notificationBellBadge}>
                  <Text style={styles.notificationBellBadgeText}>{notificationBadgeCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.avatarContainer} onPress={selectPhoto} disabled={savingPhoto}>
            {profile.profilePhoto ? (
              <Image source={{ uri: profile.profilePhoto }} style={styles.avatarImage} />
            ) : (
              <Ionicons name="person-circle" size={80} color="#FFD700" />
            )}
            <View style={styles.avatarEditBadge}>
              <Ionicons name="camera" size={14} color="#000" />
            </View>
          </TouchableOpacity>
          <Text style={styles.displayName}>{profile.displayName}</Text>
          <Text style={styles.email}>{user?.email}</Text>
          {profile.zodiacSign && <Text style={styles.zodiacSign}>♈ {profile.zodiacSign}</Text>}
        </View>

        {/* Estatísticas */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{profile.stats?.groupsJoined || 0}</Text>
            <Text style={styles.statLabel}>Grupos</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{profile.stats?.alertsSent || 0}</Text>
            <Text style={styles.statLabel}>Alertas Enviados</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{profile.stats?.alertsReceived || 0}</Text>
            <Text style={styles.statLabel}>Alertas Recebidos</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{profile.stats?.daysActive || 1}</Text>
            <Text style={styles.statLabel}>Dias Ativo</Text>
          </View>
        </View>

        {/* Subscription Button */}
        <TouchableOpacity 
          style={styles.subscriptionButton} 
          onPress={() => setShowSubscription(true)}
          activeOpacity={0.8}
        >
          <View style={styles.subscriptionButtonContent}>
            <Ionicons name="card-outline" size={24} color="#8B5FBF" />
            <View style={styles.subscriptionButtonTextContainer}>
              <Text style={styles.subscriptionButtonText}>Assinatura</Text>
              {subscription && (
                <Text style={styles.subscriptionStatus}>
                  {subscription.status === 'active' ? 'Ativa' : 
                   subscription.status === 'trial' ? `Teste (${trialDaysRemaining} dias)` :
                   subscription.status === 'cancelled' ? 'Cancelada' : 'Expirada'}
                </Text>
              )}
            </View>
            <Ionicons name="chevron-forward" size={20} color="#8B5FBF" />
          </View>
        </TouchableOpacity>

        {/* FAQ Button */}
        <TouchableOpacity 
          style={styles.faqButton} 
          onPress={() => setShowFAQ(true)}
          activeOpacity={0.8}
        >
          <View style={styles.faqButtonContent}>
            <Ionicons name="help-circle-outline" size={24} color="#8B5FBF" />
            <Text style={styles.faqButtonText}>Como este aplicativo funciona?</Text>
            <Ionicons name="chevron-forward" size={20} color="#8B5FBF" />
          </View>
        </TouchableOpacity>

        {/* Informações Pessoais */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Informações Pessoais</Text>
            <TouchableOpacity onPress={() => setEditing(!editing)}>
              <Ionicons name={editing ? "checkmark" : "pencil"} size={20} color="#FFD700" />
            </TouchableOpacity>
          </View>

          {editing ? (
            <>
              <TextInput
                style={styles.input}
                placeholder="Nome de exibição"
                placeholderTextColor="#888"
                value={profile.displayName}
                onChangeText={(text) => setProfile({ ...profile, displayName: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Data de nascimento (DD/MM/AAAA)"
                placeholderTextColor="#888"
                value={profile.birthDate}
                onChangeText={(text) => setProfile({ ...profile, birthDate: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Horário de nascimento (HH:MM)"
                placeholderTextColor="#888"
                value={profile.birthTime}
                onChangeText={(text) => setProfile({ ...profile, birthTime: text })}
              />
              <TouchableOpacity style={styles.locationButton} onPress={() => setShowLocationModal(true)}>
                <Text style={styles.locationButtonText}>
                  {profile.birthLocation?.city
                    ? `${profile.birthLocation.city}, ${profile.birthLocation.country}`
                    : "Definir local de nascimento"}
                </Text>
                <Ionicons name="location" size={20} color="#FFD700" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={saveProfile}>
                <Text style={styles.saveButtonText}>Salvar Alterações</Text>
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.infoContainer}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Data de Nascimento:</Text>
                <Text style={styles.infoValue}>{profile.birthDate || "Não informado"}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Horário:</Text>
                <Text style={styles.infoValue}>{profile.birthTime || "Não informado"}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Local:</Text>
                <Text style={styles.infoValue}>
                  {profile.birthLocation?.city
                    ? `${profile.birthLocation.city}, ${profile.birthLocation.country}`
                    : "Não informado"}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Preferências de Privacidade */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacidade</Text>

          <View style={styles.preferenceItem}>
            <View style={styles.preferenceInfo}>
              <Text style={styles.preferenceTitle}>Mostrar Status nos Grupos</Text>
              <Text style={styles.preferenceDescription}>
                Permitir que membros do grupo vejam seu status astrológico
              </Text>
            </View>
            <Switch
              value={profile.preferences?.privacy?.showStatusToGroups || false}
              onValueChange={(value) => updatePrivacyPreference("showStatusToGroups", value)}
              trackColor={{ false: "#2C2C2E", true: "#FFD700" }}
              thumbColor={profile.preferences?.privacy?.showStatusToGroups ? "#000" : "#888"}
            />
          </View>

          <View style={styles.preferenceItem}>
            <View style={styles.preferenceInfo}>
              <Text style={styles.preferenceTitle}>Compartilhar duração dos trânsitos</Text>
              <Text style={styles.preferenceDescription}>
                Permitir que membros vejam a duração exata dos aspectos no grupo
              </Text>
            </View>
            <Switch
              value={profile.preferences?.privacy?.shareTransitDurations ?? true}
              onValueChange={(value) => updatePrivacyPreference("shareTransitDurations", value)}
              trackColor={{ false: "#2C2C2E", true: "#FFD700" }}
              thumbColor={profile.preferences?.privacy?.shareTransitDurations ? "#000" : "#888"}
            />
          </View>

          <View style={styles.preferenceItem}>
            <View style={styles.preferenceInfo}>
              <Text style={styles.preferenceTitle}>Permitir Convites</Text>
              <Text style={styles.preferenceDescription}>Receber convites para novos grupos</Text>
            </View>
            <Switch
              value={profile.preferences?.privacy?.allowGroupInvites || false}
              onValueChange={(value) => updatePrivacyPreference("allowGroupInvites", value)}
              trackColor={{ false: "#2C2C2E", true: "#FFD700" }}
              thumbColor={profile.preferences?.privacy?.allowGroupInvites ? "#000" : "#888"}
            />
          </View>
        </View>

        {/* Ações */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out" size={20} color="#FF4444" />
            <Text style={styles.logoutButtonText}>Sair da Conta</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* FAQ Modal */}
      <FAQ visible={showFAQ} onClose={() => setShowFAQ(false)} />
      
      {/* Subscription Modal */}
      {showSubscription && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Assinatura</Text>
              <TouchableOpacity onPress={() => setShowSubscription(false)}>
                <Ionicons name="close" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            <SubscriptionScreen />
          </View>
        </View>
      )}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "#FF4444",
    fontSize: 16,
  },
  profileHeader: {
    alignItems: "center",
    paddingVertical: 32,
  },
  profileHeaderTop: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  profileHeaderSpacer: {
    width: 24,
  },
  notificationBell: {
    alignSelf: "flex-end",
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#1C1C1E",
    alignItems: "center",
    justifyContent: "center",
  },
  notificationBellBadge: {
    position: "absolute",
    top: -2,
    right: -2,
    minWidth: 16,
    paddingHorizontal: 4,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#FF4444",
    alignItems: "center",
    justifyContent: "center",
  },
  notificationBellBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "bold",
  },
  avatarContainer: {
    marginBottom: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarEditBadge: {
    position: "absolute",
    right: -2,
    bottom: -2,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#FFD700",
    alignItems: "center",
    justifyContent: "center",
  },
  displayName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: "#888",
    marginBottom: 8,
  },
  zodiacSign: {
    fontSize: 18,
    color: "#FFD700",
    fontWeight: "bold",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#1C1C1E",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFD700",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#888",
    textAlign: "center",
  },
  section: {
    backgroundColor: "#1C1C1E",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  advancedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2C2C2E',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  advancedButtonText: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 4,
  },
  input: {
    backgroundColor: "#2C2C2E",
    borderRadius: 8,
    padding: 12,
    color: "#FFFFFF",
    fontSize: 16,
    marginBottom: 12,
  },
  locationButton: {
    backgroundColor: "#2C2C2E",
    borderRadius: 8,
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  locationButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: "#FFD700",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    marginTop: 8,
  },
  saveButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
  infoContainer: {
    gap: 12,
  },
  infoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoLabel: {
    color: "#888",
    fontSize: 14,
  },
  infoValue: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
  },
  preferenceItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#2C2C2E",
  },
  preferenceInfo: {
    flex: 1,
    marginRight: 16,
  },
  preferenceTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  preferenceDescription: {
    color: "#888",
    fontSize: 12,
    lineHeight: 16,
  },
  testButton: {
    backgroundColor: "#FFD700",
    borderRadius: 8,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },
  testButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  logoutButton: {
    backgroundColor: "#2C1B1B",
    borderRadius: 8,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#FF4444",
  },
  logoutButtonText: {
    color: "#FF4444",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  faqButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  faqButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  faqButtonText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: "#2D1B69",
    marginLeft: 12,
  },
  subscriptionButton: {
    backgroundColor: "#1C1C1E",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  subscriptionButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  subscriptionButtonTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  subscriptionButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  subscriptionStatus: {
    fontSize: 12,
    color: "#8B5FBF",
    marginTop: 2,
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#0F0F23",
    borderRadius: 16,
    width: "90%",
    height: "80%",
    overflow: "hidden",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#2C2C2E",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  notificationModal: {
    backgroundColor: "#0F0F23",
    borderRadius: 16,
    width: "90%",
    maxHeight: "80%",
    overflow: "hidden",
  },
  notificationList: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  notificationItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#2C2C2E",
  },
  notificationIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#1C1C1E",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  notificationBody: {
    color: "#B8B8C3",
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 6,
  },
  notificationMeta: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 6,
  },
  notificationTag: {
    backgroundColor: "#2C2C2E",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  notificationTagText: {
    color: "#FFD700",
    fontSize: 10,
    fontWeight: "600",
  },
  notificationTime: {
    color: "#8A8AA8",
    fontSize: 10,
    marginLeft: "auto",
  },
  notificationEmpty: {
    color: "#888",
    textAlign: "center",
    paddingVertical: 24,
  },
})

