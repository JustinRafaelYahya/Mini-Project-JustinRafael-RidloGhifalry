import React from 'react'
import { useState } from 'react';

export default function OriginalSearchbar() {
    const [desc, setDesc] = useState("");
  return (
    <div><input className="text-black ml-2 m-auto py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-main-color focus:border-main-color w-full justify-start lg:justify-center"
    type="text"
    placeholder="Search for an event..."
    value={desc}
    onChange={(e) => setDesc(e.target.value)}
  />
      <button className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-700 bg-gray-100 border border-gray-300 rounded-r-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-main-color focus:border-main-color">
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M14.795 13.408l5.204 5.204a1 1 0 01-1.414 1.414l-5.204-5.204a7.5 7.5 0 111.414-1.414zM8.5 14A5.5 5.5 0 103 8.5 5.506 5.506 0 008.5 14z" />
    </svg>
  </button></div>
  )
}
