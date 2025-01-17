'use client';

import { useEffect, useState, useTransition } from 'react';
import { FaLocationArrow } from 'react-icons/fa';
import { FaHeart, FaUserEdit } from 'react-icons/fa';
import { FaComment } from 'react-icons/fa6';
import { MdMapsUgc, MdDelete, MdEventSeat } from 'react-icons/md';
import { SiStatuspal } from 'react-icons/si';
import { IoPeople } from 'react-icons/io5';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

import { deleteEvent, getMyEvents } from '@/api/events/my-events/route';
import { EventForProfileProps } from '@/interfaces/event';
import { FormError } from '@/components/FormError';
import EventCardSkeleton from '@/skeletons/EventCardSkeleton';
import { eventStatus } from '@/utils/eventStatus';

export default function MyEvent() {
  const [data, setData] = useState<EventForProfileProps[]>([]);
  const [error, setError] = useState<string>('');
  const [isLoading, startTransition] = useTransition();

  const pathname = usePathname();
  const router = useRouter();

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

  const handleDelete = (id: number) => {
    const confirm = window.confirm(
      'Are you sure you want to delete this event? This action cannot be undone.',
    );

    if (confirm) {
      startTransition(() =>
        deleteEvent({ id, path: pathname || '' })
          .then((res) => {
            if (!res?.ok) {
              alert(res?.message || 'Something went wrong');
              return;
            }

            router.refresh();
          })
          .catch((err) => alert('Something went wrong')),
      );
    }
  };

  if (error) {
    return <FormError message={error} />;
  }

  if (isLoading) {
    return <EventCardSkeleton />;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      {data &&
        data?.map((event: EventForProfileProps) => (
          <div
            key={event?.id}
            className="w-full rounded-md border overflow-hidden relative group"
          >
            <Image
              src={
                event?.thumbnail
                  ? event?.thumbnail
                  : '/images/event_image_placeholder.webp'
              }
              alt="event"
              width={200}
              height={200}
              className="w-full h-[180px] object-cover"
            />
            <div className="p-3 space-y-3">
              <h2 className="line-clamp-1 text-xl font-semibold">
                {event?.name}
              </h2>
              <div className="flex items-center gap-4">
                <p className="text-sm flex items-center gap-2 capitalize">
                  <FaLocationArrow size={16} color="#7c7c7c" />{' '}
                  {event?.location}
                </p>
                <p className="text-sm flex items-center gap-2 capitalize">
                  <FaHeart size={16} color="#7c7c7c" /> {event?.likes}
                </p>
                <p className="text-sm flex items-center gap-2 capitalize">
                  <FaComment size={16} color="#7c7c7c" />{' '}
                  {event?._count?.review}
                </p>
              </div>
              <p className="text-sm flex items-center gap-2 capitalize">
                <SiStatuspal size={16} color="#7c7c7c" />{' '}
                {eventStatus({
                  startDate: new Date(event?.start_event),
                  endDate: new Date(event?.end_event),
                  startTime: event?.start_time,
                  endTime: event?.end_time,
                })}
              </p>
              <div className="flex items-center gap-4">
                <p className="text-sm flex items-center gap-2 capitalize">
                  <IoPeople size={16} color="#7c7c7c" />{' '}
                  {event?._count.attendes}
                </p>
                <p className="text-sm flex items-center gap-2 capitalize">
                  <MdEventSeat size={16} color="#7c7c7c" /> {event?.seats}
                </p>
              </div>
            </div>

            <div className="absolute top-0 left-[-100%] group-hover:left-0 transition-all bottom-0 w-1/2 rounded-md bg-black/80 text-white text-left flex justify-center flex-col gap-4 p-4">
              <Link
                href={`/events/${event.id}`}
                className="flex items-center gap-1 group hover:underline"
              >
                <span>
                  <MdMapsUgc size={16} color="#7c7c7c" />
                </span>
                <span>Detail</span>
              </Link>
              <Link
                href={`/events/${event.id}/edit`}
                className="flex items-center gap-1 group hover:underline"
              >
                <span>
                  <FaUserEdit size={16} color="#7c7c7c" />
                </span>
                <span>Edit</span>
              </Link>
              {eventStatus({
                startDate: new Date(event?.start_event),
                endDate: new Date(event?.end_event),
                startTime: event?.start_time,
                endTime: event?.end_time,
              }) === 'ended' && (
                <button
                  onClick={() => handleDelete(event.id)}
                  className="flex items-center gap-1 group -ml-1 hover:underline"
                >
                  <MdDelete size={16} color="#7c7c7c" />
                  <span>Delete</span>
                </button>
              )}
            </div>
          </div>
        ))}
    </div>
  );
}
