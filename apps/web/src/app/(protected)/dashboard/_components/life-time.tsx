'use client';

import { useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { getEventsForTable } from '@/api/events/dashboard-chart/route';
import StatisticEventSkeleton from '@/skeletons/dashboard/StatisticEventSkeleton';
import EventList from './event-list';

export default function LifeTime() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const statistic = searchParams?.get('statistic') || 'published_at desc';

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams?.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams],
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { events } = await getEventsForTable(statistic);
        setData(events);
      } catch {
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [statistic]);

  return (
    <div className="mt-10 space-y-14">
      <div className="flex flex-col md:flex-row md:justify-between items-center gap-3 md:gap-0">
        <div className="md:space-y-3 w-full">
          <h1
            className="text-2xl md:text-4xl lg:text-6xl font-semibold"
            id="life-time"
          >
            LifeTime
          </h1>
          <p className="text-gray-500 text-sm md:text-base">
            Updated every come up new event
          </p>
        </div>
        <div className="p-2 border border-gray-300 rounded-full px-4 w-full md:w-fit">
          <select
            className="select-none w-full"
            onChange={(e) => {
              router.push(
                pathname + '?' + createQueryString('statistic', e.target.value),
              );
            }}
            value={statistic}
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
            <EventList data={data} />
          </div>
        )}
      </div>
    </div>
  );
}
