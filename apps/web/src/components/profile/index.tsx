'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

import { findMe } from '@/api/user/route';
import EditButton from './EditButton';
import LogoutButton from './LogoutButton';
import ShareButton from './ShareButton';
import Image from 'next/image';

export default function Profile() {
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

  const handleShareProfile = (username: string): string => {
    let url: string | undefined;
    if (typeof window !== 'undefined') {
      url = `${window.location.origin}/profile/${username}`;
    }

    return url ?? '';
  };

  return (
    <div className="rounded-lg bg-[#f8f7fa] border border-gray-200 p-10 flex flex-col justify-center items-center gap-6 text-center">
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          {!user?.user?.profile_picture ? (
            <div className="w-32 h-32 bg-gray-300 rounded-full flex justify-center items-center text-white text-xl uppercase">
              {user?.user?.username.charAt(0)}
            </div>
          ) : (
            <Image
              src={user?.user?.profile_picture}
              alt="Profile picture"
              width={100}
              height={100}
              className="w-32 h-32 rounded-full object-cover"
            />
          )}
          <h1 className="text-5xl font-semibold">{user?.user?.username}</h1>
        </>
      )}
      <div className="flex justify-center items-center gap-8 select-none">
        <EditButton username={user?.user?.username} />
        <ShareButton url={handleShareProfile(user?.user?.username)} />
        {user?.user?.role === 'ORGANIZER' && (
          <Link
            href={`/dashboard`}
            className="text-sm underline hover:no-underline cursor-pointer"
          >
            dashboard
          </Link>
        )}
        <LogoutButton />
      </div>
    </div>
  );
}
