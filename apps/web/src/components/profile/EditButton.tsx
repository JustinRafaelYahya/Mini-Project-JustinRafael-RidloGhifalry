'use client';

import Link from 'next/link';

export default function EditButton({ username }: { username: string }) {
  return (
    <Link
      href={`/profile/${username}/edit`}
      className="text-sm underline hover:no-underline cursor-pointer"
    >
      edit
    </Link>
  );
}
