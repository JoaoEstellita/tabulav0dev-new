import {
  collection,
  doc,
  addDoc,
  updateDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  arrayUnion,
  Timestamp,
} from "firebase/firestore"
import { db } from "../../config/firebase"
import NotificationService from "./NotificationService"
import UserService, { type UserProfile } from "./UserService"
import type { BirthData } from "../../screens/onboarding/BirthDataForm"

export interface CoupleRelationship {
  id: string
  partner1: {
    userId: string
    displayName: string
    birthSign: string
    birthData: BirthData
  }
  partner2: {
    userId: string
    displayName: string
    birthSign: string
    birthData: BirthData
  }
  relationshipType: "dating" | "engaged" | "married" | "complicated"
  startDate: Date
  isPublic: boolean
  
  // Compatibilidade baseada na API Prokerala
  dailyCompatibility?: {
    date: string
    overallScore: number
    areas: {
      romance: number
      communication: number
      trust: number
      harmony: number
    }
    description: string
    advice: string
    lastUpdated: Date
  }
  
  // Histórico de compatibilidade
  compatibilityHistory: Array<{
    date: string
    score: number
    highlights: string[]
  }>
  
  createdAt: Date
}

export interface LoveCompatibilityResult {
  overallScore: number
  areas: {
    romance: number
    communication: number
    trust: number
    harmony: number
  }
  description: string
  advice: string
  date: string
}

class CoupleService {
  
  /**
   * Calcula o signo zodiacal baseado na data de nascimento
   */
  private calculateZodiacSign(birthDate: string): string {
    const date = new Date(birthDate)
    const month = date.getMonth() + 1 // getMonth() retorna 0-11
    const day = date.getDate()
    
    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "aries"
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "taurus"
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "gemini"
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "cancer"
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "leo"
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "virgo"
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "libra"
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "scorpio"
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "sagittarius"
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "capricorn"
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "aquarius"
    if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return "pisces"
    
    return "unknown"
  }
  
  /**
   * Simula compatibilidade diária entre dois signos
   * TODO: Integrar com API Prokerala quando endpoint /horoscope/daily/love-compatibility estiver disponível
   */
  async getDailyLoveCompatibility(
    sign1: string, 
    sign2: string, 
    date: string = new Date().toISOString().split('T')[0]
  ): Promise<LoveCompatibilityResult> {
    
    // Por enquanto, usa algoritmo baseado em compatibilidade tradicional de signos
    const compatibilityMatrix: Record<string, Record<string, number>> = {
      aries: { leo: 85, sagittarius: 80, gemini: 75, aquarius: 70, aries: 65 },
      taurus: { virgo: 85, capricorn: 80, cancer: 75, pisces: 70, taurus: 65 },
      gemini: { libra: 85, aquarius: 80, leo: 75, aries: 70, gemini: 65 },
      cancer: { scorpio: 85, pisces: 80, taurus: 75, virgo: 70, cancer: 65 },
      leo: { aries: 85, sagittarius: 80, gemini: 75, libra: 70, leo: 65 },
      virgo: { taurus: 85, capricorn: 80, cancer: 75, scorpio: 70, virgo: 65 },
      libra: { gemini: 85, aquarius: 80, leo: 75, sagittarius: 70, libra: 65 },
      scorpio: { cancer: 85, pisces: 80, virgo: 75, capricorn: 70, scorpio: 65 },
      sagittarius: { leo: 85, aries: 80, libra: 75, aquarius: 70, sagittarius: 65 },
      capricorn: { virgo: 85, taurus: 80, scorpio: 75, pisces: 70, capricorn: 65 },
      aquarius: { libra: 85, gemini: 80, sagittarius: 75, aries: 70, aquarius: 65 },
      pisces: { scorpio: 85, cancer: 80, capricorn: 75, taurus: 70, pisces: 65 }
    }
    
    const baseScore = compatibilityMatrix[sign1]?.[sign2] || 
                     compatibilityMatrix[sign2]?.[sign1] || 
                     50 // Compatibilidade neutra como fallback
    
    // Adiciona variação diária baseada na data
    const dateValue = new Date(date).getTime()
    const dailyVariation = (dateValue % 20) - 10 // Variação de -10 a +10
    const finalScore = Math.max(20, Math.min(95, baseScore + dailyVariation))
    
    // Calcula áreas baseadas no score geral
    const areas = {
      romance: Math.max(30, Math.min(95, finalScore + ((dateValue % 15) - 7))),
      communication: Math.max(30, Math.min(95, finalScore + ((dateValue % 13) - 6))),
      trust: Math.max(30, Math.min(95, finalScore + ((dateValue % 11) - 5))),
      harmony: Math.max(30, Math.min(95, finalScore + ((dateValue % 17) - 8)))
    }
    
    // Gera descrição e conselho baseado no score
    let description: string
    let advice: string
    
    if (finalScore >= 80) {
      description = `Excelente sintonia entre ${sign1} e ${sign2} hoje! A energia está fluindo harmoniosamente.`
      advice = "Aproveitem este momento especial para fortalecer ainda mais a conexão de vocês."
    } else if (finalScore >= 60) {
      description = `Boa compatibilidade entre ${sign1} e ${sign2}. Dia favorável para o relacionamento.`
      advice = "Mantenham o diálogo aberto e cultivem a compreensão mútua."
    } else if (finalScore >= 40) {
      description = `Compatibilidade moderada entre ${sign1} e ${sign2}. Alguns ajustes podem ser necessários.`
      advice = "Pratiquem a paciência e busquem entender melhor o ponto de vista do parceiro."
    } else {
      description = `Dia desafiador para ${sign1} e ${sign2}. Tensões podem surgir mais facilmente.`
      advice = "Evitem discussões desnecessárias e foquem no que os une ao invés do que os separa."
    }
    
    return {
      overallScore: finalScore,
      areas,
      description,
      advice,
      date
    }
  }
  
