import { useEffect, useState } from 'react';
import { checkUserSubscription } from '../services/MercadoPagoService';
import { useAuth } from './useAuth';
import { db } from '../config/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

// Dias de teste grátis
const TRIAL_DAYS = 7;

export function useSubscriptionCheck() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [subscription, setSubscription] = useState<{ active: boolean; status: string } | null>(null);
  const [trialActive, setTrialActive] = useState(true);

  useEffect(() => {
    async function check() {
      setLoading(true);
      if (!user?.uid || !user.email) {
        setLoading(false);
        setShowModal(false);
        return;
      }
      // Buscar data de início do teste grátis
      const userRef = doc(db, 'users', user.uid);
      let userDoc = await getDoc(userRef);
      let trialStart = userDoc.exists() ? userDoc.data().trialStart : null;
      if (!trialStart) {
        // Se não existe, salva agora
        trialStart = new Date().toISOString();
        await setDoc(userRef, { trialStart }, { merge: true });
      }
      // Verifica se ainda está no período de teste
      const diff = (Date.now() - new Date(trialStart).getTime()) / (1000 * 60 * 60 * 24);
      if (diff < TRIAL_DAYS) {
        setTrialActive(true);
        setShowModal(false);
        setLoading(false);
        return;
      }
      setTrialActive(false);
      // Fora do teste grátis, consulta assinatura
      const result = await checkUserSubscription(user.email);
      setSubscription(result);
      setShowModal(!result.active);
      setLoading(false);
    }
    check();
  }, [user]);

  return { loading, showModal, setShowModal, subscription, trialActive };
}