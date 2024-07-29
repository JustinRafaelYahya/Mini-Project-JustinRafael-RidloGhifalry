'use server';
import axios from 'axios';
const base_api = 'http://localhost:8000';
import { cookies } from 'next/headers';

export async function createEvent(request: {
  name: string;
  tagline: string;
  about: string;
  event_type: string;
  thumbnail?: string;
  seats: number;
  start_event: string;
  end_event: string;
  start_time: string;
  end_time: string;
  discount_code?: number;
  discount_usage_limit?: number;
  price: number;
  location: string;
  tags: string[];
}) {
  try {
    const requestData = {
      ...request,
      thumbnail: request.thumbnail || '',
    };

    const token = cookies().get('token')?.value;

    if (!token) {
      return null;
    }

    const res = await axios.post(`${base_api}/api/events`, requestData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (err: any) {
    console.error(err);

    let errorMessage = err.message || 'Something went wrong';
    if (err.response) {
      if (err.response.status === 401) {
        errorMessage =
          'You are not authorized to create an event. Please ensure you are logged in as an organizer.';
      } else if (err.response.data && err.response.data.message) {
        errorMessage = err.response.data.message;
      }
    }

    return {
      ok: false,
      message: errorMessage,
    };
  }
}

// export async function createEvent(request: {
//   name: string;
//   tagline: string;
//   about: string;
//   event_type: string;
//   thumbnail?: string;
//   seats: number;
//   start_event: string;
//   end_event: string;
//   start_time: string;
//   end_time: string;
//   discount_code?: number;
//   discount_usage_limit?: number;
//   price: number;
//   location: string;
//   tags: string[];
// }) {
//   try {
//     const requestData = {
//       ...request,
//       thumbnail: request.thumbnail || '',
//     };

//     console.log(request);
//     const token = cookies().get('token')?.value;

//     if (!token) {
//       return null;
//     }

//     const res = await axios.post(`${base_api}/api/events`, requestData, {
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     return res.data;
//   } catch (err: any) {
//     console.error(err);
//     return {
//       ok: false,
//       message: err.message || 'Something went wrong',
//     };
//   }
// }
