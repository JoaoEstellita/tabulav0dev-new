// Nova função: checa assinatura via endpoint unificado
const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL || 'https://tabulav0dev-backend.vercel.app';

export async function checkUserSubscription(userId: string): Promise<{ active: boolean; status: string }> {
  try {
    const url = `${BACKEND_URL}/api/subscription`;
    console.log('🔗 Tentando acessar:', url);
    const response = await fetch(url, { 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'status', userId })
    });
    console.log('📡 Response status:', response.status);
    if (!response.ok) {
      console.log('❌ Response não ok:', response.status, response.statusText);
      return { active: false, status: 'error' };
    }
    const data = await response.json();
    console.log('✅ Response data:', data);
    return data;
  } catch (error) {
    console.error('❌ Erro na requisição:', error);
    return { active: false, status: 'error' };
  }
}