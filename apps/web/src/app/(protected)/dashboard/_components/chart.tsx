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
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [chart, setChart] = useState(searchParams?.get('chart') || 'yearly');
  const [data, setData] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getEventsForChart(chart);
      setData(data);
    } catch {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, [chart]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleChartChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setChart(e.target.value);
      router.push(
        pathname + '?' + new URLSearchParams({ chart: e.target.value }),
      );
    },
    [router, pathname],
  );

  const renderChart = () => {
    if (loading) {
      return <ChartSkeleton />;
    }

    if (error) {
      return <FormError message={error} />;
    }

    if (!data?.length) {
      return (
        <p className="text-gray-400 bg-gray-400/20 rounded-md w-full h-[200px] flex justify-center items-center">
          You have no {chart} event
        </p>
      );
    }

    return (
      <div className="w-full h-[20rem]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            width={500}
            height={400}
            data={data}
            margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="attendes"
              stroke="#f05537"
              fill="#f05537"
            />
            <Area
              type="monotone"
              dataKey="likes"
              stroke="#b8b5e6"
              fill="#b8b5e6"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  };

  return (
    <div className="mt-10 space-y-10">
      <div className="flex flex-col md:flex-row md:justify-between items-center gap-3 md:gap-0">
        <div className="md:space-y-3 w-full">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold capitalize">
            {chart}
          </h1>
          <p className="text-gray-500 text-sm md:text-base">
            Your {chart} starts
          </p>
        </div>
        <div className="p-2 border border-gray-300 rounded-full px-4 w-full md:w-[150px]">
          <select
            className="select-none w-full border-none outline-none cursor-pointer"
            value={chart}
            onChange={handleChartChange}
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
      </div>

      <div className="space-y-10">
        <div className="flex items-center gap-6">
          <div className="text-center">
            <h3 className="text-2xl md:text-3xl font-semibold">
              {data?.length}
            </h3>
            <p className="text-gray-500 font-light text-sm">Events</p>
          </div>
          <div className="text-center">
            <h3 className="text-2xl md:text-3xl font-semibold">
              {data?.reduce(
                (acc: number, item: { attendes: number }) =>
                  acc + (item.attendes || 0),
                0,
              )}
            </h3>
            <p className="text-gray-500 font-light text-sm">Attendees</p>
          </div>
        </div>

        {renderChart()}
      </div>
    </div>
  );
}
