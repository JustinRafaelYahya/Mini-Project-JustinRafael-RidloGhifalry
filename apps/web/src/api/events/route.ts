'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import axios from 'axios';
import { getCookie } from '@/actions/cookies';

const API_URL = process.env.BASE_API_URL || 'http://localhost:8000/api/';

export async function updateEvent({
  body,
  path,
  id,
}: {
  body: any;
  path: string;
  id: number;
}) {
  try {
    const token = await getCookie('token');
    const res = await axios.patch(`${API_URL}events/${id}`, body, {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    });

    if (!res.data.ok) {
      return {
        ok: false,
        message: res.data.message,
      };
    }

    revalidatePath(path);

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

export async function likeEvent({ id, path }: { id: number; path: string }) {
  try {
    const token = await getCookie('token');

    const res = await axios.post(
      `${API_URL}likes/${id}`,
      {},
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

    revalidatePath(path);

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
