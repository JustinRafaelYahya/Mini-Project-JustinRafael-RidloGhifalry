'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

import { CurrentUserProps } from '@/context/UserContext';
import EventVisited from './EventVisited/page';
import MyEvent from './MyEvent/page';

export default function ProfileEvent({ user }: { user: CurrentUserProps }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const event: any = searchParams.get('event');

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams],
  );

  return (
    <>
      <div className="space-x-6">
        <button
          onClick={() => {
            router.push(pathname + '?' + createQueryString('event', 'visited'));
          }}
          className={`px-4 py-2 rounded-md ${event === 'visited' || !event ? 'bg-[#f1f1f1]' : ''}`}
        >
          Event visited
        </button>
        {user.role === 'ORGANIZER' && (
          <button
            onClick={() => {
              router.push(
                pathname + '?' + createQueryString('event', 'created'),
              );
            }}
            className={`px-4 py-2 rounded-md ${event === 'created' ? 'bg-[#f1f1f1]' : ''}`}
          >
            My event
          </button>
        )}
      </div>

      <div className="mt-10">
        {(event === 'visited' || !event) && <EventVisited />}
        {event === 'created' && <MyEvent />}
      </div>
    </>
  );
}
