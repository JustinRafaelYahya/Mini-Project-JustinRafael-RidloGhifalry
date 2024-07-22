import React from 'react';

interface LocationDropDownProps {
  className: string;
  locations: string[];
  register: any;
  name: string;
}
const LocationDropDown: React.FC<LocationDropDownProps> = ({
  className,
  locations,
  register,
  name,
}) => {
  return (
    <select className={className} {...register(name)}>
      {locations.map((location: string, index: number) => (
        <option key={index} value={location}>
          {location}
        </option>
      ))}
    </select>
  );
};

export default LocationDropDown;
