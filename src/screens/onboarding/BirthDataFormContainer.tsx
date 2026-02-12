import React, { useState } from 'react'
import { Alert } from 'react-native'
import BirthDataForm, { type BirthData } from './BirthDataForm'
import UserService from '../../services/firebase/UserService'
import { useAuth } from '../../hooks/useAuth'
import NatalAscService from '../../services/astrology/NatalAscService'
import { useAppLanguage } from '../../hooks/useAppLanguage'

export default function BirthDataFormContainer() {
  const [loading, setLoading] = useState(false)
  const { user, checkBirthDataComplete } = useAuth()
  const { t } = useAppLanguage()

  const handleComplete = async (birthData: BirthData) => {
    if (!user) {
      Alert.alert(t('common.error'), t('onboarding.error.userNotFound'))
      return
    }

    setLoading(true)

    try {
      await UserService.saveBirthData(user.uid, birthData)
      // Calcula e persiste automaticamente ASC/MC/cuspides (Casas Inteiras por padrao)
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
        console.warn('Nao foi possivel calcular ASC natal automaticamente no onboarding:', (e as any)?.message || e)
      }

      await checkBirthDataComplete()
      console.log('Dados salvos com sucesso! Redirecionando...')
    } catch (error) {
      console.error('Erro ao salvar dados:', error)
      Alert.alert(t('common.error'), t('onboarding.error.saveFailed'), [
        { text: t('common.close'), style: 'default' },
      ])
    } finally {
      setLoading(false)
    }
  }

  return <BirthDataForm onComplete={handleComplete} loading={loading} />
}
