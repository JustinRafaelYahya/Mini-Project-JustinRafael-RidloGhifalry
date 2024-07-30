'use client';

import { useEffect, useState } from 'react';
import FormUpdate from './_components/FormUpdate';
import { useParams } from 'next/navigation';
import { getEventById } from '@/api/events/route';

export default function EditEvent() {
  const [data, setData] = useState<any>();
  const [isDataLoading, setIsDataLoading] = useState<boolean>(true);
  const [dataError, setDataError] = useState<string>('');

  const { id } = useParams() as { id: string };

  useEffect(() => {
    if (id) {
      const fetchEvent = async () => {
        try {
          const event: any = await getEventById(id as string);
          setData(event.data.data);
        } catch (err) {
          setDataError('Failed to load event data');
        } finally {
          setIsDataLoading(false);
        }
      };

      fetchEvent();
    }
  }, [id]);

  if (isDataLoading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (dataError) {
    return <div className="text-center mt-10 text-rose-500">{dataError}</div>;
  }

  return (
    <div className="w-full max-w-7xl container mx-auto my-20 p-4">
      <FormUpdate data={data} />
    </div>
  );
}
