'use client';

import EventList from './event-list';

export default function LifeTime() {
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
          <select className="select-none w-full">
            <option value="latest">Latest</option>
            <option value="newest">Newest</option>
            <option value="popular">Most visited</option>
            <option value="least">Least visited</option>
          </select>
        </div>
      </div>

      <div>
        <EventList />
      </div>
    </div>
  );
}
