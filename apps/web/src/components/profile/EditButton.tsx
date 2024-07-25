'use client';

import Link from 'next/link';
import { BsPencilSquare } from 'react-icons/bs';

export default function EditButton({ username }: { username: string }) {
  return (
    <Link
      href={`/profile/${username}/edit`}
      className="text-sm border border-gray-500 cursor-pointer flex gap-2 items-center bg-[#f1f1f1] p-1 px-2 rounded-md transition hover:scale-105"
    >
      <BsPencilSquare size={20} />
      <span>Edit</span>
    </Link>
  );
}
