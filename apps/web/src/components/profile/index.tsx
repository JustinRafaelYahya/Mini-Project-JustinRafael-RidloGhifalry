'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

import EditButton from './EditButton';
import LogoutButton from './LogoutButton';
import ShareButton from './ShareButton';
import { CurrentUserProps, useCurrentUser } from '@/context/UserContext';
import { useEffect, useState } from 'react';
import { findUserByUsername } from '@/api/user/route';
import ProfileEvent from '@/app/(protected)/profile/[name]/_components';

export default function Profile() {
  const { user, loading, error } = useCurrentUser();

  const [currentUser, setCurrentUser] = useState<CurrentUserProps>();
  const [currentUserLoading, setLoading] = useState<boolean>(false);
  const [currentUserError, setError] = useState<string | null>(null);

  const pathname = usePathname();

  useEffect(() => {
    const username = decodeURI(pathname?.split('/')[2]);

    const fetchUser = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await findUserByUsername(username);
        // console.log('🚀 ~ fetchUser ~ data:', data);
        setCurrentUser(data?.data?.user);
      } catch (err) {
        setError('Failed to fetch data');
      }
      setLoading(false);
    };

    fetchUser();
  }, [pathname]);

  const handleShareProfile = (username: string): string => {
    let url: string | undefined;
    if (typeof window !== 'undefined') {
      url = `${window.location.origin}/profile/${username}`;
    }

    return url ?? '';
  };

  if (loading || currentUserLoading)
    return <p className="text-gray-500 text-center">Loading...</p>;
  if (error || currentUserError)
    return <p className="text-red-500 text-center">Something went wrong</p>;

  return (
    <>
      <div className="rounded-lg bg-[#f8f7fa] border border-gray-200 p-10 flex flex-col justify-center items-center gap-6 text-center">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <>
            {!currentUser?.profile_picture ? (
              <div className="w-32 h-32 bg-gray-300 rounded-full flex justify-center items-center text-white text-xl uppercase">
                {currentUser?.username?.charAt(0)}
              </div>
            ) : (
              <Image
                src={currentUser?.profile_picture}
                alt="Profile picture"
                width={100}
                height={100}
                className="w-32 h-32 rounded-full object-cover"
              />
            )}
            <h1 className="text-5xl font-semibold">
              {currentUser?.username}
              <span className="italic font-normal text-lg">
                {currentUser?.role === 'ORGANIZER' ? ' (Org)' : null}
              </span>
            </h1>
          </>
        )}

        {currentUser?.id === user?.id && (
          <div className="flex justify-center items-center gap-8 select-none">
            <EditButton username={user?.username} />
            <ShareButton url={handleShareProfile(user?.username)} />
            {user?.role === 'ORGANIZER' && (
              <Link
                href={`/dashboard?chart=yearly&statistic=published-at+asc`}
                className="text-sm underline hover:no-underline cursor-pointer"
              >
                dashboard
              </Link>
            )}
            <LogoutButton />
          </div>
        )}
      </div>

      {user.id === currentUser?.id && (
        <div className="mt-10">
          <ProfileEvent user={user} />
        </div>
      )}
    </>
  );
}
