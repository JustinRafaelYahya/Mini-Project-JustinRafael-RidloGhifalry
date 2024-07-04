"use client"
import React, { useState } from "react";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import { IoSearchOutline } from "react-icons/io5";
import Logo from "/public/logo.png";
import Image from "next/image";
// import NavItems from "./NavItems";
import Link from "next/link";

const locations = ["Jakarta", "Bogor", "Depok", "Tangerang", "Bekasi"]

export const Header = () => {
  const [desc, setDesc] = useState("");
  const [nav, setNav] = useState(false);
  const [location, setLocation] = useState("");

  const handleNav = () => {
    setNav(!nav);
  };
  return (
    <div className="w-screen fixed top-[0%] z-10">
      <div className="bg-white border-[1px] border-slate-100">
        <div className="flex justify-between items-center  h-20 m-auto px-4 text-white z-[20px]">
          <div className="flex h-20 flex-1 mr-[-150px] sm:mr-[-300px] md:mr-[-400px] lg:mr-0" >

              <Link href="/">
            <h1 className="flex my-6 mx-6 text-xl font-bold text-main-color">
              eventnow
            </h1>
              </Link>
          {/* <NavItems className="hidden md:flex max-w-[1450px]" listStyle="p-4" /> */}
        </div>
              <div className="flex w-full flex-1 relative mr-10 md:mr-16 ml-12">
              {/* text-black ml-2 m-auto rounded-xl p-4 border-[1px] border-slate-100 w-full justify-start lg:justify-center */}
              <input className="text-black ml-2 m-auto py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-main-color focus:border-main-color w-full justify-start lg:justify-center"
        type="text"
        placeholder="Search for an event..."
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
      />
    <button className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-700 bg-gray-100 border border-gray-300 rounded-r-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-main-color focus:border-main-color">
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M14.795 13.408l5.204 5.204a1 1 0 01-1.414 1.414l-5.204-5.204a7.5 7.5 0 111.414-1.414zM8.5 14A5.5 5.5 0 103 8.5 5.506 5.506 0 008.5 14z" />
    </svg>
  </button>
        </div>
        {/* <select className="text-black m-auto rounded-lg p-[14px] border-[1px] border-slate-100 mx-4"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      >
        <option value="">Please select a location...</option>
        {locations.map((loc) => (
          <option value={loc} key={loc}>
            {loc}
          </option>
        ))}
      </select> */}
              <div className="hidden lg:flex lg:justify-end text-black lg:flex-1 my-6">
                <ul className="p-4">
                  <li>
                    <Link href="/createevent">Create Events</Link>
                  </li>
                  </ul>
                  <ul className="p-4">
                  <li>
                    <Link href="/login">Log In</Link>
                  </li>
                  </ul>
                  <ul className="p-4">
                  <li>
                    <Link href="/signup">Sign Up</Link>
                  </li>
                </ul>
              </div>
          <div onClick={handleNav} className="lg:hidden flex justify-end">
              {nav ? (
                <AiOutlineClose style={{ color: "black" }} size={30} className="my-6 flex-1" />
              ) : (
                <AiOutlineMenu style={{ color: "black" }} size={30} className="my-6 flex-1" />
              )}
            </div>
          </div>
        <div
          className={
            nav
              ? "fixed right-0 top-20 w-[100%] h-full border-r border-r-slate-100 bg-white opacity-90 ease-in-out duration-500 flex justify-end"
              : "fixed right-[-100%] ease-in-out duration-500"
          }
        >
           <ul >
                  <li className="p-4">
                    <Link href="/createevent">Create Events</Link>
                  </li>
                  {/* </ul>
                  <ul className="p-4"> */}
                  <li className="p-4">
                    <Link href="/login">Log In</Link>
                  </li>
                  {/* </ul> */}
                  {/* <ul className="p-4"> */}
                  <li className="p-4">
                    <Link href="/signup">Sign Up</Link>
                  </li>
                  </ul>
          {/* <NavItems
            className="p-4"
            listStyle="p-4 border-b border-slate-100 last-of-type:border-none"
          /> */}
        </div>
      </div>
    </div>
  );
};
