'use client';

import { MdOutlineContentCopy } from 'react-icons/md';
import { RxDashboard } from 'react-icons/rx';
import { IoCheckmark } from 'react-icons/io5';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

import EditButton from './EditButton';
import LogoutButton from './LogoutButton';
import ShareButton from './ShareButton';
import { CurrentUserProps, useCurrentUser } from '@/context/UserContext';
import { findUserByUsername } from '@/api/user/route';
import ProfileEvent from '@/app/(protected)/profile/[name]/_components';
import formattedDate from '@/utils/format-date';
import MaskedEmail from '@/utils/masked-email';

export default function Profile() {
  const { user, loading, error } = useCurrentUser();

  const [currentUser, setCurrentUser] = useState<CurrentUserProps>();
  const [currentUserLoading, setLoading] = useState<boolean>(false);
  const [currentUserError, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState<boolean>(false);

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

  const handleCopyReferralCode = (code: number) => {
    navigator.clipboard.writeText(code.toString());
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 3000);
  };

  if (loading || currentUserLoading)
    return <p className="text-gray-500 text-center">Loading...</p>;
  if (error || currentUserError)
    return <p className="text-red-500 text-center">Something went wrong</p>;

  return (
    <>
      <div className="rounded-lg bg-[#f8f7fa] border border-gray-200">
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-10 md:gap-3 p-10">
          <div className="col-span-1 mx-auto relative">
            {!currentUser?.profile_picture ? (
              <div className="w-32 h-32 md:w-40 md:h-40 bg-gray-300 rounded-full flex justify-center items-center text-white text-xl uppercase">
                {currentUser?.username?.charAt(0)}
              </div>
            ) : (
              <Image
                src={currentUser?.profile_picture}
                alt="Profile picture"
                width={150}
                height={150}
                className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover"
              />
            )}
            <span className="absolute -bottom-3 capitalize w-fit mx-auto left-0 right-0 text-center py-1 px-2 text-sm rounded-md border border-gray-500 bg-[#f1f1f1]">
              {currentUser?.role}
            </span>
          </div>

          <div className="sm:col-span-2 space-y-2 text-center sm:text-left">
            <h2 className="text-2xl md:text-3xl font-semibold">
              {currentUser?.username}
            </h2>
            <span className="text-sm text-gray-400">
              {MaskedEmail(currentUser?.email as string)}
            </span>
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <p className="p-1 px-3 text-base rounded-md border border-gray-500 bg-[#f1f1f1] select-none">
                {currentUser?.referral_number}
              </p>
              <button
                className="p-1 text-base rounded-md border border-gray-500 bg-[#f1f1f1] hover:scale-105 transition"
                onClick={() =>
                  handleCopyReferralCode(currentUser?.referral_number as number)
                }
              >
                {isCopied ? (
                  <IoCheckmark size={20} />
                ) : (
                  <MdOutlineContentCopy size={20} />
                )}
              </button>
            </div>
            <span className="text-sm text-gray-400">
              Referral code invalid at{' '}
              {formattedDate(currentUser?.referral_number_expired as string)}
            </span>
            <p>{`Joined ${currentUser?.createdAt && formattedDate(currentUser?.createdAt as string)}`}</p>
          </div>

          {currentUser?.id === user?.id && (
            <div className="col-span-1 select-none">
              <div className="flex md:flex-col md:gap-6 justify-between items-end h-full">
                <div className="flex gap-6 justify-center items-start">
                  <EditButton username={user?.username} />
                  <ShareButton url={handleShareProfile(user?.username)} />
                  {user?.role === 'ORGANIZER' && (
                    <Link
                      href={`/dashboard?chart=yearly&statistic=published-at+asc`}
                      className="text-sm border border-gray-500 cursor-pointer flex gap-2 items-center bg-[#f1f1f1] p-1 px-2 rounded-md transition hover:scale-105"
                    >
                      <RxDashboard size={20} />
                      <span>Dashboard</span>
                    </Link>
                  )}
                </div>
                <LogoutButton />
              </div>
            </div>
          )}
        </div>
      </div>

      {user.id === currentUser?.id && (
        <div className="mt-10">
          <ProfileEvent user={user} />
        </div>
      )}
    </>
  );
}
