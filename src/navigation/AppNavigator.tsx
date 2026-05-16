"use client"
import { useCallback, useEffect } from "react"
import { Dimensions, Platform, View } from "react-native"
import { Gesture, GestureDetector } from "react-native-gesture-handler"
import { DefaultTheme, NavigationContainer, useFocusEffect, useNavigation, useRoute } from "@react-navigation/native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { createStackNavigator } from "@react-navigation/stack"
import { Ionicons } from "@expo/vector-icons"
import { Text, StyleSheet } from "react-native"
import Animated, { Easing, runOnJS, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated"

// Screens
import LoginScreen from "../screens/auth/LoginScreen"
import HomeScreen from "../screens/home/HomeScreen"
import HomeScreenMinimal from "../screens/home/HomeScreenMinimal"
import GroupsAccessGuard from "../screens/groups/GroupsAccessGuard"
import SettingsScreen from "../screens/settings/SettingsScreen"
import NotificationPreferencesScreen from "../screens/settings/NotificationPreferencesScreen"
import PremiumScreen from "../screens/premium/PremiumScreen"
import NotificationsScreen from "../screens/notifications/NotificationsScreen"
import ForecastScreen from "../screens/forecast/ForecastScreen"
import ForecastPeriodEventsScreen from "../screens/forecast/ForecastPeriodEventsScreen"
import AstrologyAnalysisScreen from "../screens/analysis/AstrologyAnalysisScreen"
import PlanetTimelineScreen from "../screens/analysis/PlanetTimelineScreen"
import AdminDiagnosticsScreen from "../screens/admin/AdminDiagnosticsScreen"
import PaymentSuccessScreen from "../screens/payment/PaymentSuccessScreen"
import PaymentPendingScreen from "../screens/payment/PaymentPendingScreen"
import PaymentFailureScreen from "../screens/payment/PaymentFailureScreen"
import ErrorBoundary from "../components/ErrorBoundary"
import BirthDataFormContainer from "../screens/onboarding/BirthDataFormContainer"
import { useAuth } from "../hooks/useAuth"
import { useAppLanguage } from "../hooks/useAppLanguage"
import { registerDeviceToken } from "../services/notifications/registerDeviceToken"
import { useNotificationStore } from "../context/NotificationStore"

const Tab = createBottomTabNavigator()
const Stack = createStackNavigator()
const RootStack = createStackNavigator()
const TAB_ORDER = ["Home", "Groups", "Forecast", "Premium", "Notifications", "Settings"]
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
      lazy={true}
      detachInactiveScreens={false}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap

          if (route.name === "Home") {
            iconName = focused ? "person" : "person-outline"
          } else if (route.name === "Forecast") {
            iconName = focused ? "calendar" : "calendar-outline"
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
        sceneContainerStyle: {
          backgroundColor: "#0F0F23",
        },
      })}
    >
      <Tab.Screen name="Home" options={{ title: t("nav.profile"), headerShown: false }}>
        {() => (
          <ErrorBoundary>
            <SwipeableTabScreen>
              <HomeScreen />
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
      <Tab.Screen name="Forecast" options={{ title: t("nav.forecast"), headerShown: false }}>
        {() => (
          <ErrorBoundary>
            <SwipeableTabScreen>
              <ForecastScreen />
            </SwipeableTabScreen>
          </ErrorBoundary>
        )}
      </Tab.Screen>
      <Tab.Screen name="Premium" options={{ title: t("nav.premium"), headerShown: false }}>
        {() => (
          <ErrorBoundary>
            <SwipeableTabScreen>
              <PremiumScreen />
            </SwipeableTabScreen>
          </ErrorBoundary>
        )}
      </Tab.Screen>
      <Tab.Screen name="Notifications" options={{ title: t("nav.notifications"), headerShown: false }}>
        {() => (
          <ErrorBoundary>
            <SwipeableTabScreen>
              <NotificationsScreen />
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
  )
}

function RootNavigator() {
  const { t } = useAppLanguage()
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false, gestureEnabled: true }}>
      <RootStack.Screen name="Tabs" component={MainTabs} />
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
      <RootStack.Screen name="PersonalTransits" component={require('../screens/transits/PersonalTransitsScreen').default} options={{ headerShown: true, title: 'Trânsitos Pessoais', headerStyle:{ backgroundColor:'#0F0F23' }, headerTintColor:'#FFFFFF' }} />
      <RootStack.Screen name="CollectiveTransits" component={require('../screens/transits/CollectiveTransitsScreen').default} options={{ headerShown: true, title: 'Trânsitos Coletivos', headerStyle:{ backgroundColor:'#0F0F23' }, headerTintColor:'#FFFFFF' }} />
      <RootStack.Screen name="AstrologyAnalysis" component={AstrologyAnalysisScreen} options={{ headerShown: true, title: 'Análise Astrológica', headerStyle:{ backgroundColor:'#0F0F23' }, headerTintColor:'#FFFFFF' }} />
      <RootStack.Screen name="PlanetTimeline" component={PlanetTimelineScreen} options={{ headerShown: true, title: 'Linha do Tempo Planetária', headerStyle:{ backgroundColor:'#0F0F23' }, headerTintColor:'#FFFFFF' }} />
      <RootStack.Screen name="PaymentSuccess" component={PaymentSuccessScreen} options={{ headerShown: true, title: 'Pagamento aprovado', headerStyle:{ backgroundColor:'#0F0F23' }, headerTintColor:'#FFFFFF' }} />
      <RootStack.Screen name="PaymentPending" component={PaymentPendingScreen} options={{ headerShown: true, title: 'Pagamento pendente', headerStyle:{ backgroundColor:'#0F0F23' }, headerTintColor:'#FFFFFF' }} />
      <RootStack.Screen name="PaymentFailure" component={PaymentFailureScreen} options={{ headerShown: true, title: 'Pagamento não aprovado', headerStyle:{ backgroundColor:'#0F0F23' }, headerTintColor:'#FFFFFF' }} />
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
  return <NavigationContainer theme={NAV_THEME}><RootNavigator /></NavigationContainer>
}

