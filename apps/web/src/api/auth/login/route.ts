'use server';

import { cookies } from 'next/headers';
import axios from 'axios';

export default async function login(request: {
  email: string;
  password: string;
}) {
  const { email, password } = request;

  const res = await axios.post('http://localhost:8000/api/auth/login', {
    email,
    password,
  });

  if (res.status !== 200) {
    return {
      ok: false,
      message: res.data.message,
    };
  }

  // set cookie
  cookies().set({
    name: 'token',
    value: res.data.token,
    expires: new Date(Date.now() + 3 * 60 * 60 * 1000), // Expires in 1 day
    httpOnly: true, // Optional: makes the cookie inaccessible to JavaScript on the client side
    secure: process.env.NODE_ENV === 'production', // Optional: ensures the cookie is only sent over HTTPS in production
    sameSite: 'strict', // Optional: prevents CSRF attacks
    path: '/', // Optional: makes the cookie available across the entire site
  });

  return {
    ok: true,
    message: res.data.message,
  };
}
