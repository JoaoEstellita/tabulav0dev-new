"use client"

import { useState } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  Dimensions,
  Linking,
} from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import { useAuth } from "../../hooks/useAuth"
import { useAppLanguage } from "../../hooks/useAppLanguage"

const { width: screenWidth, height: screenHeight } = Dimensions.get('window')

const Logo = ({ tagline }: { tagline: string }) => (
  <View style={styles.logoContainer}>
    <View style={styles.logoImageContainer}>
      <Image
        source={require('../../../assets/icon.png')}
        style={styles.logoImage}
        resizeMode="contain"
      />
    </View>
    <Text style={styles.tagline}>{tagline}</Text>
  </View>
)

export default function LoginScreen() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const { signIn, signUp, signInWithGoogle } = useAuth()
  const { t } = useAppLanguage()

  const isEmbeddedBrowser =
    Platform.OS === 'web' &&
    typeof navigator !== 'undefined' &&
    /Electron|WebView|wv|Cursor/i.test(navigator.userAgent || '')

  const openExternalLogin = async () => {
    const baseUrl =
      typeof window !== 'undefined' && window.location?.origin
        ? window.location.origin
        : 'https://www.tabulaestelar.com.br'
    const targetUrl = `${baseUrl}/`
    const openUrl = `${baseUrl}/abrir?to=${encodeURIComponent(targetUrl)}`
    if (Platform.OS === 'web') {
      window.open(openUrl, '_blank', 'noopener,noreferrer')
      return
    }
    await Linking.openURL(openUrl)
  }

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert(t("common.error"), t("login.error.fillFields"))
      return
    }

    if (!isLogin) {
      if (!confirmPassword) {
        Alert.alert(t("common.error"), t("login.error.confirmPassword"))
        return
      }
      if (password !== confirmPassword) {
        Alert.alert(t("common.error"), t("login.error.passwordMismatch"))
        return
      }
      if (password.length < 6) {
        Alert.alert(t("common.error"), t("login.error.passwordMin"))
        return
      }
    }

    setLoading(true)
    try {
      if (isLogin) {
        await signIn(email, password)
      } else {
        await signUp(email, password)
      }
    } catch (error: any) {
      const code = error?.code || ''
      if (code === 'auth/email-already-in-use') {
        Alert.alert(t("login.error.emailInUse.title"), t("login.error.emailInUse.body"))
        return
      }
      if (code === 'auth/invalid-email') {
        Alert.alert(t("login.error.invalidEmail.title"), t("login.error.invalidEmail.body"))
        return
      }
      if (code === 'auth/weak-password') {
        Alert.alert(t("login.error.weakPassword.title"), t("login.error.weakPassword.body"))
        return
      }
      Alert.alert(t("common.error"), error.message || t("login.error.generic"))
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true)
    try {
      await signInWithGoogle()
    } catch (error: any) {
      if (error?.code === 'auth/popup-blocked') {
        Alert.alert(
          t("login.error.popupBlocked.title"),
          t("login.error.popupBlocked.body"),
          [
            { text: t("common.cancel"), style: "cancel" },
            { text: t("login.openInBrowser"), onPress: openExternalLogin },
          ]
        )
        return
      }
      Alert.alert(t("common.error"), error.message)
    } finally {
      setGoogleLoading(false)
    }
  }

  return (
    <LinearGradient colors={['#1a1a2e', '#16213e', '#0f0f23']} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <Logo tagline={t("login.tagline")} />

            <View style={styles.formContainer}>
              <Text style={styles.formTitle}>
                {isLogin ? t("login.signIn") : t("login.createAccount")}
              </Text>

              <View style={styles.inputContainer}>
                <Ionicons name="mail" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder={t("login.email")}
                  placeholderTextColor="#666"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder={t("login.password")}
                  placeholderTextColor="#666"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>

              {!isLogin && (
                <View style={styles.inputContainer}>
                  <Ionicons name="lock-closed" size={20} color="#666" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder={t("login.confirmPassword")}
                    placeholderTextColor="#666"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                  />
                </View>
              )}

              <TouchableOpacity
                style={[styles.authButton, loading && styles.disabledButton]}
                onPress={handleAuth}
                disabled={loading}
              >
                {loading ? (
                  <Text style={styles.authButtonText}>{t("common.loading")}</Text>
                ) : (
                  <Text style={styles.authButtonText}>
                    {isLogin ? t("login.signIn") : t("login.register")}
                  </Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.googleButton, googleLoading && styles.disabledButton]}
                onPress={handleGoogleSignIn}
                disabled={googleLoading}
              >
                <Ionicons name="logo-google" size={20} color="#000" />
                <Text style={styles.googleButtonText}>
                  {googleLoading ? t("common.loading") : t("login.continueWithGoogle")}
                </Text>
              </TouchableOpacity>

              {isEmbeddedBrowser && (
                <TouchableOpacity
                  style={[styles.googleButton, styles.externalGoogleButton]}
                  onPress={openExternalLogin}
                >
                  <Ionicons name="open-outline" size={20} color="#000" />
                  <Text style={styles.googleButtonText}>
                    {t("login.continueWithGoogleInBrowser")}
                  </Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={styles.switchButton}
                onPress={() => setIsLogin(!isLogin)}
              >
                <Text style={styles.switchText}>
                  {isLogin ? t("login.noAccount") : t("login.haveAccount")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoImageContainer: {
    width: 180,
    height: 180,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  tagline: {
    fontSize: 14,
    color: '#A0A0A0',
    marginTop: 10,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  formContainer: {
    width: '100%',
    backgroundColor: 'rgba(44, 44, 46, 0.9)',
    borderRadius: 16,
    padding: 24,
    marginTop: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.2)',
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#444',
    marginBottom: 16,
    paddingHorizontal: 16,
    height: 50,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
    paddingVertical: 12,
  },
  authButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
    height: 50,
  },
  authButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  googleButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
    height: 50,
  },
  externalGoogleButton: {
    backgroundColor: '#F0F0F0',
  },
  googleButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
  switchButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  switchText: {
    color: '#FFD700',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  disabledButton: {
    opacity: 0.6,
  },
})
