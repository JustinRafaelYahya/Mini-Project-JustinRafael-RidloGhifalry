'use client';

import React, { useState } from 'react';
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';
import Link from 'next/link';
import NavItems from './NavItems';

const locations = ['Jakarta', 'Bogor', 'Depok', 'Tangerang', 'Bekasi'];

export const Header = () => {
  const [desc, setDesc] = useState('');
  const [nav, setNav] = useState(false);

  const handleNav = () => {
    setNav(!nav);
  };
  return (
    <div className="w-screen fixed top-[0%] z-10">
      <div className="bg-white border-[1px] border-slate-100">
        <div className="flex justify-between items-center  h-20 m-auto px-4 text-white z-[20px]">
          <div className="flex h-20 flex-1 mr-[-150px] sm:mr-[-300px] md:mr-[-400px] lg:mr-0">
            <Link href="/">
              <h1 className="flex my-6 mx-6 text-xl font-bold text-main-color">
                eventnow
              </h1>
            </Link>
          </div>
          <div className="flex w-full flex-1 relative mr-10 md:mr-16 ml-12">
            <Link href="/search/" className="w-full">
              <button className="text-slate-300 ml-2 m-auto py-2 border border-gray-300 rounded-2xl shadow-sm focus:outline-none focus:ring-2 w-full justify-start lg:justify-center">
                Search for event...
              </button>
            </Link>
          </div>

          <NavItems
            divClassName="hidden lg:flex lg:justify-end text-black lg:flex-1"
            listClassName="hover:text-main-color p-4 text-center float-left"
          />
          <div onClick={handleNav} className="lg:hidden flex justify-end">
            {nav ? (
              <AiOutlineClose
                style={{ color: 'black' }}
                size={30}
                className="my-6 flex-1"
              />
            ) : (
              <AiOutlineMenu
                style={{ color: 'black' }}
                size={30}
                className="my-6 flex-1"
              />
            )}
          </div>
        </div>
        <div
          className={
            nav
              ? 'fixed right-0 top-20 w-[100%] h-full border-r border-r-slate-100 bg-white opacity-90 ease-in-out duration-500 flex justify-end'
              : 'fixed right-[-100%] ease-in-out duration-500'
          }
        >
          <NavItems listClassName="p-4 hover:text-main-color" />
        </div>
      </div>
    </div>
  );
};
