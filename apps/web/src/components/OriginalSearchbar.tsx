import React from 'react';
import { useState, useCallback } from 'react';
import _ from 'lodash';

export default function OriginalSearchbar({
  className,
  onSearch,
}: {
  className: any;
  onSearch?: any;
}) {
  const [search, setSearch] = useState('');

  const debouncedSearch = useCallback(
    _.debounce((query) => {
      onSearch(query);
    }, 1500),
    [],
  );

  const handleInputChange = (e: any) => {
    const newQuery = e.target.value;
    setSearch(newQuery);
    debouncedSearch(newQuery);
  };

  const handleSearchClick = () => {
    debouncedSearch.cancel(); // Cancel any pending debounce calls
    onSearch(search);
  };

  return (
    <div className={className}>
      <input
        className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-main-color focus:border-main-color"
        type="text"
        placeholder="Search by Name"
        value={search}
        onChange={handleInputChange}
      />
      <button
        className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-700 bg-gray-100 border border-gray-300 rounded-r-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-main-color focus:border-main-color"
        onClick={handleSearchClick}
      >
        <svg
          className="h-5 w-5"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M14.795 13.408l5.204 5.204a1 1 0 01-1.414 1.414l-5.204-5.204a7.5 7.5 0 111.414-1.414zM8.5 14A5.5 5.5 0 103 8.5 5.506 5.506 0 008.5 14z"
          />
        </svg>
      </button>
    </div>
  );
}