  /**
   * Cria relacionamento entre dois usuários
   */
  async createCoupleRelationship(
    user1Id: string,
    user2Id: string,
    relationshipType: CoupleRelationship['relationshipType']
  ): Promise<string> {
    
    try {
      // Buscar dados dos usuários
      const [user1Doc, user2Doc] = await Promise.all([
        getDoc(doc(db, 'users', user1Id)),
        getDoc(doc(db, 'users', user2Id))
      ])
      
      if (!user1Doc.exists() || !user2Doc.exists()) {
        throw new Error('Um ou ambos os usuários não foram encontrados')
      }
      
      const user1Data = user1Doc.data() as UserProfile
      const user2Data = user2Doc.data() as UserProfile
      
      // Calcular signos baseados nas datas de nascimento
      const sign1 = this.calculateZodiacSign(user1Data.birthDate || '')
      const sign2 = this.calculateZodiacSign(user2Data.birthDate || '')
      
      // Buscar compatibilidade inicial
      const initialCompatibility = await this.getDailyLoveCompatibility(sign1, sign2)
      
      const coupleData = {
        partner1: {
          userId: user1Id,
          displayName: user1Data.displayName || user1Data.fullName || 'Usuário 1',
          birthSign: sign1,
          birthData: {
            fullName: user1Data.fullName,
            birthDate: user1Data.birthDate,
            birthTime: user1Data.birthTime,
            birthLocation: user1Data.birthLocation
          }
        },
        partner2: {
          userId: user2Id,
          displayName: user2Data.displayName || user2Data.fullName || 'Usuário 2',
          birthSign: sign2,
          birthData: {
            fullName: user2Data.fullName,
            birthDate: user2Data.birthDate,
            birthTime: user2Data.birthTime,
            birthLocation: user2Data.birthLocation
          }
        },
        relationshipType,
        startDate: new Date(),
        isPublic: false,
        dailyCompatibility: {
          ...initialCompatibility,
          lastUpdated: new Date()
        },
        compatibilityHistory: [{
          date: initialCompatibility.date,
          score: initialCompatibility.overallScore,
          highlights: [initialCompatibility.description]
        }],
        createdAt: new Date()
      }
      
      const docRef = await addDoc(collection(db, "couples"), coupleData)
      
      console.log(`💕 Relacionamento criado: ${sign1} + ${sign2} = ${initialCompatibility.overallScore}%`)
      
      return docRef.id
    } catch (error) {
      console.error('Erro ao criar relacionamento:', error)
      throw new Error('Não foi possível criar o relacionamento')
    }
  }
  
