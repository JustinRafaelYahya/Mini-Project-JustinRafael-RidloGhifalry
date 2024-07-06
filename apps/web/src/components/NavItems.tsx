"use client";
import React from "react";
import Link from "next/link";

export default function NavItems({ divClassName, listClassName}) {
  const menuList = [
    ["Make Event", "/makeevent/"],
    ["Log In", "/login/"],
    ["Sign Up", "/signup/"],
  ];
  return (
      <nav className={divClassName}>
          <ul >
          {menuList.map((menu) => (
            <li className={`${listClassName}`} key={menu[0]}>
              <Link
                href={menu[1]}
                alt={menu[0]}
              >
                {menu[0]}
              </Link>
            </li>
          ))}
          </ul>
      </nav>
  );
}
