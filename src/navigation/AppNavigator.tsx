"use client"
import { useEffect, useRef } from "react"
import { Platform, PanResponder, View } from "react-native"
import { NavigationContainer, useNavigation, useRoute } from "@react-navigation/native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { createStackNavigator } from "@react-navigation/stack"
import { Ionicons } from "@expo/vector-icons"
import { View, Text, StyleSheet } from "react-native"

// Screens
import LoginScreen from "../screens/auth/LoginScreen"
import HomeScreen from "../screens/home/HomeScreen"
import HomeScreenMinimal from "../screens/home/HomeScreenMinimal"
import GroupsAccessGuard from "../screens/groups/GroupsAccessGuard"
import SettingsScreen from "../screens/settings/SettingsScreen"
import NotificationPreferencesScreen from "../screens/settings/NotificationPreferencesScreen"
import PremiumScreen from "../screens/premium/PremiumScreen"
import NotificationsScreen from "../screens/notifications/NotificationsScreen"
import AstrologyAnalysisScreen from "../screens/analysis/AstrologyAnalysisScreen"
import PlanetTimelineScreen from "../screens/analysis/PlanetTimelineScreen"
import ErrorBoundary from "../components/ErrorBoundary"
import BirthDataFormContainer from "../screens/onboarding/BirthDataFormContainer"
import { useAuth } from "../hooks/useAuth"
import { registerDeviceToken } from "../services/notifications/registerDeviceToken"
import { useNotificationStore } from "../context/NotificationStore"

const Tab = createBottomTabNavigator()
const Stack = createStackNavigator()
const RootStack = createStackNavigator()
const TAB_ORDER = ["Home", "Groups", "Notifications", "Premium", "Settings"]
const SWIPE_THRESHOLD = 40

function SwipeableTabScreen({ children }: { children: React.ReactNode }) {
  const navigation = useNavigation()
  const route = useRoute()
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_event, gesture) => {
        const { dx, dy } = gesture
        if (Math.abs(dx) < 20) return false
        if (Math.abs(dx) <= Math.abs(dy) * 1.2) return false
        return true
      },
      onPanResponderRelease: (_event, gesture) => {
        const { dx, vx } = gesture
        if (Math.abs(dx) < SWIPE_THRESHOLD || Math.abs(vx) < 0.2) return
        const currentIndex = TAB_ORDER.indexOf(route.name)
        if (currentIndex === -1) return
        const nextIndex = dx < 0 ? currentIndex + 1 : currentIndex - 1
        if (nextIndex < 0 || nextIndex >= TAB_ORDER.length) return
        navigation.navigate(TAB_ORDER[nextIndex] as never)
      },
    })
  ).current

  return (
    <View style={{ flex: 1 }} {...panResponder.panHandlers}>
      {children}
    </View>
  )
}

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  )
}

function OnboardingStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="BirthDataForm" component={BirthDataFormContainer} />
    </Stack.Navigator>
  )
}

function MainTabs() {
  const { unreadCount } = useNotificationStore()

  const renderStarIcon = (focused: boolean, color: string, size: number) => (
    <View style={styles.tabIconWrap}>
      <Ionicons name={focused ? "star" : "star-outline"} size={size} color={color} />
      {unreadCount > 0 && (
        <View style={styles.tabBadge}>
          <Text style={styles.tabBadgeText}>
            {unreadCount > 99 ? "99+" : unreadCount}
          </Text>
        </View>
      )}
    </View>
  )

  return (
    <Tab.Navigator
      lazy={false}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap

          if (route.name === "Home") {
            iconName = focused ? "person" : "person-outline"
          } else if (route.name === "Groups") {
            iconName = focused ? "people" : "people-outline"
          } else if (route.name === "Notifications") {
            return renderStarIcon(focused, color, size)
          } else if (route.name === "Premium") {
            iconName = focused ? "sparkles" : "sparkles-outline"
          } else if (route.name === "Settings") {
            iconName = focused ? "settings" : "settings-outline"
          } else {
            iconName = "help-outline"
          }

          return <Ionicons name={iconName} size={size} color={color} />
        },
        tabBarActiveTintColor: "#FFD700",
        tabBarInactiveTintColor: "#8E8E93",
        tabBarStyle: {
          backgroundColor: "#1C1C1E",
          borderTopColor: "#2C2C2E",
        },
        headerStyle: {
          backgroundColor: "#0F0F23",
        },
        headerTintColor: "#FFFFFF",
      })}
    >
      <Tab.Screen name="Home" options={{ title: "Perfil" }}>
        {() => (
          <ErrorBoundary>
            <SwipeableTabScreen>
              <HomeScreen />
            </SwipeableTabScreen>
          </ErrorBoundary>
        )}
      </Tab.Screen>
      <Tab.Screen name="Groups" options={{ title: "Grupos" }}>
        {() => (
          <ErrorBoundary>
            <SwipeableTabScreen>
              <GroupsAccessGuard />
            </SwipeableTabScreen>
          </ErrorBoundary>
        )}
      </Tab.Screen>
      <Tab.Screen name="Notifications" options={{ title: "Notificacoes" }}>
        {() => (
          <ErrorBoundary>
            <SwipeableTabScreen>
              <NotificationsScreen />
            </SwipeableTabScreen>
          </ErrorBoundary>
        )}
      </Tab.Screen>
      <Tab.Screen name="Premium" options={{ title: "Premium" }}>
        {() => (
          <ErrorBoundary>
            <SwipeableTabScreen>
              <PremiumScreen />
            </SwipeableTabScreen>
          </ErrorBoundary>
        )}
      </Tab.Screen>
      <Tab.Screen name="Settings" options={{ title: "Configuracoes" }}>
        {() => (
          <ErrorBoundary>
            <SwipeableTabScreen>
              <SettingsScreen />
            </SwipeableTabScreen>
          </ErrorBoundary>
        )}
      </Tab.Screen>
    </Tab.Navigator>
  )
}

