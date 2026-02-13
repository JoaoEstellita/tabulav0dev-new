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
  Modal,
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
  const [authError, setAuthError] = useState("")
  const [languageModalVisible, setLanguageModalVisible] = useState(false)
  const { signIn, signUp, signInWithGoogle } = useAuth()
  const { t, language, languages, setLanguage } = useAppLanguage()

  const tl = (pt: string, en: string, es: string, it: string) => {
    if (language === 'en-US') return en
    if (language === 'es-ES') return es
    if (language === 'it-IT') return it
    return pt
  }

  const mapAuthError = (code?: string, fallback?: string) => {
    const key = String(code || "").toLowerCase()
    if (key === "auth/wrong-password" || key === "auth/invalid-credential") {
      return tl(
        "Senha incorreta. Tente novamente.",
        "Incorrect password. Please try again.",
        "Contrasena incorrecta. Intenta nuevamente.",
        "Password non corretta. Riprova."
      )
    }
    if (key === "auth/user-not-found") {
      return tl(
        "Usuario nao encontrado para este email.",
        "No account found for this email.",
        "No encontramos una cuenta con este email.",
        "Nessun account trovato con questa email."
      )
    }
    if (key === "auth/too-many-requests") {
      return tl(
        "Muitas tentativas. Aguarde alguns minutos e tente novamente.",
        "Too many attempts. Wait a few minutes and try again.",
        "Demasiados intentos. Espera unos minutos e intenta de nuevo.",
        "Troppi tentativi. Attendi qualche minuto e riprova."
      )
    }
    if (key === "auth/network-request-failed") {
      return tl(
        "Erro de rede. Verifique sua conexao.",
        "Network error. Check your connection.",
        "Error de red. Revisa tu conexion.",
        "Errore di rete. Controlla la connessione."
      )
    }
    if (key === "auth/user-disabled") {
      return tl(
        "Esta conta foi desativada.",
        "This account has been disabled.",
        "Esta cuenta ha sido desactivada.",
        "Questo account e stato disattivato."
      )
    }
    if (key === "auth/email-already-in-use") return t("login.error.emailInUse.body")
    if (key === "auth/invalid-email") return t("login.error.invalidEmail.body")
    if (key === "auth/weak-password") return t("login.error.weakPassword.body")
    return fallback || t("login.error.generic")
  }

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
    setAuthError("")
    if (!email || !password) {
      setAuthError(t("login.error.fillFields"))
      return
    }

    if (!isLogin) {
      if (!confirmPassword) {
        setAuthError(t("login.error.confirmPassword"))
        return
      }
      if (password !== confirmPassword) {
        setAuthError(t("login.error.passwordMismatch"))
        return
      }
      if (password.length < 6) {
        setAuthError(t("login.error.passwordMin"))
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
      setAuthError(mapAuthError(code, error?.message))
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setAuthError("")
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
      setAuthError(mapAuthError(error?.code, error?.message))
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
            <View style={styles.heroContainer}>
              <View style={styles.languageRow}>
                <TouchableOpacity style={styles.languagePill} onPress={() => setLanguageModalVisible(true)}>
                  <Ionicons name="language-outline" size={14} color="#E8EAF6" />
                  <Text style={styles.languagePillText}>
                    {tl("Idioma", "Language", "Idioma", "Lingua")}: {languages.find((item) => item.code === language)?.nativeLabel || language}
                  </Text>
                </TouchableOpacity>
              </View>

              <Logo tagline={t("login.tagline")} />
              <Text style={styles.brandTitle}>TABULA ESTELAR</Text>
              <Text style={styles.brandSubtitle}>
                {tl(
                  "Seu guia astrologico pessoal em tempo real",
                  "Your personal real-time astrology guide",
                  "Tu guia astrologica personal en tiempo real",
                  "La tua guida astrologica personale in tempo reale"
                )}
              </Text>
            </View>

            <View style={styles.formContainer}>
              <Text style={styles.formTitle}>
                {isLogin ? t("login.signIn") : t("login.createAccount")}
              </Text>

              {authError ? (
                <View style={styles.errorBanner}>
                  <Ionicons name="alert-circle" size={16} color="#FF8A80" />
                  <Text style={styles.errorBannerText}>{authError}</Text>
                </View>
              ) : null}

              <View style={styles.inputContainer}>
                <Ionicons name="mail" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder={t("login.email")}
                  placeholderTextColor="#666"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text)
                    if (authError) setAuthError("")
                  }}
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
                  onChangeText={(text) => {
                    setPassword(text)
                    if (authError) setAuthError("")
                  }}
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
                    onChangeText={(text) => {
                      setConfirmPassword(text)
                      if (authError) setAuthError("")
                    }}
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
                onPress={() => {
                  setIsLogin(!isLogin)
                  setAuthError("")
                }}
              >
                <Text style={styles.switchText}>
                  {isLogin ? t("login.noAccount") : t("login.haveAccount")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal visible={languageModalVisible} animationType="slide" transparent onRequestClose={() => setLanguageModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.languageModalCard}>
            <Text style={styles.languageModalTitle}>{tl("Idioma", "Language", "Idioma", "Lingua")}</Text>
            <Text style={styles.languageModalSubtitle}>
              {tl(
                "Escolha como deseja navegar no app",
                "Choose how you want to use the app",
                "Elige como quieres usar la app",
                "Scegli come vuoi usare l'app"
              )}
            </Text>

            {languages.map((option) => {
              const active = option.code === language
              return (
                <TouchableOpacity
                  key={option.code}
                  style={[styles.languageOption, active && styles.languageOptionActive]}
                  onPress={async () => {
                    await setLanguage(option.code)
                    setLanguageModalVisible(false)
                  }}
                >
                  <Ionicons name={active ? "radio-button-on" : "radio-button-off"} size={18} color={active ? "#FFD700" : "#A0A0A0"} />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.languageOptionText, active && styles.languageOptionTextActive]}>{option.nativeLabel}</Text>
                    <Text style={styles.languageOptionSubText}>{option.label}</Text>
                  </View>
                </TouchableOpacity>
              )
            })}

            <TouchableOpacity style={styles.languageCloseButton} onPress={() => setLanguageModalVisible(false)}>
              <Text style={styles.languageCloseButtonText}>{t("common.close")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  heroContainer: {
    width: '100%',
    backgroundColor: 'rgba(15, 24, 52, 0.72)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.18)',
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 18,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOpacity: 0.28,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
  },
  languageRow: {
    width: '100%',
    alignItems: 'flex-end',
  },
  languagePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(232, 234, 246, 0.35)',
    backgroundColor: 'rgba(36, 42, 72, 0.65)',
  },
  languagePillText: {
    color: '#E8EAF6',
    fontSize: 12,
    fontWeight: '600',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 10,
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
    marginTop: 6,
    textAlign: 'center',
    paddingHorizontal: 12,
    opacity: 0.9,
  },
  brandTitle: {
    color: '#F5F6FF',
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 1.2,
    textAlign: 'center',
    marginTop: 2,
  },
  brandSubtitle: {
    color: '#BAC2E0',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
  formContainer: {
    width: '100%',
    backgroundColor: 'rgba(44, 44, 46, 0.9)',
    borderRadius: 16,
    padding: 24,
    marginTop: 0,
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
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 138, 128, 0.55)',
    backgroundColor: 'rgba(59, 28, 34, 0.72)',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 14,
  },
  errorBannerText: {
    flex: 1,
    color: '#FFD0CC',
    fontSize: 12.5,
    lineHeight: 16,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.58)',
    justifyContent: 'center',
    padding: 20,
  },
  languageModalCard: {
    backgroundColor: '#121A35',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.2)',
    padding: 16,
  },
  languageModalTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
  },
  languageModalSubtitle: {
    color: '#B8C0DF',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 12,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  languageOptionActive: {
    borderColor: 'rgba(255,215,0,0.65)',
    backgroundColor: 'rgba(255,215,0,0.08)',
  },
  languageOptionText: {
    color: '#F1F3FF',
    fontSize: 14,
    fontWeight: '700',
  },
  languageOptionTextActive: {
    color: '#FFE37A',
  },
  languageOptionSubText: {
    color: '#9EA7CC',
    fontSize: 11.5,
    marginTop: 2,
  },
  languageCloseButton: {
    marginTop: 8,
    backgroundColor: '#FFD700',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 42,
  },
  languageCloseButtonText: {
    color: '#111',
    fontWeight: '800',
    fontSize: 14,
  },
})
