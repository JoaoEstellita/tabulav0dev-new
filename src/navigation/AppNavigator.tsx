"use client"
import { useEffect } from "react"
import { Platform } from "react-native"
import { NavigationContainer } from "@react-navigation/native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { createStackNavigator } from "@react-navigation/stack"
import { Ionicons } from "@expo/vector-icons"

// Screens
import LoginScreen from "../screens/auth/LoginScreen"
import HomeScreen from "../screens/home/HomeScreen"
import HomeScreenMinimal from "../screens/home/HomeScreenMinimal"
import GroupsAccessGuard from "../screens/groups/GroupsAccessGuard"
import SettingsScreen from "../screens/settings/SettingsScreen"
import PremiumScreen from "../screens/premium/PremiumScreen"
import AstrologyAnalysisScreen from "../screens/analysis/AstrologyAnalysisScreen"
import PlanetTimelineScreen from "../screens/analysis/PlanetTimelineScreen"
import ErrorBoundary from "../components/ErrorBoundary"
import BirthDataFormContainer from "../screens/onboarding/BirthDataFormContainer"
import { useAuth } from "../hooks/useAuth"
import { registerAndroidDeviceToken } from "../services/notifications/registerDeviceToken"

const Tab = createBottomTabNavigator()
const Stack = createStackNavigator()
const RootStack = createStackNavigator()

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
          } else if (route.name === "Premium") {
            iconName = focused ? "star" : "star-outline"
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
            <HomeScreen />
          </ErrorBoundary>
        )}
      </Tab.Screen>
      <Tab.Screen name="Groups" options={{ title: "Grupos" }}>
        {() => (
          <ErrorBoundary>
            <GroupsAccessGuard />
          </ErrorBoundary>
        )}
      </Tab.Screen>
      <Tab.Screen name="Premium" options={{ title: "Premium" }}>
        {() => (
          <ErrorBoundary>
            <PremiumScreen />
          </ErrorBoundary>
        )}
      </Tab.Screen>
      <Tab.Screen name="Settings" options={{ title: "Configurações" }}>
        {() => (
          <ErrorBoundary>
            <SettingsScreen />
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
      <RootStack.Screen name="TransitDetail" component={require('../screens/transits/TransitDetailScreen').default} options={{ headerShown: true, title: 'Detalhe do Trânsito', headerStyle:{ backgroundColor:'#0F0F23' }, headerTintColor:'#FFFFFF' }} />
      <RootStack.Screen name="PersonalTransits" component={require('../screens/transits/PersonalTransitsScreen').default} options={{ headerShown: true, title: 'Trânsitos Pessoais', headerStyle:{ backgroundColor:'#0F0F23' }, headerTintColor:'#FFFFFF' }} />
      <RootStack.Screen name="CollectiveTransits" component={require('../screens/transits/CollectiveTransitsScreen').default} options={{ headerShown: true, title: 'Trânsitos Coletivos', headerStyle:{ backgroundColor:'#0F0F23' }, headerTintColor:'#FFFFFF' }} />
      <RootStack.Screen name="AstrologyAnalysis" component={AstrologyAnalysisScreen} options={{ headerShown: true, title: 'Analise Astrologica', headerStyle:{ backgroundColor:'#0F0F23' }, headerTintColor:'#FFFFFF' }} />
      <RootStack.Screen name="PlanetTimeline" component={PlanetTimelineScreen} options={{ headerShown: true, title: 'Linha do Tempo Planetaria', headerStyle:{ backgroundColor:'#0F0F23' }, headerTintColor:'#FFFFFF' }} />
    </RootStack.Navigator>
  )
}

export default function AppNavigator() {
  const { user, loading, birthDataComplete } = useAuth()

  useEffect(() => {
    if (!user?.uid) return
    if (Platform.OS !== "android") return
    registerAndroidDeviceToken(user.uid).catch(() => {})
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
