import { LuMic2 } from "react-icons/lu";
import { FaTheaterMasks } from "react-icons/fa";
import { PiMountains } from "react-icons/pi";
import { BsChatSquareHeart } from "react-icons/bs";
import { IoGameControllerOutline } from "react-icons/io5";
import { MdOutlineBusinessCenter } from "react-icons/md";
export const CategoryDatas = [
    {
      id: 1,
      icon:  <LuMic2 size={60} className="m-auto "/>,
title: "MUSIC",
    },
    {
        id: 2,
        icon:  <FaTheaterMasks size={60} className="m-auto"/>,
  title: "ARTS",
      },
      {
        id: 3,
        icon:  <PiMountains size={60} className="m-auto"/>,
  title: "HOLIDAY",
      },
      {
        id: 4,
        icon:  <BsChatSquareHeart size={60} className="m-auto"/>,
  title: "DATING",
      },
      {
        id: 5,
        icon:  <IoGameControllerOutline size={60} className="m-auto"/>,
  title: "HOBBIES",
      },
      {
        id: 6,
        icon:  <MdOutlineBusinessCenter size={60} className="m-auto"/>,
  title: "BUSINESS",
      },
  ];
  