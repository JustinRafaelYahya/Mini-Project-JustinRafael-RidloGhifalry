import { useState, useEffect } from 'react';
import React from 'react';
import { LuMic2 } from 'react-icons/lu';
import Link from 'next/link';
import EventCards from './EventCards';
import { EventDatas } from '@/datas/EventDatas';
import { CategoryDatas } from '@/datas/CategoryDatas';
import Categories from './Categories';
import TimeFilterItems from './TimeFilterEvents';
import { getAllEvents } from '@/api/event';
import { getEventsByType } from '@/api/event';
import LocationSelector from './LocationSelector';
import LocationDatas from '@/datas/LocationDatas';

const MainPage = () => {
  // const fetchByLocation = (e) => {
  //   setLocation(e.target.value);
  //   console.log(location);
  // };
  const [locations] = useState(LocationDatas);
  const [categories] = useState(CategoryDatas);
  const [events, setEvents] = useState([]);
  const [category, setCategory] = useState('all'); // default category
  const [location, setLocation] = useState('All'); // default location

  useEffect(() => {
    handleGetEvents(category, location);
  }, [category, location]);

  const handleGetEvents = async (category: string, location: string) => {
    try {
      let events;
      if (category === 'all' && location === 'All') {
        events = await getAllEvents();
      } else {
        events = await getEventsByType(category, location);
      }
      setEvents(events.data.transformedData);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleCategorySelect = (selectedCategory: string) => {
    setCategory(selectedCategory);
  };

  const handleLocationSelect = (selectedLocation: string) => {
    setLocation(selectedLocation);
  };
  // const [categories, setCategories] = useState(CategoryDatas);
  // // const [events] = useState(EventDatas);
  // const [events, setEvents] = useState([]);
  // useEffect(() => {
  //   handleGetEvents();
  // }, []);

  // const handleGetEvents = async () => {
  //   const events = await getAllEvents();
  //   console.log(events);

  //   setEvents(events.data.transformedData);

  return (
    <div className="py-[4rem] mx-auto px-12 bg-white max-w-[1400px]">
      {/* <div className="w-full grid grid-cols-2 sm:grid-cols-8 gap-4 text-center py-4 cursor-pointer"> */}
      {/* <div className="bg-slate-100 shadow-md shadow-gray-400 rounded-full hover:scale-110 duration-500 p-4">
         <LuMic2 size={60} className="m-auto"/>
          <p className="my-4">Live Music</p>
        </div> */}
      <Categories
        className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-16 text-center cursor-pointer mx-auto mb-12"
        categories={categories}
        buttonClass="bg-slate-100 opacity-100 shadow-sm shadow-gray-400 rounded-lg hover:scale-110 duration-500 py-4 px-8 mx-[-1rem] "
        onSelectCategory={handleCategorySelect}
      />
      {/* </div> */}
      <h3 className="p-4">Browse events in:</h3>
      <LocationSelector
        className="m-auto rounded-lg p-2 border-[1px] border-slate-300 mx-4 mb-6"
        locations={locations}
        onSelectLocation={handleLocationSelect}
      />
      {/* <select
        className="m-auto rounded-lg p-2 border-[1px] border-slate-300 mx-4 mb-6"
        value={location}
        onChange={(e) => fetchByLocation(e)}
      >
        {locationsData.map((loc) => (
          <option value={loc} key={loc}>
            {loc}
          </option>
        ))}
      </select> */}
      <TimeFilterItems
        divClassName="flex justify-start text-black flex-1 mb-12"
        listClassName="p-4 hover:border-b hover:border-b-[3px] border-main-color float-left"
      />
      {/* <div className="">
                <ul className="p-4">
                  <li>
                    <Link href="/createevent">All</Link>
                  </li>
                  </ul>
                  <ul className="p-4">
                  <li>
                    <Link href="/login">Today</Link>
                  </li>
                  </ul>
                  <ul className="p-4">
                  <li>
                    <Link href="/login">Online</Link>
                  </li>
                  </ul>
                  <ul className="p-4">
                  <li>
                    <Link href="/signup">This Month</Link>
                  </li>
                </ul>
              </div> */}
      <div className="flex justify-start text-black flex-1 my-6">
        <h2 className="p-4 text-2xl font-bold">Browsing Events in </h2>
      </div>
      <div>
        <EventCards
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 gap-y-20 max-w-[1375px] mx-auto"
          events={events}
        />
      </div>
    </div>
  );
};

export default MainPage;
