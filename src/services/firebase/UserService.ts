import { doc, setDoc, updateDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { db, storage } from '../../config/firebase'
const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL || ''
import { ref, uploadBytes, uploadString, getDownloadURL } from 'firebase/storage'
import type { BirthData } from '../../screens/onboarding/BirthDataForm'
import { cleanUndefined } from '../../utils/clean'

export interface UserProfile {
  displayName: string
  email: string
  profilePhoto?: string
  birthDate?: string
  birthTime?: string
  birthLocation?: {
    city: string
    country: string
    latitude: number
    longitude: number
  }
  zodiacSign?: string
  birthDataComplete: boolean
  createdAt: Date
  lastBirthDataEdit?: Date
  preferences?: {
    notifications?: {
      criticalAlerts: boolean
      groupUpdates: boolean
      dailyHoroscope: boolean
    }
    privacy?: {
      showStatusToGroups: boolean
      allowGroupInvites: boolean
    }
  }
  stats?: {
    groupsJoined: number
    alertsSent: number
    alertsReceived: number
    daysActive: number
  }
  alertMessages?: {
    love: string
    career: string
    health: string
    family: string
    spirituality: string
  }
}

class UserService {
  private async uploadProfilePhoto(userId: string, photo: string): Promise<string> {
    const fileName = `profile-${Date.now()}.jpg`
    const storageRef = ref(storage, `users/${userId}/${fileName}`)

    // Se for data URL, usar uploadString; caso contrário, buscar o blob
    if (photo.startsWith('data:')) {
      const blob = await (await fetch(photo)).blob()
      await uploadBytes(storageRef, blob)
    } else if (photo.startsWith('http')) {
      return photo
    } else {
      const response = await fetch(photo)
      const blob = await response.blob()
      await uploadBytes(storageRef, blob)
    }
    return await getDownloadURL(storageRef)
  }

  async saveBirthData(userId: string, birthData: BirthData): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId)
      
      // Verificar se usuário já existe
      const userDoc = await getDoc(userRef)
      
      const updateData: any = cleanUndefined({
        displayName: birthData.fullName,
        birthDate: birthData.birthDate,
        birthTime: birthData.birthTime,
        birthLocation: birthData.birthLocation,
        birthDataComplete: true,
        lastBirthDataEdit: serverTimestamp(),
      })

      // Só adiciona foto se foi fornecida. Se base64/local URI, envia para Storage e salva URL.
      if (birthData.profilePhoto) {
        try {
          const isHttp = birthData.profilePhoto.startsWith('http')
          if (isHttp) {
            updateData.profilePhoto = birthData.profilePhoto
          } else {
            // Tenta Storage direto
            try {
              updateData.profilePhoto = await this.uploadProfilePhoto(userId, birthData.profilePhoto)
            } catch (e) {
              // Fallback via backend (CORS-free)
              if (BACKEND_URL) {
                const resp = await fetch(`${BACKEND_URL}/api/upload/profile-photo`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ userId, dataUrl: birthData.profilePhoto }),
                })
                if (resp.ok) {
                  const { url } = await resp.json()
                  updateData.profilePhoto = url
                } else {
                  console.warn('Upload backend falhou', await resp.text())
                }
              }
            }
          }
        } catch (err) {
          console.warn('⚠️ Falha ao processar foto. Prosseguindo sem foto.', err)
        }
      }

      if (userDoc.exists()) {
        // Atualizar usuário existente
        await updateDoc(userRef, updateData)
      } else {
        // Criar novo perfil completo
        const newUserData: UserProfile = {
          displayName: birthData.fullName,
          email: '',
          ...updateData,
          createdAt: new Date(),
          preferences: {
            notifications: {
              criticalAlerts: true,
              groupUpdates: true,
              dailyHoroscope: true,
            },
            privacy: {
              showStatusToGroups: true,
              allowGroupInvites: true,
            }
          },
          stats: {
            groupsJoined: 0,
            alertsSent: 0,
            alertsReceived: 0,
            daysActive: 1,
          },
          alertMessages: {
            love: "Meus trânsitos amorosos estão em fase crítica. Preciso de apoio!",
            career: "Minha carreira passa por um momento desafiador. Pedindo energias positivas!",
            health: "Minha saúde precisa de atenção especial agora. Enviando amor e luz!",
            family: "Questões familiares requerem minha atenção. Gratidão pelo suporte!",
            spirituality: "Meu crescimento espiritual está intenso. Compartilhando essa energia!",
          }
        }

        await setDoc(userRef, newUserData)
      }

      console.log('✅ Dados de nascimento salvos com sucesso!')
      console.log('📝 Nome:', birthData.fullName)
      console.log('📸 Foto:', birthData.profilePhoto ? 'Incluída' : 'Não fornecida')
    } catch (error) {
      console.error('❌ Erro ao salvar dados de nascimento:', error)
      throw new Error('Não foi possível salvar os dados de nascimento.')
    }
  }

  async canEditBirthData(userId: string): Promise<boolean> {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId))
      
      if (!userDoc.exists()) return true // Primeiro cadastro

      const userData = userDoc.data()
      const lastEdit = userData.lastBirthDataEdit

      if (!lastEdit) return true // Nunca editou

      // Verificar se passou 24 horas
      const now = new Date()
      const lastEditDate = lastEdit.toDate ? lastEdit.toDate() : new Date(lastEdit)
      const diffInHours = (now.getTime() - lastEditDate.getTime()) / (1000 * 60 * 60)

      return diffInHours >= 24
    } catch (error) {
      console.error('Erro ao verificar permissão de edição:', error)
      return false
    }
  }

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId))
      
      if (userDoc.exists()) {
        return userDoc.data() as UserProfile
      }
      
      return null
    } catch (error) {
      console.error('Erro ao buscar perfil do usuário:', error)
      return null
    }
  }

  async updateAlertMessage(userId: string, area: keyof UserProfile['alertMessages'], message: string): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId)
      
      await updateDoc(userRef, {
        [`alertMessages.${area}`]: message
      })

      console.log(`Mensagem de alerta para ${area} atualizada!`)
    } catch (error) {
      console.error('Erro ao atualizar mensagem de alerta:', error)
      throw new Error('Não foi possível atualizar a mensagem.')
    }
  }
}

export default new UserService()