import React from 'react';

const LocationSelector = ({
  className,
  locations,
  onSelectLocation,
}: {
  className: string;
  locations: any;
  onSelectLocation: (key: string) => void;
}) => {
  return (
    <select
      className={className}
      onChange={(e) => onSelectLocation(e.target.value)}
    >
      {locations.map((location: string, index: number) => (
        <option key={index} value={location}>
          {location}
        </option>
      ))}
    </select>
  );
};

export default LocationSelector;
