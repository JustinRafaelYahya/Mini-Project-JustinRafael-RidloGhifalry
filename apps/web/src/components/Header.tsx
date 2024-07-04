"use client"
import React, { useState } from "react";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
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
        <div className="flex justify-between items-center h-20 m-auto px-4 text-white z-[20px]">
          <div className="flex h-20" >
            <div onClick={handleNav} className="block md:hidden">
              {nav ? (
                <AiOutlineClose style={{ color: "black" }} size={30} className="my-6" />
              ) : (
                <AiOutlineMenu style={{ color: "black" }} size={30} className="my-6 " />
              )}
            </div>
              <Link href="/">
            <h1 className="flex my-6 mx-6 text-xl font-bold text-main-color">
              eventnow
            </h1>
              </Link>
          {/* <NavItems className="hidden md:flex max-w-[1450px]" listStyle="p-4" /> */}
        </div>
              <div>
              <input className="text-black m-auto rounded-lg p-[12px] border-[1px] border-slate-100"
        type="text"
        placeholder="Search for an event..."
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
      />
        <select className="text-black m-auto rounded-lg p-[14px] border-[1px] border-slate-100 mx-4"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      >
        <option value="">Please select a location...</option>
        {locations.map((loc) => (
          <option value={loc} key={loc}>
            {loc}
          </option>
        ))}
      </select>
              </div>
              <div className="hidden md:flex text-black">
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
          </div>
        <div
          className={
            nav
              ? "fixed left-0 top-20 w-[100%] h-full border-r border-r-slate-100 bg-white opacity-90 ease-in-out duration-500 "
              : "fixed left-[-100%] ease-in-out duration-500"
          }
        >
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
          {/* <NavItems
            className="p-4"
            listStyle="p-4 border-b border-slate-100 last-of-type:border-none"
          /> */}
        </div>
      </div>
    </div>
  );
};
