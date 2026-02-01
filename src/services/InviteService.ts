/**
 *  INVITE SERVICE 
 * 
 * Servico para gerenciamento de convites de grupos
 * - Geracao de links dinamicos
 * - Codigos QR automaticos
 * - Validacao de convites
 * - Deep linking
 */

import * as Linking from 'expo-linking'
import { Share, Alert, Platform } from 'react-native'
import { getLifeAreaLabel } from '../constants/lifeAreas'

export interface InviteData {
  groupId: string
  groupName: string
  inviteCode: string
  createdBy: string
  expiresAt?: Date
}

export class InviteService {
  
  // Base URL do app (sera configurada para producao)
  private static readonly BASE_URL = 'https://tabulaestelar.com.br'

  /**
   * Gera link de convite dinamico
   */
  static generateInviteLink(inviteCode: string): string {
    return `${this.BASE_URL}/join/${inviteCode}`
  }

  /**
   * Gera dados para QR Code
   */
  static generateQRCodeData(groupName: string, inviteCode: string): string {
    const inviteData = {
      type: 'group_invite',
      groupName,
      code: inviteCode,
      app: 'tabula_estelar'
    }
    
    return JSON.stringify(inviteData)
  }

  /**
   * Compartilha convite usando Share API nativo
   */
  static async shareInvite(
    groupName: string,
    inviteCode: string,
    options?: { sharedLifeAreas?: string[]; notifiedLifeAreas?: string[] }
  ): Promise<boolean> {
    try {
      const inviteLink = this.generateInviteLink(inviteCode)
      
      const message = this.buildInviteMessage(groupName, inviteCode, inviteLink, options)
      
      const result = await Share.share({
        message,
        title: `Convite - ${groupName}`,
        url: inviteLink // iOS especifico
      })
      
      return result.action === Share.sharedAction
      
    } catch (error) {
      console.error('Erro ao compartilhar convite:', error)
      Alert.alert('Erro', 'Nao foi possivel compartilhar o convite')
      return false
    }
  }

  /**
   * Constroi mensagem de convite personalizada
   */
  private static buildInviteMessage(
    groupName: string,
    inviteCode: string,
    inviteLink: string,
    options?: { sharedLifeAreas?: string[]; notifiedLifeAreas?: string[] }
  ): string {
    const sharedAreas = this.formatLifeAreas(options?.sharedLifeAreas)
    const notifiedAreas = this.formatLifeAreas(options?.notifiedLifeAreas)

    return `Voce foi convidado para o grupo "${groupName}" no Tabula Estelar.

Areas compartilhadas: ${sharedAreas}
Areas notificadas: ${notifiedAreas}

Para entrar:
1. Baixe o app Tabula Estelar
2. Use o codigo: ${inviteCode}
3. Ou acesse: ${inviteLink}

Junte-se a nos na jornada astrologica.`
  }

  private static formatLifeAreas(areas?: string[]): string {
    if (!areas || areas.length === 0) return 'Todas as areas'
    return areas.map((area) => getLifeAreaLabel(area)).join(', ')
  }

  /**
   * Valida codigo de convite
   */
  static validateInviteCode(code: string): boolean {
    // Codigos devem ter 6 caracteres alfanumericos
    const codeRegex = /^[A-Z0-9]{6}$/
    return codeRegex.test(code.toUpperCase())
  }

  /**
   * Processa deep link de convite
   */
  static processInviteDeepLink(url: string): { inviteCode: string | null; isValid: boolean } {
    try {
      const parsedUrl = Linking.parse(url)
      
      // Formatos suportados:
      // https://tabulaestelar.com.br/join/ABC123
      // tabulaestelar://join/ABC123
      
      const path = parsedUrl.path || ''
      const normalizedPath = path.startsWith('/') ? path : `/${path}`

      if (normalizedPath.includes('/join/')) {
        const inviteCode = normalizedPath.split('/join/')[1].split('/')[0]

        if (this.validateInviteCode(inviteCode)) {
          return { inviteCode: inviteCode.toUpperCase(), isValid: true }
        }
      }
      
      return { inviteCode: null, isValid: false }
      
    } catch (error) {
      console.error('Erro ao processar deep link:', error)
      return { inviteCode: null, isValid: false }
    }
  }

  /**
   * Processa dados de QR Code
   */
  static processQRCodeData(qrData: string): { inviteCode: string | null; groupName: string | null; isValid: boolean } {
    try {
      const data = JSON.parse(qrData)
      
      if (data.type === 'group_invite' && data.app === 'tabula_estelar' && data.code) {
        const inviteCode = data.code
        
        if (this.validateInviteCode(inviteCode)) {
          return {
            inviteCode: inviteCode.toUpperCase(),
            groupName: data.groupName || null,
            isValid: true
          }
        }
      }
      
      return { inviteCode: null, groupName: null, isValid: false }
      
    } catch (error) {
      // Se nao for JSON valido, tenta como codigo simples
      if (this.validateInviteCode(qrData)) {
        return {
          inviteCode: qrData.toUpperCase(),
          groupName: null,
          isValid: true
        }
      }
      
      return { inviteCode: null, groupName: null, isValid: false }
    }
  }

  /**
   * Copia codigo para clipboard com feedback
   */
  static async copyToClipboard(text: string, successMessage: string = 'Copiado!'): Promise<void> {
    try {
      if (Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text)
        Alert.alert('Sucesso', successMessage)
        return
      }
      // No React Native, usamos o Clipboard da react-native
      const { Clipboard } = await import('react-native')
      Clipboard.setString(text)
      Alert.alert('Sucesso', successMessage)
    } catch (error) {
      console.error('Erro ao copiar:', error)
      Alert.alert('Erro', 'Nao foi possivel copiar')
    }
  }

  /**
   * Gera novo codigo de convite
   */
  static generateInviteCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let result = ''
    
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    
    return result
  }

  /**
   * Formata codigo para exibicao (ABC-123)
   */
  static formatCodeForDisplay(code: string): string {
    if (code.length === 6) {
      return `${code.slice(0, 3)}-${code.slice(3)}`
    }
    return code
  }

  /**
   * Remove formatacao do codigo (ABC-123 -> ABC123)
   */
  static cleanCode(code: string): string {
    return code.replace(/[^A-Z0-9]/g, '').toUpperCase()
  }
}

export default InviteService


