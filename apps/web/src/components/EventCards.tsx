import Link from 'next/link';
import MainButton from './MainButton';
import { MdOutlinePlace } from 'react-icons/md';
import { GoPerson } from 'react-icons/go';
import { MdEventSeat } from 'react-icons/md';
import { IoTime } from 'react-icons/io5';
import { convertToRupiah } from '@/utils/convert-rupiah';
import { EventForProfileProps } from '@/interfaces/event';

interface eventsprop {
  id: number;
  name: string;
  price: string;
  location: string;
  thumbnail: string;
  seats: number;
  start_event: string;
  organizer: {
    username: string;
  };
}

export default function EventCards({
  events = [],
  className,
}: {
  events: EventForProfileProps[] | any;
  className: string;
}) {
  const placeholderImage = '/images/default-banner-orange.png';
  return (
    <div className={className}>
      {events?.map((event: any) => (
        <div
          className="w-68 shadow-xl flex flex-col px-6 py-6 my-6 mx-6 rounded-lg"
          key={event.id}
        >
          <div className="h-40 rounded-lg overflow-hidden ">
            <img
              src={event?.thumbnail || placeholderImage}
              alt={`Thumbnail of ${event.name}`}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="mt-6">
            <h3 className="text-xl font-bold text-center">{event.name}</h3>
            <p className="mb-8 text-center">
              {event.price == 0 ? 'Free' : convertToRupiah(event.price)}
            </p>
            <div className="flex items-center justify-center mb-6">
              <MdEventSeat className="mr-2 text-lg" />
              <p className="capitalize">{event.seats} Seats left</p>
            </div>
            <div className="flex items-center justify-center mb-6">
              <IoTime className="mr-2 text-lg" />
              <p className="text-center">
                From {event.start_event.slice(0, 10)}
              </p>
            </div>
            <div className="flex items-center justify-center mb-6">
              <MdOutlinePlace className="mr-2 text-lg" />
              <p className="capitalize">{event.location}</p>
            </div>
            <div className="flex items-center justify-center mb-6">
              <GoPerson className="mr-2 text-lg" />
              <p className="text-center">{event.organizer.username}</p>
            </div>
            <Link href={`/events/${event.id}`} className="flex justify-center">
              <MainButton className="bg-main-color ease-in-out duration-300 hover:scale-105 w-5/6 m-auto flex">
                More Details
              </MainButton>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
