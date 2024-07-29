'use client';

import { useEffect, useState, useTransition } from 'react';
import { usePathname } from 'next/navigation';

import { EventForProfileProps } from '@/interfaces/event';
import { FormError } from '@/components/FormError';
import EventCardSkeleton from '@/skeletons/EventCardSkeleton';
import { getEventVisited } from '@/api/events/event-visited/route';
import EventCards from '@/components/EventCards';

export default function EventVisited() {
  const pathname = usePathname();
  const username = pathname?.split('/').pop() || '';

  const [data, setData] = useState<EventForProfileProps[]>([]);
  const [error, setError] = useState<string>('');
  const [isLoading, startTransition] = useTransition();

  useEffect(() => {
    if (!username) return;
    startTransition(async () => {
      try {
        const res = await getEventVisited({ username });
        if (!res?.ok) {
          setError(res?.message || 'Something went wrong');
          return;
        }

        setData(res?.data || []);
      } catch {
        setError('Something went wrong');
      }
    });
  }, [username]);

  if (error) return <FormError message={error} />;
  if (isLoading) return <EventCardSkeleton />;

  return (
    <EventCards
      className="grid md:grid-cols-3 grid-cols-2 gap-3"
      events={data}
    />
  );
}
