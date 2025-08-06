/**
 * 🔗 INVITE SERVICE 🔗
 * 
 * Serviço para gerenciamento de convites de grupos
 * - Geração de links dinâmicos
 * - Códigos QR automáticos
 * - Validação de convites
 * - Deep linking
 */

import * as Linking from 'expo-linking'
import { Share, Alert } from 'react-native'

export interface InviteData {
  groupId: string
  groupName: string
  inviteCode: string
  createdBy: string
  expiresAt?: Date
}

export class InviteService {
  
  // Base URL do app (será configurada para produção)
  private static readonly BASE_URL = 'https://tabulaestelar.com.br'
  
  /**
   * Gera link de convite dinâmico
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
  static async shareInvite(groupName: string, inviteCode: string): Promise<boolean> {
    try {
      const inviteLink = this.generateInviteLink(inviteCode)
      
      const message = this.buildInviteMessage(groupName, inviteCode, inviteLink)
      
      const result = await Share.share({
        message,
        title: `Convite - ${groupName}`,
        url: inviteLink // iOS específico
      })
      
      return result.action === Share.sharedAction
      
    } catch (error) {
      console.error('Erro ao compartilhar convite:', error)
      Alert.alert('Erro', 'Não foi possível compartilhar o convite')
      return false
    }
  }
  
  /**
   * Constrói mensagem de convite personalizada
   */
  private static buildInviteMessage(groupName: string, inviteCode: string, inviteLink: string): string {
    return `🌟 Você foi convidado para o grupo "${groupName}" no Tábula Estelar!

✨ Descubra como os astros influenciam nosso grupo e compartilhe energia positiva com todos os membros.

📱 Para entrar:
1. Baixe o app Tábula Estelar
2. Use o código: ${inviteCode}
3. Ou acesse: ${inviteLink}

🔮 Junte-se a nós na jornada astrológica!`
  }
  
  /**
   * Valida código de convite
   */
  static validateInviteCode(code: string): boolean {
    // Códigos devem ter 6 caracteres alfanuméricos
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
      
      if (parsedUrl.path?.includes('/join/')) {
        const inviteCode = parsedUrl.path.split('/join/')[1]
        
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
      // Se não for JSON válido, tenta como código simples
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
   * Copia código para clipboard com feedback
   */
  static async copyToClipboard(text: string, successMessage: string = 'Copiado!'): Promise<void> {
    try {
      // No React Native, usamos o Clipboard da react-native
      const { Clipboard } = await import('react-native')
      Clipboard.setString(text)
      Alert.alert('Sucesso', successMessage)
    } catch (error) {
      console.error('Erro ao copiar:', error)
      Alert.alert('Erro', 'Não foi possível copiar')
    }
  }
  
  /**
   * Gera novo código de convite
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
   * Formata código para exibição (ABC-123)
   */
  static formatCodeForDisplay(code: string): string {
    if (code.length === 6) {
      return `${code.slice(0, 3)}-${code.slice(3)}`
    }
    return code
  }
  
  /**
   * Remove formatação do código (ABC-123 -> ABC123)
   */
  static cleanCode(code: string): string {
    return code.replace(/[^A-Z0-9]/g, '').toUpperCase()
  }
}

export default InviteService