import React, { useState } from 'react'
import { Alert } from 'react-native'
import BirthDataForm, { type BirthData } from './BirthDataForm'
import UserService from '../../services/firebase/UserService'
import { useAuth } from '../../hooks/useAuth'
import NatalAscService from '../../services/astrology/NatalAscService'

export default function BirthDataFormContainer() {
  const [loading, setLoading] = useState(false)
  const { user, checkBirthDataComplete } = useAuth()

  const handleComplete = async (birthData: BirthData) => {
    if (!user) {
      Alert.alert('Erro', 'Usuário não encontrado. Faça login novamente.')
      return
    }

    setLoading(true)

    try {
      await UserService.saveBirthData(user.uid, birthData)
      // Calcula e persiste automaticamente ASC/MC/cúspides (Casas Inteiras por padrão)
      try {
        await NatalAscService.computeAndPersist(
          user.uid,
          birthData.birthDate,
          birthData.birthTime,
          birthData.birthLocation.latitude,
          birthData.birthLocation.longitude,
          'whole-sign'
        )
      } catch (e) {
        console.warn('⚠️ Não foi possível calcular ASC natal automaticamente no onboarding:', (e as any)?.message || e)
      }
      
      // Atualizar estado de dados completos
      await checkBirthDataComplete()
      
      // Não mostrar alert, apenas redirecionar automaticamente
      console.log('Dados salvos com sucesso! Redirecionando...')
    } catch (error) {
      console.error('Erro ao salvar dados:', error)
      Alert.alert(
        'Erro', 
        'Não foi possível salvar seus dados. Tente novamente.',
        [{ text: 'OK', style: 'default' }]
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <BirthDataForm onComplete={handleComplete} loading={loading} />
  )
}
