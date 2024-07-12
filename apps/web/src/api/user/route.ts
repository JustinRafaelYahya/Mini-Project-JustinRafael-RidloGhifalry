'use server';

import { cookies } from 'next/headers';
import axios from 'axios';
import { revalidatePath } from 'next/cache';

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

export async function updateUser(request: {
  id: number;
  username: string;
  profile_picture?: string | null;
  contact_number?: string | null;
  instagram?: string | null;
  facebook?: string | null;
  twitter?: string | null;
  path: string;
}) {
  const token = cookies().get('token')?.value;

  if (!token) {
    return null;
  }

  const {
    id,
    username,
    contact_number,
    instagram,
    facebook,
    twitter,
    profile_picture,
  } = request;

  try {
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

    revalidatePath(request.path);

    return {
      ok: true,
      message: res.data.message,
    };
  } catch (err) {
    console.log('🚀 ~ err:', err);
    return {
      ok: false,
      message: 'Internal server error!',
    };
  }
}
