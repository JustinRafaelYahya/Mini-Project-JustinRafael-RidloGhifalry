import Link from 'next/link';
import Image from 'next/image';
import MainButton from './MainButton';

interface eventsprop {
  id: number;
  name: string;
  price: string;
  location: string;
  organizer: {
    username: string;
  };
}

export default function EventCards({
  events = [],
  className,
}: {
  events: eventsprop[];
  className: string;
}) {
  return (
    <div className={className}>
      {events.map((event) => (
        <div
          className="w-68 shadow-xl flex flex-col px-6 py-6 my-6 mx-6 rounded-lg"
          key={event.id}
        >
          <div className="mt-6">
            <h3 className="text-xl font-bold text-center">{event.name}</h3>
            <p className="mb-6 text-center">Rp. {event.price}</p>
            <p className="mb-6 text-center">{event.location}</p>
            <p className="mb-6 text-center">{event.organizer.username}</p>
            <Link href={`/events/${event.id}`} className="flex justify-center">
              <MainButton className="w-5/6 m-auto flex">
                More Details
              </MainButton>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}

{
  /* <div className="h-40 rounded-lg overflow-hidden ">
<Image
src={event.thumbnail}
alt="Thumbnail event"
//   width={thumbnail.fields.file.details.image.width}
//   height={thumbnail.fields.file.details.image.height}
className="h-full w-full object-cover"
/>
</div> */
}

{
  /* <ul className="flex flex-col items-center list-disc ">
{spesifications.map((spec, index) => (
<li key={index} className="list-disc my-1">
  {spec}
</li>
))}
</ul> */
}
