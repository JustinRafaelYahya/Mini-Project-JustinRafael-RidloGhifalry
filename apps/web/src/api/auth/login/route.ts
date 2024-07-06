'use server';

import { cookies } from 'next/headers';

export default async function login(request: {
  email: string;
  password: string;
}) {
  const { email, password } = request;

  const res = await fetch('http://localhost:8000/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!data.ok) {
    return {
      ok: false,
      message: data.message,
    };
  }

  cookies().set({
    name: 'token',
    value: data.token,
  });

  return {
    ok: true,
    message: data.message,
  };
}
