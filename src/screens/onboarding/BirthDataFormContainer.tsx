import React, { useState } from 'react'
import { Alert } from 'react-native'
import BirthDataForm, { type BirthData } from './BirthDataForm'
import UserService from '../../services/firebase/UserService'
import { useAuth } from '../../hooks/useAuth'

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
      
      // Atualizar estado de dados completos
      await checkBirthDataComplete()
      
      Alert.alert(
        'Sucesso!', 
        'Seus dados foram salvos com sucesso. Bem-vindo ao Tabula Estelar!',
        [{ text: 'Continuar', style: 'default' }]
      )
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