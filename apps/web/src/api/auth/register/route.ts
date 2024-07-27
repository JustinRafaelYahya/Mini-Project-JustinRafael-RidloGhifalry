'use server';

const BASE_URL = process.env.BASE_API_URL || 'http://localhost:8000/api/';
import axios from 'axios';

export default async function signUp(request: {
  username: string;
  role: string;
  email: string;
  password: string;
  contact_number?: string;
  referral_code?: string;
}) {
  const { referral_code, ...others } = request;

  try {
    const { data } = await axios.post(
      `${BASE_URL}auth/register?referral_number=${referral_code}`,
      others,
    );

    if (!data.ok) {
      return {
        ok: false,
        message: data.message,
      };
    }

    return {
      ok: true,
      message: data.message,
    };
  } catch (err) {
    return {
      ok: false,
      message: 'Something went wrong!',
    };
  }
}
