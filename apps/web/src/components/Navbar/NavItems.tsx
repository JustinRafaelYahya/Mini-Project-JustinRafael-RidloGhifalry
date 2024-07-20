'use client';

import Link from 'next/link';
import { FaUser } from 'react-icons/fa';

import { navbarLinkList } from '@/constants';
import { useCurrentUser } from '@/context/UserContext';

export default function NavItems() {
  const { error, loading, user } = useCurrentUser();

  return (
    <nav>
      {error ? (
        <p className="text-red-500 text-sm">{error}</p>
      ) : loading ? (
        <p className="text-sm">Loading...</p>
      ) : user ? (
        <div className="flex flex-col lg:flex-row items-center gap-6 text-black">
          {user?.role === 'ORGANIZER' && (
            <Link
              href="/create-event"
              className="text-sm hover:underline hover:text-main-color"
            >
              Create Event
            </Link>
          )}
          <Link
            href={`/profile/${user?.username}`}
            className="hover:scale-105 transition border border-slate-200 rounded-full p-2 max-w-fit"
          >
            <FaUser size={20} color="#000" />
          </Link>
        </div>
      ) : (
        <ul className="flex flex-col lg:flex-row gap-6 items-center">
          {navbarLinkList.map((menu, i) => (
            <li key={i}>
              <Link
                href={menu[1]}
                className="text-sm hover:underline hover:text-main-color"
              >
                {menu[0]}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}
