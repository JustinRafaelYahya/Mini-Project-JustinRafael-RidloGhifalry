// web/src/pages/api/getToken.ts

// web/src/pages/api/getToken.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { cookies } from 'next/headers';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  console.log('API route hit');
  try {
    const cookieStore = cookies();
    console.log('Cookies store:', cookieStore);
    const token = cookieStore.get('token')?.value;
    if (!token) {
      throw new Error('Authentication token not found');
    }
    console.log('Token found:', token);
    res.status(200).json({ token });
  } catch (error) {
    console.error('Error in API route:', error);
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
}
