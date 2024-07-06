'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const data = [
  {
    name: 'Page A',
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: 'Page B',
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: 'Page C',
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: 'Page D',
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: 'Page E',
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: 'Page F',
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
];

export default function Chart() {
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
        <div className="p-2 border border-gray-300 rounded-full px-4 w-full md:w-fit ">
          <select className="select-none w-full">
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
      </div>

      <div className="space-y-10">
        <div className="flex items-center gap-6">
          <div className="text-center">
            <h3 className="text-2xl md:text-3xl font-semibold">3</h3>
            <p className="text-gray-500 font-light text-sm">Events</p>
          </div>
          <div className="text-center">
            <h3 className="text-2xl md:text-3xl font-semibold">4000+</h3>
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
                dataKey="uv"
                stroke="#f05537"
                fill="#f05537"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
