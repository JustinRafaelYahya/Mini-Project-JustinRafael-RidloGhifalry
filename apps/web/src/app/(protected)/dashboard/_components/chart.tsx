'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { getEventsForChart } from '@/api/events/dashboard-chart/route';
import ChartSkeleton from '@/skeletons/dashboard/ChartSkeleton';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { FormError } from '@/components/FormError';

export default function Chart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const chart: any = searchParams?.get('chart');

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
      setLoading(true);
      setError(null);
      try {
        const data = await getEventsForChart(chart || 'yearly');
        setData(data.data);
      } catch {
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [chart]);

  if (loading) {
    return <ChartSkeleton />;
  }

  if (error) {
    return <FormError message={error} />;
  }

  return (
    <div className="mt-10 space-y-10">
      <div className="flex flex-col md:flex-row md:justify-between items-center gap-3 md:gap-0">
        <div className="md:space-y-3 w-full">
          <h1 className="text-3xl md:text-4xl lg:text-6xl font-semibold capitalize">
            {chart}
          </h1>
          <p className="text-gray-500 text-sm md:text-base">
            Your {chart} starts
          </p>
        </div>
        <div className="p-2 border border-gray-300 rounded-full px-4 w-full md:w-[150px]">
          <select
            className="select-none w-full"
            value={chart || 'yearly'}
            onChange={(e) => {
              router.push(
                pathname + '?' + createQueryString('chart', e.target.value),
              );
            }}
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
      </div>

      {loading ? (
        <ChartSkeleton />
      ) : error ? (
        <p className="text-red-500 bg-red-500/20 rounded-md w-full h-[200px] flex justify-center items-center">
          {error}
        </p>
      ) : data?.length > 0 ? (
        <div className="space-y-10">
          <div className="flex items-center gap-6">
            <div className="text-center">
              <h3 className="text-2xl md:text-3xl font-semibold">
                {data.length}
              </h3>
              <p className="text-gray-500 font-light text-sm">Events</p>
            </div>
            <div className="text-center">
              <h3 className="text-2xl md:text-3xl font-semibold">
                {data &&
                  !loading &&
                  data
                    ?.map(
                      (item: { attendesCount: number }) => item.attendesCount,
                    )
                    .reduce((a: number, b: number) => a + b, 0)}
              </h3>
              <p className="text-gray-500 font-light text-sm">Attendees</p>
            </div>
          </div>

          <div className="w-full h-[20rem]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                width={500}
                height={400}
                data={data}
                margin={{
                  top: 10,
                  right: 30,
                  left: 0,
                  bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="attendesCount"
                  stroke="#f05537"
                  fill="#f05537"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <p className="text-gray-400 bg-gray-400/20 rounded-md w-full h-[200px] flex justify-center items-center">
          You have no event {chart}
        </p>
      )}
    </div>
  );
}
