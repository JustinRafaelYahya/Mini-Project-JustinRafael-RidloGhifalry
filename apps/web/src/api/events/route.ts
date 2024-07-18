'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import axios from 'axios';

const API_URL = process.env.BASE_API_URL;

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
    const token = cookies().get('token')?.value;

    if (!token) {
      return null;
    }

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
      message: err.response.data.message,
    };
  }
}