function RootNavigator() {
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      <RootStack.Screen name="Tabs" component={MainTabs} />
      <RootStack.Screen
        name="NotificationPreferences"
        component={NotificationPreferencesScreen}
        options={{ headerShown: true, title: "Opcoes de Notificacoes", headerStyle:{ backgroundColor:'#0F0F23' }, headerTintColor:'#FFFFFF' }}
      />
      <RootStack.Screen name="TransitDetail" component={require('../screens/transits/TransitDetailScreen').default} options={{ headerShown: true, title: 'Detalhe do Trânsito', headerStyle:{ backgroundColor:'#0F0F23' }, headerTintColor:'#FFFFFF' }} />
      <RootStack.Screen name="PersonalTransits" component={require('../screens/transits/PersonalTransitsScreen').default} options={{ headerShown: true, title: 'Trânsitos Pessoais', headerStyle:{ backgroundColor:'#0F0F23' }, headerTintColor:'#FFFFFF' }} />
      <RootStack.Screen name="CollectiveTransits" component={require('../screens/transits/CollectiveTransitsScreen').default} options={{ headerShown: true, title: 'Trânsitos Coletivos', headerStyle:{ backgroundColor:'#0F0F23' }, headerTintColor:'#FFFFFF' }} />
      <RootStack.Screen name="AstrologyAnalysis" component={AstrologyAnalysisScreen} options={{ headerShown: true, title: 'Analise Astrologica', headerStyle:{ backgroundColor:'#0F0F23' }, headerTintColor:'#FFFFFF' }} />
      <RootStack.Screen name="PlanetTimeline" component={PlanetTimelineScreen} options={{ headerShown: true, title: 'Linha do Tempo Planetaria', headerStyle:{ backgroundColor:'#0F0F23' }, headerTintColor:'#FFFFFF' }} />
    </RootStack.Navigator>
  )
}

const styles = StyleSheet.create({
  tabIconWrap: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  tabBadge: {
    position: "absolute",
    top: -6,
    right: -10,
    backgroundColor: "#FFD700",
    borderRadius: 10,
    paddingHorizontal: 5,
    minWidth: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  tabBadgeText: {
    color: "#0F0F23",
    fontSize: 10,
    fontWeight: "700",
  },
})

export default function AppNavigator() {
  const { user, loading, birthDataComplete } = useAuth()

  useEffect(() => {
    if (!user?.uid) return
    if (Platform.OS !== "android" && Platform.OS !== "ios") return
    registerDeviceToken(user.uid).catch(() => {})
  }, [user?.uid])

  console.log('🧭 AppNavigator render:', {
    user: user ? `${user.uid.substring(0, 8)}...` : 'null',
    loading,
    birthDataComplete
  })

  if (loading) {
    console.log('⏳ Showing loading state')
    return null // ou um componente de loading
  }

  // Se não estiver logado, mostra AuthStack
  if (!user) {
    console.log('🔒 Showing AuthStack (no user)')
    return <NavigationContainer><AuthStack /></NavigationContainer>
  }

  // Se estiver logado mas dados de nascimento incompletos, mostra Onboarding
  if (user && !birthDataComplete) {
    console.log('📝 Showing OnboardingStack (incomplete data)')
    return <NavigationContainer><OnboardingStack /></NavigationContainer>
  }

  // Se estiver logado e dados completos, mostra app principal
  console.log('🏠 Showing MainTabs (complete data)')
  return <NavigationContainer><RootNavigator /></NavigationContainer>
}
