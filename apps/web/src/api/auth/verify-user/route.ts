'use server';

import axios from 'axios';

const BASE_URL = process.env.BASE_API_URL || 'http://localhost:8000/api/';

export default async function verifyUser({
  otpCode,
  id,
}: {
  otpCode: string;
  id: string;
}) {
  try {
    if (!otpCode || !id) {
      return {
        ok: false,
        message: 'Something went wrong',
      };
    }

    const res = await axios.post(`${BASE_URL}auth/otp-code?token=${id}`, {
      otpCode,
    });

    if (!res.data.ok) {
      return {
        ok: false,
        message: res.data.message,
      };
    }

    return {
      ok: true,
      message: res.data.message,
    };
  } catch (err: any) {
    return {
      ok: false,
      message: err?.response?.data?.message || 'Something went wrong',
    };
  }
}
