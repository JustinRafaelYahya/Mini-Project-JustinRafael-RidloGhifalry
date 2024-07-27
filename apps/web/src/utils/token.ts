// web/src/utils/token.ts
import { cookies } from 'next/headers';

export async function getToken() {
  console.log('getToken called');
  const cookieStore = cookies();
  console.log('Cookies store:', cookieStore);
  const token = cookieStore.get('token')?.value;
  if (!token) {
    throw new Error('Authentication token not found');
  }
  console.log('Token found:', token);
  return token;
}
