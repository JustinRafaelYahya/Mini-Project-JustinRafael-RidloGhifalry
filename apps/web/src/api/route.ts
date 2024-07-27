import axios from 'axios';
import Cookies from 'js-cookie';

const base_api = 'http://localhost:8000/api/';

async function getToken() {
  const token = Cookies.get('token');
  if (!token) {
    throw new Error('Authentication token not found');
  }
  return token;
}

export async function getAllEvents(page: number = 1) {
  console.log(base_api);
  try {
    // Include page as a query parameter
    const res = await axios.get(`${base_api}events/`, {
      params: { page },
    });

    return res;
  } catch (err: any) {
    console.error(err);
  }
}

export async function getEventById(id: string) {
  try {
    const res = await axios.get(`${base_api}events/event-detail/${id}`);
    return res;
  } catch (err: any) {
    console.error(err);
  }
}

export async function getEventsByFilter(
  category: string,
  location: string,
  date_filter: string,
  page: number = 1,
  query: string = '',
) {
  try {
    const params: any = {
      event_type: category,
      page, // Include page as a query parameter
    };

    if (location !== 'All') {
      params.location = location;
    }
    if (date_filter && date_filter !== 'all') {
      params.date_filter = date_filter;
    }
    if (query) {
      params.query = query;
    }

    const res = await axios.get(`${base_api}events/event-filter`, {
      params,
    });
    return res;
  } catch (err: any) {
    console.error(err);
  }
}

export async function purchaseTicket(
  eventId: any,
  discountCode: string,
  payWithPoints: boolean,
) {
  try {
    const token = await getToken();

    const res = await axios.post(
      `${base_api}transactions/purchase`,
      {
        eventId,
        discountCode,
        payWithPoints,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return res;
  } catch (err: any) {
    console.error(err);

    if (err.response && err.response.data) {
      throw new Error(err.response.data.message || 'An error occurred');
    } else {
      throw new Error('An error occurred');
    }
  }
}

export async function checkPurchaseStatus(eventId: any) {
  try {
    const token = await getToken();

    const res = await axios.get(
      `${base_api}transactions/checkPurchaseStatus/${eventId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
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
//     let token;
//     console.log(token);
//     if (!token) {
//       throw new Error('Authentication token not found');
//     }

//     const res = await axios.post(
//       `${base_api}transactions/purchase`,
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
//     let token;
//     console.log(token);
//     if (!token) {
//       throw new Error('Authentication token not found');
//     }
//     const res = await axios.get(
//       `${base_api}transactions/checkPurchaseStatus/${eventId}`,
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
