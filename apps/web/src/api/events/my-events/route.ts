'use server';

import { revalidatePath } from 'next/cache';
import axios from 'axios';
import { getCookie } from '@/actions/cookies';

const API_URL = process.env.BASE_API_URL;

export async function getMyEvents() {
  try {
    const token = await getCookie('token');

    const res = await axios.get(`${API_URL}events/my-events`, {
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

    return {
      ok: true,
      data: res.data,
    };
  } catch (err: any) {
    return {
      ok: false,
      message: err?.response?.data?.message || 'Something went wrong',
    };
  }
}

export async function deleteEvent({ id, path }: { id: number; path: string }) {
  try {
    const token = await getCookie('token');
    const res = await axios.delete(`${API_URL}events/${id}`, {
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
