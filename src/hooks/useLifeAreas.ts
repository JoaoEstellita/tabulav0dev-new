import { useState, useEffect } from 'react'
import { useAuth } from './useAuth'
import TransitService, { type TransitData, type LifeArea } from '../services/prokerala/TransitService'
import UserService from '../services/firebase/UserService'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../config/firebase'

export interface UseLifeAreasReturn {
  transitData: TransitData | null
  loading: boolean
  error: string | null
  refreshData: () => Promise<void>
  sendCriticalAlerts: () => Promise<void>
}

export function useLifeAreas(): UseLifeAreasReturn {
  const { user } = useAuth()
  const [transitData, setTransitData] = useState<TransitData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      loadTransitData()
    }
  }, [user])

  const loadTransitData = async () => {
    if (!user) return

    try {
      setLoading(true)
      setError(null)

      // Buscar dados de nascimento do usuário
      const userProfile = await UserService.getUserProfile(user.uid)
      
      if (!userProfile?.birthDate || !userProfile?.birthTime || !userProfile?.birthLocation) {
        setError('Dados de nascimento incompletos')
        return
      }

      // Criar objeto BirthData
      const birthData = {
        birthDate: userProfile.birthDate,
        birthTime: userProfile.birthTime,
        birthLocation: userProfile.birthLocation,
      }

      // Buscar trânsitos atuais
      const data = await TransitService.getCurrentTransits(birthData)
      setTransitData(data)

      console.log('Dados de trânsito carregados:', data)
    } catch (err) {
      console.error('Erro ao carregar dados de trânsito:', err)
      setError('Erro ao carregar dados astrológicos')
    } finally {
      setLoading(false)
    }
  }

  const refreshData = async () => {
    await loadTransitData()
  }

  const sendCriticalAlerts = async () => {
    if (!transitData || !user) return

    try {
      // Identificar áreas críticas
      const criticalAreas = transitData.lifeAreas.filter(area => area.criticalLevel)
      
      if (criticalAreas.length === 0) {
        console.log('Nenhuma área crítica detectada')
        return
      }

      // Buscar grupos do usuário
      const userGroups = await getUserGroups(user.uid)
      
      if (userGroups.length === 0) {
        console.log('Usuário não participa de nenhum grupo')
        return
      }

      // Buscar mensagens personalizadas do usuário
      const userProfile = await UserService.getUserProfile(user.uid)
      const alertMessages = userProfile?.alertMessages

      // Enviar alertas para cada área crítica
      for (const area of criticalAreas) {
        const message = alertMessages?.[area.name] || getDefaultMessage(area.name)
        
        // Enviar para todos os grupos do usuário
        for (const groupId of userGroups) {
          await sendAlertToGroup(groupId, {
            userId: user.uid,
            userName: userProfile?.displayName || 'Usuário',
            area: area.name,
            message,
            status: area.status,
            timestamp: new Date(),
          })
        }
      }

      console.log(`Alertas enviados para ${criticalAreas.length} áreas críticas`)
    } catch (err) {
      console.error('Erro ao enviar alertas críticos:', err)
    }
  }

  return {
    transitData,
    loading,
    error,
    refreshData,
    sendCriticalAlerts,
  }
}

// Funções auxiliares
async function getUserGroups(userId: string): Promise<string[]> {
  try {
    // Buscar grupos onde o usuário é membro
    // Implementação simplificada - em produção, usar query otimizada
    const userDoc = await getDoc(doc(db, 'users', userId))
    const userData = userDoc.data()
    
    // Por enquanto, retorna array vazio
    // TODO: implementar busca real de grupos do usuário
    return []
  } catch (error) {
    console.error('Erro ao buscar grupos do usuário:', error)
    return []
  }
}

async function sendAlertToGroup(groupId: string, alert: any) {
  try {
    // Implementar envio de alerta para grupo
    // TODO: salvar alerta na coleção groupAlerts
    console.log(`Alerta enviado para grupo ${groupId}:`, alert)
  } catch (error) {
    console.error('Erro ao enviar alerta para grupo:', error)
  }
}

function getDefaultMessage(area: LifeArea['name']): string {
  const defaultMessages = {
    love: "Meus trânsitos amorosos estão em fase crítica. Preciso de apoio!",
    career: "Minha carreira passa por um momento desafiador. Pedindo energias positivas!",
    health: "Minha saúde precisa de atenção especial agora. Enviando amor e luz!",
    family: "Questões familiares requerem minha atenção. Gratidão pelo suporte!",
    spirituality: "Meu crescimento espiritual está intenso. Compartilhando essa energia!",
  }

  return defaultMessages[area]
}