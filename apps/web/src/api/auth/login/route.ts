'use server';

import { cookies } from 'next/headers';
import axios from 'axios';

const BASE_URL = process.env.BASE_API_URL;

export default async function login(request: {
  email: string;
  password: string;
}) {
  const { email, password } = request;

  try {
    const res = await axios.post(`${BASE_URL}auth/login`, {
      email,
      password,
    });

    if (res.status !== 200) {
      return {
        ok: false,
        message: res.data.message,
      };
    }

    cookies().set({
      name: 'token',
      value: res.data.token,
      expires: new Date(Date.now() + 3 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });

    return {
      ok: true,
      message: res.data.message,
    };
  } catch (error: any) {
    return {
      ok: false,
      message: error.response.data.message,
    };
  }
}
