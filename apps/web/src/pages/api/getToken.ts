// web/src/pages/api/getToken.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from '@/utils/token';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  console.log('API route hit');
  try {
    const token = await getToken();
    console.log('Token retrieved:', token);
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

// import { NextApiRequest, NextApiResponse } from 'next';
// import { cookies } from 'next/headers';

// export default function handler(req: NextApiRequest, res: NextApiResponse) {
//   const token = cookies().get('token')?.value;

//   if (!token) {
//     return res.status(401).json({ message: 'Authentication token not found' });
//   }

//   res.status(200).json({ token });
// }

// import { NextApiRequest, NextApiResponse } from 'next';

// export default function handler(req: NextApiRequest, res: NextApiResponse) {
//   const token = req.cookies.token;
//   if (!token) {
//     return res.status(401).json({ message: 'Authentication token not found' });
//   }
//   res.status(200).json({ token });
// }
