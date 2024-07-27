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
export async function purchaseTicket(
  eventId: any,
  discountCode: string,
  payWithPoints: boolean,
) {
  try {
    const token = cookies().get('token')?.value;

    if (!token) {
      throw new Error('Authentication token not found');
    }

    console.log('Sending purchase request', {
      eventId,
      discountCode,
      payWithPoints,
    });

    const res = await axios.post(
      `${base_api}/api/transactions/purchase`,
      { eventId, discountCode, payWithPoints },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJqdXN0aW55QGdtYWlsLmNvbSIsInVzZXJuYW1lIjoiSnVzdGluIFlhaHlhIiwicm9sZSI6IkNVU1RPTUVSIiwiaWF0IjoxNzIxOTMzMTc2LCJleHAiOjE3MjIxOTIzNzZ9.qRNiR7SxotYYkBBujKmIJ3lKx5MOrOOIn-KAPW79X70`,
        },
      },
    );

    return res;
  } catch (err: any) {
    console.error(err);

    if (err.response && err.response.data) {
      // Extract and throw specific error message from the response
      throw new Error(err.response.data.message || 'An error occurred');
    } else {
      throw new Error('An error occurred');
    }
  }
}

export async function checkPurchaseStatus(eventId: any) {
  try {
    const token = cookies().get('token')?.value;
    // const token = req.headers.cookie.token;

    if (!token) {
      throw new Error('Authentication token not found');
    }

    const res = await axios.get(
      `${base_api}/api/transactions/checkPurchaseStatus/${eventId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJqdXN0aW55QGdtYWlsLmNvbSIsInVzZXJuYW1lIjoiSnVzdGluIFlhaHlhIiwicm9sZSI6IkNVU1RPTUVSIiwiaWF0IjoxNzIxOTMzMTc2LCJleHAiOjE3MjIxOTIzNzZ9.qRNiR7SxotYYkBBujKmIJ3lKx5MOrOOIn-KAPW79X70`,
        },
      },
    );

    return res.data;
  } catch (err: any) {
    console.error(err);
    throw err;
  }
}

// export async function purchaseTicket(
//   eventId: any,
//   discountCode: string,
//   payWithPoints: boolean,
// ) {
//   try {
//     const token = cookies().get('token')?.value;

//     if (!token) {
//       throw new Error('Authentication token not found');
//     }

//     console.log('Sending purchase request', {
//       eventId,
//       discountCode,
//       payWithPoints,
//     });

//     const res = await axios.post(
//       `${base_api}/api/transactions/purchase`,
//       { eventId, discountCode, payWithPoints },
//       {
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//       },
//     );

//     return res;
//   } catch (err: any) {
//     console.error(err);

//     if (err.response && err.response.data) {
//       // Extract and throw specific error message from the response
//       throw new Error(err.response.data.message || 'An error occurred');
//     } else {
//       throw new Error('An error occurred');
//     }
//   }
// }

// export async function checkPurchaseStatus(eventId: any) {
//   try {
//     const token = cookies().get('token')?.value;

//     if (!token) {
//       throw new Error('Authentication token not found');
//     }

//     const res = await axios.get(
//       `${base_api}/api/transactions/checkPurchaseStatus/${eventId}`,
//       {
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//       },
//     );

//     return res.data;
//   } catch (err: any) {
//     console.error(err);
//     throw err;
//   }
// }
