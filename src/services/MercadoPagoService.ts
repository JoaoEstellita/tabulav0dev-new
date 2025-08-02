import axios from 'axios';

const BACKEND_URL = 'https://tabulav0dev-backend.vercel.app/api/check-subscription';

export async function checkUserSubscription(email: string): Promise<{ active: boolean; status: string }> {
  try {
    const response = await axios.post(BACKEND_URL, { email });
    return response.data;
  } catch (error) {
    return { active: false, status: 'error' };
  }
}