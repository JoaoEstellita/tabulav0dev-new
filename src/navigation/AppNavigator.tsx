"use client"
import { useCallback, useEffect } from "react"
import { Dimensions, Platform, View } from "react-native"
import { Gesture, GestureDetector } from "react-native-gesture-handler"
import { DefaultTheme, NavigationContainer, getStateFromPath as defaultGetStateFromPath, useFocusEffect, useNavigation, useRoute } from "@react-navigation/native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { TourProvider } from "../tour/TourProvider"
import TourOverlay from "../components/TourOverlay"
import { createStackNavigator } from "@react-navigation/stack"
import { Ionicons } from "@expo/vector-icons"
import { Text, StyleSheet } from "react-native"
import Animated, { Easing, runOnJS, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated"
import * as Linking from "expo-linking"
import type { LinkingOptions, NavigatorScreenParams } from "@react-navigation/native"

// Screens
import LoginScreen from "../screens/auth/LoginScreen"
import HomeScreen from "../screens/home/HomeScreen"
import HomeScreenMinimal from "../screens/home/HomeScreenMinimal"
import GroupsAccessGuard from "../screens/groups/GroupsAccessGuard"
import NetworkScreen from "../screens/connections/NetworkScreen"
import SettingsScreen from "../screens/settings/SettingsScreen"
import NotificationPreferencesScreen from "../screens/settings/NotificationPreferencesScreen"
import PremiumScreen from "../screens/premium/PremiumScreen"
import ForecastScreen from "../screens/forecast/ForecastScreen"
import ForecastPeriodEventsScreen from "../screens/forecast/ForecastPeriodEventsScreen"
import AstrologyAnalysisScreen from "../screens/analysis/AstrologyAnalysisScreen"
import PlanetTimelineScreen from "../screens/analysis/PlanetTimelineScreen"
import AdminDiagnosticsScreen from "../screens/admin/AdminDiagnosticsScreen"
import PaymentSuccessScreen from "../screens/payment/PaymentSuccessScreen"
import PaymentPendingScreen from "../screens/payment/PaymentPendingScreen"
import PaymentFailureScreen from "../screens/payment/PaymentFailureScreen"
import CosmosScreen from "../screens/cosmos/CosmosScreen"
import AstroProfileScreen from "../screens/cosmos/AstroProfileScreen"
import NatalChartWheelScreen from "../screens/cosmos/NatalChartWheelScreen"
import ErrorBoundary from "../components/ErrorBoundary"
import AccessGuard from "../components/AccessGuard"
import TrialBanner from "../components/TrialBanner"
import TrialWelcomeModal from "../components/TrialWelcomeModal"
import BirthDataFormContainer from "../screens/onboarding/BirthDataFormContainer"
import { useAuth } from "../hooks/useAuth"
import { useAppLanguage } from "../hooks/useAppLanguage"
import { registerDeviceToken } from "../services/notifications/registerDeviceToken"

const Tab = createBottomTabNavigator()
const Stack = createStackNavigator()
const RootStack = createStackNavigator()
const TAB_ORDER = ["Home", "Cosmos", "Groups", "Forecast", "Premium", "Settings"]
const SWIPE_THRESHOLD = 0.25
const SWIPE_ANIMATION_MS = 260
let lastSwipeDirection: "left" | "right" | null = null
const NAV_THEME = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "#0F0F23",
  },
}

// Deep-links: URL/scheme -> tela. PWA (https, slugs limpos), app nativo (App Links
// Android + custom scheme tabulaestelar://). Telas de pagamento ficam de fora de
// proposito — os return URLs do checkout usam o rewrite /payment existente.
type DeepLinkTabsParamList = {
  Home: undefined
  Cosmos: undefined
  Groups: undefined
  Forecast: undefined
  Premium: undefined
  Settings: undefined
}
type DeepLinkRootParamList = {
  Tabs: NavigatorScreenParams<DeepLinkTabsParamList> | undefined
  Notifications: undefined
  AstroProfile: undefined
  NatalChartWheel: undefined
}
const linking: LinkingOptions<DeepLinkRootParamList> = {
  prefixes: [
    Linking.createURL("/"),
    "https://www.tabulaestelar.com.br",
    "https://tabulaestelar.com.br",
    "tabulaestelar://",
  ],
  config: {
    screens: {
      Tabs: {
        screens: {
          Home: "home",
          Cosmos: "cosmos",
          Groups: "grupos",
          Forecast: "previsao",
          Premium: "premium",
          Settings: "config",
        },
      },
      Notifications: "notificacoes",
      AstroProfile: "perfil",
      NatalChartWheel: "mapa",
    },
  },
  // Convite de grupo chega como /join/<CODIGO>, que não é uma rota do app.
  // Sem isto o link abria a Home e nada acontecia — o GroupsScreen, que lê o
  // convite, nem chegava a montar (abas são lazy). Redireciona para a aba
  // Grupos levando o código por parâmetro.
  getStateFromPath: (path, options) => {
    const match = path.match(/^\/?join\/([A-Za-z0-9]{6})/i)
    if (match) {
      return {
        routes: [
          {
            name: "Tabs",
            state: {
              routes: [{ name: "Groups", params: { inviteCode: match[1].toUpperCase() } }],
            },
          },
        ],
      } as ReturnType<typeof defaultGetStateFromPath>
    }
    // Claim de perfil gerenciado: /grupos?claim=<grupo>~<perfil>~<token>.
    const claimMatch = path.match(/[?&]claim=([^&]+)/)
    if (claimMatch) {
      return {
        routes: [
          {
            name: "Tabs",
            state: {
              routes: [{ name: "Groups", params: { claim: decodeURIComponent(claimMatch[1]) } }],
            },
          },
        ],
      } as ReturnType<typeof defaultGetStateFromPath>
    }
    return defaultGetStateFromPath(path, options)
  },
}

