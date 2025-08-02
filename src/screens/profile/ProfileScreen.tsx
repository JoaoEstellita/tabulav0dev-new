"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Switch } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import { useAuth } from "../../hooks/useAuth"
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore"
import { db } from "../../config/firebase"
import FCMService from "../../services/firebase/FCMService"

interface UserProfile {
  displayName: string
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
    }
    privacy: {
      showStatusToGroups: boolean
      allowGroupInvites: boolean
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
  const { user, logout } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [showLocationModal, setShowLocationModal] = useState(false)

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
            },
            privacy: {
              showStatusToGroups: true,
              allowGroupInvites: true,
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

  const saveProfile = async () => {
    if (!profile) return

    try {
      await updateDoc(doc(db, "users", user!.uid), profile)
      setEditing(false)
      Alert.alert("Sucesso", "Perfil atualizado com sucesso!")
    } catch (error) {
      console.error("Erro ao salvar perfil:", error)
      Alert.alert("Erro", "Não foi possível salvar o perfil")
    }
  }

  const handleLogout = async () => {
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

  const updateNotificationPreference = async (
    key: keyof UserProfile["preferences"]["notifications"],
    value: boolean,
  ) => {
    if (!profile) return

    const updatedProfile = {
      ...profile,
      preferences: {
        ...profile.preferences,
        notifications: {
          ...profile.preferences.notifications,
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

  const testNotification = async () => {
    try {
      await FCMService.sendNotificationToUser(user!.uid, {
        title: "🌟 Teste de Notificação",
        body: "Suas notificações estão funcionando perfeitamente!",
        data: { type: "test" },
        priority: "high",
      })
      Alert.alert("Sucesso", "Notificação de teste enviada!")
    } catch (error) {
      Alert.alert("Erro", "Não foi possível enviar notificação de teste")
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
          <View style={styles.avatarContainer}>
            <Ionicons name="person-circle" size={80} color="#FFD700" />
          </View>
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

        {/* Preferências de Notificação */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notificações</Text>

          <View style={styles.preferenceItem}>
            <View style={styles.preferenceInfo}>
              <Text style={styles.preferenceTitle}>Alertas Críticos</Text>
              <Text style={styles.preferenceDescription}>
                Receber alertas quando membros do grupo estão em momentos críticos
              </Text>
            </View>
            <Switch
              value={profile.preferences.notifications.criticalAlerts}
              onValueChange={(value) => updateNotificationPreference("criticalAlerts", value)}
              trackColor={{ false: "#2C2C2E", true: "#FFD700" }}
              thumbColor={profile.preferences.notifications.criticalAlerts ? "#000" : "#888"}
            />
          </View>

          <View style={styles.preferenceItem}>
            <View style={styles.preferenceInfo}>
              <Text style={styles.preferenceTitle}>Atualizações do Grupo</Text>
              <Text style={styles.preferenceDescription}>Novos membros, mensagens e atividades do grupo</Text>
            </View>
            <Switch
              value={profile.preferences.notifications.groupUpdates}
              onValueChange={(value) => updateNotificationPreference("groupUpdates", value)}
              trackColor={{ false: "#2C2C2E", true: "#FFD700" }}
              thumbColor={profile.preferences.notifications.groupUpdates ? "#000" : "#888"}
            />
          </View>

          <View style={styles.preferenceItem}>
            <View style={styles.preferenceInfo}>
              <Text style={styles.preferenceTitle}>Horóscopo Diário</Text>
              <Text style={styles.preferenceDescription}>Receber seu horóscopo personalizado todos os dias</Text>
            </View>
            <Switch
              value={profile.preferences.notifications.dailyHoroscope}
              onValueChange={(value) => updateNotificationPreference("dailyHoroscope", value)}
              trackColor={{ false: "#2C2C2E", true: "#FFD700" }}
              thumbColor={profile.preferences.notifications.dailyHoroscope ? "#000" : "#888"}
            />
          </View>

          <TouchableOpacity style={styles.testButton} onPress={testNotification}>
            <Ionicons name="notifications" size={20} color="#000" />
            <Text style={styles.testButtonText}>Testar Notificações</Text>
          </TouchableOpacity>
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
              value={profile.preferences.privacy.showStatusToGroups}
              onValueChange={(value) => updatePrivacyPreference("showStatusToGroups", value)}
              trackColor={{ false: "#2C2C2E", true: "#FFD700" }}
              thumbColor={profile.preferences.privacy.showStatusToGroups ? "#000" : "#888"}
            />
          </View>

          <View style={styles.preferenceItem}>
            <View style={styles.preferenceInfo}>
              <Text style={styles.preferenceTitle}>Permitir Convites</Text>
              <Text style={styles.preferenceDescription}>Receber convites para novos grupos</Text>
            </View>
            <Switch
              value={profile.preferences.privacy.allowGroupInvites}
              onValueChange={(value) => updatePrivacyPreference("allowGroupInvites", value)}
              trackColor={{ false: "#2C2C2E", true: "#FFD700" }}
              thumbColor={profile.preferences.privacy.allowGroupInvites ? "#000" : "#888"}
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
    </LinearGradient>
  )
}

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
  avatarContainer: {
    marginBottom: 16,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 16,
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
})
