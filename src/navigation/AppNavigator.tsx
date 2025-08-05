"use client"
import { NavigationContainer } from "@react-navigation/native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { createStackNavigator } from "@react-navigation/stack"
import { Ionicons } from "@expo/vector-icons"

// Screens
import LoginScreen from "../screens/auth/LoginScreen"
import HomeScreen from "../screens/home/HomeScreen"
import GroupsScreen from "../screens/groups/GroupsScreen"
import ProfileScreen from "../screens/profile/ProfileScreen"
import PremiumScreen from "../screens/premium/PremiumScreen"
import ErrorBoundary from "../components/ErrorBoundary"
import BirthDataFormContainer from "../screens/onboarding/BirthDataFormContainer"
import { useAuth } from "../hooks/useAuth"

const Tab = createBottomTabNavigator()
const Stack = createStackNavigator()

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
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap

          if (route.name === "Home") {
            iconName = focused ? "person" : "person-outline"
          } else if (route.name === "Groups") {
            iconName = focused ? "people" : "people-outline"
          } else if (route.name === "Premium") {
            iconName = focused ? "star" : "star-outline"
          } else if (route.name === "Profile") {
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
            <GroupsScreen />
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
      <Tab.Screen name="Profile" options={{ title: "Configurações" }}>
        {() => (
          <ErrorBoundary>
            <ProfileScreen />
          </ErrorBoundary>
        )}
      </Tab.Screen>
    </Tab.Navigator>
  )
}

export default function AppNavigator() {
  const { user, loading, birthDataComplete } = useAuth()

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
  return <NavigationContainer><MainTabs /></NavigationContainer>
}