function SwipeableTabScreen({ children }: { children: React.ReactNode }) {
  const navigation = useNavigation()
  const route = useRoute()
  const screenWidth = Dimensions.get("window").width
  const translateX = useSharedValue(0)
  const opacity = useSharedValue(1)

  useFocusEffect(
    useCallback(() => {
      const direction = lastSwipeDirection
      if (direction === "left") translateX.value = screenWidth
      if (direction === "right") translateX.value = -screenWidth
      if (direction) opacity.value = 0.9

      translateX.value = withTiming(0, {
        duration: SWIPE_ANIMATION_MS,
        easing: Easing.out(Easing.cubic),
      })
      opacity.value = withTiming(1, { duration: SWIPE_ANIMATION_MS })
      lastSwipeDirection = null
      return () => {}
    }, [opacity, screenWidth, translateX])
  )

  const navigateToIndex = (nextIndex: number, direction: "left" | "right") => {
    lastSwipeDirection = direction
    navigation.navigate(TAB_ORDER[nextIndex] as never)
  }

  const handleSwipeEnd = (translationX: number) => {
    const currentIndex = TAB_ORDER.indexOf(route.name)
    if (currentIndex === -1) {
      translateX.value = withTiming(0, { duration: SWIPE_ANIMATION_MS })
      opacity.value = withTiming(1, { duration: SWIPE_ANIMATION_MS })
      return
    }
    const travel = translationX / screenWidth
    const shouldSwitch = Math.abs(travel) >= SWIPE_THRESHOLD
    if (!shouldSwitch) {
      translateX.value = withTiming(0, {
        duration: SWIPE_ANIMATION_MS,
        easing: Easing.out(Easing.cubic),
      })
      opacity.value = withTiming(1, { duration: SWIPE_ANIMATION_MS })
      return
    }
    const direction = translationX < 0 ? "left" : "right"
    const nextIndex = direction === "left" ? currentIndex + 1 : currentIndex - 1
    if (nextIndex < 0 || nextIndex >= TAB_ORDER.length) {
      translateX.value = withTiming(0, {
        duration: SWIPE_ANIMATION_MS,
        easing: Easing.out(Easing.cubic),
      })
      opacity.value = withTiming(1, { duration: SWIPE_ANIMATION_MS })
      return
    }
    translateX.value = withTiming(direction === "left" ? -screenWidth : screenWidth, {
      duration: SWIPE_ANIMATION_MS,
      easing: Easing.out(Easing.cubic),
    })
    opacity.value = withTiming(0.9, { duration: SWIPE_ANIMATION_MS })
    navigateToIndex(nextIndex, direction)
  }

  const panGesture = Gesture.Pan()
    .activeOffsetX([-20, 20])
    .failOffsetY([-15, 15])
    .onUpdate((event) => {
      translateX.value = Math.max(-screenWidth, Math.min(screenWidth, event.translationX))
      opacity.value = 0.9
    })
    .onEnd((event) => {
      runOnJS(handleSwipeEnd)(event.translationX)
    })

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    opacity: opacity.value,
  }))
  return (
    <View style={styles.swipeContainer}>
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.swipeScene, animatedStyle]}>
          {children}
        </Animated.View>
      </GestureDetector>
    </View>
  )
}

/**
 * Transitos pessoais atras do portao.
 *
 * Declarado aqui e nao inline no `component={}`: funcao criada no render vira
 * um tipo novo a cada passagem, o React desmonta e remonta a tela, e o
 * `useSubscriptionCheck` refaria a leitura do Firestore toda vez.
 */
