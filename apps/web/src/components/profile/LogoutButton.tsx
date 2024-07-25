'use client';

import { deleteCookie } from '@/actions/cookies';
import { usePathname, useRouter } from 'next/navigation';
import { TbLogout2 } from 'react-icons/tb';

export default function LogoutButton() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <button
      onClick={() => {
        deleteCookie('token', pathname);
        router.push('/');
      }}
      className="text-sm border border-gray-500 cursor-pointer flex gap-2 items-center bg-[#f1f1f1] p-1 px-2 rounded-md transition hover:scale-105"
    >
      <TbLogout2 size={20} />
      <span>Logout</span>
    </button>
  );
}
