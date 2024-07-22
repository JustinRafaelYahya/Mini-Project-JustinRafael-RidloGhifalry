// pages/events/[id].tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getEventById } from '@/api/route';
import MainButton from '@/components/MainButton';
import MainLink from '@/components/LinkMain';
import React from 'react';

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      const fetchEvent = async () => {
        try {
          const event = await getEventById(id as string);
          setEvent(event.data.data);
        } catch (err) {
          console.error('Error fetching event:', err);
          setError('Failed to load event data');
        } finally {
          setLoading(false);
        }
      };
      fetchEvent();
    }
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!event) {
    return <div>No event found</div>;
  }

  return (
    <section className="grid lg:grid-cols-2  p-4 mt-24 mx-auto max-w-[1350px] h-screen">
      <div className="mt-12"> </div>
      <div className="mx-6 max-w-xl lg:pl-20">
        <div className="mx-auto">
          {/* <Link href="/products/"> */}
          <MainLink className="float-left">⪡ Back to Events page</MainLink>
          {/* </Link> */}
        </div>
        <h3 className="text-4xl font-bold mt-10">{event.name}</h3>
        <p className="mt-2 font-semibold mb-2">{event.seats} seats left</p>
        {/* {title} */}
        <p className="mt-2 font-semibold mb-8">Rp. {event.price}</p>
        {/* $ {price} */}
        <div>
          <p>{event.about}</p>
        </div>
        <p className="mt-4 mb-[-1rem] text-lg font-semibold">Time and Place:</p>
        <ul className="p-5 flex flex-col list-disc mb-10">
          <li className="list-disc my-1">{event.location}</li>
          <li className="list-disc my-1">
            From {event.start_event.substr(0, 10)} at {event.start_time}
          </li>
          <li className="list-disc my-1">
            To {event.end_event.substr(0, 10)} at {event.end_time}
          </li>
        </ul>
        <p className="mt-2 font-semibold mb-2">
          by {event.organizer.username}{' '}
        </p>
        <MainButton className="lg:mt-10 w-full">Purchase</MainButton>
      </div>
    </section>
  );
};

export default EventDetails;
