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
    title: 'ALL',
    key: 'all',
  },
  {
    id: 2,
    icon: <LuMic2 size={60} className="m-auto " />,
    title: 'MUSIC',
    key: 'MUSIC',
  },
  {
    id: 3,
    icon: <FaTheaterMasks size={60} className="m-auto" />,
    title: 'ARTS',
    key: 'PERFORMING_VISUAL_ARTS',
  },
  {
    id: 4,
    icon: <PiMountains size={60} className="m-auto" />,
    title: 'HOLIDAYS',
    key: 'HOLIDAYS',
  },
  {
    id: 5,
    icon: <BsChatSquareHeart size={60} className="m-auto" />,
    title: 'DATING',
    key: 'DATING',
  },
  {
    id: 6,
    icon: <IoGameControllerOutline size={60} className="m-auto" />,
    title: 'HOBBIES',
    key: 'HOBBIES',
  },
  {
    id: 7,
    icon: <MdOutlineBusinessCenter size={60} className="m-auto" />,
    title: 'BUSINESS',
    key: 'BUSINESS',
  },
  {
    id: 8,
    icon: <IoFastFoodOutline size={60} className="m-auto" />,
    title: 'CUISINES',
    key: 'FOOD_AND_DRINK',
  },
];
