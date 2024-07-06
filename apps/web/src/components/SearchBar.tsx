import React from 'react'
import OriginalSearchbar from './OriginalSearchbar'
const locations = ["Jakarta", "Bogor", "Depok", "Tangerang", "Bekasi"]
import { useState } from 'react'
import { RxCross2 } from "react-icons/rx";
import Link from 'next/link';

const SearchBar = () => {
const [location, setLocation] = useState("");
const fetchByLocation = (e) =>
    {setLocation(e.target.value);
        console.log(location)
    }
  return (
    <>
    <Link href="/" ><RxCross2 className='float-right mt-24 mx-auto mr-8 rounded-full hover:bg-slate-500 p-2' size={50}/></Link>
    <div className="py-[4rem] mx-auto px-12 bg-white max-w-[1400px] h-screen">
    <h2 className="flex justify-center text-3xl font-bold md:px-8 mt-20 mb-8">
          Search For Event
        </h2>
        <select className=" m-auto rounded-lg p-2 border-[1px] border-slate-300 flex mx-auto mb-6"
        value={location}
        onChange={(e) => fetchByLocation(e)}
      >
        <option value="">Please select a location...</option>
        {locations.map((loc) => (
          <option value={loc} key={loc}>
            {loc}
          </option>
        ))}
      </select>
        <OriginalSearchbar className="flex w-full relative" />
    </div>
    </>
  )
}

export default SearchBar