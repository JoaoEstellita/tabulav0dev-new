import axios from 'axios';

const BACKEND_URL = (process.env.EXPO_PUBLIC_BACKEND_URL || '') + '/api/check-subscription';

export async function checkUserSubscription(email: string): Promise<{ active: boolean; status: string }> {
  try {
    const response = await axios.post(BACKEND_URL, { email });
    return response.data;
  } catch (error) {
    return { active: false, status: 'error' };
  }
}