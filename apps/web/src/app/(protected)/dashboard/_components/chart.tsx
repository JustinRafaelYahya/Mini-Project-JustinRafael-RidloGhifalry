'use client';

import { useEffect, useState } from 'react';
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

export default function Chart() {
  const [data, setData] = useState([]);
  const [period, setPeriod] = useState<string>('yearly');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getEventsForChart(period);
        setData(data.data);
      } catch (err) {
        setError('Failed to fetch data');
      }
      setLoading(false);
    };

    fetchData();
  }, [period, setData, setError, setLoading]);

  return (
    <div className="mt-10 space-y-10">
      <div className="flex flex-col md:flex-row md:justify-between items-center gap-3 md:gap-0">
        <div className="md:space-y-3 w-full">
          <h1 className="text-3xl md:text-4xl lg:text-6xl font-semibold">
            Monthly
          </h1>
          <p className="text-gray-500 text-sm md:text-base">
            Your monthly starts
          </p>
        </div>
        <div className="p-2 border border-gray-300 rounded-full px-4 w-full md:w-fit">
          <select
            className="select-none w-full"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
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
                  dataKey="attendees"
                  stroke="#f05537"
                  fill="#f05537"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
