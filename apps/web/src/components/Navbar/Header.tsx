'use client';

import { useState } from 'react';
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';
import Link from 'next/link';
import NavItems from './NavItems';
import { IoIosSearch } from 'react-icons/io';

export const Header = () => {
  const [nav, setNav] = useState<boolean>(false);

  return (
    <div className="w-screen fixed top-[0%] z-10">
      <div className="bg-white border-[1px] border-slate-100">
        <div className="flex justify-between items-center  h-20 m-auto px-4 text-white z-[20px] max-w-7xl container mx-auto">
          <div className="flex h-20 flex-1 mr-[-150px] sm:mr-[-300px] md:mr-[-400px] lg:mr-0">
            <h1 className="flex my-6 mx-6 text-xl font-bold text-main-color">
              <Link href="/">eventnow</Link>
            </h1>
          </div>
          <div className="flex w-full flex-1 relative mr-10 md:mr-16 ml-12"></div>
          <div className="lg:flex-1 lg:flex justify-end pr-8 hidden text-black">
            <NavItems />
          </div>
          <div
            onClick={() => setNav(!nav)}
            className="lg:hidden flex justify-end z-50 cursor-pointer"
          >
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
              ? 'fixed right-0 top-0 w-[100%] h-1/2 lg:hidden border-r border-r-slate-100 bg-white ease-in-out duration-500 flex items-center justify-center'
              : 'fixed right-[-100%] ease-in-out duration-500'
          }
        >
          <NavItems />
        </div>
      </div>
    </div>
  );
};
