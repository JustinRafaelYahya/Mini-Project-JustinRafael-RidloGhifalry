import Link from "next/link";
import Image from "next/image";

export default function EventCards({ events, className }) {

  return (
    <div className={className}>
    {events.map((event) => (
    <div className="w-68 shadow-xl flex flex-col px-6 py-6 my-6 mx-6 rounded-lg" key={event.id}>
      <div className="h-40 ">
        <Image
          src={event.thumbnail}
          alt="Thumbnail event"
        //   width={thumbnail.fields.file.details.image.width}
        //   height={thumbnail.fields.file.details.image.height}
          className="h-full w-full object-contain"
        />
      </div>
      <div className="mt-6">
        <h3 className="text-xl font-bold text-center">{event.title}</h3>
        <p className="mb-6 text-center">Rp. {event.price}</p>
        <p className="mb-6 text-center">{event.place}</p>
        <p className="mb-6 text-center">{event.organizer}</p>
        {/* <ul className="flex flex-col items-center list-disc ">
          {spesifications.map((spec, index) => (
            <li key={index} className="list-disc my-1">
              {spec}
            </li>
          ))}
        </ul> */}
        {/* <Link href={`/events/${slug}`} className="flex justify-center"> */}
          <button className="w-5/6">See Details</button>
        {/* </Link> */}
      </div>
    </div>))}
    </div>
  );
}