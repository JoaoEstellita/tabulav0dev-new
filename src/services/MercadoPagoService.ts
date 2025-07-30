import axios from 'axios';

const BACKEND_URL = 'https://SEU_BACKEND_URL/api/check-subscription'; // Substitua pela URL do seu backend

export async function checkUserSubscription(email: string): Promise<{ active: boolean; status: string }> {
  try {
    const response = await axios.post(BACKEND_URL, { email });
    return response.data;
  } catch (error) {
    return { active: false, status: 'error' };
  }
}