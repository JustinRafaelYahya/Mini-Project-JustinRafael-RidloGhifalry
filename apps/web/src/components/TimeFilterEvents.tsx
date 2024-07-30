'use client';
import React from 'react';

const TimeFilterItems = ({
  className,
  buttonClassName,
  times,
  onSelectDateFilter,
}: {
  className: string;
  times: any;
  buttonClassName: string;
  onSelectDateFilter: (key: string) => void;
}) => {
  return (
    <nav className={className}>
      {times.map((time: any) => (
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

// 'use client';
// import React from 'react';

// export default function TimeFilterItems({ className, buttonClassName, times }) {
//   return (
//     <nav className={className}>
//       <ul>
//         {times.map((time, index) => (
//           <li className={buttonClassName} key={index} value={time}>
//             {time.key}
//           </li>
//         ))}
//       </ul>
//     </nav>
//   );
// }
