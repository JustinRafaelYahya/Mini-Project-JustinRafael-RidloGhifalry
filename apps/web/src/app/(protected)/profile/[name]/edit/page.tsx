'use client';

import { useEffect, useState } from 'react';
import FormUpdate from './_components/FormUpdate';
import { findMe } from '@/api/user/route';
import Link from 'next/link';
import { SlArrowLeft } from 'react-icons/sl';

export default function EditPage() {
  const [user, setUser] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await findMe();
        setUser(data?.data);
      } catch (err) {
        setError('Failed to fetch data');
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  return (
    <>
      <Link
        href={'/profile/[name]'}
        as={`/profile/${user?.user?.username}`}
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
          <FormUpdate user={user?.user} />
        )}
      </div>
    </>
  );
}
