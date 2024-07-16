'use client';

import { deleteCookie } from '@/actions/cookies';
import { usePathname, useRouter } from 'next/navigation';

export default function LogoutButton() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <button
      onClick={() => {
        deleteCookie('token', pathname);
        router.push('/');
      }}
      className="text-sm underline hover:no-underline cursor-pointer"
    >
      logout
    </button>
  );
}
