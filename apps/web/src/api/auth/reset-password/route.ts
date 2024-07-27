'use server';

import { getCookie } from '@/actions/cookies';
import axios from 'axios';

const BASE_URL = process.env.BASE_API_URL || 'http://localhost:8000/api/';

export async function resetPassword({
  currentPassword,
  newPassword,
}: {
  currentPassword: string;
  newPassword: string;
}) {
  try {
    const token = await getCookie('token');

    const res = await axios.patch(
      `${BASE_URL}auth/reset-password`,
      {
        currentPassword,
        newPassword,
      },
      {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      },
    );

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
