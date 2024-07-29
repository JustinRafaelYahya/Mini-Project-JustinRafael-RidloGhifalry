'use client';
import React from 'react';

const TimeFilterItems = ({
  className,
  buttonClassName,
  times,
  onSelectDateFilter,
}: {
  className: string;
  buttonClassName: string;
  onSelectDateFilter: (key: string) => void;
}) => {
  return (
    <nav className={className}>
      {times.map((time: string) => (
        <button
          className={buttonClassName}
          key={time.key}
          onClick={() => onSelectDateFilter(time.key)}
        >
          {time.value}
        </button>
      ))}
    </nav>
  );
};

export default TimeFilterItems;
