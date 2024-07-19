'use client';

import { useEffect, useState, useTransition } from 'react';

import { getMyEvents } from '@/api/events/my-events/route';
import { EventForProfileProps } from '@/interfaces/event';
import { FormError } from '@/components/FormError';

export default function MyEvent() {
  const [data, setData] = useState<EventForProfileProps[]>([]);
  const [error, setError] = useState<string>('');
  const [isLoading, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      try {
        const res = await getMyEvents();
        if (!res?.ok) {
          setError(res?.message || 'Something went wrong');
          return;
        }
        setData(res?.data?.data || []);
      } catch (err) {
        setError('Something went wrong');
      }
    });
  }, []);

  if (error) {
    return <FormError message={error} />;
  }

  if (isLoading) {
    return <p className="text-center">Loading...</p>;
  }

  return (
    <div>
      <h1>My Event</h1>
      {data &&
        data?.map((event: EventForProfileProps) => (
          <div key={event?.id} className="flex gap-2">
            <p>{event?.name}</p>
          </div>
        ))}
    </div>
  );
}