  /**
   * Busca relacionamento do usuário
   */
  async getUserCoupleRelationship(userId: string): Promise<CoupleRelationship | null> {
    try {
      const q = query(
        collection(db, "couples"),
        where("partner1.userId", "==", userId)
      )
      
      const q2 = query(
        collection(db, "couples"),
        where("partner2.userId", "==", userId)
      )
      
      const [querySnapshot1, querySnapshot2] = await Promise.all([
        getDocs(q),
        getDocs(q2)
      ])
      
      let relationshipDoc = null
      
      if (!querySnapshot1.empty) {
        relationshipDoc = querySnapshot1.docs[0]
      } else if (!querySnapshot2.empty) {
        relationshipDoc = querySnapshot2.docs[0]
      }
      
      if (relationshipDoc) {
        return {
          id: relationshipDoc.id,
          ...relationshipDoc.data(),
          startDate: relationshipDoc.data().startDate.toDate(),
          createdAt: relationshipDoc.data().createdAt.toDate(),
          dailyCompatibility: {
            ...relationshipDoc.data().dailyCompatibility,
            lastUpdated: relationshipDoc.data().dailyCompatibility?.lastUpdated?.toDate()
          }
        } as CoupleRelationship
      }
      
      return null
    } catch (error) {
      console.error('Erro ao buscar relacionamento:', error)
      return null
    }
  }
  
  /**
   * Atualiza compatibilidade diária
   */
  async updateDailyCompatibility(coupleId: string): Promise<void> {
    try {
      const coupleDoc = await getDoc(doc(db, "couples", coupleId))
      
      if (!coupleDoc.exists()) {
        throw new Error('Relacionamento não encontrado')
      }
      
      const couple = coupleDoc.data() as CoupleRelationship
      
      const newCompatibility = await this.getDailyLoveCompatibility(
        couple.partner1.birthSign,
        couple.partner2.birthSign
      )
      
      // Atualizar no Firestore
      await updateDoc(doc(db, "couples", coupleId), {
        dailyCompatibility: {
          ...newCompatibility,
          lastUpdated: new Date()
        },
        compatibilityHistory: arrayUnion({
          date: newCompatibility.date,
          score: newCompatibility.overallScore,
          highlights: [newCompatibility.description]
        })
      })
      
      // Se compatibilidade crítica, enviar notificação
      if (newCompatibility.overallScore < 40) {
        await this.sendCriticalCompatibilityAlert(couple, newCompatibility)
      }
      
      console.log(`💕 Compatibilidade atualizada: ${newCompatibility.overallScore}%`)
    } catch (error) {
      console.error('Erro ao atualizar compatibilidade:', error)
      throw error
    }
  }
  
  /**
   * Sistema de notificações para casais
   */
  private async sendCriticalCompatibilityAlert(
    couple: CoupleRelationship, 
    compatibility: LoveCompatibilityResult
  ): Promise<void> {
    
    const alertMessage = `⚠️ Atenção ${couple.partner1.displayName} e ${couple.partner2.displayName}! 
Compatibilidade baixa hoje (${compatibility.overallScore}%). 
Dica: ${compatibility.advice}`
    
    try {
      // Enviar para ambos os parceiros
      await Promise.all([
        NotificationService.sendNotificationToUser(
          couple.partner1.userId,
          {
            title: "Alerta de Relacionamento",
            body: alertMessage,
          }
        ),
        NotificationService.sendNotificationToUser(
          couple.partner2.userId,
          {
            title: "Alerta de Relacionamento",
            body: alertMessage,
          }
        )
      ])
      
      console.log('💕🚨 Alerta de relacionamento enviado para ambos os parceiros')
    } catch (error) {
      console.error('Erro ao enviar alerta de relacionamento:', error)
    }
  }
  
  /**
   * Exclui relacionamento
   */
  async deleteCoupleRelationship(coupleId: string): Promise<void> {
    try {
      await updateDoc(doc(db, "couples", coupleId), {
        isActive: false,
        deletedAt: new Date()
      })
      
      console.log('💔 Relacionamento excluído')
    } catch (error) {
      console.error('Erro ao excluir relacionamento:', error)
      throw error
    }
  }
}

export default new CoupleService()
