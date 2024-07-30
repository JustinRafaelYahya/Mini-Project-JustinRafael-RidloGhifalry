import { LuMic2 } from 'react-icons/lu';
import { FaTheaterMasks } from 'react-icons/fa';
import { PiMountains } from 'react-icons/pi';
import { BsChatSquareHeart } from 'react-icons/bs';
import { IoGameControllerOutline } from 'react-icons/io5';
import { MdOutlineBusinessCenter } from 'react-icons/md';
import { RxDashboard } from 'react-icons/rx';
import { IoFastFoodOutline } from 'react-icons/io5';
export const CategoryDatas = [
  {
    id: 1,
    icon: <RxDashboard size={60} className="m-auto " />,
    title: 'All',
    key: 'all',
  },
  {
    id: 2,
    icon: <LuMic2 size={60} className="m-auto " />,
    title: 'Music',
    key: 'MUSIC',
  },
  {
    id: 3,
    icon: <FaTheaterMasks size={60} className="m-auto" />,
    title: 'Arts',
    key: 'PERFORMING_VISUAL_ARTS',
  },
  {
    id: 4,
    icon: <PiMountains size={60} className="m-auto" />,
    title: 'Holidays',
    key: 'HOLIDAYS',
  },
  {
    id: 5,
    icon: <BsChatSquareHeart size={60} className="m-auto" />,
    title: 'Dating',
    key: 'DATING',
  },
  {
    id: 6,
    icon: <IoGameControllerOutline size={60} className="m-auto" />,
    title: 'Hobbies',
    key: 'HOBBIES',
  },
  {
    id: 7,
    icon: <MdOutlineBusinessCenter size={60} className="m-auto" />,
    title: 'Business',
    key: 'BUSINESS',
  },
  {
    id: 8,
    icon: <IoFastFoodOutline size={60} className="m-auto" />,
    title: 'Cuisines',
    key: 'FOOD_AND_DRINK',
  },
];
