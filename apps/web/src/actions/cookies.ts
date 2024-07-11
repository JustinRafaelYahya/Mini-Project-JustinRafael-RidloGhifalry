'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

export async function setCookies(cookieName: string, value: any) {
  cookies().set(cookieName, value);
}

export async function getCookie(cookieName: string) {
  return cookies().get(cookieName)?.value;
}

export async function deleteCookie(cookieName: string, path: string) {
  cookies().delete(cookieName);
  revalidatePath(path);
}
