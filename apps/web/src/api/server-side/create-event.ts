'use server';
import axios from 'axios';
const base_api = 'http://localhost:8000';
import { cookies } from 'next/headers';

export async function createEvent(request: {
  name: string;
  tagline: string;
  about: string;
  event_type: string;
  thumbnail: string;
  seats: number;
  start_event: string;
  end_event: string;
  start_time: string;
  end_time: string;
  price: number;
  location: string;
  tags: string[];
}) {
  try {
    const requestData = {
      ...request,
      thumbnail: request.thumbnail || 'default',
    };

    console.log(request);
    const token = cookies().get('token')?.value;

    if (!token) {
      return null;
    }

    // Append form data
    const res = await axios.post(`${base_api}/api/events`, requestData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (err: any) {
    console.error(err);
    return {
      ok: false,
      message: err.message || 'Something went wrong',
    };
  }
}