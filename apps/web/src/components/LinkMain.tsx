import React from 'react';

const MainLink = ({
  children,
  className,
}: {
  children: string;
  className: string;
}) => {
  return (
    <button
      className={`${className} text-main-color font-semibold hover:border-b-2 border-main-color`}
    >
      {children}
    </button>
  );
};

export default MainLink;
