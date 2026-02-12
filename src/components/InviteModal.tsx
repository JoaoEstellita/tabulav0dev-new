/**
 * 📤 INVITE MODAL 📤
 * 
 * Modal completo para convidar pessoas para grupos
 * - Links dinâmicos
 * - QR Code automático
 * - Códigos de convite
 * - Compartilhamento nativo
 * - Interface moderna e intuitiva
 */

import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  StyleSheet,
  Dimensions,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import QRCodeGenerator from './QRCodeGenerator'
import GroupService from '../services/firebase/GroupService'
import InviteService from '../services/InviteService'
import type { Group } from '../services/firebase/GroupService'
import { getLifeAreaLabel } from '../constants/lifeAreas'

export interface InviteModalProps {
  visible: boolean
  group: Group | null
  onClose: () => void
  onInviteSent?: () => void
}

const { width: screenWidth } = Dimensions.get('window')

const formatLifeAreas = (areas?: string[]) => {
  if (!areas || areas.length === 0) return 'Todas as areas'
  return areas.map((area) => getLifeAreaLabel(area)).join(', ')
}

export default function InviteModal({
  visible,
  group,
  onClose,
  onInviteSent
}: InviteModalProps) {
  const [activeTab, setActiveTab] = useState<'link' | 'qr' | 'code' | 'email'>('link')
  const [emailText, setEmailText] = useState('')
  const [customMessage, setCustomMessage] = useState('')
  const [resolvedInviteCode, setResolvedInviteCode] = useState<string | null>(group?.inviteCode || null)

  useEffect(() => {
    if (!group) return
    let isActive = true

    setResolvedInviteCode(group.inviteCode || null)

    if (!group.inviteCode) {
      GroupService.ensureInviteCode(group.id).then((code) => {
        if (isActive && code) setResolvedInviteCode(code)
      })
    }

    return () => {
      isActive = false
    }
  }, [group?.id, group?.inviteCode])

  if (!group) return null

  const inviteCode = resolvedInviteCode
  const inviteLink = inviteCode ? InviteService.generateInviteLink(inviteCode) : ''
  const qrData = inviteCode ? InviteService.generateQRCodeData(group.name, inviteCode) : ''
  const sharedAreasText = formatLifeAreas(group.sharedLifeAreas)
  const notifiedAreasText = formatLifeAreas(group.notifiedLifeAreas)

  /**
   * Compartilha convite completo
   */
  const handleShare = async () => {
    try {
      if (!inviteCode) {
        Alert.alert('Aguarde', 'Gerando codigo de convite...')
        return
      }
      const success = await InviteService.shareInvite(group.name, inviteCode, {
        sharedLifeAreas: group.sharedLifeAreas,
        notifiedLifeAreas: group.notifiedLifeAreas,
      })
      if (success && onInviteSent) {
        onInviteSent()
      }
    } catch (error) {
      console.error('Erro ao compartilhar:', error)
    }
  }

  /**
   * Copia link para clipboard
   */
  const handleCopyLink = () => {
    if (!inviteCode) {
      Alert.alert('Aguarde', 'Gerando codigo de convite...')
      return
    }
    InviteService.copyToClipboard(inviteLink, 'Link copiado!')
  }

  /**
   * Copia código para clipboard
   */
  const handleCopyCode = () => {
    if (!inviteCode) {
      Alert.alert('Aguarde', 'Gerando codigo de convite...')
      return
    }
    InviteService.copyToClipboard(inviteCode, 'Codigo copiado!')
  }

  /**
   * Envia convite por email (simulado)
   */
  const handleSendEmail = () => {
    if (!emailText.trim()) {
      Alert.alert('Erro', 'Digite um email válido')
      return
    }

    // Por enquanto é uma simulação
    Alert.alert(
      'Email Enviado',
      `Convite enviado para ${emailText}`,
      [
        {
          text: 'OK',
          onPress: () => {
            setEmailText('')
            if (onInviteSent) onInviteSent()
          }
        }
      ]
    )
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          
          <View style={styles.headerInfo}>
            <Text style={styles.modalTitle}>📤 Convidar para o Grupo</Text>
            <Text style={styles.groupName}>{group.name}</Text>
          </View>
          
          <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
            <Ionicons name="share" size={20} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'link' && styles.activeTab]}
            onPress={() => setActiveTab('link')}
          >
            <Ionicons 
              name="link" 
              size={16} 
              color={activeTab === 'link' ? '#000' : '#888'} 
            />
            <Text style={[styles.tabText, activeTab === 'link' && styles.activeTabText]}>
              Link
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'qr' && styles.activeTab]}
            onPress={() => setActiveTab('qr')}
          >
            <Ionicons 
              name="qr-code" 
              size={16} 
              color={activeTab === 'qr' ? '#000' : '#888'} 
            />
            <Text style={[styles.tabText, activeTab === 'qr' && styles.activeTabText]}>
              QR Code
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'code' && styles.activeTab]}
            onPress={() => setActiveTab('code')}
          >
            <Ionicons 
              name="keypad" 
              size={16} 
              color={activeTab === 'code' ? '#000' : '#888'} 
            />
            <Text style={[styles.tabText, activeTab === 'code' && styles.activeTabText]}>
              Código
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'email' && styles.activeTab]}
            onPress={() => setActiveTab('email')}
          >
            <Ionicons 
              name="mail" 
              size={16} 
              color={activeTab === 'email' ? '#000' : '#888'} 
            />
            <Text style={[styles.tabText, activeTab === 'email' && styles.activeTabText]}>
              Email
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          
          {/* Tab: Link */}
          {activeTab === 'link' && (
            <View style={styles.tabContent}>
              <View style={styles.infoSection}>
                <Ionicons name="link" size={32} color="#4A90E2" />
                <Text style={styles.sectionTitle}>Link de Convite</Text>
                <Text style={styles.sectionDescription}>
                  Compartilhe este link para convidar pessoas diretamente
                </Text>
              </View>

              <View style={styles.linkContainer}>
                <Text style={styles.linkText} numberOfLines={2}>
                  {inviteLink || 'Gerando link...'}
                </Text>
                <TouchableOpacity onPress={handleCopyLink} style={styles.copyButton}>
                  <Ionicons name="copy" size={20} color="#4A90E2" />
                </TouchableOpacity>
              </View>

              <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.primaryButton} onPress={handleShare}>
                  <Ionicons name="share" size={20} color="#FFFFFF" />
                  <Text style={styles.primaryButtonText}>Compartilhar Link</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.inviteInfoBox}>
                <Text style={styles.inviteInfoTitle}>Areas compartilhadas no grupo</Text>
                <Text style={styles.inviteInfoText}>{sharedAreasText}</Text>
              </View>
              <View style={styles.inviteInfoBox}>
                <Text style={styles.inviteInfoTitle}>Areas notificadas no grupo</Text>
                <Text style={styles.inviteInfoText}>{notifiedAreasText}</Text>
              </View>
            </View>
          )}

          {/* Tab: QR Code */}
          {activeTab === 'qr' && (
            <View style={styles.tabContent}>
              <View style={styles.infoSection}>
                <Ionicons name="qr-code" size={32} color="#9C27B0" />
                <Text style={styles.sectionTitle}>Código QR</Text>
                <Text style={styles.sectionDescription}>
                  Escaneie com a câmera do celular para entrar no grupo
                </Text>
              </View>

              <QRCodeGenerator
                data={qrData}
                title={`Grupo: ${group.name}`}
                size={Math.min(screenWidth - 100, 220)}
                showActions={true}
              />
            </View>
          )}

          {/* Tab: Código */}
          {activeTab === 'code' && (
            <View style={styles.tabContent}>
              <View style={styles.infoSection}>
                <Ionicons name="keypad" size={32} color="#FFD700" />
                <Text style={styles.sectionTitle}>Código de Convite</Text>
                <Text style={styles.sectionDescription}>
                  Digite este código no app para entrar no grupo
                </Text>
              </View>

              <View style={styles.codeDisplay}>
                <Text style={styles.codeText}>
                  {inviteCode ? InviteService.formatCodeForDisplay(inviteCode) : '---- ----'}
                </Text>
                <TouchableOpacity onPress={handleCopyCode} style={styles.copyCodeButton}>
                  <Ionicons name="copy" size={24} color="#FFD700" />
                </TouchableOpacity>
              </View>

              <View style={styles.instructionBox}>
                <Text style={styles.instructionTitle}>📱 Como usar:</Text>
                <Text style={styles.instructionText}>
                  1. Abra o Tábula Estelar{'\n'}
                  2. Vá em "Grupos" → "Entrar"{'\n'}
                  3. Digite o código acima{'\n'}
                  4. Pronto! Você está no grupo ✨
                </Text>
              </View>

              <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.primaryButton} onPress={handleShare}>
                  <Ionicons name="share" size={20} color="#FFFFFF" />
                  <Text style={styles.primaryButtonText}>Compartilhar Código</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Tab: Email */}
          {activeTab === 'email' && (
            <View style={styles.tabContent}>
              <View style={styles.infoSection}>
                <Ionicons name="mail" size={32} color="#FF9800" />
                <Text style={styles.sectionTitle}>Convite por Email</Text>
                <Text style={styles.sectionDescription}>
                  Envie um convite personalizado diretamente por email
                </Text>
              </View>

              <View style={styles.formSection}>
                <Text style={styles.formLabel}>📧 Email do convidado:</Text>
                <TextInput
                  style={styles.emailInput}
                  placeholder="exemplo@email.com"
                  placeholderTextColor="#888"
                  value={emailText}
                  onChangeText={setEmailText}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />

                <Text style={styles.formLabel}>💬 Mensagem personalizada:</Text>
                <TextInput
                  style={styles.messageInput}
                  placeholder="Oi! Te convido para nosso grupo astrológico..."
                  placeholderTextColor="#888"
                  value={customMessage}
                  onChangeText={setCustomMessage}
                  multiline
                  numberOfLines={4}
                  maxLength={200}
                />
                <Text style={styles.characterCount}>
                  {customMessage.length}/200 caracteres
                </Text>
              </View>

              <View style={styles.actionButtons}>
                <TouchableOpacity 
                  style={[styles.primaryButton, !emailText.trim() && styles.disabledButton]} 
                  onPress={handleSendEmail}
                  disabled={!emailText.trim()}
                >
                  <Ionicons name="send" size={20} color="#FFFFFF" />
                  <Text style={styles.primaryButtonText}>Enviar Convite</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F23',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2E',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2C2C2E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerInfo: {
    flex: 1,
    alignItems: 'center',
  },
  modalTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  groupName: {
    color: '#FFD700',
    fontSize: 14,
    marginTop: 2,
    textAlign: 'center',
  },
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 6,
  },
  activeTab: {
    backgroundColor: '#FFD700',
  },
  tabText: {
    color: '#888',
    fontSize: 12,
    fontWeight: '500',
  },
  activeTabText: {
    color: '#000',
  },
  content: {
    flex: 1,
  },
  tabContent: {
    padding: 20,
    paddingBottom: 40,
  },
  infoSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 12,
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    lineHeight: 20,
  },
  linkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  linkText: {
    color: '#4A90E2',
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  },
  copyButton: {
    padding: 8,
  },
  codeDisplay: {
    alignItems: 'center',
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
  },
  codeText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFD700',
    letterSpacing: 4,
    marginBottom: 16,
  },
  copyCodeButton: {
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    padding: 12,
  },
  instructionBox: {
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  instructionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  instructionText: {
    fontSize: 14,
    color: '#888',
    lineHeight: 20,
  },
  formSection: {
    marginBottom: 24,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  emailInput: {
    backgroundColor: '#1C1C1E',
    borderRadius: 8,
    padding: 16,
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 16,
  },
  messageInput: {
    backgroundColor: '#1C1C1E',
    borderRadius: 8,
    padding: 16,
    color: '#FFFFFF',
    fontSize: 14,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  characterCount: {
    fontSize: 12,
    color: '#888',
    textAlign: 'right',
    marginTop: 4,
    marginBottom: 16,
  },
  actionButtons: {
    gap: 12,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4A90E2',
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  inviteInfoBox: {
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  inviteInfoTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
  },
  inviteInfoText: {
    color: '#888',
    fontSize: 13,
    lineHeight: 18,
  },
  disabledButton: {
    backgroundColor: '#555',
    opacity: 0.6,
  },
})
