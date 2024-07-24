// pages/events/[id].tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { getEventById } from '@/api/route';
import MainButton from '@/components/MainButton';
import MainLink from '@/components/LinkMain';
import { FaHeart } from 'react-icons/fa';
import { useCurrentUser } from '@/context/UserContext';
import { likeEvent } from '@/api/events/route';

const EventDetails = () => {
  const { error: userError, loading: isUserLoading, user } = useCurrentUser();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUserLike, setIsUserLike] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState<number>(event?.likes || 0);

  const { id } = useParams();
  const router = useRouter();
  const pathname = usePathname();

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

  useEffect(() => {
    const isUserLikesEvent = () => {
      if (user) {
        const isUserLike = event?.liked?.find(
          (like: any) =>
            like?.user_id === user?.id && like?.event_id === event?.id,
        );

        setIsUserLike(isUserLike);
      } else {
        setIsUserLike(false);
      }
    };

    isUserLikesEvent();
  }, []);

  const handleLikeEvent = async (id: number) => {
    if (!user) {
      router.push('/login');
      return;
    }

    try {
      const res = await likeEvent({ id: event?.id, path: pathname });
      if (res?.message === 'Event unliked') {
        setIsUserLike(false);
        setLikeCount((prevCount) => prevCount - 1);
      } else {
        setLikeCount((prevCount) => prevCount + 1);
        setIsUserLike(true);
      }
    } catch (err) {
      alert('Sorry, something went wrong. Please try again later.');
    }
  };

  if (loading || isUserLoading) {
    return <div>Loading...</div>;
  }

  if (error || userError) {
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
        <ul className="p-5 flex flex-col list-disc">
          <li className="list-disc my-1">{event.location}</li>
          <li className="list-disc my-1">
            From {event.start_event.substr(0, 10)} at {event.start_time}
          </li>
          <li className="list-disc my-1">
            To {event.end_event.substr(0, 10)} at {event.end_time}
          </li>
        </ul>

        <button
          onClick={() => handleLikeEvent(event.id)}
          className={`text-3xl p-1 hover:scale-105 w-fit transition duration-100 cursor-pointer flex items-center gap-2`}
        >
          <FaHeart color={isUserLike ? 'red' : 'black'} />
          <span className="text-sm text-black">{likeCount}</span>
        </button>

        <p className="mt-2 font-semibold mb-2">by {event.organizer.username}</p>
        <MainButton className="lg:mt-10 w-full">Purchase</MainButton>
      </div>
    </section>
  );
};

export default EventDetails;
