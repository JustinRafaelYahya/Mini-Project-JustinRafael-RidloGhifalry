// // web/src/api/purchase-ticket.ts
// web/src/api/purchase-ticket.ts
import axios from 'axios';

async function getTokenFromApi() {
  try {
    const res = await axios.get('/api/getToken');
    if (res.status !== 200) {
      throw new Error('Failed to retrieve token');
    }
    return res.data.token;
  } catch (error) {
    console.error('Error fetching token:', error);
    throw new Error('Failed to retrieve token');
  }
}

export async function purchaseTicket(eventId, discountCode, payWithPoints) {
  try {
    const token = await getTokenFromApi();

    console.log('Sending purchase request', {
      eventId,
      discountCode,
      payWithPoints,
    });

    const res = await axios.post(
      'http://localhost:8000/api/transactions/purchase',
      { eventId, discountCode, payWithPoints },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return res;
  } catch (error) {
    console.error('Error purchasing ticket:', error);
    throw new Error(error.response?.data?.message || 'An error occurred');
  }
}

export async function checkPurchaseStatus(eventId) {
  try {
    const token = await getTokenFromApi();

    const res = await axios.get(
      `http://localhost:8000/api/transactions/checkPurchaseStatus/${eventId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return res.data;
  } catch (error) {
    console.error('Error checking purchase status:', error);
    throw error;
  }
}

// import axios from 'axios';

// const base_api = 'http://localhost:8000';

// async function getTokenFromApi() {
//   try {
//     const res = await axios.get('/api/getToken');
//     return res.data.token;
//   } catch (error) {
//     console.error('Error fetching token:', error);
//     throw new Error('Failed to retrieve token');
//   }
// }

// export async function purchaseTicket(
//   eventId: any,
//   discountCode: string,
//   payWithPoints: boolean,
// ) {
//   try {
//     const token = await getTokenFromApi();

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
//       throw new Error(err?.response?.data?.message || 'An error occurred');
//     } else {
//       throw new Error('An error occurred');
//     }
//   }
// }

// export async function checkPurchaseStatus(eventId: any) {
//   try {
//     const token = await getTokenFromApi();

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
