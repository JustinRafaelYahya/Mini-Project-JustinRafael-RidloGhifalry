import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

const SECRET_KEY = 'your_secret_key_here';

export default async function userProfileHandler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);

    // Fetch user data as needed using decoded info
    // Example: const user = await getUserById(decoded.user_id);

    res.status(200).json({ message: 'User profile', user: decoded });
  } catch (error) {
    console.error('Invalid token', error);
    return res.status(401).json({ message: 'Unauthorized' });
  }
}
