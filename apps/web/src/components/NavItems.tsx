'use client';

import Link from 'next/link';

export default function NavItems({
  divClassName,
  listClassName,
}: {
  divClassName?: string;
  listClassName: string;
}) {
  const menuList = [
    ['Make Event', '/create-event'],
    ['Log In', '/login'],
    ['Sign Up', '/register'],
  ];
  return (
    <nav className={divClassName}>
      <ul>
        {menuList.map((menu, i) => (
          <li className={`${listClassName}`} key={i}>
            <Link href={menu[1]}>{menu[0]}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
