import axios from 'axios';
import Cookies from 'js-cookie';

const base_api = 'http://localhost:8000/api/';

export function getToken() {
  return Cookies.get('token');
}

export async function purchaseTicket(
  eventId: number,
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
