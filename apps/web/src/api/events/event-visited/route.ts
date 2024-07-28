'use server';

import axios from 'axios';

const API_URL = process.env.BASE_API_URL || 'http://localhost:8000/api/';

export async function getEventVisited({ username }: { username: string }) {
  try {
    const { data } = await axios.get(`${API_URL}events/attended/${username}`);

    if (!data.ok) {
      return {
        ok: false,
        message: data.message,
      };
    }

    return {
      ok: true,
      data: data.data,
    };
  } catch (err: any) {
    return {
      ok: false,
      message: err?.response?.data?.message || 'Something went wrong',
    };
  }
}
