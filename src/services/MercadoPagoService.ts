// Nova função: checa assinatura via endpoint unificado
const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL || '';

export async function checkUserSubscription(userId: string): Promise<{ active: boolean; status: string }> {
  try {
  const url = `${BACKEND_URL}/api?route=subscription&action=status&userId=${encodeURIComponent(userId)}`;
    const response = await fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } });
    if (!response.ok) return { active: false, status: 'error' };
    return await response.json();
  } catch (error) {
    return { active: false, status: 'error' };
  }
}