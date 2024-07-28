import React from 'react';
import { format } from 'date-fns';
import { SiStatuspal } from 'react-icons/si';
import { eventStatus } from '@/utils/eventStatus';
import { convertToRupiah } from '@/utils/convert-rupiah';
import Link from 'next/link';

type Event = {
  id: number;
  name: string;
  date: string;
  attendees: number;
  price: number;
  likes: number;
  start_event: Date;
  end_event: Date;
  start_time: string;
  end_time: string;
};

const groupEventsByMonth = (events: any) => {
  const groupedEvents: Record<string, Event[]> = {};

  for (const event of events) {
    const monthYear = format(new Date(event.start_event), 'MMMM yyyy')
      .toLowerCase()
      .replace(' ', '_');
    if (!groupedEvents[monthYear]) {
      groupedEvents[monthYear] = [];
    }
    groupedEvents[monthYear].push({
      id: event?.id,
      name: event.name,
      date: new Date(event.start_event).toISOString().split('T')[0],
      attendees: event._count.attendes,
      price: parseInt(event.price, 10),
      likes: event.likes,
      start_event: new Date(event.start_event),
      end_event: new Date(event.end_event),
      start_time: event.start_time,
      end_time: event.end_time,
    });
  }

  return Object.entries(groupedEvents).map(([month, events]) => ({
    [month]: events,
  }));
};

const EventList = ({ data }: { data: any }) => {
  const datas = groupEventsByMonth(data);

  return (
    <div className="space-y-8">
      {datas.map((monthData, index) => {
        const month: any = Object.keys(monthData)[0];
        const events = monthData[month as keyof typeof monthData] as any;

        return (
          <div key={index} className="space-y-11">
            {events.map((event: any, index: number) => (
              <div
                className="w-full grid md:grid-cols-4 md:gap-4 gap-8"
                key={event.id}
              >
                <div className="col-span-1">
                  {index === 0 && (
                    <p className="text-base text-gray-500 capitalize">
                      {month.replace('_', ' ')}
                    </p>
                  )}
                </div>
                <div className="space-y-1 col-span-2">
                  <h3 className="text-3xl font-semibold line-clamp-1 hover:underline">
                    <Link href={`/events/${event.id}`}>{event.name}</Link>
                  </h3>
                  <p className="text-sm text-gray-500">
                    {format(new Date(event.date), 'dd MMM yyyy')} -{' '}
                    {convertToRupiah(event.price)}
                  </p>
                  <p className="text-sm flex items-center gap-2 capitalize text-gray-500">
                    <SiStatuspal size={16} color="#7c7c7c" />{' '}
                    {eventStatus({
                      startDate: new Date(event?.start_event),
                      endDate: new Date(event?.end_event),
                      startTime: event?.start_time,
                      endTime: event?.end_time,
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="space-y-1 col-span-1 md:mx-auto text-center w-fit md:w-full">
                    <p className="text-2xl font-semibold">{event.attendees}</p>
                    <p className="text-sm text-gray-500">Attendees</p>
                  </div>
                  <div className="space-y-1 col-span-1 md:mx-auto text-center w-fit md:w-full">
                    <p className="text-2xl font-semibold">{event?.likes}</p>
                    <p className="text-sm text-gray-500">
                      {event?.likes > 1 ? 'Likes' : 'Like'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {index !== datas.length - 1 && <hr />}
          </div>
        );
      })}
    </div>
  );
};

export default EventList;
