import axios from 'axios';

const base_api = '/api/';

export async function purchaseTicket(
  eventId: any,
  discountCode: string,
  payWithPoints: boolean,
) {
  try {
    const res = await axios.post(
      `${base_api}purchase-ticket`,
      { eventId, discountCode, payWithPoints },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    return res.data;
  } catch (err: any) {
    console.error(err);
    throw new Error(err.response?.data?.message || 'An error occurred');
  }
}

export async function checkPurchaseStatus(eventId: any) {
  try {
    const res = await axios.get(`${base_api}check-purchase-status`, {
      params: { eventId },
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return res.data;
  } catch (err: any) {
    console.error(err);
    throw new Error(err.response?.data?.message || 'An error occurred');
  }
}
