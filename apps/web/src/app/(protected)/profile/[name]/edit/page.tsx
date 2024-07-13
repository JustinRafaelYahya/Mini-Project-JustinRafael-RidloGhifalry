'use client';

import FormUpdate from './_components/FormUpdate';
import Link from 'next/link';
import { SlArrowLeft } from 'react-icons/sl';
import { useCurrentUser } from '@/context/UserContext';

export default function EditPage() {
  const { user, loading, error } = useCurrentUser();

  return (
    <>
      <Link
        href={'/profile/[name]'}
        as={`/profile/${user?.username}`}
        className="underline flex gap-2 items-center hover:no-underline mb-4"
      >
        <SlArrowLeft size={12} />
        <span>Go back</span>
      </Link>
      <div className="grid md:grid-cols-2 gap-3">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <FormUpdate user={user} />
        )}
      </div>
    </>
  );
}
