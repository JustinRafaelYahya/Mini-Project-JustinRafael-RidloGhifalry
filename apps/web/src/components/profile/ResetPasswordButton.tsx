'use client';

import Link from 'next/link';
import { IoLockClosedOutline } from 'react-icons/io5';

export default function ResetPasswordButton() {
  return (
    <Link
      href={`/reset-password`}
      className="text-sm border border-gray-500 cursor-pointer flex gap-2 items-center bg-[#f1f1f1] p-1 px-2 rounded-md transition hover:scale-105"
    >
      <IoLockClosedOutline size={20} />
      <span>Reset Password</span>
    </Link>
  );
}
