'use client';

import { useState, useEffect } from 'react';
import React from 'react';
import EventCards from './EventCards';
import { CategoryDatas } from '@/datas/CategoryDatas';
import Categories from './Categories';
import TimeFilterItems from './TimeFilterEvents';
import { getAllEvents } from '@/api/events/get-events/route';
import { getEventsByFilter } from '@/api/events/get-events/route';
import LocationSelector from './LocationSelector';
import LocationDatas from '@/datas/LocationDatas';
import { IoIosArrowDropleftCircle } from 'react-icons/io';
import { IoIosArrowDroprightCircle } from 'react-icons/io';
import timeDatas from '@/datas/TimeDatas';
import OriginalSearchbar from './OriginalSearchbar';

const MainPage = () => {
  const [times] = useState(timeDatas);
  const [locations] = useState(LocationDatas);
  const [categories] = useState(CategoryDatas);
  const [events, setEvents] = useState([]);
  const [category, setCategory] = useState('all'); // default category
  const [location, setLocation] = useState('All'); // default location
  const [dateFilter, setDateFilter] = useState('All'); // default date filter
  const [page, setPage] = useState(1); // state for the current page
  const [searchQuery, setSearchQuery] = useState('');
  const [hasMoreEvents, setHasMoreEvents] = useState(true);

  useEffect(() => {
    handleGetEvents(category, location, dateFilter, page, searchQuery);
  }, [category, location, dateFilter, page, searchQuery]);

  const handleGetEvents = async (
    category: string,
    location: string,
    dateFilter: string,
    page: number,
    query: string,
  ) => {
    try {
      let events;
      if (
        category === 'all' &&
        location === 'All' &&
        dateFilter === 'all' &&
        !query
      ) {
        events = await getAllEvents(page);
      } else {
        events = await getEventsByFilter(
          category,
          location,
          dateFilter,
          page,
          query,
        );
      }
      setEvents(events?.data.transformedData);
      // Check if the number of events is less than the expected per page
      setHasMoreEvents(events?.data.transformedData.length >= 9);
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

  const handleDateFilterSelect = (selectedDateFilter: string) => {
    setDateFilter(selectedDateFilter);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handlePreviousPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    setPage(page + 1);
  };

  const getBrowsingText = () => {
    if (
      category === 'all' &&
      location === 'All' &&
      dateFilter === 'All' &&
      !searchQuery
    ) {
      return 'Browsing all events';
    }
    const categoryText =
      category !== 'all'
        ? `${category.toLowerCase().split('_').join(' ')} category`
        : 'all category';
    const locationText = location !== 'All' ? ` located in ${location}` : '';
    const dateText =
      dateFilter !== 'All'
        ? ` for ${dateFilter.split('_').join(' ')} time range`
        : '';
    const searchText = searchQuery
      ? ` starting with "${searchQuery}" keyword`
      : '';
    return `Browsing events in ${categoryText}${locationText}${dateText}${searchText}`;
  };
  return (
    <div
      id="main-page"
      className="py-[4rem] mx-auto px-12 bg-white max-w-[1400px]"
    >
      <Categories
        className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-16 text-center cursor-pointer mx-auto mb-12"
        categories={categories}
        buttonClass="bg-slate-100 opacity-100 shadow-sm shadow-gray-400 rounded-lg hover:scale-110 duration-500 py-4 px-8 mx-[-1rem] "
        onSelectCategory={handleCategorySelect}
      />
      <LocationSelector
        className="m-auto rounded-lg p-2 border-[1px] border-slate-300 mx-4 mb-6"
        locations={locations}
        onSelectLocation={handleLocationSelect}
      />
      <TimeFilterItems
        className="flex justify-start flex-1 mb-12"
        buttonClassName="p-4 hover:border-b hover:border-b-[3px] border-main-color float-left"
        times={times}
        onSelectDateFilter={handleDateFilterSelect}
      />
      <div className="flex justify-center text-black flex-1 my-6">
        <OriginalSearchbar
          className="relative w-5/6 mx-auto"
          onSearch={handleSearch}
        />
      </div>
      <div className="flex justify-start text-black flex-1 my-6">
        <h3 className="p-4 text-2xl font-bold">{getBrowsingText()}</h3>
      </div>
      <div>
        {events?.length === 0 ? (
          <div className="flex items-center justify-center h-[200px]">
            <p className="text-2xl font-bold">
              Oops, Looks like we've come up empty
            </p>
          </div>
        ) : (
          <>
            <div className="flex justify-end">
              {page > 1 && (
                <IoIosArrowDropleftCircle
                  size={50}
                  className="inline my-4 mx-8 cursor-pointer"
                  onClick={handlePreviousPage}
                />
              )}
              {hasMoreEvents && (
                <IoIosArrowDroprightCircle
                  size={50}
                  className="inline my-4 mx-8 cursor-pointer"
                  onClick={handleNextPage}
                />
              )}
            </div>
            <EventCards
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 gap-y-20 max-w-[1375px] mx-auto"
              events={events}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default MainPage;
