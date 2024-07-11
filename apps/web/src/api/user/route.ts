'use server';

import { cookies } from 'next/headers';
import axios from 'axios';

const API_URL = process.env.BASE_API_URL;

export async function findMe() {
  const token = cookies().get('token')?.value;

  if (!token) {
    return null;
  }

  const res = await axios.get(`${API_URL}user/me`, {
    headers: {
      Authorization: 'Bearer ' + token,
    },
  });

  if (res.status !== 200) {
    return {
      ok: false,
      message: res.data.message,
    };
  }

  return {
    ok: true,
    data: res.data,
  };
}
