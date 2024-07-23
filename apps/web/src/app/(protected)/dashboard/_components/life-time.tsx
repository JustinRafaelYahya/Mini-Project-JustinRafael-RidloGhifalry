'use client';

import { useEffect, useState } from 'react';
import EventList from './event-list';
import { getEventsForTable } from '@/api/events/dashboard-chart/route';
import StatisticEventSkeleton from '@/skeletons/dashboard/StatisticEventSkeleton';

export default function LifeTime() {
  const [data, setData] = useState([]);
  const [sort, setSort] = useState<string>('published_at desc');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getEventsForTable(sort);
        setData(data.events);
      } catch (err) {
        console.log('🚀 ~ fetchData ~ err:', err);
        setError('Failed to fetch data');
      }
      setLoading(false);
    };

    fetchData();
  }, [sort]);

  return (
    <div className="mt-10 space-y-14">
      <div className="flex flex-col md:flex-row md:justify-between items-center gap-3 md:gap-0">
        <div className="md:space-y-3 w-full">
          <h1 className="text-2xl md:text-4xl lg:text-6xl font-semibold">
            LifeTime
          </h1>
          <p className="text-gray-500 text-sm md:text-base">
            Updated every come up new event
          </p>
        </div>
        <div className="p-2 border border-gray-300 rounded-full px-4 w-full md:w-fit ">
          <select
            className="select-none w-full"
            onChange={(e) => setSort(e.target.value)}
            value={sort}
          >
            <option value="published_at desc">Latest</option>
            <option value="published_at asc">Newest</option>
            <option value="visit_count desc">Most visited</option>
            <option value="visit_count asc">Least visited</option>
          </select>
        </div>
      </div>

      <div>
        {loading ? (
          <StatisticEventSkeleton />
        ) : error ? (
          <p>
            Error: <span className="text-red-500">{error}</span>
          </p>
        ) : (
          <div className="w-full">
            <EventList data={data} sort={sort} />
          </div>
        )}
      </div>
    </div>
  );
}
