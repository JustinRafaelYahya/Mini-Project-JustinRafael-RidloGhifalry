'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

export async function setCookies(cookieName: string, value: any) {
  cookies().set(cookieName, value);
}

export async function getCookie(cookieName: string) {
  const token = cookies().get(cookieName)?.value;

  if (!token) {
    return null;
  }

  return token;
}

export async function deleteCookie(cookieName: string, path: string) {
  cookies().delete(cookieName);
  revalidatePath(path);
}
