import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'GET') {
    const { eventId } = req.query;
    const token = req.cookies.token;

    if (!token) {
      return res
        .status(401)
        .json({ message: 'Authentication token not found' });
    }

    try {
      const response = await axios.get(
        `http://localhost:8000/api/transactions/checkPurchaseStatus/${eventId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );
      res.status(200).json(response.data);
    } catch (error: any) {
      res
        .status(error.response?.status || 500)
        .json({ message: error.message || 'An error occurred' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
