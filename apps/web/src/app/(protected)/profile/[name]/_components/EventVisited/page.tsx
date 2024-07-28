'use client';

import { useEffect, useState, useTransition } from 'react';
import { usePathname } from 'next/navigation';

import { EventForProfileProps } from '@/interfaces/event';
import { FormError } from '@/components/FormError';
import EventCardSkeleton from '@/skeletons/EventCardSkeleton';
import { getEventVisited } from '@/api/events/event-visited/route';
import EventCards from '@/components/EventCards';

export default function EventVisited() {
  const [data, setData] = useState<EventForProfileProps[]>([]);
  const [error, setError] = useState<string>('');
  const [isLoading, startTransition] = useTransition();

  const pathname = usePathname();

  useEffect(() => {
    startTransition(async () => {
      try {
        const res = await getEventVisited({
          username: pathname?.split('/').pop() || '',
        });

        if (!res?.ok) {
          setError(res?.message || 'Something went wrong');
          return;
        }

        setData(res?.data || []);
      } catch (err) {
        setError('Something went wrong');
      }
    });
  }, []);

  if (error) {
    return <FormError message={error} />;
  }

  if (isLoading) {
    return <EventCardSkeleton />;
  }

  return (
    <>
      {data?.length === 0 ? (
        <p className="text-center p-10">No events visited yet</p>
      ) : (
        <EventCards
          className="grid md:grid-cols-3 grid-cols-2 gap-3"
          events={data}
        />
      )}
    </>
  );
}
