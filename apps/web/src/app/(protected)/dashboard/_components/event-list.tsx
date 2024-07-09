import React from 'react';
import { format } from 'date-fns';
import { convertToRupiah } from '../_utils/convert-rupiah';

// const datas = [
//   {
//     may_2024: [
//       {
//         id: 1,
//         name: 'Business Conference 2024',
//         date: '2024-05-01',
//         attendees: 30,
//         price: 100000,
//       },
//       {
//         id: 2,
//         name: 'Singles Meetup Night',
//         date: '2024-05-02',
//         attendees: 40,
//         price: 200000,
//       },
//       {
//         id: 3,
//         name: 'Singles Meetup Night 2',
//         date: '2024-05-03',
//         attendees: 50,
//         price: 300000,
//       },
//     ],
//   },
//   {
//     june_2024: [
//       {
//         id: 1,
//         name: 'Singles Meetup Night 3',
//         date: '2024-06-01',
//         attendees: 30,
//         price: 100000,
//       },
//       {
//         id: 2,
//         name: 'Singles Meetup Night 4',
//         date: '2024-06-02',
//         attendees: 40,
//         price: 200000,
//       },
//     ],
//   },
// ];

const groupEventsByMonth = (events: any) => {
  const groupedEvents: { [key: string]: Event[] } = {};

  events.forEach((event: any) => {
    const eventDate = new Date(event.start_event);
    const monthYear = eventDate
      .toLocaleString('default', { month: 'long', year: 'numeric' })
      .toLowerCase()
      .replace(' ', '_');
    const formattedEvent: any = {
      id: event.id,
      name: event.name,
      date: eventDate.toISOString().split('T')[0],
      attendees: event._count.attendes,
      price: parseInt(event.price, 10),
    };

    if (!groupedEvents[monthYear]) {
      groupedEvents[monthYear] = [];
    }

    groupedEvents[monthYear].push(formattedEvent);
  });

  return Object.keys(groupedEvents).map((month) => ({
    [month]: groupedEvents[month],
  }));
};

const EventList = ({ data, sort }: { data: any; sort: string }) => {
  const datas = groupEventsByMonth(data);

  return (
    <div className="space-y-8">
      {datas.map((monthData, index) => {
        const month: any = Object.keys(monthData)[0];
        const events = monthData[month as keyof typeof monthData] as any;

        return (
          <div key={index} className="space-y-11">
            {events.map((event: any, index: number) => (
              <div className="w-full grid md:grid-cols-4 gap-4" key={event.id}>
                <div className="col-span-1">
                  {index === 0 && (
                    <p className="text-base text-gray-500 capitalize">
                      {month.replace('_', ' ')}
                    </p>
                  )}
                </div>
                <div className="space-y-1 col-span-2">
                  <h3 className="text-3xl font-semibold line-clamp-1">
                    {event.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {format(new Date(event.date), 'dd MMM yyyy')} -{' '}
                    {convertToRupiah(event.price)}
                  </p>
                </div>
                <div className="space-y-1 col-span-1 md:mx-auto text-center w-fit md:w-full">
                  <p className="text-2xl font-semibold">{event.attendees}</p>
                  <p className="text-sm text-gray-500">Attendees</p>
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
