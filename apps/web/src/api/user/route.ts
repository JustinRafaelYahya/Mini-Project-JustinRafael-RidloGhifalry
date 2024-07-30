'use server';

import { cookies } from 'next/headers';
import axios from 'axios';
import { revalidatePath } from 'next/cache';
import { getCookie } from '@/actions/cookies';

const API_URL = process.env.BASE_API_URL || 'http://localhost:8000/api/';

export async function findMe(path?: string) {
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

  revalidatePath(path as string);

  return {
    ok: true,
    data: res.data,
  };
}

export async function findUserByUsername(username: string) {
  const res = await axios.get(`${API_URL}user/username/${username}`);

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

export async function updateUser(request: {
  id: number;
  username: string;
  profile_picture?: string | null;
  contact_number?: string | null;
  instagram?: string | null;
  facebook?: string | null;
  twitter?: string | null;
  path?: string;
}) {
  const {
    id,
    username,
    contact_number,
    instagram,
    facebook,
    twitter,
    profile_picture,
    path,
  } = request;

  try {
    const token = await getCookie('token');

    const res = await axios.patch(
      `${API_URL}user/me/${id}`,
      {
        username,
        profile_picture: profile_picture ? profile_picture : '',
        contact_number: contact_number ? contact_number : '',
        instagram: instagram ? instagram : '',
        facebook: facebook ? facebook : '',
        twitter: twitter ? twitter : '',
      },
      {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      },
    );

    if (res.status !== 200) {
      return {
        ok: false,
        message: res.data.message || 'Something went wrong!',
      };
    }

    revalidatePath(path as string);

    return {
      ok: true,
      message: res.data.message,
      user: res.data.user,
    };
  } catch (err: any) {
    return {
      ok: false,
      message: err?.response?.data?.message || 'Something went wrong',
    };
  }
}
