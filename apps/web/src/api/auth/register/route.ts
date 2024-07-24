'use server';

const BASE_URL = process.env.BASE_API_URL || 'http://localhost:8000/api/';

export default async function signUp(request: {
  username: string;
  role: string;
  email: string;
  password: string;
  contact_number?: string;
  referral_code?: string;
}) {
  const { referral_code, ...others } = request;

  const res = await fetch(
    `${BASE_URL}auth/register?referral_number=${referral_code}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(others),
    },
  );

  const data = await res.json();

  if (!data.ok) {
    return {
      ok: false,
      message: data.message,
    };
  }

  return {
    ok: true,
    message: 'Success register!',
  };
}