function PersonalTransitsGuarded() {
  const Tela = require('../screens/transits/PersonalTransitsScreen').default
  return (
    <AccessGuard>
      <Tela />
    </AccessGuard>
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
  const { t } = useAppLanguage()

  return (
    <TourProvider>
    <View style={{ flex: 1 }}>
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap

          if (route.name === "Home") {
            iconName = focused ? "person" : "person-outline"
          } else if (route.name === "Cosmos") {
            iconName = focused ? "star" : "star-outline"
          } else if (route.name === "Groups") {
            iconName = focused ? "sparkles" : "sparkles-outline"
          } else if (route.name === "Network") {
            iconName = focused ? "heart" : "heart-outline"
          } else if (route.name === "Forecast") {
            iconName = focused ? "calendar" : "calendar-outline"
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
        sceneContainerStyle: {
          backgroundColor: "#0F0F23",
        },
      })}
    >
      <Tab.Screen name="Home" options={{ title: t("nav.profile"), headerShown: false }}>
        {() => (
          <ErrorBoundary>
            <SwipeableTabScreen>
              {/* O status do dia e as oito areas sao o valor que se repete, e
                  eram o unico que nunca travava. O mapa continua livre. */}
              <AccessGuard>
                <>
                  <TrialBanner />
                  <HomeScreen />
                  <TrialWelcomeModal />
                </>
              </AccessGuard>
            </SwipeableTabScreen>
          </ErrorBoundary>
        )}
      </Tab.Screen>
      <Tab.Screen name="Cosmos" options={{ title: t("nav.map"), headerShown: false }}>
        {() => (
          <ErrorBoundary>
            <SwipeableTabScreen>
              <CosmosScreen />
            </SwipeableTabScreen>
          </ErrorBoundary>
        )}
      </Tab.Screen>
      <Tab.Screen name="Groups" options={{ title: t("nav.groups"), headerShown: false }}>
        {() => (
          <ErrorBoundary>
            <SwipeableTabScreen>
              <GroupsAccessGuard />
            </SwipeableTabScreen>
          </ErrorBoundary>
        )}
      </Tab.Screen>
      <Tab.Screen name="Network" options={{ title: t("nav.match"), headerShown: false }}>
        {() => (
          <ErrorBoundary>
            <SwipeableTabScreen>
              <NetworkScreen />
            </SwipeableTabScreen>
          </ErrorBoundary>
        )}
      </Tab.Screen>
      <Tab.Screen name="Forecast" options={{ title: t("nav.forecast"), headerShown: false }}>
        {() => (
          <ErrorBoundary>
            <SwipeableTabScreen>
              <ForecastScreen />
            </SwipeableTabScreen>
          </ErrorBoundary>
        )}
      </Tab.Screen>
      <Tab.Screen name="Settings" options={{ title: t("nav.settings"), headerShown: false }}>
        {() => (
          <ErrorBoundary>
            <SwipeableTabScreen>
              <SettingsScreen />
            </SwipeableTabScreen>
          </ErrorBoundary>
        )}
      </Tab.Screen>
    </Tab.Navigator>
    <TourOverlay />
    </View>
    </TourProvider>
  )
}

