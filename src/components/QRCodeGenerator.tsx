/**
 * 📱 QR CODE GENERATOR 📱
 * 
 * Componente para gerar e exibir códigos QR
 * - Gera QR Code automaticamente
 * - Compartilhamento direto (Share nativo — sem permissão de mídia)
 * - Fallback para dispositivos sem suporte
 */

import React, { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Alert, Dimensions } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import QRCode from 'react-native-qrcode-svg'
import { captureRef } from 'react-native-view-shot'

export interface QRCodeGeneratorProps {
  /**
   * Dados para gerar o QR Code
   */
  data: string
  
  /**
   * Título exibido acima do QR Code
   */
  title?: string
  
  /**
   * Tamanho do QR Code
   */
  size?: number
  
  /**
   * Mostrar botões de ação
   */
  showActions?: boolean
  
  /**
   * Callback quando QR Code é gerado
   */
  onGenerated?: () => void
}

const { width: screenWidth } = Dimensions.get('window')

export default function QRCodeGenerator({
  data,
  title = 'QR Code',
  size = Math.min(screenWidth - 80, 200),
  showActions = true,
  onGenerated
}: QRCodeGeneratorProps) {
  const [qrRef, setQrRef] = useState<any>(null)


  /**
   * Compartilha QR Code
   */
  const shareQRCode = async () => {
    try {
      if (!qrRef) {
        Alert.alert('Erro', 'QR Code não está pronto para compartilhar')
        return
      }
      
      const uri = await captureRef(qrRef, {
        format: 'png',
        quality: 1,
        result: 'tmpfile',
      })
      
      // Para compartilhamento, vamos usar o Share API com a imagem
      const { Share } = await import('react-native')
      
      await Share.share({
        url: uri,
        message: `QR Code - ${title}`,
      })
      
    } catch (error) {
      console.error('Erro ao compartilhar QR Code:', error)
      Alert.alert('Erro', 'Não foi possível compartilhar o QR Code')
    }
  }

  React.useEffect(() => {
    if (onGenerated) {
      onGenerated()
    }
  }, [data, onGenerated])

  return (
    <View style={styles.container}>
      {title && (
        <Text style={styles.title}>{title}</Text>
      )}
      
      <View style={styles.qrContainer} ref={setQrRef}>
        <QRCode
          value={data}
          size={size}
          color="#000000"
          backgroundColor="#FFFFFF"
          logo={undefined} // Podemos adicionar logo do app depois
          logoSize={size * 0.2}
          logoBackgroundColor="transparent"
          logoMargin={2}
          logoBorderRadius={10}
          quietZone={10}
        />
      </View>
      
      {showActions && (
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.shareButton]}
            onPress={shareQRCode}
          >
            <Ionicons name="share" size={20} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Compartilhar</Text>
          </TouchableOpacity>
        </View>
      )}
      
      <Text style={styles.instruction}>
        📱 Aponte a câmera do celular para escanear
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  qrContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  shareButton: {
    backgroundColor: '#2196F3',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  instruction: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    lineHeight: 18,
  },
})