function RootNavigator() {
  const { t } = useAppLanguage()
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false, gestureEnabled: true, cardStyle: { flex: 1 } }}>
      <RootStack.Screen name="Tabs" component={MainTabs} />
      <RootStack.Screen name="Premium" component={PremiumScreen} options={{ headerShown: true, title: 'Assinatura', headerStyle:{ backgroundColor:'#0F0F23' }, headerTintColor:'#FFFFFF' }} />
      <RootStack.Screen
        name="ForecastPeriodEvents"
        options={{ headerShown: true, title: "Eventos do período", headerStyle:{ backgroundColor:'#0F0F23' }, headerTintColor:'#FFFFFF' }}
      >
        {(props) => <ForecastPeriodEventsScreen {...(props as any)} />}
      </RootStack.Screen>
      <RootStack.Screen
        name="NotificationPreferences"
        component={NotificationPreferencesScreen}
        options={{ headerShown: true, title: t("nav.notificationPrefs"), headerStyle:{ backgroundColor:'#0F0F23' }, headerTintColor:'#FFFFFF' }}
      />
      <RootStack.Screen
        name="AdminDiagnostics"
        component={AdminDiagnosticsScreen}
        options={{ headerShown: true, title: 'Diagnóstico Admin', headerStyle:{ backgroundColor:'#0F0F23' }, headerTintColor:'#FFFFFF' }}
      />
      <RootStack.Screen name="TransitDetail" component={require('../screens/transits/TransitDetailScreen').default} options={{ headerShown: true, title: 'Detalhe do Trânsito', headerStyle:{ backgroundColor:'#0F0F23' }, headerTintColor:'#FFFFFF' }} />
      <RootStack.Screen name="PersonalTransits" component={PersonalTransitsGuarded} options={{ headerShown: true, title: 'Trânsitos Pessoais', headerStyle:{ backgroundColor:'#0F0F23' }, headerTintColor:'#FFFFFF' }} />
      <RootStack.Screen name="CollectiveTransits" component={require('../screens/transits/CollectiveTransitsScreen').default} options={{ headerShown: true, title: 'Trânsitos Coletivos', headerStyle:{ backgroundColor:'#0F0F23' }, headerTintColor:'#FFFFFF' }} />
      <RootStack.Screen name="AstrologyAnalysis" component={AstrologyAnalysisScreen} options={{ headerShown: true, title: 'Análise Astrológica', headerStyle:{ backgroundColor:'#0F0F23' }, headerTintColor:'#FFFFFF' }} />
      <RootStack.Screen name="PlanetTimeline" component={PlanetTimelineScreen} options={{ headerShown: true, title: 'Linha do Tempo Planetária', headerStyle:{ backgroundColor:'#0F0F23' }, headerTintColor:'#FFFFFF' }} />
      <RootStack.Screen name="PaymentSuccess" component={PaymentSuccessScreen} options={{ headerShown: true, title: 'Pagamento aprovado', headerStyle:{ backgroundColor:'#0F0F23' }, headerTintColor:'#FFFFFF' }} />
      <RootStack.Screen name="PaymentPending" component={PaymentPendingScreen} options={{ headerShown: true, title: 'Pagamento pendente', headerStyle:{ backgroundColor:'#0F0F23' }, headerTintColor:'#FFFFFF' }} />
      <RootStack.Screen name="PaymentFailure" component={PaymentFailureScreen} options={{ headerShown: true, title: 'Pagamento não aprovado', headerStyle:{ backgroundColor:'#0F0F23' }, headerTintColor:'#FFFFFF' }} />
      <RootStack.Screen name="AstroProfile" component={AstroProfileScreen} options={{ headerShown: true, title: 'Perfil Astrológico', headerStyle:{ backgroundColor:'#0F0F23' }, headerTintColor:'#FFFFFF' }} />
      <RootStack.Screen name="PersonProfile" component={require('../screens/connections/PersonProfileScreen').default} options={{ headerShown: false }} />
      <RootStack.Screen name="NatalChartWheel" component={NatalChartWheelScreen} options={{ headerShown: true, title: 'Mapa Natal', headerStyle:{ backgroundColor:'#0F0F23' }, headerTintColor:'#FFFFFF' }} />
      <RootStack.Screen name="MemberProfile" component={require('../screens/groups/MemberProfileScreen').default} options={{ headerShown: true, title: 'Mapa do membro', headerStyle:{ backgroundColor:'#0F0F23' }, headerTintColor:'#FFFFFF' }} />
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
  swipeContainer: {
    flex: 1,
    backgroundColor: "#0F0F23",
    overflow: "hidden",
  },
  swipeScene: {
    flex: 1,
    backgroundColor: "#0F0F23",
  },
})

export default function AppNavigator() {
  const { user, loading, birthDataComplete } = useAuth()

  useEffect(() => {
    if (!user?.uid) return
    if (Platform.OS !== "android" && Platform.OS !== "ios") return
    registerDeviceToken(user.uid).catch(() => {})
  }, [user?.uid])

  if (__DEV__) console.log('🧭 AppNavigator render:', {
    user: user ? `${user.uid.substring(0, 8)}...` : 'null',
    loading,
    birthDataComplete
  })

  if (loading) {
    if (__DEV__) console.log('⏳ Showing loading state')
    return null // ou um componente de loading
  }

  // Se não estiver logado, mostra AuthStack
  if (!user) {
    if (__DEV__) console.log('🔒 Showing AuthStack (no user)')
    return <NavigationContainer><AuthStack /></NavigationContainer>
  }

  // Se estiver logado mas dados de nascimento incompletos, mostra Onboarding
  if (user && !birthDataComplete) {
    if (__DEV__) console.log('📝 Showing OnboardingStack (incomplete data)')
    return <NavigationContainer><OnboardingStack /></NavigationContainer>
  }

  // Se estiver logado e dados completos, mostra app principal
  if (__DEV__) console.log('🏠 Showing MainTabs (complete data)')
  return <NavigationContainer theme={NAV_THEME} linking={linking} fallback={null}><RootNavigator /></NavigationContainer>
}

